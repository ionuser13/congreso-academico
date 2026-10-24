import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrograma } from '../hooks/usePrograma';
import SesionFormModal from '../components/SesionFormModal';
import EstadoVacio from '../components/EstadoVacio';
import { aMinutos, formatearFecha, idsEnConflicto, nombreEje, ordenarSesiones, paresEnConflicto, SALAS, trabajoIdsAsignados } from '../services/programaService';

// Escala de la barra de ocupación: de 08:00 a 14:00.
const INICIO_ESCALA = 8 * 60;
const TOTAL_ESCALA = 6 * 60;

// Vista 6.1 — Armado de sesiones (comité).
export default function SesionesPage() {
  const { programa, trabajos, ejes, publicarPrograma, reiniciarDatos } = usePrograma();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null); // null = cerrado, 'nueva' o la sesión a editar
  const sesiones = ordenarSesiones(programa.sesiones);
  const pares = paresEnConflicto(sesiones);
  const enConflicto = idsEnConflicto(sesiones);
  const asignados = trabajoIdsAsignados(sesiones).length;
  const diaOcupacion = sesiones[0]?.fecha;
  const delDia = sesiones.filter((s) => s.fecha === diaOcupacion);

  return (
    <>
      <div className="prg-cabecera">
        <div>
          <h2 className="prg-titulo">Sesiones del congreso</h2>
          <p className="prg-subtitulo">{sesiones.length} sesiones · {trabajos.length} trabajos aceptados</p>
        </div>
        <div className="prg-acciones">
          <button type="button" className="prg-btn" onClick={publicarPrograma}>Publicar programa</button>
          <button type="button" className="prg-btn prg-btn--primario" onClick={() => setModal('nueva')}>Nueva sesión</button>
        </div>
      </div>

      {pares.map(([a, b]) => (
        <div key={`${a.id}-${b.id}`} className="prg-alerta prg-alerta--aviso" role="alert">
          <strong>Solapamiento de sala:</strong> «{a.nombre}» y «{b.nombre}» usan la Sala {a.sala} el {formatearFecha(a.fecha)} entre las {Math.max(aMinutos(a.horaInicio), aMinutos(b.horaInicio)) === aMinutos(a.horaInicio) ? a.horaInicio : b.horaInicio} y las {aMinutos(a.horaFin) < aMinutos(b.horaFin) ? a.horaFin : b.horaFin}. Ajuste la hora o la sala antes de publicar.
        </div>
      ))}

      {sesiones.length === 0 ? (
        <EstadoVacio titulo="Todavía no hay sesiones" texto="Cree la primera sesión para empezar a armar el programa del congreso.">
          <button type="button" className="prg-btn prg-btn--primario" onClick={() => setModal('nueva')}>Crear la primera sesión</button>
        </EstadoVacio>
      ) : (
        <div className="prg-tabla-contenedor">
          <table className="prg-tabla">
            <thead>
              <tr><th>Sesión</th><th>Eje</th><th>Fecha</th><th>Hora</th><th>Sala</th><th>Moderador</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {sesiones.map((s) => (
                <tr key={s.id} className={enConflicto.has(s.id) ? 'prg-fila-conflicto' : ''}>
                  <td><strong>{s.nombre}</strong></td>
                  <td>{nombreEje(ejes, s.ejeId)}</td>
                  <td>{formatearFecha(s.fecha)}</td>
                  <td className="prg-choque">{s.horaInicio} – {s.horaFin}</td>
                  <td className="prg-choque">{s.sala}</td>
                  <td>{s.moderador}</td>
                  <td className="prg-celda-acciones">
                    <button type="button" className="prg-enlace" onClick={() => setModal(s)}>Editar</button>
                    {' · '}
                    <button type="button" className="prg-enlace" onClick={() => navigate(`/comite/programa/sesion/${s.id}`)}>Trabajos</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="prg-dos-columnas">
        <section className="prg-panel">
          <h3 className="prg-etiqueta">Ocupación de salas · {formatearFecha(diaOcupacion)}</h3>
          {SALAS.map((sala) => {
            const ocupadas = delDia.filter((s) => s.sala === sala);
            return (
              <div key={sala} className="prg-barra-fila">
                <span>{sala}</span>
                <div className="prg-barra">
                  {ocupadas.map((s) => (
                    <i key={s.id} style={{ left: `${((aMinutos(s.horaInicio) - INICIO_ESCALA) / TOTAL_ESCALA) * 100}%`, width: `${((aMinutos(s.horaFin) - aMinutos(s.horaInicio)) / TOTAL_ESCALA) * 100}%` }} />
                  ))}
                </div>
                <span>{ocupadas.length ? ocupadas.map((s) => `${s.horaInicio}–${s.horaFin}`).join(', ') : 'Libre'}</span>
              </div>
            );
          })}
        </section>
        <section className="prg-panel">
          <h3 className="prg-etiqueta">Resumen del programa</h3>
          <dl className="prg-resumen">
            <div><dt>Trabajos aceptados</dt><dd>{trabajos.length}</dd></div>
            <div><dt>Asignados a una sesión</dt><dd className="prg-ok">{asignados}</dd></div>
            <div><dt>Sin sesión</dt><dd className="prg-pendiente">{trabajos.length - asignados}</dd></div>
          </dl>
          <p className="prg-ayuda">El alta y la edición de sesiones se realizan en modal, con validación de solapamiento de sala y hora.</p>
          <button type="button" className="prg-enlace" onClick={reiniciarDatos}>Restablecer datos de ejemplo</button>
        </section>
      </div>

      {modal && <SesionFormModal sesion={modal === 'nueva' ? null : modal} onCerrar={() => setModal(null)} />}
    </>
  );
}
