/** Envoltorio de etiqueta + control + ayuda/error. El control va como children. */
export default function CampoTexto({ id, etiqueta, requerido, error, ayuda, contador, children }) {
  return (
    <div className={`et-campo${error ? ' et-campo--error' : ''}`}>
      <label className="et-label" htmlFor={id}>{etiqueta}{requerido && ' *'}</label>
      {children}
      {(error || ayuda || contador) && (
        <div className="et-campo__pie">
          <span className={error ? 'et-campo__error' : 'et-campo__ayuda'} id={`${id}-msg`}>{error || ayuda}</span>
          {contador && <span className={error ? 'et-campo__error' : 'et-campo__ayuda'}>{contador}</span>}
        </div>
      )}
    </div>
  );
}