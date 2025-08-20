import React from 'react';

function FeaturedWorks() {
  return (
    <section className="featured-works">
      <div className="featured-works-container">
        <h2 className="section-title">TRABAJOS DESTACADOS</h2>
        
        <div className="featured-works-grid">
          <div className="product-card">
            <div className="product-image">
              <img 
                src="/images/pyramid-head.png" 
                alt="Pyramid Head Figura Coleccionable" 
                className="product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="product-title">Pyramid Head</h3>
              <p className="product-description">Figura coleccionable</p>
              <p className="product-price">$ 50.000</p>
              <button className="ver-mas-btn">VER MÁS</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img 
                src="/images/head-1.png" 
                alt="Head-1 Porta Audífonos" 
                className="product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="product-title">Head-1</h3>
              <p className="product-description">Porta audífonos</p>
              <p className="product-price">$ 70.000</p>
              <button className="ver-mas-btn">VER MÁS</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img 
                src="/images/okus.png" 
                alt="Okus Mesa de Noche" 
                className="product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="product-title">Okus</h3>
              <p className="product-description">Mesa de noche</p>
              <p className="product-price">$ 200.000</p>
              <button className="ver-mas-btn">VER MÁS</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img 
                src="/images/repuestos-cosedora-singer.png" 
                alt="Repuestos Cosedora Singer Piezas Mecánicas" 
                className="product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="product-title">Repuestos Singer</h3>
              <p className="product-description">Piezas mecánicas</p>
              <p className="product-price">$ 30.000</p>
              <button className="ver-mas-btn">VER MÁS</button>
            </div>
          </div>
        </div>

        <div className="carousel-nav">
          <button className="carousel-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorks; 