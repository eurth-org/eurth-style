/*
 * The service worker every tool shares: it keeps a copy of the site on the device, so the tool
 * opens and works without signal after the first visit. This cache of the tool's own files is
 * the only thing kept on a device. The build (@eurth/style/astro) fills in NAME, VERSION (from
 * the files' contents) and APP (the pages and files to keep).
 */
const NAME = '__NAME__';
const VERSION = '__VERSION__';
const APP = __APP__;
// Files left out of the first download (large galleries): kept once they have been shown.
const LATER = __LATER__.map((source) => new RegExp(source));
const CACHE = `${NAME}-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP))
      .then(() => self.skipWaiting()),
  );
});

// A new version clears out every other copy kept for this site: its own older versions, and
// whatever a service worker from before the shared shell left behind under another name. The
// one cache of the tool's current files is all that stays on the device.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
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

  // Everything else: the kept copy first (file names carry a hash of their contents). A file
  // that was left out of the first download is kept from the moment it is first fetched.
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(
      (kept) =>
        kept ||
        fetch(request).then((response) => {
          if (response.ok && LATER.some((pattern) => pattern.test(url.pathname.slice(1)))) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
