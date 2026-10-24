import { Outlet } from 'react-router-dom';
import { ProgramaProvider } from '../context/ProgramaProvider';
import { usePrograma } from '../hooks/usePrograma';
import '../programa.css';

// Muestra el aviso (toast) de resultado de cualquier operación.
function AvisoGlobal() {
  const { aviso } = usePrograma();
  if (!aviso) return null;
  return (
    <div key={aviso.clave} className={`prg-aviso prg-aviso--${aviso.tipo}`} role="status">
      {aviso.texto}
    </div>
  );
}

// Envuelve las 4 pantallas de H6 para que compartan el mismo estado.
export default function ProgramaLayout() {
  return (
    <ProgramaProvider>
      <main className="prg">
        <Outlet />
      </main>
      <AvisoGlobal />
    </ProgramaProvider>
  );
}
