// Reiselogbuch-Test: oeffnen-position – T-89/T-90 (seit 3.20.0, AppDesign A-16/A-17; Fall-Liste AppDesign arbeit/A-16 A-17
// Fall-Liste.md, Korrektur 3.20.1: arbeit/A-17 Korrektur Fall-Liste.md): Position beim Öffnen (R-7.4) – alles erfasst ganz oben, sonst der erste nicht erfasste Tag hervorgehoben direkt
// unter dem Tabellenkopf (iPad) bzw. der Leiste (iPhone); Seitenleiste ein/aus (R-8.1) – oben bleibt derselbe Tag; Drehen am
// Ende der Seite (seit 3.20.1) – ganz unten bleibt ganz unten. Seit 3.30.0 (T-98, AppDesign A-69, Fall-Liste AppDesign
// arbeit/A-69 T-98 Fall-Liste.md): Startposition mit festem Datum (Playwright-Uhr, heute = 23.10.2026) – Gelb nur bis heute;
// läuft die Reise und ist bis heute alles erfasst, steht heute oben ohne Gelb; Reise in der Zukunft ganz oben, nichts gelb (F1–F11).
// Aufruf im Repo-Ordner: node tests/oeffnen-position.mjs
import * as pw from 'playwright';
import { pruefung, rolle, navFertig } from '../../AppDesign/fassung/4.34.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.34.0/tests/hig.mjs';
import { checkOpenAt, checkSideToggle, checkTurnEnd } from '../../AppDesign/fassung/4.34.0/tests/ablauf.mjs';
const t = pruefung('oeffnen-position', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const iso = (start, i) => new Date(Date.parse(start + 'T00:00:00Z') + i * 864e5).toISOString().slice(0, 10);
// luecke: Nummer des fehlenden Tages oder eine Bedingung erfasst(i)
const reise = (id, title, start, n, luecke) => {
  const erfasst = typeof luecke === 'function' ? luecke : i => i !== luecke;
  const days = {}; for (let i = 0; i < n; i++) if (erfasst(i)) days[iso(start, i)] = { weather: '☀️', program: `Programm ${i + 1}\nzweite Zeile`, quarter: 'Hotel ' + i };
  return { id, title, participants: 'Anna', start, end: iso(start, n - 1), transport: ['pkw'], quarterColumn: true, days };
};
const HEUTE = '2026-10-23';   // T-98: feste Uhr, damit ‚heute‘ in jedem Lauf gleich ist
const TRIPS = [reise('v', 'Voll', '2025-06-01', 30, -1), reise('g', 'Lücke', '2025-03-01', 30, 14), reise('f', 'Erster', '2024-06-01', 30, 0),
  reise('l', 'Letzter', '2024-03-01', 30, 29),
  reise('a', 'F3 Lücke vor heute', '2026-10-10', 30, 5), reise('h', 'F4 heute fehlt', '2026-10-10', 30, i => i < 13),
  reise('n', 'F5 bis heute erfasst', '2026-10-10', 30, i => i <= 13), reise('r', 'F6 alles erfasst', '2026-10-10', 30, -1),
  reise('z', 'F7 Zukunft leer', '2026-12-01', 20, () => false), reise('p', 'F8 Zukunft geplant', '2026-11-10', 20, i => i < 3),
  reise('e', 'F9 heute erster Tag', '2026-10-23', 20, i => i === 0), reise('x', 'F10 heute letzter Tag', '2026-09-24', 30, -1)];
// want = oben, markiert = gelb (Vorgabe: want)
const WANT = { v: null, g: iso('2025-03-01', 14), f: iso('2024-06-01', 0), l: iso('2024-03-01', 29),
  a: iso('2026-10-10', 5), h: HEUTE, n: HEUTE, r: HEUTE, z: null, p: null, e: HEUTE, x: HEUTE };
const MARKIERT = { n: null, r: null, e: null, x: null };
const pruefeOeffnen = (id, where, open) => checkOpenAt(p_, { where, open, want: WANT[id], ...(id in MARKIERT ? { markiert: MARKIERT[id] } : {}) });
let p_;
const b = await t.browser();
for (const theme of ['light', 'dark']) {
  for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch', 'iPhone quer']) {
    const p = p_ = await t.seite(b, ansicht, { theme });
    const where = `${ansicht} ${theme === 'dark' ? 'dunkel' : 'hell'}`; t.ort = where;
    await p.clock.setFixedTime(new Date(HEUTE + 'T10:00:00'));
    await p.goto(APP);
    const start = async last => {
      await p.evaluate(([x, last]) => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: last }, trips: x })), [TRIPS, last]);
      await p.reload(); await p.waitForTimeout(400);
    };
    await start('r');
    const phone = await p.evaluate(() => document.documentElement.classList.contains('phone'));
    if (!phone) t.liste(await pruefeOeffnen('r', where + ' · F6 Start', async () => {}));
    await start('g');
    if (!phone) t.liste(await pruefeOeffnen('g', where + ' · P8 Start', async () => {}));
    const oeffne = id => async () => {
      if (phone && !await p.locator('#side.page').isVisible()) { await p.click('#back'); await p.waitForTimeout(300); await navFertig(p); }
      if (!await p.locator(`#side .side-row[data-id="${id}"]`).isVisible()) { await p.locator('[data-side-toggle]').filter({ visible: true }).first().click(); await p.waitForTimeout(350); await navFertig(p); }
      // seit 3.30.0: zwölf Reiselogbücher – den Eintrag in die Mitte der Liste rollen (unten liegt die Backup-Kachel darüber)
      await p.locator(`#side .side-row[data-id="${id}"]`).evaluate(e => e.scrollIntoView({ block: 'center' }));
      await p.locator(`#side .side-row[data-id="${id}"]`).click();
    };
    for (const id of ['g', 'v', 'f', 'l', 'g', 'a', 'h', 'n', 'r', 'z', 'p', 'e', 'x', 'g']) {   // P2–P7, P9, F1–F11: vorher jeweils weit unten
      await rolle(p, 'ende');
      t.liste(await pruefeOeffnen(id, `${where} · ${id}`, oeffne(id)));
    }
    // A3 Gegenprobe (AppDesign A-69): ist heute gelb, obwohl nichts gelb sein darf, meldet checkOpenAt das
    if (theme === 'light') {
      const f = await pruefeOeffnen('r', `${where} · A3`, async () => { await oeffne('r')(); await p.waitForTimeout(400);
        await p.evaluate(d => document.querySelector(`#app [data-day="${d}"]`).classList.add('gap'), HEUTE); });
      t.wahr('A3 Gegenprobe: heute gelb trotz markiert: null bleibt grün', f.length > 0, 'R-7.4');
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
        // seit 3.30.2: bis die Seitenleiste ausgeglitten ist (seit AppDesign 4.31.0) – unter Last stellte das Ende der Bewegung sonst den
        // Rollstand von D5 wieder her, nachdem checkTurnEnd schon ans Ende gerollt hatte (voller Lauf: 60 px vor dem Ende statt 0)
        await p.click('#sideHide'); await p.waitForTimeout(350); await navFertig(p);
        t.liste(await checkTurnEnd(p, { where: `${where} · D2 ohne Seitenleiste`, back: 0 }));
      }
    }
    await p.close();
  }
}
await t.ende(b);
