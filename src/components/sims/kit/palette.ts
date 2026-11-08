/**
 * Linguagem de cor da aula (a mesma no 2D, no 3D e no CSS):
 * magenta = nitrato (NO₃⁻) e beterraba, âmbar = nitrito (NO₂⁻), verde = óxido nítrico (NO),
 * azul = oxigênio/hemoglobina oxigenada, laranja = hipóxia/acidose, violeta = bactérias orais,
 * ardósia = neutro/placebo, vermelho = risco.
 */
export const C = {
    nitrate: '#F0437E',
    nitrateSoft: '#F9A8D4',
    nitrateDeep: '#9D174D',
    nitrite: '#FBBF24',
    nitriteSoft: '#FDE68A',
    no: '#34D399',
    noSoft: '#6EE7B7',
    noDeep: '#047857',
    o2: '#60A5FA',
    o2Soft: '#BFDBFE',
    hypoxia: '#FB923C',
    bacteria: '#A78BFA',
    placebo: '#94A3B8',
    risk: '#F87171',
    ok: '#A3E635',
    text: '#F3F4F6',
    muted: '#9CA3AF',
} as const;

export const PANEL_BG = { background: 'rgba(10,6,14,0.74)' } as const;
