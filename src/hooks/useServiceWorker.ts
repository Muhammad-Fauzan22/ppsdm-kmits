/**
 * React Hook untuk Service Worker
 * Memudahkan penggunaan service worker di React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  registerServiceWorker,
  unregisterServiceWorker,
  updateServiceWorker,
  skipWaiting,
  clearAllCaches,
  cacheUrls,
  isServiceWorkerReady,
  getServiceWorkerStatus,
  onServiceWorkerMessage,
  sendMessageToServiceWorker,
  requestBackgroundSync,
  requestPeriodicBackgroundSync,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getPushSubscription,
  showNotification,
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
  isServiceWorkerSupported,
  isPushSupported,
  isBackgroundSyncSupported,
  isPeriodicBackgroundSyncSupported,
  getServiceWorkerVersion,
  getCacheSize,
  formatCacheSize,
  getCacheNames,
  getCacheEntries,
  deleteCache,
  deleteCacheEntry,
  ServiceWorkerRegistrationOptions,
  ServiceWorkerConfig,
} from '@/lib/serviceWorker/serviceWorkerRegistration';

export interface UseServiceWorkerOptions {
  enabled?: boolean;
  config?: ServiceWorkerConfig;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isActivated: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isReady: boolean;
  version: string | null;
  cacheSize: number;
  cacheNames: string[];
  notificationPermission: NotificationPermission;
  isNotificationSupported: boolean;
  isPushSupported: boolean;
  isBackgroundSyncSupported: boolean;
  isPeriodicBackgroundSyncSupported: boolean;
}

export interface ServiceWorkerActions {
  register: () => Promise<ServiceWorkerRegistration | null>;
  unregister: () => Promise<boolean>;
  update: () => Promise<boolean>;
  skipWaiting: () => Promise<boolean>;
  clearCache: () => Promise<boolean>;
  cacheUrls: (urls: string[]) => Promise<boolean>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  subscribeToPush: (applicationServerKey: string) => Promise<PushSubscription | null>;
  unsubscribeFromPush: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<boolean>;
  requestBackgroundSync: (tag: string) => Promise<boolean>;
  requestPeriodicBackgroundSync: (tag: string, options: { minInterval: number }) => Promise<boolean>;
  sendMessage: (message: any) => Promise<any>;
  deleteCache: (cacheName: string) => Promise<boolean>;
  deleteCacheEntry: (cacheName: string, url: string) => Promise<boolean>;
  refreshStatus: () => Promise<void>;
  refreshCacheInfo: () => Promise<void>;
}

/**
 * Custom hook untuk service worker
 */
