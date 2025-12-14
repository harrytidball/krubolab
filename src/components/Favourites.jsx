import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function Favourites() {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = () => {
    try {
      const stored = localStorage.getItem('krubolab-favorites');
      if (stored) {
        const favouritesList = JSON.parse(stored);

        // Handle both old format (array of IDs) and new format (array of objects)
        if (Array.isArray(favouritesList) && favouritesList.length > 0) {
          if (typeof favouritesList[0] === 'string' || typeof favouritesList[0] === 'number') {
            // Old format - clear it and set empty array
            localStorage.removeItem('krubolab-favorites');
            setFavourites([]);
            setSubtotal(0);
            return;
          }
          
          // New format - use as is
          setFavourites(favouritesList);
          calculateSubtotal(favouritesList);
        } else {
          // Empty or invalid - set empty array
          setFavourites([]);
          setSubtotal(0);
        }
      } else {
        // No data - set empty array
        setFavourites([]);
        setSubtotal(0);
      }
    } catch (error) {
      // On error, set empty array
      setFavourites([]);
      setSubtotal(0);
    }
  };

  const calculateSubtotal = (favouritesList) => {
    const total = favouritesList.reduce((sum, item) => {
      let itemPrice = item.price;
      if (typeof itemPrice === 'string') {
        itemPrice = parseFloat(itemPrice.replace(/\./g, ''));
      }
      return sum + (itemPrice * (item.quantity || 1));
    }, 0);
    setSubtotal(total);
  };

  const formatPrice = (price) => {
    // Remove dots if they exist and convert to number
    let numericPrice = price;
    if (typeof price === 'string') {
      numericPrice = parseFloat(price.replace(/\./g, ''));
    }
    
    // Add thousands separators with dots
    return `$ ${numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedFavourites = favourites.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setFavourites(updatedFavourites);
    localStorage.setItem('krubolab-favorites', JSON.stringify(updatedFavourites));
    calculateSubtotal(updatedFavourites);
    
    // Dispatch custom event to update header count
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  const removeFromFavourites = (productId) => {
    const updatedFavourites = favourites.filter(item => item.id !== productId);
    setFavourites(updatedFavourites);
    localStorage.setItem('krubolab-favorites', JSON.stringify(updatedFavourites));
    calculateSubtotal(updatedFavourites);
    
    // Dispatch custom event to update header count
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const addToCart = (product) => {
    try {
      const existingCart = localStorage.getItem('krubolab-cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += (product.quantity || 1);
      } else {
        cart.push({
          ...product,
          quantity: product.quantity || 1
        });
      }
      
      localStorage.setItem('krubolab-cart', JSON.stringify(cart));
      
      // Dispatch custom event to update header count
      window.dispatchEvent(new CustomEvent('cartChanged'));
      
      // Show success toast
      showToast(`${product.name} añadido al carrito`);
      
      // Remove from favourites after adding to cart
      removeFromFavourites(product.id);
      
      // If this was the last item in favourites, redirect to checkout
      if (favourites.length === 1) {
        navigate('/carrito');
      }
    } catch (error) {
      // Error handling for cart operations
      showToast('Error al añadir al carrito', 'error');
    }
  };

  const addAllToCart = () => {
    try {
      // Add all products to cart first
      favourites.forEach(product => {
        const existingCart = localStorage.getItem('krubolab-cart');
        const cart = existingCart ? JSON.parse(existingCart) : [];
        
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
          existingItem.quantity += (product.quantity || 1);
        } else {
          cart.push({
            ...product,
            quantity: product.quantity || 1
          });
        }
        
        localStorage.setItem('krubolab-cart', JSON.stringify(cart));
      });
      
      // Clear all favourites at once
      setFavourites([]);
      localStorage.removeItem('krubolab-favorites');
      
      // Dispatch events to update header counts
      window.dispatchEvent(new CustomEvent('cartChanged'));
      window.dispatchEvent(new CustomEvent('favoritesChanged'));
      
      // Navigate to checkout after adding all items
      navigate('/carrito');
    } catch (error) {
      // Error handling for cart operations
    }
  };

  if (favourites.length === 0) {
    return (
      <>
        <Header />
        <div className="favourites-page">
          <div className="favourites-container">
            <div className="favourites-content">
              <h1 className="favourites-title">TUS FAVORITOS</h1>
              <div className="favourites-alert">
            <div className="alert-icon">⚠️</div>
            <span>Esta lista es solo temporal</span>
          </div>

          <div className="favourites-section">
            <h2 className="favourites-subtitle">Favoritos</h2>
            <p className="favourites-count">{favourites.length} producto{favourites.length > 1 ? 's' : ''}</p>
          </div>
          
          <div className="empty-favourites">
            <div className="empty-favourites-message">
              Parece que esta lista esta vacía. Sigue explorando a tu alrededor y agrega aquí los elementos que quieras para seleccionar los finales.
            </div>
          </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="favourites-page">
        <div className="favourites-container">
          <div className="favourites-content">
          <h1 className="favourites-title">TUS FAVORITOS</h1>
          
          <div className="favourites-alert">
            <div className="alert-icon">⚠️</div>
            <span>Esta lista es solo temporal</span>
          </div>

          <div className="favourites-section">
            <h2 className="favourites-subtitle">Favoritos</h2>
            <p className="favourites-count">{favourites.length} producto{favourites.length > 1 ? 's' : ''}</p>
          </div>

          <div className="favourites-layout">
            <div className="favourites-list">
              {favourites.map((product) => (
                <div key={product.id} className="favourite-item">
                  <div className="favourite-product-image">
                    <img 
                      src={product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg4MFY4MEgyMFYyMFoiIGZpbGw9IiNFNUU1RTUiLz4KPHN2ZyB4PSIzMCIgeT0iMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNDQ0NDQ0MiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Ik0xMiA1djE0TTUgMTJoMTQiLz4KPC9zdmc+Cjwvc3ZnPgo='} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg4MFY4MEgyMFYyMFoiIGZpbGw9IiNFNUU1RTUiLz4KPHN2ZyB4PSIzMCIgeT0iMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNDQ0NDQ0MiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Ik0xMiA1djE0TTUgMTJoMTQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                  
                  <div className="favourite-product-details">
                    <h3 className="favourite-product-name">{product.name}</h3>
                    
                    <div className="favourite-product-actions">
                      <div className="favourite-quantity-selector">
                        <button 
                          className="favourite-heart-btn"
                          onClick={() => removeFromFavourites(product.id)}
                        >
                          <img 
                            src="/images/favorito-filled.svg" 
                            alt="Remove from favourites" 
                            width="20" 
                            height="20"
                          />
                        </button>
                        
                        <div className="favourite-quantity-controls">
                          <button 
                            className="favourite-quantity-btn"
                            onClick={() => updateQuantity(product.id, (product.quantity || 1) - 1)}
                          >
                            -
                          </button>
                          <span className="favourite-quantity-display">{product.quantity || 1}</span>
                          <button 
                            className="favourite-quantity-btn"
                            onClick={() => updateQuantity(product.id, (product.quantity || 1) + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          className="favourite-add-to-cart-btn"
                          onClick={() => addToCart(product)}
                        >
                          <img 
                            src="/images/cart.svg" 
                            alt="Add to cart" 
                            width="20" 
                            height="20"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="favourite-product-price">
                    <span className="favourite-price">{formatPrice(parseFloat(product.price.replace(/\./g, '')) * (product.quantity || 1))}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="favourites-summary">
              <div className="favourite-summary-card">
                <h3 className="favourite-summary-title">Resumen</h3>
                <div className="favourite-summary-subtotal">
                  <span>Subtotal</span>
                  <span className="favourite-subtotal-amount">{formatPrice(subtotal)}</span>
                </div>
                <button 
                  className="favourite-add-all-to-cart-btn"
                  onClick={addAllToCart}
                >
                  <img 
                    src="/images/cart.svg" 
                    alt="Shopping cart" 
                    width="20" 
                    height="20"
                  />
                  Añadir todos los productos al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Toast Notification */}
    {toast.show && (
      <div className={`toast-notification ${toast.type}`}>
        <div className="toast-content">
          <span className="toast-message">{toast.message}</span>
        </div>
      </div>
    )}
    </>
  );
}

export default Favourites;
