import { Clock, Gauge, Repeat, ScanSearch, Tag, Timer } from 'lucide-react';
import type { ComponentType } from 'react';

/** Ícone e rótulo curto de cada uma das seis mensagens (slide 88). */
export type KitIcon = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

export const KIT: Readonly<Record<number, { icon: KitIcon; label: string }>> = {
    1: { icon: Timer, label: 'o 16%' },
    2: { icon: Gauge, label: 'o preparo' },
    3: { icon: Clock, label: 'dose e hora' },
    4: { icon: Tag, label: 'mmol e rótulo' },
    5: { icon: Repeat, label: 'respondedor' },
    6: { icon: ScanSearch, label: 'lacunas' },
};

