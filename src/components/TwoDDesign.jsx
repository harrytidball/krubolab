import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './TwoDDesign.css';

function TwoDDesign() {
  const navigate = useNavigate();

  const designImages = [
    '/images/design-2d/1.png',
    '/images/design-2d/2.jpg',
    '/images/design-2d/3.jpg',
    '/images/design-2d/4.jpg',
    '/images/design-2d/5.jpg',
    '/images/design-2d/6.jpg'
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/573042450295?text=Hola, me gustaría hablar sobre diseño 2D y planos técnicos', '_blank');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="two-d-design-page">
      <Header />
      
      {/* Hero Section */}
      <section className="two-d-design-hero">
        <div className="two-d-design-hero-container">
          <div className="two-d-design-hero-content">
            <div className="two-d-design-hero-text-content">
              <div className="hero-headlines">
                <h1 className="hero-title-left">DISEÑO 2D</h1>
                <h1 className="hero-title-right" style={{ textAlign: 'left' }}>TE AYUDAMOS CON TUS<br />PLANOS TÉCNICOS</h1>
              </div>
              <p className="hero-description" style={{ textAlign: 'left', fontSize: '1.5rem' }}>
                Ofrecemos una representación precisa del objeto que necesitas documentar, con todos los elementos para un plano de fabricación completo: vistas ortogonales, despieces, listado de componentes, tolerancias, especificaciones de construcción y detalles técnicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Drawings Grid Section */}
      <section className="technical-drawings-section">
        <div className="technical-drawings-container">
          <div className="drawings-grid">
            {designImages.map((image, index) => (
              <div key={index} className="drawing-panel">
                <img 
                  src={image} 
                  alt={`Diseño técnico ${index + 1}`}
                  className="drawing-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="two-d-design-cta-section">
        <div className="two-d-design-cta-container">
          <h2 className="two-d-design-cta-title">HABLEMOS<br />DIRECTAMENTE</h2>
          <button 
            className="two-d-design-cta-button whatsapp-btn"
            onClick={handleWhatsApp}
          >
            Ir a WhatsApp &gt;
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default TwoDDesign;

