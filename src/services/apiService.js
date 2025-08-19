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

// Dashboard API Service
export const dashboardService = {
  // Products Management
  async getProducts() {
    try {
      const response = await apiClient.get('/json/products.json');
      return response.data.content || response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async saveProduct(product) {
    try {
      const response = await apiClient.put('/json', {
        filename: 'products.json',
        content: product
      });
      return response.data;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await apiClient.delete('/json', {
        data: {
          filename: 'products.json',
          content: { id: productId }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Services Management
  async getServices() {
    try {
      const response = await apiClient.get('/json/services.json');
      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  async saveService(service) {
    try {
      const response = await apiClient.put('/json', {
        filename: 'services.json',
        content: service
      });
      return response.data;
    } catch (error) {
      console.error('Error saving service:', error);
      throw error;
    }
  },

  async deleteService(serviceId) {
    try {
      const response = await apiClient.delete('/json', {
        data: {
          filename: 'services.json',
          content: { id: serviceId }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  // Contacts Management
  async getContacts() {
    try {
      const response = await apiClient.get('/json/contacts.json');
      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  },

  async saveContact(contact) {
    try {
      const response = await apiClient.put('/json', {
        filename: 'contacts.json',
        content: contact
      });
      return response.data;
    } catch (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
  },

  async deleteContact(contactId) {
    try {
      const response = await apiClient.delete('/json', {
        data: {
          filename: 'contacts.json',
          content: { id: contactId }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  // Orders Management
  async getOrders() {
    try {
      const response = await apiClient.get('/json/orders.json');
      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async saveOrder(order) {
    try {
      const response = await apiClient.put('/json', {
        filename: 'orders.json',
        content: order
      });
      return response.data;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const response = await apiClient.delete('/json', {
        data: {
          filename: 'orders.json',
          content: { id: orderId }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await apiClient.put('/json', {
        filename: 'orders.json',
        content: { id: orderId, status: newStatus }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default apiClient; 