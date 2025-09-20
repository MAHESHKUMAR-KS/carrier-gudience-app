import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function StudentProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Initialize form with default values
  const [formData, setFormData] = useState({
    userType: 'school', // 'school' or 'college'
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    // School student specific
    grade: '10th Grade',
    stream: 'Science',
    // College student specific
    collegeName: '',
    degree: '',
    major: '',
    graduationYear: new Date().getFullYear() + 1,
    // Common fields
    careerGoals: '',
    strengths: '',
    skills: [],
    interests: [],
    preferredColleges: [],
    preferredExams: [],
    bio: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newCollege, setNewCollege] = useState('');
  const [newExam, setNewExam] = useState('');

  // Load user data on component mount
  useEffect(() => {
    // In a real app, you would fetch this from your API
    const fetchUserData = async () => {
      try {
        // const response = await fetch(`/api/students/${currentUser.uid}`);
        // const data = await response.json();
        // setFormData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addItem = (type) => {
    return (e) => {
      e.preventDefault();
      const value = e.target[0].value.trim();
      if (value) {
        setFormData(prev => ({
          ...prev,
          [type]: [...prev[type], value]
        }));
        e.target.reset();
      }
    };
  };

  const removeItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would save this to your API
      // await fetch(`/api/students/${currentUser.uid}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const renderUserTypeFields = () => {
    if (formData.userType === 'school') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Current Grade/Class
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              disabled={!isEditing}
            >
              {['9th Grade', '10th Grade', '11th Grade', '12th Grade'].map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Stream (if applicable)
            </label>
            <select
              name="stream"
              value={formData.stream}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              disabled={!isEditing}
            >
              {['Science', 'Commerce', 'Arts', 'Not Applicable'].map(stream => (
                <option key={stream} value={stream}>{stream}</option>
              ))}
            </select>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              College/University
            </label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              disabled={!isEditing}
              placeholder="Enter your college name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Degree
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              >
                <option value="">Select Degree</option>
                <option value="B.Tech">B.Tech</option>
                <option value="B.Sc">B.Sc</option>
                <option value="B.Com">B.Com</option>
                <option value="BA">BA</option>
                <option value="BBA">BBA</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Major/Stream
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Expected Graduation Year
            </label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              disabled={!isEditing}
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 5}
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Profile' : 'My Profile'}
          </h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              I am a
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="school"
                  checked={formData.userType === 'school'}
                  onChange={handleInputChange}
                  className="form-radio"
                  disabled={!isEditing}
                />
                <span className="ml-2">School Student</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="college"
                  checked={formData.userType === 'college'}
                  onChange={handleInputChange}
                  className="form-radio"
                  disabled={!isEditing}
                />
                <span className="ml-2">College Student</span>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-gray-100"
                disabled
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              disabled={!isEditing}
              placeholder="+91 XXXXXXXXXX"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4 mt-8">
            {formData.userType === 'school' ? 'Academic Information' : 'College Information'}
          </h2>
          
          {renderUserTypeFields()}

          <h2 className="text-xl font-semibold mb-4 mt-8">Career Information</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Career Goals
            </label>
            <textarea
              name="careerGoals"
              value={formData.careerGoals}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="3"
              disabled={!isEditing}
              placeholder="Describe your career aspirations..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Strengths
            </label>
            <textarea
              name="strengths"
              value={formData.strengths}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="2"
              disabled={!isEditing}
              placeholder="List your key strengths..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Skills
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l"
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (e.target.value.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          skills: [...prev.skills, e.target.value.trim()]
                        }));
                        e.target.value = '';
                      }
                    }
                  }}
                  disabled={!isEditing}
                />
                <button
                  className="bg-blue-500 text-white px-3 py-2 rounded-r"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = e.target.previousSibling;
                    if (input.value.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        skills: [...prev.skills, input.value.trim()]
                      }));
                      input.value = '';
                    }
                  }}
                  disabled={!isEditing}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeItem('skills', index)}
                        className="ml-1.5 text-blue-600 hover:text-blue-900"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Interests
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l"
                  placeholder="Add an interest"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (e.target.value.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          interests: [...prev.interests, e.target.value.trim()]
                        }));
                        e.target.value = '';
                      }
                    }
                  }}
                  disabled={!isEditing}
                />
                <button
                  className="bg-green-500 text-white px-3 py-2 rounded-r"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = e.target.previousSibling;
                    if (input.value.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        interests: [...prev.interests, input.value.trim()]
                      }));
                      input.value = '';
                    }
                  }}
                  disabled={!isEditing}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    {interest}
                    {isEditing && (
                      <button
                        onClick={() => removeItem('interests', index)}
                        className="ml-1.5 text-green-600 hover:text-green-900"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
