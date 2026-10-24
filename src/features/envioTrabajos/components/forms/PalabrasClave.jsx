import { useState } from 'react';
import Chip from '../common/Chip';

export default function PalabrasClave({ valor, error, onAgregar, onQuitar }) {
  const [texto, setTexto] = useState('');
  const confirmar = () => { onAgregar(texto); setTexto(''); };
  return (
    <div className={`et-campo${error ? ' et-campo--error' : ''}`}>
      <span className="et-label" id="lbl-palabras">Palabras clave *</span>
      <div className="et-palabras" aria-labelledby="lbl-palabras">
        {valor.map((p) => <Chip key={p} onQuitar={() => onQuitar(p)}>{p}</Chip>)}
        <input
          className="et-palabras__input"
          value={texto}
          placeholder="Escriba y presione Enter…"
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); confirmar(); }
            if (e.key === 'Backspace' && !texto && valor.length) onQuitar(valor[valor.length - 1]);
          }}
          onBlur={() => texto.trim() && confirmar()}
        />
      </div>
      {error && <span className="et-campo__error">{error}</span>}
    </div>
  );
}