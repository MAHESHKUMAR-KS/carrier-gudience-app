/**
 * Unified Scholarship Scraper
 * Runs all scrapers sequentially and stores data in MongoDB
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Scholarship from '../models/Scholarship.js';
import { scrapeBuddy4Study } from './scrapers/buddy4StudyScraper.js';
import { scrapeVidyasaarathi } from './scrapers/vidyasaarathiScraper.js';
import { scrapeNSP } from './scrapers/nspScraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/careerGuidanceDB';

/**
 * Main function to run all scrapers
 */
async function runAllScrapers() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 SCHOLARSHIP AGGREGATION SYSTEM');
  console.log('='.repeat(60) + '\n');

  let connection;

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    connection = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ MongoDB connected successfully\n');

    // Run all scrapers sequentially
    const allScholarships = [];

    // 1. Buddy4Study
    console.log('━'.repeat(60));
    const buddy4StudyScholarships = await scrapeBuddy4Study();
    allScholarships.push(...buddy4StudyScholarships);
    console.log('━'.repeat(60) + '\n');

    // Small delay between scrapers
    await delay(2000);

    // 2. Vidyasaarathi
    console.log('━'.repeat(60));
    const vidyasaarathiScholarships = await scrapeVidyasaarathi();
    allScholarships.push(...vidyasaarathiScholarships);
    console.log('━'.repeat(60) + '\n');

    // Small delay between scrapers
    await delay(2000);

    // 3. National Scholarship Portal
    console.log('━'.repeat(60));
    const nspScholarships = await scrapeNSP();
    allScholarships.push(...nspScholarships);
    console.log('━'.repeat(60) + '\n');

    // Save to MongoDB
    console.log('💾 Saving scholarships to MongoDB...\n');
    const result = await saveScholarships(allScholarships);

    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total scholarships scraped: ${allScholarships.length}`);
    console.log(`New scholarships added: ${result.inserted}`);
    console.log(`Scholarships updated: ${result.updated}`);
    console.log(`Duplicates skipped: ${result.duplicates}`);
    console.log(`Errors encountered: ${result.errors}`);
    
    // State-wise breakdown
    const tamilNaduCount = allScholarships.filter(s => s.state === 'Tamil Nadu').length;
    const allIndiaCount = allScholarships.filter(s => s.state === 'All India').length;
    console.log(`\n📍 Tamil Nadu: ${tamilNaduCount} scholarships`);
    console.log(`📍 All India: ${allIndiaCount} scholarships`);
    
    // Source breakdown
    console.log(`\n📚 Buddy4Study: ${buddy4StudyScholarships.length} scholarships`);
    console.log(`📚 Vidyasaarathi: ${vidyasaarathiScholarships.length} scholarships`);
    console.log(`📚 NSP: ${nspScholarships.length} scholarships`);
    
    console.log('='.repeat(60));
    console.log('✅ All scrapers completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed\n');
    }
  }
}

/**
 * Saves scholarships to MongoDB with duplicate handling
 * @param {Array} scholarships - Array of scholarship objects
 * @returns {Object} - Stats about the save operation
 */
async function saveScholarships(scholarships) {
  let inserted = 0;
  let updated = 0;
  let duplicates = 0;
  let errors = 0;

  console.log(`Processing ${scholarships.length} scholarships...\n`);

  for (const scholarship of scholarships) {
    try {
      // Try to find existing scholarship by name, provider, and source
      const existing = await Scholarship.findOne({
        name: scholarship.name,
        provider: scholarship.provider,
        source: scholarship.source
      });

      if (existing) {
        // Update existing scholarship
        const updated_scholarship = await Scholarship.findByIdAndUpdate(
          existing._id,
          { $set: scholarship },
          { new: true }
        );
        
        if (updated_scholarship) {
          updated++;
          console.log(`  ♻️  Updated: ${scholarship.name.substring(0, 50)}...`);
        }
      } else {
        // Insert new scholarship
        const newScholarship = new Scholarship(scholarship);
        await newScholarship.save();
        inserted++;
        console.log(`  ➕ Added: ${scholarship.name.substring(0, 50)}...`);
      }
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        duplicates++;
        console.log(`  ⏭️  Duplicate: ${scholarship.name.substring(0, 50)}...`);
      } else {
        errors++;
        console.error(`  ❌ Error saving "${scholarship.name}": ${error.message}`);
      }
    }
  }

  return { inserted, updated, duplicates, errors };
}

/**
 * Delay helper function
 * @param {number} ms - Milliseconds to delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the scrapers
runAllScrapers();

export default runAllScrapers;
