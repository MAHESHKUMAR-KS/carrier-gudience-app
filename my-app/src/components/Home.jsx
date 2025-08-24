import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import PillNav from './PillNav.jsx';

const Home = ({ userData }) => {
  const [activeNav, setActiveNav] = useState('home');
  
  const navItems = [
    { id: '', label: 'Home' },
    { id: 'college-recommendation', label: 'Colleges' },
    { id: 'careers', label: 'Careers' },
    { id: 'profile', label: 'My Profile' },
  ];

  return (
    <div className="home-container">

      <h1>Welcome to Career Guidance App</h1>
      {userData && <h2>Hello, {userData.name || 'Student'}!</h2>}
      
      <div className="dashboard-cards">
        <Link to="/profile" className="card">
          <h3>My Profile</h3>
          <p>View and update your personal information, academic details, and preferences.</p>
        </Link>
        
        <Link to="/colleges" className="card">
          <h3>College Recommendations</h3>
          <p>Get personalized college and course recommendations based on your profile.</p>
        </Link>
        
        <Link to="/careers" className="card">
          <h3>Career Paths</h3>
          <p>Explore different career options and their requirements.</p>
        </Link>
      </div>
      
      {!userData?.profileComplete && (
        <div className="alert">
          <p>Complete your profile to get better recommendations!</p>
          <Link to="/profile" className="btn btn-primary">Complete Profile</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
