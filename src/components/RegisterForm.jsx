import { useState } from 'react';

export default function RegisterForm({ onRegisterSuccess, onAlert }) {
  const [formData, setFormData] = useState({
    name: '',
    doc: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAlert(`¡Cuenta creada con éxito para ${formData.name}! Inicia sesión.`, 'success');

    setTimeout(() => {
      onRegisterSuccess();
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="reg-name">Nombre Completo</label>
        <input
          id="reg-name"
          name="name"
          type="text"
          placeholder="Juan Gómez"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-doc">Documento de Identidad</label>
        <input
          id="reg-doc"
          name="doc"
          type="text"
          placeholder="1094888777"
          value={formData.doc}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-email">Correo Electrónico</label>
        <input
          id="reg-email"
          name="email"
          type="email"
          placeholder="usuario@armenia.gov.co"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-phone">Número de Celular</label>
        <input
          id="reg-phone"
          name="phone"
          type="tel"
          placeholder="3001234567"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-password">Contraseña</label>
        <input
          id="reg-password"
          name="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          minLength={8}
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn-primary">
        Crear Cuenta Pasajero
      </button>
    </form>
  );
}