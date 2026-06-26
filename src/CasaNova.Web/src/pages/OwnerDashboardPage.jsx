import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function OwnerDashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  if (!user || user.role !== 'Owner') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data } = await api.get('/reports/dashboard');
        setDashboard(data);
      } catch (err) {
        setError('No se pudo cargar el dashboard.');
      }
    }
    fetchDashboard();
  }, []);

  async function exportToExcel() {
    try {
      const response = await api.get('/reports/bookings/export', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reservas.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError('Error al descargar el reporte.');
    }
  }

  if (!dashboard) {
    return (
      <div>
        <header className="header">
          <h1>Panel de propietario</h1>
        </header>
        <div className="card">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div>
          <h1>Panel de propietario</h1>
          <p className="small-text">Resumen de tus propiedades, reservas e ingresos.</p>
        </div>
        <div className="header-actions">
          <button className="button secondary" onClick={exportToExcel}>Descargar reporte</button>
          <Link to="/" className="button secondary">Volver</Link>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-value">{dashboard.totalProperties}</div>
          <div className="stat-label">Propiedades activas</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{dashboard.activeBookings}</div>
          <div className="stat-label">Reservas activas</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{dashboard.totalBookings}</div>
          <div className="stat-label">Total de reservas</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">${dashboard.totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Ingresos totales</div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">
          <h3>Tus propiedades</h3>
          <p className="small-text">Crea, edita o elimina tus anuncios de alojamiento.</p>
        </div>
        <Link to="/" className="button">Crear nueva propiedad</Link>
      </div>

      <div className="card">
        <div className="section-title">
          <h3>Reservas por mes</h3>
        </div>
        <div className="chart-placeholder">
          {dashboard.bookingsByMonth?.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Mes</th>
                  <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Reservas</th>
                  <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.bookingsByMonth.map((month, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px' }}>{month.month}/{month.year}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>{month.count}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>${month.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="small-text">Sin datos disponibles aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardPage;
