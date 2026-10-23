// HU-4 — Acceso a datos y reglas de la asignación de revisiones.
//
// Regla del proyecto: ninguna historia escribe sobre las entidades de otra.
//   - usuarios.json  → dueño HU-1  (solo lectura aquí)
//   - edicion.json   → dueño HU-2  (solo lectura aquí)
//   - trabajos.json  → dueño HU-3  (solo lectura aquí)
//   - revisiones.json → dueño HU-4 (esta historia)
//
// Se usa import.meta.glob igual que en HU-1: si el archivo de otra historia
// todavía no está integrado en dev, la app compila con una lista vacía en vez
// de romper el build.
//
// Nota: ningún contador se guarda en los JSON. La carga por revisor, las
// revisiones vencidas y los totales por trabajo se derivan aquí, para que las
// tres vistas no puedan contradecirse entre sí.

const cargar = (ruta) => {
  const modulos = import.meta.glob('../../../shared/mocks/*.json', {
    eager: true,
    import: 'default',
  });
  const clave = Object.keys(modulos).find((k) => k.endsWith(`/${ruta}`));
  return clave ? modulos[clave] : null;
};

const usuarios = cargar('usuarios.json') ?? [];
const trabajos = cargar('trabajos.json') ?? [];
const edicion = cargar('edicion.json') ?? null;
const revisionesSemilla = cargar('revisiones.json') ?? [];

// Fecha desde la que se calcula el vencimiento.
// Está fija para que la vista sea reproducible y coincida con los mockups del
// curso. Al conectar los servicios web en la entrega 2, cambiar por new Date().
export const FECHA_REFERENCIA = new Date('2026-10-12T00:00:00');

export const ESTADO_TRABAJO = {
  BORRADOR: 'borrador',
  ENVIADO: 'enviado',
  EN_REVISION: 'en_revision',
  ACEPTADO: 'aceptado',
  RECHAZADO: 'rechazado',
};

export const ETIQUETA_ESTADO_TRABAJO = {
  borrador: 'Borrador',
  enviado: 'Enviado',
  en_revision: 'En revisión',
  aceptado: 'Aceptado',
  rechazado: 'Rechazado',
};

export const ESTADO_REVISION = {
  PENDIENTE: 'pendiente',
  ENTREGADA: 'entregada',
  RETIRADA: 'retirada',
};

export const MIN_REVISORES = 2;
export const MAX_REVISORES = 3;

// ---------------------------------------------------------------------------
// Estado en memoria
// ---------------------------------------------------------------------------
// En la entrega 1 no hay base de datos: las asignaciones nuevas viven en
// memoria mientras dure la sesión del navegador. En la entrega 2 esto se
// reemplaza por llamadas al servicio REST, sin tocar los componentes.

let revisiones = revisionesSemilla.map((r) => ({ ...r }));
let siguienteId = revisiones.reduce((max, r) => Math.max(max, r.id), 0) + 1;

const suscriptores = new Set();

// Contador que cambia con cada escritura. Las vistas lo leen con
// useSyncExternalStore para volver a renderizar cuando algo cambia; no sirve
// mirar la cantidad de registros, porque agregar revisores a un trabajo ya
// existente no altera el número de trabajos.
let version = 0;
export const obtenerVersion = () => version;

const notificar = () => {
  version += 1;
  suscriptores.forEach((fn) => fn());
};

