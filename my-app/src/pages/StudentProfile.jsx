import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function StudentProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Initialize form with default values
  const [formData, setFormData] = useState({
    userType: 'school', // 'school' or 'college'
    name: currentUser?.displayName || currentUser?.name || '',
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
  const [message, setMessage] = useState({ type: '', text: '' });

  const storageKey = React.useMemo(() => {
    const id = currentUser?._id || currentUser?.id || currentUser?.email || 'guest';
    return `student-profile:${id}`;
  }, [currentUser]);

  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Load from localStorage first (until backend is wired)
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const saved = JSON.parse(raw);
          setFormData((prev) => ({ ...prev, ...saved }));
        } else {
          // fallback to user details for name/email
          setFormData((prev) => ({
            ...prev,
            name: prev.name || currentUser?.displayName || currentUser?.name || '',
            email: prev.email || currentUser?.email || '',
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    if (currentUser) fetchUserData();
  }, [currentUser, storageKey]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addListItem = (key, valueSetter) => {
    return (e) => {
      e.preventDefault();
      const value = (key === 'preferredColleges' ? newCollege : key === 'preferredExams' ? newExam : key === 'skills' ? newSkill : newInterest).trim();
      if (!value) return;
      setFormData(prev => ({ ...prev, [key]: prev[key].includes(value) ? prev[key] : [...prev[key], value] }));
      // clear specific input
      if (key === 'skills') valueSetter('');
      if (key === 'interests') valueSetter('');
      if (key === 'preferredColleges') valueSetter('');
      if (key === 'preferredExams') valueSetter('');
    };
  };

  const removeItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const issues = [];
    if (!formData.name.trim()) issues.push('Name is required');
    if (!formData.email.trim()) issues.push('Email is required');
    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone)) issues.push('Phone must be 10-15 digits (optionally prefixed by +)');
    if (formData.userType === 'college' && !formData.collegeName.trim()) issues.push('College name is required for college students');
    return issues;
  };

  const persist = (data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('Local storage not available');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const issues = validate();
    if (issues.length) {
      setMessage({ type: 'error', text: issues.join(' • ') });
      return;
    }
    try {
      // TODO: Wire up backend persistence when endpoint is available
      persist(formData);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile saved locally.' });
      // Scroll to top so the user sees the reflected summary and banner
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile.' });
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <button
                onClick={() => { setIsEditing(false); setMessage({ type: '', text: '' }); }}
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

        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Read-only summary to reflect saved profile when not editing */}
        {!isEditing && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{formData.name || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{formData.email || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{formData.phone || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium text-gray-900 capitalize">{formData.userType}</p>
              </div>
              {formData.userType === 'school' ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="font-medium text-gray-900">{formData.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stream</p>
                    <p className="font-medium text-gray-900">{formData.stream}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">College</p>
                    <p className="font-medium text-gray-900">{formData.collegeName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Degree / Major</p>
                    <p className="font-medium text-gray-900">{[formData.degree, formData.major].filter(Boolean).join(' — ') || '—'}</p>
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Career Goals</p>
                <p className="font-medium text-gray-900 whitespace-pre-wrap">{formData.careerGoals || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Strengths</p>
                <p className="font-medium text-gray-900 whitespace-pre-wrap">{formData.strengths || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.length ? formData.skills.map((s, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{s}</span>
                  )) : <span className="text-gray-500 text-sm">—</span>}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.length ? formData.interests.map((s, i) => (
                    <span key={i} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{s}</span>
                  )) : <span className="text-gray-500 text-sm">—</span>}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Preferred Colleges</p>
                <div className="flex flex-wrap gap-2">
                  {formData.preferredColleges.length ? formData.preferredColleges.map((s, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">{s}</span>
                  )) : <span className="text-gray-500 text-sm">—</span>}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Preferred Exams</p>
                <div className="flex flex-wrap gap-2">
                  {formData.preferredExams.length ? formData.preferredExams.map((s, i) => (
                    <span key={i} className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">{s}</span>
                  )) : <span className="text-gray-500 text-sm">—</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`border-t pt-6 ${!isEditing ? 'hidden' : ''}`}>
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
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && isEditing) { e.preventDefault(); addListItem('skills', setNewSkill)(e); } }}
                  disabled={!isEditing}
                />
                <button
                  className="bg-blue-500 text-white px-3 py-2 rounded-r"
                  onClick={addListItem('skills', setNewSkill)}
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
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && isEditing) { e.preventDefault(); addListItem('interests', setNewInterest)(e); } }}
                  disabled={!isEditing}
                />
                <button
                  className="bg-green-500 text-white px-3 py-2 rounded-r"
                  onClick={addListItem('interests', setNewInterest)}
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

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Colleges</label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l"
                  placeholder="Add a college"
                  value={newCollege}
                  onChange={(e) => setNewCollege(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && isEditing) { e.preventDefault(); addListItem('preferredColleges', setNewCollege)(e); } }}
                  disabled={!isEditing}
                />
                <button
                  className="bg-purple-500 text-white px-3 py-2 rounded-r"
                  onClick={addListItem('preferredColleges', setNewCollege)}
                  disabled={!isEditing}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.preferredColleges.map((item, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    {item}
                    {isEditing && (
                      <button
                        onClick={() => removeItem('preferredColleges', index)}
                        className="ml-1.5 text-purple-600 hover:text-purple-900"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Exams</label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l"
                  placeholder="Add an exam (e.g., JEE, TNEA)"
                  value={newExam}
                  onChange={(e) => setNewExam(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && isEditing) { e.preventDefault(); addListItem('preferredExams', setNewExam)(e); } }}
                  disabled={!isEditing}
                />
                <button
                  className="bg-orange-500 text-white px-3 py-2 rounded-r"
                  onClick={addListItem('preferredExams', setNewExam)}
                  disabled={!isEditing}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.preferredExams.map((item, index) => (
                  <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    {item}
                    {isEditing && (
                      <button
                        onClick={() => removeItem('preferredExams', index)}
                        className="ml-1.5 text-orange-600 hover:text-orange-900"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex items-center justify-between">
            <div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
            <div className="text-xs text-gray-500">
              {message.type === 'success' ? 'Saved locally' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
