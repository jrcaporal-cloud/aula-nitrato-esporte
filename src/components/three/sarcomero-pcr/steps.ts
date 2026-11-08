import { C } from '../../sims/kit/palette';
import type { LabelSpec } from '../shared/Label3D';
import { COL } from './colors';
import { STEP_TEXTS, type StepText } from './content';
import { ROW_Y, STATION_X, type Pose } from './layout';
import { GASTRO, SOLEUS } from './limb';

/* As 5 etapas: texto (content.ts) + pose da câmera + rótulos 3D que aparecem quando o voo termina. */

export interface SarcoStep extends StepText { pose: Pose; labels: readonly LabelSpec[] }

const lab = (id: string, text: string, sub: string, color: string, at: [number, number, number], dx: number, dy: number): LabelSpec =>
    ({ id, text, sub, color, at, dx, dy, big: true });

const [XA, XC, XD] = [STATION_X.a, STATION_X.c, STATION_X.d];

const POSES: readonly Pose[] = [
    { pos: [XA + 0.8, 1.0, 7.6], tgt: [XA + 0.35, 0.1, 0] },
    { pos: [XA + 0.8, 1.0, 7.6], tgt: [XA + 0.35, 0.1, 0] },
    { pos: [XA + 0.2, 1.3, 9.2], tgt: [XA, 0.42, 0] },
    { pos: [XC + 0.6, 1.8, 11.4], tgt: [XC, 0.05, 0] },
    { pos: [XD + 2.4, 3.9, 9.6], tgt: [XD, 0.4, 0.5] },
];

const [YP, YN] = [ROW_Y.placebo, ROW_Y.nitrate];

const LABELS: readonly (readonly LabelSpec[])[] = [
    [
        lab('z', 'Linha Z', 'âncora dos filamentos finos', COL.zdisc, [XA - 1.2, YP + 0.5, 0], -50, -30),
        lab('ck', 'Creatina-quinase (linha M)', 'flash: o fosfato passa da PCr ao ADP', COL.pcr, [XA, YP + 0.45, 0.3], 50, -38),
        lab('rs', 'Retículo sarcoplasmático', 'guarda o Ca²⁺ (pontos azuis)', COL.cisterna, [XA - 1.05, YN + 0.55, 0.3], -70, -40),
        lab('xb', 'Pontes cruzadas', 'cada ciclo gasta 1 ATP (faíscas)', COL.head, [XA - 0.55, YN - 0.25, 0.35], -90, 45),
        lab('load', 'Mesma carga', 'força e duração iguais', C.muted, [XA + 1.9, YP - 1.07, 0], 30, 0),
        lab('pcr', 'Estoque de PCr', 'esvazia menos com nitrato', COL.pcr, [XA + 2.45, YN - 0.62, 0], 14, 52),
    ],
    [
        lab('drift', 'Custo que deriva', 'o componente lento', COL.placebo, [XA + 2.3, YP + 0.2, 0], 70, 0),
        lab('flat', 'Custo estável', 'tolera mais tempo', COL.nitrateSoft, [XA + 2.3, YN + 0.2, 0], 70, 0),
    ],
    [],
    [
        lab('gas', 'Gastrocnêmio', '91% tipo II · PO₂ 14 → 19 mmHg', COL.o2, [XC + GASTRO.x, GASTRO.y, 0.7], 95, 28),
        lab('sol', 'Sóleo', '9% tipo II · PO₂ sem mudança', COL.o2, [XC + SOLEUS.x, SOLEUS.y, 0.7], -105, 0),
        lab('flow', 'Anel verde = ganho de fluxo', 'maior onde há mais fibra tipo II', COL.no, [XC - 1.0, 1.5, 0.7], -70, -48),
    ],
    [
        lab('unk', 'Mecanismo ainda aberto', 'proteínas de Ca²⁺ não mudaram em humanos', C.muted, [XD, 1.75, 0.6], 0, -36),
    ],
];

export const SARCO_STEPS: readonly SarcoStep[] = STEP_TEXTS.map((t, i) => ({ ...t, pose: POSES[i], labels: LABELS[i] }));
export const LAST_STEP = SARCO_STEPS.length - 1;
