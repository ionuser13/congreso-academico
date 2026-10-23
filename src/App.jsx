import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Navegacion from './components/Navegacion/Navegacion.jsx'
import PiePagina from './components/PiePagina/PiePagina.jsx'
import { AuthProvider, RutaProtegida, rutasAuth, rutaNoEncontrada } from './features/auth'
import ConfiguracionEdicionPage from './features/configuracion/pages/ConfiguracionEdicionPage'
import RevisionDictamen from './features/revision/pages/RevisionDictamen/RevisionDictamen'
import ConsolidadoTrabajo from './features/revision/pages/ConsolidadoTrabajo/ConsolidadoTrabajo'
import { rutasAsignacion } from './features/asignacion'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Navegacion />
        <Routes>
          {/* HU-1 — Cuenta y acceso */}
          {rutasAuth}

          {/* HU-2 — Configuración de la edición (solo comité) */}
          <Route element={<RutaProtegida roles={['comite']} />}>
            <Route path="/configuracion" element={<ConfiguracionEdicionPage />} />
          </Route>

          {/* HU-5 — Revisión y dictamen */}
          <Route element={<RutaProtegida roles={['revisor', 'ambos']} />}>
            <Route path="/bandeja" element={<RevisionDictamen />} />
          </Route>

          <Route element={<RutaProtegida roles={['comite']} />}>
            <Route path="/trabajos-recibidos/:id/consolidado" element={<ConsolidadoTrabajo />} />
          </Route>

          {/* HU-4 — Asignación de revisiones (solo comité) */}
          {rutasAsignacion}

          {/* Rutas de las demás historias (HU-3 y HU-6) */}

          {/* 404: siempre al final */}
          {rutaNoEncontrada}
        </Routes>
        <PiePagina />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App