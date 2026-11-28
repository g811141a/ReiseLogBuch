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
// P-121/F-1 (seit 3.58.2) nach dem Sperren eines Reiselogbuchs mit offenen Tagen weiter unten beginnt die Vorschau oben · iPad quer, iPhone hoch.
// P-121/F-2 (seit 3.58.2) Teilen und PDF aus der Vorschau: die Vorschau bleibt offen, die Meldung steht darüber · iPad quer, iPhone hoch.
// P-122/F-1 (seit 3.58.3) nach dem Schließen der Meldung über der Vorschau sehen deren Schaltflächen aus wie beim Öffnen, Teilen bleibt Quelle · iPad quer, iPhone hoch.
// P-122/F-2 (seit 3.58.3, AppDesign 4.70.0) Ergebnis und Backup-Erinnerung sind Hinweis-Kästen der AD-Bean notice – über der Vorschau und im Fenster;
//   ‚Backup erstellen‘ in der Erinnerung ersetzt sie durch das Ergebnis (R-3.10 mittig prüft hig.mjs nach jedem Schritt) · iPad quer, iPhone hoch.
// P-123/F-1 (seit 3.58.4, AppDesign 4.70.1) Vorschau → Teilen gesichert, abgebrochen, PDF und Teilen → HTML direkt: der Dateiname steht im Hinweisfenster
//   in einer Zeile, das Fenster misst neu, wenn die AD-Bean notice den Inhalt einsetzt (R-10.8) · iPad quer, iPad hoch.
// P-123/F-2 (seit 3.58.4) Teilen → HTML bzw. PDF direkt und aus der Vorschau: das Ergebnis steht auf jedem Weg im Hinweisfenster, gleich hoch und so hoch
//   wie nötig (kein Blatt in voller Höhe, Designrichtlinie 10) · iPhone hoch, iPad quer.
// P-123/F-3 (seit 3.58.4) nach einer Ausgabe (Fenster mit Erinnerung geschlossen) meldet die Backup-Kachel abgebrochen bzw. gesichert wieder einen Hinweis
//   ‚Backup‘ – ebenso ohne Ausgabe vorher · iPad quer, iPhone hoch.
// P-124/F-1 (seit 3.58.5, AppDesign 4.70.2) Vorschau → Teilen, Vorschau → PDF, Teilen → HTML mit langem Titel: das Hinweisfenster ist so breit, wie der Dateiname in
//   einer Zeile braucht, höchstens Bildschirmbreite − 32 px – quer breiter als hoch (R-10.8) · iPad quer, iPad hoch.
// P-124/F-2 (seit 3.58.5) nach jeder Ausgabe – direkt, aus der Vorschau, gesperrte Seite, Neuaufbau bei offenem Teilen-Menü – ist nichts mehr getönt (R-3.3) · iPad quer, iPhone hoch.
// Grundregeln nach jedem Schritt. Aufruf im Repo-Ordner: node tests/ablauf-p120.mjs (PRUEF_TEIL=F-1 … nur ein Teil)
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/5.0.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/5.0.0/tests/hig.mjs';
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
    // seit 3.59.0 (RLB-126): ohne Abfrage nach ‚Zuletzt gelöscht‘
    await t.schritt(p, 'P-120/F-2 ‚Wien‘ lange drücken → ‚Reiselogbuch löschen‘', async () => { await lang(p, 'c'); await menuePunkt(p, 'Reiselogbuch löschen');
      await p.waitForTimeout(700); await navFertig(p); });
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
    const teilen = async (art, knopf) => { await p.evaluate(a => { window.__teilen = a; }, art); await p.click(knopf); await p.waitForSelector('#dlg[open] .step, #msg[open] .step', { timeout: 4000 }); await p.waitForTimeout(400);
      const r = await p.evaluate(() => (msg.open ? msg : dlg).textContent.replace(/\s+/g, ' ')); await esc(p); return r; };   // seit 3.58.2 aus der Vorschau in #msg (P-121/F-2)
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
      await p.evaluate(() => exportPdf(getTrip('b'))); await p.waitForTimeout(400); const r = await p.evaluate(() => (msg.open ? msg : dlg).textContent.replace(/\s+/g, ' ')); await esc(p); return r; };   // seit 3.58.4 in #msg (P-123/F-2)
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
// ---------- P-121/F-1 Sperren mit offenen Tagen weiter unten: die Vorschau beginnt oben (Rückmeldung P-121/5, Nutzer 22.11.2026) ----------
// Ein Reiselogbuch mit offenen Tagen weiter unten öffnet dort (R-7.4); nach dem Sperren (Mehr bzw. Kontextmenü) stand die Vorschau am Ende statt am Anfang.
const LANG = TRIPS.map((x, i) => i !== 1 ? { ...x, locked: undefined } : { ...x, locked: undefined, end: iso(2026, 4, 26),
  days: Object.fromEntries([...Array(18).keys()].map(d => [iso(2026, 4, 3 + d), { weather: '☀️', program: `Toskana Tag ${d + 1}\nStadtrundgang\nAbendessen am Hafen`, comment: 'Schöner Tag' }])) });
