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
    { pos: [XA + 0.4, 1.0, 5.9], tgt: [XA, 0.14, 0] },
    { pos: [XA + 0.4, 1.0, 5.9], tgt: [XA, 0.14, 0] },
    { pos: [XA + 0.2, 1.2, 7.5], tgt: [XA, 0.42, 0] },
    { pos: [XC + 0.6, 1.8, 11.4], tgt: [XC, 0.05, 0] },
    { pos: [XD + 2.4, 3.9, 9.6], tgt: [XD, 0.4, 0.5] },
];

const LABELS: readonly (readonly LabelSpec[])[] = [
    [
        lab('rs', 'Retículo sarcoplasmático', 'guarda o Ca²⁺ (pontos azuis)', COL.cisterna, [XA - 1.4, ROW_Y.placebo - 0.45, 0], -48, 44),
        lab('z', 'Linha Z', 'âncora dos filamentos finos', COL.zdisc, [XA + 1.45, ROW_Y.placebo, 0], 70, -22),
        lab('load', 'Mesma carga', 'força e duração iguais', C.muted, [XA + 1.7, 0, 0], 28, 0),
        lab('xb', 'Pontes cruzadas', 'cada ciclo gasta 1 ATP (faíscas)', COL.head, [XA + 0.9, ROW_Y.nitrate, 0.35], 60, 30),
    ],
    [
        lab('drift', 'Custo que deriva', 'o componente lento', COL.placebo, [XA + 1.45, ROW_Y.placebo, 0], 36, -38),
        lab('flat', 'Custo estável', 'tolera mais tempo', COL.nitrateSoft, [XA + 1.45, ROW_Y.nitrate, 0], 36, 38),
    ],
    [],
    [
        lab('gas', 'Gastrocnêmio', '91% tipo II · PO₂ 14 → 19 mmHg', COL.o2, [XC + GASTRO.x, GASTRO.y, 0.5], 95, 28),
        lab('sol', 'Sóleo', '9% tipo II · PO₂ sem mudança', COL.o2, [XC + SOLEUS.x, SOLEUS.y, 0.5], -105, 0),
        lab('flow', 'Anel verde = ganho de fluxo', 'maior onde há mais fibra tipo II', COL.no, [XC - 1.0, 1.5, 0.5], -70, -48),
    ],
    [
        lab('unk', 'Mecanismo ainda aberto', 'proteínas de Ca²⁺ não mudaram em humanos', C.muted, [XD, 1.75, 0.6], 0, -36),
    ],
];

export const SARCO_STEPS: readonly SarcoStep[] = STEP_TEXTS.map((t, i) => ({ ...t, pose: POSES[i], labels: LABELS[i] }));
export const LAST_STEP = SARCO_STEPS.length - 1;
