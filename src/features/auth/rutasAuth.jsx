import { Route } from 'react-router-dom';
import RutaProtegida from './components/RutaProtegida';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import RegistroExitoPage from './pages/RegistroExitoPage';
import RegistroComitePage from './pages/RegistroComitePage';
import RecuperarContrasenaPage from './pages/RecuperarContrasenaPage';
import MiCuentaPage from './pages/MiCuentaPage';
import AccesoDenegadoPage from './pages/AccesoDenegadoPage';
import NoEncontradaPage from './pages/NoEncontradaPage';

// Rutas de la HU-1. En App.jsx se colocan dentro de <Routes>:
//   <Routes>
//     {rutasAuth}
//     ...rutas de las demás historias...
//     {rutaNoEncontrada}   ← siempre al final
//   </Routes>
export const rutasAuth = (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/registro" element={<RegistroPage />} />
    <Route path="/registro-comite" element={<RegistroComitePage />} />
    <Route path="/registro-comite/:codigo" element={<RegistroComitePage />} />
    <Route path="/recuperar-contrasena" element={<RecuperarContrasenaPage />} />
    <Route path="/recuperar-contrasena/:token" element={<RecuperarContrasenaPage />} />
    <Route path="/acceso-denegado" element={<AccesoDenegadoPage />} />

    <Route element={<RutaProtegida />}>
      <Route path="/registro/exito" element={<RegistroExitoPage />} />
      <Route path="/mi-cuenta" element={<MiCuentaPage />} />
    </Route>
  </>
);

export const rutaNoEncontrada = <Route path="*" element={<NoEncontradaPage />} />;
