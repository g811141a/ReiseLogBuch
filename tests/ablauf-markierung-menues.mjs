// Reiselogbuch-Test: ablauf-markierung-menues – blaue Markierung bleibt, solange Menü oder Fenster offen ist, und geht danach weg;
// Menü der Seitenleiste mit eingerücktem Strich und Zusatzinfos. Hell und dunkel, quer und hoch. Seit 3.40.0 (AppDesign APD-87, R-4.1):
// Mehr-Knopf offen senkrecht und hervorgehoben (APD-87/E-1 bis APD-87/E-11, iPad, iPhone, ‚Bewegung reduzieren‘, Drehen mit offenem Menü).
// Aufruf im Repo-Ordner: node tests/ablauf-markierung-menues.mjs. Meldet Fehler (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.48.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.48.0/tests/hig.mjs';
import { checkMehrKnopf } from '../../AppDesign/fassung/4.48.0/tests/ablauf.mjs';
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
  // APD-87 APD-87/E-1, APD-87/E-2, APD-87/E-5, APD-87/E-6, APD-87/E-11: Mehr der Seitenleiste (seit 3.41.0 mit Untermenü ‚Darstellung‘, RLB-108)
  // und eines Reiselogbuchs
  t.liste(await checkMehrKnopf(p, { sel: '#sideMore', untermenue: 'Darstellung', where: 'Mehr der Seitenleiste' }));
  // seit 3.43.0 (AppDesign APD-97): auch hoch steht die Seitenleiste daneben – das Reiselogbuch ist bedienbar
  t.liste(await checkMehrKnopf(p, { sel: '#mainMore', where: 'Mehr des Reiselogbuchs' }));
  await t.schritt(p, 'Mehr-Menü der Seitenleiste', async () => { await p.click('#sideMore'); await p.waitForTimeout(150); });
  // seit 3.24.0: Backup · Strich · Messung (eigene Gruppe, R-4.1) · Strich · graue Zeilen; seit 3.38.0 (AppDesign APD-77) die Messung erst nach
  // langem Drücken auf die Versionszeile; seit 3.41.0 ‚Suchen‘ mit Strich zuerst (APD-91) und ‚Darstellung‘ nach Backup (RLB-108) –
  // Suchen · Strich · Backup · Strich · Darstellung · Strich · graue Zeilen
  t.ist('Menü: Striche nach Suchen, Backup und Darstellung (Messung versteckt)', [await p.locator('.menu .line').count(), await p.locator('.menu .sep').count()], [2, 1], 'R-4.1');
  t.ist('Menü: graue Zusatzinfos unten', await p.locator('.menu .note').allTextContents(), [
    new RegExp(`^Reiselogbuch · Version ${APP_VERSION.replace(/\./g, '\\.')} · erstellt am .+ · AppDesign ${AD.replace(/\./g, '\\.')}$`),
    'Safari kann die Daten bei Speichermangel löschen – bitte regelmäßig ein Backup erstellen.'], 'R-4.1');
  await p.screenshot({ path: new URL(`out/R221-menue-${tag}.png`, import.meta.url).pathname });
  await p.mouse.click(w - 20, h - 20); await p.waitForTimeout(150);
  await t.schritt(p, 'Kontextmenü Toskana → Reiselogbuch einstellen', async () => {
    const bx = await row('Toskana').boundingBox();
    await p.mouse.move(bx.x + 40, bx.y + 20); await p.mouse.down(); await p.waitForTimeout(750); await p.mouse.up(); await p.waitForTimeout(150);
    await p.locator('.menu .mi', { hasText: 'Reiselogbuch einstellen' }).click(); await p.waitForTimeout(300);
  });
  t.ist('Kachel blau, solange ihr Fenster offen ist', await on(row('Toskana')), true, 'R-3.3');
  await t.schritt(p, 'Fenster schließen', async () => { await p.click('#dlgX'); await p.waitForTimeout(200); });
  t.ist('Kachel nach dem Schließen nicht mehr blau', await on(row('Toskana')), false, 'R-3.3');
  await t.schritt(p, 'Australien öffnen', async () => { await row('Australien').click(); await p.waitForTimeout(200); });
  await t.schritt(p, 'Tag öffnen', async () => { await p.locator('#app table.days tbody tr, #app .box.day').nth(2).click(); await p.waitForTimeout(300); });
  t.ist('gewählter Tag gelb markiert', await p.locator('#app table.days tbody tr.on, #app .box.day.on').evaluateAll(es => es.map(e => e.dataset.day)), ['2026-08-26'], 'R-3.3');
  await t.schritt(p, 'nächster Tag', async () => { await p.locator('dialog [data-nav="1"]').click(); await p.waitForTimeout(300); });
  t.ist('Markierung wandert mit', await p.locator('#app table.days tbody tr.on, #app .box.day.on').evaluateAll(es => es.map(e => e.dataset.day)), ['2026-08-27'], 'R-3.3');
  await t.schritt(p, 'Tag schließen', async () => { await p.click('#dlgX'); await p.waitForTimeout(200); if (await p.locator('.pop').count()) { await p.locator('.pop button').first().click(); await p.waitForTimeout(200); } });
  t.ist('keine Markierung nach dem Schließen', await p.locator('#app table.days tbody tr.on, #app .box.day.on').count(), 0, 'R-3.3');
  await t.schritt(p, 'Fazit öffnen', async () => { await p.locator('#fazit').scrollIntoViewIfNeeded(); await p.click('#fazit'); await p.waitForTimeout(300); });
  t.ist('Fazit blau, solange offen', await on(p.locator('#fazit')), true, 'R-3.3');
  await t.schritt(p, 'Fazit schließen', async () => { await p.click('#dlgX'); await p.waitForTimeout(200); });
  t.ist('Fazit danach nicht mehr blau', await on(p.locator('#fazit')), false, 'R-3.3');
  await p.close();
}
// APD-87 APD-87/E-3 iPhone (Startliste und Seite), APD-87/E-8 ‚Bewegung reduzieren‘, APD-87/E-7 Drehen mit offenem Menü
for (const [ansicht, ruhig] of [['iPhone hoch', false], ['iPhone quer', false], ['iPad quer', true]]) {
  const p = await t.seite(b, ansicht, { theme: 'light', ...(ruhig ? { reducedMotion: 'reduce' } : {}) });
  t.ort = `${t.ort}${ruhig ? ' Bewegung reduzieren' : ''} · Mehr-Knopf`;
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400);
  const phone = ansicht.startsWith('iPhone');
  if (phone && await p.locator('#back').count()) { await p.click('#back'); await p.waitForTimeout(400); }
  t.liste(await checkMehrKnopf(p, { sel: '#sideMore', where: phone ? 'Mehr der Startliste' : 'Mehr der Seitenleiste' }));
  if (phone) { await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(600); }
  t.liste(await checkMehrKnopf(p, { sel: '#mainMore', where: 'Mehr des Reiselogbuchs' }));
  if (!phone) {
    // in beide Richtungen drehen, das Menü offen (seit 3.43.0, APD-97: die Seitenleiste steht dabei fest daneben). Quer → hoch ist der
    // Fall aus AppDesign APD-94 (bis 3.42.1 lag hoch die Seitenleiste mit nicht gesperrter Abdunkelung darüber, R-1.4 nach jedem Schritt)
    const senkrecht = () => p.evaluate(() => { const c = [...document.querySelectorAll('#mainMore > svg circle')]; return c.length === 3 && new Set(c.map(k => k.getAttribute('cx'))).size === 1; });
    const waagrecht = () => p.evaluate(() => { const c = [...document.querySelectorAll('#mainMore > svg circle')]; return c.length === 3 && new Set(c.map(k => k.getAttribute('cy'))).size === 1; });
    for (const [von, nach] of [[[820, 1180], [1180, 820]], [[1180, 820], [820, 1180]]]) {
      const wie = von[0] < von[1] ? 'hoch → quer' : 'quer → hoch';
      await p.setViewportSize({ width: von[0], height: von[1] }); await p.waitForTimeout(500);
      await t.schritt(p, `Mehr offen, dann drehen (${wie})`, async () => { await p.click('#mainMore'); await p.waitForTimeout(150); await p.setViewportSize({ width: nach[0], height: nach[1] }); await p.waitForTimeout(500); });
      t.ist(`APD-87 APD-87/E-7: nach dem Drehen (${wie}) mit offenem Menü noch senkrecht`, await senkrecht(), true, 'R-4.1');
      t.ist(`AppDesign APD-94: nach dem Drehen (${wie}) mit offenem Menü keine Abdunkelung`, await p.evaluate(() => !document.querySelector('.side-shade')), true, 'R-1.4');
      await p.keyboard.press('Escape'); await p.waitForTimeout(150);
      t.ist(`APD-87 APD-87/E-7: nach dem Schließen (${wie}) wieder waagrecht`, await waagrecht(), true, 'R-4.1');
    }
  }
  await p.close();
}
await t.ende(b);
