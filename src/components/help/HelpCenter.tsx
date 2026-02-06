'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, HelpCircle } from 'lucide-react';

const helpCategories = [
  {
    title: "Akun & Autentikasi",
    items: [
      { 
        question: "Bagaimana cara reset password?", 
        answer: "Klik link 'Lupa Password' di halaman login. Masukkan email Anda yang terdaftar. Kami akan mengirim link reset password ke email Anda. Link berlaku selama 24 jam." 
      },
      { 
        question: "Bagaimana cara mengubah email?", 
        answer: "Buka Settings > Account > Ubah Email. Masukkan email baru Anda dan konfirmasi dengan password saat ini. Perubahan akan berlaku setelah verifikasi email baru." 
      },
      { 
        question: "Mengapa saya tidak bisa login?", 
        answer: "Pastikan email dan password yang dimasukkan sudah benar. Jika masih bermasalah, coba clear cache browser atau gunakan browser lain. Jika akun terkunci, hubungi support." 
      },
    ]
  },
  {
    title: "Assessment",
    items: [
      { 
        question: "Berapa lama waktu untuk menyelesaikan assessment?", 
        answer: "Durasi standar adalah 30-45 menit tergantung kompleksitas assessment yang dipilih. Anda dapat menyimpan progress dan melanjutkan kapan saja." 
      },
      { 
        question: "Bisakah saya menyimpan progress dan melanjutkan nanti?", 
        answer: "Ya, sistem akan otomatis menyimpan progress Anda. Anda dapat logout dan login kembali untuk melanjutkan assessment dari titik terakhir." 
      },
      { 
        question: "Bagaimana cara melihat hasil assessment?", 
        answer: "Setelah menyelesaikan assessment, hasil akan tersedia di Dashboard > Riwayat Assessment. Anda juga akan menerima notifikasi email dengan ringkasan hasil." 
      },
    ]
  },
  {
    title: "Dashboard & Navigasi",
    items: [
      { 
        question: "Apa saja fitur utama di Dashboard?", 
        answer: "Dashboard menampilkan ringkasan progress, dimensi holistik, achievement terbaru, dan rekomendasi aktivitas berdasarkan profil Anda." 
      },
      { 
        question: "Bagaimana cara mengatur preferensi notifikasi?", 
        answer: "Buka Settings > Notifications. Anda dapat mengaktifkan atau menonaktifkan notifikasi email, push, dan SMS sesuai kebutuhan." 
      },
    ]
  },
  {
    title: "Achievement & Gamifikasi",
    items: [
      { 
        question: "Bagaimana cara mendapatkan achievement?", 
        answer: "Achievement diperoleh dengan menyelesaikan milestone, mencapai target progress, atau berpartisipasi dalam kegiatan tertentu. Cek halaman Achievement untuk melihat progres Anda." 
      },
      { 
        question: "Apakah achievement dapat hilang?", 
        answer: "Achievement yang sudah diperoleh akan permanen di profil Anda. Namun, streak dan points dapat reset jika tidak aktif dalam jangka waktu tertentu." 
      },
    ]
  },
  {
    title: "Teknis & Troubleshooting",
    items: [
      { 
        question: "Browser apa yang didukung?", 
        answer: "PPSDM KMITS mendukung browser Chrome (rekomendasi), Firefox, Safari, dan Edge versi terbaru. Pastikan JavaScript dan cookies diaktifkan." 
      },
      { 
        question: "Bagaimana jika terjadi error saat menggunakan aplikasi?", 
        answer: "Coba refresh halaman atau clear browser cache. Jika error berlanjut, laporkan melalui menu Help > Laporkan Masalah dengan menyertakan screenshot error." 
      },
    ]
  },
];

interface HelpItem {
  question: string;
  answer: string;
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredCategories = helpCategories.map(cat => ({
    ...cat,
    items: cat.items.filter((item: HelpItem) => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleCategoryToggle = (title: string) => {
    setExpandedCategory(expandedCategory === title ? null : title);
  };

  const handleContactSupport = (type: 'chat' | 'email') => {
    if (type === 'chat') {
      alert('Live Chat akan segera tersedia. Sementara itu, silakan kirim email ke support@ppsdm-kmits.ac.id');
    } else {
      window.location.href = 'mailto:support@ppsdm-kmits.ac.id?subject=Bantuan PPSDM KMITS';
    }
  };

  return (
    <div className="help-center max-w-4xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pusat Bantuan PPSDM KMITS</h1>
        <p className="text-gray-600">Temukan jawaban untuk pertanyaan Anda atau hubungi tim support kami</p>
      </div>
      
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Cari bantuan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          aria-label="Cari bantuan"
          aria-describedby="search-hint"
        />
        <span id="search-hint" className="sr-only">
          Ketik kata kunci untuk mencari bantuan
        </span>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => handleContactSupport('chat')}
          className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Mulai live chat dengan tim support"
        >
          <MessageCircle className="w-6 h-6 text-blue-500" aria-hidden="true" />
          <div className="text-left">
            <span className="font-semibold text-gray-900 block">Live Chat</span>
            <span className="text-sm text-gray-500">Chat langsung dengan tim support</span>
          </div>
        </button>
        <button
          onClick={() => handleContactSupport('email')}
          className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Kirim email ke tim support"
        >
          <Mail className="w-6 h-6 text-blue-500" aria-hidden="true" />
          <div className="text-left">
            <span className="font-semibold text-gray-900 block">Email Support</span>
            <span className="text-sm text-gray-500">support@ppsdm-kmits.ac.id</span>
          </div>
        </button>
      </div>

      {/* FAQ Categories */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-4" role="region" aria-label="Kategori FAQ">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
          {filteredCategories.map((category, categoryIndex) => (
            <div key={category.title} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleCategoryToggle(category.title)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-expanded={expandedCategory === category.title}
                aria-controls={`category-${categoryIndex}`}
              >
                <span className="font-semibold text-gray-900">{category.title}</span>
                {expandedCategory === category.title ? 
                  <ChevronUp className="w-5 h-5 text-gray-500" aria-hidden="true" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-500" aria-hidden="true" />
                }
              </button>
              
              {expandedCategory === category.title && (
                <div id={`category-${categoryIndex}`} className="divide-y divide-gray-100">
                  {category.items.map((item: HelpItem, itemIndex: number) => {
                    const isExpanded = expandedItems.has(`${categoryIndex}-${itemIndex}`);
                    return (
                      <div key={itemIndex} className="bg-white">
                        <button
                          onClick={() => toggleItem(categoryIndex, itemIndex)}
                          className="w-full px-6 py-4 text-left cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          aria-expanded={isExpanded}
                        >
                          <span className="text-gray-800 pr-4">{item.question}</span>
                          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
                          </span>
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-4 text-gray-600 animate-in slide-in-from-top-2 duration-200">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-500 text-lg">Tidak ada hasil yang ditemukan untuk "{searchQuery}"</p>
          <p className="text-gray-400">Coba gunakan kata kunci lain atau hubungi support langsung</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-500">
          Still need help? <a href="mailto:support@ppsdm-kmits.ac.id" className="text-blue-600 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}