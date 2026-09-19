// Keeps the app working without internet.
// Network first: she always gets your latest push when online,
// and the last saved copy when offline.
const CACHE = 'hours-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.add('./')).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: true }).then(hit => hit || caches.match('./'))
      )
  );
});
