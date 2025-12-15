import { getSupabaseClient } from '../config/supabase';

// Data transformation helpers
const transformProductFromDB = (product) => {
  if (!product) return null;
  return {
    ...product,
    additionalInformation: product.additional_information || ''
  };
};

const transformOrderFromDB = (order) => {
  if (!order) return null;
  return {
    ...order,
    orderNumber: order.order_number
  };
};

// Legacy JSON file service (kept for backward compatibility if needed)
export const jsonFileService = {
  async writeToFile(filename, data) {
    throw new Error('JSON file service is deprecated. Please use Supabase Postgres.');
  },

  async removeFromFile(filename, dataToRemove) {
    throw new Error('JSON file service is deprecated. Please use Supabase Postgres.');
  }
};

// Dashboard API Service using Supabase Postgres
export const dashboardService = {
  // Products Management
  async getProducts() {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformProductFromDB);
    } catch (error) {
      throw error;
    }
  },

  async createProduct(product) {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('products')
        .insert([{
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          images: product.images || [],
          colours: product.colours || [],
          measurements: product.measurements || [],
          materials: product.materials || [],
          additional_information: product.additionalInformation || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return transformProductFromDB(data);
    } catch (error) {
      throw error;
    }
  },

  async updateProduct(productId, updatedProduct) {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description,
          images: updatedProduct.images || [],
          colours: updatedProduct.colours || [],
          measurements: updatedProduct.measurements || [],
          materials: updatedProduct.materials || [],
          additional_information: updatedProduct.additionalInformation || ''
        })
        .eq('id', productId)
        .select()
        .single();
      
      if (error) throw error;
      return transformProductFromDB(data);
    } catch (error) {
      throw error;
    }
  },

  async saveProduct(product) {
    try {
      const supabase = await getSupabaseClient();
      // Check if product exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('id', product.id)
        .maybeSingle();
      
      if (existingProduct) {
        return await this.updateProduct(product.id, product);
      } else {
        return await this.createProduct(product);
      }
    } catch (error) {
      throw error;
    }
  },

  async deleteProduct(productId) {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Services Management
  async getServices() {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async saveService(service) {
    try {
      const supabase = await getSupabaseClient();
      // Check if service exists
      const { data: existingService } = await supabase
        .from('services')
        .select('id')
        .eq('id', service.id)
        .maybeSingle();
      
      if (existingService) {
        // Update existing service
        const { data, error } = await supabase
          .from('services')
          .update({
            name: service.name,
            price: service.price,
            duration: service.duration,
            category: service.category
          })
          .eq('id', service.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new service
        const { data, error } = await supabase
          .from('services')
          .insert([{
            id: service.id,
            name: service.name,
            price: service.price,
            duration: service.duration,
            category: service.category
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      throw error;
    }
  },

  async deleteService(serviceId) {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Contacts Management
  async getContacts() {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async saveContact(contact) {
    try {
      const supabase = await getSupabaseClient();
      // Check if contact exists
      const { data: existingContact } = await supabase
        .from('contacts')
        .select('id')
        .eq('id', contact.id)
        .maybeSingle();
      
      if (existingContact) {
        // Update existing contact
        const { data, error } = await supabase
          .from('contacts')
          .update({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            company: contact.company,
            status: contact.status
          })
          .eq('id', contact.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new contact
        const { data, error } = await supabase
          .from('contacts')
          .insert([{
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            company: contact.company,
            status: contact.status
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      throw error;
    }
  },

  async deleteContact(contactId) {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Orders Management
  async getOrders() {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformOrderFromDB);
    } catch (error) {
      return [];
    }
  },

  async saveOrder(order) {
    try {
      const supabase = await getSupabaseClient();
      // Check if order exists
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('id', order.id)
        .maybeSingle();
      
      if (existingOrder) {
        // Update existing order
        const { data, error } = await supabase
          .from('orders')
          .update({
            order_number: order.orderNumber,
            date: order.date,
            customer: order.customer || {},
            items: order.items || [],
            total: order.total,
            status: order.status || 'pending'
          })
          .eq('id', order.id)
          .select()
          .single();
        
        if (error) throw error;
        return transformOrderFromDB(data);
      } else {
        // Create new order
        const { data, error } = await supabase
          .from('orders')
          .insert([{
            id: order.id,
            order_number: order.orderNumber,
            date: order.date,
            customer: order.customer || {},
            items: order.items || [],
            total: order.total,
            status: order.status || 'pending'
          }])
          .select()
          .single();
        
        if (error) throw error;
        return transformOrderFromDB(data);
      }
    } catch (error) {
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) throw error;
      return transformOrderFromDB(data);
    } catch (error) {
      throw error;
    }
  }
};

// Helper function to get full API URL (kept for backward compatibility)
export const getApiUrl = (endpoint) => {
  return endpoint;
};

// Legacy default export (kept for backward compatibility)
export default null;
