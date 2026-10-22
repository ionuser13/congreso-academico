// Punto de entrada público de la HU-1 para el resto del equipo:
//   import { AuthProvider, useAuth, RutaProtegida } from './features/auth';
export { AuthProvider } from './context/AuthProvider';
export { useAuth } from './hooks/useAuth';
export { default as RutaProtegida } from './components/RutaProtegida';
export { rutasAuth, rutaNoEncontrada } from './rutasAuth';
export { ROLES, tieneRol, vistaPrincipal, ETIQUETA_ROL } from './utils/roles';
