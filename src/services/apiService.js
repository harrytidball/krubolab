import axios from 'axios';

import { ENV_CONFIG } from '../config/env';

// Use environment configuration
const API_BASE_URL = ENV_CONFIG.API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Service for JSON file operations
export const jsonFileService = {
  // Write data to JSON file (appends to existing content)
  async writeToFile(filename, data) {
    try {
      const response = await apiClient.put('/json', {
        filename: filename,
        content: data
      });
      return response.data;
    } catch (error) {
      console.error('Error writing to file:', error);
      throw error;
    }
  },

  // Remove data from JSON file
  async removeFromFile(filename, dataToRemove) {
    try {
      const response = await apiClient.delete('/json', {
        data: {
          filename: filename,
          content: dataToRemove
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from file:', error);
      throw error;
    }
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default apiClient; 