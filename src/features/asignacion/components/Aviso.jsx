import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

const ICONOS = {
  peligro: AlertCircle,
  alerta: AlertTriangle,
  exito: CheckCircle2,
};

export default function Aviso({ tipo = 'alerta', children, accion }) {
  const Icono = ICONOS[tipo] ?? AlertTriangle;
  return (
    <div className={`hu4-aviso hu4-aviso--${tipo}`} role="status">
      <Icono size={16} className="hu4-aviso__icono-svg" aria-hidden="true" />
      <div className="hu4-aviso__cuerpo">{children}</div>
      {accion}
    </div>
  );
}
