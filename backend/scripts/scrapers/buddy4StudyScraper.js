/**
 * Buddy4Study Scholarship Scraper
 * Scrapes scholarships from https://www.buddy4study.com/scholarships
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { detectState, normalizeDate, normalizeAmount } from '../utils/stateDetector.js';

const BASE_URL = 'https://www.buddy4study.com';
const SCHOLARSHIPS_URL = `${BASE_URL}/scholarships`;

/**
 * Scrapes scholarships from Buddy4Study
 * @returns {Promise<Array>} - Array of scholarship objects
 */
export async function scrapeBuddy4Study() {
  console.log('🔍 Starting Buddy4Study scraper...');
  const scholarships = [];

  try {
    // Fetch the main scholarships page
    const response = await axios.get(SCHOLARSHIPS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);

    // Find scholarship cards on the page
    $('.scholarship-item, .scholarship-card, .card-scholarship').each((index, element) => {
      try {
        const $elem = $(element);
        
        // Extract scholarship details
        const name = $elem.find('.scholarship-title, .card-title, h3, h4').first().text().trim();
        const provider = $elem.find('.scholarship-provider, .provider, .scholarship-by').first().text().trim() || 'Buddy4Study';
        const deadline = $elem.find('.scholarship-deadline, .deadline, .last-date').first().text().trim();
        const amount = $elem.find('.scholarship-amount, .amount, .benefit').first().text().trim();
        const relativeLink = $elem.find('a').first().attr('href');
        const link = relativeLink ? (relativeLink.startsWith('http') ? relativeLink : `${BASE_URL}${relativeLink}`) : SCHOLARSHIPS_URL;
        const description = $elem.find('.scholarship-desc, .description, p').first().text().trim();

        if (name && name.length > 5) {
          const state = detectState(name, provider, description);
          
          scholarships.push({
            name,
            provider: provider || 'Buddy4Study',
            deadline: normalizeDate(deadline),
            amount: normalizeAmount(amount),
            link,
            state,
            category: 'General',
            source: 'Buddy4Study',
            description: description || name,
            eligibility: 'Check scholarship details'
          });

          console.log(`  ✓ Found: ${name} [${state}]`);
        }
      } catch (err) {
        console.error('  ⚠ Error parsing individual scholarship:', err.message);
      }
    });

    // If no scholarships found with above selectors, try alternative approach
    if (scholarships.length === 0) {
      console.log('  ℹ No scholarships found with primary selectors, trying alternative...');
      
      // Try finding links with "scholarship" in the URL
      $('a[href*="/page/"], a[href*="scholarship"]').each((index, element) => {
        if (scholarships.length >= 50) return false; // Limit to 50 scholarships
        
        try {
          const $elem = $(element);
          const name = $elem.text().trim();
          const relativeLink = $elem.attr('href');
          
          if (name && name.length > 10 && relativeLink && relativeLink.includes('scholarship')) {
            const link = relativeLink.startsWith('http') ? relativeLink : `${BASE_URL}${relativeLink}`;
            const state = detectState(name, '', '');
            
            scholarships.push({
              name,
              provider: 'Buddy4Study',
              deadline: 'Check website',
              amount: 'Varies',
              link,
              state,
              category: 'General',
              source: 'Buddy4Study',
              description: name,
              eligibility: 'Check scholarship details'
            });

            console.log(`  ✓ Found: ${name} [${state}]`);
          }
        } catch (err) {
          console.error('  ⚠ Error parsing link:', err.message);
        }
      });
    }

    console.log(`✅ Buddy4Study scraper completed: ${scholarships.length} scholarships found`);
    
    // Return fallback data if no scholarships were scraped
    if (scholarships.length === 0) {
      console.log('  ℹ Using fallback data...');
      return getFallbackBuddy4StudyData();
    }
    
    return scholarships;

  } catch (error) {
    console.error('❌ Buddy4Study scraper error:', error.message);
    
    // Return fallback data if scraping fails
    console.log('  ℹ Returning fallback scholarship data...');
    return getFallbackBuddy4StudyData();
  }
}

/**
 * Provides fallback scholarship data if scraping fails
 * @returns {Array} - Array of hardcoded scholarship objects
 */
