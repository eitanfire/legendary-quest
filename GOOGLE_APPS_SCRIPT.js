/**
 * TeachLeague Course Resource Extractor
 * Google Apps Script
 *
 * This script extracts individual links and resources from Google Docs and YouTube playlists
 * for TeachLeague courses.
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project called "TeachLeague Resource Extractor"
 * 3. Copy this entire file into the Code.gs editor
 * 4. Go to Services (+) and add:
 *    - YouTube Data API v3
 * 5. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click "Deploy"
 *    - Copy the Web App URL
 * 6. Add the Web App URL to your React .env file as:
 *    REACT_APP_RESOURCE_EXTRACTOR_URL=<your-web-app-url>
 */

/**
 * Main function - handles HTTP GET requests
 *
 * Usage: GET /?docId=<google-doc-id>&type=doc
 *    or: GET /?playlistId=<youtube-playlist-id>&type=playlist
 *    or: GET /?courseData=<json>&type=course
 */
function doGet(e) {
  const params = e.parameter;

  try {
    if (params.type === 'doc' && params.docId) {
      // Extract links from a single Google Doc
      const links = extractLinksFromDoc(params.docId);
      return createJsonResponse({ success: true, links: links });

    } else if (params.type === 'playlist' && params.playlistId) {
      // Extract videos from a YouTube playlist
      const videos = extractVideosFromPlaylist(params.playlistId);
      return createJsonResponse({ success: true, videos: videos });

    } else if (params.type === 'course' && params.courseData) {
      // Extract all resources for a complete course
      const courseData = JSON.parse(decodeURIComponent(params.courseData));
      const resources = extractCourseResources(courseData);
      return createJsonResponse({ success: true, resources: resources });

    } else {
      return createJsonResponse({
        success: false,
        error: 'Invalid parameters. Use type=doc&docId=... or type=playlist&playlistId=... or type=course&courseData=...'
      });
    }
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString(),
      stack: error.stack
    });
  }
}

/**
 * Extract all resources for a course
 */
function extractCourseResources(courseData) {
  Logger.log('=== Extracting resources for course: ' + courseData.name + ' ===');

  const resources = {
    courseName: courseData.name,
    courseId: courseData.id,
    description: { links: [], errors: [] },
    warmups: { links: [], errors: [] },
    extra: { links: [], errors: [] },
    curriculum: { links: [], errors: [] },
    youtube: { videos: [], errors: [] },
    extrayoutube: { videos: [], errors: [] },
    extrayoutube1: { videos: [], errors: [] }
  };

  // Extract links from Google Docs
  if (courseData.description) {
    const docId = extractDocId(courseData.description);
    if (docId) {
      resources.description.url = courseData.description;
      try {
        resources.description.links = extractLinksFromDoc(docId);
      } catch (error) {
        resources.description.errors.push(error.toString());
      }
    }
  }

  if (courseData.warmups) {
    const docId = extractDocId(courseData.warmups);
    if (docId) {
      resources.warmups.url = courseData.warmups;
      try {
        resources.warmups.links = extractLinksFromDoc(docId);
      } catch (error) {
        resources.warmups.errors.push(error.toString());
      }
    }
  }

  if (courseData.extra) {
    const docId = extractDocId(courseData.extra);
    if (docId) {
      resources.extra.url = courseData.extra;
      try {
        resources.extra.links = extractLinksFromDoc(docId);
      } catch (error) {
        resources.extra.errors.push(error.toString());
      }
    }
  }

  if (courseData.curriculum) {
    const docId = extractDocId(courseData.curriculum);
    if (docId) {
      resources.curriculum.url = courseData.curriculum;
      try {
        resources.curriculum.links = extractLinksFromDoc(docId);
      } catch (error) {
        resources.curriculum.errors.push(error.toString());
      }
    }
  }

  // Extract videos from YouTube playlists
  if (courseData.youtube) {
    const playlistId = extractPlaylistId(courseData.youtube);
    if (playlistId) {
      resources.youtube.url = courseData.youtube;
      try {
        resources.youtube.videos = extractVideosFromPlaylist(playlistId);
      } catch (error) {
        resources.youtube.errors.push(error.toString());
      }
    }
  }

  if (courseData.extrayoutube) {
    const playlistId = extractPlaylistId(courseData.extrayoutube);
    if (playlistId) {
      resources.extrayoutube.url = courseData.extrayoutube;
      try {
        resources.extrayoutube.videos = extractVideosFromPlaylist(playlistId);
      } catch (error) {
        resources.extrayoutube.errors.push(error.toString());
      }
    }
  }

  if (courseData.extrayoutube1) {
    const playlistId = extractPlaylistId(courseData.extrayoutube1);
    if (playlistId) {
      resources.extrayoutube1.url = courseData.extrayoutube1;
      try {
        resources.extrayoutube1.videos = extractVideosFromPlaylist(playlistId);
      } catch (error) {
        resources.extrayoutube1.errors.push(error.toString());
      }
    }
  }

  Logger.log('=== Extraction complete for ' + courseData.name + ' ===');
  return resources;
}

