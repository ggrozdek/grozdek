import React, { useMemo, useState } from "react";

/**
 * Burger Builder – MOBILE FIRST (brez opisov)
 * -------------------------------------------------
 * - En sam stolpec (primeren za telefon)
 * - Brez desnega opisa / kartic – prikazujejo se samo slike in nazivi
 * - Več omak (multi-select) z "Brez omake"
 * - Dodatki (multi-select)
 * - Polje za ime + gumb Oddaj (kopira JSON v odložišče)
 *
 * Opomba: Poti do slik so usklajene z zadnjo tvojo verzijo.
 */

type ImgOpt = { name: string; img: string };

type SingleLayerKey =
  | "bunTop"
  | "bacon"
  | "onion"
  | "tomato"
  | "lettuce"
  | "cheese"
  | "patty"
  | "bunBottom";

// --- Image paths (iz tvoje zadnje datoteke)
const IMG = {
  bunTop: {
    sesame: "/img/bun_top.png",
    plain: "/img/bun_top_brez.png",
  },
  bunBottom: {
    sesame: "/img/bun_bottom.png",
    plain: "/img/bun_bottom.png",
  },
  bacon: {
    bacon: "/img/bacon.png",
    panceta: "/img/panceta.png",
    none: "/img/empty.png",
  },
  onion: {
    red: "/img/onion_red.png",
    white: "/img/onion_white.png",
    fried: "/img/onion_crispy.png",
    caramel: "/img/onion_caramelized.png",
    none: "/img/empty.png",
  },
  tomato: {
    big: "/img/tomato.png",
    cherry: "/img/tomato_cherry.png",
    none: "/img/empty.png",
  },
  lettuce: {
    green: "/img/lettuce_green.png",
    rucola: "/img/rukola.png",
    coleslaw: "/img/coleslaw.png",
    none: "/img/empty.png",
  },
  cheese: {
    gauda: "/img/gauda.png",
    cheddar: "/img/cheddar.png",
    mozzarella: "/img/mozarella.png",
    ementaler: "/img/ementaler.png",
    edamec: "/img/edam.png",
  },
  patty: {
    beef: "/img/beef.png",
    smash_double: "/img/smash.png",
    chicken_shredded: "/img/shredded_chicken.png",
    chicken_fried: "/img/chicken_fried.png",
    chicken_roasted: "/img/chicken_cooked.png",
  },
  sauce: {
    mayo: "/img/mayo.png",
    ketchup: "/img/ketchup.png",
    mustard: "/img/mustard.png",
    bbq: "/img/bbq.png",
    sirracha: "/img/sirracha.png",
    house: "/img/house.png",
    bigmac: "/img/bigmac.png",
    sirracha_mayo: "/img/sirracha_mayo.png",
    cocktail: "/img/cocktail.png",
  },
  extras: {
    feferoni: "/img/jalapeno.png",
    paprika: "/img/pepper.png",
    kumarice: "/img/pickle.png",
    jajca: "/img/egg.png",
  },
  empty: "/img/empty.png",
} as const;

// --- Layer options (BREZ opisov)
const LAYERS: Record<SingleLayerKey, ImgOpt[]> = {
  bunTop: [
    { name: "Z sezamom", img: IMG.bunTop.sesame },
    { name: "Brez sezama", img: IMG.bunTop.plain },
  ],
  bacon: [
    { name: "Slanina", img: IMG.bacon.bacon },
    { name: "Panceta", img: IMG.bacon.panceta },
    { name: "Brez slanine", img: IMG.bacon.none },
  ],
  onion: [
    { name: "Rdeča", img: IMG.onion.red },
    { name: "Bela", img: IMG.onion.white },
    { name: "Ocvrta", img: IMG.onion.fried },
    { name: "Karamelizirana", img: IMG.onion.caramel },
    { name: "Brez čebule", img: IMG.onion.none },
  ],
  tomato: [
    { name: "Rezine velikega", img: IMG.tomato.big },
    { name: "Rezine češnjevega", img: IMG.tomato.cherry },
    { name: "Brez paradižnika", img: IMG.tomato.none },
  ],
  lettuce: [
    { name: "Zelena solata", img: IMG.lettuce.green },
    { name: "Rukola", img: IMG.lettuce.rucola },
    { name: "Coleslaw", img: IMG.lettuce.coleslaw },
    { name: "Brez solate", img: IMG.lettuce.none },
  ],
  cheese: [
    { name: "Gauda", img: IMG.cheese.gauda },
    { name: "Cheddar", img: IMG.cheese.cheddar },
    { name: "Mozzarella", img: IMG.cheese.mozzarella },
    { name: "Ementaler", img: IMG.cheese.ementaler },
    { name: "Edamec", img: IMG.cheese.edamec },
    { name: "Brez sira", img: IMG.empty },
  ],
  patty: [
    { name: "Goveje", img: IMG.patty.beef },
    { name: "Smash goveje (2 kosa)", img: IMG.patty.smash_double },
    { name: "Shredded Piščanec", img: IMG.patty.chicken_shredded },
    { name: "Ocvrt Piščanec", img: IMG.patty.chicken_fried },
    { name: "Pečen piščanec", img: IMG.patty.chicken_roasted },
  ],
  bunBottom: [
    { name: "Z sezamom", img: IMG.bunBottom.sesame },
    { name: "Brez sezama", img: IMG.bunBottom.plain },
  ],
};

