import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiService';
import './WorkshopProducts.css';

// Helper function to get products per slide based on screen width
const getProductsPerSlide = () => {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  if (window.innerWidth <= 1024) return 3;
  return 4;
};

// Helper function to get favorites from localStorage
const getFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem('krubolab-favorites');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

// Helper function to save favorites to localStorage
const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem('krubolab-favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

// Helper function to get cart from localStorage
const getCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('krubolab-cart');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('krubolab-cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};



function WorkshopProducts() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productsPerSlide, setProductsPerSlide] = useState(getProductsPerSlide());
  const [imageLoading, setImageLoading] = useState({});
  const [favorites, setFavorites] = useState(getFavoritesFromStorage());
  const [cart, setCart] = useState(getCartFromStorage());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();

    // Add resize listener to update products per slide
    const handleResize = () => {
      setProductsPerSlide(getProductsPerSlide());
      setCurrentSlide(0); // Reset to first slide when resizing
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    const isCurrentlyFavorite = favorites.includes(productId);
    
    setFavorites(prev => {
      if (isCurrentlyFavorite) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
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

  const isFavorite = (productId) => favorites.includes(productId);
  const isInCart = (productId) => cart.includes(productId);

  const toggleCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const isCurrentlyInCart = cart.includes(productId);
    
    setCart(prev => {
      if (isCurrentlyInCart) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });

    // Show toast notification
    setToastMessage(isCurrentlyInCart 
      ? `${product?.name || 'Producto'} removido del carrito` 
      : `${product?.name || 'Producto'} agregado al carrito`
    );
    setShowToast(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / productsPerSlide));
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => 
        prev === 0 ? Math.ceil(products.length / productsPerSlide) - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 150);
  };

  const getVisibleProducts = () => {
    const startIndex = currentSlide * productsPerSlide;
    return products.slice(startIndex, startIndex + productsPerSlide);
  };

  const totalSlides = Math.ceil(products.length / productsPerSlide);

  if (loading) {
    return (
      <section className="workshop-products-section">
        <div className="workshop-products-container">
          <h2 className="workshop-products-title">LO QUE HACEMOS EN EL TALLER</h2>
          <div className="loading-skeleton">
            {[1, 2, 3, 4].map((index) => (
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
    );
  }

  return (
    <section className="workshop-products-section">
      <div className="workshop-products-container">
        <h2 className="workshop-products-title">LO QUE HACEMOS EN EL TALLER</h2>
        
        <div className="products-carousel">
          <div className="carousel-container">
            <div 
              className={`carousel-track ${isTransitioning ? 'transitioning' : ''}`}
            >
              {getVisibleProducts().map((product) => (
                <div key={product.id} className="product-card">
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
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-price">$ {product.price}</p>

                    <div className="product-actions">
                      <button 
                        className={`action-btn cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                        aria-label={isInCart(product.id) ? "Quitar del carrito" : "Agregar al carrito"}
                        onClick={() => toggleCart(product.id)}
                      >
                        <img 
                          src={isInCart(product.id) ? "/images/cart-filled.svg" : "/images/cart.svg"} 
                          alt={isInCart(product.id) ? "Carrito lleno" : "Carrito"} 
                        />

                      </button>
                      <button 
                        className={`action-btn favorite-btn ${isFavorite(product.id) ? 'favorited' : ''}`}
                        aria-label={isFavorite(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                        onClick={() => toggleFavorite(product.id)}
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
            
            {products.length > productsPerSlide && (
              <>
                <button 
                  className="carousel-nav prev-btn" 
                  onClick={prevSlide}
                  aria-label="Producto anterior"
                >
                  <img src="/images/next-arrow.svg" alt="Anterior" className="nav-icon prev-icon" />
                </button>
                <button 
                  className="carousel-nav next-btn" 
                  onClick={nextSlide}
                  aria-label="Siguiente producto"
                >
                  <img src="/images/next-arrow.svg" alt="Siguiente" className="nav-icon next-icon" />
                </button>
              </>
            )}
          </div>
          
          {totalSlides > 1 && (
            <div className="carousel-dots">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}

export default WorkshopProducts;
