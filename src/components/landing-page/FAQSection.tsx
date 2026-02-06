"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="border-b border-white/10"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg text-white/90 group-hover:text-white transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-white/70 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const faqs = [
    {
      question: "Apakah platform ini benar-benar gratis?",
      answer: "Ya, 100% gratis untuk mahasiswa ITS. Platform ini didanai oleh institusi dan research grants, sehingga tidak ada biaya tersembunyi untuk pengguna."
    },
    {
      question: "Berapa lama assessment lengkap?",
      answer: "Assessment holistik lengkap membutuhkan waktu sekitar 30 menit untuk 9 dimensi. Anda dapat menyimpan progres dan melanjutkan nanti jika diperlukan."
    },
    {
      question: "Bagaimana dengan privasi data saya?",
      answer: "Data Anda disimpan di server ITS dengan enkripsi end-to-end. Kami tidak membagikan data personal ke pihak ketiga. Data hanya digunakan untuk pengembangan personal Anda."
    },
    {
      question: "Bagaimana akurasi assessment ini?",
      answer: "Assessment kami memiliki tingkat reliabilitas dan validitas yang sangat tinggi, berdasarkan norma dari 2,000+ mahasiswa Indonesia. Ini sudah memenuhi standar psikometrik internasional."
    },
    {
      question: "Apakah perlu install aplikasi?",
      answer: "Tidak, platform ini 100% berbasis browser. Namun, Anda dapat menginstall sebagai PWA (Progressive Web App) untuk pengalaman mobile yang lebih baik dan akses offline."
    },
    {
      question: "Bisakah diakses offline?",
      answer: "Ya, setelah pertama kali memuat konten, assessment dan materi dapat diakses offline. Fitur ini sangat berguna untuk area dengan koneksi internet terbatas."
    },
    {
      question: "Ada support jika mengalami kesulitan?",
      answer: "Tim support tersedia via email (ppsdm@its.ac.id), WhatsApp, dan sesi konsultasi mingguan. Kami juga memiliki feedback form di dashboard untuk melaporkan bug atau memberikan masukan."
    },
    {
      question: "Bagaimana hasil assessment digunakan?",
      answer: "Hasil assessment memberikan gambaran holistik tentang perkembangan Anda di 9 dimensi. Platform kemudian memberikan rekomendasi personalized untuk pengembangan diri berdasarkan profil unik Anda."
    }
  ];

  const categories = [
    { id: "all", label: "Semua", count: 8 },
    { id: "general", label: "Umum", count: 2 },
    { id: "assessment", label: "Assessment", count: 3 },
    { id: "technical", label: "Teknis", count: 3 }
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const getFilteredFaqs = (categoryId: string) => {
    if (categoryId === "all") return faqs;

    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    const startIndex = categories.slice(0, categoryIndex).reduce((sum, c) => sum + c.count, 0);
    const endIndex = startIndex + categories[categoryIndex].count;
    return faqs.slice(startIndex, endIndex);
  };

  const filteredFaqs = getFilteredFaqs(activeCategory);

  return (
    <section className="py-24 bg-[#0A0F1A]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pertanyaan yang{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Sering Diajukan
            </span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang platform PPSDM KMITS
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category.id
                  ? "bg-white text-[#0A0F1A]"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
          {filteredFaqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-4">
            Still have questions? We are here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
          >
            <span>Hubungi Kami</span>
            <ChevronDown className="w-4 h-4" style={{ transform: "rotate(-90deg)" }} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQSection;
