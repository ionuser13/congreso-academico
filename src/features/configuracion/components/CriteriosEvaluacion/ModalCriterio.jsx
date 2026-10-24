import { useState } from 'react';
import './ModalCriterio.css';

export default function ModalCriterio({ onCerrar, onGuardar, pesoActual }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [peso, setPeso] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !descripcion || !peso) return;

    const pesoNum = Number(peso);
    if (pesoNum <= 0 || pesoNum > 100) {
      alert("El peso debe ser un número entre 1 y 100");
      return;
    }

    onGuardar({
      id: Date.now(),
      nombre,
      descripcion,
      pesoPorcentaje: pesoNum
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>Nuevo Criterio</h2>
          <button type="button" className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre del Criterio *</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej. Originalidad"
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              placeholder="Aporte novedoso frente a la literatura..."
              rows="2"
              required 
            />
          </div>

          <div className="form-group">
            <label>Peso (%) *</label>
            <input 
              type="number" 
              value={peso} 
              onChange={(e) => setPeso(e.target.value)} 
              placeholder="Ej. 20"
              min="1"
              max="100"
              required 
            />
            <small style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              El peso actual es {pesoActual}%. Faltan {100 - pesoActual}% para llegar a 100.
            </small>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario">
              Guardar Criterio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}