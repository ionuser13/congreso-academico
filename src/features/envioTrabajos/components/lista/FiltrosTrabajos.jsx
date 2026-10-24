import { ESTADOS_VISIBLES } from '../../utils/estadosTrabajo';

export default function FiltrosTrabajos({ 
  filtro, 
  total = 0, 
  conteos = {}, 
  estados = [], 
  busqueda = '', 
  onFiltro, 
  onBusqueda 
}) {
  const Pill = ({ k, texto }) => (
    <button 
      type="button" 
      className={`et-pill${filtro === k ? ' et-pill--activa' : ''}`} 
      onClick={() => onFiltro(k)}
    >
      {texto}
    </button>
  );

  return (
    <div className="et-filtros">
      <div className="et-filtros__pills">
        <Pill k="todos" texto={`Todos · ${total}`} />
        {estados.map((e) => {
          const infoEstado = ESTADOS_VISIBLES[e];
          const etiqueta = infoEstado?.etiqueta ?? e;
          const conteo = conteos[e] ?? 0;

          return (
            <Pill 
              key={e} 
              k={e} 
              texto={`${etiqueta} · ${conteo}`} 
            />
          );
        })}
      </div>
      
      <input 
        type="search" 
        className="et-input et-filtros__buscar" 
        placeholder="Buscar por título o código…"
        value={busqueda} 
        onChange={(e) => onBusqueda(e.target.value)} 
        aria-label="Buscar trabajos" 
      />
    </div>
  );
}