import { useState } from 'react';
import ModalEjeTematico from './ModalEjeTematico';
import '../TablasCompartidas.css';

export default function EjesTematicosTab({ datos, onActualizar }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleGuardarEje = (nuevoEje) => {
    // 1. Creamos una copia del array con el nuevo eje al final
    const nuevosEjes = [...datos.ejesTematicos, nuevoEje];
    
    // 2. Actualizamos el estado global (esto dispara el localStorage automáticamente)
    onActualizar({ ...datos, ejesTematicos: nuevosEjes });
    
    // 3. Cerramos el modal
    setModalAbierto(false);
  };

  return (
    <div className="tab-wrapper">
      <header className="tab-header">
        <div>
          <h2 className="tab-titulo">Ejes temáticos</h2>
          <p className="tab-subtitulo">{datos.ejesTematicos.length} ejes configurados</p>
        </div>
        
        {/* Botón para abrir el modal */}
        <button className="btn-primario" onClick={() => setModalAbierto(true)}>
          + Nuevo Eje Temático
        </button>
      </header>

      <table className="tabla-datos">
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th>DESCRIPCIÓN</th>
            <th>RESPONSABLE</th>
            <th>TRABAJOS</th>
          </tr>
        </thead>
        <tbody>
          {datos.ejesTematicos.map((eje) => (
            <tr key={eje.id}>
              <td className="font-bold">{eje.nombre}</td>
              <td className="texto-gris">{eje.descripcion}</td>
              <td>{eje.responsable}</td>
              <td>{eje.trabajosAsociados}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Renderizado condicional del modal */}
      {modalAbierto && (
        <ModalEjeTematico 
          onCerrar={() => setModalAbierto(false)} 
          onGuardar={handleGuardarEje} 
        />
      )}
    </div>
  );
}