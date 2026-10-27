/*
  script.js - builds every chart on the page.

  How it fits together (search for "PART" or "FIGURE" to jump between sections):
    1. Small data tables (yearly shares, countries, states) - right below.
       The big map shapes (WORLD, STATES, SA4, RINGS, EXTRA) are in data.js.
    2. Shared settings: colours, fonts, the click-a-state highlight, hover tooltips.
    3. One function per figure. Each returns a Vega-Lite spec (a plain JSON object):
         specWaffle - Fig 1 waffle chart        spec1       - Fig 2 spot values (time series)
         specStream - Fig 3 streamgraph         specVoyage  - Fig 4 route map
         spec2      - Fig 5 prop. symbols       specFlow    - Fig 6 flow map
         specSpike  - Fig 7 spike map           specBump    - Fig 8 bump chart
         spec3      - Fig 9 choropleth          specHex     - Fig 10 hexagon tile map
         specSwarm  - Fig 11 beeswarm           specZoom    - Fig 12 zoomable suburb map
         specBiv    - Fig 13 bivariate          specDots    - Fig 14 dot density
         specDorling - Fig 15 cartogram         specPies    - Fig 16 pie-chart map
         specTop    - Fig 17 linked maps        specLang    - Fig 18 India/China languages
         specWorldLang - Fig 19 world languages specPyramid - Fig 20 population pyramid
    4. Extras: animated gradient on Fig 2, data tables, the shutter title.
    5. render() draws each spec into its <div> with vegaEmbed, then the Play button
       and the state dropdown are wired up.

  Search for "IDIOM:" to jump to the exact layer that makes each map idiom.
*/

/* ======================================================================
   PART 1. DATA TABLES
   Small tables typed in by hand. The big map shapes are in data.js.
   ====================================================================== */
/* ---------- data tables ---------- */
// PCT: share of the population born overseas, one value per year from 1891 to 2025.
// OSM: the same thing as a head count, in millions.
const PCT = [32.4,31.3,30.2,29.1,28.1,27.1,26.2,25.2,24.3,23.5,22.7,22,21.4,20.8,20.2,19.6,19.1,18.6,18,17.5,17,16.9,16.7,16.5,16.4,16.2,16,15.9,15.7,15.6,15.4,15.3,15.1,15,14.8,14.6,14.5,14.3,14.2,14.1,13.9,13.8,13.6,13.3,13,12.7,12.4,12.1,11.8,11.6,11.3,11,10.8,10.5,10.3,10.1,9.8,10.4,10.9,11.5,12.2,12.9,13.6,14.3,14.7,15,15.4,15.8,16.1,16.5,16.9,17.2,17.5,17.8,18.1,18.4,18.8,19.1,19.5,19.9,20.2,20.2,20.1,20,20,19.9,20,20.2,20.3,20.4,20.6,20.6,20.7,20.8,20.8,20.9,21.2,21.5,21.8,22.1,22.5,23.1,23,23,23.1,23.3,23.3,23.2,23.1,23,23.1,23.3,23.6,23.8,24.2,24.6,25.1,25.8,26.4,26.7,26.9,27.3,27.7,28,28.3,28.6,29,29.4,29.8,29.9,29.3,29.5,30.7,31.5,32];
const OSM = [0.86,0.86,0.86,0.86,0.86,0.86,0.86,0.86,0.86,0.86,0.86,0.85,0.84,0.83,0.82,0.81,0.8,0.79,0.78,0.77,0.76,0.77,0.77,0.78,0.79,0.8,0.81,0.81,0.82,0.83,0.84,0.84,0.85,0.85,0.86,0.87,0.87,0.88,0.88,0.89,0.89,0.9,0.9,0.89,0.88,0.87,0.85,0.84,0.83,0.82,0.81,0.8,0.79,0.78,0.77,0.75,0.74,0.8,0.87,0.94,1.02,1.1,1.19,1.29,1.35,1.41,1.48,1.55,1.62,1.7,1.78,1.84,1.91,1.98,2.06,2.13,2.21,2.3,2.39,2.48,2.58,2.6,2.62,2.64,2.67,2.69,2.75,2.8,2.86,2.93,2.99,3.04,3.09,3.14,3.19,3.25,3.34,3.45,3.55,3.66,3.77,4.03,4.05,4.09,4.15,4.24,4.29,4.31,4.35,4.39,4.45,4.55,4.66,4.75,4.88,5.03,5.23,5.48,5.73,5.88,6.02,6.21,6.41,6.57,6.73,6.91,7.14,7.35,7.55,7.67,7.53,7.68,8.19,8.58,8.83];
const SERIES = PCT.map((p, i) => ({ year: 1891 + i, pct: p, os: OSM[i] }));
const SPOTS_ALL = [
  { year: 1891, pct: 32.4, t: "1891 · 32.4%", pos: "right" },
  { year: 1901, pct: 22.7, t: "1901 · 22.7%", pos: "right" },
  { year: 1947, pct: 9.8, t: "1947 · 9.8%", pos: "below" },
  { year: 1971, pct: 20.2, t: "1971 · 20.2%", pos: "above", minor: true },
  { year: 2000, pct: 23.0, t: "2000 · 23.0%", pos: "below", minor: true },
  { year: 2021, pct: 29.3, t: "2021 · 29.3%", pos: "belowleft", minor: true },
  { year: 2025, pct: 32.0, t: "2025 · 32.0%", pos: "left" }
];
// Policy milestones marked on Figure 2 (dashed lines with a short label near the bottom of the chart).
const EVENTS = [
  { year: 1901, y: 4.5, al: "left", t: "Immigration Restriction Act", s: "Restriction Act" },
  { year: 1947, y: 2.2, al: "left", t: "Post-war migration program", s: "Post-war program" },
  { year: 1973, y: 6.8, ny: 8.5, al: "left", t: "White Australia policy ends", s: "White Aust. ends" },
  { year: 2020, y: 4.5, ny: 3.5, al: "right", t: "COVID-19 border closure", s: "COVID-19" }
];
const ERAS = [
  { s: 1891, e: 1901, n: "Gold-rush legacy" },
  { s: 1901, e: 1945, n: "The great closing" },
  { s: 1945, e: 1973, n: "Populate or perish" },
  { s: 1973, e: 2000, n: "The door opens" },
  { s: 2000, e: 2020, n: "Skills & students" },
  { s: 2020, e: 2025, n: "Pause, rebound" }
].map((d, i) => ({ ...d, i }));

const REGION = { India: "Asia", China: "Asia", Philippines: "Asia", Vietnam: "Asia", Nepal: "Asia", "Sri Lanka": "Asia", Malaysia: "Asia", England: "Europe", "New Zealand": "Oceania & Africa", "South Africa": "Oceania & Africa" };
// [country, lon, lat, km from Sydney, 2015, 2020, 2025 (persons), label lon, label lat, side]
const COB = [
  ["India", 78.9, 22.0, 9847, 449040, 724060, 971020, 56.551, 22.272, "l"],
  ["England", -1.5, 52.6, 17011, 1006540, 986210, 970950, 20.052, 50.579, "r"],
  ["China", 104.0, 34.5, 9054, 508870, 638990, 731540, 116.858, 48.687, "r"],
  ["New Zealand", 174.0, -41.0, 2155, 575430, 584490, 637680, -175.329, -40.506, "r"],
  ["Philippines", 122.0, 12.5, 6011, 241130, 308380, 412530, 134.785, 11.11, "r"],
  ["Vietnam", 106.5, 15.5, 7248, 235590, 275920, 326630, 112.34, 5.313, "r"],
  ["South Africa", 24.5, -29.0, 11057, 177390, 200890, 229950, 12.505, -32.157, "l"],
  ["Nepal", 84.1, 28.3, 9879, 50150, 132400, 213580, 70.332, 38.424, "l"],
  ["Sri Lanka", 80.7, 7.8, 8732, 119700, 142690, 184800, 70.372, -14.214, "l"],
  ["Malaysia", 102.0, 3.8, 6640, 143420, 178760, 184320, 94.248, -7.251, "l"]
];
const COB_LONG = [];
COB.forEach(([c, lon, lat, km, a, b, d, llon, llat, side]) => {
  [[2015, a], [2020, b], [2025, d]].forEach(([y, v]) => COB_LONG.push({ c, lon, lat, km, year: y, v, llon, llat, side, region: REGION[c], change: Math.round((d / a - 1) * 100) }));
});

const ST = [
  // name, abbr, label lon/lat, shares 2001..2021, 2021 overseas-born, top country, top count, callout lon/lat/side
  ["Western Australia", "WA", 121.6, -26.0, [28.6, 29.9, 33.4, 35.0, 34.1], 938900, "England", 211730, 112.5, -24.0, "l"],
  ["Victoria", "Vic", 144.3, -36.9, [24.5, 26.3, 28.7, 30.7, 31.7], 2072570, "India", 272250, 141.0, -40.5, "l"],
  ["New South Wales", "NSW", 146.8, -32.3, [24.8, 26.5, 28.3, 30.1, 31.0], 2510260, "China", 261330, 156.0, -30.0, "r"],
  ["Australian Capital Territory", "ACT", 149.05, -35.45, [22.9, 23.6, 26.1, 28.2, 29.8], 134900, "India", 17510, 156.0, -35.2, "r"],
  ["South Australia", "SA", 135.3, -30.0, [21.2, 21.9, 23.7, 24.5, 25.1], 452410, "England", 98770, 131.0, -36.0, "l"],
  ["Queensland", "Qld", 144.8, -22.4, [18.0, 19.7, 22.5, 23.5, 24.2], 1263640, "New Zealand", 229920, 155.5, -21.0, "r"],
  ["Northern Territory", "NT", 133.4, -19.4, [16.1, 15.7, 18.9, 22.6, 23.9], 59240, "Philippines", 7320, 137.5, -10.0, "r"],
  ["Tasmania", "Tas", 146.6, -42.05, [10.8, 11.5, 12.5, 13.1, 16.3], 92320, "England", 20420, 150.5, -44.5, "r"]
];
const YEARS = [2001, 2006, 2011, 2016, 2021];
const SHARE = [];
ST.forEach(([n, ab, lon, lat, sh]) => sh.forEach((p, i) => SHARE.push({ key: n + "|" + YEARS[i], pct: p, year: YEARS[i], name: n, abbr: ab })));
const ST_LABELS = ST.map(([n, ab, lon, lat, sh, tot, top, topn, clon, clat, cside]) => ({ name: n, abbr: ab, lon, lat, tot, top, topn, clon, clat, cside, topRegion: REGION[top] }));
const fmt = (v) => v.toLocaleString("en-AU");
const short = (v) => v >= 1e6 ? (v / 1e6).toFixed(2) + "M" : Math.round(v / 1000) + "k";
ST_LABELS.forEach(d => { d.l1 = d.abbr + " · " + short(d.tot) + " born overseas"; d.l2 = "Top: " + d.top + " " + short(d.topn); });

/* ======================================================================
   PART 2. SHARED SETTINGS
   Theme, click-a-state highlight, hover tooltips
   ====================================================================== */
/* ---------- theme ---------- */
// Pull the colours from style.css so the maps match the page, and set fonts/axes/legends for every chart.
function T() {
  const cs = getComputedStyle(document.documentElement);
  const g = (n) => cs.getPropertyValue(n).trim();
  return { bg: g("--bg"), surface: g("--surface"), ink: g("--ink"), muted: g("--muted"), rule: g("--rule"), land: g("--land"), ocean: g("--ocean"),
    contour: g("--contour"), s1: g("--s1"), s2: g("--s2"), s3: g("--s3"), line: g("--line"), accent2: g("--accent2"), seqLo: g("--seq-lo"), seqHi: g("--seq-hi"), onDark: g("--on-dark"), band: g("--band"),
    body: "IBM Plex Sans, Helvetica Neue, Arial, sans-serif", mono: "IBM Plex Sans Condensed, Arial Narrow, sans-serif", display: "IBM Plex Sans, Helvetica Neue, Arial, sans-serif" };
}
function config(t) {
  return {
    background: null, font: t.body, padding: 4,
    view: { stroke: null },
    axis: { labelColor: t.muted, titleColor: t.muted, gridColor: t.rule, domainColor: t.rule, tickColor: t.rule, labelFont: t.body, labelFontSize: 11, titleFont: t.body, titleFontWeight: 500, titleFontSize: 11.5 },
    legend: { labelColor: t.muted, titleColor: t.ink, labelFont: t.body, titleFont: t.body, titleFontWeight: 600, labelFontSize: 12, titleFontSize: 12, symbolStrokeColor: t.surface },
    text: { color: t.ink, font: t.body },
    tooltipFormat: { numberFormat: ",.0f" }
  };
}
const REG_DOMAIN = ["Asia", "Europe", "Oceania & Africa"];

/* ---------- shared state ---------- */
// Remembers the slider positions and the highlighted state, so redrawing (e.g. on resize) keeps them.
// HL() builds the test "no state picked, or this is the picked state" used to dim everything else.
const state = { yrWorld: 2025, yrState: 2021, hl: "" };
const HL = (expr) => `hl == '' || ${expr} == hl`;
const TOTPOP_BY_NAME = { "New South Wales": 8097060, "Victoria": 6547820, "Queensland": 5215810, "South Australia": 1802600, "Western Australia": 2749370, "Tasmania": 567240, "Northern Territory": 248150, "Australian Capital Territory": 452510 };


/* ---------- hover outline + tooltip ---------- */
// hoverable() adds a dark outline on hover and a tooltip with the state's figures.
// hoverCountry() does the same for countries on the world maps.
const STATE_STATS = ST.map(([n, ab, lon, lat, sh, tot, top, topn]) => ({
  s_name: n, s_share: sh[4], s_growth: +(sh[4] - sh[0]).toFixed(1), s_os: tot, s_pop: TOTPOP_BY_NAME[n], s_top: top, s_topn: topn
}));
const STATE_TT = [
  { field: "s_name", title: "State / territory" },
  { field: "s_share", title: "Born overseas, 2021 (%)", format: ".1f" },
  { field: "s_os", title: "Overseas-born residents", format: "," },
  { field: "s_pop", title: "Total population, 2021", format: "," },
  { field: "s_top", title: "Largest overseas birthplace" },
  { field: "s_topn", title: "Residents born there", format: "," },
  { field: "s_growth", title: "Change in share since 2001 (pts)", format: "+.1f" }
];
let HOVER_N = 0;
function hoverable(layer, t, keyField, extraTT, opt) {
  opt = opt || {};
  const pname = "hov" + (HOVER_N++);
  const L = { ...layer };
  L.transform = [...(layer.transform || []), { lookup: keyField, from: { data: { values: STATE_STATS }, key: "s_name", fields: Object.keys(STATE_STATS[0]) } }];
  L.params = [...(layer.params || []), { name: pname, select: { type: "point", fields: ["s_name"], on: "pointerover", clear: "pointerout" } }];
  L.mark = { ...layer.mark, cursor: "pointer" };
  const baseStroke = layer.mark.stroke || t.surface, baseW = layer.mark.strokeWidth || 1;
  L.encoding = { ...(layer.encoding || {}),
    stroke: { condition: { param: pname, empty: false, value: opt.hoverStroke || "#111111" }, value: baseStroke },
    strokeWidth: { condition: { param: pname, empty: false, value: opt.hoverWidth || 2.5 }, value: baseW },
    tooltip: [STATE_TT[0], ...(extraTT || []), ...STATE_TT.slice(1)] };
  return L;
}
const COUNTRY_NAME = { England: "United Kingdom" };
const COUNTRY_STATS = COB.map(([c, lon, lat, km, a, b, d]) => ({
  c_world: COUNTRY_NAME[c] || c, c_label: c === "England" ? "England (born in)" : c, c15: a, c20: b, c25: d, c_km: km,
  c_chg: d - a, c_pct: Math.round((d / a - 1) * 100)
}));
function hoverCountry(layer, t, opt) {
  opt = opt || {};
  const pname = "hovc" + (HOVER_N++);
  const L = { ...layer };
  L.transform = [...(layer.transform || []),
    { lookup: "properties.name", from: { data: { values: COUNTRY_STATS }, key: "c_world", fields: ["c_label", "c15", "c20", "c25", "c_km", "c_chg", "c_pct"] } },
    { calculate: "datum.properties.name", as: "cty" },
    { calculate: "datum.c_label == 'England (born in)' ? datum.properties.name + ' (figures for England)' : datum.properties.name", as: "ctyl" },
    { calculate: "datum.properties.name == 'Australia' ? 'Destination' : isValid(datum.c25) ? format(datum.c25, ',') : 'Not in the top ten'", as: "t25" },
    { calculate: "isValid(datum.c15) ? format(datum.c15, ',') : '–'", as: "t15" },
    { calculate: "isValid(datum.c_chg) ? (datum.c_chg >= 0 ? '+' : '−') + format(abs(datum.c_chg), ',') + ' (' + (datum.c_pct >= 0 ? '+' : '') + datum.c_pct + '%)' : '–'", as: "tchg" },
    { calculate: "isValid(datum.c_km) ? format(datum.c_km, ',') + ' km' : '–'", as: "tkm" }];
  L.params = [...(layer.params || []), { name: pname, select: { type: "point", fields: ["cty"], on: "pointerover", clear: "pointerout" } }];
  L.mark = { ...layer.mark, cursor: "pointer" };
  const baseStroke = layer.mark.stroke || t.surface, baseW = layer.mark.strokeWidth || 0.5;
  L.encoding = { ...(layer.encoding || {}),
    stroke: { condition: { param: pname, empty: false, value: opt.hoverStroke || "#111111" }, value: baseStroke },
    strokeWidth: { condition: { param: pname, empty: false, value: 1.75 }, value: baseW },
    tooltip: [{ field: "ctyl", title: "Country" }, { field: "t25", title: "Australian residents born here, 2025" }, { field: "t15", title: "Australian residents born here, 2015" }, { field: "tchg", title: "Change 2015–2025" }, { field: "tkm", title: "Distance from Sydney" }] };
  return L;
}

/* ======================================================================
   PART 3. THE FIGURES
   One function per figure. They're not in page order, so search "FIGURE 9" etc.
   ====================================================================== */

/* ======================================================================
   FIGURE 2 | Page section 1 | IDIOM: Spot values
   Function: spec1()
   ====================================================================== */

// The overseas-born share since 1891. Shaded bands are policy eras; the labelled points
// ("1947 · 9.8%") are the spot values. Drag to pan, scroll to zoom.
function spec1(t, w) {
  const narrow = w < 600;
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container", height: narrow ? 280 : 340, autosize: { type: "fit-x", contains: "padding" },
    config: config(t),
    encoding: { x: { field: "year", type: "quantitative", scale: { domain: [1888, 2028], nice: false }, axis: { format: "d", title: null, tickCount: 8, grid: false } } },
    layer: [
      { data: { values: ERAS }, mark: { type: "rect", opacity: 1, clip: true },
        encoding: { x: { field: "s", type: "quantitative" }, x2: { field: "e" }, y: { value: 0 }, y2: { value: narrow ? 280 : 340 },
          color: { condition: { test: "datum.i % 2 == 0", value: t.band }, value: "transparent" } } },
      { data: { values: ERAS }, mark: { type: "text", align: "left", baseline: "top", dx: 4, dy: 4, fontSize: 10.5, font: t.mono, color: t.muted, limit: 120, clip: true },
        transform: [{ filter: narrow ? "false" : "datum.e - datum.s >= 15" }],
        encoding: { x: { field: "s", type: "quantitative" }, y: { value: 0 }, text: { field: "n" } } },
      // ANNOTATIONS - dashed lines at policy milestones, labelled near the bottom
      { data: { values: EVENTS }, mark: { type: "rule", strokeDash: [3, 3], strokeWidth: 1, color: t.accent2, opacity: 0.7, clip: true },
        encoding: { x: { field: "year", type: "quantitative" }, y: { value: 0 }, y2: { value: narrow ? 280 : 340 } } },
      { data: { values: EVENTS.map(d => ({ ...d, yy: d.ny || d.y })) }, mark: { type: "text", baseline: "middle", fontSize: narrow ? 10 : 11.5, font: t.body, fontStyle: "italic", color: t.accent2, clip: true,
          align: { expr: "datum.al" }, dx: { expr: "datum.al == 'left' ? 5 : -5" } },
        encoding: { x: { field: "year", type: "quantitative" }, y: { field: narrow ? "yy" : "y", type: "quantitative" },
          text: { field: narrow ? "s" : "t" } } },
      // The time-series line the spot values sit on.
      { data: { values: SERIES }, params: [{ name: "zoom", select: { type: "interval", encodings: ["x"] }, bind: "scales" }],
        mark: { type: "line", strokeWidth: 2.25, color: t.line, interpolate: "monotone", clip: true },
        encoding: { y: { field: "pct", type: "quantitative", scale: { domain: [0, 36] }, axis: { title: null, values: [0, 10, 20, 30], labelExpr: "datum.value + '%'", gridDash: [2, 3] } } } },
      { data: { values: SERIES }, params: [{ name: "hov", select: { type: "point", encodings: ["x"], nearest: true, on: "pointerover", clear: "pointerout" } }],
        mark: { type: "rule", strokeWidth: 1, clip: true },
        encoding: { color: { value: t.muted }, opacity: { condition: { param: "hov", empty: false, value: 0.7 }, value: 0 },
          tooltip: [ { field: "year", title: "Year", format: "d" }, { field: "pct", title: "Born overseas (%)", format: ".1f" }, { field: "os", title: "Overseas-born (millions)", format: ".2f" } ] } },
      // IDIOM: SPOT VALUES - a marker at each turning point, and the next five layers
      // print its value next to it (e.g. "1947 · 9.8%").
      { data: { values: narrow ? SPOTS_ALL.filter(d => !d.minor) : SPOTS_ALL }, mark: { type: "point", filled: true, size: 70, strokeWidth: 2, clip: true },
        encoding: { y: { field: "pct", type: "quantitative" }, fill: { value: t.surface }, stroke: { value: t.line } } },
      { data: { values: narrow ? SPOTS_ALL.filter(d => !d.minor) : SPOTS_ALL }, transform: [{ filter: "datum.pos == 'above'" }],
        mark: { type: "text", dy: -14, fontSize: 12, fontWeight: 600, font: t.mono, clip: true },
        encoding: { y: { field: "pct", type: "quantitative" }, text: { field: "t" }, color: { value: t.ink } } },
      { data: { values: narrow ? SPOTS_ALL.filter(d => !d.minor) : SPOTS_ALL }, transform: [{ filter: "datum.pos == 'right'" }],
        mark: { type: "text", align: "left", dx: 10, dy: -2, fontSize: 12, fontWeight: 600, font: t.mono, clip: true },
        encoding: { y: { field: "pct", type: "quantitative" }, text: { field: "t" }, color: { value: t.ink } } },
      { data: { values: narrow ? SPOTS_ALL.filter(d => !d.minor) : SPOTS_ALL }, transform: [{ filter: "datum.pos == 'left'" }],
        mark: { type: "text", align: "right", dx: -10, dy: -10, fontSize: 12, fontWeight: 600, font: t.mono, clip: true },
        encoding: { y: { field: "pct", type: "quantitative" }, text: { field: "t" }, color: { value: t.ink } } },
      { data: { values: narrow ? SPOTS_ALL.filter(d => !d.minor) : SPOTS_ALL }, transform: [{ filter: "datum.pos == 'belowleft'" }],
        mark: { type: "text", align: "right", dx: -6, dy: 20, fontSize: 12, fontWeight: 600, font: t.mono, clip: true },
        encoding: { y: { field: "pct", type: "quantitative" }, text: { field: "t" }, color: { value: t.ink } } },
      { data: { values: narrow ? SPOTS_ALL.filter(d => !d.minor) : SPOTS_ALL }, transform: [{ filter: "datum.pos == 'below'" }],
        mark: { type: "text", dy: 16, fontSize: 12, fontWeight: 600, font: t.mono, clip: true },
        encoding: { y: { field: "pct", type: "quantitative" }, text: { field: "t" }, color: { value: t.ink } } }
    ]
  };
}

