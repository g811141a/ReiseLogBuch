// Reiselogbuch-Test: ablauf-p120 (seit 3.58.1) – die Rückmeldungen aus dem Usertest P-120 (Reiselogbuch 3.58.0) als feste Prüfung, je genau der
// Ablauf des Nutzers (Zusammenarbeit 0 Nr. 1), rot gegen 3.58.0 (AppDesign arbeit/0154 P-120 Korrekturen.md):
// P-120/F-1 Text nur in Eingabefeldern auswählbar (R-1.15): Doppeltippen bzw. Ziehen auf den Text der Backup-Kachel, auf die Lücke zwischen zwei
//   Kacheln mitten in der Seitenleiste, auf den Jahreskopf und auf den Hinweis ‚gesperrt‘ markiert nichts; kein sichtbarer Text außerhalb von
//   Eingabefeldern und der Vorschau ist wählbar (Safari markiert sonst samt Lupe – Designrichtlinie 13, safariHalten) · iPad quer, iPhone hoch.
// P-120/F-2 Sperren und Entsperren einer Kachel weiter oben, während die unterste aktiv ist: die Liste springt nicht, das gesperrte bzw. entsperrte
//   Reiselogbuch wird das aktive und angezeigt (iPad); am iPhone bleibt die Startliste stehen; dieselbe Lücke: ‚Reiselogbuch einstellen‘ gesichert
//   wie Sperren, abgebrochen und ‚Reiselogbuch löschen‘ lassen die Liste stehen (das aktive bleibt) · iPad quer, iPad hoch, iPhone hoch.
// P-120/F-3 abgebrochenes oder gescheitertes Teilen zählt ‚Ausgabe V…‘ nicht hoch, gesichertes schon – gesperrte Seite und Vorschau; PDF zählt erst,
//   wenn das Drucken-Menü aufgeht (beforeprint) · iPad quer.
// P-120/F-4 Hinweis ‚gesperrt‘ bleibt beim Rollen unter der Kopfzeile stehen, lässt sich ausblenden (x ‚Hinweis ausblenden‘) und erscheint beim
//   nächsten Öffnen wieder (Muster AppDesign arbeit/P-120/index.html) · iPad quer, iPhone hoch.
// Grundregeln nach jedem Schritt. Aufruf im Repo-Ordner: node tests/ablauf-p120.mjs (PRUEF_TEIL=F-1 … nur ein Teil)
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.68.1/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.68.1/tests/hig.mjs';
const t = pruefung('ablauf-p120', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const TEIL = process.env.PRUEF_TEIL || '';
const teil = n => !TEIL || TEIL === n;
const iso = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
const JETZT = new Date('2026-11-02T10:00:00');
// 14 Reiselogbücher über 7 Jahre – die Seitenleiste rollt; das älteste (unterste) ist aktiv. ‚a‘ ist gesperrt.
const ORTE = ['Australien', 'Toskana', 'Wien', 'Lissabon', 'Kreta', 'Norwegen', 'Schottland', 'Provence', 'Island', 'Sizilien', 'Andalusien', 'Bretagne', 'Dolomiten', 'Mallorca'];
const TRIPS = ORTE.map((title, i) => { const y = 2026 - Math.floor(i / 2), m = i % 2 ? 4 : 9, s = iso(y, m, 3);
  return { id: String.fromCharCode(97 + i), title, participants: 'G und M', start: s, end: iso(y, m, 9), transport: ['flug'],
    days: Object.fromEntries([0, 1, 2, 3, 4, 5].map(d => [iso(y, m, 3 + d), { weather: '☀️', program: `${title} Tag ${d + 1}\nStadtrundgang\nAbendessen am Hafen`, comment: 'Schöner Tag mit viel Sonne' }])),
    ...(i === 0 ? { locked: true, fazit: 'Schön' } : {}) }; });
const UNTEN = TRIPS.at(-1).id;
const lade = async (p, { lastTrip = UNTEN, trips = TRIPS } = {}) => {
  await p.clock.setFixedTime(JETZT);
  await p.goto(APP);
  await p.evaluate(([trips, lt, lb]) => { localStorage.clear(); localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: lb, lastTrip: lt }, trips })); },
    [trips, lastTrip, JETZT.getTime() - 3 * 86400000]);   // Backup vor 3 Tagen – die Backup-Kachel steht
  await p.reload(); await p.waitForTimeout(500); await navFertig(p);
  await p.evaluate(() => { window.print = () => {}; Object.defineProperty(navigator, 'canShare', { value: () => true, configurable: true, writable: true });
    window.__teilen = 'ok';   // ok · abbrechen · fehler
    Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: () => window.__teilen === 'ok' ? Promise.resolve()
      : Promise.reject(Object.assign(new Error('x'), { name: window.__teilen === 'abbrechen' ? 'AbortError' : 'NotAllowedError' })) }); });
};
const esc = async p => { for (let n = 0; n < 4 && await p.evaluate(() => !!document.querySelector('.menu, .pop') || msg.open || dlg.open); n++) { await p.keyboard.press('Escape'); await p.waitForTimeout(500); } };
const lang = async (p, id) => { const bx = await p.locator(`#side .side-row[data-id="${id}"]`).boundingBox();
  await p.mouse.move(bx.x + 40, bx.y + bx.height / 2); await p.mouse.down(); await p.waitForTimeout(750); await p.mouse.up();
  await p.waitForSelector('.menu.kontext .mi', { timeout: 4000 }); await p.waitForTimeout(450); };
