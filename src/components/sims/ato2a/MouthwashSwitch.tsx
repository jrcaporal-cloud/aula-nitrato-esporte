import { C } from '../kit/palette';
import { POSITIONS } from './mouthwash.positions';

/** Interruptor de quatro posições (botões reais): a haste sobe e desce com a posição ativa. */
const ITEM_H = 92;
const GAP = 8;
const centerOf = (i: number) => i * (ITEM_H + GAP) + ITEM_H / 2;

interface Props { position: number; onSelect: (i: number) => void }

export const MouthwashSwitch = ({ position, onSelect }: Props) => (
    <div className="flex h-full w-[212px] shrink-0 flex-col gap-2 p-3">
        <p className="font-mono text-[14px] uppercase tracking-wider text-gray-400">interruptor da boca</p>
        <div className="relative" style={{ height: ITEM_H * 4 + GAP * 3 }}>
            <div className="absolute left-[11px] w-1.5 rounded-full bg-white/12" style={{ top: centerOf(0), height: centerOf(3) - centerOf(0) }} />
            <div className="absolute left-0 h-7 w-7 rounded-full border-2 border-white transition-[top] duration-500 ease-out"
                style={{ top: centerOf(position) - 14, background: C.bacteria, boxShadow: `0 0 16px ${C.bacteria}` }} />
            {POSITIONS.map((p, i) => {
                const on = i === position;
                return (
                    <button key={p.label} type="button" onClick={() => onSelect(i)}
                        className="absolute left-10 right-0 flex cursor-pointer flex-col justify-center rounded-xl border px-3 text-left transition-colors"
                        style={{
                            top: i * (ITEM_H + GAP), height: ITEM_H,
                            borderColor: on ? `${C.bacteria}cc` : 'rgba(255,255,255,0.1)',
                            background: on ? 'rgba(167,139,250,0.14)' : 'rgba(255,255,255,0.02)',
                        }}>
                        <span className="text-[17px] font-bold leading-tight" style={{ color: on ? '#fff' : '#D1D5DB' }}>{p.label}</span>
                        <span className="text-[15px] leading-tight text-gray-400">{p.sub}</span>
                    </button>
                );
            })}
        </div>
    </div>
);
