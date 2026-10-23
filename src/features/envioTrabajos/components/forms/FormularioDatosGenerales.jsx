import CampoTexto from './CampoTexto';
import PalabrasClave from './PalabrasClave';
import { MAX_RESUMEN } from '../../utils/validacionesTrabajo';
import { miles } from '../../utils/formatos';

export default function FormularioDatosGenerales({ 
  valores, 
  errores, 
  tipos, 
  ejes, 
  onCambio, 
  onAgregarPalabra, 
  onQuitarPalabra 
}) {
  const msg = (c) => errores[c]?.mensaje;
  const largo = valores.resumen?.length || 0;

  // Encontramos el tipo seleccionado para mostrar sus requerimientos específicos si es necesario
  const tipoSeleccionado = tipos.find(t => Number(t.id) === Number(valores.tipoId));

  return (
    <div className="et-card et-form">
      <CampoTexto id="titulo" etiqueta="TÍTULO DEL TRABAJO" requerido error={msg('titulo')}>
        <input 
          id="titulo" 
          className="et-input" 
          value={valores.titulo ?? ''}
          onChange={(e) => onCambio('titulo', e.target.value)} 
          aria-invalid={!!msg('titulo')} 
        />
      </CampoTexto>

      <div className="et-form__fila">
        <CampoTexto id="tipoId" etiqueta="TIPO DE TRABAJO" requerido error={msg('tipoId')}>
          <select 
            id="tipoId" 
            className="et-input" 
            value={valores.tipoId ?? ''}
            onChange={(e) => onCambio('tipoId', e.target.value ? Number(e.target.value) : null)} 
            aria-invalid={!!msg('tipoId')}
          >
            <option value="">Seleccione un tipo</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </CampoTexto>

        <CampoTexto id="ejeId" etiqueta="EJE TEMÁTICO" requerido error={msg('ejeId')}>
          <select 
            id="ejeId" 
            className="et-input" 
            value={valores.ejeId ?? ''}
            onChange={(e) => onCambio('ejeId', e.target.value ? Number(e.target.value) : null)} 
            aria-invalid={!!msg('ejeId')}
          >
            <option value="">Seleccione un eje</option>
            {ejes.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </CampoTexto>
      </div>

      {tipoSeleccionado && tipoSeleccionado.formato && (
        <div className="et-form__nota text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
          📌 <strong>Requisito para {tipoSeleccionado.nombre}:</strong> Formato esperado: {tipoSeleccionado.formato}.
        </div>
      )}

      <CampoTexto 
        id="resumen" 
        etiqueta="RESUMEN" 
        requerido 
        error={msg('resumen')}
        ayuda="Máximo 68 caracteres por línea para facilitar la lectura."
        contador={`${miles(largo)} / ${miles(MAX_RESUMEN)}${errores.resumen ? '' : ' caracteres'}`}
      >
        <textarea 
          id="resumen" 
          className="et-input et-input--area" 
          rows={5} 
          value={valores.resumen ?? ''}
          onChange={(e) => onCambio('resumen', e.target.value)} 
          aria-invalid={!!msg('resumen')} 
        />
      </CampoTexto>

      <PalabrasClave 
        valor={valores.palabrasClave ?? []} 
        error={msg('palabrasClave')}
        onAgregar={onAgregarPalabra} 
        onQuitar={onQuitarPalabra} 
      />

      <CampoTexto 
        id="enlaceDocumento" 
        etiqueta="ENLACE AL DOCUMENTO" 
        requerido 
        error={msg('enlaceDocumento')}
        ayuda="El enlace debe permitir el acceso de lectura al comité y a los revisores."
      >
        <input 
          id="enlaceDocumento" 
          className="et-input" 
          value={valores.enlaceDocumento ?? ''} 
          inputMode="url"
          onChange={(e) => onCambio('enlaceDocumento', e.target.value)} 
          aria-invalid={!!msg('enlaceDocumento')} 
        />
      </CampoTexto>
    </div>
  );
}