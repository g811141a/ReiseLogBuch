// Reiselogbuch-Test: pixelvergleich – Aufruf im Repo-Ordner: node tests/pixelvergleich.mjs (Bildschirmfotos landen in tests/out/)
// Vergleicht 40 Ansichten pixelgenau mit einer älteren Fassung: vorher die alte index.html als _alt.html neben index.html legen.
import { chromium } from 'playwright';
const trips = [{ id: 'a', title: 'Australien', participants: 'G', start: '2026-08-24', end: '2026-09-11', transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, fazit: 'Toll',
  days: { '2026-08-24': { weather: '☀️', program: 'Ankunft Sydney\nOpernhaus', mood: '🙂 super', food: '😋 Fischmarkt – frisch', quarter: 'Hotel Rocks', place: 'Sydney' } } },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} }];
const b = await chromium.launch(); let diff = 0, n = 0;
const steps = [
  ['start', async p => {}],
  ['sidemenu', async p => { await p.click('#sideMore'); }],
  ['main', async p => { await p.locator('.side-row', { hasText: 'Australien' }).click(); }],
  ['mehr', async p => { await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.click('#sideMore'); await p.waitForTimeout(100); await p.locator('.menu .mi', { hasText: 'Darstellung' }).click(); }],
  ['teilen', async p => { await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.click('#shareBtn'); }],
  ['suche', async p => { await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.click('#mainMore'); await p.waitForTimeout(100); await p.locator('.menu .mi', { hasText: 'Suchen' }).click(); await p.fill('#search', 'Opern'); await p.waitForTimeout(700); }],
  ['tag', async p => { await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.locator('table.days tbody tr').first().click(); }],
  ['einst', async p => { await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.click('#mainMore'); await p.locator('.menu .mi', { hasText: 'Reiselogbuch einstellen' }).click(); }],
  ['loeschen', async p => { await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.click('#mainMore'); await p.locator('.menu .mi', { hasText: 'löschen' }).click(); }],
  ['fazit', async p => { await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.locator('#fazit').scrollIntoViewIfNeeded(); await p.click('#fazit'); }],
];
for (const scheme of ['light', 'dark']) for (const [w, h] of [[1180, 820], [820, 1180]]) for (const [name, act] of steps) {
  const shots = [];
  for (const file of ['_alt.html', 'index.html']) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme, hasTouch: true });
    await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
    await p.goto(new URL('../' + file, import.meta.url).href);
    await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: 1787841120000 }, trips: t })), trips);
    await p.reload(); await p.waitForTimeout(300);
    await act(p); await p.waitForTimeout(400);
    shots.push(await p.screenshot()); await p.close();
  }
  n++; if (!shots[0].equals(shots[1])) { diff++; console.log('DIFF', scheme, w, name); }
}
console.log(`${n - diff}/${n} gleich`); await b.close();
