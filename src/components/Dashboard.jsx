import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Products from './Products';
import Services from './Services';
import Contacts from './Contacts';
import Orders from './Orders';
import './AdminDashboard.css';

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();

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
        <h1>Krubolab Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>
      
      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`nav-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button
          className={`nav-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contacts
        </button>
        <button
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </nav>

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard; 