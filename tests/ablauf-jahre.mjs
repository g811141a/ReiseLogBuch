// Reiselogbuch-Test: ablauf-jahre (seit 3.44.0, RLB-114, AppDesign APD-100) – Testfall-Liste AppDesign arbeit/RLB-114 Testfall-Liste.md:
// in der Seitenleiste bzw. Startliste steht vor dem ersten Reiselogbuch jedes Jahres das Jahr des Reisebeginns als Abschnittskopf
// (.side-sec, R-7.6), auch über dem obersten; bei der Suche nur Jahre mit Treffern; die Köpfe rollen mit und sehen aus wie die
// Leistenüberschrift (Variante A2). Y-1 bis Y-11; Y-12 (Gegenprobe) mit PRUEF_GEGENPROBE=jahre:oben|ende|halbfett.
// Aufruf im Repo-Ordner: node tests/ablauf-jahre.mjs (PRUEF_APP=../_alt.html prüft eine andere Fassung der App, z. B. die veröffentlichte).
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.48.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.48.0/tests/hig.mjs';
const t = pruefung('ablauf-jahre', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const gp = (process.env.PRUEF_GEGENPROBE || '').match(/^jahre:(.+)$/)?.[1];
const reise = (id, title, start, end, program) => ({ id, title, participants: 'G', start, end, transport: ['flug'], days: program ? { [start]: { program } } : {} });
const SIEBEN = [reise('t', 'Toskana', '2027-05-03', '2027-05-17', 'Siena'), reise('a', 'Australien', '2026-08-24', '2026-11-11', 'Museum in Cairns'),
  reise('w', 'Wien Kurztrip', '2026-03-12', '2026-03-15', 'Museum und Prater'), reise('s', 'Silvester in Lissabon', '2025-12-27', '2026-01-04', 'Feuerwerk'),
  reise('o', 'Ostsee', '2025-07-05', '2025-07-19', 'Strand'), reise('r', 'Rom', '2025-04-10', '2025-04-16', 'Kolosseum'), reise('d', 'Dolomiten', '2024-09-01', '2024-09-12', 'Museum am Berg')];
const FOLGE = ['2027', 'Toskana', '2026', 'Australien', 'Wien Kurztrip', '2025', 'Silvester in Lissabon', 'Ostsee', 'Rom', '2024', 'Dolomiten'];
// 20 Reiselogbücher über 6 Jahre (2021–2026), je Jahr 3 oder 4
const ZWANZIG = Array.from({ length: 20 }, (_, i) => { const j = 2026 - Math.floor(i / 3.4), m = String(12 - (i % 4) * 3).padStart(2, '0');
  return reise('z' + i, `Reise ${i + 1}`, `${j}-${m}-01`, `${j}-${m}-08`); });

// Gegenprobe Y-12: die Fehler absichtlich einbauen – Y-1 bzw. Y-2 müssen rot werden
const fehlerEinbauen = fall => {
  const css = { halbfett: '#side .side-sec { font-weight: 600 !important; }' }[fall];
  if (css) document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.append(s); });
  if (fall === 'oben') new MutationObserver(() => { const k = document.querySelector('#side .side-list > .side-sec:first-child'); if (k) k.remove(); }).observe(document, { subtree: true, childList: true });
  if (fall === 'ende') new MutationObserver(() => document.querySelectorAll('#side .side-sec').forEach(k => {
    const r = k.nextElementSibling, e = r && db.trips.find(x => x.id === r.dataset.id)?.end; if (e && k.textContent !== e.slice(0, 4)) k.textContent = e.slice(0, 4); }))
    .observe(document, { subtree: true, childList: true, characterData: true });
};
const start = async (p, trips, { last } = {}) => {
  if (gp) await p.addInitScript(fehlerEinbauen, gp);
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(([x, l]) => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), ...(l ? { lastTrip: l } : {}) }, trips: x })), [trips, last]);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
};
// Liste: Köpfe und Kacheln in ihrer Reihenfolge (Kopf = Jahr, Kachel = Titel)
const folge = p => p.evaluate(() => [...document.querySelectorAll('#side .side-list > .side-sec, #side .side-list > .side-row')]
  .map(e => e.matches('.side-sec') ? e.textContent.trim() : e.querySelector('b').textContent));
