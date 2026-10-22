import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { vistaPrincipal } from '../utils/roles';
import { claseEntrada } from '../utils/claseEntrada';
import CampoFormulario from '../components/CampoFormulario';
import EntradaContrasena from '../components/EntradaContrasena';
import AvisoAuth from '../components/AvisoAuth';
import '../auth.css';

function mensajeError(error) {
  if (error.codigo === 'CREDENCIALES') {
    return error.restantes > 0
      ? `${error.message} Le quedan ${error.restantes} intentos antes del bloqueo temporal.`
      : `${error.message} Su acceso quedó bloqueado temporalmente.`;
  }
  return error.message;
}

// 1.2 Inicio de sesión — estados: normal, error de credenciales y botón en carga.
export default function LoginPage() {
  const { usuario, iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Mensaje que llega desde otra vista (p. ej. tras recuperar la contraseña).
  const avisoExito = location.state?.mensaje;

  if (usuario && !enviando) {
    return <Navigate to={vistaPrincipal(usuario).ruta} replace />;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const datos = await iniciarSesion(correo, contrasena, recordar);
      // Redirección a la vista principal según el rol (o a la ruta que pidió).
      navigate(location.state?.desde ?? vistaPrincipal(datos).ruta, { replace: true });
    } catch (e) {
      setError(mensajeError(e));
      setEnviando(false);
    }
  }

  return (
    <div className="auth-pagina auth-pagina--centrada">
      <div className="auth-tarjeta auth-tarjeta--angosta">
        <h1 className="auth-titulo">Inicio de sesión</h1>
        {error ? (
          <AvisoAuth tipo="error">{error}</AvisoAuth>
        ) : (
          <>
            <p className="auth-subtitulo">
              Ingrese con su correo institucional para enviar o revisar trabajos.
            </p>
            {avisoExito && <AvisoAuth tipo="exito">{avisoExito}</AvisoAuth>}
          </>
        )}

        <form onSubmit={manejarEnvio} noValidate>
          <CampoFormulario id="login-correo" etiqueta="Correo institucional">
            <input
              id="login-correo"
              type="email"
              autoComplete="username"
              placeholder="rosa.quispe@aloe.ulima.edu.pe"
              className={claseEntrada(error)}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </CampoFormulario>

          <CampoFormulario
            id="login-contrasena"
            etiqueta="Contraseña"
            error={error ? 'Verifique su contraseña.' : ''}
          >
            <EntradaContrasena
              id="login-contrasena"
              autoComplete="current-password"
              className={claseEntrada(error)}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              aria-describedby={error ? 'login-contrasena-mensaje' : undefined}
              required
            />
          </CampoFormulario>

          <div className="auth-fila-entre">
            <label className="auth-casilla">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
              />
              Recordarme en este equipo
            </label>
            <Link to="/recuperar-contrasena" className="auth-enlace">
              ¿Olvidó su contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-boton auth-boton--primario auth-boton--bloque"
            disabled={enviando || !correo || !contrasena}
          >
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-pie-tarjeta">
          ¿No tiene cuenta?{' '}
          <Link to="/registro" className="auth-enlace">
            Registrarse como participante
          </Link>
        </p>
      </div>
    </div>
  );
}