// Omake – multi-select (vključno z "Brez_omake" kot ploščica, ki počisti izbor)
const SAUCES: ImgOpt[] = [
  { name: "Majoneza", img: IMG.sauce.mayo },
  { name: "Ketchup", img: IMG.sauce.ketchup },
  { name: "Gorčica", img: IMG.sauce.mustard },
  { name: "BBQ", img: IMG.sauce.bbq },
  { name: "Sirracha", img: IMG.sauce.sirracha },
  { name: "Hišna", img: IMG.sauce.house },
  { name: "Big mac", img: IMG.sauce.bigmac },
  { name: "Cocktail", img: IMG.sauce.cocktail },
  { name: "Sirracha_mayo", img: IMG.sauce.sirracha_mayo },
  { name: "Brez_omake", img: IMG.empty },
];

// Dodatki – multi-select
const EXTRAS = [
  { key: "feferoni", name: "Feferoni", img: IMG.extras.feferoni },
  { key: "paprika", name: "Paprika", img: IMG.extras.paprika },
  { key: "kumarice", name: "Kumarice", img: IMG.extras.kumarice },
  { key: "jajca", name: "Jajca na oko", img: IMG.extras.jajca },
];

// vrstni red vrstic
const ORDER: SingleLayerKey[] = [
  "bunTop",
  "bacon",
  "onion",
  "tomato",
  "lettuce",
  "cheese",
  "patty",
  "bunBottom",
];

