import BannerEtapa from '../components/common/BannerEtapa';
import Boton from '../components/common/Boton';
import TarjetaTrabajo from '../components/lista/TarjetaTrabajo';
import FiltrosTrabajos from '../components/lista/FiltrosTrabajos';
import PaginacionTrabajos from '../components/lista/PaginacionTrabajos';
import EstadoVacio from '../components/lista/EstadoVacio';
import { useUsuario } from '../hooks/useUsuario';
import { useRecepcion } from '../hooks/useRecepcion';
import { useMisTrabajos } from '../hooks/useMisTrabajos';

export default function MisTrabajosPage() {
  const usuario = useUsuario();
  const { etapa, abierta, fechas } = useRecepcion();
  const m = useMisTrabajos(usuario);
  
  // Garantizamos arreglos seguros para evitar errores si el hook tarda en poblarse
  const todos = Array.isArray(m?.todos) ? m.todos : [];
  const filtrados = Array.isArray(m?.filtrados) ? m.filtrados : [];
  const visibles = Array.isArray(m?.visibles) ? m.visibles : [];
  const vacio = todos.length === 0;

  return (
    <main className="et-pagina">
      <BannerEtapa />
      
      <header className="et-cabecera">
        <div>
          <h1 className="et-h1">Mis trabajos</h1>
          <p className="et-suave">
            {vacio
              ? 'Aún no registra trabajos en esta edición'
              : `${todos.length} ${todos.length === 1 ? 'trabajo registrado' : 'trabajos registrados'} como autor o coautor`}
          </p>
        </div>
        {abierta ? (
          <Boton to="/trabajos/nuevo">Nuevo trabajo</Boton>
        ) : (
          !vacio && <Boton deshabilitado>Nuevo trabajo (recepción cerrada)</Boton>
        )}
      </header>

      {vacio ? (
        <EstadoVacio abierta={abierta} cierre={fechas?.cierre} />
      ) : (
        <>
          <FiltrosTrabajos
            filtro={m.filtro} 
            total={todos.length} 
            conteos={m.conteos || {}} 
            estados={m.estadosPresentes || []}
            busqueda={m.busqueda || ''} 
            onFiltro={m.setFiltro} 
            onBusqueda={m.setBusqueda}
          />

          {filtrados.length === 0 ? (
            <p className="et-suave" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              Ningún trabajo coincide con el filtro o la búsqueda.
            </p>
          ) : (
            <div className="et-lista">
              {visibles.map((t) => (
                <TarjetaTrabajo 
                  key={t.id ?? t.codigo} 
                  trabajo={t} 
                  usuario={usuario} 
                  etag={etapa} 
                  etapa={etapa} 
                />
              ))}
            </div>
          )}

          {filtrados.length > 0 && (
            <PaginacionTrabajos
              mostrando={visibles.length} 
              total={filtrados.length}
              pagina={m.pagina} 
              totalPaginas={m.totalPaginas} 
              onPagina={m.setPagina}
            />
          )}
        </>
      )}
    </main>
  );
}