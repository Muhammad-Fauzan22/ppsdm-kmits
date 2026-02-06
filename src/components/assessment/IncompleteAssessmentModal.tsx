'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';

interface IncompleteModalState {
  isOpen: boolean;
  dimension: string | null;
  showModal: (dimension: string) => void;
  closeModal: () => void;
}

export const useIncompleteModalStore = create<IncompleteModalState>((set) => ({
  isOpen: false,
  dimension: null,
  showModal: (dimension) => set({ isOpen: true, dimension }),
  closeModal: () => set({ isOpen: false, dimension: null }),
}));

interface IncompleteAssessmentModalProps {
  completedCount: number;
  onContinue: () => void;
  onViewResults: () => void;
}

export function IncompleteAssessmentModal({
  completedCount,
  onContinue,
  onViewResults,
}: IncompleteAssessmentModalProps) {
  const { isOpen, closeModal } = useIncompleteModalStore();
  const remainingCount = 9 - completedCount;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1A1F2E] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-its-blue to-brand-accent flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-white">notifications</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Assessment Belum Selesai
              </h3>
              <p className="text-slate-400">
                Anda telah menyelesaikan {completedCount} dari 9 dimensi. 
                Selesaikan {remainingCount} dimensi lagi untuk mendapatkan hasil holistik lengkap.
              </p>
            </div>
            
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-brand-accent font-bold">
                  {completedCount}/9
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-its-blue to-brand-accent transition-all duration-500"
                  style={{ width: `${(completedCount / 9) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Dimensions */}
            <div className="mb-6">
              <p className="text-xs text-slate-500 mb-2">Sisa dimensi:</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                  const isCompleted = num <= completedCount;
                  return (
                    <span
                      key={num}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {num}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  closeModal();
                  onContinue();
                }}
                className="w-full py-4 bg-white text-[#0A0F1A] font-bold rounded-xl hover:bg-brand-accent transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                Lanjutkan Assessment
              </button>
              {completedCount > 0 && (
                <button
                  onClick={() => {
                    closeModal();
                    onViewResults();
                  }}
                  className="w-full py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Lihat Hasil Sementara
                </button>
              )}
              <button
                onClick={closeModal}
                className="w-full py-3 text-slate-400 hover:text-white transition-colors text-sm"
              >
                Nanti Saja
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Auto-show modal when user has incomplete assessment
export function useIncompleteAssessmentReminder(completedCount: number, triggerContinue: () => void) {
  const { showModal } = useIncompleteModalStore();
  
  const showReminder = () => {
    if (completedCount > 0 && completedCount < 9) {
      // Show after 5 seconds of page load
      setTimeout(() => {
        showModal('incomplete');
      }, 5000);
    }
  };
  
  return { showReminder };
}

export default IncompleteAssessmentModal;