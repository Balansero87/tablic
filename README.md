# Tablić — list za pisanje

Brojač bodova za tablić. Radi u pregledniku, bez instalacije i bez servera;
na telefon se instalira kao aplikacija i radi bez interneta.

Objavljeno na: https://balansero87.github.io/tablic/

## Bodovanje

| Stavka | Bodova |
|---|---|
| Štih (10, J, Q, K, A) | 1 |
| 10♦ | 2 |
| 2♣ | 1 |
| 3 na karte (27+ karata) | 3 |
| **Partija ukupno** | **25** |
| Partija kad je pat 26:26 | 22 |
| Tabla | 1 |

## Kako se koristi

1. Izaberi broj igrača (2, 3, 4 ili 2×2), upiši imena i limit.
2. Tokom igre tapni u zadnji red kod igrača da mu upišeš tablu.
3. Kad se špil istroši, pritisni **Upiši partiju** i unesi bodove jednom igraču
   — drugi automatski dobija ostatak do 25. Dugme **PAT** spušta zbir na 22.
4. Ime igrača mijenjaš i usred igre — tapni ga u zaglavlju i prepiši. Partije
   ostaju.
5. Dugmad gore desno: paleta mijenja izgled, **↶** briše zadnju partiju,
   **0** vraća rezultat na nulu uz iste igrače, **↻** otvara novi list i briše
   i imena. „0" i „↻" traže drugi tap u roku od tri sekunde — jedan promašaj
   ne briše ništa.
6. Rezultat i izgled se pamte u pregledniku, na tom uređaju.

## Na telefonu

Otvori adresu u Chrome-u → meni (⋮) → **Instaliraj aplikaciju**. Na iPhone-u:
Safari → dugme za dijeljenje → **Add to Home Screen**. Otvara se preko cijelog
ekrana, sa ikonicom, i poslije prvog otvaranja radi bez interneta. Nova verzija
se povuče u pozadini i vidi se pri sljedećem otvaranju.

## Šta je gdje

| Fajl | Šta je |
|---|---|
| `index.html` | ljuska stranice — učitava `lib/` i `app.js` |
| `app.jsx` | **izvor aplikacije** (React + JSX) — ovo se uređuje |
| `app.js` | prevedeni `app.jsx` — generisan, ne uređuje se ručno |
| `prevedi.js` | `node prevedi.js` — prevodi `app.jsx` u `app.js`; Babel skine u `alat/` samo prvi put |
| `lib/` | React, ReactDOM i Tailwind, uz aplikaciju — nijedan CDN |
| `sw.js` | service worker, keš je prvi |
| `manifest.json`, `ikona-192.png`, `ikona-512.png` | PWA omot |
| `napravi-ikone.js` | `node napravi-ikone.js` — generiše obje ikone, bez zavisnosti |

## Izmjena koda

    node prevedi.js

Uredi `app.jsx`, pokreni gornju komandu, otvori stranicu. JSX se prevodi
jednom ovdje, a ne u svakom telefonu — zato stranica ne vuče Babel (3 MB) i
otvara se odmah. Ako promijeniš spisak fajlova koje aplikacija učitava,
podigni `KES` u `sw.js`, inače stari keš ostane.

## Samoprovera

    index.html#test

Umjesto aplikacije ispiše rezultat 25 tvrdnji o bodovanju — ostatak do 25 i
22, zbirovi, pobjednik — i u naslov kartice stavi `OK 25/25` ili `PALO n/25`.
Iz konzole: `samoprovera()`.

## Internet

Ne treba. Sve što aplikaciji treba leži uz nju. Jedino fontovi dolaze sa
Google Fonts; bez njih se koriste rezervni, a nakon prvog otvaranja sa
internetom i oni ostanu u kešu.
