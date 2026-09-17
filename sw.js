/*
 * Servisni radnik za Tablić.
 *
 * Kes je prvi, ne mreza: sve sto aplikaciji treba lezi uz nju — app.js i
 * biblioteke u lib/ — pa je offline normalno stanje a ne rezervni plan.
 * Nova verzija se povlaci u pozadini i vidi se pri sljedecem otvaranju.
 *
 * Jedino sto jos dolazi spolja su Google fontovi. Oni se ne predkesiraju,
 * jer nisu nuzni (bez njih rade rezervni fontovi), ali se pri prvom online
 * otvaranju zapamte kroz fetch handler — zato on prima i "cors" odgovore,
 * ne samo "basic".
 *
 * Kad se promeni spisak fajlova, MORA da se promeni i ime kesa — inace
 * "activate" ne obrise stari.
 */
'use strict';

var KES = 'tablic-v3';

var FAJLOVI = [
  './',
  'index.html',
  'app.js',
  'lib/tailwind.js',
  'lib/react.js',
  'lib/react-dom.js',
  'manifest.json',
  'ikona-192.png',
  'ikona-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(KES).then(function (kes) {
      return kes.addAll(FAJLOVI);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (imena) {
      return Promise.all(imena.map(function (ime) {
        return ime === KES ? null : caches.delete(ime);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') { return; }
  e.respondWith(
    caches.match(e.request).then(function (izKesa) {
      // Osvezavanje u pozadini: odgovor stize iz kesa odmah, a sledeci put
      // je novija verzija. Pad mreze se ignorise jer offline nije greska.
      var samreze = fetch(e.request).then(function (odgovor) {
        // "basic" je sa ovog servera, "cors" su Google fontovi.
        if (odgovor && odgovor.status === 200 &&
            (odgovor.type === 'basic' || odgovor.type === 'cors')) {
          var kopija = odgovor.clone();
          caches.open(KES).then(function (kes) { kes.put(e.request, kopija); });
        }
        return odgovor;
      }).catch(function () {
        return izKesa;
      });
      return izKesa || samreze;
    })
  );
});
