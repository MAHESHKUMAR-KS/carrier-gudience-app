// controllers/collegeCutoffController.js
import CollegeCutoff from '../models/CollegeCutoff.js';
import fs from 'fs/promises';
import path from 'path';

// ---------------- SEARCH COLLEGES ----------------
export const searchCollegesByCutoff = async (req, res) => {
  try {
    const { course, community, marks, location, limit = 10, source = 'db' } = req.query;

    if (!course || !community || !marks) {
      return res.status(400).json({ status: 'fail', message: 'Course, community, and marks are required' });
    }

    const marksNum = parseFloat(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 200) {
      return res.status(400).json({ status: 'fail', message: 'Marks must be between 0 and 200' });
    }

    const communityMap = {
      oc: 'oc', 'open category': 'oc',
      bc: 'bc', 'backward class': 'bc',
      mbc: 'mbc', 'most backward class': 'mbc',
      sc: 'sc', 'scheduled caste': 'sc',
      st: 'st', 'scheduled tribe': 'st',
      ews: 'ews', 'economically weaker section': 'ews',
    };
    const dbCommunity = communityMap[community.toLowerCase()] || 'oc';
    const normalizedCourse = course.toLowerCase().replace(/[^a-z0-9]/g, '');
    const resolvedCity = location?.trim();

    // ---------- Excel source ----------
    if (source === 'excel') {
      const dataPath = path.join(process.cwd(), 'data', 'college_search.json');
      try {
        const raw = await fs.readFile(dataPath, 'utf-8');
        const json = JSON.parse(raw);
        const cityRegex = resolvedCity ? new RegExp(resolvedCity, 'i') : null;

        const filtered = json
          .filter(c => {
            // Check if college name contains the city (since location is in college name)
            const locationMatch = !cityRegex || cityRegex.test(c['COLLEGE NAME']);
            // Check if the specific community cutoff exists and user marks are >= cutoff
            const communityCutoff = c[dbCommunity.toUpperCase()];
            const cutoffMatch = communityCutoff !== null && communityCutoff !== undefined && marksNum >= parseFloat(communityCutoff);
            return locationMatch && cutoffMatch;
          });

        console.log('Filtered Excel results count:', filtered.length);
        console.log('Sample filtered result:', filtered[0]);
        console.log('Community being searched:', dbCommunity);
        console.log('Marks being searched:', marksNum);

        const limited = filtered
          .map(c => {
            const communityCutoff = c[dbCommunity.toUpperCase()];
            return {
              id: c['COLLEGE\nCODE'],
              name: c['COLLEGE NAME'],
              location: c['COLLEGE NAME'], // Location is embedded in college name
              cutoff: parseFloat(communityCutoff || 0),
              fees: 0, // Not available in your data
              course: c['BRANCH NAME'],
              community: dbCommunity.toUpperCase(),
              specializations: [c['BRANCH NAME']],
              isEligible: marksNum >= parseFloat(communityCutoff || Infinity),
              difference: parseFloat((marksNum - (parseFloat(communityCutoff) || 0)).toFixed(2)),
              website: '',
              contact: '',
            };
          })
          .sort((a, b) => a.cutoff - b.cutoff)
          .slice(0, parseInt(limit, 10));

        return res.status(200).json({ status: 'success', results: limited.length, data: limited });
      } catch (e) {
        console.warn('Excel source failed, falling back to DB:', e.message);
      }
    }

    // ---------- MongoDB search ----------
    const query = {
      [`cutoffs.${normalizedCourse}.${dbCommunity}`]: { $lte: marksNum },
      ...(resolvedCity && { location: new RegExp(resolvedCity, 'i') }),
    };

    const colleges = await CollegeCutoff.find(query).limit(parseInt(limit, 10));

    const results = colleges
      .map(college => {
        // Handle MongoDB Map structure
        const courseCutoffs = college.cutoffs?.get?.(normalizedCourse);
        const cutoff = courseCutoffs?.[dbCommunity] ?? courseCutoffs?.general;
        if (!cutoff) return null; // skip if cutoff is missing
        return {
          id: college._id,
          name: college.collegeName,
          location: college.location,
          rating: college.rating || 0,
          cutoff,
          fees: college.fees || 0,
          course: course.toUpperCase(),
          community: dbCommunity.toUpperCase(),
          specializations: college.specializations || [],
          isEligible: marksNum >= cutoff,
          difference: parseFloat((marksNum - cutoff).toFixed(2)),
          website: college.website || '',
          contact: college.contact || '',
        };
      })
      .filter(Boolean);

    console.log('Final mapped results:', results);

    return res.status(200).json({ status: 'success', results: results.length, data: results });

  } catch (error) {
    console.error('Error searching colleges by cutoff:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to search colleges',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ---------------- GET COLLEGE CUTOFF ----------------
export const getCollegeCutoff = async (req, res) => {
  try {
    const { collegeId } = req.query;
    
    if (!collegeId) {
      return res.status(400).json({ status: 'fail', message: 'College ID is required' });
    }

    const college = await CollegeCutoff.findById(collegeId);
    
    if (!college) {
      return res.status(404).json({ status: 'fail', message: 'College not found' });
    }

    return res.status(200).json({ status: 'success', data: college });
  } catch (error) {
    console.error('Error getting college cutoff:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get college cutoff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ---------------- UPDATE COLLEGE CUTOFF ----------------
export const updateCollegeCutoff = async (req, res) => {
  try {
    const { collegeId, course, community, cutoff } = req.body;
    
    if (!collegeId || !course || !community || cutoff === undefined) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'College ID, course, community, and cutoff are required' 
      });
    }

    const college = await CollegeCutoff.findById(collegeId);
    
    if (!college) {
      return res.status(404).json({ status: 'fail', message: 'College not found' });
    }

    // Update the cutoff for the specific course and community
    if (!college.cutoffs) {
      college.cutoffs = new Map();
    }
    
    if (!college.cutoffs.has(course)) {
      college.cutoffs.set(course, {});
    }
    
    const courseCutoffs = college.cutoffs.get(course);
    courseCutoffs[community] = cutoff;
    
    await college.save();

    return res.status(200).json({ 
      status: 'success', 
      message: 'Cutoff updated successfully',
      data: college 
    });
  } catch (error) {
    console.error('Error updating college cutoff:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update college cutoff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ---------------- RUN PYTHON SCRIPT ----------------
export const runPythonScript = async (req, res) => {
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    // Run the Python script
    const { stdout, stderr } = await execAsync('python script.py');
    
    return res.status(200).json({ 
      status: 'success', 
      message: 'Python script executed successfully',
      output: stdout,
      error: stderr || null
    });
  } catch (error) {
    console.error('Error running Python script:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to run Python script',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
