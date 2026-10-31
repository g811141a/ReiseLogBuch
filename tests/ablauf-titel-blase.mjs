// Reiselogbuch-Test: ablauf-titel-blase (seit 3.45.0) – AppDesign APD-101, R-2.5 (Testfall-Liste AppDesign arbeit/APD-101 Testfall-Liste.md
// L-1 bis L-13): ein mit ‚…‘ gekürzter Titel in Kopfzeile oder Fenster-Kopfzeile zeigt beim langen Drücken den ganzen Titel in einer Sprechblase
// darunter. iPhone hoch bei größter Schrift (Text 53): Fenster ‚Reiselogbuch einstellen‘ (L-1), Titel der Reise in der Kopfzeile (L-2), Fenster
// eines Tages (L-3), Reisetitel mit 80 Zeichen (L-4); dazu Antippen, Wandern, Rollen, Tipp daneben, Esc (L-6 bis L-10, checkTitelBlase) und
// Drehen (L-11); bei normaler Schrift in allen Ansichten zeigt ein ganz sichtbarer Titel (‚Toskana‘) nichts (L-5); Grundregeln nach jedem Schritt (L-12).
// L-13 (Gegenprobe): gegen 3.44.0 mit PRUEF_APP=../_alt.html werden L-1 bis L-3 rot. Aufruf im Repo-Ordner: node tests/ablauf-titel-blase.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.47.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.47.0/tests/hig.mjs';
import { checkTitelBlase, titelLang, titelBlaseOffen } from '../../AppDesign/fassung/4.47.0/tests/ablauf.mjs';
const t = pruefung('ablauf-titel-blase', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 20; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1}`, place: 'Hafen' };
const LANG = 'Australien und Neuseeland mit dem Wohnmobil von Sydney über Melbourne bis Hobart';   // 80 Zeichen
const trips = [{ id: 'a', title: 'Australien und Neuseeland', participants: 'G & A', start: iso(0), end: iso(19), transport: ['flug'], days },
  { id: 'b', title: LANG, participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} },
  { id: 'c', title: 'Toskana', participants: 'G', start: '2027-06-03', end: '2027-06-17', transport: ['pkw'], days: {} }];
const groesse = px => { const s = () => { const e = document.createElement('style'); e.textContent = `html { font-size: ${px}px !important; }`; document.documentElement.prepend(e); };
  if (document.documentElement) s(); else new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); s(); } }).observe(document, { childList: true }); };
const start = async (p, trip = 'a') => {
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(([x, id]) => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: id }, trips: x })), [trips, trip]);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
  if (await p.evaluate(() => isPhone()) && await p.locator('#side.page').isVisible()) {
    await p.locator(`#side .side-row[data-id="${trip}"]`).click(); await p.waitForTimeout(400); await navFertig(p);
  }
};
const KOPF = '#bar .nb-title, #bar .pnav-title', FTITEL = '#dlg .dlg-head h3';
const zuFenster = async p => { await p.evaluate(() => { dlgDirty = () => false; document.getElementById('dlg').close(); }); await p.waitForTimeout(400); await navFertig(p); };
const pruefe = async (p, name, opts, soll) => {
  let r = { gekuerzt: false, errors: [] };
  await t.schritt(p, name, async () => { r = await checkTitelBlase(p, { ...opts, where: name }); t.liste(r.errors); });
  if (soll !== undefined) t.ist(`${name}: Titel gekürzt`, r.gekuerzt, soll, 'R-2.5');
  return r;
};

