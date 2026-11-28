// Reiselogbuch-Test: ablauf-seitenleiste-drehen (seit 3.59.1, RLB-128, R-8.1) – beim Drehen bleibt die Liste der Seitenleiste (iPhone: Startliste)
// stehen; vorher rollte keepSideScroll nach dem Neuaufbau den gewählten Eintrag ins Bild (gemessen mit 3.59.0: scrollTop 400 → 39, in ‚Zuletzt
// gelöscht‘ 400 → 48 – AppDesign arbeit/APD-154 Testfall-Liste.md Abschnitte 1 und 2). Testfall-Liste AppDesign arbeit/RLB-128 Testfall-Liste.md:
// RLB-128/T-1 gewählter Eintrag oberhalb weggerollt, RLB-128/T-2 unterhalb, RLB-128/T-3 ‚Zuletzt gelöscht‘, RLB-128/T-4 Kontextmenü an der untersten sichtbaren Kachel, RLB-128/T-5 Sprechblase
// ‚Endgültig löschen‘, RLB-128/T-6 Auswahl über die Suche ändern (rollt ins Bild wie bisher), RLB-128/T-7 große Schrift (AX5), RLB-128/T-8 wenige Einträge, RLB-128/T-9 iPhone.
// iPad quer → hoch → quer und hoch → quer → hoch; nach jedem Drehen die Grundregeln (t.schritt). Gegen 3.59.0 rot: PRUEF_APP=../<Datei mit 3.59.0>.
// Seit 3.59.2 (RLB-129, Korrektur zu RLB-128, Usertest P-127 fehlgeschlagen): Vergleich immer mit der Lage vor dem ersten Drehen, nicht mit der
// Lage direkt davor – Testfall-Liste AppDesign arbeit/RLB-129 Testfall-Liste.md: RLB-129/T-1 hoch reicht der Rollweg, RLB-129/T-2 hoch passen alle,
// RLB-129/T-3 hoch weniger Rollweg, RLB-129/T-4 ‚Zuletzt gelöscht‘, RLB-129/T-5 Kontextmenü offen, RLB-129/T-6 hoch selbst rollen bzw. tippen,
// RLB-129/T-7 große Schrift (AX5), RLB-129/T-8 iPhone; iPad quer → hoch → quer → hoch → quer. Gegen 3.59.1 rot: PRUEF_APP=../<Datei mit 3.59.1>.
// Seit 3.59.3 (RLB-130, Korrektur zu RLB-129, Usertest P-128 fehlgeschlagen, Messung am iPad 28.11.2026): am iPad wird gedreht wie gemessen – Fenster
// quer 1194 × 802, hoch 834 × 1162, und die Seitenleiste bekommt ihre neue Höhe erst nach resize (Safari-Modell festNachResize, AppDesign 4.71.1,
// Designrichtlinie 13). Keine neuen Testfälle: RLB-129/T-2, T-3, T-4 und T-5 sind damit gegen 3.59.2 rot. Gegen 3.59.2 rot: PRUEF_APP=../<Datei mit 3.59.2>.
// Aufruf im Repo-Ordner: node tests/ablauf-seitenleiste-drehen.mjs
import * as pw from 'playwright';
import { pruefung, navFertig, ruhe } from '../../AppDesign/fassung/5.0.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/5.0.0/tests/hig.mjs';
import { langDruecken, menueZu, sucheAuf, textGroesseSetzen } from '../../AppDesign/fassung/5.0.0/tests/ablauf.mjs';
import { festNachResize } from '../../AppDesign/fassung/5.0.0/tests/safari.mjs';
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
// RLB-130 (seit 3.59.3): iPad wie gemessen (Fenstergröße vom Home-Bildschirm, Seitenleiste nach resize – festNachResize); iPhone: Breite und Höhe tauschen
const IPAD = { quer: { width: 1194, height: 802 }, hoch: { width: 834, height: 1162 } };
const istIPad = v => [IPAD.quer, IPAD.hoch].some(g => g.width === v.width && g.height === v.height);
const seite = async ansicht => { const p = await t.seite(b, ansicht); if (ansicht.startsWith('iPad')) await p.setViewportSize(IPAD[ansicht.slice(5)]); return p; };
const drehe = async p => { const v = p.viewportSize();
  if (istIPad(v)) await festNachResize(p, v.width > v.height ? IPAD.hoch : IPAD.quer); else await p.setViewportSize({ width: v.height, height: v.width });
  await p.waitForTimeout(700); await ruhig(p); };
