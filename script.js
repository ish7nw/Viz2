// Australian Immigration: chart specs, interaction and animation
/* ---------- data ---------- */
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

/* ---------- theme ---------- */
function T() {
  const cs = getComputedStyle(document.documentElement);
  const g = (n) => cs.getPropertyValue(n).trim();
  return { bg: g("--bg"), surface: g("--surface"), ink: g("--ink"), muted: g("--muted"), rule: g("--rule"), land: g("--land"), ocean: g("--ocean"),
    contour: g("--contour"), s1: g("--s1"), s2: g("--s2"), s3: g("--s3"), line: g("--line"), seqLo: g("--seq-lo"), seqHi: g("--seq-hi"), onDark: g("--on-dark"), band: g("--band"),
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

/* ---------- shared state for interaction ---------- */
const state = { yrWorld: 2025, yrState: 2021, hl: "" };
const HL = (expr) => `hl == '' || ${expr} == hl`;
const TOTPOP_BY_NAME = { "New South Wales": 8097060, "Victoria": 6547820, "Queensland": 5215810, "South Australia": 1802600, "Western Australia": 2749370, "Tasmania": 567240, "Northern Territory": 248150, "Australian Capital Territory": 452510 };


/* ---------- hover highlight + stats tooltip, shared by every map ---------- */
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

/* ---------- Plate 1: the one line ---------- */
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
          color: { condition: { test: "datum.i % 2 == 0", value: t.band }, value: t.surface } } },
      { data: { values: ERAS }, mark: { type: "text", align: "left", baseline: "top", dx: 4, dy: 4, fontSize: 10.5, font: t.mono, color: t.muted, limit: 120, clip: true },
        transform: [{ filter: narrow ? "false" : "datum.e - datum.s >= 15" }],
        encoding: { x: { field: "s", type: "quantitative" }, y: { value: 0 }, text: { field: "n" } } },
      { data: { values: SERIES }, params: [{ name: "zoom", select: { type: "interval", encodings: ["x"] }, bind: "scales" }],
        mark: { type: "line", strokeWidth: 2.25, color: t.line, interpolate: "monotone", clip: true },
        encoding: { y: { field: "pct", type: "quantitative", scale: { domain: [0, 36] }, axis: { title: null, values: [0, 10, 20, 30], labelExpr: "datum.value + '%'", gridDash: [2, 3] } } } },
      { data: { values: SERIES }, params: [{ name: "hov", select: { type: "point", encodings: ["x"], nearest: true, on: "pointerover", clear: "pointerout" } }],
        mark: { type: "rule", strokeWidth: 1, clip: true },
        encoding: { color: { value: t.muted }, opacity: { condition: { param: "hov", empty: false, value: 0.7 }, value: 0 },
          tooltip: [ { field: "year", title: "Year", format: "d" }, { field: "pct", title: "Born overseas (%)", format: ".1f" }, { field: "os", title: "Overseas-born (millions)", format: ".2f" } ] } },
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

