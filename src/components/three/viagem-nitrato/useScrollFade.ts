import { useEffect, useState, type RefObject } from 'react';

/** Máscara de esmaecimento no pé da rolagem: só aparece enquanto ainda há texto escondido embaixo. */
const MASK = 'linear-gradient(to bottom, #000 calc(100% - 28px), transparent)';
export const FADE_STYLE = { maskImage: MASK, WebkitMaskImage: MASK } as const;

/** `contentKey` muda quando o conteúdo é trocado (etapa, bochecho), para observar os filhos novos. `true` enquanto a caixa rolável tem conteúdo abaixo da borda (a última linha nunca fica sob a máscara no fim). */
export const useScrollFade = (ref: RefObject<HTMLElement | null>, contentKey: string): boolean => {
    const [more, setMore] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const check = () => setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
        const ro = new ResizeObserver(check);
        ro.observe(el);
        Array.from(el.children).forEach(c => ro.observe(c));
        el.addEventListener('scroll', check, { passive: true });
        const raf = requestAnimationFrame(check);
        return () => { ro.disconnect(); el.removeEventListener('scroll', check); cancelAnimationFrame(raf); };
    }, [ref, contentKey]);
    return more;
};
