// Reiselogbuch-Test: ablauf-seitenleiste-kontextmenue – kurz tippen öffnet, langes Drücken zeigt das Kontextmenü (ohne ‚Öffnen‘),
// Einstellungen daraus, Löschen mit Abfrage, Mehr-Menü der Seitenleiste mit Versionszeile.
// Aufruf im Repo-Ordner: node tests/ablauf-seitenleiste-kontextmenue.mjs. Meldet Fehler (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.36.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.36.0/tests/hig.mjs';
import { readFileSync } from 'node:fs';
const t = pruefung('ablauf-seitenleiste-kontextmenue', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const APP_VERSION = html.match(/APP_VERSION = '([\d.]+)'/)[1], AD = html.match(/AD_NEEDED = '([\d.]+)'/)[1];
const trips = [{ id: 'a', title: 'Australien', participants: 'G', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], days: {} },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} },
  { id: 'c', title: 'Wien Kurztrip', participants: 'G', start: '2026-03-12', end: '2026-03-15', transport: ['zug'], days: {} }];
const b = await t.browser();
for (const theme of ['light', 'dark']) {
  const p = await t.seite(b, 'iPad quer', { theme, deviceScaleFactor: 2 });
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(300);
  const row = name => p.locator('.side-row', { hasText: name });
  const long = async name => { const bx = await row(name).boundingBox(); await p.mouse.move(bx.x + 40, bx.y + 20); await p.mouse.down(); await p.waitForTimeout(750); await p.mouse.up(); await p.waitForTimeout(150); };
  await t.schritt(p, 'Wien antippen', () => row('Wien').click());
  t.ist('kurz tippen öffnet', await p.textContent('.nb-title'), 'Wien Kurztrip');
  await t.schritt(p, 'Toskana lange drücken', () => long('Toskana'));
  t.ist('Kontextmenü', await p.locator('.menu .mi').allTextContents(), ['Einstellungen', 'Reiselogbuch löschen'], 'R-4.2');
  t.ist('langes Drücken öffnet nicht', await p.textContent('.nb-title'), 'Wien Kurztrip', 'R-4.2');
  t.ist('Kachel bleibt blau, solange ihr Menü offen ist', await row('Toskana').evaluate(e => e.classList.contains('on')), true, 'R-3.3');
  await p.screenshot({ path: new URL(`out/R22-1-kontextmenue-${theme}-${t.browserName}.png`, import.meta.url).pathname });
  await t.schritt(p, 'Einstellungen aus dem Kontextmenü', () => p.click('.menu .mi:has-text("Einstellungen")'));
  t.ist('Fenster Einstellungen der gedrückten Reise', [await p.textContent('#dlg h3'), await p.inputValue('#fTitle')], ['Einstellungen', 'Toskana']);
  await t.schritt(p, 'Fenster schließen', async () => { await p.click('#dlgX'); await p.waitForTimeout(200); });
  t.ist('nach x: Fenster zu, Seitenleiste da, 3 Kacheln, keine Abfrage', await p.evaluate(() => [dlg.open, side.hidden, side.querySelectorAll('.side-row').length, document.querySelectorAll('.pop').length]), [false, false, 3, 0]);
  await t.schritt(p, 'Toskana lange drücken', () => long('Toskana'));
  t.ist('kein ‚Öffnen‘ im Kontextmenü', await p.locator('.menu .mi:has-text("Öffnen")').count(), 0, 'R-4.2');
  await p.mouse.click(1170, 810); await p.waitForTimeout(150);
  await t.schritt(p, 'Wien löschen', async () => { await long('Wien'); await p.click('.menu .mi:has-text("Reiselogbuch löschen")'); await p.waitForTimeout(150); });
  t.ist('Abfrage Löschen', await p.locator('.pop button').allTextContents(), ['Reiselogbuch löschen', 'Abbrechen'], 'R-4.3');
  t.ist('Kachel bleibt blau während der Abfrage', await row('Wien').evaluate(e => e.classList.contains('on')), true, 'R-3.3');
  await p.screenshot({ path: new URL(`out/R22-2-loeschen-${theme}-${t.browserName}.png`, import.meta.url).pathname });
  await t.schritt(p, 'Löschen bestätigen', () => p.click('.pop button:has-text("Reiselogbuch löschen")'));
  t.ist('Reisen nach dem Löschen', await p.evaluate(() => db.trips.map(x => x.title)), ['Australien', 'Toskana']);
  t.ist('danach offen', await p.textContent('.nb-title'), 'Australien');
  await t.schritt(p, 'Mehr-Menü der Seitenleiste', () => p.click('#sideMore'));
  t.ist('Zusatzinfos im Menü', await p.locator('.menu .note').allTextContents(), [
    new RegExp(`^Reiselogbuch · Version ${APP_VERSION.replace(/\./g, '\\.')} · erstellt am \\d\\d\\.\\d\\d\\.\\d{4} um \\d\\d:\\d\\d · AppDesign ${AD.replace(/\./g, '\\.')}$`),
    'Safari kann die Daten bei Speichermangel löschen – bitte regelmäßig ein Backup erstellen.'], 'R-4.1');
  await p.screenshot({ path: new URL(`out/R22-3-seitenleiste-menue-${theme}-${t.browserName}.png`, import.meta.url).pathname });
  await p.close();
}
await t.ende(b);
