import * as THREE from 'three';
import { C } from '../../sims/kit/palette';
import { BRANCH_S, ESOPHAGUS, FEMORAL, GUT, RENAL, STOMACH, TRUNK, URETER } from './anatomy';
import { Capillaries } from './Capillaries';
import { CutOrgan, type BumpSpec, type FlowSpec, type Tint } from './CutOrgan';
import { Kidney } from './Kidney';
import { Bladder } from './Bladder';
import type { VnFrame, VnStateRef } from './state';
import { Villi } from './Villi';

/*
 * Órgãos do circuito: esôfago, estômago (o ácido acende a parede), intestino com vilosidades, vasos com
 * pulso de fluxo, ureter, rim e bexiga. Mucosa em malva fosco: a cor saturada é só dos íons.
 */

const MUCOSA = { esophagus: '#6A4654', stomach: '#78485A', gut: '#6E4C5C', vessel: '#4A3A40' } as const;
const VESSEL_CUT = '#E2CDB8';

const NITRATE_COL = new THREE.Color(C.nitrate);
const NITRITE_COL = new THREE.Color(C.nitrite);
const nitrateToNitrite = (f: VnFrame, out: THREE.Color): void => {
    out.copy(NITRATE_COL).lerp(NITRITE_COL, Math.min(f.nitrite * 1.2, 1) * 0.85);
};
const plasma = (f: VnFrame) => 0.35 + 0.65 * Math.max(f.nitrate, f.nitrite);

const BUMP: Record<string, BumpSpec> = {
    esophagus: { kind: 'folds', repeat: [4, 1], scale: 1.6 },
    stomach: { kind: 'rugae', repeat: [2, 1.2], scale: 2.4 },
    gut: { kind: 'plicae', repeat: [16, 1], scale: 1.8 },
    vessel: { kind: 'mottle', repeat: [8, 1], scale: 0.8 },
};
const FLOW: Record<string, FlowSpec> = {
    esophagus: { color: '#F2B8CC', freq: 3, speed: 0.38, amount: 0.9, level: f => 0.35 + 0.65 * Math.max(f.w.swallow, f.w.salivaP) },
    gut: { color: C.nitrate, freq: 9, speed: 0.3, amount: 0.8, level: f => 0.25 + 0.75 * Math.max(f.w.swallow, f.w.absorb) },
    trunk: { color: C.nitrate, freq: 7, speed: 0.55, amount: 1.1, level: plasma, tint: nitrateToNitrite },
    branch: { color: C.nitrate, freq: 3, speed: 0.55, amount: 1.1, level: plasma, tint: nitrateToNitrite },
    femoral: { color: C.nitrate, freq: 8, speed: 0.55, amount: 1.1, level: plasma, tint: nitrateToNitrite },
    ureter: { color: C.nitrate, freq: 3, speed: 0.45, amount: 1, level: f => 0.2 + 0.8 * f.w.urine },
};
const ACID: Tint = { color: C.hypoxia, amount: f => f.w.acid * 0.75 };

export const Organs = ({ stateRef }: { stateRef: VnStateRef }) => (
    <group>
        <CutOrgan id="esofago" organ={ESOPHAGUS} base={MUCOSA.esophagus} emissive="#B27A8C" rim={C.placebo} cut="#E3BFC6" tubular={44} radial={22} shell={0.4} stateRef={stateRef} bump={BUMP.esophagus} flow={FLOW.esophagus} />
        <CutOrgan id="estomago" organ={STOMACH} base={MUCOSA.stomach} emissive="#C48598" rim={C.placebo} cut="#E8C4CA" tubular={90} radial={36} shell={0.5} stateRef={stateRef} tint={ACID} bump={BUMP.stomach} glow={0.2} />
        <CutOrgan id="intestino" organ={GUT} base={MUCOSA.gut} emissive="#B88294" rim={C.placebo} cut="#E6C2C8" tubular={260} radial={18} shell={0.45} stateRef={stateRef} bump={BUMP.gut} flow={FLOW.gut} />
        <Villi stateRef={stateRef} />
        <CutOrgan id="vasos" organ={TRUNK} base={MUCOSA.vessel} emissive="#CDBFB0" rim="#CDBFB0" cut={VESSEL_CUT} tubular={160} radial={16} shell={0.35} stateRef={stateRef} bump={BUMP.vessel} flow={FLOW.trunk} />
        <CutOrgan id="vasos" organ={BRANCH_S} base={MUCOSA.vessel} emissive="#CDBFB0" rim="#CDBFB0" cut={VESSEL_CUT} tubular={50} radial={12} shell={0} stateRef={stateRef} flow={FLOW.branch} />
        <CutOrgan id="vasos" organ={RENAL} base={MUCOSA.vessel} emissive="#CDBFB0" rim="#CDBFB0" cut={VESSEL_CUT} tubular={20} radial={12} shell={0} stateRef={stateRef} flow={FLOW.branch} />
        <CutOrgan id="vasos" organ={FEMORAL} base={MUCOSA.vessel} emissive="#CDBFB0" rim="#CDBFB0" cut={VESSEL_CUT} tubular={130} radial={14} shell={0.3} stateRef={stateRef} bump={BUMP.vessel} flow={FLOW.femoral} />
        <Capillaries stateRef={stateRef} />
        <CutOrgan id="rim" organ={URETER} base={MUCOSA.vessel} emissive="#CDBFB0" rim="#CDBFB0" cut={VESSEL_CUT} tubular={60} radial={10} shell={0} stateRef={stateRef} flow={FLOW.ureter} />
        <Kidney stateRef={stateRef} />
        <Bladder stateRef={stateRef} />
    </group>
);
