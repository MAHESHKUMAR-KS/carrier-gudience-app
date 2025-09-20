// backend/routes/chatbot.js
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const router = express.Router();

// 🔹 Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    // Call Gemini AI to generate a response
    const result = await model.generateContent(message);
    const reply = result.response.text();

    console.log('Generated reply:', reply);

    // Send back the reply
    res.json({ 
      success: true,
      reply 
    });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get a response from chatbot', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;
