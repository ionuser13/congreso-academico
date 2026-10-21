import { useState, useSyncExternalStore } from 'react';
import {
  fechaLimiteRevision,
  formatearFecha,
  obtenerSeguimiento,
  obtenerVersion,
  suscribir,
  totalesRevisiones,
} from '../services/asignacionService';
import BadgeEstado from '../components/BadgeEstado';
import EstadoVacio from '../components/EstadoVacio';
import ModalReasignar from '../components/ModalReasignar';
import Aviso from '../components/Aviso';
import '../asignacion.css';

// 4.4 — Seguimiento de las revisiones pendientes, con alerta sobre las vencidas.
// Orden: primero las vencidas, luego por fecha límite ascendente.
export default function SeguimientoPage() {
  useSyncExternalStore(suscribir, obtenerVersion);

  const [soloVencidas, setSoloVencidas] = useState(false);
  const [aReasignar, setAReasignar] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const pendientes = obtenerSeguimiento();
  const totales = totalesRevisiones();

  const visibles = soloVencidas ? pendientes.filter((r) => r.vencida) : pendientes;

  function alReasignar(accion) {
    setAReasignar(null);
    setMensaje(
      accion === 'reasignada'
        ? 'Revisor retirado y reemplazado. El motivo quedó registrado.'
        : 'Revisor retirado. El motivo quedó registrado; el trabajo quedó con un revisor menos.',
    );
  }

  return (
    <main className="hu4">
      <div className="hu4__encabezado">
        <div>
          <h1 className="hu4__titulo">Seguimiento de revisiones</h1>
          <p className="hu4__auxiliar">
            Pendientes ordenadas por fecha límite · cierre de la etapa:{' '}
            {formatearFecha(fechaLimiteRevision())}
          </p>
        </div>
        <div className="hu4__acciones">
          <button className="hu4-btn hu4-btn--secundario" disabled={pendientes.length === 0}>
            Recordatorio a todos los pendientes
          </button>
        </div>
      </div>

      {mensaje && (
        <Aviso
          tipo="exito"
          accion={
            <button className="hu4-btn hu4-btn--enlace" onClick={() => setMensaje(null)}>
              Cerrar
            </button>
          }
        >
          {mensaje}
        </Aviso>
      )}

      {totales.vencidas > 0 && (
        <Aviso
          tipo="peligro"
          accion={
            <button
              className="hu4-btn hu4-btn--peligro"
              onClick={() => setSoloVencidas((v) => !v)}
            >
              {soloVencidas ? 'Ver todas' : 'Ver solo vencidas'}
            </button>
          }
        >
          <strong>
            {totales.vencidas} revisi{totales.vencidas === 1 ? 'ón vencida' : 'ones vencidas'}.
          </strong>{' '}
          Considere reasignar para no retrasar la publicación de resultados.
        </Aviso>
      )}

      {visibles.length === 0 ? (
        <EstadoVacio
          titulo={soloVencidas ? 'No hay revisiones vencidas' : 'No hay revisiones pendientes'}
          texto={
            soloVencidas
              ? 'Todas las revisiones pendientes están dentro del plazo.'
              : 'Todos los revisores entregaron sus evaluaciones.'
          }
          accion={
            soloVencidas ? (
              <button className="hu4-btn hu4-btn--secundario" onClick={() => setSoloVencidas(false)}>
                Ver todas
              </button>
            ) : null
          }
        />
      ) : (
        <div className="hu4-tabla-caja">
          <table className="hu4-tabla">
            <thead>
              <tr>
                <th style={{ width: 130 }}>Código</th>
                <th>Trabajo</th>
                <th style={{ width: 230 }}>Revisor</th>
                <th style={{ width: 120 }}>Fecha límite</th>
                <th style={{ width: 160 }}>Estado</th>
                <th style={{ width: 110 }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((r) => (
                <tr key={r.id} className={r.vencida ? 'seleccionada' : ''}>
                  <td className="hu4-tabla__codigo">{r.trabajoCodigo}</td>
                  <td className="hu4-tabla__titulo">{r.trabajoTitulo}</td>
                  <td>
                    {r.revisor ? `${r.revisor.nombres} ${r.revisor.apellidos}` : 'No encontrado'}
                  </td>
                  <td className={r.vencida ? 'hu4-error' : ''}>{formatearFecha(r.fechaLimite)}</td>
                  <td>
                    <BadgeEstado
                      estado={r.vencida ? 'vencida' : 'pendiente'}
                      texto={
                        r.vencida
                          ? `Vencida · ${r.dias} día${r.dias === 1 ? '' : 's'}`
                          : `Pendiente · ${r.dias} día${r.dias === 1 ? '' : 's'}`
                      }
                    />
                  </td>
                  <td>
                    <button className="hu4-btn hu4-btn--enlace" onClick={() => setAReasignar(r)}>
                      {r.vencida ? 'Reasignar' : 'Retirar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="hu4-totales">
        <div className="hu4-totales__item">
          <span className="hu4__auxiliar" style={{ margin: 0 }}>Revisiones entregadas</span>
          <strong className="hu4-totales__valor hu4-ok">
            {totales.entregadas} de {totales.total}
          </strong>
        </div>
        <div className="hu4-totales__item">
          <span className="hu4__auxiliar" style={{ margin: 0 }}>Pendientes en plazo</span>
          <strong className="hu4-totales__valor hu4-alerta">{totales.pendientesEnPlazo}</strong>
        </div>
        <div className="hu4-totales__item">
          <span className="hu4__auxiliar" style={{ margin: 0 }}>Vencidas</span>
          <strong className="hu4-totales__valor hu4-error">{totales.vencidas}</strong>
        </div>
      </section>

      {aReasignar && (
        <ModalReasignar
          revision={aReasignar}
          onCerrar={() => setAReasignar(null)}
          onHecho={alReasignar}
        />
      )}
    </main>
  );
}
