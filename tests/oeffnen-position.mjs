// Reiselogbuch-Test: oeffnen-position – T-89/T-90 (seit 3.20.0, AppDesign A-16/A-17; Fall-Liste AppDesign arbeit/A-16 A-17
// Fall-Liste.md, Korrektur 3.20.1: arbeit/A-17 Korrektur Fall-Liste.md): Position beim Öffnen (R-7.4) – alles erfasst ganz oben, sonst der erste nicht erfasste Tag hervorgehoben direkt
// unter dem Tabellenkopf (iPad) bzw. der Leiste (iPhone); Seitenleiste ein/aus (R-8.1) – oben bleibt derselbe Tag; Drehen am
// Ende der Seite (seit 3.20.1) – ganz unten bleibt ganz unten.
// Aufruf im Repo-Ordner: node tests/oeffnen-position.mjs
import * as pw from 'playwright';
import { pruefung, rolle } from '../../AppDesign/fassung/4.28.1/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.28.1/tests/hig.mjs';
import { checkOpenAt, checkSideToggle, checkTurnEnd } from '../../AppDesign/fassung/4.28.1/tests/ablauf.mjs';
const t = pruefung('oeffnen-position', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const iso = (start, i) => new Date(Date.parse(start + 'T00:00:00Z') + i * 864e5).toISOString().slice(0, 10);
const reise = (id, title, start, n, luecke) => {
  const days = {}; for (let i = 0; i < n; i++) if (i !== luecke) days[iso(start, i)] = { weather: '☀️', program: `Programm ${i + 1}\nzweite Zeile`, quarter: 'Hotel ' + i };
  return { id, title, participants: 'Anna', start, end: iso(start, n - 1), transport: ['pkw'], quarterColumn: true, days };
};
const TRIPS = [reise('v', 'Voll', '2025-06-01', 30, -1), reise('g', 'Lücke', '2025-03-01', 30, 14), reise('f', 'Erster', '2024-06-01', 30, 0),
  reise('l', 'Letzter', '2024-03-01', 30, 29)];
const WANT = { v: null, g: iso('2025-03-01', 14), f: iso('2024-06-01', 0), l: iso('2024-03-01', 29) };
const b = await t.browser();
for (const theme of ['light', 'dark']) {
  for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch', 'iPhone quer']) {
    const p = await t.seite(b, ansicht, { theme });
    const where = `${ansicht} ${theme === 'dark' ? 'dunkel' : 'hell'}`; t.ort = where;
    await p.goto(APP);
    await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'g' }, trips: x })), TRIPS);
    await p.reload(); await p.waitForTimeout(400);
    const phone = await p.evaluate(() => document.documentElement.classList.contains('phone'));
    if (!phone) t.liste(await checkOpenAt(p, { where: where + ' · P8 Start', open: async () => {}, want: WANT.g }));
    const oeffne = id => async () => {
      if (phone && !await p.locator('#side.page').isVisible()) { await p.click('#back'); await p.waitForTimeout(300); }
      if (!await p.locator(`#side .side-row[data-id="${id}"]`).isVisible()) { await p.locator('[data-side-toggle]').filter({ visible: true }).first().click(); await p.waitForTimeout(350); }
      await p.locator(`#side .side-row[data-id="${id}"]`).click();
    };
    for (const id of ['g', 'v', 'f', 'l', 'g']) {   // P2–P7, P9: v nach g (vorher weit unten) prüft P1
      await rolle(p, 'ende');
      t.liste(await checkOpenAt(p, { where: `${where} · ${id}`, open: oeffne(id), want: WANT[id] }));
    }
    await t.schritt(p, 'Lücke direkt unter dem Kopf', async () => {});
    if (!phone) {   // S1–S6: Seitenleiste ein/aus
      await oeffne('v')(); await p.waitForTimeout(400);
      for (const at of [0.5, 0.97, 0]) t.liste(await checkSideToggle(p, { where: `${where} · bei ${at}`, at, toggle: '[data-side-toggle], #sideHide', times: ansicht === 'iPad quer' ? 5 : 1 }));
    }
    // D1–D5 (seit 3.20.1): Drehen am Ende der Seite – mit und ohne Seitenleiste (iPad quer), iPad hoch, iPhone hoch
    if (theme === 'light' && ansicht !== 'iPhone quer') {
      if (phone) await oeffne('v')();
      t.liste(await checkTurnEnd(p, { where: `${where} · D Ende`, back: 0 }));
      t.liste(await checkTurnEnd(p, { where: `${where} · D5 nahe Ende`, back: 60 }));
      if (ansicht === 'iPad quer' && await p.locator('#sideHide').isVisible()) {
        await p.click('#sideHide'); await p.waitForTimeout(350);
        t.liste(await checkTurnEnd(p, { where: `${where} · D2 ohne Seitenleiste`, back: 0 }));
      }
    }
    await p.close();
  }
}
await t.ende(b);
