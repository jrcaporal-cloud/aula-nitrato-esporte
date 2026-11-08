/**
 * Capa de entrada (HTML puro em index.html, dentro de #root): aparece antes de qualquer JS e
 * antes do CSS da aula. Quando a aula monta, espera o CSS (sempre) e as fontes (com teto) e
 * some com fade — sem salto de layout: é uma camada fixa por cima, fora do fluxo.
 */
const SPLASH_ID = 'boot-splash';
const FONT_LINK_ID = 'boot-fonts';
/** Teto da espera pelas fontes: rede ruim não pode segurar a aula atrás da capa. */
const FONT_WAIT_MS = 1200;
const FADE_MS = 450;
const FADE_REDUCED_MS = 120;

let dismissed = false;

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));
const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

/** Um `<link rel="preload" as="style">` vira folha de estilo no onload; resolve quando ela vale. */
const styleApplied = (link: HTMLLinkElement): Promise<void> => new Promise(resolve => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    link.addEventListener('error', finish, { once: true });
    const check = () => {
        if (done) return;
        if (link.rel === 'stylesheet' && link.sheet) finish();
        else requestAnimationFrame(check);
    };
    check();
});

/** CSS da aula (marcado pelo build): sem ele a aula apareceria sem estilo, então não tem teto. */
const appStylesReady = (): Promise<void> => {
    const links = [...document.querySelectorAll<HTMLLinkElement>('link[data-boot-style]')];
    return Promise.all(links.map(styleApplied)).then(() => undefined);
};

/** CSS das fontes chegou (ou falhou) e as fontes pedidas por ele carregaram. */
const fontsReady = (): Promise<void> => {
    const link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
    const sheet = link ? styleApplied(link) : Promise.resolve();
    return sheet.then(() => document.fonts.ready).then(() => undefined);
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Some com a capa de entrada. Idempotente (o StrictMode chama efeitos duas vezes em dev). */
export const dismissSplash = (): void => {
    if (dismissed) return;
    dismissed = true;
    const el = document.getElementById(SPLASH_ID);
    if (!el) return;
    const fonts = Promise.race([fontsReady(), wait(FONT_WAIT_MS)]).catch(() => undefined);
    void Promise.all([appStylesReady(), fonts])
        .then(nextFrame)
        .then(() => {
            const fade = prefersReducedMotion() ? FADE_REDUCED_MS : FADE_MS;
            el.style.setProperty('--boot-fade', `${fade}ms`);
            el.classList.add('is-leaving');
            // transitionend pode não vir (aba em segundo plano): o temporizador garante a remoção.
            return wait(fade + 80);
        })
        .then(() => el.remove());
};
