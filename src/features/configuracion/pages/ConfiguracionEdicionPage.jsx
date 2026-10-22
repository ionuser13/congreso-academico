import { useState, useEffect } from 'react';
import { Settings, Layers, FileText, Calendar, CheckSquare, Save } from 'lucide-react';

// Importación de datos (Contrato de datos en shared)
// Debe quedar así:
import edicionInicial from '../../../shared/mocks/edicion.json';

// Importación de componentes (Pestañas)
import EdicionTab from '../components/Edicion/EdicionTab';
import EjesTematicosTab from '../components/EjesTematicos/EjesTematicosTab';
import TiposTrabajoTab from '../components/TiposTrabajo/TiposTrabajoTab';
import FechasLimiteTab from '../components/FechasLimite/FechasLimiteTab';
import CriteriosEvaluacionTab from '../components/CriteriosEvaluacion/CriteriosEvaluacionTab';

// Importación de estilos
import './ConfiguracionEdicionPage.css';

const TABS = [
  { id: 'edicion',    label: 'Edición',                icon: Settings   },
  { id: 'ejes',       label: 'Ejes temáticos',         icon: Layers     },
  { id: 'tipos',      label: 'Tipos de trabajo',       icon: FileText   },
  { id: 'fechas',     label: 'Fechas límite',          icon: Calendar   },
  { id: 'criterios',  label: 'Criterios de evaluación',icon: CheckSquare},
];

export default function ConfiguracionEdicionPage() {
  // 1. Lógica de Persistencia (Requisito Rúbrica G1)
  // Busca en el navegador si ya hay datos guardados. Si no, usa el JSON inicial.
  const datosGuardados = localStorage.getItem('edicionCongreso');
  const estadoInicial = datosGuardados ? JSON.parse(datosGuardados) : edicionInicial;

  // 2. Estados
  const [edicion, setEdicion] = useState(estadoInicial);
  const [tabActiva, setTabActiva] = useState('edicion');
  
  // Estado para mostrar el mensaje de éxito al guardar
  const [mostrarExito, setMostrarExito] = useState(false);

  // 3. Efecto para guardar automáticamente cuando hay cambios (Opcional, pero asegura que no se pierda nada)
  useEffect(() => {
    localStorage.setItem('edicionCongreso', JSON.stringify(edicion));
  }, [edicion]);

  // 4. Función del botón "Guardar cambios" (Mockup 2.1)
  const handleGuardar = () => {
    localStorage.setItem('edicionCongreso', JSON.stringify(edicion));
    setMostrarExito(true);
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setMostrarExito(false);
    }, 3000);
  };

  return (
    <div className="page-container">
      
      {/* Encabezado del módulo */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Configuración de la edición</h1>
          <p className="page-subtitle">Defina la edición vigente antes de abrir la recepción de trabajos.</p>
        </div>
        
        {/* Botón Guardar (Faltaba en el mockup) */}
        <button className="btn-primario" onClick={handleGuardar}>
          <Save size={18} />
          Guardar cambios
        </button>
      </header>

      {/* Mensaje de éxito flotante */}
      {mostrarExito && (
        <div className="mensaje-exito">
          Cambios guardados correctamente en el navegador.
        </div>
      )}

      {/* Barra de pestañas */}
      <nav className="tabs-nav">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const esActiva = tabActiva === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`tab-button ${esActiva ? 'tab-active' : 'tab-inactive'}`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Contenido dinámico */}
      <main className="content-card">
        {tabActiva === 'edicion' && <EdicionTab datos={edicion} onActualizar={setEdicion} />}
        {tabActiva === 'ejes' && <EjesTematicosTab datos={edicion} onActualizar={setEdicion} />}
        {tabActiva === 'tipos' && <TiposTrabajoTab datos={edicion} onActualizar={setEdicion} />}
        {tabActiva === 'fechas' && <FechasLimiteTab datos={edicion} onActualizar={setEdicion} />}
        {tabActiva === 'criterios' && <CriteriosEvaluacionTab datos={edicion} onActualizar={setEdicion} />}
      </main>
      
    </div>
  );
}