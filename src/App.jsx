import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import { rutasAsignacion } from './features/asignacion'
import './App.css'

// NOTA PARA EL EQUIPO (HU-4)
// --------------------------
// En dev, App.jsx todavía no tenía router. Se agrega aquí con la MISMA
// estructura que ya usa la rama hu-1-autenticacion, para que el merge sea
// mecánico: cada historia aporta su bloque de rutas dentro de <Routes>.
//
// Cuando la HU-1 entre a dev, este archivo queda así y se borra la navegación
// provisional de abajo (su Navegacion.jsx la reemplaza):
//
//   <AuthProvider>
//     <Header />
//     <Navegacion />
//     <Routes>
//       {rutasAuth}
//       {rutasAsignacion}
//       {rutaNoEncontrada}
//     </Routes>
//     <PiePagina />
//   </AuthProvider>

// Navegación provisional: solo para poder revisar la HU-4 mientras la HU-1
// no esté integrada. Las rutas son las de menuPorRol.js (rol "comite").
function NavegacionProvisional() {
  const enlaces = [
    { etiqueta: 'Trabajos recibidos', ruta: '/trabajos-recibidos' },
    { etiqueta: 'Revisores', ruta: '/revisores' },
    { etiqueta: 'Seguimiento', ruta: '/seguimiento' },
  ]
  return (
    <nav className="nav-provisional">
      <div className="nav-provisional__interior">
        {enlaces.map((e) => (
          <NavLink
            key={e.ruta}
            to={e.ruta}
            className={({ isActive }) =>
              isActive ? 'nav-provisional__enlace activo' : 'nav-provisional__enlace'
            }
          >
            {e.etiqueta}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <NavegacionProvisional />
      <Routes>
        {/* HU-1 — Cuenta y acceso: {rutasAuth} */}

        {/* HU-4 — Asignación de revisiones */}
        {rutasAsignacion}

        {/* Provisional: mientras no exista la landing de HU-1, cualquier ruta
            desconocida lleva a la vista principal del comité. Se elimina
            cuando la HU-1 aporte su {rutaNoEncontrada}. */}
        <Route path="*" element={<Navigate to="/trabajos-recibidos" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
