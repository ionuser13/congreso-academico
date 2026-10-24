// Diálogo de confirmación para acciones destructivas (requisito del enunciado).
export default function ConfirmDialog({ titulo, children, textoConfirmar, onConfirmar, onCancelar }) {
  return (
    <div className="prg-overlay" role="presentation">
      <div className="prg-modal" role="alertdialog" aria-modal="true" aria-labelledby="prg-confirm-titulo">
        <h3 id="prg-confirm-titulo">{titulo}</h3>
        <div className="prg-modal__cuerpo">{children}</div>
        <div className="prg-modal__acciones">
          <button type="button" className="prg-btn" onClick={onCancelar}>Cancelar</button>
          <button type="button" className="prg-btn prg-btn--peligro" onClick={onConfirmar}>{textoConfirmar}</button>
        </div>
      </div>
    </div>
  );
}
