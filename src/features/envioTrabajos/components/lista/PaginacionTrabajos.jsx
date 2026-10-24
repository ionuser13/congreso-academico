export default function PaginacionTrabajos({ mostrando, total, pagina, totalPaginas, onPagina }) {
  return (
    <div className="et-pag">
      <span className="et-suave">Mostrando {mostrando} de {total} trabajos</span>
      <div className="et-pag__botones">
        <button type="button" className="et-pill" disabled={pagina <= 1} onClick={() => onPagina(pagina - 1)}>Anterior</button>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" className={`et-pill${n === pagina ? ' et-pill--activa' : ''}`} onClick={() => onPagina(n)}>{n}</button>
        ))}
        <button type="button" className="et-pill" disabled={pagina >= totalPaginas} onClick={() => onPagina(pagina + 1)}>Siguiente</button>
      </div>
    </div>
  );
}