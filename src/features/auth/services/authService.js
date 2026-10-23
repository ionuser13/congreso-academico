// HU-1 — Capa de acceso a datos de cuentas.
// Primera entrega: los datos salen del JSON semilla y los cambios se guardan
// en localStorage. En la segunda entrega solo se reemplaza este archivo por
// llamadas fetch a la API REST; los componentes no cambian.
import usuariosSemilla from '../../../shared/mocks/usuarios.json';
import invitacionesSemilla from '../../../shared/mocks/invitacionesComite.json';

const CLAVE_USUARIOS = 'congreso.usuarios';
const CLAVE_INVITACIONES = 'congreso.invitacionesComite';
const CLAVE_INTENTOS = 'congreso.intentosLogin';
const CLAVE_SESION = 'congreso.sesion';

export const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 5;

// Simula la latencia de una API para que la interfaz maneje "Enviando…".
const esperar = (ms = 300) => new Promise((resolver) => setTimeout(resolver, ms));

class ErrorAuth extends Error {
  constructor(codigo, mensaje, extra = {}) {
    super(mensaje);
    this.codigo = codigo;
    Object.assign(this, extra);
  }
}

function leer(clave, porDefecto) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function obtenerUsuarios() {
  return leer(CLAVE_USUARIOS, usuariosSemilla);
}

function guardarUsuarios(usuarios) {
  escribir(CLAVE_USUARIOS, usuarios);
}

function obtenerInvitaciones() {
  return leer(CLAVE_INVITACIONES, invitacionesSemilla);
}

// Nunca se devuelve la contraseña a la interfaz.
function sinContrasena(usuario) {
  const copia = { ...usuario };
  delete copia.contrasena;
  return copia;
}

const normalizarCorreo = (correo) => correo.trim().toLowerCase();

export function existeCorreo(correo) {
  const buscado = normalizarCorreo(correo);
  return obtenerUsuarios().some((u) => u.correo === buscado);
}

function crearUsuario(datos, rol) {
  const usuarios = obtenerUsuarios();
  const nuevo = {
    id: Math.max(0, ...usuarios.map((u) => u.id)) + 1,
    nombres: datos.nombres.trim(),
    apellidos: datos.apellidos.trim(),
    correo: normalizarCorreo(datos.correo),
    contrasena: datos.contrasena,
    institucion: datos.institucion.trim(),
    carrera: (datos.carrera || '').trim(),
    codigoAlumno: (datos.codigoAlumno || '').trim(),
    rol,
    lineasInteres: [],
    estado: 'activo',
    fechaRegistro: new Date().toISOString().slice(0, 10),
  };
  guardarUsuarios([...usuarios, nuevo]);
  return sinContrasena(nuevo);
}

// ---------- Inicio de sesión ----------

export async function iniciarSesion(correo, contrasena) {
  await esperar();
  const buscado = normalizarCorreo(correo);
  const intentos = leer(CLAVE_INTENTOS, {});
  const registro = intentos[buscado] || { fallidos: 0, bloqueadoHasta: null };

  if (registro.bloqueadoHasta && Date.now() < registro.bloqueadoHasta) {
    throw new ErrorAuth(
      'BLOQUEO_TEMPORAL',
      `Superó el número de intentos. Intente nuevamente en ${MINUTOS_BLOQUEO} minutos.`
    );
  }

  const usuario = obtenerUsuarios().find(
    (u) => u.correo === buscado && u.contrasena === contrasena
  );

  if (!usuario) {
    const fallidos = registro.bloqueadoHasta ? 1 : registro.fallidos + 1;
    const restantes = MAX_INTENTOS - fallidos;
    intentos[buscado] = {
      fallidos: restantes <= 0 ? 0 : fallidos,
      bloqueadoHasta: restantes <= 0 ? Date.now() + MINUTOS_BLOQUEO * 60000 : null,
    };
    escribir(CLAVE_INTENTOS, intentos);
    throw new ErrorAuth('CREDENCIALES', 'El correo o la contraseña no son correctos.', {
      restantes: Math.max(restantes, 0),
    });
  }

  if (usuario.estado === 'bloqueado') {
    throw new ErrorAuth(
      'CUENTA_BLOQUEADA',
      'Su cuenta está bloqueada. Escriba al comité organizador para más información.'
    );
  }

  delete intentos[buscado];
  escribir(CLAVE_INTENTOS, intentos);
  return sinContrasena(usuario);
}

// ---------- Sesión ----------
// "Recordarme" guarda la sesión en localStorage; si no, en sessionStorage
// (se pierde al cerrar el navegador).

export function guardarSesion(usuario, recordar) {
  const destino = recordar ? localStorage : sessionStorage;
  const otro = recordar ? sessionStorage : localStorage;
  otro.removeItem(CLAVE_SESION);
  destino.setItem(CLAVE_SESION, JSON.stringify({ id: usuario.id }));
}

