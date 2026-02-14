
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check for iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        if (isIosDevice && !(window as any).navigator.standalone) {
            setIsIOS(true);
            setIsVisible(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (isIOS) {
            // Show iOS instructions (modal or toast, currently just staying visible with custom text)
            return;
        }

        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 left-4 z-50 shadow-lg"
            >
                <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center gap-4 border border-slate-700 max-w-sm">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Download className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm">Install App</h4>
                        {isIOS ? (
                            <p className="text-xs text-slate-300">
                                Tap <span className="font-bold">Share</span> lalu pilih <span className="font-bold">Add to Home Screen</span>.
                            </p>
                        ) : (
                            <p className="text-xs text-slate-300">Tambahkan ke Home Screen untuk akses lebih cepat.</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleClose}>
                            <X className="w-4 h-4" />
                        </Button>
                        {!isIOS && (
                            <Button size="sm" onClick={handleInstall} className="bg-blue-600 hover:bg-blue-500 text-white">
                                Install
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