/* ======================================================================
   FIGURE 5 | Page section 3.1 | IDIOM: Proportional symbols + contour lines
   Function: spec2()
   ====================================================================== */

// World map centred on Sydney (azimuthal equidistant), so distance from Sydney reads true.
// Rings every 2,500 km are the contour lines; circle area = residents born in that country.
function spec2(t, yr, w) {
  const narrow = w < 600;
  const k = Math.min(1, w / 900);
  const proj = { type: "azimuthalEquidistant", rotate: [-151.21, 33.87], clipAngle: 179 };
  const sizeScale = { domain: [0, 1010000], range: [0, Math.round(2300 * k * k)] };
  const colorScale = { domain: REG_DOMAIN, range: [t.s1, t.s2, t.s3] };
  const loc = { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" } };
  const thisYear = [{ filter: "datum.year == yr" }, { filter: narrow ? "indexof(['India','England','China','New Zealand'], datum.c) >= 0" : "true" }];
  // Country labels, the way an atlas does it: the name in dark type, the figure underneath in grey.
  const labelText = (align, dx) => {
    const side = { filter: `datum.side == '${align === "left" ? "r" : "l"}'` };
    const at = { longitude: { field: "llon", type: "quantitative" }, latitude: { field: "llat", type: "quantitative" } };
    const m = { type: "text", align, dx, font: t.body };
    return narrow
      ? [{ data: { values: COB_LONG }, transform: [...thisYear, side, { calculate: "datum.c + ' ' + format(datum.v / 1000, ',.0f') + 'k'", as: "lbl" }],
          mark: { ...m, baseline: "middle", fontSize: 10.5 }, encoding: { ...at, text: { field: "lbl" }, color: { value: t.ink } } }]
      : [{ data: { values: COB_LONG }, transform: [...thisYear, side],
          mark: { ...m, baseline: "bottom", dy: 1, fontSize: 11.5, fontWeight: 600 }, encoding: { ...at, text: { field: "c" }, color: { value: t.ink } } },
         { data: { values: COB_LONG }, transform: [...thisYear, side, { calculate: "format(datum.v / 1000, ',.0f') + ',000'", as: "lbl" }],
          mark: { ...m, baseline: "top", dy: 2, fontSize: 10.5 }, encoding: { ...at, text: { field: "lbl" }, color: { value: t.muted } } }];
  };
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container", height: narrow ? Math.round(w + 90) : 680, autosize: { type: "fit-x", contains: "padding" },
    config: config(t),
    params: [{ name: "yr", value: yr, bind: { input: "radio", options: [2015, 2020, 2025], name: "Year " } }],
    projection: proj,
    layer: [
      { data: { sphere: true }, mark: { type: "geoshape", fill: t.ocean, stroke: "#b9c2c9", strokeWidth: 0.8 } },
      // faint graticule every 30 degrees, like a printed atlas
      { data: { graticule: { step: [30, 30] } }, mark: { type: "geoshape", filled: false, stroke: "#c9d3da", strokeWidth: 0.4 } },
      hoverCountry({ data: { values: WORLD, format: { type: "topojson", feature: "countries" } }, mark: { type: "geoshape", fill: t.land, stroke: "#ffffff", strokeWidth: 0.4 } }, t),
      // IDIOM: CONTOUR LINES (isolines) - rings of equal distance from Sydney, every 2,500 km.
      // Thin solid lines, with every 5,000 km drawn a little heavier and labelled (index contours).
      { data: { values: RINGS.rings, format: { type: "json", property: "features" } }, mark: { type: "geoshape", filled: false, stroke: "#7d8a93" },
        encoding: { strokeWidth: { condition: { test: "datum.properties.km % 5000 == 0", value: 0.9 }, value: 0.45 },
          strokeOpacity: { condition: { test: "datum.properties.km % 5000 == 0", value: 0.8 }, value: 0.55 } } },
      { data: { values: RINGS.ringLabels }, transform: [{ filter: "datum.km % 5000 == 0" }, { calculate: "format(datum.km, ',') + ' km'", as: "lbl" }],
        mark: { type: "text", fontSize: 10, font: t.body, fontStyle: "italic", stroke: t.ocean, strokeWidth: 3.5, strokeJoin: "round" },
        encoding: { ...loc, text: { field: "lbl" } } },
      { data: { values: RINGS.ringLabels }, transform: [{ filter: "datum.km % 5000 == 0" }, { calculate: "format(datum.km, ',') + ' km'", as: "lbl" }],
        mark: { type: "text", fontSize: 10, font: t.body, fontStyle: "italic" },
        encoding: { ...loc, text: { field: "lbl" }, color: { value: "#5f6d77" } } },
      // short hairline leaders from each circle to its label
      { data: { values: COB_LONG }, transform: thisYear,
        mark: { type: "rule", strokeWidth: 0.5 },
        encoding: { ...loc, longitude2: { field: "llon" }, latitude2: { field: "llat" }, color: { value: "#8a8a8a" } } },
      // IDIOM: PROPORTIONAL SYMBOLS - circle area = residents born in that country (size encoding below),
      // colour = region of birth. Clicking the legend filters by region.
      { data: { values: COB_LONG }, transform: [{ filter: "datum.year == yr" }],
        params: [{ name: "reg", select: { type: "point", fields: ["region"] }, bind: "legend" }],
        mark: { type: "circle", strokeWidth: 1, cursor: "pointer" },
        encoding: {
          ...loc,
          opacity: { condition: { param: "reg", value: 0.72 }, value: 0.08 },
          stroke: { field: "region", type: "nominal", scale: { domain: REG_DOMAIN, range: ["#1b4f80", "#9a4300", "#4e4a86"] }, legend: null },
          size: { field: "v", type: "quantitative", scale: sizeScale, legend: { title: "Residents born there", values: [100000, 500000, 1000000], format: narrow ? ".1s" : ",.0f", orient: "bottom", direction: "horizontal", symbolFillColor: "#bfbfbf", symbolStrokeColor: "#8a8a8a", symbolStrokeWidth: 1, symbolOpacity: 0.8 } },
          color: { field: "region", type: "nominal", scale: colorScale, legend: { title: "Region of birth", orient: "bottom", direction: narrow ? "vertical" : "horizontal", symbolOpacity: 0.8 } },
          order: { field: "v", sort: "descending" },
          tooltip: [ { field: "c", title: "Country of birth" }, { field: "year", title: "Year", format: "d" }, { field: "v", title: "Residents", format: "," }, { field: "km", title: "Distance from Sydney (km)", format: "," }, { field: "change", title: "Change 2015–2025 (%)", format: "+d" } ]
        } },
      ...labelText("left", 3),
      ...labelText("right", -3),
      // Sydney: a small dot and its name, nothing fancier
      { data: { values: [{ lon: 151.21, lat: -33.87, n: "Sydney" }] }, mark: { type: "circle", size: 22, color: t.ink, opacity: 1 }, encoding: loc },
      { data: { values: [{ lon: 151.21, lat: -33.87, n: "Sydney" }] },
        mark: { type: "text", align: "right", dx: -5, dy: -6, fontSize: 11, fontWeight: 600, font: t.body },
        encoding: { ...loc, text: { field: "n" }, color: { value: t.ink } } }
    ]
  };
}

/* ======================================================================
   MAP HELPERS: projections and shared layers
   ====================================================================== */
/* ---------- projection for every Australian map ---------- */
// Conic equal-area keeps region sizes honest, which matters for choropleths.
const AUS_PROJ = { type: "conicEqualArea", parallels: [-18, -36], rotate: [-134, 0] };
/* water-body labels: dark-blue italic, a categorical type distinction (FIT2179 notes 11) */
const WATER_AUS = [
  { n: "Indian Ocean", lon: 116.5, lat: -40.5 }, { n: "Timor Sea", lon: 125.5, lat: -11.2 },
  { n: "Coral Sea", lon: 155, lat: -14.5 }, { n: "Tasman Sea", lon: 157.5, lat: -41.5 },
  { n: "Great Australian Bight", lon: 130.5, lat: -35.2 }
];
const waterLabels = (t, vals, narrow) => ({ data: { values: vals },
  mark: { type: "text", font: t.mono, fontStyle: "italic", fontWeight: 500, fontSize: narrow ? 10 : 11.5, color: "#3a6a92", baseline: "middle" },
  encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, text: { field: "n" } } });

/* ---------- shared map helpers (Natural Earth world, Australia base, extents) ---------- */
const WORLD_PROJ = { type: "equalEarth", rotate: [-75, 0] };
const extent = (pts) => ({ data: { values: [{ type: "Feature", properties: {}, geometry: { type: "MultiPoint", coordinates: pts } }] }, mark: { type: "geoshape", opacity: 0, filled: false, strokeOpacity: 0 } });
const worldBase = (t) => [
  hoverCountry({ data: { values: WORLD, format: { type: "topojson", feature: "countries" } }, mark: { type: "geoshape", fill: t.land, stroke: t.surface, strokeWidth: 0.5, clip: true } }, t)
];
const ausBase = (t, fill) => ({ data: { values: STATES, format: { type: "topojson", feature: "states" } }, mark: { type: "geoshape", fill: fill || t.land, stroke: t.surface, strokeWidth: 1.25 } });
const SYD = { lon: 151.21, lat: -33.87 };
const TOTPOP = { NSW: 8097060, Vic: 6547820, Qld: 5215810, SA: 1802600, WA: 2749370, Tas: 567240, NT: 248150, ACT: 452510 };
const base = (t, w, h, ocean) => ({ $schema: "https://vega.github.io/schema/vega-lite/v5.json", width: "container", height: h, autosize: { type: "fit-x", contains: "padding" }, config: ocean ? { ...config(t), view: { stroke: null, fill: t.ocean } } : config(t) });

/* ======================================================================
   FIGURE 4 | Page section 2 | IDIOM: Route map (animated)
   Function: specVoyage()
   ====================================================================== */

// FLEET_STOPS are the five ports, FLEET_PATH the waypoints of the route.
// The whole animation is driven by one number, `day` (0 = 13 May 1787, 250 = Botany Bay).
const FLEET_STOPS = [
  { n: "Portsmouth", d: "sailed 13 May 1787", lon: -1.09, lat: 50.8, side: "r" },
  { n: "Santa Cruz de Tenerife", sn: "Tenerife", d: "June 1787", lon: -16.25, lat: 28.47, side: "l" },
  { n: "Rio de Janeiro", d: "Aug–Sep 1787", lon: -43.2, lat: -22.9, side: "l" },
  { n: "Cape Town", d: "Oct–Nov 1787", lon: 18.42, lat: -33.92, side: "b" },
  { n: "Botany Bay", d: "18–20 Jan 1788", lon: 151.2, lat: -33.98, side: "r" }
];
const FLEET_PATH = [[-1.09, 50.8], [-9, 44], [-16.25, 28.47], [-24, 8], [-34, -8], [-43.2, -22.9], [-15, -32], [18.42, -33.92], [50, -40], [100, -41.5], [140, -44.5], [147.5, -44.3], [151.2, -33.98]];
// day of voyage (0 = 13 May 1787) when the fleet reached and left each stop; FLEET_PATH index of each stop
const FLEET_SCHEDULE = [
  { idx: 0, arrive: 0, depart: 0 },
  { idx: 2, arrive: 21, depart: 28 },
  { idx: 5, arrive: 84, depart: 114 },
  { idx: 7, arrive: 153, depart: 183 },
  { idx: 12, arrive: 250, depart: 250 }
];
FLEET_STOPS.forEach((st, i) => { st.arrive = FLEET_SCHEDULE[i].arrive; });
// Point a fraction f of the way between two places along the shortest path on the globe.
function gcInterp(a, b, f) {
  const r = Math.PI / 180, [l1, p1] = [a[0] * r, a[1] * r], [l2, p2] = [b[0] * r, b[1] * r];
  const d = 2 * Math.asin(Math.sqrt(Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin((l2 - l1) / 2) ** 2));
  if (d === 0) return [a[0], a[1], 0];
  const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
  const x = A * Math.cos(p1) * Math.cos(l1) + B * Math.cos(p2) * Math.cos(l2), y = A * Math.cos(p1) * Math.sin(l1) + B * Math.cos(p2) * Math.sin(l2), z = A * Math.sin(p1) + B * Math.sin(p2);
  return [Math.atan2(y, x) / r, Math.atan2(z, Math.hypot(x, y)) / r, d];
}
// The route broken into small steps, each with the day the fleet got there.
// Days are spread by distance; time spent in port shows up as the ship not moving.
const FLEET_TRACK = (() => {
  const out = [];
  for (let s = 0; s < FLEET_SCHEDULE.length - 1; s++) {
    const from = FLEET_SCHEDULE[s], to = FLEET_SCHEDULE[s + 1];
    const pts = [];
    for (let i = from.idx; i < to.idx; i++) for (let k = 0; k < 24; k++) pts.push(gcInterp(FLEET_PATH[i], FLEET_PATH[i + 1], k / 24));
    pts.push([...FLEET_PATH[to.idx], 0]);
    const seg = [0]; for (let i = 1; i < pts.length; i++) seg.push(seg[i - 1] + gcInterp(pts[i - 1], pts[i], 0)[2]);
    const total = seg[seg.length - 1];
    pts.forEach((p, i) => out.push({ lon: p[0], lat: p[1], day: from.depart + (to.arrive - from.depart) * seg[i] / total }));
    out.push({ lon: FLEET_PATH[to.idx][0], lat: FLEET_PATH[to.idx][1], day: to.depart });
  }
  return out.map((p, i) => ({ ...p, seq: i }));
})();
let WAITED_FILL_OPACITY = 0;
// Layers, bottom to top: countries, the three stop countries, faint full route, trail so far
// (filtered by `day`), port dots, the ship, its date label, port labels, and the totals note.
function specVoyage(t, w) {
  const narrow = w < 600;
  const s = base(t, w, narrow ? Math.round(w * 0.62) : 470, false);
  s.config = { ...s.config, background: null, view: { stroke: null, fill: null } };
  s.projection = WORLD_PROJ;
  const HALO = "#123A6B", TXT = "#FFFFFF";
  const loc = { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" } };
  const txt = (side, halo) => {
    const align = side === "r" ? "left" : side === "l" ? "right" : "center";
    const m = { type: "text", align, dx: side === "r" ? 9 : side === "l" ? -9 : 0, dy: side === "b" ? 10 : 0, baseline: side === "b" ? "top" : "middle",
      fontSize: narrow ? 10.5 : 11.5, lineHeight: 14, font: t.body, fontWeight: 600 };
    if (halo) Object.assign(m, { stroke: HALO, strokeWidth: 3.5, strokeJoin: "round", strokeOpacity: 0.85 });
    return { data: { values: FLEET_STOPS }, transform: [{ filter: `datum.side == '${side}'` }, { calculate: narrow ? "datum.sn || datum.n" : "[datum.n, datum.d]", as: "l" }],
      mark: m, encoding: { ...loc, text: { field: "l" }, color: { value: TXT } } };
  };
  const note = (halo) => {
    const m = { type: "text", fontSize: 12.5, fontWeight: 700, font: t.body, lineHeight: 16 };
    if (halo) Object.assign(m, { stroke: HALO, strokeWidth: 3.5, strokeJoin: "round", strokeOpacity: 0.85 });
    return { data: { values: [{ lon: 100, lat: -50, l: ["11 ships · more than 1,500 people", "252 days at sea"] }] }, transform: [{ filter: narrow ? "false" : "true" }],
      mark: m, encoding: { ...loc, text: { field: "l" }, color: { value: "#EAF7FB" } } };
  };
  const route = { data: { values: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: FLEET_PATH } }] } };
  s.params = [{ name: "day", value: state.day, bind: { input: "range", min: 0, max: 250, step: 1, name: "Day of voyage " } }];
  const trackLoc = { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" } };
  const shipLabel = (halo) => {
    const m = { type: "text", align: "left", dx: 12, dy: -12, fontSize: 12, fontWeight: 700, font: t.body };
    if (halo) Object.assign(m, { stroke: HALO, strokeWidth: 3.5, strokeJoin: "round", strokeOpacity: 0.85 });
    return { data: { values: FLEET_TRACK }, transform: [{ filter: "datum.day <= day" }, { aggregate: [{ op: "argmax", field: "day", as: "cur" }] },
        { calculate: "datum.cur.lon", as: "lon" }, { calculate: "datum.cur.lat", as: "lat" },
        { calculate: "'Day ' + day + ' · ' + timeFormat(datetime(1787, 4, 13 + day), '%-d %b %Y')", as: "l" }],
      mark: m, encoding: { ...trackLoc, text: { field: "l" }, color: { value: "#FFE8A3" } } };
  };
  s.layer = [
    hoverCountry({ data: { values: WORLD, format: { type: "topojson", feature: "countries" } },
      transform: [{ filter: "indexof(['Spain', 'Brazil', 'South Africa'], datum.properties.name) < 0" }],
      mark: { type: "geoshape", fill: "#EFE6D2", fillOpacity: 0.92, stroke: "#123A6B", strokeOpacity: 0.35, strokeWidth: 0.5, clip: true } }, t, { hoverStroke: "#123A6B" }),
    // The three countries where the fleet stopped (Spain, Brazil, South Africa).
    // Their moving green-to-gray fill is added later by setupWaited().
    { name: "waited", data: { values: WORLD, format: { type: "topojson", feature: "countries" } },
      transform: [{ filter: "indexof(['Spain', 'Brazil', 'South Africa'], datum.properties.name) >= 0" }, { calculate: "datum.properties.name", as: "cty" },
        { calculate: "{ 'Spain': 'Santa Cruz de Tenerife', 'Brazil': 'Rio de Janeiro', 'South Africa': 'Cape Town' }[datum.cty]", as: "port" },
        { calculate: "{ 'Spain': '3–10 June 1787 (7 days)', 'Brazil': '5 Aug – 4 Sep 1787 (30 days)', 'South Africa': '13 Oct – 12 Nov 1787 (30 days)' }[datum.cty]", as: "when" }],
      mark: { type: "geoshape", fill: "#387A38", cursor: "pointer", fillOpacity: WAITED_FILL_OPACITY, stroke: "#123A6B", strokeOpacity: 0.5, strokeWidth: 0.6, clip: true },
      params: [{ name: "hovw", select: { type: "point", fields: ["cty"], on: "pointerover", clear: "pointerout" } }],
      encoding: { strokeWidth: { condition: { param: "hovw", empty: false, value: 2 }, value: 0.6 }, strokeOpacity: { condition: { param: "hovw", empty: false, value: 1 }, value: 0.5 },
        tooltip: [{ field: "cty", title: "Fleet stopped in" }, { field: "port", title: "Port" }, { field: "when", title: "Anchored" }] } },
    // IDIOM: ROUTE MAP - the whole route as a faint dashed line.
    { ...route, mark: { type: "geoshape", filled: false, stroke: "#FFFFFF", strokeOpacity: 0.35, strokeWidth: 2, strokeDash: [3, 4], clip: true } },
    // IDIOM: ROUTE MAP (animated) - the trail sailed so far. `datum.day <= day` keeps only the
    // points reached by the current day, so the line grows as `day` goes up.
    { data: { values: FLEET_TRACK }, transform: [{ filter: "datum.day <= day" }],
      mark: { type: "line", stroke: "#FFFFFF", strokeOpacity: 0.6, strokeWidth: 5, strokeCap: "round", clip: true },
      encoding: { ...trackLoc, order: { field: "seq", type: "quantitative" } } },
    { data: { values: FLEET_TRACK }, transform: [{ filter: "datum.day <= day" }],
      mark: { type: "line", stroke: "#FFC845", strokeWidth: 2.75, strokeDash: [6, 4], clip: true },
      encoding: { ...trackLoc, order: { field: "seq", type: "quantitative" } } },
    { data: { values: FLEET_STOPS }, mark: { type: "point", filled: true, size: 70, stroke: "#FFFFFF", strokeWidth: 2 },
      encoding: { ...loc, color: { condition: { test: "datum.arrive <= day", value: "#FFC845" }, value: "#123A6B" }, tooltip: [{ field: "n", title: "Stop" }, { field: "d", title: "When" }] } },
    { data: { values: FLEET_TRACK }, transform: [{ filter: "datum.day <= day" }, { aggregate: [{ op: "argmax", field: "day", as: "cur" }] },
        // The ship: the furthest point reached so far (argmax of day).
        { calculate: "datum.cur.lon", as: "lon" }, { calculate: "datum.cur.lat", as: "lat" }],
      mark: { type: "point", shape: "triangle-up", filled: true, size: 160, stroke: HALO, strokeWidth: 1.5 },
      encoding: { ...trackLoc, color: { value: "#FFE8A3" } } },
    shipLabel(true), shipLabel(),
    txt("r", true), txt("r"), txt("l", true), txt("l"), txt("b", true), txt("b"),
    note(true), note(),
    extent([[-55, 58], [165, 58], [165, -55], [-55, -55]])
  ];
  return s;
}

/* ======================================================================
   FIGURE 6 | Page section 3.2 | IDIOM: Flow map
   Function: specFlow()
   ====================================================================== */

