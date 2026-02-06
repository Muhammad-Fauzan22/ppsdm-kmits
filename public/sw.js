/**
 * Service Worker untuk PPSDM KMITS
 * Mendukung offline capability dan caching strategi
 */

const CACHE_NAME = 'ppsdm-kmits-v1';
const RUNTIME_CACHE = 'ppsdm-kmits-runtime-v1';

// URL yang akan di-cache saat install
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/images/lambang-its-bundar.png',
];

// API routes yang akan di-cache
const API_CACHE_PATTERNS = [
  /^\/api\/courses/,
  /^\/api\/assessment/,
];

// Asset patterns yang akan di-cache
const ASSET_CACHE_PATTERNS = [
  /\.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/,
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only',
};

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[Service Worker] Caching static assets...');
        await cache.addAll(STATIC_CACHE_URLS);
        console.log('[Service Worker] Static assets cached');
      } catch (error) {
        console.error('[Service Worker] Failed to cache static assets:', error);
      }
    })()
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    (async () => {
      try {
        // Get all cache names
        const cacheNames = await caches.keys();
        
        // Delete old caches
        const oldCaches = cacheNames.filter((name) => 
          name !== CACHE_NAME && name !== RUNTIME_CACHE
        );
        
        await Promise.all(
          oldCaches.map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
        );

        console.log('[Service Worker] Old caches cleaned up');
      } catch (error) {
        console.error('[Service Worker] Failed to clean up old caches:', error);
      }
    })()
  );

  // Take control of all pages immediately
  self.clients.claim();
});

/**
 * Fetch event - handle requests with cache strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine cache strategy based on request type
  const strategy = determineCacheStrategy(request, url);

  // Apply cache strategy
  event.respondWith(handleRequest(request, strategy));
});

/**
 * Determine cache strategy based on request type
 */
function determineCacheStrategy(request, url) {
  // Static assets - Cache First
  if (ASSET_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }

  // API routes - Network First with fallback
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }

  // HTML pages - Network First with offline fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }

  // Default - Stale While Revalidate
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
}

/**
 * Handle request with specified cache strategy
 */
async function handleRequest(request, strategy) {
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request);
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request);
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request);
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return networkOnly(request);
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cacheOnly(request);
    default:
      return networkFirst(request);
  }
}

/**
 * Cache First Strategy
 * Serve from cache, fallback to network
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('[Service Worker] Cache First: Serving from cache', request.url);
      return cachedResponse;
    }

    console.log('[Service Worker] Cache First: Fetching from network', request.url);
    const networkResponse = await fetch(request);
    
    // Cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache First error:', error);
    throw error;
  }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache, then offline page
 */
async function networkFirst(request) {
  try {
    console.log('[Service Worker] Network First: Fetching from network', request.url);
    const networkResponse = await fetch(request);

    // Cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network First: Network failed, trying cache', request.url);
    
    try {
      const cachedResponse = await caches.match(request);
      
      if (cachedResponse) {
        console.log('[Service Worker] Network First: Serving from cache', request.url);
        return cachedResponse;
      }

      // If HTML request and no cache, serve offline page
      if (request.headers.get('accept')?.includes('text/html')) {
        console.log('[Service Worker] Network First: Serving offline page');
        const offlineResponse = await caches.match('/offline');
        return offlineResponse || new Response('Offline', { status: 503 });
      }

      throw error;
    } catch (cacheError) {
      console.error('[Service Worker] Network First: Cache also failed', cacheError);
      throw cacheError;
    }
  }
}

/**
 * Stale While Revalidate Strategy
 * Serve from cache, then update in background
 */
async function staleWhileRevalidate(request) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);

    // Fetch in background
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    });

    // Return cached response immediately if available
    if (cachedResponse) {
      console.log('[Service Worker] Stale While Revalidate: Serving from cache', request.url);
      // Wait for network response in background
      fetchPromise.catch((error) => {
        console.error('[Service Worker] Stale While Revalidate: Background fetch failed', error);
      });
      return cachedResponse;
    }

    // If no cache, wait for network
    console.log('[Service Worker] Stale While Revalidate: No cache, fetching from network', request.url);
    return fetchPromise;
  } catch (error) {
    console.error('[Service Worker] Stale While Revalidate error:', error);
    throw error;
  }
}

/**
 * Network Only Strategy
 * Always fetch from network, no caching
 */
