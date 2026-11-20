// Reiselogbuch-Test: ablauf-drehen-iphone (seit 3.56.1) – AppDesign APD-129, R-8.1: iPhone vom Home-Bildschirm hoch → quer → hoch. Safari lässt danach
// die Seite um die Statusleiste verschoben (scrollY und offsetTop 62, ohne Tastatur – Messung AppDesign arbeit/APD-129/messung-2026-11-14-0948.txt,
// Safari-Modell drehRest). Testfall-Liste AppDesign arbeit/APD-129 Befund und Testfall-Liste.md: M-1 Startliste, M-2 Reiselogbuch offen und
// gerollt, M-3 Blatt offen, M-4 Tastatur offen (die Verschiebung durch Safari bleibt), M-5 zweimal gedreht, M-6 Drehen ohne Rest; nach jedem
// Schritt die Grundregeln. Erwartet: scrollY 0, --vv-top 0, Kopfzeile wie vor dem Drehen, Antippen trifft den Knopf, den das Bild zeigt.
// Gegenprobe M-9: gegen AppDesign 4.59.0 rot (die App steht 62 px tiefer, Antippen trifft daneben).
// Seit 3.56.2 (AppDesign APD-129 Teil 2, Messung arbeit/APD-129/messung-2026-11-14-2137.txt, Testfall-Liste arbeit/APD-129 Teil 2 Befund und
// Testfall-Liste.md): der obere sichere Rand hinkt nach (Safari-Modell safeOben); jedes Bild ab der Meldung der Fensterhöhe wird aufgenommen –
// M-10 Startliste, M-11 Reiselogbuch (Kopfzeile und oberster Tag), M-12 Blatt, M-13 zweimal gedreht: Kopf in jedem Bild ± 1 px wie vor dem Drehen;
// M-14 = M-4; M-15 quer kein eigener Rand; M-16 Safari (nicht Home-Bildschirm) kein eigener Rand. Gegenprobe M-18: gegen 4.59.1 rot.
// Aufruf im Repo-Ordner: node tests/ablauf-drehen-iphone.mjs
import * as pw from 'playwright';
import { pruefung, navFertig, rolle } from '../../AppDesign/fassung/4.65.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.65.0/tests/hig.mjs';
import { safariModell, safariDrehenHoch, DREH_REST, RAND_NACH } from '../../AppDesign/fassung/4.65.0/tests/safari.mjs';
const t = pruefung('ablauf-drehen-iphone', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const iso = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
const tage = n => Object.fromEntries(Array.from({ length: n }, (_, i) => [iso(2026, 8, 24 + i), { weather: '☀️', program: `Programm ${i + 1}`, place: 'Hafen' }]));
const TRIPS = [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(2026, 8, 24), end: iso(2026, 9, 7), transport: ['flug'], days: tage(15) }];
const lade = async p => {
  await p.clock.setFixedTime(new Date('2026-11-02T10:00:00'));
  await p.goto(APP);
  await p.evaluate(x => { localStorage.clear(); localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })); }, TRIPS);
  await p.reload(); await p.waitForTimeout(500); await navFertig(p);
  await safariModell(p, 'iPhone hoch');
};
// Lage nach dem Drehen: Safaris Werte, --vv-top, Oberkante des Kopfs im Bild und was Antippen in der Mitte des Knopfs trifft (Safari-Modell trifft)
const lage = (p, kopf, knopf) => p.evaluate(([kopf, knopf]) => {
  const sicht = sel => [...document.querySelectorAll(sel)].find(e => e.getClientRects().length);
  const k = sicht(kopf), b = sicht(knopf), r = b?.getBoundingClientRect();
  const ziel = r ? __safari.trifft(r.left + r.width / 2, r.top + r.height / 2) : null;
  return { sy: Math.round(scrollY), vt: Math.round(visualViewport.offsetTop), vvtop: getComputedStyle(document.documentElement).getPropertyValue('--vv-top').trim(),
    kopf: k ? Math.round(k.getBoundingClientRect().top) : null, trifft: !!(ziel && b && (ziel === b || b.contains(ziel))) };
}, [kopf, knopf]);
const ohneRest = vor => ({ sy: 0, vt: 0, vvtop: '0px', kopf: vor.kopf, trifft: true });
const obersterTag = p => p.evaluate(() => { const r = document.querySelector('#app > .rolle'), oben = (document.querySelector('.nb')?.getBoundingClientRect().bottom ?? 0);
  return [...document.querySelectorAll('[data-day]')].find(e => e.getClientRects().length && e.getBoundingClientRect().bottom > oben + 1)?.dataset.day ?? null; });

