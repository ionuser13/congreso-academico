import { useMemo, useState } from 'react';
import { listarTrabajosDe } from '../services/trabajosService';
import { obtenerDictamen, obtenerSeguimiento } from '../services/lecturaRevision';
import { ORDEN_FILTROS, estadoVisible } from '../utils/estadosTrabajo';
import { normalizar } from '../utils/formatos';
import { useRecepcion } from './useRecepcion';

const POR_PAGINA = 6;

export function useMisTrabajos(usuario) {
  const { etapa } = useRecepcion();
  const [filtro, setFiltroState] = useState('todos');
  const [busqueda, setBusquedaState] = useState('');
  const [pagina, setPagina] = useState(1);

  const todos = useMemo(
    () =>
      listarTrabajosDe(usuario)
        .map((t) => {
          const dictamen = obtenerDictamen(t.id, etapa);
          const seguimiento = obtenerSeguimiento(t.id, etapa);
          return { 
            ...t, 
            visible: estadoVisible(t, etapa, dictamen, seguimiento), 
            dictamen 
          };
        })
        .sort((a, b) => a.id - b.id), // Ordenamiento numérico correcto para IDs numéricos
    [usuario?.id, usuario?.correo, etapa],
  );

  const conteos = useMemo(() => {
    const c = {};
    todos.forEach((t) => { c[t.visible] = (c[t.visible] || 0) + 1; });
    return c;
  }, [todos]);

  const estadosPresentes = ORDEN_FILTROS.filter((e) => conteos[e]);

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return todos.filter(
      (t) =>
        (filtro === 'todos' || t.visible === filtro) &&
        (!q || normalizar(t.titulo).includes(q) || normalizar(t.codigo || '').includes(q)),
    );
  }, [todos, filtro, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice((paginaSegura - 1) * POR_PAGINA, paginaSegura * POR_PAGINA);

  return {
    todos, filtrados, visibles, conteos, estadosPresentes, filtro, busqueda,
    setFiltro: (f) => { setFiltroState(f); setPagina(1); },
    setBusqueda: (b) => { setBusquedaState(b); setPagina(1); },
    pagina: paginaSegura, setPagina, totalPaginas,
  };
}