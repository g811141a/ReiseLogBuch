// Reiselogbuch-Test: ablauf-suche-tabelle – Kostenfeld, Suche springt erst nach der Pause, Treffer direkt unter dem Tabellenkopf,
// Ausgabe-Zelle, Druck ohne Seitenleisten-Abstand, Reisemittel und Wetter wählen.
// Aufruf im Repo-Ordner: node tests/ablauf-suche-tabelle.mjs. Meldet Fehler (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/tests/hig.mjs';
const t = pruefung('ablauf-suche-tabelle', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const days = {}; for (let i = 0; i < 40; i++) { const d = new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10); days[d] = { weather: '☀️', program: i === 30 ? 'Fahrt nach Sydney' : 'Programm ' + i, comment: '😉 ok', quarter: 'Hotel', place: 'Ort' }; }
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], foodColumn: true, days, kosten: 4850 }];
const b = await t.browser();
for (const theme of ['light', 'dark']) {
  const p = await t.seite(b, 'iPad quer', { theme });
  await p.clock.install({ time: new Date('2026-08-27T14:32:00') });
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
  await t.schritt(p, 'Start', async () => { await p.reload(); await p.waitForTimeout(300); });
  t.ist('Kostenfeld so breit wie der Betrag (px)', await p.evaluate(() => document.getElementById('kosten').offsetWidth), w => w >= 100 && w <= 150, 'R-5.1');
  await p.evaluate(() => scrollTo(0, 0));
  // Hier ohne Grundregeln direkt nach dem Tippen: deren Messung wartet, und die Pause der Suche (R-2.3) wäre schon vorbei.
  await p.click('#searchBtn'); await p.locator('#search').pressSequentially('Sydney');
  const y0 = await p.evaluate(() => scrollY);
  await p.clock.runFor(200);
  t.ist('Seite bleibt während des Tippens stehen', await p.evaluate(() => scrollY) === y0, true, 'R-2.3');
  await p.clock.runFor(600); await p.waitForTimeout(100);
  const lage = await p.evaluate(() => ({ row: Math.round(document.querySelector('mark.cur').closest('tr').getBoundingClientRect().top), th: Math.round(document.querySelector('table.days thead').getBoundingClientRect().bottom) }));
  t.ist('Treffer nach der Pause direkt unter dem Tabellenkopf', Math.abs(lage.row - lage.th) <= 1, true, 'R-2.3');
  await t.schritt(p, 'Suche Sydney – Treffer', async () => {});
  t.ist('Tag in der Ausgabe (Datum und Wetter in einer Zelle)', await p.evaluate(() => outputBody(db.trips[0], 1, nowStamp()).match(/<td class="nw">[^<]*<br>[^<]*<\/td>/)?.[0]), '<td class="nw">Mo, 24.08.<br>☀️</td>');
  await p.emulateMedia({ media: 'print' });
  t.ist('Druck: kein Abstand für die Seitenleiste', await p.evaluate(() => getComputedStyle(document.body).paddingLeft), '0px');
  t.ist('Seitenleiste angedockt', await p.evaluate(() => document.body.classList.contains('docked')), true);
  await p.emulateMedia({ media: 'screen' });
  await t.schritt(p, 'Einstellungen: Reisemittel Pkw', async () => { await p.click('#mainMore'); await p.click('.menu .mi:has-text("Einstellungen")'); await p.click('#transport [data-t="pkw"]'); });
  t.ist('Reisemittel Pkw gewählt', await p.getAttribute('#transport [data-t="pkw"]', 'aria-pressed'), 'true', 'R-5.4');
  t.ist('Reisemittel in einer Auswahl-Kapsel', await p.locator('#dlg .chips .cap').count(), 1, 'R-5.4');
  t.ist('Reisemittel passen quer ohne Wischen', await p.evaluate(() => { const s = document.getElementById('transport'); return s.scrollWidth <= s.clientWidth + 1; }), true, 'R-5.4');
  await t.schritt(p, 'Änderungen verwerfen', async () => { await p.click('#dlgX'); await p.click('.pop button:has-text("Änderungen verwerfen")'); });
  await t.schritt(p, 'Tag öffnen, Wetter wählen', async () => { await p.click('#searchBtn'); await p.click('tr[data-day="2026-08-25"]'); await p.waitForTimeout(200); await p.click('#wx [data-w="🌧"]'); });
  t.ist('Wetter 🌧 gewählt', await p.getAttribute('#wx [data-w="🌧"]', 'aria-pressed'), 'true', 'R-5.4');
  await p.close();
}
await t.ende(b);
