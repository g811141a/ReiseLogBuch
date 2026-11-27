// Reiselogbuch-Test: ablauf-seitenleiste-drehen (seit 3.59.1, RLB-128, R-8.1) – beim Drehen bleibt die Liste der Seitenleiste (iPhone: Startliste)
// stehen; vorher rollte keepSideScroll nach dem Neuaufbau den gewählten Eintrag ins Bild (gemessen mit 3.59.0: scrollTop 400 → 39, in ‚Zuletzt
// gelöscht‘ 400 → 48 – AppDesign arbeit/APD-154 Testfall-Liste.md Abschnitte 1 und 2). Testfall-Liste AppDesign arbeit/RLB-128 Testfall-Liste.md:
// RLB-128/T-1 gewählter Eintrag oberhalb weggerollt, RLB-128/T-2 unterhalb, RLB-128/T-3 ‚Zuletzt gelöscht‘, RLB-128/T-4 Kontextmenü an der untersten sichtbaren Kachel, RLB-128/T-5 Sprechblase
// ‚Endgültig löschen‘, RLB-128/T-6 Auswahl über die Suche ändern (rollt ins Bild wie bisher), RLB-128/T-7 große Schrift (AX5), RLB-128/T-8 wenige Einträge, RLB-128/T-9 iPhone.
// iPad quer → hoch → quer und hoch → quer → hoch; nach jedem Drehen die Grundregeln (t.schritt). Gegen 3.59.0 rot: PRUEF_APP=../<Datei mit 3.59.0>.
// Aufruf im Repo-Ordner: node tests/ablauf-seitenleiste-drehen.mjs
import * as pw from 'playwright';
import { pruefung, navFertig, ruhe } from '../../AppDesign/fassung/4.71.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.71.0/tests/hig.mjs';
import { langDruecken, menueZu, sucheAuf, textGroesseSetzen } from '../../AppDesign/fassung/4.71.0/tests/ablauf.mjs';
const t = pruefung('ablauf-seitenleiste-drehen', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.dlg-body.preview a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const KEY = 'reiselogbuch.v1';
const reise = (i, n = i) => ({ id: 't' + i, title: 'Reise ' + (i + 1), participants: 'A', start: `${2026 - n}-06-01`, end: `${2026 - n}-06-10`, transport: ['pkw'], days: { [`${2026 - n}-06-02`]: { program: 'Stadt ' + i } } });
const TRIPS = Array.from({ length: 14 }, (_, i) => reise(i));
// 14 gelöschte (AD-Bean recentlydeleted): z0 zuletzt gelöscht (steht oben und ist am iPad gleich offen)
const GELOESCHT = Array.from({ length: 14 }, (_, i) => ({ ...reise(i), id: 'z' + i, title: 'Gelöscht ' + (i + 1) }));
const ruhig = async p => { await navFertig(p); await ruhe(p); };
const lade = async (p, { trips = TRIPS, deleted = [], lastTrip = trips[0]?.id } = {}) => {
  await p.clock.setFixedTime(new Date('2026-06-05T10:00:00'));
  await p.goto(APP);
  const jetzt = Date.parse('2026-06-05T10:00:00');
  await p.evaluate(([k, trips, deleted, lastTrip, jetzt]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify({ settings: { lastBackup: jetzt, lastTrip }, trips,
    deleted: deleted.map((x, i) => ({ id: x.id, at: jetzt - (i + 1) * 60000, on: 'iPad' })),
    recentlyDeleted: deleted.map((x, i) => ({ id: x.id, item: x, at: jetzt - (i + 1) * 60000, on: 'iPad' })) })); }, [KEY, trips, deleted, lastTrip, jetzt]);
  await p.reload(); await p.waitForTimeout(400); await ruhig(p);
  if (await p.locator('#side').isHidden()) { await p.click('[aria-label="Seitenleiste einblenden"]'); await p.waitForTimeout(400); await ruhig(p); }
};
const rolleListe = async (p, y) => { await p.locator('#side .side-list').evaluate((l, y) => { l.scrollTop = y; l.dispatchEvent(new Event('scroll')); }, y); await p.waitForTimeout(200); };
// Lage der Liste: scrollTop, oberster sichtbarer Eintrag und sein Abstand zur Oberkante der Liste, Rollweg
const lage = p => p.evaluate(() => {
  const l = document.querySelector('#side .side-list'), lr = l.getBoundingClientRect();
  const oben = [...l.querySelectorAll('[data-id]')].find(r => r.getBoundingClientRect().bottom > lr.top + 1);
  return { top: Math.round(l.scrollTop), oben: oben?.dataset.id || null, ab: oben ? Math.round(oben.getBoundingClientRect().top - lr.top) : 0, max: Math.round(l.scrollHeight - l.clientHeight) };
});
// Kachel ganz sichtbar: innerhalb der Liste und über der Backup-Kachel (bei großer Schrift genügt ihr Anfang, wie keepSideScroll)
const sichtbar = (p, id) => p.evaluate(id => {
  const l = document.querySelector('#side .side-list'), r = l?.querySelector(id ? `[data-id="${id}"]` : '.side-row.current');
  if (!r) return false;
  const lr = l.getBoundingClientRect(), b = r.getBoundingClientRect(), k = document.querySelector('#side .bhint')?.getBoundingClientRect();
  const unten = Math.min(lr.bottom, k ? k.top : lr.bottom);
  return b.top >= lr.top - 1 && (b.bottom <= unten + 1 || (b.height > unten - lr.top - 12 && b.top < unten - 40));
}, id);
const sichtbareIds = p => p.evaluate(() => {
  const l = document.querySelector('#side .side-list'), lr = l.getBoundingClientRect(), k = document.querySelector('#side .bhint')?.getBoundingClientRect();
  const unten = Math.min(lr.bottom, k ? k.top : lr.bottom);
  return [...l.querySelectorAll('[data-id]')].filter(r => { const b = r.getBoundingClientRect(); return b.top >= lr.top - 1 && b.bottom <= unten + 1; }).map(r => r.dataset.id);
});
const drehe = async p => { const v = p.viewportSize(); await p.setViewportSize({ width: v.height, height: v.width }); await p.waitForTimeout(700); await ruhig(p); };
const name = s => s === 'quer' ? 'quer → hoch → quer' : 'hoch → quer → hoch';
// Liste steht (verglichen mit der Lage vor diesem Drehen): oben derselbe Eintrag im selben Abstand ±2 px – bei gleich hohen Kacheln heißt das scrollTop
// ±2 px; bei großer Schrift ändern sich mit der Breite die Höhen der Kacheln, dann zählt der oberste Eintrag. Hat die neue Lage weniger Rollweg, steht
// die Liste am Ende (wie UIKit: der Browser kürzt scrollTop, beim Zurückdrehen bleibt es dabei).
const steht = (vor, nach) => vor.top > nach.max + 2 ? Math.abs(nach.top - nach.max) <= 2 : nach.oben === vor.oben && Math.abs(nach.ab - vor.ab) <= 2;
const b = await t.browser();

