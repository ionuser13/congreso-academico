import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { claseEntrada } from '../utils/claseEntrada';
import {
  MENSAJE_CONTRASENA,
  validarConfirmacion,
  validarContrasena,
} from '../utils/validaciones';
import {
  MINUTOS_VIGENCIA_ENLACE,
  restablecerContrasena,
  solicitarRecuperacion,
  verificarTokenRecuperacion,
} from '../services/authService';
import CampoFormulario from '../components/CampoFormulario';
import EntradaContrasena from '../components/EntradaContrasena';
import AvisoAuth from '../components/AvisoAuth';
import '../auth.css';

const SEGUNDOS_REENVIO = 120;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Pasos({ actual }) {
  const pasos = ['1. Correo', '2. Envío', '3. Nueva contraseña'];
  return (
    <ol className="recuperar-pasos" aria-label={`Paso ${actual} de 3`}>
      {pasos.map((paso, i) => (
        <li
          key={paso}
          className={i + 1 <= actual ? 'recuperar-paso recuperar-paso--hecho' : 'recuperar-paso'}
          aria-current={i + 1 === actual ? 'step' : undefined}
        >
          <span className={i + 1 === actual ? 'recuperar-paso__texto--actual' : ''}>{paso}</span>
        </li>
      ))}
    </ol>
  );
}

const formatoCuenta = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// 1.4 Recuperar contraseña — 3 pasos con el mismo indicador y ancho de tarjeta.
// Paso 3 se abre desde el enlace enviado: /recuperar-contrasena/:token
export default function RecuperarContrasenaPage() {
  const { token } = useParams();
  return (
    <div className="auth-pagina auth-pagina--centrada">
      <div className="auth-tarjeta auth-tarjeta--recuperar">
        {token ? <PasoNuevaContrasena token={token} /> : <PasosCorreoYEnvio />}
      </div>
    </div>
  );
}

function PasosCorreoYEnvio() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [envio, setEnvio] = useState(null); // { correo, enlace }
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (segundos <= 0) return undefined;
    const id = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [segundos]);

  async function enviar(evento) {
    evento?.preventDefault();
    if (!CORREO_VALIDO.test(correo.trim())) {
      setError('Ingrese un correo válido.');
      return;
    }
    setError('');
    setEnviando(true);
    setEnvio(await solicitarRecuperacion(correo));
    setEnviando(false);
    setSegundos(SEGUNDOS_REENVIO);
  }

  if (envio) {
    return (
      <>
        <Pasos actual={2} />
        <AvisoAuth tipo="exito">Enviamos el enlace de recuperación a {envio.correo}.</AvisoAuth>
        <h1 className="auth-titulo">Revise su correo</h1>
        <p className="auth-subtitulo">
          El enlace vence en {MINUTOS_VIGENCIA_ENLACE} minutos. Si no lo encuentra, revise la
          carpeta de correo no deseado antes de solicitar uno nuevo.
        </p>
        <div className="auth-fila">
          <button
            type="button"
            className="auth-boton auth-boton--secundario"
            onClick={() => enviar()}
            disabled={segundos > 0 || enviando}
          >
            {enviando ? 'Enviando…' : 'Reenviar enlace'}
          </button>
          {segundos > 0 && (
            <span className="auth-texto-auxiliar">
              Podrá reenviarlo en {formatoCuenta(segundos)} min
            </span>
          )}
        </div>
        <Link to="/login" className="auth-enlace auth-enlace--bloque">
          Volver al inicio de sesión
        </Link>
        {/* Simulación: la primera entrega no envía correos reales. */}
        <p className="recuperar-simulacion">
          Simulación sin correo real:{' '}
          <Link to={envio.enlace} className="auth-enlace">abrir el enlace recibido</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <Pasos actual={1} />
      <h1 className="auth-titulo">Recuperar contraseña</h1>
      <p className="auth-subtitulo">
        Ingrese el correo con el que se registró. Le enviaremos un enlace para crear una nueva
        contraseña.
      </p>
      <form onSubmit={enviar} noValidate>
        <CampoFormulario
          id="rec-correo"
          etiqueta="Correo institucional"
          error={error}
          ayuda={`El enlace vence en ${MINUTOS_VIGENCIA_ENLACE} minutos.`}
        >
          <input
            id="rec-correo"
            type="email"
            autoComplete="email"
            className={claseEntrada(error)}
            placeholder="rosa.quispe@aloe.ulima.edu.pe"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </CampoFormulario>
        <div className="auth-acciones auth-acciones--expandir">
          <button type="submit" className="auth-boton auth-boton--primario" disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar enlace'}
          </button>
          <Link to="/login" className="auth-boton auth-boton--secundario">
            Volver
          </Link>
        </div>
      </form>
    </>
  );
}

