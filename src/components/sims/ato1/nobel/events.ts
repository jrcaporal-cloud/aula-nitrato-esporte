/**
 * Slide 12 · "O Gás que Virou Nobel": os cinco marcos da história (dossiês 01, 02 e 05).
 * Benjamin 1994 e Larsen 2006 entram só como marcos (sem abstract no dossiê: nenhum número deles).
 */
import { C } from '../../kit/palette';

export type FigureKind = 'stomach' | 'tongue' | 'nobel' | 'oxygen' | 'exeter';

export interface NobelEvent {
    /** Texto do ano na linha do tempo e na aba. */
    year: string;
    /** Posição na escala de anos (2006–07 fica em 2006,5). */
    at: number;
    /** Legenda curta sob o nó. */
    node: string;
    color: string;
    kicker: string;
    title: string;
    body: string;
    source: string;
    figure: FigureKind;
}

export const EVENTS: readonly NobelEvent[] = [
    {
        year: '1994', at: 1994, node: 'estômago', color: C.no, figure: 'stomach',
        kicker: 'Nature · Gut',
        title: 'O estômago fabrica NO',
        body: 'Nitrato e nitrito eram vistos como produtos finais inertes do NO. Então dois grupos mostram, no mesmo ano, que o nitrato da dieta vira NO no estômago: 800–6.000 ppb no ar expelido, mais de 100× o da boca, e −95% com omeprazol.',
        source: 'Lundberg 1994 · Benjamin 1994 · Lundberg 2008',
    },
    {
        year: '1995', at: 1995, node: 'língua', color: C.bacteria, figure: 'tongue',
        kicker: 'Nature Medicine',
        title: 'A língua e as bactérias',
        body: 'No rato, a redução do nitrato a nitrito fica numa área especializada do dorso posterior da língua, cheia de bactérias. No rato germ-free, ela não acontece. O passo decisivo da via não é nosso: é de uma simbiose.',
        source: 'Duncan 1995',
    },
    {
        year: '1998', at: 1998, node: 'Nobel', color: C.noSoft, figure: 'nobel',
        kicker: '12/10/1998 · Nobel de Fisiologia ou Medicina',
        title: 'O gás que virou Nobel',
        body: 'Furchgott, Ignarro e Murad: o óxido nítrico como molécula sinalizadora do sistema cardiovascular. Levou cerca de 100 anos para se esclarecer que a nitroglicerina, a de Alfred Nobel, age liberando NO.',
        source: 'Nobel Assembly, Karolinska Institutet, 1998',
    },
    {
        year: '2006–07', at: 2006.5, node: 'Karolinska', color: C.o2, figure: 'oxygen',
        kicker: 'Karolinska · NEJM 2006 · Acta Physiol 2007',
        title: 'O custo de O₂ cai',
        body: 'Nitrato de sódio por 3 dias em 9 homens bem treinados: o O₂ das cargas submáximas cai 5,4%, sem subir o lactato. Os autores chamam o efeito de “altamente surpreendente”.',
        source: 'Larsen 2007 · Larsen 2006 (carta, NEJM)',
    },
    {
        year: '2009', at: 2009, node: 'Exeter', color: C.nitrate, figure: 'exeter',
        kicker: 'Universidade de Exeter',
        title: 'Do sal à beterraba',
        body: 'Exeter troca o sal pelo alimento: 500 mL de suco de beterraba por dia, 6 dias (5,6 mmol/dia de nitrato). O tempo até a exaustão vai de 583 a 675 s: o famoso +16%. O placebo era groselha-preta.',
        source: 'Bailey 2009',
    },
];

export const FIRST_YEAR = 1994;
export const LAST_YEAR = 2009;
