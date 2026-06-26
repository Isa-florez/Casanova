import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function WishlistPage() {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState([]);
  const [error, setError] = useState(null);

  if (!user || user.role === 'Owner') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    async function fetchWishlisted() {
      try {
        const { data } = await api.get('/wishlists');
        setWishlisted(data);
      } catch (err) {
        setError('No se pudo cargar tus propiedades deseadas.');
      }
    }
    fetchWishlisted();
  }, []);

  async function removeFromWishlist(propertyId) {
    try {
      await api.post('/wishlists/toggle', { propertyId });
      setWishlisted(prev => prev.filter(p => p.id !== propertyId));
    } catch {
      setError('Error al actualizar tus deseos.');
    }
  }

  return (
    <div>
      <header className="header">
        <div>
          <h1>Mis propiedades deseadas</h1>
          <p className="small-text">Propiedades que te interesan para futuras reservas.</p>
        </div>
        <Link to="/" className="button secondary">Volver a buscar</Link>
      </header>

      {error && <div className="alert">{error}</div>}

      {wishlisted.length === 0 ? (
        <div className="card">
          <p className="small-text">Aún no tienes propiedades en tu wishlist.</p>
          <Link to="/" className="button">Explorar propiedades</Link>
        </div>
      ) : (
        <div className="property-list">
          {wishlisted.map(property => (
            <article key={property.id} className="card property-card">
              {property.coverPhotoUrl && <img src={property.coverPhotoUrl} alt={property.title} />}
              <div>
                <div className="badge">{property.city}</div>
                <h2>{property.title}</h2>
                <p>{property.description}</p>
                <p className="small-text">{property.address}</p>
                <p><strong>${property.pricePerNight}</strong> por noche · {property.bedrooms} hab. · {property.maxGuests} huéspedes</p>
                <div className="action-stack">
                  <Link to={`/property/${property.id}`} className="button">Ver detalle</Link>
                  <button className="button secondary" onClick={() => removeFromWishlist(property.id)}>Quitar de deseos</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
