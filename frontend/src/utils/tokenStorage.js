// src/utils/tokenStorage.js
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const tokenStorage = {
  // Get token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set token
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Set refresh token
  setRefreshToken(token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  // Get user
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Set user
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Clear all auth data
  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
};