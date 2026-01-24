"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

function Branch({ position, rotation, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], scale?: number }) {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* The branch mesh */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.1, 0.2, 4]} />
                <meshStandardMaterial color="#78350f" />
            </mesh>
            {/* Leaves cluster */}
            <mesh position={[0, 4, 0]}>
                <dodecahedronGeometry args={[1.5]} />
                <meshStandardMaterial color="#fbbf24" transparent opacity={0.8} emissive="#fbbf24" emissiveIntensity={0.2} />
            </mesh>
        </group>
    );
}

export default function LegacyTreeScene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Main Trunk */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.8, 4]} />
                <meshStandardMaterial color="#451a03" />
            </mesh>

            {/* Branches */}
            <Branch position={[0, 2, 0]} rotation={[0, 0, 0.5]} scale={0.8} />
            <Branch position={[0, 2, 0]} rotation={[0, Math.PI / 1.5, 0.5]} scale={0.8} />
            <Branch position={[0, 2, 0]} rotation={[0, -Math.PI / 1.5, 0.5]} scale={0.8} />

            {/* Magic Particles (Knowledge Spores) */}
            <Sparkles count={100} scale={10} size={4} speed={0.4} opacity={0.5} color="#fbbf24" />

            {/* Roots */}
            <mesh position={[0, -2, 0]} rotation={[Math.PI, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.8, 2]} />
                <meshStandardMaterial color="#451a03" />
            </mesh>
        </group>
    );
}
