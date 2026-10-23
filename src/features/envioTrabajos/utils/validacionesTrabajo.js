import { capitalizar } from './formatos';

export const MAX_RESUMEN = 1500;
export const MIN_PALABRAS = 3;
export const MAX_PALABRAS = 8;

export const esUrlValida = (v = '') => {
  try {
    const u = new URL(v.trim());
    return u.protocol === 'https:' && u.hostname.includes('.');
  } catch { return false; }
};

export const esCorreoValido = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Devuelve { campo: { mensaje, resumen } } — mensaje va junto al campo, resumen en el aviso superior */
export function validarDatosGenerales(v) {
  const e = {};
  if (!v.titulo.trim()) e.titulo = { mensaje: 'Ingrese el título del trabajo.', resumen: 'falta el título' };
  if (!v.tipoId) e.tipoId = { mensaje: 'Debe elegir un tipo de trabajo.', resumen: 'falta el tipo de trabajo' };
  if (!v.ejeId) e.ejeId = { mensaje: 'Debe elegir un eje temático.', resumen: 'falta el eje temático' };
  if (!v.resumen.trim()) {
    e.resumen = { mensaje: 'Ingrese el resumen.', resumen: 'falta el resumen' };
  } else if (v.resumen.length > MAX_RESUMEN) {
    e.resumen = {
      mensaje: `El resumen supera el máximo permitido. Reduzca ${v.resumen.length - MAX_RESUMEN} caracteres.`,
      resumen: 'el resumen supera el máximo de caracteres',
    };
  }
  if (v.palabrasClave.length < MIN_PALABRAS) {
    const f = MIN_PALABRAS - v.palabrasClave.length;
    e.palabrasClave = {
      mensaje: `Agregue al menos ${f === 1 ? 'una palabra clave más' : `${f} palabras clave más`} (mínimo ${MIN_PALABRAS}).`,
      resumen: 'faltan palabras clave',
    };
  }
  if (!v.enlaceDocumento.trim()) {
    e.enlaceDocumento = { mensaje: 'Ingrese el enlace al documento.', resumen: 'falta el enlace al documento' };
  } else if (!esUrlValida(v.enlaceDocumento)) {
    e.enlaceDocumento = {
      mensaje: 'Ingrese una URL completa que empiece con https://',
      resumen: 'el enlace al documento no es una URL válida',
    };
  }
  return e;
}

export function textoResumenErrores(errores) {
  const lista = Object.values(errores).map((x) => x.resumen);
  return capitalizar(lista.join(' · ')) + '.';
}

/** existentes: correos ya usados (incluido el principal). */
export function validarCoautor(c, existentes) {
  const e = {};
  if (!c.nombreCompleto.trim()) e.nombreCompleto = 'Ingrese el nombre completo.';
  if (!c.correo.trim()) e.correo = 'Ingrese el correo.';
  else if (!esCorreoValido(c.correo)) e.correo = 'Ingrese un correo válido.';
  else if (existentes.some((x) => x.trim().toLowerCase() === c.correo.trim().toLowerCase())) {
    e.correo = 'Este correo ya figura entre los coautores del trabajo.';
  }
  if (!c.institucion.trim()) e.institucion = 'Ingrese la institución.';
  return e;
}