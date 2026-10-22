// src/features/configuracion/components/EdicionTab.jsx
import { Tag, MapPin, FileText } from 'lucide-react';
import './EdicionTab.css'; // Importamos los estilos


export default function EdicionTab({ datos, onActualizar }) {
  const handleChangeRaiz = (campo, valor) => {
    onActualizar({ ...datos, [campo]: valor });
  };

  const totalCriterios = datos.criteriosEvaluacion.reduce(
    (sum, c) => sum + Number(c.pesoPorcentaje || 0),
    0
  );
  const criteriosOk = totalCriterios === 100;
  const diferencia = 100 - totalCriterios;

  const descMax = 400;
  const descLen = datos.descripcion?.length || 0;
  const descCerca = descLen > descMax * 0.9;

  return (
    <div className="edicion-grid">
      
      {/* ============ COLUMNA IZQUIERDA ============ */}
      <section className="tarjeta">
        <header className="tarjeta-header">
          <h2 className="tarjeta-titulo">Datos generales</h2>
          <span className="badge-estado">Estado: {datos.estadoEtiqueta}</span>
        </header>

        {/* Nombre + Año */}
        <div className="fila-inputs">
          <div>
            <label className="label-campo">
              <Tag size={14} color="var(--color-accent)" />
              Nombre de la edición
            </label>
            <input
              type="text"
              className="input-texto"
              value={datos.nombre || ''}
              onChange={(e) => handleChangeRaiz('nombre', e.target.value)}
              placeholder="Ej. VIII Congreso Académico Estudiantil"
            />
          </div>
          <div>
            <label className="label-campo">Año</label>
            <input
              type="number"
              className="input-texto"
              value={datos.anio || ''}
              onChange={(e) => handleChangeRaiz('anio', Number(e.target.value))}
              min="2024"
              max="2100"
            />
          </div>
        </div>

        {/* Sede */}
        <div className="campo-grupo">
          <label className="label-campo">
            <MapPin size={14} color="var(--color-accent)" />
            Sede
          </label>
          <input
            type="text"
            className="input-texto"
            value={datos.sede || ''}
            onChange={(e) => handleChangeRaiz('sede', e.target.value)}
            placeholder="Ej. Auditorio Central, Universidad de Lima"
          />
        </div>

        {/* Descripción */}
        <div className="campo-grupo">
          <label className="label-campo">
            <FileText size={14} color="var(--color-accent)" />
            Descripción pública
          </label>
          <textarea
            rows={4}
            className="textarea-texto"
            value={datos.descripcion || ''}
            onChange={(e) => {
              if (e.target.value.length <= descMax) {
                handleChangeRaiz('descripcion', e.target.value);
              }
            }}
            placeholder="Describa el alcance temático, objetivos y público objetivo del congreso..."
          />
          <div className={`contador-texto ${descCerca ? 'contador-alerta' : ''}`}>
            <span>Se muestra en la página pública.</span>
            <span>{descLen} / {descMax} caracteres</span>
          </div>
        </div>

        {/* Botón inferior */}
        <div className="footer-formulario">
          <button type="button" className="btn-secundario">
            Cambiar estado de la edición
          </button>
        </div>
      </section>

      {/* ============ COLUMNA DERECHA ============ */}
      <aside className="panel-derecho">
        
        {/* Resumen */}
        <div className="tarjeta">
          <h3 className="tarjeta-subtitulo">Resumen de lo configurado</h3>
          <ul className="lista-datos">
            <li className="lista-item">
              <span className="lista-label">Ejes temáticos</span>
              <strong>{datos.ejesTematicos.length} · listo</strong>
            </li>
            <li className="lista-item">
              <span className="lista-label">Tipos de trabajo</span>
              <strong>{datos.tiposTrabajo.length} · listo</strong>
            </li>
            <li className="lista-item">
              <span className="lista-label">Fechas límite</span>
              <strong>{datos.fechasLimite.length} · listo</strong>
            </li>
            <li className="lista-item">
              <span className="lista-label">Criterios</span>
              <strong className={criteriosOk ? 'texto-exito' : 'texto-alerta'}>
                {criteriosOk
                  ? 'Pesos suman 100'
                  : diferencia > 0
                  ? `Faltan ${diferencia} pts`
                  : `Sobran ${Math.abs(diferencia)} pts`}
              </strong>
            </li>
          </ul>
        </div>

        {/* Recepción */}
        <div className="tarjeta">
          <h3 className="tarjeta-subtitulo texto-primario">
            {datos.estadoEtiqueta}
          </h3>
          <p className="texto-recepcion">
            Cierra el <strong className="texto-resaltado">30/09/2026</strong> a
            las <strong className="texto-resaltado">23:59</strong>. Mientras
            esté abierta, los autores pueden editar sus trabajos.
          </p>
        </div>

        {/* Actividad */}
        <div className="tarjeta">
          <h3 className="tarjeta-subtitulo">Actividad</h3>
          <ul className="lista-datos">
            <li className="lista-item">
              <span className="lista-label">Trabajos recibidos</span>
              <strong>{datos.actividad.trabajosRecibidos}</strong>
            </li>
            <li className="lista-item">
              <span className="lista-label">Revisores registrados</span>
              <strong>{datos.actividad.revisoresRegistrados}</strong>
            </li>
          </ul>
        </div>

      </aside>
    </div>
  );
}