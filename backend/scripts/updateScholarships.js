import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Scholarship from '../models/Scholarship.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerGuidanceDB';

// Hardcoded Buddy4Study data
const buddy4StudyData = [
  {
    title: 'HDFC Bank Parivartan\'s ECSS Programme 2023-24',
    provider: 'HDFC Bank',
    eligibility: 'Class 6-12, Diploma, ITI, UG, PG students',
    benefits: 'Up to INR 75,000',
    lastDate: new Date('2024-09-30'),
    applyLink: 'https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme',
    state: 'All-India',
    category: 'Merit-based',
  },
  {
    title: 'Kotak Kanya Scholarship 2023',
    provider: 'Kotak Education Foundation',
    eligibility: 'Girl students who have passed Class 12th with 85% marks',
    benefits: 'INR 1.5 Lakh per year',
    lastDate: new Date('2024-10-31'),
    applyLink: 'https://www.buddy4study.com/page/kotak-kanya-scholarship',
    state: 'All-India',
    category: 'Girls',
  },
];


const updateScholarships = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB connected');

    const allScholarships = [...buddy4StudyData];

    let updateCount = 0;

    for (const scholarship of allScholarships) {
      const result = await Scholarship.updateOne(
        { title: scholarship.title, provider: scholarship.provider }, // Unique key for upsert
        { $set: scholarship },
        { upsert: true }
      );
      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        updateCount++;
      }
    }

    console.log(`✅ Updated ${updateCount} scholarships`);

  } catch (error) {
    console.error('❌ Error updating scholarships:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  }
};

updateScholarships();
