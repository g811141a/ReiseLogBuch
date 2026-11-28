// Reiselogbuch-Test: ablauf-fenster – Seitenleiste beim Start (quer fest, hoch darübergelegt), Titel, Abstand unten; seit 3.57.7 Fenster nach resize (APD-135/S-8).
// Aufruf im Repo-Ordner: node tests/ablauf-fenster.mjs (Bildschirmfotos in tests/out/). Meldet Fehler (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/5.0.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/5.0.0/tests/hig.mjs';
const t = pruefung('ablauf-fenster', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const trips = [{ id: 'a', title: 'Australien', participants: 'G', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], days: {} },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} }];
const b = await t.browser();
// seit 3.43.0 (AppDesign APD-97): auch hoch fest neben dem Inhalt, nie darübergelegt
for (const [ansicht, over] of [['iPad quer', false], ['iPad hoch', false]]) for (const theme of ['light', 'dark']) {
  const p = await t.seite(b, ansicht, { theme, deviceScaleFactor: 2 });
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
  await t.schritt(p, 'Start', async () => { await p.reload(); await p.waitForTimeout(300); });
  t.ist('Seitenleiste sichtbar', await p.isVisible('#side'), true);
  t.ist('Seitenleiste fest neben dem Inhalt (quer und hoch, APD-97)', await p.evaluate(() => side.classList.contains('over')), over, 'R-8.1');
  t.ist('gewählter Eintrag', await p.textContent('.side-row.current b'), 'Australien', 'R-7.1');
  t.ist('Titel in der Leiste', await p.textContent('.nb-title'), 'Australien', 'R-2.2');
  t.ist('Abstand der Seitenleiste zum unteren Rand (px)', await p.evaluate(() => Math.round(innerHeight - side.getBoundingClientRect().bottom)), 4);
  // seit 3.57.7 (AppDesign APD-135/S-7, S-8): ui.js stellt offene Fenster bei jedem resize selbst neu (placeDialogs; bis 3.57.6 der resize-Hörer der App) –
  // das Hinweisfenster absichtlich verschoben, nach resize wieder an seinem Platz
  await p.evaluate(() => { inform('Hinweis', 'Prüfung'); }); await p.waitForSelector('#msg[open]'); await p.waitForTimeout(300);
  const platz = await p.evaluate(async () => { const vor = msg.style.top; msg.style.top = '0px'; dispatchEvent(new Event('resize'));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); return { vor, nach: msg.style.top }; });
  t.wahr(`APD-135/S-8 Hinweisfenster nach resize wieder an seinem Platz: top ${platz.nach} (vorher ${platz.vor})`, !!platz.vor && platz.vor !== '0px' && platz.nach === platz.vor, 'R-8.1');
  await p.click('#msg [data-x]'); await p.waitForTimeout(300);
  await p.screenshot({ path: new URL(`out/S212-${t.ort.replace(/ /g, '-')}-${t.browserName}.png`, import.meta.url).pathname }); await p.close();
}
await t.ende(b);