// A line from each of the top ten birthplaces to Sydney (shortest path on the globe);
// line width = residents born there in 2025. Hover a line to pick it out.
function specFlow(t, w) {
  const narrow = w < 600;
  const s = base(t, w, narrow ? Math.round(w * 0.8) : 500, true);
  s.projection = WORLD_PROJ;
  const flows = COB.map(([c, lon, lat, km, a, b, d]) => ({ type: "Feature", properties: { c, v: d, km, region: REGION[c] }, geometry: { type: "LineString", coordinates: [[lon, lat], [SYD.lon, SYD.lat]] } }));
  const origins = COB.map(([c, lon, lat, km, a, b, d]) => ({ c, lon, lat, v: d, lbl: c + " " + Math.round(d / 1000) + "k", side: ["England", "India", "Nepal", "Sri Lanka", "South Africa"].includes(c) || (narrow && c === "New Zealand") ? "l" : "r" }));
  const lab = (side) => ({ data: { values: origins }, transform: [{ filter: `datum.side == '${side}'` }, { filter: narrow ? "datum.v > 700000" : "true" }],
    mark: { type: "text", align: side === "r" ? "left" : "right", dx: side === "r" ? 6 : -6, fontSize: narrow ? 10.5 : 11.5, font: t.body, baseline: "middle" },
    encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, text: { field: "lbl" }, color: { value: t.ink } } });
  s.layer = [
    ...worldBase(t),
    // IDIOM: FLOW MAP - one line per birthplace to Sydney; strokeWidth = residents in 2025.
    { data: { values: flows }, transform: [{ calculate: "datum.properties.c", as: "c" }],
      params: [{ name: "hf", select: { type: "point", fields: ["c"], on: "pointerover", clear: "pointerout" } }],
      mark: { type: "geoshape", filled: false, strokeCap: "round", clip: true, cursor: "pointer" },
      encoding: { opacity: { condition: { param: "hf", empty: true, value: 0.8 }, value: 0.12 }, strokeWidth: { field: "properties.v", type: "quantitative", scale: { domain: [0, 1000000], range: [0.5, narrow ? 9 : 14] }, legend: { title: narrow ? "Residents (2025)" : "Residents born there (2025)", values: narrow ? [250000, 1000000] : [200000, 500000, 1000000], format: narrow ? ".2s" : ",.0f", orient: "bottom", direction: narrow ? "vertical" : "horizontal", symbolType: "stroke", symbolStrokeColor: t.muted } },
        stroke: { field: "properties.region", type: "nominal", scale: { domain: REG_DOMAIN, range: [t.s1, t.s2, t.s3] }, legend: { title: "Region of birth", orient: "bottom", direction: narrow ? "vertical" : "horizontal", symbolType: "stroke", symbolStrokeWidth: 4 } },
        order: { field: "properties.v", sort: "descending" },
        tooltip: [{ field: "properties.c", title: "Country of birth" }, { field: "properties.v", title: "Residents (2025)", format: "," }, { field: "properties.km", title: "Distance (km)", format: "," }] } },
    { data: { values: origins }, mark: { type: "circle", size: 30, stroke: t.surface, strokeWidth: 1 },
      encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, color: { value: t.ink } } },
    lab("r"), lab("l"),
    { data: { values: [SYD] }, mark: { type: "point", shape: "cross", size: 110, filled: true, strokeWidth: 2 },
      encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, color: { value: t.ink } } },
    { data: { values: [{ ...SYD, n: "Australia" }] }, mark: { type: "text", dy: 16, fontSize: 11.5, fontWeight: 600, font: t.body },
      encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, text: { field: "n" }, color: { value: t.ink } } },
    extent([[-20, 60], [180, 60], [180, -48], [-20, -48]])
  ];
  return s;
}

/* ======================================================================
   FIGURE 7 | Page section 3.3 | IDIOM: Spike map
   Function: specSpike()
   ====================================================================== */

// Spike height = change in residents up to 2025, measured from 2015 or 2020 (the radio buttons).
// Up is growth, down is decline.
function specSpike(t, w) {
  const narrow = w < 600;
  const s = base(t, w, narrow ? Math.round(w * 0.85) : 520, true);
  s.projection = WORLD_PROJ;
  s.params = [{ name: "base", value: 2015, bind: { input: "radio", options: [2015, 2020], labels: ["2015", "2020"], name: "Change since " } }];
  const K = 40 / 522000;
  const sp = COB.map(([c, lon, lat, km, a, b, d]) => ({ c, lon, lat, a, b, d }));
  const showExpr = narrow ? "indexof(['India', 'China', 'England'], datum.c) >= 0" : "abs(datum.ch) >= 150000 || datum.ch < 0 || indexof(['New Zealand', 'South Africa'], datum.c) >= 0";
  const tf = [
    { calculate: "datum.d - (base == 2015 ? datum.a : datum.b)", as: "ch" },
    { calculate: `datum.lat + datum.ch * ${K}`, as: "top" },
    { calculate: "datum.ch >= 0 ? 'Grew' : 'Shrank'", as: "pos" },
    { calculate: "datum.c + ' ' + (datum.ch >= 0 ? '+' : '−') + format(abs(datum.ch) / 1000, ',.0f') + 'k'", as: "lbl" }
  ];
  const loc = { longitude: { field: "lon", type: "quantitative" } };
  s.layer = [
    ...worldBase(t),
    // IDIOM: SPIKE MAP - a vertical line at each country; its length = change in residents
    // (up for growth, down for decline).
    { data: { values: sp }, transform: tf, mark: { type: "rule", strokeWidth: narrow ? 3 : 4, strokeCap: "butt" },
      encoding: { ...loc, latitude: { field: "lat", type: "quantitative" }, latitude2: { field: "top" }, longitude2: { field: "lon" },
        color: { field: "pos", type: "nominal", scale: { domain: ["Grew", "Shrank"], range: [t.s1, t.s2] }, legend: { title: "Change to 2025", orient: "bottom" } },
        tooltip: [{ field: "c", title: "Country of birth" }, { field: "ch", title: "Change (people)", format: "+," }, { field: "d", title: "Residents in 2025", format: "," }] } },
    { data: { values: sp }, mark: { type: "circle", size: 18 },
      encoding: { ...loc, latitude: { field: "lat", type: "quantitative" }, color: { value: t.ink } } },
    { data: { values: sp }, transform: [...tf, { filter: `(${showExpr}) && datum.ch >= 0` }],
      mark: { type: "text", dy: -7, fontSize: narrow ? 10 : 11.5, font: t.body, fontWeight: 500, baseline: "bottom" },
      encoding: { ...loc, latitude: { field: "top", type: "quantitative" }, text: { field: "lbl" }, color: { value: t.ink } } },
    { data: { values: sp }, transform: [...tf, { filter: `(${showExpr}) && datum.ch < 0` }],
      mark: { type: "text", dy: 8, fontSize: narrow ? 10 : 11.5, font: t.body, fontWeight: 500, baseline: "top" },
      encoding: { ...loc, latitude: { field: "top", type: "quantitative" }, text: { field: "lbl" }, color: { value: t.ink } } },
    extent([[-15, 66], [178, 66], [178, -46], [-15, -46]])
  ];
  return s;
}

/* ======================================================================
   FIGURES 9-11 AND 13 SHARED: SA4 regions, standardised classes, insets
   ====================================================================== */
/* ---------- Figures 9-11 and 13: SA4 regions ---------- */
// All three maps use the same 88 regions, the same % measure and the same fixed classes,
// so a colour means the same thing in every map and every year.
// ABS Statistical Areas Level 4 (ASGS 2021). Shares: Census 2011 and 2016 on that year's SA4s, 2021 on 2021 SA4s.
const SA4_FEAT = { values: SA4, format: { type: "topojson", feature: "sa4" } };
// STANDARDISED CLASSES for the choropleths: the same fixed cut-offs and colours in every map and year.
const SA4_BREAKS = [10, 15, 20, 25, 30, 40];
const SA4_COLORS = ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"]; // ColorBrewer YlGnBu, 7 classes
const SA4_LABELS = ["Under 10%", "10–15%", "15–20%", "20–25%", "25–30%", "30–40%", "40% and over"];
const SA4_DARK = 30; // classes at or above this share get white text
const SA4_CLASS = (f) => ({ calculate: `${f} < 10 ? 'Under 10%' : ${f} < 15 ? '10–15%' : ${f} < 20 ? '15–20%' : ${f} < 25 ? '20–25%' : ${f} < 30 ? '25–30%' : ${f} < 40 ? '30–40%' : '40% and over'`, as: "cl" });
const sa4Color = (legend) => ({ field: "cl", type: "ordinal", scale: { domain: SA4_LABELS, range: SA4_COLORS },
  legend: legend ? { title: "Born overseas (%)", orient: "bottom", direction: "horizontal", symbolType: "square", symbolSize: 160, symbolStrokeWidth: 0, columns: legend.cols || 7, labelLimit: 120, columnPadding: 12, values: SA4_LABELS } : null });
const INSETS = [
  { gcc: "Greater Sydney", label: "Sydney", rot: [-151, 0], box: [[149.95, -32.95], [151.7, -32.95], [151.7, -34.4], [149.95, -34.4], [149.95, -32.95]], tag: [151.75, -32.95] },
  { gcc: "Greater Melbourne", label: "Melbourne", rot: [-145, 0], box: [[144.3, -37.15], [146.25, -37.15], [146.25, -38.55], [144.3, -38.55], [144.3, -37.15]], tag: [146.3, -38.6] }
];
const SA4_TT = (yrField) => [
  { field: "properties.name", title: "Region" },
  { field: "properties.state", title: "State / territory" },
  ...(yrField ? [{ field: yrField, title: "Census year" }, { field: "pct", title: "Born overseas that year (%)", format: ".1f" }] : []),
  { field: "properties.s11", title: "Born overseas 2011 (%)", format: ".1f" },
  { field: "properties.s16", title: "Born overseas 2016 (%)", format: ".1f" },
  { field: "properties.s21", title: "Born overseas 2021 (%)", format: ".1f" },
  { field: "properties.chg", title: "Change 2011–2021 (pts)", format: "+.1f" },
  { field: "properties.os21", title: "Overseas-born residents, 2021", format: "," }
];
// one SA4 fill layer with hover highlight and the click-a-state highlight
// IDIOM: CHOROPLETH (the fill) - each SA4 region is coloured by its class. Used by Figures 9, 10 and 13.
function sa4Layer(t, o) {
  const pname = "hovr" + (HOVER_N++);
  return {
    data: SA4_FEAT,
    transform: [...(o.filter ? [{ filter: o.filter }] : []), ...(o.transform || [])],
    params: [{ name: pname, select: { type: "point", fields: ["properties.code"], on: "pointerover", clear: "pointerout" } }],
    mark: { type: "geoshape", cursor: "pointer", strokeJoin: "round", clip: true },
    encoding: {
      color: o.color,
      opacity: o.opacity || { condition: { test: HL("datum.properties.state"), value: 1 }, value: 0.22 },
      stroke: { condition: { param: pname, empty: false, value: "#111111" }, value: t.surface },
      strokeWidth: { condition: { param: pname, empty: false, value: 2 }, value: o.sw || 0.5 },
      tooltip: o.tooltip
    }
  };
}
const stateLines = (t) => ({ data: { values: STATES, format: { type: "topojson", feature: "states" } }, mark: { type: "geoshape", filled: false, stroke: "#3c3c3c", strokeWidth: 0.9, strokeOpacity: 0.75 } });
const insetBoxes = (t, narrow) => [
  { data: { values: INSETS.map(d => ({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: d.box } })) },
    mark: { type: "geoshape", filled: false, stroke: t.ink, strokeWidth: 1 } },
  ...INSETS.map(d => ({ data: { values: [{ lon: d.tag[0], lat: d.tag[1], label: d.label }] },
    transform: [{ filter: narrow ? "false" : "true" }],
    mark: { type: "text", align: "left", dx: 3, baseline: d.label === "Sydney" ? "bottom" : "top", font: t.body, fontSize: 11, fontWeight: 600, color: t.ink },
    encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, text: { field: "label" } } }))
];
const stateAbbr = (t, narrow) => ({
  data: { values: ST_LABELS }, transform: [{ filter: "datum.abbr != 'ACT'" }],
  mark: { type: "text", font: t.body, fontWeight: 600, fontSize: narrow ? 10 : 12, baseline: "middle" },
  encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, text: { field: "abbr" }, color: { value: t.ink },
    opacity: { condition: { test: HL("datum.name"), value: 1 }, value: 0.35 } }
});
function insetView(t, d, size, fill) {
  return {
    width: size, height: Math.round(size * 0.92), projection: { ...AUS_PROJ, rotate: d.rot, fit: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: d.box } } },
    title: { text: d.label, anchor: "start", font: t.body, fontSize: 12, fontWeight: 600, color: t.ink, offset: 4 },
    view: { stroke: "#c9c9c9", strokeWidth: 1 },
    layer: [fill(d.gcc)]
  };
}

/* ======================================================================
   FIGURE 9 | Page section 4.1 | IDIOM: Choropleth
   Function: spec3()
   ====================================================================== */

// ANNOTATIONS for Figure 9: a dot on the region, a hairline to the label, and the label in the sea.
// The value follows the Census-year slider.
function callouts(t, narrow) {
  const P = Object.fromEntries(SA4.objects.sa4.geometries.map(g => [g.properties.code, g.properties]));
  const pts = [
    { code: "125", lon: 151.0, lat: -33.81, llon: narrow ? 154.6 : 156.2, llat: -35.6, name: narrow ? "Parramatta" : "Sydney – Parramatta", note: "highest of 88 regions" },
    { code: "309", lon: 153.4, lat: -28.0, llon: narrow ? 154.6 : 156.2, llat: -25.8, name: "Gold Coast", note: "highest outside a capital" }
  ].map(d => ({ ...d, v11: P[d.code].s11, v16: P[d.code].s16, v21: P[d.code].s21 }));
  const val = { calculate: "format(yr == 2011 ? datum.v11 : yr == 2016 ? datum.v16 : datum.v21, '.1f') + '%'", as: "v" };
  const at = (lon, lat) => ({ longitude: { field: lon, type: "quantitative" }, latitude: { field: lat, type: "quantitative" } });
  return [
    { data: { values: pts }, mark: { type: "rule", strokeWidth: 0.8, color: t.accent2, interactive: false }, encoding: { ...at("lon", "lat"), longitude2: { field: "llon" }, latitude2: { field: "llat" } } },
    { data: { values: pts }, mark: { type: "circle", size: 22, color: t.accent2, interactive: false }, encoding: at("lon", "lat") },
    { data: { values: pts }, transform: [val, { calculate: narrow ? "[datum.name, datum.v]" : "[datum.name + ' ' + datum.v, datum.note]", as: "lab" }],
      mark: { type: "text", align: "left", baseline: "middle", dx: 4, fontSize: narrow ? 9.5 : 11, lineHeight: narrow ? 11 : 13, color: t.accent2, fontStyle: "italic", interactive: false },
      encoding: { ...at("llon", "llat"), text: { field: "lab" } } }
  ];
}
// `yr` is the slider; each region picks its 2011, 2016 or 2021 value from it.
// Layout: big map on the left, Sydney and Melbourne zooms on the right (stacked under it on phones).
function spec3(t, yr, w) {
  const narrow = w < 600;
  if (![2011, 2016, 2021].includes(yr)) yr = 2021;
  const pct = { calculate: "yr == 2011 ? datum.properties.s11 : yr == 2016 ? datum.properties.s16 : datum.properties.s21", as: "pct" };
  const fill = (gcc, sw) => sa4Layer(t, { filter: gcc ? `datum.properties.gcc == '${gcc}'` : null, transform: [pct, SA4_CLASS("datum.pct"), { calculate: "yr", as: "census" }],
    color: sa4Color({ cols: narrow ? 3 : 7 }), sw: sw, tooltip: SA4_TT("census") });
  const insetW = narrow ? Math.floor((w - 36) / 2) : 220;
  const mainW = narrow ? w - 22 : w - insetW - 40;
  const main = {
    width: mainW, height: Math.round(mainW * 0.82), projection: AUS_PROJ,
    // IDIOM: CHOROPLETH - the main map of all 88 regions, with state borders and labels on top.
    layer: [fill(null, 0.35), stateLines(t), waterLabels(t, narrow ? WATER_AUS.filter(d => d.n !== "Great Australian Bight") : WATER_AUS, narrow), stateAbbr(t, narrow), ...insetBoxes(t, narrow), ...callouts(t, narrow), extent([[112, -10], [161, -10], [161, -44], [112, -44]])]
  };
  // Insets: zoomed choropleths of Greater Sydney and Greater Melbourne.
  const insets = INSETS.map(d => insetView(t, d, insetW, (g) => fill(g, 0.6)));
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: { ...config(t), concat: { spacing: 16 } },
    params: [{ name: "yr", value: yr, bind: { input: "range", min: 2011, max: 2021, step: 5, name: "Census year " } }, { name: "hl", value: state.hl }],
    [narrow ? "vconcat" : "hconcat"]: [main, { [narrow ? "hconcat" : "vconcat"]: insets, spacing: narrow ? 12 : 22 }],
    spacing: narrow ? 14 : 20
  };
}

/* ======================================================================
   FIGURE 13 | Page section 4.2 | IDIOM: Bivariate choropleth
   Function: specBiv()
   ====================================================================== */

const BIV_COLORS = ["#e8e8e8", "#ace4e4", "#5ac8c8", "#dfb0d6", "#a5add3", "#5698b9", "#be64ac", "#8c62aa", "#3b4994"];
const BIV_SHARE = [15, 30], BIV_GROW = [1.5, 3];
function specBiv(t, w) {
  const narrow = w < 600;
  // IDIOM: BIVARIATE CHOROPLETH - two variables in one colour: share in 2021 (3 classes)
  // x change since 2011 (3 classes) = 9 colours. cls picks the colour.
  const cls = [
    { calculate: `(datum.properties.s21 < ${BIV_SHARE[0]} ? 0 : datum.properties.s21 < ${BIV_SHARE[1]} ? 1 : 2) * 3 + (datum.properties.chg < ${BIV_GROW[0]} ? 0 : datum.properties.chg < ${BIV_GROW[1]} ? 1 : 2)`, as: "cls" },
    { calculate: "['Low', 'Medium', 'High'][floor(datum.cls / 3)] + ' share, ' + ['low', 'medium', 'high'][datum.cls % 3] + ' growth'", as: "bivclass" }
  ];
  const op = { condition: [{ test: "!(" + HL("datum.properties.state") + ")", value: 0.2 }, { param: "cell", empty: true, value: 1 }], value: 0.18 };
  const fill = (gcc, sw) => sa4Layer(t, { filter: gcc ? `datum.properties.gcc == '${gcc}'` : null, transform: cls, opacity: op, sw,
    color: { field: "cls", type: "ordinal", scale: { domain: [0, 1, 2, 3, 4, 5, 6, 7, 8], range: BIV_COLORS }, legend: null },
    tooltip: [SA4_TT()[0], SA4_TT()[1], { field: "bivclass", title: "Class" }, ...SA4_TT().slice(2)] });
  // on phones everything sits right of the colour key's axis labels (about 60px), so leave room for them
  const sideW = narrow ? Math.floor((w - 96) / 2) : 200;
  const mainW = narrow ? w - 76 : w - sideW - 120;
  const main = { width: mainW, height: Math.round(mainW * 0.82), projection: AUS_PROJ,
    layer: [fill(null, 0.35), stateLines(t), stateAbbr(t, narrow), ...insetBoxes(t, narrow), extent([[112, -10], [161, -10], [161, -44], [112, -44]])] };
  const cells = []; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) cells.push({ a, b, cls: a * 3 + b });
  // The 3 x 3 colour key for the bivariate map. Hovering a cell shows only that class.
  const legend = {
    width: 96, height: 96, data: { values: cells },
    params: [{ name: "cell", select: { type: "point", fields: ["cls"], on: "pointerover", clear: "pointerout" } }],
    mark: { type: "rect", stroke: t.surface, strokeWidth: 2, cursor: "pointer" },
    encoding: {
      x: { field: "b", type: "ordinal", axis: { title: "Growth 2011–21 →", labelExpr: "['<1.5','1.5–3','≥3'][datum.value]", labelAngle: 0, domain: false, ticks: false, titleFontSize: 11, labelFontSize: 10 } },
      y: { field: "a", type: "ordinal", sort: "descending", axis: { title: "Share 2021 →", labelExpr: "['<15%','15–30%','≥30%'][datum.value]", domain: false, ticks: false, titleFontSize: 11, labelFontSize: 10 } },
      color: { field: "cls", type: "ordinal", scale: { domain: [0, 1, 2, 3, 4, 5, 6, 7, 8], range: BIV_COLORS }, legend: null } }
  };
  const insets = INSETS.map(d => insetView(t, d, sideW, (g) => fill(g, 0.6)));
  const side = narrow ? { vconcat: [legend, { hconcat: insets, spacing: 12, bounds: "full" }], spacing: 16, bounds: "full", align: "none" } : { vconcat: [legend, ...insets], spacing: 18, bounds: "full" };
  return { $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: { ...config(t), concat: { spacing: 16 } }, params: [{ name: "hl", value: state.hl }],
    [narrow ? "vconcat" : "hconcat"]: [main, side], bounds: "full", align: narrow ? "none" : "all", spacing: narrow ? 14 : 24, resolve: { scale: { color: "independent" } } };
}

/* ======================================================================
   FIGURE 14 | Page section 4.3 | IDIOM: Dot density
   Function: specDots()
   ====================================================================== */

