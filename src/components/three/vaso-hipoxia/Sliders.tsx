import { useEffect, useRef, type CSSProperties } from 'react';
import { C } from '../../sims/kit/palette';
import { br } from '../../sims/kit/format';
import { EC50_ACID, EC50_REST, PH_ACID, PH_REST, ec50 } from './model';
import type { CtlRef } from './types';

/*
 * Os dois controles do modelo: saturação de O₂ e pH. São campos não controlados: o clique/arrasto grava
 * direto nos controles da cena, e um laço de quadros devolve ao campo o valor que os roteiros das etapas
 * (gsap) moveram — sem estado do React por quadro.
 */

const TRACK = '[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/15 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/15';
const THUMB = 'appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[var(--thumb)] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[var(--thumb)]';

const SAT_MIN = 5;
const SAT_MAX = 100;
/** Posição (0–1) de um valor ao longo do campo, descontando a meia largura do polegar (20 px). */
const along = (v: number) => `calc(10px + (100% - 20px) * ${(v - SAT_MIN) / (SAT_MAX - SAT_MIN)})`;

const sync = (input: HTMLInputElement | null, out: HTMLElement | null, value: number, text: string) => {
    if (input && Number(input.value) !== value) input.value = String(value);
    if (out && out.textContent !== text) out.textContent = text;
};

const phText = (ph: number) => {
    const anchor = Math.abs(ph - PH_REST) < 0.03 ? EC50_REST : Math.abs(ph - PH_ACID) < 0.03 ? EC50_ACID : null;
    return anchor !== null ? `${anchor} µM` : `≈ ${Math.round(ec50(ph))} µM · cálculo`;
};

interface Props { ctlRef: CtlRef; onTouch: () => void }

export const Sliders = ({ ctlRef, onTouch }: Props) => {
    const satIn = useRef<HTMLInputElement>(null);
    const satOut = useRef<HTMLSpanElement>(null);
    const phIn = useRef<HTMLInputElement>(null);
    const phOut = useRef<HTMLSpanElement>(null);
    const ecOut = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        let raf = 0;
        const tick = () => {
            const c = ctlRef.current;
            const sat = Math.round(c.sat * 100);
            const ph = Math.round(c.ph * 20) / 20;
            sync(satIn.current, satOut.current, sat, `${sat}%`);
            sync(phIn.current, phOut.current, ph, br(ph, 2));
            sync(null, ecOut.current, 0, phText(c.ph));
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [ctlRef]);

    return (
        <div className="mt-3 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
            <label htmlFor="vaso-sat" className="flex items-center justify-between text-[14px] font-semibold text-gray-100">
                Saturação de O₂ da hemoglobina
                <span ref={satOut} className="font-mono text-[15px]" style={{ color: C.o2 }}>100%</span>
            </label>
            <div className="relative mt-2 h-6">
                <span aria-hidden className="absolute top-1/2 -translate-y-1/2 h-2.5 rounded-sm pointer-events-none"
                    style={{ left: along(40), width: `calc((100% - 20px) * ${20 / (SAT_MAX - SAT_MIN)})`, background: `${C.nitrite}66`, border: `1px solid ${C.nitrite}` }} />
                <input ref={satIn} id="vaso-sat" type="range" min={SAT_MIN} max={SAT_MAX} step={1} defaultValue={100}
                    onChange={e => { onTouch(); ctlRef.current.sat = Number(e.currentTarget.value) / 100; }}
                    aria-describedby="vaso-sat-faixa"
                    style={{ '--thumb': C.o2 } as CSSProperties}
                    className={`relative w-full h-6 cursor-pointer ${THUMB} ${TRACK}`} />
            </div>
            <p id="vaso-sat-faixa" className="flex justify-between text-[14px] text-gray-400 -mt-0.5">
                <span>hipóxia</span>
                <span style={{ color: C.nitrite }}>faixa 40–60%</span>
                <span>saturada</span>
            </p>

            <label htmlFor="vaso-ph" className="flex items-center justify-between text-[14px] font-semibold text-gray-100 mt-2.5">
                pH do meio
                <span ref={phOut} className="font-mono text-[15px]" style={{ color: C.hypoxia }}>7,40</span>
            </label>
            <input ref={phIn} id="vaso-ph" type="range" min={PH_ACID} max={PH_REST} step={0.05} defaultValue={PH_REST}
                onChange={e => { onTouch(); ctlRef.current.ph = Number(e.currentTarget.value); }}
                style={{ '--thumb': C.hypoxia } as CSSProperties}
                className={`w-full h-6 mt-1.5 cursor-pointer ${THUMB} ${TRACK}`} />
            <p className="flex justify-between gap-2 text-[14px] text-gray-400 -mt-0.5">
                <span>ácido</span>
                <span>EC₅₀ <span ref={ecOut} className="font-mono" style={{ color: C.nitrite }}>200 µM</span></span>
                <span>normal</span>
            </p>
        </div>
    );
};
