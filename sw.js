const CACHE_NAME = 'mudaber-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/ecosystem.html',
  '/careers.html',
  '/contact.html',
  '/press.html',
  '/legal.html',
  '/style.css',
  '/script.js',
  'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached version
        }
        return fetch(event.request).catch(() => {
            // Optional: fallback to an offline page if network fails and resource isn't cached
            // return caches.match('/offline.html');
        });
      }
    )
  );
});