// One dot per 10,000 overseas-born people, scattered randomly inside each state.
// The slider changes how many people a dot stands for.
function specDots(t, w) {
  const narrow = w < 600;
  const s = base(t, w, narrow ? Math.round(w * 0.85) : 520);
  s.projection = AUS_PROJ;
  const cnt = {}, ab2name = Object.fromEntries(ST.map(r => [r[1], r[0]]));
  const dots = EXTRA.dots.map(([lon, lat, ab]) => { cnt[ab] = (cnt[ab] || 0) + 1; return { lon, lat, ab, name: ab2name[ab], i: cnt[ab] - 1 }; });
  s.params = [{ name: "per", value: 10000, bind: { input: "radio", options: [10000, 20000, 50000], labels: ["10,000", "20,000", "50,000"], name: "One dot = " } }, { name: "hl", value: state.hl }];
  const lbl = ST_LABELS.map(d => ({ abbr: d.abbr, tot: d.tot, x: d.clon, y: d.clat, side: d.cside, l: d.abbr + " " + short(d.tot) }));
  const lab = (side) => ({ data: { values: lbl }, transform: [{ filter: narrow ? "false" : `datum.side == '${side}'` }],
    mark: { type: "text", align: side === "r" ? "left" : "right", fontSize: 11.5, font: t.mono, fontWeight: 500, baseline: "middle" },
    encoding: { longitude: { field: "x", type: "quantitative" }, latitude: { field: "y", type: "quantitative" }, text: { field: "l" }, color: { value: t.ink } } });
  s.layer = [
    { ...ausBase(t), mark: { ...ausBase(t).mark, cursor: "pointer" } },
    // IDIOM: DOT DENSITY - one dot per 10,000 overseas-born people (the slider changes this).
    { data: { values: dots }, transform: [{ filter: "datum.i % (per / 10000) == 0" }],
      mark: { type: "circle", size: narrow ? 5 : 9 },
      encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, color: { value: t.line },
        opacity: { condition: { test: HL("datum.name"), value: 0.85 }, value: 0.12 } } },
    lab("r"), lab("l"),
    { data: { values: [{ x: narrow ? 113 : 104, y: -44.5 }] }, transform: [{ calculate: "'● = ' + format(per, ',') + ' people born overseas'", as: "l" }], mark: { type: "text", align: "left", fontSize: 11.5, font: t.body, fontWeight: 600 },
      encoding: { longitude: { field: "x", type: "quantitative" }, latitude: { field: "y", type: "quantitative" }, text: { field: "l" }, color: { value: t.ink } } },
    extent(narrow ? [[112, -10], [155, -10], [155, -45], [112, -45]] : [[101, -8], [168, -8], [168, -46], [101, -46]])
  ];
  s.layer[0] = hoverable(s.layer[0], t, "properties.STATE_NAME");
  return s;
}

/* ======================================================================
   FIGURE 15 | Page section 4.3 | IDIOM: Dorling cartogram
   Function: specDorling()
   ====================================================================== */

// Each state becomes a circle sized by its overseas-born population, kept roughly in place.
function specDorling(t, w) {
  const narrow = w < 600;
  const X = [-17, 32], Y = [-15, 23];
  const pw = Math.min(w - 8, 640), ppu = pw / (X[1] - X[0]), ph = Math.round((Y[1] - Y[0]) * ppu);
  const share21 = Object.fromEntries(ST.map(r => [r[1], r[4][4]]));
  const nm = Object.fromEntries(ST.map(r => [r[1], r[0]]));
  const d = EXTRA.dorling.map(o => { const rp = o.r * ppu; return { ...o, name: nm[o.abbr], size: Math.PI * rp * rp, tot: ST_LABELS.find(s => s.abbr === o.abbr).tot, share: share21[o.abbr], big: rp > 34, rp }; });
  d.forEach(o => { o.l = o.big ? [o.abbr, short(o.tot)] : [o.abbr]; o.out = o.rp < 14; });
  const enc = { x: { field: "x", type: "quantitative", scale: { domain: X, nice: false, zero: false }, axis: null }, y: { field: "y", type: "quantitative", scale: { domain: Y, reverse: true, nice: false, zero: false }, axis: null } };
  const out = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json", width: pw, height: ph, config: config(t), data: { values: d },
    params: [{ name: "hl", value: state.hl }],
    layer: [
      // IDIOM: DORLING CARTOGRAM - each state is a circle sized by its overseas-born population,
      // coloured by its overseas-born share.
      { mark: { type: "circle", stroke: t.surface, strokeWidth: 1.5, cursor: "pointer" },
        encoding: { ...enc, opacity: { condition: { test: HL("datum.name"), value: 1 }, value: 0.2 }, size: { field: "size", type: "quantitative", scale: null },
          color: { field: "share", type: "quantitative", scale: { domain: [10, 36], scheme: "yellowgreenblue" }, legend: { title: "Born overseas, 2021 (%)", orient: "bottom", direction: "horizontal", gradientLength: 200, labelExpr: "datum.value + '%'" } },
          tooltip: [{ field: "name", title: "State / territory" }, { field: "tot", title: "Born overseas", format: "," }, { field: "share", title: "Share (%)", format: ".1f" }] } },
      { transform: [{ filter: "!datum.out" }], mark: { type: "text", fontSize: narrow ? 10.5 : 12.5, lineHeight: 15, font: t.mono, fontWeight: 600, baseline: "middle" },
        encoding: { ...enc, text: { field: "l" }, color: { condition: { test: "datum.share >= 27", value: t.onDark }, value: t.ink } } },
      { transform: [{ filter: "datum.out" }], mark: { type: "text", fontSize: narrow ? 10.5 : 12, font: t.mono, fontWeight: 600, baseline: "middle", align: "left", dx: 4 },
        encoding: { x: { field: "xr", type: "quantitative", scale: { domain: X, nice: false, zero: false }, axis: null }, y: enc.y, text: { field: "l" }, color: { value: t.ink } } }
    ],
    transform: [{ calculate: "datum.x + datum.r", as: "xr" }]
  };
  out.layer[0] = hoverable({ ...out.layer[0], mark: { ...out.layer[0].mark, stroke: t.surface, strokeWidth: 1.5 } }, t, "name");
  return out;
}

/* ======================================================================
   FIGURE 16 | Page section 4.3 | IDIOM: Pie-chart map
   Function: specPies()
   ====================================================================== */

// A pie on each state: overseas-born vs Australian-born. Pie area follows total population.
function specPies(t, w) {
  const narrow = w < 600;
  const k = Math.min(1, w / 900);
  const s = base(t, w, narrow ? Math.round(w * 0.85) : 540);
  s.projection = AUS_PROJ;
  const POS = { NSW: [148.0, -31.2], Vic: [143.4, -37.3], ACT: [153.6, -37.4], Qld: [144.8, -22.4], WA: [121.6, -26.0], SA: [135.3, -30.0], NT: [133.4, -19.4], Tas: [146.6, -42.3] };
  const H = narrow ? Math.round(w * 0.85) : 540;
  const ppd = Math.min((w - 8) / 46, H / 35) * 0.93;
  const slices = [], labels = [];
  ST_LABELS.forEach(d => {
    // Pie size: radius follows the square root of total population, so pie area is proportional.
    const tot = TOTPOP[d.abbr], sh = d.tot / tot, r = Math.max(7, 44 * k * Math.sqrt(tot / 8097060)), [lon, lat] = POS[d.abbr];
    slices.push({ abbr: d.abbr, name: d.name, lon, lat, r, a0: 0, a1: 2 * Math.PI * sh, part: "Born overseas", n: d.tot, pct: sh * 100 });
    slices.push({ abbr: d.abbr, name: d.name, lon, lat, r, a0: 2 * Math.PI * sh, a1: 2 * Math.PI, part: "Born in Australia", n: tot - d.tot, pct: (1 - sh) * 100 });
    const above = d.abbr === "NSW";
    labels.push({ abbr: d.abbr, lon, lat: above ? lat + (r + 17) / ppd : lat - (r + 5) / ppd, r, l: d.abbr + " " + (sh * 100).toFixed(1) + "%" });
  });
  s.params = [{ name: "hl", value: state.hl }];
  s.layer = [
    ausBase(t),
    { data: { values: [{ lon: 149.05, lat: -35.45, llon: 153.6, llat: -37.4 }] }, mark: { type: "rule", strokeWidth: 0.75 },
      encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, longitude2: { field: "llon" }, latitude2: { field: "llat" }, color: { value: t.muted } } },
    // IDIOM: PIE-CHART MAP (chart map) - a pie on each state: overseas-born vs Australian-born.
    { data: { values: slices }, mark: { type: "arc", stroke: t.surface, strokeWidth: 1.25, cursor: "pointer" },
      encoding: { opacity: { condition: { test: HL("datum.name"), value: 1 }, value: 0.2 }, longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" },
        theta: { field: "a0", type: "quantitative", scale: null }, theta2: { field: "a1" }, radius: { field: "r", type: "quantitative", scale: null },
        color: { field: "part", type: "nominal", scale: { domain: ["Born overseas", "Born in Australia"], range: [t.line, "#c4c4c4"] }, legend: { title: "2021 population", orient: "bottom" } },
        tooltip: [{ field: "name", title: "State / territory" }, { field: "part", title: "Group" }, { field: "n", title: "People", format: "," }, { field: "pct", title: "Share (%)", format: ".1f" }] } },
    { data: { values: labels },
      mark: { type: "text", baseline: "top", fontSize: narrow ? 10 : 11.5, font: t.mono, fontWeight: 600 },
      encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, text: { field: "l" }, color: { value: t.ink } } },
    extent([[112, -10], [158, -10], [158, -45], [112, -45]])
  ];
  s.layer[0] = hoverable(s.layer[0], t, "properties.STATE_NAME");
  s.layer[2] = { ...s.layer[2], transform: [{ lookup: "name", from: { data: { values: STATE_STATS }, key: "s_name", fields: Object.keys(STATE_STATS[0]) } }], encoding: { ...s.layer[2].encoding, tooltip: [{ field: "part", title: "Slice" }, { field: "n", title: "People in slice", format: "," }, { field: "pct", title: "Share of state (%)", format: ".1f" }, ...STATE_TT] } };
  return s;
}


/* ======================================================================
   PART 4. EXTRAS
   Animated gradient on Figure 4, data tables, shutter title
   ====================================================================== */
/* ---------- Figure 4 extra: animated green-to-gray countries ---------- */
// Spain, Brazil and South Africa get a moving gradient. Vega can't animate a fill like this,
// so after the map draws we lay a CSS gradient over each country and cut it to the country's shape.
const WAITED_LAYERS = [
  { rgb: "56, 122, 56", x: 59.32, y: 38 },
  { rgb: "0, 0, 0", x: 57.21, y: 94 },
  { rgb: "161, 205, 142", x: 48.62, y: 16 },
  { rgb: "0, 0, 0", x: 59.6, y: 94 },
  { rgb: "82, 78, 85", x: 41.74, y: 86 },
  { rgb: "70, 86, 69", x: 41.96, y: 63 }
];
const WAITED_STOPS = [[0.92, 0], [0.7764800000000001, 17.5], [0.46, 35], [0.14352, 52.5], [0, 70]];
// static per-layer phases (seed 5), so each wave starts at a different point in its cycle
const WAITED_PHASE = WAITED_LAYERS.map((_, i) => { const a = Math.sin((i + 1) * 12.9898 + 5 * 78.233) * 43758.5453; return (a - Math.floor(a)) * Math.PI * 2; });
function waitedBackground(t) {
  const ph = t * 0.88, amt = 0.50, dir = 1, spin = ph * dir;
  const D = 10 * amt; // drift amplitude in % of the element
  return WAITED_LAYERS.map((L, i) => {
    const p = WAITED_PHASE[i];
    // each modulation is exactly 0 at ph = 0: sin(x + p) - sin(p)
    const dx = 1.6 * D * (Math.sin(spin + p) - Math.sin(p));
    const dy = 0.5 * D * (Math.sin(spin * 0.83 + p * 1.7) - Math.sin(p * 1.7));
    const stops = WAITED_STOPS.map(([a, o]) => `rgba(${L.rgb}, ${a}) ${o}%`).join(", ");
    return `radial-gradient(150% 62% at ${L.x + dx}% ${L.y + dy}%, ${stops})`;
  }).join(", ");
}
let waitedRAF = 0, waitedVisible = true;
function setupWaited() {
  const host = document.getElementById("cV");
  const svg = host && host.querySelector("svg");
  if (!svg) return;
  host.querySelectorAll(".waited-overlay").forEach(o => o.remove());
  // mask = the three country outlines, copied from the rendered map with their exact transforms
  const sw = svg.getAttribute("width"), sh = svg.getAttribute("height");
  const paths = [...svg.querySelectorAll(".waited_marks path")].map((p) => {
    const m = p.getCTM();
    return `<path fill="#fff" fill-opacity="1" d="${p.getAttribute("d")}" transform="matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})"/>`;
  }).join("");
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}" viewBox="0 0 ${sw} ${sh}">${paths}</svg>`;
  const url = 'url("data:image/svg+xml,' + encodeURIComponent(maskSvg) + '")';
  const hr = host.getBoundingClientRect(), sr = svg.getBoundingClientRect();
  const overlays = [];
  // one overlay per country, sized to that country, so each shows the whole green-to-gray wave
  svg.querySelectorAll(".waited_marks path").forEach((p) => {
    const r = p.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const ov = document.createElement("div");
    ov.className = "waited-overlay gradient-waited";
    Object.assign(ov.style, {
      left: (r.left - hr.left + host.scrollLeft) + "px", top: (r.top - hr.top) + "px", width: r.width + "px", height: r.height + "px",
      webkitMaskImage: url, maskImage: url,
      webkitMaskSize: sr.width + "px " + sr.height + "px", maskSize: sr.width + "px " + sr.height + "px",
      webkitMaskPosition: (sr.left - r.left) + "px " + (sr.top - r.top) + "px", maskPosition: (sr.left - r.left) + "px " + (sr.top - r.top) + "px"
    });
    host.appendChild(ov); overlays.push(ov);
  });
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  cancelAnimationFrame(waitedRAF);
  if (reduce) { const bg = waitedBackground(0); overlays.forEach(o => { o.style.backgroundImage = bg; }); return; }
  const t0 = performance.now();
  const frame = (now) => {
    if (waitedVisible) { const bg = waitedBackground((now - t0) / 1000); for (const o of overlays) o.style.backgroundImage = bg; }
    waitedRAF = requestAnimationFrame(frame);
  };
  waitedRAF = requestAnimationFrame(frame);
  if (!setupWaited.io && "IntersectionObserver" in window) {
    setupWaited.io = new IntersectionObserver((es) => { waitedVisible = es[0].isIntersecting; });
    setupWaited.io.observe(host);
  }
}

/* ---------- "Show data" tables ---------- */
// Fills the expandable tables under Figures 5, 9 and 17.
const topojson_props = (topo, key) => topo.objects[key].geometries.map(g => g.properties);
function tables() {
  const rows2 = COB.map(([c, , , km, a, b, d]) => `<tr><td>${c}</td><td>${fmt(a)}</td><td>${fmt(b)}</td><td>${fmt(d)}</td><td>${fmt(km)}</td></tr>`).join("");
  document.getElementById("t2").innerHTML = `<table><thead><tr><th>Country of birth</th><th>2015</th><th>2020</th><th>2025</th><th>km from Sydney</th></tr></thead><tbody>${rows2}</tbody></table>`;
  const sa4 = topojson_props(SA4, "sa4").sort((a, b) => b.s21 - a.s21);
  const rows3 = sa4.map(p => `<tr><td>${p.name}</td><td>${p.state}</td><td class="num">${p.s11.toFixed(1)}</td><td class="num">${p.s16.toFixed(1)}</td><td class="num">${p.s21.toFixed(1)}</td></tr>`).join("");
  document.getElementById("t3").innerHTML = `<table><caption>Share of residents born overseas (%), by SA4 region, sorted by 2021</caption><thead><tr><th>Region (SA4)</th><th>State / territory</th><th class="num">2011</th><th class="num">2016</th><th class="num">2021</th></tr></thead><tbody>${rows3}</tbody></table>`;
  const rows4 = ST.map(([n, , , , , tot, top, topn]) => `<tr><td>${n}</td><td>${fmt(tot)}</td><td>${top}</td><td>${fmt(topn)}</td><td>${(topn / tot * 100).toFixed(1)}%</td></tr>`).join("");
  document.getElementById("t4").innerHTML = `<table><thead><tr><th>State / territory (2021)</th><th>Born overseas</th><th>Top country</th><th>Born there</th><th>Share of overseas-born</th></tr></thead><tbody>${rows4}</tbody></table>`;
}

