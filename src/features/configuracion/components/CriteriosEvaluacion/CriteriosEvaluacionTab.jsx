import '../TablasCompartidas.css';

export default function CriteriosEvaluacionTab({ datos }) {
  const total = datos.criteriosEvaluacion.reduce(
    (sum, c) => sum + Number(c.pesoPorcentaje), 0
  );
  const sumaOk = total === 100;

  return (
    <div className="tab-wrapper">
      <header className="tab-header">
        <div>
          <h2 className="tab-titulo">Criterios de evaluación</h2>
          <p className="tab-subtitulo">Los pesos deben sumar 100.</p>
        </div>
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
    </div>
  );
}