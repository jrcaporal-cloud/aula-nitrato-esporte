import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Pedaços estáveis de bibliotecas: mudam só quando a biblioteca muda, então o navegador
 * (e o cache offline) reaproveita entre versões da aula. A ordem importa: o primeiro que casa vence.
 * three + R3F ficam fora da carga inicial (fundo e modelos 3D são preguiçosos).
 */
const VENDOR_CHUNKS: ReadonlyArray<readonly [string, RegExp]> = [
  ['vendor-three', /\/node_modules\/(three|three-stdlib|@react-three|postprocessing|maath|camera-controls|troika-[^/]+|three-mesh-bvh|its-fine|react-use-measure|suspend-react|@monogrid|meshline|stats-gl|detect-gpu|@use-gesture|tunnel-rat|hls\.js|n8ao)\//],
  ['vendor-motion', /\/node_modules\/(framer-motion|motion-dom|motion-utils)\//],
  ['vendor-react', /\/node_modules\/(react|react-dom|scheduler|zustand|use-sync-external-store)\//],
]

/** Ajudantes internos do Vite/Rollup (pré-carga de import(), commonjs): se caíssem no pedaço do
 * three, a capa teria de baixar o three inteiro só por eles. */
const BUILD_HELPERS = /vite\/preload-helper|commonjsHelpers|vite\/modulepreload-polyfill/

const manualChunks = (id: string): string | undefined => {
  if (BUILD_HELPERS.test(id)) return 'vendor-react'
  if (id.includes('/src/data/parsedPresentation.json')) return 'aula-dados'
  return VENDOR_CHUNKS.find(([, test]) => test.test(id))?.[0]
}

/**
 * O CSS da aula não bloqueia a primeira pintura: a capa de entrada (CSS embutido no index.html)
 * aparece já, e a aula só é revelada depois que o CSS chega (src/boot/splash.ts espera os
 * `link[data-boot-style]`). Só no build; no dev o CSS vem pelo JS.
 */
const cssSemBloqueio = (): Plugin => ({
  name: 'aula-css-sem-bloqueio',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    // Folha inserida por script não bloqueia a pintura (e, ao contrário de rel=preload, não gera
    // aviso de "preload não usado" quando o service worker já controla a página).
    handler: html => html.replace(
      /<link rel="stylesheet"( crossorigin)? href="([^"]+\.css)">/g,
      (_tag, crossorigin = '', href: string) =>
        `<script>(function(l){l.rel='stylesheet';${crossorigin ? "l.crossOrigin='';" : ''}l.href=${JSON.stringify(href)};` +
        `l.setAttribute('data-boot-style','');document.head.appendChild(l)})(document.createElement('link'))</script>` +
        `<noscript><link rel="stylesheet"${crossorigin} href="${href}"></noscript>`,
    ),
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cssSemBloqueio()],
  base: '/aula-nitrato-esporte/',
  build: {
    rollupOptions: { output: { manualChunks } },
    // three.js não se divide por dentro (o R3F importa o pacote inteiro): ~1 MB sem gzip, mas
    // só baixa depois da capa, para o fundo e os modelos 3D. O aviso fica para qualquer outro pedaço.
    chunkSizeWarningLimit: 1100,
  },
})
