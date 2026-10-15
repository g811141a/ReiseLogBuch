// Reiselogbuch-Test: tastatur – Fenster bei offener Tastatur: das Fenster passt in den sichtbaren Bereich über der Tastatur,
// die Kopfzeile (x, Häkchen) bleibt sichtbar (R-4.5). Aufruf im Repo-Ordner: node tests/tastatur.mjs. Meldet Fehler (seit 3.12.0).
// Seit 3.12.0 wie Safari nachgebildet (Zusammenarbeit 0 Nr. 5): die Tastatur verkleinert nur den sichtbaren Bereich
// (visualViewport.height), nicht das Fenster – früher wurde das Fenster auf 420 px verkleinert, dadurch schaltete die App in die
// iPhone-Ansicht und der Test prüfte am iPad die falsche Ansicht.
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.16.1/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.16.1/tests/hig.mjs';
const t = pruefung('tastatur', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const days = { '2026-08-25': { weather: '🌤', program: 'Weiterfahrt nach Sydney', comment: '😊 Oper', food: '👍 Fisch', quarter: 'Cambridge Hotel', place: 'Sydney' } };
const b = await t.browser();
for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch']) for (const theme of ['light', 'dark']) {
  const p = await t.seite(b, ansicht, { theme, deviceScaleFactor: 2 });
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(d => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: [{ id: 'a', title: 'Australien', participants: 'X', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], foodColumn: true, days: d }] })), days);
  await p.reload(); await p.waitForTimeout(300);
  const vh = p.viewportSize().height, kb = Math.round(vh * 0.45);   // Tastatur etwa 45 % der Höhe
  const box = () => p.evaluate(() => { const d = dlg.getBoundingClientRect(), h = dlg.querySelector('.dlg-head').getBoundingClientRect(); return { top: Math.round(d.top), bottom: Math.round(d.bottom), head: Math.round(h.top) }; });
  const tastatur = auf => p.evaluate(([auf, sichtbar]) => {
    if (auf) Object.defineProperty(visualViewport, 'height', { get: () => sichtbar, configurable: true }); else delete visualViewport.height;
    visualViewport.dispatchEvent(new Event('resize'));
  }, [auf, vh - kb]);
  for (const [name, fn] of [['Tageserfassung', () => openDayDialog(db.trips[0], '2026-08-25')], ['Einstellungen', () => openTripDialog(db.trips[0])]]) {
    await t.schritt(p, `${name} ohne Tastatur`, async () => { await p.evaluate(fn); await p.waitForTimeout(250); });
    t.ist(`${name} ohne Tastatur: Fenster ganz sichtbar, Kopfzeile oben im Fenster`, await box(), x => x.top >= 0 && x.bottom <= vh && x.head === x.top, 'R-4.5');
    await t.schritt(p, `${name} mit Tastatur`, async () => { await tastatur(true); await p.waitForTimeout(250); });
    t.ist(`${name} mit Tastatur: Fenster über der Tastatur (bis ${vh - kb} px), Kopfzeile sichtbar`, await box(), x => x.top >= 0 && x.bottom <= vh - kb + 1 && x.head === x.top, 'R-4.5');
    await p.screenshot({ path: new URL(`out/kbd-${name}-${t.ort.replace(/ /g, '-')}-${t.browserName}.png`, import.meta.url).pathname });
    await tastatur(false); await p.evaluate(() => dlg.close()); await p.waitForTimeout(100);
  }
  await p.close();
}
await t.ende(b);
