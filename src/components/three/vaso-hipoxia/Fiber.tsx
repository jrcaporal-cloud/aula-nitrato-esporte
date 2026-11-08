import { FiberBody } from './FiberBody';
import { FiberSites } from './FiberSites';
import { FIB_R, FIB_Y, MITOCHONDRIA, MYOFIBRILS, NUCLEI } from './layout';
import type { CtlRef, SimRef } from './types';

/* A fibra rápida em corte: miofibrilas estriadas ao fundo, organelas e (na parte aberta) mioglobina e XOR. */

export const Fiber = ({ simRef, ctlRef }: { simRef: SimRef; ctlRef: CtlRef }) => (
    <group>
        <FiberBody simRef={simRef} id="fibra" cy={FIB_Y} r={FIB_R} fibrils={MYOFIBRILS} mito={MITOCHONDRIA} nuclei={NUCLEI} fibrilR={0.28} />
        <FiberSites simRef={simRef} ctlRef={ctlRef} />
    </group>
);