const menuePunkt = async (p, text) => { await p.locator('.menu.kontext .mi', { hasText: text }).click(); await p.waitForTimeout(600); await navFertig(p); };
const zurStartliste = async p => { if (await p.evaluate(() => isPhone() && !phoneList)) { await p.click('#back'); await p.waitForTimeout(600); await navFertig(p); } };
const oeffne = async (p, id) => { await zurStartliste(p); await p.click(`#side .side-row[data-id="${id}"]`); await p.waitForTimeout(600); await navFertig(p); };
const listeOben = p => p.evaluate(() => { const l = document.querySelector('#side .side-list'); l.scrollTop = 0; l.dispatchEvent(new Event('scroll')); });
const auswahl = p => p.evaluate(() => getSelection().toString().trim());
const leeren = p => p.evaluate(() => getSelection().removeAllRanges());
// R-1.15: jeder sichtbare Text außerhalb von Eingabefeldern und der Vorschau (.rt) – user-select des Elements mit dem Text (wie safariHalten)
const waehlbar = p => p.evaluate(() => { const out = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { const n = w.currentNode, e = n.parentElement; if (!n.textContent.trim() || !e || e.closest('input, textarea, [contenteditable="true"], [contenteditable=""], .rt, style, script, template')) continue;
    if (!e.getClientRects().length) continue; const c = getComputedStyle(e); if (c.visibility === 'hidden' || +c.opacity === 0) continue;
    const r = e.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    if ((c.webkitUserSelect || c.userSelect) !== 'none') out.push(`${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/)[0] : ''} ‚${n.textContent.trim().slice(0, 30)}‘`); }
  return [...new Set(out)]; });

const b = await t.browser();

