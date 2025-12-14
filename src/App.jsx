import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './components/LandingPage.css';
import './components/Checkout.css';
import './components/Favourites.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import AdminBanner from './components/AdminBanner';
import Favourites from './components/Favourites';
import LaserCutting from './components/LaserCutting';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage on initial load
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Persist authentication state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear localStorage on logout
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <div>
                  <AdminBanner />
                  <LandingPage />
                </div>
              ) : (
                <LandingPage />
              )
            } 
          />
          <Route 
            path="/checkout" 
            element={<Checkout />}
          />
          <Route 
            path="/favourites" 
            element={<Favourites />}
          />
          <Route 
            path="/laser-cutting" 
            element={<LaserCutting />}
          />
          <Route 
            path="/confirmation" 
            element={<OrderConfirmation />}
          />
          <Route 
            path="/website" 
            element={
              <LandingPage />
            } 
          />
          <Route 
            path="/website/checkout" 
            element={
              <Checkout />
            } 
          />
          <Route 
            path="/website/confirmation" 
            element={
              <OrderConfirmation />
            } 
          />
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div>
                  <header className="App-header">
                    <h1>Krubo Admin</h1>
                  </header>
                  <main>
                    <Login onLogin={handleLogin} />
                  </main>
                </div>
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
