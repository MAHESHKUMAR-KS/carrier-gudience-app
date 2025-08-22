import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-indigo-600 hover:text-white';

  // Only show the navbar if user is authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-indigo-800 fixed w-full top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-xl">
                CareerGuide
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/careers"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/careers' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  Careers
                </Link>
                <Link
                  to="/college-recommendation"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/college-recommendation' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  College Recs
                </Link>
                <Link
                  to="/chatbot"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/chatbot' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  AI Assistant
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/profile' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
                }`}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-indigo-700 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/careers"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/careers' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Careers
            </Link>
            <Link
              to="/college-recommendation"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/college-recommendation' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              College Recommendations
            </Link>
            <Link
              to="/chatbot"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/chatbot' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              AI Assistant
            </Link>
            <Link
              to="/profile"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/profile' ? 'bg-indigo-900 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              My Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-700 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
