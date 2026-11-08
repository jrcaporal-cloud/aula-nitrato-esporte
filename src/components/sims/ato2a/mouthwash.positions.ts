/** Posições do interruptor, na ordem da tela (de cima para baixo). */
export const POSITIONS = [
    { label: 'Água', sub: 'controle', nitrite: 1, banner: 'nitrito sobe e pica em 2–3 h: é a referência' },
    { label: 'Enxaguante antisséptico', sub: 'bloqueio parcial', nitrite: 0.6, banner: 'nitrito: aumento menor · nitrato intacto' },
    { label: 'Clorexidina', sub: 'antibacteriano forte', nitrite: 0.28, banner: 'nitrito: aumento achatado · nitrato intacto' },
    { label: 'Cuspir a saliva', sub: 'durante 3 h, sem produto', nitrite: 0.05, banner: 'sem aumento de nitrito · nitrato igual' },
] as const;
