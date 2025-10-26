import express from 'express';
import { getScholarships } from '../controllers/scholarshipController.js';

const router = express.Router();

router.route('/').get(getScholarships);

export default router;
