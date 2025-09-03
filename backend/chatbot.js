import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const router = express.Router();

// 🔹 Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 🔹 Chat Route
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ Just pass the string message
    const result = await model.generateContent(message);

    // Extract reply
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