// ---------- P-120/F-1 Textauswahl ----------
if (teil('F-1')) for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p);
    await zurStartliste(p);
    // a) Backup-Kachel: Doppeltippen auf den Text (wie langes Drücken am Gerät: Safari markiert das Wort und zeigt die Lupe)
    await t.schritt(p, 'P-120/F-1 Doppeltippen auf den Text der Backup-Kachel', async () => { await leeren(p); await p.dblclick('#side .side-foot .bhint > div'); await p.waitForTimeout(300); });
    t.ist('P-120/F-1 Text der Backup-Kachel wird nicht markiert', await auswahl(p), '', 'R-1.15');
    // b) Lücke zwischen zwei Kacheln mitten in der Liste, gezogen bis in die Backup-Kachel (am Gerät: Lupe, markierter Text lässt sich verschieben)
    await t.schritt(p, 'P-120/F-1 Ziehen von der Lücke zwischen zwei Kacheln bis in die Backup-Kachel', async () => { await leeren(p);
      const g = await p.evaluate(() => { const rs = [...document.querySelectorAll('#side .side-row')].filter(r => { const b = r.getBoundingClientRect(); return b.top > 120 && b.bottom < innerHeight - 200; });
        const a = rs[Math.floor(rs.length / 2) - 1].getBoundingClientRect(), z = document.querySelector('#side .side-foot .bhint > div').getBoundingClientRect();
        return { x: a.left + 30, y: a.bottom + 1, zx: z.left + 20, zy: z.top + z.height / 2 }; });
      await p.mouse.move(g.x, g.y); await p.mouse.down(); await p.mouse.move(g.zx, g.zy, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(300); });
    t.ist('P-120/F-1 von der Lücke aus wird nichts markiert', await auswahl(p), '', 'R-1.15');
    await t.schritt(p, 'P-120/F-1 Doppeltippen auf den Jahreskopf', async () => { await leeren(p); await p.dblclick('#side .side-sec >> nth=1'); await p.waitForTimeout(300); });
    t.ist('P-120/F-1 Jahreskopf wird nicht markiert', await auswahl(p), '', 'R-1.15');
    t.ist('P-120/F-1 Seitenleiste bzw. Startliste: kein Text außerhalb von Eingabefeldern wählbar', await waehlbar(p), [], 'R-1.15');
    // c) gesperrtes Reiselogbuch: Hinweis nicht wählbar, die Vorschau (Lesetext) bleibt wählbar
    await t.schritt(p, 'P-120/F-1 gesperrtes Reiselogbuch öffnen', () => oeffne(p, 'a'));
    await t.schritt(p, 'P-120/F-1 Doppeltippen auf den Hinweis ‚gesperrt‘', async () => { await leeren(p); await p.dblclick('#app .lockinfo .li-t b'); await p.waitForTimeout(300); });
    t.ist('P-120/F-1 Hinweis ‚gesperrt‘ wird nicht markiert', await auswahl(p), '', 'R-1.15');
    t.ist('P-120/F-1 gesperrtes Reiselogbuch: kein Text außerhalb von Eingabefeldern und Vorschau wählbar', await waehlbar(p), [], 'R-1.15');
    // d) offenes Reiselogbuch und Fenster ‚Tag‘: Felder bleiben wählbar
    await t.schritt(p, 'P-120/F-1 Reiselogbuch öffnen', () => oeffne(p, 'b'));
    t.ist('P-120/F-1 offenes Reiselogbuch: kein Text außerhalb von Eingabefeldern wählbar', await waehlbar(p), [], 'R-1.15');
    await t.schritt(p, 'P-120/F-1 Tag öffnen', async () => { await p.click('#app [data-day] >> nth=0'); await p.waitForSelector('#dlg[open]', { timeout: 4000 }); await p.waitForTimeout(600); });
    t.ist('P-120/F-1 Fenster ‚Tag‘: kein Text außerhalb von Eingabefeldern wählbar', await waehlbar(p), [], 'R-1.15');
    t.wahr('P-120/F-1 Eingabefelder bleiben wählbar (user-select text bzw. auto)', await p.evaluate(() => [...dlg.querySelectorAll('textarea, input[type=text]')].every(e => (getComputedStyle(e).webkitUserSelect || getComputedStyle(e).userSelect) !== 'none')), 'R-1.15');
    await esc(p);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}