const koepfe = async p => (await folge(p)).filter(x => /^\d{4}$/.test(x));
// Y-2: Schrift von Kopf und Leistenüberschrift
const schrift = p => p.evaluate(() => { const f = e => { const c = getComputedStyle(e); return [c.fontSize, c.fontWeight, c.color, c.fontFamily]; };
  return [...document.querySelectorAll('#side .side-sec')].map(f).concat([f(document.querySelector('#side .side-head h2'))]); });
const lang = async (p, sel) => { await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.waitForTimeout(150); const bx = await p.locator(sel).first().boundingBox(); await p.mouse.move(bx.x + 20, bx.y + bx.height / 2); await p.mouse.down(); await p.waitForTimeout(750); await p.mouse.up(); await p.waitForTimeout(200); };

const b = await t.browser();
try {
// Y-1, Y-2, Y-5, Y-10: alle vier Ansichten, hell und dunkel
for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch', 'iPhone quer']) for (const theme of ['light', 'dark']) {
  const p = await t.seite(b, ansicht, { theme });
  await start(p, SIEBEN, { last: 'a' });
  if (ansicht === 'iPad hoch') await p.evaluate(() => { if (side.hidden) toggleSide(); }), await p.waitForTimeout(500);
  await t.schritt(p, 'Y-1 Liste ansehen', async () => {});
  t.ist('RLB-114/Y-1 Köpfe und Reiselogbücher in dieser Reihenfolge, Silvester unter 2025', await folge(p), FOLGE, 'R-7.6');
  t.ist('RLB-114/Y-1 der erste Eintrag der Liste ist ein Kopf', await p.evaluate(() => document.querySelector('#side .side-list').firstElementChild?.matches('.side-sec')), true, 'R-7.6');
  const s = await schrift(p);
  t.ist('RLB-114/Y-2 Kopf wie die Leistenüberschrift (Größe, Stärke, Farbe, Schrift)', s.slice(0, -1).filter(x => JSON.stringify(x) !== JSON.stringify(s.at(-1))).length, 0, 'R-7.6');
  t.ist('RLB-114/Y-10 Kopf ist eine Überschrift, Text nur das Jahr; Kacheln bleiben Schaltflächen', await p.evaluate(() => [...document.querySelectorAll('#side .side-sec')].every(k =>
    (/^H[1-6]$/.test(k.tagName) || k.getAttribute('role') === 'heading') && /^\d{4}$/.test(k.textContent.trim()) && !k.closest('button'))
    && [...document.querySelectorAll('#side .side-row')].every(r => r.tagName === 'BUTTON')), true, 'R-7.6');
  if (ansicht === 'iPad quer' && theme === 'light') await p.screenshot({ path: new URL(`out/RLB-114-jahre-${t.browserName}.png`, import.meta.url).pathname });
  // Y-5: ein Reiselogbuch · zwei im selben Jahr · keins
  for (const [daten, soll] of [[[SIEBEN[1]], ['2026']], [[SIEBEN[1], SIEBEN[2]], ['2026']], [[], []]]) {
    await p.evaluate(x => { db.trips = x; currentTripId = x[0]?.id ?? null; save(); render(); }, daten); await p.waitForTimeout(300);
    if (ansicht === 'iPad hoch' && daten.length) await p.evaluate(() => { if (side.hidden) toggleSide(); }), await p.waitForTimeout(500);
    t.ist(`RLB-114/Y-5 ${daten.length} Reiselogbücher: Köpfe`, await koepfe(p), soll, 'R-7.6');
    if (!daten.length) t.ist('RLB-114/Y-5 keins: Leertext wie bisher', await p.evaluate(() => document.querySelector('#side .side-empty')?.textContent ?? null), 'Noch kein Reiselogbuch angelegt.');
  }
  await p.close();
}