/* ---------- shutter title ---------- */
// Splits "Australian Immigration" into letters; each letter fades in while three coloured
// slices slide across it. Skipped for people who turn on reduced motion.
(() => {
  const TEXT = "Australian Immigration";
  const el = document.getElementById("heroText"), btn = document.getElementById("heroBtn");
  if (!el) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function play() {
    el.innerHTML = "";
    let i = 0;
    TEXT.split(" ").forEach((word) => {
      const w = document.createElement("span"); w.className = "hero-word"; w.setAttribute("aria-hidden", "true");
      for (const ch of word) {
        const box = document.createElement("span"); box.className = "hero-ch";
        const main = document.createElement("span"); main.className = "main"; main.textContent = ch; box.appendChild(main);
        const delay = i * 40;
        if (reduce) { main.style.opacity = 1; main.style.filter = "none"; }
        else {
          main.animate([{ opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)" }], { duration: 800, delay: delay + 300, easing: "ease-out", fill: "forwards" });
          [["s1", "-100%", "100%", 0], ["s2", "100%", "-100%", 100], ["s3", "-100%", "100%", 200]].forEach(([cls, from, to, extra]) => {
            const sl = document.createElement("span"); sl.className = "slice " + cls; sl.textContent = ch; box.appendChild(sl);
            sl.animate([{ transform: `translateX(${from})`, opacity: 0 }, { opacity: 1, offset: 0.5 }, { transform: `translateX(${to})`, opacity: 0 }],
              { duration: 700, delay: delay + extra, easing: "ease-in-out", fill: "forwards" });
          });
        }
        w.appendChild(box); i++;
      }
      el.appendChild(w); i++;
    });
  }
  play();
  if (btn) btn.addEventListener("click", play);
})();

/* ======================================================================
   FIGURE 12 | Page section 4.1 | IDIOM: Choropleth (interactive zoom map)
   Function: specZoom()
   ====================================================================== */

// The capital cities at a much finer grain: ABS SA2 areas (roughly suburbs), 2021 Census.
// SA2_PACKED (in data.js) is a compact text format; unpackSA2() turns it back into GeoJSON.
// Same seven colour classes as Figure 9, so the colours mean the same thing.
const SA2_ALPHA = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
function unpackSA2(txt) {
  const IX = {}; for (let i = 0; i < SA2_ALPHA.length; i++) IX[SA2_ALPHA[i]] = i;
  const nums = (s) => { const out = []; let i = 0; while (i < s.length) { let z = 0, sh = 0, c; do { c = IX[s[i++]]; z += (c & 31) * 2 ** sh; sh += 5; } while (c & 32); out.push(z % 2 ? -(z + 1) / 2 : z / 2); } return out; };
  const area = (r) => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
  const STATE_OF = { 1: "New South Wales", 2: "Victoria", 3: "Queensland", 4: "South Australia", 5: "Western Australia", 6: "Tasmania", 7: "Northern Territory", 8: "Australian Capital Territory" };
  const CITY_OF = { 1: "Sydney", 2: "Melbourne", 3: "Brisbane", 4: "Adelaide", 5: "Perth", 6: "Hobart", 7: "Darwin", 8: "Canberra" };
  return txt.split("\n").map((line) => {
    const [code, name, tot36, os36, geo] = line.split(";");
    const tot = parseInt(tot36, 36), os = parseInt(os36, 36);
    const polys = geo.split("#").map((pg) => pg.split("|").map((rs, ri) => {
      const v = nums(rs); let x = v[0], y = v[1]; const pts = [[x / 1000, y / 1000]];
      for (let i = 2; i < v.length; i += 2) { x += v[i]; y += v[i + 1]; pts.push([x / 1000, y / 1000]); }
      const a = area(pts); if ((ri === 0 && a > 0) || (ri > 0 && a < 0)) pts.reverse(); // d3 wants clockwise outer rings
      pts.push(pts[0]); return pts;
    }));
    const pct = tot >= 300 ? Math.round(1000 * os / tot) / 10 : null; // too few residents for a reliable share
    // label point and size: centre and area of the largest ring in mercator units (radians), plus its bounding box,
    // used to show names only when an area is big enough on screen, and to fly to a searched suburb
    const R = Math.PI / 180, my = (lat) => Math.log(Math.tan(Math.PI / 4 + lat * R / 2));
    let best = null;
    polys.forEach(pg => { const r = pg[0]; let A = 0, cx = 0, cy = 0;
      for (let i = 0; i < r.length - 1; i++) { const x0 = r[i][0] * R, y0 = my(r[i][1]), x1 = r[i + 1][0] * R, y1 = my(r[i + 1][1]); const c = x0 * y1 - x1 * y0; A += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c; }
      A /= 2; if (!best || Math.abs(A) > Math.abs(best.A)) best = { A, cx: cx / (6 * A), cy: cy / (6 * A) }; });
    const all = polys.flatMap(pg => pg[0]);
    const bb = [Math.min(...all.map(p => p[0])), Math.min(...all.map(p => p[1])), Math.max(...all.map(p => p[0])), Math.max(...all.map(p => p[1]))];
    const clat = (2 * Math.atan(Math.exp(best.cy)) - Math.PI / 2) / R;
    return { type: "Feature", properties: { code, name: name.trim(), state: STATE_OF[code[0]], city: CITY_OF[code[0]], pct, os, tot,
      lon: best.cx / R, lat: clat, marea: Math.abs(best.A), bb },
      geometry: polys.length > 1 ? { type: "MultiPolygon", coordinates: polys } : { type: "Polygon", coordinates: polys[0] } };
  });
}
let SA2_FEATURES = null;
const sa2Features = () => SA2_FEATURES || (SA2_FEATURES = unpackSA2(SA2_PACKED));

// Where each city button flies to: centre [lon, lat] and zoom (projection scale for a ~900px map)
const CITY_VIEWS = {
  Sydney: [151.0, -33.82, 58000], Melbourne: [145.05, -37.83, 52000], Brisbane: [153.03, -27.48, 52000],
  Perth: [115.88, -31.95, 50000], Adelaide: [138.6, -34.9, 60000], Canberra: [149.12, -35.3, 75000],
  Hobart: [147.3, -42.86, 70000], Darwin: [130.92, -12.45, 85000]
};
const zoomState = { cx: 151.0, cy: -33.82, zs: 58000, city: "Sydney" };

function specZoom(t, w) {
  const narrow = w < 600;
  const h = narrow ? Math.round(w * 1.05) : 560;
  const k = w / 900; // keep the same view at any width
  const loc = { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" } };
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: w, height: h, autosize: { type: "none" }, padding: 0,
    config: { ...config(t), view: { stroke: null, fill: t.ocean } },
    params: [{ name: "cx", value: zoomState.cx }, { name: "cy", value: zoomState.cy }, { name: "zs", value: zoomState.zs * k }, { name: "hl", value: state.hl }],
    projection: { type: "mercator", center: { expr: "[cx, cy]" }, scale: { expr: "zs" } },
    layer: [
      // land outside the capital-city areas, in plain grey
      { data: { values: STATES, format: { type: "topojson", feature: "states" } }, mark: { type: "geoshape", fill: t.land, stroke: "#ffffff", strokeWidth: 1, clip: true } },
      // IDIOM: CHOROPLETH - each SA2 area coloured by its share born overseas (same classes as Figure 9)
      { data: { values: sa2Features() },
        transform: [{ calculate: "datum.properties.pct", as: "pct" }, SA4_CLASS("datum.pct"),
          { calculate: "isValid(datum.pct) ? datum.cl : 'Too few residents'", as: "cl" },
          { calculate: "isValid(datum.pct) ? format(datum.pct, '.1f') + '%' : 'Too few residents to show'", as: "pctl" }],
        params: [{ name: "hovz", select: { type: "point", fields: ["properties.code"], on: "pointerover", clear: "pointerout" } }],
        mark: { type: "geoshape", cursor: "grab", clip: true, strokeJoin: "round" },
        encoding: {
          color: { field: "cl", type: "ordinal", scale: { domain: [...SA4_LABELS, "Too few residents"], range: [...SA4_COLORS, "#d9d9d9"] },
            legend: { title: "Born overseas (%)", orient: "none", legendX: 10, legendY: h - (narrow ? 66 : 74), direction: "horizontal", columns: 4, labelFontSize: narrow ? 9.5 : 11, titleFontSize: narrow ? 10 : 11,
              symbolType: "square", symbolSize: narrow ? 80 : 140, symbolStrokeWidth: 0, fillColor: "rgba(255,255,255,0.88)", padding: narrow ? 5 : 8, cornerRadius: 3, labelLimit: 130, columnPadding: narrow ? 5 : 10,
              values: SA4_LABELS } },
          opacity: { condition: { test: HL("datum.properties.state"), value: 1 }, value: 0.25 },
          stroke: { condition: { param: "hovz", empty: false, value: "#111111" }, value: "#ffffff" },
          strokeWidth: { condition: { param: "hovz", empty: false, value: 2 }, value: 0.35 },
          tooltip: [{ field: "properties.name", title: "Area" }, { field: "properties.city", title: "City" }, { field: "pctl", title: "Born overseas, 2021" },
            { field: "properties.os", title: "Residents born overseas", format: "," }, { field: "properties.tot", title: "All residents", format: "," }]
        } },
      // SUBURB NAMES - shown only for areas that are big enough on screen at the current zoom, so the map
      // never fills with text: zoom in and more names appear.
      ...[true, false].map(halo => ({ data: { values: sa2Features().map(f => ({ code: f.properties.code, lon: f.properties.lon, lat: f.properties.lat, a: f.properties.marea,
          lines: f.properties.name.split(" - ").length > 2 ? [f.properties.name.split(" - ")[0], f.properties.name.split(" - ").slice(1).join(" - ")] : f.properties.name.split(" - ") })) },
        transform: [{ filter: `datum.a * zs * zs > ${narrow ? 5200 : 7500} && abs(datum.lon - cx) * zs / 57.3 < width * 0.6 && abs(datum.lat - cy) * zs / 57.3 < height * 0.7` }],
        mark: { type: "text", font: t.body, fontSize: narrow ? 9 : 10.5, fontWeight: 600, lineHeight: narrow ? 10 : 12, baseline: "middle", clip: true, interactive: false,
          ...(halo ? { stroke: "rgba(255,255,255,0.85)", strokeWidth: 3, strokeJoin: "round" } : { fill: "#1b1b1b" }) },
        encoding: { ...loc, text: { field: "lines" } } }))
    ]
  };
}

// Pan (drag), zoom (buttons, or Ctrl/Cmd + scroll) and fly-to (city buttons) for Figure 12.
// They all just change three numbers - cx, cy (map centre) and zs (scale) - inside the drawn chart.
function setupZoomControls() {
  const host = document.getElementById("cZ");
  const v = views.cZ; if (!host || !v) return;
  const k = () => host.clientWidth / 900;
  const R = 180 / Math.PI;
  const apply = () => { const cur = views.cZ; if (cur) cur.signal("cx", zoomState.cx).signal("cy", zoomState.cy).signal("zs", zoomState.zs * k()).runAsync(); };
  const clampZoom = (z) => Math.max(4000, Math.min(400000, z));
  // mercator helpers (projection maths, so the point under the cursor stays put when zooming)
  const yOf = (lat) => Math.log(Math.tan(Math.PI / 4 + lat / R / 2));
  const latOf = (y) => (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * R;
  function zoomAt(factor, px, py) {
    const s0 = zoomState.zs * k(), s1 = clampZoom(zoomState.zs * factor) * k();
    const w = host.clientWidth, h = host.clientHeight;
    const dx = px - w / 2, dy = py - h / 2;
    const lon = zoomState.cx + dx / s0 * R, ym = yOf(zoomState.cy) - dy / s0;
    zoomState.zs = s1 / k();
    zoomState.cx = lon - dx / s1 * R;
    zoomState.cy = latOf(ym + dy / s1);
    apply();
  }
  let anim = 0;
  function flyTo(name) {
    const [tx, ty, tz] = CITY_VIEWS[name]; zoomState.city = name;
    document.querySelectorAll("#zoomCities button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.city === name)));
    flyToPoint(tx, ty, tz);
  }
  function flyToPoint(tx, ty, tz) {
    cancelAnimationFrame(anim);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { Object.assign(zoomState, { cx: tx, cy: ty, zs: tz }); return apply(); }
    const from = { ...zoomState }, t0 = performance.now(), D = 900;
    const ease = (u) => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    const step = (now) => {
      const u = Math.min(1, (now - t0) / D), e = ease(u);
      // zoom out a little in the middle of the flight, like a camera pulling back
      const out = Math.sin(Math.PI * u) * 0.55;
      zoomState.cx = from.cx + (tx - from.cx) * e; zoomState.cy = from.cy + (ty - from.cy) * e;
      zoomState.zs = Math.exp(Math.log(from.zs) + (Math.log(tz) - Math.log(from.zs)) * e) * (1 - out * (Math.abs(tx - from.cx) > 2 ? 1 : 0));
      apply(); if (u < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  if (!setupZoomControls.wired) {
    setupZoomControls.wired = true;
    document.querySelectorAll("#zoomCities button").forEach(b => b.addEventListener("click", () => flyTo(b.dataset.city)));
    document.getElementById("zoomIn").addEventListener("click", () => zoomAt(1.5, host.clientWidth / 2, host.clientHeight / 2));
    document.getElementById("zoomOut").addEventListener("click", () => zoomAt(1 / 1.5, host.clientWidth / 2, host.clientHeight / 2));
    // Ctrl/Cmd + scroll zooms; a plain scroll keeps scrolling the page
    host.addEventListener("wheel", (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault(); const r = host.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0022), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    // drag to pan
    let drag = null;
    host.addEventListener("pointerdown", (e) => { if (e.button !== 0) return; drag = { x: e.clientX, y: e.clientY, cx: zoomState.cx, cy: zoomState.cy }; host.setPointerCapture(e.pointerId); host.classList.add("dragging"); });
    host.addEventListener("pointermove", (e) => {
      if (!drag) return; const s = zoomState.zs * k();
      zoomState.cx = drag.cx - (e.clientX - drag.x) / s * R;
      zoomState.cy = latOf(yOf(drag.cy) + (e.clientY - drag.y) / s);
      apply();
    });
    const end = () => { drag = null; host.classList.remove("dragging"); };
    host.addEventListener("pointerup", end); host.addEventListener("pointercancel", end);
    // keyboard: arrows pan, +/- zoom
    host.addEventListener("keydown", (e) => {
      const s = zoomState.zs * k(), step = 60;
      if (e.key === "+" || e.key === "=") zoomAt(1.4, host.clientWidth / 2, host.clientHeight / 2);
      else if (e.key === "-") zoomAt(1 / 1.4, host.clientWidth / 2, host.clientHeight / 2);
      else if (e.key.startsWith("Arrow")) {
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0, dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        zoomState.cx += dx / s * R; zoomState.cy = latOf(yOf(zoomState.cy) - dy / s); apply();
      } else return;
      e.preventDefault();
    });
  }
  document.querySelectorAll("#zoomCities button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.city === zoomState.city)));
}

/* ======================================================================
   FIGURE 17 | Page section 4.4 | IDIOM: Linked choropleths (state map + world map)
   Function: specTop()
   ====================================================================== */

// Each state is coloured by its largest overseas birthplace, and that country is coloured the same on
// the world map. Hovering either side highlights the matching places on the other.
const TOP_COLORS = { England: "#1f4e79", India: "#e07b1a", China: "#7b5ea7", "New Zealand": "#2a9d8f", Philippines: "#cc79a7" }; // no red or green, for colour-blind readers
const TOP_WORLD = { England: "United Kingdom", India: "India", China: "China", "New Zealand": "New Zealand", Philippines: "Philippines" };
// where each country name sits on the world map (just beside the country)
const TOP_LABELS = [
  { cty: "England", label: "England", lon: 1, lat: 54.5, align: "left" },
  { cty: "India", label: "India", lon: 70, lat: 15, align: "right" },
  { cty: "China", label: "China", lon: 103, lat: 34, align: "center" },
  { cty: "Philippines", label: "Philippines", lon: 127.5, lat: 13, align: "left" },
  { cty: "New Zealand", label: "New Zealand", lon: 166, lat: -46, align: "right" }
];
function specTop(t, w) {
  const narrow = w < 600;
  const tops = Object.keys(TOP_COLORS);
  const states = ST_LABELS.map(d => ({ name: d.name, abbr: d.abbr, cty: d.top, topn: d.topn, tot: d.tot, sh: Math.round(1000 * d.topn / d.tot) / 10 }));
  const byCty = {}; states.forEach(s => { (byCty[s.cty] = byCty[s.cty] || []).push(s.abbr); });
  const world2cty = Object.fromEntries(Object.entries(TOP_WORLD).map(([c, wn]) => [wn, c]));
  const colour = { field: "cty", type: "nominal", scale: { domain: tops, range: tops.map(c => TOP_COLORS[c]) },
    legend: { title: "Largest overseas birthplace, 2021", titleLimit: 400, orient: "bottom", direction: "horizontal", columns: narrow ? 3 : 5, symbolType: "square", symbolSize: 150, labelExpr: "datum.label == 'England' ? 'England (UK)' : datum.label" } };
  // dim everything except the hovered country (from either map)
  const active = "length(data('selS_store')) || length(data('selW_store'))";
  const lit = { or: [{ param: "selS", empty: false }, { param: "selW", empty: false }] };
  const op = (on, off) => ({ condition: [{ test: lit, value: on }, { test: active, value: off }], value: on });
  const loc = { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" } };
  const mapW = narrow ? w - 20 : Math.floor((w - 30) / 2);
  const world = {
    width: mapW, height: narrow ? Math.round(mapW * 0.7) : 340,
    // fitted to a box from Britain to New Zealand, so the five countries fill the frame
    projection: { type: "equalEarth", rotate: [-85, 0], fit: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [[-10, 60], [180, 60], [180, -47], [-10, -47]] } } },
    title: { text: "Where they were born", anchor: "start", font: t.body, fontSize: 13, fontWeight: 600, color: t.ink },
    layer: [
      { data: { values: WORLD, format: { type: "topojson", feature: "countries" } },
        transform: [{ calculate: `${JSON.stringify(world2cty)}[datum.properties.name] || ''`, as: "cty" }, { filter: "datum.cty == ''" }],
        mark: { type: "geoshape", fill: t.land, stroke: "#ffffff", strokeWidth: 0.3, clip: true } },
      // the five birthplace countries, in their colours
      { data: { values: WORLD, format: { type: "topojson", feature: "countries" } },
        transform: [{ calculate: `${JSON.stringify(world2cty)}[datum.properties.name] || ''`, as: "cty" }, { filter: "datum.cty != ''" },
          { calculate: `${JSON.stringify(Object.fromEntries(Object.entries(byCty).map(([c, l]) => [c, l.join(", ")])))}[datum.cty]`, as: "states" }],
        params: [{ name: "selW", select: { type: "point", fields: ["cty"], on: "pointerover", clear: "pointerout" } }],
        mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 0.5, cursor: "pointer", clip: true },
        encoding: { color: colour, opacity: op(1, 0.25),
          tooltip: [{ field: "properties.name", title: "Country" }, { field: "states", title: "Largest group in" }] } },
      // a faint outline of Australia so the two maps read together
      { data: { values: STATES, format: { type: "topojson", feature: "states" } }, mark: { type: "geoshape", fill: "#bdbdbd", stroke: null, clip: true } },
      // country names next to each coloured country
      { data: { values: TOP_LABELS }, mark: { type: "text", font: t.body, fontSize: narrow ? 10 : 11.5, fontWeight: 600, fill: t.ink, align: { expr: "datum.align" }, baseline: "middle" },
        encoding: { ...loc, text: { field: "label" }, opacity: op(1, 0.3) } }
    ]
  };
  const aus = {
    width: mapW, height: narrow ? Math.round(mapW * 0.85) : 340, projection: AUS_PROJ,
    title: { text: "Where they live", anchor: "start", font: t.body, fontSize: 13, fontWeight: 600, color: t.ink },
    layer: [
      // IDIOM: CHOROPLETH (categorical) - each state filled with the colour of its largest overseas birthplace
      { data: { values: STATES, format: { type: "topojson", feature: "states" } },
        transform: [{ lookup: "properties.STATE_NAME", from: { data: { values: states }, key: "name", fields: ["cty", "topn", "tot", "sh", "abbr"] } }],
        params: [{ name: "selS", select: { type: "point", fields: ["cty"], on: "pointerover", clear: "pointerout" } }],
        mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 1, cursor: "pointer" },
        encoding: { color: colour, opacity: op(1, 0.25),
          tooltip: [{ field: "properties.STATE_NAME", title: "State / territory" }, { field: "cty", title: "Largest overseas birthplace" },
            { field: "topn", title: "Residents born there", format: "," }, { field: "sh", title: "Share of the state's overseas-born (%)", format: ".1f" }] } },
      { data: { values: ST_LABELS.map(d => ({ ...d, cty: d.top })) }, transform: [{ filter: "datum.abbr != 'ACT'" }],
        mark: { type: "text", font: t.body, fontSize: narrow ? 10 : 11.5, fontWeight: 600, lineHeight: 13, color: "#ffffff" },
        encoding: { ...loc, text: { field: "abbr" }, opacity: op(1, 0.4) } },
      extent([[112, -10], [154, -10], [154, -44], [112, -44]])
    ]
  };
  return { $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: { ...config(t), view: { stroke: null } },
    [narrow ? "vconcat" : "hconcat"]: [world, aus], spacing: narrow ? 16 : 30, resolve: { scale: { color: "shared" } } };
}


/* ======================================================================
   FIGURE 18 | Page section 4.5 | IDIOM: Standardised choropleth small multiples, linked to a home-region map
   Function: specLang()  (hover and buttons wired up by setupLangControls())
   ====================================================================== */

// The Census does not record which state of India or province of China someone was born in, so this
// figure uses the language they speak at home instead (2021 Census, table G13). Each language is tied to
// the Indian states or Chinese provinces where it is the main language (LANG_HOME below).
// Australian rates are standardised: speakers per 1,000 residents of each state, with the same five
// classes for every language, so the eight maps can be compared directly.
const LANGS = [
  // key, colour, where it is the main language, Australian speakers in each state (NSW, Vic, Qld, SA, WA, Tas, NT, ACT)
  { lang: "Mandarin", col: "#9273c9", home: "Most of China (the national language)", n: [270725, 221819, 83620, 32112, 51735, 8096, 2521, 14373] },
  { lang: "Cantonese", col: "#cc79a7", home: "Guangdong, Hong Kong and Macau", n: [148838, 82386, 27395, 10167, 19669, 1520, 804, 4228] },
  { lang: "Punjabi", col: "#e07b1a", home: "Punjab and Chandigarh", n: [53472, 104970, 30882, 19964, 20597, 2561, 1582, 5005] },
  { lang: "Hindi", col: "#4a7fc1", home: "The Hindi belt: Uttar Pradesh, Bihar, Rajasthan, Madhya Pradesh, Delhi and others", n: [80076, 66892, 21334, 9865, 11922, 1278, 947, 4818] },
  { lang: "Tamil", col: "#56b4e9", home: "Tamil Nadu and Puducherry", n: [38411, 34065, 7286, 3321, 8740, 457, 554, 2364] },
  { lang: "Gujarati", col: "#c49a00", home: "Gujarat, and Dadra and Nagar Haveli and Daman and Diu", n: [26861, 24139, 9764, 7415, 10159, 740, 452, 1748] },
  { lang: "Malayalam", col: "#555b6e", home: "Kerala and Lakshadweep", n: [20810, 25406, 13039, 4769, 9703, 597, 1581, 2764] },
  { lang: "Bengali", col: "#8b5a3c", home: "West Bengal and Tripura", n: [39600, 15085, 4535, 2837, 3854, 681, 706, 2698] }
];
const ABBR_OF = Object.fromEntries(ST.map(r => [r[0], r[1]]));
const LANG_STATES = ["New South Wales", "Victoria", "Queensland", "South Australia", "Western Australia", "Tasmania", "Northern Territory", "Australian Capital Territory"];
const LANG_POP = [8072106, 6503473, 5156123, 1781522, 2660038, 557531, 232617, 454473]; // all residents, 2021 Census
const LANG_BREAKS = [2, 5, 10, 20];
const LANG_CLASSES = ["Under 2", "2–5", "5–10", "10–20", "20 and over"];
// Each language gets its own colour; the five classes are lighter-to-darker shades of it.
const shade = (hex, k) => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const mix = [0.16, 0.34, 0.56, 0.8, 1][k], dark = k === 4 ? 0.72 : 1;
  return "#" + c.map(v => Math.round((255 + (v - 255) * mix) * dark).toString(16).padStart(2, "0")).join("");
};
const LANG_ROWS = []; // one row per language and state, for tooltips and the data table
LANGS.forEach(L => {
  L.ramp = [0, 1, 2, 3, 4].map(k => shade(L.col, k));
  L.rate = {};
  LANG_STATES.forEach((s, i) => {
    const r = Math.round(10000 * L.n[i] / LANG_POP[i]) / 10;
    L.rate[s] = r;
    LANG_ROWS.push({ lang: L.lang, state: s, n: L.n[i], rate: r, k: LANG_BREAKS.filter(b => r >= b).length });
  });
  L.total = L.n.reduce((a, b) => a + b, 0);
  const top = LANG_STATES.reduce((a, s) => L.rate[s] > L.rate[a] ? s : a, LANG_STATES[0]);
  L.top = ABBR_OF[top] + " " + L.rate[top].toFixed(1);
});
// where each language name sits on the home-region map
const LANG_LABELS = [
  { lang: "Mandarin", lon: 103, lat: 35, align: "center" },
  { lang: "Cantonese", lon: 117.5, lat: 22.2, align: "left" },
  { lang: "Punjabi", lon: 74.6, lat: 31.4, align: "right" },
  { lang: "Hindi", lon: 80.5, lat: 25.6, align: "center" },
  { lang: "Gujarati", lon: 68.3, lat: 22.6, align: "right" },
  { lang: "Bengali", lon: 89.6, lat: 24.4, align: "left" },
  { lang: "Malayalam", lon: 75.6, lat: 9.6, align: "right" },
  { lang: "Tamil", lon: 80.6, lat: 10.6, align: "left" }
];
const langState = { pick: "", hover: null };

function specLang(t, w) {
  const narrow = w < 600;
  const cols = narrow ? 2 : 4, gap = narrow ? 8 : 12;
  const pw = Math.floor((w - (cols - 1) * gap - (narrow ? 26 : 4)) / cols);
  const lit = (f) => `lang == '' || ${f} == lang`;
  const loc = { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" } };
  const byLang = Object.fromEntries(LANGS.map(L => [L.lang, L]));
  const homeH = narrow ? Math.round(w * 0.9) : 400;

  // ---- the home-region map: Indian states and Chinese provinces, coloured by language ----
  const home = {
    width: w - (narrow ? 26 : 4), height: homeH,
    title: { text: narrow ? ["Where each language is spoken:", "Indian states and Chinese provinces"] : "Where each language is spoken: Indian states and Chinese provinces", anchor: "start", font: t.body, fontSize: 13, fontWeight: 600, color: t.ink },
    projection: { type: "conicEqualArea", parallels: [15, 40], rotate: [-100, 0],
      fit: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [[67, 53], [134, 53], [134, 7], [67, 7]] } } },
    layer: [
      // neighbouring countries for context
      { data: { values: WORLD, format: { type: "topojson", feature: "countries" } }, transform: [{ filter: "datum.properties.name != 'India' && datum.properties.name != 'China'" }],
        mark: { type: "geoshape", fill: "#efefef", stroke: "#ffffff", strokeWidth: 0.6, clip: true } },
      // IDIOM: CATEGORICAL CHOROPLETH - each state or province filled with the colour of its language
      { data: { values: LANGMAP, format: { type: "topojson", feature: "regions" } },
        transform: [{ calculate: "datum.properties.lang", as: "lang" },
          { calculate: `${JSON.stringify(Object.fromEntries(LANGS.map(L => [L.lang, L.col])))}[datum.lang] || '#d9d9d9'`, as: "fillc" },
          { calculate: `${JSON.stringify(Object.fromEntries(LANGS.map(L => [L.lang, L.total])))}[datum.lang]`, as: "aus" },
          { calculate: "datum.lang == '' ? 'Another language (not counted separately by the Census)' : datum.lang", as: "langl" }],
        mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 0.6, cursor: "pointer", clip: true },
        encoding: { color: { field: "fillc", type: "nominal", scale: null },
          opacity: { condition: { test: lit("datum.lang"), value: 1 }, value: 0.22 },
          tooltip: [{ field: "properties.name", title: "State / province" }, { field: "properties.cty", title: "Country" },
            { field: "langl", title: "Main language" }, { field: "aus", title: "Speakers in Australia, 2021", format: "," }] } },
      // country borders on top, a little darker
      { data: { values: WORLD, format: { type: "topojson", feature: "countries" } }, transform: [{ filter: "datum.properties.name == 'India' || datum.properties.name == 'China'" }],
        mark: { type: "geoshape", filled: false, stroke: "#6b6b6b", strokeWidth: 0.9, clip: true, interactive: false } },
      { data: { values: [{ n: "INDIA", lon: 77.8, lat: 17.5 }] },
        mark: { type: "text", font: t.body, fontSize: narrow ? 9 : 11, fontWeight: 600, letterSpacing: 2, fill: t.muted, interactive: false }, encoding: { ...loc, text: { field: "n" } } },
      { data: { values: LANG_LABELS }, mark: { type: "text", font: t.body, fontSize: narrow ? 10 : 12, fontWeight: 700, align: { expr: "datum.align" }, baseline: "middle", fill: t.ink, interactive: false },
        encoding: { ...loc, text: { field: "lang" }, opacity: { condition: { test: lit("datum.lang"), value: 1 }, value: 0.25 } } }
    ]
  };

  // ---- eight small maps of Australia, one per language, all with the same classes ----
  // IDIOM: STANDARDISED CHOROPLETH (small multiples) - speakers per 1,000 residents of each state
  const panel = (L) => ({
    width: pw, height: Math.round(pw * 0.86), projection: AUS_PROJ,
    title: { text: L.lang, subtitle: "Highest: " + L.top, anchor: "start", font: t.body, fontSize: narrow ? 12 : 13, fontWeight: 700, color: L.col,
      subtitleFont: t.body, subtitleFontSize: narrow ? 10 : 11, subtitleColor: t.muted, offset: 2 },
    data: { values: STATES, format: { type: "topojson", feature: "states" } },
    transform: [
      { calculate: `'${L.lang}'`, as: "lang" },
      { calculate: `${JSON.stringify(L.rate)}[datum.properties.STATE_NAME]`, as: "rate" },
      { calculate: `${JSON.stringify(Object.fromEntries(LANG_STATES.map((s, i) => [s, L.n[i]])))}[datum.properties.STATE_NAME]`, as: "n" },
      { calculate: LANG_BREAKS.map(b => `(datum.rate >= ${b} ? 1 : 0)`).join(" + "), as: "k" },
      { calculate: `${JSON.stringify(L.ramp)}[datum.k]`, as: "fillc" },
      { calculate: `${JSON.stringify(LANG_CLASSES)}[datum.k]`, as: "cls" }
    ],
    mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 0.8, cursor: "pointer" },
    encoding: { color: { field: "fillc", type: "nominal", scale: null },
      opacity: { condition: { test: `(${lit("datum.lang")}) && (${HL("datum.properties.STATE_NAME")})`, value: 1 }, value: 0.22 },
      tooltip: [{ field: "properties.STATE_NAME", title: "State / territory" }, { field: "lang", title: "Language at home" },
        { field: "n", title: "Speakers, 2021", format: "," }, { field: "rate", title: "Per 1,000 residents", format: ".1f" }, { field: "cls", title: "Class" }] }
  });
  const rows = [];
  for (let i = 0; i < LANGS.length; i += cols) rows.push({ hconcat: LANGS.slice(i, i + cols).map(panel), spacing: gap });

  // ---- legend: the five classes, shown in grey because each map uses its own colour ----
  const key = {
    width: narrow ? w - 40 : 420, height: 14,
    title: { text: narrow ? ["Speakers per 1,000 residents", "(same classes on every map; darker = more)"] : "Speakers per 1,000 residents (same classes on every map; darker = more)", anchor: "start", font: t.body, fontSize: 12, fontWeight: 600, color: t.ink },
    data: { values: LANG_CLASSES.map((c, k) => ({ c, k, fillc: shade("#555555", k) })) },
    mark: { type: "rect", stroke: "#ffffff" },
    encoding: { x: { field: "c", type: "ordinal", sort: null, title: null, axis: { domain: false, ticks: false, labelFont: t.body, labelFontSize: 11, labelAngle: 0, labelPadding: 4 } },
      color: { field: "fillc", type: "nominal", scale: null } }
  };
  return { $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: { ...config(t), view: { stroke: null } },
    params: [{ name: "lang", value: langState.hover || langState.pick }, { name: "hl", value: state.hl }],
    vconcat: [home, ...rows, key], spacing: narrow ? 14 : 18 };
}

// Hover a region or a small map to pick out one language; the buttons (or a click) keep it picked.
function setupLangControls() {
  const v = views.cL; if (!v) return;
  const set = () => v.signal("lang", langState.hover || langState.pick).runAsync();
  const btns = document.querySelectorAll("#langPick button");
  const mark = () => btns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === langState.pick)));
  const langOf = (item) => { const d = item && item.datum; return d && typeof d.lang === "string" && d.lang ? d.lang : null; };
  v.addEventListener("pointerover", (e, item) => { const l = langOf(item); if (l) { langState.hover = l; set(); } });
  v.addEventListener("pointerout", () => { langState.hover = null; set(); });
  v.addEventListener("click", (e, item) => { const l = langOf(item); langState.pick = l && l !== langState.pick ? l : ""; langState.hover = null; mark(); set(); });
  if (!setupLangControls.wired) {
    setupLangControls.wired = true;
    btns.forEach(b => b.addEventListener("click", () => { langState.pick = b.dataset.lang; langState.hover = null; mark(); if (views.cL) views.cL.signal("lang", langState.pick).runAsync(); }));
  }
  mark();
}


