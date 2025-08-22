import express from 'express';
import { signup, login, protect } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (example)
// router.get('/me', protect, getMe);

export default router;
