import { useState } from 'react';
import { validarCoautor } from '../utils/validacionesTrabajo';

const limpio = (c) => ({
  nombreCompleto: (c.nombreCompleto || c.nombre || '').trim(), 
  correo: (c.correo || '').trim(), 
  institucion: (c.institucion || '').trim(),
});

export function useCoautores(trabajo, tipo, usuario) {
  // Obtenemos el autor principal de forma segura (soporta objeto o fallback a usuario/datos por defecto)
  const principal = trabajo.autorPrincipal || {
    usuarioId: trabajo.autorPrincipalId || usuario?.id || null,
    nombreCompleto: usuario?.nombreCompleto || usuario?.nombre || 'Autor Principal',
    correo: usuario?.correo || 'autor@ulima.edu.pe',
    institucion: usuario?.institucion || 'Universidad de Lima',
  };

  // Normalizamos los coautores existentes para que siempre manejen 'nombreCompleto' de forma segura
  const coautoresIniciales = Array.isArray(trabajo.coautores)
    ? trabajo.coautores.map(c => ({
        usuarioId: c.usuarioId ?? null,
        nombreCompleto: c.nombreCompleto || c.nombre || '',
        correo: c.correo || '',
        institucion: c.institucion || '',
      }))
    : [];

  const [coautores, setCoautores] = useState(coautoresIniciales);
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