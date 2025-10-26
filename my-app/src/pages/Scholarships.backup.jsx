import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        console.log('Fetching scholarships...');
        const response = await axios.get('http://localhost:5001/api/scholarships', {
          params: { state, category },
        });
        console.log('API Response:', response.data);
        
        if (response.data && response.data.data) {
          setScholarships(response.data.data);
        } else {
          console.warn('Unexpected API response structure:', response.data);
          setScholarships([]);
        }
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch scholarships. Please try again later.';
        setError(errorMessage);
        console.error('Error fetching scholarships:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [state, category]);

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  // Get unique states and categories for filter dropdowns
  const states = [...new Set(scholarships.map(s => s.state).filter(Boolean))].sort();
  const categories = [...new Set(scholarships.map(s => s.category).filter(Boolean))].sort();

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">All-India Scholarships</h1>
      
      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select 
            id="state"
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        
        <div className="w-full sm:w-1/3">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            id="category"
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="border-4 border-gray-200 w-12 h-12 rounded-full border-t-blue-500 border-r-blue-500 animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && scholarships.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No scholarships found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}

      {/* Scholarships Grid */}
      {!loading && !error && scholarships.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <div key={scholarship._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {scholarship.category || 'General'}
                  </span>
                  <span className="text-sm text-gray-500">{scholarship.state || 'All India'}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{scholarship.title}</h2>
                
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  {scholarship.provider && (
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-medium">Provider:</span> {scholarship.provider}</span>
                    </div>
                  )}
                  
                  {scholarship.eligibility && (
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-medium">Eligibility:</span> {scholarship.eligibility}</span>
                    </div>
                  )}
                  
                  {scholarship.benefits && (
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.616 1.16 2.853 1.16V16a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 14.766 14 13.991 14 13c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.849V7.907a2.5 2.5 0 00.83-1.24 1 1 0 10-.93-1.32 4.5 4.5 0 00-.9 1.27V5z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-medium">Benefits:</span> {scholarship.benefits}</span>
                    </div>
                  )}
                  
                  {scholarship.lastDate && (
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-medium">Last Date:</span> {formatDate(scholarship.lastDate)}</span>
                    </div>
                  )}
                </div>
                
                {scholarship.applyLink && (
                  <div className="mt-6">
                    <a 
                      href={scholarship.applyLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Apply Now
                      <svg className="ml-2 -mr-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scholarships;
