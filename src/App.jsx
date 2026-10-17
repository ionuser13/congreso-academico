import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConfiguracionEdicionPage from './features/configuracion/ConfiguracionEdicionPage';
import Header from './components/Header/Header.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* El Header global que hizo tu compañero */}
      <Header />
      
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