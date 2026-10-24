import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePrograma } from '../hooks/usePrograma';
import ConfirmDialog from '../components/ConfirmDialog';
import EstadoVacio from '../components/EstadoVacio';
import { capacidad, formatearFecha, horarioTrabajo, nombreEje, trabajosSinSesion } from '../services/programaService';

// Vista 6.2 — Asignación de trabajos a una sesión (comité). La sesión llega por la URL.
export default function AsignarTrabajosPage() {
  const { idSesion } = useParams();
  const navigate = useNavigate();
  const { programa, trabajos, ejes, agregarTrabajo, quitarTrabajo, moverTrabajo, notificar } = usePrograma();
  const [porQuitar, setPorQuitar] = useState(null);
  const sesion = programa.sesiones.find((s) => s.id === Number(idSesion));

  if (!sesion) {
    return (
      <EstadoVacio titulo="No encontramos esa sesión" texto="Puede que haya sido eliminada o que el enlace sea incorrecto.">
        <Link className="prg-btn prg-btn--primario" to="/comite/programa">Volver a las sesiones</Link>
      </EstadoVacio>
    );
  }

  const sinSesion = trabajosSinSesion(trabajos, programa.sesiones);
  const dentro = sesion.trabajoIds.map((id) => trabajos.find((t) => t.id === id)).filter(Boolean);
  const espacios = capacidad(sesion);
  const libre = sesion.trabajoIds.length < espacios ? horarioTrabajo(sesion, sesion.trabajoIds.length) : null;

  // Los cambios ya se guardan al agregar/quitar/mover; este botón confirma y vuelve a la lista.
  const guardar = () => {
    notificar('Sesión guardada correctamente.');
    navigate('/comite/programa');
  };

  return (
    <>
      <div className="prg-cabecera">
        <div>
          <Link className="prg-enlace" to="/comite/programa">← Volver a las sesiones</Link>
          <h2 className="prg-titulo">Asignar trabajos a la sesión</h2>
          <p className="prg-subtitulo">Sesión seleccionada: {sesion.nombre} · {formatearFecha(sesion.fecha)} · {sesion.horaInicio}–{sesion.horaFin} · Sala {sesion.sala}</p>
        </div>
        <button type="button" className="prg-btn prg-btn--primario" onClick={guardar}>Guardar sesión</button>
      </div>

      <div className="prg-dos-columnas">
        <section className="prg-panel prg-panel--lista">
          <div className="prg-panel__cabecera"><h3>Trabajos aceptados sin sesión</h3><span>{sinSesion.length} trabajos</span></div>
          {sinSesion.length === 0 && <EstadoVacio titulo="No quedan trabajos por asignar" texto="Todos los trabajos aceptados ya tienen una sesión." />}
          {sinSesion.map((t) => (
            <div key={t.id} className="prg-item">
              <div>
                <span className="prg-codigo">{t.codigo}</span>
                <p className="prg-item__titulo">{t.titulo}</p>
                <span className="prg-codigo">{nombreEje(ejes, t.ejeId)} · {t.tipo}</span>
              </div>
              <button type="button" className="prg-btn prg-btn--chico" onClick={() => agregarTrabajo(sesion.id, t.id)}>Agregar →</button>
            </div>
          ))}
        </section>

        <section className="prg-panel prg-panel--lista prg-panel--destacado">
          <div className="prg-panel__cabecera"><h3>Contenido de la sesión</h3><span>{dentro.length} de {espacios} espacios · 20 min por trabajo</span></div>
          {dentro.map((t, i) => {
            const h = horarioTrabajo(sesion, i);
            return (
              <div key={t.id} className="prg-item">
                <span className="prg-orden">{i + 1}</span>
                <div>
                  <p className="prg-item__titulo">{t.titulo}</p>
                  <span className="prg-codigo">{t.codigo} · {h.inicio} – {h.fin}</span>
                </div>
                <div className="prg-mover">
                  <button type="button" className="prg-enlace" disabled={i === 0} onClick={() => moverTrabajo(sesion.id, i, -1)}>▲ Subir</button>
                  <button type="button" className="prg-enlace" disabled={i === dentro.length - 1} onClick={() => moverTrabajo(sesion.id, i, 1)}>▼ Bajar</button>
                  <button type="button" className="prg-enlace prg-enlace--peligro" onClick={() => setPorQuitar(t)}>Quitar</button>
                </div>
              </div>
            );
          })}
          {dentro.length === 0 && <EstadoVacio titulo="Esta sesión aún no tiene trabajos" texto="Agregue un trabajo desde la lista de la izquierda." />}
          {libre && dentro.length > 0 && (
            <div className="prg-espacio">Espacio disponible · {libre.inicio} – {libre.fin}<br />Agregue un trabajo desde la lista de la izquierda</div>
          )}
          {!libre && <div className="prg-espacio">La sesión está completa.</div>}
        </section>
      </div>

      <div className="prg-dos-columnas">
        <p className="prg-nota">El orden de la lista define el orden de exposición y la hora de cada trabajo dentro de la sesión.</p>
        <p className="prg-nota prg-nota--neutra">Solo los trabajos con decisión «aceptado» aparecen en la columna izquierda.</p>
      </div>

      {porQuitar && (
        <ConfirmDialog
          titulo="¿Quitar este trabajo de la sesión?"
          textoConfirmar="Quitar"
          onCancelar={() => setPorQuitar(null)}
          onConfirmar={() => { quitarTrabajo(sesion.id, porQuitar.id); setPorQuitar(null); }}
        >
          <p><strong>{porQuitar.codigo}</strong> · {porQuitar.titulo}</p>
          <p>Volverá a la lista de trabajos aceptados sin sesión.</p>
        </ConfirmDialog>
      )}
    </>
  );
}
