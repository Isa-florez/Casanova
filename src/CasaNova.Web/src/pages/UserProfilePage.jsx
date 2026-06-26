import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function UserProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [kycStatus, setKycStatus] = useState(null);
  const [error, setError] = useState(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Simulamos obtener el perfil del usuario desde el backend
        setProfile({
          id: user.id,
          email: localStorage.getItem('casanova_auth') ? JSON.parse(localStorage.getItem('casanova_auth')).user.email || user.email : user.email,
          fullName: user.fullName,
          role: user.role
        });

        // El estado KYC está en el JWT, pero podríamos obtenerlo de un endpoint
        setKycStatus('NotStarted');
      } catch (err) {
        setError('No se pudo cargar tu perfil.');
      }
    }
    fetchProfile();
  }, [user]);

  if (!profile) {
    return <div className="card">Cargando...</div>;
  }

  return (
    <div>
      <header className="header">
        <div>
          <h1>Mi perfil</h1>
          <p className="small-text">Información de tu cuenta y configuración.</p>
        </div>
        <Link to="/" className="button secondary">Volver</Link>
      </header>

      {error && <div className="alert">{error}</div>}

      <div className="dashboard-grid">
        <div className="card">
          <div className="section-title">
            <h3>Información personal</h3>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <p className="small-text">Nombre completo</p>
              <p><strong>{profile.fullName}</strong></p>
            </div>
            <div>
              <p className="small-text">Correo electrónico</p>
              <p><strong>{profile.email}</strong></p>
            </div>
            <div>
              <p className="small-text">Tipo de cuenta</p>
              <p><strong>{profile.role === 'Owner' ? 'Propietario' : profile.role === 'Admin' ? 'Administrador' : 'Huésped'}</strong></p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">
            <h3>Verificación de identidad</h3>
            <p className="small-text">Requerida para hacer reservas.</p>
          </div>
          {kycStatus === 'Approved' ? (
            <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '8px', color: '#166534' }}>
              ✓ Tu identidad ha sido verificada.
            </div>
          ) : kycStatus === 'Pending' ? (
            <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', color: '#92400e' }}>
              ⏳ Tu verificación está en proceso.
            </div>
          ) : (
            <div>
              <p className="small-text">Verifica tu identidad para hacer reservas.</p>
              <Link to="/kyc" className="button">Verificar identidad</Link>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-title">
          <h3>Sesión</h3>
        </div>
        <button
          className="button"
          style={{ background: '#ef4444', color: 'white' }}
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default UserProfilePage;
