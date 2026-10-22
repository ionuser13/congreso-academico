import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { esRevisor } from '../utils/roles';
import { claseEntrada } from '../utils/claseEntrada';
import {
  MENSAJE_CONTRASENA,
  validarConfirmacion,
  validarContrasena,
  validarRequerido,
} from '../utils/validaciones';
import { obtenerActividadRevisor, obtenerEjesTematicos } from '../services/lecturaCompartida';
import CampoFormulario from '../components/CampoFormulario';
import AvisoAuth from '../components/AvisoAuth';
import '../auth.css';

// 1.5 Mi cuenta y líneas de interés.
// El bloque de líneas de interés solo se muestra a quienes participan como
// revisor; el autor ve el resto de la pantalla igual.
export default function MiCuentaPage() {
  const { usuario, actualizarCuenta, cambiarContrasena } = useAuth();
  const ejes = obtenerEjesTematicos();
  const mostrarLineas = esRevisor(usuario);
  const actividad = mostrarLineas ? obtenerActividadRevisor(usuario.id) : null;

  // --- Datos personales y líneas de interés ---
  const [datos, setDatos] = useState({
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    institucion: usuario.institucion,
  });
  const [lineas, setLineas] = useState(usuario.lineasInteres ?? []);
  const [erroresDatos, setErroresDatos] = useState({});
  const [avisoDatos, setAvisoDatos] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // --- Cambio de contraseña ---
  const [claves, setClaves] = useState({ actual: '', nueva: '', confirmar: '' });
  const [erroresClave, setErroresClave] = useState({});
  const [avisoClave, setAvisoClave] = useState(null);
  const [cambiandoClave, setCambiandoClave] = useState(false);

  const cambiarDato = (campo, valor) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
    if (erroresDatos[campo]) setErroresDatos((prev) => ({ ...prev, [campo]: validarRequerido(valor) }));
  };

  const alternarLinea = (id) =>
    setLineas((prev) => (prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]));

  async function guardarCambios(evento) {
    evento.preventDefault();
    const errores = {
      nombres: validarRequerido(datos.nombres),
      apellidos: validarRequerido(datos.apellidos),
      institucion: validarRequerido(datos.institucion),
    };
    setErroresDatos(errores);
    if (Object.values(errores).some(Boolean)) {
      setAvisoDatos({ tipo: 'error', texto: 'No se pudieron guardar los cambios. Revise los campos marcados.' });
      return;
    }
    setGuardando(true);
    try {
      await actualizarCuenta({ ...datos, lineasInteres: mostrarLineas ? lineas : undefined });
      setAvisoDatos({ tipo: 'exito', texto: 'Sus datos se guardaron correctamente.' });
    } catch (e) {
      setAvisoDatos({ tipo: 'error', texto: e.message });
    } finally {
      setGuardando(false);
    }
  }

  async function actualizarContrasena(evento) {
    evento.preventDefault();
    const errores = {
      actual: validarRequerido(claves.actual),
      nueva: validarContrasena(claves.nueva),
      confirmar: validarConfirmacion(claves.confirmar, claves.nueva),
    };
    if (!errores.nueva && claves.nueva === claves.actual) {
      errores.nueva = 'La nueva contraseña debe ser distinta de la actual.';
    }
    setErroresClave(errores);
    setAvisoClave(null);
    if (Object.values(errores).some(Boolean)) return;

    setCambiandoClave(true);
    try {
      await cambiarContrasena(claves.actual, claves.nueva);
      setClaves({ actual: '', nueva: '', confirmar: '' });
      setAvisoClave({ tipo: 'exito', texto: 'Contraseña actualizada correctamente.' });
    } catch (e) {
      setErroresClave({ actual: e.message });
    } finally {
      setCambiandoClave(false);
    }
  }

  return (
    <div className="auth-pagina">
      <div className="auth-contenedor">
        <header className="cuenta-encabezado">
          <div>
            <h1 className="auth-titulo">Mi cuenta</h1>
            <p className="auth-subtitulo">Datos personales, líneas de interés y seguridad.</p>
          </div>
          <button
            type="submit"
            form="form-datos-cuenta"
            className="auth-boton auth-boton--primario"
            disabled={guardando}
          >
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </header>

        {avisoDatos && <AvisoAuth tipo={avisoDatos.tipo}>{avisoDatos.texto}</AvisoAuth>}

        <div className="cuenta-distribucion">
          <div className="cuenta-columna">
            <form id="form-datos-cuenta" className="auth-panel" onSubmit={guardarCambios} noValidate>
              <h2 className="auth-titulo-seccion">Datos personales</h2>
              <div className="auth-rejilla">
                <CampoFormulario id="cta-nombres" etiqueta="Nombres" error={erroresDatos.nombres}>
                  <input
                    id="cta-nombres"
                    className={claseEntrada(erroresDatos.nombres)}
                    value={datos.nombres}
                    onChange={(e) => cambiarDato('nombres', e.target.value)}
                  />
                </CampoFormulario>
                <CampoFormulario id="cta-apellidos" etiqueta="Apellidos" error={erroresDatos.apellidos}>
                  <input
                    id="cta-apellidos"
                    className={claseEntrada(erroresDatos.apellidos)}
                    value={datos.apellidos}
                    onChange={(e) => cambiarDato('apellidos', e.target.value)}
                  />
                </CampoFormulario>
                <CampoFormulario
                  id="cta-correo"
                  etiqueta="Correo institucional"
                  ayuda="Para cambiarlo, escriba al comité organizador."
                >
                  <input id="cta-correo" className="auth-entrada" value={usuario.correo} disabled />
                </CampoFormulario>
                <CampoFormulario id="cta-institucion" etiqueta="Institución" error={erroresDatos.institucion}>
                  <input
                    id="cta-institucion"
                    className={claseEntrada(erroresDatos.institucion)}
                    value={datos.institucion}
                    onChange={(e) => cambiarDato('institucion', e.target.value)}
                  />
                </CampoFormulario>
              </div>
            </form>

            {mostrarLineas && (
              <section className="auth-panel" aria-labelledby="titulo-lineas">
                <div className="cuenta-fila-titulo">
                  <h2 id="titulo-lineas" className="auth-titulo-seccion">
                    Líneas de interés como revisor
                  </h2>
                  <span className="auth-texto-auxiliar">
                    {lineas.length} de {ejes.length} seleccionadas
                  </span>
                </div>
                <p className="auth-texto-auxiliar">Las asignaciones priorizan sus líneas declaradas.</p>
                {ejes.length === 0 ? (
                  <p className="auth-vacio">Aún no se han publicado los ejes temáticos.</p>
                ) : (
                  <div className="cuenta-chips">
                    {ejes.map((eje) => {
                      const activo = lineas.includes(eje.id);
                      return (
                        <button
                          key={eje.id}
                          type="button"
                          className={activo ? 'cuenta-chip cuenta-chip--activo' : 'cuenta-chip'}
                          aria-pressed={activo}
                          onClick={() => alternarLinea(eje.id)}
                        >
                          {eje.nombre}
                          {activo && ' ✓'}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>

          <div className="cuenta-columna">
            <form className="auth-panel" onSubmit={actualizarContrasena} noValidate>
              <h2 className="auth-titulo-seccion">Cambiar contraseña</h2>
              {avisoClave && <AvisoAuth tipo={avisoClave.tipo}>{avisoClave.texto}</AvisoAuth>}
              <CampoFormulario id="cta-actual" etiqueta="Contraseña actual" error={erroresClave.actual}>
                <input
                  id="cta-actual"
                  type="password"
                  autoComplete="current-password"
                  className={claseEntrada(erroresClave.actual)}
                  value={claves.actual}
                  onChange={(e) => setClaves((p) => ({ ...p, actual: e.target.value }))}
                />
              </CampoFormulario>
              <CampoFormulario
                id="cta-nueva"
                etiqueta="Nueva contraseña"
                error={erroresClave.nueva}
                ayuda={MENSAJE_CONTRASENA}
              >
                <input
                  id="cta-nueva"
                  type="password"
                  autoComplete="new-password"
                  className={claseEntrada(erroresClave.nueva)}
                  value={claves.nueva}
                  onChange={(e) => setClaves((p) => ({ ...p, nueva: e.target.value }))}
                />
              </CampoFormulario>
              <CampoFormulario
                id="cta-confirmar"
                etiqueta="Confirmar nueva contraseña"
                error={erroresClave.confirmar}
              >
                <input
                  id="cta-confirmar"
                  type="password"
                  autoComplete="new-password"
                  className={claseEntrada(erroresClave.confirmar)}
                  value={claves.confirmar}
                  onChange={(e) => setClaves((p) => ({ ...p, confirmar: e.target.value }))}
                />
              </CampoFormulario>
              <button
                type="submit"
                className="auth-boton auth-boton--secundario auth-boton--bloque"
                disabled={cambiandoClave}
              >
                {cambiandoClave ? 'Actualizando…' : 'Actualizar contraseña'}
              </button>
            </form>

            {mostrarLineas && (
              <section className="auth-panel cuenta-actividad" aria-labelledby="titulo-actividad">
                <h2 id="titulo-actividad" className="auth-etiqueta">Mi actividad</h2>
                {actividad ? (
                  <dl>
                    <div><dt>Revisiones asignadas</dt><dd>{actividad.asignadas}</dd></div>
                    <div><dt>Revisiones entregadas</dt><dd className="texto-exito">{actividad.entregadas}</dd></div>
                    <div><dt>Pendientes</dt><dd className="texto-advertencia">{actividad.pendientes}</dd></div>
                  </dl>
                ) : (
                  <p className="auth-vacio">Aún no tiene revisiones asignadas.</p>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
