import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login({ token: data.token, user: { id: data.userId, fullName: data.fullName, role: data.role } });
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas.');
    }
  }

  return (
    <div>
      <header className="header">
        <h1>Iniciar sesión</h1>
        <Link to="/register" className="button secondary">Crear cuenta</Link>
      </header>

      <div className="card">
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form-row">
          <input className="input" placeholder="Correo" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="input" placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="button" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
