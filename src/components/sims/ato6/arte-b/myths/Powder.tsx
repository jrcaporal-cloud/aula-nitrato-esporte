import { C } from '../../../kit/palette';
import { DOSE_BANDS, SHOT_MMOL } from '../../shared';
import { Calc } from '../../ui';
import { Kick } from '../kit';
import { cv } from '../util';

/** Mito 5 (pó): uma colher de pó (1,03 mmol), cinco colheres empilhadas e um shot (6,41 mmol), todos contra a faixa de 5–9 mmol do IOC. */

const PX = 22;
const TOP = 9;
const SCOOP = 1.03;
const H = TOP * PX;

interface Beaker { key: string; title: string; value: string; note: string; seg: readonly { mmol: number; color: string; delay: number }[] }

const BEAKERS: readonly Beaker[] = [
    { key: 'um', title: '1 colher de pó (5 g)', value: '1,03 mmol', note: 'Superbeets', seg: [{ mmol: SCOOP, color: C.nitrate, delay: 0.6 }] },
    {
        key: 'cinco', title: '5 colheres de pó', value: '≈ 5 mmol', note: '5 ÷ 1,03 ≈ 5 porções',
        seg: Array.from({ length: 5 }, (_, i) => ({ mmol: SCOOP, color: i % 2 ? C.nitrateSoft : C.nitrate, delay: 0.4 + i * 0.14 })),
    },
    { key: 'shot', title: '1 shot de 70 mL', value: '6,41 mmol', note: 'Beet It Sport Pro-Elite', seg: [{ mmol: SHOT_MMOL, color: C.nitrate, delay: 0.8 }] },
];

const Glass = ({ b }: { b: Beaker }) => {
    const bases = b.seg.map((_, i) => b.seg.slice(0, i).reduce((sum, x) => sum + x.mmol, 0));
    return (
        <div className="relative w-[84px] overflow-hidden rounded-b-2xl rounded-t-md border-2 border-white/40 bg-white/5" style={{ height: H }}>
            {b.seg.map((s, i) => {
                const bottom = bases[i] * PX;
                return <div key={i} className="ab-a absolute inset-x-0" style={cv({ bottom, height: s.mmol * PX, background: `linear-gradient(180deg, ${s.color}, ${s.color}cc)`, borderTop: i ? '1px solid rgba(7,5,11,0.55)' : 'none', transformOrigin: 'bottom', animation: `ab-grow 0.4s ${s.delay}s ease-out both` })} />;
            })}
        </div>
    );
};

export const PowderArt = () => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between"><Kick>mmol de nitrato por porção</Kick><Calc /></div>
        <div className="relative flex gap-3 pl-9" style={{ height: H + 60 }}>
            <div className="absolute left-0 top-0 w-8" style={{ height: H }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => <span key={t} className="absolute right-0 -translate-y-1/2 font-mono text-[14px] text-gray-400" style={{ top: (TOP - t) * PX }}>{t}</span>)}
            </div>
            <div className="absolute left-9 right-0 flex items-center justify-end rounded-md border pr-3" style={{ top: 0, height: (DOSE_BANDS.ioc.hi - DOSE_BANDS.ioc.lo) * PX, borderColor: `${C.no}99`, background: `linear-gradient(90deg, ${C.no}10, ${C.no}2e)` }}>
                <span className="w-[110px] text-right font-display text-[18px] font-semibold leading-tight" style={{ color: C.no }}>dose do IOC: 5–9 mmol</span>
            </div>
            {BEAKERS.map(b => (
                <div key={b.key} className="relative z-10 flex w-[170px] flex-col items-center gap-1">
                    <Glass b={b} />
                    <p className="m-0 text-center text-[15px] font-semibold leading-tight text-white">{b.title}</p>
                    <p className="m-0 text-center font-display text-[20px] font-semibold leading-none" style={{ color: b.key === 'um' ? C.hypoxia : C.nitrateSoft }}>{b.value}</p>
                </div>
            ))}
            <p className="absolute bottom-[10px] right-0 m-0 w-[120px] text-right font-display text-[22px] font-semibold leading-tight" style={{ color: C.hypoxia }}>um quinto da dose mínima</p>
        </div>
    </div>
);
