import { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiService';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    items: '',
    total: '',
    status: '',
    date: ''
  });

  // Fetch orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        // Update existing order
        const updatedOrder = {
          ...editingOrder,
          ...formData,
          total: parseFloat(formData.total)
        };
        await dashboardService.saveOrder(updatedOrder);
        setOrders(orders.map(o => 
          o.id === editingOrder.id ? updatedOrder : o
        ));
        setEditingOrder(null);
      } else {
        // Create new order
        const newOrder = {
          id: Date.now(),
          ...formData,
          total: parseFloat(formData.total)
        };
        await dashboardService.saveOrder(newOrder);
        setOrders([...orders, newOrder]);
      }
      setFormData({ customerName: '', customerEmail: '', items: '', total: '', status: '', date: '' });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Failed to save order');
      console.error('Error saving order:', err);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items,
      total: order.total.toString(),
      status: order.status,
      date: order.date
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await dashboardService.deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete order');
      console.error('Error deleting order:', err);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await dashboardService.updateOrderStatus(id, newStatus);
      setOrders(orders.map(o => 
        o.id === id ? { ...o, status: newStatus } : o
      ));
      setError('');
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  if (loading) {
    return (
      <div className="orders">
        <div className="section-header">
          <h2>Orders Management</h2>
        </div>
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="section-header">
        <h2>Orders Management</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="add-btn"
        >
          Add Order
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingOrder ? 'Edit Order' : 'Add New Order'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer Name:</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Customer Email:</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Items:</label>
                <textarea
                  value={formData.items}
                  onChange={(e) => setFormData({...formData, items: e.target.value})}
                  required
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Total:</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => setFormData({...formData, total: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingOrder ? 'Update' : 'Save'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingOrder(null);
                    setFormData({ customerName: '', customerEmail: '', items: '', total: '', status: '', date: '' });
                    setError('');
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">No orders found</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerEmail}</td>
                  <td>{order.items}</td>
                  <td>${order.total}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`status-select status-${order.status.toLowerCase()}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(order)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders; 