// RLB-128/T-1, RLB-128/T-2, RLB-128/T-3, RLB-128/T-7, RLB-128/T-8: Liste gerollt (bzw. kurz), drehen – die Liste steht nach jedem Drehen
const faelle = [
  { nr: 'RLB-128/T-1', was: 'Reiselogbücher, gewählter Eintrag oberhalb weggerollt', lade: {}, rolle: 400 },
  { nr: 'RLB-128/T-2', was: 'Reiselogbücher, gewählter Eintrag unterhalb weggerollt', lade: { lastTrip: 't13' }, rolle: 0 },
  { nr: 'RLB-128/T-3', was: '‚Zuletzt gelöscht‘ gerollt', lade: { deleted: GELOESCHT }, zuletzt: true, rolle: 400 },
  { nr: 'RLB-128/T-7', was: 'große Schrift (AX5), Liste gerollt', lade: {}, ts: 'ax5', rolle: 900 },
  { nr: 'RLB-128/T-8', was: 'wenige Einträge (3), Liste rollt nicht', lade: { trips: TRIPS.slice(0, 3), lastTrip: 't2' }, rolle: 0 }];
for (const f of faelle) for (const start of ['quer', 'hoch']) {
  const p = await t.seite(b, `iPad ${start}`);
  await lade(p, f.lade);
  if (f.ts) await textGroesseSetzen(p, f.ts);
  if (f.zuletzt) { await p.click('#side .ad-recentlydeleted-entry'); await p.waitForTimeout(400); await ruhig(p); }
  await rolleListe(p, f.rolle);
  let vor = await lage(p);
  if (f.nr === 'RLB-128/T-1' || f.nr === 'RLB-128/T-3') t.ist(`${f.nr} ${start}: der gewählte Eintrag ist vor dem Drehen weggerollt`, await sichtbar(p), false);
  if (f.nr === 'RLB-128/T-2') t.ist(`${f.nr} ${start}: der gewählte Eintrag ist vor dem Drehen weggerollt`, await sichtbar(p), false);
  for (const [i, lageName] of [[1, start === 'quer' ? 'hoch' : 'quer'], [2, start]]) {
    await t.schritt(p, `${f.nr} ${name(start)}: ${i}. Drehen (${lageName})`, () => drehe(p));
    const nach = await lage(p);
    t.ist(`${f.nr} ${f.was}, ${name(start)}, ${i}. Drehen: Liste steht (oben derselbe Eintrag, ±2 px) – vorher ${JSON.stringify(vor)}`,
      nach, x => steht(vor, x), 'R-8.1');
    vor = nach;
  }
  await p.close();
}

