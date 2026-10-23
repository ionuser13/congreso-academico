/** Etiquetas neutras: no hay dato de género en usuarios. */
export default function ListaCoautores({ trabajo }) {
  if (!trabajo) return null;

  const autorPrincipal = trabajo.autorPrincipal || {};
  const coautores = Array.isArray(trabajo.coautores) ? trabajo.coautores : [];

  const filas = [
    { ...autorPrincipal },
    ...coautores,
  ];

  const correoCorrespondencia = (trabajo.correspondencia || autorPrincipal.correo || '').trim().toLowerCase();

  const esCorr = (c) => {
    const correoC = (c?.correo || '').trim().toLowerCase();
    return correoC && correoC === correoCorrespondencia;
  };

  return (
    <section className="et-card">
      <h2 className="et-card__titulo">Coautores</h2>
      <ul className="et-lista-co">
        {filas.map((c, index) => {
          const correoKey = c?.correo || `autor-${index}`;
          const nombre = c?.nombreCompleto || c?.nombre || 'Sin nombre';
          const institucion = c?.institucion || 'Sin institución';
          const esPrincipal = index === 0;

          return (
            <li key={correoKey}>
              <span>{nombre} · {institucion}</span>
              {esCorr(c) ? (
                <strong className="et-tabla__marca">Autor de correspondencia</strong>
              ) : (
                <span className="et-suave">{esPrincipal ? 'Autor principal' : 'Coautor'}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}