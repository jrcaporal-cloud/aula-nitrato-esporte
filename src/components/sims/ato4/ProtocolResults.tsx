import { C } from '../kit/palette';
import { Panel } from '../kit/ui';
import { PROTOCOLS, type Protocol } from './protocolContent';

/** Três cartões de resultado (potência média, placebo × beterraba). O protocolo escolhido acende. */

const SCALE_MAX = 600;

interface ResultRowProps {
    p: Protocol;
    lit: boolean;
    dim: boolean;
    /** Resultado já foi mostrado (passo anterior ou escolha do aluno). */
    shown: boolean;
    onPick: () => void;
}

const Bar = ({ value, color, show }: { value: number; color: string; show: boolean }) => (
    <div className="relative h-[22px] rounded-md bg-white/[0.05]">
        <div className="absolute inset-y-0 left-0 flex items-center justify-end rounded-md pr-2 transition-[width] duration-700 ease-out"
            style={{ width: show ? `${(value / SCALE_MAX) * 100}%` : '0%', background: `${color}${show ? 'cc' : '00'}` }}>
            <span className="font-mono text-[15px] font-bold text-white transition-opacity duration-500" style={{ opacity: show ? 1 : 0 }}>{value} W</span>
        </div>
    </div>
);

const ResultRow = ({ p, lit, dim, shown, onPick }: ResultRowProps) => {
    const show = shown;
    const good = p.significant;
    return (
        <Panel state={lit ? 'active' : dim ? 'dim' : 'idle'} glow={good ? C.no : C.placebo} className="cursor-pointer">
            <button type="button" onClick={onPick} className="grid w-full items-center gap-3 px-4 py-2.5 text-left cursor-pointer"
                style={{ gridTemplateColumns: '116px 1fr 96px' }} aria-label={`${p.reps} × ${p.sprint} s, pausa ${p.rest} s`}>
                <span className="flex flex-col leading-tight">
                    <span className="font-display text-[1.45rem] font-semibold text-white">{p.reps} × {p.sprint} s</span>
                    <span className="text-[15px] text-gray-300">pausa {p.rest} s</span>
                </span>
                <span className="flex flex-col gap-1.5">
                    <Bar value={p.placebo} color={C.placebo} show={show} />
                    <Bar value={p.nitrate} color={C.nitrate} show={show} />
                </span>
                <span className="flex flex-col items-end leading-none">
                    <span className="font-display text-[2.1rem] font-semibold tabular-nums transition-opacity duration-500"
                        style={{ color: good ? C.no : C.muted, opacity: show ? 1 : 0.35 }}>
                        {show ? p.delta : '?'}
                    </span>
                    <span className="mt-1 text-[15px] text-gray-300">{show ? (good ? 'P < 0,05' : 'n.s.') : 'oculto'}</span>
                </span>
            </button>
        </Panel>
    );
};

interface ResultsProps {
    selected: string | undefined;
    /** Ids dos protocolos cujo resultado já apareceu. */
    shown: ReadonlySet<string>;
    onPick: (id: string) => void;
}

export const ProtocolResults = ({ selected, shown, onPick }: ResultsProps) => (
    <div className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-between px-1">
            <span className="text-[16px] font-semibold text-gray-100">Potência média · beterraba × placebo</span>
            <span className="flex items-center gap-3 font-mono text-[15px] text-gray-300">
                <span><i className="mr-1 inline-block size-2.5 rounded-sm align-baseline" style={{ background: C.placebo }} />placebo</span>
                <span><i className="mr-1 inline-block size-2.5 rounded-sm align-baseline" style={{ background: C.nitrate }} />beterraba</span>
            </span>
        </div>
        {PROTOCOLS.map(p => (
            <ResultRow key={p.id} p={p} lit={selected === p.id} dim={selected !== p.id} shown={shown.has(p.id)}
                onPick={() => onPick(p.id)} />
        ))}
    </div>
);
