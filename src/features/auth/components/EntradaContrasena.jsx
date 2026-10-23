import { useState } from 'react';

// Campo de contraseña con el botón "Mostrar" de los mockups 1.2 y 1.4.
export default function EntradaContrasena({ className = 'auth-entrada', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-contrasena">
      <input {...props} type={visible ? 'text' : 'password'} className={className} />
      <button
        type="button"
        className="auth-contrasena__mostrar"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? 'Ocultar' : 'Mostrar'}
      </button>
    </div>
  );
}
