import { Inbox } from 'lucide-react';

// Estado vacío compartido por las vistas de la HU-4.
export default function EstadoVacio({ titulo, texto, accion }) {
  return (
    <div className="hu4-vacio">
      <div className="hu4-vacio__icono">
        <Inbox size={20} strokeWidth={1.5} />
      </div>
      <h2 className="hu4-vacio__titulo">{titulo}</h2>
      <p className="hu4-vacio__texto">{texto}</p>
      {accion}
    </div>
  );
}
