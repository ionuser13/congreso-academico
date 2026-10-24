import { Link } from 'react-router-dom';
import InsigniaEstado from '../common/InsigniaEstado';
import Chip from '../common/Chip';
import { obtenerEje, obtenerTipo } from '../../services/lecturaEdicion';
import { fechaCorta, nombreCorto } from '../../utils/formatos';
import { puedeEditar } from '../../utils/reglasTrabajo';
import { ETAPAS } from '../../utils/estadosTrabajo';

export default function TarjetaTrabajo({ trabajo, usuario, etapa }) {
  const { id, codigo, visible, dictamen, fechaEnvio, ejeId, tipoId, titulo } = trabajo;
  
  let pie;
  let enlace;
  let destino = `/mis-trabajos/${id}`;
  let alerta = false;

  // Lógica de estado visible y pie de tarjeta
  if (visible === 'aceptado' || visible === 'rechazado') {
    const fechaDictamen = dictamen?.publicadoEn ? fechaCorta(dictamen.publicadoEn) : 'recientemente';
    pie = `Dictamen publicado el ${fechaDictamen}`;
    enlace = 'Ver dictamen';
  } else if (visible === 'borrador') {
    if (etapa === ETAPAS.ABIERTA && puedeEditar(trabajo, usuario, etapa)) {
      pie = 'Borrador · aún sin enviar';
      enlace = 'Continuar';
      destino = `/trabajos/nuevo/${id}`;
    } else {
      pie = 'No enviado · la recepción ya cerró';
      enlace = 'Ver en modo lectura';
      alerta = true;
    }
  } else {
    // Para 'enviado' y 'en_revision'
    const fEnvio = fechaEnvio ? fechaCorta(fechaEnvio) : '—';
    pie = `Enviado el ${fEnvio}`;
    enlace = 'Ver detalle';
  }

  // Obtención segura de nombres de autores
  const nombresCoautores = Array.isArray(trabajo.coautores)
    ? trabajo.coautores.map((c) => c.nombreCompleto ?? c.nombre).filter(Boolean)
    : [];

  const nombreAutorPrincipal = trabajo.autorPrincipal?.nombreCompleto 
    ?? trabajo.autorPrincipal?.nombre 
    ?? usuario?.nombreCompleto 
    ?? usuario?.nombre 
    ?? 'Autor Principal';

  const listaAutores = [nombreAutorPrincipal, ...nombresCoautores];
  const autoresFormateados = listaAutores.map(nombreCorto).join(', ');

  const eje = obtenerEje(ejeId);
  const tipo = obtenerTipo(tipoId);

  return (
    <article className="et-tarjeta">
      <div className="et-tarjeta__cab">
        <span className="et-codigo">{codigo ?? `TRB-2026-${String(id).padStart(3, '0')}`}</span>
        <InsigniaEstado estado={visible} />
      </div>

      <h3 className="et-tarjeta__titulo">{titulo || 'Sin título'}</h3>
      <p className="et-tarjeta__autores">{autoresFormateados}</p>

      <div className="et-tarjeta__chips">
        {eje && <Chip>{eje.nombre}</Chip>}
        {tipo && <Chip tono="neutro">{tipo.nombre}</Chip>}
      </div>

      <div className="et-tarjeta__pie">
        <span className={alerta ? 'et-texto-rojo' : 'et-suave'}>{pie}</span>
        <Link to={destino} className="et-enlace et-enlace--fuerte">
          {enlace}
        </Link>
      </div>
    </article>
  );
}