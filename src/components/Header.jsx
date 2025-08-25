import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Helper function to get favorites count from localStorage
  const getFavoritesCount = () => {
    try {
      const stored = localStorage.getItem('krubolab-favorites');
      return stored ? JSON.parse(stored).length : 0;
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return 0;
    }
  };

  // Helper function to get cart count from localStorage
  const getCartCount = () => {
    try {
      const stored = localStorage.getItem('krubolab-cart');
      return stored ? JSON.parse(stored).length : 0;
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return 0;
    }
  };

  // Listen for changes in favorites and cart
  useEffect(() => {
    const updateFavoritesCount = () => {
      setFavoritesCount(getFavoritesCount());
    };

    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    // Initial counts
    updateFavoritesCount();
    updateCartCount();

    // Listen for storage changes (when favorites or cart are updated in other components)
    const handleStorageChange = (e) => {
      if (e.key === 'krubolab-favorites') {
        updateFavoritesCount();
      }
      if (e.key === 'krubolab-cart') {
        updateCartCount();
      }
    };

    // Listen for custom events when favorites or cart change
    const handleFavoritesChange = () => {
      updateFavoritesCount();
    };

    const handleCartChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesChanged', handleFavoritesChange);
    window.addEventListener('cartChanged', handleCartChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
      window.removeEventListener('cartChanged', handleCartChange);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    // Clear search when mobile menu is closed
    if (isSearchActive) {
      clearSearch();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsSearchActive(value.length > 0);
  };

  const clearSearch = () => {
    setSearchValue('');
    setIsSearchActive(false);
  };

  const handleCartClick = () => {
    navigate('/checkout');
  };

  // Add/remove body class for page dimming
  useEffect(() => {
    if (isSearchActive) {
      document.body.classList.add('search-active');
    } else {
      document.body.classList.remove('search-active');
    }

    return () => {
      document.body.classList.remove('search-active');
    };
  }, [isSearchActive]);

  // Listen for clear search event from footer
  useEffect(() => {
    const handleClearSearch = () => {
      clearSearch();
    };

    window.addEventListener('clearSearch', handleClearSearch);
    
    return () => {
      window.removeEventListener('clearSearch', handleClearSearch);
    };
  }, []);

  return (
    <>
      <header className={`header ${isSearchActive ? 'search-mode' : ''}`}>
        <div className="header-container">
          {/* Logo Section */}
          <div className={`logo-section ${isSearchActive ? 'hidden' : ''}`}>
            <a href="/" className="logo-link">
              <img 
                src="/images/krubo-logo.png" 
                alt="KRUBO Logo" 
                className="logo-image"
              />
            </a>
          </div>

          {/* Search Bar 
          <div className="search-section">
            <div className="search-container">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                placeholder="¿Qué estás buscando?" 
                className="search-input"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
          </div>*/}

          {/* Navigation */}
          <nav className={`nav-section ${isSearchActive ? 'hidden' : ''}`}>
            <div className="nav-link dropdown-trigger">
              Productos
              <div className="dropdown-menu">
                <div className="dropdown-item">Impresión 3D</div>
                <div className="dropdown-item">Corte láser</div>
                <div className="dropdown-item">Mobiliario</div>
                <div className="dropdown-item">Nuestros proyectos</div>
                <div className="dropdown-item">Personalizados</div>
              </div>
            </div>
            
            <div className="nav-link dropdown-trigger">
              Servicios
              <div className="dropdown-menu">
                <div className="dropdown-item">Diseño CAD 2D</div>
                <div className="dropdown-item">Diseño CAD 3D</div>
                <div className="dropdown-item">Reparaciones</div>
              </div>
            </div>
            
            <div className="nav-link dropdown-trigger">
              Acerca de
              <div className="dropdown-menu">
                <div className="dropdown-item">Nuestros materiales</div>
              </div>
            </div>
            
            <button className="nav-link">Diseños personalizados</button>
            <button className="nav-link">Contáctanos</button>
          </nav>

          {/* Right Icons */}
          <div className={`icons-section ${isSearchActive ? 'hidden' : ''}`}>
            <button className="icon-btn heart-btn">
              <img 
                src="/images/favorito.svg" 
                alt="Favorito" 
                width="24" 
                height="24"
              />
              {favoritesCount > 0 && (
                <span className="favorites-count">{favoritesCount}</span>
              )}
            </button>
            <button className="icon-btn cart-btn" onClick={handleCartClick}>
              <img 
                src="/images/cart.svg" 
                alt="Shopping Cart" 
                width="24" 
                height="24"
              />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </button>
            
            {/* Mobile Menu Toggle - Hidden on Desktop */}
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>

          {/* X Button - Right Side of Header */}
          {isSearchActive && (
            <div className="header-x-section">
              <button 
                className="header-x-btn" 
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <img 
                  src="/images/x.svg" 
                  alt="Clear search" 
                  width="18" 
                  height="18"
                />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Mobile Search 
          <div className="mobile-search">
            <div className="search-container">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                placeholder="¿Qué estás buscando?" 
                className="search-input"
                value={searchValue}
                onChange={handleSearchChange}
              />
              {isSearchActive && (
                <button 
                  className="mobile-clear-search-btn" 
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <img 
                    src="/images/x.svg" 
                    alt="Clear search" 
                    width="18" 
                    height="18"
                  />
                </button>
              )}
            </div>
          </div>
          */}

          {/* Mobile Navigation */}
          <nav className="mobile-nav">
            <div className="mobile-nav-section">
              <h3 className="mobile-nav-title">Productos</h3>
              <div className="mobile-nav-items">
                <a href="#" className="mobile-nav-item">Impresión 3D</a>
                <a href="#" className="mobile-nav-item">Corte láser</a>
                <a href="#" className="mobile-nav-item">Mobiliario</a>
                <a href="#" className="mobile-nav-item">Nuestros proyectos</a>
                <a href="#" className="mobile-nav-item">Personalizados</a>
              </div>
            </div>

            <div className="mobile-nav-section">
              <h3 className="mobile-nav-title">Servicios</h3>
              <div className="mobile-nav-items">
                <a href="#" className="mobile-nav-item">Diseño CAD 2D</a>
                <a href="#" className="mobile-nav-item">Diseño CAD 3D</a>
                <a href="#" className="mobile-nav-item">Reparaciones</a>
              </div>
            </div>

            <div className="mobile-nav-section">
              <h3 className="mobile-nav-title">Acerca de</h3>
              <div className="mobile-nav-items">
                <a href="#" className="mobile-nav-item">Nuestros materiales</a>
              </div>
            </div>

            <div className="mobile-nav-section">
              <div className="mobile-nav-items">
                <a href="#" className="mobile-nav-item">Diseños personalizados</a>
                <a href="#" className="mobile-nav-item">Contáctanos</a>
              </div>
            </div>
          </nav>

          {/* Close Button */}
          <button className="mobile-menu-close" onClick={closeMobileMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default Header; 