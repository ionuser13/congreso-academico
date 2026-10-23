import { useState } from 'react';
import './ModalEjeTematico.css';

export default function ModalEjeTematico({ onCerrar, onGuardar }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [responsable, setResponsable] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!nombre || !descripcion) return; 
    
    // Enviamos el nuevo objeto al componente padre
    onGuardar({
      id: Date.now(), // ID único basado en el tiempo
      nombre,
      descripcion,
      responsable: responsable || 'Sin asignar',
      trabajosAsociados: 0
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h2>Nuevo Eje Temático</h2>
          <button type="button" className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre del Eje *</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej. Inteligencia Artificial"
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              placeholder="Breve descripción del eje..."
              rows="3"
              required 
            />
          </div>

          <div className="form-group">
            <label>Responsable</label>
            <input 
              type="text" 
              value={responsable} 
              onChange={(e) => setResponsable(e.target.value)} 
              placeholder="Ej. Dra. Ana Salazar"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario">
              Guardar Eje
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}