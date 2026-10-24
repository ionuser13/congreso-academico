import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import {
  CONFLICTO,
  ETIQUETA_CONFLICTO,
  MAX_REVISORES,
  MIN_REVISORES,
  candidatosPara,
  detectarConflicto,
  fechaLimiteRevision,
  obtenerTrabajo,
  obtenerRevisores,
  asignarRevisores,
} from '../services/asignacionService';
import Aviso from './Aviso';

// 4.2 — Modal de asignación de revisores.
//
// Sirve para un trabajo o para varios (asignación en lote). Los mockups solo
// dibujan el caso de un trabajo; para el lote se mantiene la misma estructura
// y se evalúa el conflicto contra TODOS los trabajos seleccionados: si un
// revisor es coautor de alguno, queda bloqueado para toda la operación.
export default function ModalAsignar({ trabajoIds, onCerrar, onAsignado }) {
  const enLote = trabajoIds.length > 1;
  const trabajos = useMemo(
    () => trabajoIds.map(obtenerTrabajo).filter(Boolean),
    [trabajoIds],
  );

  const [seleccionados, setSeleccionados] = useState([]);
  const [fechaLimite, setFechaLimite] = useState(fechaLimiteRevision());
  const [justificar, setJustificar] = useState(false);
  const [justificacion, setJustificacion] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Para un solo trabajo se excluye a quien ya está asignado.
  // En lote se parte de todos los revisores y se evalúa el peor conflicto.
  const candidatos = useMemo(() => {
    if (!enLote) return candidatosPara(trabajoIds[0]);
    return obtenerRevisores()
      .map((r) => {
        let peor = CONFLICTO.NINGUNO;
        trabajos.forEach((t) => {
          const c = detectarConflicto(t, r);
          if (c === CONFLICTO.COAUTORIA) peor = CONFLICTO.COAUTORIA;
          else if (c === CONFLICTO.INSTITUCION && peor === CONFLICTO.NINGUNO) {
            peor = CONFLICTO.INSTITUCION;
          }
        });
        return { ...r, conflicto: peor };
      })
      .sort((a, b) => {
        const orden = { ninguno: 0, institucion: 1, coautoria: 2 };
        if (a.conflicto !== b.conflicto) return orden[a.conflicto] - orden[b.conflicto];
        return a.pendientes - b.pendientes;
      });
  }, [enLote, trabajoIds, trabajos]);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return candidatos;
    return candidatos.filter(
      (r) =>
        r.nombreCompleto.toLowerCase().includes(q) ||
        r.institucion.toLowerCase().includes(q) ||
        r.lineasNombres.join(' ').toLowerCase().includes(q),
    );
  }, [candidatos, busqueda]);

  const hayCoautoria = candidatos.some((r) => r.conflicto === CONFLICTO.COAUTORIA);
  const hayInstitucion = candidatos.some((r) => r.conflicto === CONFLICTO.INSTITUCION);

  const elegidos = candidatos.filter((r) => seleccionados.includes(r.id));
  const elegidosConInstitucion = elegidos.filter((r) => r.conflicto === CONFLICTO.INSTITUCION);
  const requiereJustificacion = elegidosConInstitucion.length > 0;

  function alternar(revisor) {
    if (revisor.conflicto === CONFLICTO.COAUTORIA) return; // bloqueado
    setSeleccionados((prev) =>
      prev.includes(revisor.id)
        ? prev.filter((x) => x !== revisor.id)
        : prev.length >= MAX_REVISORES
          ? prev
          : [...prev, revisor.id],
    );
  }

  // Validación del botón: mínimo de revisores y justificación si hace falta.
  let motivoBloqueo = null;
  if (seleccionados.length < MIN_REVISORES) {
    motivoBloqueo = `Seleccione al menos ${MIN_REVISORES} revisores sin conflicto`;
  } else if (requiereJustificacion && !justificar) {
    motivoBloqueo = 'Confirme la asignación del revisor de la misma institución';
  } else if (requiereJustificacion && justificar && justificacion.trim().length < 10) {
    motivoBloqueo = 'Escriba la justificación del comité (mínimo 10 caracteres)';
  } else if (!fechaLimite) {
    motivoBloqueo = 'Indique la fecha límite de la revisión';
  }

  function confirmar() {
    const resultado = asignarRevisores({
      trabajoIds,
      revisorIds: seleccionados,
      fechaLimite,
      justificacion: requiereJustificacion ? justificacion.trim() : null,
    });
    onAsignado(resultado);
  }

  const subtitulo = enLote
    ? `${trabajos.length} trabajos seleccionados · ${trabajos.map((t) => t.codigo).join(', ')}`
    : trabajos[0]
      ? `${trabajos[0].codigo} · ${trabajos[0].titulo} · ${trabajos[0].ejeNombre}`
      : '';

  return (
    <div className="hu4-capa" role="dialog" aria-modal="true" aria-label="Asignar revisores">
      <div className="hu4-modal">
        <div className="hu4-modal__cabecera">
          <div>
            <h2 className="hu4-modal__titulo">Asignar revisores</h2>
            <p className="hu4-modal__sub">{subtitulo}</p>
          </div>
          <button className="hu4-modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="hu4-modal__cuerpo">
          {(hayCoautoria || hayInstitucion) && (
            <Aviso tipo={hayCoautoria ? 'peligro' : 'alerta'}>
              <strong>Conflicto detectado:</strong>{' '}
              {hayCoautoria && 'hay revisores que son coautores del trabajo. '}
              {hayInstitucion &&
                'hay revisores de la misma institución que el autor; se pueden asignar con justificación del comité. '}
              {hayCoautoria && 'No es posible asignar a un coautor.'}
            </Aviso>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
            <input
              className="hu4-campo"
              style={{ flex: 1, minWidth: 240 }}
              type="search"
              placeholder="Buscar revisor por nombre, institución o línea de interés…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="hu4__auxiliar" style={{ margin: 0, whiteSpace: 'nowrap' }}>
              Mínimo {MIN_REVISORES} · máximo {MAX_REVISORES} revisores
            </span>
          </div>

          <div className="hu4-tabla-caja">
            <table className="hu4-tabla">
              <thead>
                <tr>
                  <th style={{ width: 32 }} aria-label="Selección" />
                  <th>Revisor</th>
                  <th style={{ width: 220 }}>Líneas de interés</th>
                  <th style={{ width: 120 }}>Carga actual</th>
                  <th style={{ width: 150 }}>Conflicto</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((r) => {
                  const marcado = seleccionados.includes(r.id);
                  const bloqueado = r.conflicto === CONFLICTO.COAUTORIA;
                  const topeAlcanzado = !marcado && seleccionados.length >= MAX_REVISORES;
                  return (
                    <tr
                      key={r.id}
                      className={
                        marcado
                          ? 'seleccionada'
                          : r.conflicto !== CONFLICTO.NINGUNO
                            ? `hu4-fila-conflicto--${r.conflicto}`
                            : ''
                      }
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={marcado}
                          disabled={bloqueado || topeAlcanzado}
                          onChange={() => alternar(r)}
                          aria-label={`Seleccionar a ${r.nombreCompleto}`}
                        />
                      </td>
                      <td className="hu4-tabla__titulo">{r.nombreCompleto}</td>
                      <td>{r.lineasNombres.join(' · ') || '—'}</td>
                      <td>
                        {r.pendientes} pendiente{r.pendientes === 1 ? '' : 's'}
                        <span className="hu4__auxiliar"> · {r.asignadas} en total</span>
                      </td>
                      <td
                        className={
                          r.conflicto === CONFLICTO.COAUTORIA
                            ? 'hu4-error'
                            : r.conflicto === CONFLICTO.INSTITUCION
                              ? 'hu4-alerta'
                              : 'hu4-ok'
                        }
                      >
                        {ETIQUETA_CONFLICTO[r.conflicto]}
                      </td>
                    </tr>
                  );
                })}
                {visibles.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      Ningún revisor coincide con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="hu4-campo-bloque">
            <span className="hu4__etiqueta">Fecha límite de la revisión</span>
            <input
              className="hu4-campo"
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              style={{ width: 200 }}
            />
          </div>

          {requiereJustificacion && (
            <>
              <label className="hu4-casilla">
                <input
                  type="checkbox"
                  checked={justificar}
                  onChange={(e) => setJustificar(e.target.checked)}
                />
                <span>
                  Asignar de todos modos a{' '}
                  {elegidosConInstitucion.map((r) => r.nombreCompleto).join(', ')} pese a pertenecer
                  a la misma institución (requiere justificación del comité).
                </span>
              </label>
              {justificar && (
                <div className="hu4-campo-bloque">
                  <span className="hu4__etiqueta">Justificación del comité</span>
                  <textarea
                    className="hu4-textarea"
                    value={justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    placeholder="Explique por qué se acepta este revisor pese al conflicto de institución."
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="hu4-modal__pie">
          <span className={motivoBloqueo ? 'hu4-error' : 'hu4__auxiliar'} style={{ margin: 0 }}>
            {motivoBloqueo ?? `${seleccionados.length} revisores seleccionados`}
          </span>
          <div className="hu4__acciones">
            <button className="hu4-btn hu4-btn--secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button
              className="hu4-btn hu4-btn--primario"
              disabled={Boolean(motivoBloqueo)}
              onClick={confirmar}
            >
              Asignar y notificar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
