import Header from './Header';
import Footer from './Footer';
import './Repairs.css';

function Repairs() {
  const repairs = [
    {
      id: 1,
      image: '/images/repairs-1.png',
      title: 'Pieza motor limpia parabrisas Ford Escape 2014',
      description: 'Reconstrucción de engranaje de dientes helicoidales no disponible individualmente. Material: ABS. Medidas: 15 x 15 x 2 cm.'
    },
    {
      id: 2,
      image: '/images/repairs-2.png',
      title: 'Volantes de marcha cosedora industrial SINGER',
      description: 'Reconstrucción de volantes de marcha con indicadores en relieve. Material: PETG. Medidas: 6 x 6 x 2 cm.'
    },
    {
      id: 3,
      image: '/images/repairs-3.png',
      title: 'Volante de marcha cosedora SINGER',
      description: 'Reconstrucción completa de volante de marcha con íconos en relieve y refuerzo de acoplamiento de eje de acero. Material: ABS. Medidas: 15 x 15 x 2 cm.'
    },
    {
      id: 4,
      image: '/images/repairs-4.png',
      title: 'Pieza motor limpia parabrisas Ford Escape 2014',
      description: 'Reconstrucción de engranaje de dientes helicoidales no disponible individualmente. Material: ABS. Medidas: 15 x 15 x 2 cm.'
    }
  ];

  const handleRequestRepair = () => {
    window.open('https://wa.me/573042450295?text=Hola, me gustaría solicitar una reparación', '_blank');
  };

  const parseDescription = (description) => {
    const materialMatch = description.match(/Material:\s*([^.]+)/);
    const medidasMatch = description.match(/Medidas:\s*([^.]+)/);
    
    const mainText = description
      .replace(/Material:\s*[^.]+\.?\s*/g, '')
      .replace(/Medidas:\s*[^.]+\.?\s*/g, '')
      .trim();
    
    return {
      mainText,
      material: materialMatch ? materialMatch[1].trim() : null,
      medidas: medidasMatch ? medidasMatch[1].trim() : null
    };
  };

  return (
    <div className="repairs-page">
      <Header />
      
      {/* Hero Section */}
      <section className="repairs-hero">
        <div className="repairs-hero-container">
          <div className="repairs-hero-content">
            <div className="repairs-hero-text-content">
              <h1 className="repairs-hero-title">REPARACIONES</h1>
              <p className="repairs-hero-description">
                Si algo preciado para ti se rompió, una parte de tu máquina dejó de funcionar o necesitas darle una segunda vida a algo valioso, estamos para ayudarte. Usamos impresión 3D, corte láser y técnicas de diseño para fabricar repuestos personalizados, restaurar piezas y devolver la funcionalidad sin perder la estética.
              </p>
            </div>
            <div className="repairs-hero-image-wrapper">
              <img 
                src="/images/repairs-header.png" 
                alt="Reparaciones" 
                className="repairs-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Repairs Examples Section */}
      <section className="repairs-examples-section">
        <div className="repairs-examples-container">
          <h2 className="repairs-examples-title">REPARACIONES PARA NUESTROS CLIENTES</h2>
          
          <div className="repairs-grid">
            {repairs.map((repair) => {
              const parsed = parseDescription(repair.description);
              return (
                <div key={repair.id} className="repair-card">
                  <div className="repair-image">
                    <img 
                      src={repair.image} 
                      alt={repair.title}
                      className="repair-photo"
                    />
                  </div>
                  <div className="repair-info">
                    <h3 className="repair-title">{repair.title}</h3>
                    <div className="repair-description">
                      <p className="repair-main-text">{parsed.mainText}</p>
                      {parsed.material && (
                        <p className="repair-material">Material: {parsed.material}</p>
                      )}
                      {parsed.medidas && (
                        <p className="repair-medidas">Medidas: {parsed.medidas}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="repairs-cta-section">
        <div className="repairs-cta-container">
          <h2 className="repairs-cta-title">NO LO DESECHES,<br />REPÁRALO</h2>
          <button 
            className="repairs-cta-button"
            onClick={handleRequestRepair}
          >
            SOLICITAR REPARACIÓN
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Repairs;