/* ---------- Plate 2: world from Sydney ---------- */
function spec2(t, yr, w) {
  const narrow = w < 600;
  const k = Math.min(1, w / 900);
  const proj = { type: "azimuthalEquidistant", rotate: [-151.21, 33.87], clipAngle: 179 };
  const sizeScale = { domain: [0, 1010000], range: [0, Math.round(2300 * k * k)] };
  const colorScale = { domain: REG_DOMAIN, range: [t.s1, t.s2, t.s3] };
  const labelText = (align, dx) => ({
    data: { values: COB_LONG },
    mark: { type: "text", align, dx, baseline: "middle", fontSize: narrow ? 10.5 : 11.5, lineHeight: 14, font: t.body },
    transform: [{ filter: "datum.year == yr" }, { filter: `datum.side == '${align === "left" ? "r" : "l"}'` },
      { filter: narrow ? "indexof(['India','England','China','New Zealand'], datum.c) >= 0" : "true" },
      { calculate: narrow ? "datum.c + ' ' + format(datum.v / 1000, ',.0f') + 'k'" : "[datum.c, format(datum.v, ',') + ' · ' + format(datum.km, ',') + ' km']", as: "lbl" }],
    encoding: { longitude: { field: "llon", type: "quantitative" }, latitude: { field: "llat", type: "quantitative" }, text: { field: "lbl" }, color: { value: t.ink } }
  });
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container", height: narrow ? Math.round(w + 90) : 680, autosize: { type: "fit-x", contains: "padding" },
    config: config(t),
    params: [{ name: "yr", value: yr, bind: { input: "radio", options: [2015, 2020, 2025], name: "Year " } }],
    projection: proj,
    layer: [
      { data: { sphere: true }, mark: { type: "geoshape", fill: t.ocean, stroke: t.rule, strokeWidth: 1 } },
      hoverCountry({ data: { values: WORLD, format: { type: "topojson", feature: "countries" } }, mark: { type: "geoshape", fill: t.land, stroke: t.surface, strokeWidth: 0.5 } }, t),
      { data: { values: RINGS.rings, format: { type: "json", property: "features" } }, mark: { type: "geoshape", filled: false, stroke: t.contour, strokeWidth: 1, strokeDash: [4, 3], strokeOpacity: 0.85 } },
      { data: { values: RINGS.ringLabels },
        mark: { type: "text", fontSize: 10.5, font: t.mono, fontWeight: 500, stroke: t.ocean, strokeWidth: 4, strokeJoin: "round" },
        encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, text: { field: "lbl" } },
        transform: [{ calculate: "format(datum.km, ',') + ' km'", as: "lbl" }] },
      { data: { values: RINGS.ringLabels },
        mark: { type: "text", fontSize: 10.5, font: t.mono, fontWeight: 500 },
        encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, text: { field: "lbl" }, color: { value: t.contour } },
        transform: [{ calculate: "format(datum.km, ',') + ' km'", as: "lbl" }] },
      { data: { values: COB_LONG }, transform: [{ filter: "datum.year == yr" }],
        mark: { type: "rule", strokeWidth: 0.75 },
        transform: [{ filter: "datum.year == yr" }, { filter: narrow ? "indexof(['India','England','China','New Zealand'], datum.c) >= 0" : "true" }],
        encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" },
          longitude2: { field: "llon" }, latitude2: { field: "llat" }, color: { value: t.muted } } },
      { data: { values: COB_LONG }, transform: [{ filter: "datum.year == yr" }],
        params: [{ name: "reg", select: { type: "point", fields: ["region"] }, bind: "legend" }],
        mark: { type: "circle", stroke: t.surface, strokeWidth: 1.5, cursor: "pointer" },
        encoding: {
          longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" },
          opacity: { condition: { param: "reg", value: 0.85 }, value: 0.1 },
          size: { field: "v", type: "quantitative", scale: sizeScale, legend: { title: "Residents born there", values: [100000, 500000, 1000000], format: narrow ? ".1s" : ",.0f", orient: "bottom", direction: "horizontal", symbolFillColor: t.muted, symbolOpacity: 0.35, symbolStrokeColor: t.muted } },
          color: { field: "region", type: "nominal", scale: colorScale, legend: { title: "Region of birth", orient: "bottom", direction: narrow ? "vertical" : "horizontal" } },
          order: { field: "v", sort: "descending" },
          tooltip: [ { field: "c", title: "Country of birth" }, { field: "year", title: "Year", format: "d" }, { field: "v", title: "Residents", format: "," }, { field: "km", title: "Distance from Sydney (km)", format: "," }, { field: "change", title: "Change 2015–25 (%)", format: "+d" } ]
        } },
      labelText("left", 4),
      labelText("right", -4),
      { data: { values: [{ lon: 151.21, lat: -33.87, n: "Sydney" }] },
        mark: { type: "point", shape: "cross", size: 90, strokeWidth: 2, filled: true },
        encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, color: { value: t.ink } } },
      { data: { values: [{ lon: 151.21, lat: -33.87, n: "Sydney" }] },
        mark: { type: "text", align: "right", dx: -7, dy: -9, fontSize: 11, fontWeight: 600, font: t.body },
        encoding: { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" }, text: { field: "n" }, color: { value: t.ink } } }
    ]
  };
}

