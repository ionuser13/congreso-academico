/** tono: exito | ambar | error | rosa. Sirve también como resumen de errores. */
export default function Aviso({ tono = 'rosa', titulo, children, accion, icono }) {
  return (
    <div className={`et-aviso et-aviso--${tono}`} role={tono === 'error' ? 'alert' : 'status'}>
      {icono && <span className="et-aviso__icono" aria-hidden="true">{icono}</span>}
      <div className="et-aviso__cuerpo">
        {titulo && <strong>{titulo} </strong>}
        {children}
      </div>
      {accion && <div className="et-aviso__accion">{accion}</div>}
    </div>
  );
}