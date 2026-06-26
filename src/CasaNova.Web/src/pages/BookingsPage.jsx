import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/bookings')
      .then(response => setBookings(response.data))
      .catch(() => setError('No se pudieron cargar tus reservas.'));
  }, []);

  async function cancelBooking(id) {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(booking => booking.id !== id));
      setError(null);
    } catch {
      setError('Error al cancelar la reserva.');
    }
  }

  return (
    <div>
      <header className="header">
        <div>
          <h1>Mis reservas</h1>
          <p className="small-text">Tus reservas activas y cancelaciones.</p>
        </div>
        <Link to="/" className="button secondary">Buscar propiedades</Link>
      </header>

      {error && <div className="alert">{error}</div>}

      <div className="property-list">
        {bookings.map(booking => (
          <article key={booking.id} className="card property-card">
            <div>
              <h2>{booking.propertyTitle || 'Reserva'}</h2>
              <p className="small-text">Desde {new Date(booking.checkIn).toLocaleDateString()} hasta {new Date(booking.checkOut).toLocaleDateString()}</p>
              <p>{booking.status}</p>
              <button className="button secondary" onClick={() => cancelBooking(booking.id)}>
                Cancelar reserva
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BookingsPage;
