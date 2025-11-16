/**
 * NCES (National Center for Education Statistics) API utilities
 * Uses the ArcGIS REST API to fetch school district data
 */

const NCES_API_BASE = 'https://services1.arcgis.com/Ua5sjt3LWTPigjyD/ArcGIS/rest/services/School_Districts_Current/FeatureServer/0';

/**
 * Search for school districts by name
 * @param {string} searchTerm - The search term to match against district names
 * @param {number} maxResults - Maximum number of results to return (default: 10)
 * @returns {Promise<Array>} Array of district objects with name, geoid, and state
 */
export const searchSchoolDistricts = async (searchTerm, maxResults = 10) => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  try {
    // Build the query URL
    const params = new URLSearchParams({
      where: `NAME LIKE '%${searchTerm.trim()}%'`,
      outFields: 'NAME,GEOID,STATEFP,LOGRADE,HIGRADE',
      returnGeometry: 'false',
      orderByFields: 'NAME ASC',
      resultRecordCount: maxResults.toString(),
      f: 'json'
    });

    const url = `${NCES_API_BASE}/query?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NCES API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response into a simpler format
    if (data.features && Array.isArray(data.features)) {
      return data.features.map(feature => ({
        name: feature.attributes.NAME,
        geoid: feature.attributes.GEOID,
        stateFips: feature.attributes.STATEFP,
        state: getStateName(feature.attributes.STATEFP),
        stateAbbr: getStateName(feature.attributes.STATEFP),
        lowestGrade: feature.attributes.LOGRADE,
        highestGrade: feature.attributes.HIGRADE,
        // Get state-specific standards (for UI display)
        stateStandards: getStateStandards(feature.attributes.STATEFP),
        // Get recommended standards for auto-suggestion
        recommendedStandards: getRecommendedStandards(feature.attributes.STATEFP)
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching school districts:', error);
    return [];
  }
};

/**
 * Convert state FIPS code to state abbreviation
 * @param {string} fipsCode - Two-digit state FIPS code
 * @returns {string} State abbreviation or empty string if not found
 */
const getStateName = (fipsCode) => {
  const stateMap = {
    '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
    '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
    '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
    '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
    '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
    '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
    '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
    '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
    '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
    '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
    '56': 'WY', '60': 'AS', '66': 'GU', '69': 'MP', '72': 'PR',
    '78': 'VI'
  };

  return stateMap[fipsCode] || '';
};

/**
 * Get state-specific educational standards
 * @param {string} fipsCode - Two-digit state FIPS code
 * @returns {Array<Object>} Array of state-specific standards with value and label
 */
const getStateStandards = (fipsCode) => {
  // Map state FIPS codes to their state-specific standards (not nationwide like CCSS/NGSS)
  const stateStandardsMap = {
    '48': [{ value: 'TEKS', label: 'Texas Essential Knowledge and Skills (TEKS)' }],
    '08': [{ value: 'Colorado', label: 'Colorado Academic Standards' }],
    '36': [{ value: 'NYSLS', label: 'New York State Learning Standards' }],
    '06': [{ value: 'CA-CCSS', label: 'California Common Core State Standards' }],
    '12': [{ value: 'FLBEST', label: 'Florida B.E.S.T. Standards' }],
    '51': [{ value: 'VA-SOL', label: 'Virginia Standards of Learning (SOL)' }],
    '37': [{ value: 'NC-SCS', label: 'North Carolina Standard Course of Study' }],
  };

  return stateStandardsMap[fipsCode] || [];
};

/**
 * Get recommended educational standards based on state (for auto-suggestion)
 * @param {string} fipsCode - Two-digit state FIPS code
 * @returns {Array<string>} Array of recommended standard codes
 */
const getRecommendedStandards = (fipsCode) => {
  // Get state-specific standards
  const stateStandards = getStateStandards(fipsCode);
  const stateStandardCodes = stateStandards.map(s => s.value);

  // Always recommend NGSS (nationwide science standards)
  return [...stateStandardCodes, 'NGSS'];
};
