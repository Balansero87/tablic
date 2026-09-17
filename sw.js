/*
 * Servisni radnik za Tablić.
 *
 * Kes je prvi, ne mreza: sve sto aplikaciji treba lezi uz nju — app.js,
 * biblioteke i fontovi u lib/ — pa je offline normalno stanje a ne rezervni
 * plan. Nista ne dolazi spolja. Nova verzija se povlaci u pozadini i vidi se
 * pri sljedecem otvaranju.
 *
 * Kad se promeni spisak fajlova, MORA da se promeni i ime kesa — inace
 * "activate" ne obrise stari. Spisak fontova ispise skini-fontove.js.
 */
'use strict';

var KES = 'tablic-v4';

var FAJLOVI = [
  './',
  'index.html',
  'app.js',
  'lib/tailwind.js',
  'lib/react.js',
  'lib/react-dom.js',
  'lib/fontovi.css',
  'lib/fontovi/caveat-500-latin-ext.woff2',
  'lib/fontovi/caveat-500-latin.woff2',
  'lib/fontovi/ibm-plex-mono-400-latin-ext.woff2',
  'lib/fontovi/ibm-plex-mono-400-latin.woff2',
  'lib/fontovi/ibm-plex-mono-500-latin-ext.woff2',
  'lib/fontovi/ibm-plex-mono-500-latin.woff2',
  'lib/fontovi/ibm-plex-sans-400-latin-ext.woff2',
  'lib/fontovi/ibm-plex-sans-400-latin.woff2',
  'lib/fontovi/lora-400-latin-ext.woff2',
  'lib/fontovi/lora-400-latin.woff2',
  'lib/fontovi/oswald-400-latin-ext.woff2',
  'lib/fontovi/oswald-400-latin.woff2',
  'lib/fontovi/playfair-display-500-latin-ext.woff2',
  'lib/fontovi/playfair-display-500-latin.woff2',
  'lib/fontovi/space-grotesk-400-latin-ext.woff2',
  'lib/fontovi/space-grotesk-400-latin.woff2',
  'lib/fontovi/space-mono-400-latin-ext.woff2',
  'lib/fontovi/space-mono-400-latin.woff2',
  'lib/fontovi/space-mono-700-latin-ext.woff2',
  'lib/fontovi/space-mono-700-latin.woff2',
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
        // Cuva se samo ono sto je sa ovog servera ("basic") — spolja vise
        // nista ne treba, pa se ni ne pamti.
        if (odgovor && odgovor.status === 200 && odgovor.type === 'basic') {
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
