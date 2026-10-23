import { Link } from 'react-router-dom';
import '../auth.css';

// 1.6 Página no encontrada (404). Se usa con la barra del rol activo cuando
// el usuario tiene sesión iniciada (la barra es del módulo compartido).
export default function NoEncontradaPage() {
  return (
    <div className="auth-pagina auth-pagina--centrada">
      <section className="estado-error">
        <p className="estado-error__codigo" aria-hidden="true">404</p>
        <h1 className="estado-error__titulo">No encontramos la página que busca</h1>
        <p className="estado-error__texto">
          El enlace pudo cambiar o el trabajo ya no está publicado. Puede volver al inicio o
          consultar el programa del congreso.
        </p>
        <div className="auth-acciones auth-acciones--centro">
          <Link to="/" className="auth-boton auth-boton--primario">
            Ir al inicio
          </Link>
          <Link to="/programa" className="auth-boton auth-boton--secundario">
            Ver el programa
          </Link>
        </div>
      </section>
    </div>
  );
}
