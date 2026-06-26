import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const emptyPropertyForm = {
  title: '',
  description: '',
  city: '',
  address: '',
  pricePerNight: '',
  maxGuests: '',
  bedrooms: ''
};

function HomePage() {
  const [properties, setProperties] = useState([]);
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState(null);
  const [propertyForm, setPropertyForm] = useState(emptyPropertyForm);
  const [propertyMessage, setPropertyMessage] = useState(null);
  const [propertyError, setPropertyError] = useState(null);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(token);
  const isOwner = user?.role === 'Owner' || user?.role === 'Admin';

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const query = new URLSearchParams();
      if (city) query.set('city', city);
      if (checkIn) query.set('checkIn', checkIn);
      if (checkOut) query.set('checkOut', checkOut);
      const { data } = await api.get(`/properties?${query.toString()}`);
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar las propiedades.');
    }
  }

  async function handleCreateProperty(event) {
    event.preventDefault();
    try {
      await api.post('/properties', {
        ...propertyForm,
        pricePerNight: Number(propertyForm.pricePerNight),
        maxGuests: Number(propertyForm.maxGuests),
        bedrooms: Number(propertyForm.bedrooms)
      });
      setPropertyMessage('Tu propiedad se publicó correctamente.');
      setPropertyError(null);
      setPropertyForm(emptyPropertyForm);
      fetchProperties();
    } catch (err) {
      setPropertyError('No se pudo publicar la propiedad. Revisa los datos.');
      setPropertyMessage(null);
    }
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div>
      <header className="header">
        <div>
          <h1>Casa Nova</h1>
          <p className="small-text">Tu espacio para alquilar, reservar y gestionar alojamientos.</p>
        </div>
        <div className="header-actions">
          {isLoggedIn ? (
            <>
              {isOwner && <Link to="/dashboard" className="button secondary">Dashboard</Link>}
              {isOwner && <Link to="/properties" className="button secondary">Mis propiedades</Link>}
              {!isOwner && <Link to="/wishlist" className="button secondary">Deseos</Link>}
              <Link to="/bookings" className="button secondary">Reservas</Link>
              <Link to="/profile" className="button secondary">Perfil</Link>
              <button className="button secondary" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="button secondary">Entrar</Link>
              <Link to="/register" className="button">Crear cuenta</Link>
            </>
          )}
        </div>
      </header>

      <section className="hero card">
        <div>
          <span className="pill">{isLoggedIn ? `Bienvenido${user?.fullName ? `, ${user.fullName}` : ''}` : 'Explora alojamientos'}</span>
          <h2>{isOwner ? 'Panel de propietario' : isLoggedIn ? 'Panel de huésped' : 'Encuentra el alojamiento ideal'}</h2>
          <p className="small-text">
            {isOwner
              ? 'Publica nuevas propiedades, organiza tus anuncios y mantén todo bajo control desde un solo lugar.'
              : isLoggedIn
                ? 'Busca alojamientos, revisa tus reservas y gestiona tus próximas escapadas.'
                : 'Busca por ciudad, fechas y descubre opciones ideales para tu próximo viaje.'}
          </p>
        </div>
      </section>

      {isLoggedIn && (
        <div className="dashboard-grid">
          {isOwner ? (
            <section className="card">
              <div className="section-title">
                <h3>Publica tu propiedad</h3>
                <p className="small-text">Completa los datos para generar un nuevo anuncio.</p>
              </div>
              {propertyMessage && <div className="alert success">{propertyMessage}</div>}
              {propertyError && <div className="alert">{propertyError}</div>}
              <form onSubmit={handleCreateProperty} className="form-row">
                <input className="input" placeholder="Título" value={propertyForm.title} onChange={e => setPropertyForm({ ...propertyForm, title: e.target.value })} required />
                <textarea className="textarea" placeholder="Descripción" rows="3" value={propertyForm.description} onChange={e => setPropertyForm({ ...propertyForm, description: e.target.value })} required />
                <div className="grid-2">
                  <input className="input" placeholder="Ciudad" value={propertyForm.city} onChange={e => setPropertyForm({ ...propertyForm, city: e.target.value })} required />
                  <input className="input" placeholder="Dirección" value={propertyForm.address} onChange={e => setPropertyForm({ ...propertyForm, address: e.target.value })} required />
                </div>
                <div className="grid-2">
                  <input className="input" type="number" min="1" placeholder="Precio por noche" value={propertyForm.pricePerNight} onChange={e => setPropertyForm({ ...propertyForm, pricePerNight: e.target.value })} required />
                  <input className="input" type="number" min="1" placeholder="Máx. huéspedes" value={propertyForm.maxGuests} onChange={e => setPropertyForm({ ...propertyForm, maxGuests: e.target.value })} required />
                </div>
                <input className="input" type="number" min="1" placeholder="Habitaciones" value={propertyForm.bedrooms} onChange={e => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })} required />
                <button className="button" type="submit">Publicar propiedad</button>
              </form>
            </section>
          ) : (
            <section className="card">
              <div className="section-title">
                <h3>Tu próximo viaje</h3>
                <p className="small-text">Revisa tus reservas y deseos guardados.</p>
              </div>
              <div className="action-stack">
                <Link to="/bookings" className="button">Ver reservas</Link>
                <Link to="/wishlist" className="button secondary">Ver deseos</Link>
              </div>
            </section>
          )}

          <section className="card">
            <div className="section-title">
              <h3>Buscar propiedades</h3>
              <p className="small-text">Filtra por ciudad y fechas para encontrar tu mejor opción.</p>
            </div>
            <div className="form-row">
              <div className="grid-2">
                <input className="input" placeholder="Ciudad" value={city} onChange={e => setCity(e.target.value)} />
                <input className="input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
              </div>
              <div className="grid-2">
                <input className="input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                <button className="button" onClick={fetchProperties}>Buscar</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {!isLoggedIn && (
        <section className="card hero-secondary">
          <div className="section-title">
            <h3>¿Qué puedes hacer aquí?</h3>
            <p className="small-text">Crea tu cuenta para reservar, publicar propiedades y gestionar todo desde un panel claro.</p>
          </div>
          <div className="action-stack">
            <Link to="/register" className="button">Crear cuenta</Link>
            <Link to="/login" className="button secondary">Iniciar sesión</Link>
          </div>
        </section>
      )}

      {error && <div className="alert">{error}</div>}

      <div className="property-list">
        {properties.map(property => (
          <article key={property.id} className="card property-card">
            {property.coverPhotoUrl && <img src={property.coverPhotoUrl} alt={property.title} />}
            <div>
              <div className="badge">{property.city}</div>
              <h2>{property.title}</h2>
              <p>{property.description}</p>
              <p className="small-text">{property.address}</p>
              <p><strong>${property.pricePerNight}</strong> por noche · {property.bedrooms} hab.</p>
              <Link to={`/property/${property.id}`} className="button">Ver detalle</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
