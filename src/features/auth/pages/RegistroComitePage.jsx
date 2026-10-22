import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { vistaPrincipal } from '../utils/roles';
import { claseEntrada } from '../utils/claseEntrada';
import {
  INSTITUCIONES,
  MENSAJE_CONTRASENA,
  contrasenaValida,
  validarConfirmacion,
  validarContrasena,
  validarRequerido,
} from '../utils/validaciones';
import { validarInvitacion } from '../services/authService';
import CampoFormulario from '../components/CampoFormulario';
import AvisoAuth from '../components/AvisoAuth';
import '../auth.css';

const INICIAL = {
  nombres: '',
  apellidos: '',
  institucion: 'Universidad de Lima',
  contrasena: '',
  confirmar: '',
};

function validarCampo(campo, datos) {
  if (campo === 'contrasena') return validarContrasena(datos.contrasena);
  if (campo === 'confirmar') return validarConfirmacion(datos.confirmar, datos.contrasena);
  return validarRequerido(datos[campo]);
}

// HU-1 — Registro de los miembros del comité por invitación.
// No tiene mockup propio: reutiliza el diseño de 1.3 (Registro).
// El enlace de la invitación tiene la forma /registro-comite/COM-2026-A7K2.
export default function RegistroComitePage() {
  const { codigo: codigoUrl } = useParams();
  const { usuario, registrarComite } = useAuth();
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState(codigoUrl ?? '');
  const [invitacion, setInvitacion] = useState(null);
  const [errorCodigo, setErrorCodigo] = useState('');
  const [verificando, setVerificando] = useState(Boolean(codigoUrl));

  const [datos, setDatos] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Si se llega con el código en el enlace, se valida al cargar.
  useEffect(() => {
    if (!codigoUrl) return;
    validarInvitacion(codigoUrl)
      .then(setInvitacion)
      .catch((e) => setErrorCodigo(e.message))
      .finally(() => setVerificando(false));
  }, [codigoUrl]);

  if (usuario && !enviando) {
    return <Navigate to={vistaPrincipal(usuario).ruta} replace />;
  }

  async function verificarCodigo(evento) {
    evento.preventDefault();
    if (!codigo.trim()) {
      setErrorCodigo('Ingrese el código de su invitación.');
      return;
    }
    setVerificando(true);
    setErrorCodigo('');
    try {
      setInvitacion(await validarInvitacion(codigo));
    } catch (e) {
      setErrorCodigo(e.message);
    } finally {
      setVerificando(false);
    }
  }

  function cambiar(campo, valor) {
    const nuevos = { ...datos, [campo]: valor };
    setDatos(nuevos);
    if (errores[campo] !== undefined) {
      setErrores((prev) => ({ ...prev, [campo]: validarCampo(campo, nuevos) }));
    }
  }

  const alSalir = (campo) =>
    setErrores((prev) => ({ ...prev, [campo]: validarCampo(campo, datos) }));

  async function registrar(evento) {
    evento.preventDefault();
    const nuevos = Object.fromEntries(Object.keys(INICIAL).map((c) => [c, validarCampo(c, datos)]));
    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) return;

    setEnviando(true);
    try {
      await registrarComite(invitacion.codigo, datos);
      navigate('/registro/exito', { replace: true });
    } catch (e) {
      setErrorCodigo(e.message);
      setInvitacion(null);
      setEnviando(false);
    }
  }

  const cantidadErrores = Object.values(errores).filter(Boolean).length;
  const exitoContrasena =
    errores.contrasena === '' && contrasenaValida(datos.contrasena) ? 'Contraseña segura.' : '';
  const exitoConfirmar =
    errores.confirmar === '' && datos.confirmar ? 'Las contraseñas coinciden.' : '';

  if (!invitacion) {
    return (
      <div className="auth-pagina auth-pagina--centrada">
        <div className="auth-tarjeta auth-tarjeta--angosta">
          <h1 className="auth-titulo">Registro del comité</h1>
          {errorCodigo ? (
            <AvisoAuth tipo="error">{errorCodigo}</AvisoAuth>
          ) : (
            <p className="auth-subtitulo">
              Ingrese el código de la invitación que recibió del comité organizador.
            </p>
          )}
          <form onSubmit={verificarCodigo} noValidate>
            <CampoFormulario id="com-codigo" etiqueta="Código de invitación" ayuda="Ejemplo: COM-2026-A7K2">
              <input
                id="com-codigo"
                className={claseEntrada(errorCodigo)}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                autoComplete="off"
              />
            </CampoFormulario>
            <div className="auth-acciones auth-acciones--expandir">
              <button type="submit" className="auth-boton auth-boton--primario" disabled={verificando}>
                {verificando ? 'Verificando…' : 'Continuar'}
              </button>
              <Link to="/login" className="auth-boton auth-boton--secundario">
                Volver
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-pagina">
      <div className="auth-contenedor registro-distribucion">
        <div className="auth-tarjeta">
          <h1 className="auth-titulo">Registro del comité</h1>
          {cantidadErrores > 0 ? (
            <AvisoAuth tipo="error" icono={false}>
              Revise {cantidadErrores} {cantidadErrores === 1 ? 'campo' : 'campos'} con errores
              antes de continuar.
            </AvisoAuth>
          ) : (
            <p className="auth-subtitulo">Los campos marcados con asterisco son obligatorios.</p>
          )}

          <form onSubmit={registrar} noValidate>
            <div className="auth-rejilla">
              <CampoFormulario id="com-nombres" etiqueta="Nombres *" error={errores.nombres}>
                <input
                  id="com-nombres"
                  className={claseEntrada(errores.nombres)}
                  value={datos.nombres}
                  onChange={(e) => cambiar('nombres', e.target.value)}
                  onBlur={() => alSalir('nombres')}
                />
              </CampoFormulario>
              <CampoFormulario id="com-apellidos" etiqueta="Apellidos *" error={errores.apellidos}>
                <input
                  id="com-apellidos"
                  className={claseEntrada(errores.apellidos)}
                  value={datos.apellidos}
                  onChange={(e) => cambiar('apellidos', e.target.value)}
                  onBlur={() => alSalir('apellidos')}
                />
              </CampoFormulario>
              <CampoFormulario
                id="com-correo"
                etiqueta="Correo institucional"
                ayuda="Es el correo al que se envió la invitación."
              >
                <input id="com-correo" className="auth-entrada" value={invitacion.correo} disabled />
              </CampoFormulario>
              <CampoFormulario id="com-institucion" etiqueta="Institución *" error={errores.institucion}>
                <select
                  id="com-institucion"
                  className={claseEntrada(errores.institucion)}
                  value={datos.institucion}
                  onChange={(e) => cambiar('institucion', e.target.value)}
                >
                  {INSTITUCIONES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </CampoFormulario>
              <CampoFormulario
                id="com-contrasena"
                etiqueta="Contraseña *"
                error={errores.contrasena}
                exito={exitoContrasena}
                ayuda={MENSAJE_CONTRASENA}
              >
                <input
                  id="com-contrasena"
                  type="password"
                  autoComplete="new-password"
                  className={claseEntrada(errores.contrasena, exitoContrasena)}
                  value={datos.contrasena}
                  onChange={(e) => cambiar('contrasena', e.target.value)}
                  onBlur={() => alSalir('contrasena')}
                />
              </CampoFormulario>
              <CampoFormulario
                id="com-confirmar"
                etiqueta="Confirmar contraseña *"
                error={errores.confirmar}
                exito={exitoConfirmar}
              >
                <input
                  id="com-confirmar"
                  type="password"
                  autoComplete="new-password"
                  className={claseEntrada(errores.confirmar, exitoConfirmar)}
                  value={datos.confirmar}
                  onChange={(e) => cambiar('confirmar', e.target.value)}
                  onBlur={() => alSalir('confirmar')}
                />
              </CampoFormulario>
            </div>
            <div className="registro-final registro-final--derecha">
              <div className="auth-acciones">
                <Link to="/" className="auth-boton auth-boton--secundario">
                  Cancelar
                </Link>
                <button type="submit" className="auth-boton auth-boton--primario" disabled={enviando}>
                  {enviando ? 'Enviando…' : 'Activar mi cuenta'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <aside className="registro-lateral">
          <h2>Invitación del comité</h2>
          <p>
            Código <strong>{invitacion.codigo}</strong>, válido hasta el{' '}
            {invitacion.fechaVencimiento.split('-').reverse().join('/')}.
          </p>
          <p>
            Como miembro del comité podrá configurar la edición, asignar revisores y publicar la
            decisión final de cada trabajo.
          </p>
        </aside>
      </div>
    </div>
  );
}
