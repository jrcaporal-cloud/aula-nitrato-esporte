import type { ReactNode } from 'react';
import { C } from '../kit/palette';
import { Hl } from './ui';

export interface EnteroStep {
    tab: string;
    headline: string;
    text: ReactNode;
    source: string;
    /** Legenda no centro do circuito. */
    caption: string;
    captionColor: string;
}

export const ENTERO_STEPS: readonly EnteroStep[] = [
    {
        tab: 'Absorção', caption: 'absorção no intestino', captionColor: C.nitrateSoft,
        headline: 'Engolir é só o começo',
        text: <>O <Hl c={C.nitrate}>nitrato</Hl> desce pelo estômago e é absorvido no intestino: menos de 0,1% da dose vai para as fezes. No plasma, ele pica em 1–2 h.</>,
        source: 'Wagner 1983 (¹⁵N, 12 adultos) · Jones 2014 (Sports Med)',
    },
    {
        tab: 'Sialina', caption: 'a saliva cobra o pedágio', captionColor: C.nitrate,
        headline: 'A saliva cobra um pedágio',
        text: <>As glândulas salivares retiram cerca de <Hl c={C.nitrate}>25%</Hl> do nitrato que circula, com um transportador, a sialina, que troca 2 NO₃⁻ por 1 H⁺. O resto segue para o rim e para o músculo.</>,
        source: 'Qin 2012 (PNAS) · Jones 2014',
    },
    {
        tab: 'Saliva', caption: 'saliva ≈ 5× → 11× o plasma', captionColor: C.nitrate,
        headline: 'A boca recebe o nitrato de volta, concentrado',
        text: <>Em 10 voluntários, a saliva tinha <Hl c={C.nitrate}>~5×</Hl> o nitrato do plasma em jejum e <Hl c={C.nitrate}>~11×</Hl> depois de uma carga de 2 mmol.</>,
        source: 'McKnight 1997 (Gut) · KNO₃ 2 mmol vs KCl, n = 10',
    },
    {
        tab: 'Língua', caption: 'bactérias: nitrato → nitrito', captionColor: C.bacteria,
        headline: 'A língua faz o que o corpo não sabe',
        text: <>O mamífero não tem a enzima: quem reduz o nitrato a <Hl c={C.nitrite}>nitrito</Hl> são <Hl c={C.bacteria}>bactérias</Hl> do dorso da língua. No rato sem bactérias (germ-free), a etapa simplesmente não acontece.</>,
        source: 'Duncan 1995 (Nat Med) · Doel 2005 (n = 10) · Hyde 2014',
    },
    {
        tab: 'Estômago', caption: 'ácido gástrico: nitrito → NO', captionColor: C.no,
        headline: 'No estômago, o ácido faz o resto',
        text: <>O nitrito engolido encontra o ácido e vira <Hl c={C.no}>NO</Hl> no próprio lúmen: de 14,8 para 89,4 ppm em 60 min. O omeprazol corta essa produção em 95%.</>,
        source: 'McKnight 1997 · Lundberg 1994 (Gut)',
    },
    {
        tab: 'Sangue', caption: 'o circuito fecha no sangue', captionColor: C.nitrite,
        headline: 'O circuito fecha no sangue',
        text: <>O <Hl c={C.nitrite}>nitrito</Hl> absorvido pica no plasma em 2–3 h e vira NO onde falta O₂. Quem não engole a saliva após a dose não ganha o aumento de nitrito: a via passa obrigatoriamente pela boca.</>,
        source: 'Lundberg & Govoni 2004 (Free Radic Biol Med) · Jones 2014',
    },
];
