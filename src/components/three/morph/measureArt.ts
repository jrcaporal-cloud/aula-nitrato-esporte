/**
 * Mede onde está a "arte" do slide atual (o maior svg/canvas/imagem dentro do palco), em pixels
 * relativos ao contêiner do deck. É desse retângulo que a cena 3D nasce e para onde ela volta.
 */

export interface ArtRect {
    /** Recuos de cada borda até o retângulo da arte (formato do `clip-path: inset(...)`). */
    top: number;
    right: number;
    bottom: number;
    left: number;
    /** Centro da arte, para o clarão e a origem da escala. */
    cx: number;
    cy: number;
}

/** Abaixo desta fração da tela o elemento é ícone ou enfeite, não a arte do slide. */
const MIN_AREA_FRACTION = 0.03;
/** Sem arte encontrada, a cena nasce de um retângulo central com esta fração da tela. */
const FALLBACK_FRACTION = 0.5;
const ART_SELECTOR = 'svg, canvas, img, video';

const fallback = (w: number, h: number): ArtRect => {
    const padX = (w * (1 - FALLBACK_FRACTION)) / 2;
    const padY = (h * (1 - FALLBACK_FRACTION)) / 2;
    return { top: padY, right: padX, bottom: padY, left: padX, cx: w / 2, cy: h / 2 };
};

/** O slide em cena: o que tem o rótulo "n de N"; durante uma troca, o mais recente no DOM. */
const currentSlide = (root: HTMLElement, index: number): HTMLElement | null => {
    const slides = Array.from(root.querySelectorAll<HTMLElement>('section[aria-roledescription="slide"]'));
    const byLabel = slides.find(s => s.getAttribute('aria-label')?.startsWith(`${index + 1} de `));
    return byLabel ?? slides[slides.length - 1] ?? null;
};

const clampRect = (r: DOMRect, base: DOMRect) => {
    const left = Math.max(r.left - base.left, 0);
    const top = Math.max(r.top - base.top, 0);
    const right = Math.min(r.right - base.left, base.width);
    const bottom = Math.min(r.bottom - base.top, base.height);
    return { left, top, right, bottom, area: Math.max(right - left, 0) * Math.max(bottom - top, 0) };
};

export const measureArt = (root: HTMLElement | null, index: number): ArtRect => {
    if (!root) return fallback(window.innerWidth, window.innerHeight);
    const base = root.getBoundingClientRect();
    const slide = currentSlide(root, index);
    if (!slide || base.width === 0 || base.height === 0) return fallback(base.width, base.height);

    const minArea = base.width * base.height * MIN_AREA_FRACTION;
    let best: ReturnType<typeof clampRect> | null = null;
    for (const el of Array.from(slide.querySelectorAll(ART_SELECTOR))) {
        // svg dentro de svg (ou ícone dentro do desenho) não conta separado
        if (el.parentElement?.closest('svg')) continue;
        const r = clampRect(el.getBoundingClientRect(), base);
        if (r.area >= minArea && (!best || r.area > best.area)) best = r;
    }
    if (!best) return fallback(base.width, base.height);

    return {
        top: best.top,
        right: base.width - best.right,
        bottom: base.height - best.bottom,
        left: best.left,
        cx: (best.left + best.right) / 2,
        cy: (best.top + best.bottom) / 2,
    };
};