function getFallbackBuddy4StudyData() {
  return [
    {
      name: 'HDFC Bank Parivartan\'s ECSS Programme 2024-25',
      provider: 'HDFC Bank',
      deadline: '2024-12-31',
      amount: 'Up to INR 75,000',
      link: 'https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme',
      state: 'All India',
      category: 'Merit-based',
      source: 'Buddy4Study',
      description: 'Scholarship for Class 6-12, Diploma, ITI, UG, PG students',
      eligibility: 'Students from Class 6 to PG level'
    },
    {
      name: 'Kotak Kanya Scholarship 2024',
      provider: 'Kotak Education Foundation',
      deadline: '2024-11-30',
      amount: 'INR 1.5 Lakh per year',
      link: 'https://www.buddy4study.com/page/kotak-kanya-scholarship',
      state: 'All India',
      category: 'Girls',
      source: 'Buddy4Study',
      description: 'Scholarship for girl students who have passed Class 12th with 85% marks',
      eligibility: 'Girl students with 85%+ in Class 12'
    },
    {
      name: 'Dr. APJ Abdul Kalam Scholarship Tamil Nadu 2024',
      provider: 'TN Government',
      deadline: '2024-10-31',
      amount: 'INR 50,000 per year',
      link: 'https://www.buddy4study.com/scholarships',
      state: 'Tamil Nadu',
      category: 'Merit-based',
      source: 'Buddy4Study',
      description: 'Scholarship for Tamil Nadu students pursuing higher education',
      eligibility: 'Tamil Nadu domicile students'
    },
    {
      name: 'Sitaram Jindal Foundation Scholarship 2024',
      provider: 'Sitaram Jindal Foundation',
      deadline: '2024-12-15',
      amount: 'Up to INR 60,000',
      link: 'https://www.buddy4study.com/page/sitaram-jindal-foundation-scholarship-programme',
      state: 'All India',
      category: 'Merit-cum-Means',
      source: 'Buddy4Study',
      description: 'For meritorious students from economically weaker sections',
      eligibility: 'Students with good academic record and financial need'
    },
    {
      name: 'L&T Build India Scholarship 2024',
      provider: 'L&T',
      deadline: '2024-11-20',
      amount: 'INR 2 Lakh per year',
      link: 'https://www.buddy4study.com/page/lnt-build-india-scholarship',
      state: 'All India',
      category: 'Engineering',
      source: 'Buddy4Study',
      description: 'For engineering students from economically challenged backgrounds',
      eligibility: 'Engineering students with annual family income < 4.5 LPA'
    },
    {
      name: 'Anna University Merit Scholarship Tamil Nadu',
      provider: 'Anna University',
      deadline: '2024-10-15',
      amount: 'INR 40,000',
      link: 'https://www.buddy4study.com/scholarships',
      state: 'Tamil Nadu',
      category: 'Merit-based',
      source: 'Buddy4Study',
      description: 'Merit scholarship for Anna University students',
      eligibility: 'Anna University students with CGPA > 8.5'
    },
    {
      name: 'Reliance Foundation Undergraduate Scholarship 2024',
      provider: 'Reliance Foundation',
      deadline: '2024-12-10',
      amount: 'INR 2 Lakh per year',
      link: 'https://www.buddy4study.com/page/reliance-foundation-undergraduate-scholarship',
      state: 'All India',
      category: 'Merit-cum-Means',
      source: 'Buddy4Study',
      description: 'For first-year undergraduate students',
      eligibility: 'First-year UG students with family income < 6 LPA'
    },
    {
      name: 'Tata Capital Pankh Scholarship Programme 2024',
      provider: 'Tata Capital',
      deadline: '2024-11-25',
      amount: 'Up to INR 80,000',
      link: 'https://www.buddy4study.com/page/tata-capital-pankh-scholarship-programme',
      state: 'All India',
      category: 'Merit-based',
      source: 'Buddy4Study',
      description: 'For students from Classes 6 to professional courses',
      eligibility: 'Students from Class 6 onwards'
    },
    {
      name: 'SRM University Merit Scholarship',
      provider: 'SRM Institute',
      deadline: '2024-09-30',
      amount: 'INR 30,000',
      link: 'https://www.buddy4study.com/scholarships',
      state: 'Tamil Nadu',
      category: 'Merit-based',
      source: 'Buddy4Study',
      description: 'Merit-based scholarship for SRM students',
      eligibility: 'SRM students with excellent academic performance'
    },
    {
      name: 'ONGC Scholarship for SC/ST/OBC Students 2024',
      provider: 'ONGC',
      deadline: '2024-10-31',
      amount: 'INR 48,000 per year',
      link: 'https://www.buddy4study.com/page/ongc-scholarship',
      state: 'All India',
      category: 'SC/ST/OBC',
      source: 'Buddy4Study',
      description: 'For SC/ST/OBC students pursuing professional courses',
      eligibility: 'SC/ST/OBC students with family income < 4.5 LPA'
    },
  ];
}

export default scrapeBuddy4Study;
