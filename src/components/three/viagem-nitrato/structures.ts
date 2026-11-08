import type { Pose } from './content';

/* Estruturas clicáveis: nome, informação curta e fonte (dossiê 01) e a pose do close-up. */

export type StructureId =
    | 'lingua' | 'glandulas' | 'sialina' | 'esofago' | 'estomago' | 'intestino' | 'vasos' | 'musculo' | 'rim' | 'bexiga';

export interface StructureInfo { name: string; info: string; source: string; pose: Pose }

export const STRUCTURES: Readonly<Record<StructureId, StructureInfo>> = {
    lingua: {
        name: 'Dorso posterior da língua',
        info: 'Humanos não têm nitrato-redutase: a etapa é bacteriana (rato germ-free não reduz). Isolados com a enzima: Veillonella atypica 34%, V. dispar 24%, Actinomyces odontolyticus 21%, Rothia mucilaginosa 10% (10 pessoas, cultivo).',
        source: 'DUNCAN1995 · DOEL2005 · HYDE2014',
        pose: { pos: [-1.8, 9.8, 8.5], tgt: [-2.0, 9.3, 0] },
    },
    glandulas: {
        name: 'Glândulas salivares',
        info: 'Mais de 25% do nitrato circulante é captado e secretado na saliva. Saliva/plasma: ~5× no basal (92,6 vs 17,9 µmol/L) e ~11× depois de 2 mmol de nitrato (1516,7 vs 134 µmol/L).',
        source: 'QIN2012 · MCKNIGHT1997',
        pose: { pos: [0.4, 9.2, 10], tgt: [0.0, 8.7, 0] },
    },
    sialina: {
        name: 'Sialina (SLC17A5)',
        info: 'Cotransportador eletrogênico 2 NO₃⁻/H⁺ na membrana das células acinares das glândulas salivares: é a catraca que tira o nitrato do sangue e o põe na saliva.',
        source: 'QIN2012',
        pose: { pos: [1.9, 9.3, 5], tgt: [1.75, 8.9, 0] },
    },
    esofago: {
        name: 'Esôfago',
        info: 'Só trânsito: o nitrato engolido passa sem ser reduzido, porque o mamífero não tem nitrato-redutase funcional. A conversão depende das bactérias da boca.',
        source: 'HYDE2014 · DUNCAN1995',
        pose: { pos: [0.5, 6.0, 9], tgt: [0.35, 5.6, 0] },
    },
    estomago: {
        name: 'Estômago',
        info: 'Meio ácido (pH < 2): o nitrito da saliva vira NO sem enzima. NO no ar expelido do estômago: 800–6000 ppb, mais de 100× o da boca; −95% depois de omeprazol. Após 2 mmol de nitrato, 14,8 → 89,4 ppm em 60 min.',
        source: 'LUNDBERG1994 · MCKNIGHT1997',
        pose: { pos: [0, 0.4, 10.5], tgt: [-0.3, 0.0, 0] },
    },
    intestino: {
        name: 'Intestino delgado',
        info: 'A absorção é rápida: o nitrato plasmático pica em 1–2 h e volta ao basal em ~24 h. Menos de 0,1% da dose marcada apareceu nas fezes.',
        source: 'JONES2014 · WAGNER1983',
        pose: { pos: [-0.3, -5.6, 11], tgt: [-0.4, -5.9, 0] },
    },
    vasos: {
        name: 'Plasma e vasos',
        info: 'O nitrito plasmático pica em 2–3 h e é o intermediário que vira NO. Mas ele não mede o efeito: o VO₂ seguiu reduzido depois de o nitrito voltar ao basal.',
        source: 'JONES2014 · WYLIE2016DOSE',
        pose: { pos: [2.6, 1.2, 12], tgt: [3.2, 0.8, 0] },
    },
    musculo: {
        name: 'Músculo (quadríceps)',
        info: 'Reservatório: no basal, ~4× o nitrato e ~29× o nitrito do plasma. O nitrato muscular pica em 3 h (181 ± 128 nmol/g); o exercício intenso consome ~39% do estoque elevado.',
        source: 'WYLIE2019 · KADACH2022',
        pose: { pos: [-7.2, -5.9, 11.5], tgt: [-7.2, -6.3, 0] },
    },
    rim: {
        name: 'Rim',
        info: 'Via de saída: ~60% do nitrato marcado (¹⁵N) apareceu na urina em 48 h. A meia-vida do nitrato é de ~5 h.',
        source: 'WAGNER1983',
        pose: { pos: [3.2, 1.2, 8], tgt: [2.6, 1.0, 0] },
    },
    bexiga: {
        name: 'Bexiga',
        info: 'Acumula o nitrato excretado. Urina avermelhada (beterrúria) é fenômeno de minoria, vem do pigmento e não é marcador da dose de nitrato.',
        source: 'WAGNER1983 · WATTS1993',
        pose: { pos: [3.2, -5.9, 7], tgt: [2.7, -6.2, 0] },
    },
};
