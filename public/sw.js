const CACHE_NAME = `bigtrip-cache-v1`;

const URLS_TO_CACHE = [
  `/`,
  `/index.html`,
  `/bundle.js`,
  `/css/style.css`,
  `/fonts/Montserrat-Regular.woff2`,
  `/fonts/Montserrat-Medium.woff2`,
  `/fonts/Montserrat-SemiBold.woff2`,
  `/fonts/Montserrat-Bold.woff2`,
  `/fonts/Montserrat-ExtraBold.woff2`,
  `/img/icons/bus.png`,
  `/img/icons/check-in.png`,
  `/img/icons/drive.png`,
  `/img/icons/flight.png`,
  `/img/icons/restaurant.png`,
  `/img/icons/ship.png`,
  `/img/icons/sightseeing.png`,
  `/img/icons/taxi.png`,
  `/img/icons/train.png`,
  `/img/icons/transport.png`,
  `/img/icons/trip.png`,
  `/img/header-bg.png`,
  `/img/header-bg@2x.png`,
  `/img/logo.png`
];

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys().then((keys) => Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
            return null;
          })
          .filter((key) => key !== null)
      ))
  );
});

const fetchHandler = (evt) => {
  const {request} = evt;
  evt.respondWith(
      caches.match(request).then((cacheResponse) => {
        if (cacheResponse) {
          return cacheResponse;
        }
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== `basic`) {
            return response;
          }

          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse));
          return response;
        });
      })
  );
};

self.addEventListener(`fetch`, fetchHandler);
