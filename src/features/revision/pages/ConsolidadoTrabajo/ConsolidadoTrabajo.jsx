import { useState } from 'react'
import DecisionFinalModal from '../../components/DecisionFinalModal/DecisionFinalModal'
import './ConsolidadoTrabajo.css'

const CRITERIOS = [
  { id: 'originalidad', nombre: 'Originalidad', peso: 25 },
  { id: 'rigor', nombre: 'Rigor', peso: 30 },
  { id: 'claridad', nombre: 'Claridad', peso: 20 },
  { id: 'relevancia', nombre: 'Relevancia', peso: 25 },
]

// Cada recomendación usa su propio color de variables.css
const TONOS = {
  Aceptar: 'aceptar',
  'Aceptar con observaciones': 'observaciones',
  Rechazar: 'rechazar',
}

/* Datos de ejemplo (todavía no hay base de datos) */
const TRABAJO_DEMO = {
  id: 'TRB-2026-042',
  titulo:
    'Predicción de deserción universitaria mediante aprendizaje supervisado',
  eje: 'Inteligencia artificial y datos',
  tipo: 'Artículo completo',
  autores: 'Rosa Quispe Ttito y 2 coautores',
  revisoresAsignados: 3,
  fortalezas: 'la relevancia del problema y la claridad de la exposición',
}

const REVISIONES_DEMO = [
  {
    etiqueta: 'Revisor 1',
    nombre: 'Mg. Luis Ramirez',
    puntajes: { originalidad: 17, rigor: 15, claridad: 18, relevancia: 17 },
    recomendacion: 'Aceptar con observaciones',
    comentarioAutor:
      'Reforzar la validación del modelo y detallar el tratamiento de datos faltantes.',
    observacion:
      'reforzar la validación del modelo y el tratamiento de datos faltantes',
    fechaEntrega: '10/10/2026',
  },
  {
    etiqueta: 'Revisor 2',
    nombre: 'Dr. Óscar Nakamura',
    puntajes: { originalidad: 18, rigor: 17, claridad: 17, relevancia: 18 },
    recomendacion: 'Aceptar',
    comentarioAutor:
      'Trabajo bien fundamentado; conviene ampliar la discusión de resultados por cohorte.',
    observacion: 'ampliar la discusión de resultados por cohorte',
    fechaEntrega: '12/10/2026',
  },
  {
    etiqueta: 'Revisor 3',
    nombre: 'Mg. Carmen Effio',
    puntajes: { originalidad: 15, rigor: 14, claridad: 15, relevancia: 14 },
    recomendacion: 'Aceptar',
    comentarioAutor:
      'Precisar el periodo de los registros académicos y la política de privacidad aplicada.',
    observacion:
      'precisar el periodo de los registros académicos y la política de privacidad aplicada',
    fechaEntrega: '14/10/2026',
  },
]

/* Cálculos */

// Suma de puntaje × peso (los pesos suman 100, así que suma / 100 es el promedio)
function sumaPonderada(puntajes) {
  return CRITERIOS.reduce((suma, c) => suma + puntajes[c.id] * c.peso, 0)
}

// Se redondea con enteros para evitar errores de coma flotante (14.45 → 14.5)
function ponderado(puntajes) {
  return Math.round(sumaPonderada(puntajes) / 10) / 10
}

function media(valores) {
  return valores.reduce((suma, valor) => suma + valor, 0) / valores.length
}

function parsearFecha(texto) {
  const [dia, mes, anio] = texto.split('/').map(Number)
  return new Date(anio, mes - 1, dia)
}

