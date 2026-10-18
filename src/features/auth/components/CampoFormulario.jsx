// Campo con etiqueta, ayuda y mensaje en línea (mockups 1.3 y 1.2).
// El error se muestra debajo del campo; "exito" se usa para mensajes como
// "Contraseña segura." o "Las contraseñas coinciden.".
export default function CampoFormulario({ id, etiqueta, error, exito, ayuda, children }) {
  let mensaje = null;
  if (error) {
    mensaje = (
      <small id={`${id}-mensaje`} className="auth-campo__mensaje auth-campo__mensaje--error">
        {error}
      </small>
    );
  } else if (exito) {
    mensaje = (
      <small id={`${id}-mensaje`} className="auth-campo__mensaje auth-campo__mensaje--exito">
        {exito}
      </small>
    );
  } else if (ayuda) {
    mensaje = (
      <small id={`${id}-mensaje`} className="auth-campo__mensaje">
        {ayuda}
      </small>
    );
  }

  return (
    <div className="auth-campo">
      <label htmlFor={id} className="auth-etiqueta">
        {etiqueta}
      </label>
      {children}
      {mensaje}
    </div>
  );
}
