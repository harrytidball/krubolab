import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import './Personalized.css';
import './WorkshopProducts.css';

// Helper function to get images per slide based on screen width
const getImagesPerSlide = () => {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  if (window.innerWidth <= 1024) return 3;
  return 4;
};

function Personalized() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesPerSlide, setImagesPerSlide] = useState(getImagesPerSlide());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // List of all personalised images
  const personalisedImages = [
    '/images/personalised/personalised-1.jpg',
    '/images/personalised/personalised-2.jpg',
    '/images/personalised/personalised-3.jpg',
    '/images/personalised/personalised-4.jpg',
    '/images/personalised/personalised-5.jpg',
    '/images/personalised/personalised-6.jpg',
    '/images/personalised/personalised-7.jpg',
    '/images/personalised/personalised-8.jpg',
    '/images/personalised/personalised-9.jpg',
    '/images/personalised/personalised-10.jpg',
    '/images/personalised/personalised-11.jpg',
    '/images/personalised/personalised-12.jpg',
  ];

  useEffect(() => {
    // Add resize listener to update images per slide
    const handleResize = () => {
      setImagesPerSlide(getImagesPerSlide());
      // Reset slide when resizing
      setCurrentSlide(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(personalisedImages.length / imagesPerSlide);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
      setIsTransitioning(false);
    }, 150);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 150);
  };

  const getVisibleImages = () => {
    const startIndex = currentSlide * imagesPerSlide;
    return personalisedImages.slice(startIndex, startIndex + imagesPerSlide);
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/573042450295?text=Hola, tengo un proyecto personalizado en mente', '_blank');
  };

  return (
    <div className="personalized-page">
      <Header />
      
      {/* Hero Section */}
      <section className="personalized-hero">
        <div className="personalized-hero-container">
          <div className="personalized-hero-content">
            <div className="personalized-hero-text-content">
              <h1 className="hero-title">PERSONALIZADOS</h1>
              <p className="hero-description">
                Desde la elección de materiales hasta el diseño final, transformamos tus ideas en objetos funcionales, duraderos y llenos de carácter. Si puedes imaginarlo, podemos hacerlo realidad.
              </p>
            </div>
            <div className="personalized-hero-image-wrapper">
              <img 
                src="/images/personalised-krubot.png" 
                alt="Personalizados" 
                className="personalized-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Carousel Section */}
      <section className="personalized-projects-section">
        <div className="personalized-projects-container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2 className="personalized-projects-title" style={{ marginBottom: '3rem' }}>ALGUNOS PROYECTOS REALIZADOS</h2>
          
          {personalisedImages.length > 0 && (
            <div className="projects-carousel">
              <div className="carousel-container">
                <div 
                  className={`carousel-track ${isTransitioning ? 'transitioning' : ''}`}
                >
                  {getVisibleImages().map((image, index) => (
                    <div 
                      key={`${currentSlide}-${index}`} 
                      className="project-image-card"
                    >
                      <div className="project-image-wrapper">
                        <img 
                          src={image} 
                          alt={`Proyecto personalizado ${currentSlide * imagesPerSlide + index + 1}`}
                          className="project-image"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {personalisedImages.length > imagesPerSlide && (
                  <>
                    <button 
                      className="carousel-nav personalized prev-btn" 
                      onClick={prevSlide}
                      aria-label="Imagen anterior"
                    >
                      <img src="/images/next-arrow.svg" alt="Anterior" className="nav-icon prev-icon" />
                    </button>
                    <button 
                      className="carousel-nav personalized next-btn" 
                      onClick={nextSlide}
                      aria-label="Siguiente imagen"
                    >
                      <img src="/images/next-arrow.svg" alt="Siguiente" className="nav-icon next-icon" />
                    </button>
                  </>
                )}
              </div>
              
              {totalSlides > 1 && (
                <div className="carousel-dots">
                  {Array.from({ length: totalSlides }, (_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Ir a slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="personalized-cta-section">
        <div className="personalized-cta-container">
          <div className="personalized-cta-content">
            <div className="personalized-cta-text-content">
              <h2 className="personalized-cta-title" style={{ marginTop: '2rem' }}>TU IDEA, TU ESTILO, NUESTRO TRABAJO</h2>
              <button 
                className="personalized-cta-button"
                onClick={handleWhatsAppClick}
              >
                HABLA CON UN ASESOR
              </button>
            </div>
            <div className="personalized-cta-image-wrapper">
              <img 
                src="/images/personalised-krubot-2.jpg" 
                alt="Tu idea, tu estilo, nuestro trabajo" 
                className="personalized-cta-image"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Personalized;

