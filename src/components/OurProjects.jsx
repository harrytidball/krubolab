import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/apiService';
import Header from './Header';
import Footer from './Footer';
import './OurProjects.css';
import './WorkshopProducts.css';

// Helper function to get favorites from localStorage
const getFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem('krubolab-favorites');
    if (!stored) return [];
    
    const favorites = JSON.parse(stored);
    
    // Handle migration from old format (array of IDs) to new format (array of objects)
    if (Array.isArray(favorites) && favorites.length > 0 && typeof favorites[0] === 'string') {
      // Old format detected - clear it and return empty array
      localStorage.removeItem('krubolab-favorites');
      return [];
    }
    
    return favorites;
  } catch (error) {
    return [];
  }
};

// Helper function to save favorites to localStorage
const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem('krubolab-favorites', JSON.stringify(favorites));
  } catch (error) {
    // Silent fail
  }
};

// Helper function to get cart from localStorage
const getCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('krubolab-cart');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('krubolab-cart', JSON.stringify(cart));
  } catch (error) {
    // Silent fail
  }
};

function OurProjects() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const [favorites, setFavorites] = useState(getFavoritesFromStorage());
  const [cart, setCart] = useState(getCartFromStorage());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await dashboardService.getProducts();
        setProducts(productsData);
        // Initialize image loading state for all products
        const initialImageLoading = {};
        productsData.forEach(product => {
          // Check if image is already cached
          const img = new Image();
          img.src = product.images[0];
          if (img.complete) {
            initialImageLoading[product.id] = false;
          } else {
            initialImageLoading[product.id] = true;
          }
        });
        setImageLoading(initialImageLoading);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Save favorites to localStorage whenever favorites state changes
  useEffect(() => {
    saveFavoritesToStorage(favorites);
    // Dispatch custom event to notify other components about favorites change
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  }, [favorites]);

  // Save cart to localStorage whenever cart state changes
  useEffect(() => {
    saveCartToStorage(cart);
    // Dispatch custom event to notify other components about cart change
    window.dispatchEvent(new CustomEvent('cartChanged'));
  }, [cart]);

  const toggleFavorite = (productId) => {
    const product = products.find(p => p.id === productId);
    const isCurrentlyFavorite = favorites.some(fav => fav.id === productId);
    
    setFavorites(prev => {
      if (isCurrentlyFavorite) {
        return prev.filter(fav => fav.id !== productId);
      } else {
        // Store the full product object with quantity
        const favoriteItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          color: Array.isArray(product.colours) && product.colours.length > 0 ? product.colours[0] : (product.colours || ''),
          size: Array.isArray(product.measurements) && product.measurements.length > 0 ? product.measurements[0] : (product.measurements || ''),
          image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.images || ''),
          description: product.description
        };
        return [...prev, favoriteItem];
      }
    });

    // Show toast notification
    setToastMessage(isCurrentlyFavorite 
      ? `${product?.name || 'Producto'} removido de favoritos` 
      : `${product?.name || 'Producto'} agregado a favoritos`
    );
    setShowToast(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };

  const isFavorite = (productId) => favorites.some(fav => fav.id === productId);
  const isInCart = (productId) => cart.some(item => item.id === productId);

  const toggleCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const isCurrentlyInCart = cart.some(item => item.id === productId);
    
    if (isCurrentlyInCart) {
      setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      // Store the full product object
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        color: Array.isArray(product.colours) && product.colours.length > 0 ? product.colours[0] : (product.colours || ''),
        size: Array.isArray(product.measurements) && product.measurements.length > 0 ? product.measurements[0] : (product.measurements || ''),
        image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.images || ''),
        description: product.description
      };
      
      setCart(prev => [...prev, cartItem]);
    }

    // Show toast notification
    setToastMessage(isCurrentlyInCart 
      ? `${product?.name || 'Producto'} removido del carrito` 
      : `${product?.name || 'Producto'} agregado al carrito`
    );
    setShowToast(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/573042450295?text=Hola, tengo un proyecto en mente', '_blank');
  };

  if (loading) {
    return (
      <div className="our-projects-page">
        <Header />
        <section className="our-projects-hero">
          <div className="our-projects-hero-container">
            <div className="our-projects-hero-content">
              <div className="our-projects-hero-text-content">
                <h1 className="our-projects-hero-title">NUESTROS PROYECTOS</h1>
                <p className="our-projects-hero-description">
                  Trabajamos con variedad de materiales para cumplir funciones específicas y lograr acabados diversos. Cada creación es el resultado de diseño consciente y detalle en la fabricación.
                </p>
              </div>
              <div className="our-projects-hero-image-wrapper">
                <img 
                  src="/images/our-projects.png" 
                  alt="Nuestros Proyectos" 
                  className="our-projects-hero-image"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="workshop-products-section our-projects-section">
          <div className="workshop-products-container">
            <div className="our-projects-grid loading-skeleton">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-price"></div>
                    <div className="skeleton-actions">
                      <div className="skeleton-btn"></div>
                      <div className="skeleton-btn"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="our-projects-page">
      <Header />
      
      {/* Hero Section */}
      <section className="our-projects-hero">
        <div className="our-projects-hero-container">
          <div className="our-projects-hero-content">
            <div className="our-projects-hero-text-content">
              <h1 className="our-projects-hero-title">NUESTROS PROYECTOS</h1>
              <p className="our-projects-hero-description">
                Trabajamos con variedad de materiales para cumplir funciones específicas y lograr acabados diversos. Cada creación es el resultado de diseño consciente y detalle en la fabricación.
              </p>
            </div>
            <div className="our-projects-hero-image-wrapper">
              <img 
                src="/images/our-projects.png" 
                alt="Nuestros Proyectos" 
                className="our-projects-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="workshop-products-section our-projects-section">
        <div className="workshop-products-container">
          <div className="our-projects-grid">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/producto/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image">
                  {imageLoading[product.id] && (
                    <div className="image-skeleton"></div>
                  )}
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="product-photo"
                    onLoad={() => setImageLoading(prev => ({ ...prev, [product.id]: false }))}
                    onError={() => setImageLoading(prev => ({ ...prev, [product.id]: false }))}
                    style={{ opacity: imageLoading[product.id] ? 0 : 1, transition: 'opacity 0.3s ease' }}
                    onLoadStart={() => {
                      // Set a timeout to prevent infinite loading
                      setTimeout(() => {
                        setImageLoading(prev => ({ ...prev, [product.id]: false }));
                      }, 5000);
                    }}
                  />
                </div>
                <div className="workshop-product-info">
                  <h3 className="workshop-product-title">{product.name}</h3>
                  <p className="workshop-product-price">$ {product.price}</p>

                  <div className="workshop-product-actions">
                    <button 
                      className={`action-btn cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                      aria-label={isInCart(product.id) ? "Quitar del carrito" : "Agregar al carrito"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCart(product.id);
                      }}
                    >
                      <img 
                        src={isInCart(product.id) ? "/images/cart-filled.svg" : "/images/cart.svg"} 
                        alt={isInCart(product.id) ? "Carrito lleno" : "Carrito"} 
                      />
                    </button>
                    <button 
                      className={`action-btn favorite-btn ${isFavorite(product.id) ? 'favorited' : ''}`}
                      aria-label={isFavorite(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      <img 
                        src={isFavorite(product.id) ? "/images/favorito-filled.svg" : "/images/favorito.svg"} 
                        alt={isFavorite(product.id) ? "Favorito lleno" : "Favorito"} 
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="our-projects-cta">
        <div className="our-projects-cta-container">
          <div className="our-projects-cta-text">
            <h2 className="our-projects-cta-title">¿YA TE IMAGINASTE LO QUE PODEMOS CREAR JUNTOS?</h2>
          </div>
          <div className="our-projects-cta-button-wrapper">
            <button 
              className="our-projects-cta-button"
              onClick={handleWhatsAppClick}
            >
              TENGO UN PROYECTO EN MENTE
            </button>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default OurProjects;