const b = await t.browser();
// L-1 bis L-4, L-6 bis L-11: iPhone hoch, größte Schrift
{
  const p = await t.seite(b, 'iPhone hoch', { theme: 'light' });
  t.ort = 'iPhone hoch · Text 53';
  await p.addInitScript(groesse, 53);
  try {
    await start(p);
    // L-2: Titel der Reise in der Kopfzeile; Tipp auf Teilen und Mehr schließt nur die Blase (kein Menü)
    await pruefe(p, 'L-2 Kopfzeile ‚Australien und Neuseeland‘', { sel: KOPF, daneben: ['#mainMore', '#shareBtn'], rollen: '#app > .rolle', esc: true }, true);
    // L-1: Fenster ‚Reiselogbuch einstellen‘; Tipp auf x und Häkchen schließt nur die Blase (Fenster bleibt offen, nichts gespeichert)
    await p.evaluate(() => openTripDialog(db.trips[0])); await p.waitForTimeout(500); await navFertig(p);
    await pruefe(p, 'L-1 Fenster ‚Reiselogbuch einstellen‘', { sel: FTITEL, daneben: ['#dlgX', '#dlgOk', '#fTitle'], rollen: '#dlg .dlg-body', esc: true }, true);
    t.ist('L-8 nach den Tipps: Fenster offen, Reisetitel unverändert', [await p.evaluate(() => dlg.open), await p.evaluate(() => db.trips[0].title)], [true, 'Australien und Neuseeland'], 'R-2.5');
    // L-11: Drehen schließt die Blase; danach Grundregeln (oberster Eintrag bleibt) – t.schritt
    await titelLang(p, FTITEL);
    t.wahr('L-11 vor dem Drehen ist die Sprechblase offen', await titelBlaseOffen(p), 'R-2.5');
    await t.schritt(p, 'L-11 drehen (hoch → quer → hoch)', async () => {
      await p.setViewportSize({ width: 852, height: 393 }); await p.waitForTimeout(500);
      t.wahr('L-11 Drehen schließt die Sprechblase', !await titelBlaseOffen(p), 'R-2.5');
      await p.setViewportSize({ width: 393, height: 852 }); await p.waitForTimeout(500);
    });
    t.wahr('L-11 nach dem Drehen ist das Fenster noch offen', await p.evaluate(() => dlg.open), 'R-2.5');
    await zuFenster(p);
    // L-3: Fenster eines Tages (iPhone: ‚Do, 27.08.2026‘)
    await p.evaluate(d => openDayDialog(db.trips[0], d), iso(3)); await p.waitForTimeout(500); await navFertig(p);
    t.ist('L-3 Titel des Tages', await p.textContent(FTITEL), 'Do, 27.08.2026');
    await pruefe(p, 'L-3 Fenster eines Tages', { sel: FTITEL, daneben: ['#dlgX'], esc: true }, true);
    await zuFenster(p);
    if (process.env.PRUEF_BILD) { await titelLang(p, KOPF); await p.screenshot({ path: new URL(`out/APD-101-kopf-${t.browserName}.png`, import.meta.url).pathname }); await p.keyboard.press('Escape'); }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// L-4: Reisetitel mit 80 Zeichen – mehrzeilig, ganz sichtbar, über keinem Knopf
{
  const p = await t.seite(b, 'iPhone hoch', { theme: 'light' });
  t.ort = 'iPhone hoch · Text 53';
  await p.addInitScript(groesse, 53);
  try {
    await start(p, 'b');
    await pruefe(p, 'L-4 Kopfzeile, Titel mit 80 Zeichen', { sel: KOPF, esc: false }, true);
    await titelLang(p, KOPF);
    const z = await p.evaluate(() => { const e = document.querySelector('.titel-blase'); return e ? Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight)) : 0; });
    t.wahr(`L-4 der lange Titel steht mehrzeilig in der Sprechblase (${z} Zeilen)`, z >= 2, 'R-2.5');
    if (process.env.PRUEF_BILD) await p.screenshot({ path: new URL(`out/APD-101-lang-${t.browserName}.png`, import.meta.url).pathname });
    await p.keyboard.press('Escape');
    await p.evaluate(() => openTripDialog(db.trips[1])); await p.waitForTimeout(500); await navFertig(p);
    await pruefe(p, 'L-4 Fenster des langen Reiselogbuchs', { sel: FTITEL, daneben: ['#dlgX'], esc: false }, true);
    await zuFenster(p);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// L-5: normale Schrift, alle Ansichten, kurzer Titel ‚Toskana‘ – ganz sichtbar, langes Drücken zeigt nichts
for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch', 'iPhone quer']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await start(p, 'c');
    await pruefe(p, 'L-5 Kopfzeile', { sel: KOPF }, false);
    await p.evaluate(() => openTripDialog(db.trips[2])); await p.waitForTimeout(500); await navFertig(p);
    await pruefe(p, 'L-5 Fenster ‚Reiselogbuch einstellen‘', { sel: FTITEL }, false);
    await zuFenster(p);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
