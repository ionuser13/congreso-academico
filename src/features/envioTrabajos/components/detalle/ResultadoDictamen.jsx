import { decimal1, fechaCorta } from '../../utils/formatos';

export default function ResultadoDictamen({ dictamen, promedio }) {
  // Si no hay dictamen, no renderizamos nada para evitar errores fatales
  if (!dictamen) return null;

  const ok = dictamen.decision === 'aceptado';
  const revisores = Array.isArray(dictamen.revisores) ? dictamen.revisores : [];
  const n = revisores.length;

  // DEP-HU6-sesion: si no hay sesión se omite "presentación oral" y "Sesión asignada"
  const titulo = ok 
    ? (dictamen.sesion ? 'Trabajo aceptado para presentación oral' : 'Trabajo aceptado') 
    : 'Trabajo no aceptado en esta edición';

  const base = `Puntaje promedio ${decimal1(promedio)} de 20 · ${n} ${n === 1 ? 'revisor' : 'revisores'}`;
  
  const cola = ok
    ? (dictamen.sesion ? ` · Sesión asignada: ${dictamen.sesion}.` : '.')
    : ' · Puede volver a presentarlo en la siguiente convocatoria atendiendo las observaciones.';

  const fechaPublicacion = dictamen.publicadoEn ? fechaCorta(dictamen.publicadoEn) : '—';

  return (
    <section className={`et-resultado et-resultado--${ok ? 'ok' : 'no'}`}>
      <p className="et-label">Resultado publicado el {fechaPublicacion}</p>
      <h2>{titulo}</h2>
      <p>{base}{cola}</p>
    </section>
  );
}