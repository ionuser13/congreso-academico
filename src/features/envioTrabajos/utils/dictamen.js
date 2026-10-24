export function puntajesPorCriterio(revisores, criterios) {
  return criterios.map((c) => {
    const vals = revisores.map((r) => r.puntajes?.[c.id]).filter((v) => typeof v === 'number');
    const valor = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    return { ...c, valor };
  });
}

/** Promedio ponderado con pesoPorcentaje. 17·25% + 18·30% + 17.5·20% + 17·25% = 17.4 */
export function promedioPonderado(filas) {
  const v = filas.filter((f) => f.valor !== null);
  if (!v.length) return null;
  const pesos = v.reduce((a, f) => a + f.peso, 0);
  return v.reduce((a, f) => a + f.valor * f.peso, 0) / pesos;
}