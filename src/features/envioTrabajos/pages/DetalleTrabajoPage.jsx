import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Aviso from '../components/common/Aviso';
import Boton from '../components/common/Boton';
import BannerEtapa from '../components/common/BannerEtapa';
import InsigniaEstado from '../components/common/InsigniaEstado';
import Migas from '../components/common/Migas';
import TarjetaLateral from '../components/common/TarjetaLateral';
import DatosTrabajo from '../components/detalle/DatosTrabajo';
import ListaCoautores from '../components/detalle/ListaCoautores';
import ListaVerificacion from '../components/detalle/ListaVerificacion';
import SeguimientoTrabajo from '../components/detalle/SeguimientoTrabajo';
import ResultadoDictamen from '../components/detalle/ResultadoDictamen';
import PuntajesCriterios from '../components/detalle/PuntajesCriterios';
import RetroalimentacionRevisores from '../components/detalle/RetroalimentacionRevisores';
import { useUsuario } from '../hooks/useUsuario';
import { useRecepcion } from '../hooks/useRecepcion';
import { useTrabajo } from '../hooks/useTrabajo';
import { enviarTrabajo } from '../services/trabajosService';
import { obtenerCriterios, obtenerEje, obtenerTipo } from '../services/lecturaEdicion';
import { obtenerDictamen, obtenerSeguimiento } from '../services/lecturaRevision';
import { ETAPAS, estadoVisible } from '../utils/estadosTrabajo';
import { estaCompleto, listaVerificacion, puedeEditar, puedeVer } from '../utils/reglasTrabajo';
import { puntajesPorCriterio, promedioPonderado } from '../utils/dictamen';
import { fechaCorta, fechaHora } from '../utils/formatos';

function NoEncontrado() {
  return (
    <main className="et-pagina">
      <Aviso tono="ambar" titulo="Trabajo no encontrado.">No existe o no tiene permiso para verlo.</Aviso>
      <Boton variante="secundario" to="/mis-trabajos">Ir a mis trabajos</Boton>
    </main>
  );
}

const TEXTO_AVISO = {
  borrador: (en) => `Borrador guardado el ${fechaHora(en)}. Aún no ha sido enviado al comité.`,
  guardado: (en) => `Cambios guardados el ${fechaHora(en)}.`,
  enviado: (en) => `Trabajo enviado al comité el ${fechaHora(en)}.`,
};

