/**
 * Reports API Service
 * 
 * Handles analytics related API calls.
 */
import httpClient from '../network/httpClient';

export const reportAPI = {
  /**
   * Fetch overview report
   */
  fetchOverview: () => {
    return httpClient.get('/reports/overview');
  }
};
