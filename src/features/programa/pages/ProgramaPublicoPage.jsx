import { useState } from 'react';
import { usePrograma } from '../hooks/usePrograma';
import EstadoVacio from '../components/EstadoVacio';
import { etiquetaDia, fechasDelPrograma, filtrarPrograma, horarioTrabajo, SALAS, trabajoIdsAsignados } from '../services/programaService';

// Vista 6.3 — Programa público (visitante): filtra por día, eje y sala.
export default function ProgramaPublicoPage() {
  const { programa, trabajos, ejes } = usePrograma();
  const [dia, setDia] = useState('');
  const [ejeId, setEjeId] = useState('');
  const [sala, setSala] = useState('');

  const fechas = fechasDelPrograma(programa.sesiones);
  const diaActivo = fechas.includes(dia) ? dia : fechas[0];
  const sesiones = filtrarPrograma(programa.sesiones, { fecha: diaActivo, ejeId, sala });

  if (!programa.publicado || fechas.length === 0) {
    return (
      <>
        <h2 className="prg-titulo">Programa del congreso</h2>
        <EstadoVacio titulo="El programa aún no ha sido publicado" texto="Cuando el comité lo publique, podrá consultarlo aquí por día, eje y sala." />
      </>
    );
  }

  return (
    <>
      <div className="prg-cabecera">
        <div>
          <h2 className="prg-titulo">Programa del congreso</h2>
          <p className="prg-subtitulo">{trabajoIdsAsignados(programa.sesiones).length} trabajos programados · {programa.sesiones.length} sesiones</p>
        </div>
        {/* Abre el cuadro de impresión del navegador: ahí se elige «Guardar como PDF». */}
        <button type="button" className="prg-btn" onClick={() => window.print()}>Descargar programa en PDF</button>
      </div>

      <div className="prg-filtros">
        <div className="prg-pestanas" role="tablist">
          {fechas.map((f) => (
            <button key={f} type="button" role="tab" aria-selected={f === diaActivo} className={f === diaActivo ? 'prg-pestana prg-pestana--activa' : 'prg-pestana'} onClick={() => setDia(f)}>
              {etiquetaDia(f)}
            </button>
          ))}
        </div>
        <select value={ejeId} onChange={(e) => setEjeId(e.target.value)} aria-label="Filtrar por eje">
          <option value="">Filtrar por eje: todos</option>
          {ejes.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={sala} onChange={(e) => setSala(e.target.value)} aria-label="Filtrar por sala">
          <option value="">Filtrar por sala: todas</option>
          {SALAS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {sesiones.length === 0 && <EstadoVacio titulo="No hay sesiones con esos filtros" texto="Pruebe con otro día, eje o sala." />}
      {sesiones.map((s) => (
        <section key={s.id} className="prg-sesion">
          <header>
            <div>
              <h3>{s.nombre}</h3>
              <span className="prg-codigo">Moderación: {s.moderador}</span>
            </div>
            <div><span className="prg-chip prg-chip--hora">{s.horaInicio} – {s.horaFin}</span><span className="prg-chip">Sala {s.sala}</span></div>
          </header>
          {s.trabajoIds.length === 0 && <p className="prg-fila-trabajo prg-ayuda">Los trabajos de esta sesión se publicarán pronto.</p>}
          {s.trabajoIds.map((id, i) => {
            const t = trabajos.find((x) => x.id === id);
            return t && (
              <div key={id} className="prg-fila-trabajo">
                <span>{horarioTrabajo(s, i).inicio}</span>
                <strong className="prg-item__titulo">{t.titulo}</strong>
                <span>{t.autores}</span>
              </div>
            );
          })}
        </section>
      ))}
    </>
  );
}
