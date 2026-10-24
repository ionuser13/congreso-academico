import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProgramaContext } from './programaContext';
import * as servicio from '../services/programaService';

// Guarda el estado del programa en memoria (y en localStorage para que no se pierda al recargar).
// Cada operación valida con el servicio y avisa el resultado (requisito: toda escritura notifica).
export function ProgramaProvider({ children }) {
  const [programa, setPrograma] = useState(() => servicio.cargarProgramaGuardado());
  const [aviso, setAviso] = useState(null);
  const trabajos = useMemo(() => servicio.obtenerTrabajosAceptados(), []);
  const ejes = useMemo(() => servicio.obtenerEjes(), []);

  useEffect(() => {
    servicio.guardarPrograma(programa);
  }, [programa]);

  useEffect(() => {
    if (!aviso) return undefined;
    const temporizador = setTimeout(() => setAviso(null), 4000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  const notificar = useCallback((texto, tipo = 'exito') => setAviso({ texto, tipo, clave: Date.now() }), []);

  // Crea (idActual = null) o edita una sesión. Devuelve { ok, errores } para que el formulario muestre los errores.
  const guardarSesion = useCallback(
    (datos, idActual = null) => {
      const errores = servicio.validarSesion(datos, programa.sesiones, idActual);
      if (Object.keys(errores).length) return { ok: false, errores };
      setPrograma((p) => ({
        ...p,
        sesiones: idActual
          ? p.sesiones.map((s) => (s.id === idActual ? { ...s, ...datos } : s))
          : [...p.sesiones, { ...datos, id: Date.now(), trabajoIds: [] }],
      }));
      notificar(idActual ? 'Sesión actualizada correctamente.' : 'Sesión creada correctamente.');
      return { ok: true, errores: {} };
    },
    [programa.sesiones, notificar]
  );

  const agregarTrabajo = useCallback(
    (sesionId, trabajoId) => {
      const sesion = programa.sesiones.find((s) => s.id === sesionId);
      const trabajo = trabajos.find((t) => t.id === trabajoId);
      if (!sesion || !trabajo) return;
      const problema = servicio.validarAsignacion(trabajo, sesion, programa.sesiones, trabajos);
      if (problema) return notificar(problema, 'error');
      setPrograma((p) => ({
        ...p,
        sesiones: p.sesiones.map((s) => (s.id === sesionId ? { ...s, trabajoIds: [...s.trabajoIds, trabajoId] } : s)),
      }));
      notificar(`«${trabajo.codigo}» agregado a la sesión.`);
    },
    [programa.sesiones, trabajos, notificar]
  );

  const quitarTrabajo = useCallback(
    (sesionId, trabajoId) => {
      setPrograma((p) => ({
        ...p,
        sesiones: p.sesiones.map((s) => (s.id === sesionId ? { ...s, trabajoIds: s.trabajoIds.filter((id) => id !== trabajoId) } : s)),
      }));
      notificar('Trabajo quitado de la sesión.');
    },
    [notificar]
  );

  // Sube (delta = -1) o baja (delta = +1) un trabajo dentro de la sesión.
  const moverTrabajo = useCallback(
    (sesionId, indice, delta) => {
      setPrograma((p) => ({
        ...p,
        sesiones: p.sesiones.map((s) => {
          const destino = indice + delta;
          if (s.id !== sesionId || destino < 0 || destino >= s.trabajoIds.length) return s;
          const ids = [...s.trabajoIds];
          [ids[indice], ids[destino]] = [ids[destino], ids[indice]];
          return { ...s, trabajoIds: ids };
        }),
      }));
    },
    []
  );

  const publicarPrograma = useCallback(() => {
    if (servicio.idsEnConflicto(programa.sesiones).size) {
      return notificar('No se puede publicar: hay sesiones con solapamiento de sala y hora.', 'error');
    }
    setPrograma((p) => ({ ...p, publicado: true }));
    notificar('Programa publicado correctamente.');
  }, [programa.sesiones, notificar]);

  const reiniciarDatos = useCallback(() => {
    setPrograma(servicio.programaInicial());
    notificar('Se restablecieron los datos de ejemplo.');
  }, [notificar]);

  const valor = useMemo(
    () => ({ programa, trabajos, ejes, aviso, notificar, guardarSesion, agregarTrabajo, quitarTrabajo, moverTrabajo, publicarPrograma, reiniciarDatos }),
    [programa, trabajos, ejes, aviso, notificar, guardarSesion, agregarTrabajo, quitarTrabajo, moverTrabajo, publicarPrograma, reiniciarDatos]
  );

  return <ProgramaContext.Provider value={valor}>{children}</ProgramaContext.Provider>;
}
