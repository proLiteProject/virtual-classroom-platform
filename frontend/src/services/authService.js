// src/services/authService.js
import api from './api';
import { tokenStorage } from '../utils/tokenStorage';

export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        
        // Store tokens and user
        tokenStorage.setToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);
        tokenStorage.setUser(user);
        
        return { success: true, user };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  },

  // Get profile
  async getProfile() {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout() {
    tokenStorage.clearAuth();
  },

  // Check if authenticated
  isAuthenticated() {
    return tokenStorage.isAuthenticated();
  },

  // Get current user
  getCurrentUser() {
    return tokenStorage.getUser();
  }
};