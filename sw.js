/* Service worker: guarda la app en caché para que funcione sin internet
   cuando se abre desde GitHub Pages (https). */
const CACHE = 'hackandes-v1.0.0';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './css/app.css',
  './js/core.js', './js/sha256.js', './js/mascot.js', './js/terminal.js', './js/app.js', './js/lesson.js',
  './data/nivel1.js', './data/nivel2.js', './data/nivel3.js',
  './css/fuentes.css',
  './icons/icono.svg', './icons/icono-192.png', './icons/icono-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ARCHIVOS.map(a => c.add(a).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // Red primero (para recibir actualizaciones), caché si no hay internet
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
