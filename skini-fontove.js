/*
 * Skida fontove sa Google Fonts u lib/fontovi/ i pravi lib/fontovi.css,
 * da aplikacija ne zavisi ni od cega spolja. Bez ijedne zavisnosti.
 *
 * Google vraca razlicit CSS zavisno od preglednika; salje se Chrome-ov
 * User-Agent da bi dosli woff2 fajlovi podijeljeni po pismu. Uzimaju se samo
 * "latin" i "latin-ext" (srpska latinica sa č ć š đ ž je u latin-ext) —
 * cirilica, grcki i vijetnamski aplikaciji ne trebaju.
 *
 * Kad se promijeni spisak porodica ili rezova, promijeni ADRESA ovdje i u
 * sw.js dopuni FAJLOVI (skripta ispise spisak) i podigni KES.
 *
 *   node skini-fontove.js
 */
'use strict';

var fs = require('fs');
var put = require('path');

var ADRESA = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500' +
  '&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500' +
  '&family=Caveat:wght@500;700&family=Playfair+Display:wght@500;700' +
  '&family=Lora:wght@400;600&family=Space+Grotesk:wght@400;600' +
  '&family=Space+Mono:wght@400;700&display=swap';
var CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
var PISMA = ['latin', 'latin-ext'];
var FOLDER = put.join(__dirname, 'lib', 'fontovi');
var CSS_IZLAZ = put.join(__dirname, 'lib', 'fontovi.css');

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function skini(adresa) {
  return fetch(adresa, { headers: { 'User-Agent': CHROME_UA } }).then(function (o) {
    if (!o.ok) { throw new Error(adresa + ': HTTP ' + o.status); }
    return o.arrayBuffer();
  }).then(function (b) { return Buffer.from(b); });
}

fetch(ADRESA, { headers: { 'User-Agent': CHROME_UA } }).then(function (o) {
  if (!o.ok) { throw new Error('CSS: HTTP ' + o.status); }
  return o.text();
}).then(function (css) {
  var blok = /\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
  var nadjeni = [];
  var m;
  while ((m = blok.exec(css)) !== null) {
    if (PISMA.indexOf(m[1]) < 0) { continue; }
    var telo = m[2];
    var porodica = /font-family:\s*'([^']+)'/.exec(telo);
    var rez = /font-weight:\s*([\d ]+)/.exec(telo);
    var url = /url\((https:[^)]+)\)/.exec(telo);
    if (!porodica || !rez || !url) { throw new Error('neocekivan blok: ' + telo.slice(0, 80)); }
    nadjeni.push({ pismo: m[1], telo: telo, porodica: porodica[1], rez: rez[1].trim(), url: url[1] });
  }
  if (!nadjeni.length) { throw new Error('u CSS-u nema @font-face blokova — Google je promijenio format?'); }

  fs.mkdirSync(FOLDER, { recursive: true });
  var imePoUrl = {};   // isti fajl moze sluziti vise rezova (varijabilni font)
  var redom = Promise.resolve();
  nadjeni.forEach(function (f) {
    redom = redom.then(function () {
      if (imePoUrl[f.url]) { return; }
      var ime = slug(f.porodica) + '-' + f.rez.replace(/\s+/g, '-') + '-' + f.pismo + '.woff2';
      imePoUrl[f.url] = ime;
      return skini(f.url).then(function (bajtovi) {
        fs.writeFileSync(put.join(FOLDER, ime), bajtovi);
        console.log('  ' + ime + ' (' + Math.round(bajtovi.length / 1024) + ' KB)');
      });
    });
  });

  return redom.then(function () {
    var izlaz = '/* GENERISANO skriptom skini-fontove.js — ne uredjuj rucno.\n' +
      '   Fontovi su lokalno u fontovi/, bez Google Fonts-a. */\n';
    nadjeni.forEach(function (f) {
      izlaz += '/* ' + f.pismo + ' */\n@font-face {' +
        f.telo.replace(/url\(https:[^)]+\)/, 'url(fontovi/' + imePoUrl[f.url] + ')') +
        '}\n';
    });
    fs.writeFileSync(CSS_IZLAZ, izlaz);
    var fajlovi = Object.keys(imePoUrl).map(function (u) { return imePoUrl[u]; }).sort();
    console.log('napravljeno: ' + CSS_IZLAZ + ' (' + nadjeni.length + ' @font-face, ' + fajlovi.length + ' fajlova)');
    console.log('\nza sw.js FAJLOVI:');
    console.log("  'lib/fontovi.css',");
    fajlovi.forEach(function (ime) { console.log("  'lib/fontovi/" + ime + "',"); });
  });
}).catch(function (g) {
  console.error('GRESKA: ' + (g && g.message));
  process.exit(1);
});
