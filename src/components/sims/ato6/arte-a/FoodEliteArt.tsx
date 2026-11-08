import { C } from '../../kit/palette';
import { SvgText } from '../../kit/ui';
import { ELITE_INTAKE } from '../foodContent';
import { DOSE_BANDS, mgToMmol, num } from '../shared';
import { ArtSvg, Stage } from './stage';
import { Drop, PlateDisc, Pile, ShotGlass } from './veg';
import { SvgCount, SvgReveal } from './rhythm';
import { SvgKeyFact } from '../../ato5/countText';

/** Passo 5 do slide 44: a dieta habitual do atleta (prato pequeno, ~1,7 mmol) contra a dose esportiva (5 a 16 mmol). */

const X0 = 40;
const PX = 46.25;
const xOf = (mmol: number): number => X0 + mmol * PX;
const TICKS = [0, 2, 4, 6, 8, 10, 12, 14, 16];

export const FoodEliteArt = () => {
    const { median, q1, q3, min, max } = ELITE_INTAKE;
    const med = mgToMmol(median);
    return (
        <Stage glow={C.nitrite}>
            <ArtSvg label="A ingestão habitual de nitrato do atleta de elite contra a dose esportiva">
                {/* dieta do atleta: prato pequeno */}
                <PlateDisc cx={92} cy={104} r={40} />
                <Pile kind="espinafre" cx={92} cy={110} radius={26} count={2} cap={3} sector={[0, Math.PI]} scale={0.7} />
                <Pile kind="aipo" cx={92} cy={104} radius={26} count={1} cap={2} sector={[Math.PI, 2 * Math.PI]} scale={0.7} />
                <SvgKeyFact color={C.nitrate}>
                    <SvgCount x={150} y={92} text={`${median} mg`} size={52} color={C.nitrate} weight={800} />
                </SvgKeyFact>
                <SvgReveal order={2}>
                    <SvgText x={150} y={120} text="por dia, mediana de 553 atletas" size={18} color="#F3F4F6" />
                    <SvgText x={150} y={144} text={`≈ ${num(med, 1)} mmol`} size={16} color="#D1D5DB" weight={500} />
                    <SvgText x={150} y={164} text={`interquartil ${q1}–${q3} mg`} size={16} color="#D1D5DB" weight={500} />
                </SvgReveal>
                {/* contraste */}
                <path d="M432,96 L478,96 M468,87 L478,96 L468,105" stroke={C.nitrite} strokeWidth={2.5} fill="none" strokeLinecap="round" />
                <SvgText x={455} y={128} text="outra ordem" anchor="middle" size={16} color={C.nitrite} />
                <SvgText x={455} y={148} text="de grandeza" anchor="middle" size={16} color={C.nitrite} />
                {/* dose esportiva: três shots */}
                {[0, 1, 2].map(i => <ShotGlass key={i} x={540 + i * 50} y={44 - i * 4} w={40} h={58} />)}
                <SvgCount x={540} y={134} text="5 a 16 mmol" size={36} color="#fff" weight={800} all />
                <SvgReveal order={2}>
                    <SvgText x={540} y={160} text="a dose esportiva" size={18} color={C.no} weight={600} />
                </SvgReveal>

                {/* régua de mmol: gotas de 1 mmol, faixa do atleta e faixas dos consensos */}
                <line x1={26} x2={786} y1={196} y2={196} stroke="rgba(255,255,255,0.12)" />
                <line x1={xOf(mgToMmol(min))} x2={xOf(mgToMmol(max))} y1={232} y2={232} stroke="rgba(255,255,255,0.45)" strokeWidth={3} strokeLinecap="round" />
                <rect x={xOf(mgToMmol(q1))} y={218} width={xOf(mgToMmol(q3)) - xOf(mgToMmol(q1))} height={28} rx={7} fill={C.nitrate} />
                <rect x={xOf(med) - 2.5} y={212} width={5} height={40} rx={2.5} fill="#fff" />
                <SvgText x={xOf(mgToMmol(max)) + 12} y={238} text={`faixa ${min}–${max} mg`} size={16} color="#E5E7EB" />
                {Array.from({ length: 16 }, (_, k) => (
                    <Drop key={k} x={xOf(k + 0.5)} y={294} s={0.95} opacity={k === 0 ? 1 : k === 1 ? 0.7 : 0.16} />
                ))}
                <SvgText x={X0} y={268} text="cada gota = 1 mmol" size={16} color="#D1D5DB" weight={500} />
                <rect x={xOf(DOSE_BANDS.ioc.lo)} y={312} width={xOf(DOSE_BANDS.ioc.hi) - xOf(DOSE_BANDS.ioc.lo)} height={32} rx={8} fill={`${C.no}30`} stroke={C.no} strokeWidth={1.6} />
                <SvgText x={(xOf(DOSE_BANDS.ioc.lo) + xOf(DOSE_BANDS.ioc.hi)) / 2} y={334} text="IOC 5–9" anchor="middle" size={17} color={C.no} />
                <rect x={xOf(DOSE_BANDS.delphi.lo)} y={352} width={xOf(DOSE_BANDS.delphi.hi) - xOf(DOSE_BANDS.delphi.lo)} height={32} rx={8} fill={`${C.o2}30`} stroke={C.o2} strokeWidth={1.6} />
                <SvgText x={(xOf(DOSE_BANDS.delphi.lo) + xOf(DOSE_BANDS.delphi.hi)) / 2} y={374} text="Delphi 8–16 mmol (agudo)" anchor="middle" size={17} color={C.o2} />
                <line x1={X0} x2={xOf(16)} y1={398} y2={398} stroke="rgba(255,255,255,0.3)" />
                {TICKS.map(t => <SvgText key={t} x={xOf(t)} y={420} text={String(t)} anchor="middle" size={16} color="#D1D5DB" weight={500} />)}
                <SvgText x={24} y={448} text="74% do total vem de vegetais, batata e frutas (alface e espinafre à frente)." size={16} color="#D1D5DB" weight={500} />
                <SvgText x={786} y={448} text="mmol de nitrato" anchor="end" size={16} color="#9CA3AF" weight={500} />
            </ArtSvg>
        </Stage>
    );
};
