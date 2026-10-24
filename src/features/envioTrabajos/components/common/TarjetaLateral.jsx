export default function TarjetaLateral({ titulo, tono = 'neutro', children }) {
  return (
    <aside className={`et-lateral et-lateral--${tono}`}>
      {titulo && <p className="et-label">{titulo}</p>}
      {children}
    </aside>
  );
}