if (teil('P-121/F-1')) for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { trips: LANG, lastTrip: 'b' });
    const phone = await p.evaluate(() => isPhone());
    const y = () => p.evaluate(() => Math.round(document.querySelector('#app #rolle')?.scrollTop ?? -1));
    if (phone) await t.schritt(p, 'P-121/F-1 ‚Toskana‘ öffnen', () => oeffne(p, 'b'));
    t.wahr('P-121/F-1 ‚Toskana‘ öffnet bei den offenen Tagen weiter unten (gerollt)', await y() > 50, 'R-7.4');
    await t.schritt(p, 'P-121/F-1 Mehr → ‚Reiselogbuch sperren‘', async () => { await p.click('#mainMore'); await p.waitForSelector('.menu .mi', { timeout: 4000 }); await p.waitForTimeout(400);
      await p.locator('.menu .mi', { hasText: 'Reiselogbuch sperren' }).click(); await p.waitForTimeout(700); await navFertig(p); });
    t.ist('P-121/F-1 nach dem Sperren (Mehr) beginnt die Vorschau oben', [await p.evaluate(() => !!document.querySelector('#app .lockpage')), await y()], [true, 0], 'R-7.4');
    if (!phone) {
      await t.schritt(p, 'P-121/F-1 entsperren, ‚Mallorca‘ und wieder ‚Toskana‘ öffnen', async () => { await p.click('#lockUnlock'); await p.waitForTimeout(500); await oeffne(p, UNTEN); await oeffne(p, 'b'); });
      t.wahr('P-121/F-1 ‚Toskana‘ wieder gerollt', await y() > 50, 'R-7.4');
      await t.schritt(p, 'P-121/F-1 ‚Toskana‘ lange drücken → ‚Reiselogbuch sperren‘', async () => { await lang(p, 'b'); await menuePunkt(p, 'Reiselogbuch sperren'); });
      t.ist('P-121/F-1 nach dem Sperren (Kontextmenü) beginnt die Vorschau oben', [await p.evaluate(() => !!document.querySelector('#app .lockpage')), await y()], [true, 0], 'R-7.4');
      await t.schritt(p, 'P-121/F-1 Vorschau rollen, drehen bzw. Neuaufbau', async () => { await p.evaluate(() => { const r = document.querySelector('#app #rolle'); r.scrollTop = 300; r.dispatchEvent(new Event('scroll')); render(); }); await p.waitForTimeout(300); });
      t.wahr('P-121/F-1 beim Neuaufbau bleibt die gerollte Vorschau stehen', Math.abs(await y() - 300) <= 2, 'R-8.1');
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}

