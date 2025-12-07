import { functions, httpsCallable } from '../app/firebase.config';

/**
 * AI Provider Factory
 * Uses Firebase Cloud Functions to securely call AI APIs
 * API keys are stored server-side and never exposed to clients
 */

// Provider types
export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  OPENAI: 'openai'
};

// Configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

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
    errorString.includes('resource-exhausted') ||
    errorMessage.includes('429') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('quota')
  );
};

/**
 * AI Provider Manager
 * Calls Firebase Cloud Functions for secure AI generation
 */
class AIProviderManager {
  constructor() {
    console.log('=== AI Provider Manager Initialization (Cloud Functions) ===');
    this.generateCurriculum = httpsCallable(functions, 'generateCurriculum');
    this.defaultProvider = process.env.REACT_APP_DEFAULT_AI_PROVIDER || AI_PROVIDERS.GEMINI;
    this.fallbackEnabled = process.env.REACT_APP_ENABLE_AI_FALLBACK !== 'false';
    console.log('Default provider:', this.defaultProvider);
    console.log('Fallback enabled:', this.fallbackEnabled);
    console.log('Using secure Cloud Functions for AI calls');
    console.log('==========================================');
  }

  /**
   * Get fallback provider
   */
  getFallbackProvider(currentProvider) {
    return currentProvider === AI_PROVIDERS.GEMINI
      ? AI_PROVIDERS.OPENAI
      : AI_PROVIDERS.GEMINI;
  }

  /**
   * Generate content via Cloud Function with retry and fallback logic
   * @param {string} prompt - The prompt to generate content for
   * @param {string} preferredProvider - Preferred AI provider (openai or gemini)
   * @param {object} metadata - Additional metadata for logging (optional)
   */
  async generate(prompt, preferredProvider = null, metadata = null) {
    const provider = preferredProvider || this.defaultProvider;
    let lastError = null;
    let retryDelay = INITIAL_RETRY_DELAY;

    // Try primary provider with retries
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempting generation with ${provider} via Cloud Function (attempt ${attempt}/${MAX_RETRIES})...`);

        const result = await this.generateCurriculum({
          prompt,
          provider,
          model: provider === AI_PROVIDERS.OPENAI
            ? (process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o-mini')
            : 'gemini-2.0-flash-exp',
          metadata // Pass metadata to Cloud Function
        });

        console.log(`Generation successful with ${provider}`);

        return {
          content: result.data.content,
          provider: result.data.provider,
          providerName: provider === AI_PROVIDERS.GEMINI ? 'Gemini' : 'OpenAI',
          usedFallback: false,
          tokensUsed: result.data.tokensUsed
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
          await sleep(500);
        }
      }
    }

    // If primary provider failed and fallback is enabled, try fallback provider
    if (this.fallbackEnabled) {
      const fallbackProvider = this.getFallbackProvider(provider);
      console.log(`Primary provider failed, attempting fallback to ${fallbackProvider}...`);

      try {
        const result = await this.generateCurriculum({
          prompt,
          provider: fallbackProvider,
          model: fallbackProvider === AI_PROVIDERS.OPENAI
            ? (process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o-mini')
            : 'gemini-2.0-flash-exp',
          metadata // Pass metadata to Cloud Function
        });

        return {
          content: result.data.content,
          provider: result.data.provider,
          providerName: fallbackProvider === AI_PROVIDERS.GEMINI ? 'Gemini' : 'OpenAI',
          usedFallback: true,
          fallbackReason: isRateLimitError(lastError) ? 'rate_limit' : 'error',
          tokensUsed: result.data.tokensUsed
        };
      } catch (fallbackError) {
        console.error(`Fallback provider ${fallbackProvider} also failed:`, fallbackError.message);
        throw new Error(
          `Both primary provider (${provider}) and fallback (${fallbackProvider}) failed. ` +
          `Last error: ${fallbackError.message}`
        );
      }
    }

    // All attempts failed
    throw new Error(
      `Failed to generate content with ${provider} after ${MAX_RETRIES} attempts. ` +
      `Error: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Check if a specific provider is available (always true with Cloud Functions)
   */
  isProviderAvailable(provider) {
    return [AI_PROVIDERS.GEMINI, AI_PROVIDERS.OPENAI].includes(provider);
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders() {
    return [AI_PROVIDERS.GEMINI, AI_PROVIDERS.OPENAI];
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
