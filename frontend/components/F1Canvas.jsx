import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function F1CarPlaceholder() {
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Chassis */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1, 0.5, 3]} />
                <meshStandardMaterial color="#E10600" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Front Wing */}
            <mesh position={[0, 0.3, 1.8]}>
                <boxGeometry args={[1.5, 0.1, 0.5]} />
                <meshStandardMaterial color="#1E1E1E" />
            </mesh>
            {/* Rear Wing */}
            <mesh position={[0, 1, -1.3]}>
                <boxGeometry args={[1.2, 0.1, 0.5]} />
                <meshStandardMaterial color="#1E1E1E" />
            </mesh>
            {/* Wheels */}
            <mesh position={[0.8, 0.4, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
                <meshStandardMaterial color="#0F0F0F" />
            </mesh>
            <mesh position={[-0.8, 0.4, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
                <meshStandardMaterial color="#0F0F0F" />
            </mesh>
            <mesh position={[0.8, 0.4, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
                <meshStandardMaterial color="#0F0F0F" />
            </mesh>
            <mesh position={[-0.8, 0.4, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
                <meshStandardMaterial color="#0F0F0F" />
            </mesh>
        </group>
    );
}

function Particles() {
    const count = 500;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = Math.random() * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, [count]);

    const pointsRef = useRef();

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#E10600" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

export default function F1Canvas() {
    return (
        <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#E10600" />
            <F1CarPlaceholder />
            <Particles />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
    );
}
