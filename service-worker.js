const CACHE = "lcsa-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))

  );

});


self.addEventListener("activate", event => {

  event.waitUntil(
    self.clients.claim()
  );

});


self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(networkResponse => {

            const copy =
              networkResponse.clone();

            caches.open(CACHE)
              .then(cache => {

                cache.put(
                  event.request,
                  copy
                );

              });

            return networkResponse;

          })

          .catch(() =>
            caches.match("./index.html")
          );

      })

  );

});
