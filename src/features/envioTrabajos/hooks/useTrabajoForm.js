import { useState } from 'react';
import { MAX_PALABRAS, validarDatosGenerales } from '../utils/validacionesTrabajo';

const VACIO = { titulo: '', tipoId: '', ejeId: '', resumen: '', palabrasClave: [], enlaceDocumento: '' };

export function useTrabajoForm(trabajo) {
  const [valores, setValores] = useState(() =>
    trabajo
      ? {
          titulo: trabajo.titulo,
          tipoId: trabajo.tipoId ? String(trabajo.tipoId) : '',
          ejeId: trabajo.ejeId ? String(trabajo.ejeId) : '',
          resumen: trabajo.resumen,
          palabrasClave: [...trabajo.palabrasClave],
          enlaceDocumento: trabajo.enlaceDocumento,
        }
      : VACIO,
  );
  const [errores, setErrores] = useState({});

  const cambiar = (campo, valor) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    setErrores((e) => { if (!e[campo]) return e; const { [campo]: _, ...resto } = e; return resto; });
  };
  const agregarPalabra = (p) => {
    const t = p.trim();
    if (!t) return;
    setValores((v) => {
      if (v.palabrasClave.length >= MAX_PALABRAS) return v;
      if (v.palabrasClave.some((x) => x.toLowerCase() === t.toLowerCase())) return v;
      return { ...v, palabrasClave: [...v.palabrasClave, t] };
    });
    setErrores((e) => { const { palabrasClave: _, ...resto } = e; return resto; });
  };
  const quitarPalabra = (p) => setValores((v) => ({ ...v, palabrasClave: v.palabrasClave.filter((x) => x !== p) }));

  const validar = () => {
    const e = validarDatosGenerales(valores);
    setErrores(e);
    return e;
  };

  return { valores, errores, cambiar, agregarPalabra, quitarPalabra, validar, setErrores };
}