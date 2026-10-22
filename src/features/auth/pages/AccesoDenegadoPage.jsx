import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ETIQUETA_ROL, vistaPrincipal } from '../utils/roles';
import '../auth.css';

const CORREO_COMITE = 'congreso@ulima.edu.pe';

function descripcion(rolesRequeridos) {
  if (!rolesRequeridos?.length) return 'Esta sección requiere un rol autorizado.';
  if (rolesRequeridos.length === 1 && rolesRequeridos[0] === 'revisor') {
    return 'La bandeja de revisión es exclusiva del rol revisor.';
  }
  const roles = rolesRequeridos.map((r) => ETIQUETA_ROL[r]?.toLowerCase() ?? r).join(' o ');
  return `Esta sección es exclusiva del rol ${roles}.`;
}

// 1.6 Acceso denegado (403).
// RutaProtegida la muestra cuando el usuario no tiene el rol requerido.
export default function AccesoDenegadoPage({ rolesRequeridos }) {
  const { usuario } = useAuth();
  const volver = vistaPrincipal(usuario);
  const rol = usuario ? (ETIQUETA_ROL[usuario.rol] ?? usuario.rol).toLowerCase() : null;

  return (
    <div className="auth-pagina auth-pagina--centrada">
      <section className="estado-error">
        <span className="estado-error__icono" aria-hidden="true">!</span>
        <h1 className="estado-error__titulo">No tiene permiso para ver esta página</h1>
        <p className="estado-error__texto">
          {descripcion(rolesRequeridos)} Si cree que debería tener acceso, solicite el cambio de
          rol al comité organizador.
        </p>
        <div className="auth-acciones auth-acciones--centro">
          <Link to={volver.ruta} className="auth-boton auth-boton--primario">
            {volver.etiqueta}
          </Link>
          <a href={`mailto:${CORREO_COMITE}`} className="auth-boton auth-boton--secundario">
            Escribir al comité
          </a>
        </div>
        <p className="auth-texto-auxiliar">
          Código de error: 403
          {usuario && ` · Sesión de ${usuario.nombres.split(' ')[0]} ${usuario.apellidos} (rol ${rol})`}
        </p>
      </section>
    </div>
  );
}
