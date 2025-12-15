import React from 'react';

function Materials() {
  return (
    <section className="materials-section">
      <div className="materials-container">
        <div className="materials-content">
          <div className="materials-image">
            <img 
              src={`${import.meta.env.BASE_URL}images/materiales.jpg`} 
              alt="Materiales artísticos y figurinas geométricas" 
              className="materials-photo"
            />
          </div>
          
          <div className="materials-info">
            <h2 className="materials-title">NUESTROS MATERIALES</h2>
            <p className="materials-description">
              Los materiales que usamos en nuestros proyectos aportan lo mejor de sí para ofrecerte soluciones funcionales, duraderas y estéticas, encaminadas a cubrir cualquier necesidad.
            </p>
            
            <div className="materials-grid">
              <div className="materials-row">
                <button className="material-btn">PLA</button>
                <button className="material-btn">PETG</button>
                <button className="material-btn">ABS</button>
                <button className="material-btn">ASA</button>
              </div>
              
              <div className="materials-row">
                <button className="material-btn">ACRÍLICO</button>
                <button className="material-btn">ALUMINIO</button>
                <button className="material-btn">ACERO</button>
              </div>
              
              <div className="materials-row">
                <button className="material-btn">CEMENTO</button>
                <button className="material-btn">AGLOMERADOS</button>
              </div>
              
              <div className="materials-row materials-row-indented">
                <button className="material-btn">MADERA NATURAL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Materials; 