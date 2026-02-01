/**
 * Transfer API Service
 * 
 * Handles custody transfer related API calls.
 */
import httpClient from '../network/httpClient';

export const transferAPI = {
  /**
   * Fetch transfer history for evidence
   */
  fetchHistory: (evidenceId) => {
    return httpClient.get(`/transfers/evidence/${evidenceId}`);
  },

  /**
   * Record new transfer
   */
  record: (transferData) => {
    return httpClient.post('/transfers', transferData);
  },

  /**
   * Alias for backward compatibility
   */
  getByEvidence: (evidenceId) => {
    return httpClient.get(`/transfers/evidence/${evidenceId}`);
  }
};
