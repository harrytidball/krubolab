import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ThreeDPrinting from './components/ThreeDPrinting';
import OurProjects from './components/OurProjects';
import MaterialsPage from './components/MaterialsPage';
import ProductDetail from './components/ProductDetail';
import NotFound from './components/NotFound';

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
            path="/carrito" 
            element={<Checkout />}
          />
          <Route 
            path="/favoritos" 
            element={<Favourites />}
          />
          <Route 
            path="/corte-laser" 
            element={<LaserCutting />}
          />
          <Route 
            path="/impresion-3d" 
            element={<ThreeDPrinting />}
          />
          <Route 
            path="/nuestros-proyectos" 
            element={<OurProjects />}
          />
          <Route 
            path="/nuestros-materiales" 
            element={<MaterialsPage />}
          />
          <Route 
            path="/producto/:id" 
            element={<ProductDetail />}
          />
          <Route 
            path="/confirmacion" 
            element={<OrderConfirmation />}
          />
          <Route 
            path="/404" 
            element={<NotFound />}
          />
          <Route 
            path="/sitio" 
            element={
              <LandingPage />
            } 
          />
          <Route 
            path="/sitio/carrito" 
            element={
              <Checkout />
            } 
          />
          <Route 
            path="/sitio/confirmacion" 
            element={
              <OrderConfirmation />
            } 
          />
          <Route 
            path="/administrador" 
            element={
              isAuthenticated ? (
                <Navigate to="/panel" replace />
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
            path="/panel" 
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/administrador" replace />
              )
            } 
          />
          <Route 
            path="*" 
            element={<NotFound />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
