// Clase del borde de un campo según su estado de validación:
// error → #B4322B, válido → #1E7F4D (mockup 1.3 — validación en línea).
export function claseEntrada(error, exito) {
  if (error) return 'auth-entrada auth-entrada--error';
  if (exito) return 'auth-entrada auth-entrada--exito';
  return 'auth-entrada';
}
