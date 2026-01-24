"use client";

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Plant Component
function Plant({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
    const meshRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position} scale={hovered ? scale * 1.2 : scale} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
                {/* Stem */}
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
                    <meshStandardMaterial color="#4ade80" />
                </mesh>
                {/* Leaves */}
                <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, -0.5]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[-0.2, 0.6, 0.2]} rotation={[0, 0, 0.5]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                {/* Fruit/Flower */}
                <mesh position={[0, 1.1, 0]}>
                    <dodecahedronGeometry args={[0.2]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
                </mesh>
            </group>
        </Float>
    );
}

export default function KnowledgeGardenScene() {
    // Generate some random positions
    const plants = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        position: [
            (Math.random() - 0.5) * 10,
            0,
            (Math.random() - 0.5) * 10
        ] as [number, number, number],
        color: ['#06b6d4', '#8b5cf6', '#ef4444', '#f59e0b'][Math.floor(Math.random() * 4)],
        scale: 0.5 + Math.random() * 1
    }));

    return (
        <group>
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>

            {/* Grid Helper for structure */}
            <gridHelper args={[20, 20, '#334155', '#1e293b']} position={[0, 0.01, 0]} />

            {/* Plants */}
            {plants.map(plant => (
                <Plant key={plant.id} position={plant.position} color={plant.color} scale={plant.scale} />
            ))}
        </group>
    );
}
