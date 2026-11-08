import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { FOOD_SOURCES, FOOD_TABS, START_PLATE, type FoodId, type Plate } from './ato6/foodContent';
import { FoodCultivoArt } from './ato6/arte-a/FoodCultivoArt';
import { FoodEliteArt } from './ato6/arte-a/FoodEliteArt';
import { FoodKgArt } from './ato6/arte-a/FoodKgArt';
import { FoodPlateArt } from './ato6/arte-a/FoodPlateArt';
import { FoodShotArt } from './ato6/arte-a/FoodShotArt';
import { FadeSwap, Shell, Story } from './ato6/ui';

/**
 * Slide 44 — Quanto Nitrato tem no Prato? Cinco passos, todos em arte: tubos por quilo (EFSA), pratos de 1 shot em gramas,
 * o prato dividido com sliders, potes de cultivo (alface SP, rúcula RS) e a dieta do atleta de elite contra a dose esportiva.
 * Hortaliças em formas geométricas; o nitrato é sempre o líquido magenta.
 */
const FoodNitrateSim = () => {
    const { step, setStep } = useSlideSteps(FOOD_TABS.length);
    const [plate, setPlate] = useState<Plate>(START_PLATE);
    const setGrams = (id: FoodId, grams: number) => setPlate(prev => ({ ...prev, [id]: grams }));

    const stories = [
        { kicker: 'por quilo', color: C.nitrate, title: 'A beterraba não é a campeã', text: 'Na Europa, a mediana da rúcula passa de 4.800 mg/kg; a raiz da beterraba fica em 1.100.', source: FOOD_SOURCES.kg },
        { kicker: 'um shot em gramas', color: C.o2, title: 'Mesma dose, pratos muito diferentes', text: 'Um shot são uns 83 g de rúcula ou meio quilo de espinafre. Dose se conta em mmol, não em “porções”.', source: FOOD_SOURCES.shot },
        { kicker: 'seu prato', color: C.no, title: 'Monte a salada, leia o mmol', text: 'Arraste os gramas: 60 g de rúcula + 100 g de beterraba fecham cerca de 1 shot. Medianas; o prato real varia.', source: FOOD_SOURCES.plate },
        { kicker: 'cultivo', color: C.hypoxia, title: 'O mesmo pé, de 565 a 3.093 mg/kg', text: 'Alface da mesma semente e colheita muda 5,5× conforme o cultivo. Variedade, estação e hidroponia pesam como a espécie.', source: FOOD_SOURCES.cultivo },
        { kicker: 'o atleta de elite', color: C.nitrite, title: 'A dieta habitual não chega lá', text: 'Atletas muito treinados comem em mediana 106 mg/dia (≈ 1,7 mmol). A dose esportiva é de 5 a 16 mmol.', source: FOOD_SOURCES.elite },
    ] as const;
    const visual = [<FoodKgArt />, <FoodShotArt />, <FoodPlateArt plate={plate} onChange={setGrams} />, <FoodCultivoArt />, <FoodEliteArt />][step];

    return (
        <Shell tabs={FOOD_TABS} step={step} setStep={setStep} layoutId="food-tabs">
            <Story id={step} width={284} {...stories[step]} />
            <FadeSwap id={step} className="flex min-w-0 flex-1">{visual}</FadeSwap>
        </Shell>
    );
};

export default FoodNitrateSim;
