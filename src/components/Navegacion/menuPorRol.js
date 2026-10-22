// Enlaces de la barra de navegación por rol (mockups, página 4 y cabecera de
// cada vista). Las rutas deben coincidir con las que cada historia registra
// en App.jsx; si alguien cambia una ruta, la actualiza aquí.
//   "seccion" = ancla dentro de la landing (se hace scroll en vez de navegar).

const INICIO = { etiqueta: 'Inicio', ruta: '/' };
const MI_CUENTA = { etiqueta: 'Mi cuenta', ruta: '/mi-cuenta' };                 // HU-1

const AUTOR = [
  { etiqueta: 'Nuevo trabajo', ruta: '/trabajos/nuevo' },                         // HU-3
  { etiqueta: 'Mis trabajos', ruta: '/mis-trabajos' },                            // HU-3
  { etiqueta: 'Mi presentación', ruta: '/mi-presentacion' },                      // HU-6
];

const REVISOR = [{ etiqueta: 'Mi bandeja', ruta: '/bandeja' }];                  // HU-5

export const MENU_POR_ROL = {
  visitante: [
    INICIO,
    { etiqueta: 'Bases del congreso', ruta: '/', seccion: 'bases' },
    { etiqueta: 'Ejes temáticos', ruta: '/', seccion: 'ejes' },
    { etiqueta: 'Programa', ruta: '/programa' },                                  // HU-6
  ],
  autor: [INICIO, ...AUTOR, MI_CUENTA],
  revisor: [INICIO, ...REVISOR, MI_CUENTA],
  ambos: [INICIO, ...AUTOR, ...REVISOR, MI_CUENTA],
  comite: [
    { etiqueta: 'Configuración', ruta: '/configuracion' },                        // HU-2
    { etiqueta: 'Trabajos recibidos', ruta: '/trabajos-recibidos' },              // HU-4
    { etiqueta: 'Revisores', ruta: '/revisores' },                                // HU-4
    { etiqueta: 'Seguimiento', ruta: '/seguimiento' },                            // HU-4
    { etiqueta: 'Programa', ruta: '/comite/programa' },                           // HU-6
    { etiqueta: 'Tablero', ruta: '/tablero' },                                    // HU-7
    { etiqueta: 'Usuarios', ruta: '/usuarios' },                                  // HU-7
  ],
};

export const ROL_VISIBLE = {
  autor: 'Autor',
  revisor: 'Revisor',
  ambos: 'Autor y revisor',
  comite: 'Comité organizador',
};
