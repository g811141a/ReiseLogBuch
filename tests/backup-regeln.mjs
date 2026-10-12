// Allgemeine Prüfung ‚Backup erstellen‘ und ‚Backup laden‘ (AppDesign/tests/backup.mjs, R-45, R-46) – iPad und iPhone, hell und dunkel.
// Aufruf im Repo-Ordner: node tests/backup-regeln.mjs
import { chromium } from 'playwright';
import { checkBackup } from '../../AppDesign/tests/backup.mjs';
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-09-05', transport: ['flug'], days: { '2026-08-24': { program: 'Sydney' } } }];
const b = await chromium.launch();
const errors = [];
for (const [w, h, dev] of [[1180, 820, 'iPad quer'], [393, 852, 'iPhone hoch'], [852, 393, 'iPhone quer']]) for (const cs of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 || h < 500, colorScheme: cs, acceptDownloads: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(`${dev}: ${e.message}`));
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  if (w < 700 || h < 500) { await p.click('#back'); await p.waitForTimeout(250); }
  errors.push(...await checkBackup(p, { menu: '#sideMore', list: 'trips', where: `${dev} ${cs === 'light' ? 'hell' : 'dunkel'}` }));
  await ctx.close();
}
console.log('ERR', JSON.stringify(errors, null, 1));
await b.close();
