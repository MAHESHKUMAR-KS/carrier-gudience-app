// backend/routes/chatbot.js
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const router = express.Router();

// 🔹 Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash (newest model) with optimized settings
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 500,
    topP: 0.95,
    topK: 40
  }
});
console.log('✅ Gemini chatbot initialized with model: gemini-2.5-flash');

// Rate limiting: Track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
const requestQueue = [];
let isProcessing = false;

// Fallback responses for when API is unavailable
const fallbackResponses = {
  greeting: "Hello! I'm your career guidance assistant. I can help you with scholarship information, college recommendations, career advice, and exam eligibility. What would you like to know?",
  scholarship: "You can explore various scholarships on our Scholarships page. We have scholarships from Buddy4Study, Vidyasaarathi, and the National Scholarship Portal. You can filter by state (Tamil Nadu/All India), category, and source.",
  college: "I can help you find colleges! Please visit our College Search or College Recommendation pages where you can search based on your preferences, location, and courses.",
  career: "For career guidance, please visit our Careers page where you can explore different career paths, get recommendations based on your interests, and learn about various professions.",
  exam: "Check out our Exam Eligibility page to find information about various engineering and other competitive exams, their eligibility criteria, and important dates.",
  default: "I'm currently experiencing high demand. Please try again in a moment, or explore our Scholarships, College Search, Careers, and Exam Eligibility pages for detailed information."
};

function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return fallbackResponses.greeting;
  } else if (msg.includes('scholarship')) {
    return fallbackResponses.scholarship;
  } else if (msg.includes('college') || msg.includes('university')) {
    return fallbackResponses.college;
  } else if (msg.includes('career') || msg.includes('job')) {
    return fallbackResponses.career;
  } else if (msg.includes('exam') || msg.includes('eligibility')) {
    return fallbackResponses.exam;
  }
  return fallbackResponses.default;
}

// 🔹 POST /api/v1/chatbot/chat
router.post('/chat', async (req, res) => {
  console.log('Received chat request with body:', req.body);
  
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      console.log('Empty message received');
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    console.log('Processing message:', message);

    // Rate limiting check
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      console.log('Rate limit: Too many requests');
      return res.json({
        success: true,
        reply: getFallbackResponse(message),
        fallback: true,
        message: 'Using quick response due to high demand. Please wait a moment before your next question.'
      });
    }

    // Try to call Gemini AI with timeout
    try {
      lastRequestTime = now;
      
      // Set a timeout for the API call (increased to 15 seconds for complex queries)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      // Add context to improve response quality
      const prompt = `You are a helpful career guidance assistant. Answer the following question concisely and helpfully: ${message}`;
      const apiPromise = model.generateContent(prompt);
      
      const result = await Promise.race([apiPromise, timeoutPromise]);
      const reply = result.response.text();

      console.log('Generated reply:', reply);

      // Send back the reply
      return res.json({ 
        success: true,
        reply,
        fallback: false
      });
    } catch (apiError) {
      console.error('Gemini API error:', apiError.message);
      
      // Check if it's a rate limit error
      if (apiError.message && (apiError.message.includes('RATE_LIMIT_EXCEEDED') || 
          apiError.message.includes('429') || 
          apiError.message.includes('Quota exceeded'))) {
        console.log('Rate limit exceeded, using fallback response');
        return res.json({
          success: true,
          reply: getFallbackResponse(message),
          fallback: true,
          message: 'Our AI service is currently at capacity. Here\'s a quick response to help you.'
        });
      }
      
      // For other API errors, also use fallback
      console.log('API error, using fallback response');
      return res.json({
        success: true,
        reply: getFallbackResponse(message),
        fallback: true,
        message: 'Using quick response. The AI service will be back shortly.'
      });
    }
  } catch (err) {
    console.error('Chatbot error:', err);
    
    // Even on server error, provide a helpful fallback
    return res.json({ 
      success: true,
      reply: getFallbackResponse(req.body.message || ''),
      fallback: true,
      message: 'Experiencing technical difficulties. Here\'s some helpful information.'
    });
  }
});

export default router;
