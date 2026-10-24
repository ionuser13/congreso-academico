import { useState } from 'react';
import Boton from '../common/Boton';

const VACIO = { nombreCompleto: '', correo: '', institucion: '' };

/** Usar con key={editando ?? 'nuevo'} para reiniciar al cambiar de modo. */
export default function FormularioCoautor({ modo, inicial, onGuardar, onCancelar, onQuitar }) {
  const [v, setV] = useState(inicial ?? VACIO);
  const [err, setErr] = useState({});
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setErr({ ...err, [k]: undefined }); };

  const enviar = () => {
    const e = onGuardar(v);
    if (e) setErr(e);
    else { setErr({}); if (modo === 'agregar') setV(VACIO); }
  };
  const editar = modo === 'editar';

  return (
    <div className="et-coaut-form">
      <p className="et-label">{editar ? 'Editar coautor' : 'Agregar coautor'}</p>
      <div className="et-coaut-form__fila">
        <div>
          <label className="et-label" htmlFor="co-nombre">Nombre completo</label>
          <input id="co-nombre" className={`et-input${err.nombreCompleto ? ' et-input--error' : ''}`} value={v.nombreCompleto} onChange={set('nombreCompleto')} />
        </div>
        <div>
          <label className="et-label" htmlFor="co-correo">Correo</label>
          <input id="co-correo" type="email" className={`et-input${err.correo ? ' et-input--error' : ''}`} value={v.correo} onChange={set('correo')} />
        </div>
        <div>
          <label className="et-label" htmlFor="co-inst">Institución</label>
          <input id="co-inst" className={`et-input${err.institucion ? ' et-input--error' : ''}`} value={v.institucion} onChange={set('institucion')} />
        </div>
        <div className="et-coaut-form__acciones">
          <Boton variante="secundario" onClick={enviar}>{editar ? 'Guardar cambios' : 'Agregar'}</Boton>
        </div>
      </div>
      {Object.values(err).filter(Boolean).map((m) => <p key={m} className="et-campo__error">{m}</p>)}
      {editar && (
        <div className="et-coaut-form__extra">
          <button type="button" className="et-enlace" onClick={onCancelar}>Cancelar</button>
          <button type="button" className="et-enlace et-enlace--peligro" onClick={onQuitar}>Quitar coautor</button>
        </div>
      )}
    </div>
  );
}