/* ======================================================================
   FIGURE 19 | Page section 4.6 | IDIOM: Standardised choropleth with a language picker (linked world map, state map and bar chart)
   Function: specWorldLang()  (dropdown and clicks wired up by setupWorldLangControls())
   ====================================================================== */

// 34 languages spoken at home, 2021 Census (table G13), with the countries where each is a main language.
// n = speakers in NSW, Vic, Qld, SA, WA, Tas, NT, ACT (same order as LANG_STATES in Figure 18).
// Pick one language and three views change together: its home countries, its rate in each state
// (per 1,000 residents, the same five classes as Figure 18) and its place in the national ranking.
const LANG_ALL = [
  { lang: "Arabic", group: "Middle East & North Africa", countries: ["Algeria", "Bahrain", "Egypt", "Iraq", "Jordan", "Kuwait", "Lebanon", "Libya", "Morocco", "Oman", "Qatar", "Saudi Arabia", "Sudan", "Syria", "Tunisia", "United Arab Emirates", "Yemen", "Palestine", "Mauritania", "W. Sahara"], n: [227205, 91505, 16157, 11011, 15943, 917, 426, 3854] },
  { lang: "Persian", group: "Middle East & North Africa", countries: ["Iran"], n: [26826, 22337, 8453, 5419, 7603, 454, 99, 1228] },
  { lang: "Turkish", group: "Middle East & North Africa", countries: ["Turkey", "N. Cyprus"], n: [23828, 34901, 2768, 857, 1984, 88, 57, 404] },
  { lang: "Vietnamese", group: "South-East Asia", countries: ["Vietnam"], n: [117816, 118692, 31362, 21821, 22761, 1449, 1562, 5065] },
  { lang: "Filipino / Tagalog", group: "South-East Asia", countries: ["Philippines"], n: [82568, 52623, 35376, 11181, 29715, 1359, 5146, 3966] },
  { lang: "Indonesian", group: "South-East Asia", countries: ["Indonesia"], n: [32317, 17864, 5841, 1802, 12428, 395, 1301, 1202] },
  { lang: "Thai", group: "South-East Asia", countries: ["Thailand"], n: [27905, 14727, 10657, 2396, 7806, 591, 1022, 1300] },
  { lang: "Khmer", group: "South-East Asia", countries: ["Cambodia"], n: [12660, 17508, 2756, 4566, 1592, 75, 205, 404] },
  { lang: "Mandarin", group: "North-East Asia", countries: ["China", "Taiwan"], n: [270725, 221819, 83620, 32112, 51735, 8096, 2521, 14373] },
  { lang: "Cantonese", group: "North-East Asia", countries: ["China", "Hong Kong"], n: [148838, 82386, 27395, 10167, 19669, 1520, 804, 4228] },
  { lang: "Korean", group: "North-East Asia", countries: ["South Korea", "North Korea"], n: [62300, 16835, 21864, 3669, 6997, 681, 329, 2818] },
  { lang: "Japanese", group: "North-East Asia", countries: ["Japan"], n: [17917, 12388, 17814, 2287, 6075, 597, 223, 1221] },
  { lang: "Hindi", group: "South Asia", countries: ["India", "Fiji"], n: [80076, 66892, 21334, 9865, 11922, 1278, 947, 4818] },
  { lang: "Punjabi", group: "South Asia", countries: ["India", "Pakistan"], n: [53472, 104970, 30882, 19964, 20597, 2561, 1582, 5005] },
  { lang: "Nepali", group: "South Asia", countries: ["Nepal", "Bhutan"], n: [68133, 21924, 12004, 9633, 5036, 7268, 3101, 5826] },
  { lang: "Urdu", group: "South Asia", countries: ["Pakistan"], n: [46631, 38053, 7677, 5058, 8428, 1472, 873, 3620] },
  { lang: "Tamil", group: "South Asia", countries: ["India", "Sri Lanka"], n: [38411, 34065, 7286, 3321, 8740, 457, 554, 2364] },
  { lang: "Bengali", group: "South Asia", countries: ["Bangladesh", "India"], n: [39600, 15085, 4535, 2837, 3854, 681, 706, 2698] },
  { lang: "Gujarati", group: "South Asia", countries: ["India"], n: [26861, 24139, 9764, 7415, 10159, 740, 452, 1748] },
  { lang: "Malayalam", group: "South Asia", countries: ["India"], n: [20810, 25406, 13039, 4769, 9703, 597, 1581, 2764] },
  { lang: "Sinhalese", group: "South Asia", countries: ["Sri Lanka"], n: [13592, 49499, 7862, 4237, 6328, 1106, 978, 2152] },
  { lang: "Greek", group: "Europe", countries: ["Greece", "Cyprus"], n: [78657, 107220, 10472, 21841, 4488, 1128, 3263, 2507] },
  { lang: "Italian", group: "Europe", countries: ["Italy", "Switzerland"], n: [64089, 92371, 17997, 23869, 25412, 944, 637, 2819] },
  { lang: "Macedonian", group: "Europe", countries: ["Macedonia"], n: [28096, 29296, 1307, 556, 5881, 15, 22, 786] },
  { lang: "Serbian", group: "Europe", countries: ["Serbia", "Montenegro", "Bosnia and Herz."], n: [22906, 17780, 5193, 4304, 5546, 163, 53, 1235] },
  { lang: "Croatian", group: "Europe", countries: ["Croatia", "Bosnia and Herz."], n: [20303, 19270, 3920, 2864, 5053, 195, 19, 2226] },
  { lang: "French", group: "Europe", countries: ["France", "Belgium", "Switzerland", "Luxembourg"], n: [23478, 18540, 12357, 2749, 9757, 819, 633, 2316] },
  { lang: "German", group: "Europe", countries: ["Germany", "Austria", "Switzerland", "Luxembourg"], n: [20194, 16462, 15262, 5444, 8893, 1453, 696, 1788] },
  { lang: "Russian", group: "Europe", countries: ["Russia", "Belarus", "Kazakhstan", "Kyrgyzstan"], n: [20030, 18203, 7757, 3569, 3862, 339, 147, 922] },
  { lang: "Polish", group: "Europe", countries: ["Poland"], n: [13399, 13656, 5493, 5117, 5735, 626, 105, 1046] },
  { lang: "Spanish", group: "Americas", countries: ["Spain", "Mexico", "Guatemala", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Cuba", "Dominican Rep.", "Puerto Rico", "Colombia", "Venezuela", "Ecuador", "Peru", "Bolivia", "Chile", "Argentina", "Uruguay", "Paraguay", "Eq. Guinea"], n: [71937, 43249, 29677, 7285, 12956, 1557, 727, 4116] },
  { lang: "Portuguese", group: "Americas", countries: ["Portugal", "Brazil", "Angola", "Mozambique", "Timor-Leste", "Guinea-Bissau", "Cabo Verde"], n: [30224, 9238, 14931, 2651, 8194, 460, 590, 916] },
  { lang: "Afrikaans", group: "Africa & Pacific", countries: ["South Africa", "Namibia"], n: [8997, 6003, 14954, 2891, 14656, 626, 350, 701] },
  { lang: "Samoan", group: "Africa & Pacific", countries: ["Samoa"], n: [17197, 13116, 16624, 210, 924, 57, 151, 525] }
];
const WL_COL = "#4b3f8f"; // one colour for this figure: the picked language
const WL_RAMP = [0, 1, 2, 3, 4].map(k => shade(WL_COL, k));
const AUS_POP = LANG_POP.reduce((a, b) => a + b, 0);
const WL_RATE = {}, WL_N = {}, WL_HOME = {}, COUNTRY_LANGS = {};
LANG_ALL.forEach(L => {
  WL_RATE[L.lang] = {}; WL_N[L.lang] = {};
  LANG_STATES.forEach((s, i) => { WL_RATE[L.lang][s] = Math.round(10000 * L.n[i] / LANG_POP[i]) / 10; WL_N[L.lang][s] = L.n[i]; });
  L.total = L.n.reduce((a, b) => a + b, 0);
  L.rate = Math.round(10000 * L.total / AUS_POP) / 10;
  WL_HOME[L.lang] = L.countries;
  L.countries.forEach(c => (COUNTRY_LANGS[c] = COUNTRY_LANGS[c] || []).push(L.lang));
});
const COUNTRY_LANGS_TXT = Object.fromEntries(Object.entries(COUNTRY_LANGS).map(([c, l]) => [c, l.join(", ")]));
const wlState = { lang: "Arabic" };

function specWorldLang(t, w) {
  const narrow = w < 600;
  const loc = { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" } };
  const on = "indexof(" + JSON.stringify(WL_HOME) + "[lg], datum.properties.name) >= 0";

  // ---- world map: the countries where the picked language is a main language ----
  const world = {
    width: w - (narrow ? 26 : 4), height: Math.round((w - (narrow ? 26 : 4)) * 0.47),
    title: { text: { expr: "'Where ' + lg + ' is a main language'" }, anchor: "start", font: t.body, fontSize: 13, fontWeight: 600, color: t.ink },
    // the whole world, centred on Greenwich, so the Americas and Samoa both fit
    projection: { type: "equalEarth", rotate: [-5, 0], fit: { type: "Feature", properties: {}, geometry: { type: "MultiPoint", coordinates: [[-174.9, 72], [184.9, 72], [-174.9, -52], [184.9, -52], [5, 72], [5, -52]] } } },
    data: { values: WORLD, format: { type: "topojson", feature: "countries" } },
    transform: [{ filter: "datum.properties.name != 'Antarctica'" },
      { calculate: on, as: "home" },
      { calculate: `${JSON.stringify(COUNTRY_LANGS_TXT)}[datum.properties.name] || 'None of the 34 languages here'`, as: "langs" }],
    mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 0.4, clip: true, cursor: "pointer" },
    encoding: {
      color: { condition: { test: "datum.home", value: WL_COL }, value: t.land },
      tooltip: [{ field: "properties.name", title: "Country" }, { field: "langs", title: "Languages in this figure" }]
    }
  };

  // ---- Australia: the picked language per 1,000 residents of each state ----
  // IDIOM: STANDARDISED CHOROPLETH - rate per 1,000 residents, five fixed classes shared with Figure 18
  const ausW = narrow ? w - 26 : Math.round((w - 40) * 0.5);
  const aus = {
    width: ausW, height: Math.round(ausW * 0.86), projection: AUS_PROJ,
    title: { text: { expr: "lg + ' at home, per 1,000 residents'" }, anchor: "start", font: t.body, fontSize: 13, fontWeight: 600, color: t.ink },
    layer: [
      { data: { values: STATES, format: { type: "topojson", feature: "states" } },
        transform: [
          { calculate: `${JSON.stringify(WL_RATE)}[lg][datum.properties.STATE_NAME]`, as: "rate" },
          { calculate: `${JSON.stringify(WL_N)}[lg][datum.properties.STATE_NAME]`, as: "n" },
          { calculate: LANG_BREAKS.map(b => `(datum.rate >= ${b} ? 1 : 0)`).join(" + "), as: "k" },
          { calculate: `${JSON.stringify(WL_RAMP)}[datum.k]`, as: "fillc" },
          { calculate: `${JSON.stringify(LANG_CLASSES)}[datum.k]`, as: "cls" },
          { calculate: "lg", as: "lang" }],
        mark: { type: "geoshape", stroke: "#ffffff", strokeWidth: 1 },
        encoding: { color: { field: "fillc", type: "nominal", scale: null },
          opacity: { condition: { test: HL("datum.properties.STATE_NAME"), value: 1 }, value: 0.25 },
          tooltip: [{ field: "properties.STATE_NAME", title: "State / territory" }, { field: "lang", title: "Language at home" },
            { field: "n", title: "Speakers, 2021", format: "," }, { field: "rate", title: "Per 1,000 residents", format: ".1f" }, { field: "cls", title: "Class" }] } },
      // the rate written on each state (ACT is too small, so it is left to the tooltip)
      { data: { values: ST_LABELS }, transform: [{ filter: "datum.abbr != 'ACT'" },
          { calculate: `${JSON.stringify(WL_RATE)}[lg][datum.name]`, as: "rate" },
          { calculate: LANG_BREAKS.map(b => `(datum.rate >= ${b} ? 1 : 0)`).join(" + "), as: "k" },
          { calculate: "datum.abbr + ' ' + format(datum.rate, '.1f')", as: "lab" }],
        mark: { type: "text", font: t.body, fontSize: narrow ? 10 : 11.5, fontWeight: 600, interactive: false },
        encoding: { ...loc, text: { field: "lab" }, color: { condition: { test: "datum.k >= 3", value: "#ffffff" }, value: t.ink } } }
    ]
  };

  // ---- ranking: all 34 languages, Australia-wide, per 1,000 residents ----
  const bars = {
    width: narrow ? w - 160 : w - ausW - 150, height: LANG_ALL.length * (narrow ? 13 : 12),
    title: { text: "All 34 languages, Australia, per 1,000 residents", anchor: "start", font: t.body, fontSize: 13, fontWeight: 600, color: t.ink },
    data: { values: LANG_ALL.map(L => ({ lang: L.lang, rate: L.rate, total: L.total, group: L.group })) },
    encoding: { y: { field: "lang", type: "nominal", sort: "-x", title: null, axis: { orient: narrow ? "right" : "left", domain: false, ticks: false, labelFont: t.body, labelFontSize: 10.5, labelPadding: 4,
        labelFontWeight: { expr: "datum.value == lg ? 700 : 400" }, labelColor: { expr: `datum.value == lg ? '${WL_COL}' : '${t.ink}'` } } },
      x: { field: "rate", type: "quantitative", title: null, axis: { grid: true, gridColor: "#e6e6e6", domain: false, ticks: false, labelFont: t.body, labelFontSize: 10, tickCount: 4 } } },
    layer: [
      { mark: { type: "bar", height: { band: 0.72 }, cursor: "pointer" },
        encoding: { color: { condition: { test: "datum.lang == lg", value: WL_COL }, value: "#c9c5dc" },
          tooltip: [{ field: "lang", title: "Language" }, { field: "group", title: "Region" }, { field: "total", title: "Speakers in Australia", format: "," }, { field: "rate", title: "Per 1,000 residents", format: ".1f" }] } },
      { mark: { type: "text", align: "left", dx: 3, font: t.body, fontSize: 10, interactive: false },
        encoding: { text: { field: "rate", format: ".1f" }, opacity: { condition: { test: "datum.lang == lg", value: 1 }, value: 0 } } }
    ]
  };

  const key = {
    width: narrow ? w - 40 : 380, height: 14,
    title: { text: narrow ? ["Speakers per 1,000 residents", "(same classes as Figure 18)"] : "Speakers per 1,000 residents (same classes as Figure 18)", anchor: "start", font: t.body, fontSize: 12, fontWeight: 600, color: t.ink },
    data: { values: LANG_CLASSES.map((c, k) => ({ c, fillc: WL_RAMP[k] })) },
    mark: { type: "rect", stroke: "#ffffff" },
    encoding: { x: { field: "c", type: "ordinal", sort: null, title: null, axis: { domain: false, ticks: false, labelFont: t.body, labelFontSize: 11, labelAngle: 0, labelPadding: 4 } },
      color: { field: "fillc", type: "nominal", scale: null } }
  };
  const left = { vconcat: [aus, key], spacing: 16 };
  return { $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: { ...config(t), view: { stroke: null } },
    params: [{ name: "lg", value: wlState.lang }, { name: "hl", value: state.hl }],
    // align none: the bar chart's long labels should not push the maps to the right
    vconcat: [world, narrow ? { vconcat: [aus, key, bars], spacing: 16, align: "none" } : { hconcat: [left, bars], spacing: 30 }], spacing: 18, align: "none" };
}

// Choose the language from the dropdown, or click a bar or a country.
function setupWorldLangControls() {
  const v = views.cW; if (!v) return;
  const sel = document.getElementById("langAll");
  const pick = (l) => { if (!l) return; wlState.lang = l; if (sel) sel.value = l; if (views.cW) views.cW.signal("lg", l).runAsync(); };
  v.addEventListener("click", (e, item) => {
    const d = item && item.datum; if (!d) return;
    if (d.lang && WL_HOME[d.lang]) return pick(d.lang);
    const name = d.properties && d.properties.name, langs = name && COUNTRY_LANGS[name];
    if (langs) pick(langs[(langs.indexOf(wlState.lang) + 1) % langs.length]); // countries with several languages cycle through them
  });
  if (sel && !sel.options.length) {
    const groups = {};
    LANG_ALL.forEach(L => (groups[L.group] = groups[L.group] || []).push(L.lang));
    Object.entries(groups).forEach(([g, ls]) => {
      const og = document.createElement("optgroup"); og.label = g;
      ls.slice().sort().forEach(l => { const o = document.createElement("option"); o.value = l; o.textContent = l; og.appendChild(o); });
      sel.appendChild(og);
    });
    sel.addEventListener("change", () => pick(sel.value));
  }
  if (sel) sel.value = wlState.lang;
}


/* ======================================================================
   FIGURE 3 | Page section 1 | IDIOM: Streamgraph
   Function: specStream()
   ====================================================================== */

// Overseas-born residents counted at the 2021 Census, by when they arrived and where they were born
// (table G10). Periods are different lengths, so each is shown as people per year of the period.
// These are the people still living here in 2021, so the early decades are undercounted
// (many of those arrivals have since died or left).
const STREAM_PERIODS = [
  // label, first year, last year (Census night was 10 August 2021, so 2021 is a part year)
  ["1951–60", 1951, 1960], ["1961–70", 1961, 1970], ["1971–80", 1971, 1980], ["1981–90", 1981, 1990], ["1991–2000", 1991, 2000],
  ["2001–10", 2001, 2010], ["2011–15", 2011, 2015], ["2016", 2016, 2016], ["2017", 2017, 2017], ["2018", 2018, 2018], ["2019", 2019, 2019],
  ["2020", 2020, 2020], ["2021 (to August)", 2021, 2021.6]
];
// counts per region for: before 1951, then each period above
const STREAM = {"UK & Ireland": [22570, 82388, 247329, 162956, 138688, 95470, 211592, 113660, 15838, 14854, 15302, 17673, 8351, 2935], "Other Europe": [23707, 129732, 145673, 52488, 46723, 30046, 34617, 25878, 3753, 3663, 3392, 4374, 1724, 424], "New Zealand & Pacific": [857, 3096, 20700, 60971, 106064, 103551, 141056, 80111, 10754, 10355, 11668, 12104, 5359, 4679], "North-East Asia": [588, 2570, 4508, 15533, 85234, 118524, 244970, 151466, 36962, 39987, 39155, 48505, 17701, 3598], "South-East Asia": [229, 1683, 9125, 60760, 166704, 126705, 206565, 148719, 36881, 35932, 37940, 44310, 17932, 3574], "South & Central Asia": [1014, 1172, 11164, 16480, 38479, 75195, 324884, 242434, 64726, 76473, 95712, 102138, 34750, 7784], "Middle East & North Africa": [802, 4687, 17237, 25308, 28224, 38697, 56767, 52287, 12653, 10754, 8591, 13698, 3972, 1218], "Americas & Africa": [188, 994, 9058, 24850, 34546, 46565, 101078, 48530, 9462, 9865, 10458, 13288, 7702, 2802], "Other countries": [13518, 37762, 82166, 113002, 131224, 146467, 224894, 146256, 44452, 42356, 45640, 55244, 21346, 6092]};
const STREAM_REGIONS = ["UK & Ireland", "Other Europe", "Middle East & North Africa", "Americas & Africa", "New Zealand & Pacific", "South-East Asia", "North-East Asia", "South & Central Asia", "Other countries"];
const STREAM_COLORS = ["#1f4e79", "#8fb1dd", "#cc79a7", "#8c6d46", "#2a9d8f", "#f0c419", "#7b5ea7", "#e69f00", "#c7c7c7"]; // no red or green, for colour-blind readers
const STREAM_ROWS = [];
STREAM_REGIONS.forEach(r => STREAM_PERIODS.forEach(([lab, a, b], i) => {
  const n = STREAM[r][i + 1], yrs = b - a + 1;
  STREAM_ROWS.push({ region: r, period: lab, mid: (a + Math.min(b, 2021)) / 2 + 0.5, n, perYear: Math.round(n / yrs) });
}));

function specStream(t, w) {
  const narrow = w < 600;
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: config(t),
    width: w - (narrow ? 36 : 190), height: narrow ? 300 : 360,
    layer: [{
    data: { values: STREAM_ROWS },
    params: [{ name: "reg", select: { type: "point", fields: ["region"], on: "pointerover", clear: "pointerout" }, bind: "legend" }],
    // IDIOM: STREAMGRAPH - stacked areas around a centre line; the thickness of each band is its share of arrivals
    mark: { type: "area", interpolate: "monotone", stroke: "#ffffff", strokeWidth: 0.4 },
    encoding: {
      x: { field: "mid", type: "quantitative", title: "Year of arrival", scale: { domain: [1950, 2022], nice: false },
        axis: { format: "d", values: [1951, 1961, 1971, 1981, 1991, 2001, 2011, 2016, 2021], grid: true, gridDash: [2, 3], domain: false, tickSize: 0, labelPadding: 6 } },
      y: { field: "perYear", type: "quantitative", stack: "center", axis: null },
      color: { field: "region", type: "nominal", title: "Born in", scale: { domain: STREAM_REGIONS, range: STREAM_COLORS }, sort: STREAM_REGIONS,
        legend: { orient: narrow ? "bottom" : "right", columns: narrow ? 2 : 1, symbolType: "square", symbolSize: narrow ? 90 : 120, labelLimit: narrow ? 128 : 180, labelFontSize: narrow ? 10.5 : 12, columnPadding: 8 } },
      order: { field: "region", sort: "ascending" },
      opacity: { condition: { param: "reg", value: 0.95 }, value: 0.18 },
      tooltip: [{ field: "region", title: "Born in" }, { field: "period", title: "Arrived" }, { field: "n", title: "Still living in Australia, 2021", format: "," },
        { field: "perYear", title: "Per year of the period", format: "," }]
    }
    },
    // ANNOTATIONS - what each era's arrivals were mostly made of (in the empty space above the stream)
    { data: { values: [
        { x: 1951.5, y: 8, al: "left", t: narrow ? "1950s–60s: Europe" : "1950s–60s: mostly from Europe" },
        { x: 1981.5, y: 8, al: "left", t: narrow ? "1980s: SE Asia" : "1980s: South-East Asia leads" },
        { x: 2000.5, y: 26, al: "right", t: narrow ? "From 2001: South Asia →" : "From 2001: South & Central Asia leads →" }] },
      mark: { type: "text", baseline: "middle", fontSize: narrow ? 10 : 11.5, fontStyle: "italic", color: t.accent2, align: { expr: "datum.al" }, interactive: false },
      encoding: { x: { field: "x", type: "quantitative" }, y: { field: "y", type: "quantitative", scale: null }, text: { field: "t" } } }
    ]
  };
}

/* ======================================================================
   FIGURE 8 | Page section 3.4 | IDIOM: Bump chart
   Function: specBump()
   ====================================================================== */

// Rank of the largest overseas birthplaces, estimated resident population at 30 June, 1996–2025.
const BUMP_YEARS = [1996, 2001, 2006, 2011, 2016, 2021, 2025];
const BUMP = {
  "England": [956680, 927630, 939260, 991040, 1002060, 973950, 970950], "New Zealand": [312240, 389600, 437890, 543950, 568170, 584010, 637680],
  "Italy": [250360, 229850, 218040, 201680, 195760, 167570, 152560], "Vietnam": [158740, 163490, 178010, 207620, 243220, 274840, 326630],
  "Scotland": [150110, 141850, 136630, 141220, 137760, 127340, 125690], "Greece": [138080, 128700, 128980, 121180, 113420, 99950, 86980],
  "Germany": [121910, 118340, 124710, 125750, 116700, 107060, 101400], "China": [118640, 153360, 251960, 387420, 557690, 584660, 731540],
  "Philippines": [104820, 114260, 141890, 193030, 252690, 308240, 412530], "Netherlands": [96370, 91900, 91850, 87660, 78670, 70140, 63850],
  "Malaysia": [82530, 86400, 105710, 134140, 152900, 173990, 184320], "India": [80470, 98070, 169720, 337120, 489410, 712040, 971020],
  "South Africa": [61810, 86820, 119490, 161590, 180480, 202730, 229950], "Sri Lanka": [53880, 60640, 73820, 99740, 124500, 140110, 184800],
  "Nepal": [1410, 2440, 4350, 27810, 58980, 130290, 213580], "Pakistan": [8710, 12290, 18320, 34150, 69660, 96170, 143920]
};
const BUMP_KEY = { India: "#e07b1a", China: "#7b5ea7", England: "#1f4e79", "New Zealand": "#2a9d8f", Italy: "#8c6d46", Philippines: "#cc79a7", Nepal: "#c49a00" }; // no red or green
const BUMP_ROWS = [];
BUMP_YEARS.forEach((y, i) => {
  Object.entries(BUMP).sort((a, b) => b[1][i] - a[1][i]).forEach(([c, v], r) => {
    if (r < 12) BUMP_ROWS.push({ country: c, year: y, rank: r + 1, n: v[i] });
  });
});

function specBump(t, w) {
  const narrow = w < 600;
  const sideL = narrow ? 70 : 100, sideR = narrow ? 70 : 100;
  const rows = BUMP_ROWS.map(d => ({ ...d, key: BUMP_KEY[d.country] ? d.country : "Other" })).sort((a, b) => (a.key === "Other" ? 0 : 1) - (b.key === "Other" ? 0 : 1)); // grey lines first, so the coloured ones sit on top
  const ends = (yr, side) => rows.filter(d => d.year === yr).map(d => ({ ...d, side }));
  const x = { field: "year", type: "ordinal", title: null, axis: { orient: "top", domain: false, ticks: false, labelAngle: 0, labelExpr: narrow ? "'’' + substring(datum.label, 2)" : "datum.label", labelFontWeight: 600, labelFontSize: 12, labelPadding: 8, labelColor: t.ink } };
  const y = { field: "rank", type: "quantitative", title: null, scale: { domain: [0.5, 12.5], reverse: true, nice: false, zero: false }, axis: null };
  const colour = { field: "key", type: "nominal", scale: { domain: [...Object.keys(BUMP_KEY), "Other"], range: [...Object.values(BUMP_KEY), "#b9b9b9"] }, legend: null };
  const on = { condition: [{ param: "bc", empty: true, value: 1 }], value: 0.15 };
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: config(t),
    width: w - sideL - sideR - (narrow ? 12 : 8), height: narrow ? 380 : 430,
    encoding: { x, y },
    layer: [
      // shading for ranks 11 and 12: just outside the top ten
      { data: { values: [{ a: 10.5, b: 12.5 }] }, mark: { type: "rect", fill: t.rule, opacity: 0.35 },
        encoding: { x: null, y: { field: "a", type: "quantitative", scale: y.scale }, y2: { field: "b" } } },
      // IDIOM: BUMP CHART - one line per country, its height is its rank in each year
      { data: { values: rows }, mark: { type: "line", strokeWidth: 3, interpolate: "monotone", strokeCap: "round", cursor: "pointer" },
        encoding: { detail: { field: "country" }, color: colour, opacity: on } },
      { data: { values: rows }, params: [{ name: "bc", select: { type: "point", fields: ["country"], on: "pointerover", clear: "pointerout" } }],
        mark: { type: "circle", size: narrow ? 70 : 110, stroke: "#ffffff", strokeWidth: 1.5, opacity: 1, cursor: "pointer" },
        encoding: { color: colour, opacity: on,
          tooltip: [{ field: "country", title: "Born in" }, { field: "year", title: "Year" }, { field: "rank", title: "Rank" }, { field: "n", title: "Residents", format: "," }] } },
      // ANNOTATION - the headline change, written between the England and New Zealand lines
      { data: { values: [{ year: 2001, rank: 1.5, t: narrow ? "India: 12th → 1st" : "India rises from 12th to 1st, passing England in 2025" }] },
        mark: { type: "text", align: "left", baseline: "middle", fontSize: narrow ? 10 : 11.5, fontStyle: "italic", color: t.accent2, dx: -4, interactive: false },
        encoding: { text: { field: "t" } } },
      // country names at both ends
      { data: { values: [...ends(1996, "L"), ...ends(2025, "R")].map(d => ({ ...d, lc: BUMP_KEY[d.country] || t.muted })) },
        mark: { type: "text", fontSize: narrow ? 10 : 11.5, baseline: "middle", align: { expr: "datum.side == 'L' ? 'right' : 'left'" }, dx: { expr: "datum.side == 'L' ? -10 : 10" },
          fontWeight: { expr: "datum.key != 'Other' ? 700 : 400" } },
        encoding: { text: { field: "country" }, color: { field: "lc", type: "nominal", scale: null }, opacity: on } }
    ]
  };
}

