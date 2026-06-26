import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function KycPage() {
  const [documentNumber, setDocumentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const cleaned = documentNumber.trim();

    if (!/^\d{7,}$/.test(cleaned)) {
      setError('El número de documento debe tener mínimo 7 dígitos numéricos.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/kyc/submit', { documentNumber: cleaned });

      setMessage('Tu identidad fue verificada correctamente.');
      setError(null);
      setDocumentNumber('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al verificar tu identidad.');
      setMessage(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="header">
        <div>
          <h1>Verificación de identidad</h1>
          <p className="small-text">Ingresa tu número de documento para verificar tu cuenta.</p>
        </div>
        <Link to="/" className="button secondary">Volver</Link>
      </header>

      <div className="card">
        <div className="section-title">
          <h3>Sobre tu verificación</h3>
          <p className="small-text">
            Este paso es necesario para hacer tu primera reserva.
          </p>
        </div>

        {error && <div className="alert">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        <form onSubmit={handleSubmit} className="form-row">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Número de documento (mínimo 7 dígitos)"
            value={documentNumber}
            onChange={e => setDocumentNumber(e.target.value)}
            disabled={loading}
          />

          <button
            className="button"
            type="submit"
            disabled={loading || !documentNumber}
            style={{ opacity: loading || !documentNumber ? 0.5 : 1, cursor: loading || !documentNumber ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Verificando...' : 'Verificar identidad'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default KycPage;