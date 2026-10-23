import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  ESTADO_TRABAJO,
  ETIQUETA_ESTADO_TRABAJO,
  ejes,
  obtenerTrabajosRecibidos,
  resumenTrabajos,
  obtenerVersion,
  suscribir,
  tiposTrabajo,
} from '../services/asignacionService';
import BadgeEstado from '../components/BadgeEstado';
import EstadoVacio from '../components/EstadoVacio';
import ModalAsignar from '../components/ModalAsignar';
import Aviso from '../components/Aviso';
import '../asignacion.css';

const SIN_FILTRO = 'todos';

// 4.1 — Trabajos recibidos.
// Filtros por eje, tipo y estado, búsqueda, número de revisiones asignadas
// y selección múltiple para la asignación en lote.
export default function TrabajosRecibidosPage() {
  // Se vuelve a leer del servicio cada vez que cambian las asignaciones.
  useSyncExternalStore(suscribir, obtenerVersion);

  const [eje, setEje] = useState(SIN_FILTRO);
  const [tipo, setTipo] = useState(SIN_FILTRO);
  const [estado, setEstado] = useState(SIN_FILTRO);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const todos = obtenerTrabajosRecibidos();
  const resumen = resumenTrabajos();

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return todos.filter((t) => {
      if (eje !== SIN_FILTRO && t.ejeId !== Number(eje)) return false;
      if (tipo !== SIN_FILTRO && t.tipoId !== Number(tipo)) return false;
      if (estado !== SIN_FILTRO && t.estado !== estado) return false;
      if (!q) return true;
      const autor = t.autorPrincipal
        ? `${t.autorPrincipal.nombres} ${t.autorPrincipal.apellidos}`.toLowerCase()
        : '';
      return (
        t.codigo.toLowerCase().includes(q) ||
        t.titulo.toLowerCase().includes(q) ||
        autor.includes(q)
      );
    });
  }, [todos, eje, tipo, estado, busqueda]);

  const hayFiltros = eje !== SIN_FILTRO || tipo !== SIN_FILTRO || estado !== SIN_FILTRO || busqueda;

  function limpiarFiltros() {
    setEje(SIN_FILTRO);
    setTipo(SIN_FILTRO);
    setEstado(SIN_FILTRO);
    setBusqueda('');
  }

  function alternar(id) {
    setSeleccionados((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  const todosMarcados = filtrados.length > 0 && filtrados.every((t) => seleccionados.includes(t.id));

  function alternarTodos() {
    setSeleccionados(todosMarcados ? [] : filtrados.map((t) => t.id));
  }

  function alAsignar(resultado) {
    setModalAbierto(null);
    setSeleccionados([]);
    const omitidas = resultado.omitidas.length;
    setMensaje({
      tipo: omitidas ? 'alerta' : 'exito',
      texto: omitidas
        ? `Se crearon ${resultado.creadas} asignaciones. Se omitieron ${omitidas} por conflicto de coautoría.`
        : `Se crearon ${resultado.creadas} asignaciones correctamente.`,
    });
  }

  return (
    <main className="hu4">
      <div className="hu4__encabezado">
        <div>
          <h1 className="hu4__titulo">Trabajos recibidos</h1>
          <p className="hu4__auxiliar">
            {todos.length} trabajos en proceso de revisión · {resumen.sinRevisores} sin revisores
            asignados
          </p>
        </div>
        <div className="hu4__acciones">
          <button
            className="hu4-btn hu4-btn--primario"
            disabled={seleccionados.length === 0}
            onClick={() => setModalAbierto(seleccionados)}
          >
            Asignar revisores
            {seleccionados.length > 0 ? ` (${seleccionados.length} seleccionados)` : ''}
          </button>
        </div>
      </div>

      {mensaje && (
        <Aviso
          tipo={mensaje.tipo}
          accion={
            <button className="hu4-btn hu4-btn--enlace" onClick={() => setMensaje(null)}>
              Cerrar
            </button>
          }
        >
          {mensaje.texto}
        </Aviso>
      )}

      <section className="hu4-resumen">
        <div className="hu4-resumen__tarjeta hu4-resumen__tarjeta--enviados">
          <div className="hu4__etiqueta">Enviados</div>
          <div className="hu4-resumen__valor">{resumen.enviados}</div>
        </div>
        <div className="hu4-resumen__tarjeta hu4-resumen__tarjeta--revision">
          <div className="hu4__etiqueta">En revisión</div>
          <div className="hu4-resumen__valor">{resumen.enRevision}</div>
        </div>
        <div className="hu4-resumen__tarjeta hu4-resumen__tarjeta--sin">
          <div className="hu4__etiqueta">Sin revisores</div>
          <div className="hu4-resumen__valor">{resumen.sinRevisores}</div>
        </div>
        <div className="hu4-resumen__tarjeta hu4-resumen__tarjeta--decision">
          <div className="hu4__etiqueta">Con decisión</div>
          <div className="hu4-resumen__valor">{resumen.conDecision}</div>
        </div>
      </section>

      <div className="hu4-filtros">
        <select className="hu4-select" value={eje} onChange={(e) => setEje(e.target.value)} aria-label="Filtrar por eje">
          <option value={SIN_FILTRO}>Eje: todos</option>
          {ejes.map((e) => (
            <option key={e.id} value={e.id}>Eje: {e.nombre}</option>
          ))}
        </select>
        <select className="hu4-select" value={tipo} onChange={(e) => setTipo(e.target.value)} aria-label="Filtrar por tipo">
          <option value={SIN_FILTRO}>Tipo: todos</option>
          {tiposTrabajo.map((t) => (
            <option key={t.id} value={t.id}>Tipo: {t.nombre}</option>
          ))}
        </select>
        <select className="hu4-select" value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Filtrar por estado">
          <option value={SIN_FILTRO}>Estado: todos</option>
          {Object.values(ESTADO_TRABAJO)
            .filter((e) => e !== ESTADO_TRABAJO.BORRADOR)
            .map((e) => (
              <option key={e} value={e}>Estado: {ETIQUETA_ESTADO_TRABAJO[e]}</option>
            ))}
        </select>
        <input
          className="hu4-campo hu4-buscador"
          type="search"
          placeholder="Buscar por código, título o autor…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {hayFiltros && (
        <div className="hu4-chips">
          <span>Filtros activos:</span>
          {eje !== SIN_FILTRO && (
            <button className="hu4-chip" onClick={() => setEje(SIN_FILTRO)}>
              Eje: {ejes.find((x) => x.id === Number(eje))?.nombre} ✕
            </button>
          )}
          {tipo !== SIN_FILTRO && (
            <button className="hu4-chip" onClick={() => setTipo(SIN_FILTRO)}>
              Tipo: {tiposTrabajo.find((x) => x.id === Number(tipo))?.nombre} ✕
            </button>
          )}
          {estado !== SIN_FILTRO && (
            <button className="hu4-chip" onClick={() => setEstado(SIN_FILTRO)}>
              Estado: {ETIQUETA_ESTADO_TRABAJO[estado]} ✕
            </button>
          )}
          {busqueda && (
            <button className="hu4-chip" onClick={() => setBusqueda('')}>
              Búsqueda: “{busqueda}” ✕
            </button>
          )}
          <button className="hu4-btn hu4-btn--enlace" onClick={limpiarFiltros}>
            Limpiar todo
          </button>
        </div>
      )}

      {filtrados.length === 0 ? (
        <EstadoVacio
          titulo={hayFiltros ? 'Ningún trabajo coincide con los filtros' : 'Todavía no hay trabajos enviados'}
          texto={
            hayFiltros
              ? 'Prueba quitando algún filtro o cambiando el texto de búsqueda.'
              : 'Cuando los autores envíen sus trabajos aparecerán aquí para asignar revisores.'
          }
          accion={
            hayFiltros ? (
              <button className="hu4-btn hu4-btn--secundario" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            ) : null
          }
        />
      ) : (
        <div className="hu4-tabla-caja">
          <table className="hu4-tabla">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input
                    type="checkbox"
                    checked={todosMarcados}
                    onChange={alternarTodos}
                    aria-label="Seleccionar todos"
                  />
                </th>
                <th style={{ width: 130 }}>Código</th>
                <th>Título</th>
                <th style={{ width: 180 }}>Eje</th>
                <th style={{ width: 150 }}>Tipo</th>
                <th style={{ width: 160 }}>Revisores</th>
                <th style={{ width: 110 }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((t) => {
                const marcado = seleccionados.includes(t.id);
                return (
                  <tr key={t.id} className={marcado ? 'seleccionada' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={marcado}
                        onChange={() => alternar(t.id)}
                        aria-label={`Seleccionar ${t.codigo}`}
                      />
                    </td>
                    <td className="hu4-tabla__codigo">{t.codigo}</td>
                    <td className="hu4-tabla__titulo">{t.titulo}</td>
                    <td>{t.ejeNombre}</td>
                    <td>{t.tipoNombre}</td>
                    <td>
                      {t.revisionesAsignadas === 0 ? (
                        <span className="hu4-sin-asignar">Sin asignar</span>
                      ) : (
                        <>
                          {t.revisionesAsignadas} asignados · {t.revisionesEntregadas} entregadas
                          {t.revisionesVencidas > 0 && (
                            <span className="hu4-error"> · {t.revisionesVencidas} vencida
                              {t.revisionesVencidas === 1 ? '' : 's'}</span>
                          )}
                        </>
                      )}
                    </td>
                    <td><BadgeEstado estado={t.estado} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="hu4-pie-tabla">
            <span>
              Mostrando {filtrados.length} de {todos.length} trabajos
              {seleccionados.length > 0 ? ` · ${seleccionados.length} seleccionados` : ''}
            </span>
          </div>
        </div>
      )}

      {modalAbierto && (
        <ModalAsignar
          trabajoIds={modalAbierto}
          onCerrar={() => setModalAbierto(null)}
          onAsignado={alAsignar}
        />
      )}
    </main>
  );
}
