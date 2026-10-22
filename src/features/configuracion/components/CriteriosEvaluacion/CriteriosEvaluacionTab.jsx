import { useState } from 'react';
import ModalCriterio from './ModalCriterio';
import '../TablasCompartidas.css'; // Ojo: ajusta la ruta si es necesario

export default function CriteriosEvaluacionTab({ datos, onActualizar }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const total = datos.criteriosEvaluacion.reduce(
    (sum, c) => sum + Number(c.pesoPorcentaje), 0
  );
  const sumaOk = total === 100;

  const handleGuardarCriterio = (nuevoCriterio) => {
    const nuevosCriterios = [...datos.criteriosEvaluacion, nuevoCriterio];
    onActualizar({ ...datos, criteriosEvaluacion: nuevosCriterios });
    setModalAbierto(false);
  };

  return (
    <div className="tab-wrapper">
      <header className="tab-header">
        <div>
          <h2 className="tab-titulo">Criterios de evaluación</h2>
          <p className="tab-subtitulo">Los pesos deben sumar 100.</p>
        </div>
        <button className="btn-primario" onClick={() => setModalAbierto(true)}>
          + Agregar Criterio
        </button>
      </header>

      {sumaOk ? (
        <div className="alerta alerta-exito">
          La suma de criterios es correcta (100%).
        </div>
      ) : (
        <div className="alerta alerta-error">
          La suma actual es {total}%. Debe ser exactamente 100% para guardar.
        </div>
      )}

      <table className="tabla-datos">
        <thead>
          <tr>
            <th>CRITERIO</th>
            <th>DESCRIPCIÓN</th>
            <th>PESO</th>
          </tr>
        </thead>
        <tbody>
          {datos.criteriosEvaluacion.map((criterio) => (
            <tr key={criterio.id}>
              <td className="font-bold">{criterio.nombre}</td>
              <td className="texto-gris">{criterio.descripcion}</td>
              <td className="font-bold">{criterio.pesoPorcentaje}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <ModalCriterio 
          onCerrar={() => setModalAbierto(false)} 
          onGuardar={handleGuardarCriterio}
          pesoActual={total}
        />
      )}
    </div>
  );
}