import { C } from '../kit/palette';
import { VO2_MAX, VO2_MIN } from './cast';

/** VO₂max numa régua de 30 a 80 mL/kg/min; sem valor informado, a régua fica vazia e o texto diz isso. */
export const Vo2Meter = ({ value }: { value: number | null }) => {
    const left = value === null ? 0 : ((value - VO2_MIN) / (VO2_MAX - VO2_MIN)) * 100;
    return (
        <div>
            <div className="flex items-baseline justify-between leading-none">
                <span className="font-mono text-[16px] text-gray-400">VO₂max</span>
                {value === null
                    ? <span className="text-[16px] text-gray-400">não informado</span>
                    : <span className="text-[16px] text-gray-300"><strong className="font-display text-[1.5rem] font-bold text-white">{value}</strong> mL/kg/min</span>}
            </div>
            <div className="relative mt-2.5 h-2 rounded-full bg-white/10">
                {value !== null && (
                    <>
                        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${left}%`, background: `linear-gradient(90deg, ${C.nitrateDeep}, ${C.nitrate})` }} />
                        <span className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${left}%`, background: C.nitrate }} />
                    </>
                )}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[16px] leading-none text-gray-500">
                <span>{VO2_MIN}</span><span>{VO2_MAX}</span>
            </div>
        </div>
    );
};