export function suscribir(fn) {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

export function formatearFecha(iso) {
  if (!iso) return '';
  const [anio, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

export function diasDeDiferencia(isoFecha, desde = FECHA_REFERENCIA) {
  if (!isoFecha) return 0;
  const limite = new Date(`${isoFecha.slice(0, 10)}T00:00:00`);
  return Math.round((limite - desde) / 86400000);
}

export function estaVencida(revision, desde = FECHA_REFERENCIA) {
  return (
    revision.estado === ESTADO_REVISION.PENDIENTE &&
    diasDeDiferencia(revision.fechaLimite, desde) < 0
  );
}

const nombreCompleto = (u) => (u ? `${u.nombres} ${u.apellidos}`.trim() : '');

const GRADO_POR_ROL = {};
export function nombreVisible(usuario) {
  if (!usuario) return 'Revisor no encontrado';
  return GRADO_POR_ROL[usuario.id] ?? nombreCompleto(usuario);
}

// ---------------------------------------------------------------------------
// Catálogos (leídos de HU-2)
// ---------------------------------------------------------------------------

// Respaldo mientras edicion.json (HU-2) no esté integrado en dev.
// Los IDs son los del contrato de datos acordado por el grupo; en cuanto la
// HU-2 llegue a dev, estas listas se reemplazan solas por las suyas.
const EJES_RESPALDO = [
  { id: 101, nombre: 'Inteligencia artificial y datos' },
  { id: 102, nombre: 'Ingeniería de software' },
  { id: 103, nombre: 'Sostenibilidad y ciudad' },
  { id: 104, nombre: 'Innovación y emprendimiento' },
  { id: 105, nombre: 'Salud y sociedad' },
  { id: 106, nombre: 'Economía y mercados' },
];

const TIPOS_RESPALDO = [
  { id: 201, nombre: 'Artículo completo' },
  { id: 202, nombre: 'Resumen extendido' },
  { id: 203, nombre: 'Póster' },
  { id: 204, nombre: 'Caso de estudio' },
];

export const ejes = edicion?.ejesTematicos?.length ? edicion.ejesTematicos : EJES_RESPALDO;
export const tiposTrabajo = edicion?.tiposTrabajo?.length ? edicion.tiposTrabajo : TIPOS_RESPALDO;

const nombrePorId = (lista, id) => lista.find((x) => x.id === id)?.nombre ?? '—';
export const nombreEje = (id) => nombrePorId(ejes, id);
export const nombreTipo = (id) => nombrePorId(tiposTrabajo, id);

export function fechaLimiteRevision() {
  return edicion?.fechasLimite?.find((f) => f.id === 'revision')?.fecha ?? '2026-10-20';
}

export function estadoEdicion() {
  return edicion?.estadoEtiqueta ?? 'En revisión';
}

// ---------------------------------------------------------------------------
// Consultas
// ---------------------------------------------------------------------------

const activas = () => revisiones.filter((r) => r.estado !== ESTADO_REVISION.RETIRADA);

export function obtenerUsuario(id) {
  return usuarios.find((u) => u.id === id) ?? null;
}

// Los borradores no entran al proceso de revisión: el comité no los ve aquí.
export function obtenerTrabajosRecibidos() {
  return trabajos
    .filter((t) => t.estado !== ESTADO_TRABAJO.BORRADOR)
    .map((t) => {
      const suyas = activas().filter((r) => r.trabajoId === t.id);
      return {
        ...t,
        ejeNombre: nombreEje(t.ejeId),
        tipoNombre: nombreTipo(t.tipoId),
        autorPrincipal: obtenerUsuario(t.autorPrincipalId),
        revisionesAsignadas: suyas.length,
        revisionesEntregadas: suyas.filter((r) => r.estado === ESTADO_REVISION.ENTREGADA).length,
        revisionesVencidas: suyas.filter((r) => estaVencida(r)).length,
      };
    });
}

export function obtenerTrabajo(id) {
  return obtenerTrabajosRecibidos().find((t) => t.id === id) ?? null;
}

export function resumenTrabajos() {
  const lista = obtenerTrabajosRecibidos();
  return {
    enviados: lista.length,
    enRevision: lista.filter((t) => t.estado === ESTADO_TRABAJO.EN_REVISION).length,
    sinRevisores: lista.filter((t) => t.revisionesAsignadas === 0).length,
    conDecision: lista.filter(
      (t) => t.estado === ESTADO_TRABAJO.ACEPTADO || t.estado === ESTADO_TRABAJO.RECHAZADO,
    ).length,
  };
}

export function obtenerRevisores() {
  return usuarios
    .filter((u) => u.rol === 'revisor' || u.rol === 'ambos')
    .map((u) => {
      const suyas = activas().filter((r) => r.revisorId === u.id);
      return {
        ...u,
        nombreCompleto: nombreCompleto(u),
        lineasNombres: (u.lineasInteres ?? []).map(nombreEje),
        asignadas: suyas.length,
        entregadas: suyas.filter((r) => r.estado === ESTADO_REVISION.ENTREGADA).length,
        pendientes: suyas.filter((r) => r.estado === ESTADO_REVISION.PENDIENTE).length,
        vencidas: suyas.filter((r) => estaVencida(r)).length,
      };
    });
}

// Pendientes ordenadas: primero las vencidas, luego por fecha límite ascendente.
export function obtenerSeguimiento() {
  return activas()
    .filter((r) => r.estado === ESTADO_REVISION.PENDIENTE)
    .map((r) => {
      const trabajo = trabajos.find((t) => t.id === r.trabajoId);
      return {
        ...r,
        vencida: estaVencida(r),
        dias: Math.abs(diasDeDiferencia(r.fechaLimite)),
        trabajoCodigo: trabajo?.codigo ?? '—',
        trabajoTitulo: trabajo?.titulo ?? '—',
        revisor: obtenerUsuario(r.revisorId),
      };
    })
    .sort((a, b) => {
      if (a.vencida !== b.vencida) return a.vencida ? -1 : 1;
      return a.fechaLimite.localeCompare(b.fechaLimite);
    });
}

export function totalesRevisiones() {
  const lista = activas();
  return {
    total: lista.length,
    entregadas: lista.filter((r) => r.estado === ESTADO_REVISION.ENTREGADA).length,
    pendientesEnPlazo: lista.filter(
      (r) => r.estado === ESTADO_REVISION.PENDIENTE && !estaVencida(r),
    ).length,
    vencidas: lista.filter((r) => estaVencida(r)).length,
  };
}

// ---------------------------------------------------------------------------
// Conflicto de interés
// ---------------------------------------------------------------------------
// Dos niveles, según el enunciado de la HU-4:
//   coautoria   → bloquea. No se puede asignar de ninguna manera.
//   institucion → advierte. Se puede asignar con justificación del comité.

export const CONFLICTO = { NINGUNO: 'ninguno', COAUTORIA: 'coautoria', INSTITUCION: 'institucion' };

export const ETIQUETA_CONFLICTO = {
  ninguno: 'Sin conflicto',
  coautoria: 'Coautor del trabajo',
  institucion: 'Misma institución',
};

function idsDeAutores(trabajo) {
  const ids = [trabajo.autorPrincipalId];
  (trabajo.coautores ?? []).forEach((c) => {
    if (c.usuarioId != null) ids.push(c.usuarioId);
  });
  return ids.filter((x) => x != null);
}

function institucionesDelTrabajo(trabajo) {
  const autor = obtenerUsuario(trabajo.autorPrincipalId);
  const lista = autor ? [autor.institucion] : [];
  (trabajo.coautores ?? []).forEach((c) => c.institucion && lista.push(c.institucion));
  return lista;
}

export function detectarConflicto(trabajo, revisor) {
  if (!trabajo || !revisor) return CONFLICTO.NINGUNO;
  if (idsDeAutores(trabajo).includes(revisor.id)) return CONFLICTO.COAUTORIA;
  if (institucionesDelTrabajo(trabajo).includes(revisor.institucion)) {
    return CONFLICTO.INSTITUCION;
  }
  return CONFLICTO.NINGUNO;
}

// Revisores candidatos para un trabajo, con su conflicto y su carga.
// Se excluye a quien ya está asignado a ese mismo trabajo.
export function candidatosPara(trabajoId) {
  const trabajo = trabajos.find((t) => t.id === trabajoId);
  if (!trabajo) return [];
  const yaAsignados = activas()
    .filter((r) => r.trabajoId === trabajoId)
    .map((r) => r.revisorId);

  return obtenerRevisores()
    .filter((r) => !yaAsignados.includes(r.id))
    .map((r) => ({ ...r, conflicto: detectarConflicto(trabajo, r) }))
    .sort((a, b) => {
      if (a.conflicto !== b.conflicto) {
        const orden = { ninguno: 0, institucion: 1, coautoria: 2 };
        return orden[a.conflicto] - orden[b.conflicto];
      }
      return a.pendientes - b.pendientes;
    });
}

// ---------------------------------------------------------------------------
// Operaciones de escritura (solo sobre revisiones.json — entidad de la HU-4)
// ---------------------------------------------------------------------------

export function asignarRevisores({ trabajoIds, revisorIds, fechaLimite, justificacion = null }) {
  const creadas = [];
  const omitidas = [];

  trabajoIds.forEach((trabajoId) => {
    const trabajo = trabajos.find((t) => t.id === trabajoId);
    if (!trabajo) return;

    revisorIds.forEach((revisorId) => {
      const revisor = obtenerUsuario(revisorId);
      const conflicto = detectarConflicto(trabajo, revisor);

      // La coautoría nunca se puede saltar, ni en lote.
      if (conflicto === CONFLICTO.COAUTORIA) {
        omitidas.push({ trabajo: trabajo.codigo, revisor: nombreCompleto(revisor), conflicto });
        return;
      }
      // Ya asignado: no se duplica.
      if (activas().some((r) => r.trabajoId === trabajoId && r.revisorId === revisorId)) {
        return;
      }

      creadas.push({
        id: siguienteId++,
        trabajoId,
        revisorId,
        fechaAsignacion: new Date().toISOString().slice(0, 16),
        fechaLimite,
        estado: ESTADO_REVISION.PENDIENTE,
        fechaEntrega: null,
        justificacionConflicto: conflicto === CONFLICTO.INSTITUCION ? justificacion : null,
        reemplazaA: null,
        motivoRetiro: null,
        fechaRetiro: null,
      });
    });
  });

  revisiones = [...revisiones, ...creadas];
  notificar();
  return { creadas: creadas.length, omitidas };
}

// Retiro de un revisor con motivo obligatorio (requisito de la HU-4).
// Si se indica un reemplazo, se crea la nueva asignación enlazada a la retirada.
// Fecha límite sugerida para un reemplazo: si la original ya venció, no tiene
// sentido heredarla (el nuevo revisor nacería con la revisión vencida), así
// que se usa el cierre de la etapa de revisión.
export function fechaLimiteParaReemplazo(fechaLimiteOriginal) {
  const vencida = diasDeDiferencia(fechaLimiteOriginal) < 0;
  return vencida ? fechaLimiteRevision() : fechaLimiteOriginal;
}

export function retirarRevisor({
  revisionId,
  motivo,
  revisorReemplazoId = null,
  fechaLimiteReemplazo = null,
}) {
  const original = revisiones.find((r) => r.id === revisionId);
  if (!original) return { ok: false, error: 'No se encontró la revisión.' };
  if (!motivo || motivo.trim().length < 10) {
    return { ok: false, error: 'El motivo es obligatorio (mínimo 10 caracteres).' };
  }

  original.estado = ESTADO_REVISION.RETIRADA;
  original.motivoRetiro = motivo.trim();
  original.fechaRetiro = new Date().toISOString().slice(0, 16);

  if (revisorReemplazoId != null) {
    const trabajo = trabajos.find((t) => t.id === original.trabajoId);
    const reemplazo = obtenerUsuario(revisorReemplazoId);
    if (detectarConflicto(trabajo, reemplazo) === CONFLICTO.COAUTORIA) {
      return { ok: false, error: 'El revisor de reemplazo es coautor del trabajo.' };
    }
    revisiones.push({
      id: siguienteId++,
      trabajoId: original.trabajoId,
      revisorId: revisorReemplazoId,
      fechaAsignacion: new Date().toISOString().slice(0, 16),
      fechaLimite: fechaLimiteReemplazo ?? fechaLimiteParaReemplazo(original.fechaLimite),
      estado: ESTADO_REVISION.PENDIENTE,
      fechaEntrega: null,
      justificacionConflicto: null,
      reemplazaA: original.id,
      motivoRetiro: null,
      fechaRetiro: null,
    });
  }

  notificar();
  return { ok: true };
}

export function obtenerRevision(id) {
  return revisiones.find((r) => r.id === id) ?? null;
}
