const CACHE_NAME = 'blue-devil-v2';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'levels.js',
  'game.js',
  'manifest.json',
  'icon-512.png'
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
