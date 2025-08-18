
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup } from './components/Auth';
import './components/Auth.css';
import Navbar from './components/Navbar';
import Careers from './components/Careers';
import CollegeRecommendation from './components/CollegeRecommendation';
import Home from './components/Home';
import StudentProfile from './components/StudentProfile';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const [mode, setMode] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserData(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Auth Pages
  const AuthPages = () => (
    <div className="auth-container">
      {mode === 'login' ? (
        <Login 
          onLogin={(val) => val === 'signup' ? setMode('signup') : handleLogin(val)} 
        />
      ) : (
        <Signup 
          onSignup={(val) => val === 'login' ? setMode('login') : handleLogin(val)} 
        />
      )}
    </div>
  );

  // Main App with Routes
  const AppRoutes = () => (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <StudentProfile userData={userData} onUpdate={setUserData} />
            </ProtectedRoute>
          } />
          <Route path="/colleges" element={
            <ProtectedRoute>
              <CollegeRecommendation userData={userData} />
            </ProtectedRoute>
          } />
          <Route path="/careers" element={
            <ProtectedRoute>
              <Careers />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<AuthPages />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );

  return isLoggedIn ? <AppRoutes /> : <AuthPages />;
}

export default App;