const name = s => s === 'quer' ? 'quer → hoch → quer' : 'hoch → quer → hoch';
// RLB-129 (seit 3.59.2): verglichen wird mit der Lage vor dem ersten Drehen (vor0). Oben derselbe Eintrag im selben Abstand ±2 px – bei gleich
// hohen Kacheln heißt das scrollTop ±2 px; bei großer Schrift ändern sich mit der Breite die Höhen der Kacheln, dann zählt der oberste Eintrag.
// Nur in der anderen Lage (nicht der Ausgangslage) und nur, wenn dort der Rollweg nicht reicht: Liste am Ende (ganz oben, wenn alles passt), der
// vorige oberste Eintrag sichtbar. Zurück in der Ausgangslage gilt immer: oben wieder derselbe Eintrag.
const gleich = (vor0, nach) => nach.oben === vor0.oben && Math.abs(nach.ab - vor0.ab) <= 2;
const amEnde = nach => nach.top >= nach.max - 2;
const stehtSeit = (vor0, nach, ausgang, vorSichtbar) => gleich(vor0, nach) || (!ausgang && amEnde(nach) && vorSichtbar);
const b = await t.browser();

// RLB-128/T-1, RLB-128/T-2, RLB-128/T-3, RLB-128/T-7, RLB-128/T-8: Liste gerollt (bzw. kurz), drehen – die Liste steht nach jedem Drehen
const faelle = [
  { nr: 'RLB-128/T-1', was: 'Reiselogbücher, gewählter Eintrag oberhalb weggerollt', lade: {}, rolle: 400 },
  { nr: 'RLB-128/T-2', was: 'Reiselogbücher, gewählter Eintrag unterhalb weggerollt', lade: { lastTrip: 't13' }, rolle: 0 },
  { nr: 'RLB-128/T-3', was: '‚Zuletzt gelöscht‘ gerollt', lade: { deleted: GELOESCHT }, zuletzt: true, rolle: 400 },
  { nr: 'RLB-128/T-7', was: 'große Schrift (AX5), Liste gerollt', lade: {}, ts: 'ax5', rolle: 900 },
  { nr: 'RLB-128/T-8', was: 'wenige Einträge (3), Liste rollt nicht', lade: { trips: TRIPS.slice(0, 3), lastTrip: 't2' }, rolle: 0 }];
for (const f of faelle) for (const start of ['quer', 'hoch']) {
  const p = await seite(`iPad ${start}`);
  await lade(p, f.lade);
  if (f.ts) await textGroesseSetzen(p, f.ts);
  if (f.zuletzt) { await p.click('#side .ad-recentlydeleted-entry'); await p.waitForTimeout(400); await ruhig(p); }
  await rolleListe(p, f.rolle);
  const vor0 = await lage(p);
  if (f.nr === 'RLB-128/T-1' || f.nr === 'RLB-128/T-3') t.ist(`${f.nr} ${start}: der gewählte Eintrag ist vor dem Drehen weggerollt`, await sichtbar(p), false);
  if (f.nr === 'RLB-128/T-2') t.ist(`${f.nr} ${start}: der gewählte Eintrag ist vor dem Drehen weggerollt`, await sichtbar(p), false);
  for (const [i, lageName] of [[1, start === 'quer' ? 'hoch' : 'quer'], [2, start]]) {
    await t.schritt(p, `${f.nr} ${name(start)}: ${i}. Drehen (${lageName})`, () => drehe(p));
    const nach = await lage(p), vs = await sichtbar(p, vor0.oben);
    t.ist(`${f.nr} ${f.was}, ${name(start)}, ${i}. Drehen: Liste steht (oben derselbe Eintrag wie vor dem ersten Drehen, ±2 px) – vor dem ersten Drehen ${JSON.stringify(vor0)}`,
      nach, x => stehtSeit(vor0, x, i === 2, vs), 'R-8.1');
  }
  await p.close();
}

