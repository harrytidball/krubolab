import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/apiService';
import Header from './Header';
import Footer from './Footer';
import './ProductDetail.css';

// Color name to hex mapping (Spanish only)
const COLOR_MAP = {
  // Colores básicos
  'rojo': '#FF0000',
  'roja': '#FF0000',
  'azul': '#0000FF',
  'verde': '#008000',
  'amarillo': '#FFFF00',
  'amarilla': '#FFFF00',
  'naranja': '#FFA500',
  'rosa': '#FFC0CB',
  'morado': '#800080',
  'violeta': '#8B00FF',
  'blanco': '#FFFFFF',
  'blanca': '#FFFFFF',
  'negro': '#000000',
  'negra': '#000000',
  'gris': '#808080',
  'marrón': '#A52A2A',
  'marron': '#A52A2A',
  'beige': '#F5F5DC',
  'dorado': '#FFD700',
  'dorada': '#FFD700',
  'plateado': '#C0C0C0',
  'plateada': '#C0C0C0',
  'turquesa': '#40E0D0',
  'coral': '#FF7F50',
  'salmón': '#FA8072',
  'salmon': '#FA8072',
  'lila': '#C8A2C8',
  'ocre': '#CC7722',
  'crema': '#FFFDD0',
  'bordo': '#800020',
  'granate': '#800000',
  'celeste': '#87CEEB',
  'lima': '#00FF00',
  'oliva': '#808000',
  'cobre': '#B87333',
  'bronce': '#CD7F32',
  // Colores de madera
  'cade naranja': '#CD853F',
  'wenge': '#3E2723',
  'acacia': '#D2B48C',
  'natural': '#F5F5DC',
};

// Helper function to get hex color from color name or hex code
const getColorHex = (color) => {
  if (!color) return null;
  
  // If it's already a hex color, return it
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return color;
  }
  
  // Try to find in color map (case insensitive)
  const normalizedColor = color.toLowerCase().trim();
  return COLOR_MAP[normalizedColor] || null;
};

// Helper functions for localStorage
const getFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem('krubolab-favorites');
    if (!stored) return [];
    const favorites = JSON.parse(stored);
    if (Array.isArray(favorites) && favorites.length > 0 && typeof favorites[0] === 'string') {
      localStorage.removeItem('krubolab-favorites');
      return [];
    }
    return favorites;
  } catch (error) {
    return [];
  }
};

const getCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('krubolab-cart');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('krubolab-cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartChanged'));
  } catch (error) {
    // Silent fail
  }
};