// APD-129/M-10 bis M-13: jedes Bild ab der Meldung der Fensterhöhe – Oberkante von kopf (und dem Tag tag) und Fensterhöhe; ein Bild, bevor der
// Browser der Seite die neue Höhe gemeldet hat (resize), zählt nicht (ih -1) – darauf kann keine Seite antworten
const bilderVon = (kopf, tag = null) => ({
  start: `(() => { const sicht = sel => [...document.querySelectorAll(sel)].find(e => e.getClientRects().length); window.__bilder = []; let gemeldet = 0;
    addEventListener('resize', () => { gemeldet = innerHeight; }, { capture: true });
    const bild = () => { if (!window.__bilder) return; const k = sicht(${JSON.stringify(kopf)}), d = ${tag ? `document.querySelector('[data-day="${tag}"]')` : 'null'};
      window.__bilder.push({ ih: gemeldet === innerHeight ? innerHeight : -1, k: k ? Math.round(k.getBoundingClientRect().top) : null, d: d ? Math.round(d.getBoundingClientRect().top) : null });
      requestAnimationFrame(bild); }; requestAnimationFrame(bild); })()`,
  ende: '(() => { const b = window.__bilder || []; window.__bilder = null; return b; })()',
});
// Abweichungen: Bilder in der Höhe hoch, deren Kopf (bzw. Tag) mehr als 1 px von vorher abweicht – erwartet keine
const sprung = (bilder, hoehe, kopf, tag = null) => {
  const hoch = bilder.filter(x => x.ih === hoehe);
  const weg = hoch.filter(x => Math.abs(x.k - kopf) > 1 || (tag !== null && Math.abs(x.d - tag) > 1));
  return { bilder: hoch.length > 3, abweichend: weg.length, erstes: weg[0] ? `Bild ${hoch.indexOf(weg[0]) + 1}/${hoch.length} Kopf ${weg[0].k} statt ${kopf}${tag !== null ? `, Tag ${weg[0].d} statt ${tag}` : ''}` : '-' };
};
const keinSprung = { bilder: true, abweichend: 0, erstes: '-' };
const eigenerRand = p => p.evaluate(() => document.documentElement.style.getPropertyValue('--safe-top'));

