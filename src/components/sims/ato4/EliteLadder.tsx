import { C } from '../kit/palette';
import { KeyFact } from '../kit/rhythm';
import { Panel } from '../kit/ui';
import { TIERS } from './eliteContent';

/** Três níveis de treino, o mesmo efeito: barras de tempo até o pico em escala cheia (sem eixo cortado). */

const BAR_PLACEBO = 100;
const BAR_NITRATE = 97.2;

export const EliteLadder = ({ lit }: { lit: boolean }) => (
    <div className="flex h-full flex-col gap-2.5 p-4">
        <div className="flex items-baseline justify-between">
            <span className="text-[18px] font-bold text-gray-100">Tempo até o pico de potência, por nível</span>
            <span className="font-mono text-[15px] text-gray-300">interação com o nível P &gt; 0,30</span>
        </div>
        {TIERS.map((t, i) => (
            <Panel key={t.id} state={t.id === 'oli' && lit ? 'active' : 'idle'} glow={C.nitrateSoft} className="flex-1" >
                <div className="flex h-full items-center gap-4 px-4" style={{ marginLeft: i * 12 }}>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/20 font-display text-[1.5rem] font-semibold"
                        style={{ background: `${C.nitrate}${['22', '3a', '66'][i]}`, color: '#fff' }}>{i + 1}</span>
                    <span className="flex w-[236px] shrink-0 flex-col leading-tight">
                        <span className="font-display text-[1.3rem] font-semibold text-white">{t.name}</span>
                        <span className="text-[15px] text-gray-300">{t.sport} · n = {t.n}</span>
                    </span>
                    <span className="flex flex-1 flex-col gap-1.5">
                        <span className="h-[16px] rounded" style={{ width: `${BAR_PLACEBO}%`, background: `${C.placebo}99` }} />
                        <span className="h-[16px] rounded transition-[width] duration-1000 ease-out"
                            style={{ width: lit ? `${BAR_NITRATE}%` : `${BAR_PLACEBO}%`, background: C.nitrate }} />
                    </span>
                    <span className="w-[74px] shrink-0 text-right font-display text-[1.5rem] font-semibold tabular-nums" style={{ color: C.nitrateSoft }}>
                        {t.id === 'oli' ? <KeyFact color={C.nitrate} delay={0.5}>−2,8%</KeyFact> : '−2,8%'}
                    </span>
                </div>
            </Panel>
        ))}
        <span className="font-mono text-[15px] text-gray-300">cinza = placebo · magenta = beterraba · efeito agrupado do estudo</span>
    </div>
);
