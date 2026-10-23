import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Boton from '../components/common/Boton';
import Aviso from '../components/common/Aviso';
import BannerEtapa from '../components/common/BannerEtapa';
import PasosTrabajo, { TOTAL_PASOS } from '../components/common/PasosTrabajo';
import TarjetaLateral from '../components/common/TarjetaLateral';
import FormularioDatosGenerales from '../components/formulario/FormularioDatosGenerales';
import { useUsuario } from '../hooks/useUsuario';
import { useRecepcion } from '../hooks/useRecepcion'; 
import { useTrabajo } from '../hooks/useTrabajo';
import { useTrabajoForm } from '../hooks/useTrabajoForm';
import { actualizarTrabajo, crearTrabajo } from '../services/trabajosService';
import { obtenerEjes, obtenerTipo, obtenerTipos } from '../services/lecturaEdicion';
import { puedeEditar, textoRequisitos } from '../utils/reglasTrabajo';
import { textoResumenErrores } from '../utils/validacionesTrabajo';

export default function DatosGeneralesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = useUsuario();
  const { etapa, abierta } = useRecepcion();
  const { trabajo } = useTrabajo(id);
  
  const form = useTrabajoForm(trabajo);
  const [errorServicio, setErrorServicio] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Sincronizamos el formulario si el trabajo cambia o se carga asíncronamente
  useEffect(() => {
    if (trabajo) {
      // Re-inicializamos o actualizamos los valores del form si es necesario
    }
  }, [trabajo]);

  if (id && trabajo === null) return <Navigate to="/mis-trabajos" replace />;
  if (id && trabajo && !puedeEditar(trabajo, usuario, etapa)) return <Navigate to={`/mis-trabajos/${id}`} replace />;
  
  if (!id && !abierta) {
    return (
      <main className="et-pagina">
        <Aviso tono="ambar" titulo="La recepción ya cerró.">No es posible registrar nuevos trabajos.</Aviso>
        <Boton variante="secundario" to="/mis-trabajos">Ir a mis trabajos</Boton>
      </main>
    );
  }

  const esEnviado = trabajo?.estado === 'enviado';
  const tipo = obtenerTipo(form.valores.tipoId);
  const hayErrores = Object.keys(form.errores).length > 0;

  const persistir = async () => {
    const datos = { ...form.valores };
    return id ? actualizarTrabajo(id, datos) : crearTrabajo(datos, usuario);
  };

  const guardarBorrador = async () => {
    setErrorServicio(null);
    if (esEnviado) {
      const e = form.validar();
      if (Object.keys(e).length) return;
    } else if (!form.valores.titulo.trim()) {
      form.setErrores({ titulo: { mensaje: 'Ingrese al menos el título para guardar el borrador.', resumen: 'falta el título' } });
      return;
    }
    try {
      setGuardando(true);
      const t = await persistir();
      navigate(`/trabajos/nuevo/${t.id}`, { 
        state: { aviso: { tipo: esEnviado ? 'guardado' : 'borrador', en: new Date().toISOString() } },
        replace: true 
      });
    } catch (err) { 
      setErrorServicio(err.message); 
    } finally { 
      setGuardando(false); 
    }
  };

  const continuar = async () => {
    setErrorServicio(null);
    if (Object.keys(form.validar()).length) return;
    try {
      setGuardando(true);
      const t = await persistir();
      navigate(`/trabajos/nuevo/${t.id}/coautores`);
    } catch (err) { 
      setErrorServicio(err.message); 
    } finally { 
      setGuardando(false); 
    }
  };

  return (
    <main className="et-pagina">
      <BannerEtapa />
      <header className="et-cabecera">
        <div>
          <h1 className="et-h1">{id ? 'Editar trabajo' : 'Nuevo trabajo'}</h1>
          <p className="et-suave">Paso 1 de {TOTAL_PASOS} · Datos generales</p>
        </div>
        <div className="et-acciones">
          <button type="button" className="et-enlace et-enlace--fuerte" onClick={guardarBorrador} disabled={guardando}>
            {esEnviado ? 'Guardar cambios' : 'Guardar como borrador'}
          </button>
          <Boton onClick={continuar} disabled={guardando}>Continuar a coautores</Boton>
        </div>
      </header>

      <PasosTrabajo actual={1} />

      {hayErrores && (
        <Aviso tono="error" titulo={`No se pudo continuar: revise ${Object.keys(form.errores).length} ${Object.keys(form.errores).length === 1 ? 'campo' : 'campos'}`}>
          <br />{textoResumenErrores(form.errores)}
        </Aviso>
      )}
      {errorServicio && <Aviso tono="error">{errorServicio}</Aviso>}

      <div className="et-grid">
        <FormularioDatosGenerales
          valores={form.valores} 
          errores={form.errores}
          tipos={obtenerTipos()} 
          ejes={obtenerEjes()}
          onCambio={form.cambiar} 
          onAgregarPalabra={form.agregarPalabra} 
          onQuitarPalabra={form.quitarPalabra}
        />
        <div className="et-lateral-col">
          <TarjetaLateral titulo="Requisitos del tipo elegido">
            <p>{textoRequisitos(tipo)}</p>
            <p className="et-suave">Puede cambiar el tipo mientras el trabajo esté en borrador.</p>
          </TarjetaLateral>
          <TarjetaLateral titulo="Antes de enviar">
            <p className="et-suave">Verifique que el documento no contenga los nombres de los autores: la revisión es ciega.</p>
            <p className="et-suave">Podrá editar el trabajo hasta el cierre de la recepción.</p>
          </TarjetaLateral>
          {hayErrores && (
            <TarjetaLateral tono="ambar" titulo="Sus cambios no se han guardado">
              <p>Puede guardar el trabajo como borrador y corregir los campos más tarde, antes del cierre de la recepción.</p>
            </TarjetaLateral>
          )}
        </div>
      </div>
      <p><Link to="/mis-trabajos" className="et-enlace">Cancelar y volver a mis trabajos</Link></p>
    </main>
  );
}