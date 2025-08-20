
// Basic SW stub; replace with Workbox build or injectManifest later.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
