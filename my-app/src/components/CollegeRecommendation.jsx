import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CollegeRecommendation.css';

const STREAM_SUBJECTS = {
  Science: ['Physics', 'Chemistry', 'Maths', 'Biology'],
  ComputerScience: ['Physics', 'Chemistry', 'Maths', 'Computer Science'],
  Commerce: ['Accountancy', 'Business Studies', 'Economics'],
  Arts: ['History', 'Political Science', 'Geography'],
};

const CollegeRecommendation = ({ userData }) => {
  // Initialize form with user data if available
  const [formData, setFormData] = useState({
    stream: userData?.stream || 'Science',
    marks: userData?.marks || {},
    twelfthMarks: userData?.twelfthMarks || '',
    interests: userData?.interests?.join(', ') || '',
    location: userData?.location || '',
    budget: userData?.budget || '',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(!userData?.profileComplete);

  // Update form when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        stream: userData.stream || 'Science',
        marks: userData.marks || {},
        interests: userData.interests?.join(', ') || '',
        location: userData.location || '',
        budget: userData.budget || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset marks when stream changes
      ...(name === 'stream' && { marks: {} })
    }));
  };

  const handleMarksChange = (subject, value) => {
    setFormData(prev => ({
      ...prev,
      marks: { ...prev.marks, [subject]: value }
    }));
  };

    // Financial strength analysis component
  const FinancialBadge = ({ score }) => {
    let badgeClass = 'financial-badge ';
    let label = '';
    
    if (score >= 8) {
      badgeClass += 'high';
      label = 'Stable';
    } else if (score >= 5) {
      badgeClass += 'medium';
      label = 'Moderate';
    } else {
      badgeClass += 'low';
      label = 'Limited';
    }
    
    return (
      <span className={badgeClass}>
        {label} Financial Health • {score}/10
      </span>
    );
  };

  // Mock data for college recommendations with financial details
  const getMockColleges = () => {
    const stream = formData.stream.toLowerCase();
    const mockColleges = [
      {
        id: 1,
        name: `${stream.charAt(0).toUpperCase() + stream.slice(1)} College of Excellence`,
        location: formData.location || 'Major City',
        courses: [`B.Sc in ${stream}`, `B.Tech in ${stream}`, `B.A. in ${stream}`],
        matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
        cutoff: 85 + Math.floor(Math.random() * 15), // 85-100%
        financialDetails: {
          annualRevenue: 100 + Math.floor(Math.random() * 100), // 100-200 Cr
          fundingSources: ['Private Trust', 'Student Fees'],
          score: 8 + Math.floor(Math.random() * 3) // 8-10
        },
        fees: {
          min: 50000,
          max: 150000,
          currency: 'INR'
        },
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
        website: 'https://example.com'
      },
      {
        id: 2,
        name: 'National Institute of Technology',
        location: formData.location || 'State Capital',
        courses: ['B.Tech', 'M.Tech', 'Ph.D'],
        matchScore: Math.floor(Math.random() * 20) + 60, // 60-80
        cutoff: 75 + Math.floor(Math.random() * 20), // 75-95%
        financialDetails: {
          annualRevenue: 200 + Math.floor(Math.random() * 100), // 200-300 Cr
          fundingSources: ['Government', 'Research Grants', 'Fees'],
          score: 9 + Math.floor(Math.random() * 2) // 9-10
        },
        fees: {
          min: 100000,
          max: 250000,
          currency: 'INR'
        },
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0
        website: 'https://example.com'
      },
      {
        id: 3,
        name: 'University of Applied Sciences',
        location: formData.location || 'Metro City',
        courses: ['B.Sc', 'B.Com', 'BBA', 'BCA'],
        matchScore: Math.floor(Math.random() * 25) + 60, // 60-85
        cutoff: 65 + Math.floor(Math.random() * 20), // 65-85%
        financialDetails: {
          annualRevenue: 30 + Math.floor(Math.random() * 50), // 30-80 Cr
          fundingSources: ['Private Trust'],
          score: 5 + Math.floor(Math.random() * 3) // 5-7
        },
        fees: {
          min: 30000,
          max: 120000,
          currency: 'INR'
        },
        rating: (Math.random() * 1.8 + 3.2).toFixed(1), // 3.2-5.0
        website: 'https://example.com'
      },
      {
        id: 4,
        name: 'State Engineering College',
        location: formData.location || 'State Capital',
        courses: ['B.E', 'B.Tech', 'M.Tech'],
        matchScore: Math.floor(Math.random() * 20) + 50, // 50-70
        cutoff: 60 + Math.floor(Math.random() * 20), // 60-80%
        financialDetails: {
          annualRevenue: 50 + Math.floor(Math.random() * 50), // 50-100 Cr
          fundingSources: ['State Government'],
          score: 6 + Math.floor(Math.random() * 2) // 6-7
        },
        fees: {
          min: 20000,
          max: 80000,
          currency: 'INR'
        },
        rating: (Math.random() * 1.5 + 3.0).toFixed(1), // 3.0-4.5
        website: 'https://example.com'
      },
      {
        id: 5,
        name: 'Private Technical Institute',
        location: formData.location || 'City',
        courses: ['B.Tech', 'BCA', 'BBA'],
        matchScore: Math.floor(Math.random() * 20) + 40, // 40-60
        cutoff: 50 + Math.floor(Math.random() * 20), // 50-70%
        financialDetails: {
          annualRevenue: 10 + Math.floor(Math.random() * 30), // 10-40 Cr
          fundingSources: ['Private Investors', 'Student Fees'],
          score: 3 + Math.floor(Math.random() * 3) // 3-5
        },
        fees: {
          min: 40000,
          max: 100000,
          currency: 'INR'
        },
        rating: (Math.random() * 1.5 + 2.5).toFixed(1), // 2.5-4.0
        website: 'https://example.com'
      }
    ];
    
    // Filter by cutoff marks if available
    const userMarks = Object.values(formData.marks).reduce((a, b) => a + Number(b), 0) / 
                      Object.values(formData.marks).length || 0;
    
    // Sort by financial score (highest first) and filter by cutoff
    return mockColleges
      .filter(college => !userMarks || userMarks >= (college.cutoff - 10)) // Allow 10% buffer
      .sort((a, b) => {
        // First sort by financial score, then by match score
        if (b.financialDetails.score !== a.financialDetails.score) {
          return b.financialDetails.score - a.financialDetails.score;
        }
        return b.matchScore - a.matchScore;
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      const mockColleges = getMockColleges();
      setResults(mockColleges);
      setShowForm(false);
      
      // Uncomment this code when backend is ready
      /*
      const response = await fetch('/api/recommend/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setResults(data.colleges || []);
      setShowForm(false);
      */
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Using sample data instead.');
      // Fallback to mock data
      const mockColleges = getMockColleges();
      setResults(mockColleges);
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Finding the best college matches for you...</p>
      </div>
    );
  }

  return (
    <div className="college-recommendation">
      <h2>College Recommendations</h2>
      
      {!userData?.profileComplete && (
        <div className="alert alert-warning">
          <p>Complete your profile to get better recommendations!</p>
          <Link to="/profile" className="btn btn-primary">Complete Profile</Link>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="recommendation-form">
          <div className="form-group">
            <label>12th Stream:</label>
            <select 
              name="stream"
              value={formData.stream} 
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="Science">Science</option>
              <option value="ComputerScience">Computer Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>12th Standard Marks (in %):</label>
            <input
              type="number"
              name="twelfthMarks"
              min="0"
              max="100"
              value={formData.twelfthMarks}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your 12th percentage"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Subject-wise Marks (in %):</label>
            <div className="marks-container">
              {STREAM_SUBJECTS[formData.stream].map((subject) => (
                <div key={subject} className="mark-input">
                  <label>{subject}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.marks[subject] || ''}
                    onChange={(e) => handleMarksChange(subject, e.target.value)}
                    className="form-control"
                    required
                    placeholder={`${subject} %`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Interests (comma separated):</label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g. Engineering, Design, Research"
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Preferred Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai, Delhi, Bangalore"
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Annual Budget (INR):</label>
            <div className="budget-input">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. 100000"
                className="form-control"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Get Recommendations'}
            </button>
            {userData?.profileComplete && (
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="recommendation-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-sync-alt"></i> Update Preferences
          </button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {results.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <h3>Recommended Colleges</h3>
            <p className="results-count">Showing {results.length} colleges (sorted by financial strength)</p>
          </div>
          
          <div className="college-cards">
            {results.map((college) => (
              <div key={college.id} className="college-card">
                <div className="college-card-header">
                  <h4>{college.name}</h4>
                  <div className="college-rating">
                    {college.rating} ★
                    <span className="cutoff">Cutoff: {college.cutoff}%</span>
                  </div>
                </div>
                
                <FinancialBadge score={college.financialDetails.score} />
                
                <div className="college-details">
                  <p className="location"> 📍 {college.location}</p>
                  
                  <div className="financial-highlights">
                    <div className="financial-item">
                      <span className="label">Annual Revenue:</span>
                      <span className="value">₹{college.financialDetails.annualRevenue} Cr</span>
                    </div>
                    <div className="financial-item">
                      <span className="label">Funding Sources:</span>
                      <span className="value">{college.financialDetails.fundingSources.join(' • ')}</span>
                    </div>
                  </div>
                  
                  <div className="courses">
                    <strong>Available Programs:</strong>
                    <div className="course-tags">
                      {college.courses.map((course, idx) => (
                        <span key={idx} className="course-tag">{course}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="fees-section">
                    <div className="fee-range">
                      <span className="label">Annual Fees:</span>
                      <span className="value">
                        ₹{college.fees.min.toLocaleString()} - ₹{college.fees.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="match-score">
                      <span className="label">Match Score:</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill" 
                          style={{ width: `${college.matchScore}%` }}
                          title={`${college.matchScore}% match with your profile`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="college-actions">                  <a 
                    href={`/colleges/${college.id}`} 
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to determine match color
function getMatchColor(score) {
  if (score >= 80) return '#2ecc71'; // Green
  if (score >= 60) return '#f39c12'; // Orange
  return '#e74c3c'; // Red
}

export default CollegeRecommendation;
