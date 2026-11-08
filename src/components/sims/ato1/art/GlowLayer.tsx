/** Um ponto de luz: posição em %, cor, raio em px e intensidade (0–1). */
export interface Spot {
    x: number;
    y: number;
    color: string;
    r?: number;
    a?: number;
}

const hex = (a: number) => Math.round(Math.min(Math.max(a, 0), 1) * 255).toString(16).padStart(2, '0');

/** Camada de luz de fundo feita só de gradientes radiais (não cria estouro de caixa, ao contrário de um blur fora da borda). */
export const GlowLayer = ({ spots, className = '' }: { spots: readonly Spot[]; className?: string }) => (
    <span aria-hidden className={`pointer-events-none absolute inset-0 transition-[background] duration-700 ${className}`}
        style={{ background: spots.map(s => `radial-gradient(circle at ${s.x}% ${s.y}%, ${s.color}${hex(s.a ?? 0.3)}, transparent ${s.r ?? 280}px)`).join(',') }} />
);
