import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

// Send token + user data
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password before sending
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match!'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email!'
      });
    }

    const newUser = await User.create({ name, email, password });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password!'
      });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// PROTECT middleware
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not logged in! Please log in.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'User belonging to this token no longer exists.'
      });
    }

    req.user = currentUser;
    next();
  } catch {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token!'
    });
  }
};

// ROLE-BASED access
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};
