import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import OpenAI from 'openai';

/**
 * AI Provider Factory
 * Handles multiple AI providers (Gemini, OpenAI) with automatic fallback on rate limits
 */

// Configuration
const GEMINI_MODEL = "gemini-2.0-flash-exp";
const OPENAI_MODEL = process.env.REACT_APP_OPENAI_MODEL || "gpt-4o-mini";
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Provider types
export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  OPENAI: 'openai'
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if error is a rate limit error
 */
const isRateLimitError = (error) => {
  if (!error) return false;

  const errorString = error.toString().toLowerCase();
  const errorMessage = error.message?.toLowerCase() || '';

  return (
    errorString.includes('429') ||
    errorString.includes('rate limit') ||
    errorString.includes('quota') ||
    errorMessage.includes('429') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('quota')
  );
};

/**
 * Gemini AI Provider
 */
class GeminiProvider {
  constructor() {
    const apiKey = process.env.REACT_APP_GEMINI_KEY;

    // Debug logging
    console.log('Gemini Provider Initialization:');
    console.log('- API Key exists:', !!apiKey);
    console.log('- API Key length:', apiKey?.length || 0);
    console.log('- API Key prefix:', apiKey?.substring(0, 8) || 'none');

    if (!apiKey) {
      throw new Error("Gemini API key not found");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });

    this.generationConfig = {
      temperature: 0.5,
      topK: 64,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    this.safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ];
  }

  async generate(prompt) {
    const result = await this.model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: this.generationConfig,
      safetySettings: this.safetySettings,
    });

    const response = result.response;
    return response.text();
  }

  getName() {
    return 'Gemini';
  }
}

/**
 * OpenAI Provider
 */
class OpenAIProvider {
  constructor() {
    const apiKey = process.env.REACT_APP_OPENAI_KEY;

    // Debug logging
    console.log('OpenAI Provider Initialization:');
    console.log('- API Key exists:', !!apiKey);
    console.log('- API Key length:', apiKey?.length || 0);
    console.log('- API Key prefix:', apiKey?.substring(0, 8) || 'none');
    console.log('- All env vars:', Object.keys(process.env).filter(k => k.startsWith('REACT_APP_')));

    if (!apiKey) {
      throw new Error("OpenAI API key not found in environment variables");
    }

    if (!apiKey.startsWith('sk-')) {
      console.warn('Warning: OpenAI API key does not start with "sk-" - may be invalid');
    }

    try {
      this.client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });
      console.log('OpenAI client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      throw error;
    }
  }

  async generate(prompt) {
    try {
      console.log('OpenAI: Starting generation request...');
      console.log('OpenAI: Model:', OPENAI_MODEL);

      const completion = await this.client.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator specializing in creating engaging, standards-aligned curriculum materials for K-12 and college educators."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 8192,
      });

      console.log('OpenAI: Generation successful');
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Generation Error:');
      console.error('- Error type:', error.constructor.name);
      console.error('- Error message:', error.message);
      console.error('- Error code:', error.code);
      console.error('- Error status:', error.status);
      console.error('- Full error:', error);
      throw error;
    }
  }

  getName() {
    return 'OpenAI';
  }
}

/**
 * AI Provider Manager
 * Handles provider selection, retries, and fallback logic
 */
