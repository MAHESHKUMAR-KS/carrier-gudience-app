import express from 'express';
import Career from '../models/Career.js';

console.log('careerRoutes.js: Loading routes...');
const router = express.Router();

// GET all careers
router.get('/', async (req, res) => {
  try {
    const careers = await Career.find();
    res.json(careers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new career
router.post('/', async (req, res) => {
  const { title, description, degreeRequired, careerPath, skillsRequired } = req.body;
  const career = new Career({ title, description, degreeRequired, careerPath, skillsRequired });

  try {
    const newCareer = await career.save();
    res.status(201).json(newCareer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
