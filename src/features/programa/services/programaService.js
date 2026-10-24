// HU-6 — Servicio del programa del congreso.
// Aquí vive TODA la lógica (reglas, validaciones, filtros) y el acceso a datos.
// Los componentes no leen JSON ni localStorage: llaman a estas funciones.
// En la 2.ª entrega solo se reemplazan las funciones de acceso a datos
// (cargarProgramaGuardado, guardarPrograma, obtenerTrabajosAceptados) por llamadas a la API.
import sesionesSemilla from '../../../shared/mocks/sesiones.json';
import trabajosSemilla from '../../../shared/mocks/programaTrabajos.json';

const CLAVE_PROGRAMA = 'congreso.programa';

export const MINUTOS_POR_TRABAJO = 20;
export const SALAS = ['A-101', 'B-201', 'C-305'];

// ---------- Datos de otras historias (solo lectura) ----------
// Los ejes son de HU-2 (edicion.json). import.meta.glob permite que la app
// compile aunque ese archivo aún no esté integrado en dev (mismo truco que HU-1).
const edicionMock = import.meta.glob('../../../shared/mocks/edicion.json', { eager: true, import: 'default' });
const edicion = Object.values(edicionMock)[0] ?? null;
const EJES_RESPALDO = [
  { id: 101, nombre: 'Inteligencia artificial y datos' },
  { id: 102, nombre: 'Ingeniería de software' },
  { id: 103, nombre: 'Sostenibilidad y ciudad' },
  { id: 104, nombre: 'Innovación y emprendimiento' },
  { id: 105, nombre: 'Salud y sociedad' },
  { id: 106, nombre: 'Economía y mercados' },
];

export function obtenerEjes() {
  const ejes = edicion?.ejesTematicos;
  return Array.isArray(ejes) && ejes.length ? ejes.map(({ id, nombre }) => ({ id, nombre })) : EJES_RESPALDO;
}
export const nombreEje = (ejes, id) => ejes.find((e) => e.id === id)?.nombre ?? 'Sin eje';

// Trabajos con decisión «aceptado». Por ahora salen de programaTrabajos.json.
// Cuando trabajos.json (HU-4/HU-5) tenga trabajos aceptados suficientes, solo se cambia esta función.
export function obtenerTrabajosAceptados() {
  return trabajosSemilla;
}

// ---------- Persistencia en el navegador (sin backend) ----------
export function cargarProgramaGuardado() {
  try {
    const texto = localStorage.getItem(CLAVE_PROGRAMA);
    if (texto) return JSON.parse(texto);
  } catch {
    /* localStorage no disponible o dato dañado: se usa la semilla */
  }
  return programaInicial();
}
export function guardarPrograma(programa) {
  try {
    localStorage.setItem(CLAVE_PROGRAMA, JSON.stringify(programa));
  } catch {
    /* sin almacenamiento: el programa vive solo en memoria */
  }
}
export function programaInicial() {
  return JSON.parse(JSON.stringify(sesionesSemilla));
}
// ---------- Fechas y horas ----------
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const aHora = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
export const formatearFecha = (iso) => (iso ? iso.split('-').reverse().join('/') : '');
export const nombreDia = (iso) => DIAS[new Date(`${iso}T12:00:00`).getDay()];
export const etiquetaDia = (iso) => `${nombreDia(iso)} ${formatearFecha(iso)}`;

// ---------- Reglas del programa ----------
export const capacidad = (sesion) => Math.floor((aMinutos(sesion.horaFin) - aMinutos(sesion.horaInicio)) / MINUTOS_POR_TRABAJO);

// Hora de cada trabajo = inicio de la sesión + 20 min por cada trabajo anterior.
export function horarioTrabajo(sesion, indice) {
  const inicio = aMinutos(sesion.horaInicio) + indice * MINUTOS_POR_TRABAJO;
  return { inicio: aHora(inicio), fin: aHora(inicio + MINUTOS_POR_TRABAJO) };
}

// Dos sesiones chocan si son el mismo día, en la misma sala y sus horas se cruzan.
export function seSolapan(a, b) {
  return a.fecha === b.fecha && a.sala === b.sala && aMinutos(a.horaInicio) < aMinutos(b.horaFin) && aMinutos(b.horaInicio) < aMinutos(a.horaFin);
}
export function paresEnConflicto(sesiones) {
  const pares = [];
  sesiones.forEach((a, i) => sesiones.slice(i + 1).forEach((b) => seSolapan(a, b) && pares.push([a, b])));
  return pares;
}
export function idsEnConflicto(sesiones) {
  return new Set(paresEnConflicto(sesiones).flat().map((s) => s.id));
}