class AIProviderManager {
  constructor() {
    console.log('=== AI Provider Manager Initialization ===');
    console.log('Environment check:');
    console.log('- Node ENV:', process.env.NODE_ENV);
    console.log('- Default Provider:', process.env.REACT_APP_DEFAULT_AI_PROVIDER);
    console.log('- Fallback Enabled:', process.env.REACT_APP_ENABLE_AI_FALLBACK);
    console.log('- OpenAI Model:', process.env.REACT_APP_OPENAI_MODEL);

    this.providers = {};
    this.fallbackEnabled = process.env.REACT_APP_ENABLE_AI_FALLBACK !== 'false';

    // Initialize providers
    try {
      this.providers[AI_PROVIDERS.GEMINI] = new GeminiProvider();
      console.log('✓ Gemini provider initialized successfully');
    } catch (error) {
      console.warn('✗ Gemini provider not available:', error.message);
    }

    try {
      this.providers[AI_PROVIDERS.OPENAI] = new OpenAIProvider();
      console.log('✓ OpenAI provider initialized successfully');
    } catch (error) {
      console.warn('✗ OpenAI provider not available:', error.message);
    }

    // Set default provider
    this.defaultProvider = process.env.REACT_APP_DEFAULT_AI_PROVIDER || AI_PROVIDERS.GEMINI;

    console.log('Available providers:', Object.keys(this.providers));
    console.log('Default provider:', this.defaultProvider);
    console.log('==========================================');

    if (Object.keys(this.providers).length === 0) {
      throw new Error('No AI providers configured. Please check your API keys.');
    }
  }

  /**
   * Get fallback provider
   */
  getFallbackProvider(currentProvider) {
    const availableProviders = Object.keys(this.providers);
    const fallbacks = availableProviders.filter(p => p !== currentProvider);
    return fallbacks.length > 0 ? fallbacks[0] : null;
  }

  /**
   * Generate content with retry and fallback logic
   */
  async generate(prompt, preferredProvider = null) {
    const provider = preferredProvider || this.defaultProvider;

    if (!this.providers[provider]) {
      throw new Error(`Provider "${provider}" is not available. Please check your configuration.`);
    }

    let lastError = null;
    let retryDelay = INITIAL_RETRY_DELAY;

    // Try primary provider with retries
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempting generation with ${provider} (attempt ${attempt}/${MAX_RETRIES})...`);
        const result = await this.providers[provider].generate(prompt);

        return {
          content: result,
          provider: provider,
          providerName: this.providers[provider].getName(),
          usedFallback: false
        };
      } catch (error) {
        console.error(`Error with ${provider} (attempt ${attempt}):`, error.message);
        lastError = error;

        // If it's a rate limit error and we have retries left, wait and retry
        if (isRateLimitError(error) && attempt < MAX_RETRIES) {
          console.log(`Rate limit detected, waiting ${retryDelay}ms before retry...`);
          await sleep(retryDelay);
          retryDelay *= 2; // Exponential backoff
        } else if (attempt < MAX_RETRIES) {
          // For other errors, shorter delay
          await sleep(500);
        }
      }
    }

    // If primary provider failed and fallback is enabled, try fallback provider
    if (this.fallbackEnabled) {
      const fallbackProvider = this.getFallbackProvider(provider);

      if (fallbackProvider && this.providers[fallbackProvider]) {
        console.log(`Primary provider failed, attempting fallback to ${fallbackProvider}...`);

        try {
          const result = await this.providers[fallbackProvider].generate(prompt);

          return {
            content: result,
            provider: fallbackProvider,
            providerName: this.providers[fallbackProvider].getName(),
            usedFallback: true,
            fallbackReason: isRateLimitError(lastError) ? 'rate_limit' : 'error'
          };
        } catch (fallbackError) {
          console.error(`Fallback provider ${fallbackProvider} also failed:`, fallbackError.message);
          throw new Error(
            `Both primary provider (${provider}) and fallback (${fallbackProvider}) failed. ` +
            `Last error: ${fallbackError.message}`
          );
        }
      }
    }

    // All attempts failed
    throw new Error(
      `Failed to generate content with ${provider} after ${MAX_RETRIES} attempts. ` +
      `Error: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Check if a specific provider is available
   */
  isProviderAvailable(provider) {
    return !!this.providers[provider];
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders() {
    return Object.keys(this.providers);
  }
}

// Export singleton instance
let managerInstance = null;

export const getAIProviderManager = () => {
  if (!managerInstance) {
    managerInstance = new AIProviderManager();
  }
  return managerInstance;
};

export default getAIProviderManager;
