/*
 * Prevodi app.jsx u app.js — jednom, ovdje, umjesto u svakom telefonu.
 *
 * Babel se ne drzi u repozitoriju (3 MB): skida se u alat/ pri prvom
 * pokretanju i tamo ostaje (alat/ je u .gitignore). Nema npm-a ni
 * package.json-a — Node 18+ ima fetch, a @babel/standalone radi kao obican
 * require. Verzija je zakovana: Babel 8 mijenja podrazumijevani JSX runtime
 * i prevedeni kod bi trazio module, sto je jednom vec oborilo stranicu.
 *
 *   node prevedi.js
 */
'use strict';

var fs = require('fs');
var put = require('path');

var BABEL_VERZIJA = '7.29.8';
var BABEL_ADRESA = 'https://unpkg.com/@babel/standalone@' + BABEL_VERZIJA + '/babel.min.js';
var BABEL_FAJL = put.join(__dirname, 'alat', 'babel.min.js');
var ULAZ = put.join(__dirname, 'app.jsx');
var IZLAZ = put.join(__dirname, 'app.js');

function skiniBabel() {
  if (fs.existsSync(BABEL_FAJL)) { return Promise.resolve(); }
  console.log('skidam Babel ' + BABEL_VERZIJA + ' u alat/ (samo prvi put) ...');
  return fetch(BABEL_ADRESA).then(function (odgovor) {
    if (!odgovor.ok) { throw new Error('Babel: HTTP ' + odgovor.status); }
    return odgovor.arrayBuffer();
  }).then(function (bajtovi) {
    fs.mkdirSync(put.dirname(BABEL_FAJL), { recursive: true });
    fs.writeFileSync(BABEL_FAJL, Buffer.from(bajtovi));
  });
}

function prevedi() {
  var Babel = require(BABEL_FAJL);
  var izvor = fs.readFileSync(ULAZ, 'utf8');
  var kod = Babel.transform(izvor, {
    presets: [['react', { runtime: 'classic' }]],
    sourceType: 'script',
    compact: false
  }).code;
  var zaglavlje = '/* GENERISANO iz app.jsx — ne uredjuj rucno.\n' +
                  '   Uredi app.jsx pa pokreni: node prevedi.js */\n';
  fs.writeFileSync(IZLAZ, zaglavlje + kod + '\n');
  console.log('napravljeno: ' + IZLAZ + ' (' + Math.round(fs.statSync(IZLAZ).size / 1024) + ' KB)');
}

skiniBabel().then(prevedi).catch(function (greska) {
  console.error('GRESKA: ' + (greska && greska.message));
  process.exit(1);
});
