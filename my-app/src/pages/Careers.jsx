import React from 'react';

function Careers() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Career Paths</h1>
      <p className="text-lg mb-6">
        Explore various career options and find the perfect path for you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Career cards will be mapped here */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Software Engineering</h2>
          <p className="text-gray-600 mb-4">Build and maintain software applications and systems.</p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Learn More →
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Data Science</h2>
          <p className="text-gray-600 mb-4">Analyze and interpret complex data to help make business decisions.</p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Learn More →
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">UX/UI Design</h2>
          <p className="text-gray-600 mb-4">Create intuitive and engaging user experiences.</p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Careers;
