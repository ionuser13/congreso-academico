import seed from '../../../shared/mocks/trabajos.json';
import { obtenerEtapa, obtenerTipo } from './lecturaEdicion';
import { ETAPAS } from '../utils/estadosTrabajo';
import { estaCompleto, puedeVer } from '../utils/reglasTrabajo';

const KEY = 'ce2026.trabajos.v1';

function leer() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignorar */ }
  return JSON.parse(JSON.stringify(seed));
}

function escribir(lista) {
  try { localStorage.setItem(KEY, JSON.stringify(lista)); } catch { /* ignorar */ }
}

const pausa = () => Promise.resolve();

function siguienteId(lista) {
  // Basado en el formato de código 'TRB-2026-XXX' de la nueva mock data
  const max = lista.reduce((m, t) => {
    const match = t.codigo?.match(/(\d+)$/);
    return match ? Math.max(m, Number(match[1])) : Math.max(m, Number(t.id ?? 0));
  }, 0);
  
  const siguienteNum = max + 1;
  return {
    id: lista.length > 0 ? Math.max(...lista.map(t => Number(t.id) || 0)) + 1 : 1,
    codigo: `TRB-2026-${String(siguienteNum).padStart(3, '0')}`
  };
}

function normalizar(d) {
  const o = { ...d };
  if ('tipoId' in o) o.tipoId = o.tipoId === '' || o.tipoId == null ? null : Number(o.tipoId);
  if ('ejeId' in o) o.ejeId = o.ejeId === '' || o.ejeId == null ? null : Number(o.ejeId);
  return o;
}

function exigirAbierta() {
  if (obtenerEtapa() !== ETAPAS.ABIERTA) throw new Error('La recepción ya cerró: el trabajo no admite cambios.');
}

/* ---------- lecturas (síncronas) ---------- */
export const listarTrabajos = () => leer();
export const obtenerTrabajo = (id) => leer().find((t) => Number(t.id) === Number(id)) ?? null;
export const listarTrabajosDe = (usuario) => {
  if (!usuario) return [];
  const todos = leer();
  return todos.filter((t) => puedeVer(t, usuario));
};

/* ---------- escrituras (Promesas) ---------- */
export async function crearTrabajo(datos, usuario) {
  await pausa();
  exigirAbierta();
  const lista = leer();
  const { id: nuevoId, codigo: nuevoCodigo } = siguienteId(lista);
  const ahora = new Date().toISOString();

  const nuevo = {
    id: nuevoId,
    codigo: nuevoCodigo,
    titulo: '',
    resumen: '',
    ejeId: null,
    tipoId: null,
    palabrasClave: [],
    enlaceDocumento: '',
    estado: 'borrador',
    fechaEnvio: null,
    autorPrincipalId: usuario?.id ?? null,
    coautores: [],
    // Propiedades auxiliares de compatibilidad para validaciones de reglasTrabajo si aplican
    correspondencia: usuario?.correo ?? '',
    correspondenciaConfirmada: false,
    ...normalizar(datos),
  };

  escribir([...lista, nuevo]);
  return nuevo;
}

export async function actualizarTrabajo(id, cambios) {
  await pausa();
  exigirAbierta();
  const lista = leer();
  const i = lista.findIndex((t) => Number(t.id) === Number(id));
  if (i < 0) throw new Error('Trabajo no encontrado.');
  
  lista[i] = { 
    ...lista[i], 
    ...normalizar(cambios)
  };
  
  escribir(lista);
  return lista[i];
}

export async function enviarTrabajo(id) {
  await pausa();
  exigirAbierta();
  const lista = leer();
  const i = lista.findIndex((t) => Number(t.id) === Number(id));
  if (i < 0) throw new Error('Trabajo no encontrado.');
  
  const t = lista[i];
  if (!estaCompleto(t)) throw new Error('El trabajo está incompleto: revise la lista de verificación.');
  
  const tipo = obtenerTipo(t.tipoId);
  if (tipo && t.coautores.length > (tipo.maxCoautores ?? 0)) {
    throw new Error('El trabajo supera el máximo de coautores de su tipo.');
  }
  
  const ahora = new Date().toISOString();
  // Formato de fecha en la nueva mock: 'YYYY-MM-DDTHH:mm'
  const fechaFormateada = ahora.slice(0, 16); 

  lista[i] = { 
    ...t, 
    estado: 'enviado', 
    fechaEnvio: fechaFormateada 
  };
  
  escribir(lista);
  return lista[i];
}

/** Solo desarrollo: restaura la semilla */
export function reiniciarDatos() {
  try { localStorage.removeItem(KEY); } catch { /* ignorar */ }
}