// Offline-Cache: App-Dateien zuerst aus dem Netz holen, ohne Netz aus dem Cache.
// "no-cache" fragt immer bei GitHub nach (umgeht den 10-Minuten-Zwischenspeicher), eine neue Version ist sofort da.
const CACHE = 'reiselogbuch-3.42.0';
// Ab 3.0.0 kommen die gemeinsamen Bausteine aus AppDesign (gleiche Adresse g811141a.github.io) – auch offline.
// Seit 3.13.0 (R-10.3) aus der festen Fassung ../AppDesign/fassung/X.Y.Z/ wie in index.html: eine neue AppDesign-Version ändert die App nicht.
const FILES = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-512.png', '../AppDesign/fassung/4.44.0/design.css', '../AppDesign/fassung/4.44.0/ui.js'];

// Seit 3.13.2 (R-1.5, Fund P-37/3 – iPad startete offline mit weißer Seite): Die App fragt das Netz höchstens 3 s, dann
// kommt sie aus dem Speicher; die Fassung aus AppDesign ist unveränderlich und kommt zuerst aus dem Speicher. Wird die App
// ohne Netz unter einer anderen Adresse geöffnet, liefert der Service Worker die gespeicherte App.
const FRIST = 3000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const merke = (req, res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };
const ausSpeicher = async req => (await caches.match(req, { ignoreSearch: true })) ||
  (req.mode === 'navigate' ? (await caches.match('index.html', { ignoreSearch: true })) || caches.match('./') : undefined);

// Seit 3.14.0 (R-1.5, APD-6): Der Service Worker meldet der Seite, ob die App offline arbeitet ({ netz: 'aus' | 'an' }) –
// ‚aus‘, sobald er aus dem Speicher liefert (kein Netz oder Netz hängt länger als die Frist), ‚an‘, sobald das Netz antwortet.
// Die Seite (AppDesign ui.js) fragt beim Start ({ netz: '?' }) und lässt bei der Rückkehr in die App prüfen ({ netz: 'pruefe' }).
let netz = 'an';
const melde = async z => {
  if (z === netz) return;
  netz = z;
  for (const c of await self.clients.matchAll({ type: 'window' })) c.postMessage({ netz });
};
// Seit 3.14.1: kleiner Abruf ohne Inhalt (HEAD) – die App fragt alle 10 s, solange sie sichtbar ist (Fund P-39/1 und /2).
const pruefe = async () => {
  const netzAntwort = fetch('./', { method: 'HEAD', cache: 'no-store' }).then(r => r.ok || r.type === 'opaqueredirect', () => false);
  const ok = await Promise.race([netzAntwort, new Promise(r => setTimeout(() => r(false), FRIST))]);
  await melde(ok ? 'an' : 'aus');
};
self.addEventListener('message', e => {
  if (!e.data || !('netz' in e.data)) return;
  // Die Antwort trägt die Nummer der Frage (die App verwirft verspätete Antworten).
  if (e.data.netz === '?') e.source?.postMessage({ netz, id: e.data.id });
  // Die Seite kennt ‚aus‘ auch von Safari selbst – deshalb antwortet der Service Worker immer, nicht nur bei einer Änderung.
  if (e.data.netz === 'pruefe') e.waitUntil(pruefe().then(() => e.source?.postMessage({ netz, id: e.data.id })));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  if (new URL(req.url).pathname.includes('/AppDesign/fassung/')) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req).then(res => merke(req, res))));
    return;
  }
  e.respondWith((async () => {
    const netzAntwort = fetch(req, { cache: 'no-cache' }).then(res => { melde('an'); return merke(req, res); });
    netzAntwort.catch(() => melde('aus'));
    const frist = new Promise(r => setTimeout(() => r('frist'), FRIST));
    try {
      const erst = await Promise.race([netzAntwort, frist]);
      if (erst !== 'frist') return erst;
    } catch {}
    const gespeichert = await ausSpeicher(req);
    if (gespeichert) melde('aus');
    return gespeichert || netzAntwort;   // nichts gespeichert: weiter auf das Netz warten
  })());
});
