import React from 'react';
import { Routes, Route, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Careers from './pages/Careers';
import CollegeRecommendation from './pages/CollegeRecommendation';
import CollegeSearch from './pages/CollegeSearch';
import ExamEligibility from './pages/ExamEligibility';
import StudentProfile from './pages/StudentProfile';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Main application layout component
const AppLayout = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main className="pt-16">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/careers" element={
          <ProtectedRoute>
            <Careers />
          </ProtectedRoute>
        } />
        
        <Route path="/college-recommendation" element={
          <ProtectedRoute>
            <CollegeRecommendation />
          </ProtectedRoute>
        } />
        <Route path="/college-search" element={
          <ProtectedRoute>
            <CollegeSearch />
          </ProtectedRoute>
        } />
        <Route path="/exam-eligibility" element={
          <ProtectedRoute>
            <ExamEligibility />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/chatbot" element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </div>
);

// Create router with future flags
const router = createBrowserRouter([
  {
    path: "/*",
    element: <AppLayout />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

// Main App component
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;