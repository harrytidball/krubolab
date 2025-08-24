import React from 'react';

function FeaturedWorks() {
  return (
    <section className="featured-works">
      <div className="featured-works-container">
        <h2 className="section-title">TRABAJOS DESTACADOS</h2>
        
        <div className="featured-works-grid">
          <div className="product-card">
            <div className="featured-product-image">
              <img 
                src="/images/pyramid-head.png" 
                alt="Pyramid Head Figura Coleccionable" 
                className="featured-product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="featured-product-title">Pyramid Head</h3>
              <p className="product-description">Figura coleccionable</p>
              <p className="product-price" style={{marginTop: '3px'}}>$ 50.000</p>
              <button className="featured-ver-mas-btn">VER MÁS</button>
            </div>
          </div>

          <div className="product-card">
            <div className="featured-product-image">
              <img 
                src="/images/head-1.png" 
                alt="Head-1 Porta Audífonos" 
                className="featured-product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="featured-product-title">Head-1</h3>
              <p className="product-description">Porta audífonos</p>
              <p className="product-price" style={{marginTop: '3px'}}>$ 70.000</p>
              <button className="featured-ver-mas-btn">VER MÁS</button>
            </div>
          </div>

          <div className="product-card">
            <div className="featured-product-image">
              <img 
                src="/images/okus.png" 
                alt="Okus Mesa de Noche" 
                className="featured-product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="featured-product-title">Okus</h3>
              <p className="product-description">Mesa de noche</p>
              <p className="product-price" style={{marginTop: '3px'}}>$ 200.000</p>
              <button className="featured-ver-mas-btn">VER MÁS</button>
            </div>
          </div>

          <div className="product-card">
            <div className="featured-product-image">
              <img 
                src="/images/repuestos-cosedora-singer.png" 
                alt="Repuestos Cosedora Singer Piezas Mecánicas" 
                className="featured-product-img"
              />
            </div>
            <div className="product-info">
              <h3 className="featured-product-title">Repuestos Singer</h3>
              <p className="product-description">Piezas mecánicas</p>
              <p className="product-price" style={{marginTop: '3px'}}>$ 30.000</p>
              <button className="featured-ver-mas-btn">VER MÁS</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorks; 