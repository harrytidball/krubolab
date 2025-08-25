import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiService';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (id) => {
    // Confirm deletion
    if (!window.confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      console.log('Attempting to delete order with ID:', id);
      const result = await dashboardService.deleteOrder(id);
      console.log('Delete result:', result);
      
      // Remove the order from local state
      const updatedOrders = orders.filter(o => o.id !== id);
      console.log('Orders before delete:', orders.length, 'After delete:', updatedOrders.length);
      setOrders(updatedOrders);
      
      // Clear any previous errors
      setError('');
      
      // Close the expanded order if it was the one being deleted
      if (expandedOrder === id) {
        setExpandedOrder(null);
      }
      
      console.log('Order deleted successfully');
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(`Failed to delete order: ${err.message}`);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.orderNumber?.toLowerCase().includes(searchLower) ||
      order.customer?.fullName?.toLowerCase().includes(searchLower) ||
      order.customer?.email?.toLowerCase().includes(searchLower) ||
      order.items?.some(item => 
        item.name?.toLowerCase().includes(searchLower)
      ) ||
      order.total?.toString().includes(searchLower) ||
      order.date?.includes(searchLower)
    );
  });



  // Sorting function
  const sortOrders = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort the filtered orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle nested properties
    if (sortConfig.key === 'customerName') {
      aValue = a.customer?.fullName || '';
      bValue = b.customer?.fullName || '';
    } else if (sortConfig.key === 'customerEmail') {
      aValue = a.customer?.email || '';
      bValue = b.customer?.email || '';
    } else if (sortConfig.key === 'items') {
      aValue = a.items?.[0]?.name || '';
      bValue = b.items?.[0]?.name || '';
    }

    // Convert to strings for comparison
    aValue = String(aValue || '').toLowerCase();
    bValue = String(bValue || '').toLowerCase();

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Search and Results Info */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for an order"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="results-info" style={{ marginLeft: '10px' }}>
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th 
                className="sortable-header"
                onClick={() => sortOrders('date')}
              >
                Date
                {sortConfig.key === 'date' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable-header"
                onClick={() => sortOrders('orderNumber')}
              >
                Order #
                {sortConfig.key === 'orderNumber' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable-header"
                onClick={() => sortOrders('items')}
              >
                Items
                {sortConfig.key === 'items' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable-header"
                onClick={() => sortOrders('total')}
              >
                Total
                {sortConfig.key === 'total' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {searchTerm ? 'No orders match your search' : 'No orders found'}
                </td>
              </tr>
            ) : (
              currentOrders.map(order => (
                <React.Fragment key={order.id}>
                  <tr 
                    className={`order-row ${expandedOrder === order.id ? 'expanded' : ''}`}
                    onClick={() => toggleOrderExpansion(order.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{order.date ? new Date(order.date).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}</td>
                    <td>{order.orderNumber}</td>
                    <td>
                      <div className="order-items">
                        {order.items?.map((item, index) => (
                          <div key={index} className="order-item">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                            {item.size && <span className="item-size">({item.size})</span>}
                            {item.color && <span className="item-color">[{item.color}]</span>}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>{order.total ? new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(order.total) : 'N/A'}</td>
                    <td>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order.id);
                        }}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr className="customer-details-row">
                      <td colSpan="5">
                        <div className="customer-details">
                          <h4>Customer Details</h4>
                          <div className="customer-info-grid">
                            <div className="customer-info-item">
                              <strong>Full Name:</strong> {order.customer?.fullName}
                            </div>
                            <div className="customer-info-item">
                              <strong>Email:</strong> {order.customer?.email}
                            </div>
                            <div className="customer-info-item">
                              <strong>Phone:</strong> {order.customer?.phone}
                            </div>
                            <div className="customer-info-item">
                              <strong>Identification:</strong> {order.customer?.identificationType} - {order.customer?.identificationNumber}
                            </div>
                            <div className="customer-info-item">
                              <strong>Address:</strong> {order.customer?.street}, {order.customer?.city}, {order.customer?.department}
                            </div>
                            {order.customer?.additionalInfo && (
                              <div className="customer-info-item">
                                <strong>Additional Info:</strong> {order.customer.additionalInfo}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders; 