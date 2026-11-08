import { ACTS } from './acts';

/**
 * A rota da viagem: seis estações numa linha que acende até o ato da vez. A linha é um gradiente
 * magenta → âmbar → verde (nitrato → nitrito → NO), o destino do íon. A estação atual pulsa.
 */

const W = 1136;
const COL = W / ACTS.length;
const centerOf = (i: number) => COL * i + COL / 2;
const LINE_Y = 70;
const FULL_GRADIENT = 'linear-gradient(90deg, #F0437E 0%, #FBBF24 38%, #34D399 72%, #34D399 100%)';

export const ActRoute = ({ lit, current }: { lit: number; current: number }) => (
    <div className="relative shrink-0" style={{ width: W, height: 160 }}>
        <div className="absolute h-1 rounded-full bg-white/12" style={{ left: centerOf(0), width: centerOf(ACTS.length - 1) - centerOf(0), top: LINE_Y - 2 }} />
        <div className="absolute rounded-full transition-[width] duration-[900ms] ease-out"
            style={{
                left: centerOf(0), width: centerOf(lit) - centerOf(0), top: LINE_Y - 2, height: 4,
                background: FULL_GRADIENT, backgroundSize: `${centerOf(ACTS.length - 1) - centerOf(0)}px 100%`, backgroundRepeat: 'no-repeat',
            }} />

        {ACTS.map((act, i) => {
            const reached = i <= lit;
            const here = i === current;
            return (
                <div key={act.roman} className="absolute top-0 flex flex-col items-center" style={{ left: COL * i, width: COL }}>
                    <span className="mb-1 font-mono text-[16px] leading-none transition-colors duration-300" style={{ color: reached ? act.color : '#6B7280' }}>
                        ato {act.roman}
                    </span>
                    <span className="relative flex size-[64px] items-center justify-center rounded-full border-2 transition-all duration-500"
                        style={{
                            borderColor: reached ? act.color : 'rgba(255,255,255,0.2)',
                            background: reached ? `${act.color}26` : '#0B0710',
                            color: reached ? act.color : '#6B7280',
                            boxShadow: here ? `0 0 26px 2px ${act.color}88` : 'none',
                        }}>
                        {here && <span className="absolute inset-[-6px] rounded-full border-2 motion-safe:animate-ping" style={{ borderColor: `${act.color}99` }} />}
                        <act.Icon size={30} aria-hidden />
                    </span>
                    <span className="mt-2.5 max-w-[168px] text-center font-display text-[1.08rem] font-semibold leading-tight transition-colors duration-300"
                        style={{ color: here ? '#fff' : reached ? '#D1D5DB' : '#6B7280' }}>
                        {act.title}
                    </span>
                </div>
            );
        })}
    </div>
);
