import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiChevronDown, FiFilter, FiStar, FiCheck, FiX, FiChevronRight } from "react-icons/fi";
import { FaRupeeSign, FaGraduationCap, FaSchool } from "react-icons/fa";

const STREAM_SUBJECTS = {
  Engineering: ["Physics", "Chemistry", "Maths"],
};

export default function CollegeRecommendation() {
  const [formData, setFormData] = useState({
    location: "",
    community: "oc",
    cutoff: "",
    course: "btech",
    stream: "Engineering",
    marks: {},
    twelfthMarks: ""
  });
  
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const communities = [
    { value: 'oc', label: 'OC (Open Category)' },
    { value: 'bc', label: 'BC (Backward Class)' },
    { value: 'mbc', label: 'MBC (Most Backward Class)' },
    { value: 'sc', label: 'SC (Scheduled Caste)' },
    { value: 'st', label: 'ST (Scheduled Tribe)' },
    { value: 'ews', label: 'EWS (Economically Weaker Section)' }
  ];
  
  const courses = [
    { value: 'btech', label: 'B.Tech' },
    { value: 'barch', label: 'B.Arch' },
    { value: 'mtech', label: 'M.Tech' },
    { value: 'mba', label: 'MBA' }
  ];
  
  const ownershipTypes = [
    { id: 'govt', label: 'Government' },
    { id: 'private', label: 'Private' },
    { id: 'deemed', label: 'Deemed University' },
    { id: 'autonomous', label: 'Autonomous' }
  ];
  
  const specializations = [
    'Computer Science', 'Mechanical', 'Civil',
    'Electronics', 'Electrical', 'Aerospace',
    'Biotechnology', 'Chemical', 'AI & ML'
  ];

  useEffect(() => {
    // Load initial data if needed
    if (formData.location) {
      // TODO: Load colleges based on location
    }
  }, [formData.location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "stream" && { marks: {} }),
    }));
  };

  const handleMarksChange = (subject, value) => {
    setFormData(prev => {
      // Ensure marks exists and is an object
      const currentMarks = prev.marks || {};
      
      // Only update if the value is a valid number between 0-100 or empty string
      const newValue = (value === '' || (Number(value) >= 0 && Number(value) <= 100)) ? value : currentMarks[subject] || '';
      
      return {
        ...prev,
        marks: {
          ...currentMarks,
          [subject]: newValue
        }
      };
    });
  };

  const FinancialBadge = ({ score }) => {
    let colorClass = "";
    let label = "";

    if (score >= 8) {
      colorClass = "bg-green-100 text-green-800";
      label = "Stable";
    } else if (score >= 5) {
      colorClass = "bg-yellow-100 text-yellow-800";
      label = "Moderate";
    } else {
      colorClass = "bg-red-100 text-red-800";
      label = "Limited";
    }

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
      >
        {label} • {score}/10
      </span>
    );
  };

  // 🔹 Mock Data with Financial Score + Sorting
  const searchColleges = useCallback(async () => {
    if (!formData.location) {
      setError('Please enter a location to search for colleges');
      return [];
    }
    
    // If we have cutoff data, search by cutoff first
    if (formData.twelfthMarks) {
      try {
        const response = await fetch(`http://localhost:5001/api/v1/college-cutoffs/search?location=${encodeURIComponent(formData.location)}&course=${formData.course}&community=${formData.community}&marks=${formData.twelfthMarks}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.data?.length > 0) {
          return data.data.map(college => ({
            ...college,
            name: college.collegeName,
            courses: [formData.course.toUpperCase()],
            matchScore: 100 - ((college.difference / 100) * 100), // Calculate match score based on cutoff difference
            financialDetails: {
              annualRevenue: 100 + Math.floor(Math.random() * 100),
              fundingSources: ["Private Trust", "Student Fees"],
              score: 7 + Math.floor(Math.random() * 3),
            },
            fees: { 
              min: 50000 + Math.floor(Math.random() * 100000), 
              max: 150000 + Math.floor(Math.random() * 200000), 
              currency: "INR" 
            },
            rating: (Math.random() * 2 + 3).toFixed(1)
          }));
        }
      } catch (err) {
        console.error('Error searching by cutoff:', err);
        // Fall through to regular search if cutoff search fails
      }
    }

    setSearching(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5001/api/v1/colleges/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: formData.location
        })
      });
      
      const data = await response.json();
      
      if (!response.ok || data.status !== 'success') {
        console.error('API Error:', data);
        throw new Error(data.message || 'Failed to fetch colleges. Please try again.');
      }

      if (!data.data?.colleges?.length) {
        console.warn('No colleges found for location:', formData.location);
        return [];
      }

      // Transform API data to match our frontend format
      return data.data.colleges.map((college, index) => ({
        id: college.place_id || `college-${index}`,
        name: college.name || 'Unknown College',
        location: college.address || formData.location,
        courses: [
          `B.Sc in ${formData.stream}`,
          `B.Tech in ${formData.stream}`,
          `B.A. in ${formData.stream}`
        ],
        matchScore: Math.floor(Math.random() * 30) + 70,
        cutoff: 70 + Math.floor(Math.random() * 30),
        financialDetails: {
          annualRevenue: 100 + Math.floor(Math.random() * 100),
          fundingSources: ["Private Trust", "Student Fees"],
          score: 7 + Math.floor(Math.random() * 3),
        },
        fees: { 
          min: 50000 + Math.floor(Math.random() * 100000), 
          max: 150000 + Math.floor(Math.random() * 200000), 
          currency: "INR" 
        },
        rating: college.rating || (Math.random() * 2 + 3).toFixed(1),
        placeId: college.place_id,
        coordinates: college.location
      }));
    } catch (err) {
      console.error('Error searching colleges:', err);
      setError('Failed to fetch colleges. Please try again later.');
      return [];
    } finally {
      setSearching(false);
    }
  }, [formData.location, formData.stream]);

  const validateForm = () => {
    if (!formData.twelfthMarks || isNaN(formData.twelfthMarks) || formData.twelfthMarks < 0 || formData.twelfthMarks > 100) {
      setError("Please enter a valid 12th standard percentage (0-100)");
      return false;
    }
    
    const subjectMarks = Object.values(formData.marks);
    if (subjectMarks.length !== STREAM_SUBJECTS[formData.stream].length) {
      setError("Please enter marks for all subjects");
      return false;
    }
    
    const invalidMarks = subjectMarks.some(mark => 
      mark === "" || isNaN(mark) || mark < 0 || mark > 100
    );
    
    if (invalidMarks) {
      setError("Please enter valid marks (0-100) for all subjects");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    setResults([]); // Clear previous results
    
    try {
      const colleges = await searchColleges();
      if (colleges.length === 0) {
        setError('No colleges found for the specified location. Try a different location.');
      } else {
        setResults(colleges);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to fetch colleges. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add more college options with different locations and community cutoffs
  const allColleges = [
    {
      id: 1,
      name: `${formData.stream} College of Excellence`,
      location: formData.location || 'Major City',
      courses: [
        `B.Sc in ${formData.stream}`, 
        `B.Tech in ${formData.stream}`, 
        `B.A. in ${formData.stream}`,
        'BBA',
        'BCA'
      ],
      matchScore: Math.floor(Math.random() * 30) + 70,
      cutoffDetails: {
        general: 90 + Math.floor(Math.random() * 5),
        obc: 85 + Math.floor(Math.random() * 5),
        sc: 80 + Math.floor(Math.random() * 5),
        st: 75 + Math.floor(Math.random() * 5),
        ews: 88 + Math.floor(Math.random() * 5)
      },
      financialDetails: {
        annualRevenue: 100 + Math.floor(Math.random() * 100),
        fundingSources: ["Private Trust", "Student Fees"],
        score: 8 + Math.floor(Math.random() * 3),
      },
      fees: { min: 50000, max: 150000, currency: "INR" },
      rating: (Math.random() * 2 + 3).toFixed(1),
    },
    {
      id: 2,
      name: "National Institute of Technology",
      location: formData.location || "State Capital",
      courses: ["B.Tech", "M.Tech", "Ph.D", "B.Arch", "M.Sc"],
      matchScore: Math.floor(Math.random() * 20) + 60,
      cutoffDetails: {
        general: 95 + Math.floor(Math.random() * 5),
        obc: 90 + Math.floor(Math.random() * 5),
        sc: 85 + Math.floor(Math.random() * 5),
        st: 80 + Math.floor(Math.random() * 5),
        ews: 92 + Math.floor(Math.random() * 5)
      },
      financialDetails: {
        annualRevenue: 200 + Math.floor(Math.random() * 100),
        fundingSources: ["Government", "Research Grants", "Fees"],
        score: 9 + Math.floor(Math.random() * 2),
      },
      fees: { min: 100000, max: 250000, currency: "INR" },
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    },
    {
      id: 3,
      name: `${formData.stream} University`,
      location: 'Bangalore',
      courses: [
        `B.Sc in ${formData.stream}`, 
        `M.Sc in ${formData.stream}`,
        'BCA',
        'BBA',
        'B.Com',
        'BA'
      ],
      matchScore: Math.floor(Math.random() * 25) + 65,
      cutoffDetails: {
        general: 85 + Math.floor(Math.random() * 5),
        obc: 80 + Math.floor(Math.random() * 5),
        sc: 75 + Math.floor(Math.random() * 5),
        st: 70 + Math.floor(Math.random() * 5),
        ews: 82 + Math.floor(Math.random() * 5)
      },
      financialDetails: {
        annualRevenue: 150 + Math.floor(Math.random() * 100),
        fundingSources: ["Private", "Grants"],
        score: 8 + Math.floor(Math.random() * 2),
      },
      fees: { min: 60000, max: 180000, currency: "INR" },
      rating: (Math.random() * 1.8 + 3.2).toFixed(1),
    },
    {
      id: 4,
      name: `Metro ${formData.stream} College`,
      location: 'Delhi',
      courses: [
        `B.A. in ${formData.stream}`, 
        `M.A. in ${formData.stream}`,
        'BBA',
        'B.Com',
        'BMS'
      ],
      matchScore: Math.floor(Math.random() * 20) + 60,
      cutoffDetails: {
        general: 80 + Math.floor(Math.random() * 5),
        obc: 75 + Math.floor(Math.random() * 5),
        sc: 70 + Math.floor(Math.random() * 5),
        st: 65 + Math.floor(Math.random() * 5),
        ews: 78 + Math.floor(Math.random() * 5)
      },
      financialDetails: {
        annualRevenue: 120 + Math.floor(Math.random() * 80),
        fundingSources: ["Government Aided", "Fees"],
        score: 7 + Math.floor(Math.random() * 2),
      },
      fees: { min: 40000, max: 120000, currency: "INR" },
      rating: (Math.random() * 1.6 + 3.0).toFixed(1),
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.cutoff) {
      setError('Please enter your cutoff marks');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Use Vite environment variable for API URL with fallback to localhost:5001
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      // Prepare query parameters
      const params = new URLSearchParams({
        course: formData.course || 'btech',
        community: formData.community || 'oc',
        marks: formData.cutoff,
        limit: 10
      });
      
      // Add location if provided
      if (formData.location?.trim()) {
        params.append('location', formData.location.trim());
      }
      
      const url = `${API_BASE_URL}/api/v1/college-cutoffs/search?${params.toString()}`;
      console.log('API Request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        let errorMessage = 'Failed to fetch colleges';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Check if we have valid data
      if (!data || !Array.isArray(data.data)) {
        console.error('Invalid response format - expected data.data to be an array');
        throw new Error('Invalid response format from server');
      }
      
      // Transform the data to match the expected format
      const processedResults = data.data.map(college => {
        // Get the cutoff value for the selected community and course
        const communityKey = formData.community ? 
          formData.community.toLowerCase().replace(/[^a-z0-9]/g, '') : 'oc';
        const courseKey = formData.course ? 
          formData.course.toLowerCase().replace(/[^a-z0-9]/g, '') : 'btech';
        
        const cutoffValue = college.cutoffs?.[courseKey]?.[communityKey] || 
                          college.cutoffs?.[courseKey]?.general || 0;
        
        return {
          id: college.placeId || college._id || `college-${Math.random().toString(36).substr(2, 9)}`,
          name: college.name || 'Unknown College',
          location: college.location || 'Location not available',
          rating: college.rating?.toFixed?.(1) || 'N/A',
          cutoff: cutoffValue,
          fees: college.fees || 0,
          course: formData.course || 'B.Tech',
          specializations: college.specializations || [],
          isEligible: college.isEligible,
          difference: college.difference || 0
        };
      });
      
      console.log('Processed Results:', processedResults);
      setResults(processedResults);
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setError(error.message || 'An error occurred while searching for colleges');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleFilter = (filterType, value) => {
    setFilters(prev => {
      const currentFilters = [...prev[filterType]];
      const index = currentFilters.indexOf(value);
      
      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }
      
      return { ...prev, [filterType]: currentFilters };
    });
  };
  
  const FilterSection = ({ title, children, isOpen = true }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
  
  const CollegeCard = ({ college }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{college.name}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <FiMapPin className="mr-1" />
              <span>{college.location}</span>
            </div>
          </div>
          <div className="flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="font-medium">{college.rating}</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Cutoff ({college.course})</p>
            <p className="font-medium">{college.cutoff}/200</p>
          </div>
          <div>
            <p className="text-gray-500">Fees (Annual)</p>
            <p className="font-medium">
              <FaRupeeSign className="inline mr-1" />
              {college.fees.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-500 text-sm mb-1">Specializations</p>
          <div className="flex flex-wrap gap-2">
            {college.specializations.slice(0, 3).map((spec, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {spec}
              </span>
            ))}
            {college.specializations.length > 3 && (
              <span className="text-blue-600 text-xs px-2 py-1">+{college.specializations.length - 3} more</span>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors">
            View Details
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream College</h1>
          <p className="text-gray-600">Get personalized college recommendations based on your preferences</p>
        </div>
        
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              {/* Community */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Community</label>
                <div className="relative">
                  <select
                    name="community"
                    value={formData.community}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {communities.map(community => (
                      <option key={community.value} value={community.value}>
                        {community.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Cutoff */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cutoff Marks</label>
                <div className="relative">
                  <input
                    type="number"
                    name="cutoff"
                    min="0"
                    max="200"
                    value={formData.cutoff}
                    onChange={handleChange}
                    placeholder="Enter cutoff marks"
                    className="block w-full pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">/ 200</span>
                  </div>
                </div>
              </div>
              
              {/* Course */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <div className="relative">
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {courses.map(course => (
                      <option key={course.value} value={course.value}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <FiSearch className="-ml-1 mr-2 h-5 w-5" />
                    Search Colleges
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Results Section */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <FiX className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {results.length} {results.length === 1 ? 'College' : 'Colleges'} Found
              </h2>
              <div className="w-full sm:w-auto flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
                <div className="relative w-full sm:w-40">
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="cutoff">Cutoff</option>
                    <option value="fees">Fees</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {results.map((college) => (
                <div key={college.id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="pr-4">
                        <h3 className="text-xl font-semibold text-gray-900">{college.name}</h3>
                        <p className="mt-1.5 flex items-center text-sm text-gray-600">
                          <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {college.location}
                        </p>
                      </div>
                      <div className="flex items-center bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg">
                        <FiStar className="text-yellow-400 mr-1.5" />
                        <span className="font-medium text-sm">{college.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Cutoff ({college.course})</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {college.cutoff}/200
                        </p>
                        {college.isEligible !== undefined && (
                          <p className={`text-sm ${college.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                            {college.isEligible ? '✅ Eligible' : '❌ Not Eligible'}
                            {college.difference !== 0 && (
                              <span className="ml-2 text-xs text-gray-500">
                                ({college.difference > 0 ? '+' : ''}{college.difference} marks)
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Fees (Annual)</p>
                        <p className="text-lg font-semibold text-gray-900">
                          <FaRupeeSign className="inline mr-1 -mt-1" />
                          {college.fees?.toLocaleString?.('en-IN') || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {college.specializations?.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 mb-2">Specializations</p>
                        <div className="flex flex-wrap gap-2">
                          {college.specializations.slice(0, 3).map((spec, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              {spec}
                            </span>
                          ))}
                          {college.specializations.length > 3 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{college.specializations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <FaGraduationCap className="mx-auto h-14 w-14 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No colleges found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Try adjusting your search criteria to find more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
