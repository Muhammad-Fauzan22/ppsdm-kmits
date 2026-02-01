'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Ecosystem connections data
const ecosystemData = {
  mentors: [
    { id: 1, name: 'Dr. Sarah Johnson', role: 'Academic Mentor', avatar: null, status: 'active' },
    { id: 2, name: 'Pak Ahmad Rizal', role: 'Industry Mentor', avatar: null, status: 'active' },
  ],
  peers: [
    { id: 1, name: 'Budi Santoso', level: 4, progress: 75 },
    { id: 2, name: 'Citra Dewi', level: 5, progress: 82 },
    { id: 3, name: 'Dedi Pratama', level: 3, progress: 68 },
    { id: 4, name: 'Eka Wulandari', level: 4, progress: 78 },
  ],
  resources: [
    { id: 1, name: 'ITS Learning Center', type: 'facility', status: 'available' },
    { id: 2, name: 'Career Guidance Office', type: 'service', status: 'available' },
    { id: 3, name: 'Mental Health Support', type: 'service', status: 'available' },
    { id: 4, name: 'Innovation Lab', type: 'facility', status: 'busy' },
  ],
};

export default function EcosystemPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Ecosystem</h1>
        <p className="text-slate-400 text-sm mt-1">
          Connect with mentors, peers, and resources in your development network
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-[#FFD700]">{ecosystemData.mentors.length}</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Mentors</p>
        </div>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-400">{ecosystemData.peers.length}</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Study Peers</p>
        </div>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{ecosystemData.resources.length}</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Resources</p>
        </div>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-400">8</p>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Communities</p>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentors Section */}
        <motion.section variants={itemVariants}>
          <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Your Mentors</h2>
              <Link href="/mentorship" className="text-[#1A4D80] hover:text-white text-sm transition-colors">
                Find More
              </Link>
            </div>
            <div className="space-y-3">
              {ecosystemData.mentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center gap-3 p-3 bg-[#0f1923]/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003366] to-[#1A4D80] flex items-center justify-center text-white font-semibold">
                    {mentor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{mentor.name}</p>
                    <p className="text-slate-400 text-xs">{mentor.role}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full">
                    {mentor.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Peers Section */}
        <motion.section variants={itemVariants}>
          <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Study Peers</h2>
              <Link href="/peers" className="text-[#1A4D80] hover:text-white text-sm transition-colors">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {ecosystemData.peers.map((peer) => (
                <div key={peer.id} className="flex items-center gap-3 p-3 bg-[#0f1923]/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-semibold">
                    {peer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{peer.name}</p>
                    <p className="text-slate-400 text-xs">Level {peer.level} • {peer.progress}% complete</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-sm">chat</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Resources Section */}
      <motion.section variants={itemVariants}>
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Available Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemData.resources.map((resource) => (
              <div key={resource.id} className="p-4 bg-[#0f1923]/50 rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    resource.type === 'facility' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    <span className="material-symbols-outlined">
                      {resource.type === 'facility' ? 'apartment' : 'support_agent'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                    resource.status === 'available' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {resource.status}
                  </span>
                </div>
                <h3 className="text-white font-medium text-sm">{resource.name}</h3>
                <p className="text-slate-400 text-xs mt-1 capitalize">{resource.type}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Network Visualization Placeholder */}
      <motion.section variants={itemVariants}>
        <div className="bg-gradient-to-br from-[#003366]/20 to-[#1e293b]/40 border border-[#003366]/30 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#FFD700]">hub</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Network Visualization</h3>
              <p className="text-slate-400 text-sm">Interactive network map coming soon</p>
            </div>
          </div>
          <div className="h-48 bg-[#0f1923]/50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">network_node</span>
              <p className="text-slate-500 text-sm">Interactive ecosystem visualization</p>
              <p className="text-slate-600 text-xs">Coming in the next update</p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