// Y-3: größte Textgröße (wie die Prüfung mit PRUEF_TEXT=53) – Kopf wächst wie die Leistenüberschrift, steht ganz in der Liste
for (const ansicht of ['iPad hoch', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  await p.addInitScript(() => { const s = () => { const e = document.createElement('style'); e.textContent = 'html { font-size: 53px !important; }'; document.documentElement.prepend(e); };
    if (document.documentElement) s(); else new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); s(); } }).observe(document, { childList: true }); });
  await start(p, SIEBEN, { last: 'a' });
  if (ansicht === 'iPad hoch') await p.evaluate(() => { if (side.hidden) toggleSide(); }), await p.waitForTimeout(500);
  await t.schritt(p, 'Y-3 größte Textgröße', async () => {});
  t.ist('RLB-114/Y-3 ts-gross aktiv', await p.evaluate(() => document.documentElement.classList.contains('ts-gross')), true);
  const s = await schrift(p);
  t.ist('RLB-114/Y-3 Kopf wächst wie die Leistenüberschrift', [s[0][0], s[0][1]], [s.at(-1)[0], s.at(-1)[1]], 'R-7.6');
  t.ist('RLB-114/Y-3 Kopf größer als bei normaler Schrift (20 px)', parseFloat(s[0][0]) > 20, true, 'R-7.6');
  t.ist('RLB-114/Y-3 Kopf steht ganz in der Liste (links und rechts)', await p.evaluate(() => { const l = document.querySelector('#side .side-list').getBoundingClientRect();
    return [...document.querySelectorAll('#side .side-sec')].every(k => { const r = k.getBoundingClientRect(); return r.left >= l.left - 1 && r.right <= l.right + 1 && k.scrollWidth <= k.clientWidth + 1; }); }), true, 'R-7.6');
  await p.close();
}

// Y-4, Y-8, Y-9: Suche, Daten ändern, Kopf antippen und lange drücken
for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  await start(p, SIEBEN, { last: 'a' });
  const suche = async wort => { await p.fill('#lsearch', wort); await p.waitForTimeout(250); };
  await t.schritt(p, 'Y-4 Suche öffnen', async () => { await p.click('#sideMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Suchen' }).click(); await p.waitForTimeout(200); });
  await t.schritt(p, 'Y-4 Treffer in einem Jahr', () => suche('Kolosseum'));
  t.ist('RLB-114/Y-4 Treffer in einem Jahr: nur dieser Kopf', await folge(p), ['2025', 'Rom'], 'R-7.6');
  await t.schritt(p, 'Y-4 Treffer in zwei Jahren', () => suche('Museum'));
  t.ist('RLB-114/Y-4 Treffer in zwei Jahren: nur diese Köpfe', await folge(p), ['2026', 'Australien', 'Wien Kurztrip', '2024', 'Dolomiten'], 'R-7.6');
  await t.schritt(p, 'Y-4 keine Treffer', () => suche('xyzzy'));
  t.ist('RLB-114/Y-4 keine Treffer: kein Kopf, Text ‚Keine Treffer‘', [await koepfe(p), await p.evaluate(() => document.querySelector('#side .side-empty')?.textContent)], [[], 'Keine Treffer'], 'R-7.6');
  await t.schritt(p, 'Y-4 Suche leeren', async () => { await p.click('#lsclear'); await p.waitForTimeout(250); });
  t.ist('RLB-114/Y-4 nach dem Leeren wieder alle Köpfe', await koepfe(p), ['2027', '2026', '2025', '2024'], 'R-7.6');
  await t.schritt(p, 'Y-4 Suche beenden', async () => { await p.click('#lsclose'); await p.waitForTimeout(250); });
  // Y-9: Kopf antippen und lange drücken – nichts geschieht; die Kachel zeigt weiter das Kontextmenü
  const offen = () => p.evaluate(() => [document.querySelector('.nb-title')?.textContent ?? null, !document.querySelector('#side').hidden, document.querySelectorAll('.menu').length, dlg.open]);
  const vorher = await offen();
  await t.schritt(p, 'Y-9 Kopf antippen', async () => { await p.locator('#side .side-sec', { hasText: '2025' }).click(); await p.waitForTimeout(400); });
  t.ist('RLB-114/Y-9 Kopf antippen: nichts geschieht', await offen(), vorher, 'R-7.6');
  await t.schritt(p, 'Y-9 Kopf lange drücken', () => lang(p, '#side .side-sec >> text=2025'));
  t.ist('RLB-114/Y-9 Kopf lange drücken: kein Kontextmenü', await offen(), vorher, 'R-7.6');
  await t.schritt(p, 'Y-9 Kachel lange drücken', () => lang(p, '#side .side-row[data-id="r"]'));
  t.ist('RLB-114/Y-9 Kachel lange drücken: Kontextmenü wie bisher', await p.locator('.menu .mi').count() > 0, true, 'R-4.2');
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  if (ansicht === 'iPad quer') {
    // Y-8: neues Reiselogbuch in einem neuen Jahr; Beginn in ein anderes Jahr; das letzte eines Jahres löschen
    await t.schritt(p, 'Y-8 neues Reiselogbuch 2023', async () => { await p.click('#newTrip'); await p.fill('#fTitle', 'Kreta'); await p.fill('#fPeople', 'G');
      await p.fill('#fStart', '2023-05-01'); await p.fill('#fEnd', '2023-05-05'); await p.click('#transport button >> nth=0'); await p.click('#dlgOk'); await p.waitForTimeout(400); await navFertig(p); });
    t.ist('RLB-114/Y-8 neuer Kopf 2023', await koepfe(p), ['2027', '2026', '2025', '2024', '2023'], 'R-7.6');
    await t.schritt(p, 'Y-8 Dolomiten nach 2022 verschieben', async () => { await p.evaluate(() => { const d = getTrip('d'); d.start = '2022-09-01'; d.end = '2022-09-12'; save(); render(); }); await p.waitForTimeout(300); });
    t.ist('RLB-114/Y-8 Dolomiten unter dem neuen Jahr, Kopf 2024 weg', (await folge(p)).slice(-4), ['2023', 'Kreta', '2022', 'Dolomiten'], 'R-7.6');
    await t.schritt(p, 'Y-8 Toskana (letztes 2027) löschen', async () => { await lang(p, '#side .side-row[data-id="t"]'); await p.click('.menu .mi:has-text("Reiselogbuch löschen")'); await p.waitForTimeout(200);
      await p.click('.pop button:has-text("Reiselogbuch löschen")'); await p.waitForTimeout(400); });
    t.ist('RLB-114/Y-8 Kopf 2027 verschwindet', await koepfe(p), ['2026', '2025', '2023', '2022'], 'R-7.6');
  }
  await p.close();
}

