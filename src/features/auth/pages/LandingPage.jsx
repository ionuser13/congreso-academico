import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { esAutor } from '../utils/roles';
import { obtenerEdicionPublica } from '../services/lecturaCompartida';
import '../auth.css';

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function etiquetaConvocatoria({ inicio, fin }) {
  const [anio, mes, diaInicio] = inicio.split('-');
  const diaFin = fin.split('-')[2];
  return `Convocatoria abierta · Lima, ${Number(diaInicio)} y ${Number(diaFin)} de ${MESES[Number(mes) - 1]} de ${anio}`;
}

// 1.1 Landing y bases del congreso — vista de visitante.
export default function LandingPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const edicion = obtenerEdicionPublica();

  // «Enviar mi trabajo» lleva a inicio de sesión (1.2); con sesión de autor, al formulario (HU-3).
  const enviarTrabajo = () => navigate(esAutor(usuario) ? '/trabajos/nuevo' : '/login');

  const irABases = () =>
    document.getElementById('bases')?.scrollIntoView({ behavior: 'smooth' });

  if (!edicion) {
    return (
      <div className="auth-pagina">
        <p className="auth-vacio">No hay una edición publicada todavía.</p>
      </div>
    );
  }

  return (
    <div className="auth-pagina auth-pagina--sin-margen">
      <section className="landing-hero">
        <div className="auth-contenedor landing-hero__interior">
          <div>
            <p className="landing-hero__etiqueta">{etiquetaConvocatoria(edicion.diasCongreso)}</p>
            <h1 className="landing-hero__titulo">{edicion.nombre}</h1>
            <p className="landing-hero__texto">
              Presenta tu investigación ante el comité y la comunidad universitaria.
              Recibimos artículos completos, resúmenes extendidos, pósteres y casos de
              estudio en seis ejes temáticos.
            </p>
          </div>
          <div className="landing-hero__acciones">
            <button type="button" className="auth-boton auth-boton--acento" onClick={enviarTrabajo}>
              Enviar mi trabajo
            </button>
            <button type="button" className="auth-boton auth-boton--contorno-claro" onClick={irABases}>
              Descargar las bases
            </button>
          </div>
        </div>
      </section>

      <div className="auth-contenedor landing-cuerpo">
        <section id="ejes" aria-labelledby="titulo-ejes">
          <div className="landing-fila-titulo">
            <h2 id="titulo-ejes" className="auth-titulo-seccion">Ejes temáticos</h2>
            <button type="button" className="auth-enlace" onClick={irABases}>
              Ver bases completas
            </button>
          </div>
          {edicion.ejes.length === 0 ? (
            <p className="auth-vacio">Aún no se han publicado los ejes temáticos.</p>
          ) : (
            <div className="landing-ejes">
              {edicion.ejes.map((eje) => (
                <article key={eje.id} className="landing-eje">
                  <h3>{eje.nombre}</h3>
                  <p>{eje.descripcion}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="bases" className="landing-bases">
          <div>
            <h2 className="auth-titulo-seccion">Fechas límite</h2>
            <dl className="landing-tabla">
              {edicion.fechas.map((f) => (
                <div key={f.etiqueta}>
                  <dt>{f.etiqueta}</dt>
                  <dd>{f.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="auth-titulo-seccion">Criterios de evaluación</h2>
            {edicion.criterios.length === 0 ? (
              <p className="auth-vacio">Aún no se han publicado los criterios.</p>
            ) : (
              <dl className="landing-tabla landing-tabla--criterios">
                {edicion.criterios.map((c) => (
                  <div key={c.id}>
                    <dt>{c.nombre}</dt>
                    <dd>{c.pesoPorcentaje} %</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
