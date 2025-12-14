import { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiService';

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // New state for save/update operations
  const [deletingIds, setDeletingIds] = useState(new Set()); // Track which products are being deleted
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    images: [''],
    colours: [''],
    measurements: [''], // Changed from medidas to measurements
    materials: [''],
    additionalInformation: ''
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
      setSaving(true); // Start loading
      setError(''); // Clear any previous errors
      
      if (editingProduct) {
        // Update existing product
        const updatedProduct = {
          ...editingProduct,
          ...formData,
          price: formData.price, // Keep as string
          images: formData.images.filter(img => img.trim() !== ''),
          colours: formData.colours.filter(col => col.trim() !== ''),
          measurements: formData.measurements.filter(med => med.trim() !== ''),
          materials: formData.materials.filter(mat => mat.trim() !== '')
        };
        
        // Use the dedicated update method
        await dashboardService.updateProduct(editingProduct.id, updatedProduct);
        
        // Update local state
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
          price: formData.price, // Keep as string
          images: formData.images.filter(img => img.trim() !== ''),
          colours: formData.colours.filter(col => col.trim() !== ''),
          measurements: formData.measurements.filter(med => med.trim() !== ''),
          materials: formData.materials.filter(mat => mat.trim() !== '')
        };
        
        // Use the dedicated create method
        await dashboardService.createProduct(newProduct);
        setProducts([...products, newProduct]);
      }
      setFormData({ 
        name: '', 
        price: '', 
        description: '', 
        images: [''], 
        colours: [''], 
        measurements: [''], 
        materials: [''],
        additionalInformation: '' 
      });
      setShowForm(false);
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setSaving(false); // Stop loading regardless of success/failure
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price ? product.price.toString() : '',
      description: product.description || '',
      images: product.images && product.images.length > 0 ? [...product.images, ''] : [''],
      colours: product.colours && product.colours.length > 0 ? [...product.colours, ''] : [''],
      measurements: product.measurements && product.measurements.length > 0 ? [...product.measurements, ''] : [''],
      materials: product.materials && product.materials.length > 0 ? [...product.materials, ''] : [''],
      additionalInformation: product.additionalInformation || ''
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

  // Helper functions for dynamic arrays
  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
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
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Images:</label>
                {formData.images.map((image, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={image}
                      onChange={(e) => updateArrayItem('images', index, e.target.value)}
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        className="remove-array-item-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('images')}
                  className="add-array-item-btn"
                >
                  + Add Image
                </button>
              </div>

              <div className="form-group">
                <label>Colours:</label>
                {formData.colours.map((colour, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      placeholder="Colour name"
                      value={colour}
                      onChange={(e) => updateArrayItem('colours', index, e.target.value)}
                    />
                    {formData.colours.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('colours', index)}
                        className="remove-array-item-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('colours')}
                  className="add-array-item-btn"
                >
                  + Add Colour
                </button>
              </div>

              <div className="form-group">
                <label>Medidas (Measurements):</label>
                {formData.measurements.map((medida, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      placeholder="Measurement"
                      value={medida}
                      onChange={(e) => updateArrayItem('measurements', index, e.target.value)}
                    />
                    {formData.measurements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('measurements', index)}
                        className="remove-array-item-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('measurements')}
                  className="add-array-item-btn"
                >
                  + Add Measurement
                </button>
              </div>

              <div className="form-group">
                <label>Materials:</label>
                {formData.materials.map((material, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      placeholder="Material name"
                      value={material}
                      onChange={(e) => updateArrayItem('materials', index, e.target.value)}
                    />
                    {formData.materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('materials', index)}
                        className="remove-array-item-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('materials')}
                  className="add-array-item-btn"
                >
                  + Add Material
                </button>
              </div>

              <div className="form-group">
                <label>Additional Information:</label>
                <textarea
                  value={formData.additionalInformation}
                  onChange={(e) => setFormData({...formData, additionalInformation: e.target.value})}
                  rows="3"
                  placeholder="Any additional details about the product..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="loading-spinner"></span>
                      {editingProduct ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    editingProduct ? 'Update' : 'Save'
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setFormData({ 
                      name: '', 
                      price: '', 
                      description: '', 
                      images: [''], 
                      colours: [''], 
                      measurements: [''], 
                      materials: [''],
                      additionalInformation: '' 
                    });
                    setError('');
                  }}
                  className="cancel-btn"
                  disabled={saving}
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
              <th>Description</th>
              <th>Images</th>
              <th>Colours</th>
              <th>Medidas</th>
              <th>Materials</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">No products found</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td className="product-id">{product.id}</td>
                  <td className="product-name">{product.name}</td>
                  <td className="product-price">${product.price}</td>
                  <td className="product-description">
                    {product.description ? 
                      (product.description.length > 50 ? 
                        `${product.description.substring(0, 50)}...` : 
                        product.description
                      ) : 
                      '-'
                    }
                  </td>
                  <td className="product-images">
                    {product.images && product.images.length > 0 ? 
                      `${product.images.length} image(s)` : 
                      '-'
                    }
                  </td>
                  <td className="product-colours">
                    {product.colours && product.colours.length > 0 ? 
                      product.colours.join(', ') : 
                      '-'
                    }
                  </td>
                  <td className="product-medidas">
                    {product.measurements && product.measurements.length > 0 ? 
                      product.measurements.join(', ') : 
                      '-'
                    }
                  </td>
                  <td className="product-materials">
                    {product.materials && product.materials.length > 0 ? 
                      product.materials.join(', ') : 
                      '-'
                    }
                  </td>
                  <td className="product-actions">
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