// Y-6, Y-7: 20 Reiselogbücher über 6 Jahre – Köpfe rollen mit; nach Drehen und panel-left bleibt der oberste Eintrag, das aktuelle blau
const oberster = p => p.evaluate(() => { const l = document.querySelector('#side .side-list').getBoundingClientRect();
  const e = [...document.querySelectorAll('#side .side-list > .side-sec, #side .side-list > .side-row')].find(x => x.getBoundingClientRect().bottom > l.top + 8);
  return e ? (e.matches('.side-sec') ? e.textContent.trim() : e.dataset.id) : null; });
for (const [ansicht, quer] of [['iPad quer', 'iPad hoch'], ['iPhone hoch', 'iPhone quer']]) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  await start(p, ZWANZIG, { last: 'z9' });
  t.ist('RLB-114/Y-6 sechs Köpfe', await koepfe(p), ['2026', '2025', '2024', '2023', '2022', '2021'], 'R-7.6');
  t.ist('RLB-114/Y-6 Köpfe haften nicht (position static)', await p.evaluate(() => [...document.querySelectorAll('#side .side-sec')].every(k => getComputedStyle(k).position === 'static')), true, 'R-7.6');
  await p.evaluate(() => { const l = document.querySelector('#side .side-list'); l.scrollTop = 0; l.dispatchEvent(new Event('scroll')); }); await p.waitForTimeout(150);
  const y0 = await p.evaluate(() => document.querySelector('#side .side-sec').getBoundingClientRect().top);
  await t.schritt(p, 'Y-6 Liste rollen', async () => { await p.evaluate(() => { const l = document.querySelector('#side .side-list'); l.scrollTop = 300; l.dispatchEvent(new Event('scroll')); }); await p.waitForTimeout(250); });
  const y1 = await p.evaluate(() => document.querySelector('#side .side-sec').getBoundingClientRect().top);
  t.ist('RLB-114/Y-6 der erste Kopf rollt mit (300 px nach oben)', Math.round(y0 - y1), 300, 'R-7.6');
  t.ist('RLB-114/Y-6 Liste läuft unter dem Kopf und hinter der Backup-Kachel durch', await p.evaluate(() => { const s = document.querySelector('#side'), l = s.querySelector('.side-list').getBoundingClientRect(), h = s.querySelector('.side-head').getBoundingClientRect(), f = s.querySelector('.side-foot');
    return l.top <= h.bottom + 1 && (!f || l.bottom >= f.getBoundingClientRect().bottom - 2); }), true, 'R-7.1');
  if (ansicht.startsWith('iPhone')) { await p.locator('#side .side-row[data-id="z9"]').click(); await p.waitForTimeout(400); await navFertig(p); await p.click('#back'); await p.waitForTimeout(400); await navFertig(p);
    await p.evaluate(() => { const l = document.querySelector('#side .side-list'); l.scrollTop = 300; l.dispatchEvent(new Event('scroll')); }); await p.waitForTimeout(250); }
  const vor = await oberster(p);
  await t.schritt(p, `Y-7 drehen nach ${quer}`, async () => { await p.setViewportSize(quer.startsWith('iPad') ? { width: 820, height: 1180 } : { width: 852, height: 393 }); await p.waitForTimeout(600); await navFertig(p); });
  if (ansicht === 'iPad quer') {
    t.ist('RLB-114/Y-7 nach dem Drehen: oberster Eintrag bleibt', await oberster(p), vor, 'R-7.1');
    t.ist('RLB-114/Y-7 aktuelles Reiselogbuch einziges blau und sichtbar', await p.evaluate(() => { const c = document.querySelectorAll('#side .side-row.current'), l = document.querySelector('#side .side-list').getBoundingClientRect();
      return c.length === 1 && c[0].dataset.id === 'z9' && c[0].getBoundingClientRect().top >= l.top - 1 && c[0].getBoundingClientRect().top < l.bottom; }), true, 'R-7.1');
    await t.schritt(p, 'Y-7 panel-left aus', async () => { await p.click('#sideHide'); await p.waitForTimeout(700); await navFertig(p); });
    await t.schritt(p, 'Y-7 panel-left ein', async () => { await p.click('#app [data-side-toggle]'); await p.waitForTimeout(700); await navFertig(p); });
    t.ist('RLB-114/Y-7 nach panel-left: oberster Eintrag bleibt', await oberster(p), vor, 'R-7.1');
    t.ist('RLB-114/Y-7 nach panel-left: Köpfe noch da', (await koepfe(p)).length, 6, 'R-7.6');
  } else {
    t.ist('RLB-114/Y-7 iPhone quer: Startliste, oberster Eintrag bleibt', await oberster(p), vor, 'R-7.1');
    t.ist('RLB-114/Y-7 iPhone quer: Köpfe noch da', (await koepfe(p)).length, 6, 'R-7.6');
  }
  await t.schritt(p, 'Y-7 zurückdrehen', async () => { await p.setViewportSize(ansicht.startsWith('iPad') ? { width: 1180, height: 820 } : { width: 393, height: 852 }); await p.waitForTimeout(600); await navFertig(p); });
  t.ist('RLB-114/Y-7 nach dem Zurückdrehen: oberster Eintrag bleibt', await oberster(p), vor, 'R-7.1');
  await p.close();
}

