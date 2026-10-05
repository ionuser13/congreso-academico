import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConfiguracionEdicionPage from './features/configuracion/ConfiguracionEdicionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HU-2 — Configuración de la edición */}
        <Route path="/configuracion" element={<ConfiguracionEdicionPage />} />

        {/* Redirección por defecto mientras el grupo integra sus rutas */}
        <Route path="*" element={<Navigate to="/configuracion" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;