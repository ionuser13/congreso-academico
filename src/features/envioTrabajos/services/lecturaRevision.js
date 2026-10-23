import revisiones from '../../../shared/mocks/revisiones.json';
import { ETAPAS } from '../utils/estadosTrabajo';

export function obtenerSeguimiento(trabajoId, etapa) {
    if(etapa === ETAPAS.ABIERTA) return null;
    const revisionesTrabajo = revisiones.filter(
        (r) => Number(r.trabajoId) === Number(trabajoId) && r.estado !== 'retirada'
    );
    if(!revisionesTrabajo.length) return null;
    const total = revisionesTrabajo.length;
    const entregadas = revisionesTrabajo.filter((r) => r.estado === 'entregada').length;
    const asignadosEn = revisionesTrabajo.reduce((min, r) => {
        return !min || r.fechaAsignacion < min ? r.fechaAsignacion : min;
    }, null);
    const actualizadosEn = revisionesTrabajo.reduce((max, r) => {
        if(r.fechaEntrega && (!max || r.fechaEntrega > max)) {
            return r.fechaEntrega;
        }
        return max;
    }, null) ?? asignadosEn;

    return {
        asignadosEn, entregados, total, actualizadosEn,
    };
}

export function obtenerDictamen(trabajoId, etapa) {
    if(etapa !== ETAPAS.PUBLICADA) return null;
    return null;
}