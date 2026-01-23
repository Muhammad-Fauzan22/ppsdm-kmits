"use client";

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import KnowledgeGardenScene from './KnowledgeGardenScene';
import WisdomBridgeScene from './WisdomBridgeScene';
import LegacyTreeScene from './LegacyTreeScene';
import { motion } from 'framer-motion';

type SceneType = 'garden' | 'bridge' | 'tree';

export default function StewardshipCanvas() {
    const [scene, setScene] = useState<SceneType>('garden');

    return (
        <div className="w-full h-full relative bg-slate-950">
            {/* UI Controls */}
            <div className="absolute top-8 left-8 z-20">
                <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
                    LEGACY <span className="text-emerald-500">STEWARDSHIP</span>
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setScene('garden')}
                        className={`px-4 py-1 text-xs font-bold rounded-full border transition-all ${scene === 'garden' ? 'bg-emerald-500 text-slate-900 border-emerald-500' : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:border-white'}`}
                    >
                        GARDEN
                    </button>
                    <button
                        onClick={() => setScene('bridge')}
                        className={`px-4 py-1 text-xs font-bold rounded-full border transition-all ${scene === 'bridge' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:border-white'}`}
                    >
                        BRIDGE
                    </button>
                    <button
                        onClick={() => setScene('tree')}
                        className={`px-4 py-1 text-xs font-bold rounded-full border transition-all ${scene === 'tree' ? 'bg-amber-500 text-slate-900 border-amber-500' : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:border-white'}`}
                    >
                        TREE
                    </button>
                </div>
            </div>

            {/* 3D Canvas */}
            <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
                <Suspense fallback={null}>
                    <color attach="background" args={['#020617']} />
                    <fog attach="fog" args={['#020617', 5, 30]} />

                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <group>
                        {scene === 'garden' && <KnowledgeGardenScene />}
                        {scene === 'bridge' && <WisdomBridgeScene />}
                        {scene === 'tree' && <LegacyTreeScene />}
                    </group>

                    <OrbitControls
                        enablePan={false}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 2.1}
                        minDistance={5}
                        maxDistance={20}
                    />
                </Suspense>
            </Canvas>

            {/* Overlay Info */}
            <div className="absolute bottom-8 right-8 z-20 text-right max-w-sm pointer-events-none">
                <motion.div
                    key={scene}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-bold text-white mb-2">
                        {scene === 'garden' && 'The Knowledge Garden'}
                        {scene === 'bridge' && 'The Wisdom Bridge'}
                        {scene === 'tree' && 'The Legacy Tree'}
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {scene === 'garden' && 'Visualize your acquired skills as living entities. Water them with practice, harvest their fruits for projects, and plant seeds for future generations.'}
                        {scene === 'bridge' && 'Construct the pathway for those who follow. Each block represents a lesson learned or a challenge overcome, bridging the gap between potential and mastery.'}
                        {scene === 'tree' && 'Witness the collective growth of the community. Your contributions form the leaves and branches of this eternal structure, rooted in the foundational values of the past.'}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
