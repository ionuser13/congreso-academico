// src/features/configuracion/ConfiguracionEdicionPage.jsx
import { useState } from 'react';
import { Settings, Layers, FileText, Calendar, CheckSquare } from 'lucide-react';
import edicionInicial from '../../shared/mocks/edicion.json';
import './ConfiguracionEdicionPage.css'; // Importamos nuestro archivo de estilos
import EdicionTab from './components/EdicionTab'; // Importamos la pestaña 1

const TABS = [
  { id: 'edicion',    label: 'Edición',                icon: Settings   },
  { id: 'ejes',       label: 'Ejes temáticos',         icon: Layers     },
  { id: 'tipos',      label: 'Tipos de trabajo',       icon: FileText   },
  { id: 'fechas',     label: 'Fechas límite',          icon: Calendar   },
  { id: 'criterios',  label: 'Criterios de evaluación',icon: CheckSquare},
];

export default function ConfiguracionEdicionPage() {
  const [edicion, setEdicion] = useState(edicionInicial);
  const [tabActiva, setTabActiva] = useState('edicion');

  return (
    <div className="page-container">
      
      {/* Encabezado del módulo */}
      <header className="page-header">
        <h1 className="page-title">
          Configuración de la edición
        </h1>
        <p className="page-subtitle">
          Defina la edición vigente antes de abrir la recepción de trabajos.
        </p>
      </header>

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
        {tabActiva === 'edicion' && (
          <EdicionTab datos={edicion} onActualizar={setEdicion} />
        )}
        {tabActiva === 'ejes' && <p>Pestaña Ejes temáticos — próximamente.</p>}
        {tabActiva === 'tipos' && <p>Pestaña Tipos de trabajo — próximamente.</p>}
        {tabActiva === 'fechas' && <p>Pestaña Fechas límite — próximamente.</p>}
        {tabActiva === 'criterios' && <p>Pestaña Criterios de evaluación — próximamente.</p>}
      </main>
      
    </div>
  );
}