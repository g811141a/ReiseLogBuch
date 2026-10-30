// Ablauf-Test: Abgleich über die echte Oberfläche wie auf dem Gerät – Fenster ‚Tag‘ (speichert alle Felder, auch leere),
// Backup erstellen (Kachel, nach dem ersten Backup des Tages über das Mehr-Menü – seit 3.32.0 ist die Kachel dann weg, RLB-105),
// Backup laden → Abgleichen, in beide Richtungen. Fälle 8, 9, 9a–9c der Tabelle (15.18).
// Aufruf im Repo-Ordner: node tests/ablauf-abgleich-ui.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.44.1/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.44.1/tests/hig.mjs';
// Meldet Fehler mit Rückgabewert, Grundregeln nach den Schritten (seit 3.12.0, pruefe.mjs).
const t = pruefung('ablauf-abgleich-ui', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.dlg-body.preview a'] }), out: new URL('out/', import.meta.url) });
const G = (p, name) => t.schritt(p, name, async () => {});   // Grundregeln im aktuellen Zustand
import { readFileSync } from 'node:fs';
const APP = new URL('../index.html', import.meta.url).href;
const errors = { push: (...m) => m.forEach(x => t.fehler('', x)) };   // Meldungen werden Fehler (pruefe.mjs)
const base = [{ id: 'x', title: 'Island', participants: 'A', start: '2026-07-01', end: '2026-07-05', transport: ['flug'], quarterColumn: true, moodColumn: true, days: { '2026-07-02': { program: 'Alt' } } }];
const b = await t.browser();
const dev = async (w, h) => { const c = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700, acceptDownloads: true }); const p = await c.newPage(); p.on('pageerror', e => errors.push(e.message)); return p; };
const at = (p, t) => p.clock.setFixedTime(new Date(`2026-10-12T${t}:00`));
const backup = async p => { const name = p.viewportSize().width < 700 ? '#hintBackup' : '#hintBackup'; if (p.viewportSize().width < 700) { await p.click('#back'); await p.waitForTimeout(200); }
  const los = async () => { if (await p.locator('#hintBackup').count()) return p.click('#hintBackup'); await p.click('#sideMore'); await p.waitForTimeout(150); return p.locator('.menu .mi', { hasText: 'Backup erstellen' }).click(); };
  const [d] = await Promise.all([p.waitForEvent('download'), los()]); await p.waitForTimeout(300); await p.click('#msg [data-x]'); await p.waitForTimeout(200); return readFileSync(await d.path(), 'utf8'); };
const load = async (p, content) => { if (p.viewportSize().width < 700 && !(await p.locator('#side.page').count())) { await p.click('#back'); await p.waitForTimeout(200); }
  await p.click('#sideMore'); await p.waitForTimeout(150);
  const [ch] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
  await ch.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(content) }); await p.waitForTimeout(300);
  await p.locator('.pop button', { hasText: 'Abgleichen' }).click(); await p.waitForTimeout(300); await p.click('#msg [data-x]').catch(() => {}); await p.waitForTimeout(200); };
const day = async (p, iso, fn) => {
  if (p.viewportSize().width < 700) { if (await p.locator('#side.page').count()) { await p.locator('#side .side-row').first().click(); await p.waitForTimeout(250); } await p.locator(`#pdays [data-day="${iso}"]`).click(); }
  else await p.locator(`table.days tbody tr[data-day="${iso}"]`).click();
  await p.waitForTimeout(300); await navFertig(p);   // seit 3.30.0: bis das Blatt auf dem iPhone ruht (R-4.6)
  await fn(); await p.click('#dlgOk'); await p.waitForTimeout(300); };
