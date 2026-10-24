import { Route } from 'react-router-dom';
import RutaProtegida from '../auth/components/RutaProtegida';
import ProgramaLayout from './components/ProgramaLayout';
import SesionesPage from './pages/SesionesPage';
import AsignarTrabajosPage from './pages/AsignarTrabajosPage';
import ProgramaPublicoPage from './pages/ProgramaPublicoPage';
import MiPresentacionPage from './pages/MiPresentacionPage';

// Rutas de la HU-6. Tres coinciden con las que el equipo ya declaró en
// src/components/Navegacion/menuPorRol.js: /comite/programa (comité), /programa (visitante)
// y /mi-presentacion (autor). La cuarta, /comite/programa/sesion/:idSesion (vista 6.2), es nueva.
//
// En App.jsx se coloca dentro de <Routes>, antes de {rutaNoEncontrada}:
//   {rutasPrograma}
export const rutasPrograma = (
  <Route element={<ProgramaLayout />}>
    {/* Comité: armar sesiones y asignar trabajos */}
    <Route element={<RutaProtegida roles={['comite']} />}>
      <Route path="/comite/programa" element={<SesionesPage />} />
      <Route path="/comite/programa/sesion/:idSesion" element={<AsignarTrabajosPage />} />
    </Route>
    {/* Público: cualquiera puede ver el programa publicado */}
    <Route path="/programa" element={<ProgramaPublicoPage />} />
    {/* Autor (o autor y revisor): su presentación */}
    <Route element={<RutaProtegida roles={['autor', 'ambos']} />}>
      <Route path="/mi-presentacion" element={<MiPresentacionPage />} />
    </Route>
  </Route>
);
