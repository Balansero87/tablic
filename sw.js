/*
 * Servisni radnik za Tablić.
 *
 * Kes je prvi, ne mreza: alat nema sta da dovuce sa servera, pa je offline
 * normalno stanje a ne rezervni plan.
 *
 * Za razliku od RadGeld-a, ovde se keširaju i fajlovi sa CDN-a — React,
 * Tailwind i Babel se ucitavaju spolja, pa bez njih u kesu offline ne vredi
 * nista. Oni idu odvojeno i pojedinacno, jer addAll pada ceo ako jedan
 * zahtev ne prodje, a strani server ne mora uvek odgovoriti.
 *
 * Kad se promeni spisak fajlova, MORA da se promeni i ime kesa — inace
 * "activate" ne obrise stari.
 */
'use strict';

var KES = 'tablic-v1';

var FAJLOVI = [
  './',
  'index.html',
  'manifest.json',
  'ikona-192.png',
  'ikona-512.png'
];

var SPOLJNI = [
  'https://cdn.tailwindcss.com/',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.29.8/babel.min.js'
];

function dodajSpoljne(kes) {
  return Promise.all(SPOLJNI.map(function (adresa) {
    return fetch(adresa).then(function (odgovor) {
      if (odgovor && odgovor.ok) { return kes.put(adresa, odgovor); }
      return null;
    }).catch(function () {
      // Strani server nije dostupan — instalacija se zbog toga ne prekida.
      return null;
    });
  }));
}

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(KES).then(function (kes) {
      return kes.addAll(FAJLOVI).then(function () {
        return dodajSpoljne(kes);
      });
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
        // "basic" je sa ovog servera, "cors" su CDN fajlovi — oba vredi cuvati.
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
