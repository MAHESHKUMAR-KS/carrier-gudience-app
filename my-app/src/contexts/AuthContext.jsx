import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authAPI.login(email, password);
    if (result.success) {
      setUser(authAPI.getCurrentUser());
    }
    return result;
  };

  const signup = async (userData) => {
    const result = await authAPI.signup(userData);
    if (result.success) {
      setUser(authAPI.getCurrentUser());
    }
    return result;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
