import { useCallback, useEffect, useState } from 'react';
import { obtenerTrabajo } from '../services/trabajosService';

export function useTrabajo(id) {
  // el id se evalua correctamente incluso si viene como string
  const [trabajo, setTrabajo] = useState(() => (id != null ? obtenerTrabajo(id) : null));

  const recargar = useCallback(() => {
    setTrabajo(id != null ? obtenerTrabajo(id) : null);
  }, [id]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { trabajo, recargar };
}