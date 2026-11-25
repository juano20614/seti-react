import { useState } from 'react';

export default function LoginForm({ onLoginSuccess, onBiometricLogin, onAlert }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('pasajero');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAlert(`Cargando cuenta de ${role.toUpperCase()}...`, 'success');

    setTimeout(() => {
      onLoginSuccess({ email, role });
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Correo</label>
        <input
          id="login-email"
          type="text"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-primary">
        Ingresar al Sistema
      </button>

      <button type="button" className="btn-biometric" onClick={onBiometricLogin}>
        <span>📲</span> Acceso por Huella / Rostro
      </button>
    </form>
  );
}