import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tieneRol } from '../utils/roles';
import AccesoDenegadoPage from '../pages/AccesoDenegadoPage';

// Protección de rutas por rol (HU-1).
// - Sin sesión → redirige a /login y, tras ingresar, vuelve a la ruta pedida.
// - Con sesión pero sin el rol → muestra la vista 1.6 Acceso denegado (403).
//
// Uso en App.jsx (otras historias):
//   <Route element={<RutaProtegida roles={['revisor']} />}>
//     <Route path="/bandeja" element={<BandejaPage />} />
//   </Route>
export default function RutaProtegida({ roles, children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (!tieneRol(usuario, roles)) {
    return <AccesoDenegadoPage rolesRequeridos={roles} />;
  }

  return children ?? <Outlet />;
}
