import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Boton from '../components/common/Boton';
import Aviso from '../components/common/Aviso';
import BannerEtapa from '../components/common/BannerEtapa';
import PasosTrabajo, { TOTAL_PASOS } from '../components/common/PasosTrabajo';
import TarjetaLateral from '../components/common/TarjetaLateral';
import TablaCoautores from '../components/coautores/TablaCoautores';
import FormularioCoautor from '../components/coautores/FormularioCoautor';
import { useUsuario } from '../hooks/useUsuario';
import { useRecepcion } from '../hooks/useRecepcion';
import { useTrabajo } from '../hooks/useTrabajo';
import { useCoautores } from '../hooks/useCoautores';
import { actualizarTrabajo } from '../services/trabajosService';
import { obtenerTipo } from '../services/lecturaEdicion';
import { puedeEditar } from '../utils/reglasTrabajo';

function Contenido({ trabajo, tipo, usuario }) {
  const navigate = useNavigate();
  const c = useCoautores(trabajo, tipo, usuario);
  const [error, setError] = useState(null);

  const total = 1 + c.coautores.length;
  const continuar = async () => {
    try {
      await actualizarTrabajo(trabajo.id, {
        coautores: c.coautores,
        correspondencia: c.correspondencia,
        correspondenciaConfirmada: true,
      });
      navigate(`/trabajos/nuevo/${trabajo.id}`, {
        state: { aviso: { tipo: trabajo.estado === 'enviado' ? 'guardado' : 'borrador', en: new Date().toISOString() } },
      });
    } catch (e) { setError(e.message); }
  };

  return (
    <main className="et-pagina">
      <BannerEtapa />
      <header className="et-cabecera">
        <div>
          <h1 className="et-h1">Coautores</h1>
          <p className="et-suave">
            Paso 2 de {TOTAL_PASOS} · {trabajo.codigo ?? trabajo.id} · {tipo?.nombre}
            {c.admite ? ` (hasta ${c.max} coautores)` : ' (no admite coautores)'}
          </p>
        </div>
        <div className="et-acciones">
          <Boton variante="secundario" to={`/trabajos/nuevo/${trabajo.id}/editar`}>Volver a datos generales</Boton>
          <Boton onClick={continuar}>Continuar</Boton>
        </div>
      </header>
      <PasosTrabajo actual={2} />
      {error && <Aviso tono="error">{error}</Aviso>}

      <div className="et-grid">
        <section className="et-card">
          <TablaCoautores
            principal={c.principal} coautores={c.coautores} correspondencia={c.correspondencia}
            usuarioCorreo={usuario?.correo} editando={c.editando}
            onMarcar={c.setCorrespondencia} onEditar={c.setEditando}
          />
          {c.admite && (c.puedeAgregar || c.editando !== null) && (
            <FormularioCoautor
              key={c.editando ?? 'nuevo'}
              modo={c.editando !== null ? 'editar' : 'agregar'}
              inicial={c.editando !== null ? c.coautores[c.editando] : undefined}
              onGuardar={c.editando !== null ? c.guardarEdicion : c.agregar}
              onCancelar={() => c.setEditando(null)}
              onQuitar={c.quitar}
            />
          )}
          {c.admite && !c.puedeAgregar && c.editando === null && (
            <p className="et-suave et-coaut-form">Alcanzó el máximo de coautores para este tipo de trabajo.</p>
          )}
          {!c.admite && <p className="et-suave et-coaut-form">Este tipo de trabajo no admite coautores.</p>}
          <div className="et-tabla__pie">
            <span>{total} de {1 + c.max} autores declarados (autor principal + {c.max} coautores como máximo)</span>
            <span>El orden de la lista es el orden de firma.</span>
          </div>
        </section>

        <div className="et-lateral-col">
          <TarjetaLateral titulo="Autor de correspondencia">
            <p>Recibe las notificaciones del comité y es responsable de la comunicación oficial. Debe haber exactamente uno.</p>
          </TarjetaLateral>
          <TarjetaLateral tono="rosa" titulo="Conflicto de revisión">
            <p>Los coautores declarados no podrán ser asignados como revisores de este trabajo.</p>
          </TarjetaLateral>
        </div>
      </div>
    </main>
  );
}

export default function CoautoresPage() {
  const { id } = useParams();
  const usuario = useUsuario();
  const { etapa } = useRecepcion();
  const { trabajo } = useTrabajo(id);

  if (trabajo === null) return <Navigate to="/mis-trabajos" replace />;
  if (trabajo && !puedeEditar(trabajo, usuario, etapa)) return <Navigate to={`/mis-trabajos/${id}`} replace />;
  
  if (!trabajo) return null; // Estado de carga defensivo

  return <Contenido trabajo={trabajo} tipo={obtenerTipo(trabajo.tipoId)} usuario={usuario} />;
}