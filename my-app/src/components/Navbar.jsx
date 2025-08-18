import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (!isLoggedIn) {
    return null; // Don't show navbar on auth pages
  }

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">CareerGuide</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          <i className="fas fa-home"></i> Home
        </Link>
        <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
          <i className="fas fa-user"></i> My Profile
        </Link>
        <Link to="/colleges" className={`nav-link ${isActive('/colleges')}`}>
          <i className="fas fa-university"></i> Colleges
        </Link>
        <Link to="/careers" className={`nav-link ${isActive('/careers')}`}>
          <i className="fas fa-briefcase"></i> Careers
        </Link>
        <Link to="/chat" className={`nav-link ${isActive('/chat')}`}>
          <i className="fas fa-robot"></i> AI Assistant
        </Link>
      </div>
      
      <div className="navbar-actions">
        <button onClick={handleLogout} className="btn btn-outline">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
