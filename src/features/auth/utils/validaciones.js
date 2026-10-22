// HU-1 — Reglas de validación de los formularios de cuenta.
// En la segunda entrega estas mismas reglas se repiten en el servidor.

export const INSTITUCIONES = [
  'Universidad de Lima',
  'Pontificia Universidad Católica del Perú',
  'Universidad Nacional de Ingeniería',
  'Universidad Nacional Mayor de San Marcos',
  'Universidad del Pacífico',
];

export const CARRERAS = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ingeniería Civil',
  'Ingeniería Mecatrónica',
  'Economía',
  'Administración',
  'Comunicación',
  'Psicología',
];

const DOMINIO_ULIMA = /^[^\s@]+@(aloe\.)?ulima\.edu\.pe$/i;
const DOMINIO_ACADEMICO = /^[^\s@]+@[^\s@]+\.edu(\.pe)?$/i;

export const MENSAJE_CONTRASENA = 'Mínimo 8 caracteres, con una mayúscula y un número.';

export function requisitosContrasena(valor = '') {
  return {
    longitud: valor.length >= 8,
    mayuscula: /[A-ZÁÉÍÓÚÑ]/.test(valor),
    numero: /[0-9]/.test(valor),
  };
}

export function contrasenaValida(valor) {
  const r = requisitosContrasena(valor);
  return r.longitud && r.mayuscula && r.numero;
}

export function validarCorreoInstitucional(correo, institucion) {
  const valor = correo.trim();
  if (!valor) return 'Este campo es obligatorio.';
  if (institucion === 'Universidad de Lima' && !DOMINIO_ULIMA.test(valor)) {
    return 'Use un correo institucional válido (@aloe.ulima.edu.pe).';
  }
  if (!DOMINIO_ACADEMICO.test(valor)) {
    return 'Use el correo institucional de su universidad.';
  }
  return '';
}

export function validarRequerido(valor, mensaje = 'Este campo es obligatorio.') {
  return String(valor ?? '').trim() ? '' : mensaje;
}

export function validarContrasena(valor) {
  if (!valor) return 'Este campo es obligatorio.';
  return contrasenaValida(valor) ? '' : MENSAJE_CONTRASENA;
}

export function validarConfirmacion(confirmacion, contrasena) {
  if (!confirmacion) return 'Este campo es obligatorio.';
  return confirmacion === contrasena ? '' : 'Las contraseñas no coinciden.';
}