/**
 * Extract all links from a Google Doc
 */
function extractLinksFromDoc(docId) {
  try {
    Logger.log('Attempting to extract links from doc: ' + docId);

    const doc = DocumentApp.openById(docId);
    const body = doc.getBody();
    const links = [];

    // Get all links from the document
    const textElements = body.getParagraphs();
    Logger.log('Found ' + textElements.length + ' paragraphs in doc');

    textElements.forEach(function(element) {
      const text = element.getText();
      const numChildren = element.getNumChildren();

      for (let i = 0; i < numChildren; i++) {
        const child = element.getChild(i);

        if (child.getType() === DocumentApp.ElementType.TEXT) {
          const textElement = child.asText();
          const textString = textElement.getText();
          const numIndices = textString.length;

          for (let j = 0; j < numIndices; j++) {
            const url = textElement.getLinkUrl(j);

            if (url && !links.find(l => l.url === url)) {
              // Get the text for this link
              let linkText = '';
              let k = j;
              while (k < numIndices && textElement.getLinkUrl(k) === url) {
                linkText += textString.charAt(k);
                k++;
              }

              links.push({
                text: linkText.trim(),
                url: url,
                type: categorizeLink(url)
              });
            }
          }
        }
      }
    });

    // Also extract plain URLs that might not be hyperlinked
    const plainText = body.getText();
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let match;

    while ((match = urlRegex.exec(plainText)) !== null) {
      const url = match[0];
      if (!links.find(l => l.url === url)) {
        links.push({
          text: url,
          url: url,
          type: categorizeLink(url)
        });
      }
    }

    Logger.log('Extracted ' + links.length + ' links from doc ' + docId);
    return links;
  } catch (error) {
    Logger.log('ERROR extracting links from doc ' + docId + ': ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    throw error; // Re-throw so caller can handle
  }
}

/**
 * Extract videos from a YouTube playlist
 */
function extractVideosFromPlaylist(playlistId) {
  try {
    Logger.log('Attempting to extract playlist: ' + playlistId);

    // Check if YouTube service is available
    if (typeof YouTube === 'undefined') {
      Logger.log('ERROR: YouTube service not available. Did you add YouTube Data API v3?');
      throw new Error('YouTube Data API v3 not enabled');
    }

    const videos = [];
    let pageToken = '';
    let pageCount = 0;

    do {
      Logger.log('Fetching page ' + (pageCount + 1) + ' for playlist ' + playlistId);

      const response = YouTube.PlaylistItems.list('snippet,contentDetails', {
        playlistId: playlistId,
        maxResults: 50,
        pageToken: pageToken
      });

      Logger.log('Received ' + (response.items ? response.items.length : 0) + ' items');

      if (response.items) {
        response.items.forEach(function(item) {
          // Some videos might not have thumbnails, so check safely
          let thumbnail = '';
          if (item.snippet.thumbnails) {
            if (item.snippet.thumbnails.default) {
              thumbnail = item.snippet.thumbnails.default.url;
            } else if (item.snippet.thumbnails.medium) {
              thumbnail = item.snippet.thumbnails.medium.url;
            } else if (item.snippet.thumbnails.high) {
              thumbnail = item.snippet.thumbnails.high.url;
            }
          }

          videos.push({
            title: item.snippet.title,
            description: item.snippet.description,
            videoId: item.contentDetails.videoId,
            url: 'https://www.youtube.com/watch?v=' + item.contentDetails.videoId,
            thumbnail: thumbnail,
            publishedAt: item.snippet.publishedAt
          });
        });
      }

      pageToken = response.nextPageToken;
      pageCount++;
    } while (pageToken && pageCount < 10); // Safety limit

    Logger.log('Total videos extracted: ' + videos.length);
    return videos;
  } catch (error) {
    Logger.log('ERROR extracting videos from playlist ' + playlistId + ': ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    throw error; // Re-throw so caller can handle
  }
}

/**
 * Categorize a link by its URL
 */
function categorizeLink(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('docs.google.com/document')) {
    return 'google_doc';
  } else if (url.includes('docs.google.com/spreadsheets')) {
    return 'google_sheet';
  } else if (url.includes('docs.google.com/presentation')) {
    return 'google_slides';
  } else if (url.includes('drive.google.com')) {
    return 'google_drive';
  } else if (url.match(/\.(pdf|doc|docx)$/i)) {
    return 'document';
  } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return 'image';
  } else {
    return 'web';
  }
}

