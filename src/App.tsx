import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Burger Builder – MOBILE FIRST (brez opisov) + oddaja na GitHub Pages z Web3Forms
 * --------------------------------------------------------------------------------
 * - En stolpec (telefon)
 * - Brez desnih opisov
 * - Več omak (multi-select) z "Brez omake"
 * - Dodatki (multi-select)
 * - Polje za ime + gumb Oddaj
 * - Po oddaji: preusmeri na novo "stran" #/hvala z velikim napisom "Hvala za naročilo"
 * - Pošiljanje naročila: uporabi Web3Forms (brez strežnika). DODAJ svoj access_key spodaj.
 *   Uporabi dashboard.web3forms.com, ustvari Access Key in ga prilepi v CONFIG.web3formsKey.
 *   (Brez ključа bo app vseeno preusmeril na #/hvala, a pošta se ne bo poslala.)
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

// Nastavitve – prilagojeno tvojim podatkom
const CONFIG = {
  owner: "ggrozdek", // za referenco (trenutno se ne uporablja)
  repo: "grozdek",   // ime repozitorija (brez .git)
  web3formsKey: "REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY", // <-- sem prilepi svoj ključ
  redirectUrl: `${process.env.PUBLIC_URL}/#/hvala`,
};

// Helper za absolutne poti do slik na GitHub Pages
const img = (p: string) => `${process.env.PUBLIC_URL}${p}`;

// --- Image paths (usklajeno z zadnjo tvojo verzijo, prevezano na PUBLIC_URL)
const IMG = {
  bunTop: {
    sesame: img("/img/bun_top.png"),
    plain: img("/img/bun_top_brez.png"),
  },
  bunBottom: {
    sesame: img("/img/bun_bottom.png"),
    plain: img("/img/bun_bottom.png"),
  },
  bacon: {
    bacon: img("/img/bacon.png"),
    panceta: img("/img/panceta.png"),
    none: img("/img/empty.png"),
  },
  onion: {
    red: img("/img/onion_red.png"),
    white: img("/img/onion_white.png"),
    fried: img("/img/onion_crispy.png"),
    caramel: img("/img/onion_caramelized.png"),
    none: img("/img/empty.png"),
  },
  tomato: {
    big: img("/img/tomato.png"),
    cherry: img("/img/tomato_cherry.png"),
    none: img("/img/empty.png"),
  },
  lettuce: {
    green: img("/img/lettuce_green.png"),
    rucola: img("/img/rukola.png"),
    coleslaw: img("/img/coleslaw.png"),
    none: img("/img/empty.png"),
  },
  cheese: {
    gauda: img("/img/gauda.png"),
    cheddar: img("/img/cheddar.png"),
    mozzarella: img("/img/mozarella.png"),
    ementaler: img("/img/ementaler.png"),
    edamec: img("/img/edam.png"),
  },
  patty: {
    beef: img("/img/beef.png"),
    smash_double: img("/img/smash.png"),
    chicken_shredded: img("/img/shredded_chicken.png"),
    chicken_fried: img("/img/chicken_fried.png"),
    chicken_roasted: img("/img/chicken_cooked.png"),
  },
  sauce: {
    mayo: img("/img/mayo.png"),
    ketchup: img("/img/ketchup.png"),
    mustard: img("/img/mustard.png"),
    bbq: img("/img/bbq.png"),
    sirracha: img("/img/sirracha.png"),
    house: img("/img/house.png"),
    bigmac: img("/img/bigmac.png"),
    sirracha_mayo: img("/img/sirracha_mayo.png"),
    cocktail: img("/img/cocktail.png"),
  },
  extras: {
    feferoni: img("/img/jalapeno.png"),
    paprika: img("/img/pepper.png"),
    kumarice: img("/img/pickle.png"),
    jajca: img("/img/egg.png"),
  },
  empty: img("/img/empty.png"),
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
  // "stran" hvala (#/hvala)
  const [thankYou, setThankYou] = useState(() => window.location.hash === "#/hvala");
  useEffect(() => {
    const onHash = () => setThankYou(window.location.hash === "#/hvala");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

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

  // Web3Forms: form referenca + priprava podatkov
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function buildMessage() {
    const lines = [
      `Ime: ${summary.guest || "Anon"}`,
      `Bombetka (zgoraj): ${summary.bunTop}`,
      `Slanina: ${summary.bacon}`,
      `Čebula: ${summary.onion}`,
      `Paradižnik: ${summary.tomato}`,
      `Solata: ${summary.lettuce}`,
      `Sir: ${summary.cheese}`,
      `Meso: ${summary.patty}`,
      `Bombetka (spodaj): ${summary.bunBottom}`,
      `Omake: ${summary.sauces.length ? summary.sauces.join(", ") : "Brez"}`,
      `Dodatki: ${summary.extras.length ? summary.extras.join(", ") : "Brez"}`,
    ];
    return lines.join("");
  }

  function submitOrder() {
    // če je nastavljen web3forms key, pošlji preko HTML forma (redirect stori Web3Forms)
    const hasKey = CONFIG.web3formsKey && CONFIG.web3formsKey !== "b797c3ae-f671-4a8f-b6f6-6175e132b3de";
    if (hasKey && formRef.current && messageRef.current) {
      messageRef.current.value = buildMessage();
      formRef.current.submit();
      return;
    }
    // fallback: brez ključa samo preusmeri na "hvala"
    window.location.hash = "#/hvala";
  }

  if (thankYou) {
    return (
      <div className="thank-wrap">
        <style>{css}</style>
        <div className="thank">Hvala za naročilo</div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <style>{css}</style>

      <header className="head">
        <h1>🍔 Burger Builder</h1>
      </header>

      <main>
        {/* Skriti HTML <form> za Web3Forms. Če nimaš ključa, se ne bo uporabil. */}
        <form ref={formRef} action="https://api.web3forms.com/submit" method="POST" style={{ display: "none" }}>
          <input type="hidden" name="access_key" value={CONFIG.web3formsKey} />
          <input type="hidden" name="subject" value={`Naročilo: ${summary.guest || "Anon"}`} />
          {/* če dodaš email v Web3Forms, lahko dodaš še polje replyto */}
          <textarea ref={messageRef} name="message" defaultValue="" />
          <input type="hidden" name="redirect" value={CONFIG.redirectUrl} />
        </form>

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
            <button className="chip" onClick={() => setNoSauceOnly()}>Brez omake</button>
          </div>
          <div className="thumb-grid">
            {SAUCES.map((s) => (
              <button
                type="button"
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
                type="button"
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
          <button className="primary" onClick={submitOrder}>Oddaj</button>
        </div>
      </main>
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

  .thank-wrap { display:grid; place-items:center; min-height:100vh; background:#fafafa; }
  .thank { font-size: 28px; font-weight: 800; }
`;
