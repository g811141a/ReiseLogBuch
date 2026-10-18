// Reiselogbuch-Test: ablauf-liste-still – R-7.3 Liste steht still (seit 3.21.2, aus P-51/5 und P-52/2–4; AppDesign 4.23.2):
// Reiselogbuch mit Lücke öffnen (erster fehlender Tag oben, R-7.4), dann eine Zeile oben, 3 Zeilen tiefer, in der unteren
// Hälfte, 2 px unter dem Kopf bzw. nach 5× ‹ › erfassen (Häkchen) oder verwerfen (x) – danach steht oben derselbe Tag an
// derselben Stelle wie beim Öffnen. Tastatur wie Safari nachgebildet (AppDesign checkListStill). iPad quer und hoch, iPhone
// hoch und quer. Aufruf im Repo-Ordner: node tests/ablauf-liste-still.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.25.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.25.0/tests/hig.mjs';
import { checkListStill } from '../../AppDesign/fassung/4.25.0/tests/ablauf.mjs';
const t = pruefung('ablauf-liste-still', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const iso = (start, i) => new Date(Date.parse(start + 'T00:00:00Z') + i * 864e5).toISOString().slice(0, 10);
// 12 Tage erfasst (verschieden lang), dann 37 fehlende Tage – wie eine laufende Reise
const days = {}; for (let i = 0; i < 12; i++) days[iso('2026-08-24', i)] = { weather: '☀️', program: 'Programm ' + i, comment: '😉 ok ' + 'sehr schöner Tag '.repeat(i % 3 + 1), food: '😋 Restaurant', quarter: 'Hotel', place: 'Hafen' };
const TRIPS = [{ id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-24', end: iso('2026-08-24', 48), transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, days }];
const b = await t.browser();
for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch', 'iPhone quer']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  t.ort = ansicht;
  p.on('pageerror', e => t.fehler('', `${ansicht}: Skriptfehler ${e.message}`));
  await p.goto(APP);
  // jeder Fall beginnt mit frischen Daten (Häkchen erfasst Tage – die Lücke darf sich nicht verschieben)
  const start = async () => {
    await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), TRIPS);
    await p.reload(); await p.waitForTimeout(400);
    const phone = await p.evaluate(() => document.documentElement.classList.contains('phone'));
    if (phone && !await p.locator('#side.page').isVisible()) { await p.click('#back'); await p.waitForTimeout(300); }
    if (!await p.locator('#side .side-row[data-id="a"]').isVisible()) { await p.locator('[data-side-toggle]').filter({ visible: true }).first().click(); await p.waitForTimeout(350); }
    await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(500);
  };
  const item = (await p.evaluate(() => document.documentElement.classList.contains('phone'))) ? '#pdays [data-day]' : 'table.days tbody [data-day]';
  t.liste(await checkListStill(p, { where: ansicht, item, field: '#fProgram', next: '#dlg [data-nav="1"]', start }));
  await t.schritt(p, 'nach dem Fenster Tag', async () => {});
  await p.close();
}
await t.ende(b);