// ---------- P-120/F-2 Sperren weiter oben ----------
if (teil('F-2')) for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { trips: TRIPS.map(x => ({ ...x, locked: undefined })) });
    const phone = await p.evaluate(() => isPhone());
    if (phone) { await t.schritt(p, 'P-120/F-2 unterstes Reiselogbuch öffnen und zurück', async () => { await oeffne(p, UNTEN); await zurStartliste(p); }); }
    else if (await p.evaluate(() => document.querySelector('#side')?.hidden)) await t.schritt(p, 'Seitenleiste einblenden', async () => { await p.click('#app [aria-label="Seitenleiste einblenden"]'); await p.waitForTimeout(600); await navFertig(p); });
    const lage = id => p.evaluate(id => ({ y: Math.round(document.querySelector(`#side .side-row[data-id="${id}"]`).getBoundingClientRect().top),
      cur: document.querySelector('#side .side-row.current')?.dataset.id || null, lock: !!document.querySelector('#app .lockpage'),
      titel: document.querySelector('#app .nb-title, #app .pnav-title')?.textContent || '', liste: !!document.querySelector('#side.page') }), id);
    await t.schritt(p, 'P-120/F-2 Liste ganz nach oben rollen', async () => { await listeOben(p); await p.waitForTimeout(300); });
    const id = 'b', name = TRIPS.find(x => x.id === id).title;
    const vor = await lage(id);
    await t.schritt(p, `P-120/F-2 ‚${name}‘ lange drücken → ‚Reiselogbuch sperren‘`, async () => { await lang(p, id); await menuePunkt(p, 'Reiselogbuch sperren'); });
    let n = await lage(id);
    t.ist(`P-120/F-2 nach dem Sperren springt die Liste nicht (Kachel ‚${name}‘ bei y ${vor.y})`, n.y, y => Math.abs(y - vor.y) <= 1, 'R-7.1');
    if (phone) t.ist('P-120/F-2 iPhone: die Startliste bleibt, ‚' + name + '‘ ist das aktive', [n.liste, n.cur ?? id], [true, id], 'R-7.1');
    else t.ist(`P-120/F-2 ‚${name}‘ ist das aktive und wird angezeigt (gesperrt)`, [n.cur, n.lock, n.titel], [id, true, name], 'R-7.1');
    await t.schritt(p, `P-120/F-2 ‚${name}‘ lange drücken → ‚Reiselogbuch entsperren‘`, async () => { await lang(p, id); await menuePunkt(p, 'Reiselogbuch entsperren'); });
    n = await lage(id);
    t.ist('P-120/F-2 nach dem Entsperren springt die Liste nicht', n.y, y => Math.abs(y - vor.y) <= 1, 'R-7.1');
    if (!phone) t.ist(`P-120/F-2 ‚${name}‘ bleibt das aktive und wird angezeigt (entsperrt)`, [n.cur, n.lock, n.titel], [id, false, name], 'R-7.1');
    // Entsperren einer anderen Kachel, während ‚Toskana‘ aktiv ist
    if (!phone) {
      await p.evaluate(() => { getTrip('c').locked = true; save(); render(); });
      const v2 = await lage('c');
      await t.schritt(p, 'P-120/F-2 ‚Wien‘ (gesperrt) lange drücken → ‚Reiselogbuch entsperren‘', async () => { await lang(p, 'c'); await menuePunkt(p, 'Reiselogbuch entsperren'); });
      n = await lage('c');
      t.ist('P-120/F-2 ‚Wien‘ ist nach dem Entsperren das aktive und wird angezeigt, die Liste steht', [n.cur, n.lock, n.titel, Math.abs(n.y - v2.y) <= 1], ['c', false, 'Wien', true], 'R-7.1');
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}

