import { useState } from 'react';
import './App.css';
import Estructura from './Estructura';

const ejesTematicos = [
  {
    nombre: 'Inteligencia artificial y datos',
    descripcion: 'Aprendizaje automático, analítica y ciencia de datos aplicada.'
  },
  {
    nombre: 'Ingeniería de software',
    descripcion: 'Arquitectura, calidad, pruebas y procesos de desarrollo.'
  },
  {
    nombre: 'Sostenibilidad y ciudad',
    descripcion: 'Movilidad, gestión del agua y ciudades resilientes.'
  },
  {
    nombre: 'Innovación y emprendimiento',
    descripcion: 'Modelos de negocio, transferencia tecnológica y startups.'
  },
  {
    nombre: 'Salud y sociedad',
    descripcion: 'Salud pública, bienestar estudiantil y política social.'
  },
  {
    nombre: 'Economía y mercados',
    descripcion: 'Mercados financieros, comercio y desarrollo económico.'
  }
];

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [usuarioActual, setUsuarioActual] = useState(null);

  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    institucion: 'Universidad de Lima',
    contrasena: '',
    confirmar: '',
    carrera: '',
    codigo: '',
    rol: '',
    aceptaBases: false
  });

  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [mensaje, setMensaje] = useState('');

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
  const [intentos, setIntentos] = useState(0);

  const [pasoRecuperacion, setPasoRecuperacion] = useState(1);
  const [correoRecuperacion, setCorreoRecuperacion] = useState('');

  const [intereses, setIntereses] = useState([]);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [confirmarNueva, setConfirmarNueva] = useState('');

  const [destinoPendiente, setDestinoPendiente] = useState('');

  // Las cuentas son ficticias y se guardan SOLO para probar el frontend.
  function obtenerUsuarios() {
    try {
      return JSON.parse(localStorage.getItem('usuariosCongreso')) || [];
    } catch {
      return [];
    }
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem('usuariosCongreso', JSON.stringify(usuarios));
  }

  function formularioVacio() {
    return {
      nombre: '',
      apellido: '',
      correo: '',
      institucion: 'Universidad de Lima',
      contrasena: '',
      confirmar: '',
      carrera: '',
      codigo: '',
      rol: '',
      aceptaBases: false
    };
  }

  function limpiarMensajes() {
    setMensaje('');
    setErrores({});
    setTocados({});
  }

  function cambiarDato(campo, valor) {
    setDatos((anterior) => ({
      ...anterior,
      [campo]: valor
    }));

    // Cuando el usuario corrige un campo, quitamos su error anterior.
    setErrores((anterior) => ({
      ...anterior,
      [campo]: ''
    }));
  }

  function contrasenaValida(valor) {
    return valor.length >= 8 && /[A-Z]/.test(valor) && /[0-9]/.test(valor);
  }

  function validarCampo(campo, valores) {
    const valor = valores[campo];

    if (campo === 'nombre' && !valor.trim()) {
      return 'Este campo es obligatorio.';
    }

    if (campo === 'apellido' && !valor.trim()) {
      return 'Este campo es obligatorio.';
    }

    if (campo === 'correo') {
      const correo = valor.trim().toLowerCase();

      if (!correo) {
        return 'Este campo es obligatorio.';
      }

      if (!/^[^\s@]+@(?:aloe\.)?ulima\.edu\.pe$/.test(correo)) {
        return 'Use un correo institucional válido de la Universidad de Lima.';
      }

      const correoExiste = obtenerUsuarios().some(
        (usuario) => usuario.correo === correo
      );

      if (correoExiste) {
        return 'Ya existe una cuenta con este correo.';
      }
    }

    if (campo === 'institucion' && !valor.trim()) {
      return 'Seleccione su institución.';
    }

    if (campo === 'contrasena' && !contrasenaValida(valor)) {
      return 'Mínimo 8 caracteres, una mayúscula y un número.';
    }

    if (campo === 'confirmar' && valor !== valores.contrasena) {
      return 'Las contraseñas no coinciden.';
    }

    if (campo === 'carrera' && !valor.trim()) {
      return 'Seleccione su carrera.';
    }

    if (campo === 'rol' && !valor) {
      return 'Seleccione cómo desea participar.';
    }

    if (campo === 'aceptaBases' && !valor) {
      return 'Debe aceptar las bases para continuar.';
    }

    return '';
  }

  function validarAlSalir(campo) {
    setTocados((anterior) => ({
      ...anterior,
      [campo]: true
    }));

    setErrores((anterior) => ({
      ...anterior,
      [campo]: validarCampo(campo, datos)
    }));
  }

  function abrirRegistro() {
    setDatos(formularioVacio());
    limpiarMensajes();
    setPantalla('registro');
  }

  function abrirLogin() {
    setDatos(formularioVacio());
    limpiarMensajes();
    setPantalla('login');
  }

  function irA(destino) {
    limpiarMensajes();

    if (destino === 'registro') {
      abrirRegistro();
      return;
    }

    if (destino === 'login') {
      abrirLogin();
      return;
    }

    if (destino === 'inicio') {
      setPantalla('inicio');
      return;
    }

    if (destino === 'bases' || destino === 'ejes') {
      setPantalla('inicio');

      // Esperamos a que React muestre la portada antes de bajar.
      setTimeout(() => {
        document.getElementById(destino)?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 30);

      return;
    }

    if (destino === 'perfil' && !usuarioActual) {
      setPantalla('acceso-denegado');
      return;
    }

    if (['nuevo-trabajo', 'mis-trabajos', 'presentacion'].includes(destino)) {
      if (!usuarioActual || !['autor', 'ambos'].includes(usuarioActual.rol)) {
        setPantalla('acceso-denegado');
        return;
      }
    }

    if (destino === 'bandeja') {
      if (!usuarioActual || !['revisor', 'ambos'].includes(usuarioActual.rol)) {
        setPantalla('acceso-denegado');
        return;
      }
    }

    if (
      [
        'programa',
        'guia-autores',
        'guia-revisores',
        'preguntas',
        'nuevo-trabajo',
        'mis-trabajos',
        'presentacion',
        'bandeja'
      ].includes(destino)
    ) {
      setDestinoPendiente(destino);
      setPantalla('pendiente');
      return;
    }

    if (destino === 'perfil') {
      prepararPerfil();
    }

    setPantalla(destino);
  }

  function registrarUsuario(evento) {
    evento.preventDefault();

    const campos = [
      'nombre',
      'apellido',
      'correo',
      'institucion',
      'contrasena',
      'confirmar',
      'carrera',
      'rol',
      'aceptaBases'
    ];

    const nuevosErrores = {};
    const todosTocados = {};

    campos.forEach((campo) => {
      nuevosErrores[campo] = validarCampo(campo, datos);
      todosTocados[campo] = true;
    });

    setErrores(nuevosErrores);
    setTocados(todosTocados);

    const cantidadErrores = Object.values(nuevosErrores).filter(Boolean).length;

    if (cantidadErrores > 0) {
      setMensaje(`Revise ${cantidadErrores} campo(s) con errores antes de continuar.`);
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      correo: datos.correo.trim().toLowerCase(),
      institucion: datos.institucion.trim(),
      contrasena: datos.contrasena,
      carrera: datos.carrera.trim(),
      codigo: datos.codigo.trim(),
      rol: datos.rol,
      intereses: []
    };

    guardarUsuarios([...obtenerUsuarios(), nuevoUsuario]);

    // Según el mockup, el usuario entra automáticamente después de registrarse.
    setUsuarioActual(nuevoUsuario);
    setMensaje('Cuenta de prueba creada correctamente. Ya inició sesión.');
    setPantalla('bienvenida');
    setDatos(formularioVacio());
    setErrores({});
    setTocados({});
  }

  function iniciarSesion(evento) {
    evento.preventDefault();

    const usuario = obtenerUsuarios().find(
      (item) =>
        item.correo === datos.correo.trim().toLowerCase() &&
        item.contrasena === datos.contrasena
    );

    if (!usuario) {
      setIntentos((anterior) => anterior + 1);
      setErrores({
        login: 'El correo o la contraseña no son correctos.',
        correoLogin: 'Verifique su correo.',
        contrasenaLogin: 'Verifique su contraseña.'
      });
      return;
    }

    setIntentos(0);
    setUsuarioActual(usuario);
    setDatos(formularioVacio());
    limpiarMensajes();

    // La casilla se simula como preferencia visual para esta entrega.
    if (recordarme) {
      sessionStorage.setItem('recordarCongresoDemo', 'si');
    } else {
      sessionStorage.removeItem('recordarCongresoDemo');
    }

    prepararPerfil(usuario);
    setPantalla('perfil');
  }

  function cerrarSesion() {
    setUsuarioActual(null);
    setDatos(formularioVacio());
    sessionStorage.removeItem('recordarCongresoDemo');
    setRecordarme(false);
    limpiarMensajes();
    setPantalla('inicio');
  }

  function prepararPerfil(usuario = usuarioActual) {
    if (!usuario) {
      return;
    }

    setDatos({
      ...formularioVacio(),
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      institucion: usuario.institucion,
      carrera: usuario.carrera,
      codigo: usuario.codigo || '',
      rol: usuario.rol
    });

    setIntereses(usuario.intereses || []);
    setContrasenaActual('');
    setContrasenaNueva('');
    setConfirmarNueva('');
  }

  function actualizarUsuario(usuarioEditado) {
    const usuariosActualizados = obtenerUsuarios().map((usuario) =>
      usuario.id === usuarioEditado.id ? usuarioEditado : usuario
    );

    guardarUsuarios(usuariosActualizados);
    setUsuarioActual(usuarioEditado);
  }

  function guardarPerfil(evento) {
    evento.preventDefault();

    if (!datos.nombre.trim() || !datos.apellido.trim()) {
      setMensaje('Complete sus nombres y apellidos.');
      return;
    }

    const usuarioEditado = {
      ...usuarioActual,
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      institucion: datos.institucion.trim(),
      carrera: datos.carrera.trim(),
      codigo: datos.codigo.trim(),
      intereses
    };

    actualizarUsuario(usuarioEditado);
    setMensaje('Sus datos se actualizaron correctamente.');
  }

  function cambiarContrasena(evento) {
    evento.preventDefault();

    const nuevosErrores = {};

    if (contrasenaActual !== usuarioActual.contrasena) {
      nuevosErrores.contrasenaActual = 'La contraseña actual es incorrecta.';
    }

    if (!contrasenaValida(contrasenaNueva)) {
      nuevosErrores.contrasenaNueva =
        'Mínimo 8 caracteres, una mayúscula y un número.';
    }

    if (contrasenaNueva !== confirmarNueva) {
      nuevosErrores.confirmarNueva = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    actualizarUsuario({
      ...usuarioActual,
      contrasena: contrasenaNueva
    });

    setContrasenaActual('');
    setContrasenaNueva('');
    setConfirmarNueva('');
    setErrores({});
    setMensaje('Contraseña de prueba actualizada correctamente.');
  }

  function abrirRecuperacion() {
    setPasoRecuperacion(1);
    setCorreoRecuperacion('');
    setContrasenaNueva('');
    setConfirmarNueva('');
    limpiarMensajes();
    setPantalla('recuperar');
  }

  function enviarRecuperacion(evento) {
    evento.preventDefault();

    const correoBuscado = correoRecuperacion.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoBuscado)) {
      setErrores({ recuperacion: 'Escriba un correo válido.' });
      return;
    }

    // SOLO SIMULACIÓN: no se envía ningún correo.
    setErrores({});
    setPasoRecuperacion(2);
  }

  function finalizarRecuperacion(evento) {
    evento.preventDefault();

    if (!contrasenaValida(contrasenaNueva)) {
      setErrores({
        contrasenaNueva: 'Mínimo 8 caracteres, una mayúscula y un número.'
      });
      return;
    }

    if (contrasenaNueva !== confirmarNueva) {
      setErrores({
        confirmarNueva: 'Las contraseñas no coinciden.'
      });
      return;
    }

    const usuario = obtenerUsuarios().find(
      (item) => item.correo === correoRecuperacion.trim().toLowerCase()
    );

    if (!usuario) {
      setErrores({
        recuperacion: 'No existe una cuenta de prueba con ese correo.'
      });
      setPasoRecuperacion(1);
      return;
    }

    actualizarUsuario({
      ...usuario,
      contrasena: contrasenaNueva
    });

    setUsuarioActual(null);
    setContrasenaNueva('');
    setConfirmarNueva('');
    setErrores({});
    setDatos(formularioVacio());
    setMensaje('Contraseña de prueba cambiada. Ahora puede iniciar sesión.');
    setPantalla('login');
  }

  function cambiarInteres(nombreEje) {
    setIntereses((anteriores) =>
      anteriores.includes(nombreEje)
        ? anteriores.filter((item) => item !== nombreEje)
        : [...anteriores, nombreEje]
    );
  }

  const cantidadErroresRegistro = Object.values(errores).filter(Boolean).length;

  return (
    <Estructura
      usuario={usuarioActual}
      irA={irA}
      cerrarSesion={cerrarSesion}
    >
      {/* 1.1 PORTADA */}
      {pantalla === 'inicio' && (
        <>
          <section className="portada-hero">
            <div className="ancho-contenido hero-interior">
              <div>
                <p className="etiqueta-hero">
                  CONVOCATORIA ABIERTA · LIMA, 12 Y 13 DE NOVIEMBRE DE 2026
                </p>

                <h1>VIII Congreso Académico Estudiantil</h1>

                <p>
                  Presenta tu investigación ante el comité y la comunidad
                  universitaria. Recibimos artículos completos, resúmenes
                  extendidos, pósteres y casos de estudio en seis ejes temáticos.
                </p>
              </div>

              <div className="hero-botones">
                <button
                  className="boton-dorado"
                  type="button"
                  onClick={abrirLogin}
                >
                  Enviar mi trabajo
                </button>

                <button
                  className="boton-claro"
                  type="button"
                  onClick={() => irA('bases')}
                >
                  Descargar las bases
                </button>
              </div>
            </div>
          </section>

          <div className="ancho-contenido contenido-portada">
            <section id="ejes">
              <div className="fila-titulo">
                <h2>Ejes temáticos</h2>

                <button
                  className="enlace-texto"
                  type="button"
                  onClick={() => irA('bases')}
                >
                  Ver bases completas
                </button>
              </div>

              <div className="cuadricula-ejes">
                {ejesTematicos.map((eje) => (
                  <article className="tarjeta-eje" key={eje.nombre}>
                    <h3>{eje.nombre}</h3>
                    <p>{eje.descripcion}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="cuadros-inferiores" id="bases">
              <div>
                <h2>Fechas límite</h2>

                <div className="tabla-simple">
                  <div>
                    <span>Cierre de recepción de trabajos</span>
                    <strong>30/09/2026</strong>
                  </div>
                  <div>
                    <span>Cierre de la etapa de revisión</span>
                    <strong>20/10/2026</strong>
                  </div>
                  <div>
                    <span>Publicación de resultados</span>
                    <strong>28/10/2026</strong>
                  </div>
                  <div>
                    <span>Días del congreso</span>
                    <strong>12/11/2026 – 13/11/2026</strong>
                  </div>
                </div>
              </div>

              <div>
                <h2>Criterios de evaluación</h2>

                <div className="tabla-simple">
                  <div>
                    <span>Originalidad</span>
                    <strong>25 %</strong>
                  </div>
                  <div>
                    <span>Rigor metodológico</span>
                    <strong>30 %</strong>
                  </div>
                  <div>
                    <span>Claridad de la exposición</span>
                    <strong>20 %</strong>
                  </div>
                  <div>
                    <span>Relevancia y aporte</span>
                    <strong>25 %</strong>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {/* 1.2 INICIO DE SESIÓN */}
      {pantalla === 'login' && (
        <section className="zona-formulario">
          <div className="tarjeta-formulario tarjeta-login">
            <h1>Inicio de sesión</h1>
            <p className="texto-ayuda">
              Ingrese con su correo institucional para enviar o revisar trabajos.
            </p>

            {mensaje && <p className="aviso-exito">{mensaje}</p>}

            {errores.login && (
              <p className="aviso-error">
                {errores.login}
                {' '}Revise los datos e intente nuevamente.
              </p>
            )}

            <form onSubmit={iniciarSesion}>
              <div className="campo">
                <label htmlFor="login-correo">CORREO INSTITUCIONAL</label>
                <input
                  id="login-correo"
                  type="email"
                  placeholder="rosa.quispe@aloe.ulima.edu.pe"
                  value={datos.correo}
                  className={errores.login ? 'campo-invalido' : ''}
                  onChange={(e) => cambiarDato('correo', e.target.value)}
                  required
                />

                {errores.correoLogin && (
                  <small className="texto-error">{errores.correoLogin}</small>
                )}
              </div>

              <div className="campo">
                <label htmlFor="login-contrasena">CONTRASEÑA</label>

                <div className="entrada-con-boton">
                  <input
                    id="login-contrasena"
                    type={mostrarContrasena ? 'text' : 'password'}
                    placeholder="Su contraseña"
                    value={datos.contrasena}
                    className={errores.login ? 'campo-invalido' : ''}
                    onChange={(e) => cambiarDato('contrasena', e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  >
                    {mostrarContrasena ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                {errores.contrasenaLogin && (
                  <small className="texto-error">
                    {errores.contrasenaLogin}
                  </small>
                )}
              </div>

              <div className="fila-recordarme">
                <label className="casilla">
                  <input
                    type="checkbox"
                    checked={recordarme}
                    onChange={(e) => setRecordarme(e.target.checked)}
                  />
                  Recordarme en este equipo
                </label>

                <button
                  className="enlace-texto"
                  type="button"
                  onClick={abrirRecuperacion}
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>

              <button className="boton-principal boton-ancho" type="submit">
                Ingresar
              </button>
            </form>

            <p className="pie-formulario">
              ¿No tiene cuenta?{' '}
              <button
                type="button"
                className="enlace-texto"
                onClick={abrirRegistro}
              >
                Registrarse como participante
              </button>
            </p>
          </div>
        </section>
      )}

      {/* 1.3 REGISTRO */}
      {pantalla === 'registro' && (
        <section className="zona-registro ancho-contenido">
          <div className="registro-distribucion">
            <div className="tarjeta-formulario tarjeta-registro">
              <h1>Registro de participante</h1>

              {mensaje ? (
                <p className="aviso-error">{mensaje}</p>
              ) : (
                <p className="texto-ayuda">
                  Los campos marcados con asterisco son obligatorios.
                </p>
              )}

              <form onSubmit={registrarUsuario} noValidate>
                <div className="dos-columnas">
                  <div className="campo">
                    <label htmlFor="reg-nombre">NOMBRES *</label>
                    <input
                      id="reg-nombre"
                      value={datos.nombre}
                      placeholder="Rosa María"
                      className={errores.nombre ? 'campo-invalido' : ''}
                      onChange={(e) => cambiarDato('nombre', e.target.value)}
                      onBlur={() => validarAlSalir('nombre')}
                    />
                    {errores.nombre && (
                      <small className="texto-error">{errores.nombre}</small>
                    )}
                  </div>

                  <div className="campo">
                    <label htmlFor="reg-apellido">APELLIDOS *</label>
                    <input
                      id="reg-apellido"
                      value={datos.apellido}
                      placeholder="Quispe Ttito"
                      className={errores.apellido ? 'campo-invalido' : ''}
                      onChange={(e) => cambiarDato('apellido', e.target.value)}
                      onBlur={() => validarAlSalir('apellido')}
                    />
                    {errores.apellido && (
                      <small className="texto-error">{errores.apellido}</small>
                    )}
                  </div>

                  <div className="campo">
                    <label htmlFor="reg-correo">CORREO INSTITUCIONAL *</label>
                    <input
                      id="reg-correo"
                      type="email"
                      value={datos.correo}
                      placeholder="rosa.quispe@aloe.ulima.edu.pe"
                      className={errores.correo ? 'campo-invalido' : ''}
                      onChange={(e) => cambiarDato('correo', e.target.value)}
                      onBlur={() => validarAlSalir('correo')}
                    />
                    {errores.correo ? (
                      <small className="texto-error">{errores.correo}</small>
                    ) : (
                      <small>Se usará para todas las notificaciones.</small>
                    )}
                  </div>

                  <div className="campo">
                    <label htmlFor="reg-institucion">INSTITUCIÓN *</label>
                    <select
                      id="reg-institucion"
                      value={datos.institucion}
                      className={errores.institucion ? 'campo-invalido' : ''}
                      onChange={(e) =>
                        cambiarDato('institucion', e.target.value)
                      }
                      onBlur={() => validarAlSalir('institucion')}
                    >
                      <option value="Universidad de Lima">
                        Universidad de Lima
                      </option>
                      <option value="Otra institución">
                        Otra institución
                      </option>
                    </select>
                    {errores.institucion && (
                      <small className="texto-error">
                        {errores.institucion}
                      </small>
                    )}
                  </div>

                  <div className="campo">
                    <label htmlFor="reg-contrasena">CONTRASEÑA *</label>
                    <input
                      id="reg-contrasena"
                      type="password"
                      value={datos.contrasena}
                      className={errores.contrasena ? 'campo-invalido' : ''}
                      onChange={(e) =>
                        cambiarDato('contrasena', e.target.value)
                      }
                      onBlur={() => validarAlSalir('contrasena')}
                    />
                    {errores.contrasena ? (
                      <small className="texto-error">
                        {errores.contrasena}
                      </small>
                    ) : (
                      <small>
                        Mínimo 8 caracteres, con una mayúscula y un número.
                      </small>
                    )}
                  </div>

                  <div className="campo">
                    <label htmlFor="reg-confirmar">
                      CONFIRMAR CONTRASEÑA *
                    </label>
                    <input
                      id="reg-confirmar"
                      type="password"
                      value={datos.confirmar}
                      className={errores.confirmar ? 'campo-invalido' : ''}
                      onChange={(e) => cambiarDato('confirmar', e.target.value)}
                      onBlur={() => validarAlSalir('confirmar')}
                    />
                    {errores.confirmar && (
                      <small className="texto-error">{errores.confirmar}</small>
                    )}
                  </div>

                  <div className="campo">
                    <label htmlFor="reg-carrera">CARRERA *</label>
                    <select
                      id="reg-carrera"
                      value={datos.carrera}
                      className={errores.carrera ? 'campo-invalido' : ''}
                      onChange={(e) => cambiarDato('carrera', e.target.value)}
                      onBlur={() => validarAlSalir('carrera')}
                    >
                      <option value="">Seleccione su carrera</option>
                      <option value="Ingeniería de Sistemas">
                        Ingeniería de Sistemas
                      </option>
                      <option value="Ingeniería Industrial">
                        Ingeniería Industrial
                      </option>
                      <option value="Ingeniería Civil">
                        Ingeniería Civil
                      </option>
                      <option value="Otra carrera">Otra carrera</option>
                    </select>
                    {errores.carrera && (
                      <small className="texto-error">{errores.carrera}</small>
                    )}
                  </div>

                  <div className="campo">
                    <label htmlFor="reg-codigo">CÓDIGO DE ALUMNO</label>
                    <input
                      id="reg-codigo"
                      value={datos.codigo}
                      placeholder="Opcional"
                      onChange={(e) => cambiarDato('codigo', e.target.value)}
                    />
                  </div>
                </div>

                <div className="campo">
                  <label>DESEO PARTICIPAR COMO *</label>

                  <div className="opciones-rol">
                    {[
                      ['autor', 'Autor', 'Enviaré uno o más trabajos.'],
                      ['revisor', 'Revisor', 'Evaluaré trabajos asignados.'],
                      ['ambos', 'Ambos', 'Autor y revisor.']
                    ].map(([valor, titulo, descripcion]) => (
                      <label
                        className={
                          datos.rol === valor
                            ? 'opcion-rol opcion-seleccionada'
                            : 'opcion-rol'
                        }
                        key={valor}
                      >
                        <input
                          type="radio"
                          name="rol"
                          value={valor}
                          checked={datos.rol === valor}
                          onChange={() => cambiarDato('rol', valor)}
                        />

                        <span>
                          <strong>{titulo}</strong>
                          <small>{descripcion}</small>
                        </span>
                      </label>
                    ))}
                  </div>

                  {errores.rol && (
                    <small className="texto-error">{errores.rol}</small>
                  )}
                </div>

                <div className="fila-registro-final">
                  <div>
                    <label className="casilla">
                      <input
                        type="checkbox"
                        checked={datos.aceptaBases}
                        onChange={(e) =>
                          cambiarDato('aceptaBases', e.target.checked)
                        }
                      />
                      Acepto las bases del congreso y el tratamiento de mis datos.
                    </label>

                    {errores.aceptaBases && (
                      <small className="texto-error">
                        {errores.aceptaBases}
                      </small>
                    )}
                  </div>

                  <div className="botones-finales">
                    <button
                      type="button"
                      className="boton-secundario"
                      onClick={() => irA('inicio')}
                    >
                      Cancelar
                    </button>

                    <button type="submit" className="boton-principal">
                      Crear mi cuenta
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <aside className="registro-lateral">
              {cantidadErroresRegistro > 0 ? (
                <>
                  <h3>REQUISITOS DE LA CONTRASEÑA</h3>
                  <p>
                    {datos.contrasena.length >= 8 ? '✓' : '✕'} Mínimo 8 caracteres
                  </p>
                  <p>
                    {/[A-Z]/.test(datos.contrasena) ? '✓' : '✕'} Al menos una mayúscula
                  </p>
                  <p>
                    {/[0-9]/.test(datos.contrasena) ? '✓' : '✕'} Al menos un número
                  </p>
                  <p>
                    {datos.confirmar && datos.confirmar === datos.contrasena
                      ? '✓'
                      : '✕'}{' '}
                    La confirmación debe coincidir
                  </p>
                </>
              ) : (
                <>
                  <h3>Antes de registrarse</h3>
                  <p>
                    La recepción de trabajos cierra el 30/09/2026 a las 23:59.
                    Después de esa fecha no será posible editar los envíos.
                  </p>
                  <p>
                    Si participa como revisor, deberá declarar sus líneas de
                    interés para recibir asignaciones sin conflicto.
                  </p>
                </>
              )}
            </aside>
          </div>
        </section>
      )}

      {/* REGISTRO EXITOSO */}
      {pantalla === 'bienvenida' && usuarioActual && (
        <section className="ancho-contenido zona-bienvenida">
          <p className="aviso-exito">
            ✓ {mensaje}
          </p>

          <div className="bienvenida-titulo">
            <p className="etiqueta">BIENVENIDA</p>
            <h1>
              {usuarioActual.nombre} {usuarioActual.apellido}, su cuenta está activa
            </h1>

            <p>
              Ya puede utilizar su cuenta de prueba para participar en la
              plataforma del congreso.
            </p>

            <div className="botones-finales">
              <button
                className="boton-principal"
                type="button"
                onClick={() => irA('perfil')}
              >
                Completar mi perfil
              </button>

              <button
                className="boton-secundario"
                type="button"
                onClick={() => irA('inicio')}
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 1.4 RECUPERACIÓN EN TRES PASOS */}
      {pantalla === 'recuperar' && (
        <section className="zona-formulario">
          <div className="tarjeta-formulario tarjeta-login">
            <div className="pasos-recuperacion">
              <span className={pasoRecuperacion === 1 ? 'paso-activo' : ''}>
                1. Correo
              </span>
              <span className={pasoRecuperacion === 2 ? 'paso-activo' : ''}>
                2. Envío
              </span>
              <span className={pasoRecuperacion === 3 ? 'paso-activo' : ''}>
                3. Nueva contraseña
              </span>
            </div>

            {pasoRecuperacion === 1 && (
              <>
                <h1>Recuperar contraseña</h1>
                <p className="texto-ayuda">
                  Ingrese el correo con el que se registró.
                </p>

                <p className="aviso-demo">
                  Demostración: no se enviará ningún correo real.
                </p>

                <form onSubmit={enviarRecuperacion}>
                  <div className="campo">
                    <label htmlFor="rec-correo">CORREO INSTITUCIONAL</label>
                    <input
                      id="rec-correo"
                      type="email"
                      value={correoRecuperacion}
                      onChange={(e) => setCorreoRecuperacion(e.target.value)}
                      placeholder="rosa.quispe@aloe.ulima.edu.pe"
                    />
                    {errores.recuperacion && (
                      <small className="texto-error">
                        {errores.recuperacion}
                      </small>
                    )}
                  </div>

                  <div className="botones-finales">
                    <button type="submit" className="boton-principal">
                      Continuar simulación
                    </button>

                    <button
                      type="button"
                      className="boton-secundario"
                      onClick={abrirLogin}
                    >
                      Volver
                    </button>
                  </div>
                </form>
              </>
            )}

            {pasoRecuperacion === 2 && (
              <>
                <p className="aviso-exito">
                  ✓ Paso de envío simulado para {correoRecuperacion}.
                </p>

                <h1>Revise su correo</h1>

                <p className="texto-ayuda">
                  En el sistema final, aquí se confirmará el envío del enlace
                  de recuperación.
                </p>

                <p className="aviso-demo">
                  Para probar la interfaz, puede avanzar sin recibir un correo.
                  Este paso no verifica la identidad.
                </p>

                <button
                  className="boton-principal boton-ancho"
                  type="button"
                  onClick={() => setPasoRecuperacion(3)}
                >
                  Continuar al paso 3 de prueba
                </button>

                <p className="pie-formulario">
                  <button
                    className="enlace-texto"
                    type="button"
                    onClick={abrirLogin}
                  >
                    Volver al inicio de sesión
                  </button>
                </p>
              </>
            )}

            {pasoRecuperacion === 3 && (
              <>
                <h1>Cree su nueva contraseña</h1>

                <p className="aviso-demo">
                  Cambio de contraseña de una cuenta ficticia. No usar datos
                  personales reales.
                </p>

                <form onSubmit={finalizarRecuperacion}>
                  <div className="campo">
                    <label htmlFor="rec-nueva">NUEVA CONTRASEÑA</label>
                    <input
                      id="rec-nueva"
                      type="password"
                      value={contrasenaNueva}
                      onChange={(e) => setContrasenaNueva(e.target.value)}
                    />
                    <small>
                      Mínimo 8 caracteres, con una mayúscula y un número.
                    </small>
                    {errores.contrasenaNueva && (
                      <small className="texto-error">
                        {errores.contrasenaNueva}
                      </small>
                    )}
                  </div>

                  <div className="campo">
                    <label htmlFor="rec-confirmar">
                      CONFIRMAR NUEVA CONTRASEÑA
                    </label>
                    <input
                      id="rec-confirmar"
                      type="password"
                      value={confirmarNueva}
                      onChange={(e) => setConfirmarNueva(e.target.value)}
                    />
                    {errores.confirmarNueva && (
                      <small className="texto-error">
                        {errores.confirmarNueva}
                      </small>
                    )}
                  </div>

                  <button type="submit" className="boton-principal boton-ancho">
                    Guardar contraseña de prueba
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      )}

      {/* 1.5 MI CUENTA */}
      {pantalla === 'perfil' && usuarioActual && (
        <section className="ancho-contenido zona-perfil">
          <div className="fila-titulo">
            <div>
              <h1>Mi cuenta</h1>
              <p className="texto-ayuda">
                Datos personales, líneas de interés y seguridad.
              </p>
            </div>

            <button
            type="submit"
            form="formulario-perfil"
            className="boton-principal"
            >
            Guardar cambios
          </button>
          </div>

          {mensaje && (
            <p className={
              mensaje.includes('correctamente') ? 'aviso-exito' : 'aviso-error'
            }>
              {mensaje}
            </p>
          )}

          <div className="perfil-distribucion">
            <div>
              <form
                id="formulario-perfil"
                className="panel-perfil"
                onSubmit={guardarPerfil}
              >
                <h2>Datos personales</h2>

                <div className="dos-columnas">
                  <div className="campo">
                    <label htmlFor="perfil-nombre">NOMBRES</label>
                    <input
                      id="perfil-nombre"
                      value={datos.nombre}
                      onChange={(e) => cambiarDato('nombre', e.target.value)}
                    />
                  </div>

                  <div className="campo">
                    <label htmlFor="perfil-apellido">APELLIDOS</label>
                    <input
                      id="perfil-apellido"
                      value={datos.apellido}
                      onChange={(e) => cambiarDato('apellido', e.target.value)}
                    />
                  </div>

                  <div className="campo">
                    <label htmlFor="perfil-correo">CORREO INSTITUCIONAL</label>
                    <input
                      id="perfil-correo"
                      value={usuarioActual.correo}
                      disabled
                    />
                    <small>Para cambiarlo, escriba al comité organizador.</small>
                  </div>

                  <div className="campo">
                    <label htmlFor="perfil-institucion">INSTITUCIÓN</label>
                    <input
                      id="perfil-institucion"
                      value={datos.institucion}
                      onChange={(e) =>
                        cambiarDato('institucion', e.target.value)
                      }
                    />
                  </div>

                  <div className="campo">
                    <label htmlFor="perfil-carrera">CARRERA</label>
                    <input
                      id="perfil-carrera"
                      value={datos.carrera}
                      onChange={(e) => cambiarDato('carrera', e.target.value)}
                    />
                  </div>

                  <div className="campo">
                    <label htmlFor="perfil-codigo">CÓDIGO DE ALUMNO</label>
                    <input
                      id="perfil-codigo"
                      value={datos.codigo}
                      onChange={(e) => cambiarDato('codigo', e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="boton-principal">
                  Guardar mis datos
                </button>
              </form>

              {['revisor', 'ambos'].includes(usuarioActual.rol) && (
                <div className="panel-perfil">
                  <div className="fila-titulo">
                    <h2>Líneas de interés como revisor</h2>
                    <small>{intereses.length} de 6 seleccionadas</small>
                  </div>

                  <p className="texto-ayuda">
                    Las asignaciones priorizan sus líneas declaradas.
                  </p>

                  <div className="lista-intereses">
                    {ejesTematicos.map((eje) => (
                      <label key={eje.nombre}>
                        <input
                          type="checkbox"
                          checked={intereses.includes(eje.nombre)}
                          onChange={() => cambiarInteres(eje.nombre)}
                        />
                        {eje.nombre}
                      </label>
                    ))}
                  </div>

                  <button
                    className="boton-principal"
                    type="button"
                    onClick={guardarPerfil}
                  >
                    Guardar líneas de interés
                  </button>
                </div>
              )}
            </div>

            <div>
              <form className="panel-perfil" onSubmit={cambiarContrasena}>
                <h2>Cambiar contraseña</h2>

                <div className="campo">
                  <label htmlFor="perfil-actual">CONTRASEÑA ACTUAL</label>
                  <input
                    id="perfil-actual"
                    type="password"
                    value={contrasenaActual}
                    onChange={(e) => setContrasenaActual(e.target.value)}
                  />

                  {errores.contrasenaActual && (
                    <small className="texto-error">
                      {errores.contrasenaActual}
                    </small>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="perfil-nueva">NUEVA CONTRASEÑA</label>
                  <input
                    id="perfil-nueva"
                    type="password"
                    value={contrasenaNueva}
                    onChange={(e) => setContrasenaNueva(e.target.value)}
                  />
                  <small>
                    Mínimo 8 caracteres, con una mayúscula y un número.
                  </small>

                  {errores.contrasenaNueva && (
                    <small className="texto-error">
                      {errores.contrasenaNueva}
                    </small>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="perfil-confirmar">
                    CONFIRMAR NUEVA CONTRASEÑA
                  </label>
                  <input
                    id="perfil-confirmar"
                    type="password"
                    value={confirmarNueva}
                    onChange={(e) => setConfirmarNueva(e.target.value)}
                  />

                  {errores.confirmarNueva && (
                    <small className="texto-error">
                      {errores.confirmarNueva}
                    </small>
                  )}
                </div>

                <button className="boton-secundario" type="submit">
                  Actualizar contraseña
                </button>
              </form>

              <div className="panel-perfil">
                <h2>Mi actividad</h2>

                <p className="texto-ayuda">
                  Los datos de trabajos y revisiones se mostrarán cuando
                  se integren las otras historias del proyecto.
                </p>

                <p>Rol actual: <strong>{usuarioActual.rol}</strong></p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 1.6 ACCESO DENEGADO */}
      {pantalla === 'acceso-denegado' && (
        <section className="pantalla-error">
          <div className="icono-error">!</div>
          <h1>No tiene permiso para ver esta página</h1>

          <p>
            Esta sección requiere un rol autorizado. Si cree que debería
            tener acceso, solicite el cambio de rol al comité organizador.
          </p>

          <div className="botones-finales">
            <button
              type="button"
              className="boton-principal"
              onClick={() => irA(usuarioActual ? 'perfil' : 'login')}
            >
              {usuarioActual ? 'Volver a mi cuenta' : 'Iniciar sesión'}
            </button>

            <button
              type="button"
              className="boton-secundario"
              onClick={() => irA('inicio')}
            >
              Ir al inicio
            </button>
          </div>

          <small>Código de error: 403</small>
        </section>
      )}

      {/* SECCIONES QUE INTEGRARÁN TUS COMPAÑEROS */}
      {pantalla === 'pendiente' && (
        <section className="pantalla-error">
          <h1>Sección pendiente de integración</h1>

          <p>
            «{destinoPendiente}» pertenece a otra parte del proyecto.
            Este botón quedará conectado cuando el equipo integre
            sus pantallas.
          </p>

          <button
            type="button"
            className="boton-principal"
            onClick={() => irA('inicio')}
          >
            Volver al inicio
          </button>
        </section>
      )}

      {/* PANTALLA 404 PARA RUTAS NO RECONOCIDAS */}
      {![
        'inicio',
        'login',
        'registro',
        'bienvenida',
        'recuperar',
        'perfil',
        'acceso-denegado',
        'pendiente'
      ].includes(pantalla) && (
        <section className="pantalla-error">
          <span className="numero-404">404</span>
          <h1>No encontramos la página que busca</h1>

          <p>
            El enlace pudo cambiar o la página todavía no está publicada.
            Puede volver al inicio.
          </p>

          <button
            className="boton-principal"
            type="button"
            onClick={() => irA('inicio')}
          >
            Ir al inicio
          </button>
        </section>
      )}
    </Estructura>
  );
}

export default App;