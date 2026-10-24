import edicion from '../../../shared/mocks/edicion.json';
import { ETAPAS } from '../utils/estadosTrabajo';

const CLAVE_ETAPA_DEMO = 'ce2026.etapaDemo'; // solo para pruebas locales
const VALIDAS = Object.values(ETAPAS);

const CRITERIOS_POR_DEFECTO = [
  { id: 301, nombre: 'Originalidad', peso: 25 },
  { id: 302, nombre: 'Rigor metodológico', peso: 30 },
  { id: 303, nombre: 'Claridad', peso: 20 },
  { id: 304, nombre: 'Relevancia', peso: 25 },
];

// DEP-HU2-estado
export function obtenerEtapa() {
  try {
    const demo = localStorage.getItem(CLAVE_ETAPA_DEMO);
    if (VALIDAS.includes(demo)) return demo;
  } catch { /* sin storage */ }
  if (VALIDAS.includes(edicion.estado)) return edicion.estado;
  return ETAPAS.ABIERTA;
}

// DEP-HU2-fechas / DEP-HU2-versionFinal
export function obtenerFechas() {
  const fechasArray = edicion.fechasLimite ?? [];
  const f = fechasArray.reduce(
    (acc, item) => {
        acc[item.id] = `${item.fecha}T${item.hora}`;
        return acc;
    }, {}    
  );

  return {
    cierre: f.cierre ?? f.recepcion ?? null,
    revision: f.revision ?? null,
    publicacion: f.publicacion ?? null,
    versionFinal: f.versionFinal ?? null,
  };
}

export function obtenerTipos() {
  const raw = edicion.tiposTrabajo ?? edicion.tipos ?? [];
  return raw.map((t) => ({
    id: Number(t.id),
    nombre: t.nombre,
    maxCoautores: t.maxCoautores ?? 0,
    admiteCoautores: t.admiteCoautores ?? (t.maxCoautores ?? 0) > 0,
    maxPalabras: t.unidadExtension ?? 'palabras',
    formato: t.formatoEsperado ?? t.formato ?? null,
  }));
}
export const obtenerTipo = (id) => obtenerTipos().find((t) => t.id === Number(id)) ?? null;

export function obtenerEjes() {
  const raw = edicion.ejesTematicos ?? edicion.ejes ?? [];
  return raw.map((e) => ({ id: Number(e.id), nombre: e.nombre, descripcion: e.descripcion, responsable: e.responsable }));
}
export const obtenerEje = (id) => obtenerEjes().find((e) => e.id === Number(id)) ?? null;

export function obtenerCriterios() {
  const raw = edicion.criterios ?? edicion.criteriosEvaluacion ?? [];
  if (!raw.length) return CRITERIOS_POR_DEFECTO;
  return raw.map((c) => ({ id: Number(c.id), nombre: c.nombre, peso: c.pesoPorcentaje ?? c.peso ?? 0 }));
}