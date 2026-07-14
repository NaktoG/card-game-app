const CACHE_NAME = 'card-game-app-v2';
const SCOPE_PATH = new URL(self.registration.scope).pathname;
const APP_SHELL = [
  SCOPE_PATH,
  `${SCOPE_PATH}offline.html`,
  `${SCOPE_PATH}manifest.webmanifest`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.hostname.includes('deckofcardsapi.com')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(`${SCOPE_PATH}offline.html`)));
    return;
  }

  if (request.method === 'GET' && url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        });
      }),
    );
  }
});
