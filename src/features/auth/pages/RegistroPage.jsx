import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { vistaPrincipal } from '../utils/roles';
import { claseEntrada } from '../utils/claseEntrada';
import {
  CARRERAS,
  INSTITUCIONES,
  MENSAJE_CONTRASENA,
  contrasenaValida,
  requisitosContrasena,
  validarConfirmacion,
  validarContrasena,
  validarCorreoInstitucional,
  validarRequerido,
} from '../utils/validaciones';
import { existeCorreo } from '../services/authService';
import { obtenerEdicionPublica } from '../services/lecturaCompartida';
import CampoFormulario from '../components/CampoFormulario';
import AvisoAuth from '../components/AvisoAuth';
import '../auth.css';

const OPCIONES_ROL = [
  { valor: 'autor', titulo: 'Autor', descripcion: 'Enviaré uno o más trabajos.' },
  { valor: 'revisor', titulo: 'Revisor', descripcion: 'Evaluaré trabajos asignados.' },
  { valor: 'ambos', titulo: 'Ambos', descripcion: 'Autor y revisor.' },
];

const FORMULARIO_INICIAL = {
  nombres: '',
  apellidos: '',
  correo: '',
  institucion: 'Universidad de Lima',
  contrasena: '',
  confirmar: '',
  carrera: '',
  codigoAlumno: '',
  rol: '',
  aceptaBases: false,
};

function validarCampo(campo, datos) {
  switch (campo) {
    case 'nombres':
    case 'apellidos':
      return validarRequerido(datos[campo]);
    case 'correo': {
      const error = validarCorreoInstitucional(datos.correo, datos.institucion);
      if (error) return error;
      return existeCorreo(datos.correo) ? 'Ya existe una cuenta con este correo.' : '';
    }
    case 'institucion':
      return validarRequerido(datos.institucion, 'Seleccione su institución.');
    case 'contrasena':
      return validarContrasena(datos.contrasena);
    case 'confirmar':
      return validarConfirmacion(datos.confirmar, datos.contrasena);
    case 'carrera':
      return validarRequerido(datos.carrera, 'Seleccione su carrera.');
    case 'rol':
      return datos.rol ? '' : 'Seleccione cómo desea participar.';
    case 'aceptaBases':
      return datos.aceptaBases ? '' : 'Debe aceptar las bases para continuar.';
    default:
      return '';
  }
}

const CAMPOS = Object.keys(FORMULARIO_INICIAL).filter((c) => c !== 'codigoAlumno');

