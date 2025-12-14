import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminBanner() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show banner on admin routes
  if (location.pathname.startsWith('/panel') || location.pathname.startsWith('/administrador')) {
    return null;
  }

  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '20px', 
      textAlign: 'center', 
      borderBottom: '1px solid #dee2e6' 
    }}>
      <p style={{ margin: '0 0 15px 0', color: '#666' }}>
        Estás conectado como administrador
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={() => navigate('/panel')} 
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ir al Dashboard
        </button>
        <button 
          onClick={() => navigate('/sitio')} 
          style={{
            padding: '8px 16px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ver Sitio Web
        </button>
      </div>
    </div>
  );
}

export default AdminBanner;
