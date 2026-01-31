import { SimulationRunner } from "@/components/career/SimulationRunner";
import { CAREER_SIMULATIONS } from "@/data/career/simulations";
import { Briefcase, Trophy } from "lucide-react";

export default function CareerPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-blue-500" /> Career Readiness Simulator
                </h1>
                <p className="text-slate-400 text-lg max-w-3xl">
                    Test your professional skills in real-world scenarios. Your decisions shape your virtual reputation.
                </p>
            </div>

            <div className="grid gap-8">
                {CAREER_SIMULATIONS.map(sim => (
                    <div key={sim.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white border-l-4 border-blue-500 pl-3">
                                {sim.role} Scenario
                            </h2>
                            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                                Difficulty: {sim.difficulty}
                            </span>
                        </div>

                        <SimulationRunner module={sim} />
                    </div>
                ))}
            </div>

            {/* Placeholder for Portfolio Builder */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center mt-12">
                <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-500">Portfolio Builder Coming Soon</h3>
                <p className="text-slate-600 mt-2">Complete 3 simulations to unlock your professional profile.</p>
            </div>
        </div>
    );
}