/* ---------- Plate 3: choropleth ---------- */
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

/* ---------- Plate 4: nested proportional symbols ---------- */
function spec4(t, w) {
  const narrow = w < 600;
  const k = Math.min(1, w / 900);
  const size = { domain: [0, 2600000], range: [0, Math.round(6400 * k * k)] };
  const colorScale = { domain: REG_DOMAIN, range: [t.s1, t.s2, t.s3] };
  const loc = { longitude: { field: "lon", type: "quantitative" }, latitude: { field: "lat", type: "quantitative" } };
  const callout = (side) => ({
    data: { values: ST_LABELS }, transform: [{ filter: narrow ? "false" : `datum.cside == '${side}'` }],
    mark: { type: "text", align: side === "r" ? "left" : "right", dx: side === "r" ? 4 : -4, baseline: "middle", fontSize: 11.5, lineHeight: 14, font: t.body },
    encoding: { longitude: { field: "clon", type: "quantitative" }, latitude: { field: "clat", type: "quantitative" },
      text: { field: "lines" }, color: { value: t.ink } }
  });
  ST_LABELS.forEach(d => { d.lines = [d.l1, d.l2]; });
  const out = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container", height: narrow ? Math.round(w * 0.95 + 110) : 560, autosize: { type: "fit-x", contains: "padding" },
    config: config(t),
    params: [{ name: "hl", value: state.hl }],
    projection: AUS_PROJ,
    layer: [
      { data: { values: STATES, format: { type: "topojson", feature: "states" } }, mark: { type: "geoshape", fill: t.land, stroke: t.surface, strokeWidth: 1.25, cursor: "pointer" } },
      { data: { values: ST_LABELS }, mark: { type: "rule", strokeWidth: 0.75 }, transform: [{ filter: narrow ? "false" : "true" }],
        encoding: { ...loc, longitude2: { field: "clon" }, latitude2: { field: "clat" }, color: { value: t.muted } } },
      { data: { values: ST_LABELS }, mark: { type: "circle", filled: false, strokeWidth: 1.5, cursor: "pointer" },
        encoding: { ...loc, opacity: { condition: { test: HL("datum.name"), value: 1 }, value: 0.2 }, size: { field: "tot", type: "quantitative", scale: size,
            legend: { title: "Born overseas", values: [100000, 1000000, 2500000], format: narrow ? ".2s" : ",.0f", orient: "bottom", direction: "horizontal", symbolStrokeColor: t.ink, symbolFillColor: "transparent", symbolStrokeWidth: 1.25 } },
          color: { value: t.ink }, order: { field: "tot", sort: "descending" },
          tooltip: [ { field: "name", title: "State / territory" }, { field: "tot", title: "Born overseas", format: "," }, { field: "top", title: "Top country of birth" }, { field: "topn", title: "Residents born there", format: "," } ] } },
      { data: { values: ST_LABELS }, mark: { type: "circle", stroke: t.surface, strokeWidth: 1, cursor: "pointer" },
        encoding: { ...loc, opacity: { condition: { test: HL("datum.name"), value: 0.9 }, value: 0.15 }, size: { field: "topn", type: "quantitative", scale: size, legend: null },
          color: { field: "topRegion", type: "nominal", scale: colorScale, legend: { title: "Top country’s region", orient: "bottom", direction: "vertical" } },
          tooltip: [ { field: "name", title: "State / territory" }, { field: "top", title: "Top country of birth" }, { field: "topn", title: "Residents born there", format: "," } ] } },
      callout("r"), callout("l"),
      { data: { values: ST_LABELS }, transform: [{ filter: narrow ? "datum.abbr != 'ACT'" : "false" }],
        mark: { type: "text", align: "left", dx: 9, dy: -9, fontSize: 10.5, font: t.mono, fontWeight: 600, baseline: "middle" },
        encoding: { ...loc, text: { field: "abbr" }, color: { value: t.ink } } },
      { data: { values: [{ type: "Feature", properties: {}, geometry: { type: "MultiPoint", coordinates: narrow ? [[112, -10], [155, -10], [155, -44], [112, -44]] : [[101, -8], [168, -8], [168, -46], [101, -46]] } }] },
        mark: { type: "geoshape", opacity: 0, filled: false, strokeOpacity: 0 } }
    ]
  };
  out.layer[0] = hoverable(out.layer[0], t, "properties.STATE_NAME");
  out.layer[2] = { ...out.layer[2], transform: [{ lookup: "name", from: { data: { values: STATE_STATS }, key: "s_name", fields: Object.keys(STATE_STATS[0]) } }], encoding: { ...out.layer[2].encoding, tooltip: STATE_TT } };
  out.layer[3] = { ...out.layer[3], transform: [{ lookup: "name", from: { data: { values: STATE_STATS }, key: "s_name", fields: Object.keys(STATE_STATS[0]) } }], encoding: { ...out.layer[3].encoding, tooltip: STATE_TT } };
  return out;
}

