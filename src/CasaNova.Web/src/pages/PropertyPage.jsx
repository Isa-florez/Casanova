import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function PropertyPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/properties/${id}`).then(response => setProperty(response.data)).catch(() => setError('No se encontró la propiedad.'));
  }, [id]);

  async function handleBooking(event) {
    event.preventDefault();
    try {
      await api.post('/bookings', { propertyId: id, checkIn, checkOut });
      setMessage('Reserva enviada correctamente.');
      setError(null);
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      const message = backendMessage || 'No se pudo crear la reserva. Asegúrate de estar autenticado y haber verificado tu identidad.';
      setError(message.includes('identidad') || message.includes('KYC')
        ? `${message} Completa tu verificación para continuar.`
        : message);
    }
  }

  async function toggleWishlist() {
    try {
      await api.post('/wishlists/toggle', { propertyId: id });
      setIsInWishlist(!isInWishlist);
    } catch (err) {
      setError('Error al actualizar tus deseos.');
    }
  }

  if (!property) return <div><header className="header"><h1>Cargando...</h1></header><div className="card">Cargando propiedad...</div></div>;

  return (
    <div>
      <header className="header">
        <div>
          <h1>{property.title}</h1>
          <p className="small-text">{property.city} · {property.address}</p>
        </div>
        <div className="header-actions">
          {token && user?.role !== 'Owner' && (
            <button className="button secondary" onClick={toggleWishlist}>
              {isInWishlist ? '♥ En deseos' : '♡ Agregar a deseos'}
            </button>
          )}
          <Link to="/" className="button secondary">Volver</Link>
        </div>
      </header>

      <div className="card property-detail">
        {property.photoUrls?.length > 0 && <img src={property.photoUrls[0]} alt={property.title} />}
        <div>
          <p>{property.description}</p>
          <div className="grid-2">
            <span className="badge">${property.pricePerNight} / noche</span>
            <span className="badge">{property.bedrooms} habitaciones · {property.maxGuests} huéspedes</span>
          </div>
          {token && user?.role !== 'Owner' ? (
            <form onSubmit={handleBooking} className="form-row">
              <div className="grid-2">
                <input className="input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
                <input className="input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required />
              </div>
              <button className="button" type="submit">Reservar</button>
            </form>
          ) : (
            <Link to="/login" className="button">Inicia sesión para reservar</Link>
          )}
          {message && <div className="alert" style={{ background: '#dcfce7', color: '#166534' }}>{message}</div>}
          {error && <div className="alert">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default PropertyPage;
