import { useState } from 'react'
import EvaluacionRevision from '../../components/EvaluacionRevision/EvaluacionRevision'
import './RevisionDictamen.css'

const trabajosIniciales = [
  {
    id: 'TRB-2026-042',
    titulo:
      'Predicción de deserción universitaria mediante aprendizaje supervisado',
    resumen:
      'Se evalúan tres modelos supervisados para anticipar el abandono de estudios en una universidad privada de Lima, usando registros de cinco cohortes.',
    eje: 'Inteligencia artificial y datos',
    tipo: 'Artículo completo',
    estado: 'Pendiente',
    fecha: '15/10/2026',
    fechaLimite: '15/10/2026',
    detalle: 'faltan 3 días',
  },
  {
    id: 'TRB-2026-053',
    titulo: 'Bienestar emocional y rendimiento académico en primeros ciclos',
    resumen:
      'Estudio con estudiantes de primer y segundo ciclo que relaciona indicadores de bienestar emocional con su rendimiento académico durante el semestre.',
    eje: 'Salud y sociedad',
    tipo: 'Póster',
    estado: 'Vencida',
    fecha: '09/10/2026',
    fechaLimite: '09/10/2026',
    detalle: 'hace 3 días',
  },
  {
    id: 'TRB-2026-031',
    titulo: 'Refactorización guiada por métricas de deuda técnica',
    resumen:
      'Propuesta de refactorización priorizada por métricas de deuda técnica, aplicada a tres repositorios de proyectos universitarios.',
    eje: 'Ingeniería de software',
    tipo: 'Artículo completo',
    estado: 'Entregada',
    fecha: '06/10/2026',
    horaEnvio: '11:05',
    fechaLimite: '18/10/2026',
    tiempoEmpleado: '4 días',
    detalle: 'Aceptar con observaciones',
  },
  {
    id: 'TRB-2026-051',
    titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus',
    resumen:
      'Evaluación del uso de agua reciclada para el riego de áreas verdes del campus, con mediciones de consumo y calidad durante un semestre.',
    eje: 'Sostenibilidad y ciudad',
    tipo: 'Resumen extendido',
    estado: 'Entregada',
    fecha: '04/10/2026',
    horaEnvio: '16:40',
    fechaLimite: '18/10/2026',
    tiempoEmpleado: '3 días',
    detalle: 'Aceptar',
  },
  {
    id: 'TRB-2026-035',
    titulo: 'Pruebas automatizadas en proyectos universitarios de software',
    resumen:
      'Análisis de la adopción de pruebas automatizadas en proyectos de software desarrollados en cursos universitarios.',
    eje: 'Ingeniería de software',
    tipo: 'Resumen extendido',
    estado: 'Entregada',
    fecha: '02/10/2026',
    horaEnvio: '09:15',
    fechaLimite: '18/10/2026',
    tiempoEmpleado: '2 días',
    detalle: 'Aceptar',
  },
  {
    id: 'TRB-2026-045',
    titulo: 'Detección de fraude en pagos móviles con modelos de árboles',
    resumen:
      'Comparación de modelos basados en árboles para detectar fraude en transacciones de pagos móviles con datos desbalanceados.',
    eje: 'Economía y mercados',
    tipo: 'Artículo completo',
    estado: 'Entregada',
    fecha: '30/09/2026',
    horaEnvio: '18:20',
    fechaLimite: '18/10/2026',
    tiempoEmpleado: '5 días',
    detalle: 'Rechazar',
  },
]

