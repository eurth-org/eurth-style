/*
 * The service worker every tool shares: it keeps a copy of the site on the device, so the tool
 * opens and works without signal after the first visit. This cache of the tool's own files is
 * the only thing kept on a device. The build (@eurth/style/astro) fills in NAME, VERSION (from
 * the files' contents) and APP (the pages and files to keep).
 */
const NAME = '__NAME__';
const VERSION = '__VERSION__';
const APP = __APP__;
const CACHE = `${NAME}-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP))
      .then(() => self.skipWaiting()),
  );
});

// A new version clears out the old copies.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(`${NAME}-`) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  // Pages: fresh from the network when there's signal; the kept copy of that page (or of the
  // start page) when there isn't.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match(url.pathname, { ignoreSearch: true })) || (await caches.match('/', { ignoreSearch: true })) || Response.error()),
    );
    return;
  }

  // Everything else: the kept copy first (file names carry a hash of their contents).
  event.respondWith(caches.match(request, { ignoreSearch: true }).then((kept) => kept || fetch(request)));
});
