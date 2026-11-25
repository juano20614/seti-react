import { useEffect, useState } from 'react';
import AuthScreen from './components/AuthScreen';
import DashboardScreen from './components/DashboardScreen';
import RutasScreen from './components/RutasScreen';
import './styles/auth.css';

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [session, setSession] = useState(() => {
    const email = localStorage.getItem('seti_user');
    const role = localStorage.getItem('seti_role');
    return email ? { email, role: role || 'pasajero' } : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem('seti_user', session.email);
      localStorage.setItem('seti_role', session.role);
    } else {
      localStorage.removeItem('seti_user');
      localStorage.removeItem('seti_role');
    }
  }, [session]);

  const handleLogout = () => {
    setSession(null);
    setScreen('dashboard');
  };

  return (
    <div className="mobile-frame">
      <div className="app-header">
        {screen === 'rutas' ? (
          <>
            <div style={{ textAlign: 'left' }}>
              <h1>SETI Armenia</h1>
              <p>Sistema Especializado de Transporte Inteligente</p>
            </div>
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#ffffff',
                color: 'var(--primary-blue)',
                border: 'none',
                borderRadius: '9px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ← Volver
            </button>
          </>
        ) : (
          <>
            <div className="text-header">
              <h1>SETI</h1>
              <p>Sistema Especializado de Transporte Inteligente</p>
            </div>
            <img src="/images/logo.png" alt="Logo SETI" />
          </>
        )}
      </div>

      {!session ? (
        <AuthScreen
          onAuthSuccess={(userData) => {
            setSession(userData);
            setScreen('dashboard');
          }}
        />
      ) : screen === 'rutas' ? (
        <RutasScreen onBack={() => setScreen('dashboard')} />
      ) : (
        <DashboardScreen
          user={session}
          onLogout={handleLogout}
          onOpenRutas={() => setScreen('rutas')}
        />
      )}
    </div>
  );
}