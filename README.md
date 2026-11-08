# Da Raiz ao Músculo — nitrato inorgânico no exercício e no esporte

Aula interativa de pós-graduação (medicina do esporte / nutrição esportiva) do Rinaldo Caporal (CRN6-21717).
53 slides em 6 atos, cerca de 2h50 com discussão. Tudo em português do Brasil.

## Estrutura da aula
I · A Raiz (abertura, votação, casos fictícios) · II · A Viagem (fisiologia: boca, bactérias, nitrito → NO, custo de O₂, fibra tipo II) ·
III · A Pista (endurance, dose, o teto do treinado) · IV · O Sprint e a Força (coletivos, potência, clínica) ·
V · O Contra-Interrogatório (metodologia) · VI · O Veredito (prática e regras).
O roteiro slide a slide está em `docs/ROTEIRO.md`; os números vêm só dos dossiês conferidos em `docs/dossie/` (a maioria tem a seção "Não citar"). O dossiê 05 público traz só dose, fontes, regulação e história; o restante da pesquisa, fora do escopo da aula, fica só no computador do autor.

## Abrir
```bash
npm install
npm run dev -- --port 5340     # http://localhost:5340/aula-nitrato-esporte/
```
- `?tempo=90` e `?tempo=60` — versões curtas (ver `src/data/modes.ts`).
- Teclas: → ← passam o passo/slide, **G** visão geral, **F** tela cheia, **P** modo apresentador (2ª janela), **D** fontes/detalhamento, **3** modelo 3D do slide.
- Bancadas: `?sim=NomeDoSimulador` e `?model=nome-do-modelo`.

## Como a aula é montada
- `docs/fragmentos/ato-*.json` + `*.notas.json` → `python3 scripts/montar-aula.py` gera `src/data/parsedPresentation.json` e `src/data/notas.json`.
- Simuladores: `src/components/sims/*.tsx` (entram pelo token `[[COMP:Nome]]`); kit em `sims/kit/`.
- Modelos 3D: `src/components/three/models/*.tsx` (viagem-nitrato, vaso-hipoxia, sarcomero-pcr), ligados a slides em `deck/slides.ts`.
- Cache offline: `public/sw.js`.

## Verificação
```bash
npx tsc -b && npx eslint . && npx vitest run && npx vite build
node scripts/qa/sim-check.mjs <Sim|#/n> 5340 /tmp/capturas 1280x720
```

## Escopo de conteúdo
A aula trata de fisiologia, ensaios, metodologia, dose esportiva, fontes alimentares e regras do esporte. Não aborda toxicidade nem tópicos sensíveis de saúde.

## Publicação
```bash
npm run publicar   # testa, compila e envia dist/ para o branch gh-pages
```
Site: https://jrcaporal-cloud.github.io/aula-nitrato-esporte/ (GitHub Pages, branch `gh-pages`).
