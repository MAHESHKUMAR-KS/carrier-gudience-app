/**
 * Utility module for detecting Tamil Nadu scholarships
 * Checks for Tamil Nadu related keywords in scholarship name and provider
 */

const TAMIL_NADU_KEYWORDS = [
  'tamil nadu',
  'tamilnadu',
  'tn govt',
  'tn government',
  'anna university',
  'annamalai',
  'vel tech',
  'srm',
  'tnea',
  'chennai',
  'madras',
  'coimbatore',
  'madurai',
  'trichy',
  'tiruchirappalli',
  'salem',
  'tirunelveli',
  'erode',
  'vellore',
  'thoothukudi',
  'dindigul',
  'thanjavur',
  'tn students',
  'tamil',
];

/**
 * Determines if a scholarship is for Tamil Nadu based on text analysis
 * @param {string} name - Scholarship name
 * @param {string} provider - Scholarship provider
 * @param {string} description - Scholarship description (optional)
 * @returns {string} - "Tamil Nadu" or "All India"
 */
export function detectState(name = '', provider = '', description = '') {
  const combinedText = `${name} ${provider} ${description}`.toLowerCase();
  
  for (const keyword of TAMIL_NADU_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      return 'Tamil Nadu';
    }
  }
  
  return 'All India';
}

/**
 * Normalizes date strings to consistent format
 * @param {string} dateStr - Date string from scraper
 * @returns {string} - Normalized date string
 */
export function normalizeDate(dateStr) {
  if (!dateStr) return 'Not specified';
  
  // Try to parse and format the date
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    }
  } catch (e) {
    // If parsing fails, return the original string
  }
  
  return dateStr.trim();
}

/**
 * Normalizes amount strings
 * @param {string} amount - Amount string
 * @returns {string} - Normalized amount
 */
export function normalizeAmount(amount) {
  if (!amount) return 'Not specified';
  return amount.trim();
}
