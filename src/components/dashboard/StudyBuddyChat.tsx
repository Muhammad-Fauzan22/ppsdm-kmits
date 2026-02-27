'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  '📚 Bantu saya buat jadwal belajar',
  '🧠 Tips meningkatkan konsentrasi',
  '💪 Cara mengelola stres kuliah',
  '🎯 Bagaimana cara menetapkan tujuan?',
  '⏰ Teknik manajemen waktu terbaik',
];

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: 'Halo! Saya Study Buddy AI Anda 🤖✨\n\nSaya siap membantu Anda dengan:\n• Strategi belajar yang efektif\n• Manajemen waktu & produktivitas\n• Tips kesehatan mental mahasiswa\n• Persiapan ujian & tugas\n\nAda yang bisa saya bantu hari ini?',
  timestamp: new Date(),
};

async function sendMessage(messages: Message[]): Promise<string> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        systemPrompt: `Anda adalah Study Buddy AI untuk mahasiswa PPSDM KMITS (Institut Teknologi Sepuluh Nopember). 
Anda membantu mahasiswa dengan:
- Strategi belajar yang efektif dan berbasis bukti ilmiah
- Manajemen waktu dan produktivitas
- Kesehatan mental dan wellbeing mahasiswa
- Tips menghadapi ujian, tugas, dan tekanan akademik
- Pengembangan diri holistik (9 dimensi: kognitif, emosional, finansial, fisik, sosial, mental, karakter, spiritual, lingkungan)

Gunakan bahasa Indonesia yang ramah, supportif, dan mudah dipahami. 
Berikan jawaban yang praktis, actionable, dan berbasis penelitian.
Jaga respons tetap ringkas (max 3-4 paragraf) kecuali diminta detail.`,
      }),
    });

    if (!response.ok) {
      throw new Error('API error');
    }

    const data = await response.json();
    return data.message || data.content || 'Maaf, terjadi kesalahan. Silakan coba lagi.';
  } catch {
    // Fallback responses when API is unavailable
    const fallbacks = [
      'Pertanyaan yang bagus! Untuk strategi belajar yang efektif, coba teknik Pomodoro: belajar 25 menit, istirahat 5 menit. Ini terbukti meningkatkan fokus dan retensi memori.',
      'Manajemen waktu yang baik dimulai dari prioritisasi. Gunakan matriks Eisenhower: pisahkan tugas berdasarkan urgensi dan kepentingan. Fokus pada yang penting tapi tidak mendesak.',
      'Kesehatan mental sangat penting! Pastikan tidur 7-8 jam, olahraga minimal 30 menit/hari, dan luangkan waktu untuk hobi. Jangan ragu untuk berbicara dengan konselor kampus jika merasa overwhelmed.',
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export function StudyBuddyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage];
      const response = await sendMessage(allMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (isMinimized || !isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => { setIsOpen(true); setUnreadCount(0); }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:shadow-indigo-500/50 transition-shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)]"
          >
            <div className="rounded-2xl bg-[#0D1117] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
              style={{ height: isMinimized ? 'auto' : '520px' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-white/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white flex items-center gap-1">
                    Study Buddy AI
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                  </p>
                  <p className="text-[10px] text-indigo-300">
                    {isLoading ? 'Sedang mengetik...' : 'Online · Siap membantu'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                          message.role === 'assistant'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                            : 'bg-gradient-to-br from-slate-600 to-slate-700'
                        }`}>
                          {message.role === 'assistant'
                            ? <Bot className="w-4 h-4 text-white" />
                            : <User className="w-4 h-4 text-white" />
                          }
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                            message.role === 'user'
                              ? 'bg-indigo-600 text-white rounded-tr-sm'
                              : 'bg-white/8 text-slate-200 rounded-tl-sm border border-white/5'
                          }`}>
                            {message.content}
                          </div>
                          <span className="text-[10px] text-slate-600 px-1">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white/8 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-indigo-400"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Prompts */}
                  {messages.length <= 1 && (
                    <div className="px-4 pb-2">
                      <p className="text-[10px] text-slate-500 mb-2">Pertanyaan cepat:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_PROMPTS.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(prompt)}
                            className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-2.5 py-1 text-slate-300 transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-3 border-t border-white/5">
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ketik pesan... (Enter untuk kirim)"
                        rows={1}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500/50 max-h-24 overflow-y-auto"
                        style={{ minHeight: '38px' }}
                      />
                      <Button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        size="sm"
                        className="w-9 h-9 p-0 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 flex-shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1.5 text-center">
                      Powered by AI · Respons mungkin tidak selalu akurat
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