export const ordenarSesiones = (sesiones) =>
  [...sesiones].sort((a, b) => `${a.fecha}${a.horaInicio}${a.sala}`.localeCompare(`${b.fecha}${b.horaInicio}${b.sala}`));
export const fechasDelPrograma = (sesiones) => [...new Set(sesiones.map((s) => s.fecha))].sort();
export const trabajoIdsAsignados = (sesiones) => sesiones.flatMap((s) => s.trabajoIds);
export const trabajosSinSesion = (trabajos, sesiones) => {
  const usados = new Set(trabajoIdsAsignados(sesiones));
  return trabajos.filter((t) => !usados.has(t.id));
};

// Devuelve { campo: 'mensaje' }. Objeto vacío = datos válidos.
export function validarSesion(datos, sesiones, idActual = null) {
  const e = {};
  if (!datos.nombre.trim()) e.nombre = 'Ingrese el nombre de la sesión.';
  if (!datos.ejeId) e.ejeId = 'Seleccione un eje temático.';
  if (!datos.fecha) e.fecha = 'Seleccione la fecha.';
  if (!datos.horaInicio) e.horaInicio = 'Ingrese la hora de inicio.';
  if (!datos.horaFin) e.horaFin = 'Ingrese la hora de fin.';
  if (!datos.sala) e.sala = 'Seleccione la sala.';
  if (!datos.moderador.trim()) e.moderador = 'Ingrese el nombre del moderador.';
  if (datos.horaInicio && datos.horaFin && aMinutos(datos.horaFin) <= aMinutos(datos.horaInicio)) {
    e.horaFin = 'La hora de fin debe ser posterior a la de inicio.';
  }
  if (Object.keys(e).length) return e;
  const choque = sesiones.filter((s) => s.id !== idActual).find((s) => seSolapan(datos, s));
  if (choque) {
    e.sala = `La sala ${datos.sala} ya está ocupada el ${formatearFecha(choque.fecha)} de ${choque.horaInicio} a ${choque.horaFin} por «${choque.nombre}». Elija otra sala u otro horario.`;
  }
  const actual = sesiones.find((s) => s.id === idActual);
  if (actual && actual.trabajoIds.length > capacidad(datos)) {
    e.horaFin = `La sesión ya tiene ${actual.trabajoIds.length} trabajos (20 min c/u). Amplíe el horario.`;
  }
  return e;
}

// Devuelve null si se puede asignar, o el mensaje del problema.
export function validarAsignacion(trabajo, sesion, sesiones, trabajos) {
  if (sesion.trabajoIds.length >= capacidad(sesion)) return 'La sesión no tiene espacios disponibles.';
  if (!trabajo.autorPrincipalId) return null;
  const nuevo = horarioTrabajo(sesion, sesion.trabajoIds.length);
  for (const otra of sesiones.filter((s) => s.fecha === sesion.fecha)) {
    for (const [i, id] of otra.trabajoIds.entries()) {
      const ya = trabajos.find((t) => t.id === id);
      const h = horarioTrabajo(otra, i);
      if (ya?.autorPrincipalId === trabajo.autorPrincipalId && aMinutos(nuevo.inicio) < aMinutos(h.fin) && aMinutos(h.inicio) < aMinutos(nuevo.fin)) {
        return `El autor de este trabajo ya expone «${ya.codigo}» de ${h.inicio} a ${h.fin} ese día. Cambie el orden o elija otra sesión.`;
      }
    }
  }
  return null;
}

// Programa público: filtra por día, eje y sala (eje/sala vacíos = todos).
export function filtrarPrograma(sesiones, { fecha, ejeId, sala }) {
  return ordenarSesiones(sesiones).filter(
    (s) => (!fecha || s.fecha === fecha) && (!ejeId || s.ejeId === Number(ejeId)) && (!sala || s.sala === sala)
  );
}

// Vista del autor: cada trabajo suyo que ya tenga sesión asignada.
export function presentacionesDeAutor(autorId, sesiones, trabajos) {
  const lista = [];
  for (const sesion of ordenarSesiones(sesiones)) {
    sesion.trabajoIds.forEach((id, i) => {
      const trabajo = trabajos.find((t) => t.id === id);
      if (trabajo && trabajo.autorPrincipalId === autorId) {
        lista.push({ trabajo, sesion, orden: i + 1, total: sesion.trabajoIds.length, horario: horarioTrabajo(sesion, i) });
      }
    });
  }
  return lista;
}
