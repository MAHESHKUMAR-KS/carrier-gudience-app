import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold sm:text-4xl">
              Find Your Perfect College
              <span className="block text-yellow-300 mt-2">Match with Confidence</span>
            </h1>
            <p className="mt-4 text-blue-100 sm:text-lg max-w-2xl mx-auto">
              Discover colleges that match your marks, community, and preferences with our AI-powered recommendation system.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={currentUser ? "/college-search" : "/signup"}
                className="px-6 py-2.5 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                {currentUser ? 'Find Colleges' : 'Get Started Free'}
              </Link>
              {currentUser && (
                <Link
                  to="/careers"
                  className="px-6 py-2.5 bg-blue-500 text-white border border-blue-400 font-medium rounded-md hover:bg-blue-600 transition-colors"
                >
                  Explore Careers
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-10">
        <div className="max-w-5xl mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/college-search" className="group bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-900">College Search</h3>
            <p className="mt-1 text-sm text-gray-600">Filter by community, cutoff, and location.</p>
            <span className="inline-block mt-3 text-indigo-600 text-sm group-hover:underline">Find now →</span>
          </Link>
          <Link to="/careers" className="group bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-900">Careers & Roadmaps</h3>
            <p className="mt-1 text-sm text-gray-600">Pick a role and generate a 60‑day plan.</p>
            <span className="inline-block mt-3 text-indigo-600 text-sm group-hover:underline">Explore →</span>
          </Link>
          <Link to="/exam-eligibility" className="group bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-900">Exam Eligibility</h3>
            <p className="mt-1 text-sm text-gray-600">Check eligibility based on your profile.</p>
            <span className="inline-block mt-3 text-indigo-600 text-sm group-hover:underline">Check now →</span>
          </Link>
          <Link to="/profile" className="group bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition">
            <h3 className="font-semibold text-gray-900">My Profile</h3>
            <p className="mt-1 text-sm text-gray-600">Update your details and preferences.</p>
            <span className="inline-block mt-3 text-indigo-600 text-sm group-hover:underline">Open →</span>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Everything you need to find your ideal college</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Community-Based Filtering',
                description: 'Get accurate cutoff marks and seat availability based on your community (SC/ST/OBC/General).',
                icon: '👥',
              },
              {
                name: 'Location Intelligence',
                description: 'Find colleges in your preferred locations with our integrated mapping system.',
                icon: '📍',
              },
              {
                name: 'Cutoff Analysis',
                description: 'View historical cutoff data to better understand your admission chances.',
                icon: '📊',
              },
              {
                name: 'AI-Powered Matches',
                description: 'Get personalized college recommendations based on your profile and preferences.',
                icon: '🤖',
              },
            ].map((feature) => (
              <div key={feature.name} className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{feature.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to find your dream college?</h2>
          <p className="text-blue-100 mb-6">
            Join thousands of students who have found their perfect college match with our platform.
          </p>
          <Link
            to={currentUser ? "/college-search" : "/signup"}
            className="inline-block bg-white text-blue-700 px-6 py-2.5 rounded-md font-medium hover:bg-blue-50 transition-colors"
          >
            {currentUser ? 'Start Searching' : 'Create Free Account'}
          </Link>
        </div>
      </div>
    </div>
  );
}
