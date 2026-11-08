import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { fitPose, type Pose } from './layout';

/*
 * Quem manda na câmera: a cada troca de etapa ou "Recentrar", um voo curto (arco suave) da posição
 * atual até a pose da etapa. O toque do usuário no canvas interrompe o voo e devolve a órbita.
 * A etapa só "assenta" (e os rótulos aparecem) quando o voo termina.
 */

interface Flight { active: boolean; u: number; fromP: THREE.Vector3; fromT: THREE.Vector3; toP: THREE.Vector3; toT: THREE.Vector3; lift: number }

interface Props {
    step: number;
    pose: Pose;
    recenterKey: number;
    reduced: boolean;
    onSettled: (step: number) => void;
}

export const CameraDirector = ({ step, pose, recenterKey, reduced, onSettled }: Props) => {
    const get = useThree(s => s.get);
    const gl = useThree(s => s.gl);
    const controls = useThree(s => s.controls) as OrbitControlsImpl | null;
    const flightRef = useRef<Flight>({
        active: false, u: 0, fromP: new THREE.Vector3(), fromT: new THREE.Vector3(), toP: new THREE.Vector3(), toT: new THREE.Vector3(), lift: 0,
    });
    const first = useRef(true);
    const pending = useRef<number | null>(null);

    useEffect(() => {
        const el = gl.domElement;
        const stop = () => {
            const flight = flightRef.current;
            if (!flight.active) return;
            flight.active = false;
            if (pending.current !== null) { onSettled(pending.current); pending.current = null; }
        };
        el.addEventListener('pointerdown', stop);
        el.addEventListener('wheel', stop, { passive: true });
        return () => { el.removeEventListener('pointerdown', stop); el.removeEventListener('wheel', stop); };
    }, [gl, onSettled]);

    useEffect(() => {
        if (!controls) return;
        const { camera, size } = get();
        const goal = fitPose(pose, size.width / size.height);
        const flight = flightRef.current;
        if (first.current) {
            first.current = false;
            camera.position.set(...goal.pos);
            controls.target.set(...goal.tgt);
            controls.update();
            onSettled(step);
            return;
        }
        flight.fromP.copy(camera.position);
        flight.fromT.copy(controls.target);
        flight.toP.set(...goal.pos);
        flight.toT.set(...goal.tgt);
        flight.lift = 0.1 * flight.fromP.distanceTo(flight.toP);
        flight.u = 0;
        flight.active = true;
        pending.current = step;
        const anim = gsap.to(flight, {
            u: 1,
            duration: reduced ? 0.3 : 1.8,
            ease: 'power2.inOut',
            onComplete: () => {
                flight.active = false;
                if (pending.current !== null) { onSettled(pending.current); pending.current = null; }
            },
        });
        return () => { anim.kill(); };
    }, [step, pose, recenterKey, controls, get, reduced, onSettled]);

    useFrame(({ camera }) => {
        const flight = flightRef.current;
        if (!controls || !flight.active) return;
        const u = flight.u;
        camera.position.lerpVectors(flight.fromP, flight.toP, u);
        camera.position.y += Math.sin(Math.PI * u) * flight.lift * 0.35;
        controls.target.lerpVectors(flight.fromT, flight.toT, u);
        controls.update();
    });

    return null;
};