// ---------- P-121/F-2 Teilen und PDF aus der Vorschau: die Vorschau bleibt, die Meldung steht darüber (Rückmeldung P-121/8, Nutzer 22.11.2026) ----------
if (teil('P-121/F-2')) for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { trips: TRIPS.map(x => ({ ...x, locked: undefined })), lastTrip: 'b' });
    if (await p.evaluate(() => isPhone())) await oeffne(p, 'b');
    const lage = () => p.evaluate(() => ({ vorschau: dlg.open && !!dlg.querySelector('#prvShare'), meldung: msg.open, text: msg.open ? msg.textContent.replace(/\s+/g, ' ') : '',
      oben: msg.open && dlg.open ? (() => { const r = msg.querySelector('.dlg-head, h3').getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!e && msg.contains(e); })() : false }));
    const vorschau = async () => { await p.evaluate(() => openPreview(getTrip('b'))); await p.waitForSelector('#dlg[open] #prvShare', { timeout: 4000 }); await p.waitForTimeout(500); };
    for (const [art, knopf, name] of [['abbrechen', '#prvShare', 'Teilen abgebrochen'], ['ok', '#prvShare', 'Teilen gesichert'], ['', '#prvPdf', 'PDF']]) {
      await t.schritt(p, `P-121/F-2 Vorschau → ${name}`, async () => { await vorschau(); await p.evaluate(a => { window.__teilen = a || 'ok'; }, art); await p.click(knopf); await p.waitForTimeout(700); });
      let l = await lage();
      t.ist(`P-121/F-2 ${name}: die Vorschau bleibt offen, die Meldung ‚Ausgabe V…‘ steht darüber`, [l.vorschau, l.meldung, /Ausgabe V\d{3}/.test(l.text), l.oben], [true, true, true, true], 'R-4.4');
      await t.schritt(p, `P-121/F-2 ${name}: Meldung schließen`, async () => { await p.click('#msg [data-x]'); await p.waitForTimeout(500); });
      l = await lage();
      t.ist(`P-121/F-2 ${name}: nach dem Schließen der Meldung ist die Vorschau wieder da`, [l.vorschau, l.meldung], [true, false], 'R-4.4');
      await esc(p);
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// ---------- P-122/F-1 nach dem Hinweisfenster über der Vorschau sehen die Schaltflächen aus wie beim Öffnen (Rückmeldung P-122/2, Nutzer 22.11.2026) ----------
// Ablauf des Nutzers: Teilen (Kopfzeile) → ‚Vorschau‘ → Teilen bzw. PDF → Meldung ‚Ausgabe V…‘ → x. Vorher blieb #prvShare getönt (Klasse on statt blau
// gefüllt) und Teilen der Kopfzeile verlor die Tönung als Quelle der Vorschau (R-3.3); dieselbe Lücke bei PDF und nach dem Schließen der Vorschau.
if (teil('P-122/F-1')) for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { trips: TRIPS.map(x => ({ ...x, locked: undefined })), lastTrip: 'b' });
    if (await p.evaluate(() => isPhone())) await oeffne(p, 'b');
    const bild = () => p.evaluate(() => { const k = s => { const e = document.querySelector(s); return e ? [e.className, getComputedStyle(e).backgroundColor, getComputedStyle(e).color].join(' | ') : '–'; };
      return { share: k('#prvShare'), pdf: k('#prvPdf'), quelle: document.querySelector('#shareBtn')?.classList.contains('on') ?? null }; });
    const vorschau = async () => { await p.click('#shareBtn'); await p.waitForSelector('.menu .mi', { timeout: 4000 }); await p.waitForTimeout(400);
      await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); await p.waitForSelector('#dlg[open] #prvShare', { timeout: 4000 }); await p.waitForTimeout(600); };
    for (const [art, knopf, name] of [['ok', '#prvShare', 'Teilen gesichert'], ['abbrechen', '#prvShare', 'Teilen abgebrochen'], ['', '#prvPdf', 'PDF']]) {
      await t.schritt(p, `P-122/F-1 Teilen → ‚Vorschau‘ (${name})`, vorschau);
      const vor = await bild();
      t.ist(`P-122/F-1 ${name}: beim Öffnen der Vorschau ist Teilen der Kopfzeile als Quelle getönt`, vor.quelle, true, 'R-3.3');
      await t.schritt(p, `P-122/F-1 ${name} antippen`, async () => { await p.evaluate(a => { window.__teilen = a || 'ok'; }, art); await p.click(knopf); await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); });
      await t.schritt(p, `P-122/F-1 ${name}: Meldung mit x schließen`, async () => { await p.click('#msg [data-x]'); await p.waitForTimeout(700); });
      const nach = await bild();
      t.ist(`P-122/F-1 ${name}: nach dem Schließen der Meldung sehen Teilen und PDF der Vorschau aus wie beim Öffnen`, [nach.share, nach.pdf], [vor.share, vor.pdf], 'R-3.3');
      t.ist(`P-122/F-1 ${name}: Teilen der Kopfzeile bleibt Quelle der offenen Vorschau`, nach.quelle, true, 'R-3.3');
      await t.schritt(p, `P-122/F-1 ${name}: Vorschau schließen`, async () => { await p.click('#dlgX'); await p.waitForTimeout(800); });
      t.ist(`P-122/F-1 ${name}: nach dem Schließen der Vorschau ist nichts mehr getönt`, await p.evaluate(() => [adSourcehighlight.sourceItem, adSourcehighlight.heldItems.length, document.querySelectorAll('.on').length]), [ '', 0, 0], 'R-3.3');
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// ---------- P-122/F-2 Ergebnis und Erinnerung über die AD-Bean notice (AppDesign 4.70.0, Nutzer 22.11.2026, Sitzung 0159) ----------
// Teilen (Kopfzeile) → ‚Vorschau‘ → Teilen gesichert → Hinweisfenster mit zwei Kästen (Ergebnis, Erinnerung); ‚Backup erstellen‘ → in der Erinnerung steht das
// Ergebnis des Backups, keine Schaltfläche mehr. Dann Teilen (Kopfzeile) → ‚HTML‘ → Fenster ‚Ausgabe V…‘ mit denselben Kästen. Mittig: hig.mjs (R-3.10).
if (teil('P-122/F-2')) for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { trips: TRIPS.map(x => ({ ...x, locked: undefined })), lastTrip: 'b' });
    if (await p.evaluate(() => isPhone())) await oeffne(p, 'b');
    const kaesten = sel => p.evaluate(s => [...document.querySelectorAll(`${s} .ad-notice`)].map(k => ({ id: k.id, bean: k.dataset.adBean,
      text: k.textContent.replace(/\s+/g, ' ').trim(), knoepfe: [...k.querySelectorAll('button')].map(x => x.textContent.trim()) })), sel);
    await t.schritt(p, 'P-122/F-2 Teilen → ‚Vorschau‘', async () => { await p.click('#shareBtn'); await p.waitForSelector('.menu .mi', { timeout: 4000 }); await p.waitForTimeout(400);
      await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); await p.waitForSelector('#dlg[open] #prvShare', { timeout: 4000 }); await p.waitForTimeout(600); });
    await t.schritt(p, 'P-122/F-2 Teilen der Vorschau (gesichert)', async () => { await p.evaluate(() => { window.__teilen = 'ok'; }); await p.click('#prvShare');
      await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); });
    const ueber = await kaesten('#msg');
    t.ist('P-122/F-2 über der Vorschau: zwei Kästen der AD-Bean notice', ueber.map(k => [k.id, k.bean]), [['result', 'notice'], ['reminder', 'notice']], 'R-1.13');
    t.ist('P-122/F-2 über der Vorschau: Ergebnis', ueber[0]?.text || '', /^✅ Teilen-Menü abgeschlossen für/, 'R-3.10');
    t.ist('P-122/F-2 über der Vorschau: Erinnerung mit ‚Backup erstellen‘', [ueber[1]?.text || '', ueber[1]?.knoepfe], [/^💾 Denk daran, auch ein Backup zu erstellen\./, ['Backup erstellen']], 'R-3.10');
    await t.schritt(p, 'P-122/F-2 ‚Backup erstellen‘ in der Erinnerung', async () => { await p.evaluate(() => { window.__teilen = 'ok'; }); await p.click('#msg #backupNow'); await p.waitForTimeout(900); });
    const backup = await kaesten('#msg');   // seit 3.58.4 (P-123/F-3): das Ergebnis steht in der Erinnerung, kein eigenes Hinweisfenster ‚Backup‘ mehr
    t.ist('P-122/F-2 über der Vorschau nach dem Backup: Erinnerung zeigt das Ergebnis, keine Schaltfläche', [backup[1]?.text || '', backup[1]?.knoepfe, await p.evaluate(() => document.getElementById('msgTitel')?.textContent || '')],
      [/^✅ Teilen-Menü abgeschlossen für.*Backup/, [], /^Ausgabe V\d{3}$/], 'R-9.1');
    await esc(p);
    await t.schritt(p, 'P-122/F-2 Backup zurücksetzen, Teilen → ‚HTML‘ (gesichert)', async () => {
      await p.evaluate(() => { delete db.settings.lastBackup; save(); window.__teilen = 'ok'; });
      await p.click('#shareBtn'); await p.waitForSelector('.menu .mi', { timeout: 4000 }); await p.waitForTimeout(400);
      await p.locator('.menu .mi', { hasText: 'HTML' }).click(); await p.waitForSelector('#msg[open] .ad-notice', { timeout: 4000 }); await p.waitForTimeout(600); });
    const fenster = await kaesten('#msg');   // seit 3.58.4 (P-123/F-2) auch direkt über Teilen im Hinweisfenster
    t.ist('P-122/F-2 im Hinweisfenster ‚Ausgabe V…‘ (direkt über Teilen): zwei Kästen der AD-Bean notice', fenster.map(k => [k.id, k.bean, k.knoepfe.length]), [['result', 'notice', 0], ['reminder', 'notice', 1]], 'R-1.13');
    await t.schritt(p, 'P-122/F-2 ‚Backup erstellen‘ in der Erinnerung (direkt über Teilen)', async () => { await p.evaluate(() => { window.__teilen = 'ok'; }); await p.click('#msg #backupNow'); await p.waitForTimeout(900); });
    const danach = await kaesten('#msg');
    t.ist('P-122/F-2 direkt über Teilen nach dem Backup: Erinnerung zeigt das Ergebnis, keine Schaltfläche', [danach[1]?.text || '', danach[1]?.knoepfe], [/^✅ Teilen-Menü abgeschlossen für.*Backup/, []], 'R-9.1');
    await esc(p);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// ---------- P-123 Rückmeldung zu Usertest P-123 (Reiselogbuch 3.58.3, Nutzer 22.11.2026, Sitzung 0159) – je genau der Ablauf des Nutzers ----------
