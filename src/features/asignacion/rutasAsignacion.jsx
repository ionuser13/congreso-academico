import { Route } from 'react-router-dom';
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
//
// PENDIENTE DE INTEGRACIÓN: cuando la HU-1 esté en dev, envolver este bloque
// para restringirlo al comité organizador. El cambio son dos líneas:
//
//   import RutaProtegida from '../auth/components/RutaProtegida';
//   ...
//   <Route element={<RutaProtegida roles={['comite']} />}>
//     ...las tres rutas de abajo...
//   </Route>
//
// Hoy no se importa porque la HU-1 todavía no está integrada y el import
// rompería el build de esta rama.
export const rutasAsignacion = (
  <>
    <Route path="/trabajos-recibidos" element={<TrabajosRecibidosPage />} />
    <Route path="/revisores" element={<RevisoresPage />} />
    <Route path="/seguimiento" element={<SeguimientoPage />} />
  </>
);
