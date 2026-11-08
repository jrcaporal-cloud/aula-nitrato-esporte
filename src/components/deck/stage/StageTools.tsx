import { Flashlight, PenLine, X } from 'lucide-react';
import { SpotlightLayer } from './SpotlightLayer';
import { LaserPenLayer } from './LaserPenLayer';
import { useStageKeys } from './useStageKeys';
import { PEN_COLORS, useStageTools } from './stageStore';

interface StageToolsProps {
    index: number;
    idle: boolean;
}

/** Indicador discreto (canto superior direito) da ferramenta de palco ligada. */
const ActiveToolBadge = ({ idle }: { idle: boolean }) => {
    const spotlight = useStageTools(s => s.spotlight);
    const pinned = useStageTools(s => s.spotlightPinned);
    const pen = useStageTools(s => s.pen);
    const penColor = useStageTools(s => s.penColor);
    if (!spotlight && !pen) return null;
    return (
        <div
            role="status"
            className={`absolute top-4 right-6 z-30 flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[13px] text-gray-200 transition-opacity duration-500 ${idle ? 'opacity-45' : 'opacity-100'}`}
        >
            {spotlight && (
                <span className="flex items-center gap-1.5">
                    <Flashlight size={14} className="text-amber-200" />
                    Holofote{pinned ? ' fixo' : ''}
                    <kbd className="deck-kbd">L</kbd>
                </span>
            )}
            {spotlight && pen && <span className="w-px h-4 bg-white/15" />}
            {pen && (
                <span className="flex items-center gap-1.5">
                    <PenLine size={14} className="text-gray-300" />
                    Caneta
                    <kbd className="deck-kbd">K</kbd>
                    {PEN_COLORS.map(c => (
                        <button
                            key={c.id}
                            type="button"
                            aria-label={`Caneta ${c.label} (Shift+K alterna)`}
                            title={`Caneta ${c.label} (Shift+K alterna)`}
                            aria-pressed={penColor === c.id}
                            onClick={() => useStageTools.getState().setPenColor(c.id)}
                            className={`w-4 h-4 rounded-full border-2 ${penColor === c.id ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            style={{ background: c.hex }}
                        />
                    ))}
                </span>
            )}
            <button
                type="button"
                aria-label="Desligar ferramentas de palco (Esc)"
                title="Desligar (Esc)"
                onClick={() => useStageTools.getState().allOff()}
                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10"
            >
                <X size={13} />
            </button>
        </div>
    );
};

/** Camadas de palco (holofote + caneta) e o indicador; ligadas pelas teclas L e K. */
export const StageTools = ({ index, idle }: StageToolsProps) => {
    useStageKeys();
    return (
        <>
            <SpotlightLayer />
            <LaserPenLayer index={index} />
            <ActiveToolBadge idle={idle} />
        </>
    );
};

interface ToolButtonProps {
    className: string;
}

/** Botões da barra de navegação para quem usa mouse (estado ligado em destaque). */
export const StageToolButtons = ({ className }: ToolButtonProps) => {
    const spotlight = useStageTools(s => s.spotlight);
    const pen = useStageTools(s => s.pen);
    const on = 'text-amber-200 bg-white/15';
    const off = 'text-gray-300 hover:text-white hover:bg-white/10';
    return (
        <>
            <button
                type="button"
                aria-label="Holofote (L) — roda do mouse muda o tamanho, clique fixa"
                title="Holofote (L) — roda do mouse muda o tamanho, clique fixa"
                aria-pressed={spotlight}
                onClick={() => useStageTools.getState().toggleSpotlight()}
                className={`${className} ${spotlight ? on : off}`}
            >
                <Flashlight size={16} />
            </button>
            <button
                type="button"
                aria-label="Caneta laser (K) — Shift+K troca vermelho/verde"
                title="Caneta laser (K) — Shift+K troca vermelho/verde"
                aria-pressed={pen}
                onClick={() => useStageTools.getState().togglePen()}
                className={`${className} ${pen ? on : off}`}
            >
                <PenLine size={16} />
            </button>
        </>
    );
};
