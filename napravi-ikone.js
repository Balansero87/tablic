/*
 * Pravi ikone za PWA — bez ijedne spoljne zavisnosti.
 * Crta u RGBA bafer i pakuje u PNG (zlib iz Node-a), isti pristup kao
 * Radgeld/napravi-ikone.js.
 *
 * Motiv: crtice sa lista za pisanje — cetiri uspravne i kosa peta,
 * onako kako se broje partije. Boje su iz teme „Tabla".
 *
 *   node napravi-ikone.js
 */
'use strict';

var zlib = require('zlib');
var fs = require('fs');
var put = require('path');

/* ---------- crtanje ---------- */

function napraviPlatno(v) {
  return { w: v, h: v, piksel: Buffer.alloc(v * v * 4, 0) };
}

function stopi(platno, x, y, r, g, b, a) {
  if (a <= 0) { return; }
  var i = (y * platno.w + x) * 4;
  var p = platno.piksel;
  var staraA = p[i + 3] / 255;
  var novaA = a + staraA * (1 - a);
  if (novaA <= 0) { return; }
  p[i] = Math.round((r * a + p[i] * staraA * (1 - a)) / novaA);
  p[i + 1] = Math.round((g * a + p[i + 1] * staraA * (1 - a)) / novaA);
  p[i + 2] = Math.round((b * a + p[i + 2] * staraA * (1 - a)) / novaA);
  p[i + 3] = Math.round(novaA * 255);
}

/* Zaobljen pravougaonik preko funkcije udaljenosti — glatke ivice bez biblioteke. */
function pozadina(platno, boja, radijus) {
  var v = platno.w, x, y, dx, dy, ax, ay, d, pokrivenost;
  for (y = 0; y < v; y++) {
    for (x = 0; x < v; x++) {
      dx = Math.abs(x + 0.5 - v / 2) - (v / 2 - radijus);
      dy = Math.abs(y + 0.5 - v / 2) - (v / 2 - radijus);
      ax = Math.max(dx, 0);
      ay = Math.max(dy, 0);
      d = Math.sqrt(ax * ax + ay * ay) + Math.min(Math.max(dx, dy), 0) - radijus;
      pokrivenost = Math.min(Math.max(0.5 - d, 0), 1);
      stopi(platno, x, y, boja.r, boja.g, boja.b, pokrivenost);
    }
  }
}

/* Jedan potez olovkom: duz sa zaobljenim krajevima. */
function crta(platno, x1, y1, x2, y2, debljina, boja) {
  var x, y, t, px, py, d, pokrivenost;
  var dx = x2 - x1, dy = y2 - y1;
  var duzina2 = dx * dx + dy * dy;
  for (y = 0; y < platno.h; y++) {
    for (x = 0; x < platno.w; x++) {
      t = duzina2 === 0 ? 0 : ((x + 0.5 - x1) * dx + (y + 0.5 - y1) * dy) / duzina2;
      t = Math.min(Math.max(t, 0), 1);
      px = x1 + dx * t;
      py = y1 + dy * t;
      d = Math.sqrt((x + 0.5 - px) * (x + 0.5 - px) + (y + 0.5 - py) * (y + 0.5 - py));
      pokrivenost = Math.min(Math.max(debljina / 2 - d + 0.5, 0), 1);
      stopi(platno, x, y, boja.r, boja.g, boja.b, pokrivenost);
    }
  }
}

function nacrtaj(v) {
  var platno = napraviPlatno(v);
  var tabla = { r: 0x0A, g: 0x0A, b: 0x0B };   /* paper iz teme „Tabla" */
  var kreda = { r: 0xED, g: 0xE6, b: 0xDA };   /* bone */
  var mastilo = { r: 0xD9, g: 0x3A, b: 0x2B }; /* crvena iz INKS */

  pozadina(platno, tabla, v * 0.22);

  /* Cetiri uspravne crte, razmak 0.12v, grupa centrirana na 0.50v. */
  var debljina = v * 0.055;
  var gore = v * 0.33;
  var dole = v * 0.67;
  var i, x;
  for (i = 0; i < 4; i++) {
    x = v * (0.32 + i * 0.12);
    crta(platno, x, gore, x, dole, debljina, kreda);
  }

  /* Peta, kosa — precrtava grupu, crvenim mastilom. */
  crta(platno, v * 0.26, v * 0.71, v * 0.74, v * 0.29, debljina, mastilo);

  return platno;
}

/* ---------- PNG ---------- */

var crcTabela = null;
function crc32(bafer) {
  if (!crcTabela) {
    crcTabela = [];
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) { c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); }
      crcTabela[n] = c >>> 0;
    }
  }
  var crc = 0xFFFFFFFF;
  for (var i = 0; i < bafer.length; i++) {
    crc = crcTabela[(crc ^ bafer[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function deo(tip, podaci) {
  var duzina = Buffer.alloc(4);
  duzina.writeUInt32BE(podaci.length, 0);
  var telo = Buffer.concat([Buffer.from(tip, 'ascii'), podaci]);
  var crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(telo), 0);
  return Buffer.concat([duzina, telo, crc]);
}

function uPng(platno) {
  var ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(platno.w, 0);
  ihdr.writeUInt32BE(platno.h, 4);
  ihdr[8] = 8;   // bita po kanalu
  ihdr[9] = 6;   // RGBA
  var sirovo = Buffer.alloc(platno.h * (platno.w * 4 + 1));
  for (var y = 0; y < platno.h; y++) {
    var izvor = y * platno.w * 4;
    var cilj = y * (platno.w * 4 + 1);
    sirovo[cilj] = 0;
    platno.piksel.copy(sirovo, cilj + 1, izvor, izvor + platno.w * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    deo('IHDR', ihdr),
    deo('IDAT', zlib.deflateSync(sirovo, { level: 9 })),
    deo('IEND', Buffer.alloc(0))
  ]);
}

/* ---------- izlaz ---------- */

[192, 512].forEach(function (v) {
  var ime = put.join(__dirname, 'ikona-' + v + '.png');
  fs.writeFileSync(ime, uPng(nacrtaj(v)));
  console.log('napravljeno: ' + ime);
});
