const CACHE_NAME = 'alarmpro-saas-v2';
const urlsToCache = [
  './',
  './index.html',
  './landing.html',
  './css/landing.css',
  './manifest.json',
  './mixkit-vintage-warning-alarm-990.wav'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force the new service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Clean up old caches
          }
        })
      );
    }).then(() => self.clients.claim()) // Immediately take control of clients
  );
});

self.addEventListener('fetch', event => {
  // Never cache backend API calls directly
  if (event.request.url.includes('/api/')) return; 

  // NETWORK-FIRST Strategy (Solves the "Hard Refresh" problem)
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // If we get a good response, cache it for offline use later
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch((err) => {
        // If network fails (offline), fall back to the cache
        return caches.match(event.request).then(cachedResponse => {
           return cachedResponse || caches.match('./landing.html');
        });
      })
  );
});

// Handle Notification Clicks to open app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url.indexOf(self.registration.scope) !== -1 && 'focus' in client) {
          client.postMessage({ action: 'stopAlarm' });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./app').then(windowClient => {
          if (windowClient) {
            setTimeout(() => {
              windowClient.postMessage({ action: 'stopAlarm' });
            }, 1000);
          }
        });
      }
    })
  );
});
