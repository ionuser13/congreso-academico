import { Link } from 'react-router-dom';

export default function Migas({ items }) {
  return (
    <nav className="et-migas" aria-label="Ruta">
      {items.map((it, i) => (
        <span key={it.texto}>
          {it.to ? <Link to={it.to}>{it.texto}</Link> : it.texto}
          {i < items.length - 1 && ' › '}
        </span>
      ))}
    </nav>
  );
}