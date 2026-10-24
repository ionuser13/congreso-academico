import TarjetaLateral from '../common/TarjetaLateral';
import { decimal1 } from '../../utils/formatos';

export default function PuntajesCriterios({ filas = [], promedio, aceptado }) {
  const listaFilas = Array.isArray(filas) ? filas : [];

  return (
    <TarjetaLateral titulo="Puntaje por criterio">
      <ul className="et-puntajes">
        {listaFilas.length > 0 ? (
          listaFilas.map((f, index) => (
            <li key={f.id ?? index}>
              <span>{f.nombre ?? 'Criterio'} ({f.peso ?? 0} %)</span>
              <strong>{decimal1(f.valor)}</strong>
            </li>
          ))
        ) : (
          <li className="et-suave" style={{ padding: '0.5rem 0', textAlign: 'center' }}>
            No hay puntajes registrados.
          </li>
        )}
        
        <li className="et-puntajes__total">
          <strong>Promedio ponderado</strong>
          <strong className={aceptado ? 'et-texto-verde' : 'et-texto-rojo'}>
            {decimal1(promedio)}
          </strong>
        </li>
      </ul>
    </TarjetaLateral>
  );
}