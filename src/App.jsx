import { BrowserRouter, Routes } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Navegacion from './components/Navegacion/Navegacion.jsx'
import PiePagina from './components/PiePagina/PiePagina.jsx'
import { AuthProvider, rutasAuth, rutaNoEncontrada } from './features/auth'
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

          {/* Rutas de las demás historias (HU-2 a HU-5) */}

          {/* 404: siempre al final */}
          {rutaNoEncontrada}
        </Routes>
        <PiePagina />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
