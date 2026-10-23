// HU-1 — Lectura (solo lectura) de datos que pertenecen a otras historias.
// Según el enunciado, nadie escribe sobre las entidades de otro: aquí solo
// se leen los JSON semilla acordados en el contrato de datos.
//   - edicion.json   → dueño HU-2 (ejes, fechas límite, criterios, estado)
//   - revisiones.json → dueño HU-4/HU-5 (para "Mi actividad" del revisor)
// Se usa import.meta.glob para que la app compile aunque el archivo de otra
// historia todavía no esté integrado en dev.

const edicionMock = import.meta.glob('../../../shared/mocks/edicion.json', {
  eager: true,
  import: 'default',
});
const revisionesMock = import.meta.glob('../../../shared/mocks/revisiones.json', {
  eager: true,
  import: 'default',
});

const edicion = Object.values(edicionMock)[0] ?? null;
const revisiones = Object.values(revisionesMock)[0] ?? null;

// Fechas del evento: no están en edicion.json todavía. Pedir a HU-2 que las
// agregue al contrato (fechaInicioCongreso / fechaFinCongreso).
const DIAS_CONGRESO = { inicio: '2026-11-12', fin: '2026-11-13' };

export function formatearFecha(iso) {
  if (!iso) return '';
  const [anio, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

export function obtenerEdicionPublica() {
  if (!edicion) return null;
  const recepcion = edicion.fechasLimite?.find((f) => f.id === 'recepcion');
  return {
    nombre: edicion.nombre,
    descripcion: edicion.descripcion,
    estado: edicion.estado,
    ejes: edicion.ejesTematicos ?? [],
    fechas: [
      ...(edicion.fechasLimite ?? []).map((f) => ({
        etiqueta: f.etapa,
        valor: formatearFecha(f.fecha),
      })),
      {
        etiqueta: 'Días del congreso',
        valor: `${formatearFecha(DIAS_CONGRESO.inicio)} – ${formatearFecha(DIAS_CONGRESO.fin)}`,
      },
    ],
    criterios: edicion.criteriosEvaluacion ?? [],
    cierreRecepcion: recepcion
      ? { fecha: formatearFecha(recepcion.fecha), hora: recepcion.hora }
      : null,
    diasCongreso: DIAS_CONGRESO,
  };
}

export function obtenerEjesTematicos() {
  return edicion?.ejesTematicos ?? [];
}

// Devuelve null mientras HU-4/HU-5 no publiquen revisiones.json.
// Campos esperados por el contrato: { revisorId, estado: 'pendiente' | 'entregada' }
export function obtenerActividadRevisor(usuarioId) {
  if (!Array.isArray(revisiones)) return null;
  const propias = revisiones.filter((r) => r.revisorId === usuarioId && r.estado !== 'retirada');
  const entregadas = propias.filter((r) => r.estado === 'entregada').length;
  return {
    asignadas: propias.length,
    entregadas,
    pendientes: propias.length - entregadas,
  };
}
