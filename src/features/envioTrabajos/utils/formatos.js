const zonaHoraria = 'America/Lima';
const pad = (n) => String(n).padStart(2, '0');

function partes(iso) {
  const f = new Intl.DateTimeFormat('es-PE', {
    timeZone: zonaHoraria, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const o = {};
  f.formatToParts(new Date(iso)).forEach((p) => { o[p.type] = p.value; });
  if (o.hour === '24') o.hour = '00';
  return o;
}

export const fechaCorta = (iso) => { if (!iso) return '—'; const p = partes(iso); return `${p.day}/${p.month}/${p.year}`; };
export const hora = (iso) => { if (!iso) return '—'; const p = partes(iso); return `${p.hour}:${p.minute}`; };
export const fechaHora = (iso) => (iso ? `${fechaCorta(iso)} a las ${hora(iso)}` : '—');
export const fechaHoraPunto = (iso) => (iso ? `${fechaCorta(iso)} · ${hora(iso)}` : '—');

export const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const decimal1 = (n) => (n === null || n === undefined ? '—' : Number(n).toFixed(1));
export const pad2 = pad;

/** Heurística: primera palabra + las dos últimas. "Rosa María Quispe Ttito" → "Rosa Quispe Ttito" */
export const nombreCorto = (full = '') => {
  const w = full.trim().split(/\s+/);
  return w.length <= 3 ? full.trim() : `${w[0]} ${w.slice(-2).join(' ')}`;
};

export const normalizar = (s = '') => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const capitalizar = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

export const nombreArchivo = (url = '') => {
  try {
    const u = new URL(url);
    const seg = u.pathname.split('/').filter(Boolean).pop();
    return seg || u.hostname;
  } catch { return url; }
};