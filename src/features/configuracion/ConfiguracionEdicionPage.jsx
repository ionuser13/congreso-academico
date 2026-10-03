import { useState } from 'react';
import { Settings, Layers, FileText, Calendar, CheckSquare } from 'lucide-react';
import edicionInicial from '../../shared/mocks/edicion.json';

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Encabezado del módulo */}
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', margin: 0 }}>
          Configuración de la edición
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Defina la edición vigente antes de abrir la recepción de trabajos.
        </p>
      </header>

      {/* Barra de pestañas */}
      <nav style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '2px solid var(--color-border)',
        marginBottom: '2rem',
        overflowX: 'auto',
      }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const esActiva = tabActiva === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.2rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: esActiva ? 600 : 500,
                color: esActiva ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: esActiva ? '3px solid var(--color-primary)' : '3px solid transparent',
                marginBottom: '-2px',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Contenido dinámico */}
      <main style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '1.5rem',
      }}>
        {tabActiva === 'edicion' && <p>Pestaña Edición — próximamente.</p>}
        {tabActiva === 'ejes' && <p>Pestaña Ejes temáticos — próximamente.</p>}
        {tabActiva === 'tipos' && <p>Pestaña Tipos de trabajo — próximamente.</p>}
        {tabActiva === 'fechas' && <p>Pestaña Fechas límite — próximamente.</p>}
        {tabActiva === 'criterios' && <p>Pestaña Criterios de evaluación — próximamente.</p>}
      </main>
    </div>
  );
}