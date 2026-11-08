import { useEffect, useRef } from 'react';
import { C } from '../../sims/kit/palette';
import type { IonSpecies } from './ionPath';

/** Desenho 2D do íon (100 × 100 px; quem usa escala por transform). Mesmo desenho do fundo 3D. */
export const GLYPH_PX = 100;

const COLOR: Record<IonSpecies, { o: string; soft: string }> = {
    nitrate: { o: C.nitrate, soft: C.nitrateSoft },
    nitrite: { o: C.nitrite, soft: C.nitriteSoft },
    no: { o: C.no, soft: C.noSoft },
};

/**
 * Três "vagas" de oxigênio ao redor do N. NO₃⁻ trigonal plano (120°), NO₂⁻ angular (~115°,
 * perdeu um O na boca), NO diatômico (um O só). A troca de espécie é uma transição CSS de
 * transform/opacity/fill: os oxigênios giram para o novo lugar e o que sobra se apaga.
 */
const SLOTS: Record<IonSpecies, ReadonlyArray<{ angle: number; on: boolean }>> = {
    nitrate: [{ angle: -150, on: true }, { angle: -30, on: true }, { angle: 90, on: true }],
    nitrite: [{ angle: -147.5, on: true }, { angle: -32.5, on: true }, { angle: 90, on: false }],
    no: [{ angle: -180, on: false }, { angle: 0, on: true }, { angle: 90, on: false }],
};

const BOND = 26;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const MORPH = `transform 560ms ${EASE}, opacity 420ms ease, fill 460ms ease`;
const SPECIES: readonly IonSpecies[] = ['nitrate', 'nitrite', 'no'];

interface IonGlyphProps {
    species: IonSpecies;
    reduced: boolean;
}

export const IonGlyph = ({ species, reduced }: IonGlyphProps) => {
    const spinRef = useRef<SVGSVGElement>(null);
    const bobRef = useRef<HTMLDivElement>(null);
    const { o, soft } = COLOR[species];
    const shift = species === 'no' ? -BOND / 2 : 0;

    // Giro lento e flutuação: animações do compositor (Web Animations), sem custo por quadro no JS.
    useEffect(() => {
        if (reduced) return;
        const spin = spinRef.current?.animate(
            [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
            { duration: 36000, iterations: Infinity }
        );
        const bob = bobRef.current?.animate(
            [{ transform: 'translateY(0px)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0px)' }],
            { duration: 3400, iterations: Infinity, easing: 'ease-in-out' }
        );
        return () => { spin?.cancel(); bob?.cancel(); };
    }, [reduced]);

    return (
        <div ref={bobRef} className="relative" style={{ width: GLYPH_PX, height: GLYPH_PX }}>
            {SPECIES.map(sp => (
                <div
                    key={sp}
                    className="absolute rounded-full"
                    style={{
                        inset: -26,
                        background: `radial-gradient(circle, ${COLOR[sp].o}66 0%, ${COLOR[sp].o}22 38%, transparent 66%)`,
                        opacity: sp === species ? 1 : 0,
                        transition: 'opacity 460ms ease',
                    }}
                />
            ))}
            <svg ref={spinRef} viewBox="-50 -50 100 100" width={GLYPH_PX} height={GLYPH_PX} className="relative overflow-visible">
                <g style={{ transform: `translateX(${shift}px)`, transition: MORPH }}>
                    {SLOTS[species].map((slot, i) => (
                        <g key={i} style={{ transform: `rotate(${slot.angle}deg)`, opacity: slot.on ? 1 : 0, transition: MORPH }}>
                            <rect x={0} y={-2.5} width={BOND} height={5} rx={2.5} style={{ fill: soft, transition: MORPH }} opacity={0.75} />
                            <g style={{ transform: `translateX(${BOND}px) scale(${slot.on ? 1 : 0.4})`, transition: MORPH }}>
                                <circle r={13} style={{ fill: o, transition: MORPH }} />
                                <circle cx={-4} cy={-4} r={4.5} fill="#ffffff" opacity={0.4} />
                            </g>
                        </g>
                    ))}
                    <circle r={10.5} style={{ fill: soft, transition: MORPH }} stroke="#ffffff" strokeOpacity={0.5} strokeWidth={1.5} />
                </g>
            </svg>
        </div>
    );
};
