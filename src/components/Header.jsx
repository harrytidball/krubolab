import { useState } from 'react';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo Section */}
          <div className="logo-section">
            <img 
              src="/images/krubo-logo.png" 
              alt="KRUBO Logo" 
              className="logo-image"
            />
          </div>

          {/* Search Bar */}
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
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="nav-section">
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
          <div className="icons-section">
            <button className="icon-btn heart-btn">
              <img 
                src="/images/favorito.svg" 
                alt="Favorito" 
                width="24" 
                height="24"
              />
            </button>
            <button className="icon-btn cart-btn">
              <img 
                src="/images/cart.svg" 
                alt="Shopping Cart" 
                width="24" 
                height="24"
              />
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
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Mobile Search */}
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
              />
            </div>
          </div>

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