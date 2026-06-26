import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Guest');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api.post('/auth/register', { email, firstName, lastName, password, role });
      navigate('/login');
    } catch (err) {
      const message = err?.response?.data?.message || 'No se pudo crear la cuenta.';
      setError(message);
    }
  }

  return (
    <div>
      <header className="header">
        <h1>Registro</h1>
        <Link to="/login" className="button secondary">Ir a login</Link>
      </header>

      <div className="card">
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form-row">
          <input className="input" placeholder="Correo" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <div className="grid-2">
            <input className="input" placeholder="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            <input className="input" placeholder="Apellido" value={lastName} onChange={e => setLastName(e.target.value)} required />
          </div>
          <input className="input" placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <select className="select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="Guest">Huésped</option>
            <option value="Owner">Dueño</option>
          </select>
          <button className="button" type="submit">Crear cuenta</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
