import { C } from '../kit/palette';

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    /** Texto do valor atual (já formatado). */
    shown: string;
    color?: string;
    /** Rótulos nas pontas do trilho (opcional). */
    ends?: readonly [string, string];
}

/**
 * Controle deslizante da aula. Solta o foco ao terminar o arraste: sem isso, as setas do passador
 * (controle remoto) passariam a mexer no slider em vez de avançar a história.
 */
export const Slider = ({ label, value, min, max, step, onChange, shown, color = C.nitrate, ends }: SliderProps) => (
    <label className="flex flex-col gap-1 cursor-pointer">
        <span className="flex items-baseline justify-between gap-3">
            <span className="text-[16px] font-semibold text-gray-100 leading-tight">{label}</span>
            <span className="font-mono text-[17px] font-bold tabular-nums" style={{ color }}>{shown}</span>
        </span>
        <input type="range" min={min} max={max} step={step} value={value} aria-label={label}
            onChange={e => onChange(Number(e.target.value))}
            onPointerUp={e => e.currentTarget.blur()}
            className="w-full h-2 cursor-pointer" style={{ accentColor: color }} />
        {ends && (
            <span className="flex justify-between text-[15px] text-gray-400 leading-none">
                <span>{ends[0]}</span><span>{ends[1]}</span>
            </span>
        )}
    </label>
);
