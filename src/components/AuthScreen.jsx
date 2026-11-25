import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthScreen({ onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login');
  const [alert, setAlert] = useState(null);

  const triggerAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
    setAlert(null);
  };

  const handleBiometricLogin = () => {
    triggerAlert('Escaneando huella / rostros del smartphone...', 'success');

    setTimeout(() => {
      triggerAlert('Verificación biométrica aprobada.', 'success');
      setTimeout(() => {
        onAuthSuccess({
          email: 'pasajero_movil@armenia.gov.co',
          role: 'pasajero',
        });
      }, 500);
    }, 800);
  };

  return (
    <>
      <div className="tab-buttons" id="tab-container">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('login')}
        >
          Ingresar
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => handleSwitchTab('register')}
        >
          Registrarse
        </button>
      </div>

      <div className="screen-content">
        {alert && (
          <div className={`alert-message alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        {activeTab === 'login' ? (
          <LoginForm
            onLoginSuccess={onAuthSuccess}
            onBiometricLogin={handleBiometricLogin}
            onAlert={triggerAlert}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={() => handleSwitchTab('login')}
            onAlert={triggerAlert}
          />
        )}
      </div>
    </>
  );
}