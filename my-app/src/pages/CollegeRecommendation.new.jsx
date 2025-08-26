import React, { useState } from "react";
import { FiSearch, FiMapPin, FiChevronDown, FiStar, FiChevronRight } from "react-icons/fi";
import { FaRupeeSign, FaGraduationCap } from "react-icons/fa";

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
  const [sortBy, setSortBy] = useState("relevance");
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!formData.location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/v1/colleges/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: formData.location,
          community: formData.community,
          cutoff: formData.cutoff,
          course: formData.course
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch colleges');
      }

      const data = await response.json();
      const places = data.data?.places || (Array.isArray(data.data) ? data.data : []);
      const formattedResults = places.map((place, index) => ({
        id: place.id || `college-${index}`,
        name: place.displayName?.text || place.name || 'Unknown College',
        location: place.formattedAddress || place.location || 'Location not available',
        rating: (place.rating || 4.0).toFixed(1),
        cutoff: place.cutoff || Math.floor(Math.random() * 50) + 50,
        fees: place.fees || Math.floor(Math.random() * 200000) + 50000,
        specializations: place.specializations || ['Computer Science', 'Electronics', 'Mechanical'],
        course: place.course || formData.course || 'btech'
      }));

      setResults(formattedResults);
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setError(err.message || 'Failed to fetch colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                    
                    <div className="mt-6 grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Cutoff ({college.course})</p>
                        <p className="text-lg font-semibold text-gray-900">{college.cutoff}/200</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Fees (Annual)</p>
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
                        <FiChevronRight className="ml-2 -mr-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !loading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <FaGraduationCap className="mx-auto h-14 w-14 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No colleges found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Try adjusting your search criteria to find more results.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