/* ======================================================================
   FIGURE 10 | Page section 4.1 | IDIOM: Hexagon tile map (equal-area cartogram)
   Function: specHex()
   ====================================================================== */

// Each of the 88 SA4 regions gets one hexagon of the same size, roughly in its real position
// (laid out once in advance by matching region centres to grid cells). Same seven classes as Figure 9.
const HEX_POS = "101:10:8 102:9:4 103:6:4 104:8:3 105:5:4 106:7:3 107:9:7 108:10:4 109:5:5 110:6:3 111:11:5 112:11:4 113:7:6 114:8:7 115:7:4 116:8:4 117:11:7 118:11:6 119:10:7 120:10:6 121:9:5 122:10:5 123:8:6 124:6:5 125:7:5 126:8:5 127:9:6 128:11:8 201:3:7 202:5:6 203:3:9 204:7:7 205:8:8 206:5:8 207:6:8 208:5:9 209:5:7 210:4:7 211:6:7 212:7:8 213:4:8 214:4:9 215:4:6 216:6:6 217:3:8 301:11:1 302:10:1 303:11:2 304:9:2 305:10:2 306:8:0 307:7:2 308:8:1 309:11:3 310:9:3 311:10:3 312:7:1 313:10:0 314:9:1 315:6:2 316:11:0 317:8:2 318:6:1 319:9:0 401:4:5 402:3:5 403:3:6 404:2:6 405:2:5 406:4:4 407:2:7 501:1:6 502:0:6 503:0:4 504:1:4 505:0:3 506:1:5 507:0:5 509:2:4 510:1:2 511:1:3 601:8:10 602:9:10 603:7:10 604:6:10 701:3:0 702:2:1 801:9:8";
const HEX_PATH = "M0,-1L0.866,-0.5L0.866,0.5L0,1L-0.866,0.5L-0.866,-0.5Z";

function specHex(t, w) {
  const narrow = w < 600;
  const props = Object.fromEntries(SA4.objects.sa4.geometries.map(g => [g.properties.code, g.properties]));
  const cells = HEX_POS.split(" ").map(s => { const [code, c, r] = s.split(":"); const p = props[code] || {};
    return { code, name: p.name, state: p.state, gcc: p.gcc, s21: p.s21, os21: p.os21, pop21: p.pop21, hx: +c + (+r % 2 ? 0.5 : 0), hy: +r * 0.866 }; });
  const ROWS = 10; // rows 0-10 (Tasmania sits one row below the mainland)
  const W = w - (narrow ? 30 : 8), unit = W / 12.6, H = Math.round(unit * (ROWS * 0.866 + 1.3));
  const size = Math.pow(2 * unit / Math.sqrt(3) * 0.96, 2);
  const xs = { domain: [-0.65, 11.95], nice: false, zero: false }, ys = { domain: [-0.65, ROWS * 0.866 + 0.65], nice: false, zero: false };
  // state outlines: draw a hexagon edge wherever the neighbour on that side is in another state (or the sea)
  const at = {}; cells.forEach(c => { const [, col, row] = HEX_POS.split(" ").find(p => p.startsWith(c.code + ":")).split(":").map(Number); c.col = col; c.row = row; at[col + "," + row] = c; });
  const r = 1 / Math.sqrt(3), V = { T: [0, -r], UR: [0.5, -r / 2], LR: [0.5, r / 2], B: [0, r], LL: [-0.5, r / 2], UL: [-0.5, -r / 2] };
  const edges = [];
  cells.forEach(c => {
    const odd = c.row % 2 === 1;
    [["E", 1, 0, "UR", "LR"], ["W", -1, 0, "LL", "UL"], ["NE", odd ? 1 : 0, -1, "T", "UR"], ["NW", odd ? 0 : -1, -1, "UL", "T"],
     ["SE", odd ? 1 : 0, 1, "LR", "B"], ["SW", odd ? 0 : -1, 1, "B", "LL"]].forEach(([, dc, dr, a, b]) => {
      const n = at[(c.col + dc) + "," + (c.row + dr)];
      if (!n || n.state !== c.state) edges.push({ state: c.state, x: c.hx + V[a][0], y: c.hy + V[a][1], x2: c.hx + V[b][0], y2: c.hy + V[b][1] });
    });
  });
  // state names, placed in empty cells next to each state
  const labs = [["WA", 0, 2], ["NT", 3.3, 0.7], ["Qld", 6.6, 0], ["SA", 3, 4], ["NSW", 10.6, 9], ["Vic", 2.1, 8.6], ["Tas", 5.1, 10], ["ACT", 9, 8.78]]
    .map(([s, c, rw]) => ({ s, hx: c, hy: rw * 0.866 }));
  const pos = { x: { field: "hx", type: "quantitative", scale: xs, axis: null }, y: { field: "hy", type: "quantitative", scale: { ...ys, reverse: true }, axis: null } };
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: config(t),
    width: W, height: H, params: [{ name: "hl", value: state.hl }],
    layer: [
      // IDIOM: HEXAGON TILE MAP - every region the same size, coloured by % born overseas (Figure 9's classes)
      { data: { values: cells }, transform: [{ calculate: "datum.s21", as: "pct" }, SA4_CLASS("datum.pct"), { calculate: "datum.state", as: "hstate" }],
        mark: { type: "point", shape: HEX_PATH, filled: true, size, stroke: "#ffffff", strokeWidth: 1.5, cursor: "pointer" },
        encoding: { ...pos, color: sa4Color({ cols: narrow ? 3 : 7 }),
          opacity: { condition: { test: HL("datum.state"), value: 1 }, value: 0.2 },
          tooltip: [{ field: "name", title: "Region (SA4)" }, { field: "state", title: "State" }, { field: "s21", title: "Born overseas, 2021 (%)", format: ".1f" },
            { field: "os21", title: "Residents born overseas", format: "," }, { field: "pop21", title: "All residents", format: "," }] } },
      // the share written in each hexagon
      { data: { values: cells }, transform: [{ calculate: "datum.s21 >= 30 ? 'w' : 'k'", as: "tc" }],
        mark: { type: "text", font: t.body, fontSize: narrow ? 8.5 : 11, fontWeight: 500, baseline: "middle", interactive: false },
        encoding: { ...pos, text: { field: "s21", format: ".0f" }, color: { condition: { test: "datum.tc == 'w'", value: "#ffffff" }, value: t.ink },
          opacity: { condition: { test: HL("datum.state"), value: 1 }, value: 0.25 } } },
      { data: { values: edges }, mark: { type: "rule", color: t.ink, strokeWidth: narrow ? 1.4 : 2, strokeCap: "round", interactive: false },
        encoding: { x: { field: "x", type: "quantitative", scale: xs, axis: null }, y: { field: "y", type: "quantitative", scale: { ...ys, reverse: true }, axis: null }, x2: { field: "x2" }, y2: { field: "y2" } } },
      { data: { values: labs }, mark: { type: "text", font: t.body, fontSize: narrow ? 10.5 : 13, fontWeight: 700, color: t.ink, interactive: false },
        encoding: { ...pos, text: { field: "s" } } }
    ]
  };
}

/* ======================================================================
   FIGURE 20 | Page section 5 | IDIOM: Population pyramid
   Function: specPyramid()
   ====================================================================== */

// Age and sex of overseas-born and Australian-born residents, estimated resident population at 30 June.
// Bars show each age group as a % of that group's total, so the two shapes can be compared directly.
const PYR_AGES = ["0–4", "5–9", "10–14", "15–19", "20–24", "25–29", "30–34", "35–39", "40–44", "45–49", "50–54", "55–59", "60–64", "65–69", "70–74", "75+"];
const PYR = {
  // per age group: overseas-born males, Australian-born males, overseas-born females, Australian-born females
  1996: [[17210, 645560, 16170, 612570], [41350, 625040, 39540, 594540], [67710, 599650, 64030, 571230], [93150, 558390, 87130, 533020], [120320, 584470, 119640, 564330], [146950, 559380, 152170, 551280], [193630, 524230, 198570, 522340], [206260, 517510, 211720, 514700], [204740, 468710, 209080, 467160], [232180, 419450, 221220, 415940], [188400, 326580, 167660, 327310], [162170, 255630, 143220, 262320], [135430, 216660, 122400, 232510], [118670, 217120, 107990, 245010], [95220, 179530, 99740, 225670], [108040, 236010, 148350, 410890]],
  2025: [[28950, 749990, 27190, 711310], [74970, 749470, 71620, 707790], [114620, 750570, 108030, 709350], [156920, 720130, 148120, 679190], [317880, 625540, 284450, 587000], [414620, 614500, 413810, 582660], [416300, 611650, 440480, 596700], [427620, 573440, 457990, 559760], [413760, 536380, 426540, 536200], [321270, 491790, 335200, 502810], [277330, 553100, 295250, 561220], [260370, 501320, 279550, 512810], [262410, 485990, 283770, 504470], [226520, 439880, 255210, 466510], [195990, 371080, 221490, 404160], [409750, 614200, 466330, 768400]]
};
const PYR_ROWS = [];
for (const yr of [1996, 2025]) {
  const tot = [0, 1].map(g => PYR[yr].reduce((a, r) => a + r[g] + r[g + 2], 0)); // overseas, Australian
  PYR[yr].forEach((r, i) => {
    [["Overseas-born", 0], ["Australian-born", 1]].forEach(([grp, g]) => {
      [["Male", r[g]], ["Female", r[g + 2]]].forEach(([sex, n]) => {
        const p = Math.round(10000 * n / tot[g]) / 100;
        PYR_ROWS.push({ year: yr, age: PYR_AGES[i], ai: i, grp, sex, n, pct: p, x: sex === "Male" ? -p : p });
      });
    });
  });
}

function specPyramid(t, w) {
  const narrow = w < 600;
  const xMax = 7;
  const x = { field: "x", type: "quantitative", title: "% of the group (men left, women right)", scale: { domain: [-xMax, xMax], nice: false },
    axis: { labelExpr: "abs(datum.value) + '%'", values: [-6, -4, -2, 0, 2, 4, 6], grid: true, gridDash: [2, 3] } };
  const y = { field: "age", type: "ordinal", sort: PYR_AGES.slice().reverse(), title: null, axis: { domain: false, ticks: false, labelPadding: 6 } };
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: config(t),
    width: w - (narrow ? 70 : 90), height: narrow ? 360 : 420,
    params: [{ name: "pyrYear", value: 2025, bind: { input: "radio", options: [1996, 2025], name: "Year " } }],
    data: { values: PYR_ROWS }, transform: [{ filter: "datum.year == pyrYear" }],
    encoding: { y },
    layer: [
      // IDIOM: POPULATION PYRAMID - overseas-born as filled bars, Australian-born as an outline over them
      { transform: [{ filter: "datum.grp == 'Overseas-born'" }],
        mark: { type: "bar", height: { band: 0.86 } },
        encoding: { x, color: { field: "sex", type: "nominal", scale: { domain: ["Male", "Female"], range: ["#5b8db8", "#d9845f"] },
            legend: { title: "Overseas-born", orient: "top", direction: "horizontal", symbolType: "square", labelExpr: "datum.label == 'Male' ? 'Men' : 'Women'" } },
          tooltip: [{ field: "grp", title: "Group" }, { field: "sex", title: "Sex" }, { field: "age", title: "Age" }, { field: "n", title: "People", format: "," }, { field: "pct", title: "% of the group", format: ".2f" }] } },
      { transform: [{ filter: "datum.grp == 'Australian-born'" }],
        mark: { type: "bar", height: { band: 0.86 }, filled: false, stroke: t.ink, strokeWidth: 1.4, strokeDash: [3, 2] },
        encoding: { x, tooltip: [{ field: "grp", title: "Group" }, { field: "sex", title: "Sex" }, { field: "age", title: "Age" }, { field: "n", title: "People", format: "," }, { field: "pct", title: "% of the group", format: ".2f" }] } },
      { data: { values: [{ x: 0 }] }, mark: { type: "rule", color: t.ink, strokeWidth: 1 }, encoding: { x: { field: "x", type: "quantitative" }, y: null } },
      // ANNOTATIONS - the two shares the text talks about, for the year shown
      { data: { values: [
          { year: 1996, age: "5–9", t: ["Aged 25–44:", "35.9% of overseas-born", "29.5% of Australian-born"] },
          { year: 2025, age: "5–9", t: ["Aged 25–44:", "38.6% of overseas-born", "24.6% of Australian-born"] },
          { year: 1996, age: "70–74", t: ["Aged 65 and over:", "16.0% of overseas-born", "10.8% of Australian-born"] },
          { year: 2025, age: "70–74", t: ["Aged 65 and over:", "20.1% of overseas-born", "16.3% of Australian-born"] }] },
        transform: [{ filter: narrow ? "false" : "datum.year == pyrYear" }],
        mark: { type: "text", align: "left", baseline: "middle", fontSize: narrow ? 9.5 : 11, lineHeight: narrow ? 12 : 14, color: t.accent2, fontStyle: "italic", interactive: false },
        encoding: { x: { datum: -xMax * 0.97, type: "quantitative" }, y: { field: "age", type: "ordinal", sort: PYR_AGES.slice().reverse() }, text: { field: "t" } } },
      // a key for the dashed outline, next to the colour legend
      { data: { values: [{ x: xMax * 0.98, txt: "- - -  Australian-born (outline)" }] },
        mark: { type: "text", align: "right", baseline: "bottom", fontSize: 11.5, color: t.ink, dy: -8 },
        encoding: { x: { field: "x", type: "quantitative" }, y: { value: 0 }, text: { field: "txt" } } }
    ]
  };
}


