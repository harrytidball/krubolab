function QuoteSection() {
  return (
    <section className="quote-section">
      <div className="quote-container">
        <div className="quote-robot">
          <img 
            src="/images/krubot-robot-2.png" 
            alt="Krubot - Robot for quotes" 
            className="quote-robot-image"
          />
        </div>
        <div className="quote-content">
          <h2 className="quote-title">¿LISTO PARA CREAR ALGO ÚNICO?</h2>
          <p className="quote-subtitle">CONTÁCTANOS HOY MISMO</p>
          <button 
            className="quote-button"
            onClick={() => {
              const whatsappNumber = '573042450295';
              const message = encodeURIComponent('Hola, me gustaría solicitar una cotización');
              window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            }}
          >
            SOLICITAR COTIZACIÓN
          </button>
        </div>
      </div>
    </section>
  );
}

export default QuoteSection;