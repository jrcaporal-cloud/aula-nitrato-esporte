import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CultivoView } from './ato6/CultivoView';
import { EliteView, PerKgView, PerShotView } from './ato6/FoodViews';
import { FOOD_SOURCES, FOOD_TABS, START_PLATE, type FoodId, type Plate } from './ato6/foodContent';
import { PlateView } from './ato6/PlateView';
import { FadeSwap, Shell, Story } from './ato6/ui';

/**
 * Slide 80 — Quanto Nitrato tem no Prato? Cinco passos: ranking por quilo (EFSA), gramas de cada vegetal por shot,
 * o prato montado com sliders (mmol e mg), o peso do cultivo (alface SP, rúcula RS) e o que o atleta de elite realmente come.
 */
const FoodNitrateSim = () => {
    const { step, setStep } = useSlideSteps(FOOD_TABS.length);
    const [plate, setPlate] = useState<Plate>(START_PLATE);
    const setGrams = (id: FoodId, grams: number) => setPlate(prev => ({ ...prev, [id]: grams }));

    const stories = [
        { kicker: 'por quilo', color: C.nitrate, title: 'A beterraba não é a campeã', text: 'No levantamento europeu, a mediana da rúcula passa de 4.800 mg/kg; a raiz da beterraba fica em 1.100. O nome do suco não diz onde está o nitrato.', source: FOOD_SOURCES.kg },
        { kicker: 'um shot em gramas', color: C.o2, title: 'Mesma dose, pratos muito diferentes', text: 'Para chegar ao nitrato de um shot, bastam uns 83 g de rúcula; de espinafre, meio quilo. Dose se conta em mmol, não em “porções”.', source: FOOD_SOURCES.shot },
        { kicker: 'seu prato', color: C.no, title: 'Monte a salada, leia o mmol', text: 'Arraste os gramas: o prato inicial (60 g de rúcula + 100 g de beterraba) fecha cerca de 1 shot. A conta usa medianas; o prato real varia.', source: FOOD_SOURCES.plate },
        { kicker: 'cultivo', color: C.hypoxia, title: 'O mesmo pé, de 565 a 3.093 mg/kg', text: 'Alface da mesma semente e colheita muda 5,5× conforme o sistema de cultivo. Variedade, estação e hidroponia pesam tanto quanto a espécie.', source: FOOD_SOURCES.cultivo },
        { kicker: 'o atleta de elite', color: C.nitrite, title: 'A dieta habitual não chega lá', text: 'Atletas muito treinados comem em mediana 106 mg/dia, cerca de 1,7 mmol. A dose esportiva é de 5 a 16 mmol: é outra ordem de grandeza.', source: FOOD_SOURCES.elite },
    ] as const;
    const s = stories[step];
    const visual = [<PerKgView />, <PerShotView />, <PlateView plate={plate} onChange={setGrams} />, <CultivoView />, <EliteView />][step];

    return (
        <Shell tabs={FOOD_TABS} step={step} setStep={setStep} layoutId="food-tabs">
            <Story id={step} width={330} {...s} />
            <FadeSwap id={step} className="flex min-w-0 flex-1">{visual}</FadeSwap>
        </Shell>
    );
};

export default FoodNitrateSim;