// Evaluaciones de ejemplo para los trabajos ya entregados
const evaluacionesIniciales = {
  'TRB-2026-031': {
    puntajes: { originalidad: 16, rigor: 15, claridad: 18, relevancia: 17 },
    comentariosCriterios: {
      originalidad:
        'La propuesta adapta métricas conocidas a un contexto universitario.',
      rigor: 'El tamaño de la muestra de repositorios debería justificarse.',
      claridad: 'Buena estructura y tablas legibles.',
      relevancia: 'Aplicable a los cursos de proyectos de la carrera.',
    },
    recomendacion: 'Aceptar con observaciones',
    comentariosAutor:
      'El trabajo es sólido en su exposición. Recomiendo justificar la selección de repositorios y añadir una comparación con una línea base sin refactorización.',
    notasComite:
      'Puede aceptarse si los autores atienden la observación metodológica antes de la versión final.',
  },
  'TRB-2026-051': {
    puntajes: { originalidad: 17, rigor: 16, claridad: 17, relevancia: 18 },
    comentariosCriterios: {
      originalidad: 'Enfoque poco explorado en campus universitarios.',
      rigor: 'Las mediciones están bien documentadas.',
      claridad: 'Redacción clara y gráficos adecuados.',
      relevancia: 'Útil para la gestión sostenible del campus.',
    },
    recomendacion: 'Aceptar',
    comentariosAutor:
      'Trabajo claro y bien fundamentado. Se sugiere ampliar la descripción del periodo de medición.',
    notasComite: 'Puede aceptarse sin cambios mayores.',
  },
  'TRB-2026-035': {
    puntajes: { originalidad: 15, rigor: 16, claridad: 17, relevancia: 16 },
    comentariosCriterios: {
      originalidad: 'Tema conocido, pero con datos propios.',
      rigor: 'Metodología coherente con los objetivos.',
      claridad: 'Texto ordenado y fácil de seguir.',
      relevancia: 'Aporta evidencia para la enseñanza de software.',
    },
    recomendacion: 'Aceptar',
    comentariosAutor:
      'Buen resumen extendido. Podrían incluirse más ejemplos de los proyectos analizados.',
    notasComite: 'Sin observaciones adicionales.',
  },
  'TRB-2026-045': {
    puntajes: { originalidad: 9, rigor: 8, claridad: 12, relevancia: 10 },
    comentariosCriterios: {
      originalidad: 'Replica enfoques ya publicados sin aporte propio.',
      rigor: 'No se describe la validación de los modelos.',
      claridad: 'La estructura es entendible, pero faltan detalles.',
      relevancia: 'El problema es relevante, pero el alcance es limitado.',
    },
    recomendacion: 'Rechazar',
    comentariosAutor:
      'El problema es relevante, pero falta una validación rigurosa y una comparación con trabajos previos.',
    notasComite:
      'Se recomienda rechazar en esta edición y alentar un reenvío con mejoras.',
  },
}

function textoPlazo(trabajo) {
  if (trabajo.estado === 'Entregada') {
    return `Enviada el ${trabajo.fecha} · ${trabajo.detalle.toLowerCase()}`
  }
  if (trabajo.estado === 'Vencida') {
    return `Venció el ${trabajo.fecha} · ${trabajo.detalle}`
  }
  return `Vence el ${trabajo.fecha} · ${trabajo.detalle}`
}

