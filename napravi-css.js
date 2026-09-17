/*
 * Pravi lib/tailwind.css — gotov CSS samo sa klasama koje aplikacija koristi.
 *
 * Prije je stranica vukla lib/tailwind.js (400 KB), Tailwindov „Play"
 * skript koji CSS generise u pregledniku pri svakom otvaranju i zbog toga
 * upozorava u konzoli. Sada se CSS napravi jednom, ovdje, Tailwindovim
 * samostalnim CLI-jem (jedan izvrsni fajl, bez npm-a). CLI se skine u alat/
 * pri prvom pokretanju i tamo ostaje (alat/ je u .gitignore). Verzija je
 * ista kao Play skript koji je zamijenjen.
 *
 * Koje klase ulaze odredjuje tailwind.config.js (gleda index.html i app.jsx);
 * ulazni CSS je tailwind.ulaz.css.
 *
 *   node napravi-css.js
 */
'use strict';

var fs = require('fs');
var put = require('path');
var proces = require('child_process');

var VERZIJA = '3.4.17';
var PO_PLATFORMI = {
  win32: 'tailwindcss-windows-x64.exe',
  linux: 'tailwindcss-linux-x64',
  darwin: process.arch === 'arm64' ? 'tailwindcss-macos-arm64' : 'tailwindcss-macos-x64'
};
var IME = PO_PLATFORMI[process.platform];
if (!IME) { console.error('GRESKA: nepoznata platforma ' + process.platform); process.exit(1); }

var ADRESA = 'https://github.com/tailwindlabs/tailwindcss/releases/download/v' + VERZIJA + '/' + IME;
var CLI = put.join(__dirname, 'alat', process.platform === 'win32' ? 'tailwindcss.exe' : 'tailwindcss');
var ULAZ = put.join(__dirname, 'tailwind.ulaz.css');
var PODESAVANJA = put.join(__dirname, 'tailwind.config.js');
var IZLAZ = put.join(__dirname, 'lib', 'tailwind.css');

function skiniCli() {
  if (fs.existsSync(CLI)) { return Promise.resolve(); }
  console.log('skidam Tailwind CLI ' + VERZIJA + ' u alat/ (samo prvi put, ~40 MB) ...');
  return fetch(ADRESA).then(function (odgovor) {
    if (!odgovor.ok) { throw new Error('Tailwind CLI: HTTP ' + odgovor.status); }
    return odgovor.arrayBuffer();
  }).then(function (bajtovi) {
    fs.mkdirSync(put.dirname(CLI), { recursive: true });
    fs.writeFileSync(CLI, Buffer.from(bajtovi));
    if (process.platform !== 'win32') { fs.chmodSync(CLI, 493); /* 0755 */ }
  });
}

function napravi() {
  proces.execFileSync(CLI, [
    '-c', PODESAVANJA,
    '-i', ULAZ,
    '-o', IZLAZ,
    '--minify'
  ], { stdio: 'inherit', cwd: __dirname });
  var velicina = Math.round(fs.statSync(IZLAZ).size / 1024);
  console.log('napravljeno: ' + IZLAZ + ' (' + velicina + ' KB)');
}

skiniCli().then(napravi).catch(function (greska) {
  console.error('GRESKA: ' + (greska && greska.message));
  process.exit(1);
});
