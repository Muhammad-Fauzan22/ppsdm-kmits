"use client";

import { motion } from "framer-motion";
import { ChevronRight, Clock, Users, BookOpen, CheckCircle, HelpCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { DIMENSION_DATA, type DimensionInfo, type SubDimension } from "@/lib/dimensionData";
import { useState } from "react";

interface EnhancedDimensionPreTestInfoProps {
  dimensionId: string;
  onStart: () => void;
  onBack?: () => void;
  onNext?: () => void;
}

// Sample questions berdasarkan ASSESSMENT files
const SAMPLE_QUESTIONS: Record<string, Array<{
  id: string;
  text: string;
  source: string;
  dimension: string;
  responseScale: string;
}>> = {
  cognitive: [
    {
      id: "COG_CT1",
      text: "Saya selalu mempertanyakan asumsi dasar sebelum menerima suatu informasi sebagai kebenaran",
      source: "CTDS Item 3 (Sosu, 2013)",
      dimension: "Critical Thinking",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)"
    },
    {
      id: "COG_GM1",
      text: "Kecerdasan adalah sesuatu yang dapat dikembangkan melalui usaha dan pembelajaran",
      source: "GMS Item 1 (Dweck, 2006)",
      dimension: "Growth Mindset",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)"
    },
    {
      id: "COG_CRE1",
      text: "Saya yakin dapat menghasilkan ide-ide yang orisinal dan berguna",
      source: "CSES Item 4 (Tierney & Farmer, 2002)",
      dimension: "Creativity",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)"
    },
    {
      id: "COG_MET1",
      text: "Saya secara teratur mengevaluasi cara berpikir saya sendiri dan membuat penyesuaian",
      source: "MAI Item 12 (Schraw & Dennison, 1994)",
      dimension: "Metacognition",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)"
    }
  ],
  self_management: [
    {
      id: "SM_TM1",
      text: "Saya secara teratur membuat dan mengikuti jadwal harian/mingguan untuk kegiatan akademik dan pribadi",
      source: "TMBS Item 2 (Macan et al., 1990)",
      dimension: "Time Management",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)"
    },
    {
      id: "SM_PROC1",
      text: "Saya sering menunda-nunda tugas penting hingga mendekati deadline",
      source: "TPS Item 5 (Tuckman, 1991)",
      dimension: "Procrastination Control",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju) - Reverse Scored"
    },
    {
      id: "SM_SC1",
      text: "Saya dapat menahan diri dari gangguan (media sosial, games) ketika sedang fokus mengerjakan tugas penting",
      source: "BSCS Item 7 (Tangney et al., 2004)",
      dimension: "Self-Control",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)"
    },
    {
      id: "SM_DW1",
      text: "Saya dapat berkonsentrasi penuh pada satu tugas kompleks selama 2-3 jam tanpa gangguan atau multitasking",
      source: "DWCS Item 3 (Newport adaptation)",
      dimension: "Deep Work Capacity",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)"
    }
  ],
  financial: [
    {
      id: "FIN_KNOW1",
      text: "Jika tingkat inflasi adalah 5% per tahun, dan Anda menyimpan uang di rekening dengan bunga 3% per tahun, maka setelah setahun daya beli uang Anda akan:",
      source: "OECD/INFE Item 3",
      dimension: "Financial Knowledge",
      responseScale: "Multiple Choice (A, B, C, D)"
    },
    {
      id: "FIN_BEH1",
      text: "Saya memiliki anggaran bulanan dan mencatat pengeluaran secara teratur",
      source: "FMBS Item 2 (Dew & Xiao, 2011)",
      dimension: "Financial Behavior",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)"
    },
    {
      id: "FIN_EFF1",
      text: "Saya percaya dapat membuat keputusan keuangan yang baik untuk masa depan saya",
      source: "Financial Self-Efficacy Item 4 (Lown, 2011)",
      dimension: "Financial Self-Efficacy",
      responseScale: "1 (Sangat Tidak Setuju) - 5 (Sangat Setuju)"
    }
  ],
  // Dimensi lainnya dapat ditambahkan sesuai kebutuhan
};

