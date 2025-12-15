import React from 'react';

function WhyChooseUs() {
  return (
    <section className="why-choose-us-section">
      <div className="why-choose-us-container">
        <h2 className="why-choose-us-title">¿POR QUÉ ELEGIRNOS?</h2>
        
        <div className="why-choose-us-grid">
          <div className="why-choose-us-item">
            <div className="why-choose-us-icon">
              <img 
                src={`${import.meta.env.BASE_URL}images/hammer-screwdriver-icon.svg`} 
                alt="Martillo y destornillador - Precisión y calidad profesional" 
                className="feature-icon"
              />
            </div>
            <p className="why-choose-us-text">Precisión y calidad profesional</p>
          </div>
          
          <div className="why-choose-us-item">
            <div className="why-choose-us-icon">
              <img 
                src={`${import.meta.env.BASE_URL}images/pencil-ruler-icon.svg`} 
                alt="Lápiz y regla - Diseños personalizados" 
                className="feature-icon"
              />
            </div>
            <p className="why-choose-us-text">Diseños personalizados</p>
          </div>
          
          <div className="why-choose-us-item">
            <div className="why-choose-us-icon">
              <img 
                src={`${import.meta.env.BASE_URL}images/box-stars-icon.svg`} 
                alt="Caja con estrellas - Entrega garantizada" 
                className="feature-icon"
              />
            </div>
            <p className="why-choose-us-text">Entrega garantizada</p>
          </div>
          
          <div className="why-choose-us-item">
            <div className="why-choose-us-icon">
              <img 
                src={`${import.meta.env.BASE_URL}images/lightbulb-gears-icon.svg`} 
                alt="Foco con engranajes - Acompañamiento creativo" 
                className="feature-icon"
              />
            </div>
            <p className="why-choose-us-text">Acompañamiento creativo</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs; 