function ConsolidadoTrabajo({
  trabajo = TRABAJO_DEMO,
  revisiones = REVISIONES_DEMO,
  onVolver,
  onVerDocumento,
  onPublicarDecision,
}) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [borrador, setBorrador] = useState(null)
  const [decisionPublicada, setDecisionPublicada] = useState(null)

  const ponderados = revisiones.map((r) => ponderado(r.puntajes))

  const promedioGeneral = media(
    revisiones.map((r) => sumaPonderada(r.puntajes) / 100),
  )
  const dispersion = Math.max(...ponderados) - Math.min(...ponderados)

  const aceptan = revisiones.filter((r) => r.recomendacion === 'Aceptar').length
  const conObservaciones = revisiones.filter(
    (r) => r.recomendacion === 'Aceptar con observaciones',
  ).length

  // La decisión que se propone al abrir la ventana sigue a la mayoría de revisores
  const decisionSugerida =
    aceptan + conObservaciones > revisiones.length / 2 ? 'Aceptar' : 'Rechazar'

  const ultimaEntrega = revisiones
    .map((r) => parsearFecha(r.fechaEntrega))
    .reduce((a, b) => (a > b ? a : b))
  const ultimaDiaMes = ultimaEntrega.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
  })

  function cerrarModal() {
    setModalAbierto(false)
  }

  function guardarBorrador(datos) {
    setBorrador(datos)
    setModalAbierto(false)
  }

  function publicar(datos) {
    setDecisionPublicada(datos)
    setBorrador(null)
    setModalAbierto(false)
    onPublicarDecision?.(datos)
  }

  // Al registrar la decisión se muestra un resumen corto detrás de la ventana
  if (modalAbierto) {
    return (
      <main className="co-page">
        <div className="co-container">
          <h1 className="co-titulo-compacto">Consolidado · {trabajo.id}</h1>

          <section className="co-tabla-card">
            <div className="co-tabla-wrapper">
              <table className="co-tabla co-tabla--compacta">
                <thead>
                  <tr>
                    <th>REVISOR</th>
                    <th className="co-centro">PONDERADO</th>
                    <th className="co-num">RECOMENDACIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {revisiones.map((revision, indice) => (
                    <tr key={revision.etiqueta}>
                      <td className="co-revisor">
                        {revision.etiqueta} · {revision.nombre}
                      </td>
                      <td className="co-centro co-ponderado">
                        {ponderados[indice].toFixed(1)}
                      </td>
                      <td className="co-num">{revision.recomendacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <DecisionFinalModal
          trabajo={trabajo}
          revisiones={revisiones}
          promedio={promedioGeneral.toFixed(1)}
          decisionInicial={decisionSugerida}
          borrador={borrador}
          onCancelar={cerrarModal}
          onGuardarBorrador={guardarBorrador}
          onPublicar={publicar}
        />
      </main>
    )
  }

  return (
    <main className="co-page">
      <div className="co-container">
        <div className="co-breadcrumb">
          <button type="button" onClick={onVolver}>
            Trabajos recibidos
          </button>
          <span>›</span>
          <button type="button" onClick={onVolver}>
            {trabajo.id}
          </button>
          <span>›</span>
          <span>Consolidado</span>
        </div>

        {decisionPublicada && (
          <div className="co-banner" role="status">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="10" fill="currentColor" />
              <path
                d="M5.5 10.5l3 3 6-6.5"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>
              Decisión final publicada: {decisionPublicada.decision}. El autor
              de correspondencia recibirá un correo con el resultado.
            </p>
          </div>
        )}

        <header className="co-cabecera">
          <div className="co-cabecera-main">
            <div className="co-meta">
              <span className="co-id">{trabajo.id}</span>
              {decisionPublicada ? (
                <span
                  className={`co-badge co-tono--${
                    TONOS[decisionPublicada.decision]
                  }`}
                >
                  Decisión publicada · {decisionPublicada.decision}
                </span>
              ) : (
                <span className="co-estado">
                  En revisión · {revisiones.length} de{' '}
                  {trabajo.revisoresAsignados} entregadas
                </span>
              )}
            </div>
            <h1>{trabajo.titulo}</h1>
            <p className="co-detalle">
              {trabajo.eje} · {trabajo.tipo} · {trabajo.autores}
            </p>
          </div>

          <div className="co-lado">
            <div className="co-acciones">
              <button
                type="button"
                className="co-btn co-btn-secundario"
                onClick={
                  onVerDocumento ??
                  (() =>
                    window.alert(
                      'Vista demostrativa: el documento todavía no está conectado.',
                    ))
                }
              >
                Ver documento
              </button>
              <button
                type="button"
                className="co-btn co-btn-primario"
                disabled={Boolean(decisionPublicada)}
                onClick={() => setModalAbierto(true)}
              >
                {decisionPublicada
                  ? 'Decisión publicada'
                  : 'Registrar decisión final'}
              </button>
            </div>
            {borrador && !decisionPublicada && (
              <p className="co-borrador">Borrador de decisión guardado</p>
            )}
          </div>
        </header>

        <section className="co-resumen" aria-label="Resumen del consolidado">
          <article className="co-stat co-stat--primario">
            <span>PUNTAJE PROMEDIO</span>
            <strong>{promedioGeneral.toFixed(1)}</strong>
            <small>de 20</small>
          </article>

          <article className="co-stat co-stat--acento">
            <span>DISPERSIÓN</span>
            <strong>{dispersion.toFixed(1)}</strong>
            <small>diferencia máx.</small>
          </article>

          <article className="co-stat co-stat--exito">
            <span>RECOMIENDAN ACEPTAR</span>
            <strong>
              {aceptan} de {revisiones.length}
            </strong>
            <small>{conObservaciones} con observaciones</small>
          </article>

          <article className="co-stat co-stat--info">
            <span>ÚLTIMA ENTREGA</span>
            <strong>{ultimaDiaMes}</strong>
            <small>{ultimaEntrega.getFullYear()}</small>
          </article>
        </section>

        <section className="co-tabla-card">
          <div className="co-tabla-wrapper">
            <table className="co-tabla">
              <thead>
                <tr>
                  <th>REVISOR</th>
                  {CRITERIOS.map((c) => (
                    <th key={c.id} className="co-num">
                      {c.nombre.toUpperCase()} {c.peso} %
                    </th>
                  ))}
                  <th className="co-num">PONDERADO</th>
                  <th className="co-num">RECOMENDACIÓN</th>
                </tr>
              </thead>
              <tbody>
                {revisiones.map((revision, indice) => (
                  <tr key={revision.etiqueta}>
                    <td className="co-revisor">
                      {revision.etiqueta} · {revision.nombre}
                    </td>
                    {CRITERIOS.map((c) => (
                      <td key={c.id} className="co-num">
                        {revision.puntajes[c.id]}
                      </td>
                    ))}
                    <td className="co-num co-ponderado">
                      {ponderados[indice].toFixed(1)}
                    </td>
                    <td className="co-num">
                      <span
                        className={`co-badge co-tono--${
                          TONOS[revision.recomendacion] ?? 'observaciones'
                        }`}
                      >
                        {revision.recomendacion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="co-revisor">Promedio por criterio</td>
                  {CRITERIOS.map((c) => (
                    <td key={c.id} className="co-num">
                      {media(revisiones.map((r) => r.puntajes[c.id])).toFixed(1)}
                    </td>
                  ))}
                  <td className="co-num co-ponderado co-ponderado-total">
                    {promedioGeneral.toFixed(1)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section className="co-comentarios">
          <h2>Comentarios al autor reunidos</h2>
          <div className="co-comentarios-grid">
            {revisiones.map((revision) => (
              <article key={revision.etiqueta} className="co-comentario">
                <span>{revision.etiqueta.toUpperCase()}</span>
                <p>{revision.comentarioAutor}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

    </main>
  )
}

export default ConsolidadoTrabajo
