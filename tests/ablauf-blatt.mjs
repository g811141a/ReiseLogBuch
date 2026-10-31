// Reiselogbuch-Test: ablauf-blatt – RLB-99 (seit 3.30.0, AppDesign APD-61 Teil 2, R-4.6; Testfall-Liste AppDesign arbeit/APD-61 Teil 2 Testfall-Liste.md):
// im iPhone-Aufbau ist jedes Fenster außer Meldungen ein Blatt – Erfassen, Reiselogbuch einstellen, Neues Reiselogbuch, Fazit und
// Vorschau; Ziehen schließt, mit Änderungen fragt es wie x (B8–B10 für jedes Fenster mit Eingaben); iPhone hoch und quer, hell und
// dunkel, ‚Bewegung reduzieren‘. Seit 3.36.0 (AppDesign APD-72, Testfall-Liste AppDesign arbeit/APD-72 Testfall-Liste.md D-1 bis D-20): am iPad
// dieselben Fälle mit dem Fenster in der Mitte (quer und hoch, hell und dunkel, ‚Bewegung reduzieren‘, Tastatur im Erfassen), Häkchen im
// Erfassen (D-11). Seit 3.37.0 (AppDesign APD-83, APD-72/D-21): am iPad ändert eine Eingabe Breite und Lage nicht – iPad hoch auch
// ‚Neues Reiselogbuch‘ (die Meldung zum überschneidenden Zeitraum erscheint). Aufruf im Repo-Ordner: node tests/ablauf-blatt.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.46.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.46.0/tests/hig.mjs';
import { checkSheet } from '../../AppDesign/fassung/4.46.0/tests/ablauf.mjs';
const t = pruefung('ablauf-blatt', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a', '.dlg-body.preview a'] }), out: new URL('out/', import.meta.url) });
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 20; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1}\nzweite Zeile`, comment: '😉 schöner Tag', quarter: 'Hotel Bellevue', place: 'Hafen' };
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(0), end: iso(29), transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, days }];
const FENSTER = [
  ['Erfassen', p => p.evaluate(d => openDayDialog(db.trips[0], d), iso(2)), '#fProgram', p => p.locator('#fProgram').fill('Programm neu'), '#dlg #dlgOk'],
  ['Reiselogbuch einstellen', p => p.evaluate(() => openTripDialog(db.trips[0])), '#fTitle', p => p.locator('#fTitle').fill('Australien 2')],
  ['Neues Reiselogbuch', p => p.evaluate(() => openTripDialog(null)), '#fTitle', p => p.locator('#fTitle').fill('Japan')],
  ['Fazit', p => p.evaluate(() => openFazitDialog(db.trips[0])), '#fFazit', p => p.locator('#fFazit').fill('Schön war es')],
  ['Vorschau', async p => { await p.click('#shareBtn'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); }, null, null],
];
const b = await t.browser();
for (const [ansicht, theme, ruhig, auswahl] of [['iPhone hoch', 'light', false, null], ['iPhone quer', 'light', false, null], ['iPhone hoch', 'dark', false, ['Erfassen', 'Vorschau']],
  ['iPhone hoch', 'light', true, ['Erfassen']], ['iPad quer', 'light', false, ['Erfassen', 'Vorschau']], ['iPad hoch', 'light', false, ['Reiselogbuch einstellen', 'Erfassen', 'Neues Reiselogbuch']],
  ['iPad quer', 'dark', false, ['Erfassen']], ['iPad quer', 'light', true, ['Erfassen']]]) {
  const p = await t.seite(b, ansicht, { theme, ...(ruhig ? { reducedMotion: 'reduce' } : {}) });
  const where = `${t.ort}${ruhig ? ' Bewegung reduzieren' : ''}`; t.ort = where;
  await p.clock.setFixedTime(new Date('2026-09-02T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400);
  if (await p.locator('#side.page').isVisible()) { await p.locator('#side .side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(600); }
  for (const [name, open, field, change, ok] of FENSTER) {
    if (auswahl && !auswahl.includes(name)) continue;
    t.liste(await checkSheet(p, { where: `${where} · ${name}`, open: () => open(p), field, ok, change: change && (() => change(p)) }));
  }
  await t.schritt(p, 'Blatt offen', async () => { await FENSTER[0][1](p); await p.waitForTimeout(700); });
  await p.screenshot({ path: new URL(`out/blatt-${where.replace(/ /g, '-')}-${t.browserName}.png`, import.meta.url).pathname });
  await p.close();
}
await t.ende(b);
