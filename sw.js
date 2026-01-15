const CACHE_NAME = "pwa-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/app.js",
  "/styles.css",
  "/idb.js",
  "https://unpkg.com/leaflet/dist/leaflet.css",
  "https://unpkg.com/leaflet/dist/leaflet.js"
];

// install
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// fetch
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((res) => res || fetch(evt.request))
  );
});

// periodic notification (every ~5 min)
self.addEventListener("activate", (evt) => {
  if ("periodicSync" in registration) {
    registration.periodicSync.register("notify-every-5min", {
      minInterval: 300000
    });
  }
});

// periodic sync event
self.addEventListener("periodicsync", (evt) => {
  if (evt.tag === "notify-every-5min") {
    evt.waitUntil(
      self.registration.showNotification("⏰ Reminder", {
        body: "Five minutes passed!",
        icon: "icons/icon-192.png"
      })
    );
  }
});
