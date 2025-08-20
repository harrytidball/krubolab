import { useState } from 'react';

function Header() {
  return (
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button className="icon-btn cart-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header; 