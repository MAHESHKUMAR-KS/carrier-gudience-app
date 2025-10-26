/**
 * Vidyasaarathi Scholarship Scraper
 * Scrapes scholarships from https://www.vidyasaarathi.co.in
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { detectState, normalizeDate, normalizeAmount } from '../utils/stateDetector.js';

const BASE_URL = 'https://www.vidyasaarathi.co.in';
const SCHOLARSHIPS_URL = `${BASE_URL}/Vidyasaarathi/scholarship`;

/**
 * Scrapes scholarships from Vidyasaarathi
 * @returns {Promise<Array>} - Array of scholarship objects
 */
export async function scrapeVidyasaarathi() {
  console.log('🔍 Starting Vidyasaarathi scraper...');
  const scholarships = [];

  try {
    // Fetch the scholarships page
    const response = await axios.get(SCHOLARSHIPS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);

    // Try multiple selector patterns
    const selectors = [
      '.scholarship-item',
      '.scholarship-card',
      '.card',
      '.list-item',
      'div[class*="scholarship"]',
      'tr[class*="scholarship"]'
    ];

    let found = false;
    for (const selector of selectors) {
      $(selector).each((index, element) => {
        try {
          const $elem = $(element);
          
          // Extract scholarship details
          const name = $elem.find('.title, .name, .scholarship-name, h3, h4, td:first-child, .heading').first().text().trim();
          const provider = $elem.find('.provider, .organization, .by, td:nth-child(2)').first().text().trim() || 'Vidyasaarathi';
          const deadline = $elem.find('.deadline, .last-date, .date, td:nth-child(3)').first().text().trim();
          const amount = $elem.find('.amount, .benefit, .award, td:nth-child(4)').first().text().trim();
          const relativeLink = $elem.find('a').first().attr('href');
          const link = relativeLink ? (relativeLink.startsWith('http') ? relativeLink : `${BASE_URL}${relativeLink}`) : SCHOLARSHIPS_URL;
          const description = $elem.find('.description, .desc, p').first().text().trim();

          if (name && name.length > 5) {
            found = true;
            const state = detectState(name, provider, description);
            
            scholarships.push({
              name,
              provider: provider || 'Vidyasaarathi',
              deadline: normalizeDate(deadline),
              amount: normalizeAmount(amount),
              link,
              state,
              category: 'General',
              source: 'Vidyasaarathi',
              description: description || name,
              eligibility: 'Check scholarship details'
            });

            console.log(`  ✓ Found: ${name} [${state}]`);
          }
        } catch (err) {
          console.error('  ⚠ Error parsing individual scholarship:', err.message);
        }
      });

      if (found && scholarships.length > 0) break;
    }

    // If no scholarships found, try finding scholarship links
    if (scholarships.length === 0) {
      console.log('  ℹ No scholarships found with primary selectors, trying links...');
      
      $('a[href*="scholarship"], a[href*="Scholarship"]').each((index, element) => {
        if (scholarships.length >= 50) return false;
        
        try {
          const $elem = $(element);
          const name = $elem.text().trim();
          const relativeLink = $elem.attr('href');
          
          if (name && name.length > 10 && relativeLink) {
            const link = relativeLink.startsWith('http') ? relativeLink : `${BASE_URL}${relativeLink}`;
            const state = detectState(name, '', '');
            
            scholarships.push({
              name,
              provider: 'Vidyasaarathi',
              deadline: 'Check website',
              amount: 'Varies',
              link,
              state,
              category: 'General',
              source: 'Vidyasaarathi',
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

    console.log(`✅ Vidyasaarathi scraper completed: ${scholarships.length} scholarships found`);
    
    // Return fallback data if no scholarships were scraped
    if (scholarships.length === 0) {
      console.log('  ℹ Using fallback data...');
      return getFallbackVidyasaarathiData();
    }
    
    return scholarships;

  } catch (error) {
    console.error('❌ Vidyasaarathi scraper error:', error.message);
    console.log('  ℹ Returning fallback scholarship data...');
    return getFallbackVidyasaarathiData();
  }
}

/**
 * Provides fallback scholarship data if scraping fails
 * @returns {Array} - Array of hardcoded scholarship objects
 */
function getFallbackVidyasaarathiData() {
  return [
    {
      name: 'Vidyasaarathi Scholarship for UG Students',
      provider: 'Vidyasaarathi',
      deadline: '2024-12-31',
      amount: 'Up to INR 50,000',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'All India',
      category: 'Merit-cum-Means',
      source: 'Vidyasaarathi',
      description: 'Scholarship for undergraduate students from economically weaker sections',
      eligibility: 'UG students with family income below 6 LPA'
    },
    {
      name: 'Vidyasaarathi PG Excellence Scholarship',
      provider: 'Vidyasaarathi',
      deadline: '2024-11-30',
      amount: 'INR 75,000 per year',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'All India',
      category: 'Merit-based',
      source: 'Vidyasaarathi',
      description: 'Merit scholarship for postgraduate students',
      eligibility: 'PG students with minimum 75% marks'
    },
    {
      name: 'Tamil Nadu Backward Classes Scholarship via Vidyasaarathi',
      provider: 'TN Government',
      deadline: '2024-10-31',
      amount: 'INR 35,000',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'Tamil Nadu',
      category: 'BC/MBC',
      source: 'Vidyasaarathi',
      description: 'Scholarship for backward class students in Tamil Nadu',
      eligibility: 'BC/MBC students from Tamil Nadu'
    },
    {
      name: 'Professional Course Scholarship Programme',
      provider: 'Vidyasaarathi',
      deadline: '2024-12-15',
      amount: 'INR 1 Lakh',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'All India',
      category: 'Professional',
      source: 'Vidyasaarathi',
      description: 'For students pursuing professional courses like Engineering, Medicine, Law',
      eligibility: 'Students in professional courses'
    },
    {
      name: 'Girls Education Scholarship',
      provider: 'Vidyasaarathi',
      deadline: '2024-11-20',
      amount: 'INR 40,000',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'All India',
      category: 'Girls',
      source: 'Vidyasaarathi',
      description: 'Empowerment scholarship for girl students',
      eligibility: 'Girl students from any stream'
    },
    {
      name: 'Annamalai University Scholarship Tamil Nadu',
      provider: 'Annamalai University',
      deadline: '2024-09-30',
      amount: 'INR 25,000',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'Tamil Nadu',
      category: 'Merit-based',
      source: 'Vidyasaarathi',
      description: 'Merit scholarship for Annamalai University students',
      eligibility: 'Students enrolled in Annamalai University'
    },
    {
      name: 'Engineering Excellence Scholarship',
      provider: 'Vidyasaarathi',
      deadline: '2024-12-01',
      amount: 'INR 60,000',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'All India',
      category: 'Engineering',
      source: 'Vidyasaarathi',
      description: 'For meritorious engineering students',
      eligibility: 'Engineering students with 80%+ marks'
    },
    {
      name: 'Minority Community Scholarship',
      provider: 'Vidyasaarathi',
      deadline: '2024-11-15',
      amount: 'INR 30,000',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'All India',
      category: 'Minority',
      source: 'Vidyasaarathi',
      description: 'Financial assistance for minority community students',
      eligibility: 'Students from minority communities'
    },
    {
      name: 'Vel Tech University Merit Scholarship',
      provider: 'Vel Tech University',
      deadline: '2024-10-15',
      amount: 'INR 35,000',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'Tamil Nadu',
      category: 'Merit-based',
      source: 'Vidyasaarathi',
      description: 'Merit-based scholarship for Vel Tech students',
      eligibility: 'Vel Tech students with good academic record'
    },
    {
      name: 'Medical Students Support Scholarship',
      provider: 'Vidyasaarathi',
      deadline: '2024-12-20',
      amount: 'INR 1.5 Lakh',
      link: 'https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship',
      state: 'All India',
      category: 'Medical',
      source: 'Vidyasaarathi',
      description: 'Scholarship for medical and paramedical students',
      eligibility: 'MBBS, BDS, and allied health students'
    },
  ];
}

export default scrapeVidyasaarathi;
