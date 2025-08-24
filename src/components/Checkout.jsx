import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/apiService';
import './Checkout.css';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [enrichedCartItems, setEnrichedCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    identificationType: 'cedula',
    identificationNumber: '',
    phone: '',
    department: '',
    city: '',
    locality: '',
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
            setIsLoading(false);
            return;
          }
          
          // Fetch product details from API
          const allProducts = await dashboardService.getProducts();
          
          // Ensure we have an array of products
          const productsArray = Array.isArray(allProducts) ? allProducts : [];

          console.log('Products array:', productsArray);
          
          // Clean cart items - ensure they are just IDs
          const cleanCartItems = items.map(item => {
            if (typeof item === 'string') {
              return item; // Already an ID string
            } else if (typeof item === 'object' && item !== null) {
              // If it's an object with numeric keys, extract the ID
              const keys = Object.keys(item);
              const numericKeys = keys.filter(key => !isNaN(parseInt(key)));
              if (numericKeys.length > 0) {
                // This is a corrupted cart item, try to reconstruct the ID
                const idParts = numericKeys.map(key => item[key]).join('');
                return idParts;
              }
            }
            return item;
          });
          
          // Merge cart items with product details
          const enriched = cleanCartItems.map(cartItemId => {
            const productDetails = productsArray.find(p => p.id === cartItemId);
            
            if (!productDetails) {
              return null;
            }
            
            const enrichedItem = {
              id: productDetails.id,
              name: productDetails.name,
              description: productDetails.description,
              image: productDetails.images?.[0], // Use first image from images array
              price: productDetails.price,
              quantity: 1, // Default quantity since cart only stores IDs
              category: productDetails.category,
              material: productDetails.material,
              dimensions: productDetails.measurements?.[0] || productDetails.dimensions,
              colours: productDetails.colours
            };
            
            return enrichedItem;
          }).filter(Boolean); // Remove any null items
          
          // Clean up corrupted cart data in localStorage
          if (JSON.stringify(items) !== JSON.stringify(cleanCartItems)) {
            localStorage.setItem('krubolab-cart', JSON.stringify(cleanCartItems));
          }
          
          setEnrichedCartItems(enriched);
        }
      } catch (error) {
        // Fallback to cart items without enrichment
        setEnrichedCartItems(cartItems);
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

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['email', 'fullName', 'identificationNumber', 'phone', 'department', 'city', 'locality', 'street'];
    
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
    return enrichedCartItems.reduce((total, item) => {
      let itemPrice = item.price;
      if (typeof itemPrice === 'string') {
        itemPrice = parseFloat(itemPrice.replace(/\./g, ''));
      }
      return total + (itemPrice * (item.quantity || 1));
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

  const handleEditCart = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    try {
      // Create order object
      const order = {
        id: Date.now().toString(),
        customer: formData,
        items: enrichedCartItems,
        subtotal: calculateSubtotal(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        orderNumber: `KRU-${Date.now()}`
      };

      // Save order to API
      await dashboardService.saveOrder(order);
      
      // Clear cart from localStorage
      localStorage.removeItem('krubolab-cart');
      
      // Dispatch cart change event
      window.dispatchEvent(new Event('cartChanged'));
      
      // Show success message and redirect
      alert('¡Pedido realizado con éxito! Tu número de orden es: ' + order.orderNumber);
      navigate('/');
      
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
          <h2>Tu carrito está vacío</h2>
          <p>Agrega algunos productos antes de proceder al checkout</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

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
                    <span className="radio-text">Cédula de ciudadanía</span>
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
                  {formData.identificationType === 'cedula' && 'Cédula de ciudadanía'}
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

              {/* Locality */}
              <div className="form-group">
                <label htmlFor="locality" className="form-label">
                  Localidad
                </label>
                <input
                  type="text"
                  id="locality"
                  name="locality"
                  value={formData.locality}
                  onChange={handleInputChange}
                  className={`form-input ${formData.locality ? 'filled' : ''} ${validationErrors.locality ? 'unfilled' : ''}`}
                />
                <div className={`form-helper ${formData.locality ? 'filled' : ''} ${validationErrors.locality ? 'unfilled' : ''}`}>
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
              <button type="button" onClick={handleEditCart} className="btn-back-cart">
                Volver al carrito
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

              <button onClick={handleEditCart} className="btn-edit-cart">
                <svg className="edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Editar productos en el carrito
              </button>

              <div className="products-section">
                <h3 className="products-title">Productos ({enrichedCartItems.length})</h3>
                <div className="products-list">
                  {enrichedCartItems.map((item, index) => (
                    <div key={index} className="product-item">
                      <div className="product-name">

                      </div>
                      <div className="product-details">
                        <h4 className="product-name">{item.name}</h4>
                        <div className="product-info">
                          <span className="product-price">
                            Precio por unidad: {formatPrice(item.price)}
                          </span>
                          <span className="product-quantity">
                            Cantidad: {item.quantity}
                          </span>
                          {item.dimensions && (
                            <span className="product-dimensions">
                              Medidas: {item.dimensions}
                            </span>
                          )}
                          {item.colours && item.colours.length > 0 && (
                            <span className="product-colours">
                              Colores: {item.colours.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="product-total">
                        {formatPrice((typeof item.price === 'string' ? parseFloat(item.price.replace(/\./g, '')) : item.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
