function Hero() {
  return (
    <section className="hero">
      {/* Center Panel - Robot and Content */}
      <div className="hero-center-panel">
        {/* Robot */}
        <div className="hero-robot">
          <img 
            src="/images/krubot-robot.png" 
            alt="Krubot - Friendly Robot" 
            className="robot-image"
          />
        </div>

        {/* Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-greeting">Hola, soy Krubot</span>
            <span className="hero-welcome">Bienvenido a Krubo</span>
          </h1>
          <p className="hero-subtitle">
            Encuentra el producto que quieres... y si no lo encuentras, lo hacemos. ¡Pregúntanos!
          </p>
        </div>
      </div>

      
    </section>
  );
}

export default Hero; 