export const PASOS = ['Datos generales', 'Coautores'];
export const TOTAL_PASOS = PASOS.length; // "Paso N de 2" (la maqueta dice 3; se usa 2 por decisión confirmada)

export default function PasosTrabajo({ actual }) {
  return (
    <ol className="et-pasos">
      {PASOS.map((p, i) => (
        <li key={p} className={i + 1 === actual ? 'et-pasos__item et-pasos__item--activo' : 'et-pasos__item'}
            aria-current={i + 1 === actual ? 'step' : undefined}>
          {i + 1}. {p}
        </li>
      ))}
    </ol>
  );
}