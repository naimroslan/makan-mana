self.addEventListener("install", (e) => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker activated");
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    }),
  );
});