function PsychometricCard({
  label,
  value,
  description,
  status
}: {
  label: string;
  value: string;
  description: string;
  status: "excellent" | "good" | "verified" | "info";
}) {
  const statusColors = {
    excellent: "from-emerald-500 to-green-500",
    good: "from-blue-500 to-cyan-500",
    verified: "from-violet-500 to-purple-500",
    info: "from-amber-500 to-orange-500"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white/5 border border-white/10 rounded-xl"
    >
      <div className={`text-2xl font-bold bg-gradient-to-r ${statusColors[status]} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="text-sm text-white/70 mt-1">{label}</div>
      <div className="text-xs text-white/50 mt-1">{description}</div>
    </motion.div>
  );
}

function ResearchSourceItem({ source }: { source: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-white/70">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center mt-0.5">
        <svg className="w-3 h-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
      {source}
    </li>
  );
}

function InterpretationLevelBadge({ level, range, description, color }: {
  level: string;
  range: [number, number];
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-lg">
      <div className={`flex-shrink-0 w-20 text-center py-1 rounded ${color}`}>
        <span className="text-xs font-bold">{level}</span>
      </div>
      <div className="flex-1">
        <span className="text-white/50 text-sm">{range[0]} - {range[1]}:</span>{" "}
        <span className="text-white/80 text-sm">{description}</span>
      </div>
    </div>
  );
}

function SampleQuestionCard({ question }: { question: typeof SAMPLE_QUESTIONS["cognitive"][0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-4 bg-white/5 border border-white/10 rounded-lg"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs px-2 py-1 rounded bg-violet-500/20 text-violet-400">
          {question.dimension}
        </span>
        <span className="text-xs text-white/40">{question.id}</span>
      </div>
      <p className="text-white/90 text-sm mb-3">{question.text}</p>
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>📑 {question.source}</span>
        <span>📊 {question.responseScale}</span>
      </div>
    </motion.div>
  );
}

function SubDimensionCard({ sub, color }: { sub: SubDimension; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white/5 border border-white/10 rounded-lg group"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white text-sm">{sub.name}</h4>
        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60 group-hover:bg-white/20 transition-colors">
          {sub.itemCount} item
        </span>
      </div>
      <p className="text-xs text-white/50 mb-2">{sub.nameEn}</p>
      <p className="text-xs text-white/70">{sub.description}</p>
    </motion.div>
  );
}

export function EnhancedDimensionPreTestInfo({
  dimensionId,
  onStart,
  onBack,
  onNext
}: EnhancedDimensionPreTestInfoProps) {
  const dimension = DIMENSION_DATA[dimensionId];
  const [activeTab, setActiveTab] = useState<"overview" | "sample" | "interpretation">("overview");
  const sampleQuestions = SAMPLE_QUESTIONS[dimensionId] || [];

  if (!dimension) {
    return <div>Dimension not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0F1A]">
      {/* Hero Header dengan Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${dimension.gradient} opacity-20`}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Mesh pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          {/* Back button */}
          {onBack && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="absolute left-6 top-16 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Kembali</span>
            </motion.button>
          )}

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium">
              Dimensi {dimension.step} dari {dimension.totalSteps}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2"
          >
            {dimension.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70 mb-4"
          >
            {dimension.nameEn}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/50 italic"
          >
            &quot;{dimension.tagline}&quot;
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        {/* Psychometric Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <PsychometricCard
            label="Reliabilitas"
            value={`α = ${dimension.reliability}`}
            description="Cronbach's Alpha"
            status="excellent"
          />
          <PsychometricCard
            label="Sampel Validasi"
            value={`n = ${dimension.sampleSize.toLocaleString()}`}
            description="Mahasiswa Indonesia"
            status="verified"
          />
          <PsychometricCard
            label="Validitas (CFI)"
            value={`${dimension.validity.cfi}`}
            description="Confirmatory Factor Analysis"
            status="good"
          />
          <PsychometricCard
            label="Estimasi Waktu"
            value={dimension.estimatedTime}
            description={`${dimension.subDimensions.reduce((sum, s) => sum + s.itemCount, 0)} pertanyaan`}
            status="info"
          />
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "sample", label: "Contoh Pertanyaan" },
            { id: "interpretation", label: "Interpretasi" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? "bg-white text-[#0A0F1A]"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {activeTab === "overview" && (
            <>
              {/* Description */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                  Tentang Dimensi Ini
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  {dimension.longDescription}
                </p>
                <div className="p-4 bg-violet-500/10 border-l-4 border-violet-500 rounded-r-lg">
                  <p className="text-sm text-white/80">
                    💡 {dimension.importanceText}
                  </p>
                </div>
              </div>

              {/* Sub-Dimensions */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                  Sub-Dimensi yang Diukur
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dimension.subDimensions.map((sub) => (
                    <SubDimensionCard key={sub.id} sub={sub} color={dimension.color} />
                  ))}
                </div>
              </div>

              {/* Research Basis */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                  Dasar Riset Ilmiah
                </h2>
                <ul className="space-y-3">
                  {dimension.researchBasis.map((source, index) => (
                    <ResearchSourceItem key={index} source={source} />
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeTab === "sample" && (
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                Contoh Pertanyaan Assessment
              </h2>
              <p className="text-white/60 text-sm mb-6">
                Berikut adalah contoh pertanyaan dari assessment ini. Total akan ada {dimension.subDimensions.reduce((sum, s) => sum + s.itemCount, 0)} pertanyaan.
              </p>
              <div className="space-y-4">
                {sampleQuestions.length > 0 ? (
                  sampleQuestions.map((question) => (
                    <SampleQuestionCard key={question.id} question={question} />
                  ))
                ) : (
                  <p className="text-white/50 text-center py-8">
                    Contoh pertanyaan akan segera tersedia
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "interpretation" && (
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full" style={{ backgroundColor: dimension.color }} />
                Level Interpretasi Skor
              </h2>
              <p className="text-white/60 text-sm mb-6">
                Setelah menyelesaikan assessment, Anda akan menerima skor 0-100 untuk setiap dimensi dengan interpretasi sebagai berikut:
              </p>
              <div className="space-y-3">
                {dimension.interpretationLevels.map((level, index) => {
                  const colors = [
                    "bg-red-500/20 text-red-400",
                    "bg-orange-500/20 text-orange-400",
                    "bg-yellow-500/20 text-yellow-400",
                    "bg-blue-500/20 text-blue-400",
                    "bg-emerald-500/20 text-emerald-400"
                  ];
                  return (
                    <InterpretationLevelBadge
                      key={level.level}
                      level={level.level}
                      range={level.range}
                      description={level.description}
                      color={colors[index % colors.length]}
                    />
                  );
                })}
              </div>

              {/* Normative Data */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-sm font-semibold text-white/80 mb-2">Data Normatif</h3>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span>Mean Populasi: {dimension.populationMean}</span>
                  <span>SD: {dimension.populationStd}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-white/10"
        >
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-white/50 text-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Butuh bantuan? <a href="/contact" className="text-violet-400 hover:underline">Hubungi kami</a></span>
          </div>

          <button
            onClick={onStart}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-violet-500/25"
          >
            <span>Mulai Assessment</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-white/40">
            Assessment ini dikembangkan berdasarkan riset psikometrik yang ketat dengan norma dari {dimension.sampleSize.toLocaleString()}+ mahasiswa Indonesia.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default EnhancedDimensionPreTestInfo;
