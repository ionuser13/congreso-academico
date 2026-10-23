export default function RetroalimentacionRevisores({ revisores }) {
  return (
    <section className="et-card et-card--riel">
      <h2 className="et-card__titulo">Retroalimentación consolidada de los revisores</h2>
      {revisores.map((r, i) => (
        <blockquote key={i} className="et-retro">
          <p className="et-label">Revisor {i + 1} · {r.recomendacion}</p>
          <p className="et-lectura">{r.comentario}</p>
        </blockquote>
      ))}
    </section>
  );
}