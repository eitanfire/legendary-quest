/**
 * Advanced keyword extraction and weighting for intelligent resource matching
 */

// Comprehensive list of common words to filter out
const STOPWORDS = new Set([
  // Articles and determiners
  'the', 'a', 'an',
  // Common prepositions
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'over',
  // Common conjunctions
  'and', 'or', 'but', 'nor', 'so', 'yet',
  // Common pronouns
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their', 'this', 'that', 'these', 'those',
  // Common verbs (generic)
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  // Question words
  'how', 'what', 'which', 'who', 'when', 'where', 'why',
  // Generic educational terms (low signal)
  'will', 'can', 'could', 'should', 'would', 'may', 'might', 'must',
  'make', 'made', 'use', 'used', 'using', 'get', 'got', 'getting',
  // Common educational verbs (too generic to be useful alone)
  'understand', 'understanding', 'learn', 'learning', 'study', 'studying',
  'analyze', 'analyzing', 'create', 'creating', 'develop', 'developing',
  'explore', 'exploring', 'examine', 'examining', 'demonstrate', 'demonstrating',
  'apply', 'applying', 'evaluate', 'evaluating', 'compare', 'comparing',
  'identify', 'identifying', 'describe', 'describing', 'explain', 'explaining',
  'discuss', 'discussing', 'review', 'reviewing',
  // Generic descriptors
  'topic', 'lesson', 'activity', 'student', 'students', 'teacher', 'class',
  'skills', 'skill', 'knowledge', 'concept', 'concepts', 'idea', 'ideas',
  'influence', 'influences', 'effect', 'effects', 'impact', 'impacts',
  'cause', 'causes', 'reason', 'reasons', 'factor', 'factors'
]);

// Common multi-word phrases that should be treated as single units
const KNOWN_PHRASES = [
  // Historical events
  'american revolution', 'french revolution', 'industrial revolution', 'scientific revolution',
  'world war i', 'world war ii', 'world war 1', 'world war 2',
  'civil war', 'cold war', 'revolutionary war',
  'boston tea party', 'pearl harbor', 'd-day',
  'declaration of independence', 'bill of rights', 'emancipation proclamation',
  'louisiana purchase', 'westward expansion', 'manifest destiny',

  // Historical periods
  'middle ages', 'dark ages', 'renaissance', 'enlightenment period',
  'age of exploration', 'gilded age', 'progressive era', 'great depression',
  'roaring twenties', 'jazz age', 'civil rights movement',

  // Scientific concepts
  'solar system', 'periodic table', 'scientific method', 'water cycle',
  'food chain', 'food web', 'carbon cycle', 'nitrogen cycle',
  'climate change', 'global warming', 'greenhouse effect',
  'natural selection', 'cell division', 'photosynthesis process',

  // Literary works and authors
  'romeo and juliet', 'hamlet', 'macbeth', 'to kill a mockingbird',
  'great gatsby', 'grapes of wrath', 'scarlet letter',

  // Government and civics
  'checks and balances', 'separation of powers', 'electoral college',
  'judicial review', 'executive branch', 'legislative branch', 'judicial branch',
  'house of representatives', 'supreme court', 'bill of rights',

  // Geographic terms
  'united states', 'new world', 'old world', 'middle east',
  'latin america', 'south america', 'north america'
];

/**
 * Extract and weight keywords from user input
 * Returns an array of keyword objects with text and weight
 */
