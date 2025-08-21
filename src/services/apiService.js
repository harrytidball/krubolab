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

  async createProduct(product) {
    try {
      const response = await apiClient.put('/json', {
        filename: 'products.json',
        content: product
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(productId, updatedProduct) {
    try {
      // Get current products
      const currentProducts = await this.getProducts();
      
      // Remove the old product and add the updated one
      const updatedProducts = currentProducts.map(p => 
        p.id === productId ? updatedProduct : p
      );
      
      // Send with replace mode to prevent duplication
      const response = await apiClient.put('/json', {
        filename: 'products.json',
        content: updatedProducts,
        mode: 'replace'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async saveProduct(product) {
    try {
      // This method is kept for backward compatibility
      // It will determine if it's a create or update operation
      const currentProducts = await this.getProducts();
      const existingProduct = currentProducts.find(p => p.id === product.id);
      
      if (existingProduct) {
        // Update existing product
        return await this.updateProduct(product.id, product);
      } else {
        // Create new product
        return await this.createProduct(product);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },

  async deleteProduct(productId) {
    try {
      // First, try to get the current products to find the one to delete
      const currentProducts = await this.getProducts();
      const productToDelete = currentProducts.find(p => p.id === productId);
      
      if (!productToDelete) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      
      // Try method 1: Remove the specific product from the file
      try {
        const response = await apiClient.delete('/json', {
          data: {
            filename: 'products.json',
            content: productToDelete  // Send the full product object instead of just ID
          }
        });
        
        return response.data;
      } catch (method1Error) {
        // Try method 2: Send just the ID
        try {
          const response = await apiClient.delete('/json', {
            data: {
              filename: 'products.json',
              content: { id: productId }
            }
          });
          
          return response.data;
        } catch (method2Error) {
          // Try method 3: Update the file by removing the product
          const updatedProducts = currentProducts.filter(p => p.id !== productId);
          const response = await apiClient.put('/json', {
            filename: 'products.json',
            content: updatedProducts
          });
          
          return response.data;
        }
      }
      
    } catch (error) {
      console.error('Error deleting product:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
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