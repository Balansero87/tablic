# Tablić — list za pisanje

Brojač bodova za tablić. Radi u pregledniku, bez instalacije i bez servera.

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
4. Zbir se računa sam. Rezultat i izgled se pamte u pregledniku.

Ikonica palete gore desno mijenja pozadinu, slova i boju mastila.

## Objava na GitHub Pages

    git init
    git add .
    git commit -m "Tablić"
    git branch -M main
    git remote add origin https://github.com/KORISNIK/tablic.git
    git push -u origin main

Zatim u repozitoriju: **Settings → Pages → Source: Deploy from a branch →
Branch: main / (root) → Save**. Za minutu je dostupno na
`https://KORISNIK.github.io/tablic/`.

Na telefonu otvori tu adresu i izaberi "Dodaj na početni ekran" — otvara se
kao aplikacija, preko cijelog ekrana.

## Napomena o brzini

`index.html` prevodi JSX u pregledniku preko Babela, pa se prvi put učitava
oko sekundu duže. Zauzvrat nema build koraka i nema `node_modules`.
