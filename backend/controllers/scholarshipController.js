import Scholarship from '../models/Scholarship.js';

// @desc    Get all scholarships with filtering
// @route   GET /api/scholarships
// @route   GET /api/scholarships?state=Tamil%20Nadu
// @route   GET /api/scholarships?category=Merit-based
// @route   GET /api/scholarships?source=Buddy4Study
// @access  Public
export const getScholarships = async (req, res) => {
  try {
    const { state, category, source, search } = req.query;
    const filter = {};

    // State filter (case-insensitive)
    if (state) {
      filter.state = new RegExp(state, 'i');
    }

    // Category filter (case-insensitive)
    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    // Source filter (exact match)
    if (source) {
      filter.source = source;
    }

    // Search filter (searches in name, provider, and description)
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { provider: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    console.log('Fetching scholarships with filter:', filter);
    
    // Fetch scholarships sorted by most recent first
    const scholarships = await Scholarship.find(filter)
      .sort({ updatedAt: -1 })
      .lean();
    
    console.log(`Found ${scholarships.length} scholarships.`);
    
    // Log the first scholarship to see its structure (for debugging)
    if (scholarships.length > 0) {
      console.log('Sample scholarship:', JSON.stringify(scholarships[0], null, 2));
    }

    // Group by state for summary
    const summary = {
      total: scholarships.length,
      byState: {},
      bySource: {},
      byCategory: {}
    };

    scholarships.forEach(s => {
      summary.byState[s.state] = (summary.byState[s.state] || 0) + 1;
      summary.bySource[s.source] = (summary.bySource[s.source] || 0) + 1;
      summary.byCategory[s.category] = (summary.byCategory[s.category] || 0) + 1;
    });

    res.status(200).json({ 
      success: true, 
      count: scholarships.length,
      summary,
      data: scholarships 
    });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error',
      message: error.message 
    });
  }
};

