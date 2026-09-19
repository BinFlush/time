// Removes the old offline worker from browsers that still have it. Delete this file after a while.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(caches.delete('hours-v1').then(() => self.registration.unregister())));
