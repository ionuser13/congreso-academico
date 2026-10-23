import { Link, useLocation, useNavigate } from 'react-router-dom';
import './PiePagina.css';

// Componente común: pie de página idéntico en todas las vistas (mockups).
export default function PiePagina() {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="footerContainer">
      <footer className="pie">
        <div className="pie__contenido">
          <div className="pie__marca subtituloInterfaz">
            <h2>Congreso Académico Estudiantil</h2>
            <p>
              Facultad de Ingeniería · Universidad de Lima. Av. Javier Prado Este 4600, Santiago de
              Surco, Lima.
            </p>
          </div>

          <div className="pie__columna">
            <h3 className="etiqueta">El congreso</h3>
            <button type="button" onClick={() => irASeccion('bases')}>Bases y requisitos</button>
            <button type="button" onClick={() => irASeccion('ejes')}>Ejes temáticos</button>
            <Link to="/programa">Programa</Link>
          </div>

          <div className="pie__columna">
            <h3 className="etiqueta">Participantes</h3>
            <Link to="/guia-autores">Guía para autores</Link>
            <Link to="/guia-revisores">Guía para revisores</Link>
            <Link to="/preguntas-frecuentes">Preguntas frecuentes</Link>
          </div>

          <div className="pie__columna">
            <h3 className="etiqueta">Contacto</h3>
            <a href="mailto:congreso@ulima.edu.pe">congreso@ulima.edu.pe</a>
            <span>(01) 437 6767 anexo 30450</span>
          </div>
        </div>

        <div className="pie__inferior">
          <span>© 2026 Universidad de Lima. Todos los derechos reservados.</span>
          <span className="pie__legales">
            <Link to="/terminos">Términos de uso</Link>
            <Link to="/privacidad">Política de privacidad</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
