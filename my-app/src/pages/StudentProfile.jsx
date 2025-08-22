import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function StudentProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Mock user data - in a real app, this would come from an API
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    grade: '12th Grade',
    interests: ['Computer Science', 'Robotics', 'Mathematics'],
    bio: 'Passionate about technology and problem-solving. Looking to pursue a career in software engineering.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (e, index) => {
    const newInterests = [...formData.interests];
    newInterests[index] = e.target.value;
    setFormData(prev => ({
      ...prev,
      interests: newInterests
    }));
  };

  const addInterest = () => {
    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, '']
    }));
  };

  const removeInterest = (index) => {
    const newInterests = formData.interests.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      interests: newInterests
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
    // In a real app, you would save this to an API
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <div className="space-x-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => {
                setFormData({ ...user });
                setIsEditing(false);
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 mr-2"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {!isEditing ? (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.grade}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">About Me</h3>
            <p className="text-gray-700">{user.bio}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {['9th Grade', '10th Grade', '11th Grade', '12th Grade', 'College Freshman', 'College Sophomore', 'College Junior', 'College Senior'].map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Interests</label>
              <button
                type="button"
                onClick={addInterest}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add Interest
              </button>
            </div>
            <div className="space-y-2">
              {formData.interests.map((interest, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={interest}
                    onChange={(e) => handleInterestChange(e, index)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                    className="px-3 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default StudentProfile;
