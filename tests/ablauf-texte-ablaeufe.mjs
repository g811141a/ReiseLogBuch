// Ablauf-Prüfungen der Texte und Abläufe (AppDesign APD-40 Pakete B und C, seit 3.50.0): R-4.11 Menüpunkt und Fenster heißen gleich (APD-40/B-5),
// R-4.12 erst fragen, dann zerstören (APD-40/C-5, C-6), R-5.10 automatisch speichern (APD-40/C-1 bis C-4) – iPad quer und iPhone hoch, hell. Eigene
// Prüfung, damit jede Gegenprobe (node tests/alle.mjs --gegenprobe masse) genau hier rot wird.
import * as pw from 'playwright';
import { pruefung, textSeite } from '../../AppDesign/fassung/4.54.0/tests/pruefe.mjs';
import { checkMenueFenster, checkAutoSpeichern, checkErstFragen } from '../../AppDesign/fassung/4.54.0/tests/ablauf.mjs';
const t = pruefung('ablauf-texte-ablaeufe', pw, { out: new URL('out/', import.meta.url) });
const days = {}; for (let i = 0; i < 40; i++) { const d = new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10); days[d] = { weather: '☀️', program: 'Programm ' + i }; }
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, days }];
const b = await t.browser();
for (const [w, h, scheme, dev] of [[1180, 820, 'light', 'iPad quer'], [393, 852, 'light', 'iPhone hoch']]) {
  const where = dev; t.ort = dev;
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700, colorScheme: scheme });
  p.on('pageerror', e => t.fehler('', `Skriptfehler der Seite: ${e.message}`));
  await textSeite(p);
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  if (!await p.locator('#mainMore').count() || await p.evaluate(() => side.classList.contains('over'))) { await p.locator('.irow, .side-row', { hasText: 'Australien' }).first().click(); await p.waitForTimeout(300); }
    // AppDesign APD-40 Pakete B und C (seit 3.50.0): R-4.11 Menüpunkt und Fenster heißen gleich (APD-40/B-5), R-4.12 erst fragen, dann zerstören
    // (APD-40/C-5, C-6) – Mehr-Menü, Teilen-Menü, am iPad Mehr-Menü und Kontextmenü der Seitenleiste, Fenster Tag (Smileys zurücksetzen)
    if (w < 700 && await p.evaluate(() => phoneList)) { await p.locator('.irow, .side-row', { hasText: 'Australien' }).first().click(); await p.waitForTimeout(300); }
    const ipad = w >= 700, kontext = async () => { const r = await p.locator('#side .side-row').first().boundingBox();
      await p.mouse.move(r.x + 40, r.y + r.height / 2); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(300); };
    t.liste(await checkMenueFenster(p, { where, menues: ['#mainMore', '#shareBtn', ...(ipad ? ['#sideMore'] : [])], ohne: ['HTML', 'PDF', 'Suchen', 'Backup', 'Abgleich'] }));
    t.liste(await checkErstFragen(p, { where, key: 'reiselogbuch.v1', menues: ['#mainMore', ...(ipad ? [kontext] : [])],
      zustaende: [{ name: 'Fenster Tag', open: () => p.evaluate(() => openDayDialog(db.trips[0], '2026-08-25')) }] }));
    await t.schritt(p, 'nach Menüpunkten und roten Aktionen', async () => {});
    // R-5.10 automatisch speichern (APD-40/C-1 bis C-4): eigene Seite, weil die Uhr vorgestellt wird – Fenster Tag (auch ein leerer Tag) und Fazit
    // Seit 3.50.1 (RLB-118): verglichen wird der ganze Speicher, auch die Zeitstempel des Abgleichs (dayAt, metaAt, changedAt, changedOn).
    const p2 = await b.newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700, colorScheme: scheme });
    await textSeite(p2);   // Gegenproben APD-40/C-1, C-2
    await p2.goto(new URL('../index.html', import.meta.url).href);
    await p2.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: t })), trips);
    await p2.reload(); await p2.waitForTimeout(300);
    if (!await p2.locator('#mainMore').count() || await p2.evaluate(() => side.classList.contains('over') || (typeof phoneList !== 'undefined' && phoneList))) { await p2.locator('.irow, .side-row', { hasText: 'Australien' }).first().click(); await p2.waitForTimeout(300); }
    t.liste(await checkAutoSpeichern(p2, { where: where + ', Tag', key: 'reiselogbuch.v1', field: '#fProgram', open: () => p2.evaluate(() => openDayDialog(db.trips[0], '2026-08-27')) }));
    t.liste(await checkAutoSpeichern(p2, { where: where + ', leerer Tag', key: 'reiselogbuch.v1', field: '#fProgram', open: () => p2.evaluate(() => openDayDialog(db.trips[0], '2026-11-05')) }));
    t.liste(await checkAutoSpeichern(p2, { where: where + ', Fazit', key: 'reiselogbuch.v1', field: '#fFazit', open: () => p2.evaluate(() => openFazitDialog(db.trips[0])) }));
    await p2.close();
  await p.close();
}
await t.ende(b);
