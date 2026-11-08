import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { fitPose, type Pose } from './layout';

/*
 * Quem manda na câmera. Ao abrir, a câmera vem de longe (do músculo) até o sarcômero. A cada troca de
 * etapa ou "Recentrar", um voo com recuo no meio (afasta, atravessa, aproxima) até a pose da etapa. Em
 * repouso, uma deriva lenta (câmera e alvo juntos) dá paralaxe entre as camadas. O toque do usuário no
 * canvas interrompe o voo; a etapa só "assenta" (e os rótulos aparecem) quando o voo termina.
 */

interface Flight { active: boolean; u: number; fromP: THREE.Vector3; fromT: THREE.Vector3; toP: THREE.Vector3; toT: THREE.Vector3; pull: number }

interface Props {
    step: number;
    pose: Pose;
    recenterKey: number;
    reduced: boolean;
    onSettled: (step: number) => void;
}

const BACK = new THREE.Vector3();
const SWAY = new THREE.Vector3();
const RIGHT = new THREE.Vector3();
const UPV = new THREE.Vector3();

export const CameraDirector = ({ step, pose, recenterKey, reduced, onSettled }: Props) => {
    const get = useThree(s => s.get);
    const gl = useThree(s => s.gl);
    const controls = useThree(s => s.controls) as OrbitControlsImpl | null;
    const flightRef = useRef<Flight>({
        active: false, u: 0, fromP: new THREE.Vector3(), fromT: new THREE.Vector3(), toP: new THREE.Vector3(), toT: new THREE.Vector3(), pull: 0,
    });
    const swayRef = useRef({ off: new THREE.Vector3(), amp: 0, held: false });
    const first = useRef(true);
    const pending = useRef<number | null>(null);

    useEffect(() => {
        const el = gl.domElement;
        const stop = () => {
            swayRef.current.held = true;
            const flight = flightRef.current;
            if (!flight.active) return;
            flight.active = false;
            if (pending.current !== null) { onSettled(pending.current); pending.current = null; }
        };
        const release = () => { swayRef.current.held = false; };
        el.addEventListener('pointerdown', stop);
        el.addEventListener('wheel', stop, { passive: true });
        window.addEventListener('pointerup', release);
        return () => { el.removeEventListener('pointerdown', stop); el.removeEventListener('wheel', stop); window.removeEventListener('pointerup', release); };
    }, [gl, onSettled]);

    useEffect(() => {
        if (!controls) return;
        const { camera, size } = get();
        const goal = fitPose(pose, size.width / size.height, size.height);
        const flight = flightRef.current;
        const sway = swayRef.current;
        // tira a deriva antes de medir de onde o voo parte
        camera.position.sub(sway.off);
        controls.target.sub(sway.off);
        sway.off.set(0, 0, 0);
        sway.amp = 0;
        const isFirst = first.current;
        first.current = false;
        if (isFirst && reduced) {
            camera.position.set(...goal.pos);
            controls.target.set(...goal.tgt);
            controls.update();
            onSettled(step);
            return;
        }
        if (isFirst) {
            // abertura: do músculo inteiro (longe, alto) até o sarcômero
            const [px, py, pz] = goal.pos;
            const [tx, ty, tz] = goal.tgt;
            flight.fromP.set(tx + (px - tx) * 3.4 - 2, ty + (py - ty) * 3.4 + 2.5, tz + (pz - tz) * 3.4);
            flight.fromT.set(tx - 1.5, ty + 0.4, tz);
            camera.position.copy(flight.fromP);
            controls.target.copy(flight.fromT);
        } else {
            flight.fromP.copy(camera.position);
            flight.fromT.copy(controls.target);
        }
        flight.toP.set(...goal.pos);
        flight.toT.set(...goal.tgt);
        const dist = flight.fromP.distanceTo(flight.toP);
        flight.pull = isFirst ? 0 : Math.min(0.32 * dist, 9);
        flight.u = 0;
        flight.active = true;
        pending.current = step;
        const anim = gsap.to(flight, {
            u: 1,
            duration: reduced ? 0.3 : isFirst ? 2.6 : dist > 12 ? 2.6 : 1.8,
            ease: isFirst ? 'power3.out' : 'power2.inOut',
            onComplete: () => {
                flight.active = false;
                if (pending.current !== null) { onSettled(pending.current); pending.current = null; }
            },
        });
        return () => { anim.kill(); };
    }, [step, pose, recenterKey, controls, get, reduced, onSettled]);

    useFrame(({ camera, clock }, dt) => {
        const flight = flightRef.current;
        const sway = swayRef.current;
        if (!controls) return;
        if (flight.active) {
            const u = flight.u;
            camera.position.lerpVectors(flight.fromP, flight.toP, u);
            controls.target.lerpVectors(flight.fromT, flight.toT, u);
            // recuo no meio do voo: afasta da cena ao longo da linha de visada, sobe um pouco, e volta
            const k = Math.sin(Math.PI * u);
            BACK.subVectors(camera.position, controls.target).normalize().multiplyScalar(flight.pull * k);
            camera.position.add(BACK);
            camera.position.y += k * flight.pull * 0.25;
            controls.update();
            return;
        }
        if (reduced) return;
        // deriva de repouso: entra devagar, some enquanto o usuário arrasta
        sway.amp += ((sway.held ? 0 : 1) - sway.amp) * (1 - Math.exp(-0.8 * dt));
        const t = clock.elapsedTime;
        const d = camera.position.distanceTo(controls.target);
        RIGHT.setFromMatrixColumn(camera.matrixWorld, 0);
        UPV.setFromMatrixColumn(camera.matrixWorld, 1);
        SWAY.copy(RIGHT).multiplyScalar(Math.sin(t * 0.23) * 0.028 * d * sway.amp)
            .addScaledVector(UPV, Math.sin(t * 0.17 + 1.3) * 0.014 * d * sway.amp);
        camera.position.sub(sway.off).add(SWAY);
        controls.target.sub(sway.off).add(SWAY);
        sway.off.copy(SWAY);
        controls.update();
    });

    return null;
};
