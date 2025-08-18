import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Careers.css';

// Mock data - in a real app, this would come from your backend
const CAREER_DATA = [
  {
    id: 'cs-1',
    title: 'Software Engineer',
    degree: 'Computer Science',
    description: 'Design, develop, and test software applications and systems.',
    skills: ['Programming', 'Algorithms', 'Data Structures', 'Problem Solving'],
    salary: { min: 80000, max: 180000, currency: 'USD' },
    demand: 'High',
    growthRate: '22% (Much faster than average)',
    responsibilities: [
      'Develop and maintain software applications',
      'Collaborate with cross-functional teams',
      'Write clean, efficient, and well-documented code',
      'Troubleshoot and debug issues'
    ]
  },
  // Add more career paths here...
];

const Careers = ({ userData }) => {
  const [selectedDegree, setSelectedDegree] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const navigate = useNavigate();

  // Available degrees for the dropdown
  const availableDegrees = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Medicine',
    'Arts & Humanities',
    'Sciences',
    'Social Sciences'
  ];

  // Auto-select degree from user profile if available
  useEffect(() => {
    if (userData?.stream) {
      // Map user's stream to a degree (this is a simplified mapping)
      const degreeMap = {
        'Science': 'Sciences',
        'Commerce': 'Business Administration',
        'Arts': 'Arts & Humanities'
      };
      
      setSelectedDegree(degreeMap[userData.stream] || '');
    }
  }, [userData]);

  // Filter careers by selected degree
  const filteredCareers = useMemo(() => {
    if (!selectedDegree) return [];
    
    return CAREER_DATA
      .filter(career => career.degree === selectedDegree)
      .sort((a, b) => {
        if (sortBy === 'salary') {
          return b.salary.min - a.salary.min;
        } else if (sortBy === 'demand') {
          const demandOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return demandOrder[b.demand] - demandOrder[a.demand];
        }
        // Default sort by relevance (alphabetical for now)
        return a.title.localeCompare(b.title);
      });
  }, [selectedDegree, sortBy]);

  const handleCareerSelect = (career) => {
    setSelectedCareer(career);
    // Scroll to details section
    document.getElementById('career-details')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerateRoadmap = (careerId) => {
    // In a real app, this would navigate to a roadmap generation page
    navigate(`/career-roadmap/${careerId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading career recommendations...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="careers-container">
      <div className="careers-header">
        <h1>Career Path Explorer</h1>
        <p className="subtitle">Discover career opportunities that match your education and interests</p>
      </div>

      <div className="career-filters">
        <div className="form-group">
          <label htmlFor="degree-select">Select Your Degree/Field:</label>
          <select 
            id="degree-select"
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="form-control"
          >
            <option value="">-- Select a degree --</option>
            {availableDegrees.map(degree => (
              <option key={degree} value={degree}>{degree}</option>
            ))}
          </select>
        </div>

        {selectedDegree && (
          <div className="form-group">
            <label htmlFor="sort-select">Sort By:</label>
            <select 
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
            >
              <option value="relevance">Relevance</option>
              <option value="salary">Salary (High to Low)</option>
              <option value="demand">Job Demand</option>
            </select>
          </div>
        )}
      </div>

      {selectedDegree ? (
        <>
          <div className="careers-grid">
            {filteredCareers.length > 0 ? (
              filteredCareers.map((career) => (
                <div 
                  key={career.id} 
                  className={`career-card ${selectedCareer?.id === career.id ? 'selected' : ''}`}
                  onClick={() => handleCareerSelect(career)}
                >
                  <h3>{career.title}</h3>
                  <div className="career-meta">
                    <span className="salary">
                      ${career.salary.min.toLocaleString()} - ${career.salary.max.toLocaleString()}
                    </span>
                    <span className={`demand ${career.demand.toLowerCase()}`}>
                      {career.demand} Demand
                    </span>
                  </div>
                  <p className="description">{career.description}</p>
                  <div className="skills">
                    {career.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                    {career.skills.length > 3 && (
                      <span className="skill-tag more">+{career.skills.length - 3} more</span>
                    )}
                  </div>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateRoadmap(career.id);
                    }}
                  >
                    Generate Career Roadmap
                  </button>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No career paths found for {selectedDegree}. Try a different degree or check back later.</p>
              </div>
            )}
          </div>

          {selectedCareer && (
            <div id="career-details" className="career-details">
              <h2>{selectedCareer.title} Career Details</h2>
              <div className="details-grid">
                <div className="detail-card">
                  <h4>Salary Range</h4>
                  <p className="highlight">
                    ${selectedCareer.salary.min.toLocaleString()} - ${selectedCareer.salary.max.toLocaleString()} per year
                  </p>
                </div>
                <div className="detail-card">
                  <h4>Job Market Demand</h4>
                  <p className={`highlight ${selectedCareer.demand.toLowerCase()}`}>
                    {selectedCareer.demand} Demand
                  </p>
                </div>
                <div className="detail-card">
                  <h4>Growth Rate</h4>
                  <p className="highlight">{selectedCareer.growthRate}</p>
                </div>
              </div>
              
              <div className="responsibilities">
                <h4>Key Responsibilities</h4>
                <ul>
                  {selectedCareer.responsibilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="skills-section">
                <h4>Required Skills</h4>
                <div className="skills-list">
                  {selectedCareer.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              
              <button 
                className="btn btn-primary"
                onClick={() => handleGenerateRoadmap(selectedCareer.id)}
              >
                Generate Personalized Career Roadmap
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="select-degree-prompt">
          <div className="prompt-content">
            <h3>Select a degree to explore career paths</h3>
            <p>Choose your field of study to see relevant career opportunities, salary information, and growth potential.</p>
            {!userData?.stream && (
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/profile')}
              >
                Complete Your Profile for Better Recommendations
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