// ---------- P-120/F-2 dieselbe Lücke: Einstellen und Löschen weiter oben (Entscheidung 22.11.2026) ----------
// Einstellen gesichert: dieses Reiselogbuch wird das aktive und angezeigt (wie Sperren); Einstellen abgebrochen und Löschen: die Liste bleibt stehen,
// das aktive bleibt (vorher rollte keepSideScroll zum untersten).
if (teil('F-2')) for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    const start = async () => {
      await lade(p, { trips: TRIPS.map(x => ({ ...x, locked: undefined })) });
      if (await p.evaluate(() => isPhone())) { await oeffne(p, UNTEN); await zurStartliste(p); }
      else if (await p.evaluate(() => document.querySelector('#side')?.hidden)) { await p.click('#app [aria-label="Seitenleiste einblenden"]'); await p.waitForTimeout(600); await navFertig(p); }
      await listeOben(p); await p.waitForTimeout(300);
    };
    const lage = id => p.evaluate(id => ({ y: Math.round(document.querySelector(`#side .side-row[data-id="${id}"]`)?.getBoundingClientRect().top ?? -9999),
      cur: document.querySelector('#side .side-row.current')?.dataset.id || null, liste: !!document.querySelector('#side.page'),
      titel: document.querySelector('#app .nb-title, #app .pnav-title')?.textContent || '', last: db.settings.lastTrip, n: db.trips.length }), id);
    await t.schritt(p, 'P-120/F-2 Start: unterstes aktiv, Liste ganz oben', start);
    const phone = await p.evaluate(() => isPhone());
    let vor = await lage('d');
    await t.schritt(p, 'P-120/F-2 ‚Lissabon‘ lange drücken → ‚Reiselogbuch einstellen‘ → x', async () => { await lang(p, 'd'); await menuePunkt(p, 'Reiselogbuch einstellen');
      await p.waitForSelector('#dlg[open] #fTitle', { timeout: 4000 }); await p.waitForTimeout(400); await p.click('#dlgX'); await p.waitForTimeout(700); await navFertig(p); });
    let n = await lage('d');
    t.ist('P-120/F-2 Einstellen ohne Sichern: die Liste springt nicht, das aktive bleibt', [n.y, n.last], [vor.y, UNTEN], 'R-7.1');
    await t.schritt(p, 'P-120/F-2 ‚Lissabon‘ lange drücken → ‚Reiselogbuch einstellen‘ → Titel ändern → Häkchen', async () => { await lang(p, 'd'); await menuePunkt(p, 'Reiselogbuch einstellen');
      await p.waitForSelector('#dlg[open] #fTitle', { timeout: 4000 }); await p.waitForTimeout(400); await p.fill('#fTitle', 'Lissabon und Porto'); await p.click('#dlgOk'); await p.waitForTimeout(700); await navFertig(p); });
    n = await lage('d');
    t.ist('P-120/F-2 nach dem Einstellen springt die Liste nicht', n.y, y => Math.abs(y - vor.y) <= 1, 'R-7.1');
    if (phone) t.ist('P-120/F-2 iPhone: die Startliste bleibt, ‚Lissabon und Porto‘ ist das aktive', [n.liste, n.last], [true, 'd'], 'R-7.1');
    else t.ist('P-120/F-2 ‚Lissabon und Porto‘ ist das aktive und wird angezeigt', [n.cur, n.titel, n.last], ['d', 'Lissabon und Porto', 'd'], 'R-7.1');
    await t.schritt(p, 'P-120/F-2 neu: unterstes aktiv, Liste ganz oben', start);
    vor = await lage('b');
    await t.schritt(p, 'P-120/F-2 ‚Wien‘ lange drücken → ‚Reiselogbuch löschen‘ → ‚Reiselogbuch löschen‘', async () => { await lang(p, 'c'); await menuePunkt(p, 'Reiselogbuch löschen');
      await p.locator('.pop button', { hasText: 'Reiselogbuch löschen' }).click(); await p.waitForTimeout(700); await navFertig(p); });
    n = await lage('b');
    t.ist('P-120/F-2 ‚Wien‘ ist gelöscht', [n.n, await p.evaluate(() => !getTrip('c'))], [TRIPS.length - 1, true], 'R-4.4');
    t.ist('P-120/F-2 nach dem Löschen springt die Liste nicht (Kachel ‚Toskana‘)', n.y, y => Math.abs(y - vor.y) <= 1, 'R-7.1');
    t.ist(`P-120/F-2 nach dem Löschen bleibt das aktive (${phone ? 'Startliste' : 'angezeigt'})`, [phone ? n.liste : n.titel, n.last], [phone ? true : TRIPS.at(-1).title, UNTEN], 'R-7.1');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}

