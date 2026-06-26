import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function OwnerPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  if (!user || user.role !== 'Owner') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    async function fetchProperties() {
      try {
        // El backend busca propiedades del propietario autenticado
        const { data } = await api.get('/properties?onlyMine=true');
        setProperties(data);
      } catch (err) {
        setError('No se pudo cargar tus propiedades.');
      }
    }
    fetchProperties();
  }, []);

  return (
    <div>
      <header className="header">
        <div>
          <h1>Mis propiedades</h1>
          <p className="small-text">Gestiona tus anuncios de alojamiento.</p>
        </div>
        <div className="header-actions">
          <Link to="/" className="button">Nueva propiedad</Link>
          <Link to="/" className="button secondary">Volver</Link>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      {properties.length === 0 ? (
        <div className="card">
          <p className="small-text">No tienes propiedades publicadas aún.</p>
          <Link to="/" className="button">Publicar tu primera propiedad</Link>
        </div>
      ) : (
        <div className="property-list">
          {properties.map(property => (
            <article key={property.id} className="card property-card">
              {property.coverPhotoUrl && <img src={property.coverPhotoUrl} alt={property.title} />}
              <div>
                <div className="badge">{property.city}</div>
                <h2>{property.title}</h2>
                <p>{property.description}</p>
                <p className="small-text">{property.address}</p>
                <p><strong>${property.pricePerNight}</strong> por noche · {property.bedrooms} hab. · {property.maxGuests} huéspedes</p>
                <div className="action-stack">
                  <Link to={`/property/${property.id}`} className="button secondary">Ver</Link>
                  <button className="button secondary">Editar</button>
                  <button className="button secondary" style={{ background: '#fca5a5', color: '#7f1d1d' }}>Eliminar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerPropertiesPage;
