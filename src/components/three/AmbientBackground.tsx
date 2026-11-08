import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useStore } from '../../store/useStore';
import { ANIMATED_BACKGROUND_SLIDES } from '../deck/slides';
import { rng } from './shared/math';

const NITRATE_COUNT = 40;
const NITRITE_COUNT = 18;
const NO_COUNT = 150;
const FIELD = { x: 34, y: 20, z: 26 };

/** NO₃⁻ esquemático: nitrogênio central e três oxigênios a 120°, num plano (trigonal plano). */
const makeNitrateGeometry = () => {
    const parts: THREE.BufferGeometry[] = [new THREE.SphereGeometry(0.4, 16, 12)];
    for (let k = 0; k < 3; k++) {
        const a = (k * 2 * Math.PI) / 3 + Math.PI / 2;
        const o = new THREE.SphereGeometry(0.5, 16, 12);
        o.translate(Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0);
        parts.push(o);
    }
    const geo = mergeGeometries(parts);
    geo.computeVertexNormals();
    return geo;
};

/** NO₂⁻ esquemático: angular (~115°), dois oxigênios — perdeu um O na boca. */
const makeNitriteGeometry = () => {
    const parts: THREE.BufferGeometry[] = [new THREE.SphereGeometry(0.4, 16, 12)];
    for (const deg of [90 + 57.5, 90 - 57.5]) {
        const a = (deg * Math.PI) / 180;
        const o = new THREE.SphereGeometry(0.5, 16, 12);
        o.translate(Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0);
        parts.push(o);
    }
    const geo = mergeGeometries(parts);
    geo.computeVertexNormals();
    return geo;
};

interface Drifter {
    pos: THREE.Vector3;
    rot: THREE.Euler;
    spin: THREE.Vector3;
    speed: number;
    scale: number;
}

const makeDrifters = (count: number, seed: number, speed: [number, number], scale: [number, number]): Drifter[] => {
    const rand = rng(seed);
    return Array.from({ length: count }, () => ({
        pos: new THREE.Vector3((rand() - 0.5) * FIELD.x * 2, (rand() - 0.5) * FIELD.y * 2, -rand() * FIELD.z - 4),
        rot: new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI),
        spin: new THREE.Vector3((rand() - 0.5) * 0.4, (rand() - 0.5) * 0.4, (rand() - 0.5) * 0.3),
        speed: speed[0] + rand() * (speed[1] - speed[0]),
        scale: scale[0] + rand() * (scale[1] - scale[0]),
    }));
};

interface IonsProps {
    geometry: THREE.BufferGeometry;
    count: number;
    seed: number;
    scale: [number, number];
    color: string;
    emissive: string;
}

/** Íons derivando devagar da esquerda para a direita (instanciados: um desenho só por espécie). */
const Ions = ({ geometry, count, seed, scale, color, emissive }: IonsProps) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const ions = useMemo(() => makeDrifters(count, seed, [0.35, 0.9], scale), [count, seed, scale]);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;
        const dt = Math.min(delta, 0.05);
        ions.forEach((c, i) => {
            c.pos.x += c.speed * dt;
            c.pos.y += Math.sin(c.pos.x * 0.15 + i) * 0.1 * dt;
            if (c.pos.x > FIELD.x) c.pos.x = -FIELD.x;
            c.rot.x += c.spin.x * dt;
            c.rot.y += c.spin.y * dt;
            c.rot.z += c.spin.z * dt;
            dummy.position.copy(c.pos);
            dummy.rotation.copy(c.rot);
            dummy.scale.setScalar(c.scale);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
            <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.6} roughness={0.35} metalness={0.1} />
        </instancedMesh>
    );
};

const NITRATE_SCALE: [number, number] = [0.55, 1.1];
const NITRITE_SCALE: [number, number] = [0.45, 0.85];

/** Óxido nítrico (verde): pontos pequenos e rápidos, como faíscas — o gás que sinaliza. */
const NitricOxide = () => {
    const ref = useRef<THREE.Points>(null);
    const drifters = useMemo(() => makeDrifters(NO_COUNT, 13, [1.2, 2.6], [1, 1]), []);
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NO_COUNT * 3), 3));
        return geo;
    }, []);
    useFrame((_, delta) => {
        const attr = ref.current?.geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
        if (!attr) return;
        const dt = Math.min(delta, 0.05);
        drifters.forEach((p, i) => {
            p.pos.x += p.speed * dt;
            p.pos.y += Math.sin(p.pos.x * 0.3 + i * 1.7) * 0.25 * dt;
            if (p.pos.x > FIELD.x) p.pos.x = -FIELD.x;
            attr.setXYZ(i, p.pos.x, p.pos.y, p.pos.z);
        });
        attr.needsUpdate = true;
    });
    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial size={0.16} color="#34d399" transparent opacity={0.7} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
};

/** Parallax suave com o mouse + leve aproximação ao avançar na aula. */
const CameraDrift = () => {
    const slide = useStore(s => s.currentSlide);
    const target = useRef(new THREE.Vector3());
    useFrame(({ camera, pointer }, delta) => {
        target.current.set(pointer.x * 1.6, pointer.y * 1.0, 16 - Math.min(slide, 40) * 0.08);
        camera.position.lerp(target.current, Math.min(delta * 1.5, 1));
        camera.lookAt(0, 0, -10);
    });
    return null;
};

/**
 * Fundo 3D da aula: nitrato (magenta), nitrito (âmbar) e faíscas de NO (verde) derivando —
 * a via inteira da aula, a baixo custo (três desenhos instanciados, sem pós-processamento);
 * fica atenuado nos slides de conteúdo.
 */
export const AmbientBackground = () => {
    const nitrate = useMemo(() => makeNitrateGeometry(), []);
    const nitrite = useMemo(() => makeNitriteGeometry(), []);
    const slide = useStore(s => s.currentSlide);
    const modalOpen = useStore(s => s.modalOpen);
    const isHero = slide === 0;

    return (
        <div
            aria-hidden
            className="absolute inset-0 z-0 transition-opacity duration-1000"
            style={{ opacity: isHero ? 0.95 : 0.4 }}
        >
            <Canvas
                dpr={[1, 1.5]}
                frameloop={modalOpen ? 'never' : ANIMATED_BACKGROUND_SLIDES.has(slide) ? 'always' : 'demand'}
                camera={{ position: [0, 0, 16], fov: 50 }}
                gl={{ antialias: true, powerPreference: 'low-power' }}
            >
                <color attach="background" args={['#07050B']} />
                <fog attach="fog" args={['#07050B', 14, 46]} />
                <ambientLight intensity={0.35} color="#3b1530" />
                <directionalLight position={[8, 10, 12]} intensity={1.3} color="#fce7f3" />
                <pointLight position={[-12, -4, 4]} intensity={2.2} distance={40} color="#34d399" />
                <CameraDrift />
                <Ions geometry={nitrate} count={NITRATE_COUNT} seed={7} scale={NITRATE_SCALE} color="#9d174d" emissive="#5b0b2e" />
                <Ions geometry={nitrite} count={NITRITE_COUNT} seed={29} scale={NITRITE_SCALE} color="#b45309" emissive="#5c2a04" />
                <NitricOxide />
            </Canvas>
            {/* Vinheta: garante contraste do texto sobre o fundo animado. */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,5,11,0.55)_60%,rgba(7,5,11,0.92)_100%)]" />
        </div>
    );
};
