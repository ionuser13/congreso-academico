import '../TablasCompartidas.css';

export default function EjesTematicosTab({ datos }) {
  return (
    <div className="tab-wrapper">
      <header className="tab-header">
        <div>
          <h2 className="tab-titulo">Ejes temáticos</h2>
          <p className="tab-subtitulo">{datos.ejesTematicos.length} ejes configurados</p>
        </div>
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
    </div>
  );
}