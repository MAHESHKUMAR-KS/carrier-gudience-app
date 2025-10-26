import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1/auth';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  },

  googleLogin: async (credential) => {
    try {
      const response = await api.post('/google', { credential });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Google login failed. Please try again.'
      };
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/signup', userData);
      if (response.data) {
      
        return { 
          success: true, 
          message: 'Signup successful! Please log in.'
        };
      }
      return { 
        success: false, 
        message: 'Signup failed. Please try again.' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed. Please try again.' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('token')
};

export default api;

// Scholarship API
export const scholarshipAPI = {
  getAll: async (filters = {}) => {
    try {
      const response = await axios.get('http://localhost:5001/api/scholarships', {
        params: filters
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch scholarships'
      };
    }
  },

  getByState: async (state) => {
    return scholarshipAPI.getAll({ state });
  },

  getByCategory: async (category) => {
    return scholarshipAPI.getAll({ category });
  },

  getBySource: async (source) => {
    return scholarshipAPI.getAll({ source });
  },

  search: async (query) => {
    return scholarshipAPI.getAll({ search: query });
  }
};