// Y-11: Abgleich bringt ein Reiselogbuch eines anderen Jahres – danach auf beiden Geräten der Kopf ‚2023‘
{
  const A = await t.seite(b, 'iPad quer', { theme: 'light' }), B = await t.seite(b, 'iPhone hoch', { theme: 'light' });
  await start(A, [reise('a', 'Australien', '2026-08-24', '2026-11-11')], { last: 'a' });
  await start(B, [reise('k', 'Kreta', '2023-05-01', '2023-05-05')]);
  const abgleich = async (von, nach) => {
    const datei = await von.evaluate(() => backupFile().content);
    await nach.evaluate(() => { if (isPhone()) { phoneList = true; render(); } }); await nach.waitForTimeout(200);
    await nach.click('#sideMore'); await nach.waitForTimeout(150);
    const [chooser] = await Promise.all([nach.waitForEvent('filechooser'), nach.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
    await chooser.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(datei) }); await nach.waitForTimeout(300);
    await nach.locator('.pop button', { hasText: 'Abgleichen' }).click(); await nach.waitForTimeout(400);
    await nach.evaluate(() => { const m = document.querySelector('#msg'); if (m?.open) m.close(); if (isPhone()) { phoneList = true; render(); } }); await nach.waitForTimeout(300);
  };
  await t.schritt(A, 'Y-11 iPad gleicht mit dem Backup des iPhones ab', () => abgleich(B, A));
  t.ist('RLB-114/Y-11 iPad nach dem Abgleich: Köpfe 2026 und 2023', await folge(A), ['2026', 'Australien', '2023', 'Kreta'], 'R-7.6');
  await t.schritt(B, 'Y-11 iPhone gleicht mit dem Backup des iPads ab', () => abgleich(A, B));
  t.ist('RLB-114/Y-11 iPhone nach dem Abgleich: Köpfe 2026 und 2023', await folge(B), ['2026', 'Australien', '2023', 'Kreta'], 'R-7.6');
  await A.close(); await B.close();
}
} catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
await t.ende(b);
