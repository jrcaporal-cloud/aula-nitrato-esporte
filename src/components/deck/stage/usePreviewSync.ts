import { useCallback, useEffect, useRef, useState } from 'react';
import { previewChannelName, previewUrl, type DeckState, type PresenterCommand, type PresenterMessage } from '../presenterChannel';

export interface StepTarget { index: number; step: number }

/** Próximo passo a partir do estado da aula: mesmo slide no passo seguinte, ou próximo slide no passo 1. */
export const nextStepTarget = (index: number, step: number, stepCount: number): StepTarget =>
    step < stepCount - 1 ? { index, step: step + 1 } : { index: index + 1, step: 0 };

const HELLO_MS = 500;
const COMMAND_TIMEOUT_MS = 700;

/** Comando que aproxima a prévia do alvo, ou null se já chegou (ou se ainda espera o slide declarar os passos). */
const commandToward = (pv: DeckState, target: StepTarget): PresenterCommand | null => {
    if (pv.index !== target.index) return { type: 'goto', index: target.index };
    if (pv.step < target.step && pv.step < pv.stepCount - 1) return { type: 'next' };
    if (pv.step > target.step && pv.step > 0) return { type: 'prev' };
    return null;
};

/**
 * Mantém uma aula "fantasma" (iframe com ?previa=<id>) sempre no próximo passo.
 * A prévia carrega uma vez só; depois é guiada pelo próprio canal dela (goto/next/prev),
 * um comando por vez, até o estado que ela devolve bater com o alvo.
 */
export const usePreviewSync = (target: StepTarget | null) => {
    const [id] = useState(() => Math.random().toString(36).slice(2, 10));
    const [src, setSrc] = useState<string | null>(null);
    const [preview, setPreview] = useState<DeckState | null>(null);
    const channelRef = useRef<BroadcastChannel | null>(null);
    const targetRef = useRef<StepTarget | null>(target);
    const previewRef = useRef<DeckState | null>(null);
    const waitingUntilRef = useRef(0);

    const reconcile = useCallback(() => {
        const pv = previewRef.current;
        const tg = targetRef.current;
        if (!pv || !tg || performance.now() < waitingUntilRef.current) return;
        const cmd = commandToward(pv, tg);
        if (!cmd) return;
        waitingUntilRef.current = performance.now() + COMMAND_TIMEOUT_MS;
        channelRef.current?.postMessage(cmd);
    }, []);

    useEffect(() => {
        const channel = new BroadcastChannel(previewChannelName(id));
        channelRef.current = channel;
        channel.onmessage = (e: MessageEvent<PresenterMessage>) => {
            if (e.data.type !== 'state') return;
            previewRef.current = e.data;
            waitingUntilRef.current = 0;
            setPreview(e.data);
            reconcile();
        };
        // O deck só publica o estado quando ele muda: pede até a prévia responder.
        const hello = window.setInterval(() => {
            if (previewRef.current) window.clearInterval(hello);
            else channel.postMessage({ type: 'hello' } satisfies PresenterCommand);
        }, HELLO_MS);
        return () => { window.clearInterval(hello); channel.close(); channelRef.current = null; };
    }, [id, reconcile]);

    useEffect(() => {
        targetRef.current = target;
        reconcile();
        // Retoma depois de um comando sem resposta (ex.: slide sem passos não republica o estado).
        const retry = window.setTimeout(reconcile, COMMAND_TIMEOUT_MS + 50);
        return () => window.clearTimeout(retry);
    }, [target, reconcile]);

    // A prévia nasce já no alvo (o hash #/slide/passo vale na primeira carga) e nunca recarrega.
    if (target && !src) setSrc(previewUrl(id, target.index, target.step));

    return { src, preview };
};