export default function App() {
  // single-select plasti
  const [idx, setIdx] = useState<Record<SingleLayerKey, number>>(
    ORDER.reduce((acc, k) => ({ ...acc, [k]: 0 }), {} as Record<SingleLayerKey, number>)
  );
  // multi-select
  const [sauces, setSauces] = useState<Record<string, boolean>>({});
  const [extras, setExtras] = useState<Record<string, boolean>>({});
  const [guest, setGuest] = useState("");

  function cycle(k: SingleLayerKey, dir: 1 | -1) {
    const list = LAYERS[k];
    setIdx((v) => ({ ...v, [k]: (v[k] + (dir === 1 ? 1 : list.length - 1)) % list.length }));
  }
  function pick(k: SingleLayerKey, name: string) {
    const i = LAYERS[k].findIndex((o) => o.name === name);
    if (i >= 0) setIdx((v) => ({ ...v, [k]: i }));
  }

  function setNoSauceOnly() { setSauces({ Brez_omake: true }); }
  function toggleSauce(name: string) {
    setSauces((prev) => {
      if (name === "Brez_omake") return { Brez_omake: true };
      const next = { ...prev, [name]: !prev[name], Brez_omake: false };
      return next;
    });
  }
  function toggleExtra(key: string) { setExtras((e) => ({ ...e, [key]: !e[key] })); }

  const summary = useMemo(() => ({
    guest: guest || "",
    bunTop: LAYERS.bunTop[idx.bunTop].name,
    bacon: LAYERS.bacon[idx.bacon].name,
    onion: LAYERS.onion[idx.onion].name,
    tomato: LAYERS.tomato[idx.tomato].name,
    lettuce: LAYERS.lettuce[idx.lettuce].name,
    cheese: LAYERS.cheese[idx.cheese].name,
    patty: LAYERS.patty[idx.patty].name,
    bunBottom: LAYERS.bunBottom[idx.bunBottom].name,
    sauces: Object.entries(sauces).filter(([_, v]) => v).map(([n]) => n),
    extras: Object.entries(extras).filter(([_, v]) => v).map(([k]) => EXTRAS.find(x=>x.key===k)?.name || k),
  }), [idx, sauces, extras, guest]);

  function copyOrder() {
    const text = JSON.stringify(summary, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      alert("Naročilo kopirano v odložišče! Pošlji mi ga v chat / SMS.");
    }, () => alert("Ni uspelo kopirati – morda brskalnik blokira."));
  }

  return (
    <div className="wrap">
      <style>{css}</style>

      <header className="head">
        <h1>🍔 Burger Builder</h1>
      </header>

      <main>
        {/* Ime gosta */}
        <div className="card">
          <label className="label">Tvoje ime</label>
          <input className="input" value={guest} onChange={e=>setGuest(e.target.value)} placeholder="npr. Ana" />
        </div>

        {/* Vrstice burgerja */}
        {ORDER.map((k) => (
          <Row
            key={k}
            label={labelOf(k)}
            option={LAYERS[k][idx[k]]}
            options={LAYERS[k]}
            onPrev={() => cycle(k, -1)}
            onNext={() => cycle(k, 1)}
            onPick={(name) => pick(k, name)}
          />
        ))}

        {/* Omake */}
        <div className="card">
          <div className="label">Omaka (izbereš lahko več)</div>
          <div className="row-actions">
            <button className="chip" onClick={setNoSauceOnly}>Brez omake</button>
          </div>
          <div className="thumb-grid">
            {SAUCES.map((s) => (
              <button
                key={s.name}
                className={`thumb ${sauces[s.name] ? "active" : ""}`}
                onClick={() => toggleSauce(s.name)}
              >
                <img src={s.img} alt={s.name} />
                <div className="thumb-title">{s.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dodatki */}
        <div className="card">
          <div className="label">Dodatki</div>
          <div className="thumb-grid">
            {EXTRAS.map((x) => (
              <button
                key={x.key}
                className={`thumb ${extras[x.key] ? "active" : ""}`}
                onClick={() => toggleExtra(x.key)}
              >
                <img src={x.img} alt={x.name} />
                <div className="thumb-title">{x.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Oddaja */}
        <div className="submit">
          <button className="primary" onClick={copyOrder}>Oddaj (kopiraj)</button>
          <div className="hint">Tapni »Oddaj« in prilepi v chat / SMS, da boš vedel, kdo je kaj izbral.</div>
        </div>
      </main>

      <footer className="foot">Mobilna različica – brez opisov. Če želiš backend/shranjevanje, ti dodam API.</footer>
    </div>
  );
}

function Row({
  label,
  option,
  options,
  onPrev,
  onNext,
  onPick,
}: {
  label: string;
  option: ImgOpt;
  options: ImgOpt[];
  onPrev: () => void;
  onNext: () => void;
  onPick: (name: string) => void;
}) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="row-main">
        <button className="arrow" onClick={onPrev} aria-label="prejšnja">←</button>
        <div className="layer"><img src={option.img} alt={option.name} /></div>
        <button className="arrow" onClick={onNext} aria-label="naslednja">→</button>
      </div>
      <div className="chips">
        {options.map((o) => (
          <button key={o.name} onClick={() => onPick(o.name)} className={`chip ${o.name === option.name ? "active" : ""}`}>
            {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function labelOf(k: SingleLayerKey) {
  return (
    {
      bunTop: "Bombetka (zgoraj)",
      bacon: "Slanina",
      onion: "Čebula",
      tomato: "Paradižnik",
      lettuce: "Solata",
      cheese: "Sir",
      patty: "Meso",
      bunBottom: "Bombetka (spodaj)",
    } as Record<SingleLayerKey, string>
  )[k];
}

const css = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body, #root { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; background:#fafafa; }

  .wrap { max-width: 720px; margin: 0 auto; padding: 12px; }
  .head { position: sticky; top: 0; background: #fafafa; padding: 12px 0; z-index: 5; }
  .head h1 { margin: 0; font-size: 20px; }

  main { display: flex; flex-direction: column; gap: 10px; }

  .card { background:#fff; border:1px solid #eee; border-radius: 14px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
  .label { font-size: 13px; opacity:.7; margin-bottom: 8px; }

  .input { width: 100%; padding: 10px 12px; border-radius: 10px; border:1px solid #ddd; font-size: 16px; }

  .row-main { display:grid; grid-template-columns: 48px 1fr 48px; align-items: center; gap: 8px; }
  .arrow { height: 48px; border-radius: 12px; border:1px solid #e0e0e0; background:#f7f7f7; font-size: 20px; }
  .arrow:active { transform: translateY(1px); }

  .layer { display:flex; align-items:center; justify-content:center; height: 120px; }
  .layer img { max-height: 100%; max-width: 100%; object-fit: contain; }

  .chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
  .chip { padding:8px 12px; border-radius:999px; border:1px solid #e0e0e0; background:#fff; font-size:14px; }
  .chip.active { background:#111; color:#fff; border-color:#111; }

  .thumb-grid { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:10px; }
  .thumb { display:flex; flex-direction:column; align-items:center; gap:6px; padding:10px; border-radius:12px; border:1px solid #eee; background:#fff; }
  .thumb.active { outline:2px solid #111; }
  .thumb img { height:60px; object-fit:contain; }
  .thumb-title { font-size: 13px; }

  .submit { display:flex; flex-direction:column; align-items:center; gap:8px; padding: 6px 0 16px; }
  .primary { background:#111; color:#fff; border:none; border-radius:12px; padding:12px 16px; font-size:16px; }
  .hint { font-size:12px; opacity:.7; text-align:center; }

  .foot { text-align:center; font-size:12px; opacity:.6; padding-bottom: 24px; }
`;
