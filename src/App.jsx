import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConfiguracionEdicionPage from './features/configuracion/pages/ConfiguracionEdicionPage';
import Header from './components/Header/Header.jsx';
import { usuarioSimulado } from './context/mockAuth'; // Importamos la sesión
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <Routes>
        {/* HU-2 — Configuración de la edición (Protegida) */}
        <Route 
          path="/configuracion" 
          element={
            usuarioSimulado.rol === 'comite' 
              ? <ConfiguracionEdicionPage /> 
              : (
                <div className="acceso-denegado">
                  <h1>No tiene permiso para ver esta página</h1>
                  <p>La configuración es exclusiva del comité organizador.</p>
                </div>
              )
          } 
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/configuracion" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;