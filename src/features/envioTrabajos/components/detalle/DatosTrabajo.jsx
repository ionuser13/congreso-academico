import Chip from '../common/Chip';
import { fechaCorta, fechaHoraPunto, nombreArchivo } from '../../utils/formatos';

/** variante 'borrador' = "Resumen del borrador"; 'completo' = "Datos del trabajo" */
export default function DatosTrabajo({ trabajo, tipo, eje, variante = 'completo', mostrarEnlace = false, conHora = false }) {
  const enlace = trabajo.enlaceDocumento && (
    <a href={trabajo.enlaceDocumento} target="_blank" rel="noopener noreferrer" className="et-enlace et-enlace--fuerte">
      {nombreArchivo(trabajo.enlaceDocumento)}
    </a>
  );
  
  const D = ({ t, children }) => (<div><p className="et-label">{t}</p><p>{children}</p></div>);

  // Aseguramos la lectura segura de coautores y palabras clave
  const cantidadCoautores = Array.isArray(trabajo.coautores) ? trabajo.coautores.length : 0;
  const palabrasClave = Array.isArray(trabajo.palabrasClave) ? trabajo.palabrasClave : [];
  
  // Soporte tanto para 'fechaEnvio' (nueva mock) como para 'enviadoEn' (por compatibilidad)
  const fechaEnvioReal = trabajo.fechaEnvio ?? trabajo.enviadoEn;

  if (variante === 'borrador') {
    return (
      <section className="et-card et-card--riel">
        <h2 className="et-card__titulo">Resumen del borrador</h2>
        <div className="et-dl">
          <D t="Tipo">{tipo?.nombre ?? '—'}</D>
          <D t="Eje temático">{eje?.nombre ?? '—'}</D>
          <D t="Coautores">{cantidadCoautores ? `${cantidadCoautores} ${cantidadCoautores === 1 ? 'declarado' : 'declarados'}` : 'Ninguno declarado'}</D>
          <D t="Enlace al documento">{enlace || '—'}</D>
        </div>
        <p className="et-label">Resumen</p>
        <p className="et-lectura">{trabajo.resumen || '—'}</p>
      </section>
    );
  }

  return (
    <section className="et-card et-card--riel">
      <h2 className="et-card__titulo">Datos del trabajo</h2>
      <div className="et-dl et-dl--3">
        <D t="Tipo">{tipo?.nombre ?? '—'}</D>
        <D t="Eje temático">{eje?.nombre ?? '—'}</D>
        <D t="Enviado">
          {fechaEnvioReal ? (conHora ? fechaHoraPunto(fechaEnvioReal) : fechaCorta(fechaEnvioReal)) : 'No enviado'}
        </D>
      </div>
      <p className="et-label">Resumen</p>
      <p className="et-lectura">{trabajo.resumen || '—'}</p>
      
      {palabrasClave.length > 0 && (
        <div className="et-tarjeta__chips">
          {palabrasClave.map((p) => <Chip key={p}>{p}</Chip>)}
        </div>
      )}

      {mostrarEnlace && (
        <>
          <p className="et-label">Enlace al documento</p>
          <p>{enlace || '—'}</p>
        </>
      )}
    </section>
  );
}