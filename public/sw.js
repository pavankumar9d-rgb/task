const CACHE_NAME = 'alarm-tracker-pro-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './mixkit-vintage-warning-alarm-990.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) return; // Do not cache API calls
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => caches.match('./index.html'))
  );
});

// Handle Notification Clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Find an open tab
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url.indexOf(self.registration.scope) !== -1 && 'focus' in client) {
          client.postMessage({ action: 'stopAlarm' });
          return client.focus();
        }
      }
      // Open a new tab if none exist
      if (clients.openWindow) {
        return clients.openWindow('./index.html').then(windowClient => {
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
