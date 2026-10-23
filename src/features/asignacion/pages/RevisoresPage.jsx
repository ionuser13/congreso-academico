import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  ejes,
  obtenerRevisores,
  obtenerVersion,
  suscribir,
  totalesRevisiones,
} from '../services/asignacionService';
import EstadoVacio from '../components/EstadoVacio';
import '../asignacion.css';

const SIN_FILTRO = 'todas';

// 4.3 — Listado de revisores con sus líneas de interés y su carga actual.
// Ningún contador se guarda: todos se derivan de revisiones.json.
export default function RevisoresPage() {
  useSyncExternalStore(suscribir, obtenerVersion);

  const [linea, setLinea] = useState(SIN_FILTRO);
  const [institucion, setInstitucion] = useState(SIN_FILTRO);
  const [soloVencidas, setSoloVencidas] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const revisores = obtenerRevisores();
  const totales = totalesRevisiones();

  const instituciones = useMemo(
    () => [...new Set(revisores.map((r) => r.institucion))].sort(),
    [revisores],
  );

  const conVencidas = revisores.filter((r) => r.vencidas > 0).length;

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return revisores.filter((r) => {
      if (linea !== SIN_FILTRO && !(r.lineasInteres ?? []).includes(Number(linea))) return false;
      if (institucion !== SIN_FILTRO && r.institucion !== institucion) return false;
      if (soloVencidas && r.vencidas === 0) return false;
      if (!q) return true;
      return (
        r.nombreCompleto.toLowerCase().includes(q) ||
        r.institucion.toLowerCase().includes(q) ||
        r.correo.toLowerCase().includes(q)
      );
    });
  }, [revisores, linea, institucion, soloVencidas, busqueda]);

  return (
    <main className="hu4">
      <div className="hu4__encabezado">
        <div>
          <h1 className="hu4__titulo">Revisores</h1>
          <p className="hu4__auxiliar">
            {revisores.length} revisores registrados · {totales.total} revisiones asignadas ·{' '}
            {totales.vencidas} vencidas
          </p>
        </div>
      </div>

      <div className="hu4-filtros">
        <select className="hu4-select" value={linea} onChange={(e) => setLinea(e.target.value)} aria-label="Filtrar por línea">
          <option value={SIN_FILTRO}>Línea: todas</option>
          {ejes.map((e) => (
            <option key={e.id} value={e.id}>Línea: {e.nombre}</option>
          ))}
        </select>
        <select
          className="hu4-select"
          value={institucion}
          onChange={(e) => setInstitucion(e.target.value)}
          aria-label="Filtrar por institución"
        >
          <option value={SIN_FILTRO}>Institución: todas</option>
          {instituciones.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
        <button
          className="hu4-chip"
          onClick={() => setSoloVencidas((v) => !v)}
          style={soloVencidas ? { background: 'var(--color-primary)', color: '#fff' } : undefined}
        >
          Con revisiones vencidas · {conVencidas}
        </button>
        <input
          className="hu4-campo hu4-buscador"
          type="search"
          placeholder="Buscar revisor…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {filtrados.length === 0 ? (
        <EstadoVacio
          titulo="Ningún revisor coincide con los filtros"
          texto="Prueba quitando algún filtro o cambiando el texto de búsqueda."
        />
      ) : (
        <div className="hu4-tabla-caja">
          <table className="hu4-tabla">
            <thead>
              <tr>
                <th>Revisor</th>
                <th style={{ width: 230 }}>Institución</th>
                <th style={{ width: 240 }}>Líneas de interés</th>
                <th style={{ width: 100 }} className="num">Asignadas</th>
                <th style={{ width: 100 }} className="num">Entregadas</th>
                <th style={{ width: 90 }} className="num">Vencidas</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((r) => (
                <tr key={r.id}>
                  <td className="hu4-tabla__titulo">
                    {r.nombreCompleto}
                    <div className="hu4__auxiliar">{r.correo}</div>
                  </td>
                  <td>{r.institucion}</td>
                  <td>{r.lineasNombres.join(' · ') || '—'}</td>
                  <td className="num">{r.asignadas}</td>
                  <td className="num hu4-ok">{r.entregadas}</td>
                  <td className={`num ${r.vencidas > 0 ? 'hu4-error' : ''}`}>{r.vencidas}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="hu4-pie-tabla">
            <span>Mostrando {filtrados.length} de {revisores.length} revisores</span>
          </div>
        </div>
      )}
    </main>
  );
}