// RLB-128/T-4: ‚Zuletzt gelöscht‘ gerollt, Kontextmenü an der untersten sichtbaren Kachel; RLB-128/T-5: Sprechblase ‚Endgültig löschen‘ an einer Kachel in der Mitte
for (const nr of ['RLB-128/T-4', 'RLB-128/T-5']) for (const start of ['quer', 'hoch']) {
  const p = await seite(`iPad ${start}`);
  await lade(p, { deleted: GELOESCHT });
  await p.click('#side .ad-recentlydeleted-entry'); await p.waitForTimeout(400); await ruhig(p);
  await rolleListe(p, 400);
  const ids = await sichtbareIds(p), id = nr === 'RLB-128/T-4' ? ids[ids.length - 1] : ids[Math.floor(ids.length / 2)];
  const m = await langDruecken(p, `#side .side-list [data-id="${id}"]`, { offen: '.menu' });
  if (m) t.fehler('R-4.2', m, `${nr} ${start}: Kontextmenü`);
  if (nr === 'RLB-128/T-5') { await p.locator('.menu:not(.zu-geist) .mi', { hasText: 'Endgültig löschen' }).first().click(); await p.waitForTimeout(400); await ruhig(p); }
  const sel = nr === 'RLB-128/T-4' ? '.menu:not(.zu-geist)' : '.pop:not(.zu-geist)', was = nr === 'RLB-128/T-4' ? 'Kontextmenü' : 'Sprechblase ‚Endgültig löschen‘';
  const vor0 = await lage(p);
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
    // Die Liste steht wie vor dem ersten Drehen – außer die Kachel des Menüs läge dort außerhalb: dann rückt sie nur so weit, dass die Kachel sichtbar ist
    const vs = await sichtbar(p, vor0.oben);
    t.ist(`${nr} ${name(start)}, ${i}. Drehen: Liste steht (wie vor dem ersten Drehen) oder rückt nur bis zur Kachel – vor dem ersten Drehen ${vor0.top}/${vor0.oben}`, nach,
      x => stehtSeit(vor0, x, i === 2, vs) || (x.top > vor0.top && luecke >= 0 && luecke <= 8), 'R-8.1');
  }
  await menueZu(p);
  await p.close();
}

// RLB-128/T-6: nach dem Drehen einen weggerollten Eintrag über die Suche öffnen – er rollt ins Bild wie bisher (nicht unter Kopf oder Backup-Kachel)
{
  const p = await seite('iPad quer');
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
  const p = await seite('iPhone hoch');
  await p.clock.setFixedTime(new Date('2026-06-05T10:00:00'));
  await p.goto(APP);
  await p.evaluate(([k, trips]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify({ settings: { lastBackup: Date.now() }, trips })); }, [KEY, TRIPS]);
  await p.reload(); await p.waitForTimeout(400); await ruhig(p);
  await rolleListe(p, 400);
  const vor0 = await lage(p);
  for (const [i, lageName] of [[1, 'quer'], [2, 'hoch']]) {
    await t.schritt(p, `RLB-128/T-9 iPhone ${i}. Drehen (${lageName})`, () => drehe(p));
    const nach = await lage(p), vs = await sichtbar(p, vor0.oben);
    t.ist(`RLB-128/T-9 iPhone hoch → quer → hoch, ${i}. Drehen: Liste steht (oben derselbe Eintrag wie vor dem ersten Drehen, ±2 px) – vor dem ersten Drehen ${JSON.stringify(vor0)}`,
      nach, x => stehtSeit(vor0, x, i === 2, vs), 'R-8.1');
  }
  await p.close();
}

