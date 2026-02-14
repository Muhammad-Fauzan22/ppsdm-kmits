/**
 * InteractiveHotspots.tsx
 * Interactive hotspots for 9 dimensions with hover tooltips and click modals
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Brain } from "lucide-react";

// 9 Dimensions data with positions for each narrative phase
export interface Dimension {
  id: string;
  name: string;
  nameId: string;
  shortDescription: string;
  fullDescription: string;
  metric: string;
  metricValue: string;
  color: string;
  phaseVisibility: {
    problem: boolean;
    connection: boolean;
    transformation: boolean;
    impact: boolean;
  };
  positions: {
    problem: { x: number; y: number };
    connection: { x: number; y: number };
    transformation: { x: number; y: number };
    impact: { x: number; y: number };
  };
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "spiritual",
    name: "Spiritual",
    nameId: "Spiritual",
    shortDescription: "Pengembangan nilai-nilai spiritual dan keimanan",
    fullDescription: "Dimensi spiritual mencakup pengembangan keimanan, moral, dan nilai-nilai etika yang menjadi fondasi pembentukan karakter mahasiswa ITS. Program meliputi pengajian rutin, mentoring spiritual, dan kegiatan keagamaan yang membangun kedekatan dengan Tuhan Yang Maha Esa.",
    metric: " skor",
    metricValue: "92",
    color: "#8b5cf6",
    phaseVisibility: {
      problem: true,
      connection: true,
      transformation: true,
      impact: true,
    },
    positions: {
      problem: { x: 15, y: 20 },
      connection: { x: 25, y: 25 },
      transformation: { x: 50, y: 30 },
      impact: { x: 50, y: 35 },
    },
  },
  {
    id: "intellectual",
    name: "Intellectual",
    nameId: "Intelektual",
    shortDescription: "Pengembangan kemampuan berpikir kritis dan analitis",
    fullDescription: "Dimensi intelektual fokus pada pengembangan kemampuan berpikir kritis, analitis, dan kreatif. Mahasiswa dilatih melalui riset, diskusi ilmiah, dan proyek kolaboratif yang mempersiapkan mereka menghadapi tantangan global dengan solusi inovatif.",
    metric: " IPK",
    metricValue: "3.75",
    color: "#3b82f6",
    phaseVisibility: {
      problem: true,
      connection: true,
      transformation: true,
      impact: true,
    },
    positions: {
      problem: { x: 85, y: 25 },
      connection: { x: 75, y: 25 },
      transformation: { x: 50, y: 20 },
      impact: { x: 45, y: 25 },
    },
  },
  {
    id: "physical",
    name: "Physical",
    nameId: "Fisik",
    shortDescription: "Kesehatan dan kebugaran tubuh",
    fullDescription: "Dimensi fisik menekankan pentingnya kesehatan dan kebugaran tubuh melalui program olahraga, nutrisi seimbang, dan gaya hidup sehat. Fasilitas olahraga modern dan kegiatan fisik rutin tersedia untuk mendukung produktivitas akademik.",
    metric: " BMI",
    metricValue: "22.1",
    color: "#10b981",
    phaseVisibility: {
      problem: true,
      connection: true,
      transformation: true,
      impact: true,
    },
    positions: {
      problem: { x: 20, y: 80 },
      connection: { x: 20, y: 70 },
      transformation: { x: 35, y: 50 },
      impact: { x: 30, y: 45 },
    },
  },
  {
    id: "emotional",
    name: "Emotional",
    nameId: "Emosional",
    shortDescription: "Kecerdasan emosional dan manajemen stres",
    fullDescription: "Dimensi emosional mengembangkan kemampuan mengelola emosi, empati, dan hubungan interpersonal. Konseling psikologis dan workshopEQ tersedia untuk membantu mahasiswa mencapai keseimbangan emosional.",
    metric: " EQ",
    metricValue: "88",
    color: "#f59e0b",
    phaseVisibility: {
      problem: true,
      connection: true,
      transformation: true,
      impact: true,
    },
    positions: {
      problem: { x: 80, y: 75 },
      connection: { x: 80, y: 70 },
      transformation: { x: 65, y: 50 },
      impact: { x: 70, y: 45 },
    },
  },
  {
    id: "social",
    name: "Social",
    nameId: "Sosial",
    shortDescription: "Keterampilan komunikasi dan jaringan",
    fullDescription: "Dimensi sosial membangun kemampuan komunikasi, kolaborasi, dan membangun jaringan profesional. Kegiatan organisasi kampus dan proyek tim melatih keterampilan sosial yang esensial.",
    metric: " jaringan",
    metricValue: "150+",
    color: "#06b6d4",
    phaseVisibility: {
      problem: true,
      connection: true,
      transformation: true,
      impact: true,
    },
    positions: {
      problem: { x: 50, y: 15 },
      connection: { x: 50, y: 15 },
      transformation: { x: 50, y: 50 },
      impact: { x: 55, y: 55 },
    },
  },
  {
    id: "career",
    name: "Career",
    nameId: "Karir",
    shortDescription: "Persiapan karir dan pengembangan profesional",
    fullDescription: "Dimensi karir mempersiapkan mahasiswa untuk dunia kerja melalui magang, career counseling, dan pengembangan soft skills. Kerjasama dengan perusahaan terkemuka memberikan pengalaman nyata.",
    metric: " placement",
    metricValue: "94%",
    color: "#ef4444",
    phaseVisibility: {
      problem: true,
      connection: true,
      transformation: true,
      impact: true,
    },
    positions: {
      problem: { x: 50, y: 85 },
      connection: { x: 50, y: 80 },
      transformation: { x: 50, y: 70 },
      impact: { x: 50, y: 75 },
    },
  },
  {
    id: "environmental",
    name: "Environmental",
    nameId: "Lingkungan",
    shortDescription: "Kesadaran dan tanggung jawab lingkungan",
    fullDescription: "Dimensi lingkungan menumbuhkan kesadaran ekologis dan tanggung jawab terhadap lingkungan. Program penghijauan, pengelolaan limbah, dan kegiatan sustainability melibatkan mahasiswa aktif.",
    metric: " CO2",
    metricValue: "-40%",
    color: "#22c55e",
    phaseVisibility: {
      problem: true,
      connection: true,
      transformation: true,
      impact: true,
    },
    positions: {
      problem: { x: 25, y: 50 },
      connection: { x: 35, y: 50 },
      transformation: { x: 50, y: 50 },
      impact: { x: 40, y: 60 },
    },
  },
  {
    id: "creative",
    name: "Creative",
    nameId: "Kreatif",
    shortDescription: "Kemampuan berpikir kreatif dan inovatif",
    fullDescription: "Dimensi kreatif mengembangkan kemampuan berpikir out-of-the-box melalui seni, desain, dan inovasi. Fasilitas kreatif dan kompetisi ide memberikan ruang bagi mahasiswa mengeksplorasi potensi.",
    metric: " inovasi",
    metricValue: "45+",
    color: "#ec4899",
    phaseVisibility: {
      problem: true,
      connection: true,
      transformation: true,
      impact: true,
    },
    positions: {
      problem: { x: 75, y: 50 },
      connection: { x: 65, y: 50 },
      transformation: { x: 50, y: 50 },
      impact: { x: 60, y: 60 },
    },
  },
  {
    id: "financial",
    name: "Financial",
    nameId: "Keuangan",
    shortDescription: "Manajemen keuangan dan literasi finansial",
    fullDescription: "Dimensi keuangan mengajarkan manajemen keuangan pribadi dan literasi finansial. Program beasiswa, panduan penganggaran, dan investasi muda membantu mahasiswa financial wise.",
    metric: " tabungan",
    metricValue: "25%",
    color: "#14b8a6",
    phaseVisibility: {
      problem: true,
      connection: true,
      transformation: true,
      impact: true,
    },
    positions: {
      problem: { x: 50, y: 50 },
      connection: { x: 50, y: 50 },
      transformation: { x: 50, y: 50 },
      impact: { x: 50, y: 50 },
    },
  },
];

interface HotspotModalProps {
  dimension: Dimension;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

const HotspotModal: React.FC<HotspotModalProps> = ({
  dimension,
  isOpen,
  onClose,
  position,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed z-50 w-80 md:w-96"
            style={{
              left: Math.min(position.x + 80, window.innerWidth - 320),
              top: position.y - 100,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div
              className="rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)" }}
            >
              {/* Header */}
              <div
                className="px-5 py-4 flex items-center gap-3"
                style={{ borderBottom: `2px solid ${dimension.color}40` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${dimension.color}30` }}
                >
                  <Brain style={{ color: dimension.color }} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{dimension.name}</h3>
                  <p className="text-xs text-slate-400">{dimension.nameId}</p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Metric */}
              <div className="px-5 py-4 bg-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Key Metric</span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: dimension.color }}
                  >
                    {dimension.metricValue}
                    <span className="text-sm text-slate-500 ml-1">{dimension.metric}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="px-5 py-4">
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Deskripsi</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {dimension.fullDescription}
                </p>
              </div>

              {/* Actions */}
              <div className="px-5 py-4 bg-white/5 flex gap-2">
                <button
                  className="flex-1 py-2 px-4 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: dimension.color }}
                >
                  Mulai Assessment
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface InteractiveHotspotsProps {
  currentPhase: string;
  scrollProgress: number;
  isMobile?: boolean;
}

export function InteractiveHotspots({
  currentPhase,
  scrollProgress,
  isMobile = false,
}: InteractiveHotspotsProps) {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHotspotClick = useCallback((dimension: Dimension, event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setModalPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
    setSelectedDimension(dimension);
  }, []);

  const handleHotspotHover = useCallback((dimensionId: string | null) => {
    setHoveredDimension(dimensionId);
  }, []);

  // Check if dimension is visible in current phase
  const isDimensionVisible = useCallback(
    (dimension: Dimension): boolean => {
      return dimension.phaseVisibility[currentPhase as keyof typeof dimension.phaseVisibility] || false;
    },
    [currentPhase]
  );

  // Calculate hotspot position based on phase
  const getHotspotPosition = useCallback(
    (dimension: Dimension): { x: number; y: number } => {
      const phasePositions = dimension.positions[currentPhase as keyof typeof dimension.positions];
      return phasePositions || dimension.positions.problem;
    },
    [currentPhase]
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 pointer-events-none"
    >
      {/* Hotspots */}
      {DIMENSIONS.map((dimension) => {
        if (!isDimensionVisible(dimension)) return null;

        const position = getHotspotPosition(dimension);
        const isHovered = hoveredDimension === dimension.id;
        const isSelected = selectedDimension?.id === dimension.id;

        return (
          <motion.div
            key={dimension.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHovered || isSelected ? 1.3 : 1,
              opacity: 1,
            }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            {/* Hotspot pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: dimension.color }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Hotspot core */}
            <motion.button
              className="relative w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: dimension.color,
                boxShadow: `0 0 20px ${dimension.color}60`,
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => handleHotspotHover(dimension.id)}
              onMouseLeave={() => handleHotspotHover(null)}
              onClick={(e) => handleHotspotClick(dimension, e)}
            >
              <Plus className="text-white w-3 h-3 md:w-3.5 md:h-3.5" />

              {/* Tooltip on hover */}
              <AnimatePresence>
                {isHovered && !isMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <div
                      className="px-3 py-2 rounded-xl shadow-xl"
                      style={{
                        background: "rgba(15, 20, 25, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${dimension.color}40`,
                      }}
                    >
                      <p className="text-xs font-semibold text-white">{dimension.name}</p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: dimension.color }}
                      >
                        {dimension.metricValue}{dimension.metric}
                      </p>
                    </div>
                    {/* Arrow */}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent"
                      style={{ borderTopColor: "rgba(15, 20, 25, 0.95)" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        );
      })}

      {/* Modal for selected dimension */}
      {selectedDimension && (
        <HotspotModal
          dimension={selectedDimension}
          isOpen={!!selectedDimension}
          onClose={() => setSelectedDimension(null)}
          position={modalPosition}
        />
      )}
    </div>
  );
}

export default InteractiveHotspots;