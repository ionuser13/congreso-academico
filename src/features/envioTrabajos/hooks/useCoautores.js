import { useState } from 'react';
import { validarCoautor } from '../utils/validacionesTrabajo';

const limpio = (c) => ({
  nombreCompleto: c.nombreCompleto.trim(), correo: c.correo.trim(), institucion: c.institucion.trim(),
});

export function useCoautores(trabajo, tipo) {
  const principal = trabajo.autorPrincipal;
  const [coautores, setCoautores] = useState(trabajo.coautores);
  const [correspondencia, setCorrespondencia] = useState(trabajo.correspondencia || principal.correo);
  const [editando, setEditando] = useState(null); // índice en coautores, o null

  const max = tipo?.maxCoautores ?? 0;
  const admite = (tipo?.admiteCoautores ?? max > 0) && max > 0;
  const puedeAgregar = admite && coautores.length < max;

  const correos = (ignorar = null) => [
    principal.correo,
    ...coautores.filter((_, i) => i !== ignorar).map((c) => c.correo),
  ];

  /** Devuelve null si se agregó, o el objeto de errores */
  const agregar = (c) => {
    const err = validarCoautor(c, correos());
    if (Object.keys(err).length) return err;
    setCoautores((l) => [...l, limpio(c)]);
    return null;
  };

  const guardarEdicion = (c) => {
    const err = validarCoautor(c, correos(editando));
    if (Object.keys(err).length) return err;
    const anterior = coautores[editando].correo;
    setCoautores((l) => l.map((x, i) => (i === editando ? limpio(c) : x)));
    if (correspondencia.toLowerCase() === anterior.toLowerCase()) setCorrespondencia(c.correo.trim());
    setEditando(null);
    return null;
  };

  const quitar = () => {
    if (editando === null) return;
    const quitado = coautores[editando];
    setCoautores((l) => l.filter((_, i) => i !== editando));
    if (correspondencia.toLowerCase() === quitado.correo.toLowerCase()) setCorrespondencia(principal.correo);
    setEditando(null);
  };

  return {
    principal, coautores, correspondencia, editando, setEditando, setCorrespondencia,
    max, admite, puedeAgregar, agregar, guardarEdicion, quitar,
  };
}