const OFFEN = TRIPS.map(x => ({ ...x, locked: undefined }));
const teilenMenue = async (p, punkt) => { await p.click('#shareBtn'); await p.waitForSelector('.menu .mi', { timeout: 4000 }); await p.waitForTimeout(400);
  await p.locator('.menu .mi', { hasText: punkt }).click(); await p.waitForTimeout(700); };
const zurVorschau = async p => { await teilenMenue(p, 'Vorschau'); await p.waitForSelector('#dlg[open] #prvShare', { timeout: 4000 }); await p.waitForTimeout(500); };
// Zeilen des Dateinamens (.fname, Wörter .fw) und Breite des Fensters, in dem er steht
const dateiname = (p, sel) => p.evaluate(s => { const d = document.querySelector(s), n = d?.querySelector('.fname');
  return { da: !!n, zeilen: n ? new Set([...n.querySelectorAll('.fw')].map(w => Math.round(w.getBoundingClientRect().top))).size : 0, breite: Math.round(d?.getBoundingClientRect().width || 0) }; }, sel);
// P-123/F-1 (zu /2, iPad): Vorschau → Teilen bzw. PDF → das Hinweisfenster ‚Ausgabe V…‘ ist schmal, der Dateiname bricht um; direkt über Teilen → HTML steht
// er in einer Zeile (R-10.8). Ursache: alert misst die Breite (fitFileName) beim Öffnen, die AD-Bean notice setzt den Dateinamen erst danach ein.
if (teil('P-123/F-1')) for (const ansicht of ['iPad quer', 'iPad hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { trips: OFFEN, lastTrip: 'b' });
    for (const [art, knopf, name] of [['ok', '#prvShare', 'Teilen gesichert'], ['abbrechen', '#prvShare', 'Teilen abgebrochen'], ['', '#prvPdf', 'PDF']]) {
      await t.schritt(p, `P-123/F-1 Teilen → ‚Vorschau‘ → ${name}`, async () => { await zurVorschau(p); await p.evaluate(a => { window.__teilen = a || 'ok'; }, art);
        await p.click(knopf); await p.waitForSelector('#msg[open] .fname', { timeout: 4000 }); await p.waitForTimeout(600); });
      const vor = await dateiname(p, '#msg');
      await p.evaluate(() => { adAlert.fitFileName = true; });   // die Bean misst neu (Setter) – so breit hätte das Fenster sein sollen
      const neu = await dateiname(p, '#msg');
      t.ist(`P-123/F-1 ${ansicht}, ${name}: im Hinweisfenster über der Vorschau steht der Dateiname in einer Zeile`, vor.zeilen, 1, 'R-10.8');
      t.ist(`P-123/F-1 ${ansicht}, ${name}: das Hinweisfenster ist schon beim Öffnen so breit wie nach erneutem Messen`, vor.breite, neu.breite, 'R-10.8');
      await esc(p);
    }
    await t.schritt(p, 'P-123/F-1 Teilen → ‚HTML‘ (gesichert)', async () => { await p.evaluate(() => { window.__teilen = 'ok'; }); await teilenMenue(p, 'HTML');
      await p.waitForSelector('dialog[open] .fname', { timeout: 4000 }); await p.waitForTimeout(600); });
    const direkt = await dateiname(p, 'dialog[open]');
    t.ist(`P-123/F-1 ${ansicht}, direkt über Teilen → HTML: Dateiname in einer Zeile`, direkt.zeilen, 1, 'R-10.8');
    await esc(p);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// P-123/F-2 (zu /2, iPhone): direkt über Teilen → HTML bzw. PDF steht das Ergebnis in voller Bildschirmhöhe, aus der Vorschau nur so hoch wie nötig –
// einheitlich: dasselbe Fenster, gleich hoch, nicht über die ganze Höhe (gleiche Lage: Backup vor 3 Tagen, Ergebnis und Erinnerung).
if (teil('P-123/F-2')) for (const ansicht of ['iPhone hoch', 'iPad quer']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { trips: OFFEN, lastTrip: 'b' });
    if (await p.evaluate(() => isPhone())) await oeffne(p, 'b');
    const ergebnis = () => p.evaluate(() => { const d = [...document.querySelectorAll('dialog[open]')].find(x => x.querySelector('#result'));
      return { fenster: d?.id || '', hoehe: Math.round(d?.getBoundingClientRect().height || 0), bild: innerHeight }; });
    const mass = [];
    for (const [weg, name] of [['HTML', 'Teilen → HTML'], ['PDF', 'Teilen → PDF'], ['#prvShare', 'Vorschau → Teilen'], ['#prvPdf', 'Vorschau → PDF']]) {
      await t.schritt(p, `P-123/F-2 ${name}`, async () => { await p.evaluate(() => { window.__teilen = 'ok'; });
        if (weg.startsWith('#')) { await zurVorschau(p); await p.click(weg); } else await teilenMenue(p, weg);
        await p.waitForSelector('dialog[open] #result.ad-notice', { timeout: 4000 }); await p.waitForTimeout(700); });
      mass.push(await ergebnis());
      await esc(p);
    }
    const [a, b2, c, d] = mass;
    t.ist(`P-123/F-2 ${ansicht}: das Ergebnis steht auf allen vier Wegen im selben Fenster`, [a.fenster, b2.fenster, d.fenster], [c.fenster, c.fenster, c.fenster], 'R-10.8');
    t.wahr(`P-123/F-2 ${ansicht}: direkt über Teilen ist das Ergebnis so hoch wie aus der Vorschau (${a.hoehe}/${b2.hoehe} zu ${c.hoehe}/${d.hoehe} px)`,
      Math.abs(a.hoehe - c.hoehe) <= 4 && Math.abs(b2.hoehe - d.hoehe) <= 4, 'R-10.8');
    t.wahr(`P-123/F-2 ${ansicht}: das Ergebnis steht nicht in voller Bildschirmhöhe (${a.hoehe} von ${a.bild} px)`, a.hoehe < a.bild * 0.7, 'R-10.8');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// P-123/F-3 (zu /3, iPad): ‚Backup erstellen‘ (Kachel) → Teilen-Menü abbrechen → am iPad kein Hinweis, am iPhone schon. Ablauf des Nutzers: vorher /2 –
// Teilen → HTML, Fenster ‚Ausgabe V…‘ mit der Backup-Erinnerung, schließen; danach fragt saveBackup das geschlossene Fenster nach #reminder und schweigt.
if (teil('P-123/F-3')) for (const ansicht of ['iPad quer', 'iPhone hoch']) for (const vorher of [true, false]) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { trips: OFFEN, lastTrip: 'b' });
    const phone = await p.evaluate(() => isPhone());
    const was = vorher ? 'nach Teilen → HTML' : 'ohne Ausgabe vorher';
    if (vorher) {
      if (phone) await oeffne(p, 'b');
      await t.schritt(p, 'P-123/F-3 Teilen → ‚HTML‘ (gesichert), Fenster mit x schließen', async () => { await p.evaluate(() => { window.__teilen = 'ok'; }); await teilenMenue(p, 'HTML');
        await p.waitForSelector('dialog[open] #reminder', { timeout: 4000 }); await p.waitForTimeout(500); await esc(p); });
      await zurStartliste(p);
    }
    for (const [art, erwartet] of [['abbrechen', /^⚠️/], ['ok', /^✅ Teilen-Menü abgeschlossen für.*Backup/]]) {
      await t.schritt(p, `P-123/F-3 ${was}: ‚Backup erstellen‘ (Kachel), Teilen-Menü ${art === 'ok' ? 'gesichert' : 'abgebrochen'}`, async () => {
        await p.evaluate(a => { window.__teilen = a; }, art); await p.click('#hintBackup'); await p.waitForTimeout(900); });
      const m = await p.evaluate(() => [msg.open, document.getElementById('msgTitel')?.textContent || '', document.getElementById('msgText')?.textContent.replace(/\s+/g, ' ').trim() || '']);
      t.ist(`P-123/F-3 ${ansicht}, ${was}: Hinweis ‚Backup‘ nach ${art === 'ok' ? 'gesichertem' : 'abgebrochenem'} Teilen-Menü`, m, [true, 'Backup', erwartet], 'R-9.1');
      await esc(p);
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// ---------- P-124 Rückmeldung zu Usertest P-124 (Reiselogbuch 3.58.4, Nutzer 26.11.2026, Sitzung 0161) – je genau der Ablauf des Nutzers ----------
// P-124/F-1 (zu /1, iPad): ‚Test‘ (langer Titel) → Teilen → ‚Vorschau‘ → Teilen gesichert bzw. PDF, dazu Teilen → ‚HTML‘ direkt: das Hinweisfenster ‚Ausgabe V…‘
// nutzt die mögliche Breite nicht, der Dateiname bricht um, quer gleich breit wie hoch. Teil P-123/F-1 war grün, weil seine Titel kurz sind (der Name passt
// schon in 600 px) und er nur gegen das erneute Messen derselben Bean vergleicht. Soll: so breit wie der Name in einer Zeile, höchstens Bildschirmbreite − 32 px.
const TITEL_LANG = 'Rundreise Schottland und Hebriden', TITEL_SEHR_LANG = 'Große Rundreise durch Schottland, die Hebriden und Orkney';
const namensmass = (p, sel) => p.evaluate(s => { const d = document.querySelector(s), n = d?.querySelector('.fname'); if (!n) return null;
  const probe = n.cloneNode(true); probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;display:inline-block;width:auto;left:0;top:0';
  n.parentNode.append(probe); const name = probe.getBoundingClientRect().width; probe.remove();
  const breite = d.getBoundingClientRect().width, rand = breite - n.getBoundingClientRect().width;
  return { name: Math.round(name), rand: Math.round(rand), breite: Math.round(breite), bild: innerWidth,
    zeilen: new Set([...n.querySelectorAll('.fw')].map(w => Math.round(w.getBoundingClientRect().top))).size }; }, sel);
if (teil('P-124/F-1')) for (const ansicht of ['iPad quer', 'iPad hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    for (const titel of [TITEL_LANG, TITEL_SEHR_LANG]) {
      await lade(p, { trips: OFFEN.map(x => x.id === 'b' ? { ...x, title: titel } : x), lastTrip: 'b' });
      const was = titel === TITEL_LANG ? 'langer Titel' : 'sehr langer Titel';
      for (const [weg, art, name] of [['#prvShare', 'ok', 'Vorschau → Teilen gesichert'], ['#prvPdf', '', 'Vorschau → PDF'], ['HTML', 'ok', 'Teilen → HTML']]) {
        await t.schritt(p, `P-124/F-1 ${was}: ${name}`, async () => { await p.evaluate(a => { window.__teilen = a || 'ok'; }, art);
          if (weg.startsWith('#')) { await zurVorschau(p); await p.click(weg); } else await teilenMenue(p, weg);
          await p.waitForSelector('#msg[open] .fname', { timeout: 4000 }); await p.waitForTimeout(600); });
        const m = await namensmass(p, '#msg');
        const soll = Math.min(m.name + m.rand + 1, m.bild - 32);
        if (titel === TITEL_LANG) t.wahr(`P-124/F-1 Testdaten: der Dateiname (${m.name} px) ist länger, als ins breite Hinweisfenster (600 px) passt`, m.name + m.rand > 600, 'R-10.8');
        else t.wahr(`P-124/F-1 Testdaten: der Dateiname (${m.name} px) passt nur quer in eine Zeile`, m.name + m.rand > 820 - 32 && m.name + m.rand < 1180 - 32, 'R-10.8');
        if (m.name + m.rand <= m.bild - 32) t.ist(`P-124/F-1 ${ansicht}, ${was}, ${name}: der Dateiname steht in einer Zeile`, m.zeilen, 1, 'R-10.8');
        t.ist(`P-124/F-1 ${ansicht}, ${was}, ${name}: das Hinweisfenster ist so breit wie möglich (Name in einer Zeile, höchstens Bildschirmbreite − 32 px = ${m.bild - 32} px)`,
          m.breite, w => Math.abs(w - soll) <= 2, 'R-10.8');
        await esc(p);
      }
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// P-124/F-2 (zu /1, iPad): nach dem Sichern aus der Vorschau und dem Verlassen der Vorschau ist Teilen (Kopfzeile) noch hellblau. Der Ablauf des Nutzers in der
// Reihenfolge des Usertests P-124 (/1 Vorschau → Teilen, Vorschau → PDF; /2 Teilen → HTML, Vorschau → Teilen; /3 Backup aus der Erinnerung), dazu die übrigen Wege;
// nach jedem Weg sind alle Fenster zu und nichts ist mehr getönt (R-3.3).
if (teil('P-124/F-2')) for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { trips: OFFEN.map(x => x.id === 'b' ? { ...x, title: TITEL_LANG } : x), lastTrip: 'b' });
    if (await p.evaluate(() => isPhone())) await oeffne(p, 'b');
    const getoent = () => p.evaluate(() => ({ fenster: [...document.querySelectorAll('dialog[open]')].map(d => d.id), teilen: document.querySelector('#shareBtn')?.classList.contains('on') ?? null,
      quelle: adSourcehighlight.sourceItem, gehalten: adSourcehighlight.heldItems.length, on: [...document.querySelectorAll('.on')].map(e => e.id || e.className.split(' ')[0]) }));
    const xMeldung = async () => { await p.click('#msg [data-x]'); await p.waitForTimeout(700); };
    const xVorschau = async () => { await p.click('#dlgX'); await p.waitForTimeout(800); };
    const wege = [
      ['Vorschau → Teilen gesichert → x → Vorschau x', async () => { await p.evaluate(() => { window.__teilen = 'ok'; }); await zurVorschau(p); await p.click('#prvShare'); await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); await xMeldung(); await xVorschau(); }],
      ['Vorschau → PDF → x → Vorschau x', async () => { await zurVorschau(p); await p.click('#prvPdf'); await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); await xMeldung(); await xVorschau(); }],
      ['Teilen → HTML gesichert → x', async () => { await p.evaluate(() => { window.__teilen = 'ok'; }); await teilenMenue(p, 'HTML'); await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); await xMeldung(); }],
      ['Vorschau → Teilen gesichert → x → Vorschau x (nach Teilen → HTML)', async () => { await p.evaluate(() => { window.__teilen = 'ok'; }); await zurVorschau(p); await p.click('#prvShare'); await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); await xMeldung(); await xVorschau(); }],
      ['Vorschau → Teilen gesichert → ‚Backup erstellen‘ → x → Vorschau x', async () => { await p.evaluate(() => { delete db.settings.lastBackup; save(); window.__teilen = 'ok'; }); await zurVorschau(p); await p.click('#prvShare');
        await p.waitForSelector('#msg[open] #backupNow', { timeout: 4000 }); await p.waitForTimeout(600); await p.click('#msg #backupNow'); await p.waitForTimeout(900); await xMeldung(); await xVorschau(); }],
      ['Teilen → PDF → x', async () => { await teilenMenue(p, 'PDF'); await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); await xMeldung(); }],
      ['Teilen → HTML abgebrochen → x', async () => { await p.evaluate(() => { window.__teilen = 'abbrechen'; }); await teilenMenue(p, 'HTML'); await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); await xMeldung(); }],
      // Neuaufbau der Kopfzeile, während das Teilen-Menü offen ist (z. B. Abgleich, Tageswechsel): das Menü hält die alte Schaltfläche, refresh tönt die neue –
      // release(alt) gibt sie nicht mehr frei (Ursache von P-124/F-2 nach der Vorschau, in der Nachbildung belegt; was den Neuaufbau am Gerät auslöst: Vermutung)
      ['Teilen (Neuaufbau bei offenem Menü) → Vorschau → Teilen gesichert → x → Vorschau x', async () => { await p.evaluate(() => { window.__teilen = 'ok'; });
        await p.click('#shareBtn'); await p.waitForSelector('.menu .mi', { timeout: 4000 }); await p.waitForTimeout(400); await p.evaluate(() => render());
        await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); await p.waitForSelector('#dlg[open] #prvShare', { timeout: 4000 }); await p.waitForTimeout(500);
        await p.click('#prvShare'); await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); await xMeldung(); await xVorschau(); }],
      ['Vorschau → Teilen abgebrochen → x → Vorschau x', async () => { await p.evaluate(() => { window.__teilen = 'abbrechen'; }); await zurVorschau(p); await p.click('#prvShare'); await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); await xMeldung(); await xVorschau(); }],
    ];
    for (const [name, los] of wege) {
      await t.schritt(p, `P-124/F-2 ${name}`, los);
      const g = await getoent();
      t.ist(`P-124/F-2 ${ansicht}, ${name}: alle Fenster zu, Teilen (Kopfzeile) nicht mehr getönt, keine Quelle`, [g.fenster, g.teilen, g.quelle, g.gehalten, g.on], [[], false, '', 0, []], 'R-3.3');
      await esc(p);
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// P-124/F-2 dieselbe Lücke: gesperrte Seite (oben ‚PDF‘ und Teilen, ohne Vorschau) – während das Hinweisfenster offen ist, ist die angetippte Schaltfläche die
// Quelle (PDF tönt nicht Teilen), danach ist nichts mehr getönt (R-3.3).
if (teil('P-124/F-2')) for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p, { lastTrip: 'a' });
    await oeffne(p, 'a');
    const on = () => p.evaluate(() => ({ fenster: [...document.querySelectorAll('dialog[open]')].map(d => d.id), on: [...document.querySelectorAll('#app .on, .nb .on')].map(e => e.id).sort() }));
    for (const [knopf, art, name] of [['#shareBtn', 'ok', 'Teilen gesichert'], ['#pdfBtn', '', 'PDF'], ['#shareBtn', 'abbrechen', 'Teilen abgebrochen']]) {
      await t.schritt(p, `P-124/F-2 gesperrt: ${name}`, async () => { await p.evaluate(a => { window.__teilen = a || 'ok'; }, art); await p.click(knopf);
        await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.waitForTimeout(600); });
      const offen = await on();
      t.ist(`P-124/F-2 ${ansicht}, gesperrt, ${name}: im Hinweisfenster ist nur die angetippte Schaltfläche getönt`, offen.on, [knopf.slice(1)], 'R-3.3');
      await t.schritt(p, `P-124/F-2 gesperrt, ${name}: Hinweisfenster mit x schließen`, async () => { await p.click('#msg [data-x]'); await p.waitForTimeout(700); });
      const zu = await on();
      t.ist(`P-124/F-2 ${ansicht}, gesperrt, ${name}: danach alle Fenster zu, nichts getönt`, [zu.fenster, zu.on, await p.evaluate(() => adSourcehighlight.sourceItem)], [[], [], ''], 'R-3.3');
      await esc(p);
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
