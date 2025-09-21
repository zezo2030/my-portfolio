const CACHE_NAME = 'portfolio-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/favicon.svg',
  '/og-image.jpg',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }

  // Handle Next.js assets
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) return response;

          return fetch(request).then((fetchResponse) => {
            // Cache successful responses
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Handle images
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) return response;

          return fetch(request).then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          }).catch(() => {
            // Return a fallback image if network fails
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Image unavailable</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
        });
      })
    );
    return;
  }

  // Handle page requests with network-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/') || new Response('Offline', { status: 503 });
      })
    );
    return;
  }

  // Default: try cache first, then network
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});