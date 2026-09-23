
import { useState } from 'react';
import './App.css';

function App() {
  const [pantalla, setPantalla] = useState('inicio');

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [carrera, setCarrera] = useState('');
  const [rol, setRol] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [usuarioActual, setUsuarioActual] = useState(null);

  function obtenerUsuarios() {
    const datos = localStorage.getItem('usuariosCongreso');
    return datos ? JSON.parse(datos) : [];
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem('usuariosCongreso', JSON.stringify(usuarios));
  }

  function limpiarFormulario() {
    setNombre('');
    setApellido('');
    setCorreo('');
    setContrasena('');
    setInstitucion('');
    setCarrera('');
    setRol('');
  }

  function abrirRegistro() {
    limpiarFormulario();
    setMensaje('');
    setPantalla('registro');
  }

  function abrirLogin() {
    setCorreo('');
    setContrasena('');
    setMensaje('');
    setPantalla('login');
  }

  function registrarUsuario(evento) {
    evento.preventDefault();

    const usuarios = obtenerUsuarios();
    const correoNuevo = correo.trim().toLowerCase();

    const correoExiste = usuarios.some(
      (usuario) => usuario.correo === correoNuevo
    );

    if (correoExiste) {
      setMensaje('Ya existe una cuenta con ese correo.');
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      correo: correoNuevo,
      contrasena,
      institucion: institucion.trim(),
      carrera: carrera.trim(),
      rol
    };

    guardarUsuarios([...usuarios, nuevoUsuario]);

    limpiarFormulario();
    setMensaje('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
    setPantalla('login');
  }

  function iniciarSesion(evento) {
    evento.preventDefault();

    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
      (item) =>
        item.correo === correo.trim().toLowerCase() &&
        item.contrasena === contrasena
    );

    if (usuario) {
      setUsuarioActual(usuario);
      setMensaje('');
      setContrasena('');
      setPantalla('perfil');
    } else {
      setMensaje('Correo o contraseña incorrectos.');
    }
  }

  function abrirEditarPerfil() {
    setNombre(usuarioActual.nombre);
    setApellido(usuarioActual.apellido);
    setInstitucion(usuarioActual.institucion);
    setCarrera(usuarioActual.carrera);
    setMensaje('');
    setPantalla('editar');
  }

  function guardarPerfil(evento) {
    evento.preventDefault();

    const usuarioEditado = {
      ...usuarioActual,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      institucion: institucion.trim(),
      carrera: carrera.trim()
    };

    const usuarios = obtenerUsuarios();

    const usuariosActualizados = usuarios.map((usuario) =>
      usuario.id === usuarioActual.id ? usuarioEditado : usuario
    );

    guardarUsuarios(usuariosActualizados);
    setUsuarioActual(usuarioEditado);
    setMensaje('Tus datos se actualizaron correctamente.');
    setPantalla('perfil');
  }

  function recuperarContrasena(evento) {
    evento.preventDefault();

    const usuarios = obtenerUsuarios();
    const correoBuscado = correo.trim().toLowerCase();

    const usuarioExiste = usuarios.some(
      (usuario) => usuario.correo === correoBuscado
    );

    if (!usuarioExiste) {
      setMensaje('No se encontró una cuenta con ese correo.');
      return;
    }

    const usuariosActualizados = usuarios.map((usuario) => {
      if (usuario.correo === correoBuscado) {
        return { ...usuario, contrasena };
      }

      return usuario;
    });

    guardarUsuarios(usuariosActualizados);
    setContrasena('');
    setMensaje('Contraseña actualizada. Ya puedes iniciar sesión.');
    setPantalla('login');
  }

  function cerrarSesion() {
    setUsuarioActual(null);
    limpiarFormulario();
    setMensaje('');
    setPantalla('inicio');
  }

  return (
    <div>
      <h1>Congreso Académico Estudiantil</h1>

      {pantalla === 'inicio' && (
        <div>
          <p>Bienvenido a la plataforma del congreso.</p>

          <button onClick={abrirLogin}>Iniciar sesión</button>
          <button onClick={abrirRegistro}>Crear cuenta</button>
        </div>
      )}

      {pantalla === 'registro' && (
        <div>
          <h2>Crear cuenta</h2>

          <form onSubmit={registrarUsuario}>
            <input
              type="text"
              placeholder="Nombres"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <br />

            <input
              type="text"
              placeholder="Apellidos"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
            <br />

            <input
              type="email"
              placeholder="Correo institucional"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <br />

            <input
              type="password"
              placeholder="Contraseña (mínimo 6 caracteres)"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              minLength={6}
              required
            />
            <br />

            <input
              type="text"
              placeholder="Institución"
              value={institucion}
              onChange={(e) => setInstitucion(e.target.value)}
              required
            />
            <br />

            <input
              type="text"
              placeholder="Carrera"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              required
            />
            <br />

            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="">Selecciona tu participación</option>
              <option value="autor">Autor</option>
              <option value="revisor">Revisor</option>
              <option value="ambos">Autor y revisor</option>
            </select>
            <br />

            <button type="submit">Registrarme</button>
          </form>

          <button onClick={() => setPantalla('inicio')}>
            Volver
          </button>
        </div>
      )}

      {pantalla === 'login' && (
        <div>
          <h2>Iniciar sesión</h2>

          <form onSubmit={iniciarSesion}>
            <input
              type="email"
              placeholder="Correo institucional"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <br />

            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <br />

            <button type="submit">Ingresar</button>
          </form>

          <button
            onClick={() => {
              setCorreo('');
              setContrasena('');
              setMensaje('');
              setPantalla('recuperar');
            }}
          >
            Olvidé mi contraseña
          </button>

          <button onClick={() => setPantalla('inicio')}>
            Volver
          </button>
        </div>
      )}

      {pantalla === 'recuperar' && (
        <div>
          <h2>Recuperar contraseña</h2>

          <p>
            Versión de prueba: escribe el correo de tu cuenta y
            establece una contraseña nueva.
          </p>

          <form onSubmit={recuperarContrasena}>
            <input
              type="email"
              placeholder="Correo registrado"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <br />

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              minLength={6}
              required
            />
            <br />

            <button type="submit">Cambiar contraseña</button>
          </form>

          <button onClick={abrirLogin}>
            Volver a iniciar sesión
          </button>
        </div>
      )}

      {pantalla === 'perfil' && usuarioActual && (
        <div>
          <h2>Bienvenido, {usuarioActual.nombre}</h2>

          <p>Correo: {usuarioActual.correo}</p>
          <p>Institución: {usuarioActual.institucion}</p>
          <p>Carrera: {usuarioActual.carrera}</p>
          <p>Participación: {usuarioActual.rol}</p>

          <button onClick={abrirEditarPerfil}>
            Editar perfil
          </button>

          <button onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}

      {pantalla === 'editar' && usuarioActual && (
        <div>
          <h2>Editar perfil</h2>

          <form onSubmit={guardarPerfil}>
            <input
              type="text"
              placeholder="Nombres"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <br />

            <input
              type="text"
              placeholder="Apellidos"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
            <br />

            <input
              type="text"
              placeholder="Institución"
              value={institucion}
              onChange={(e) => setInstitucion(e.target.value)}
              required
            />
            <br />

            <input
              type="text"
              placeholder="Carrera"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              required
            />
            <br />

            <button type="submit">Guardar cambios</button>
          </form>

          <button onClick={() => setPantalla('perfil')}>
            Cancelar
          </button>
        </div>
      )}

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default App;