/* ======================================================================
   FIGURE 1 | Introduction | IDIOM: Waffle chart
   Function: specWaffle()
   ====================================================================== */

// Australia's population at 30 June 2025 as 100 squares: one square = 1% of residents.
// Grey squares were born in Australia; coloured squares were born overseas, by region of birth.
const WAFFLE = [
  // region, residents at 30 June 2025 (preliminary)
  ["South & Central Asia", 1746360], ["North-West Europe", 1548800], ["South-East Asia", 1365980], ["North-East Asia", 1129440],
  ["Oceania (excl. Australia)", 866840], ["Southern & Eastern Europe", 666600], ["Middle East & North Africa", 559890],
  ["Sub-Saharan Africa", 480090], ["Americas", 469830], ["Australia", 18779950]
];
const WAFFLE_COLORS = ["#e69f00", "#1f4e79", "#f0c419", "#7b5ea7", "#2a9d8f", "#8fb1dd", "#cc79a7", "#8c6d46", "#5d6d7e", "#d6ccb8"]; // no red or green, for colour-blind readers
function waffleCells() {
  const tot = WAFFLE.reduce((a, d) => a + d[1], 0);
  // largest-remainder rounding, so the squares add up to exactly 100
  const raw = WAFFLE.map(([r, n]) => ({ r, n, x: 100 * n / tot }));
  raw.forEach(d => { d.k = Math.floor(d.x); });
  let left = 100 - raw.reduce((a, d) => a + d.k, 0);
  raw.slice().sort((a, b) => (b.x - b.k) - (a.x - a.k)).forEach(d => { if (left > 0) { d.k++; left--; } });
  const cells = [];
  raw.forEach(d => { for (let j = 0; j < d.k; j++) cells.push({ region: d.r, n: d.n, pct: Math.round(10 * d.x) / 10, label: d.r === "Australia" ? "Born in Australia" : "Born in " + d.r }); });
  return { cells: cells.map((c, i) => ({ ...c, i, col: i % 10, row: Math.floor(i / 10) })), raw };
}

function specWaffle(t, w) {
  const narrow = w < 600;
  const { cells, raw } = waffleCells();
  const side = narrow ? Math.min(w - 20, 300) : 300, cell = side / 10;
  const pos = { x: { field: "col", type: "ordinal", axis: null, scale: { paddingInner: 0.14, paddingOuter: 0 } },
    y: { field: "row", type: "ordinal", axis: null, scale: { paddingInner: 0.14, paddingOuter: 0 } } };
  const colour = { field: "region", type: "nominal", scale: { domain: WAFFLE.map(d => d[0]), range: WAFFLE_COLORS },
    legend: { title: null, orient: narrow ? "bottom" : "right", columns: 1, symbolType: "square", symbolSize: 150, labelFontSize: narrow ? 11 : 12.5, labelLimit: 220, rowPadding: 6,
      labelExpr: JSON.stringify(Object.fromEntries(raw.map(d => [d.r, (d.r === "Australia" ? "Born in Australia" : d.r) + "  " + d.k]))) + "[datum.label]" } };
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: config(t),
    width: side, height: side, data: { values: cells },
    params: [{ name: "wr", select: { type: "point", fields: ["region"], on: "pointerover", clear: "pointerout" }, bind: "legend" }],
    // IDIOM: WAFFLE CHART - 100 squares, each one per cent of the population
    mark: { type: "rect", cornerRadius: 1.5, cursor: "pointer" },
    encoding: { ...pos, color: colour, opacity: { condition: { param: "wr", value: 1 }, value: 0.25 },
      tooltip: [{ field: "label", title: "Group" }, { field: "pct", title: "% of all residents", format: ".1f" }, { field: "n", title: "Residents, 30 June 2025", format: "," }] }
  };
}

/* ======================================================================
   FIGURE 11 | Page section 4.1 | IDIOM: Beeswarm plot
   Function: specSwarm()
   ====================================================================== */

// The 88 SA4 regions as dots on one % axis, one row per state, filled dots inside the capital city.
// Positions are worked out here (dots are nudged up or down until they no longer overlap).
function swarmLayout(w, narrow) {
  const ORDER = ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Australian Capital Territory", "Tasmania", "Northern Territory"];
  const left = narrow ? 44 : 60, right = 14, r = narrow ? 4.2 : 6, gap = 1.5;
  const plotW = w - left - right, rowH = narrow ? 50 : 62;
  const x = (v) => left + (v / 60) * plotW;
  const pts = [];
  ORDER.forEach((st, row) => {
    const cy = rowH * row + rowH / 2;
    const ds = SA4.objects.sa4.geometries.map(g => g.properties).filter(p => p.state === st).sort((a, b) => a.s21 - b.s21);
    const placed = [];
    ds.forEach(p => {
      const px = x(p.s21);
      // try offsets 0, +d, -d, +2d ... until the dot clears every dot already placed
      for (let k = 0; k < 40; k++) {
        const off = (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (r * 0.9);
        const py = cy + off;
        if (placed.every(q => (q.px - px) ** 2 + (q.py - py) ** 2 >= (2 * r + gap) ** 2)) { placed.push({ px, py }); pts.push({ ...p, px, py, abbr: ABBR_OF[st], row }); break; }
      }
    });
  });
  return { pts, H: rowH * ORDER.length, rows: ORDER.map((s, i) => ({ s: ABBR_OF[s], name: s, y: rowH * i + rowH / 2, y0: rowH * i, y1: rowH * (i + 1), i })), x, left, plotW, r };
}

function specSwarm(t, w) {
  const narrow = w < 600;
  const W = w - (narrow ? 12 : 8);
  const L = swarmLayout(W, narrow);
  const px = (f) => ({ field: f, type: "quantitative", scale: { domain: [0, W], range: [0, W], nice: false, zero: false }, axis: null });
  const py = (f) => ({ field: f, type: "quantitative", scale: { domain: [0, L.H + 24], range: [0, L.H + 24], nice: false, zero: false }, axis: null });
  const ticks = [0, 10, 20, 30, 40, 50, 60].map(v => ({ v, x: L.x(v), lab: v + "%" }));
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: config(t),
    width: W, height: L.H + 24, params: [{ name: "hl", value: state.hl }],
    layer: [
      // alternate row shading and the % grid
      { data: { values: L.rows.filter(r => r.i % 2 === 0) }, mark: { type: "rect", fill: t.band, opacity: 1 },
        encoding: { x: { datum: 0, type: "quantitative", scale: px("x").scale, axis: null }, x2: { datum: W }, y: py("y0"), y2: { field: "y1" } } },
      { data: { values: ticks }, mark: { type: "rule", color: t.rule, strokeDash: [2, 3] }, encoding: { x: px("x"), y: { datum: 0, type: "quantitative", scale: py("y").scale, axis: null }, y2: { datum: L.H } } },
      { data: { values: ticks }, mark: { type: "text", baseline: "top", dy: 6, fontSize: 11, color: t.muted }, encoding: { x: px("x"), y: { datum: L.H, type: "quantitative", scale: py("y").scale, axis: null }, text: { field: "lab" } } },
      { data: { values: L.rows }, mark: { type: "text", align: "left", baseline: "middle", fontSize: narrow ? 11 : 12.5, fontWeight: 700, color: t.ink },
        encoding: { x: { datum: 2, type: "quantitative", scale: px("x").scale, axis: null }, y: py("y"), text: { field: "s" } } },
      // IDIOM: BEESWARM - one dot per SA4 region at its % born overseas; filled = in the capital city
      { data: { values: L.pts }, transform: [{ calculate: "indexof(datum.gcc, 'Rest of') == 0 ? 'Rest of the state' : 'In the capital city'", as: "where" }],
        mark: { type: "circle", size: Math.PI * L.r * L.r, strokeWidth: 1.2, cursor: "pointer" },
        encoding: { x: px("px"), y: py("py"),
          color: { field: "where", type: "nominal", scale: { domain: ["In the capital city", "Rest of the state"], range: ["#225ea8", "#ffffff"] },
            legend: { title: null, orient: "top", direction: "horizontal", symbolStrokeColor: "#225ea8", symbolStrokeWidth: 1.4, symbolSize: 120, labelFontSize: 12 } },
          stroke: { value: "#225ea8" }, fillOpacity: { value: 1 },
          opacity: { condition: { test: HL("datum.state"), value: 1 }, value: 0.2 },
          tooltip: [{ field: "name", title: "Region (SA4)" }, { field: "state", title: "State" }, { field: "where", title: "Area" }, { field: "s21", title: "Born overseas, 2021 (%)", format: ".1f" }, { field: "pop21", title: "All residents", format: "," }] } }
    ]
  };
}


/* ======================================================================
   PART 5. DRAW THE PAGE AND WIRE UP THE CONTROLS
   render(), state dropdown, Play button, fonts, resize
   ====================================================================== */
/* ---------- render: draw everything ---------- */
// views keeps each drawn chart so the dropdown, sliders and Play button can talk to it.
// STATE_VIEWS are the maps where clicking a state highlights it (in that map only).
state.day = 250;
const views = {};
let lastW = 0;
const opts = { actions: false, renderer: "svg", tooltip: { theme: "custom" } };
const STATE_VIEWS = ["c3", "cH", "cX", "cB", "cD", "cC", "cP"];
const ABBR2NAME = Object.fromEntries(ST.map(r => [r[1], r[0]]));
function stateNameOf(item) {
  const d = item && item.datum;
  if (!d) return null;
  if (d.properties && d.properties.STATE_NAME) return d.properties.STATE_NAME;
  if (d.properties && d.properties.state && d.properties.code) return d.properties.state;
  if (d.name && ABBR2NAME[d.abbr || d.ab] === d.name) return d.name;
  if (typeof d.name === "string" && ST.some(r => r[0] === d.name)) return d.name;
  return null;
}
// Clicking a state highlights it in THAT chart only; every chart keeps its own highlight,
// so one chart never dims the colours of another.
const localHL = {};
function setHighlight(id, name) {
  localHL[id] = name || "";
  if (views[id]) views[id].signal("hl", localHL[id]).runAsync();
}
// Each chart is drawn only when it comes near the screen, so the page opens quickly.
// CHARTS says how to build each one; AFTER wires up anything extra once it is drawn.
const CHARTS = {
  cA: specWaffle, c1: spec1, cR: specStream, cV: specVoyage,
  c2: (t, w) => spec2(t, state.yrWorld, w), cF: specFlow, cS: specSpike, cU: specBump,
  c3: (t, w) => spec3(t, state.yrState, w), cH: specHex, cX: specSwarm, cZ: specZoom, cB: specBiv,
  cD: specDots, cC: specDorling, cP: specPies, cT: specTop, cL: specLang, cW: specWorldLang, cY: specPyramid
};
const AFTER = {
  c2: (v) => v.addSignalListener("yr", (n, x) => { state.yrWorld = x; }),
  c3: (v) => v.addSignalListener("yr", (n, x) => { state.yrState = x; }),
  cV: (v) => { v.addSignalListener("day", (n, x) => { state.day = x; }); setupWaited(); },
  cZ: () => setupZoomControls(), cL: () => setupLangControls(), cW: () => setupWorldLangControls()
};
const drawn = new Set();
let drawQueue = Promise.resolve(), watcher = null;
const cw = (id) => { const el = document.getElementById(id); const cs = getComputedStyle(el); return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); };
function draw(id) { drawQueue = drawQueue.then(() => drawNow(id)); return drawQueue; }
async function drawNow(id) {
  const el = document.getElementById(id); if (!el || !CHARTS[id]) return;
  try {
    if (views[id]) views[id].finalize();
    const v = views[id] = (await vegaEmbed("#" + id, CHARTS[id](T(), cw(id)), opts)).view;
    drawn.add(id);
    if (AFTER[id]) AFTER[id](v);
    if (localHL[id]) v.signal("hl", localHL[id]).runAsync(); // keep this chart's own highlight after a redraw
    // clicking a state highlights it in this chart only (other charts are left alone)
    if (STATE_VIEWS.includes(id)) {
      v.addEventListener("click", (ev, item) => {
        const name = stateNameOf(item);
        if (name) setHighlight(id, localHL[id] === name ? "" : name);
        else if (!item || !item.datum || item.mark?.marktype === "group") setHighlight(id, "");
      });
    }
  } catch (e) { console.error(id, e); }
}
function render() {
  lastW = cw("c1");
  drawn.forEach(id => draw(id)); // after a resize, redraw the ones already on screen
  if (watcher) return;
  if (!("IntersectionObserver" in window)) { Object.keys(CHARTS).forEach(draw); return; }
  watcher = new IntersectionObserver((entries) => entries.forEach(e => {
    if (!e.isIntersecting) return;
    watcher.unobserve(e.target); draw(e.target.id);
  }), { rootMargin: "900px 0px" });
  Object.keys(CHARTS).forEach(id => { const el = document.getElementById(id); if (el) watcher.observe(el); });
}
// Contents bar: underline the section currently on screen
(() => {
  const links = [...document.querySelectorAll("#toc a")];
  const targets = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const mark = () => {
    let cur = targets[0];
    for (const tg of targets) if (tg.getBoundingClientRect().top < 120) cur = tg;
    links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + cur.id));
  };
  addEventListener("scroll", () => requestAnimationFrame(mark), { passive: true }); mark();
})();
// Play button for Figure 4: moves `day` forward 25 days a second until it reaches 250.
(() => {
  const btn = document.getElementById("playFleet");
  if (!btn) return;
  let raf = 0, playing = false;
  const stop = () => { playing = false; cancelAnimationFrame(raf); btn.textContent = "Play voyage"; btn.setAttribute("aria-pressed", "false"); };
  btn.addEventListener("click", () => {
    if (playing) return stop();
    const v = views.cV; if (!v) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { v.signal("day", 250).runAsync(); return; }
    playing = true; btn.textContent = "Pause"; btn.setAttribute("aria-pressed", "true");
    let startDay = state.day >= 250 ? 0 : state.day, t0 = performance.now();
    const step = (now) => {
      if (!playing) return;
      const d = Math.min(250, Math.floor(startDay + (now - t0) / 1000 * 25));
      if (d !== state.day) v.signal("day", d).runAsync();
      if (d >= 250) return stop();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  });
})();
tables();
// Wait for the fonts before drawing, so label sizes are measured with the right font.
const FONT_LOADS = ["400 12px IBM Plex Sans", "500 12px IBM Plex Sans", "600 12px IBM Plex Sans", "700 12px IBM Plex Sans", "500 12px IBM Plex Sans Condensed", "italic 500 12px IBM Plex Sans Condensed", "600 12px IBM Plex Sans Condensed"];
Promise.race([Promise.all(FONT_LOADS.map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 1500))]).catch(() => {}).then(render);
// Redraw when the window width changes a lot (charts are sized to their box).
let rt;
const rerender = () => { clearTimeout(rt); rt = setTimeout(render, 120); };
addEventListener("resize", () => { const el = document.getElementById("c1"); if (Math.abs(el.clientWidth - lastW) > 40) rerender(); });

/* ======================================================================
   PART 6. ANIMATED BACKGROUND
   "Waves" flow shader (21st.dev Shader Builder), plain WebGL1, no libraries.
   A fullscreen triangle is drawn into the fixed #bg canvas behind the page.
   Colours ("Leather") run dark tan -> saddle brown -> tan -> light tan, so the paper always stands out. Pauses when the tab is hidden;
   with "reduce motion" switched on it draws one still frame.
   ====================================================================== */
const WAVES_FRAG = `// "Waves" — made with the 21st.dev Shader Builder
// Packed WebGL1 uniforms (the shader exposes readable u_* aliases as macros):
//   u_colors[8] (first 4 used)
//   vec3(0.137, 0.102, 0.063)
//   vec3(0.643, 0.443, 0.282)
//   vec3(0.890, 0.710, 0.529)
//   vec3(0.976, 0.945, 0.906)
//   u_scene = vec4(canvas width, canvas height, seconds * 1.35, 4.0)
//   u_shape = vec4(1.84, 0.60, 0.25, 0.04)
//   u_surface = vec4(3.33, 1.07, 0.00, 1.00)
//   u_finish = vec4(0.00, 0.25, 0.002, 0.02)
//   u_transform = vec4(4476.0, 0.38, 0.01, 0.0)
//   u_space = vec4(0.17, -0.25, pointer x, pointer y)
//   u_cursor = vec4(presence, 2.0, 0.65, 0.46)

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
// Seven packed vectors + eight colour vectors = 15 fragment uniform vectors,
// one below WebGL1's guaranteed minimum. Macros preserve the public u_* API.
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
// Keep hash inputs inside mediump's guaranteed ±2^14 range.
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// Even, un-structured white noise for film grain (Dave Hoskins hash12). The
// multiply hash above is fine for value noise but shows a faint axis-aligned
// mesh at integer fragment coords, which reads as a net over flat areas.
float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(15731.743, 7892.321) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

// --- OKLab colour mixing (perceptual), gated by u_oklab -----------------------
vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  // max() guards the sRGB branch: out-of-gamut OKLab interpolations can send a
  // channel negative, and pow(negative, …) is NaN which mix()/step() would
  // then propagate. The linear branch clips such channels to 0 downstream.
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

// Mix through the recipe colours; x is clamped to 0..1. WebGL1 forbids
// dynamic uniform indexing in fragment shaders, hence the constant loop.
vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  float y = uv.y
    + sin(uv.x * (3.0 + u_intensity * 9.0) + t * 0.8) * 0.08
    + (fbm(p * 2.0 + t * 0.1) - 0.5) * u_intensity * 0.6;
  return palette(y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  // Cursor modes 1–3 are local distortions. Push shifts the same screen-space
  // coordinates before field transforms, so Zoom/Rotate don't change its feel.
  if (u_cursorPresence > 0.001) {
    // u_mouse is normalized to -1..1 in canvas space. Convert it to the same
    // aspect-corrected screen space as p so effects stay under the cursor.
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  // Keep presets that read uv (rather than p) in the same warped space.
  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  // Field transform: rotate, pan, pointer push, slow drift.
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  // Organic domain warp.
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  // Shade, with an optional soft 5-tap blur.
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  // Post: contrast, saturation, hue, brightness, vignette, grain.
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;
(() => {
  const canvas = document.getElementById("bg");
  if (!canvas) return;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl) { canvas.remove(); return; }
  const compile = (type, src) => { const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(sh)); return null; } return sh; };
  const vs = compile(gl.VERTEX_SHADER, "attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }");
  const fs = compile(gl.FRAGMENT_SHADER, WAVES_FRAG);
  if (!vs || !fs) { canvas.remove(); return; }
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); canvas.remove(); return; }
  gl.useProgram(prog);
  // one triangle that covers the whole screen
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  // colours (first 4 of 8 used) and settings from the recipe, with the Leather palette and calmer motion
  const cols = new Float32Array(24);
  cols.set([0.357, 0.243, 0.149, 0.541, 0.373, 0.231, 0.725, 0.541, 0.369, 0.851, 0.725, 0.561]); // "Leather": #5B3E26, #8A5F3B, #B98A5E, #D9B98F
  gl.uniform3fv(U("u_colors"), cols);
  gl.uniform4f(U("u_shape"), 1.84, 0.45, 0.25, 0.04); // intensity lowered from 0.60 for calmer waves
  gl.uniform4f(U("u_surface"), 3.33, 1.07, 0.00, 1.00);
  gl.uniform4f(U("u_finish"), 0.00, 0.25, 0.002, 0.02);
  gl.uniform4f(U("u_transform"), 4476.0, 0.38, 0.01, 0.0);
  gl.uniform4f(U("u_space"), 0.17, -0.25, 0.0, 0.0);
  gl.uniform4f(U("u_cursor"), 0.0, 2.0, 0.65, 0.46); // cursor off
  const uScene = U("u_scene");
  // Phones and small screens: draw at half resolution, skip the (barely visible) blur pass and run
  // at 30 frames a second. The waves are soft, so this looks the same but costs far less battery.
  const light = matchMedia("(max-width: 700px), (pointer: coarse)").matches;
  if (light) gl.uniform4f(U("u_finish"), 0.00, 0.25, 0.0, 0.02);
  const resize = () => {
    const dpr = light ? 0.5 : Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(innerWidth * dpr), h = Math.round(innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  };
  const t0 = performance.now();
  const frame = (now) => {
    resize();
    gl.uniform4f(uScene, canvas.width, canvas.height, ((now - t0) / 1000) * 0.8, 4.0); // slower than the recipe's 1.35, so the waves drift gently
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0;
  let last = 0;
  const loop = (now) => { if (!light || now - last > 32) { frame(now); last = now; } raf = requestAnimationFrame(loop); };
  const start = () => { cancelAnimationFrame(raf); if (still) frame(t0 + 8000); else raf = requestAnimationFrame(loop); };
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else start(); });
  addEventListener("resize", () => { if (still) frame(t0 + 8000); });
  start();
})();
