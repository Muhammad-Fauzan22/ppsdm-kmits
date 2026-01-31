import { SkillGraphViewer } from "@/components/skills/SkillGraphViewer";
import { Share2, Network } from "lucide-react";

export default function SkillsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Network className="w-8 h-8 text-emerald-500" /> Skill Knowledge Graph
                </h1>
                <p className="text-slate-400 text-lg max-w-3xl">
                    Visualizing your competency network. Master prerequisite nodes to unlock advanced domains.
                </p>
            </div>

            <SkillGraphViewer />

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2">Core Competencies</h3>
                    <p className="text-sm text-slate-400">Foundation skills required for all majors.</p>
                    <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-yellow-500 w-full"></div>
                    </div>
                    <span className="text-xs text-yellow-500 mt-1 block">100% Mastered</span>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2">Technical Skills</h3>
                    <p className="text-sm text-slate-400">Hard skills specific to your engineering track.</p>
                    <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-blue-500 w-1/3"></div>
                    </div>
                    <span className="text-xs text-blue-500 mt-1 block">33% Mastered</span>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2">Soft Skills</h3>
                    <p className="text-sm text-slate-400">Interpersonal and leadership abilities.</p>
                    <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-pink-500 w-1/2"></div>
                    </div>
                    <span className="text-xs text-pink-500 mt-1 block">50% Mastered</span>
                </div>
            </div>
        </div>
    );
}
