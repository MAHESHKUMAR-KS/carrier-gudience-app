// server.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

import careerRouter from './routes/careerRoutes.js';
import chatbotRouter from './chatbot.js';
import authRouter from './routes/authRoutes.js';
import collegeCutoffRouter from './routes/collegeCutoffRoutes.js';
import collegeRouter from './routes/collegeRoutes.js';
import engineeringExamsRouter from './routes/engineeringExamsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------- DEVELOPMENT LOGGING ----------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---------------- MIDDLEWARE ----------------

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// GLOBAL CACHE-CONTROL
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store'); // Prevent browser caching for all routes
  next();
});

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ---------------- MONGODB CONNECTION ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ---------------- API ROUTES ----------------
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/colleges', collegeRouter);
app.use('/api/v1/careers', careerRouter);
app.use('/api/v1/chatbot', chatbotRouter);
app.use('/api/v1/college-cutoffs', collegeCutoffRouter);
app.use('/api/v1/engineering-exams', engineeringExamsRouter);

// ---------------- HEALTH CHECK ----------------
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// ---------------- SERVE REACT IN PRODUCTION ----------------
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../my-app/build');
  app.use(express.static(buildPath));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// ---------------- ERROR HANDLING ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
