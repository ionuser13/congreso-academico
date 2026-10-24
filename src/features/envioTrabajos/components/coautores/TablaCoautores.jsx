export default function TablaCoautores({ principal, coautores, correspondencia, usuarioCorreo, editando, onMarcar, onEditar }) {
  const esCorr = (correo) => correo.toLowerCase() === correspondencia.toLowerCase();
  const esUsted = (correo) => correo.toLowerCase() === (usuarioCorreo || '').toLowerCase();

  const Fila = ({ p, i, principalFila }) => (
    <div className={`et-tabla__fila${esCorr(p.correo) ? ' et-tabla__fila--corr' : ''}${editando === i && !principalFila ? ' et-tabla__fila--edit' : ''}`} role="row">
      <span role="cell" className="et-tabla__nombre">{p.nombreCompleto}</span>
      <span role="cell" className="et-tabla__suave">{p.correo}</span>
      <span role="cell">{p.institucion}</span>
      <span role="cell" className="et-tabla__corr">
        {esCorr(p.correo) ? (
          <strong className="et-tabla__marca">Autor de correspondencia</strong>
        ) : (
          <label className="et-tabla__radio">
            <input type="radio" name="correspondencia" checked={false} onChange={() => onMarcar(p.correo)} /> Marcar
          </label>
        )}
        {principalFila
          ? (esUsted(p.correo) && <span className="et-tabla__suave">Usted</span>)
          : <button type="button" className="et-enlace" onClick={() => onEditar(i)}>Editar</button>}
      </span>
    </div>
  );

  return (
    <div role="table" className="et-tabla">
      <div className="et-tabla__cab et-label" role="row">
        <span>Nombre completo</span><span>Correo</span><span>Institución</span><span>Correspondencia</span>
      </div>
      <Fila p={principal} principalFila />
      {coautores.map((c, i) => <Fila key={c.correo} p={c} i={i} />)}
    </div>
  );
}