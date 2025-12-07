const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {defineSecret} = require('firebase-functions/params');
const {logger} = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const {GoogleGenerativeAI} = require('@google/generative-ai');
const crypto = require('crypto');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Firestore
const db = admin.firestore();

// Define secrets - these are set via Firebase CLI: firebase functions:secrets:set
const openaiKey = defineSecret('OPENAI_KEY');
const geminiKey = defineSecret('GEMINI_KEY');

/**
 * Hash prompt for deduplication without storing exact text
 */
function hashPrompt(prompt) {
  return crypto.createHash('sha256').update(prompt).digest('hex').substring(0, 16);
}

/**
 * Secure Cloud Function to generate curriculum content
 * API keys are stored server-side and never exposed to clients
 */
exports.generateCurriculum = onCall(
  {
    // Enable CORS for Firebase hosting, custom domain, and local development
    cors: [
      /firebase\.app$/,
      /web\.app$/,
      /teachleague\.com$/,
      /localhost/,
      "https://teach-league.web.app",
      "https://teach-league.firebaseapp.com",
      "https://teachleague.com",
      "https://www.teachleague.com",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    // Specify secrets needed by this function
    secrets: [openaiKey, geminiKey],
  },
  async (request) => {
    const startTime = Date.now();

    try {
      // Get parameters from client
      const {prompt, provider, systemPrompt, model, metadata} = request.data;

      // Validate input
      if (!prompt || typeof prompt !== 'string') {
        throw new HttpsError('invalid-argument', 'Prompt is required and must be a string');
      }

      if (!provider || !['openai', 'gemini'].includes(provider)) {
        throw new HttpsError('invalid-argument', 'Provider must be either "openai" or "gemini"');
      }

      // Build log entry (Phase 1: Cloud Logging)
      const logEntry = {
        timestamp: new Date().toISOString(),
        topic: prompt.substring(0, 500), // Truncate for safety
        topicHash: hashPrompt(prompt),
        criteria: metadata?.criteria || {},
        provider,
        model: model || (provider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash'),
        userId: request.auth?.uid || null,
        sessionId: metadata?.sessionId || 'unknown',
        coursesUsed: metadata?.coursesUsed || [],
        resourceCount: metadata?.resourceCount || 0,
      };

      console.log(`Generating curriculum with ${provider} for user:`, request.auth?.uid || 'anonymous');

      let content;
      let tokensUsed = null;

      if (provider === 'openai') {
        // Initialize OpenAI with server-side API key
        const openai = new OpenAI({
          apiKey: openaiKey.value(),
        });

        const messages = [];
        if (systemPrompt) {
          messages.push({role: 'system', content: systemPrompt});
        }
        messages.push({role: 'user', content: prompt});

        const response = await openai.chat.completions.create({
          model: model || 'gpt-4o-mini',
          messages: messages,
          temperature: 0.7,
        });

        content = response.choices[0].message.content;
        tokensUsed = {
          prompt: response.usage.prompt_tokens,
          completion: response.usage.completion_tokens,
          total: response.usage.total_tokens,
        };
      } else if (provider === 'gemini') {
        // Initialize Gemini with server-side API key
        const genAI = new GoogleGenerativeAI(geminiKey.value());
        const geminiModel = genAI.getGenerativeModel({
          model: model || 'gemini-1.5-flash',
        });

        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

        const result = await geminiModel.generateContent(fullPrompt);
        content = result.response.text();

        // Gemini doesn't always provide token counts
        if (result.response.usageMetadata) {
          tokensUsed = {
            prompt: result.response.usageMetadata.promptTokenCount,
            completion: result.response.usageMetadata.candidatesTokenCount,
            total: result.response.usageMetadata.totalTokenCount,
          };
        }
      }

      // Calculate generation time
      const generationTime = (Date.now() - startTime) / 1000; // Convert to seconds

      // Log success (Phase 1: Cloud Logging)
      logEntry.success = true;
      logEntry.tokensUsed = tokensUsed;
      logEntry.generationTime = generationTime;

      logger.info('Curriculum generated successfully', logEntry);

      // Log to Firestore if user consented (Phase 2: Analytics)
      if (metadata?.analyticsConsent === true) {
        try {
          await db.collection('promptLogs').add({
            ...logEntry,
            expireAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days TTL
          });
        } catch (firestoreError) {
          // Don't fail request if Firestore logging fails
          logger.error('Failed to log to Firestore', {error: firestoreError.message});
        }
      }

      return {
        content,
        provider,
        tokensUsed,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating curriculum:', error);

      // Calculate generation time even for errors
      const generationTime = (Date.now() - startTime) / 1000;

      // Determine error type
      let errorType = 'unknown';
      if (error.status === 429 || error.message?.includes('rate limit')) {
        errorType = 'rate_limit';
      } else if (error.message?.includes('quota')) {
        errorType = 'quota_exceeded';
      } else if (error.code === 'invalid-argument') {
        errorType = 'validation_error';
      }

      // Log error (Phase 1: Cloud Logging)
      const errorLogEntry = {
        ...logEntry,
        success: false,
        errorType,
        errorMessage: error.message?.substring(0, 200),
        generationTime,
      };

      logger.error('Curriculum generation failed', errorLogEntry);

      // Log to Firestore if user consented (Phase 2: Analytics)
      if (metadata?.analyticsConsent === true) {
        try {
          await db.collection('promptLogs').add({
            ...errorLogEntry,
            expireAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days TTL
          });
        } catch (firestoreError) {
          logger.error('Failed to log error to Firestore', {error: firestoreError.message});
        }
      }

      // Check for rate limit errors
      if (error.status === 429 || error.message?.includes('rate limit')) {
        throw new HttpsError('resource-exhausted', `Rate limit exceeded for ${request.data.provider}. Please try again later.`);
      }

      // Check for quota errors
      if (error.message?.includes('quota')) {
        throw new HttpsError('resource-exhausted', 'API quota exceeded. Please try again later.');
      }

      // Generic error
      throw new HttpsError('internal', `Failed to generate curriculum: ${error.message}`);
    }
  }
);

/**
 * Health check function
 */
exports.healthCheck = onCall(
  {
    cors: [
      /firebase\.app$/,
      /web\.app$/,
      /teachleague\.com$/,
      /localhost/,
      "https://teach-league.web.app",
      "https://teach-league.firebaseapp.com",
      "https://teachleague.com",
      "https://www.teachleague.com",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    secrets: [openaiKey, geminiKey],
  },
  async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      providers: {
        openai: !!openaiKey.value(),
        gemini: !!geminiKey.value(),
      },
    };
  }
);