/* ---------- extra data ---------- */
const WORLD_PROJ = { type: "equalEarth", rotate: [-75, 0] };
const extent = (pts) => ({ data: { values: [{ type: "Feature", properties: {}, geometry: { type: "MultiPoint", coordinates: pts } }] }, mark: { type: "geoshape", opacity: 0, filled: false, strokeOpacity: 0 } });
const worldBase = (t) => [
  hoverCountry({ data: { values: WORLD, format: { type: "topojson", feature: "countries" } }, mark: { type: "geoshape", fill: t.land, stroke: t.surface, strokeWidth: 0.5, clip: true } }, t)
];
const ausBase = (t, fill) => ({ data: { values: STATES, format: { type: "topojson", feature: "states" } }, mark: { type: "geoshape", fill: fill || t.land, stroke: t.surface, strokeWidth: 1.25 } });
const SYD = { lon: 151.21, lat: -33.87 };
const TOTPOP = { NSW: 8097060, Vic: 6547820, Qld: 5215810, SA: 1802600, WA: 2749370, Tas: 567240, NT: 248150, ACT: 452510 };
const base = (t, w, h, ocean) => ({ $schema: "https://vega.github.io/schema/vega-lite/v5.json", width: "container", height: h, autosize: { type: "fit-x", contains: "padding" }, config: ocean ? { ...config(t), view: { stroke: null, fill: t.ocean } } : config(t) });

