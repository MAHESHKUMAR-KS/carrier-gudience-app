import express from 'express';
import { updateCollegeCutoff, getCollegeCutoff, searchCollegesByCutoff, runPythonScript } from '../controllers/collegeCutoffController.js';

const router = express.Router();

router.post('/update-cutoff', updateCollegeCutoff);
router.get('/get-cutoff', getCollegeCutoff);
router.get('/search', searchCollegesByCutoff);
router.get('/run-python', runPythonScript); // <-- NEW

export default router;
