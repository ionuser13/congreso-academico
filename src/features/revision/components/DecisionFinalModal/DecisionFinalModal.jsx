import { useEffect, useRef, useState } from 'react'
import './DecisionFinalModal.css'

const OPCIONES = [
  {
    valor: 'Aceptar',
    tono: 'aceptar',
    descripcion: 'Pasa al programa del congreso.',
  },
  {
    valor: 'Rechazar',
    tono: 'rechazar',
    descripcion: 'No participa en esta edición.',
  },
]

// Convierte un comentario en una observación breve, en minúscula y sin punto final
function limpiarObservacion(texto) {
  const sinPunto = texto.trim().replace(/\.$/, '')
  return sinPunto.charAt(0).toLowerCase() + sinPunto.slice(1)
}

// Texto que se precarga a partir de lo que escribió cada revisor
function textoSugerido(decision, trabajo, revisiones) {
  const observaciones = revisiones
    .map((r) => limpiarObservacion(r.observacion ?? r.comentarioAutor))
    .join('; ')

  if (decision === 'Aceptar') {
    const fortalezas = trabajo.fortalezas
      ? ` Los revisores destacan ${trabajo.fortalezas}.`
      : ''
    return `El comité acepta el trabajo para presentación oral.${fortalezas} Antes de la versión final, atienda las siguientes observaciones: ${observaciones}.`
  }

  return `El comité no acepta el trabajo en esta edición. Los revisores señalan las siguientes observaciones: ${observaciones}. Se invita a los autores a reformular el trabajo y presentarlo en una próxima edición.`
}

function DecisionFinalModal({
  trabajo,
  revisiones,
  promedio,
  decisionInicial = 'Aceptar',
  borrador,
  onCancelar,
  onGuardarBorrador,
  onPublicar,
}) {
  const [decision, setDecision] = useState(
    borrador?.decision ?? decisionInicial,
  )
  const [texto, setTexto] = useState(
    borrador?.retroalimentacion ??
      textoSugerido(decisionInicial, trabajo, revisiones),
  )
  const [editado, setEditado] = useState(borrador?.editado ?? false)
  const [intentoPublicar, setIntentoPublicar] = useState(false)
  const dialogoRef = useRef(null)

  // Escape cierra la ventana, el fondo no se desplaza y el foco entra al diálogo
  useEffect(() => {
    function alPresionar(evento) {
      if (evento.key === 'Escape') onCancelar()
    }

    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', alPresionar)
    dialogoRef.current?.focus()

    return () => {
      document.body.style.overflow = overflowPrevio
      document.removeEventListener('keydown', alPresionar)
    }
  }, [onCancelar])

  const errorTexto = intentoPublicar && !texto.trim()

  function cambiarDecision(nueva) {
    setDecision(nueva)
    // Si el comité no tocó el texto, se actualiza la sugerencia
    if (!editado) setTexto(textoSugerido(nueva, trabajo, revisiones))
  }

  function restaurarTexto() {
    setTexto(textoSugerido(decision, trabajo, revisiones))
    setEditado(false)
  }

  function obtenerDecision() {
    return { decision, retroalimentacion: texto, editado }
  }

  function manejarPublicar() {
    setIntentoPublicar(true)
    if (!texto.trim()) return
    onPublicar(obtenerDecision())
  }

  return (
    <div className="dm-overlay">
      <div
        className="dm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dm-titulo"
        tabIndex={-1}
        ref={dialogoRef}
      >
        <header className="dm-cabecera">
          <div>
            <h2 id="dm-titulo">Decisión final del comité</h2>
            <p className="dm-subtitulo">
              {trabajo.id} · promedio {promedio} · {revisiones.length}{' '}
              revisiones entregadas
            </p>
          </div>
          <button
            type="button"
            className="dm-cerrar"
            aria-label="Cerrar"
            onClick={onCancelar}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 3l10 10M13 3L3 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="dm-cuerpo">
          <fieldset className="dm-opciones">
            <legend className="dm-sr">Decisión</legend>
            {OPCIONES.map((opcion) => (
              <label
                key={opcion.valor}
                className={`dm-opcion dm-tono--${opcion.tono} ${
                  decision === opcion.valor ? 'seleccionada' : ''
                }`}
              >
                <input
                  type="radio"
                  name="decision-final"
                  value={opcion.valor}
                  checked={decision === opcion.valor}
                  onChange={() => cambiarDecision(opcion.valor)}
                />
                <span className="dm-opcion-texto">
                  <strong>{opcion.valor}</strong>
                  <small>{opcion.descripcion}</small>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="dm-campo">
            <div className="dm-campo-cabecera">
              <label htmlFor="dm-retroalimentacion">
                RETROALIMENTACIÓN AL AUTOR *
              </label>
              <button
                type="button"
                className="dm-restaurar"
                onClick={restaurarTexto}
              >
                Restaurar texto de los revisores
              </button>
            </div>
            <textarea
              id="dm-retroalimentacion"
              rows="6"
              value={texto}
              aria-invalid={errorTexto ? 'true' : 'false'}
              className={errorTexto ? 'invalido' : ''}
              onChange={(e) => {
                setTexto(e.target.value)
                setEditado(true)
              }}
            />
            {errorTexto && (
              <span className="dm-error" role="alert">
                Escriba la retroalimentación para el autor.
              </span>
            )}
            <p className="dm-ayuda">
              Precargado con los comentarios al autor de los{' '}
              {revisiones.length} revisores. Puede editarlo antes de publicar.
            </p>
          </div>

          <p className="dm-aviso" role="note">
            Al publicar, el autor de correspondencia recibirá un correo y el
            resultado será visible en su detalle del trabajo. La decisión no se
            puede modificar después.
          </p>
        </div>

        <footer className="dm-pie">
          <button
            type="button"
            className="dm-btn dm-btn-secundario"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="dm-enlace"
            onClick={() => onGuardarBorrador(obtenerDecision())}
          >
            Guardar sin publicar
          </button>
          <button
            type="button"
            className="dm-btn dm-btn-primario"
            onClick={manejarPublicar}
          >
            Publicar decisión
          </button>
        </footer>
      </div>
    </div>
  )
}

export default DecisionFinalModal