/* ---------- Voyage: route map ---------- */
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
function gcInterp(a, b, f) {
  const r = Math.PI / 180, [l1, p1] = [a[0] * r, a[1] * r], [l2, p2] = [b[0] * r, b[1] * r];
  const d = 2 * Math.asin(Math.sqrt(Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin((l2 - l1) / 2) ** 2));
  if (d === 0) return [a[0], a[1], 0];
  const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
  const x = A * Math.cos(p1) * Math.cos(l1) + B * Math.cos(p2) * Math.cos(l2), y = A * Math.cos(p1) * Math.sin(l1) + B * Math.cos(p2) * Math.sin(l2), z = A * Math.sin(p1) + B * Math.sin(p2);
  return [Math.atan2(y, x) / r, Math.atan2(z, Math.hypot(x, y)) / r, d];
}
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
    { name: "waited", data: { values: WORLD, format: { type: "topojson", feature: "countries" } },
      transform: [{ filter: "indexof(['Spain', 'Brazil', 'South Africa'], datum.properties.name) >= 0" }, { calculate: "datum.properties.name", as: "cty" },
        { calculate: "{ 'Spain': 'Santa Cruz de Tenerife', 'Brazil': 'Rio de Janeiro', 'South Africa': 'Cape Town' }[datum.cty]", as: "port" },
        { calculate: "{ 'Spain': '3–10 June 1787 (7 days)', 'Brazil': '5 Aug – 4 Sep 1787 (30 days)', 'South Africa': '13 Oct – 12 Nov 1787 (30 days)' }[datum.cty]", as: "when" }],
      mark: { type: "geoshape", fill: "#387A38", cursor: "pointer", fillOpacity: WAITED_FILL_OPACITY, stroke: "#123A6B", strokeOpacity: 0.5, strokeWidth: 0.6, clip: true },
      params: [{ name: "hovw", select: { type: "point", fields: ["cty"], on: "pointerover", clear: "pointerout" } }],
      encoding: { strokeWidth: { condition: { param: "hovw", empty: false, value: 2 }, value: 0.6 }, strokeOpacity: { condition: { param: "hovw", empty: false, value: 1 }, value: 0.5 },
        tooltip: [{ field: "cty", title: "Fleet stopped in" }, { field: "port", title: "Port" }, { field: "when", title: "Anchored" }] } },
    { ...route, mark: { type: "geoshape", filled: false, stroke: "#FFFFFF", strokeOpacity: 0.35, strokeWidth: 2, strokeDash: [3, 4], clip: true } },
    { data: { values: FLEET_TRACK }, transform: [{ filter: "datum.day <= day" }],
      mark: { type: "line", stroke: "#FFFFFF", strokeOpacity: 0.6, strokeWidth: 5, strokeCap: "round", clip: true },
      encoding: { ...trackLoc, order: { field: "seq", type: "quantitative" } } },
    { data: { values: FLEET_TRACK }, transform: [{ filter: "datum.day <= day" }],
      mark: { type: "line", stroke: "#E8590C", strokeWidth: 2.75, strokeDash: [6, 4], clip: true },
      encoding: { ...trackLoc, order: { field: "seq", type: "quantitative" } } },
    { data: { values: FLEET_STOPS }, mark: { type: "point", filled: true, size: 70, stroke: "#FFFFFF", strokeWidth: 2 },
      encoding: { ...loc, color: { condition: { test: "datum.arrive <= day", value: "#E8590C" }, value: "#123A6B" }, tooltip: [{ field: "n", title: "Stop" }, { field: "d", title: "When" }] } },
    { data: { values: FLEET_TRACK }, transform: [{ filter: "datum.day <= day" }, { aggregate: [{ op: "argmax", field: "day", as: "cur" }] },
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

/* ---------- Flow map ---------- */
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

/* ---------- Spike map ---------- */
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

/* ---------- SA4 regions (Figures 6–8) ---------- */
// ABS Statistical Areas Level 4 (ASGS 2021). Shares: Census 2011 and 2016 on that year's SA4s, 2021 on 2021 SA4s.
const SA4_FEAT = { values: SA4, format: { type: "topojson", feature: "sa4" } };
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
// one SA4 fill layer with hover highlight and the linked state highlight
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

/* Figure 6: SA4 choropleth with a Census-year slider and city insets */
function spec3(t, yr, w) {
  const narrow = w < 600;
  if (![2011, 2016, 2021].includes(yr)) yr = 2021;
  const pct = { calculate: "yr == 2011 ? datum.properties.s11 : yr == 2016 ? datum.properties.s16 : datum.properties.s21", as: "pct" };
  const fill = (gcc, sw) => sa4Layer(t, { filter: gcc ? `datum.properties.gcc == '${gcc}'` : null, transform: [pct, SA4_CLASS("datum.pct"), { calculate: "yr", as: "census" }],
    color: sa4Color({ cols: narrow ? 3 : 7 }), sw: sw, tooltip: SA4_TT("census") });
  const insetW = narrow ? Math.floor((w - 24) / 2) : 220;
  const mainW = narrow ? w - 8 : w - insetW - 40;
  const main = {
    width: mainW, height: Math.round(mainW * 0.82), projection: AUS_PROJ,
    layer: [fill(null, 0.35), stateLines(t), waterLabels(t, narrow ? WATER_AUS.filter(d => d.n !== "Great Australian Bight") : WATER_AUS, narrow), stateAbbr(t, narrow), ...insetBoxes(t, narrow), extent([[112, -10], [161, -10], [161, -44], [112, -44]])]
  };
  const insets = INSETS.map(d => insetView(t, d, insetW, (g) => fill(g, 0.6)));
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: { ...config(t), concat: { spacing: 16 } },
    params: [{ name: "yr", value: yr, bind: { input: "range", min: 2011, max: 2021, step: 5, name: "Census year " } }, { name: "hl", value: state.hl }],
    [narrow ? "vconcat" : "hconcat"]: [main, { [narrow ? "hconcat" : "vconcat"]: insets, spacing: narrow ? 12 : 22 }],
    spacing: narrow ? 14 : 20
  };
}

/* Figure 7: small multiples, one map per Census year, same classes as Figure 6 */
function specSmall(t, w) {
  const narrow = w < 600;
  const cw = Math.floor((w - 2 * 10 - 8) / 3);
  const yrs = [["s11", 2011], ["s16", 2016], ["s21", 2021]];
  const panel = ([f, y]) => ({
    width: cw, height: Math.round(cw * 0.86), projection: AUS_PROJ,
    title: { text: String(y), anchor: "start", font: t.body, fontSize: narrow ? 11 : 13, fontWeight: 600, color: t.ink, offset: 2 },
    layer: [
      sa4Layer(t, { transform: [{ calculate: "datum.properties." + f, as: "pct" }, SA4_CLASS("datum.pct"), { calculate: String(y), as: "census" }],
        color: sa4Color({ cols: narrow ? 3 : 7 }), sw: 0.25, tooltip: SA4_TT("census") }),
      { ...stateLines(t), mark: { ...stateLines(t).mark, strokeWidth: 0.6 } }
    ]
  });
  return { $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: config(t), params: [{ name: "hl", value: state.hl }],
    hconcat: yrs.map(panel), spacing: 10 };
}

/* Figure 8: bivariate choropleth, 2021 share against change since 2011, by SA4 */
const BIV_COLORS = ["#e8e8e8", "#ace4e4", "#5ac8c8", "#dfb0d6", "#a5add3", "#5698b9", "#be64ac", "#8c62aa", "#3b4994"];
const BIV_SHARE = [15, 30], BIV_GROW = [1.5, 3];
function specBiv(t, w) {
  const narrow = w < 600;
  const cls = [
    { calculate: `(datum.properties.s21 < ${BIV_SHARE[0]} ? 0 : datum.properties.s21 < ${BIV_SHARE[1]} ? 1 : 2) * 3 + (datum.properties.chg < ${BIV_GROW[0]} ? 0 : datum.properties.chg < ${BIV_GROW[1]} ? 1 : 2)`, as: "cls" },
    { calculate: "['Low', 'Medium', 'High'][floor(datum.cls / 3)] + ' share, ' + ['low', 'medium', 'high'][datum.cls % 3] + ' growth'", as: "bivclass" }
  ];
  const op = { condition: [{ test: "!(" + HL("datum.properties.state") + ")", value: 0.2 }, { param: "cell", empty: true, value: 1 }], value: 0.18 };
  const fill = (gcc, sw) => sa4Layer(t, { filter: gcc ? `datum.properties.gcc == '${gcc}'` : null, transform: cls, opacity: op, sw,
    color: { field: "cls", type: "ordinal", scale: { domain: [0, 1, 2, 3, 4, 5, 6, 7, 8], range: BIV_COLORS }, legend: null },
    tooltip: [SA4_TT()[0], SA4_TT()[1], { field: "bivclass", title: "Class" }, ...SA4_TT().slice(2)] });
  const sideW = narrow ? Math.floor((w - 96) / 2) : 200;
  const mainW = narrow ? w - 8 : w - sideW - 120;
  const main = { width: mainW, height: Math.round(mainW * 0.82), projection: AUS_PROJ,
    layer: [fill(null, 0.35), stateLines(t), stateAbbr(t, narrow), ...insetBoxes(t, narrow), extent([[112, -10], [161, -10], [161, -44], [112, -44]])] };
  const cells = []; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) cells.push({ a, b, cls: a * 3 + b });
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
  const side = narrow ? { vconcat: [legend, { hconcat: insets, spacing: 12, bounds: "full" }], spacing: 16, bounds: "full" } : { vconcat: [legend, ...insets], spacing: 18, bounds: "full" };
  return { $schema: "https://vega.github.io/schema/vega-lite/v5.json", config: { ...config(t), concat: { spacing: 16 } }, params: [{ name: "hl", value: state.hl }],
    [narrow ? "vconcat" : "hconcat"]: [main, side], bounds: "full", spacing: narrow ? 14 : 24, resolve: { scale: { color: "independent" } } };
}

