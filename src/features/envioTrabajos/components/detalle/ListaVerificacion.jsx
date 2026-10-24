import TarjetaLateral from '../common/TarjetaLateral';

export default function ListaVerificacion({ items }) {
  return (
    <TarjetaLateral titulo="Lista de verificación">
      <ul className="et-check">
        {items.map((i) => (
          <li key={i.clave} className={i.ok ? 'et-check--ok' : 'et-check--pend'}>
            <span aria-hidden="true">{i.ok ? '✓' : '•'}</span> {i.texto}
          </li>
        ))}
      </ul>
    </TarjetaLateral>
  );
}