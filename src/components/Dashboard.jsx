import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Products from './Products';
import Services from './Services';
import Contacts from './Contacts';
import Orders from './Orders';
import './AdminDashboard.css';

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState(() => {
    // Get the active tab from localStorage, default to 'products'
    return localStorage.getItem('dashboardActiveTab') || 'products';
  });
  const navigate = useNavigate();

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', activeTab);
  }, [activeTab]);

  // Check authentication status on component mount
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <Products />;
      case 'services':
        return <Services />;
      case 'contacts':
        return <Contacts />;
      case 'orders':
        return <Orders />;
      default:
        return <Products />;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Panel de Administración Krubolab</h1>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </header>
      
      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Productos
        </button>
        <button
          className={`nav-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Servicios
        </button>
        <button
          className={`nav-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contactos
        </button>
        <button
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Pedidos
        </button>
      </nav>

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard; 