import { useState } from 'react';
import '../styles/dashboard.css';

const RUTAS_PROXIMAS_PASAJERO = [
  {
    id: 'ruta-1',
    nombre: 'Puerto Espejo - Uniquindío',
    tiempo: 'Próximo bus en 3 mins (Paradero Uniquindío)',
  },
  {
    id: 'ruta-naranjos',
    nombre: 'Los Naranjos - Unicentro',
    tiempo: 'Próximo bus en 8 mins (Paradero Uniquindío)',
  },
  {
    id: 'ruta-patria',
    nombre: 'La Patria - Hospital San Juan de Dios',
    tiempo: 'Próximo bus en 9 mins (Paradero Uniquindío)',
  },
];

export default function DashboardScreen({ user, onLogout, onOpenRutas }) {
  const [balance, setBalance] = useState(15500);
  const [statusMsg, setStatusMsg] = useState('');

  const role = user?.role || 'pasajero';

  const handleRecharge = () => {
    setBalance((prev) => prev + 5000);
    setStatusMsg('Pasarela PSE activada correctamente (+$5.000 COP).');
  };

  return (
    <div className="screen-content dashboard-screen">
      <h2 className="dashboard-greeting">
        Hola, {user?.email || 'pasajero_movil@armenia.gov.co'}
      </h2>

      <div className="dashboard-profile-row">
        <span>Perfil:</span>
        <span className={`role-badge role-${role}`}>
          {role.toUpperCase()}
        </span>
      </div>

      {statusMsg && (
        <div className="alert-message alert-success">
          {statusMsg}
        </div>
      )}

      {role === 'pasajero' && (
        <div>
          <div className="virtual-card">
            <div className="card-chip">💳 SETI VIRTUAL</div>
            <div className="card-number">4588 •••• •••• 9012</div>
            <div className="card-label">SALDO DISPONIBLE</div>
            <div className="card-balance">
              ${balance.toLocaleString('es-CO')} COP
            </div>
          </div>

          <button
            type="button"
            className="btn-consultar-rutas"
            onClick={onOpenRutas}
          >
            <span>🚌</span> Consultar rutas activas
          </button>

          <div className="rutas-proximas-lista">
            {RUTAS_PROXIMAS_PASAJERO.map((item) => (
              <div
                key={item.id}
                className="ruta-eta-card"
                onClick={onOpenRutas}
              >
                <div className="ruta-eta-nombre">{item.nombre}</div>
                <div className="ruta-eta-tiempo">⏱️ {item.tiempo}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn-recargar-pasaje"
            onClick={handleRecharge}
          >
            Recargar Pasaje Virtual
          </button>
        </div>
      )}

      {role === 'conductor' && (
        <div className="dashboard-role-card">
          <h3 style={{ fontSize: '1rem', color: 'var(--primary-blue)' }}>
            🚌 Terminal de Bus #04
          </h3>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            Validador NFC: <b style={{ color: 'var(--success-green)' }}>Operativo</b>
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            Pasajeros cobrados hoy: <b>142</b>
          </p>
          <button
            type="button"
            className="btn-consultar-rutas"
            style={{ marginTop: '14px', marginBottom: 0 }}
            onClick={onOpenRutas}
          >
            <span>🚌</span> Consultar rutas activas
          </button>
        </div>
      )}

      {role === 'admin' && (
        <div className="dashboard-role-card">
          <h3 style={{ fontSize: '1rem', color: 'var(--primary-blue)' }}>
            ⚙️ Consola de Control Móvil
          </h3>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
            Flota en movimiento: <b>30 Buses</b>
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            Recaudo total del día: <b>$780.000 COP</b>
          </p>
          <button
            type="button"
            className="btn-consultar-rutas"
            style={{ marginTop: '14px', marginBottom: 0 }}
            onClick={onOpenRutas}
          >
            <span>🚌</span> Consultar rutas activas
          </button>
        </div>
      )}

      <button
        type="button"
        className="btn-primary"
        style={{ marginTop: '16px', backgroundColor: '#555555' }}
        onClick={onLogout}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}