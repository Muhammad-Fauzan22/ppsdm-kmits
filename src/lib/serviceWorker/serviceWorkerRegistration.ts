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
      console.warn('[Service Worker] Service worker is not supported');
      resolve(null);
      return;
    }

    // Check if service worker is enabled
    if (!config.enabled) {
      console.log('[Service Worker] Service worker is disabled');
      resolve(null);
      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register(config.swPath, { scope: config.scope })
      .then((registration) => {
        console.log('[Service Worker] Registered successfully:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is available
                console.log('[Service Worker] New service worker available');
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
        console.error('[Service Worker] Registration failed:', error);
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
      console.warn('[Service Worker] Service worker is not supported');
      return false;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    
    if (registration) {
      await registration.unregister();
      console.log('[Service Worker] Unregistered successfully');
      return true;
    }

    console.log('[Service Worker] No service worker to unregister');
    return false;
  } catch (error) {
    console.error('[Service Worker] Unregistration failed:', error);
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

    return await navigator.serviceWorker.getRegistration();
  } catch (error) {
    console.error('[Service Worker] Failed to get registration:', error);
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
      console.warn('[Service Worker] No service worker to update');
      return false;
    }

    await registration.update();
    console.log('[Service Worker] Update requested');
    return true;
  } catch (error) {
    console.error('[Service Worker] Update failed:', error);
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
      console.warn('[Service Worker] No waiting service worker');
      return false;
    }

    // Send message to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    console.log('[Service Worker] Skip waiting requested');
    return true;
  } catch (error) {
    console.error('[Service Worker] Skip waiting failed:', error);
    return false;
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<boolean> {
  try {
    if (!('caches' in window)) {
      console.warn('[Service Worker] Cache API is not supported');
      return false;
    }

    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    
    console.log('[Service Worker] All caches cleared');
    return true;
  } catch (error) {
    console.error('[Service Worker] Failed to clear caches:', error);
    return false;
  }
}

/**
 * Cache specific URLs
 */
export async function cacheUrls(urls: string[]): Promise<boolean> {
  try {
    if (!('caches' in window)) {
      console.warn('[Service Worker] Cache API is not supported');
      return false;
    }

    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      console.warn('[Service Worker] No service worker registered');
      return false;
    }

    // Send message to service worker
    registration.active?.postMessage({ type: 'CACHE_URLS', urls });
    
    console.log('[Service Worker] Cache URLs requested:', urls);
    return true;
  } catch (error) {
    console.error('[Service Worker] Failed to cache URLs:', error);
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
    console.error('[Service Worker] Failed to check readiness:', error);
    return false;
  }
}

/**
 * Get service worker status
 */
export async function getServiceWorkerStatus(): Promise<{
  registered: boolean;
  activated: boolean;
  installing: boolean;
  waiting: boolean;
}> {
  try {
    if (!('serviceWorker' in navigator)) {
      return {
        registered: false,
        activated: false,
        installing: false,
        waiting: false,
      };
    }

    const registration = await getServiceWorkerRegistration();
    
    if (!registration) {
      return {
        registered: false,
        activated: false,
        installing: false,
        waiting: false,
      };
    }

    return {
      registered: true,
      activated: registration.active !== undefined,
      installing: registration.installing !== undefined,
      waiting: registration.waiting !== undefined,
    };
  } catch (error) {
    console.error('[Service Worker] Failed to get status:', error);
    return {
      registered: false,
      activated: false,
      installing: false,
      waiting: false,
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
    
    return new Promise((resolve, reject) => {
      messageChannel.port1.onmessage = (event) => {
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
      };

      registration.active.postMessage(message, [messageChannel.port2]);
    });
  } catch (error) {
    console.error('[Service Worker] Failed to send message:', error);
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
      console.warn('[Service Worker] No service worker registered');
      return false;
    }

    if ('sync' in registration) {
      await registration.sync.register(tag);
      console.log('[Service Worker] Background sync requested:', tag);
      return true;
    }

    console.warn('[Service Worker] Background sync is not supported');
    return false;
  } catch (error) {
    console.error('[Service Worker] Failed to request background sync:', error);
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
      console.warn('[Service Worker] No service worker registered');
      return false;
    }

    if ('periodicSync' in registration) {
      await (registration as any).periodicSync.register(tag, options);
      console.log('[Service Worker] Periodic background sync requested:', tag);
      return true;
    }

    console.warn('[Service Worker] Periodic background sync is not supported');
    return false;
  } catch (error) {
    console.error('[Service Worker] Failed to request periodic background sync:', error);
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
      console.warn('[Service Worker] No service worker registered');
      return null;
    }

    if (!registration.pushManager) {
      console.warn('[Service Worker] Push manager is not available');
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    console.log('[Service Worker] Push subscription created:', subscription);
    return subscription;
  } catch (error) {
    console.error('[Service Worker] Failed to subscribe to push:', error);
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
      console.warn('[Service Worker] No service worker registered');
      return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log('[Service Worker] Push subscription removed');
      return true;
    }

    console.log('[Service Worker] No push subscription to remove');
    return false;
  } catch (error) {
    console.error('[Service Worker] Failed to unsubscribe from push:', error);
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
    console.error('[Service Worker] Failed to get push subscription:', error);
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
      console.warn('[Service Worker] No service worker registered');
      return false;
    }

    if (!('showNotification' in registration)) {
      console.warn('[Service Worker] Show notification is not supported');
      return false;
    }

    await registration.showNotification(title, options);
    console.log('[Service Worker] Notification shown:', title);
    return true;
  } catch (error) {
    console.error('[Service Worker] Failed to show notification:', error);
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
    console.warn('[Service Worker] Notification API is not supported');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  console.log('[Service Worker] Notification permission:', permission);
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
    console.error('[Service Worker] Failed to get version:', error);
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
    console.error('[Service Worker] Failed to get cache size:', error);
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
    console.error('[Service Worker] Failed to get cache names:', error);
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
    console.error('[Service Worker] Failed to get cache entries:', error);
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
    console.log('[Service Worker] Cache deleted:', cacheName);
    return true;
  } catch (error) {
    console.error('[Service Worker] Failed to delete cache:', error);
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
    console.log('[Service Worker] Cache entry deleted:', url);
    return true;
  } catch (error) {
    console.error('[Service Worker] Failed to delete cache entry:', error);
    return false;
  }
}