// 1.3 Registro de participante — estados: normal, validación en línea y éxito.
export default function RegistroPage() {
  const { usuario, registrarParticipante } = useAuth();
  const navigate = useNavigate();
  const edicion = obtenerEdicionPublica();

  const [datos, setDatos] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [enviando, setEnviando] = useState(false);

  if (usuario && !enviando) {
    return <Navigate to={vistaPrincipal(usuario).ruta} replace />;
  }

  function cambiar(campo, valor) {
    const nuevos = { ...datos, [campo]: valor };
    setDatos(nuevos);
    // Si el campo ya mostraba error, se revalida mientras el usuario corrige.
    if (errores[campo] !== undefined) {
      setErrores((prev) => ({ ...prev, [campo]: validarCampo(campo, nuevos) }));
    }
    if (campo === 'contrasena' && errores.confirmar !== undefined && nuevos.confirmar) {
      setErrores((prev) => ({ ...prev, confirmar: validarCampo('confirmar', nuevos) }));
    }
  }

  // La validación se muestra al salir del campo (regla del mockup 1.3).
  function alSalir(campo) {
    setErrores((prev) => ({ ...prev, [campo]: validarCampo(campo, datos) }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevos = Object.fromEntries(CAMPOS.map((c) => [c, validarCampo(c, datos)]));
    setErrores(nuevos);
    setIntentoEnvio(true);
    if (Object.values(nuevos).some(Boolean)) return;

    setEnviando(true);
    try {
      await registrarParticipante(datos);
      navigate('/registro/exito', { replace: true });
    } catch (e) {
      setErrores((prev) => ({ ...prev, correo: e.message }));
      setEnviando(false);
    }
  }

  const exitoContrasena =
    errores.contrasena === '' && contrasenaValida(datos.contrasena) ? 'Contraseña segura.' : '';
  const exitoConfirmar =
    errores.confirmar === '' && datos.confirmar ? 'Las contraseñas coinciden.' : '';
  const requisitos = requisitosContrasena(datos.contrasena);
  const coincide = Boolean(datos.confirmar) && datos.confirmar === datos.contrasena;
  // El resumen se actualiza en vivo mientras el usuario corrige.
  const resumenErrores = intentoEnvio ? Object.values(errores).filter(Boolean).length : 0;
  const hayErrores = resumenErrores > 0;

  return (
    <div className="auth-pagina">
      <div className="auth-contenedor registro-distribucion">
        <div className="auth-tarjeta">
          <h1 className="auth-titulo">Registro de participante</h1>
          {hayErrores ? (
            <AvisoAuth tipo="error" icono={false}>
              Revise {resumenErrores} {resumenErrores === 1 ? 'campo' : 'campos'} con errores
              antes de continuar.
            </AvisoAuth>
          ) : (
            <p className="auth-subtitulo">Los campos marcados con asterisco son obligatorios.</p>
          )}

          <form onSubmit={manejarEnvio} noValidate>
            <div className="auth-rejilla">
              <CampoFormulario id="reg-nombres" etiqueta="Nombres *" error={errores.nombres}>
                <input
                  id="reg-nombres"
                  className={claseEntrada(errores.nombres)}
                  placeholder="Ingrese sus nombres"
                  value={datos.nombres}
                  onChange={(e) => cambiar('nombres', e.target.value)}
                  onBlur={() => alSalir('nombres')}
                  aria-invalid={Boolean(errores.nombres)}
                />
              </CampoFormulario>

              <CampoFormulario id="reg-apellidos" etiqueta="Apellidos *" error={errores.apellidos}>
                <input
                  id="reg-apellidos"
                  className={claseEntrada(errores.apellidos)}
                  placeholder="Ingrese sus apellidos"
                  value={datos.apellidos}
                  onChange={(e) => cambiar('apellidos', e.target.value)}
                  onBlur={() => alSalir('apellidos')}
                  aria-invalid={Boolean(errores.apellidos)}
                />
              </CampoFormulario>

              <CampoFormulario
                id="reg-correo"
                etiqueta="Correo institucional *"
                error={errores.correo}
                ayuda="Se usará para todas las notificaciones."
              >
                <input
                  id="reg-correo"
                  type="email"
                  autoComplete="email"
                  className={claseEntrada(errores.correo)}
                  placeholder="nombre.apellido@aloe.ulima.edu.pe"
                  value={datos.correo}
                  onChange={(e) => cambiar('correo', e.target.value)}
                  onBlur={() => alSalir('correo')}
                  aria-invalid={Boolean(errores.correo)}
                />
              </CampoFormulario>

              <CampoFormulario id="reg-institucion" etiqueta="Institución *" error={errores.institucion}>
                <select
                  id="reg-institucion"
                  className={claseEntrada(errores.institucion)}
                  value={datos.institucion}
                  onChange={(e) => cambiar('institucion', e.target.value)}
                  onBlur={() => alSalir('institucion')}
                >
                  {INSTITUCIONES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </CampoFormulario>

              <CampoFormulario
                id="reg-contrasena"
                etiqueta="Contraseña *"
                error={errores.contrasena}
                exito={exitoContrasena}
                ayuda={MENSAJE_CONTRASENA}
              >
                <input
                  id="reg-contrasena"
                  type="password"
                  autoComplete="new-password"
                  className={claseEntrada(errores.contrasena, exitoContrasena)}
                  value={datos.contrasena}
                  onChange={(e) => cambiar('contrasena', e.target.value)}
                  onBlur={() => alSalir('contrasena')}
                  aria-invalid={Boolean(errores.contrasena)}
                />
              </CampoFormulario>

              <CampoFormulario
                id="reg-confirmar"
                etiqueta="Confirmar contraseña *"
                error={errores.confirmar}
                exito={exitoConfirmar}
              >
                <input
                  id="reg-confirmar"
                  type="password"
                  autoComplete="new-password"
                  className={claseEntrada(errores.confirmar, exitoConfirmar)}
                  value={datos.confirmar}
                  onChange={(e) => cambiar('confirmar', e.target.value)}
                  onBlur={() => alSalir('confirmar')}
                  aria-invalid={Boolean(errores.confirmar)}
                />
              </CampoFormulario>

              <CampoFormulario id="reg-carrera" etiqueta="Carrera *" error={errores.carrera}>
                <select
                  id="reg-carrera"
                  className={claseEntrada(errores.carrera)}
                  value={datos.carrera}
                  onChange={(e) => cambiar('carrera', e.target.value)}
                  onBlur={() => alSalir('carrera')}
                >
                  <option value="">Seleccione su carrera</option>
                  {CARRERAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </CampoFormulario>

              <CampoFormulario id="reg-codigo" etiqueta="Código de alumno">
                <input
                  id="reg-codigo"
                  inputMode="numeric"
                  className="auth-entrada"
                  placeholder="Opcional"
                  value={datos.codigoAlumno}
                  onChange={(e) => cambiar('codigoAlumno', e.target.value)}
                />
              </CampoFormulario>
            </div>

            <fieldset className="auth-campo registro-roles">
              <legend className="auth-etiqueta">Deseo participar como *</legend>
              <div className="registro-roles__opciones">
                {OPCIONES_ROL.map((opcion) => (
                  <label
                    key={opcion.valor}
                    className={`registro-rol ${datos.rol === opcion.valor ? 'registro-rol--activo' : ''}`}
                  >
                    <input
                      type="radio"
                      name="rol"
                      value={opcion.valor}
                      checked={datos.rol === opcion.valor}
                      onChange={() => cambiar('rol', opcion.valor)}
                    />
                    <span>
                      <strong>{opcion.titulo}</strong>
                      <small>{opcion.descripcion}</small>
                    </span>
                  </label>
                ))}
              </div>
              {errores.rol && (
                <small className="auth-campo__mensaje auth-campo__mensaje--error">{errores.rol}</small>
              )}
            </fieldset>

            <div className="registro-final">
              <div>
                <label className="auth-casilla">
                  <input
                    type="checkbox"
                    checked={datos.aceptaBases}
                    onChange={(e) => cambiar('aceptaBases', e.target.checked)}
                  />
                  Acepto las bases del congreso y el tratamiento de mis datos.
                </label>
                {errores.aceptaBases && (
                  <small className="auth-campo__mensaje auth-campo__mensaje--error">
                    {errores.aceptaBases}
                  </small>
                )}
              </div>
              <div className="auth-acciones">
                <button
                  type="button"
                  className="auth-boton auth-boton--secundario"
                  onClick={() => navigate('/')}
                >
                  Cancelar
                </button>
                <button type="submit" className="auth-boton auth-boton--primario" disabled={enviando}>
                  {enviando ? 'Enviando…' : 'Crear mi cuenta'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {hayErrores ? (
          <aside className="registro-lateral registro-lateral--requisitos">
            <h2 className="auth-etiqueta">Requisitos de la contraseña</h2>
            <ul>
              <Requisito cumple={requisitos.longitud}>Mínimo 8 caracteres</Requisito>
              <Requisito cumple={requisitos.mayuscula}>Al menos una mayúscula</Requisito>
              <Requisito cumple={requisitos.numero}>Al menos un número</Requisito>
              <Requisito cumple={coincide}>La confirmación debe coincidir</Requisito>
            </ul>
          </aside>
        ) : (
          <aside className="registro-lateral">
            <h2>Antes de registrarse</h2>
            {edicion?.cierreRecepcion && (
              <p>
                La recepción de trabajos cierra el {edicion.cierreRecepcion.fecha} a las{' '}
                {edicion.cierreRecepcion.hora}. Después de esa fecha no será posible editar los
                envíos.
              </p>
            )}
            <p>
              Si participa como revisor, deberá declarar sus líneas de interés para recibir
              asignaciones sin conflicto.
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}

function Requisito({ cumple, children }) {
  return (
    <li className={cumple ? 'requisito requisito--ok' : 'requisito requisito--falta'}>
      <span aria-hidden="true">{cumple ? '✓' : '✕'}</span> {children}
      <span className="auth-oculto">{cumple ? ' (cumple)' : ' (no cumple)'}</span>
    </li>
  );
}
