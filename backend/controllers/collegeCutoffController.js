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
    
    // Input validation
    if (!course || !community || !marks) {
      return res.status(400).json({
        status: 'fail',
        message: 'Course, community, and marks are required parameters'
      });
    }

    // Convert marks to number
    const marksNum = parseFloat(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 200) {
      return res.status(400).json({
        status: 'fail',
        message: 'Marks must be a number between 0 and 200'
      });
    }

    // Normalize community names
    const communityMap = {
      "oc": "oc",
      "open category": "oc",
      "bc": "bc",
      "backward class": "bc",
      "mbc": "mbc",
      "most backward class": "mbc",
      "sc": "sc",
      "scheduled caste": "sc",
      "st": "st",
      "scheduled tribe": "st",
      "ews": "ews",
      "economically weaker section": "ews"
    };
    
    const dbCommunity = communityMap[community.toLowerCase()] || 'oc';

    // Normalize course names (B.Tech -> btech)
    const normalizedCourse = course.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    console.log('Search parameters:', { 
      course, 
      normalizedCourse, 
      community, 
      dbCommunity, 
      marks: marksNum 
    });

    const query = {};

    // Add location filter if provided
    if (location && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Build the query for cutoff scores using $where since cutoffs is a Map
    query.$where = `this.cutoffs && this.cutoffs['${normalizedCourse}'] && (this.cutoffs['${normalizedCourse}']['${dbCommunity}'] !== undefined && this.cutoffs['${normalizedCourse}']['${dbCommunity}'] <= ${marksNum} || this.cutoffs['${normalizedCourse}']['general'] !== undefined && this.cutoffs['${normalizedCourse}']['general'] <= ${marksNum})`;

    console.log('MongoDB Query:', JSON.stringify(query, null, 2));

    // Execute the query with projection to only return necessary fields
    const colleges = await CollegeCutoff.find(
      query,
      {
        collegeName: 1,
        location: 1,
        rating: 1,
        cutoffs: 1,
        fees: 1,
        specializations: 1,
        website: 1,
        contact: 1
      }
    )
    .sort({ collegeName: 1 })
    .limit(parseInt(limit, 10) || 10)
    .lean();
    
    console.log(`Found ${colleges.length} colleges matching criteria`);
    
    // Process and enhance the results
    const results = [];

    colleges.forEach(college => {
      // Find the matching cutoff for the course
      const cutoff = college.cutoffs?.get(normalizedCourse);
      if (!cutoff) return; // Skip if no cutoff for this course

      // Get the cutoff value for the community or fallback to general
      const communityCutoff = cutoff[dbCommunity] || cutoff.general;
      if (communityCutoff === undefined) return; // Skip if no cutoff for this community

      const isEligible = marksNum >= communityCutoff;
      const difference = parseFloat((marksNum - communityCutoff).toFixed(2));

      results.push({
        id: college._id || `college-${Math.random().toString(36).substr(2, 9)}`,
        name: college.collegeName || 'Unknown College',
        location: college.location || 'Location not specified',
        rating: college.rating || 0,
        cutoff: communityCutoff,
        fees: college.fees || 0,
        course: course.toUpperCase(),
        community: dbCommunity.toUpperCase(),
        specializations: Array.isArray(college.specializations) ? college.specializations : [],
        isEligible,
        difference,
        website: college.website || '',
        contact: college.contact || ''
      });
    });
    
    // Return the results
    return res.status(200).json({
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
