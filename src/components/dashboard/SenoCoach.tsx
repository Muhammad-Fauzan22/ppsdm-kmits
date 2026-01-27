"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Bot, User } from "lucide-react";
import Image from "next/image";
import { ASSETS } from "@/config/assets"; // Menggunakan aset dinamis kita

interface SenoCoachProps {
    userProfile: any;
    holisticScores: any;
}

export function SenoCoach({ userProfile, holisticScores }: SenoCoachProps) {
    const [messages, setMessages] = useState<any[]>([
        {
            role: "assistant",
            content: `Halo ${userProfile?.name?.split(' ')[0] || 'Kawan'}! 👋 Saya Seno.
      
Saya melihat perkembangan Personal Development kamu. Ada yang ingin didiskusikan hari ini?`
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Panggil API Route untuk chat
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    context: {
                        user: userProfile,
                        scores: holisticScores // Kirim skor agar AI "pintar"
                    }
                }),
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Maaf, Seno lagi pusing. Coba lagi nanti ya." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[500px] shadow-xl border-t-4 border-t-its-blue">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b flex items-center gap-3">
                <div className="relative size-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
                    {/* Fallback avatar if asset fails (though assets.ts handles placeholders) */}
                    <Image
                        src={ASSETS.mascot.seno_studio || "/images/placeholder.png"}
                        alt="Seno"
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-bold text-its-dark">Seno AI Coach</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="size-2 bg-green-500 rounded-full animate-pulse" /> Online
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-4 bg-slate-50/50">
                <div className="space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`size-8 rounded-full flex items-center justify-center shrink-0 
                ${m.role === 'user' ? 'bg-slate-200' : 'bg-its-blue text-white'}`}>
                                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm
                ${m.role === 'user'
                                    ? 'bg-white text-slate-800 rounded-tr-none'
                                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="size-8 bg-its-blue/20 rounded-full animate-pulse" />
                            <div className="text-xs text-slate-400 self-center">Seno sedang berpikir...</div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t flex gap-2">
                <Input
                    placeholder="Tanya saran pengembangan diri..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="focus-visible:ring-its-blue"
                />
                <Button onClick={handleSend} disabled={loading} className="bg-its-blue hover:bg-its-light">
                    <Send size={18} />
                </Button>
            </div>
        </Card>
    );
}
