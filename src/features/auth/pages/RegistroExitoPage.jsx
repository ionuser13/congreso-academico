import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerEdicionPublica } from '../services/lecturaCompartida';
import AvisoAuth from '../components/AvisoAuth';
import '../auth.css';

// Contenido de bienvenida por rol. Los pasos siguen el mapa de navegación
// del documento de mockups (página 4).
function contenidoPorRol(rol, cierre) {
  const textoCierre = cierre
    ? ` La recepción cierra el ${cierre.fecha} a las ${cierre.hora}; después de esa fecha los envíos quedan en modo lectura.`
    : '';

  if (rol === 'revisor') {
    return {
      cuenta: 'revisor',
      texto: 'Declare sus líneas de interés para que el comité le asigne trabajos sin conflicto.',
      principal: { ruta: '/mi-cuenta', etiqueta: 'Declarar mis líneas de interés' },
      secundario: { ruta: '/bandeja', etiqueta: 'Ir a mi bandeja' },
      pasos: [
        ['1. Líneas de interés', 'Indique los ejes temáticos en los que desea revisar.'],
        ['2. Mi bandeja', 'Consulte los trabajos asignados y su fecha límite.'],
        ['3. Recomendación', 'Evalúe por criterios y envíe su recomendación al comité.'],
      ],
    };
  }

  if (rol === 'comite') {
    return {
      cuenta: 'del comité organizador',
      texto: 'Ya puede configurar la edición, asignar revisores y publicar las decisiones.',
      principal: { ruta: '/configuracion', etiqueta: 'Ir a la configuración' },
      secundario: { ruta: '/mi-cuenta', etiqueta: 'Completar mi perfil' },
      pasos: [
        ['1. Configuración', 'Edición, ejes, tipos de trabajo, fechas y criterios.'],
        ['2. Asignación', 'Asigne revisores a los trabajos recibidos.'],
        ['3. Decisión final', 'Consolide las revisiones y publique el dictamen.'],
      ],
    };
  }

  return {
    cuenta: rol === 'ambos' ? 'de autor y revisor' : 'de autor',
    texto: `Ya puede registrar sus trabajos.${textoCierre}`,
    principal: { ruta: '/trabajos/nuevo', etiqueta: 'Registrar mi primer trabajo' },
    secundario: { ruta: '/mi-cuenta', etiqueta: 'Completar mi perfil' },
    pasos: [
      ['1. Datos del trabajo', 'Título, tipo, eje temático, resumen y palabras clave.'],
      ['2. Coautores', 'Declare a sus coautores y al autor de correspondencia.'],
      ['3. Envío', 'Adjunte el enlace al documento y envíe antes del cierre.'],
    ],
  };
}

// 1.3 Registro — éxito. Tras el registro la sesión inicia con el rol elegido.
export default function RegistroExitoPage() {
  const { usuario } = useAuth();
  const edicion = obtenerEdicionPublica();
  const contenido = contenidoPorRol(usuario.rol, edicion?.cierreRecepcion);

  return (
    <div className="auth-pagina">
      <div className="auth-contenedor">
        <AvisoAuth tipo="exito">
          Cuenta creada correctamente. Le enviamos un correo de verificación a {usuario.correo}.
        </AvisoAuth>

        <section className="auth-tarjeta exito-bienvenida">
          <p className="auth-etiqueta">Bienvenida</p>
          <h1 className="auth-titulo">
            {usuario.nombres} {usuario.apellidos}, su cuenta {contenido.cuenta} está activa
          </h1>
          <p className="exito-bienvenida__texto">{contenido.texto}</p>
          <div className="auth-acciones auth-acciones--inicio">
            <Link to={contenido.principal.ruta} className="auth-boton auth-boton--primario">
              {contenido.principal.etiqueta}
            </Link>
            <Link to={contenido.secundario.ruta} className="auth-boton auth-boton--secundario">
              {contenido.secundario.etiqueta}
            </Link>
          </div>
        </section>

        <div className="exito-pasos">
          {contenido.pasos.map(([titulo, descripcion]) => (
            <article key={titulo} className="exito-paso">
              <h2>{titulo}</h2>
              <p>{descripcion}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
