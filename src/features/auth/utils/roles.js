// HU-1 — Roles del sistema y vista principal de cada uno.
// Las rutas de destino pertenecen a otras historias; deben coincidir con las
// que cada integrante registre en App.jsx.

export const ROLES = {
  AUTOR: 'autor',
  REVISOR: 'revisor',
  AMBOS: 'ambos',
  COMITE: 'comite',
};

export const ETIQUETA_ROL = {
  autor: 'Autor',
  revisor: 'Revisor',
  ambos: 'Autor y revisor',
  comite: 'Comité',
};

const VISTA_PRINCIPAL = {
  autor: { ruta: '/mis-trabajos', etiqueta: 'Volver a mis trabajos' },      // HU-3
  ambos: { ruta: '/mis-trabajos', etiqueta: 'Volver a mis trabajos' },      // HU-3
  revisor: { ruta: '/bandeja', etiqueta: 'Volver a mi bandeja' },           // HU-5
  comite: { ruta: '/configuracion', etiqueta: 'Volver a la configuración' }, // HU-2
};

export function vistaPrincipal(usuario) {
  if (!usuario) return { ruta: '/', etiqueta: 'Ir al inicio' };
  return VISTA_PRINCIPAL[usuario.rol] ?? { ruta: '/mi-cuenta', etiqueta: 'Volver a mi cuenta' };
}

// "ambos" cumple tanto el rol autor como el rol revisor.
export function tieneRol(usuario, rolesPermitidos) {
  if (!usuario) return false;
  if (!rolesPermitidos || rolesPermitidos.length === 0) return true;
  if (rolesPermitidos.includes(usuario.rol)) return true;
  return (
    usuario.rol === ROLES.AMBOS &&
    (rolesPermitidos.includes(ROLES.AUTOR) || rolesPermitidos.includes(ROLES.REVISOR))
  );
}

export const esRevisor = (usuario) => tieneRol(usuario, [ROLES.REVISOR]);
export const esAutor = (usuario) => tieneRol(usuario, [ROLES.AUTOR]);