export function leerSesion() {
  try {
    const sesion =
      JSON.parse(sessionStorage.getItem(CLAVE_SESION)) ||
      JSON.parse(localStorage.getItem(CLAVE_SESION));
    if (!sesion) return null;
    const usuario = obtenerUsuarios().find((u) => u.id === sesion.id);
    return usuario && usuario.estado === 'activo' ? sinContrasena(usuario) : null;
  } catch {
    return null;
  }
}

export function sesionRecordada() {
  return localStorage.getItem(CLAVE_SESION) !== null;
}

export function borrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem(CLAVE_SESION);
}

// ---------- Registro ----------

export async function registrarParticipante(datos) {
  await esperar();
  if (existeCorreo(datos.correo)) {
    throw new ErrorAuth('CORREO_DUPLICADO', 'Ya existe una cuenta con este correo.');
  }
  return crearUsuario(datos, datos.rol);
}

export async function validarInvitacion(codigo) {
  await esperar(150);
  const invitacion = obtenerInvitaciones().find(
    (i) => i.codigo === codigo.trim().toUpperCase()
  );
  if (!invitacion) {
    throw new ErrorAuth('INVITACION_INVALIDA', 'El código de invitación no existe.');
  }
  if (invitacion.usada) {
    throw new ErrorAuth('INVITACION_USADA', 'Esta invitación ya fue utilizada.');
  }
  if (new Date(`${invitacion.fechaVencimiento}T23:59:59`) < new Date()) {
    throw new ErrorAuth('INVITACION_VENCIDA', 'Esta invitación está vencida. Solicite una nueva al comité.');
  }
  return invitacion;
}

export async function registrarComite(codigo, datos) {
  const invitacion = await validarInvitacion(codigo);
  if (existeCorreo(invitacion.correo)) {
    throw new ErrorAuth('CORREO_DUPLICADO', 'Ya existe una cuenta con este correo.');
  }
  const usuario = crearUsuario({ ...datos, correo: invitacion.correo }, 'comite');
  escribir(
    CLAVE_INVITACIONES,
    obtenerInvitaciones().map((i) =>
      i.codigo === invitacion.codigo ? { ...i, usada: true } : i
    )
  );
  return usuario;
}

// ---------- Mi cuenta ----------

export async function actualizarCuenta(id, cambios) {
  await esperar();
  let actualizado = null;
  const usuarios = obtenerUsuarios().map((u) => {
    if (u.id !== id) return u;
    actualizado = {
      ...u,
      nombres: cambios.nombres.trim(),
      apellidos: cambios.apellidos.trim(),
      institucion: cambios.institucion.trim(),
      lineasInteres: cambios.lineasInteres ?? u.lineasInteres,
    };
    return actualizado;
  });
  if (!actualizado) throw new ErrorAuth('NO_ENCONTRADO', 'No se encontró la cuenta.');
  guardarUsuarios(usuarios);
  return sinContrasena(actualizado);
}

export async function cambiarContrasena(id, actual, nueva) {
  await esperar();
  const usuario = obtenerUsuarios().find((u) => u.id === id);
  if (!usuario || usuario.contrasena !== actual) {
    throw new ErrorAuth('CONTRASENA_ACTUAL', 'La contraseña actual no es correcta.');
  }
  guardarUsuarios(
    obtenerUsuarios().map((u) => (u.id === id ? { ...u, contrasena: nueva } : u))
  );
}

// ---------- Recuperación de contraseña ----------
// No se envían correos reales (fuera del alcance). Se genera un enlace con
// un token que vence en 30 minutos. Por seguridad, la respuesta es la misma
// exista o no el correo.

const CLAVE_TOKENS = 'congreso.tokensRecuperacion';
export const MINUTOS_VIGENCIA_ENLACE = 30;

export async function solicitarRecuperacion(correo) {
  await esperar();
  const buscado = normalizarCorreo(correo);
  const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const tokens = leer(CLAVE_TOKENS, {});
  if (existeCorreo(buscado)) {
    tokens[token] = { correo: buscado, vence: Date.now() + MINUTOS_VIGENCIA_ENLACE * 60000 };
    escribir(CLAVE_TOKENS, tokens);
  }
  // En la segunda entrega el enlace viaja por correo; aquí se devuelve para la simulación.
  return { correo: buscado, enlace: `/recuperar-contrasena/${token}` };
}

export function verificarTokenRecuperacion(token) {
  const registro = leer(CLAVE_TOKENS, {})[token];
  if (!registro || registro.vence < Date.now()) return null;
  return registro.correo;
}

export async function restablecerContrasena(token, nueva) {
  await esperar();
  const correo = verificarTokenRecuperacion(token);
  if (!correo) {
    throw new ErrorAuth('ENLACE_INVALIDO', 'El enlace de recuperación no es válido o ya venció.');
  }
  guardarUsuarios(
    obtenerUsuarios().map((u) => (u.correo === correo ? { ...u, contrasena: nueva } : u))
  );
  const tokens = leer(CLAVE_TOKENS, {});
  delete tokens[token];
  escribir(CLAVE_TOKENS, tokens);
}
