import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import * as authService from '../services/authService';

// Estado global de la sesión. Envuelve toda la app en App.jsx.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => authService.leerSesion());

  const iniciarSesion = useCallback(async (correo, contrasena, recordar) => {
    const datos = await authService.iniciarSesion(correo, contrasena);
    authService.guardarSesion(datos, recordar);
    setUsuario(datos);
    return datos;
  }, []);

  const cerrarSesion = useCallback(() => {
    authService.borrarSesion();
    setUsuario(null);
  }, []);

  // Tras el registro la sesión inicia con el rol elegido (nota del mockup 1.3).
  const registrarParticipante = useCallback(async (datos) => {
    const nuevo = await authService.registrarParticipante(datos);
    authService.guardarSesion(nuevo, false);
    setUsuario(nuevo);
    return nuevo;
  }, []);

  const registrarComite = useCallback(async (codigo, datos) => {
    const nuevo = await authService.registrarComite(codigo, datos);
    authService.guardarSesion(nuevo, false);
    setUsuario(nuevo);
    return nuevo;
  }, []);

  const actualizarCuenta = useCallback(
    async (cambios) => {
      const actualizado = await authService.actualizarCuenta(usuario.id, cambios);
      setUsuario(actualizado);
      return actualizado;
    },
    [usuario]
  );

  const cambiarContrasena = useCallback(
    (actual, nueva) => authService.cambiarContrasena(usuario.id, actual, nueva),
    [usuario]
  );

  const valor = useMemo(
    () => ({
      usuario,
      estaAutenticado: Boolean(usuario),
      iniciarSesion,
      cerrarSesion,
      registrarParticipante,
      registrarComite,
      actualizarCuenta,
      cambiarContrasena,
    }),
    [usuario, iniciarSesion, cerrarSesion, registrarParticipante, registrarComite, actualizarCuenta, cambiarContrasena]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
