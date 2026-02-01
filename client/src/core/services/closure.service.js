/**
 * Closure API Service
 * 
 * Handles case closure related API calls.
 */
import httpClient from '../network/httpClient';

export const closureAPI = {
  /**
   * Record case closure
   */
  recordClosure: (closureData) => {
    return httpClient.post('/closures', closureData);
  },

  /**
   * Fetch closure record for incident
   */
  fetchByIncident: (incidentId) => {
    return httpClient.get(`/closures/incident/${incidentId}`);
  }
};
