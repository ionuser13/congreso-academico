import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { usePrograma } from '../hooks/usePrograma';
import EstadoVacio from '../components/EstadoVacio';
import { formatearFecha, nombreDia, presentacionesDeAutor } from '../services/programaService';

// Genera un archivo .ics (calendario) con la presentación y lo descarga.
function descargarCalendario({ trabajo, sesion, horario }) {
  const dia = sesion.fecha.replaceAll('-', '');
  const hora = (h) => `${h.replace(':', '')}00`;
  const texto = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    `DTSTART:${dia}T${hora(horario.inicio)}`, `DTEND:${dia}T${hora(horario.fin)}`,
    `SUMMARY:Presentación ${trabajo.codigo}`, `LOCATION:Sala ${sesion.sala}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(new Blob([texto], { type: 'text/calendar' }));
  enlace.download = `presentacion-${trabajo.codigo}.ics`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

// Vista 6.4 — Mi presentación (autor): fecha, hora y sala de sus trabajos con sesión asignada.
export default function MiPresentacionPage() {
  const { usuario } = useAuth(); // la ruta está protegida (RutaProtegida), siempre hay usuario
  const { programa, trabajos, notificar } = usePrograma();
  const lista = presentacionesDeAutor(usuario.id, programa.sesiones, trabajos);

  return (
    <>
      <h2 className="prg-titulo">Mi presentación</h2>
      <p className="prg-subtitulo">Datos de su exposición en el congreso</p>
      {lista.length === 0 && (
        <EstadoVacio titulo="Todavía no tiene una presentación asignada" texto="Cuando el comité asigne su trabajo aceptado a una sesión, verá aquí la fecha, la hora y la sala.">
          <Link className="prg-btn" to="/programa">Ver el programa completo</Link>
        </EstadoVacio>
      )}
      {lista.map((p) => (
        <div key={p.trabajo.id} className="prg-dos-columnas prg-dos-columnas--presentacion">
          <section className="prg-panel prg-panel--destacado">
            <span className="prg-codigo">{p.trabajo.codigo}</span><span className="prg-etiqueta-estado">Aceptado</span>
            <h3 className="prg-presentacion-titulo">{p.trabajo.titulo}</h3>
            <div className="prg-datos">
              <div><span className="prg-etiqueta">Fecha</span><strong>{formatearFecha(p.sesion.fecha)}</strong>{nombreDia(p.sesion.fecha)}</div>
              <div><span className="prg-etiqueta">Hora</span><strong>{p.horario.inicio} – {p.horario.fin}</strong>20 minutos</div>
              <div><span className="prg-etiqueta">Sala</span><strong>{p.sesion.sala}</strong></div>
              <div><span className="prg-etiqueta">Orden en la sesión</span><strong>{p.orden} de {p.total}</strong>Sesión: {p.sesion.nombre}</div>
            </div>
            <p className="prg-codigo">Moderación de la sesión: {p.sesion.moderador}{p.sesion.correoModerador ? ` · ${p.sesion.correoModerador}` : ''}</p>
          </section>
          <div>
            <div className="prg-nota prg-nota--indicaciones">
              <h3>Indicaciones para el expositor</h3>
              <p>Preséntese en la sala 15 minutos antes del inicio de la sesión.</p>
              <p>La exposición dura 15 minutos y 5 minutos de preguntas.</p>
              <p>Cargue su presentación en el equipo de la sala antes de que comience la sesión.</p>
              <p>Formato recomendado: PDF o PPTX en proporción 16:9.</p>
            </div>
            <section className="prg-panel">
              <h3 className="prg-etiqueta">Acciones</h3>
              <button type="button" className="prg-btn prg-btn--primario prg-btn--ancho" onClick={() => { descargarCalendario(p); notificar('Se descargó el evento para su calendario.'); }}>Agregar a mi calendario</button>
              <Link className="prg-btn prg-btn--ancho" to="/programa">Ver el programa completo</Link>
              <p className="prg-ayuda">Si no puede exponer, avise al comité con al menos 48 horas de anticipación.</p>
            </section>
          </div>
        </div>
      ))}
    </>
  );
}
