import { useEffect } from 'react';
import { dismissSplash } from './splash';

/** Marca o primeiro desenho da aula: a capa de entrada pode sair. Não renderiza nada. */
export const BootReady = () => {
    useEffect(() => dismissSplash(), []);
    return null;
};
