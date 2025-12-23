import { functions, httpsCallable } from '../app/firebase.config';

/**
 * Set up the TeachLeague folder in user's Google Drive
 * Finds existing folder or creates a new one
 *
 * @param {string} accessToken - User's Google OAuth access token
 * @param {string} folderName - Optional custom folder name (default: "TeachLeague Lesson Materials")
 * @returns {Promise<{folderId: string, folderName: string, folderLink: string, existed: boolean}>}
 */
export async function setupDriveFolder(accessToken, folderName = 'TeachLeague Lesson Materials') {
  try {
    const setupFolder = httpsCallable(functions, 'setupDriveFolder');
    const result = await setupFolder({
      accessToken,
      folderName,
    });

    return result.data;
  } catch (error) {
    console.error('Error setting up Drive folder:', error);
    throw new Error(error.message || 'Failed to setup Drive folder');
  }
}

/**
 * Search user's Google Drive for educational resources
 *
 * @param {string} accessToken - User's Google OAuth access token
 * @param {string} query - Search query (e.g., lesson topic)
 * @param {Object} options - Search options
 * @param {string} options.folderId - Optional folder ID to restrict search
 * @param {Array<string>} options.fileTypes - Optional array of MIME types to search
 * @param {number} options.maxResults - Maximum number of results (default: 20)
 * @returns {Promise<{files: Array, query: string, timestamp: string}>}
 */
export async function searchDrive(accessToken, query, options = {}) {
  try {
    const searchDrive = httpsCallable(functions, 'searchGoogleDrive');
    const result = await searchDrive({
      accessToken,
      query,
      folderId: options.folderId,
      fileTypes: options.fileTypes,
      maxResults: options.maxResults || 20,
    });

    return result.data;
  } catch (error) {
    console.error('Error searching Drive:', error);

    // Handle specific error cases
    if (error.code === 'unauthenticated') {
      throw new Error('Please sign in with Google to search your Drive');
    }

    if (error.code === 'permission-denied') {
      throw new Error('Insufficient permissions to access Google Drive');
    }

    throw new Error(error.message || 'Failed to search Drive');
  }
}

/**
 * Helper to check if user has Drive access enabled
 *
 * @param {Object} currentUser - Redux user object
 * @returns {boolean}
 */
export function hasDriveAccess(currentUser) {
  return currentUser && currentUser.driveEnabled && currentUser.googleAccessToken;
}

/**
 * Helper to get Drive access token from current user
 *
 * @param {Object} currentUser - Redux user object
 * @returns {string|null}
 */
export function getDriveAccessToken(currentUser) {
  return currentUser?.googleAccessToken || null;
}

/**
 * Format Drive files for display in UI
 *
 * @param {Array} files - Array of Drive file objects
 * @returns {Array} Formatted file objects
 */
export function formatDriveFiles(files) {
  return files.map(file => ({
    ...file,
    // Get readable file type
    fileType: getReadableFileType(file.mimeType),
    // Format modified time
    modifiedDate: new Date(file.modifiedTime).toLocaleDateString(),
    // Shorten name if too long
    displayName: file.name.length > 50 ? file.name.substring(0, 47) + '...' : file.name,
  }));
}

/**
 * Get human-readable file type from MIME type
 *
 * @param {string} mimeType
 * @returns {string}
 */
function getReadableFileType(mimeType) {
  const typeMap = {
    'application/pdf': 'PDF',
    'application/vnd.google-apps.document': 'Google Doc',
    'application/vnd.google-apps.presentation': 'Google Slides',
    'application/vnd.google-apps.spreadsheet': 'Google Sheets',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Doc',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  };

  return typeMap[mimeType] || 'Document';
}