// Helper function to get products per slide based on screen width
const getProductsPerSlide = () => {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  if (window.innerWidth <= 1024) return 3;
  return 4;
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedMeasurement, setSelectedMeasurement] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [cart, setCart] = useState(getCartFromStorage());
  const [favorites, setFavorites] = useState(getFavoritesFromStorage());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productsPerSlide, setProductsPerSlide] = useState(getProductsPerSlide());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);

  useEffect(() => {
    // Add background class to body
    document.body.classList.add('product-detail-page');
    
    return () => {
      // Remove background class when component unmounts
      document.body.classList.remove('product-detail-page');
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await dashboardService.getProducts();
        setAllProducts(products);
        const foundProduct = products.find(p => p.id === id);
        
        if (!foundProduct) {
          // Product not found, redirect to 404
          navigate('/404', { replace: true });
          return;
        }
        
        setProduct(foundProduct);
        
        // Set default selections
        if (foundProduct.colours && foundProduct.colours.length > 0) {
          setSelectedColor(foundProduct.colours[0]);
        }
        if (foundProduct.measurements && foundProduct.measurements.length > 0) {
          setSelectedMeasurement(foundProduct.measurements[0]);
        }
      } catch (error) {
        navigate('/404', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    setCart(getCartFromStorage());
    setFavorites(getFavoritesFromStorage());
  }, []);

  useEffect(() => {
    // Add resize listener to update products per slide
    const handleResize = () => {
      setProductsPerSlide(getProductsPerSlide());
      setCurrentSlide(0); // Reset to first slide when resizing
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Handle keyboard events for fullscreen mode
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft' && product && product.images) {
        setFullscreenImageIndex((prev) => 
          prev === 0 ? product.images.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight' && product && product.images) {
        setFullscreenImageIndex((prev) => 
          prev === product.images.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, product]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: selectedColor || (product.colours && product.colours.length > 0 ? product.colours[0] : ''),
      size: selectedMeasurement || (product.measurements && product.measurements.length > 0 ? product.measurements[0] : ''),
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      description: product.description
    };

    const currentCart = getCartFromStorage();
    const updatedCart = [...currentCart, cartItem];
    setCart(updatedCart);
    saveCartToStorage(updatedCart);

    setToastMessage(`${product.name} agregado al carrito`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleFavorite = () => {
    if (!product) return;
    
    const isCurrentlyFavorite = favorites.some(fav => fav.id === product.id);
    
    if (isCurrentlyFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== product.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('krubolab-favorites', JSON.stringify(updatedFavorites));
      window.dispatchEvent(new CustomEvent('favoritesChanged'));
    } else {
      const favoriteItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        color: selectedColor || (product.colours && product.colours.length > 0 ? product.colours[0] : ''),
        size: selectedMeasurement || (product.measurements && product.measurements.length > 0 ? product.measurements[0] : ''),
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        description: product.description
      };
      const updatedFavorites = [...favorites, favoriteItem];
      setFavorites(updatedFavorites);
      localStorage.setItem('krubolab-favorites', JSON.stringify(updatedFavorites));
      window.dispatchEvent(new CustomEvent('favoritesChanged'));
    }
  };

  const isFavorite = () => {
    return favorites.some(fav => fav.id === product?.id);
  };

  const getRecommendedProducts = () => {
    if (!product || allProducts.length === 0) return [];
    
    // Get all products except current product
    const recommended = allProducts.filter(p => p.id !== product.id);
    
    return recommended;
  };

  const isInCart = (productId) => cart.some(item => item.id === productId);

  const toggleCart = (productId) => {
    const recProduct = allProducts.find(p => p.id === productId);
    if (!recProduct) return;
    
    const isCurrentlyInCart = cart.some(item => item.id === productId);
    
    if (isCurrentlyInCart) {
      setCart(prev => prev.filter(item => item.id !== productId));
      saveCartToStorage(cart.filter(item => item.id !== productId));
    } else {
      const cartItem = {
        id: recProduct.id,
        name: recProduct.name,
        price: recProduct.price,
        quantity: 1,
        color: Array.isArray(recProduct.colours) && recProduct.colours.length > 0 ? recProduct.colours[0] : (recProduct.colours || ''),
        size: Array.isArray(recProduct.measurements) && recProduct.measurements.length > 0 ? recProduct.measurements[0] : (recProduct.measurements || ''),
        image: Array.isArray(recProduct.images) && recProduct.images.length > 0 ? recProduct.images[0] : (recProduct.images || ''),
        description: recProduct.description
      };
      const updatedCart = [...cart, cartItem];
      setCart(updatedCart);
      saveCartToStorage(updatedCart);
    }

    setToastMessage(isCurrentlyInCart 
      ? `${recProduct?.name || 'Producto'} removido del carrito` 
      : `${recProduct?.name || 'Producto'} agregado al carrito`
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleRecommendedFavorite = (productId) => {
    const recProduct = allProducts.find(p => p.id === productId);
    if (!recProduct) return;
    
    const isCurrentlyFavorite = favorites.some(fav => fav.id === productId);
    
    if (isCurrentlyFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== productId);
      setFavorites(updatedFavorites);
      localStorage.setItem('krubolab-favorites', JSON.stringify(updatedFavorites));
    } else {
      const favoriteItem = {
        id: recProduct.id,
        name: recProduct.name,
        price: recProduct.price,
        quantity: 1,
        color: Array.isArray(recProduct.colours) && recProduct.colours.length > 0 ? recProduct.colours[0] : (recProduct.colours || ''),
        size: Array.isArray(recProduct.measurements) && recProduct.measurements.length > 0 ? recProduct.measurements[0] : (recProduct.measurements || ''),
        image: Array.isArray(recProduct.images) && recProduct.images.length > 0 ? recProduct.images[0] : (recProduct.images || ''),
        description: recProduct.description
      };
      const updatedFavorites = [...favorites, favoriteItem];
      setFavorites(updatedFavorites);
      localStorage.setItem('krubolab-favorites', JSON.stringify(updatedFavorites));
    }
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const recommended = getRecommendedProducts();
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(recommended.length / productsPerSlide));
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const recommended = getRecommendedProducts();
      setCurrentSlide((prev) => 
        prev === 0 ? Math.ceil(recommended.length / productsPerSlide) - 1 : prev - 1
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

  const getVisibleProducts = (products) => {
    const startIndex = currentSlide * productsPerSlide;
    return products.slice(startIndex, startIndex + productsPerSlide);
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-loading">Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const recommendedProducts = getRecommendedProducts();
  const isProductFavorite = isFavorite();

  return (
    <>
      <Header />
      <div className="product-detail-container">
        <div className="product-detail-content">
        {/* Left Column - Product Info */}
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>
          <hr />
          <div className="product-detail-price">$ {product.price}</div>
          <hr />
          {product.measurements && product.measurements.length > 0 && (
            <div className="product-detail-measurements">
              <strong>Medidas:</strong>
              {product.measurements.length > 1 ? (
                <select
                  value={selectedMeasurement}
                  onChange={(e) => setSelectedMeasurement(e.target.value)}
                  className="size-select"
                >
                  {product.measurements.map((measurement, index) => (
                    <option key={index} value={measurement}>
                      {measurement}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{product.measurements[0]}</span>
              )}
            </div>
          )}

          {product.colours && product.colours.length > 0 && (
            <div className="product-detail-colors">
              <strong>Colores:</strong>
              <div className="color-swatches">
                {product.colours.map((color, index) => {
                  const colorHex = getColorHex(color);
                  const hasColorHex = colorHex !== null;
                  
                  return (
                    <button
                      key={index}
                      className={`color-swatch ${selectedColor === color ? 'selected' : ''} ${!hasColorHex ? 'text-color' : ''}`}
                      style={hasColorHex ? { backgroundColor: colorHex } : {}}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Color ${color}`}
                      title={color}
                      data-color={color}
                    >
                      {!hasColorHex && <span className="color-name">{color}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}


          <div className="product-detail-actions">
            <div className="cart-actions-row">
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <span className="quantity-arrow">−</span>
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <span className="quantity-arrow">+</span>
                </button>
              </div>
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              AÑADIR AL CARRITO
            </button>
            </div>
            
            <button 
              className="personalize-btn"
              onClick={() => {
                // Navigate to contacts or open WhatsApp
                // Use correct mobile number and include product name in the WhatsApp message
                const whatsappNumber = '573042450295'; // replace with real business contact
                const message = encodeURIComponent(`Hola, me interesa personalizar el producto "${product.name}".`);
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
              }}
            >
              PARA PERSONALIZAR ESTE PRODUCTO, ESCRÍBENOS
            </button>
          </div>

          {product.description && (
            <div className="product-detail-description">
              <p>{product.description}</p>
            </div>
          )}

          {product.additionalInformation && (
            <div className="product-detail-additional">
              <button
                className="additional-info-toggle"
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              >
                INFORMACIÓN ADICIONAL
                <span className={`toggle-arrow ${showAdditionalInfo ? 'open' : ''}`}>▼</span>
              </button>
              {showAdditionalInfo && (
                <>
                  <hr className="additional-info-divider" />
                  <div className="additional-info-content">
                    {product.additionalInformation.split('\n').map((line, index) => (
                      line.trim() && <p key={index}>{line.trim()}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Product Images */}
        <div className="product-detail-images">
          {product.images && product.images.length > 0 && (
            <>
              <div 
                className="main-image-container"
                onClick={() => {
                  setIsFullscreen(true);
                  setFullscreenImageIndex(selectedImageIndex);
                }}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="main-product-image"
                />
              </div>
              {product.images.length > 1 && (
                <div className="thumbnail-images">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail-image ${selectedImageIndex === index ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(index);
                      }}
                      onDoubleClick={() => {
                        setIsFullscreen(true);
                        setFullscreenImageIndex(index);
                      }}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <div className="recommended-products-section">
          <h2 className="recommended-title">Recomendados</h2>
          <div className="recommended-products-carousel">
            <div className="recommended-carousel-container">
              <div 
                className={`recommended-carousel-track ${isTransitioning ? 'transitioning' : ''}`}
              >
                {getVisibleProducts(recommendedProducts).map((recProduct) => (
                  <div
                    key={recProduct.id}
                    className="recommended-product-card"
                    onClick={() => navigate(`/producto/${recProduct.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="recommended-product-image">
                      {recProduct.images && recProduct.images.length > 0 && (
                        <img
                          src={recProduct.images[0]}
                          alt={recProduct.name}
                        />
                      )}
                    </div>
                    <div className="recommended-product-info">
                      <h3 className="recommended-product-title">{recProduct.name}</h3>
                      <p className="recommended-product-price">$ {recProduct.price}</p>

                      <div className="recommended-product-actions">
                        <button 
                          className={`action-btn cart-btn ${isInCart(recProduct.id) ? 'in-cart' : ''}`}
                          aria-label={isInCart(recProduct.id) ? "Quitar del carrito" : "Agregar al carrito"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCart(recProduct.id);
                          }}
                        >
                          <img 
                            src={isInCart(recProduct.id) ? "/images/cart-filled.svg" : "/images/cart.svg"} 
                            alt={isInCart(recProduct.id) ? "Carrito lleno" : "Carrito"} 
                          />
                        </button>
                        <button 
                          className={`action-btn favorite-btn ${favorites.some(fav => fav.id === recProduct.id) ? 'favorited' : ''}`}
                          aria-label={favorites.some(fav => fav.id === recProduct.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRecommendedFavorite(recProduct.id);
                          }}
                        >
                          <img 
                            src={favorites.some(fav => fav.id === recProduct.id) ? "/images/favorito-filled.svg" : "/images/favorito.svg"} 
                            alt={favorites.some(fav => fav.id === recProduct.id) ? "Favorito lleno" : "Favorito"} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {recommendedProducts.length > productsPerSlide && (
                <>
                  <button 
                    className="recommended-carousel-nav recommended-prev-btn" 
                    onClick={prevSlide}
                    aria-label="Producto anterior"
                  >
                    <img src="/images/next-arrow.svg" alt="Anterior" className="recommended-nav-icon recommended-prev-icon" />
                  </button>
                  <button 
                    className="recommended-carousel-nav recommended-next-btn" 
                    onClick={nextSlide}
                    aria-label="Siguiente producto"
                  >
                    <img src="/images/next-arrow.svg" alt="Siguiente" className="recommended-nav-icon recommended-next-icon" />
                  </button>
                </>
              )}
            </div>
            
            {Math.ceil(recommendedProducts.length / productsPerSlide) > 1 && (
              <div className="recommended-carousel-dots">
                {Array.from({ length: Math.ceil(recommendedProducts.length / productsPerSlide) }, (_, index) => (
                  <button
                    key={index}
                    className={`recommended-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Ir a slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="product-detail-toast">
          {toastMessage}
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {isFullscreen && product.images && product.images.length > 0 && (
        <div 
          className="fullscreen-image-modal"
          onClick={() => setIsFullscreen(false)}
        >
          <button 
            className="fullscreen-close-btn"
            onClick={() => setIsFullscreen(false)}
            aria-label="Cerrar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          {product.images.length > 1 && (
            <>
              <button 
                className="fullscreen-nav-btn fullscreen-prev-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenImageIndex((prev) => 
                    prev === 0 ? product.images.length - 1 : prev - 1
                  );
                }}
                aria-label="Imagen anterior"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button 
                className="fullscreen-nav-btn fullscreen-next-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenImageIndex((prev) => 
                    prev === product.images.length - 1 ? 0 : prev + 1
                  );
                }}
                aria-label="Siguiente imagen"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}
          
          <div 
            className="fullscreen-image-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.images[fullscreenImageIndex]}
              alt={`${product.name} - Imagen ${fullscreenImageIndex + 1}`}
              className="fullscreen-image"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="fullscreen-image-counter">
              {fullscreenImageIndex + 1} / {product.images.length}
            </div>
          )}
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}

export default ProductDetail;

