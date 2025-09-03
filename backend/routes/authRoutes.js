import express from 'express';
import { signup, login, protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Example protected route
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user
  });
});

// Example admin-only route
router.get('/admin-only', protect, restrictTo('admin'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome Admin!'
  });
});

export default router;
