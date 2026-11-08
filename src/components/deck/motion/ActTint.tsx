import { useStore } from '../../../store/useStore';
import { ACTS, actOf } from './acts';

/**
 * Brilho de cor do ato por cima do fundo 3D: seis camadas fixas, só a do ato atual acesa,
 * trocando por opacidade (compositor) — funciona mesmo com o fundo congelado nos slides comuns.
 * Fica nas bordas (canto superior esquerdo e inferior direito) e fraco: não baixa o contraste do texto.
 */
export const ActTint = () => {
    const slide = useStore(s => s.currentSlide);
    const act = actOf(slide);
    return (
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
            {ACTS.map((a, i) => (
                <div
                    key={a.numeral}
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(ellipse 55% 45% at 8% 0%, ${a.color}21 0%, transparent 72%), radial-gradient(ellipse 60% 50% at 96% 100%, ${a.colorB}1f 0%, transparent 72%)`,
                        opacity: act === i ? 1 : 0,
                        transition: 'opacity 1200ms ease',
                    }}
                />
            ))}
        </div>
    );
};
