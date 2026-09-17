/* GENERISANO iz app.jsx — ne uredjuj rucno.
   Uredi app.jsx pa pokreni: node prevedi.js */
const {
  useState,
  useEffect
} = React;

/* --- pohrana: localStorage umjesto Claude storage --- */
window.storage = {
  async get(k) {
    const v = localStorage.getItem(k);
    if (v === null) throw new Error("nema kljuca");
    return {
      key: k,
      value: v
    };
  },
  async set(k, v) {
    localStorage.setItem(k, v);
    return {
      key: k,
      value: v
    };
  }
};

/* --- ikone --- */
function Icon({
  size = 18,
  children
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block"
    }
  }, children);
}
const Undo2 = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M9 14 4 9l5-5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"
}));
const RotateCcw = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 12a9 9 0 1 0 3-6.7L3 8"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3 3v5h5"
}));
const Check = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M20 6 9 17l-5-5"
}));
const X = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M18 6 6 18"
}), /*#__PURE__*/React.createElement("path", {
  d: "m6 6 12 12"
}));
const Minus = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M5 12h14"
}));
const Trophy = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
}), /*#__PURE__*/React.createElement("path", {
  d: "M4 22h16"
}), /*#__PURE__*/React.createElement("path", {
  d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
}), /*#__PURE__*/React.createElement("path", {
  d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
}), /*#__PURE__*/React.createElement("path", {
  d: "M18 2H6v7a6 6 0 0 0 12 0V2Z"
}));
const Palette = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "13.5",
  cy: "6.5",
  r: ".5",
  fill: "currentColor"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "17.5",
  cy: "10.5",
  r: ".5",
  fill: "currentColor"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "8.5",
  cy: "7.5",
  r: ".5",
  fill: "currentColor"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "6.5",
  cy: "12.5",
  r: ".5",
  fill: "currentColor"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 2a10 10 0 0 0 0 20 2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-10-10Z"
}));

/* ---------- teme ---------- */
const THEMES = {
  tabla: {
    name: "Tabla",
    paper: "#0A0A0B",
    paper2: "#141416",
    bone: "#EDE6DA"
  },
  papir: {
    name: "Papir",
    paper: "#F3EEE4",
    paper2: "#FFFFFF",
    bone: "#221F1B"
  },
  filc: {
    name: "Filc",
    paper: "#0D3527",
    paper2: "#123F2F",
    bone: "#EFE7D7"
  },
  noc: {
    name: "Noć",
    paper: "#0B1020",
    paper2: "#151B2E",
    bone: "#E3E8F5"
  }
};
const INKS = [{
  id: "crvena",
  hex: "#D93A2B"
}, {
  id: "zlatna",
  hex: "#C9A227"
}, {
  id: "plava",
  hex: "#4A87F7"
}, {
  id: "zelena",
  hex: "#2FA86B"
}, {
  id: "ljubicasta",
  hex: "#A163E8"
}];
const FONTS = {
  novine: {
    name: "Novine",
    display: "'Oswald', 'Arial Narrow', sans-serif",
    body: "'IBM Plex Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
    track: "0.14em"
  },
  rukopis: {
    name: "Rukopis",
    display: "'Caveat', cursive",
    body: "'Caveat', cursive",
    mono: "'Caveat', cursive",
    track: "0.01em"
  },
  klasika: {
    name: "Klasika",
    display: "'Playfair Display', Georgia, serif",
    body: "'Lora', Georgia, serif",
    mono: "'Lora', Georgia, serif",
    track: "0.05em"
  },
  blok: {
    name: "Blok",
    display: "'Space Grotesk', system-ui, sans-serif",
    body: "'Space Grotesk', system-ui, sans-serif",
    mono: "'Space Mono', ui-monospace, monospace",
    track: "0.03em"
  }
};