export function useServiceWorker(options: UseServiceWorkerOptions = {}): ServiceWorkerState & ServiceWorkerActions {
  const {
    enabled = true,
    config,
    onUpdate,
    onSuccess,
    onError,
  } = options;

  // State
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: isServiceWorkerSupported(),
    isRegistered: false,
    isActivated: false,
    isInstalling: false,
    isWaiting: false,
    isReady: false,
    version: null,
    cacheSize: 0,
    cacheNames: [],
    notificationPermission: 'default',
    isNotificationSupported: isNotificationSupported(),
    isPushSupported: isPushSupported(),
    isBackgroundSyncSupported: isBackgroundSyncSupported(),
    isPeriodicBackgroundSyncSupported: isPeriodicBackgroundSyncSupported(),
  });

  // Ref untuk cleanup
  const cleanupRef = useRef<(() => void) | null>(null);

  // Refresh status
  const refreshStatus = useCallback(async () => {
    const status = await getServiceWorkerStatus();
    const ready = await isServiceWorkerReady();
    const version = await getServiceWorkerVersion();
    const permission = await getNotificationPermission();

    setState((prev) => ({
      ...prev,
      ...status,
      isReady: ready,
      version,
      notificationPermission: permission,
    }));
  }, []);

  // Refresh cache info
  const refreshCacheInfo = useCallback(async () => {
    const size = await getCacheSize();
    const names = await getCacheNames();

    setState((prev) => ({
      ...prev,
      cacheSize: size,
      cacheNames: names,
    }));
  }, []);

  // Register service worker
  const register = useCallback(async () => {
    if (!enabled) {
      console.log('[useServiceWorker] Service worker is disabled');
      return null;
    }

    try {
      const registration = await registerServiceWorker(config, {
        onUpdate: (reg) => {
          onUpdate?.(reg);
          refreshStatus();
        },
        onSuccess: (reg) => {
          onSuccess?.(reg);
          refreshStatus();
        },
        onError: (error) => {
          onError?.(error);
        },
      });

      await refreshStatus();
      await refreshCacheInfo();

      return registration;
    } catch (error) {
      onError?.(error as Error);
      return null;
    }
  }, [enabled, config, onUpdate, onSuccess, onError, refreshStatus, refreshCacheInfo]);

  // Unregister service worker
  const unregister = useCallback(async () => {
    const result = await unregisterServiceWorker();
    await refreshStatus();
    return result;
  }, [refreshStatus]);

  // Update service worker
  const update = useCallback(async () => {
    const result = await updateServiceWorker();
    await refreshStatus();
    return result;
  }, [refreshStatus]);

  // Skip waiting
  const skipWaitingAction = useCallback(async () => {
    const result = await skipWaiting();
    await refreshStatus();
    return result;
  }, [refreshStatus]);

  // Clear cache
  const clearCache = useCallback(async () => {
    const result = await clearAllCaches();
    await refreshCacheInfo();
    return result;
  }, [refreshCacheInfo]);

  // Cache URLs
  const cacheUrlsAction = useCallback(async (urls: string[]) => {
    const result = await cacheUrls(urls);
    await refreshCacheInfo();
    return result;
  }, [refreshCacheInfo]);

  // Request notification permission
  const requestNotificationPermissionAction = useCallback(async () => {
    const permission = await requestNotificationPermission();
    setState((prev) => ({
      ...prev,
      notificationPermission: permission,
    }));
    return permission;
  }, []);

  // Subscribe to push notifications
  const subscribeToPushAction = useCallback(async (applicationServerKey: string) => {
    const subscription = await subscribeToPushNotifications(applicationServerKey);
    return subscription;
  }, []);

  // Unsubscribe from push notifications
  const unsubscribeFromPushAction = useCallback(async () => {
    const result = await unsubscribeFromPushNotifications();
    return result;
  }, []);

  // Show notification
  const showNotificationAction = useCallback(async (title: string, options?: NotificationOptions) => {
    const result = await showNotification(title, options);
    return result;
  }, []);

  // Request background sync
  const requestBackgroundSyncAction = useCallback(async (tag: string) => {
    const result = await requestBackgroundSync(tag);
    return result;
  }, []);

  // Request periodic background sync
  const requestPeriodicBackgroundSyncAction = useCallback(async (
    tag: string,
    options: { minInterval: number }
  ) => {
    const result = await requestPeriodicBackgroundSync(tag, options);
    return result;
  }, []);

  // Send message to service worker
  const sendMessageAction = useCallback(async (message: any) => {
    const response = await sendMessageToServiceWorker(message);
    return response;
  }, []);

  // Delete cache
  const deleteCacheAction = useCallback(async (cacheName: string) => {
    const result = await deleteCache(cacheName);
    await refreshCacheInfo();
    return result;
  }, [refreshCacheInfo]);

  // Delete cache entry
  const deleteCacheEntryAction = useCallback(async (cacheName: string, url: string) => {
    const result = await deleteCacheEntry(cacheName, url);
    await refreshCacheInfo();
    return result;
  }, [refreshCacheInfo]);

  // Initialize service worker
  useEffect(() => {
    if (!enabled || !state.isSupported) {
      return;
    }

    // Register service worker
    register();

    // Listen for messages
    const cleanup = onServiceWorkerMessage((event) => {
      console.log('[useServiceWorker] Message received:', event.data);
      
      // Handle specific message types
      if (event.data.type === 'CACHE_UPDATED') {
        refreshCacheInfo();
      } else if (event.data.type === 'STATUS_UPDATE') {
        refreshStatus();
      }
    });

    cleanupRef.current = cleanup;

    // Cleanup on unmount
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [enabled, state.isSupported, register, refreshStatus, refreshCacheInfo]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('[useServiceWorker] Online');
      refreshStatus();
    };

    const handleOffline = () => {
      console.log('[useServiceWorker] Offline');
      refreshStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshStatus]);

  return {
    ...state,
    register,
    unregister,
    update,
    skipWaiting: skipWaitingAction,
    clearCache,
    cacheUrls: cacheUrlsAction,
    requestNotificationPermission: requestNotificationPermissionAction,
    subscribeToPush: subscribeToPushAction,
    unsubscribeFromPush: unsubscribeFromPushAction,
    showNotification: showNotificationAction,
    requestBackgroundSync: requestBackgroundSyncAction,
    requestPeriodicBackgroundSync: requestPeriodicBackgroundSyncAction,
    sendMessage: sendMessageAction,
    deleteCache: deleteCacheAction,
    deleteCacheEntry: deleteCacheEntryAction,
    refreshStatus,
    refreshCacheInfo,
  };
}

