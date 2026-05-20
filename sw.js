const CACHE_NAME = 'blue-devil-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'levels.js',
  'game.js',
  'manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => cachedResponse || fetch(e.request))
  );
});
