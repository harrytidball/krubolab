import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './MaterialsPage.css';

function MaterialsPage() {
  return (
    <div className="materials-page">
      <Header />
      
      {/* Main Content */}
      <main className="materials-main">
        <div className="materials-container">
          {/* Title Section */}
          <h1 className="materials-page-title">NUESTRA FILOSOFÍA Y MATERIALES</h1>
          
          {/* Philosophy Section */}
          <section className="philosophy-section">
            <p className="philosophy-description">
              En Krubo creemos que cada objeto puede ser único y funcional. Nuestro propósito es dar vida a ideas y restaurar lo que ya tenemos, creamos soluciones ajustadas a cada necesidad, con creatividad, eficiencia y un uso inteligente de los recursos.
            </p>
          </section>

          {/* Materials Description Section */}
          <section className="materials-description-section">
            <p className="materials-description">
              Por eso nos gusta combinar materiales que equilibran estética, utilidad y durabilidad: la solidez del cemento, la versatilidad de los filamentos, la calidez de la madera, la transparencia del acrílico y el vidrio y la resistencia de los metales.
            </p>
          </section>

          {/* Custom Pieces Section */}
          <section className="custom-pieces-section">
            <p className="custom-pieces-description">
              Cada uno aporta sus mejores ventajas mecánicas, funcionales y estéticas para crear piezas hechas a medida que solucionan problemas.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MaterialsPage;

