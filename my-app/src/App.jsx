import React from 'react';
import { Routes, Route, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Careers from './pages/Careers';
import CollegeRecommendation from './pages/CollegeRecommendation';
import CollegeSearch from './pages/CollegeSearch';
import ExamEligibility from './pages/ExamEligibility';
import StudentProfile from './pages/StudentProfile';
import ChatbotWidget from './components/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Component to handle root route based on authentication
const RootRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Login />;
};

// Main application layout component
const AppLayout = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main className="pt-16">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Default landing page - shows login or redirects to dashboard */}
        <Route path="/" element={<RootRoute />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
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
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    {/* Floating chatbot widget rendered globally */}
    <ChatbotWidget />
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