function RevisionDictamen({
  trabajosAsignados = trabajosIniciales,
  fechaCierreRecepcion = '30/09/2026',
  onActualizarLineas,
}) {
  const [filtro, setFiltro] = useState('Todas')
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null)
  const [trabajos, setTrabajos] = useState(trabajosAsignados)
  const [evaluaciones, setEvaluaciones] = useState(evaluacionesIniciales)

  const trabajosFiltrados = trabajos.filter((trabajo) => {
    return (
      filtro === 'Todas' ||
      (filtro === 'Pendientes' &&
        (trabajo.estado === 'Pendiente' || trabajo.estado === 'Vencida')) ||
      (filtro === 'Entregadas' && trabajo.estado === 'Entregada') ||
      (filtro === 'Vencidas' && trabajo.estado === 'Vencida')
    )
  })

  const pendientes = trabajos.filter(
    (trabajo) =>
      trabajo.estado === 'Pendiente' || trabajo.estado === 'Vencida',
  ).length

  const entregadas = trabajos.filter(
    (trabajo) => trabajo.estado === 'Entregada',
  ).length

  const vencidas = trabajos.filter(
    (trabajo) => trabajo.estado === 'Vencida',
  ).length

  if (trabajoSeleccionado) {
    const trabajo = trabajos.find((item) => item.id === trabajoSeleccionado)

    if (trabajo) {
      return (
        <EvaluacionRevision
          key={trabajo.id}
          trabajo={trabajo}
          evaluacionGuardada={evaluaciones[trabajo.id]}
          onVolver={() => setTrabajoSeleccionado(null)}
          onGuardarBorrador={(evaluacion) => {
            setEvaluaciones((actuales) => ({
              ...actuales,
              [trabajo.id]: evaluacion,
            }))
            setTrabajoSeleccionado(null)
          }}
          onEnviar={(evaluacion) => {
            setEvaluaciones((actuales) => ({
              ...actuales,
              [trabajo.id]: evaluacion,
            }))

            setTrabajos((actuales) =>
              actuales.map((item) =>
                item.id === trabajo.id
                  ? {
                      ...item,
                      estado: 'Entregada',
                      detalle: evaluacion.recomendacion,
                      fechaLimite: item.fechaLimite ?? item.fecha,
                      fecha: new Date().toLocaleDateString('es-PE'),
                      horaEnvio: new Date().toLocaleTimeString('es-PE', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      }),
                    }
                  : item,
              ),
            )

            // Tras enviar, se muestra la evaluación en modo lectura
          }}
        />
      )
    }
  }

  // Estado vacío: el revisor todavía no tiene trabajos asignados
  if (trabajos.length === 0) {
    return (
      <main className="revision-page">
        <div className="revision-container">
          <section className="revision-heading">
            <div>
              <h1>Mi bandeja de revisión</h1>
              <p>Sin trabajos asignados por ahora</p>
            </div>
          </section>

          <section className="revision-vacio">
            <span className="revision-vacio-icono" aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path
                  d="M4.5 10.5l3.5 3.5 7.5-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2>No tiene revisiones asignadas</h2>
            <p>
              El comité asigna los trabajos cuando cierra la recepción, el{' '}
              {fechaCierreRecepcion}. Mantenga sus líneas de interés
              actualizadas para recibir trabajos afines.
            </p>
            <button
              type="button"
              className="revision-vacio-boton"
              onClick={
                onActualizarLineas ??
                (() =>
                  window.alert(
                    'Vista demostrativa: las líneas de interés todavía no están conectadas.',
                  ))
              }
            >
              Actualizar mis líneas de interés
            </button>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="revision-page">
      <div className="revision-container">
        <section className="revision-heading">
          <div>
            <h1>Mi bandeja de revisión</h1>
            <p>
              {trabajos.length} trabajos asignados · la etapa de revisión
              cierra el 20/10/2026 a las 18:00
            </p>
          </div>

          <div className="revision-stats">
            <article className="revision-stat stat-pendientes">
              <span>PENDIENTES</span>
              <strong>{pendientes}</strong>
            </article>

            <article className="revision-stat stat-entregadas">
              <span>ENTREGADAS</span>
              <strong>{entregadas}</strong>
            </article>
          </div>
        </section>

        <div className="revision-filters" aria-label="Filtrar trabajos">
          {[
            ['Todas', trabajos.length],
            ['Pendientes', pendientes],
            ['Entregadas', entregadas],
            ['Vencidas', vencidas],
          ].map(([opcion, cantidad]) => (
            <button
              key={opcion}
              type="button"
              className={`${filtro === opcion ? 'active' : ''} ${
                opcion === 'Vencidas' ? 'filtro-vencidas' : ''
              }`}
              onClick={() => setFiltro(opcion)}
            >
              {opcion} · {cantidad}
            </button>
          ))}
        </div>

        <div className="revision-work-list">
          {trabajosFiltrados.map((trabajo) => (
            <article className="revision-work-card" key={trabajo.id}>
              <div className="revision-work-meta">
                <span className="revision-work-id">{trabajo.id}</span>
                <span
                  className={`revision-status status-${trabajo.estado.toLowerCase()}`}
                >
                  {trabajo.estado === 'Pendiente'
                    ? 'Revisión pendiente'
                    : trabajo.estado}
                </span>
              </div>

              <h3>{trabajo.titulo}</h3>

              <div className="revision-work-tags">
                <span className="tag-eje">{trabajo.eje}</span>
                <span className="tag-tipo">{trabajo.tipo}</span>
              </div>

              <div className="revision-work-footer">
                <p
                  className={`revision-work-deadline deadline-${trabajo.estado.toLowerCase()}`}
                >
                  {textoPlazo(trabajo)}
                </p>

                {trabajo.estado === 'Entregada' ? (
                  <button
                    type="button"
                    className="revision-work-link"
                    onClick={() => setTrabajoSeleccionado(trabajo.id)}
                  >
                    Ver evaluación
                  </button>
                ) : (
                  <button
                    type="button"
                    className="revision-work-action"
                    onClick={() => setTrabajoSeleccionado(trabajo.id)}
                  >
                    {trabajo.estado === 'Vencida' ? 'Evaluar ahora' : 'Evaluar'}
                  </button>
                )}
              </div>
            </article>
          ))}

          {trabajosFiltrados.length === 0 && (
            <div className="revision-empty">
              <h3>No se encontraron trabajos</h3>
              <p>Cambia el filtro seleccionado para ver más resultados.</p>
              <button type="button" onClick={() => setFiltro('Todas')}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default RevisionDictamen
