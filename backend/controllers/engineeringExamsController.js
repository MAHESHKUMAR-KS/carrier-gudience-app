import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getEligibleExams = async (req, res) => {
  try {
    const { marks } = req.query;
    if (!marks) {
      return res.status(400).json({
        status: 'fail',
        message: 'Marks query parameter is required',
      });
    }
    const marksNum = parseFloat(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      return res.status(400).json({
        status: 'fail',
        message: 'Marks must be a number between 0 and 100',
      });
    }

    const examsPath = path.join(__dirname, '../data/exams.json');
    const collegesPath = path.join(__dirname, '../data/colleges.json');

    const examsDataRaw = await fs.readFile(examsPath, 'utf-8');
    const collegesDataRaw = await fs.readFile(collegesPath, 'utf-8');

    const examsData = JSON.parse(examsDataRaw);
    const collegesData = JSON.parse(collegesDataRaw);

    // For each exam, list universities accepting that exam
    // Note: We now return ALL exams with metadata so the frontend can compute probabilities,
    // rather than filtering strictly by minMarks.
    const examsWithUniversities = examsData.map(exam => {
      const universities = collegesData.filter(college =>
        exam.universities.includes(college.name)
      ).map(college => ({
        id: college.id,
        name: college.name,
        location: college.location,
        cutoff: college.cutoff,
        fees: college.fees,
        rating: college.rating,
        specializations: college.specializations
      }));

      return {
        name: exam.name,
        minMarks: exam.minMarks,
        // Optional distribution metadata if available in data, with sensible defaults
        distribution: {
          mean: exam.mean ?? (exam.minMarks + 10),
          std: exam.std ?? 10,
          slope: exam.slope ?? 1.5,
        },
        universities
      };
    });

    res.status(200).json({
      status: 'success',
      data: examsWithUniversities
    });
  } catch (error) {
    console.error('Error fetching eligible exams:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch eligible exams',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