export function extractKeywords(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const normalized = text.toLowerCase().trim();

  // First, extract multi-word phrases
  const phrases = extractPhrases(normalized);

  // Then extract individual keywords (excluding words already in phrases)
  const phraseWords = new Set(
    phrases.flatMap(p => p.text.split(/\s+/))
  );

  const words = normalized
    .split(/\s+/)
    .filter(word => {
      // Filter out stopwords and words already in phrases
      return word.length > 2
        && !STOPWORDS.has(word)
        && !phraseWords.has(word);
    });

  // Detect proper nouns from original text (capitalized words)
  const properNouns = detectProperNouns(text);

  // Weight keywords
  const weightedKeywords = [];

  // Add phrases with high weight
  phrases.forEach(phrase => {
    weightedKeywords.push({
      text: phrase.text,
      weight: phrase.weight,
      type: 'phrase'
    });
  });

  // Add proper nouns with high weight
  properNouns.forEach(noun => {
    const nounLower = noun.toLowerCase();
    // Don't duplicate if already in phrases
    if (!phrases.some(p => p.text.includes(nounLower))) {
      weightedKeywords.push({
        text: nounLower,
        weight: 3.0, // High weight for proper nouns
        type: 'proper_noun'
      });
    }
  });

  // Add remaining individual words with base weight
  words.forEach(word => {
    // Skip if already included as proper noun or phrase
    if (!weightedKeywords.some(k => k.text === word || k.text.includes(word))) {
      weightedKeywords.push({
        text: word,
        weight: 1.0, // Base weight for regular keywords
        type: 'keyword'
      });
    }
  });

  return weightedKeywords;
}

/**
 * Extract known multi-word phrases from text
 */
function extractPhrases(normalizedText) {
  const foundPhrases = [];

  KNOWN_PHRASES.forEach(phrase => {
    if (normalizedText.includes(phrase)) {
      foundPhrases.push({
        text: phrase,
        weight: 4.0 // Very high weight for recognized phrases
      });
    }
  });

  // Also detect capitalized multi-word sequences (like "Scientific Revolution")
  // that aren't in our known phrases list
  const words = normalizedText.split(/\s+/);
  for (let i = 0; i < words.length - 1; i++) {
    const twoWord = `${words[i]} ${words[i + 1]}`;
    const threeWord = i < words.length - 2 ? `${words[i]} ${words[i + 1]} ${words[i + 2]}` : null;

    // Check if this looks like a proper noun phrase (not already in known phrases)
    if (threeWord && !KNOWN_PHRASES.includes(threeWord)) {
      // Three-word phrase detection (less common but possible)
      if (words[i].length > 3 && words[i + 1].length > 2 && words[i + 2].length > 3) {
        foundPhrases.push({
          text: threeWord,
          weight: 3.5
        });
        i += 2; // Skip the next two words
        continue;
      }
    }

    if (!KNOWN_PHRASES.includes(twoWord) && words[i].length > 3 && words[i + 1].length > 3) {
      // Two-word phrase detection
      foundPhrases.push({
        text: twoWord,
        weight: 2.5
      });
      i++; // Skip the next word
    }
  }

  return foundPhrases;
}

/**
 * Detect proper nouns (capitalized words) from original text
 */
function detectProperNouns(originalText) {
  // Split into words while preserving capitalization
  const words = originalText.match(/\b[A-Z][a-z]+\b/g) || [];

  // Filter out common false positives (sentence starts, etc.)
  const properNouns = words.filter(word => {
    const lower = word.toLowerCase();
    // Skip if it's a stopword or very short
    return !STOPWORDS.has(lower) && word.length > 2;
  });

  // Remove duplicates
  return [...new Set(properNouns)];
}

/**
 * Calculate weighted relevance score between keywords and target text
 */
export function calculateWeightedRelevance(keywords, targetText) {
  if (!targetText || !keywords || keywords.length === 0) {
    return 0;
  }

  const targetLower = targetText.toLowerCase();
  let totalScore = 0;

  keywords.forEach(keyword => {
    if (targetLower.includes(keyword.text)) {
      // Score is base points multiplied by keyword weight
      const baseScore = keyword.type === 'phrase' ? 20 : 10;
      totalScore += baseScore * keyword.weight;
    }
  });

  return totalScore;
}

/**
 * Get simple keyword strings for backward compatibility
 */
export function getKeywordStrings(keywords) {
  return keywords.map(k => k.text);
}
