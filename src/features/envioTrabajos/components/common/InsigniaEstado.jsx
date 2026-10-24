import { ESTADOS_VISIBLES } from '../../utils/estadosTrabajo';

export default function InsigniaEstado({ estado, texto }) {
  const e = ESTADOS_VISIBLES[estado];
  const tono = e?.tono ?? 'gris';
  
  return (
    <span className={`et-insignia et-insignia--${tono}`}>
      {texto ?? e?.etiqueta ?? estado}
    </span>
  );
}