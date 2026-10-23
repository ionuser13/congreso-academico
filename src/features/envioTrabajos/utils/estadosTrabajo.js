// DEP-HU2-estado: valores propuestos. Cambiarlos por los actuales.
export const ETAPAS = {
  ABIERTA: 'recepcion_abierta',
  CERRADA: 'recepcion_cerrada',
  REVISION: 'en_revision',
  PUBLICADA: 'resultados_publicados',
};

export const ESTADOS_VISIBLES = {
  borrador: { etiqueta: 'Borrador', tono: 'gris' },
  enviado: { etiqueta: 'Enviado', tono: 'azul' },
  en_revision: { etiqueta: 'En revisión', tono: 'ambar' },
  aceptado: { etiqueta: 'Aceptado', tono: 'verde' },
  rechazado: { etiqueta: 'Rechazado', tono: 'rojo' },
};

export const ORDEN_FILTROS = ['borrador', 'enviado', 'en_revision', 'aceptado', 'rechazado'];

/**
 * HU-3 solo guarda 'borrador' | 'enviado'. El resto se deriva:
 *  - dictamen: solo existe si la etapa es PUBLICADA (lo garantiza lecturaRevision)
 *  - seguimiento: existe si hay revisores asignados (DEP-HU4/5)
 */
export function estadoVisible(trabajo, etapa, dictamen, seguimiento) {
  if (trabajo.estado === 'borrador') return 'borrador';
  if (etapa === ETAPAS.PUBLICADA && dictamen) return dictamen.decision;
  if (seguimiento) return 'en_revision';
  return 'enviado';
}