/* CSS varijable */
const PAPER = "var(--paper)";
const PAPER_2 = "var(--paper2)";
const INK = "var(--ink)";
const INK_DIM = "var(--ink-dim)";
const INK_SOFT = "var(--ink-soft)";
const BONE = "var(--bone)";
const MUTED = "var(--muted)";
const FAINT = "var(--faint)";
const SURFACE = "var(--surface)";
const display = "var(--f-display)";
const body = "var(--f-body)";
const mono = "var(--f-mono)";
const TRACK = "var(--track)";
const hexA = (hex, a) => {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${a})`;
};

/* ---------- pravila ----------
   štih (10 J Q K A) = 1 · 10♦ = 2 · 2♣ = 1 · 3 na karte = 3  →  25
   pat 26:26  →  22 · tabla = 1
--------------------------------- */
const POOL_FULL = 25;
const POOL_PAT = 22;

/* ---------- cista logika bodovanja ----------
   Bez React-a i bez stanja, da bi je samoprovera mogla pozvati direktno.
   Komponenta ispod je samo tanak omotac. */
function zbirStihova(rounds, id) {
  return rounds.reduce((s, r) => s + (r.points[id] || 0), 0);
}
function zbirTabli(rounds, tables, id) {
  return rounds.reduce((s, r) => s + (r.tables[id] || 0), 0) + (tables[id] || 0);
}
function ukupno(rounds, tables, id) {
  return zbirStihova(rounds, id) + zbirTabli(rounds, tables, id);
}
function vodeci(entities, rounds, tables) {
  return entities.length ? Math.max(...entities.map(e => ukupno(rounds, tables, e.id))) : 0;
}
/* Pobjednik je jedini vodeci koji je dosegao limit; nerijeseno nema pobjednika. */
function pobjednik(entities, rounds, tables, target) {
  const lead = vodeci(entities, rounds, tables);
  const naVrhu = entities.filter(e => ukupno(rounds, tables, e.id) === lead);
  return lead >= target && naVrhu.length === 1 ? naVrhu[0] : null;
}
/* Raspodjela bodova jedne partije: upisani dobijaju sto su upisali, a jedini
   neupisani dobija ostatak do 25 (ili 22 kad je pat). Ako neupisanih ima vise
   od jednog, niko ne dobija automatski. Ostatak ne ide ispod nule. */
function raspodjela(entities, stih, touched, pat) {
  const untouched = entities.filter(e => !touched.includes(e.id));
  const enteredSum = entities.reduce((s, e) => touched.includes(e.id) ? s + (parseInt(stih[e.id], 10) || 0) : s, 0);
  const pool = pat ? POOL_PAT : POOL_FULL;
  const remainder = pool - enteredSum;
  const isAuto = id => !touched.includes(id) && untouched.length === 1;
  const points = {};
  entities.forEach(e => {
    points[e.id] = touched.includes(e.id) ? parseInt(stih[e.id], 10) || 0 : isAuto(e.id) ? Math.max(0, remainder) : 0;
  });
  return {
    untouched,
    enteredSum,
    pool,
    remainder,
    isAuto,
    points
  };
}
const KEY_GAME = "tablic:list:v4";
const KEY_LOOK = "tablic:izgled:v1";

/* ---------- crtice ---------- */
function TallyGroup({
  count,
  size
}) {
  const full = count === 5;
  const strokes = Math.min(4, count);
  const vw = full ? 38 : 7 * strokes + 4;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${vw} 32`,
    style: {
      height: size,
      width: size * vw / 32,
      display: "block",
      overflow: "visible",
      stroke: INK,
      fill: "none",
      strokeWidth: 2.1,
      strokeLinecap: "round"
    }
  }, Array.from({
    length: strokes
  }).map((_, i) => {
    const x = 5 + 7 * i;
    const b = i % 2 ? 0.9 : -0.9;
    return /*#__PURE__*/React.createElement("path", {
      key: i,
      d: `M${x + b * 0.4} 3 C${x - b} 11, ${x + b} 21, ${x - b * 0.5} 29`
    });
  }), full && /*#__PURE__*/React.createElement("path", {
    d: "M0.5 28.5 C9 24, 20 15, 37 3.5"
  }));
}
function Tally({
  n,
  size = 24
}) {
  if (!n) return null;
  const groups = [];
  let left = n;
  while (left > 0) {
    groups.push(Math.min(5, left));
    left -= 5;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-end",
    style: {
      gap: size * 0.42,
      rowGap: size * 0.3
    }
  }, groups.map((g, i) => /*#__PURE__*/React.createElement(TallyGroup, {
    key: i,
    count: g,
    size: size
  })));
}

