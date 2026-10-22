// Aviso en línea de éxito o error (color + texto, nunca solo color).
// Si el grupo publica un componente de notificaciones en el módulo
// compartido, reemplazar este por ese.
export default function AvisoAuth({ tipo = 'error', icono = true, children }) {
  return (
    <div className={`auth-aviso auth-aviso--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {icono && (
        <span className="auth-aviso__icono" aria-hidden="true">
          {tipo === 'exito' ? '✓' : '!'}
        </span>
      )}
      <p>{children}</p>
    </div>
  );
}