function PasoNuevaContrasena({ token }) {
  const navigate = useNavigate();
  const [enlaceValido] = useState(() => Boolean(verificarTokenRecuperacion(token)));
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!enlaceValido) {
    return (
      <>
        <Pasos actual={3} />
        <AvisoAuth tipo="error">El enlace de recuperación no es válido o ya venció.</AvisoAuth>
        <Link to="/recuperar-contrasena" className="auth-boton auth-boton--primario auth-boton--bloque">
          Solicitar un nuevo enlace
        </Link>
      </>
    );
  }

  const validar = (campo, n = nueva, c = confirmar) =>
    campo === 'nueva' ? validarContrasena(n) : validarConfirmacion(c, n);

  async function guardar(evento) {
    evento.preventDefault();
    const nuevos = { nueva: validar('nueva'), confirmar: validar('confirmar') };
    setErrores(nuevos);
    if (nuevos.nueva || nuevos.confirmar) return;
    setEnviando(true);
    try {
      await restablecerContrasena(token, nueva);
      // Al guardar: notificación de éxito y redirección al inicio de sesión.
      navigate('/login', {
        replace: true,
        state: { mensaje: 'Su contraseña se actualizó correctamente. Ya puede iniciar sesión.' },
      });
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  }

  const exitoConfirmar =
    confirmar && confirmar === nueva && !errores.confirmar ? 'Las contraseñas coinciden.' : '';

  return (
    <>
      <Pasos actual={3} />
      <h1 className="auth-titulo">Cree su nueva contraseña</h1>
      {error ? (
        <AvisoAuth tipo="error">{error}</AvisoAuth>
      ) : (
        <p className="auth-subtitulo">
          La nueva contraseña reemplaza a la anterior en todos sus dispositivos.
        </p>
      )}
      <form onSubmit={guardar} noValidate>
        <CampoFormulario
          id="rec-nueva"
          etiqueta="Nueva contraseña"
          error={errores.nueva}
          ayuda={MENSAJE_CONTRASENA}
        >
          <EntradaContrasena
            id="rec-nueva"
            autoComplete="new-password"
            className={claseEntrada(errores.nueva)}
            value={nueva}
            onChange={(e) => {
              setNueva(e.target.value);
              if (errores.nueva !== undefined) {
                setErrores((p) => ({ ...p, nueva: validar('nueva', e.target.value) }));
              }
            }}
            onBlur={() => setErrores((p) => ({ ...p, nueva: validar('nueva') }))}
          />
        </CampoFormulario>
        <CampoFormulario
          id="rec-confirmar"
          etiqueta="Confirmar nueva contraseña"
          error={errores.confirmar}
          exito={exitoConfirmar}
        >
          <input
            id="rec-confirmar"
            type="password"
            autoComplete="new-password"
            className={claseEntrada(errores.confirmar, exitoConfirmar)}
            value={confirmar}
            onChange={(e) => {
              setConfirmar(e.target.value);
              if (errores.confirmar !== undefined) {
                setErrores((p) => ({
                  ...p,
                  confirmar: validar('confirmar', nueva, e.target.value),
                }));
              }
            }}
            onBlur={() => setErrores((p) => ({ ...p, confirmar: validar('confirmar') }))}
          />
        </CampoFormulario>
        <button
          type="submit"
          className="auth-boton auth-boton--primario auth-boton--bloque"
          disabled={enviando}
        >
          {enviando ? 'Guardando…' : 'Guardar y entrar'}
        </button>
      </form>
    </>
  );
}
