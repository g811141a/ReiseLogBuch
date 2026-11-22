// Allgemeine Prüfung ‚Backup erstellen‘ und ‚Backup laden‘ (AppDesign/tests/backup.mjs, R-9.1, R-9.2) – iPad und iPhone, hell und dunkel.
// Aufruf im Repo-Ordner: node tests/backup-regeln.mjs. Meldet Fehler mit Rückgabewert (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.68.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.68.0/tests/hig.mjs';
import { checkBackup } from '../../AppDesign/fassung/4.68.0/tests/backup.mjs';
import { checkHinweisBreite } from '../../AppDesign/fassung/4.68.0/tests/ablauf.mjs';
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-09-05', transport: ['flug'], days: { '2026-08-24': { program: 'Sydney' } } }];
const hig = createCheck();
const t = pruefung('backup-regeln', pw, { hig, out: new URL('out/', import.meta.url) });
const b = await t.browser();
// seit 3.55.0 (AppDesign APD-116, R-10.8: Dateiname im Fenster ‚Backup‘, checkDateiname in checkBackup) auch iPad hoch – vier Lagen
// seit 3.57.7 (AppDesign APD-138): am iPad steht der Name in einer Zeile (D-1, D-2, D-7, D-8 in checkDateiname), dazu checkHinweisBreite (iPad quer hell)
for (const [w, h, dev] of [[1180, 820, 'iPad quer'], [820, 1180, 'iPad hoch'], [393, 852, 'iPhone hoch'], [852, 393, 'iPhone quer']]) for (const cs of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 || h < 500, colorScheme: cs, acceptDownloads: true });
  const p = await ctx.newPage(); t.ort = `${dev} ${cs === 'light' ? 'hell' : 'dunkel'}`;
  p.on('pageerror', e => t.fehler('', `Skriptfehler der Seite: ${e.message}`));
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  t.liste(await checkBackup(p, { menu: '#sideMore', list: 'trips', where: t.ort }));
  // seit 3.57.7 (AppDesign APD-138/D-3 bis D-6, D-9, D-10, R-10.8): Breite nach Dateiname am iPad – kurz, sehr lang, Text 53, schmal, drehen, Gegenprobe
  if (dev === 'iPad quer' && cs === 'light') t.liste(await checkHinweisBreite(p, { where: t.ort }));
  // seit 3.57.7 (AppDesign APD-135/S-9, S-10, R-3.3): Backup aus dem Mehr-Menü – nach dem Teilen baut renderSide die Seitenleiste neu auf, während das
  // Fenster ‚Backup‘ offen ist; die gehaltene Mehr-Schaltfläche bleibt blau (AD-Bean sourcehighlight, refresh) und ist nach dem Schließen nicht mehr blau
  if (dev === 'iPad quer' && cs === 'light') {
    await p.evaluate(() => { localStorage.setItem('reiselogbuch.v1', JSON.stringify({ ...JSON.parse(localStorage.getItem('reiselogbuch.v1')), settings: {} })); });
    await p.reload(); await p.waitForTimeout(400);
    await p.evaluate(() => { const n = navigator; Object.defineProperty(n, 'canShare', { value: () => true, configurable: true, writable: true });
      Object.defineProperty(n, 'share', { value: () => Promise.resolve(), configurable: true, writable: true }); document.querySelector('#sideMore').__alt = true; });
    await p.click('#sideMore'); await p.locator('.menu .mi', { hasText: 'Backup erstellen' }).click();
    await p.waitForSelector('#msg[open]', { timeout: 4000 }).catch(() => {});
    const r = await p.evaluate(() => { const m = document.querySelector('#sideMore'); return { offen: msg.open, neu: !!m && !m.__alt, blau: !!m?.classList.contains('on') }; });
    t.wahr(`APD-135/S-9 Backup aus dem Mehr-Menü: Fenster offen ${r.offen}, Seitenleiste neu aufgebaut ${r.neu}, Mehr-Schaltfläche blau ${r.blau}`, r.offen && r.neu && r.blau, 'R-3.3');
    if (r.offen) { await p.click('#msg [data-x]'); await p.waitForTimeout(400); }
    t.wahr('APD-135/S-9 nach dem Schließen ist die Mehr-Schaltfläche nicht mehr blau', !await p.evaluate(() => document.querySelector('#sideMore')?.classList.contains('on')), 'R-3.3');
  }
  await t.schritt(p, 'nach Backup erstellen und laden', async () => {});   // Grundregeln im Endzustand
  await ctx.close();
}
await t.ende(b);