// ---------- RLB-129 (seit 3.59.2): quer gerollt, hoch passen alle bzw. reicht der Rollweg nicht – zurück quer oben wieder derselbe Eintrag ----------
// Datenmengen gemessen in der Prüfumgebung (Sitzung 0171, Liste iPad quer 739 px, hoch 1099 px hoch; iPhone quer 332 px, hoch 791 px):
// 9 Reiselogbücher rollen quer (Rollweg 310 px) und passen hoch; 11 gelöschte rollen quer und passen hoch; bei AX5 rollen 2 quer (Chromium 51 px, WebKit 44 px) und passen hoch;
// am iPhone rollen 6 quer (376 px) und passen hoch. 14 Reiselogbücher: hoch weniger Rollweg (iPad quer 876, hoch 516 px; iPhone quer 1283, hoch 824 px).
const PASST = TRIPS.slice(0, 9), GELOESCHT_PASST = GELOESCHT.slice(0, 11);
const alleIds = p => p.evaluate(() => [...document.querySelectorAll('#side .side-list [data-id]')].map(r => r.dataset.id));
// Erwartung nach jedem Drehen: in der Ausgangslage (quer) oben derselbe Eintrag wie vor dem ersten Drehen; hoch je nach Fall
async function pruefeHoch(p, f, vor0, nach, i) {
  const vs = await sichtbar(p, vor0.oben);
  if (f.hoch === 'reicht') t.ist(`${f.nr} ${f.was}, ${i}. Drehen (hoch): oben derselbe Eintrag wie vor dem ersten Drehen (±2 px) – vor dem ersten Drehen ${JSON.stringify(vor0)}`,
    nach, x => gleich(vor0, x), 'R-8.1');
  if (f.hoch === 'passt') {
    const ids = await alleIds(p), sicht = await sichtbareIds(p);
    t.ist(`${f.nr} ${f.was}, ${i}. Drehen (hoch): Liste oben, alle sichtbar – ${JSON.stringify(nach)}`, { oben: nach.top, alle: ids.every(id => sicht.includes(id)) }, { oben: 0, alle: true }, 'R-8.1');
  }
  if (f.hoch === 'weniger') t.ist(`${f.nr} ${f.was}, ${i}. Drehen (hoch): Liste am Ende, der vorige oberste Eintrag (${vor0.oben}) sichtbar – ${JSON.stringify(nach)}`,
    { amEnde: amEnde(nach), sichtbar: vs }, { amEnde: true, sichtbar: true }, 'R-8.1');
}
const pruefeQuer = (f, vor0, nach, i) => t.ist(`${f.nr} ${f.was}, ${i}. Drehen (quer): oben wieder derselbe Eintrag wie vor dem ersten Drehen (±2 px) – vor dem ersten Drehen ${JSON.stringify(vor0)}`,
  nach, x => gleich(vor0, x), 'R-8.1');
const QHQHQ = [[1, 'hoch'], [2, 'quer'], [3, 'hoch'], [4, 'quer']];

// RLB-129/T-1, RLB-129/T-2, RLB-129/T-3, RLB-129/T-4, RLB-129/T-7: iPad quer → hoch → quer → hoch → quer
const faelle129 = [
  { nr: 'RLB-129/T-1', was: 'Reiselogbücher quer gerollt, hoch reicht der Rollweg', lade: {}, rolle: 400, hoch: 'reicht' },
  { nr: 'RLB-129/T-2', was: 'Reiselogbücher quer gerollt, hoch passen alle', lade: { trips: PASST }, rolle: 200, hoch: 'passt' },
  { nr: 'RLB-129/T-3', was: 'Reiselogbücher quer weit unten, hoch weniger Rollweg', lade: {}, rolle: 800, hoch: 'weniger' },
  { nr: 'RLB-129/T-4', was: '‚Zuletzt gelöscht‘ quer gerollt, hoch passen alle', lade: { deleted: GELOESCHT_PASST }, zuletzt: true, rolle: 200, hoch: 'passt' },
  { nr: 'RLB-129/T-7', was: 'große Schrift (AX5), quer gerollt, hoch passen alle', lade: { trips: TRIPS.slice(0, 2) }, ts: 'ax5', rolle: 51, hoch: 'passt' }];