// ---------- P-120/F-3 Ausgabe-Nummer nach Abbruch ----------
if (teil('F-3')) {
  const p = await t.seite(b, 'iPad quer', { theme: 'light' });
  try {
    await lade(p, { lastTrip: 'a' });
    const zaehler = id => p.evaluate(id => [getTrip(id).outputCounter || 0, JSON.parse(localStorage.getItem('reiselogbuch.v1')).trips.find(x => x.id === id).outputCounter || 0], id);
    const teilen = async (art, knopf) => { await p.evaluate(a => { window.__teilen = a; }, art); await p.click(knopf); await p.waitForSelector('#dlg[open] .step', { timeout: 4000 }); await p.waitForTimeout(400);
      const r = await p.evaluate(() => dlg.textContent.replace(/\s+/g, ' ')); await esc(p); return r; };
    let r = await teilen('abbrechen', '#shareBtn');
    t.wahr(`P-120/F-3 gesperrt, Teilen abgebrochen: Meldung ‚Ausgabe V001‘ und ‚abgebrochen‘ (${r.slice(0, 80)})`, /Ausgabe V001/.test(r) && /abgebrochen/.test(r), 'R-10.1');
    t.ist('P-120/F-3 nach dem Abbruch zählt die Ausgabe nicht hoch (App und gespeichert)', await zaehler('a'), [0, 0], 'R-9.3');
    t.ist('P-120/F-3 die Vorschau nennt weiter V001', await p.evaluate(() => document.querySelector('#app .lockcap').textContent.includes('V001')), true, 'R-10.1');
    r = await teilen('fehler', '#shareBtn');
    t.ist('P-120/F-3 nach einem Fehler beim Teilen zählt die Ausgabe nicht hoch', await zaehler('a'), [0, 0], 'R-9.3');
    r = await teilen('ok', '#shareBtn');
    t.wahr('P-120/F-3 gesichert: Meldung ‚Ausgabe V001‘', /Ausgabe V001/.test(r), 'R-10.1');
    t.ist('P-120/F-3 nach dem Sichern zählt die Ausgabe hoch', await zaehler('a'), [1, 1], 'R-9.3');
    r = await teilen('abbrechen', '#shareBtn');
    t.wahr('P-120/F-3 nächster Versuch heißt V002, abgebrochen', /Ausgabe V002/.test(r), 'R-10.1');
    t.ist('P-120/F-3 danach bleibt es bei 1', await zaehler('a'), [1, 1], 'R-9.3');
    // Vorschau eines nicht gesperrten Reiselogbuchs
    await t.schritt(p, 'P-120/F-3 ‚Toskana‘ öffnen, Vorschau', async () => { await oeffne(p, 'b'); await p.evaluate(() => openPreview(getTrip('b'))); await p.waitForSelector('#dlg[open] #prvShare', { timeout: 4000 }); await p.waitForTimeout(500); });
    r = await teilen('abbrechen', '#prvShare');
    t.ist('P-120/F-3 Vorschau, Teilen abgebrochen: zählt nicht hoch', await zaehler('b'), [0, 0], 'R-9.3');
    await esc(p);
    // PDF (Entscheidung a): zählt erst, wenn das Drucken-Menü wirklich aufgeht (beforeprint); übergeht iOS print() (RLB-124), zählt nichts
    const pdf = async geht => { await p.evaluate(g => { window.print = g ? () => { dispatchEvent(new Event('beforeprint')); dispatchEvent(new Event('afterprint')); } : () => {}; }, geht);
      await p.evaluate(() => exportPdf(getTrip('b'))); await p.waitForTimeout(400); const r = await p.evaluate(() => dlg.textContent.replace(/\s+/g, ' ')); await esc(p); return r; };
    r = await pdf(false);
    t.wahr('P-120/F-3 PDF, Drucken-Menü geht nicht auf: Meldung ‚Ausgabe V001‘', /Ausgabe V001/.test(r), 'R-10.1');
    t.ist('P-120/F-3 PDF ohne Drucken-Menü zählt nicht hoch', await zaehler('b'), [0, 0], 'R-9.3');
    r = await pdf(true);
    t.ist('P-120/F-3 PDF mit Drucken-Menü (beforeprint) zählt hoch', await zaehler('b'), [1, 1], 'R-9.3');
    r = await pdf(false);
    t.wahr('P-120/F-3 nächstes PDF heißt V002', /Ausgabe V002/.test(r), 'R-10.1');
    t.ist('P-120/F-3 danach bleibt es bei 1', await zaehler('b'), [1, 1], 'R-9.3');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}

// ---------- P-120/F-4 Hinweis ‚gesperrt‘ ----------
if (teil('F-4')) for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { lastTrip: 'a' });
    if (await p.evaluate(() => isPhone())) await t.schritt(p, 'P-120/F-4 ‚Australien‘ öffnen', () => oeffne(p, 'a'));
    const hinweis = () => p.evaluate(() => { const i = document.querySelector('#app .lockinfo'), bar = document.querySelector('#app #bar').getBoundingClientRect(), ro = document.querySelector('#app #rolle');
      if (!i) return { da: false }; const r = i.getBoundingClientRect(), o = ro.getBoundingClientRect();
      return { da: true, sichtbar: r.top >= bar.bottom - 1 && r.bottom <= Math.min(innerHeight, o.bottom) + 1 && r.height > 0, gerollt: ro.scrollTop,
        x: !!i.querySelector('button[aria-label="Hinweis ausblenden"]') }; });
    await t.schritt(p, 'P-120/F-4 ganz nach unten rollen', async () => { await p.evaluate(() => { const r = document.querySelector('#app #rolle'); r.scrollTop = r.scrollHeight; r.dispatchEvent(new Event('scroll')); }); await p.waitForTimeout(400); });
    let h = await hinweis();
    t.ist('P-120/F-4 nach dem Rollen steht der Hinweis weiter unter der Kopfzeile (Seite gerollt)', [h.da, h.sichtbar, h.gerollt > 100], [true, true, true], 'R-2.1');
    t.ist('P-120/F-4 der Hinweis hat x ‚Hinweis ausblenden‘', h.x, true, 'R-1.8');
    if (!h.x) throw new Error('ohne x – Rest von F-4 entfällt');
    await t.schritt(p, 'P-120/F-4 x ‚Hinweis ausblenden‘', async () => { await p.click('#app .lockinfo button[aria-label="Hinweis ausblenden"]'); await p.waitForTimeout(500); });
    t.ist('P-120/F-4 nach x ist der Hinweis weg, die Vorschau bleibt', await p.evaluate(() => [!!document.querySelector('#app .lockinfo'), !!document.querySelector('#app .lockpage .rt')]), [false, true], 'R-1.1');
    await t.schritt(p, 'P-120/F-4 drehen bzw. Neuaufbau', async () => { await p.evaluate(() => render()); await p.waitForTimeout(300); });
    t.ist('P-120/F-4 nach einem Neuaufbau bleibt der Hinweis weg', await p.evaluate(() => !!document.querySelector('#app .lockinfo')), false, 'R-1.1');
    await t.schritt(p, 'P-120/F-4 ‚Toskana‘ öffnen und wieder ‚Australien‘', async () => { await oeffne(p, 'b'); await oeffne(p, 'a'); });
    t.ist('P-120/F-4 beim nächsten Öffnen ist der Hinweis wieder da', (await hinweis()).da, true, 'R-1.1');
    await t.schritt(p, 'P-120/F-4 x, dann Neustart', async () => { await p.click('#app .lockinfo button[aria-label="Hinweis ausblenden"]'); await p.waitForTimeout(300); await p.reload(); await p.waitForTimeout(500); await navFertig(p);
      if (await p.evaluate(() => isPhone())) await oeffne(p, 'a'); });
    t.ist('P-120/F-4 nach dem Neustart ist der Hinweis wieder da', (await hinweis()).da, true, 'R-1.1');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
