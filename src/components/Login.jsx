import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    // Simple password check - in production, this should be more secure
    if (password === 'admin123') {
      onLogin(true);
      navigate('/dashboard');
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