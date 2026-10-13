import { chromium } from 'playwright';
const SP = process.argv[2], tag = process.argv[3] || 'muster2';
const b = await chromium.launch();
const scen = async (p, which) => p.evaluate(which => {
  const T = h => new Date(`2026-10-13T${h}:00`).getTime();
  const mk = (id, title, start, days) => ({ id, title, participants: 'Anna, Ben', start, end: start.replace(/\d\d$/, '28'), transport: ['pkw'], days });
  const base = { settings: {}, trips: [
    mk('it', 'Italien 2026', '2026-10-10', { '2026-10-12': { program: 'Florenz' }, '2026-10-13': { weather: '☀️' } }),
    mk('fr', 'Frankreich', '2025-07-01', {}), mk('es', 'Spanien', '2024-05-01', {}), mk('nl', 'Holland', '2023-04-01', {}), mk('ta', 'Test A', '2022-01-01', {})], deleted: [] };
  normalize(base);
  const start = structuredClone(base); sync.stamp(start, new Map(), T('09:00'), 'iPad');
  const other = deviceName() === 'iPad' ? 'iPhone' : 'iPad', me = deviceName();
  const there = structuredClone(start), here = structuredClone(start);
  let si = sync.snapshot(there), sp = sync.snapshot(here);
  const it = d => d.trips.find(t => t.id === 'it');
  if (which === 1) {
    it(there).days['2026-10-12'] = { program: 'Florenz, Uffizien und Ponte Vecchio', weather: '🌤' };
    it(there).days['2026-10-13'].comment = 'Toller Tag in der Altstadt';
    there.trips.push(normalize({ trips: [mk('kr', 'Kreta', '2027-05-01', { '2027-05-01': { program: 'Anreise' }, '2027-05-02': { program: 'Strand' } })] }).trips[0]);
    there.trips = there.trips.filter(t => t.id !== 'ta');
    si = sync.stamp(there, si, T('10:00'), other);
    it(here).days['2026-10-14'] = { program: 'Siena' };
    sp = sync.stamp(here, sp, T('11:00'), me);
  } else if (which === 3) {
  } else {
    it(there).days['2026-10-12'].program = 'Version ' + other; si = sync.stamp(there, si, T('10:00'), other);
    it(here).days['2026-10-12'].program = 'Version ' + me; sp = sync.stamp(here, sp, T('11:00'), me);
  }
  if (dlg.open) dlg.close(); db = here; lastSnap = sync.snapshot(db); currentTripId = 'it'; render();
  const { stats } = sync.merge(structuredClone(here), structuredClone(there));
  sync.showResult(stats, T('10:05'), other);
}, which);
const PH = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
for (const [w, h, name, dark, which, report] of [[393, 852, '1-iphone-hoch-hell-fenster', false, 1, false], [1180, 820, '2-ipad-quer-hell-bericht', false, 1, true],
  [393, 852, '3-iphone-hoch-dunkel-bericht', true, 1, true], [820, 1180, '4-ipad-hoch-dunkel-gleicher-stand', true, 3, false]]) {
  const phone = w < 700 || h < 500;
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: phone, colorScheme: dark ? 'dark' : 'light', userAgent: phone ? PH : undefined });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(new URL('../index.html', import.meta.url).href); await p.waitForTimeout(300);
  await scen(p, which); await p.waitForTimeout(400);
  if (report) { await p.click('#msg [data-act]'); await p.waitForTimeout(500); }
  await p.screenshot({ path: `${SP}/${tag}-${name}.png` });
  await p.close();
}
await b.close();
