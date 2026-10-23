import TarjetaLateral from '../common/TarjetaLateral';
import { fechaCorta, fechaHoraPunto } from '../../utils/formatos';

export default function SeguimientoTrabajo({ trabajo, seguimiento, publicacion }) {
  // Si no hay datos de seguimiento aún, podemos renderizar un estado vacío o un contenedor seguro
  if (!seguimiento) {
    return (
      <TarjetaLateral titulo="Seguimiento">
        <p className="et-suave">El seguimiento estará disponible una vez que el trabajo sea asignado a revisión.</p>
      </TarjetaLateral>
    );
  }

  const completa = (seguimiento.entregadas ?? 0) >= (seguimiento.total ?? 0);
  
  // Soporte tanto para 'fechaEnvio' (nueva mock) como para 'enviadoEn' (por compatibilidad)
  const fechaEnvioReal = trabajo?.fechaEnvio ?? trabajo?.enviadoEn;

  const Paso = ({ tono, t, s }) => (
    <li className="et-seg__item">
      <span className={`et-seg__punto et-seg__punto--${tono}`} aria-hidden="true" />
      <div><p>{t}</p><p className="et-suave">{s}</p></div>
    </li>
  );

  return (
    <TarjetaLateral titulo="Seguimiento">
      <ol className="et-seg">
        <Paso 
          tono="verde" 
          t="Enviado al comité" 
          s={fechaEnvioReal ? fechaHoraPunto(fechaEnvioReal) : 'Fecha no registrada'} 
        />
        <Paso 
          tono="verde" 
          t="Revisores asignados" 
          s={seguimiento.asignadosEn ? fechaHoraPunto(seguimiento.asignadosEn) : 'Pendiente'} 
        />
        <Paso 
          tono={completa ? 'verde' : 'ambar'}
          t={`Revisión en curso · ${seguimiento.entregadas ?? 0} de ${seguimiento.total ?? 0} entregadas`}
          s={seguimiento.actualizadoEn ? `actualizado el ${fechaCorta(seguimiento.actualizadoEn)}` : 'Sin actualizaciones'} 
        />
        <Paso 
          tono="gris" 
          t="Publicación de resultados" 
          s={publicacion ? fechaCorta(publicacion) : 'Por definir'} 
        />
      </ol>
    </TarjetaLateral>
  );
}