export default function DetalleTrabajoPage({ origen = 'mis' }) {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const usuario = useUsuario();
  const { etapa, fechas } = useRecepcion();
  const { trabajo } = useTrabajo(id);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Validación defensiva si no existe el trabajo o no hay permisos
  if (!trabajo || !puedeVer(trabajo, usuario)) return <NoEncontrado />;

  const codigoMostrado = trabajo.codigo ?? `TRB-2026-${String(trabajo.id).padStart(3, '0')}`;
  const tipo = obtenerTipo(trabajo.tipoId);
  const eje = obtenerEje(trabajo.ejeId);
  const seguimiento = obtenerSeguimiento(id, etapa);
  const dictamen = obtenerDictamen(id, etapa);
  const visible = estadoVisible(trabajo, etapa, dictamen, seguimiento);
  const editable = puedeEditar(trabajo, usuario, etapa);
  const modoBorrador = trabajo.estado === 'borrador' && editable;
  const items = listaVerificacion(trabajo);
  const aviso = state?.aviso;
  const soloLectura = etapa !== ETAPAS.ABIERTA && (visible === 'borrador' || visible === 'enviado');
  const conDictamen = visible === 'aceptado' || visible === 'rechazado';

  let filas = []; 
  let promedio = null;
  
  if (conDictamen && dictamen) {
    const revisores = Array.isArray(dictamen.revisores) ? dictamen.revisores : [];
    const criterios = obtenerCriterios();
    filas = puntajesPorCriterio(revisores, criterios);
    promedio = promedioPonderado(filas);
  }

  const enviar = async () => {
    setError(null); 
    setEnviando(true);
    try {
      await enviarTrabajo(id);
      navigate(`/mis-trabajos/${id}`, { state: { aviso: { tipo: 'enviado', en: new Date().toISOString() } } });
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setEnviando(false); 
    }
  };

  const migas = origen === 'nuevo'
    ? [{ texto: 'Nuevo trabajo', to: '/trabajos/nuevo' }, { texto: codigoMostrado }]
    : [{ texto: 'Mis trabajos', to: '/mis-trabajos' }, { texto: codigoMostrado }];

  const editarUrl = `/trabajos/nuevo/${id}/editar`;
  const versionFinal = fechas?.versionFinal;

  return (
    <main className="et-pagina">
      {aviso && TEXTO_AVISO[aviso.tipo] && (
        <Aviso tono="exito" icono="✓" accion={<Link to="/mis-trabajos" className="et-enlace">Ir a mis trabajos</Link>}>
          {TEXTO_AVISO[aviso.tipo](aviso.en)}
        </Aviso>
      )}
      {(modoBorrador || (trabajo.estado === 'enviado' && editable)) && <BannerEtapa />}
      {soloLectura && etapa === ETAPAS.CERRADA && fechas?.cierre && (
        <Aviso tono="ambar" icono="!" titulo={`La recepción cerró el ${fechaHora(fechas.cierre)}.`}>
          Este trabajo se muestra en modo lectura y ya no admite cambios. Si necesita corregir un dato, escriba al comité organizador.
        </Aviso>
      )}
      {error && <Aviso tono="error">{error}</Aviso>}

      {!modoBorrador && <Migas items={migas} />}

      <header className="et-cabecera et-cabecera--detalle">
        <div>
          <div className="et-fila">
            <span className="et-codigo">{codigoMostrado}</span>
            <InsigniaEstado estado={visible} />
            {soloLectura && <InsigniaEstado estado="borrador" texto="Solo lectura" />}
          </div>
          <h1 className="et-h1 et-h1--detalle">{trabajo.titulo || 'Sin título'}</h1>
        </div>
        <div className="et-acciones">
          {modoBorrador ? (
            <>
              <Boton variante="secundario" to={editarUrl}>Seguir editando</Boton>
              <Boton onClick={enviar} deshabilitado={!estaCompleto(trabajo) || enviando}>Enviar al comité</Boton>
            </>
          ) : (
            <>
              {trabajo.enlaceDocumento && <Boton variante="secundario" href={trabajo.enlaceDocumento}>Ver documento</Boton>}
              {visible === 'aceptado' && <Boton to="/mi-presentacion">Ver mi presentación</Boton>}
              {(visible === 'borrador' || visible === 'enviado') &&
                (editable ? <Boton to={editarUrl}>Editar</Boton> : <Boton deshabilitado>Editar (no disponible)</Boton>)}
            </>
          )}
        </div>
      </header>

      <div className="et-grid">
        {/* ------- columna izquierda ------- */}
        <div className="et-col">
          {modoBorrador && <DatosTrabajo trabajo={trabajo} tipo={tipo} eje={eje} variante="borrador" />}
          {!modoBorrador && conDictamen && dictamen && (
            <>
              <ResultadoDictamen dictamen={dictamen} promedio={promedio} />
              <RetroalimentacionRevisores revisores={dictamen.revisores} />
            </>
          )}
          {!modoBorrador && !conDictamen && (
            <>
              <DatosTrabajo
                trabajo={trabajo} tipo={tipo} eje={eje}
                mostrarEnlace={visible === 'borrador' || visible === 'enviado'}
                conHora={visible === 'borrador' || visible === 'enviado'}
              />
              <ListaCoautores trabajo={trabajo} />
            </>
          )}
        </div>

        {/* ------- columna derecha ------- */}
        <div className="et-lateral-col">
          {modoBorrador && (
            <>
              <ListaVerificacion items={items} />
              <TarjetaLateral tono="ambar">
                <p>Los borradores no participan del proceso de revisión. Debe enviarlo antes del cierre de la recepción.</p>
              </TarjetaLateral>
            </>
          )}

          {!modoBorrador && visible === 'en_revision' && seguimiento && (
            <>
              <TarjetaLateral tono="ambar" titulo="Dictamen">
                <h3 className="et-lateral__titulo">En revisión</h3>
                <p>La retroalimentación se mostrará aquí cuando el comité publique la decisión, el {fechas?.publicacion ? fechaHora(fechas.publicacion) : 'próximamente'}.</p>
              </TarjetaLateral>
              <SeguimientoTrabajo trabajo={trabajo} seguimiento={seguimiento} publicacion={fechas?.publicacion} />
            </>
          )}

          {!modoBorrador && conDictamen && (
            <>
              <PuntajesCriterios filas={filas} promedio={promedio} aceptado={visible === 'aceptado'} />
              {visible === 'aceptado' ? (
                <TarjetaLateral titulo="Siguiente paso">
                  <p>Envíe la versión final con las observaciones atendidas{versionFinal ? ` hasta el ${fechaCorta(versionFinal)}.` : '.'}</p>
                  <Boton onClick={() => console.log('Subir versión final', id)}>Subir versión final</Boton>
                </TarjetaLateral>
              ) : (
                <TarjetaLateral titulo="¿Tiene dudas?">
                  <p>Puede solicitar una aclaración al comité organizador dentro de los 5 días siguientes a la publicación.</p>
                  <Boton variante="secundario" onClick={() => console.log('Escribir al comité', id)}>Escribir al comité</Boton>
                </TarjetaLateral>
              )}
            </>
          )}

          {!modoBorrador && (visible === 'borrador' || visible === 'enviado') && (
            <>
              {!editable && (
                <TarjetaLateral tono="gris" titulo="Campos bloqueados">
                  <p className="et-suave">Título, tipo, eje temático, resumen, palabras clave, coautores y enlace al documento.</p>
                </TarjetaLateral>
              )}
              <TarjetaLateral titulo="Qué sigue">
                {visible === 'borrador' ? (
                  <p>Este trabajo no fue enviado y no participará en la revisión.</p>
                ) : editable ? (
                  <p>Puede editarlo hasta el cierre de la recepción, el {fechas?.cierre ? fechaHora(fechas.cierre) : 'programado'}. Después el comité asignará revisores.</p>
                ) : (
                  <p>El comité asignará revisores. Recibirá un correo cuando se publique la decisión, el {fechas?.publicacion ? fechaHora(fechas.publicacion) : 'programado'}.</p>
                )}
              </TarjetaLateral>
            </>
          )}
        </div>
      </div>
    </main>
  );
}