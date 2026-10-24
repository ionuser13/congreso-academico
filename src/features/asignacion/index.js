// Punto de entrada público de la HU-4 para el resto del equipo:
//   import { rutasAsignacion } from './features/asignacion';
//
// La HU-5 puede leer las asignaciones desde aquí para armar la bandeja del
// revisor, sin tocar los archivos internos de esta historia.
export { rutasAsignacion } from './rutasAsignacion';
export {
  obtenerSeguimiento,
  obtenerRevisores,
  obtenerTrabajosRecibidos,
  totalesRevisiones,
  detectarConflicto,
  CONFLICTO,
  ESTADO_REVISION,
  FECHA_REFERENCIA,
  formatearFecha,
  suscribir,
} from './services/asignacionService';