/**
 * Extract Google Doc ID from URL
 */
function extractDocId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Extract YouTube Playlist ID from URL
 */
function extractPlaylistId(url) {
  const match = url.match(/[?&]list=([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Create a JSON response
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - you can run this in the Apps Script editor to test
 * This tests the full extraction pipeline for the Film course
 */
function testExtraction() {
  Logger.log('=== STARTING TEST EXTRACTION ===');

  // Test with a sample course
  const testCourse = {
    id: 4,
    name: "Film",
    description: "https://docs.google.com/document/d/1yR1lESYS7ZWYixmg3kjDqU4PGZwXBjFEgef_vt8vqZk/edit",
    warmups: "https://docs.google.com/document/d/18EFYRk3c-5Y1wGQCO-ZzfasrFPO6V9Trhr3eDgPDEKY/edit",
    extra: "https://docs.google.com/document/d/1-ct5ojv5wnIFi2BEN6KSQpRi-XNPMddGc6i9x4i2dB0/edit",
    curriculum: "https://docs.google.com/document/d/1anxjUwmkP1JNv1ihyAP0KtdfQuK3ntYJ_IER3V1-b08/edit",
    youtube: "https://youtube.com/playlist?list=PLhwsqXANwnd3iClUxi6_5BDGKUZqSy8dJ"
  };

  try {
    const resources = extractCourseResources(testCourse);
    Logger.log('=== EXTRACTION RESULTS ===');
    Logger.log(JSON.stringify(resources, null, 2));
    Logger.log('=== TEST COMPLETE ===');
    return resources;
  } catch (error) {
    Logger.log('=== TEST FAILED ===');
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    throw error;
  }
}

/**
 * Simple test for YouTube API only
 * Run this if you want to verify YouTube Data API v3 is working
 */
function testYouTubeOnly() {
  Logger.log('=== TESTING YOUTUBE API ===');

  try {
    const playlistId = 'PLhwsqXANwnd3iClUxi6_5BDGKUZqSy8dJ';
    const videos = extractVideosFromPlaylist(playlistId);

    Logger.log('SUCCESS! Extracted ' + videos.length + ' videos');
    Logger.log('First 3 videos:');
    videos.slice(0, 3).forEach(function(video) {
      Logger.log('  - ' + video.title);
    });

    return videos;
  } catch (error) {
    Logger.log('FAILED: ' + error.toString());
    throw error;
  }
}

/**
 * Simple test for Google Docs API only
 * Run this to verify document reading permissions are working
 */
function testDocOnly() {
  Logger.log('=== TESTING GOOGLE DOCS API ===');

  try {
    const docId = '1yR1lESYS7ZWYixmg3kjDqU4PGZwXBjFEgef_vt8vqZk';
    const links = extractLinksFromDoc(docId);

    Logger.log('SUCCESS! Extracted ' + links.length + ' links');
    Logger.log('First 3 links:');
    links.slice(0, 3).forEach(function(link) {
      Logger.log('  - ' + link.text + ' (' + link.url + ')');
    });

    return links;
  } catch (error) {
    Logger.log('FAILED: ' + error.toString());
    throw error;
  }
}
