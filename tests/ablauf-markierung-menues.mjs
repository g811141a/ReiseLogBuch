// Reiselogbuch-Test: ablauf-markierung-menues – blaue Markierung bleibt, solange Menü oder Fenster offen ist, und geht danach weg;
// Menü der Seitenleiste mit eingerücktem Strich und Zusatzinfos. Hell und dunkel, quer und hoch.
// Aufruf im Repo-Ordner: node tests/ablauf-markierung-menues.mjs. Meldet Fehler (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.36.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.36.0/tests/hig.mjs';
import { readFileSync } from 'node:fs';
const t = pruefung('ablauf-markierung-menues', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const APP_VERSION = html.match(/APP_VERSION = '([\d.]+)'/)[1], AD = html.match(/AD_NEEDED = '([\d.]+)'/)[1];
const trips = [{ id: 'a', title: 'Australien', participants: 'G', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], days: {}, fazit: 'Schön' },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} },
  { id: 'c', title: 'Wien Kurztrip', participants: 'G', start: '2026-03-12', end: '2026-03-15', transport: ['zug'], days: {} }];
const b = await t.browser();
for (const ansicht of ['iPad quer', 'iPad hoch']) for (const theme of ['light', 'dark']) {
  const p = await t.seite(b, ansicht, { theme, deviceScaleFactor: 2 });
  const { width: w, height: h } = p.viewportSize(), tag = `${t.ort.replace(/ /g, '-')}-${t.browserName}`;
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(300);
  const row = n => p.locator('.side-row', { hasText: n });
  const on = l => l.evaluate(e => e.classList.contains('on'));
  await t.schritt(p, 'Mehr-Menü der Seitenleiste', async () => { await p.click('#sideMore'); await p.waitForTimeout(150); });
  // seit 3.24.0: Backup · Strich · Messung (eigene Gruppe, R-4.1) · Strich · graue Zeilen
  t.ist('Menü: zwei eingerückte Striche (Gruppen Backup, Messung, Hinweise)', [await p.locator('.menu .line').count(), await p.locator('.menu .sep').count()], [1, 1], 'R-4.1');
  t.ist('Menü: graue Zusatzinfos unten', await p.locator('.menu .note').allTextContents(), [
    new RegExp(`^Reiselogbuch · Version ${APP_VERSION.replace(/\./g, '\\.')} · erstellt am .+ · AppDesign ${AD.replace(/\./g, '\\.')}$`),
    'Safari kann die Daten bei Speichermangel löschen – bitte regelmäßig ein Backup erstellen.'], 'R-4.1');
  await p.screenshot({ path: new URL(`out/R221-menue-${tag}.png`, import.meta.url).pathname });
  await p.mouse.click(w - 20, h - 20); await p.waitForTimeout(150);
  await t.schritt(p, 'Kontextmenü Toskana → Einstellungen', async () => {
    const bx = await row('Toskana').boundingBox();
    await p.mouse.move(bx.x + 40, bx.y + 20); await p.mouse.down(); await p.waitForTimeout(750); await p.mouse.up(); await p.waitForTimeout(150);
    await p.locator('.menu .mi', { hasText: 'Einstellungen' }).click(); await p.waitForTimeout(300);
  });
  t.ist('Kachel blau, solange ihr Fenster offen ist', await on(row('Toskana')), true, 'R-3.3');
  await t.schritt(p, 'Fenster schließen', async () => { await p.click('#dlgX'); await p.waitForTimeout(200); });
  t.ist('Kachel nach dem Schließen nicht mehr blau', await on(row('Toskana')), false, 'R-3.3');
  await t.schritt(p, 'Australien öffnen', async () => { await row('Australien').click(); await p.waitForTimeout(200); });
  await t.schritt(p, 'Tag öffnen', async () => { await p.locator('table.days tbody tr').nth(2).click(); await p.waitForTimeout(300); });
  t.ist('gewählter Tag gelb markiert', await p.locator('table.days tbody tr.on').evaluateAll(es => es.map(e => e.dataset.day)), ['2026-08-26'], 'R-3.3');
  await t.schritt(p, 'nächster Tag', async () => { await p.locator('dialog [data-nav="1"]').click(); await p.waitForTimeout(300); });
  t.ist('Markierung wandert mit', await p.locator('table.days tbody tr.on').evaluateAll(es => es.map(e => e.dataset.day)), ['2026-08-27'], 'R-3.3');
  await t.schritt(p, 'Tag schließen', async () => { await p.click('#dlgX'); await p.waitForTimeout(200); if (await p.locator('.pop').count()) { await p.locator('.pop button').first().click(); await p.waitForTimeout(200); } });
  t.ist('keine Markierung nach dem Schließen', await p.locator('table.days tbody tr.on').count(), 0, 'R-3.3');
  await t.schritt(p, 'Fazit öffnen', async () => { await p.locator('#fazit').scrollIntoViewIfNeeded(); await p.click('#fazit'); await p.waitForTimeout(300); });
  t.ist('Fazit blau, solange offen', await on(p.locator('#fazit')), true, 'R-3.3');
  await t.schritt(p, 'Fazit schließen', async () => { await p.click('#dlgX'); await p.waitForTimeout(200); });
  t.ist('Fazit danach nicht mehr blau', await on(p.locator('#fazit')), false, 'R-3.3');
  await p.close();
}
await t.ende(b);
