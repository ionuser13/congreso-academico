// Estado vacío: título, texto explicativo y (opcional) un botón de acción.
export default function EstadoVacio({ titulo, texto, children }) {
  return (
    <div className="prg-vacio">
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {children}
    </div>
  );
}