for (const f of faelle129) {
  const p = await seite('iPad quer');
  await lade(p, f.lade);
  if (f.ts) await textGroesseSetzen(p, f.ts);
  if (f.zuletzt) { await p.click('#side .ad-recentlydeleted-entry'); await p.waitForTimeout(400); await ruhig(p); }
  await rolleListe(p, f.rolle);
  const vor0 = await lage(p);
  t.ist(`${f.nr} vor dem ersten Drehen: Liste quer gerollt (${f.rolle} px bzw. bis zum Ende, Rollweg ${vor0.max} px)`, vor0.top, x => x > 0 && Math.abs(x - Math.min(f.rolle, vor0.max)) <= 2);
  for (const [i, lageName] of QHQHQ) {
    await t.schritt(p, `${f.nr} quer → hoch → quer → hoch → quer: ${i}. Drehen (${lageName})`, () => drehe(p));
    const nach = await lage(p);
    if (lageName === 'hoch') await pruefeHoch(p, f, vor0, nach, i); else pruefeQuer(f, vor0, nach, i);
  }
  await p.close();
}

// RLB-129/T-5: wie RLB-129/T-2 (bzw. RLB-129/T-4), Kontextmenü an der untersten sichtbaren Kachel offen – Kachel blau und ganz sichtbar, Menü daneben;
// quer oben wieder derselbe Eintrag (die Kachel war vor dem ersten Drehen sichtbar, sie bleibt es damit)
for (const f of [{ was: 'Reiselogbücher', lade: { trips: PASST } }, { was: '‚Zuletzt gelöscht‘', lade: { deleted: GELOESCHT_PASST }, zuletzt: true }]) {
  const nr = 'RLB-129/T-5', p = await seite('iPad quer');
  await lade(p, f.lade);
  if (f.zuletzt) { await p.click('#side .ad-recentlydeleted-entry'); await p.waitForTimeout(400); await ruhig(p); }
  await rolleListe(p, 200);
  const ids = await sichtbareIds(p), id = ids[ids.length - 1];
  const m = await langDruecken(p, `#side .side-list [data-id="${id}"]`, { offen: '.menu' });
  if (m) t.fehler('R-4.2', m, `${nr} ${f.was}: Kontextmenü`);
  const vor0 = await lage(p);
  for (const [i, lageName] of QHQHQ) {
    await t.schritt(p, `${nr} ${f.was} quer → hoch → quer → hoch → quer: ${i}. Drehen (${lageName})`, () => drehe(p));
    const nach = await lage(p);
    const g = await p.evaluate(id => {
      const r = document.querySelector(`#side .side-list [data-id="${id}"]`), m = document.querySelector('.menu:not(.zu-geist)');
      if (!r || !m) return { kachel: !!r, offen: !!m };
      const a = r.getBoundingClientRect(), b = m.getBoundingClientRect();
      return { kachel: true, offen: true, blau: r.classList.contains('on'), daneben: b.left >= a.left + 20 && b.top < a.bottom && b.bottom > a.top };
    }, id);
    t.ist(`${nr} ${f.was}, ${i}. Drehen (${lageName}): Kontextmenü offen, daneben an seiner Kachel, Kachel blau und ganz sichtbar`, { ...g, sichtbar: await sichtbar(p, id) },
      { kachel: true, offen: true, blau: true, daneben: true, sichtbar: true }, 'R-8.1');
    if (lageName === 'hoch') await pruefeHoch(p, { nr, was: f.was, hoch: 'passt' }, vor0, nach, i); else pruefeQuer({ nr, was: f.was }, vor0, nach, i);
  }
  await menueZu(p);
  await p.close();
}