/* ---------- linije ---------- */
function InkLineV() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 12 100",
    preserveAspectRatio: "none",
    className: "absolute inset-y-0 pointer-events-none",
    style: {
      width: 12,
      marginLeft: -6,
      stroke: INK,
      fill: "none",
      strokeLinecap: "round"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.4 0 C 5.1 12, 7.2 21, 5.8 33 C 4.6 44, 7.4 55, 6.1 67 C 5.0 78, 7.0 88, 5.7 100",
    strokeWidth: "1.2",
    vectorEffect: "non-scaling-stroke"
  }));
}
function InkLineH({
  strong
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 6",
    preserveAspectRatio: "none",
    className: "w-full",
    style: {
      height: strong ? 6 : 4,
      stroke: INK,
      fill: "none",
      strokeLinecap: "round"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 3.6 C 60 1.8, 120 4.4, 190 2.6 C 260 1.2, 330 4.2, 398 2.8",
    strokeWidth: strong ? 2.2 : 1.2,
    vectorEffect: "non-scaling-stroke"
  }));
}
function TablicList() {
  const [phase, setPhase] = useState("setup");
  const [mode, setMode] = useState("2");
  const [names, setNames] = useState(["Igrač 1", "Igrač 2", "Igrač 3", "Igrač 4"]);
  const [teamNames, setTeamNames] = useState(["Mi", "Vi"]);
  const [target, setTarget] = useState(101);
  const [entities, setEntities] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [tables, setTables] = useState({});
  const [dialog, setDialog] = useState(false);
  const [look, setLook] = useState(false);
  const [stih, setStih] = useState({});
  const [touched, setTouched] = useState([]);
  const [pat, setPat] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [renaming, setRenaming] = useState(null);
  const [armed, setArmed] = useState(null); /* "zero" | "reset" | null */

  const [theme, setTheme] = useState("tabla");
  const [font, setFont] = useState("novine");
  const [ink, setInk] = useState(INKS[0].hex);

  /* ---------- snimanje ---------- */
  useEffect(() => {
    (async () => {
      try {
        const l = await window.storage.get(KEY_LOOK);
        if (l?.value) {
          const s = JSON.parse(l.value);
          if (THEMES[s.theme]) setTheme(s.theme);
          if (FONTS[s.font]) setFont(s.font);
          if (s.ink) setInk(s.ink);
        }
      } catch (e) {}
      try {
        const r = await window.storage.get(KEY_GAME);
        if (r?.value) {
          const s = JSON.parse(r.value);
          if (s.phase === "game" && s.entities?.length) {
            setPhase("game");
            setEntities(s.entities);
            setRounds(s.rounds || []);
            setTables(s.tables || {});
            setTarget(s.target || 101);
          }
        }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(KEY_GAME, JSON.stringify({
          phase,
          entities,
          rounds,
          tables,
          target
        }));
      } catch (e) {}
    })();
  }, [phase, entities, rounds, tables, target, loaded]);
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(KEY_LOOK, JSON.stringify({
          theme,
          font,
          ink
        }));
      } catch (e) {}
    })();
  }, [theme, font, ink, loaded]);

  /* ---------- izračun (omotaci oko cistih funkcija gore) ---------- */
  const stihTotal = id => zbirStihova(rounds, id);
  const tableTotal = id => zbirTabli(rounds, tables, id);
  const total = id => ukupno(rounds, tables, id);
  const leader = vodeci(entities, rounds, tables);
  const winner = pobjednik(entities, rounds, tables, target);

  /* ---------- akcije ---------- */
  const start = () => {
    const ents = mode === "teams" ? teamNames.map((n, i) => ({
      id: "t" + i,
      name: n.trim() || `Ekipa ${i + 1}`
    })) : names.slice(0, parseInt(mode, 10)).map((n, i) => ({
      id: "p" + i,
      name: n.trim() || `Igrač ${i + 1}`
    }));
    setEntities(ents);
    setRounds([]);
    setTables(Object.fromEntries(ents.map(e => [e.id, 0])));
    setPhase("game");
  };
  const addTable = (id, d = 1) => setTables(t => ({
    ...t,
    [id]: Math.max(0, (t[id] || 0) + d)
  }));
  const openDialog = () => {
    setStih(Object.fromEntries(entities.map(e => [e.id, ""])));
    setTouched([]);
    setPat(false);
    setDialog(true);
  };
  const {
    untouched,
    enteredSum,
    pool,
    remainder,
    isAuto,
    points: bodoviPartije
  } = raspodjela(entities, stih, touched, pat);
  const roundPoints = id => bodoviPartije[id] || 0;
  const setStihValue = (id, v) => {
    setStih(p => ({
      ...p,
      [id]: v
    }));
    setTouched(t => v === "" ? t.filter(x => x !== id) : t.includes(id) ? t : [...t, id]);
  };
  const commit = () => {
    const points = Object.fromEntries(entities.map(e => [e.id, roundPoints(e.id)]));
    setRounds(r => [...r, {
      points,
      tables: {
        ...tables
      }
    }]);
    setTables(Object.fromEntries(entities.map(e => [e.id, 0])));
    setDialog(false);
  };
  const undoRound = () => setRounds(r => r.slice(0, -1));

  /* Dva opasna dugmeta — „0" (sve na nulu) i „Novi list" — traze drugi tap,
     jer bi se jednim promasajem izgubio cijeli rezultat. `armed` pamti koje je
     naoruzano (samo jedno odjednom); potvrda sama pada nakon tri sekunde. */
  const arm = (koje, radnja) => {
    if (armed !== koje) {
      setArmed(koje);
      return;
    }
    setArmed(null);
    radnja();
  };
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(null), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  /* Sve na nulu: brisu se partije i table, igraci i imena ostaju — za novu
     igru sa istim drustvom. Za prazan list sa novim imenima sluzi „Novi list". */
  const zeroAll = () => arm("zero", () => {
    setRounds([]);
    setTables(Object.fromEntries(entities.map(e => [e.id, 0])));
  });

  /* Preimenovanje na samom listu: partije i table ostaju, mijenja se samo ime.
     Prazno ime se odbacuje — stari upis ostaje netaknut. */
  const rename = (id, value) => {
    const cisto = value.trim();
    setRenaming(null);
    if (!cisto) return;
    setEntities(es => es.map(e => e.id === id ? {
      ...e,
      name: cisto
    } : e));
  };

  /* Novi list: brise sve, i imena, i vraca na pocetni ekran. */
  const reset = () => arm("reset", () => {
    setPhase("setup");
    setRounds([]);
    setTables({});
    setEntities([]);
  });
  const shell = {
    theme,
    font,
    ink
  };

  /* ---------- izbornik izgleda ---------- */
  const LookPanel = () => !look ? null : /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center",
    style: {
      background: "rgba(0,0,0,0.72)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md max-h-[92vh] overflow-y-auto",
    style: {
      background: PAPER_2,
      border: `1px solid ${FAINT}`,
      borderRadius: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-5 py-4",
    style: {
      borderBottom: `1px solid ${FAINT}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: display,
      fontSize: 19,
      color: BONE,
      letterSpacing: TRACK
    }
  }, "IZGLED"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLook(false),
    style: {
      color: BONE
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-5"
  }, /*#__PURE__*/React.createElement(Label, null, "Pozadina"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2 mt-3"
  }, Object.entries(THEMES).map(([id, t]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setTheme(id),
    className: "py-3 flex flex-col items-center gap-2",
    style: {
      background: SURFACE,
      border: `1px solid ${theme === id ? INK : FAINT}`,
      borderRadius: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 2,
      background: t.paper,
      border: `1px solid ${FAINT}`,
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: body,
      fontSize: 11,
      color: theme === id ? BONE : MUTED
    }
  }, t.name)))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6"
  }, /*#__PURE__*/React.createElement(Label, null, "Slova"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mt-3"
  }, Object.entries(FONTS).map(([id, f]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setFont(id),
    className: "py-3 px-3 text-left",
    style: {
      background: SURFACE,
      border: `1px solid ${font === id ? INK : FAINT}`,
      borderRadius: 2,
      color: BONE
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: f.display,
      fontSize: 20,
      letterSpacing: f.track
    }
  }, "TABLI\u0106"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: f.mono,
      fontSize: 13,
      color: MUTED,
      marginTop: 2
    }
  }, "25 \xB7 101"))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6"
  }, /*#__PURE__*/React.createElement(Label, null, "Boja mastila"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2.5 mt-3"
  }, INKS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setInk(c.hex),
    "aria-label": c.id,
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      background: c.hex,
      border: ink === c.hex ? `2px solid ${BONE}` : `1px solid ${FAINT}`,
      outline: ink === c.hex ? `2px solid ${c.hex}` : "none",
      outlineOffset: 2
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mt-7 px-4 py-4",
    style: {
      background: PAPER,
      borderRadius: 2,
      border: `1px solid ${FAINT}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement(Tally, {
    n: 7,
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: mono,
      fontSize: 26,
      color: INK
    }
  }, "17"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLook(false),
    className: "w-full mt-5 py-3.5",
    style: {
      background: BONE,
      color: PAPER,
      fontFamily: display,
      fontSize: 17,
      letterSpacing: TRACK,
      borderRadius: 2
    }
  }, "GOTOVO"))));

  /* ---------- SETUP ---------- */
  if (phase === "setup") {
    const count = mode === "teams" ? 2 : parseInt(mode, 10);
    return /*#__PURE__*/React.createElement(Shell, shell, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-md mx-auto px-5 py-10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between"
    }, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: () => setLook(true),
      title: "Izgled"
    }, /*#__PURE__*/React.createElement(Palette, {
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "mt-9"
    }, /*#__PURE__*/React.createElement(Label, null, "Ko igra"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-4 gap-2 mt-3"
    }, [["2", "2"], ["3", "3"], ["4", "4"], ["teams", "2×2"]].map(([v, l]) => /*#__PURE__*/React.createElement(Choice, {
      key: v,
      on: mode === v,
      onClick: () => setMode(v)
    }, l)))), /*#__PURE__*/React.createElement("div", {
      className: "mt-7"
    }, /*#__PURE__*/React.createElement(Label, null, mode === "teams" ? "Imena ekipa" : "Imena"), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 space-y-2"
    }, Array.from({
      length: count
    }).map((_, i) => /*#__PURE__*/React.createElement("input", {
      key: i,
      value: mode === "teams" ? teamNames[i] : names[i],
      onChange: e => {
        const v = e.target.value;
        if (mode === "teams") setTeamNames(n => n.map((x, j) => j === i ? v : x));else setNames(n => n.map((x, j) => j === i ? v : x));
      },
      className: "w-full px-4 py-3 outline-none",
      style: {
        background: PAPER_2,
        color: BONE,
        border: `1px solid ${FAINT}`,
        borderRadius: 2,
        fontFamily: body,
        fontSize: 16
      }
    })))), /*#__PURE__*/React.createElement("div", {
      className: "mt-7"
    }, /*#__PURE__*/React.createElement(Label, null, "Do koliko"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2 mt-3"
    }, [101, 151, 201].map(t => /*#__PURE__*/React.createElement(Choice, {
      key: t,
      on: target === t,
      onClick: () => setTarget(t),
      num: true
    }, t)))), /*#__PURE__*/React.createElement("button", {
      onClick: start,
      className: "w-full mt-10 py-4 active:scale-[0.99] transition-transform",
      style: {
        background: BONE,
        color: PAPER,
        fontFamily: display,
        fontSize: 20,
        letterSpacing: TRACK,
        borderRadius: 2
      }
    }, "OTVORI LIST"), /*#__PURE__*/React.createElement("p", {
      className: "mt-7",
      style: {
        fontFamily: mono,
        fontSize: 12,
        lineHeight: 1.8,
        color: MUTED
      }
    }, "\u0160TIH (10 J Q K A) = 1 \xB7 10\u2666 = 2 \xB7 2\u2663 = 1 \xB7 3 NA KARTE = 3", /*#__PURE__*/React.createElement("br", null), "PARTIJA 25 \xB7 PAT 22 \xB7 TABLA 1")), /*#__PURE__*/React.createElement(LookPanel, null));
  }

  /* ---------- LIST ---------- */
  const n = entities.length;
  const big = n <= 2;
  return /*#__PURE__*/React.createElement(Shell, shell, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md mx-auto px-4 py-6 pb-32"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between mb-6"
  }, /*#__PURE__*/React.createElement(Header, {
    small: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1"
  }, /*#__PURE__*/React.createElement(IconBtn, {
    onClick: () => setLook(true),
    title: "Izgled"
  }, /*#__PURE__*/React.createElement(Palette, {
    size: 16
  })), /*#__PURE__*/React.createElement(IconBtn, {
    onClick: undoRound,
    disabled: !rounds.length,
    title: "Obri\u0161i zadnju partiju"
  }, /*#__PURE__*/React.createElement(Undo2, {
    size: 16
  })), /*#__PURE__*/React.createElement(IconBtn, {
    onClick: zeroAll,
    disabled: !rounds.length && entities.every(e => !tables[e.id]),
    title: armed === "zero" ? "Tapni još jednom da potvrdiš" : "Sve na nulu — imena ostaju"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: mono,
      fontSize: 15,
      lineHeight: "16px",
      display: "block",
      width: 16,
      textAlign: "center",
      color: armed === "zero" ? INK : BONE
    }
  }, armed === "zero" ? "?" : "0")), /*#__PURE__*/React.createElement(IconBtn, {
    onClick: reset,
    title: armed === "reset" ? "Tapni još jednom da potvrdiš" : "Novi list — briše sve, i imena"
  }, armed === "reset" ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: mono,
      fontSize: 15,
      lineHeight: "16px",
      display: "block",
      width: 16,
      textAlign: "center",
      color: INK
    }
  }, "?") : /*#__PURE__*/React.createElement(RotateCcw, {
    size: 16
  })))), winner && /*#__PURE__*/React.createElement("div", {
    className: "mb-5 px-4 py-4 flex items-center gap-3",
    style: {
      background: INK,
      color: "#fff",
      borderRadius: 2
    }
  }, /*#__PURE__*/React.createElement(Trophy, {
    size: 22
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: display,
      fontSize: 22,
      letterSpacing: TRACK
    }
  }, winner.name.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: body,
      fontSize: 14
    }
  }, total(winner.id), " bodova"))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: `repeat(${n}, 1fr)`
    }
  }, entities.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    className: "px-2 pb-2 text-center truncate min-w-0"
  }, renaming === e.id ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    defaultValue: e.name,
    onFocus: ev => ev.target.select(),
    onBlur: ev => rename(e.id, ev.target.value),
    onKeyDown: ev => {
      if (ev.key === "Enter") ev.target.blur();
      if (ev.key === "Escape") setRenaming(null);
    },
    className: "w-full text-center outline-none",
    style: {
      fontFamily: display,
      fontSize: big ? 21 : 15,
      letterSpacing: TRACK,
      color: BONE,
      background: PAPER_2,
      border: 0,
      borderRadius: 2,
      padding: "2px 4px"
    }
  }) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setRenaming(e.id),
    title: "Tapni da promijeni\u0161 ime",
    className: "block w-full truncate",
    style: {
      fontFamily: display,
      fontSize: big ? 21 : 15,
      letterSpacing: TRACK,
      color: BONE,
      background: "transparent",
      border: 0
    }
  }, e.name.toUpperCase())))), /*#__PURE__*/React.createElement(InkLineH, {
    strong: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, Array.from({
    length: n - 1
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "absolute inset-y-0",
    style: {
      left: `${(i + 1) / n * 100}%`
    }
  }, /*#__PURE__*/React.createElement(InkLineV, null))), rounds.map((r, ri) => /*#__PURE__*/React.createElement("div", {
    key: ri,
    className: "grid items-center",
    style: {
      gridTemplateColumns: `repeat(${n}, 1fr)`,
      minHeight: 46
    }
  }, entities.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    className: "flex items-center justify-between gap-2 px-3 py-2"
  }, /*#__PURE__*/React.createElement(Tally, {
    n: r.tables[e.id] || 0,
    size: big ? 20 : 15
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: mono,
      fontSize: big ? 25 : 18,
      color: INK,
      marginLeft: "auto"
    }
  }, r.points[e.id] || 0))))), /*#__PURE__*/React.createElement("div", {
    className: "grid items-center",
    style: {
      gridTemplateColumns: `repeat(${n}, 1fr)`,
      minHeight: 58,
      background: INK_SOFT
    }
  }, entities.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    onClick: () => addTable(e.id, 1),
    className: "flex items-center justify-between gap-2 px-3 py-3 cursor-pointer select-none active:scale-[0.98] transition-transform"
  }, /*#__PURE__*/React.createElement(Tally, {
    n: tables[e.id] || 0,
    size: big ? 20 : 15
  }), tables[e.id] ? /*#__PURE__*/React.createElement("button", {
    onClick: ev => {
      ev.stopPropagation();
      addTable(e.id, -1);
    },
    className: "p-1.5 shrink-0",
    style: {
      background: SURFACE,
      color: BONE,
      borderRadius: 2,
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(Minus, {
    size: 13
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: mono,
      fontSize: big ? 22 : 17,
      color: INK_DIM,
      marginLeft: "auto"
    }
  }, "+")))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px dashed ${FAINT}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid items-center",
    style: {
      gridTemplateColumns: `repeat(${n}, 1fr)`,
      minHeight: 46
    }
  }, entities.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    className: "flex items-center justify-between gap-2 px-3 py-2"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: mono,
      fontSize: 11,
      letterSpacing: "0.1em",
      color: MUTED
    }
  }, "TABLE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: mono,
      fontSize: big ? 25 : 18,
      color: INK,
      marginLeft: "auto"
    }
  }, tableTotal(e.id)))))), /*#__PURE__*/React.createElement(InkLineH, {
    strong: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: `repeat(${n}, 1fr)`
    }
  }, entities.map(e => {
    const t = total(e.id);
    const lead = t === leader && leader > 0;
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      className: "px-3 pt-3 text-right"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: mono,
        fontSize: big ? 40 : 28,
        color: lead ? INK : BONE,
        lineHeight: 1
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: mono,
        fontSize: 11,
        color: MUTED,
        letterSpacing: "0.06em",
        marginTop: 5
      }
    }, stihTotal(e.id), " + ", tableTotal(e.id), "T"));
  }))), /*#__PURE__*/React.createElement("p", {
    className: "mt-6 text-center",
    style: {
      fontFamily: body,
      fontSize: 13,
      color: MUTED
    }
  }, "Tapni u zadnji red da upi\u0161e\u0161 tablu \xB7 tapni ime da ga promijeni\u0161 \xB7 partija ", rounds.length + 1, rounds.length < 6 ? " od 6" : "")), /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-0 left-0 right-0 px-4 py-4",
    style: {
      background: `linear-gradient(to top, ${PAPER} 62%, transparent)`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: openDialog,
    className: "w-full max-w-md mx-auto block py-4 active:scale-[0.99] transition-transform",
    style: {
      background: BONE,
      color: PAPER,
      fontFamily: display,
      fontSize: 18,
      letterSpacing: TRACK,
      borderRadius: 2
    }
  }, "UPI\u0160I PARTIJU")), dialog && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center",
    style: {
      background: "rgba(0,0,0,0.72)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md max-h-[92vh] overflow-y-auto",
    style: {
      background: PAPER_2,
      border: `1px solid ${FAINT}`,
      borderRadius: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-5 py-4",
    style: {
      borderBottom: `1px solid ${FAINT}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: display,
      fontSize: 19,
      color: BONE,
      letterSpacing: TRACK
    }
  }, "PARTIJA ", rounds.length + 1), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDialog(false),
    style: {
      color: BONE
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement(Label, null, "Bodovi \xB7 ukupno ", pool), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPat(p => !p),
    className: "px-3 py-1.5",
    style: {
      fontFamily: mono,
      fontSize: 13,
      letterSpacing: "0.08em",
      background: pat ? INK : SURFACE,
      color: pat ? "#fff" : MUTED,
      border: `1px solid ${pat ? INK : FAINT}`,
      borderRadius: 2
    }
  }, "PAT")), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 space-y-3"
  }, entities.map(e => {
    const auto = isAuto(e.id);
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      className: "flex items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: display,
        fontSize: 18,
        color: BONE,
        letterSpacing: TRACK
      }
    }, e.name.toUpperCase()), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, auto && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: mono,
        fontSize: 11,
        color: INK,
        letterSpacing: "0.08em"
      }
    }, "AUTO"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      inputMode: "numeric",
      placeholder: "\u2014",
      value: touched.includes(e.id) ? stih[e.id] : auto ? String(Math.max(0, remainder)) : "",
      onChange: ev => setStihValue(e.id, ev.target.value),
      className: "w-24 px-3 py-2 text-right outline-none",
      style: {
        background: PAPER,
        color: auto ? INK : BONE,
        border: `1px solid ${auto ? INK_DIM : FAINT}`,
        borderRadius: 2,
        fontFamily: mono,
        fontSize: 18
      }
    })));
  })), /*#__PURE__*/React.createElement("p", {
    className: "mt-3",
    style: {
      fontFamily: mono,
      fontSize: 12,
      color: MUTED,
      letterSpacing: "0.04em"
    }
  }, pat ? "PAT 26:26 · TRI NA KARTE NE IDU NIKOME" : "UKLJUČUJE TRI NA KARTE"), remainder < 0 && untouched.length <= 1 && /*#__PURE__*/React.createElement("p", {
    className: "mt-1",
    style: {
      fontFamily: mono,
      fontSize: 12,
      color: INK
    }
  }, "PREKORA\u010CENO ZA ", -remainder), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-4 space-y-2",
    style: {
      borderTop: `1px solid ${FAINT}`
    }
  }, entities.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    className: "flex justify-between items-baseline",
    style: {
      fontFamily: mono,
      fontSize: 14,
      color: BONE
    }
  }, /*#__PURE__*/React.createElement("span", null, e.name), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: MUTED
    }
  }, stihTotal(e.id), " + ", roundPoints(e.id), " + ", tableTotal(e.id), "T", " = "), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      color: INK
    }
  }, total(e.id) + roundPoints(e.id)))))), /*#__PURE__*/React.createElement("button", {
    onClick: commit,
    className: "w-full mt-5 py-3.5 flex items-center justify-center gap-2",
    style: {
      background: BONE,
      color: PAPER,
      fontFamily: display,
      fontSize: 17,
      letterSpacing: TRACK,
      borderRadius: 2
    }
  }, /*#__PURE__*/React.createElement(Check, {
    size: 17
  }), " UPI\u0160I")))), /*#__PURE__*/React.createElement(LookPanel, null));
}

/* ---------- omotači ---------- */
function Shell({
  children,
  theme,
  font,
  ink
}) {
  const t = THEMES[theme] || THEMES.tabla;
  const f = FONTS[font] || FONTS.novine;
  const b = t.bone;
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen w-full",
    style: {
      "--paper": t.paper,
      "--paper2": t.paper2,
      "--bone": b,
      "--muted": hexA(b, 0.5),
      "--faint": hexA(b, 0.16),
      "--surface": hexA(b, 0.06),
      "--ink": ink,
      "--ink-dim": hexA(ink, 0.45),
      "--ink-soft": hexA(ink, 0.07),
      "--f-display": f.display,
      "--f-body": f.body,
      "--f-mono": f.mono,
      "--track": f.track,
      background: PAPER,
      fontFamily: body
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Caveat:wght@500;700&family=Playfair+Display:wght@500;700&family=Lora:wght@400;600&family=Space+Grotesk:wght@400;600&family=Space+Mono:wght@400;700&display=swap');
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `), children);
}
function Header({
  small
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: display,
      fontSize: small ? 26 : 44,
      letterSpacing: TRACK,
      color: BONE,
      lineHeight: 1
    }
  }, "TABLI\u0106"), !small && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: mono,
      fontSize: 12,
      letterSpacing: "0.2em",
      color: INK,
      marginTop: 9
    }
  }, "LIST ZA PISANJE"));
}
function Label({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 11,
      letterSpacing: "0.16em",
      color: MUTED
    }
  }, children.toString().toUpperCase());
}
function Choice({
  children,
  on,
  onClick,
  num,
  pad
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: pad ? "px-4 py-2" : "py-3",
    style: {
      fontFamily: num ? mono : display,
      fontSize: num ? 16 : 18,
      letterSpacing: TRACK,
      background: on ? INK : SURFACE,
      color: on ? "#fff" : MUTED,
      border: `1px solid ${on ? INK : FAINT}`,
      borderRadius: 2
    }
  }, children);
}
function IconBtn({
  children,
  onClick,
  disabled,
  title
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    title: title,
    className: "p-2.5 disabled:opacity-25",
    style: {
      background: SURFACE,
      color: BONE,
      border: `1px solid ${FAINT}`,
      borderRadius: 2
    }
  }, children);
}

