import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/apiService';
import './Checkout.css';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [enrichedCartItems, setEnrichedCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingCart, setIsEditingCart] = useState(false);
  const [editingItems, setEditingItems] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    identificationType: 'cedula',
    identificationNumber: '',
    phone: '',
    department: '',
    city: '',
    street: '',
    additionalInfo: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart items from localStorage and enrich with product details
    const loadAndEnrichCartItems = async () => {
      try {
        setIsLoading(true);
        const stored = localStorage.getItem('krubolab-cart');
        
        if (stored) {
          const items = JSON.parse(stored);
          setCartItems(items);
          
          if (items.length === 0) {
            setEnrichedCartItems([]);
            setEditingItems([]);
            setIsLoading(false);
            return;
          }
          
          // Cart items are now stored as full objects, no need for enrichment
          const enriched = items.map(item => {
            return {
              id: item.id,
              name: item.name,
              description: item.description,
              image: item.image,
              price: item.price,
              quantity: item.quantity || 1,
              category: item.category,
              material: item.material,
              dimensions: item.dimensions || [],
              colours: item.colours || [],
              size: item.size,
              color: item.color
            };
          });

          // Fetch full product data to get all available colors and measurements
          try {
            const allProducts = await dashboardService.getProducts();
            const enrichedWithFullData = enriched.map(cartItem => {
              const fullProduct = allProducts.find(p => p.id === cartItem.id);
              if (fullProduct) {
                return {
                  ...cartItem,
                  colours: fullProduct.colours || [], // All available colors
                  measurements: fullProduct.measurements || [] // All available measurements
                };
              }
              return cartItem;
            });
            
            setEnrichedCartItems(enrichedWithFullData);
            setEditingItems(enrichedWithFullData.map(item => ({
              ...item,
              tempQuantity: item.quantity || 1,
              tempColor: item.color,
              tempSize: item.size
            })));
          } catch (error) {
            console.error('Error fetching full product data:', error);
            // Fallback to basic enrichment if API fails
            setEnrichedCartItems(enriched);
            setEditingItems(enriched.map(item => ({
              ...item,
              tempQuantity: item.quantity || 1,
              tempColor: item.color,
              tempSize: item.size
            })));
          }
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        setEnrichedCartItems([]);
        setEditingItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndEnrichCartItems();

    // Listen for cart changes
    const handleCartChange = () => {
      loadAndEnrichCartItems();
    };

    window.addEventListener('cartChanged', handleCartChange);
    return () => window.removeEventListener('cartChanged', handleCartChange);
  }, []);

  // Set initial filled state for fields with default values
  useEffect(() => {
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      if (input.value.trim() !== '') {
        input.classList.add('filled');
        const helper = input.parentNode.querySelector('.form-helper');
        if (helper) helper.classList.add('filled');
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
    
    // Add/remove filled class for visual feedback
    const input = e.target;
    const helper = input.parentNode.querySelector('.form-helper');
    
    if (value.trim() !== '') {
      input.classList.add('filled');
      if (helper) helper.classList.add('filled');
    } else {
      input.classList.remove('filled');
      if (helper) helper.classList.remove('filled');
    }
  };

  const handleIdentificationTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      identificationType: type,
      identificationNumber: '' // Clear the identification number when type changes
    }));
  };

  // Cart editing functions
  const handleEditCart = () => {
    // Ensure we have items to edit
    if (!enrichedCartItems || enrichedCartItems.length === 0) {
      console.warn('No items to edit in cart');
      return;
    }
    
    // Initialize editing items with safe defaults and ensure arrays
    const safeEditingItems = enrichedCartItems.map(item => {
      // Ensure dimensions and colours are always arrays
      const safeItem = {
        ...item,
        tempQuantity: item.quantity || 1,
        tempColor: item.color || null,
        tempSize: item.size || null,
        dimensions: Array.isArray(item.dimensions) ? item.dimensions : 
                   (item.dimensions ? [item.dimensions] : []),
        colours: Array.isArray(item.colours) ? item.colours : 
                (item.colours ? [item.colours] : [])
      };
      
      return safeItem;
    });
    
    setEditingItems(safeEditingItems);
    setIsEditingCart(true);
  };

  const handleCancelEdit = () => {
    setIsEditingCart(false);
    // Reset editing items to original values
    if (enrichedCartItems && enrichedCartItems.length > 0) {
      setEditingItems(enrichedCartItems.map(item => {
        // Ensure dimensions and colours are always arrays
        return {
          ...item,
          tempQuantity: item.quantity || 1,
          tempColor: item.color || null,
          tempSize: item.size || null,
          dimensions: Array.isArray(item.dimensions) ? item.dimensions : 
                     (item.dimensions ? [item.dimensions] : []),
          colours: Array.isArray(item.colours) ? item.colours : 
                  (item.colours ? [item.colours] : [])
        };
      }));
    } else {
      // If no enriched items, reset to empty array
      setEditingItems([]);
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 0) return;
    
    if (newQuantity === 0) {
      // Remove item when quantity reaches 0
      handleRemoveItem(index);
      return;
    }
    
    setEditingItems(prev => prev.map((item, i) => 
      i === index ? { ...item, tempQuantity: newQuantity } : item
    ));
  };

  const handleColorChange = (index, newColor) => {
    setEditingItems(prev => prev.map((item, i) => 
      i === index ? { ...item, tempColor: newColor } : item
    ));
  };

  const handleSizeChange = (index, newSize) => {

    setEditingItems(prev => prev.map((item, i) => 
      i === index ? { ...item, tempSize: newSize } : item
    ));
  };

  const handleRemoveItem = (index) => {

    setEditingItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveCartChanges = () => {
    // Filter out items with quantity 0 and update quantities
    const updatedItems = editingItems
      .filter(item => item.tempQuantity > 0)
      .map(item => ({
        ...item,
        quantity: item.tempQuantity,
        color: item.tempColor,
        size: item.tempSize
      }));

    // Update enriched cart items
    setEnrichedCartItems(updatedItems);
    
    // Update localStorage with updated cart data (same format)
    localStorage.setItem('krubolab-cart', JSON.stringify(updatedItems));
    
    // Exit edit mode
    setIsEditingCart(false);
    
    // Dispatch cart change event
    window.dispatchEvent(new Event('cartChanged'));
    
    // If no products left after saving changes, redirect to home page
    if (updatedItems.length === 0) {
      navigate('/');
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['email', 'fullName', 'identificationNumber', 'phone', 'department', 'city', 'street'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = true;
      }
    });
    
    setValidationErrors(errors);
    
    // If there are validation errors, scroll to the first one
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        errorElement.focus();
      }
    }
    
    return Object.keys(errors).length === 0;
  };

  const calculateSubtotal = () => {
    const itemsToCalculate = isEditingCart ? editingItems : enrichedCartItems;
    return itemsToCalculate.reduce((total, item) => {
      let itemPrice = item.price;
      if (typeof itemPrice === 'string') {
        itemPrice = parseFloat(itemPrice.replace(/\./g, ''));
      }
      const quantity = isEditingCart ? item.tempQuantity : (item.quantity || 1);
      return total + (itemPrice * quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    // Convert string price like "60.000" to number
    let numericPrice = price;
    if (typeof price === 'string') {
      // Remove dots and convert to number
      numericPrice = parseFloat(price.replace(/\./g, ''));
    }
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericPrice);
  };

  const handleEditCartNavigation = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    try {
      // Create order object in the format expected by the Orders component
      const order = {
        id: Date.now().toString(),
        items: enrichedCartItems.map(item => {
          const itemData = {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          };
          
          if (item.size && item.size.length > 0) itemData.size = item.size;
          if (item.color && item.color.length > 0) itemData.color = item.color;
          
          return itemData;
        }),
        total: calculateSubtotal(),
        date: new Date().toISOString().split('T')[0],
        orderNumber: `KRU-${Date.now()}`,
        customer: formData
      };

      // Save order to API
      await dashboardService.saveOrder(order);
      
      // Clear cart from localStorage
      localStorage.removeItem('krubolab-cart');
      
      // Dispatch cart change event
      window.dispatchEvent(new Event('cartChanged'));
      
      // Redirect to confirmation page with order data
      navigate('/confirmacion', { 
        state: { orderData: order } 
      });
      
    } catch (error) {
      alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
    }
  };

  if (isLoading) {
    return (
      <div className="checkout-loading">
        <div className="checkout-loading-content">
          <div className="loading-spinner"></div>
          <p>Cargando información del carrito...</p>
        </div>
      </div>
    );
  }

  if (enrichedCartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-content">
          <div className="checkout-empty-logo">
            <img src="/images/krubo-logo.png" alt="Krubo Lab" className="krubo-logo" />
          </div>
          <h2 className="checkout-empty-title">Tu carrito está vacío</h2>
          <p className="checkout-empty-description">Agrega algunos productos antes de proceder al checkout</p>
          <button onClick={() => navigate('/')} className="checkout-empty-btn">
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

  const itemsToDisplay = isEditingCart ? (editingItems || []) : (enrichedCartItems || []);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-content">
          {/* Left Column - User Information Form */}
          <div className="checkout-form-section">
            <div className="checkout-logo">
              <img 
                src="/images/krubo-logo.png" 
                alt="KRUBO Logo" 
                className="checkout-logo-image"
              />
            </div>
            <h1 className="checkout-title">
              Completa tus datos e información de despacho
            </h1>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${formData.email ? 'filled' : ''} ${validationErrors.email ? 'unfilled' : ''}`}
                />
                <div className={`form-helper ${formData.email ? 'filled' : ''} ${validationErrors.email ? 'unfilled' : ''}`}>
                  Se utiliza para confirmar pedidos
                </div>
              </div>

              {/* Full Name Field */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`form-input ${formData.fullName ? 'filled' : ''} ${validationErrors.fullName ? 'unfilled' : ''}`}
                />
                <div className={`form-helper ${formData.fullName ? 'filled' : ''} ${validationErrors.fullName ? 'unfilled' : ''}`}>
                  Nombre completo de quien recibirá el pedido
                </div>
              </div>

              {/* Identification Type */}
              <div className="form-group">
                <label className="form-label">Identificación</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="identificationType"
                      value="cedula"
                      checked={formData.identificationType === 'cedula'}
                      onChange={() => handleIdentificationTypeChange('cedula')}
                      className="radio-input"
                    />
                    <span className="radio-text">Cédula de Ciudadanía</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="identificationType"
                      value="extranjeria"
                      checked={formData.identificationType === 'extranjeria'}
                      onChange={() => handleIdentificationTypeChange('extranjeria')}
                      className="radio-input"
                    />
                    <span className="radio-text">Cédula Extranjería</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="identificationType"
                      value="nit"
                      checked={formData.identificationType === 'nit'}
                      onChange={() => handleIdentificationTypeChange('nit')}
                      className="radio-input"
                    />
                    <span className="radio-text">Número NIT</span>
                  </label>
                </div>
              </div>

              {/* Identification Number */}
              <div className="form-group">
                <label htmlFor="identificationNumber" className="form-label">
                  {formData.identificationType === 'cedula' && 'Cédula de Ciudadanía'}
                  {formData.identificationType === 'extranjeria' && 'Cédula Extranjería'}
                  {formData.identificationType === 'nit' && 'Número NIT'}
                </label>
                <input
                  type="text"
                  id="identificationNumber"
                  name="identificationNumber"
                  value={formData.identificationNumber}
                  onChange={handleInputChange}
                  className={`form-input ${formData.phone ? 'filled' : ''} ${validationErrors.phone ? 'unfilled' : ''}`}
                />
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Número de teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`form-input ${formData.phone ? 'filled' : ''} ${validationErrors.phone ? 'unfilled' : ''}`}
                />
                <div className={`form-helper ${formData.phone ? 'filled' : ''} ${validationErrors.phone ? 'unfilled' : ''}`}>
                  Utilizado de ser necesario para entregas y otros
                </div>
              </div>

              {/* Department */}
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Departamento
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`form-input ${formData.department ? 'filled' : ''} ${validationErrors.department ? 'unfilled' : ''}`}
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  Ciudad
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`form-input ${formData.city ? 'filled' : ''} ${validationErrors.city ? 'unfilled' : ''}`}
                />
                <div className={`form-helper ${formData.city ? 'filled' : ''} ${validationErrors.city ? 'unfilled' : ''}`}>
                  Nombre completo de quien recibirá el pedido
                </div>
              </div>

              {/* Street and Number */}
              <div className="form-group">
                <label htmlFor="street" className="form-label">
                  Calle/carrera y número donde se enviarán los productos
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`form-input ${formData.street ? 'filled' : ''} ${validationErrors.street ? 'unfilled' : ''}`}
                />
                <div className={`form-helper ${formData.street ? 'filled' : ''} ${validationErrors.street ? 'unfilled' : ''}`}>
                  Ej: Carrera 20# 15-27
                </div>
              </div>

              {/* Optional: Tower, Apartment, Office */}
              <div className="form-group">
                <label htmlFor="additionalInfo" className="form-label">
                  Torre, apartamento, oficina, condominio (opcional)
                </label>
                <input
                  type="text"
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  className={`form-input ${formData.additionalInfo ? 'filled' : ''} ${validationErrors.additionalInfo ? 'unfilled' : ''}`}
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-checkout">
                Continuar
              </button>
              <button type="button" onClick={handleEditCartNavigation} className="btn-back-cart">
                Volver al inicio
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-summary-section">
            <div className="order-summary">
              <div className="subtotal-section">
                <span className="subtotal-label">Precio subtotal</span>
                <span className="subtotal-price">{formatPrice(calculateSubtotal())}</span>
              </div>

              {!isEditingCart ? (
                <button onClick={handleEditCart} className="btn-edit-cart">
                  <svg className="edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Editar productos en el carrito
                </button>
              ) : (
                <div className="cart-edit-controls">
                  <button onClick={handleSaveCartChanges} className="btn-save-cart">
                    Guardar cambios
                  </button>
                  <button onClick={handleCancelEdit} className="btn-cancel-edit">
                    Cancelar
                  </button>
                </div>
              )}

              {itemsToDisplay.length > 0 && (
                <div className="products-section">
                  <h3 className="products-title">Productos</h3>
                  <div className="products-list">
                    {itemsToDisplay.map((item, index) => (
                    <div key={index} className="product-item">
                      <div 
                        className="product-image-issue"
                        onClick={() => navigate(`/producto/${item.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={item.image} alt={item.name} className="checkout-product-image" />
                      </div>
                      <div className="product-details">
                        <h4 className="product-name-checkout">{item.name}</h4>
                        <div className="product-info">
                          {isEditingCart ? (
                            <>
                              {/* Quantity Controls */}
                              <div className="product-quantity-controls">
                                <label className="quantity-label">Cantidad:</label>
                                <div className="quantity-buttons">
                                  <button 
                                    type="button"
                                    onClick={() => handleQuantityChange(index, (item.tempQuantity || 1) - 1)}
                                    className="quantity-btn quantity-btn-minus"
                                  >
                                    -
                                  </button>
                                  <span className="quantity-display">{item.tempQuantity || 1}</span>
                                  <button 
                                    type="button"
                                    onClick={() => handleQuantityChange(index, (item.tempQuantity || 1) + 1)}
                                    className="quantity-btn quantity-btn-plus"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Color Selector */}
                              {item.colours && item.colours.length > 0 && (
                                <div className="product-color-selector">
                                  <label className="color-label">Color:</label>
                                  <select 
                                    value={item.tempColor || item.color || ''} 
                                    onChange={(e) => handleColorChange(index, e.target.value)}
                                    className="color-select"
                                  >
                                    {item.colours.map((color, colorIndex) => (
                                      <option key={colorIndex} value={color}>
                                        {color}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {/* Size Selector */}
                              {item.measurements && item.measurements.length > 0 && (
                                <div className="product-size-selector">
                                  <label className="size-label">Tamaño:</label>
                                  <select 
                                    value={item.tempSize || item.size || ''} 
                                    onChange={(e) => handleSizeChange(index, e.target.value)}
                                    className="size-select"
                                  >
                                    {item.measurements.map((measurement, measurementIndex) => (
                                      <option key={measurementIndex} value={measurement}>
                                        {measurement}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {item.quantity > 1 && (
                                <span className="product-price-checkout">
                                  Precio por unidad: {formatPrice(item.price)}
                                </span>
                              )}
                              {item.size && item.size.length > 0 && (
                                <span className="product-size">
                                  Medidas: {item.size}
                                </span>
                              )}
                              {item.color && item.color.length > 0 && (
                                <span className="product-color">
                                  Color: {item.color}
                                </span>
                              )}
                              <span className="product-quantity">
                                Cantidad: <b>{item.quantity}</b>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="product-total">
                        {formatPrice((typeof item.price === 'string' ? parseFloat(item.price.replace(/\./g, '')) : item.price) * (isEditingCart ? (item.tempQuantity || 1) : (item.quantity || 1)))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;