import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import gsap from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePill, setActivePill] = useState({ width: 0, left: 0 });
  const navRef = useRef(null);
  const pillRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, currentUser } = useAuth();

  // Build a friendly display name
  const greetingName = (() => {
    const name = currentUser?.displayName || currentUser?.name;
    if (name && String(name).trim()) return name;
    const email = currentUser?.email || '';
    if (email.includes('@')) return email.split('@')[0];
    return 'there';
  })();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Home' },
    { href: '/careers', label: 'Careers' },
    { href: '/college-search', label: 'College Search' },
    { href: '/exam-eligibility', label: 'Exam Eligibility' },
    { href: '/profile', label: 'My Profile' },
  ];

  // Update pill position on route change
  useEffect(() => {
    updatePillPosition();
    window.addEventListener('resize', updatePillPosition);
    return () => window.removeEventListener('resize', updatePillPosition);
  }, [location.pathname]);

  const updatePillPosition = () => {
    if (!navRef.current) return;
    
    const activeLink = navRef.current.querySelector('a[aria-current="page"]');
    if (!activeLink) return;
    
    const { width, left } = activeLink.getBoundingClientRect();
    const navLeft = navRef.current.getBoundingClientRect().left;
    
    setActivePill({
      width: width - 24, // Adjust padding
      left: left - navLeft + 12, // Adjust padding
    });
    
    if (pillRef.current) {
      gsap.to(pillRef.current, {
        width: width - 24,
        left: left - navLeft + 12,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };
  
  const handleMouseEnter = (e) => {
    if (!pillRef.current) return;
    const { width, left } = e.currentTarget.getBoundingClientRect();
    const navLeft = navRef.current.getBoundingClientRect().left;
    
    gsap.to(pillRef.current, {
      width: width - 24,
      left: left - navLeft + 12,
      duration: 0.3,
      ease: 'power2.out',
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
    });
  };
  
  const handleMouseLeave = () => {
    if (!pillRef.current) return;
    const activeLink = navRef.current.querySelector('a[aria-current="page"]');
    if (!activeLink) return;
    
    const { width, left } = activeLink.getBoundingClientRect();
    const navLeft = navRef.current.getBoundingClientRect().left;
    
    gsap.to(pillRef.current, {
      width: width - 24,
      left: left - navLeft + 12,
      duration: 0.3,
      ease: 'power2.out',
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    });
  };

  // Only show the navbar if user is authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-indigo-800 fixed w-full top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="text-white font-bold text-xl ml-2">
              CareerGuide
            </Link>
            
            {/* Desktop Navigation with Animated Pill */}
            <div className="hidden md:flex items-center relative" ref={navRef}>
              <div 
                ref={pillRef}
                className="absolute h-8 bg-white bg-opacity-10 rounded-full -z-10 top-1/2 transform -translate-y-1/2 transition-all duration-300"
                style={{
                  width: activePill.width,
                  left: activePill.left,
                }}
              />
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) => 
                    `relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 z-10 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-200 hover:text-white'
                    }`
                  }
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.label}
                </NavLink>
              ))}
              {/* Greeting */}
              <span className="ml-4 mr-2 px-3 py-1 rounded-full text-sm font-medium text-white bg-white/10 whitespace-nowrap">Hi, {greetingName}</span>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-700 focus:outline-none"
                aria-label="Toggle menu"
              >
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
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-indigo-800 shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-200">Hi, {greetingName}</div>
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-indigo-900 text-white' 
                      : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-red-700 hover:text-white"
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
