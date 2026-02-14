
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

const PUBLIC_KEY = 'BF1vSREhL13WblE0fB0gNU75IG-STyRGV474oMTmixvp86yKTCOTaMe9PcthUDqIFzTfzIzhifnyaKtHnqKLfjs'; // Generated VAPID Public Key

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            registerServiceWorker();
        } else {
            setLoading(false);
        }
    }, []);

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);
            setLoading(false);
        } catch (error) {
            console.error('Error checking subscription:', error);
            setLoading(false);
        }
    }

    async function subscribeToPush() {
        try {
            setLoading(true);
            const registration = await navigator.serviceWorker.ready;

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
            });

            setSubscription(sub);

            // Save to backend
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sub),
            });

            toast.success('Notifikasi diaktifkan!', {
                description: 'Anda akan menerima pengingat aktivitas harian.'
            });
        } catch (error) {
            console.error('Failed to subscribe:', error);
            toast.error('Gagal mengaktifkan notifikasi', {
                description: 'Pastikan Anda mengizinkan notifikasi di browser.'
            });
        } finally {
            setLoading(false);
        }
    }

    async function unsubscribeFromPush() {
        // Logic for unsubscribing if needed
        // Ideally we also tell the backend to delete, but for now just frontend cleanup
        // But clearing permission usually requires browser settings.
        // We can just invalidate the subscription on backend.
        toast.info('Untuk mematikan, silakan atur di pengaturan browser Anda.');
    }

    if (!isSupported) return null;

    return (
        <div className="fixed bottom-4 right-4 z-40 hidden md:block">
            {/* Only show if not subscribed or for testing. 
            For production, best to have this in a Settings page, 
            but for verification we can make it a floating actionable or just part of settings.
            Let's make it a small icon button if not subscribed.
        */}
            {!subscription && !loading && (
                <Button
                    onClick={subscribeToPush}
                    className="rounded-full h-12 w-12 shadow-lg bg-brand-blue hover:bg-brand-blue/90"
                    size="icon"
                    title="Aktifkan Notifikasi"
                >
                    <Bell className="h-6 w-6 text-white" />
                </Button>
            )}
        </div>
    );
}
