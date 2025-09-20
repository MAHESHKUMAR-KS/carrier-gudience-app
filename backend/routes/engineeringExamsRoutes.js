import express from 'express';
import { getEligibleExams } from '../controllers/engineeringExamsController.js';

const router = express.Router();

router.get('/eligible', getEligibleExams);

export default router;
