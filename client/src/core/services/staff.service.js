/**
 * Staff API Service
 * 
 * Handles authentication and staff-related API calls.
 */
import httpClient from '../network/httpClient';

export const staffAPI = {
  /**
   * Authenticate staff member
   */
  signIn: (credentials) => {
    return httpClient.post('/staff/login', credentials);
  },

  /**
   * End current session
   */
  signOut: () => {
    return httpClient.post('/staff/logout');
  },

  /**
   * Get current user profile
   */
  fetchProfile: () => {
    return httpClient.get('/staff/profile');
  },

  /**
   * Create new staff member (admin only)
   */
  createStaff: (staffData) => {
    return httpClient.post('/staff/register', staffData);
  }
};