// RLB-128/T-4: ‚Zuletzt gelöscht‘ gerollt, Kontextmenü an der untersten sichtbaren Kachel; RLB-128/T-5: Sprechblase ‚Endgültig löschen‘ an einer Kachel in der Mitte
for (const nr of ['RLB-128/T-4', 'RLB-128/T-5']) for (const start of ['quer', 'hoch']) {
  const p = await t.seite(b, `iPad ${start}`);
  await lade(p, { deleted: GELOESCHT });
  await p.click('#side .ad-recentlydeleted-entry'); await p.waitForTimeout(400); await ruhig(p);
  await rolleListe(p, 400);
  const ids = await sichtbareIds(p), id = nr === 'RLB-128/T-4' ? ids[ids.length - 1] : ids[Math.floor(ids.length / 2)];
  const m = await langDruecken(p, `#side .side-list [data-id="${id}"]`, { offen: '.menu' });
  if (m) t.fehler('R-4.2', m, `${nr} ${start}: Kontextmenü`);
  if (nr === 'RLB-128/T-5') { await p.locator('.menu:not(.zu-geist) .mi', { hasText: 'Endgültig löschen' }).first().click(); await p.waitForTimeout(400); await ruhig(p); }
  const sel = nr === 'RLB-128/T-4' ? '.menu:not(.zu-geist)' : '.pop:not(.zu-geist)', was = nr === 'RLB-128/T-4' ? 'Kontextmenü' : 'Sprechblase ‚Endgültig löschen‘';
  let vor = await lage(p);
  for (const [i, lageName] of [[1, start === 'quer' ? 'hoch' : 'quer'], [2, start]]) {
    await t.schritt(p, `${nr} ${name(start)}: ${i}. Drehen (${lageName})`, () => drehe(p));
    const nach = await lage(p);
    const g = await p.evaluate(([id, sel]) => {
      const r = document.querySelector(`#side .side-list [data-id="${id}"]`), m = document.querySelector(sel);
      if (!r || !m) return { kachel: !!r, offen: !!m };
      const a = r.getBoundingClientRect(), b = m.getBoundingClientRect();
      const l = r.closest('.side-list').getBoundingClientRect(), k = document.querySelector('#side .bhint')?.getBoundingClientRect();
      return { kachel: true, offen: true, blau: r.classList.contains('on'), daneben: b.left >= a.left + 20 && b.top < a.bottom && b.bottom > a.top,
        luecke: Math.round(Math.min(l.bottom, k ? k.top : l.bottom) - a.bottom) };
    }, [id, sel]);
    const kachelSichtbar = await sichtbar(p, id);
    const { luecke, ...gg } = g;
    t.ist(`${nr} ${name(start)}, ${i}. Drehen: ${was} offen, daneben an seiner sichtbaren Kachel, Kachel blau`, { ...gg, sichtbar: kachelSichtbar },
      { kachel: true, offen: true, blau: true, daneben: true, sichtbar: true }, 'R-8.1');
    // Die Liste steht – außer die Kachel des Menüs läge in der neuen Lage außerhalb: dann rückt sie nur so weit, dass die Kachel sichtbar ist
    t.ist(`${nr} ${name(start)}, ${i}. Drehen: Liste steht oder rückt nur bis zur Kachel – vorher ${vor.top}/${vor.oben}`, nach,
      x => steht(vor, x) || (x.top > vor.top && luecke >= 0 && luecke <= 8), 'R-8.1');
    vor = nach;
  }
  await menueZu(p);
  await p.close();
}

