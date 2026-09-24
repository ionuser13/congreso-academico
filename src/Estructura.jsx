import './Estructura.css';

function Estructura({ children, usuario, irA, cerrarSesion }) {
  const esAutor = usuario && (usuario.rol === 'autor' || usuario.rol === 'ambos');
  const esRevisor = usuario && (usuario.rol === 'revisor' || usuario.rol === 'ambos');

  return (
    <div className="pagina">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <button className="marca" onClick={() => irA('inicio')} type="button">
            <span className="marca-letra" translate="no">C</span>

            <span className="marca-texto">
              <strong>Congreso Académico Estudiantil</strong>
              <small>UNIVERSIDAD DE LIMA · EDICIÓN 2026</small>
            </span>
          </button>

          <div className="estado-edicion">
            <span>ESTADO DE LA EDICIÓN</span>
            <strong>Recepción abierta</strong>
          </div>
        </div>
      </header>

      <nav className="navegacion">
        <div className="navegacion-contenido">
          <div className="nav-principal">
            <button type="button" onClick={() => irA('inicio')}>
              Inicio
            </button>

            {!usuario ? (
              <>
                <button type="button" onClick={() => irA('bases')}>
                  Bases del congreso
                </button>
                <button type="button" onClick={() => irA('ejes')}>
                  Ejes temáticos
                </button>
                <button type="button" onClick={() => irA('programa')}>
                  Programa
                </button>
              </>
            ) : (
              <>
                {esAutor && (
                  <>
                    <button type="button" onClick={() => irA('nuevo-trabajo')}>
                      Nuevo trabajo
                    </button>
                    <button type="button" onClick={() => irA('mis-trabajos')}>
                      Mis trabajos
                    </button>
                    <button type="button" onClick={() => irA('presentacion')}>
                      Mi presentación
                    </button>
                  </>
                )}

                {esRevisor && (
                  <button type="button" onClick={() => irA('bandeja')}>
                    Mi bandeja
                  </button>
                )}

                <button type="button" onClick={() => irA('perfil')}>
                  Mi cuenta
                </button>
              </>
            )}
          </div>

          <div className="nav-cuenta">
            {!usuario ? (
              <>
                <button
                  className="nav-ingresar"
                  type="button"
                  onClick={() => irA('login')}
                >
                  Iniciar sesión
                </button>

                <button
                  className="nav-crear"
                  type="button"
                  onClick={() => irA('registro')}
                >
                  Crear cuenta
                </button>
              </>
            ) : (
              <>
                <span className="nav-usuario">
                  <strong>{usuario.nombre} {usuario.apellido}</strong>
                  <small>Rol: {usuario.rol}</small>
                </span>

                <button
                  className="nav-salir"
                  type="button"
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="contenido">
        {children}
      </main>

      <footer className="pie-pagina">
        <div className="pie-contenido">
          <div>
            <h3>Congreso Académico Estudiantil</h3>
            <p>
              Facultad de Ingeniería · Universidad de Lima.
              Av. Javier Prado Este 4600, Santiago de Surco, Lima.
            </p>
          </div>

          <div>
            <h4>EL CONGRESO</h4>
            <button type="button" onClick={() => irA('bases')}>
              Bases y requisitos
            </button>
            <button type="button" onClick={() => irA('ejes')}>
              Ejes temáticos
            </button>
            <button type="button" onClick={() => irA('programa')}>
              Programa
            </button>
          </div>

          <div>
            <h4>PARTICIPANTES</h4>
            <button type="button" onClick={() => irA('guia-autores')}>
              Guía para autores
            </button>
            <button type="button" onClick={() => irA('guia-revisores')}>
              Guía para revisores
            </button>
            <button type="button" onClick={() => irA('preguntas')}>
              Preguntas frecuentes
            </button>
          </div>

          <div>
            <h4>CONTACTO</h4>
            <p>congreso@ulima.edu.pe</p>
            <p>(01) 437 6767 anexo 30450</p>
          </div>
        </div>

        <div className="pie-inferior">
          <span>© 2026 Universidad de Lima. Todos los derechos reservados.</span>
          <span>Términos de uso · Política de privacidad</span>
        </div>
      </footer>
    </div>
  );
}

export default Estructura;