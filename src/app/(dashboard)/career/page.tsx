import { SimulationRunner } from "@/components/career/SimulationRunner";
import { CAREER_SIMULATIONS } from "@/data/career/simulations";
import { Briefcase, Trophy } from "lucide-react";
import { SmartPortfolioUploader } from "@/components/career/SmartPortfolioUploader";

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
            {/* Smart Portfolio Builder */}
            <div className="mt-12 space-y-4">
                <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-white">Smart Portfolio Builder</h2>
                </div>
                <SmartPortfolioUploader />
            </div>
        </div>
    );
}
