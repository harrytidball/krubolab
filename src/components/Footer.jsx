function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* CONTACTO Column */}
        <div className="footer-column">
          <h3 className="footer-title">CONTACTO</h3>
          <div className="footer-content">
            <div className="footer-item">
              <img 
                src={`${import.meta.env.BASE_URL}images/location-pin.svg`} 
                alt="Location" 
                className="footer-icon"
              />
              <span>Cra. 18 #6-19 Sogamoso, Boyacá</span>
            </div>
            <div className="footer-item">
              <img 
                src={`${import.meta.env.BASE_URL}images/instagram-icon.svg`} 
                alt="Instagram" 
                className="footer-icon"
              />
              <span>Krubolab</span>
            </div>
            <div className="footer-item">
              <img 
                src={`${import.meta.env.BASE_URL}images/whatsapp-icon.svg`} 
                alt="WhatsApp" 
                className="footer-icon"
              />
              <span>304 245 0295</span>
            </div>
            <div className="footer-item">
              <img 
                src={`${import.meta.env.BASE_URL}images/email-icon.svg`} 
                alt="Email" 
                className="footer-icon"
              />
              <span>krubolab@gmail.com</span>
            </div>
          </div>
        </div>

        {/* INFORMACIÓN Column */}
        {/* <div className="footer-column">
          <h3 className="footer-title">INFORMACIÓN</h3>
          <div className="footer-content">
            <div className="footer-item">
              <span>Quiénes somos</span>
            </div>
            <div className="footer-item">
              <span>Preguntas frecuentes</span>
            </div>
            <div className="footer-item">
              <span>Diseños personalizados</span>
            </div>
            <div className="footer-item">
              <span>Nuestros materiales</span>
            </div>
          </div>
        </div> */}

        {/* SÍGUENOS EN Column */}
        <div className="footer-column">
          <h3 className="footer-title">SÍGUENOS EN</h3>
          <div className="footer-content">
            <a 
              href="https://www.instagram.com/krubolab/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-item"
            >
              <img 
                src={`${import.meta.env.BASE_URL}images/instagram-icon.svg`} 
                alt="Instagram" 
                className="footer-social-icon"
              />
            </a>
            <a 
              href="https://www.facebook.com/share/1AdScJQ4s7/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-item"
            >
              <img 
                src={`${import.meta.env.BASE_URL}images/facebook-icon.svg`} 
                alt="Facebook" 
                className="footer-social-icon"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 