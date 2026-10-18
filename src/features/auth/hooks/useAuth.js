import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

// Uso en cualquier historia:
//   const { usuario, cerrarSesion } = useAuth();
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }
  return contexto;
}
