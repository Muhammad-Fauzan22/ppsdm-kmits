"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Calculator, 
  Briefcase,
  CheckCircle2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateFinancialScores, FinancialResponse, FinancialResult } from '@/lib/assessment/financialScoring';

// Comprehensive Question Set
const QUESTIONS = [
  // --- KNOWLEDGE ---
  {
    id: 'FK1',
    type: 'choice',
    category: 'Knowledge',
    text: "Jika Anda menyimpan Rp 1.000.000 dengan bunga majemuk 6% per tahun, berapa total uang Anda setelah 2 tahun?",
    options: [
      { id: 'a', text: 'Rp 1.060.000' },
      { id: 'b', text: 'Rp 1.120.000' },
      { id: 'c', text: 'Rp 1.123.600' },
      { id: 'd', text: 'Rp 1.200.000' }
    ],
    icon: PieChart
  },
  {
    id: 'FK2',
    type: 'choice',
    category: 'Knowledge',
    text: "Jika inflasi 8% dan bunga tabungan bank 5%, maka daya beli uang Anda setelah satu tahun akan...",
    options: [
      { id: 'a', text: 'Meningkat' },
      { id: 'b', text: 'Tetap sama' },
      { id: 'c', text: 'Menurun' },
      { id: 'd', text: 'Tidak dapat ditentukan' }
    ],
    icon: TrendingUp
  },
  // --- BEHAVIOR ---
  {
    id: 'FB1',
    type: 'likert',
    category: 'Behavior',
    text: "Saya membuat anggaran bulanan tertulis dan berusaha mematuhinya.",
    icon: Wallet
  },
  {
    id: 'FB2',
    type: 'likert',
    category: 'Behavior',
    text: "Saya selalu menyisihkan uang untuk ditabung segera setelah menerima uang saku/gaji.",
    icon: Wallet
  },
  {
    id: 'FB4',
    type: 'likert',
    category: 'Behavior',
    text: "Saya memiliki dana darurat yang cukup untuk biaya hidup minimal 3 bulan.",
    icon: Wallet
  },
  // --- ENGINEERING CONTEXT ---
  {
    id: 'EF1',
    type: 'choice',
    category: 'Engineering Context',
    text: "Proyek Anda mengalami defisit karena kenaikan harga material 15%. Tindakan paling profesional?",
    options: [
      { id: 'a', text: 'Mengurangi kualitas material secara diam-diam' },
      { id: 'b', text: 'Negosiasi ulang scope/budget dengan klien' },
      { id: 'c', text: 'Menutupi dengan uang pribadi' },
      { id: 'd', text: 'Membatalkan proyek sepihak' }
    ],
    icon: Briefcase
  },
  {
    id: 'EF2',
    type: 'input',
    category: 'Engineering Context',
    text: "Sebuah alat seharga Rp 15 Juta dapat menghemat operasional Rp 2 Juta/bulan. Berapa bulan Break Even Point (BEP)?",
    suffix: "Bulan",
    placeholder: "Contoh: 5.5",
    icon: Calculator
  }
];

