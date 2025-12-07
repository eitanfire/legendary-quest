/**
 * Session ID utility for analytics tracking
 * Generates a unique session ID that persists for the browser session
 */

const SESSION_ID_KEY = 'teachleague_session_id';

/**
 * Generate a random session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create session ID
 * Session ID persists in sessionStorage (cleared when browser tab is closed)
 */
export function getSessionId() {
  // Try to get existing session ID
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  // If no session ID exists, create one
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Clear session ID (for testing or manual reset)
 */
export function clearSessionId() {
  sessionStorage.removeItem(SESSION_ID_KEY);
}
