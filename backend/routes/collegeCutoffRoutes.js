import express from 'express';
import { 
  updateCollegeCutoff, 
  getCollegeCutoff, 
  searchCollegesByCutoff 
} from '../controllers/collegeCutoffController.js';

const router = express.Router();

// Update or create college cutoff data
router.post('/', updateCollegeCutoff);

// Get cutoff data for a specific college and course
router.get('/', getCollegeCutoff);

// Search colleges by cutoff criteria
router.get('/search', searchCollegesByCutoff);

export default router;
