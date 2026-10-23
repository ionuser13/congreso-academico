import { Route } from 'react-router-dom';
import { RutaProtegida } from '../auth';
import './envioTrabajos.css';
import DatosGeneralesPage from './pages/DatosGeneralesPage';
import CoautoresPage from './pages/CoautoresPage';
import MisTrabajosPage from './pages/MisTrabajosPage';
import DetalleTrabajoPage from './pages/DetalleTrabajoPage';

export const rutasEnvioTrabajos = (
  <Route element={<RutaProtegida roles={['autor', 'ambos']} />}>
    <Route path="/trabajos/nuevo" element={<DatosGeneralesPage />} />
    <Route path="/trabajos/nuevo/:id/editar" element={<DatosGeneralesPage />} />
    <Route path="/trabajos/nuevo/:id/coautores" element={<CoautoresPage />} />
    <Route path="/trabajos/nuevo/:id" element={<DetalleTrabajoPage origen="nuevo" />} />
    <Route path="/mis-trabajos" element={<MisTrabajosPage />} />
    <Route path="/mis-trabajos/:id" element={<DetalleTrabajoPage origen="mis" />} />
  </Route>
);