export default function FinancialAssessment() {
  const [step, setStep] = useState<'intro' | 'questions' | 'results'>('intro');
  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState<FinancialResponse>({});
  const [result, setResult] = useState<FinancialResult | null>(null);
  const [inputValue, setInputValue] = useState(""); // For text inputs

  const currentQ = QUESTIONS[idx];

  const handleAnswer = (val: string | number) => {
    const newRes = { ...responses, [currentQ.id]: val };
    setResponses(newRes);
    nextQuestion(newRes);
  };

  const handleInputSubmit = () => {
    if (!inputValue) return;
    const newRes = { ...responses, [currentQ.id]: inputValue };
    setResponses(newRes);
    setInputValue("");
    nextQuestion(newRes);
  };

  const nextQuestion = (res: FinancialResponse) => {
    if (idx < QUESTIONS.length - 1) {
      setTimeout(() => setIdx(prev => prev + 1), 200);
    } else {
      finish(res);
    }
  };

  const finish = async (finalRes: FinancialResponse) => {
    // Simulate processing
    await new Promise(r => setTimeout(r, 1000));
    setResult(calculateFinancialScores(finalRes));
    setStep('results');
  };

  // --- RENDER ---

  if (step === 'intro') {
    return (
      <Card className="max-w-2xl mx-auto border-blue-100 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 text-center py-10">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-sm">
            <Wallet className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Financial Intelligence</CardTitle>
          <CardDescription className="text-lg">Literacy, Behavior & Engineering Economy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pt-8">
          <div className="space-y-4">
            <FeatureRow icon={PieChart} text="Uji pemahaman bunga majemuk & inflasi" />
            <FeatureRow icon={Wallet} text="Evaluasi kebiasaan budgeting & saving" />
            <FeatureRow icon={Briefcase} text="Studi kasus manajemen biaya proyek" />
          </div>
          <Button 
            onClick={() => setStep('questions')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg rounded-xl shadow-lg shadow-blue-200 mt-4"
          >
            Mulai Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'results' && result) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-20">
         <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-blue-100 shadow-xl text-center overflow-hidden">
               <div className="bg-blue-600 h-2 w-full" />
               <CardContent className="pt-10 pb-8">
                  <div className="text-6xl font-black text-blue-600 mb-2">{result.normalizedScore}</div>
                  <div className={`text-xl font-bold mb-4 ${result.levelColor}`}>{result.level}</div>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">{result.interpretation}</p>
               </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
               <ScoreCard label="Knowledge" val={result.subscores.knowledge} icon={PieChart} color="bg-indigo-50 text-indigo-600" />
               <ScoreCard label="Behavior" val={result.subscores.behavior} icon={Wallet} color="bg-emerald-50 text-emerald-600" />
               <ScoreCard label="Attitude" val={result.subscores.attitude} icon={TrendingUp} color="bg-amber-50 text-amber-600" />
               <ScoreCard label="Engineering" val={result.subscores.engineering} icon={Briefcase} color="bg-slate-100 text-slate-600" />
            </div>
         </div>

         <Card className="border-blue-100">
            <CardHeader>
               <CardTitle>Rekomendasi Pengembangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                     <div className="bg-white p-2 h-fit rounded-lg text-blue-500 shadow-sm">
                        <AlertCircle className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">{rec.action}</h4>
                        <p className="text-sm text-gray-600 mt-1">Resource: {rec.resource}</p>
                     </div>
                  </div>
               ))}
               {result.recommendations.length === 0 && (
                  <p className="text-gray-500 italic">Selamat! Hasil Anda sangat memuaskan di semua aspek.</p>
               )}
            </CardContent>
         </Card>
      </div>
    );
  }

  // QUESTIONS UI
  const progress = ((idx + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
       <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
             <span>{currentQ.category}</span>
             <span>{idx + 1}/{QUESTIONS.length}</span>
          </div>
          <Progress value={progress} className="h-1.5" indicatorColor="bg-blue-600" />
       </div>

       <AnimatePresence mode="wait">
          <motion.div
             key={currentQ.id}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
          >
             <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-snug">{currentQ.text}</h2>

             {/* CHOICE TYPE */}
             {currentQ.type === 'choice' && (
                <div className="space-y-3">
                   {currentQ.options?.map((opt) => (
                      <button
                         key={opt.id}
                         onClick={() => handleAnswer(opt.id)}
                         className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700 flex items-center justify-between group"
                      >
                         <span>{opt.text}</span>
                         <ChevronRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100" />
                      </button>
                   ))}
                </div>
             )}

             {/* LIKERT TYPE */}
             {currentQ.type === 'likert' && (
                <div className="space-y-3">
                   {[1, 2, 3, 4, 5].map((val) => (
                      <button
                         key={val}
                         onClick={() => handleAnswer(val)}
                         className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-700 flex items-center gap-3"
                      >
                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                            {val}
                         </div>
                         <span>
                            {val === 1 ? "Sangat Tidak Setuju" : val === 5 ? "Sangat Setuju" : val === 3 ? "Netral" : ""}
                         </span>
                      </button>
                   ))}
                </div>
             )}

             {/* INPUT TYPE */}
             {currentQ.type === 'input' && (
                <div className="space-y-4">
                   <div className="flex gap-4">
                      <input 
                         type="number" 
                         value={inputValue}
                         onChange={(e) => setInputValue(e.target.value)}
                         placeholder={currentQ.placeholder}
                         className="flex-1 p-4 rounded-xl border border-gray-300 text-xl font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      {currentQ.suffix && (
                         <div className="p-4 bg-gray-100 rounded-xl font-bold text-gray-500 flex items-center">
                            {currentQ.suffix}
                         </div>
                      )}
                   </div>
                   <Button onClick={handleInputSubmit} className="w-full bg-blue-600 h-12 text-lg">
                      Submit Answer
                   </Button>
                </div>
             )}

          </motion.div>
       </AnimatePresence>
    </div>
  );
}

function FeatureRow({ icon: Icon, text }: any) {
   return (
      <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
         <Icon className="w-5 h-5 text-blue-600" />
         <span className="text-gray-700 font-medium">{text}</span>
      </div>
   )
}

function ScoreCard({ label, val, icon: Icon, color }: any) {
   return (
      <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center ${color}`}>
         <Icon className="w-6 h-6 mb-2 opacity-80" />
         <div className="text-2xl font-black mb-1">{val}</div>
         <div className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</div>
      </div>
   )
}
