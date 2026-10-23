import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import {
  CONFLICTO,
  ETIQUETA_CONFLICTO,
  candidatosPara,
  retirarRevisor,
  fechaLimiteParaReemplazo,
  formatearFecha,
} from '../services/asignacionService';
import Aviso from './Aviso';

// Retiro y reasignación de un revisor, con motivo registrado.
//
// La HU-4 pide esta operación ("Reasignación y retiro de un revisor, con
// motivo registrado") pero los mockups del curso no incluyen la pantalla.
// Se resuelve con el mismo patrón del modal de bloqueo de la HU-7 (7.3):
// motivo obligatorio, y reemplazo opcional en el mismo paso.
export default function ModalReasignar({ revision, onCerrar, onHecho }) {
  const [motivo, setMotivo] = useState('');
  const [reemplazoId, setReemplazoId] = useState('');
  const [fechaLimite, setFechaLimite] = useState(
    fechaLimiteParaReemplazo(revision.fechaLimite),
  );
  const [error, setError] = useState(null);

  const candidatos = useMemo(
    () => candidatosPara(revision.trabajoId).filter((r) => r.conflicto !== CONFLICTO.COAUTORIA),
    [revision.trabajoId],
  );

  function confirmar() {
    const resultado = retirarRevisor({
      revisionId: revision.id,
      motivo,
      revisorReemplazoId: reemplazoId ? Number(reemplazoId) : null,
      fechaLimiteReemplazo: reemplazoId ? fechaLimite : null,
    });
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    onHecho(reemplazoId ? 'reasignada' : 'retirada');
  }

  const motivoCorto = motivo.trim().length < 10;

  return (
    <div className="hu4-capa" role="dialog" aria-modal="true" aria-label="Retirar o reasignar revisor">
      <div className="hu4-modal hu4-modal--angosto">
        <div className="hu4-modal__cabecera">
          <div>
            <h2 className="hu4-modal__titulo">Retirar o reasignar revisor</h2>
            <p className="hu4-modal__sub">
              {revision.trabajoCodigo} · {revision.revisor?.nombres} {revision.revisor?.apellidos}
            </p>
          </div>
          <button className="hu4-modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="hu4-modal__cuerpo">
          {error && <Aviso tipo="peligro">{error}</Aviso>}

          <div className="hu4-campo-bloque" style={{ marginTop: 0 }}>
            <span className="hu4__etiqueta">Motivo del retiro (obligatorio)</span>
            <textarea
              className="hu4-textarea"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej.: el revisor informó una carga excesiva y solicitó liberar esta revisión."
            />
            <p className="hu4__auxiliar">
              Queda registrado en el historial de la revisión. Mínimo 10 caracteres.
            </p>
          </div>

          <div className="hu4-campo-bloque">
            <span className="hu4__etiqueta">Revisor de reemplazo (opcional)</span>
            <select
              className="hu4-select"
              style={{ width: '100%' }}
              value={reemplazoId}
              onChange={(e) => setReemplazoId(e.target.value)}
            >
              <option value="">Solo retirar, sin reemplazo por ahora</option>
              {candidatos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombreCompleto} — {r.pendientes} pendientes
                  {r.conflicto === CONFLICTO.INSTITUCION
                    ? ` (${ETIQUETA_CONFLICTO[r.conflicto]})`
                    : ''}
                </option>
              ))}
            </select>
            <p className="hu4__auxiliar">
              Los coautores del trabajo no aparecen en esta lista.
            </p>
          </div>

          {reemplazoId && (
            <div className="hu4-campo-bloque">
              <span className="hu4__etiqueta">Nueva fecha límite</span>
              <input
                className="hu4-campo"
                type="date"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
                style={{ width: 200 }}
              />
              <p className="hu4__auxiliar">
                La original ({formatearFecha(revision.fechaLimite)}){' '}
                {revision.vencida
                  ? 'ya venció, así que se propone el cierre de la etapa de revisión.'
                  : 'sigue vigente y se mantiene.'}
              </p>
            </div>
          )}
        </div>

        <div className="hu4-modal__pie">
          <span className={motivoCorto ? 'hu4-error' : 'hu4__auxiliar'} style={{ margin: 0 }}>
            {motivoCorto ? 'El motivo es obligatorio' : 'Listo para registrar'}
          </span>
          <div className="hu4__acciones">
            <button className="hu4-btn hu4-btn--secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button className="hu4-btn hu4-btn--peligro" disabled={motivoCorto} onClick={confirmar}>
              {reemplazoId ? 'Retirar y reasignar' : 'Retirar revisor'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
