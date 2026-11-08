import { EVENTS, FIRST_YEAR, LAST_YEAR } from './events';

/** Linha do tempo proporcional (1994 → 2009): o vão de 1998 a 2006 aparece como vão. O trecho percorrido acende. */

const X0 = 70;
const X1 = 1066;
const xOf = (year: number) => X0 + ((year - FIRST_YEAR) / (LAST_YEAR - FIRST_YEAR)) * (X1 - X0);

export const NobelStrip = ({ step }: { step: number }) => {
    const current = EVENTS[step];
    return (
        <div className="relative h-[92px] shrink-0">
            <div className="absolute top-[45px] h-1 rounded-full bg-white/15" style={{ left: X0, width: X1 - X0 }} />
            <div className="absolute top-[45px] h-1 rounded-full transition-[width] duration-[900ms] ease-out"
                style={{ left: X0, width: xOf(current.at) - X0, background: `linear-gradient(90deg, ${EVENTS[0].color}, ${current.color})` }} />
            {EVENTS.map((event, i) => {
                const active = i === step;
                const reached = i <= step;
                return (
                    <div key={event.year} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: xOf(event.at) }}>
                        <span className="font-display font-semibold leading-none transition-all duration-300"
                            style={{ fontSize: active ? '1.5rem' : '1.15rem', color: active ? '#fff' : reached ? '#D1D5DB' : '#6B7280' }}>
                            {event.year}
                        </span>
                        <span className="mt-[9px] rounded-full border-2 transition-all duration-300"
                            style={{
                                width: active ? 22 : 14, height: active ? 22 : 14,
                                background: reached ? event.color : '#1F2937',
                                borderColor: active ? '#fff' : 'rgba(255,255,255,0.35)',
                                boxShadow: active ? `0 0 20px 2px ${event.color}` : 'none',
                            }} />
                        <span className="mt-1.5 whitespace-nowrap text-[16px] leading-none transition-colors duration-300"
                            style={{ color: active ? event.color : '#9CA3AF' }}>
                            {event.node}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
