import { useEffect, useRef } from 'react';
import { acidity } from './model';
import type { CtlRef } from './types';

/*
 * Vinheta sobre o canvas: borda escura fixa e duas camadas de "clima" (laranja = H⁺, azul-violeta =
 * hipóxia) cuja opacidade segue os controles por quadro, escrita direto no DOM.
 */

export const Vignette = ({ ctlRef }: { ctlRef: CtlRef }) => {
    const acid = useRef<HTMLDivElement>(null);
    const hyp = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let raf = 0;
        let lastPh = Number.NaN;
        let lastSat = Number.NaN;
        const tick = () => {
            const c = ctlRef.current;
            // estilo escrito só quando o controle muda
            if (c.ph !== lastPh && acid.current) { lastPh = c.ph; acid.current.style.opacity = (0.75 * acidity(c.ph)).toFixed(3); }
            if (c.sat !== lastSat && hyp.current) { lastSat = c.sat; hyp.current.style.opacity = (0.7 * Math.min(Math.max((0.85 - c.sat) / 0.5, 0), 1)).toFixed(3); }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [ctlRef]);
    return (
        <div aria-hidden className="absolute inset-0 z-[40] pointer-events-none">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 48%, transparent 55%, rgba(4,2,7,0.78) 100%)' }} />
            <div ref={hyp} className="absolute inset-0" style={{ opacity: 0, background: 'radial-gradient(ellipse 80% 75% at 50% 45%, transparent 50%, rgba(70,60,190,0.28) 100%)' }} />
            <div ref={acid} className="absolute inset-0" style={{ opacity: 0, background: 'radial-gradient(ellipse 80% 75% at 50% 50%, transparent 45%, rgba(251,146,60,0.26) 100%)' }} />
        </div>
    );
};
