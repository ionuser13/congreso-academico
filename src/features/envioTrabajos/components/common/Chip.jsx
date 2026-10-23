export default function Chip({ tono = 'rosa', onQuitar, children }) {
  return (
    <span className={`et-chip et-chip--${tono}`}>
      {children}
      {onQuitar && (
        <button type="button" className="et-chip__x" onClick={onQuitar} aria-label={`Quitar ${children}`}>×</button>
      )}
    </span>
  );
}