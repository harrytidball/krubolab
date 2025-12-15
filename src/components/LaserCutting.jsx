import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { dashboardService } from '../services/apiService';
import './LaserCutting.css';
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
    if (!stored) return [];
    
    const favorites = JSON.parse(stored);
    
    // Handle migration from old format (array of IDs) to new format (array of objects)
    if (Array.isArray(favorites) && favorites.length > 0 && typeof favorites[0] === 'string') {
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
    // Handle error silently
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
    // Handle error silently
  }
};

function LaserCutting() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(getFavoritesFromStorage());
  const [cart, setCart] = useState(getCartFromStorage());
  const [imageLoading, setImageLoading] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlides, setCurrentSlides] = useState({});
  const [productsPerSlide, setProductsPerSlide] = useState(getProductsPerSlide());
  const [isTransitioning, setIsTransitioning] = useState({});
  const navigate = useNavigate();

  // Material categories
  const materials = [
    { key: 'madera', title: 'MADERA (aglomerados y maderas naturales)', description: 'Utilizamos MDF, aglomerados y chapas para proyectos resistentes con acabados uniformes, y maderas naturales para texturas únicas y acabados artesanales.' },
    { key: 'acrilico', title: 'ACRÍLICO', description: 'Material resistente, ligero y transparente. Ofrece cortes exactos, grabados detallados, resistencia a la intemperie, diversos espesores y colores, y excelente transmisión de luz. Ideal para señalización, decoración, prototipos y piezas mecánicas ligeras.' },
    { key: 'vidrio', title: 'VIDRIO', description: 'Ofrece acabados elegantes, precisos y permanentes. El láser no corta vidrio pero permite personalización única con alto detalle. Ventajas: alta durabilidad del grabado, resistencia al desgaste y posibilidad de crear piezas exclusivas para vasos, trofeos, placas, decoración y regalos personalizados.' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await dashboardService.getProducts();
        setProducts(productsData);
        
        // Initialize image loading state for all products
        const initialImageLoading = {};
        productsData.forEach(product => {
          if (product.images && product.images.length > 0) {
            const img = new Image();
            img.src = product.images[0];
            if (img.complete) {
              initialImageLoading[product.id] = false;
            } else {
              initialImageLoading[product.id] = true;
            }
          }
        });
        setImageLoading(initialImageLoading);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProducts();

    // Add resize listener to update products per slide
    const handleResize = () => {
      setProductsPerSlide(getProductsPerSlide());
      // Reset all slides when resizing
      setCurrentSlides({});
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save favorites to localStorage whenever favorites state changes
  useEffect(() => {
    saveFavoritesToStorage(favorites);
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  }, [favorites]);

  // Save cart to localStorage whenever cart state changes
  useEffect(() => {
    saveCartToStorage(cart);
    window.dispatchEvent(new CustomEvent('cartChanged'));
  }, [cart]);

  // Filter products by material (case-insensitive)
  const getProductsByMaterial = (materialKey) => {
    return products.filter(product => {
      if (!product.materials || !Array.isArray(product.materials)) {
        return false;
      }
      return product.materials.some(material => 
        material.toLowerCase().trim() === materialKey.toLowerCase()
      );
    });
  };

  // Carousel functions per material section
  const nextSlide = (materialKey) => {
    if (isTransitioning[materialKey]) return;
    setIsTransitioning(prev => ({ ...prev, [materialKey]: true }));
    setTimeout(() => {
      const materialProducts = getProductsByMaterial(materialKey);
      const totalSlides = Math.ceil(materialProducts.length / productsPerSlide);
      setCurrentSlides(prev => ({
        ...prev,
        [materialKey]: ((prev[materialKey] || 0) + 1) % totalSlides
      }));
      setIsTransitioning(prev => ({ ...prev, [materialKey]: false }));
    }, 150);
  };

  const prevSlide = (materialKey) => {
    if (isTransitioning[materialKey]) return;
    setIsTransitioning(prev => ({ ...prev, [materialKey]: true }));
    setTimeout(() => {
      const materialProducts = getProductsByMaterial(materialKey);
      const totalSlides = Math.ceil(materialProducts.length / productsPerSlide);
      setCurrentSlides(prev => ({
        ...prev,
        [materialKey]: prev[materialKey] === 0 ? totalSlides - 1 : (prev[materialKey] || 0) - 1
      }));
      setIsTransitioning(prev => ({ ...prev, [materialKey]: false }));
    }, 150);
  };

  const goToSlide = (materialKey, index) => {
    if (isTransitioning[materialKey]) return;
    setIsTransitioning(prev => ({ ...prev, [materialKey]: true }));
    setTimeout(() => {
      setCurrentSlides(prev => ({ ...prev, [materialKey]: index }));
      setIsTransitioning(prev => ({ ...prev, [materialKey]: false }));
    }, 150);
  };

  const getVisibleProducts = (materialProducts, materialKey) => {
    const currentSlide = currentSlides[materialKey] || 0;
    const startIndex = currentSlide * productsPerSlide;
    return materialProducts.slice(startIndex, startIndex + productsPerSlide);
  };

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

  const isFavorite = (productId) => favorites.some(fav => fav.id === productId);
  const isInCart = (productId) => cart.some(item => item.id === productId);

  if (loading) {
    return (
      <div className="laser-cutting-page">
        <Header />
        <div className="loading-container">
          <div className="loading">Cargando productos...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="laser-cutting-page">
      <Header />
      
      {/* Hero Section */}
      <section className="laser-cutting-hero">
        <div className="laser-cutting-hero-container">
          <div className="laser-cutting-hero-content">
            <div className="hero-text-content">
              <h1 className="hero-title">CORTE Y TALLADO LÁSER</h1>
              <p className="hero-description">
                El corte y tallado láser es una técnica de fabricación precisa que utiliza un haz de luz concentrado para cortar, grabar o marcar materiales como madera, acrílico, MDF, cuero y más. Permite obtener acabados limpios, detalles finos y diseños personalizados con gran exactitud, ideal para proyectos creativos, piezas industriales, prototipos y decoración.
              </p>
            </div>
            <div className="hero-image-wrapper">
              <img 
                src="/images/laser-cutting.png" 
                alt="Corte y Tallado Láser" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Material Sections */}
      {materials.map((material) => {
        const materialProducts = getProductsByMaterial(material.key);
        
        return (
          <section key={material.key} className="material-section">
            <div className="material-section-container">
              <h2 className="material-section-title">{material.title}</h2>
              <p className="material-section-description">{material.description}</p>
              
              {materialProducts.length > 0 ? (
                <div className="products-carousel">
                  <div className="carousel-container">
                    <div 
                      className={`carousel-track ${isTransitioning[material.key] ? 'transitioning' : ''}`}
                    >
                      {getVisibleProducts(materialProducts, material.key).map((product) => (
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
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="product-photo"
                                onLoad={() => setImageLoading(prev => ({ ...prev, [product.id]: false }))}
                                onError={() => setImageLoading(prev => ({ ...prev, [product.id]: false }))}
                                style={{ opacity: imageLoading[product.id] ? 0 : 1, transition: 'opacity 0.3s ease' }}
                                onLoadStart={() => {
                                  setTimeout(() => {
                                    setImageLoading(prev => ({ ...prev, [product.id]: false }));
                                  }, 5000);
                                }}
                              />
                            ) : (
                              <div className="material-product-placeholder">Sin imagen</div>
                            )}
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
                    
                    {materialProducts.length > productsPerSlide && (
                      <>
                        <button 
                          className="carousel-nav prev-btn" 
                          onClick={() => prevSlide(material.key)}
                          aria-label="Producto anterior"
                        >
                          <img src="/images/next-arrow.svg" alt="Anterior" className="nav-icon prev-icon" />
                        </button>
                        <button 
                          className="carousel-nav next-btn" 
                          onClick={() => nextSlide(material.key)}
                          aria-label="Siguiente producto"
                        >
                          <img src="/images/next-arrow.svg" alt="Siguiente" className="nav-icon next-icon" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {Math.ceil(materialProducts.length / productsPerSlide) > 1 && (
                    <div className="carousel-dots">
                      {Array.from({ length: Math.ceil(materialProducts.length / productsPerSlide) }, (_, index) => (
                        <button
                          key={index}
                          className={`dot ${index === (currentSlides[material.key] || 0) ? 'active' : ''}`}
                          onClick={() => goToSlide(material.key, index)}
                          aria-label={`Ir a slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-products-message">
                  No hay productos disponibles en esta categoría.
                </div>
              )}
            </div>
          </section>
        );
      })}

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

export default LaserCutting;

