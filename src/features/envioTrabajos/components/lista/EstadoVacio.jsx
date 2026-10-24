import { useNavigate } from 'react-router-dom';
import Boton from '../common/Boton';
import { fechaHora } from '../../utils/formatos';

export default function EstadoVacio({ abierta, cierre }) {
  const navigate = useNavigate();

  const irABases = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('bases')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const fechaFormateada = cierre ? fechaHora(cierre) : 'la fecha programada';

  return (
    <div className="et-card et-vacio">
      <div className="et-vacio__icono" aria-hidden="true">✎</div>
      <h2>Todavía no tiene trabajos registrados</h2>
      
      {abierta ? (
        <>
          <p>
            Registre su trabajo antes del {fechaFormateada}. Puede guardarlo como borrador y completarlo después.
          </p>
          <Boton to="/trabajos/nuevo">Registrar mi primer trabajo</Boton>
        </>
      ) : (
        <p>
          La recepción de trabajos cerró el {fechaFormateada}.
        </p>
      )}
      
      <button type="button" className="et-enlace" onClick={irABases}>
        Revisar las bases del congreso
      </button>
    </div>
  );
}