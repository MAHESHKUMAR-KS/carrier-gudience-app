// Quick test script to verify Gemini API key
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('\n🧪 Testing Gemini API Key...\n');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 20)}...` : 'NOT FOUND');

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env file!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Use gemini-2.5-flash (newest model)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

console.log('Using model: gemini-2.5-flash');

async function testAPI() {
  try {
    console.log('\n📡 Sending test message to Gemini API...\n');
    
    const result = await model.generateContent("Say 'Hello! API is working!' in one short sentence.");
    const response = result.response.text();
    
    console.log('✅ SUCCESS! API Response:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(response);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Your Gemini API key is working!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ API Error:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('\n❌ Your API key is INVALID');
      console.error('   → Get a new key from: https://aistudio.google.com/');
    } else if (error.message.includes('RATE_LIMIT') || error.message.includes('429')) {
      console.error('\n⚠️  Your API key is RATE LIMITED');
      console.error('   → Quota exceeded. Wait or use a different key.');
    } else if (error.message.includes('PERMISSION_DENIED') || error.message.includes('403')) {
      console.error('\n⚠️  PERMISSION DENIED');
      console.error('   → Enable Gemini API in Google Cloud Console');
    } else {
      console.error('\n⚠️  Unknown error occurred');
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  }
}

testAPI();