const want = { 8: { iso: '2026-07-03', weather: '☀️', program: 'Golden Circle' }, 9: { iso: '2026-07-02', program: 'Vom iPhone' }, '9a': { iso: '2026-07-04', program: 'Neu iPhone' }, '9b': { iso: '2026-07-02', weather: '🌧', program: 'Alt' }, '9c': { iso: '2026-07-02', program: 'Spät iPad' } };
for (const fall of [8, 9, '9a', '9b', '9c']) {
  const ipad = await dev(1180, 820), iphone = await dev(393, 852);
  await at(ipad, '09:00'); await ipad.goto(APP); await ipad.evaluate(t => { if (dlg.open) dlg.close(); db.trips = normalize({ trips: t }).trips; save(); showTrip('x'); }, base);
  const start = await backup(ipad);
  await at(iphone, '09:05'); await iphone.goto(APP); await iphone.evaluate(() => { if (dlg.open) dlg.close(); });
  await iphone.evaluate(() => { phoneList = true; render(); });
  await iphone.click('#sideMore'); await iphone.waitForTimeout(150);
  { const [ch] = await Promise.all([iphone.waitForEvent('filechooser'), iphone.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
    await ch.setFiles({ name: 's.json', mimeType: 'application/json', buffer: Buffer.from(start) }); await iphone.waitForTimeout(300);
    await iphone.locator('.pop button', { hasText: 'Ersetzen' }).click(); await iphone.waitForTimeout(300); }
  if (fall === 8) {   // gleicher (neuer) Tag, verschiedene Felder
    await at(ipad, '10:00'); await day(ipad, '2026-07-03', () => ipad.locator('[data-w="☀️"]').click());
    await at(iphone, '11:00'); await day(iphone, '2026-07-03', () => iphone.fill('#fProgram', 'Golden Circle'));
  } else if (fall === 9) {   // gleiches Feld, iPhone später
    await at(ipad, '10:00'); await day(ipad, '2026-07-02', () => ipad.fill('#fProgram', 'vom iPad'));
    await at(iphone, '11:00'); await day(iphone, '2026-07-02', () => iphone.fill('#fProgram', 'vom iPhone'));
  } else if (fall === '9a') {   // neuer Tag auf beiden, gleiches Feld
    await at(ipad, '10:00'); await day(ipad, '2026-07-04', () => ipad.fill('#fProgram', 'neu iPad'));
    await at(iphone, '11:00'); await day(iphone, '2026-07-04', () => iphone.fill('#fProgram', 'neu iPhone'));
  } else if (fall === '9b') {   // Wetter auf beiden
    await at(ipad, '10:00'); await day(ipad, '2026-07-02', () => ipad.locator('[data-w="☀️"]').click());
    await at(iphone, '11:00'); await day(iphone, '2026-07-02', () => iphone.locator('[data-w="🌧"]').click());
  } else {   // iPhone zuerst, iPad später
    await at(iphone, '10:00'); await day(iphone, '2026-07-02', () => iphone.fill('#fProgram', 'früh iPhone'));
    await at(ipad, '11:00'); await day(ipad, '2026-07-02', () => ipad.fill('#fProgram', 'spät iPad'));
  }
  await at(ipad, '12:00'); const fromIpad = await backup(ipad);
  await at(iphone, '12:05'); const fromIphone = await backup(iphone);
  await at(iphone, '12:10'); await load(iphone, fromIpad);
  await at(ipad, '12:15'); await load(ipad, fromIphone);
  const w = want[fall];
  for (const [name, p] of [['iPad', ipad], ['iPhone', iphone]]) {
    t.ort = `Fall ${fall} – ${name}`; await G(p, 'nach beiden Abgleichen');
    const d = await p.evaluate(i => db.trips[0].days[i] || {}, w.iso);
    if ((d.weather || '') !== (w.weather || '') || d.program !== w.program) errors.push(`Fall ${fall} – ${name}: Wetter ‚${d.weather}‘, Verlauf ‚${d.program}‘ statt ‚${w.weather || ''}‘/‚${w.program}‘`);
  }
  await ipad.context().close(); await iphone.context().close();
}
await t.ende(b);
