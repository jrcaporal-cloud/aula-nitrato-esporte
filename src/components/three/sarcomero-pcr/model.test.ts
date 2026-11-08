import { describe, expect, it } from 'vitest';
import { DATA } from './content';
import { correlatedWith, pearson, torque } from './curves';
import { dpcrAt, LOW, signals } from './kinetics';
import { MUSCLES } from './limb';

describe('modelo sarcomero-pcr', () => {
    it('a queda da PCr chega aos valores do dossiê no fim do platô', () => {
        expect(dpcrAt('placebo', LOW.hold)).toBeCloseTo(DATA.low.dPcr.placebo, 6);
        expect(dpcrAt('nitrate', LOW.hold)).toBeCloseTo(DATA.low.dPcr.nitrate, 6);
        expect(dpcrAt('placebo', 0)).toBe(0);
    });

    it('o turnover de ATP no platô é 296 (placebo) e 192 (nitrato) µM/s', () => {
        expect(signals(0, 'placebo', 'II', 6).atp).toBeCloseTo(296, 6);
        expect(signals(0, 'nitrate', 'II', 6).atp).toBeCloseTo(192, 6);
    });

    it('o ganho de fluxo dos 28 músculos tem correlação 0,74 com a % de fibras tipo II', () => {
        expect(MUSCLES).toHaveLength(28);
        expect(pearson(MUSCLES.map(m => m.pct), MUSCLES.map(m => m.gain))).toBeCloseTo(0.74, 6);
        const x = [1, 2, 3, 4, 5, 6, 7, 8];
        expect(pearson(x, correlatedWith(x, 0.5, 9))).toBeCloseTo(0.5, 6);
    });

    it('só o gastrocnêmio (91%) e o sóleo (9%) têm % fixada pelo dossiê', () => {
        expect(MUSCLES.find(m => m.id === 'gastro')?.pct).toBe(91);
        expect(MUSCLES.find(m => m.id === 'soleo')?.pct).toBe(9);
    });

    it('a curva torque-frequência tem o mesmo topo e desloca o meio', () => {
        expect(torque(10000, 20)).toBeCloseTo(1, 3);
        expect(torque(20, 20)).toBeCloseTo(0.5, 6);
        expect(torque(20, 14)).toBeGreaterThan(torque(20, 24));
    });

    it('só a fibra rápida com nitrato tem Ca²⁺ aumentado (etapa 3)', () => {
        const amp = (c: 'placebo' | 'nitrate', f: 'II' | 'I') => signals(2, c, f, 3).amp;
        expect(amp('nitrate', 'II')).toBeGreaterThan(1);
        expect(amp('nitrate', 'I')).toBe(1);
        expect(amp('placebo', 'II')).toBe(1);
    });
});
