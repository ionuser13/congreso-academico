import {useEffect, useState} from 'react';
import {pad2} from '../utils/formatos';

function calcular(iso) {
    if(!iso) return null;
    const ms = new Date(iso).getTime() - Date.now();
    if(ms <= 0) return null;
    const dias = Math.floor(ms / 86400000);
    const horas = Math.floor((ms % 86400000) / 3600000);
    const minutos = Math.floor((ms % 3600000) / 60000);
    return {dias, hhmm: `${pad2(horas)}:${pad2(minutos)}`};
}

export function useCuentaRegresiva(iso) {
    const [v, setV] = useState(() => calcular(iso));
    useEffect(()=> {
        setV(calcular(iso));
        const t = setInterval(() => setV(calcular(iso)), 30000);
        return () => clearInterval(t);
    }, [iso])
    return v;
}