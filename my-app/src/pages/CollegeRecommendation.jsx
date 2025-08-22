import React, { useState } from 'react';

function CollegeRecommendation() {
  const [interest, setInterest] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    const mockRecommendations = [
      { id: 1, name: 'Tech University', location: 'Silicon Valley', programs: 'Computer Science, Engineering' },
      { id: 2, name: 'State University', location: 'New York', programs: 'Business, Arts, Sciences' },
      { id: 3, name: 'Liberal Arts College', location: 'Boston', programs: 'Humanities, Social Sciences' },
    ];
    setRecommendations(mockRecommendations);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">College Recommendations</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Find Your Perfect College</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
              What are you interested in studying?
            </label>
            <input
              type="text"
              id="interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Computer Science, Business, Medicine"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Find Colleges
          </button>
        </form>
      </div>

      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recommended Colleges</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((college) => (
              <div key={college.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{college.name}</h3>
                <p className="text-gray-600 mb-2">📍 {college.location}</p>
                <p className="text-gray-700 mb-4">📚 {college.programs}</p>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeRecommendation;
