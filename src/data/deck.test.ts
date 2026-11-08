import { describe, expect, it } from 'vitest';
import parsed from './parsedPresentation.json';
import { NOTES } from './notes';
import { keepsSlide, readTempo, type Tempo } from './modes';

interface RawSlide { id: number; sectionName: string; title: string }
const SLIDES = parsed as unknown as RawSlide[];
const IDS = SLIDES.map(s => s.id);

describe('ordem da aula', () => {
    it('tem ids únicos', () => {
        expect(new Set(IDS).size).toBe(IDS.length);
    });

    it('todo slide pertence a um ato', () => {
        for (const s of SLIDES) expect(s.sectionName, `slide ${s.id}`).toMatch(/^Ato (I|II|III|IV|V|VI) · /);
    });

    it('os atos aparecem em ordem e sem voltar', () => {
        const order = ['I', 'II', 'III', 'IV', 'V', 'VI'];
        const seq = SLIDES.map(s => order.indexOf(s.sectionName.split(' ')[1]));
        expect([...seq].sort((a, b) => a - b)).toEqual(seq);
    });

    it('abre com a capa e fecha com a frase final', () => {
        expect(IDS[0]).toBe(0);
        expect(IDS[IDS.length - 1]).toBe(99);
    });
});

describe('notas do apresentador', () => {
    it('todo slide tem nota com mensagem e tempo-alvo', () => {
        for (const id of IDS) {
            const note = NOTES[id];
            expect(note, `slide ${id}`).toBeDefined();
            expect(note.mensagem.length).toBeGreaterThan(10);
            expect(note.minutos).toBeGreaterThan(0);
        }
    });

    it('não há nota para slide que não existe', () => {
        for (const key of Object.keys(NOTES)) expect(IDS).toContain(Number(key));
    });

    it('a aula completa cabe em 3h com discussão', () => {
        const total = IDS.reduce((sum, id) => sum + NOTES[id].minutos, 0);
        expect(total).toBeGreaterThan(120);
        expect(total).toBeLessThanOrEqual(180);
    });
});

describe('versões por tempo', () => {
    const minutesOf = (tempo: Tempo) =>
        IDS.filter(id => keepsSlide(tempo, id)).reduce((sum, id) => sum + NOTES[id].minutos, 0);

    it('lê o parâmetro da URL e cai na versão completa', () => {
        expect(readTempo('?tempo=90')).toBe('90');
        expect(readTempo('?tempo=60')).toBe('60');
        expect(readTempo('?tempo=abc')).toBe('completa');
        expect(readTempo('')).toBe('completa');
    });

    it('a versão completa mantém tudo', () => {
        expect(IDS.every(id => keepsSlide('completa', id))).toBe(true);
    });

    it('as versões curtas mantêm a votação, os casos, o veredito dos casos e o fechamento', () => {
        for (const tempo of ['90', '60'] as const) {
            for (const id of [0, 10, 11, 83, 88, 99]) expect(keepsSlide(tempo, id), `${tempo} min, slide ${id}`).toBe(true);
        }
    });

    it('cada versão cabe no tempo prometido (margem de 15%)', () => {
        expect(minutesOf('90')).toBeLessThanOrEqual(90 * 1.15);
        expect(minutesOf('60')).toBeLessThanOrEqual(60 * 1.15);
        expect(minutesOf('60')).toBeLessThan(minutesOf('90'));
    });
});

describe('arquivos da aula', () => {
    const sims = Object.keys(import.meta.glob('../components/sims/*.tsx')).map(p => p.replace('../components/sims/', '').replace('.tsx', ''));
    const models = Object.keys(import.meta.glob('../components/three/models/*.tsx')).map(p => p.replace('../components/three/models/', '').replace('.tsx', ''));
    const raw = parsed as unknown as { id: number; content: string }[];

    it('todo [[COMP:Nome]] tem o simulador correspondente', () => {
        for (const s of raw) {
            const token = s.content.match(/\[\[COMP:(\w+)\]\]/);
            if (token) expect(sims, `slide ${s.id}`).toContain(token[1]);
        }
    });

    it('todo modelo 3D ligado a um slide existe', () => {
        for (const name of ['vaso-hipoxia', 'viagem-nitrato', 'sarcomero-pcr']) expect(models).toContain(name);
    });
});
