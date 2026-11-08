/**
 * Cache offline: a aula abre e roda sem internet depois da primeira visita.
 * O service worker (public/sw.js) recebe a lista do que a página já baixou e guarda tudo.
 * Como o fundo 3D, os simuladores e os modelos chegam DEPOIS do `load` (carga preguiçosa e
 * pré-carga em segundo plano), cada arquivo novo também é mandado ao cache assim que termina.
 */
const FLUSH_MS = 800;
/** O navegador guarda só 250 entradas por padrão; a aula baixa mais que isso. */
const RESOURCE_BUFFER = 2000;

type Post = (urls: string[]) => void;

const pageUrl = () => window.location.href.split('#')[0];

/** Fontes locais que ainda não foram usadas (ex.: JetBrains Mono 600 só aparece em slides adiante):
 * o navegador só baixa uma fonte quando ela aparece na tela, então sem isto ela faltaria offline.
 * Só woff2 dos subconjuntos latinos — os outros alfabetos não aparecem na aula. */
const LOCAL_FONT = /-latin(-ext)?-\d+-normal-[\w-]+\.woff2$/;

const localFontFiles = (): string[] => [...document.styleSheets].flatMap(sheet => {
    let rules: CSSRule[] = [];
    try {
        rules = [...sheet.cssRules];
    } catch {
        return []; // folha de outro domínio (fontshare): o navegador não deixa ler
    }
    return rules
        .filter((rule): rule is CSSFontFaceRule => rule instanceof CSSFontFaceRule)
        .flatMap(rule => [...rule.style.getPropertyValue('src').matchAll(/url\("?([^")]+)"?\)/g)].map(m => m[1]))
        .map(href => new URL(href, sheet.href ?? window.location.href).href)
        .filter(href => LOCAL_FONT.test(href));
});

/** Junta os arquivos novos e manda em lotes (um recado a cada ~0,8 s, não um por arquivo). */
const watchNewResources = (post: Post): void => {
    if (typeof PerformanceObserver === 'undefined') return;
    let pending: string[] = [];
    let timer = 0;
    const flush = () => {
        timer = 0;
        const urls = pending;
        pending = [];
        if (urls.length) post(urls);
    };
    const observer = new PerformanceObserver(list => {
        pending = [...pending, ...list.getEntries().map(entry => entry.name)];
        if (!timer) timer = window.setTimeout(flush, FLUSH_MS);
    });
    try {
        observer.observe({ type: 'resource', buffered: false });
    } catch {
        // Navegador sem observador de recursos: fica só a primeira lista e o cache em tempo real do sw.
    }
};

export const registerOfflineCache = (): void => {
    if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
    performance.setResourceTimingBufferSize?.(RESOURCE_BUFFER);
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(`${import.meta.env.BASE_URL}sw.js`)
            .then(() => navigator.serviceWorker.ready)
            .then(registration => {
                const post: Post = urls => registration.active?.postMessage({ type: 'precache', urls });
                // Primeiro o que já veio (página, código, fontes); depois, o que for chegando.
                post([pageUrl(), ...performance.getEntriesByType('resource').map(entry => entry.name), ...localFontFiles()]);
                watchNewResources(post);
            })
            .catch(() => undefined);
    });
};
