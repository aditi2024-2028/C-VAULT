/**
 * Incident API Service
 * 
 * Handles incident/case related API calls.
 */
import httpClient from '../network/httpClient';

export const incidentAPI = {
  /**
   * Fetch all incidents
   */
  fetchAll: () => {
    return httpClient.get('/incidents');
  },

  /**
   * Search incidents with filters
   */
  search: (queryString) => {
    return httpClient.get('/incidents/search', { params: { q: queryString } });
  },

  /**
   * Fetch single incident by ID
   */
  fetchById: (incidentId) => {
    return httpClient.get(`/incidents/${incidentId}`);
  },

  /**
   * Create new incident
   */
  create: (incidentData) => {
    return httpClient.post('/incidents', incidentData);
  },

  /**
   * Fetch dashboard metrics
   */
  fetchMetrics: () => {
    return httpClient.get('/incidents/metrics');
  },

  /**
   * Fetch pending alerts
   */
  fetchPendingAlerts: (days = 90) => {
    return httpClient.get('/incidents/alerts/pending', { params: { days } });
  }
};
