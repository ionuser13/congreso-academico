import { ETAPAS } from './estadosTrabajo';
import { esUrlValida, MAX_RESUMEN, MIN_PALABRAS } from './validacionesTrabajo';
import { miles } from './formatos';

const norm = (c) => (c || '').trim().toLowerCase();

export const esAutorPrincipal = (t, u) => !!u && norm(t.autorPrincipal.correo) === norm(u.correo);
export const esCoautor = (t, u) => !!u && t.coautores.some((c) => norm(c.correo) === norm(u.correo));
export const puedeVer = (t, u) => esAutorPrincipal(t, u) || esCoautor(t, u);
/** Editar: solo el autor principal y solo con la recepción abierta */
export const puedeEditar = (t, u, etapa) => etapa === ETAPAS.ABIERTA && esAutorPrincipal(t, u);

export function listaVerificacion(t) {
  return [
    { clave: 'datos', ok: !!(t.titulo.trim() && t.tipoId && t.ejeId), texto: 'Datos generales completos' },
    {
      clave: 'resumen',
      ok: !!t.resumen.trim() && t.resumen.length <= MAX_RESUMEN && t.palabrasClave.length >= MIN_PALABRAS,
      texto: 'Resumen y palabras clave',
    },
    { clave: 'enlace', ok: esUrlValida(t.enlaceDocumento), texto: 'Enlace al documento' },
    {
      clave: 'correspondencia',
      ok: !!t.correspondenciaConfirmada,
      texto: t.correspondenciaConfirmada ? 'Autor de correspondencia confirmado' : 'Falta confirmar al autor de correspondencia',
    },
  ];
}
export const estaCompleto = (t) => listaVerificacion(t).every((i) => i.ok);

export function maxAutores(tipo) {
  return 1 + (tipo?.maxCoautores ?? 0);
}

export function textoRequisitos(tipo) {
  if (!tipo) return 'Seleccione un tipo de trabajo para ver sus requisitos.';
  const partes = [
    tipo.nombre,
    tipo.maxPalabras ? `hasta ${miles(tipo.maxPalabras)} palabras` : null,
    tipo.formato || null,
    tipo.admiteCoautores ? `admite hasta ${tipo.maxCoautores} coautores` : 'no admite coautores',
  ].filter(Boolean);
  return `${partes.join(' · ')}.`;
}

export function nombresAutores(t) {
  return [t.autorPrincipal.nombreCompleto, ...t.coautores.map((c) => c.nombreCompleto)];
}