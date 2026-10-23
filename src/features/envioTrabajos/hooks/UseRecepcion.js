import { useMemo } from 'react';
import { obtenerEtapa, obtenerFechas } from '../services/lecturaEdicion'
import { ETAPAS } from '../utils/estadosTrabajo';

export function useRecepcion() {
    return useMemo(() => {
        const etapa = obtenerEtapa();
        return { etapa, fechas: obtenerFechas(), abierta: etapa === ETAPAS.ABIERTA};
    }, []);
}