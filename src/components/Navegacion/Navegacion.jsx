import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth';
import { MENU_POR_ROL, ROL_VISIBLE } from './menuPorRol';
import './Navegacion.css';

function iniciales(usuario) {
  const nombre = usuario.nombres.trim()[0] ?? '';
  const apellido = usuario.apellidos.trim()[0] ?? '';
  return (nombre + apellido).toUpperCase();
}

// Componente común: barra de navegación bajo el Header, según el rol activo.
// Visitante: enlaces públicos + "Iniciar sesión" y "Crear cuenta".
// Con sesión: enlaces del rol + nombre, rol e iniciales; el menú de las
// iniciales tiene "Mi cuenta" y "Cerrar sesión".
export default function Navegacion() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  const enlaces = MENU_POR_ROL[usuario?.rol ?? 'visitante'] ?? MENU_POR_ROL.visitante;

  // Cierra el menú del usuario al hacer clic fuera o al cambiar de página.
  useEffect(() => {
    if (!menuAbierto) return undefined;
    const alClicFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false);
    };
    const alEscape = (e) => e.key === 'Escape' && setMenuAbierto(false);
    document.addEventListener('mousedown', alClicFuera);
    document.addEventListener('keydown', alEscape);
    return () => {
      document.removeEventListener('mousedown', alClicFuera);
      document.removeEventListener('keydown', alEscape);
    };
  }, [menuAbierto]);

  function irASeccion(seccion) {
    const desplazar = () =>
      document.getElementById(seccion)?.scrollIntoView({ behavior: 'smooth' });
    if (location.pathname === '/') {
      desplazar();
    } else {
      navigate('/');
      setTimeout(desplazar, 50);
    }
  }

  function salir() {
    setMenuAbierto(false);
    cerrarSesion();
    navigate('/');
  }

  return (
    <nav className="navegacion" aria-label="Navegación principal">
      <div className="navegacion__contenido">
        <ul className="navegacion__enlaces">
          {enlaces.map((enlace) => (
            <li key={enlace.etiqueta}>
              {enlace.seccion ? (
                <button
                  type="button"
                  className="navegacion__enlace"
                  onClick={() => irASeccion(enlace.seccion)}
                >
                  {enlace.etiqueta}
                </button>
              ) : (
                <NavLink
                  to={enlace.ruta}
                  end={enlace.ruta === '/'}
                  className={({ isActive }) =>
                    isActive ? 'navegacion__enlace navegacion__enlace--activo' : 'navegacion__enlace'
                  }
                >
                  {enlace.etiqueta}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {usuario ? (
          <div className="navegacion__usuario" ref={menuRef}>
            <button
              type="button"
              className="navegacion__avisos"
              aria-label="Notificaciones"
              title="Notificaciones"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="navegacion__identidad">
              <strong>
                {usuario.nombres} {usuario.apellidos}
              </strong>
              <small>Rol: {ROL_VISIBLE[usuario.rol] ?? usuario.rol}</small>
            </div>
            <button
              type="button"
              className="navegacion__iniciales"
              aria-haspopup="menu"
              aria-expanded={menuAbierto}
              aria-label="Abrir menú de la cuenta"
              onClick={() => setMenuAbierto((v) => !v)}
            >
              {iniciales(usuario)}
            </button>
            {menuAbierto && (
              <div className="navegacion__menu" role="menu">
                <Link
                  to="/mi-cuenta"
                  role="menuitem"
                  className="navegacion__menu-opcion"
                  onClick={() => setMenuAbierto(false)}
                >
                  Mi cuenta
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  className="navegacion__menu-opcion navegacion__menu-opcion--salir"
                  onClick={salir}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="navegacion__acciones">
            <Link to="/login" className="navegacion__boton navegacion__boton--contorno">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="navegacion__boton navegacion__boton--relleno">
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