const b = await t.browser();
const p = await t.seite(b, 'iPhone hoch', { theme: 'light' });
try {
  // M-1 Startliste: hoch → quer → hoch
  await lade(p);
  const vor1 = await lage(p, '#side .side-head', '#sideMore');
  const hoehe = p.viewportSize().height;
  let bilder1;
  await t.schritt(p, 'M-1 Startliste hoch → quer → hoch', async () => { bilder1 = await safariDrehenHoch(p, { bilder: bilderVon('#side .side-head') }); });
  t.ist(`M-10 Startliste: kein Sprung nach dem Drehen (Rand hinkt ${RAND_NACH} ms nach)`, sprung(bilder1, hoehe, vor1.kopf), keinSprung, 'R-8.1');
  t.ist('M-1 Startliste: keine Verschiebung, Kopf wie vorher, Mehr-Knopf trifft', await lage(p, '#side .side-head', '#sideMore'), ohneRest(vor1), 'R-8.1');
  // M-5 gleich noch einmal
  let bilder5;
  await t.schritt(p, 'M-5 Startliste ein zweites Mal hoch → quer → hoch', async () => { bilder5 = await safariDrehenHoch(p, { bilder: bilderVon('#side .side-head') }); });
  t.ist('M-13 Startliste zweimal gedreht: kein Sprung', sprung(bilder5, hoehe, vor1.kopf), keinSprung, 'R-8.1');
  t.ist('M-5 Startliste nach zweimal Drehen wie vorher', await lage(p, '#side .side-head', '#sideMore'), ohneRest(vor1), 'R-8.1');
  // M-6 Drehen ohne Rest (Safari, nicht Home-Bildschirm): nichts ändert sich
  await t.schritt(p, 'M-6 Drehen ohne Verschiebung', async () => { const v = p.viewportSize();
    await p.setViewportSize({ width: v.height, height: v.width }); await p.waitForTimeout(500); await p.setViewportSize(v); await p.waitForTimeout(500); });
  t.ist('M-6 ohne Verschiebung wie vorher', await lage(p, '#side .side-head', '#sideMore'), ohneRest(vor1), 'R-8.1');
  // M-15 quer: kein eigener oberer Rand (es gilt env(…)); M-16 Safari ohne Home-Bildschirm: ebenso
  { const v = p.viewportSize(); await p.setViewportSize({ width: v.height, height: v.width }); await p.waitForTimeout(400);
    t.ist('M-15 quer: kein eigener oberer Rand', await eigenerRand(p), '', 'R-8.1');
    await p.setViewportSize(v); await p.waitForTimeout(400); }
  t.ist('M-10 hoch vom Home-Bildschirm: oberer Rand 0 (Statusleiste außerhalb des Fensters)', await eigenerRand(p), '0px', 'R-8.1');
  await p.evaluate(() => { Object.defineProperty(navigator, 'standalone', { configurable: true, get: () => false }); dispatchEvent(new Event('resize')); });
  t.ist('M-16 Safari (nicht Home-Bildschirm): kein eigener oberer Rand', await eigenerRand(p), '', 'R-8.1');
  await p.evaluate(() => { Object.defineProperty(navigator, 'standalone', { configurable: true, get: () => true }); dispatchEvent(new Event('resize')); });

  // M-2 Reiselogbuch offen und gerollt
  await p.click('#side .side-row'); await p.waitForTimeout(400); await navFertig(p);
  await rolle(p, 600); await p.waitForTimeout(300);
  const vor2 = await lage(p, '.nb, .pnav', '#back'), tag2 = await obersterTag(p);
  const tagOben2 = await p.evaluate(d => Math.round(document.querySelector(`[data-day="${d}"]`).getBoundingClientRect().top), tag2);
  let bilder2;
  await t.schritt(p, 'M-2 Reiselogbuch gerollt, hoch → quer → hoch', async () => { bilder2 = await safariDrehenHoch(p, { bilder: bilderVon('.nb, .pnav', tag2) }); });
  t.ist('M-11 Reiselogbuch: kein Sprung von Kopfzeile und oberstem Tag', sprung(bilder2, hoehe, vor2.kopf, tagOben2), keinSprung, 'R-8.1');
  t.ist('M-2 Reiselogbuch: keine Verschiebung, Kopfzeile wie vorher, Zurück-Knopf trifft', await lage(p, '.nb, .pnav', '#back'), ohneRest(vor2), 'R-8.1');
  t.ist('M-2 oben bleibt derselbe Tag', await obersterTag(p), tag2, 'R-8.1');

  // M-3 Blatt offen (Tag bearbeiten), ohne Fokus in einem Feld
  await p.click('#app [data-day]'); await p.waitForTimeout(600); await navFertig(p);
  await p.evaluate(() => document.activeElement?.blur?.());
  const blatt = () => p.evaluate(() => Math.round(dlg.getBoundingClientRect().top));
  const vor3 = await lage(p, '#dlg .dlg-head, dialog[open] header', '#dlgX'), blatt3 = await blatt();
  let bilder3;
  await t.schritt(p, 'M-3 Blatt offen, hoch → quer → hoch', async () => { bilder3 = await safariDrehenHoch(p, { bilder: bilderVon('#dlg .dlg-head, dialog[open] header') }); });
  t.ist('M-12 Blatt: kein Sprung nach dem Drehen', sprung(bilder3, hoehe, vor3.kopf), keinSprung, 'R-4.6');
  t.ist('M-3 Blatt: keine Verschiebung, x trifft', await lage(p, '#dlg .dlg-head, dialog[open] header', '#dlgX'), ohneRest(vor3), 'R-4.6');
  t.ist('M-3 Blatt beginnt wie vorher knapp unter der Statusleiste', await blatt(), blatt3, 'R-4.6');

  // M-4 Tastatur offen: die Verschiebung durch Safari bleibt (APD-36, APD-115) – Größenänderung ohne Drehen darf sie nicht wegnehmen
  const feld = await p.$('dialog[open] textarea, dialog[open] input[type=text]');
  if (!feld) t.wahr('M-4 Feld im Blatt gefunden', false, 'R-4.5');
  else {
    await feld.focus(); await p.evaluate(() => __safari.tastatur(true)); await p.waitForTimeout(500);
    const vor4 = await p.evaluate(() => ({ sy: Math.round(scrollY), vvtop: getComputedStyle(document.documentElement).getPropertyValue('--vv-top').trim() }));
    // ohne Grundregeln: das Feld steht hier absichtlich teils unter der Tastatur (Safari hat verschoben) – geprüft wird nur, dass die Verschiebung bleibt
    await p.evaluate(() => { dispatchEvent(new Event('resize')); visualViewport.dispatchEvent(new Event('scroll')); }); await p.waitForTimeout(400);
    t.ist('M-4 Tastatur offen: Verschiebung durch Safari bleibt', await p.evaluate(() => ({ sy: Math.round(scrollY), vvtop: getComputedStyle(document.documentElement).getPropertyValue('--vv-top').trim() })), vor4, 'R-4.5');
  }
  t.wahr(`Safari-Modell: Verschiebung nach dem Drehen ${DREH_REST} px nachgebildet`, DREH_REST === 62, 'R-8.1');
} finally { await p.close(); }
await t.ende(b);
