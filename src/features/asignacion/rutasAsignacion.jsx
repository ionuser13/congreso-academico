import { Route } from 'react-router-dom';
import RutaProtegida from '../auth/components/RutaProtegida';
import TrabajosRecibidosPage from './pages/TrabajosRecibidosPage';
import RevisoresPage from './pages/RevisoresPage';
import SeguimientoPage from './pages/SeguimientoPage';

// Rutas de la HU-4. Las tres coinciden con las que el equipo ya declaró en
// src/components/Navegacion/menuPorRol.js para el rol "comite".
//
// En App.jsx se colocan dentro de <Routes>:
//   <Routes>
//     {rutasAuth}
//     {rutasAsignacion}
//     {rutaNoEncontrada}   ← siempre al final
//   </Routes>
export const rutasAsignacion = (
  <Route element={<RutaProtegida roles={['comite']} />}>
    <Route path="/trabajos-recibidos" element={<TrabajosRecibidosPage />} />
    <Route path="/revisores" element={<RevisoresPage />} />
    <Route path="/seguimiento" element={<SeguimientoPage />} />
  </Route>
);
