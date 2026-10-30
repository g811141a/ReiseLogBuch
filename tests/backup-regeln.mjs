// Allgemeine Prüfung ‚Backup erstellen‘ und ‚Backup laden‘ (AppDesign/tests/backup.mjs, R-9.1, R-9.2) – iPad und iPhone, hell und dunkel.
// Aufruf im Repo-Ordner: node tests/backup-regeln.mjs. Meldet Fehler mit Rückgabewert (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.43.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.43.0/tests/hig.mjs';
import { checkBackup } from '../../AppDesign/fassung/4.43.0/tests/backup.mjs';
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-09-05', transport: ['flug'], days: { '2026-08-24': { program: 'Sydney' } } }];
const hig = createCheck();
const t = pruefung('backup-regeln', pw, { hig, out: new URL('out/', import.meta.url) });
const b = await t.browser();
for (const [w, h, dev] of [[1180, 820, 'iPad quer'], [393, 852, 'iPhone hoch'], [852, 393, 'iPhone quer']]) for (const cs of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 || h < 500, colorScheme: cs, acceptDownloads: true });
  const p = await ctx.newPage(); t.ort = `${dev} ${cs === 'light' ? 'hell' : 'dunkel'}`;
  p.on('pageerror', e => t.fehler('', `Skriptfehler der Seite: ${e.message}`));
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  t.liste(await checkBackup(p, { menu: '#sideMore', list: 'trips', where: t.ort }));
  await t.schritt(p, 'nach Backup erstellen und laden', async () => {});   // Grundregeln im Endzustand
  await ctx.close();
}
await t.ende(b);
