import CollegeCutoff from '../models/CollegeCutoff.js';

export const updateCollegeCutoff = async (req, res) => {
  try {
    const { placeId, collegeName, location, course, cutoffs } = req.body;
    
    const updateData = {
      collegeName,
      location,
      $set: {
        [`cutoffs.${course}`]: cutoffs,
        lastUpdated: new Date()
      }
    };

    const options = { upsert: true, new: true };
    
    const updatedCutoff = await CollegeCutoff.findOneAndUpdate(
      { placeId },
      updateData,
      options
    );

    res.status(200).json({
      status: 'success',
      data: updatedCutoff
    });
  } catch (error) {
    console.error('Error updating college cutoff:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update college cutoff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getCollegeCutoff = async (req, res) => {
  try {
    const { placeId, course, community, marks } = req.query;
    
    const query = { placeId };
    if (course) query[`cutoffs.${course}`] = { $exists: true };
    
    const college = await CollegeCutoff.findOne(query);
    
    if (!college) {
      return res.status(404).json({
        status: 'fail',
        message: 'College cutoff data not found'
      });
    }

    let result = { ...college.toObject() };
    
    // Filter by course if specified
    if (course) {
      const courseCutoff = college.cutoffs.get(course);
      if (courseCutoff) {
        result.cutoff = courseCutoff;
        
        // Check if marks meet the cutoff for the specified community
        if (community && marks) {
          const communityCutoff = courseCutoff[community.toLowerCase()] || courseCutoff.general;
          result.meetsCutoff = marks >= communityCutoff;
          result.cutoffStatus = {
            community,
            requiredCutoff: communityCutoff,
            studentMarks: parseFloat(marks),
            isEligible: marks >= communityCutoff
          };
        }
      }
    }

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Error fetching college cutoff:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch college cutoff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const searchCollegesByCutoff = async (req, res) => {
  try {
    const { course, community, marks, location, limit = 10 } = req.query;
    
    if (!course || !community || !marks) {
      return res.status(400).json({
        status: 'fail',
        message: 'Course, community, and marks are required parameters'
      });
    }

    const query = {};
    
    // Add location filter if provided
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    // Add course filter
    query[`cutoffs.${course}.${community.toLowerCase()}`] = { $lte: parseFloat(marks) };
    
    const colleges = await CollegeCutoff.find(query)
      .sort({ [`cutoffs.${course}.${community.toLowerCase()}`]: 1 })
      .limit(parseInt(limit));
    
    // Add eligibility status to each college
    const results = colleges.map(college => {
      const collegeObj = college.toObject();
      const cutoff = college.cutoffs.get(course);
      const communityCutoff = cutoff[community.toLowerCase()] || cutoff.general;
      
      return {
        ...collegeObj,
        cutoff: communityCutoff,
        isEligible: parseFloat(marks) >= communityCutoff,
        difference: parseFloat(marks) - communityCutoff
      };
    });

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error searching colleges by cutoff:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search colleges by cutoff',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