/**
 * Hook untuk mendapatkan status service worker
 */
export function useServiceWorkerStatus() {
  const [status, setStatus] = useState({
    isSupported: isServiceWorkerSupported(),
    isRegistered: false,
    isActivated: false,
    isInstalling: false,
    isWaiting: false,
    isReady: false,
  });

   const refreshStatus = useCallback(async () => {
    const swStatus = await getServiceWorkerStatus();
    const ready = await isServiceWorkerReady();
    setStatus(prev => ({
      ...prev,
      ...swStatus,
      isReady: ready,
    }));
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return { ...status, refreshStatus };
}

/**
 * Hook untuk mendapatkan informasi cache
 */
export function useServiceWorkerCache() {
  const [cacheInfo, setCacheInfo] = useState({
    size: 0,
    names: [] as string[],
  });

  const refreshCacheInfo = useCallback(async () => {
    const size = await getCacheSize();
    const names = await getCacheNames();
    setCacheInfo({ size, names });
  }, []);

  useEffect(() => {
    refreshCacheInfo();
  }, [refreshCacheInfo]);

  return {
    ...cacheInfo,
    formattedSize: formatCacheSize(cacheInfo.size),
    refreshCacheInfo,
    getCacheEntries,
    deleteCache,
    deleteCacheEntry,
  };
}

/**
 * Hook untuk notifikasi
 */
export function useServiceWorkerNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const refreshPermission = useCallback(async () => {
    const perm = await getNotificationPermission();
    setPermission(perm);
  }, []);

  const refreshSubscription = useCallback(async () => {
    const sub = await getPushSubscription();
    setSubscription(sub);
  }, []);

  useEffect(() => {
    refreshPermission();
    refreshSubscription();
  }, [refreshPermission, refreshSubscription]);

  return {
    permission,
    subscription,
    isSupported: isNotificationSupported(),
    isPushSupported: isPushSupported(),
    requestPermission: requestNotificationPermission,
    subscribe: subscribeToPushNotifications,
    unsubscribe: unsubscribeFromPushNotifications,
    showNotification,
    refreshPermission,
    refreshSubscription,
  };
}

/**
 * Hook untuk background sync
 */
export function useServiceWorkerSync() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isBackgroundSyncSupported());
  }, []);

  return {
    isSupported,
    isPeriodicSupported: isPeriodicBackgroundSyncSupported(),
    requestSync: requestBackgroundSync,
    requestPeriodicSync: requestPeriodicBackgroundSync,
  };
}

/**
 * Hook untuk service worker messages
 */
export function useServiceWorkerMessages(callback: (event: MessageEvent) => void) {
  useEffect(() => {
    const cleanup = onServiceWorkerMessage(callback);
    return cleanup;
  }, [callback]);
}
