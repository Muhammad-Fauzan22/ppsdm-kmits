'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, BookOpen, Sparkles, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface KimiTutorProps {
  userId: string;
  contextType?: string;
  contextId?: string;
  className?: string;
}

export function KimiTutor({ userId, contextType = 'general', contextId, className }: KimiTutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: 'welcome', role: 'assistant', content: "Hi! I'm Kimi, your AI learning assistant. What would you like to learn today?", timestamp: new Date(), suggestions: ['What courses do you recommend?', 'Help me create a study plan'] }]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMessage.content, contextType, contextId, userId }) });
      const data = await response.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response, timestamp: new Date(), suggestions: data.suggestions }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm having trouble responding. Please try again.", timestamp: new Date() }]);
    } finally { setIsLoading(false); }
  };

  if (!isOpen) {
    return (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button onClick={() => setIsOpen(true)} size="lg" className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-violet-600 to-indigo-600"><Bot className="h-6 w-6" /></Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("fixed bottom-6 right-6 z-50 w-96 h-[500px] shadow-2xl rounded-2xl overflow-hidden bg-background border flex flex-col", className)}>
      <div className="p-4 border-b bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white/30"><AvatarFallback className="bg-white/20"><Bot className="h-5 w-5 text-white" /></AvatarFallback></Avatar>
          <div><h3 className="font-semibold">Kimi AI Tutor</h3><p className="text-xs text-white/70 flex items-center gap-1"><Sparkles className="h-3 w-3" />{contextType}</p></div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"><X className="h-4 w-4" /></Button>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.role === 'user' ? "flex-row-reverse" : "")}>
              <Avatar className={cn("h-8 w-8 shrink-0", message.role === 'user' ? "bg-primary" : "bg-violet-100")}><AvatarFallback>{message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-violet-600" />}</AvatarFallback></Avatar>
              <div className={cn("flex flex-col gap-2 max-w-[80%]", message.role === 'user' ? "items-end" : "items-start")}>
                <div className={cn("px-4 py-2.5 rounded-2xl text-sm", message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>{message.content}</div>
                {message.suggestions && message.role === 'assistant' && (
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((s, idx) => (<button key={idx} onClick={() => { setInput(s); setTimeout(handleSend, 100); }} className="text-xs px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200">{s}</button>))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (<div className="flex gap-3"><Avatar className="h-8 w-8 bg-violet-100"><AvatarFallback><Bot className="h-4 w-4 text-violet-600" /></AvatarFallback></Avatar><div className="bg-muted px-4 py-2.5 rounded-2xl"><div className="flex gap-1"><span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" /><span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div></div></div>)}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Kimi anything..." className="flex-1" disabled={isLoading} />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="shrink-0 bg-violet-600 hover:bg-violet-700">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button>
        </div>
      </div>
    </motion.div>
  );
}

export default KimiTutor;
