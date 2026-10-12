// Offline-Cache: App-Dateien zuerst aus dem Netz holen, ohne Netz aus dem Cache.
// "no-cache" fragt immer bei GitHub nach (umgeht den 10-Minuten-Zwischenspeicher), eine neue Version ist sofort da.
const CACHE = 'reiselogbuch-3.8.1';
// Ab 3.0.0 kommen die gemeinsamen Bausteine aus AppDesign (gleiche Adresse g811141a.github.io) – auch offline.
const FILES = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-512.png', '../AppDesign/v4/design.css', '../AppDesign/v4/ui.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
