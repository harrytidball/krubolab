import { Link } from 'react-router-dom';

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
                src="/images/location-pin.svg" 
                alt="Location" 
                className="footer-icon"
              />
              <span>Cra. 18 #6-19 Sogamoso, Boyacá</span>
            </div>
            <div className="footer-item">
              <img 
                src="/images/instagram-icon.svg" 
                alt="Instagram" 
                className="footer-icon"
              />
              <span>Krubolab</span>
            </div>
            <div className="footer-item">
              <img 
                src="/images/whatsapp-icon.svg" 
                alt="WhatsApp" 
                className="footer-icon"
              />
              <span>304 245 0295</span>
            </div>
            <div className="footer-item">
              <img 
                src="/images/email-icon.svg" 
                alt="Email" 
                className="footer-icon"
              />
              <span>krubolab@gmail.com</span>
            </div>
          </div>
        </div>

        {/* INFORMACIÓN Column */}
        <div className="footer-column">
          <h3 className="footer-title">INFORMACIÓN</h3>
          <div className="footer-content">
            <Link to="/diseños-personalizados" className="footer-item">
              <span>Diseños personalizados</span>
            </Link>
            <Link to="/nuestros-materiales" className="footer-item">
              <span>Nuestros materiales</span>
            </Link>
          </div>
        </div>

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
                src="/images/instagram-icon.svg" 
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
                src="/images/facebook-icon.svg" 
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