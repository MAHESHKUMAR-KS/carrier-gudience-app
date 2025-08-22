import React from 'react';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Carrier Guidance App</h1>
      <p className="text-lg mb-4">
        Your personalized career and education guidance platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Career Paths</h2>
          <p>Explore various career options based on your skills and interests.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">College Recommendations</h2>
          <p>Find the best colleges that match your career goals.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Personalized Guidance</h2>
          <p>Get personalized advice from our career experts.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
