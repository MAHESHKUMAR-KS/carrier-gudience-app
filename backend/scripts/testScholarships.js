/**
 * Quick test script to insert fallback scholarship data into MongoDB
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

async function quickTest() {
  console.log('\n🧪 Quick Test - Loading Scholarships...\n');

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected!\n');

    // Get fallback data
    console.log('📚 Loading scholarship data...');
    const buddy4Study = await scrapeBuddy4Study().catch(() => []);
    const vidyasaarathi = await scrapeVidyasaarathi().catch(() => []);
    const nsp = await scrapeNSP().catch(() => []);

    const allScholarships = [...buddy4Study, ...vidyasaarathi, ...nsp];
    
    console.log(`\n📊 Total scholarships collected: ${allScholarships.length}`);
    console.log(`   - Buddy4Study: ${buddy4Study.length}`);
    console.log(`   - Vidyasaarathi: ${vidyasaarathi.length}`);
    console.log(`   - NSP: ${nsp.length}\n`);

    // Insert into database
    console.log('💾 Saving to database...\n');
    let inserted = 0, updated = 0, errors = 0;

    for (const scholarship of allScholarships) {
      try {
        const existing = await Scholarship.findOne({
          name: scholarship.name,
          provider: scholarship.provider,
          source: scholarship.source
        });

        if (existing) {
          await Scholarship.findByIdAndUpdate(existing._id, { $set: scholarship });
          updated++;
          console.log(`  ♻️  Updated: ${scholarship.name.substring(0, 60)}`);
        } else {
          await Scholarship.create(scholarship);
          inserted++;
          console.log(`  ➕ Added: ${scholarship.name.substring(0, 60)}`);
        }
      } catch (err) {
        errors++;
        console.error(`  ❌ Error: ${err.message}`);
      }
    }

    console.log(`\n✅ Complete!`);
    console.log(`   Inserted: ${inserted}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}\n`);

    // Query to verify
    const count = await Scholarship.countDocuments();
    const tnCount = await Scholarship.countDocuments({ state: 'Tamil Nadu' });
    const allIndiaCount = await Scholarship.countDocuments({ state: 'All India' });

    console.log(`📊 Database Stats:`);
    console.log(`   Total scholarships: ${count}`);
    console.log(`   Tamil Nadu: ${tnCount}`);
    console.log(`   All India: ${allIndiaCount}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB\n');
  }
}

quickTest();
