import { useContext } from 'react';
import { ProgramaContext } from '../context/programaContext';

// Atajo para leer el contexto. Solo funciona dentro de <ProgramaProvider>.
export function usePrograma() {
  const contexto = useContext(ProgramaContext);
  if (!contexto) throw new Error('usePrograma debe usarse dentro de <ProgramaProvider>');
  return contexto;
}
