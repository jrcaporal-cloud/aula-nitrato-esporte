import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { StructureId } from './content';
import { CAP_X0 } from './layout';
import { armPin, useSelection } from './selection';

/*
 * A parede do vaso é um único casco (arteriola + capilar): quem recebe o ponteiro depende de onde ele
 * bate em x. `lit` vale para cada metade separadamente.
 */

const idAt = (x: number): StructureId => (x < CAP_X0 - 0.4 ? 'arteriola' : 'capilar');

export const useVesselPick = () => {
    const hover = useSelection(s => s.hoverId);
    const pin = useSelection(s => s.pin);
    const active = pin ?? hover;
    const bind = useMemo(() => ({
        onPointerMove: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            useSelection.getState().setHover(idAt(e.point.x));
        },
        onPointerOut: () => {
            const s = useSelection.getState();
            if (s.hoverId === 'arteriola' || s.hoverId === 'capilar') s.setHover(null);
        },
        onPointerDown: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            armPin(idAt(e.point.x));
        },
    }), []);
    return { bind, litArt: active === 'arteriola', litCap: active === 'capilar' };
};
