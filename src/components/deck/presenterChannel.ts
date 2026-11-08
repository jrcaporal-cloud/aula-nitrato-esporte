/**
 * Canal entre a janela da aula (projetor) e a janela do apresentador (notebook).
 * BroadcastChannel funciona entre janelas da mesma origem, sem servidor.
 */
const MAIN_CHANNEL = 'aula-doping-apresentador';

/** Canal isolado da prévia do próximo passo (iframe dentro da janela do apresentador). */
export const previewChannelName = (id: string) => `aula-nitrato-previa-${id}`;

const previewId = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('previa');

/** Esta janela é a prévia do apresentador: não conversa com a aula de verdade, só com quem a abriu. */
export const IS_PREVIEW = previewId !== null;

export const PRESENTER_CHANNEL = previewId ? previewChannelName(previewId) : MAIN_CHANNEL;

export type DeckState = { type: 'state'; index: number; step: number; stepCount: number };
export type PresenterCommand =
    | { type: 'next' }
    | { type: 'prev' }
    | { type: 'goto'; index: number }
    | { type: 'hello' };

export type PresenterMessage = DeckState | PresenterCommand;

/** Endereço da prévia: mesma aula, canal próprio, já no slide/passo pedido (#/slide/passo). */
export const previewUrl = (id: string, index: number, step: number) => {
    const tempo = new URLSearchParams(window.location.search).get('tempo');
    const hash = step > 0 ? `#/${index + 1}/${step + 1}` : `#/${index + 1}`;
    return `${window.location.pathname}?previa=${id}${tempo ? `&tempo=${tempo}` : ''}${hash}`;
};

export const openPresenterWindow = (index: number) => {
    const tempo = new URLSearchParams(window.location.search).get('tempo');
    const url = `${window.location.pathname}?apresentador${tempo ? `&tempo=${tempo}` : ''}#/${index + 1}`;
    window.open(url, 'aula-apresentador', 'width=1280,height=800');
};
