import { useState } from 'react';
import { usePrograma } from '../hooks/usePrograma';
import { SALAS } from '../services/programaService';

function Campo({ etiqueta, error, children }) {
  return (
    <label className="prg-campo">
      <span className="prg-etiqueta">{etiqueta} *</span>
      {children}
      {error && <span className="prg-error">{error}</span>}
    </label>
  );
}

// Modal para crear (sesion = null) o editar una sesión. Los errores salen junto a cada campo.
export default function SesionFormModal({ sesion, onCerrar }) {
  const { ejes, guardarSesion } = usePrograma();
  const [form, setForm] = useState({
    nombre: sesion?.nombre ?? '',
    ejeId: sesion?.ejeId ?? '',
    fecha: sesion?.fecha ?? '2026-11-12',
    horaInicio: sesion?.horaInicio ?? '09:00',
    horaFin: sesion?.horaFin ?? '10:30',
    sala: sesion?.sala ?? SALAS[0],
    moderador: sesion?.moderador ?? '',
  });
  const [errores, setErrores] = useState({});
  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const resultado = guardarSesion({ ...form, ejeId: Number(form.ejeId) }, sesion?.id ?? null);
    if (resultado.ok) onCerrar();
    else setErrores(resultado.errores);
  };

  return (
    <div className="prg-overlay" role="presentation">
      <form className="prg-modal" role="dialog" aria-modal="true" aria-labelledby="prg-form-titulo" onSubmit={enviar} noValidate>
        <h3 id="prg-form-titulo">{sesion ? 'Editar sesión' : 'Nueva sesión'}</h3>
        {Object.keys(errores).length > 0 && <div className="prg-alerta prg-alerta--error">Revise los campos marcados antes de guardar.</div>}
        <Campo etiqueta="Nombre de la sesión" error={errores.nombre}>
          <input value={form.nombre} onChange={cambiar('nombre')} className={errores.nombre ? 'prg-invalido' : ''} />
        </Campo>
        <Campo etiqueta="Eje temático" error={errores.ejeId}>
          <select value={form.ejeId} onChange={cambiar('ejeId')} className={errores.ejeId ? 'prg-invalido' : ''}>
            <option value="">Seleccione un eje</option>
            {ejes.map((eje) => <option key={eje.id} value={eje.id}>{eje.nombre}</option>)}
          </select>
        </Campo>
        <Campo etiqueta="Fecha" error={errores.fecha}>
          <input type="date" value={form.fecha} onChange={cambiar('fecha')} className={errores.fecha ? 'prg-invalido' : ''} />
        </Campo>
        <div className="prg-fila">
          <Campo etiqueta="Hora de inicio" error={errores.horaInicio}>
            <input type="time" value={form.horaInicio} onChange={cambiar('horaInicio')} className={errores.horaInicio ? 'prg-invalido' : ''} />
          </Campo>
          <Campo etiqueta="Hora de fin" error={errores.horaFin}>
            <input type="time" value={form.horaFin} onChange={cambiar('horaFin')} className={errores.horaFin ? 'prg-invalido' : ''} />
          </Campo>
        </div>
        <Campo etiqueta="Sala" error={errores.sala}>
          <select value={form.sala} onChange={cambiar('sala')} className={errores.sala ? 'prg-invalido' : ''}>
            {SALAS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Campo>
        <Campo etiqueta="Moderador" error={errores.moderador}>
          <input value={form.moderador} onChange={cambiar('moderador')} className={errores.moderador ? 'prg-invalido' : ''} />
        </Campo>
        <div className="prg-modal__acciones">
          <button type="button" className="prg-btn" onClick={onCerrar}>Cancelar</button>
          <button type="submit" className="prg-btn prg-btn--primario">Guardar sesión</button>
        </div>
      </form>
    </div>
  );
}
