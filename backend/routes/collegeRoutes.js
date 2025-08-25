import express from 'express';
import { searchColleges } from '../controllers/collegeController.js';

const router = express.Router();

router.post('/search', searchColleges);

export default router;