/* ---------- Dot density ---------- */
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

/* ---------- Dorling cartogram ---------- */
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

/* ---------- Pie-chart map ---------- */
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


/* ---------- "green to gray" animated gradient, masked to the countries where the fleet stopped ---------- */
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

/* ---------- tables ---------- */
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

/* ---------- hero shutter title ---------- */
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

/* ---------- render ---------- */
state.day = 250;
const views = {};
let lastW = 0;
const opts = { actions: false, renderer: "svg", tooltip: { theme: "custom" } };
const STATE_VIEWS = ["c3", "cM", "cB", "cD", "cC", "cP", "c4"];
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
function setHighlight(name) {
  state.hl = name || "";
  for (const id of STATE_VIEWS) if (views[id]) views[id].signal("hl", state.hl).runAsync();
  const sel = document.getElementById("hlState"); if (sel) sel.value = state.hl;
}
async function render() {
  const t = T();
  const cw = (id) => { const el = document.getElementById(id); const cs = getComputedStyle(el); return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); };
  lastW = cw("c1");
  try {
    views.c1 = (await vegaEmbed("#c1", spec1(t, cw("c1")), opts)).view;
    views.c2 = (await vegaEmbed("#c2", spec2(t, state.yrWorld, cw("c2")), opts)).view;
    views.c2.addSignalListener("yr", (n, v) => { state.yrWorld = v; });
    views.c3 = (await vegaEmbed("#c3", spec3(t, state.yrState, cw("c3")), opts)).view;
    views.c3.addSignalListener("yr", (n, v) => { state.yrState = v; });
    views.c4 = (await vegaEmbed("#c4", spec4(t, cw("c4")), opts)).view;
    const more = [["cV", specVoyage], ["cF", specFlow], ["cS", specSpike], ["cM", specSmall], ["cB", specBiv], ["cD", specDots], ["cC", specDorling], ["cP", specPies]];
    for (const [id, fn] of more) { try { views[id] = (await vegaEmbed("#" + id, fn(t, cw(id)), opts)).view; } catch (e) { console.error(id, e); } }
    if (views.cV) views.cV.addSignalListener("day", (n, v) => { state.day = v; });
    for (const id of STATE_VIEWS) {
      if (!views[id]) continue;
      views[id].addEventListener("click", (ev, item) => {
        const name = stateNameOf(item);
        if (name) setHighlight(state.hl === name ? "" : name);
        else if (!item || !item.datum || item.mark?.marktype === "group") setHighlight("");
      });
    }
    try { setupWaited(); } catch (e) { console.error("waited", e); }
  } catch (e) { console.error(e); }
}
// state dropdown (keyboard-friendly way to drive the linked highlight)
(() => {
  const sel = document.getElementById("hlState");
  if (!sel) return;
  ST.forEach(r => { const o = document.createElement("option"); o.value = r[0]; o.textContent = r[0]; sel.appendChild(o); });
  sel.addEventListener("change", () => setHighlight(sel.value));
})();
// play the voyage
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
const FONT_LOADS = ["400 12px IBM Plex Sans", "500 12px IBM Plex Sans", "600 12px IBM Plex Sans", "700 12px IBM Plex Sans", "500 12px IBM Plex Sans Condensed", "italic 500 12px IBM Plex Sans Condensed", "600 12px IBM Plex Sans Condensed"];
Promise.race([Promise.all(FONT_LOADS.map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 1500))]).catch(() => {}).then(render);
let rt;
const rerender = () => { clearTimeout(rt); rt = setTimeout(render, 60); };
addEventListener("resize", () => { const el = document.getElementById("c1"); if (Math.abs(el.clientWidth - lastW) > 40) rerender(); });
