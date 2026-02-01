/**
 * HTTP Client Configuration
 * 
 * Centralized API client with interceptors.
 * Different naming and structure from original.
 */
import axios from 'axios';

const apiEndpoint = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const httpClient = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true, // Required for cookie-based auth
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for standardized error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'Network error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export default httpClient;
