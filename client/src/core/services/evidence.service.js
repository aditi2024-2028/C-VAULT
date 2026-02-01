/**
 * Evidence API Service
 * 
 * Handles evidence item related API calls.
 */
import httpClient from '../network/httpClient';

export const evidenceAPI = {
  /**
   * Fetch evidence items for an incident
   */
  fetchByIncident: (incidentId) => {
    return httpClient.get(`/evidence/incident/${incidentId}`);
  },

  /**
   * Fetch single evidence item
   */
  fetchById: (evidenceId) => {
    return httpClient.get(`/evidence/${evidenceId}`);
  },

  /**
   * Search evidence items
   */
  search: (params) => {
    return httpClient.get('/evidence/search', { params });
  },

  /**
   * Register new evidence item (with photo upload)
   */
  register: (formData) => {
    return httpClient.post('/evidence', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Alias for backward compatibility
   */
  getByIncident: (incidentId) => {
    return httpClient.get(`/evidence/incident/${incidentId}`);
  }
};
