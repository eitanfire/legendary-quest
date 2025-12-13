const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {defineSecret} = require('firebase-functions/params');
const {logger} = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const {GoogleGenerativeAI} = require('@google/generative-ai');
const crypto = require('crypto');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Get Firestore instance (lazy initialization)
const getDb = () => admin.firestore();

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
        prompt: prompt, // Store full prompt for analysis
        topicHash: hashPrompt(prompt), // Keep hash for deduplication
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
          await getDb().collection('promptLogs').add({
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
          await getDb().collection('promptLogs').add({
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
 * Get analytics data (admin only)
 */
exports.getAnalytics = onCall(
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
  },
  async (request) => {
    // Require authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to access analytics');
    }

    // TODO: Add admin check here
    // For now, any authenticated user can access analytics
    // In production, check if user has admin role:
    // const userDoc = await admin.firestore().collection('users').doc(request.auth.uid).get();
    // if (!userDoc.exists || !userDoc.data().isAdmin) {
    //   throw new HttpsError('permission-denied', 'User must be an admin to access analytics');
    // }

    const {timeRange = '7d'} = request.data;

    // Calculate time boundaries
    const now = new Date();
    let startTime;

    switch (timeRange) {
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    try {
      // Query Firestore for logs within time range
      const logsSnapshot = await getDb()
        .collection('promptLogs')
        .where('timestamp', '>=', startTime.toISOString())
        .orderBy('timestamp', 'desc')
        .get();

      const logs = logsSnapshot.docs.map(doc => doc.data());

      // Aggregate data
      const analytics = {
        totalRequests: logs.length,
        successfulRequests: logs.filter(log => log.success).length,
        failedRequests: logs.filter(log => !log.success).length,
        successRate: logs.length > 0 ? (logs.filter(log => log.success).length / logs.length) * 100 : 0,

        // Provider breakdown
        providers: {
          openai: logs.filter(log => log.provider === 'openai').length,
          gemini: logs.filter(log => log.provider === 'gemini').length,
        },

        // Model breakdown
        models: logs.reduce((acc, log) => {
          acc[log.model] = (acc[log.model] || 0) + 1;
          return acc;
        }, {}),

        // Average metrics
        avgGenerationTime: logs.length > 0
          ? logs.reduce((sum, log) => sum + (log.generationTime || 0), 0) / logs.length
          : 0,

        totalTokens: logs.reduce((sum, log) => {
          return sum + (log.tokensUsed?.total || 0);
        }, 0),

        avgTokensPerRequest: logs.length > 0
          ? logs.reduce((sum, log) => sum + (log.tokensUsed?.total || 0), 0) / logs.length
          : 0,

        // Error breakdown
        errors: logs
          .filter(log => !log.success)
          .reduce((acc, log) => {
            const errorType = log.errorType || 'unknown';
            acc[errorType] = (acc[errorType] || 0) + 1;
            return acc;
          }, {}),

        // Timeline data (group by day)
        timeline: logs.reduce((acc, log) => {
          const date = log.timestamp.split('T')[0]; // Get date part only
          if (!acc[date]) {
            acc[date] = {requests: 0, successes: 0, failures: 0, totalTime: 0, totalTokens: 0};
          }
          acc[date].requests++;
          if (log.success) {
            acc[date].successes++;
          } else {
            acc[date].failures++;
          }
          acc[date].totalTime += log.generationTime || 0;
          acc[date].totalTokens += log.tokensUsed?.total || 0;
          return acc;
        }, {}),

        // Recent activity (last 20 requests)
        recentActivity: logs.slice(0, 20).map(log => ({
          timestamp: log.timestamp,
          prompt: log.prompt || log.topic || 'N/A', // Support both new (prompt) and old (topic) field names
          provider: log.provider,
          model: log.model,
          success: log.success,
          generationTime: log.generationTime,
          tokensUsed: log.tokensUsed?.total || 0,
        })),

        // Token breakdown by provider
        tokensByProvider: {
          openai: logs
            .filter(log => log.provider === 'openai')
            .reduce((sum, log) => sum + (log.tokensUsed?.total || 0), 0),
          gemini: logs
            .filter(log => log.provider === 'gemini')
            .reduce((sum, log) => sum + (log.tokensUsed?.total || 0), 0),
        },
      };

      return analytics;
    } catch (error) {
      logger.error('Error fetching analytics', {error: error.message});
      throw new HttpsError('internal', 'Failed to fetch analytics data');
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
