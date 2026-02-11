/**
 * Service Worker Registration Helper
 * Memudahkan pendaftaran dan manajemen service worker
 */

export interface ServiceWorkerRegistrationOptions {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export interface ServiceWorkerConfig {
  enabled: boolean;
  swPath: string;
  scope?: string;
}

/**
 * Default service worker configuration
 */
export const defaultSWConfig: ServiceWorkerConfig = {
  enabled: process.env.NODE_ENV === 'production',
  swPath: '/sw.js',
  scope: '/',
};

/**
 * Register service worker
 */
export function registerServiceWorker(
  config: ServiceWorkerConfig = defaultSWConfig,
  options?: ServiceWorkerRegistrationOptions
): Promise<ServiceWorkerRegistration | null> {
  return new Promise((resolve, reject) => {
    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      resolve(null);
      return;
    }

    // Check if service worker is enabled
    if (!config.enabled) {
      resolve(null);
      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register(config.swPath, { scope: config.scope })
      .then((registration) => {
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is available
                options?.onUpdate?.(registration);
              }
            });
          }
        });

        // Success callback
        options?.onSuccess?.(registration);
        resolve(registration);
      })
      .catch((error) => {
        options?.onError?.(error);
        reject(error);
      });
  });
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  try {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    
    if (registration) {
      await registration.unregister();
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get current service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  try {
    if (!('serviceWorker' in navigator)) {
      return null;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    return registration || null;
  } catch (error) {
    return null;
  }
}

/**
 * Update service worker
 */
export async function updateServiceWorker(): Promise<boolean> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      return false;
    }

    await registration.update();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Skip waiting and activate new service worker
 */
export async function skipWaiting(): Promise<boolean> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration || !registration.waiting) {
      return false;
    }

    // Send message to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<boolean> {
  try {
    if (!('caches' in window)) {
      return false;
    }

    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Cache specific URLs
 */
export async function cacheUrls(urls: string[]): Promise<boolean> {
  try {
    if (!('caches' in window)) {
      return false;
    }

    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      return false;
    }

    // Send message to service worker
    registration.active?.postMessage({ type: 'CACHE_URLS', urls });
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if service worker is ready
 */
export async function isServiceWorkerReady(): Promise<boolean> {
  try {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    const registration = await getServiceWorkerRegistration();
    return registration !== null && registration.active !== undefined;
  } catch (error) {
    return false;
  }
}

/**
 * Get service worker status
 */
export async function getServiceWorkerStatus(): Promise<{
  isRegistered: boolean;
  isActivated: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
}> {
  try {
    if (!('serviceWorker' in navigator)) {
      return {
        isRegistered: false,
        isActivated: false,
        isInstalling: false,
        isWaiting: false,
      };
    }

    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      return {
        isRegistered: false,
        isActivated: false,
        isInstalling: false,
        isWaiting: false,
      };
    }

    return {
      isRegistered: true,
      isActivated: registration.active !== undefined,
      isInstalling: registration.installing !== undefined,
      isWaiting: registration.waiting !== undefined,
    };
  } catch (error) {
    return {
      isRegistered: false,
      isActivated: false,
      isInstalling: false,
      isWaiting: false,
    };
  }
}

/**
 * Listen for service worker messages
 */
export function onServiceWorkerMessage(
  callback: (event: MessageEvent) => void
): () => void {
  if (!('serviceWorker' in navigator)) {
    return () => {};
  }

  const handler = (event: MessageEvent) => {
    callback(event);
  };

  navigator.serviceWorker.addEventListener('message', handler);

  // Return cleanup function
  return () => {
    navigator.serviceWorker.removeEventListener('message', handler);
  };
}

/**
 * Send message to service worker
 */
export async function sendMessageToServiceWorker(
  message: any
): Promise<any> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration || !registration.active) {
      throw new Error('No active service worker');
    }

    // Create a channel for response
    const messageChannel = new MessageChannel();
    const activeWorker = registration.active;
    
    return new Promise((resolve, reject) => {
      messageChannel.port1.onmessage = (event) => {
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
      };

      activeWorker.postMessage(message, [messageChannel.port2]);
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Request background sync
 */
export async function requestBackgroundSync(tag: string): Promise<boolean> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      return false;
    }

    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Request periodic background sync
 */
export async function requestPeriodicBackgroundSync(
  tag: string,
  options: { minInterval: number }
): Promise<boolean> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      return false;
    }

    if ('periodicSync' in registration) {
      await (registration as any).periodicSync.register(tag, options);
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(
  applicationServerKey: string
): Promise<PushSubscription | null> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      return null;
    }

    if (!registration.pushManager) {
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    return subscription;
  } catch (error) {
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get push subscription
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration || !registration.pushManager) {
      return null;
    }

    return await registration.pushManager.getSubscription();
  } catch (error) {
    return null;
  }
}

/**
 * Show notification
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<boolean> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      return false;
    }

    if (!('showNotification' in registration)) {
      return false;
    }

    await registration.showNotification(title, options);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get notifications permission
 */
export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  return 'PushManager' in window;
}

/**
 * Check if background sync is supported
 */
export function isBackgroundSyncSupported(): boolean {
  return 'serviceWorker' in navigator && 'SyncManager' in window;
}

/**
 * Check if periodic background sync is supported
 */
export function isPeriodicBackgroundSyncSupported(): boolean {
  return 'serviceWorker' in navigator && 'PeriodicSyncManager' in window;
}

/**
 * Get service worker version
 */
export async function getServiceWorkerVersion(): Promise<string | null> {
  try {
    const registration = await getServiceWorkerRegistration();
    
    if (!registration || !registration.active) {
      return null;
    }

    // Send message to get version
    const response = await sendMessageToServiceWorker({ type: 'GET_VERSION' });
    return response?.version || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<number> {
  try {
    if (!('caches' in window)) {
      return 0;
    }

    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  } catch (error) {
    return 0;
  }
}

/**
 * Format cache size to human readable format
 */
export function formatCacheSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Get cache names
 */
export async function getCacheNames(): Promise<string[]> {
  try {
    if (!('caches' in window)) {
      return [];
    }

    return await caches.keys();
  } catch (error) {
    return [];
  }
}

/**
 * Get cache entries
 */
export async function getCacheEntries(cacheName: string): Promise<Array<{ url: string; size: number }>> {
  try {
    if (!('caches' in window)) {
      return [];
    }

    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const entries: Array<{ url: string; size: number }> = [];

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        entries.push({
          url: request.url,
          size: blob.size,
        });
      }
    }

    return entries;
  } catch (error) {
    return [];
  }
}

/**
 * Delete specific cache
 */
export async function deleteCache(cacheName: string): Promise<boolean> {
  try {
    if (!('caches' in window)) {
      return false;
    }

    await caches.delete(cacheName);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Delete specific cache entry
 */
export async function deleteCacheEntry(
  cacheName: string,
  url: string
): Promise<boolean> {
  try {
    if (!('caches' in window)) {
      return false;
    }

    const cache = await caches.open(cacheName);
    await cache.delete(url);
    return true;
  } catch (error) {
    return false;
  }
}
