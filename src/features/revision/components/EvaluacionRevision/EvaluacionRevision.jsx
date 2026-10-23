import { useState } from 'react'
import './EvaluacionRevision.css'

const CRITERIOS = [
  { id: 'originalidad', nombre: 'Originalidad', peso: 25 },
  { id: 'rigor', nombre: 'Rigor metodológico', peso: 30 },
  { id: 'claridad', nombre: 'Claridad de la exposición', peso: 20 },
  { id: 'relevancia', nombre: 'Relevancia y aporte', peso: 25 },
]

const RECOMENDACIONES = ['Aceptar', 'Aceptar con observaciones', 'Rechazar']

// Cada recomendación usa su propio color de variables.css
const TONOS = {
  Aceptar: 'aceptar',
  'Aceptar con observaciones': 'observaciones',
  Rechazar: 'rechazar',
}

const PUNTAJES_VACIOS = {
  originalidad: '',
  rigor: '',
  claridad: '',
  relevancia: '',
}

const MENSAJE_PUNTAJE = 'Ingrese un puntaje entre 0 y 20.'

function esPuntajeValido(valor) {
  return (
    valor !== '' &&
    valor !== undefined &&
    valor !== null &&
    Number.isFinite(Number(valor)) &&
    Number(valor) >= 0 &&
    Number(valor) <= 20
  )
}

// Promedio ponderado solo con los criterios ya completados
function calcularPromedio(puntajes) {
  const validos = CRITERIOS.filter((c) => esPuntajeValido(puntajes[c.id]))
  const pesoTotal = validos.reduce((suma, c) => suma + c.peso, 0)
  const promedio =
    validos.length > 0
      ? (
          validos.reduce((suma, c) => suma + Number(puntajes[c.id]) * c.peso, 0) /
          pesoTotal
        ).toFixed(1)
      : '—'
  return { promedio, cantidad: validos.length }
}

