// Messmodus (seit 3.24.0, AppDesign A-27, R-1.6): Fall-Liste AppDesign/arbeit/A-27 Fall-Liste.md F1–F12 über checkMessung –
// iPad quer, iPhone hoch und quer, hell und dunkel, viele Tage; F10 leere App (nur starten und teilen).
// Aufruf im Repo-Ordner: node tests/ablauf-messung.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.30.2/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.30.2/tests/hig.mjs';
import { checkMessung } from '../../AppDesign/fassung/4.30.2/tests/ablauf.mjs';
const t = pruefung('ablauf-messung', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const days = {}; for (let i = 0; i < 60; i++) days[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { program: 'Programm ' + i, comment: 'Ausflug ans Meer' };
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-10-22', transport: ['flug'], days },
  { id: 'b', title: 'Neuseeland', participants: 'Anna', start: '2026-11-01', end: '2026-11-10', transport: ['flug'], days: {} }];
const b = await t.browser();
for (const [w, h, cs, dev] of [[1180, 820, 'light', 'iPad quer'], [393, 852, 'dark', 'iPhone hoch dunkel'], [852, 393, 'light', 'iPhone quer']]) {
  for (const leer of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 || h < 500, colorScheme: cs, acceptDownloads: true });
    const p = await ctx.newPage(); t.ort = `${dev}${leer ? ' leer' : ''}`;
    p.on('pageerror', e => t.fehler('', `Skriptfehler der Seite: ${e.message}`));
    await p.goto(new URL('../index.html', import.meta.url).href);
    await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: t })), leer ? [] : trips);
    await p.reload(); await p.waitForTimeout(300);
    const menu = async () => { if (!await p.locator('#sideMore').isVisible()) { await p.locator('#back, [data-side-toggle]').first().click(); await p.waitForTimeout(300); } await p.click('#sideMore'); };
    if (leer) {   // F10: leere App – starten, Menü zeigt ‚läuft‘, teilen liefert eine Datei (das Fenster ‚Neues Reiselogbuch‘ vorher schließen)
      await p.evaluate(() => dlg.open && dlg.close()); await p.waitForTimeout(200);
      await menu(); await p.waitForTimeout(200); await p.locator('.menu .mi', { hasText: 'Messung starten' }).click(); await p.waitForTimeout(300);
      if (!await p.evaluate(() => mess?.an)) t.fehler('', 'R-1.6 leere App: ‚Messung starten‘ startet keine Messung');
      await menu(); await p.waitForTimeout(200);
      const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 5000 }).catch(() => null), p.locator('.menu .mi', { hasText: 'Messung beenden und teilen' }).click()]);
      if (!dl) t.fehler('', 'R-1.6 leere App: ‚Messung beenden und teilen‘ liefert keine Datei');
    } else {
      const search = async () => { await p.click('#listSearchBtn'); await p.waitForTimeout(300); return '#lsearch'; };
      t.liste(await checkMessung(p, { menu, search, secret: ['Australien', 'Neuseeland', 'Programm', 'Ausflug'], where: t.ort }));
    }
    await t.schritt(p, 'nach der Messung', async () => {});   // Grundregeln im Endzustand
    await ctx.close();
  }
}
await t.ende(b);