/* ---------- samoprovera ----------
   Pokrece se sa #test umjesto aplikacije, ili iz konzole: samoprovera().
   Ista konvencija kao u ostalim alatima: proveri(naziv, dobio, ocekivano)
   poredi preko JSON.stringify, naslov kartice je OK n/n ili PALO n/n.
   Izuzetak u tvrdnjama se hvata i broji kao pad — inace bi ekran ostao prazan. */
function samoprovera() {
  const redovi = [];
  let ukupnoTvrdnji = 0;
  let palo = 0;
  function proveri(naziv, dobio, ocekivano) {
    ukupnoTvrdnji++;
    const d = JSON.stringify(dobio);
    const o = JSON.stringify(ocekivano);
    if (d === o) {
      redovi.push("OK    " + naziv);
    } else {
      palo++;
      redovi.push("PALO  " + naziv + "\n      dobio:     " + d + "\n      ocekivano: " + o);
    }
  }
  function sveTvrdnje() {
    const dva = [{
      id: "p0",
      name: "A"
    }, {
      id: "p1",
      name: "B"
    }];
    const tri = [{
      id: "p0",
      name: "A"
    }, {
      id: "p1",
      name: "B"
    }, {
      id: "p2",
      name: "C"
    }];

    /* raspodjela partije */
    proveri("jedan upisan, drugi dobija ostatak do 25", raspodjela(dva, {
      p0: "14",
      p1: ""
    }, ["p0"], false).points, {
      p0: 14,
      p1: 11
    });
    proveri("pat: ostatak do 22", raspodjela(dva, {
      p0: "14",
      p1: ""
    }, ["p0"], true).points, {
      p0: 14,
      p1: 8
    });
    proveri("niko nije upisao: sve nula, nema automatike", raspodjela(dva, {
      p0: "",
      p1: ""
    }, [], false).points, {
      p0: 0,
      p1: 0
    });
    proveri("oba upisana: bez dopune", raspodjela(dva, {
      p0: "10",
      p1: "10"
    }, ["p0", "p1"], false).points, {
      p0: 10,
      p1: 10
    });
    proveri("prekoraceno: ostatak ne ide ispod nule", raspodjela(dva, {
      p0: "30",
      p1: ""
    }, ["p0"], false).points, {
      p0: 30,
      p1: 0
    });
    proveri("prekoraceno: remainder je negativan", raspodjela(dva, {
      p0: "30",
      p1: ""
    }, ["p0"], false).remainder, -5);
    proveri("tri igraca, dva upisana, treci dobija ostatak", raspodjela(tri, {
      p0: "10",
      p1: "7",
      p2: ""
    }, ["p0", "p1"], false).points, {
      p0: 10,
      p1: 7,
      p2: 8
    });
    proveri("tri igraca, jedan upisan: nema automatike", raspodjela(tri, {
      p0: "10",
      p1: "",
      p2: ""
    }, ["p0"], false).points, {
      p0: 10,
      p1: 0,
      p2: 0
    });
    proveri("neispravan unos broji se kao nula", raspodjela(dva, {
      p0: "abc",
      p1: ""
    }, ["p0"], false).points, {
      p0: 0,
      p1: 25
    });
    proveri("isAuto za jedinog neupisanog", raspodjela(dva, {
      p0: "14",
      p1: ""
    }, ["p0"], false).isAuto("p1"), true);
    proveri("isAuto nije za upisanog", raspodjela(dva, {
      p0: "14",
      p1: ""
    }, ["p0"], false).isAuto("p0"), false);
    proveri("pool bez pata", raspodjela(dva, {}, [], false).pool, 25);
    proveri("pool sa patom", raspodjela(dva, {}, [], true).pool, 22);

    /* zbirovi */
    const partije = [{
      points: {
        p0: 14,
        p1: 11
      },
      tables: {
        p0: 1,
        p1: 0
      }
    }, {
      points: {
        p0: 20,
        p1: 5
      },
      tables: {
        p0: 0,
        p1: 2
      }
    }];
    proveri("zbir stihova", zbirStihova(partije, "p0"), 34);
    proveri("zbir tabli iz partija plus tekuce", zbirTabli(partije, {
      p0: 3,
      p1: 0
    }, "p0"), 4);
    proveri("zbir tabli bez tekucih", zbirTabli(partije, {}, "p1"), 2);
    proveri("ukupno = stihovi + table", ukupno(partije, {
      p0: 3
    }, "p0"), 38);
    proveri("ukupno za igraca bez partija", ukupno([], {}, "p0"), 0);
    proveri("vodeci", vodeci(dva, partije, {}), 35);
    proveri("vodeci bez igraca", vodeci([], [], {}), 0);

    /* pobjednik */
    proveri("ispod limita nema pobjednika", pobjednik(dva, partije, {}, 101), null);
    proveri("na limitu jedini vodeci pobjeduje", pobjednik(dva, partije, {}, 35).id, "p0");
    proveri("preko limita pobjeduje", pobjednik(dva, partije, {}, 30).id, "p0");
    const nerijeseno = [{
      points: {
        p0: 20,
        p1: 20
      },
      tables: {}
    }];
    proveri("nerijeseno na limitu: nema pobjednika", pobjednik(dva, nerijeseno, {}, 20), null);
    proveri("nerijeseno ispod limita: nema pobjednika", pobjednik(dva, nerijeseno, {}, 25), null);
  }
  try {
    sveTvrdnje();
  } catch (e) {
    ukupnoTvrdnji++;
    palo++;
    redovi.push("PALO  izuzetak u tvrdnjama: " + (e && e.message));
  }
  const naslov = (palo ? "PALO " + palo : "OK " + ukupnoTvrdnji) + "/" + ukupnoTvrdnji;
  document.title = naslov;
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = "";
    const pre = document.createElement("pre");
    pre.style.cssText = "color:#EDE6DA;background:#0A0A0B;padding:16px;margin:0;min-height:100vh;" + "font:14px/1.5 ui-monospace,monospace;white-space:pre-wrap";
    pre.textContent = naslov + "\n\n" + redovi.join("\n");
    root.appendChild(pre);
  }
  return {
    naslov,
    ukupno: ukupnoTvrdnji,
    palo,
    redovi
  };
}
window.samoprovera = samoprovera;
if (location.hash === "#test") {
  samoprovera();
} else {
  ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(TablicList, null));
}
