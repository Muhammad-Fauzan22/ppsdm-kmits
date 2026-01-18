"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AITutorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Halo! 👋 Saya AI Tutor PPSDM KMM. Saya bisa membantu kamu dengan:\n\n• Menjelaskan hasil assessment\n• Tips pengembangan diri\n• Motivasi dan dukungan\n\nAda yang bisa saya bantu hari ini?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai-tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(-10).map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                }),
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.error
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.reply
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Maaf, ada masalah koneksi. Coba lagi nanti ya! 😅'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickActions = [
        { emoji: '📊', text: 'Jelaskan hasil assessment saya' },
        { emoji: '💡', text: 'Tips meningkatkan produktivitas' },
        { emoji: '🧘', text: 'Cara mengelola stres kuliah' },
        { emoji: '💰', text: 'Tips mengatur keuangan mahasiswa' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 shadow-lg">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">AI Tutor</h1>
                            <p className="text-xs text-blue-100">Powered by Llama 3.3 • PPSDM KMM</p>
                        </div>
                    </div>
                    <Link href="/dashboard" className="text-sm bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                        ← Dashboard
                    </Link>
                </div>
            </header>

            {/* Chat Container */}
            <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence initial={false}>
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                                            : 'bg-white shadow-md text-gray-800 rounded-bl-sm'
                                        }`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-2 text-blue-600">
                                            <span className="text-lg">🤖</span>
                                            <span className="text-xs font-medium">AI Tutor</span>
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white shadow-md rounded-2xl px-4 py-3 rounded-bl-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🤖</span>
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 2 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-gray-500 mb-2">Coba tanyakan:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInput(action.text)}
                                    className="text-xs bg-white shadow-sm border px-3 py-2 rounded-full hover:bg-blue-50 transition flex items-center gap-1"
                                >
                                    <span>{action.emoji}</span>
                                    <span>{action.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white/80 backdrop-blur border-t">
                    <div className="max-w-4xl mx-auto flex gap-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ketik pesanmu di sini..."
                            rows={1}
                            className="flex-1 resize-none border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            style={{ maxHeight: '120px' }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className={`px-6 rounded-xl font-medium transition ${input.trim() && !isLoading
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? '...' : 'Kirim'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">
                        Didukung oleh Groq + Llama 3.3 70B • 14,400 chat gratis/hari
                    </p>
                </div>
            </div>
        </div>
    );
}
