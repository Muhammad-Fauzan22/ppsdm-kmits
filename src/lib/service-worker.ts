/**
 * Service Worker Registration
 * 
 * Registers the Service Worker for PWA functionality
 * Handles updates, offline detection, and push notifications
 * 
 * @version 2.0.0
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Workers not supported');
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = '/sw.js';

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[SW] Registered:', registration.scope);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              showUpdateNotification(newWorker);
            }
          });
        });
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });

    // Listen for messages from SW
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'UPDATE_AVAILABLE') {
        showUpdateNotification();
      }
    });
  });
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

function showUpdateNotification(worker?: ServiceWorker) {
  // Show update notification to user
  if (confirm('A new version of PPSDM is available. Update now?')) {
    if (worker) {
      worker.postMessage('skipWaiting');
    }
    window.location.reload();
  }
}

// Check online/offline status
export function initOfflineDetection() {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    console.log('[App] Back online');
    // Sync queued data
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if ('sync' in registration) {
          (registration as any).sync.register('sync-assessments');
        }
      });
    }
  });

  window.addEventListener('offline', () => {
    console.log('[App] Gone offline');
  });
}

// Request push notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('[Push] Notifications not supported');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Subscribe to push notifications
export async function subscribeToPush() {
  if (!('serviceWorker' in navigator)) return null;

  const registration = await navigator.serviceWorker.ready;

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      ),
    });

    // Send subscription to server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (error) {
    console.error('[Push] Subscription failed:', error);
    return null;
  }
}

// Utility: Convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Default export
export default {
  register: registerServiceWorker,
  unregister: unregisterServiceWorker,
  initOfflineDetection,
  requestNotificationPermission,
  subscribeToPush,
};
