// Reiselogbuch-Test: ablauf-fenster – Seitenleiste beim Start (quer fest, hoch darübergelegt), Titel, Abstand unten.
// Aufruf im Repo-Ordner: node tests/ablauf-fenster.mjs (Bildschirmfotos in tests/out/). Meldet Fehler (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.21.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.21.0/tests/hig.mjs';
const t = pruefung('ablauf-fenster', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const trips = [{ id: 'a', title: 'Australien', participants: 'G', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], days: {} },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} }];
const b = await t.browser();
for (const [ansicht, over] of [['iPad quer', false], ['iPad hoch', true]]) for (const theme of ['light', 'dark']) {
  const p = await t.seite(b, ansicht, { theme, deviceScaleFactor: 2 });
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
  await t.schritt(p, 'Start', async () => { await p.reload(); await p.waitForTimeout(300); });
  t.ist('Seitenleiste sichtbar', await p.isVisible('#side'), true);
  t.ist('Seitenleiste darübergelegt (hoch) bzw. fest (quer)', await p.evaluate(() => side.classList.contains('over')), over, 'R-8.1');
  t.ist('gewählter Eintrag', await p.textContent('.side-row.current b'), 'Australien', 'R-7.1');
  t.ist('Titel in der Leiste', await p.textContent('.nb-title'), 'Australien', 'R-2.2');
  t.ist('Abstand der Seitenleiste zum unteren Rand (px)', await p.evaluate(() => Math.round(innerHeight - side.getBoundingClientRect().bottom)), 4);
  await p.screenshot({ path: new URL(`out/S212-${t.ort.replace(/ /g, '-')}-${t.browserName}.png`, import.meta.url).pathname }); await p.close();
}
await t.ende(b);
