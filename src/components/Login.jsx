import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENV_CONFIG } from '../config/env';

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Clear any existing authentication when login page is accessed
  useEffect(() => {
    localStorage.removeItem('isAuthenticated');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Password check using Cloudflare environment variable
    if (password === ENV_CONFIG.ADMIN_PASSWORD) {
      onLogin(true);
      navigate('/panel');
    } else {
      setError('Contraseña inválida');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Inicio de Sesión de Administrador</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="login-btn">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 