import { useRecepcion } from '../../hooks/useRecepcion';
import { useCuentaRegresiva } from '../../hooks/useCuentaRegresiva';
import { ETAPAS } from '../../utils/estadosTrabajo';
import { fechaHora } from '../../utils/formatos';

export default function BannerEtapa() {
  const { etapa, fechas } = useRecepcion();

  // definir la fecha objetivo según la etapa actual
  const objetivo = 
    etapa === ETAPAS.ABIERTA ? fechas.cierre : 
    etapa === ETAPAS.REVISION ? fechas.publicacion : 
    null;

  const cuenta = useCuentaRegresiva(objetivo);

  // Si ya se publicaron los resultados, no se muestra el banner de etapa
  if (etapa === ETAPAS.PUBLICADA) return null;

  let titulo;
  let texto;

  if (etapa === ETAPAS.ABIERTA) {
    titulo = 'Recepción abierta.';
    texto = `Cierra el ${fechaHora(fechas.cierre)}.`;
  } else if (etapa === ETAPAS.CERRADA) {
    titulo = 'Recepción cerrada.';
    texto = `Cerró el ${fechaHora(fechas.cierre)}.`;
  } else {
    // ETAPAS.REVISION
    titulo = 'Etapa de revisión.';
    texto = `Los resultados se publican el ${fechaHora(fechas.publicacion)}.`;
  }

  let derecha = null;
  if (cuenta) {
    const d = `${cuenta.dias} ${cuenta.dias === 1 ? 'día' : 'días'}`;
    derecha = etapa === ETAPAS.ABIERTA
      ? `Faltan ${cuenta.dias > 0 ? `${d} · ` : ''}${cuenta.hhmm} h`
      : `Faltan ${d}`;
  }

  return (
    <div className="et-banner" role="status">
      <span><strong>{titulo}</strong> {texto}</span>
      {derecha && <strong>{derecha}</strong>}
    </div>
  );
}