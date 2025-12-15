import React from 'react';

function ServicesSection() {
  return (
    <section className="services-section">
      {/* Top Section - Service Cards */}
      <div className="services-cards">
        <div className="service-card">
          <div className="service-image">
            <img 
              src={`${import.meta.env.BASE_URL}images/impresion-3d.png`} 
              alt="Impresión 3D" 
              className="service-img"
            />
          </div>
          <h3 className="service-title">Impresión 3D</h3>
        </div>

        <div className="service-card">
          <div className="service-image">
            <img 
              src={`${import.meta.env.BASE_URL}images/corte-laser.png`} 
              alt="Corte láser" 
              className="service-img"
            />
          </div>
          <h3 className="service-title">Corte láser</h3>
        </div>

        <div className="service-card">
          <div className="service-image">
            <img 
              src={`${import.meta.env.BASE_URL}images/madera.png`} 
              alt="Madera" 
              className="service-img"
            />
          </div>
          <h3 className="service-title">Madera</h3>
        </div>

        <div className="service-card">
          <div className="service-image">
            <img 
              src={`${import.meta.env.BASE_URL}images/piezas-mecanicas.png`} 
              alt="Piezas mecánicas" 
              className="service-img"
            />
          </div>
          <h3 className="service-title">Piezas mecánicas</h3>
        </div>
      </div>

      {/* Bottom Section - Black Bar with Categories */}
      <div className="services-categories">
        <div className="category-item">Diseño y prototipado</div>
        <div className="category-item">Personalización y accesorios</div>
        <div className="category-item">Diseño industrial</div>
        <div className="category-item">Proyectos especiales</div>
      </div>
    </section>
  );
}

export default ServicesSection; 