async function networkOnly(request) {
  try {
    console.log('[Service Worker] Network Only: Fetching from network', request.url);
    return await fetch(request);
  } catch (error) {
    console.error('[Service Worker] Network Only error:', error);
    throw error;
  }
}

/**
 * Cache Only Strategy
 * Only serve from cache, no network requests
 */
async function cacheOnly(request) {
  try {
    console.log('[Service Worker] Cache Only: Serving from cache', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    throw new Error('No cache found');
  } catch (error) {
    console.error('[Service Worker] Cache Only error:', error);
    throw error;
  }
}

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
  const { data } = event;

  switch (data.type) {
    case 'SKIP_WAITING':
      console.log('[Service Worker] Skip waiting requested');
      self.skipWaiting();
      break;
    case 'CLEAR_CACHE':
      console.log('[Service Worker] Clear cache requested');
      clearAllCaches();
      break;
    case 'CACHE_URLS':
      console.log('[Service Worker] Cache URLs requested', data.urls);
      cacheUrls(data.urls);
      break;
    default:
      console.log('[Service Worker] Unknown message type:', data.type);
  }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((name) => caches.delete(name))
    );
    console.log('[Service Worker] All caches cleared');
  } catch (error) {
    console.error('[Service Worker] Failed to clear caches:', error);
  }
}

/**
 * Cache specific URLs
 */
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.addAll(urls);
    console.log('[Service Worker] URLs cached:', urls);
  } catch (error) {
    console.error('[Service Worker] Failed to cache URLs:', error);
  }
}

/**
 * Sync event - handle background sync
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

/**
 * Sync data with server
 */
async function syncData() {
  try {
    console.log('[Service Worker] Syncing data...');
    
    // Get pending data from IndexedDB
    const pendingData = await getPendingData();
    
    // Sync each pending item
    for (const item of pendingData) {
      try {
        await syncItem(item);
        await removePendingData(item.id);
      } catch (error) {
        console.error('[Service Worker] Failed to sync item:', item, error);
      }
    }

    console.log('[Service Worker] Data synced successfully');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

/**
 * Get pending data from IndexedDB
 */
async function getPendingData() {
  // This would typically use IndexedDB to store pending data
  // For now, return empty array
  return [];
}

/**
 * Sync a single item
 */
async function syncItem(item) {
  // This would typically send the item to the server
  console.log('[Service Worker] Syncing item:', item);
}

/**
 * Remove pending data from IndexedDB
 */
async function removePendingData(id) {
  // This would typically remove the item from IndexedDB
  console.log('[Service Worker] Removing pending data:', id);
}

/**
 * Push event - handle push notifications
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push event received');

  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/icon-192x192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'PPSDM KMITS', options)
  );
});

/**
 * Notification click event
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.notification);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * Periodic background sync
 */
self.addEventListener('periodicsync', (event) => {
  console.log('[Service Worker] Periodic sync:', event.tag);

  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

/**
 * Update content in background
 */
async function updateContent() {
  try {
    console.log('[Service Worker] Updating content...');
    
    // Fetch latest content
    const response = await fetch('/api/content/latest');
    
    if (response.ok) {
      const content = await response.json();
      console.log('[Service Worker] Content updated:', content);
    }
  } catch (error) {
    console.error('[Service Worker] Failed to update content:', error);
  }
}

/**
 * Background fetch event
 */
self.addEventListener('backgroundfetchsuccess', (event) => {
  console.log('[Service Worker] Background fetch success:', event.registration.id);

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(RUNTIME_CACHE);
        const records = await event.registration.matchAll();

        for (const record of records) {
          await cache.put(record.request, record.response);
        }

        console.log('[Service Worker] Background fetch cached');
      } catch (error) {
        console.error('[Service Worker] Failed to cache background fetch:', error);
      }
    })()
  );
});

/**
 * Background fetch failure event
 */
self.addEventListener('backgroundfetchfail', (event) => {
  console.error('[Service Worker] Background fetch failed:', event.registration.id);
});

/**
 * Background fetch abort event
 */
self.addEventListener('backgroundfetchabort', (event) => {
  console.log('[Service Worker] Background fetch aborted:', event.registration.id);
});

/**
 * Can make payment event
 */
self.addEventListener('canmakepayment', (event) => {
  console.log('[Service Worker] Can make payment event');
  event.respondWith(true);
});

/**
 * Payment request event
 */
self.addEventListener('paymentrequest', (event) => {
  console.log('[Service Worker] Payment request event');
  // Handle payment request
});

console.log('[Service Worker] Service worker loaded');
