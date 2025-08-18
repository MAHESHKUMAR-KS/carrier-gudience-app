import React, { useState, useEffect } from 'react';

const StudentProfile = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    stream: 'Science',
    marks: {},
    interests: [],
    location: '',
    budget: '',
    contact: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        ...userData,
        interests: userData.interests || []
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarksChange = (subject, value) => {
    setFormData(prev => ({
      ...prev,
      marks: {
        ...prev.marks,
        [subject]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      profileComplete: true
    });
  };

  return (
    <div className="profile-container">
      <h2>Student Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Stream</label>
          <select
            name="stream"
            value={formData.stream}
            onChange={handleChange}
          >
            <option value="Science">Science</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location Preference</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Mumbai, Delhi"
            required
          />
        </div>

        <div className="form-group">
          <label>Budget (Annual in INR)</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g., 100000"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default StudentProfile;
