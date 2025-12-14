import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="not-found-page">
        <div className="not-found-container">
          <div className="not-found-content">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Página no encontrada</h2>
            <p className="not-found-description">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            <button 
              className="not-found-button"
              onClick={() => navigate('/')}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;