// RLB-128/T-6: nach dem Drehen einen weggerollten Eintrag über die Suche öffnen – er rollt ins Bild wie bisher (nicht unter Kopf oder Backup-Kachel)
{
  const p = await t.seite(b, 'iPad quer');
  await lade(p);
  await rolleListe(p, 0);
  await t.schritt(p, 'RLB-128/T-6 drehen (hoch)', () => drehe(p));
  await t.schritt(p, 'RLB-128/T-6 Suche ‚Stadt 13‘ (Reise 14)', async () => { await sucheAuf(p, '#sideMore'); await p.locator('#lsearch').pressSequentially('Stadt 13', { delay: 10 }); await p.waitForTimeout(400); });
  await t.schritt(p, 'RLB-128/T-6 Treffer öffnen', async () => { await p.locator('#side .side-row[data-id="t13"]').click(); await p.waitForTimeout(500); await ruhig(p); });
  if (await p.locator('#side').isHidden()) { await p.click('[aria-label="Seitenleiste einblenden"]'); await p.waitForTimeout(400); await ruhig(p); }
  t.ist('RLB-128/T-6 Reise 14 gewählt und sichtbar', [await p.locator('#side .side-row.current').getAttribute('data-id'), await sichtbar(p)], ['t13', true], 'R-8.1');
  await t.schritt(p, 'RLB-128/T-6 zurückdrehen (quer)', () => drehe(p));
  t.ist('RLB-128/T-6 nach dem Zurückdrehen: Reise 14 gewählt und sichtbar', [await p.locator('#side .side-row.current').getAttribute('data-id'), await sichtbar(p)], ['t13', true], 'R-8.1');
  await p.close();
}

// RLB-128/T-9: iPhone hoch ↔ quer, Startliste gerollt – oben derselbe Eintrag
{
  const p = await t.seite(b, 'iPhone hoch');
  await p.clock.setFixedTime(new Date('2026-06-05T10:00:00'));
  await p.goto(APP);
  await p.evaluate(([k, trips]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify({ settings: { lastBackup: Date.now() }, trips })); }, [KEY, TRIPS]);
  await p.reload(); await p.waitForTimeout(400); await ruhig(p);
  await rolleListe(p, 400);
  let vor = await lage(p);
  for (const [i, lageName] of [[1, 'quer'], [2, 'hoch']]) {
    await t.schritt(p, `RLB-128/T-9 iPhone ${i}. Drehen (${lageName})`, () => drehe(p));
    const nach = await lage(p);
    t.ist(`RLB-128/T-9 iPhone hoch → quer → hoch, ${i}. Drehen: Liste steht (oben derselbe Eintrag, ±2 px) – vorher ${JSON.stringify(vor)}`, nach, x => steht(vor, x), 'R-8.1');
    vor = nach;
  }
  await p.close();
}
await t.ende(b);