function formatearBorrador(iso) {
  const fecha = new Date(iso)
  const dia = fecha.toLocaleDateString('es-PE')
  const hora = fecha.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${dia} a las ${hora}`
}

function textoPlazo(trabajo) {
  if (trabajo.estado === 'Vencida') {
    return `Venció el ${trabajo.fecha} · ${trabajo.detalle}`
  }
  return `Vence el ${trabajo.fecha} · ${trabajo.detalle}`
}

/* =========================================
   VISTA DE SOLO LECTURA (evaluación enviada)
   ========================================= */

function EvaluacionSoloLectura({ trabajo, evaluacion, onVolver }) {
  const puntajes = evaluacion?.puntajes ?? {}
  const comentariosCriterios = evaluacion?.comentariosCriterios ?? {}
  const recomendacion = evaluacion?.recomendacion ?? trabajo.detalle
  const { promedio } = calcularPromedio(puntajes)

  const momentoEnvio = trabajo.horaEnvio
    ? `${trabajo.fecha} · ${trabajo.horaEnvio}`
    : trabajo.fecha

  return (
    <main className="ev-page">
      <div className="ev-container">
        <div className="ev-banner" role="status">
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
            Evaluación enviada el {trabajo.fecha}
            {trabajo.horaEnvio ? ` a las ${trabajo.horaEnvio}` : ''}. Ya no
            admite cambios; si necesita corregirla, solicítelo al comité.
          </p>
        </div>

        <section className="ev-cabecera">
          <div className="ev-cabecera-main">
            <div className="ev-meta">
              <span className="ev-id">{trabajo.id}</span>
              <span className="ev-tag ev-tag-eje">{trabajo.eje}</span>
              <span className="ev-tag ev-tag-tipo">{trabajo.tipo}</span>
              <span className="ev-tag ev-tag-estado">Solo lectura</span>
            </div>
            <h1>{trabajo.titulo}</h1>
          </div>

          <div className="ev-cabecera-lado">
            <button
              type="button"
              className="ev-btn ev-btn-secundario"
              onClick={() =>
                window.alert(
                  'Vista demostrativa: el documento todavía no está conectado.',
                )
              }
            >
              Abrir documento
            </button>
            <span
              className={`ev-recomendacion-badge ev-opcion--${
                TONOS[recomendacion] ?? 'observaciones'
              }`}
            >
              Recomendación: {recomendacion.toLowerCase()}
            </span>
          </div>
        </section>

        <div className="ev-form">
          <section className="ev-principal">
            <div className="ev-tabla-wrapper">
              <table className="ev-tabla ev-tabla--lectura">
                <thead>
                  <tr>
                    <th>CRITERIO</th>
                    <th>PESO</th>
                    <th>PUNTAJE</th>
                    <th>COMENTARIO DEL CRITERIO</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIOS.map((criterio) => (
                    <tr key={criterio.id}>
                      <td className="ev-criterio-texto">{criterio.nombre}</td>
                      <td>{criterio.peso} %</td>
                      <td className="ev-puntaje-texto">
                        {puntajes[criterio.id] ?? '—'}
                      </td>
                      <td className="ev-comentario-texto">
                        {comentariosCriterios[criterio.id] || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ev-promedio">
              <span>Promedio ponderado</span>
              <strong>{promedio}</strong>
            </div>
          </section>

          <aside className="ev-lateral">
            <section className="ev-datos">
              <h2>DATOS DE LA ENTREGA</h2>
              <dl>
                <div>
                  <dt>Enviada</dt>
                  <dd>{momentoEnvio}</dd>
                </div>
                <div>
                  <dt>Fecha límite</dt>
                  <dd>{trabajo.fechaLimite ?? '—'}</dd>
                </div>
                <div>
                  <dt>Tiempo empleado</dt>
                  <dd>{trabajo.tiempoEmpleado ?? '—'}</dd>
                </div>
              </dl>
            </section>

            <p className="ev-aviso-lectura">
              Los campos se muestran como texto: en modo lectura no hay
              controles de edición ni botón de envío.
            </p>
          </aside>

          <section className="ev-comentarios">
            <article className="ev-lectura-card">
              <h2>COMENTARIOS AL AUTOR</h2>
              <p>{evaluacion?.comentariosAutor || '—'}</p>
            </article>

            <article className="ev-lectura-card">
              <h2>OBSERVACIONES AL COMITÉ (CONFIDENCIAL)</h2>
              <p>{evaluacion?.notasComite || '—'}</p>
            </article>
          </section>

          <div className="ev-lectura-pie">
            <button
              type="button"
              className="ev-btn ev-btn-secundario"
              onClick={onVolver}
            >
              Volver a la bandeja
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

/* =========================================
   FORMULARIO (trabajo pendiente o vencido)
   ========================================= */

function EvaluacionFormulario({
  trabajo,
  evaluacionGuardada,
  onVolver,
  onEnviar,
  onGuardarBorrador,
}) {
  const [puntajes, setPuntajes] = useState(
    evaluacionGuardada?.puntajes ?? PUNTAJES_VACIOS,
  )
  const [comentariosCriterios, setComentariosCriterios] = useState(
    evaluacionGuardada?.comentariosCriterios ?? {
      originalidad: '',
      rigor: '',
      claridad: '',
      relevancia: '',
    },
  )
  const [recomendacion, setRecomendacion] = useState(
    evaluacionGuardada?.recomendacion ?? '',
  )
  const [comentariosAutor, setComentariosAutor] = useState(
    evaluacionGuardada?.comentariosAutor ?? '',
  )
  const [notasComite, setNotasComite] = useState(
    evaluacionGuardada?.notasComite ?? '',
  )
  const [intentoEnvio, setIntentoEnvio] = useState(false)

  const { promedio, cantidad } = calcularPromedio(puntajes)
  const todosValidos = cantidad === CRITERIOS.length

  function errorPuntaje(id) {
    const valor = puntajes[id]
    if (valor === '') return intentoEnvio ? MENSAJE_PUNTAJE : ''
    return esPuntajeValido(valor) ? '' : MENSAJE_PUNTAJE
  }

  const errorRecomendacion = intentoEnvio && !recomendacion
  const errorComentarios = intentoEnvio && !comentariosAutor.trim()

  function obtenerEvaluacion() {
    return {
      puntajes,
      comentariosCriterios,
      recomendacion,
      comentariosAutor,
      notasComite,
      promedio,
      borradorGuardado: new Date().toISOString(),
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    setIntentoEnvio(true)

    if (!todosValidos || !recomendacion || !comentariosAutor.trim()) return

    onEnviar(obtenerEvaluacion())
  }

  return (
    <main className="ev-page">
      <div className="ev-container">
        <div className="ev-breadcrumb">
          <button type="button" onClick={onVolver}>
            Mi bandeja
          </button>
          <span>›</span>
          <button type="button" onClick={onVolver}>
            {trabajo.id}
          </button>
          <span>›</span>
          <span>Evaluación</span>
        </div>

        <section className="ev-cabecera">
          <div className="ev-cabecera-main">
            <div className="ev-meta">
              <span className="ev-id">{trabajo.id}</span>
              <span className="ev-tag ev-tag-eje">{trabajo.eje}</span>
              <span className="ev-tag ev-tag-tipo">{trabajo.tipo}</span>
            </div>
            <h1>{trabajo.titulo}</h1>
            <p className="ev-resumen">{trabajo.resumen}</p>
          </div>

          <div className="ev-cabecera-lado">
            <button
              type="button"
              className="ev-btn ev-btn-secundario"
              onClick={() =>
                window.alert(
                  'Vista demostrativa: el documento todavía no está conectado.',
                )
              }
            >
              Abrir documento
            </button>
            <div className="ev-plazo">
              <strong className={`ev-plazo-${trabajo.estado.toLowerCase()}`}>
                {textoPlazo(trabajo)}
              </strong>
              <span>Revisión ciega: no verá los nombres de los autores.</span>
            </div>
          </div>
        </section>

        <form className="ev-form" onSubmit={manejarEnvio} noValidate>
          <section className="ev-principal">
            <div className="ev-tabla-wrapper">
              <table className="ev-tabla">
                <thead>
                  <tr>
                    <th>CRITERIO</th>
                    <th>PESO</th>
                    <th>PUNTAJE (0–20)</th>
                    <th>COMENTARIO DEL CRITERIO</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIOS.map((criterio) => {
                    const error = errorPuntaje(criterio.id)
                    return (
                      <tr key={criterio.id}>
                        <td className="ev-criterio-nombre">
                          <label htmlFor={`puntaje-${criterio.id}`}>
                            {criterio.nombre}
                          </label>
                        </td>
                        <td className="ev-criterio-peso">{criterio.peso} %</td>
                        <td>
                          <input
                            id={`puntaje-${criterio.id}`}
                            className={`ev-puntaje ${error ? 'invalido' : ''}`}
                            type="number"
                            min="0"
                            max="20"
                            step="1"
                            placeholder="—"
                            value={puntajes[criterio.id]}
                            aria-invalid={error ? 'true' : 'false'}
                            onChange={(e) =>
                              setPuntajes((actuales) => ({
                                ...actuales,
                                [criterio.id]: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <textarea
                            className="ev-observacion"
                            rows="1"
                            placeholder="Escriba su comentario..."
                            aria-label={`Comentario de ${criterio.nombre}`}
                            value={comentariosCriterios[criterio.id] ?? ''}
                            onChange={(e) =>
                              setComentariosCriterios((actuales) => ({
                                ...actuales,
                                [criterio.id]: e.target.value,
                              }))
                            }
                          />
                          {error && (
                            <span className="ev-error" role="alert">
                              {error}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="ev-promedio">
              <span>
                Promedio ponderado provisional ({cantidad} de{' '}
                {CRITERIOS.length} criterios)
              </span>
              <strong>{promedio}</strong>
            </div>
          </section>

          <aside className="ev-lateral">
            <fieldset className="ev-recomendacion">
              <legend>RECOMENDACIÓN *</legend>
              {RECOMENDACIONES.map((opcion) => (
                <label
                  key={opcion}
                  className={`ev-opcion ev-opcion--${TONOS[opcion]} ${
                    recomendacion === opcion ? 'seleccionada' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="recomendacion"
                    value={opcion}
                    checked={recomendacion === opcion}
                    onChange={() => setRecomendacion(opcion)}
                  />
                  {opcion}
                </label>
              ))}
              {errorRecomendacion && (
                <span className="ev-error" role="alert">
                  Seleccione una recomendación.
                </span>
              )}
            </fieldset>

            <p className="ev-aviso">
              Los comentarios al autor se publican con el dictamen. Las
              observaciones al comité son confidenciales.
            </p>
          </aside>

          <section className="ev-comentarios">
            <div className="ev-campo">
              <label htmlFor="comentarios-autor">COMENTARIOS AL AUTOR *</label>
              <textarea
                id="comentarios-autor"
                rows="4"
                value={comentariosAutor}
                aria-invalid={errorComentarios ? 'true' : 'false'}
                className={errorComentarios ? 'invalido' : ''}
                onChange={(e) => setComentariosAutor(e.target.value)}
              />
              {errorComentarios && (
                <span className="ev-error" role="alert">
                  Escriba los comentarios para el autor.
                </span>
              )}
            </div>

            <div className="ev-campo">
              <label htmlFor="notas-comite">
                OBSERVACIONES AL COMITÉ (CONFIDENCIAL)
              </label>
              <textarea
                id="notas-comite"
                rows="4"
                value={notasComite}
                onChange={(e) => setNotasComite(e.target.value)}
              />
            </div>
          </section>

          <footer className="ev-footer">
            <p>
              {evaluacionGuardada?.borradorGuardado
                ? `Borrador guardado el ${formatearBorrador(
                    evaluacionGuardada.borradorGuardado,
                  )}`
                : 'Aún no has guardado un borrador.'}
            </p>

            <div className="ev-acciones">
              <button
                type="button"
                className="ev-btn ev-btn-secundario"
                onClick={() => onGuardarBorrador(obtenerEvaluacion())}
              >
                Guardar borrador
              </button>
              <button type="submit" className="ev-btn ev-btn-primario">
                Enviar recomendación
              </button>
            </div>
          </footer>
        </form>
      </div>
    </main>
  )
}

function EvaluacionRevision(props) {
  if (props.trabajo.estado === 'Entregada') {
    return (
      <EvaluacionSoloLectura
        trabajo={props.trabajo}
        evaluacion={props.evaluacionGuardada}
        onVolver={props.onVolver}
      />
    )
  }

  return <EvaluacionFormulario {...props} />
}

export default EvaluacionRevision
