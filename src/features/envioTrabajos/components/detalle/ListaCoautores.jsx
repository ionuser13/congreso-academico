/** Etiquetas neutras: no hay dato de género en usuarios. */
export default function ListaCoautores({ trabajo }) {
  const filas = [
    { ...trabajo.autorPrincipal },
    ...trabajo.coautores,
  ];
  const esCorr = (c) => c.correo.toLowerCase() === (trabajo.correspondencia || trabajo.autorPrincipal.correo).toLowerCase();
  return (
    <section className="et-card">
      <h2 className="et-card__titulo">Coautores</h2>
      <ul className="et-lista-co">
        {filas.map((c) => (
          <li key={c.correo}>
            <span>{c.nombreCompleto} · {c.institucion}</span>
            {esCorr(c)
              ? <strong className="et-tabla__marca">Autor de correspondencia</strong>
              : <span className="et-suave">Coautor</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}