// RLB-129/T-6: hoch auf einen anderen Eintrag tippen (Daten wie RLB-129/T-2), dann quer – der gewählte Eintrag rollt ins Bild;
// hoch selbst rollen, dann quer – es gilt die neue Lage (Daten wie RLB-129/T-3: mit den Daten von RLB-129/T-2 lässt sich hoch nicht rollen, alles passt)
{
  const p = await seite('iPad quer');
  await lade(p, { trips: PASST });
  await rolleListe(p, 200);
  t.ist('RLB-129/T-6 tippen: Reise 9 ist vor dem Drehen nicht sichtbar', await sichtbar(p, 't8'), false);
  await t.schritt(p, 'RLB-129/T-6 tippen: drehen (hoch)', () => drehe(p));
  await t.schritt(p, 'RLB-129/T-6 tippen: Reise 9 antippen', async () => { await p.locator('#side .side-row[data-id="t8"]').click(); await p.waitForTimeout(500); await ruhig(p); });
  if (await p.locator('#side').isHidden()) { await p.click('[aria-label="Seitenleiste einblenden"]'); await p.waitForTimeout(400); await ruhig(p); }
  t.ist('RLB-129/T-6 tippen: Reise 9 gewählt und sichtbar (hoch)', [await p.locator('#side .side-row.current').getAttribute('data-id'), await sichtbar(p)], ['t8', true], 'R-8.1');
  await t.schritt(p, 'RLB-129/T-6 tippen: zurückdrehen (quer)', () => drehe(p));
  t.ist('RLB-129/T-6 tippen, zurück quer: der gewählte Eintrag (Reise 9) rollt ins Bild', [await p.locator('#side .side-row.current').getAttribute('data-id'), await sichtbar(p)], ['t8', true], 'R-8.1');
  await p.close();
}
{
  const p = await seite('iPad quer');
  await lade(p);
  await rolleListe(p, 800);
  await t.schritt(p, 'RLB-129/T-6 selbst rollen: drehen (hoch)', () => drehe(p));
  await rolleListe(p, 100);
  await p.waitForTimeout(700);
  const neu = await lage(p);
  await t.schritt(p, 'RLB-129/T-6 selbst rollen: zurückdrehen (quer)', () => drehe(p));
  t.ist(`RLB-129/T-6 selbst rollen, zurück quer: es gilt die neue Lage (oben derselbe Eintrag wie hoch nach dem Rollen, ±2 px) – hoch nach dem Rollen ${JSON.stringify(neu)}`,
    await lage(p), x => gleich(neu, x), 'R-8.1');
  await p.close();
}

// RLB-129/T-8: iPhone quer → hoch → quer → hoch → quer, Startliste quer gerollt – hoch passen alle (6) bzw. weniger Rollweg (14)
for (const f of [{ was: 'iPhone, Startliste quer gerollt, hoch passen alle', trips: TRIPS.slice(0, 6), rolle: 200, hoch: 'passt' },
  { was: 'iPhone, Startliste quer weit unten, hoch weniger Rollweg', trips: TRIPS, rolle: 1200, hoch: 'weniger' }]) {
  const nr = 'RLB-129/T-8', p = await seite('iPhone quer');
  await p.clock.setFixedTime(new Date('2026-06-05T10:00:00'));
  await p.goto(APP);
  await p.evaluate(([k, trips]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify({ settings: { lastBackup: Date.now() }, trips })); }, [KEY, f.trips]);
  await p.reload(); await p.waitForTimeout(400); await ruhig(p);
  await rolleListe(p, f.rolle);
  const vor0 = await lage(p);
  t.ist(`${nr} ${f.was}: vor dem ersten Drehen quer gerollt (${f.rolle} px bzw. bis zum Ende, Rollweg ${vor0.max} px)`, vor0.top, x => x > 0 && Math.abs(x - Math.min(f.rolle, vor0.max)) <= 2);
  for (const [i, lageName] of QHQHQ) {
    await t.schritt(p, `${nr} ${f.was}: ${i}. Drehen (${lageName})`, () => drehe(p));
    const nach = await lage(p);
    if (lageName === 'hoch') await pruefeHoch(p, { nr, was: f.was, hoch: f.hoch }, vor0, nach, i); else pruefeQuer({ nr, was: f.was }, vor0, nach, i);
  }
  await p.close();
}
await t.ende(b);
