import { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiService';

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState(new Set()); // Track which products are being deleted
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: ''
  });

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = {
          ...editingProduct,
          ...formData,
          price: parseFloat(formData.price)
        };
        await dashboardService.saveProduct(updatedProduct);
        setProducts(products.map(p => 
          p.id === editingProduct.id ? updatedProduct : p
        ));
        setEditingProduct(null);
      } else {
        // Create new product with unique ID
        const generateUniqueId = () => {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substr(2, 9);
          return `${timestamp}-${random}`;
        };
        
        const newProduct = {
          id: generateUniqueId(),
          ...formData,
          price: parseFloat(formData.price)
        };
        await dashboardService.saveProduct(newProduct);
        setProducts([...products, newProduct]);
      }
      setFormData({ name: '', price: '', category: '' });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      // Add confirmation dialog
      const productName = products.find(p => p.id === id)?.name || 'this product';
      if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
        return;
      }
      
      setError(''); // Clear any previous errors
      setDeletingIds(prev => new Set(prev).add(id)); // Set loading state
      
      await dashboardService.deleteProduct(id);
      
      // Remove from local state
      setProducts(products.filter(p => p.id !== id));
      
    } catch (err) {
      setError(`Failed to delete product: ${err.message || 'Unknown error'}`);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="products">
        <div className="section-header">
          <h2>Products Management</h2>
        </div>
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="section-header">
        <h2>Products Management</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="add-btn"
        >
          Add Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingProduct ? 'Update' : 'Save'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setFormData({ name: '', price: '', category: '' });
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
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No products found</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(product)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="delete-btn"
                      disabled={deletingIds.has(product.id)}
                    >
                      {deletingIds.has(product.id) ? 'Deleting...' : 'Delete'}
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

export default Products; 