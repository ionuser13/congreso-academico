import { ETIQUETA_ESTADO_TRABAJO } from '../services/asignacionService';

// Etiqueta de estado: siempre color + texto, nunca solo color.
export default function BadgeEstado({ estado, texto }) {
  return (
    <span className={`hu4-badge hu4-badge--${estado}`}>
      {texto ?? ETIQUETA_ESTADO_TRABAJO[estado] ?? estado}
    </span>
  );
}
