// Offline-Cache: App-Dateien zuerst aus dem Netz holen, ohne Netz aus dem Cache.
// "no-cache" fragt immer bei GitHub nach (umgeht den 10-Minuten-Zwischenspeicher), eine neue Version ist sofort da.
const CACHE = 'reiselogbuch-3.13.0';
// Ab 3.0.0 kommen die gemeinsamen Bausteine aus AppDesign (gleiche Adresse g811141a.github.io) – auch offline.
// Seit 3.13.0 (R-10.3) aus der festen Fassung ../AppDesign/fassung/X.Y.Z/ wie in index.html: eine neue AppDesign-Version ändert die App nicht.
const FILES = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-512.png', '../AppDesign/fassung/4.14.0/design.css', '../AppDesign/fassung/4.14.0/ui.js'];

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
