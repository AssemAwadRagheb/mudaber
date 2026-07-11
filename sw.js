// ===== MUDABER SERVICE WORKER v13 =====
// Strategy: Network-First with Cache Fallback for assets. Network-Only for HTML/JSON/PHP.
// This ensures users ALWAYS get the latest version of the HTML pages.

const CACHE_NAME = 'mudaber-cache-v13'; // Bumped to force update

// Static assets to pre-cache (shell only — not HTML pages)
const PRECACHE_ASSETS = [
  '/style.css',
  '/script.js',
  '/particles-init.js',
  '/assets/images/favicon.ico',
  '/assets/images/android-chrome-192x192.png',
  '/assets/images/android-chrome-512x512.png',
  '/assets/images/apple-touch-icon.png',
  '/assets/images/favicon-16x16.png',
  '/assets/images/favicon-32x32.png',
];

// ── INSTALL: pre-cache static shell assets ──────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
});

// ── ACTIVATE: delete old caches ──────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: Smart Strategy ────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isCDN = url.hostname.includes('fonts.googleapis.com') ||
                url.hostname.includes('fonts.gstatic.com') ||
                url.hostname.includes('cdnjs.cloudflare.com') ||
                url.hostname.includes('cdn.jsdelivr.net');

  if (!isSameOrigin && !isCDN) return;

  // Never cache: HTML, JSON (CMS data), PHP, admin routes → always go to network
  const isNeverCache =
    (event.request.headers.get('accept') || '').includes('text/html') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.php') ||
    url.pathname === '/' ||
    url.pathname.startsWith('/admin');

  if (isNeverCache) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/') || new Response('Offline', { status: 503 }))
    );
    return;
  }

  // Assets (CSS, JS, Images, Fonts) → Network First, Fallback to Cache
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
