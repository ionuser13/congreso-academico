import '../TablasCompartidas.css';

export default function TiposTrabajoTab({ datos }) {
  return (
    <div className="tab-wrapper">
      <header className="tab-header">
        <div>
          <h2 className="tab-titulo">Tipos de trabajo</h2>
          <p className="tab-subtitulo">Modalidades admitidas para el envío</p>
        </div>
      </header>

      <table className="tabla-datos">
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th>EXTENSIÓN MÁXIMA</th>
            <th>FORMATO ESPERADO</th>
            <th>ADMITE COAUTORES</th>
          </tr>
        </thead>
        <tbody>
          {datos.tiposTrabajo.map((tipo) => (
            <tr key={tipo.id}>
              <td className="font-bold">{tipo.nombre}</td>
              <td>{tipo.extensionMaxima.toLocaleString('es-PE')} {tipo.unidadExtension}</td>
              <td>{tipo.formatoEsperado}</td>
              <td>{tipo.admiteCoautores ? `Sí - hasta ${tipo.maxCoautores}` : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}