import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-content">
          <h2>No se encontró información del pedido</h2>
          <p>Redirigiendo al inicio...</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-content">
          {/* Left Column - Order Confirmation */}
          <div className="checkout-form-section">
            <div className="checkout-logo">
              <img 
                src="/images/krubo-logo.png" 
                alt="KRUBO Logo" 
                className="checkout-logo-image"
              />
            </div>
            
            <div className="confirmation-content">
              <div className="confirmation-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              
              <h1 className="checkout-title confirmation-title">
                ¡Pedido confirmado!
              </h1>
              
              <p className="confirmation-message">
                Tu pedido ha sido procesado exitosamente. Te hemos enviado un correo de confirmación con todos los detalles.
              </p>

              <div className="order-details">
                <div className="order-number">
                  <strong>Número de orden:</strong> {orderData.orderNumber}
                </div>
                <div className="order-date">
                  <strong>Fecha del pedido:</strong> {new Date(orderData.createdAt).toLocaleDateString('es-CO')}
                </div>
                <div className="order-status">
                  <strong>Estado:</strong> <span className="status-pending">Pendiente</span>
                </div>
              </div>

              <div className="confirmation-actions">
                <button onClick={() => navigate('/')} className="btn-checkout">
                  Continuar comprando
                </button>
                <button onClick={() => window.print()} className="btn-back-cart">
                  Imprimir confirmación
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-summary-section">
            <div className="order-summary">
              <h3 className="products-title">Resumen del pedido</h3>
              
              <div className="subtotal-section">
                <span className="subtotal-label">Total del pedido</span>
                <span className="subtotal-price">{formatPrice(orderData.subtotal)}</span>
              </div>

              <div className="products-section">
                <h4 className="products-title">Productos</h4>
                <div className="products-list">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="product-item">
                      <div className="product-image-issue">
                        <img src={item.image} alt={item.name} className="checkout-product-image" />
                      </div>
                      <div className="product-details">
                        <h4 className="product-name-checkout">{item.name}</h4>
                        <div className="product-info">
                          {item.quantity > 1 && (
                            <span className="product-price-checkout">
                              Precio por unidad: {formatPrice(item.price)}
                            </span>
                          )}
                          {item.size && (
                            <span className="product-size">
                              Medidas: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="product-color">
                              Color: {item.color}
                            </span>
                          )}
                          <span className="product-quantity">
                            Cantidad: <b>{item.quantity}</b>
                          </span>
                        </div>
                      </div>
                      <div className="product-total">
                        {formatPrice((typeof item.price === 'string' ? parseFloat(item.price.replace(/\./g, '')) : item.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="customer-info">
                <h4 className="products-title">Información de entrega</h4>
                <div className="customer-details">
                  <p><strong>Nombre:</strong> {orderData.customer.fullName}</p>
                  <p><strong>Email:</strong> {orderData.customer.email}</p>
                  <p><strong>Teléfono:</strong> {orderData.customer.phone}</p>
                  <p><strong>Dirección:</strong> {orderData.customer.street}</p>
                  <p><strong>Ciudad:</strong> {orderData.customer.city}</p>
                  <p><strong>Departamento:</strong> {orderData.customer.department}</p>
                  {orderData.customer.additionalInfo && (
                    <p><strong>Información adicional:</strong> {orderData.customer.additionalInfo}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
