import { useState } from 'react';
import './ModalCambiarEstado.css';

export default function ModalCambiarEstado({ onCerrar, onConfirmar }) {
  const [textoConfirmacion, setTextoConfirmacion] = useState('');
  const [checkAceptado, setCheckAceptado] = useState(false);

  const palabraClave = "CERRAR";
  const esValido = textoConfirmacion.trim().toUpperCase() === palabraClave && checkAceptado;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (esValido) {
      onConfirmar(); // Llama a la función que cambia el estado
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>Cerrar la recepción de trabajos</h2>
          <button type="button" className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Alerta de advertencia */}
          <div className="alerta-peligro">
            <strong>Esta acción tiene efectos inmediatos</strong>
            <p>
              Los autores ya no podrán editar ni enviar trabajos. Los 2 borradores sin enviar 
              quedarán fuera del proceso y los 12 trabajos enviados pasarán a la etapa de 
              asignación de revisores.
            </p>
          </div>

          {/* Checkbox de confirmación */}
          <div className="form-check">
            <input 
              type="checkbox" 
              id="checkAceptar"
              checked={checkAceptado}
              onChange={(e) => setCheckAceptado(e.target.checked)}
            />
            <label htmlFor="checkAceptar">
              Entiendo que los autores ya no podrán editar sus trabajos.
            </label>
          </div>

          {/* Input de palabra clave */}
          <div className="form-group">
            <label>Escriba <strong>CERRAR</strong> para confirmar</label>
            <input 
              type="text" 
              value={textoConfirmacion} 
              onChange={(e) => setTextoConfirmacion(e.target.value)} 
              placeholder="CERRAR"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-peligro" 
              disabled={!esValido}
            >
              Cerrar la recepción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}