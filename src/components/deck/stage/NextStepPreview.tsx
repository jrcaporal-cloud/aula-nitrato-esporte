import { useEffect, useMemo, useRef, useState } from 'react';
import { DECK } from '../slides';
import { nextStepTarget, usePreviewSync } from './usePreviewSync';

/** A aula fantasma roda no tamanho do palco de projeção (16:9) e é encolhida para caber aqui. */
const FRAME_W = 1280;
const FRAME_H = 720;

interface NextStepPreviewProps {
    connected: boolean;
    index: number;
    step: number;
    stepCount: number;
}

const useFitScale = () => {
    const boxRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.3);
    useEffect(() => {
        const box = boxRef.current;
        if (!box) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) setScale(Math.min(width / FRAME_W, height / FRAME_H));
        });
        ro.observe(box);
        return () => ro.disconnect();
    }, []);
    return { boxRef, scale };
};

/**
 * Prévia do PRÓXIMO PASSO na janela do apresentador: se o slide ainda tem passos,
 * mostra o mesmo slide no passo seguinte; no último passo, o próximo slide no passo 1.
 */
export const NextStepPreview = ({ connected, index, step, stepCount }: NextStepPreviewProps) => {
    const raw = connected ? nextStepTarget(index, step, stepCount) : null;
    const tIndex = raw?.index ?? -1;
    const tStep = raw?.step ?? -1;
    const atEnd = connected && tIndex >= DECK.length;
    const target = useMemo(
        () => (tIndex >= 0 && tIndex < DECK.length ? { index: tIndex, step: tStep } : null),
        [tIndex, tStep],
    );
    const { src, preview } = usePreviewSync(target);
    const { boxRef, scale } = useFitScale();

    const sameSlide = target?.index === index;
    const total = sameSlide ? stepCount : preview?.index === target?.index ? preview?.stepCount : undefined;
    const synced = Boolean(target && preview && preview.index === target.index && preview.step === target.step);
    const title = target ? DECK[target.index].label : '';

    return (
        <div className="flex flex-col gap-2 min-h-0 flex-1">
            <p className="text-[12px] uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${synced ? 'bg-brand-accent' : 'bg-amber-400 animate-pulse'}`} />
                {target
                    ? <>Próximo passo: <span className="text-gray-100 font-mono">{target.step + 1} de {total ?? '…'}</span>{!sameSlide && <span className="text-sky-300 normal-case tracking-normal">· slide {String(target.index + 1).padStart(2, '0')}</span>}</>
                    : atEnd ? 'Último passo da aula' : 'Prévia do próximo passo'}
            </p>
            {target && <p className="text-base text-gray-200 leading-snug line-clamp-1">{title}</p>}
            <div ref={boxRef} className="relative flex-1 min-h-[120px]">
                <div
                    className="absolute top-0 left-0 rounded-xl overflow-hidden border border-white/15 bg-[#07050B]"
                    style={{ width: FRAME_W * scale, height: FRAME_H * scale }}
                >
                    {src && (
                        <iframe
                            title="Prévia do próximo passo"
                            src={src}
                            tabIndex={-1}
                            className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left"
                            style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
                        />
                    )}
                    {!target && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#07050B] text-gray-500 text-sm">
                            {atEnd ? 'Fim da aula' : 'Aguardando a janela da aula…'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
