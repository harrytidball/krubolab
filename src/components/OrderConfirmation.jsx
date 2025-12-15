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

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-logo">
          <img 
            src="/images/krubo-logo.png" 
            alt="KRUBO Logo" 
            className="confirmation-logo-image"
          />
        </div>
        
        <div className="confirmation-content">
          <h1 className="confirmation-title">
            ¡Falta muy poco para completar tu compra!
          </h1>
          
          <p className="confirmation-description">
            Vía WhatsApp te enviaremos los detalles de los métodos de pago, así como información de tiempo de fabricación (si aplica) y tiempo de envío de tu pedido.
          </p>
          <div className="order-details" style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#333" }}>
              Resumen de tu pedido
            </h3>
            <div style={{ textAlign: "left", margin: "0 auto" }}>
              <p style={{ marginBottom: 8 }}>
                <strong>Número de pedido:</strong> {orderData.orderNumber}
              </p>
              <p style={{ marginBottom: 8 }}>
                <strong>Nombre:</strong> {orderData.customer.fullName}
              </p>
              <p style={{ marginBottom: 8 }}>
                <strong>Total:</strong> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(orderData.total)}
              </p>
              <div style={{ marginTop: 16 }}>
                <strong>Productos:</strong>
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  {orderData.items.map((item, idx) => (
                    <li key={item.id + '-' + idx} style={{ marginBottom: 6 }}>
                      {item.name}
                      {item.size && (
                        <span> - Talla: {item.size}</span>
                      )}
                      {item.color && (
                        <span> - Color: {item.color}</span>
                      )}
                      <span> &times; {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button onClick={() => {
              const itemsText = orderData.items.map(item => {
                let itemText = `• ${item.name} x${item.quantity}`;
                if (item.size) itemText += ` - Talla: ${item.size}`;
                if (item.color) itemText += ` - Color: ${item.color}`;
                return itemText;
              }).join('\n');
              
              const totalFormatted = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(orderData.total);
              
              const addressParts = [
                orderData.customer.street,
                orderData.customer.city,
                orderData.customer.department
              ].filter(Boolean);
              let addressText = addressParts.join(', ');
              if (orderData.customer.additionalInfo) {
                addressText += ` - ${orderData.customer.additionalInfo}`;
              }
              
              const message = `Hola, tengo una consulta sobre mi pedido\n\n` +
                `Número de pedido: ${orderData.orderNumber}\n` +
                `Nombre: ${orderData.customer.fullName}\n` +
                `Dirección: ${addressText}\n` +
                `Total: ${totalFormatted}\n\n` +
                `Productos:\n${itemsText}`;
              
              window.open(`https://wa.me/573042450295?text=${encodeURIComponent(message)}`, '_blank');
            }} className="btn-whatsapp">
              Ir a WhatsApp
            </button>
            <button onClick={() => navigate('/')} className="btn-back">
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
