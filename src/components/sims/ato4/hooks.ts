import { useEffect, useState } from 'react';

/**
 * Vira `true` um instante depois da montagem: serve para disparar transições CSS de entrada
 * (o primeiro quadro sai no estado inicial, o segundo no final). Com movimento reduzido, já nasce `true`.
 */
export const useEntered = (reduce: boolean, delay = 70): boolean => {
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        if (reduce) return;
        const id = window.setTimeout(() => setEntered(true), delay);
        return () => window.clearTimeout(id);
    }, [reduce, delay]);
    return entered || reduce;
};
