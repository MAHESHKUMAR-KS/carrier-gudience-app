// List available Gemini models for your API key
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('\n🔍 Checking Available Gemini Models...\n');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 20)}...` : 'NOT FOUND');

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env file!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    console.log('\n📡 Fetching available models...\n');
    
    const models = await genAI.listModels();
    
    console.log('✅ Available Models:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (models && models.length > 0) {
      models.forEach((model, index) => {
        console.log(`\n${index + 1}. ${model.name}`);
        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   Description: ${model.description || 'N/A'}`);
        if (model.supportedGenerationMethods) {
          console.log(`   Supported: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
    } else {
      console.log('⚠️  No models found for this API key');
      console.log('\n💡 This means:');
      console.log('   1. API key might be invalid');
      console.log('   2. Gemini API not enabled');
      console.log('   3. Need to activate API at: https://aistudio.google.com/');
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('\n❌ Error listing models:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
      console.error('\n❌ API KEY IS INVALID!');
      console.error('   → Get a valid key from: https://aistudio.google.com/app/apikey');
    } else if (error.message.includes('403')) {
      console.error('\n⚠️  API NOT ENABLED!');
      console.error('   → Enable Gemini API at: https://console.cloud.google.com/');
    } else {
      console.error('\n⚠️  Unknown error');
      console.error('   → Check: https://aistudio.google.com/');
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  }
}

listModels();
