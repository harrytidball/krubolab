import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import './ThreeDDesign.css';

function ThreeDDesign() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Carousel slides based on orden-de-aparición.jpg
  const carouselSlides = [
    ['/images/design-3d/8.1.png', '/images/design-3d/8.2.png', '/images/design-3d/8.3.png'],
    ['/images/design-3d/9.1.png', '/images/design-3d/9.2.png', '/images/design-3d/9.3.png'],
    ['/images/design-3d/10.1.png', '/images/design-3d/10.2.png'],
    ['/images/design-3d/11.1.png', '/images/design-3d/11.2.png', '/images/design-3d/11.3.png']
  ];

  // Flatten all images for mobile carousel
  const allImages = carouselSlides.flat();
  const totalImages = allImages.length;

  // Connector models (images 1-3) - special section
  const connectorModels = [
    '/images/design-3d/1.png',
    '/images/design-3d/2.png',
    '/images/design-3d/3.png'
  ];

  // 3D Model examples grid (images 4-7) - each with title and subtitle
  const modelExamples = [
    {
      image: '/images/design-3d/4.png',
      title: 'Pieza suich de automóvil',
      subtitle: null
    },
    {
      image: '/images/design-3d/5.png',
      title: 'Parte de termostato automóvil',
      subtitle: 'Pieza impresa para molde de fundición de aluminio'
    },
    {
      image: '/images/design-3d/6.png',
      title: 'Tapa de máquina de coser',
      subtitle: null
    },
    {
      image: '/images/design-3d/7.png',
      title: 'Piñón máquina de coser',
      subtitle: null
    }
  ];

  // Modular first aid kit images (12-16)
  const firstAidKitImages = [
    '/images/design-3d/12.png',
    '/images/design-3d/13.png',
    '/images/design-3d/14.png',
    '/images/design-3d/15.png',
    '/images/design-3d/16.png'
  ];

  // Renders en contexto images (18-21, plus placeholder for 17)
  const contextRenders = [
    '/images/design-3d/18.png',
    '/images/design-3d/19.png',
    '/images/design-3d/20.png',
    '/images/design-3d/21.png'
  ];

  const totalSlides = carouselSlides.length;

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync image index with slide index when switching between mobile/desktop
  useEffect(() => {
    if (!isMobile) {
      // Find which slide contains the current image
      let imageCount = 0;
      for (let i = 0; i < carouselSlides.length; i++) {
        if (currentImageIndex < imageCount + carouselSlides[i].length) {
          setCurrentSlide(i);
          break;
        }
        imageCount += carouselSlides[i].length;
      }
    }
  }, [isMobile, currentImageIndex]);

  const nextSlide = () => {
    if (isMobile) {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    } else {
      setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    }
  };

  const goToSlide = (index) => {
    if (isMobile) {
      setCurrentImageIndex(index);
    } else {
      setCurrentSlide(index);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/573042450295?text=Hola, me gustaría hablar sobre diseño 3D', '_blank');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:contacto@krubolab.com?subject=Consulta sobre Diseño 3D';
  };

  return (
    <div className="three-d-design-page">
      <Header />
      
      {/* Hero Section */}
      <section className="three-d-design-hero">
        <div className="three-d-design-hero-container">
          <div className="three-d-design-hero-content">
            <div className="three-d-design-hero-text-content">
              <div className="three-d-design-hero-headlines">
                <h1 className="three-d-design-hero-title-left">DISEÑO 3D</h1>
                <h1 className="three-d-design-hero-title-right">DISEÑAMOS Y MODELAMOS TRIDIMENSIONALMENTE</h1>
              </div>
              <p className="three-d-design-hero-description">
                Creamos la versión digital de tu producto, lista para impresión, manufactura o simulación. Desde piezas 'no visuales' hasta mecanismos complejos, modelamos pieza a pieza, construimos el ensamblaje completo y creamos animaciones de montaje y funcionamiento.
              </p>
              <p className="three-d-design-hero-description">
                Además, producimos imágenes tipo catálogo, renders en contexto, ilustraciones de relación objeto-usuario y materia para manuales de uso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connector Models Section */}
      <section className="three-d-design-connector-section">
        <div className="three-d-design-connector-container">
          <h2 className="three-d-design-connector-title">Conectores de subestación de alta tensión</h2>
          <p className="three-d-design-connector-subtitle">Modelado de conectores de cables para impresión 3D.</p>
          <div className="three-d-design-connector-grid">
            {connectorModels.map((image, index) => (
              <div key={index} className="three-d-design-connector-card">
                <img 
                  src={image} 
                  alt={`Conector ${index + 1}`}
                  className="three-d-design-connector-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Model Examples Grid Section */}
      <section className="three-d-design-model-examples-section">
        <div className="three-d-design-model-examples-container">
          <div className="three-d-design-model-examples-grid">
            {modelExamples.map((item, index) => (
              <div key={index} className="three-d-design-model-example-card">
                {(item.title || item.subtitle) && (
                  <div className="three-d-design-model-example-header">
                    {item.title && (
                      <h3 className="three-d-design-model-example-title">{item.title}</h3>
                    )}
                    {item.subtitle && (
                      <p className="three-d-design-model-example-subtitle">{item.subtitle}</p>
                    )}
                  </div>
                )}
                <div className="three-d-design-model-example-image-wrapper">
                  <img 
                    src={item.image} 
                    alt={item.title || `Modelo 3D ${index + 4}`}
                    className={`three-d-design-model-example-image ${index >= 2 ? 'three-d-design-model-example-image-small' : ''}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section - Interspersed */}
      <section className="three-d-design-contact-form-section">
        <div className="three-d-design-contact-form-container">
          <h2 className="three-d-design-contact-form-title">DÉJANOS UN MENSAJE</h2>
          <p className="three-d-design-contact-form-subtitle">Con gusto te atenderemos</p>
          <div className="three-d-design-contact-form-buttons">
            <button 
              className="three-d-design-contact-button three-d-design-whatsapp-button"
              onClick={handleWhatsApp}
            >
              Ir a WhatsApp &gt;
            </button>
          </div>
        </div>
      </section>

      {/* Dark Carousel Section */}
      <section className="dark-carousel-section">
        <div className="dark-carousel-container">
          <div className="dark-carousel">
            <div className="three-d-design-carousel-container">
              {isMobile ? (
                // Mobile: Show single image carousel
                <div className="three-d-design-carousel-track mobile-carousel">
                  <div className="three-d-design-carousel-image-card">
                    <div className="three-d-design-carousel-image-wrapper">
                      <img 
                        src={allImages[currentImageIndex]} 
                        alt={`Carousel imagen ${currentImageIndex + 1}`}
                        className="three-d-design-carousel-image"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Desktop: Show slide-based carousel
                <div 
                  className={`three-d-design-carousel-track ${currentSlide < 2 ? 'close-spacing' : ''} ${currentSlide === 2 ? 'gap-spacing small-images' : ''} ${currentSlide === 3 ? 'small-images tight-spacing' : ''}`}
                >
                  {carouselSlides[currentSlide].map((image, index) => (
                    <div 
                      key={`${currentSlide}-${index}`} 
                      className="three-d-design-carousel-image-card"
                    >
                      <div className="three-d-design-carousel-image-wrapper">
                        <img 
                          src={image} 
                          alt={`Carousel slide ${currentSlide + 1} imagen ${index + 1}`}
                          className="three-d-design-carousel-image"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {(isMobile ? totalImages > 1 : totalSlides > 1) && (
                <>
                  <button 
                    className="three-d-design-carousel-nav dark-carousel three-d-design-prev-btn" 
                    onClick={prevSlide}
                    aria-label={isMobile ? "Imagen anterior" : "Slide anterior"}
                  >
                    <img src="/images/next-arrow.svg" alt="Anterior" className="three-d-design-nav-icon three-d-design-prev-icon" />
                  </button>
                  <button 
                    className="three-d-design-carousel-nav dark-carousel three-d-design-next-btn" 
                    onClick={nextSlide}
                    aria-label={isMobile ? "Siguiente imagen" : "Siguiente slide"}
                  >
                    <img src="/images/next-arrow.svg" alt="Siguiente" className="three-d-design-nav-icon three-d-design-next-icon" />
                  </button>
                </>
              )}
            </div>
            
            {(isMobile ? totalImages > 1 : totalSlides > 1) && (
              <div className="three-d-design-carousel-dots">
                {Array.from({ length: isMobile ? totalImages : totalSlides }, (_, index) => (
                  <button
                    key={index}
                    className={`three-d-design-dot ${index === (isMobile ? currentImageIndex : currentSlide) ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={isMobile ? `Ir a imagen ${index + 1}` : `Ir a slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modular First Aid Kit Section */}
      <section className="first-aid-kit-section">
        <div className="first-aid-kit-container">
          <div className="first-aid-kit-text-container">
            <h2 className="first-aid-kit-title">Botiquín modulable</h2>
            <p className="first-aid-kit-description">
              Diseño de botiquín de primeros auxilios personalizable y ajustable para vehículos medianos y pequeños de transporte masivo
            </p>
          </div>
          <div className="first-aid-kit-grid">
            {firstAidKitImages.map((image, index) => (
              <div key={index} className="first-aid-kit-card">
                <img 
                  src={image} 
                  alt={`Botiquín modulable ${index + 1}`}
                  className="first-aid-kit-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Renders en Contexto Section */}
      <section className="context-renders-section">
        <div className="context-renders-container">
          <div className="context-renders-header">
            <h2 className="context-renders-title">RENDERS EN CONTEXTO</h2>
          </div>
          <div className="context-renders-grid">
            {contextRenders.map((image, index) => (
              <div key={index} className="context-render-card">
                <img 
                  src={image} 
                  alt={`Render en contexto ${index + 1}`}
                  className="context-render-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="three-d-design-cta-section">
        <div className="three-d-design-cta-container">
          <h2 className="three-d-design-cta-title">QUIERO MI MODELO 3D</h2>
          <div className="three-d-design-cta-buttons">
            <button 
              className="cta-button whatsapp-cta-button"
              onClick={handleWhatsApp}
            >
              Enviar WhatsApp
            </button>
            <button 
              className="cta-button email-cta-button"
              onClick={handleEmail}
            >
              Enviar correo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ThreeDDesign;

