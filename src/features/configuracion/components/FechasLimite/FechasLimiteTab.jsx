import '../TablasCompartidas.css';

export default function FechasLimiteTab({ datos }) {
  return (
    <div className="tab-wrapper">
      <header className="tab-header">
        <div>
          <h2 className="tab-titulo">Fechas límite</h2>
          <p className="tab-subtitulo">Las fechas deben ser consecutivas.</p>
        </div>
      </header>

      <div className="fechas-grid">
        {datos.fechasLimite.map((fecha) => (
          <div key={fecha.id} className="fecha-card">
            <label className="fecha-label">{fecha.etapa}</label>
            <div className="fecha-valores">
              <span className="fecha-texto">{fecha.fecha}</span>
              <span className="fecha-hora">{fecha.hora}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}