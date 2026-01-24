"use client";

import React, { useState } from 'react';
import { Float, Text } from '@react-three/drei';

function BridgeBlock({ position, delay }: { position: [number, number, number], delay: number }) {
    const [hovered, setHovered] = useState(false);

    return (
        <mesh
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            castShadow
            receiveShadow
        >
            <boxGeometry args={[1.8, 0.5, 3]} />
            <meshStandardMaterial
                color={hovered ? '#6366f1' : '#475569'}
                emissive={hovered ? '#6366f1' : '#000000'}
                emissiveIntensity={0.5}
            />
        </mesh>
    );
}

export default function WisdomBridgeScene() {
    // Blocks forming a bridge
    const blocks = [
        { pos: [-4, 0, 0] },
        { pos: [-2, 0.5, 0] },
        { pos: [0, 1, 0] },
        { pos: [2, 0.5, 0] },
        { pos: [4, 0, 0] },
    ];

    return (
        <group>
            {/* Void/Water below */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="#0f172a" transparent opacity={0.8} />
            </mesh>

            {/* Bridge Info Text */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <Text
                    position={[0, 4, 0]}
                    fontSize={1}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    FRESHMAN  {`->`}  ALUMNI
                </Text>
            </Float>

            {/* The Bridge Blocks */}
            {blocks.map((b, i) => (
                <BridgeBlock key={i} position={[b.pos[0], b.pos[1], b.pos[2]] as [number, number, number]} delay={i} />
            ))}

            {/* Connecting Cables (Decorative) */}
            <mesh position={[0, 3, 0]}>
                <torusGeometry args={[5, 0.05, 16, 100, Math.PI]} />
                <meshStandardMaterial color="#fff" emissive="#fff" />
            </mesh>
        </group>
    );
}
