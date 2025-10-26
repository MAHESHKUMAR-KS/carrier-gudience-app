import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scholarship from '../models/Scholarship.js';

dotenv.config();

async function listScholarships() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerGuidanceDB');
    console.log('Connected to MongoDB');

    const scholarships = await Scholarship.find({});
    console.log(`Found ${scholarships.length} scholarships:`);
    console.log(JSON.stringify(scholarships, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

listScholarships();
