# Guia de construção — simuladores 2D e modelos 3D da aula "Da Raiz ao Músculo"

Projeto: `/Users/mac/projetos claude/aula-nitrato-esporte` (React 19 + Vite 7 + Tailwind v4 + framer-motion 12 + R3F 9 + drei 10 + three 0.183).
Dev server já rodando: `http://localhost:5340/aula-nitrato-esporte/`. Bancada isolada de simulador: `http://localhost:5340/aula-nitrato-esporte/?sim=NomeDoArquivo` (←/→ percorre os passos).
NÃO edite `aula-tamponantes-esporte` nem `aula-fisiologia-doping` (só leitura, como referência).
Não faça commit. Tudo em português do Brasil.

## Regra de conteúdo
Todo número que aparece na tela tem que estar nos dossiês em `docs/dossie/` (fonte única) com a fonte. Se o número não estiver lá, não invente: deixe qualitativo, ou marque "valores ilustrativos" com um `<Chip>`. Personagens são compostos e fictícios — escreva "caso fictício" na tela.

## Onde cada coisa fica
- Simulador 2D: `src/components/sims/NomeSim.tsx`, `export default function NomeSim()`, **sem props**. Subcomponentes/dados em `src/components/sims/<pasta-do-sim>/` (só sua pasta). Entra no slide pelo token `[[COMP:NomeSim]]` no JSON (o orquestrador faz isso).
- Modelo 3D: `src/components/three/models/NomeModelo.tsx` com `export default` de um modal `({ onClose }: Modal3DProps) => JSX` (tipo em `three/registry.ts`). Peças em `src/components/three/<pasta-do-modelo>/`. O orquestrador liga o modelo ao slide em `MODEL_3D_BY_SLIDE` (tecla 3).
- Kit compartilhado (use, não edite): `src/components/sims/kit/` — `palette.ts` (cores `C`, `PANEL_BG`), `ui.tsx` (`StepTabs`, `Panel`, `Chip`, `Source`, `SvgText`), `format.ts` (`br`, `signed`, `pct` com vírgula decimal), `useTween.ts`. Utilitários 3D: `three/shared/` (`Label3D`, `glow.ts`, `math.ts` com `rng`, `phase`, `lerp`).

## Linguagem de cor (obrigatória, igual no 2D e no 3D)
magenta `C.nitrate` = nitrato NO₃⁻ e beterraba · âmbar `C.nitrite` = nitrito NO₂⁻ · verde `C.no` = óxido nítrico NO · azul `C.o2` = O₂/oxi-hemoglobina · laranja `C.hypoxia` = hipóxia/acidose · violeta `C.bacteria` = bactérias orais · ardósia `C.placebo` = placebo/neutro · vermelho `C.risk` = risco. Fundo `#07050B`.

## Passos (o passador)
- `const { step, setStep } = useSlideSteps(N)` (de `src/store/useSlideSteps`). O Deck cuida das setas/passador: cada → avança um passo; no último passo, troca de slide. Não capture ←/→ nem espaço.
- Mostre `StepTabs` (abas numeradas) quando houver ≥3 passos; clique nas abas chama `setStep`.
- Cada passo tem que fazer sentido sozinho (o professor pode voltar).
- Interações extras (hover, clique, arrastar, alternância) são bem-vindas, mas o slide precisa funcionar só com o passador. Tecla de alternância opcional: use uma letra (ex.: `R`) e ignore quando `useStore.getState().modalOpen` for true; NÃO use D, G, F, P, 3 (reservadas pelo deck).

## Layout e tamanho (o que mais quebra)
- O palco tem largura de desenho de **1280 px**; a largura útil do conteúdo de um slide é **~1136 px**. Use `max-w-[1110px] mx-auto w-full`.
- Altura do simulador: **≤ 470 px** (o slide ainda tem título e subtítulo de ~130 px). Fixe a altura (`style={{ height: 460 }}`) para não pular entre passos. Nada pode rolar em 1280×720, 1366×768 e 1920×1080.
- Texto ≥ **14 px efetivos** no projetor. Em HTML use `text-[14px]` ou maior (corpo 15–17 px). Em SVG com viewBox, o texto encolhe junto: mantenha a proporção do viewBox igual à da caixa e use fontSize ≥ 16 (use `SvgText`).
- Conteúdo do cabeçalho do sim (abas + chips) cabe em 1110 px: não empilhe muitos itens numa linha só.

## Lições técnicas (já custaram caro em aulas anteriores)
1. **Não anime atributo geométrico de SVG (r, cx, cy, d, x, y, width) com keyframes do framer-motion** — o primeiro quadro sai sem atributo e o console enche de "Expected length, undefined". Para movimento contínuo use `<animate>`/`<animateMotion>` do SVG, ou `transform`/`opacity` no framer, ou escreva o atributo por quadro via ref em `requestAnimationFrame`.
2. **Sem `AnimatePresence mode="wait"` em texto de passo**: trocas rápidas deixam texto velho preso. Use `key={step}` com `initial/animate` simples, sem exit.
3. Lint `react-hooks/refs`: não leia `ref.current` durante o render nem passe ref para função chamada no render. Ligue refs dentro de `useEffect`.
4. Lint `react-hooks/set-state-in-effect`: evite `setState` síncrono direto no corpo de um efeito; derive do `step` no render ou agende com `requestAnimationFrame`.
5. Animação por quadro: escreva direto no DOM/atributos via ref, não em estado do React por quadro.
6. Respeite `useReducedMotion()` do framer (chega ao estado final sem animar).
7. 3D: `<Canvas resize={{ offsetSize: true }}>` (o palco é escalado); `dpr={[1, 1.75]}`; sem pós-processamento pesado; instancie geometrias repetidas (`instancedMesh`); `frameloop` normal. Meta: fps igual ao de about:blank.
8. Modal 3D: tela cheia (`absolute inset-0 z-50`), fundo `#07050B`, botão fechar visível, **Esc fecha** (trate o teclado no próprio modal; o Deck pausa a navegação enquanto o modal está aberto). Etapas próprias (← → no modal, botão ▶ opcional), painel lateral com o texto da etapa, rótulos 3D ≥14 px, selo "representação esquemática · escalas fora de proporção". Referência de qualidade: `/Users/mac/projetos claude/aula-fisiologia-doping/src/components/three/CardioMechanism3DModal.tsx` e `three/cardio/`.
9. Não use `console.log` no código final; 0 erros e 0 avisos no console.

## Verificação antes de entregar (obrigatória)
```bash
cd "/Users/mac/projetos claude/aula-nitrato-esporte"
npx tsc -p tsconfig.app.json --noEmit
npx eslint src/components/sims/NomeSim.tsx src/components/sims/pasta/   # ou os seus arquivos 3D
```
Depois abra a bancada `?sim=NomeSim` com Playwright (Chromium já instalado: `node` + `playwright` do projeto) em 1280×720, percorra todos os passos com ArrowRight, tire print de cada passo e OLHE os prints (Read na imagem). Confira: nada cortado, nada rolando, texto legível, 0 erros de console. Para 3D, abra um harness temporário só seu (ex.: um arquivo HTML/rota no scratchpad) ou peça ao orquestrador para ligar o modelo; ao menos garanta tsc/eslint limpos e teste a cena com um sim temporário `src/components/sims/_Preview<Nome>.tsx` que renderiza o modal (apague-o no fim).

Resposta final ao orquestrador: ≤15 linhas — arquivos criados, passos de cada sim, números usados (com ID da fonte do dossiê), o que ficou ilustrativo, e qualquer problema.
