// Reiselogbuch-Test: ablauf-feld-tastatur – AppDesign APD-35 (seit 3.26.0, R-4.5; Testfall-Liste AppDesign arbeit/APD-26 APD-31 APD-34
// Testfall-Liste.md Abschnitt 10, APD-34/F-1 bis APD-34/F-10): Gesamtausgaben (unterstes Feld im Inhalt) antippen – das Feld steht bei offener
// Tastatur ganz sichtbar, 16 px über ihr; nachgebaut ist der Ablauf der Messung iPhone quer vom 19.10.2026 (‚Ans Ende‘, dann
// Gesamtausgaben antippen; Safari-Modell: Zifferntastatur 170 px sichtbar, Safari verschiebt den sichtbaren Bereich um 232 px).
// Gegen 3.25.1 (AppDesign 4.27.1) rot. iPad nur am Gerät (keine Messung der Tastatur, Safari-Modell nur iPhone).
// Aufruf im Repo-Ordner: node tests/ablauf-feld-tastatur.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.36.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.36.0/tests/hig.mjs';
import { checkFieldVisible } from '../../AppDesign/fassung/4.36.0/tests/ablauf.mjs';
import { safariModell } from '../../AppDesign/fassung/4.36.0/tests/safari.mjs';
const t = pruefung('ablauf-feld-tastatur', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const days = {}; for (let i = 0; i < 30; i++) days[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Programm ' + i, quarter: 'Hotel ' + i, place: 'Sydney' };
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-09-22', transport: ['flug'], days }];
const b = await t.browser();
for (const theme of ['light', 'dark']) {
  for (const ansicht of ['iPhone quer', 'iPhone hoch']) {
    const p = await t.seite(b, ansicht, { theme });
    t.ort = `${ansicht} ${theme === 'dark' ? 'dunkel' : 'hell'}`;
    await p.goto(APP);
    await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
    await p.reload(); await p.waitForTimeout(400);
    if (await p.locator('#side .side-row[data-id="a"]').isVisible()) { await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400); }
    await p.waitForFunction(() => document.querySelector('#kosten'), null, { timeout: 3000 }).catch(() => {});
    await safariModell(p, ansicht);
    // wie am Gerät: ‚Ans Ende‘ (Kapsel), dann Gesamtausgaben antippen (APD-34/F-1, APD-34/F-2, APD-34/F-6 Platz unter dem Inhalt, APD-34/F-3, APD-34/F-4). Unter dem
    // Feld stehen noch die Reisedaten; das Feld wird deshalb an den unteren Rand des Inhalts gerollt (24 px darüber) – dort ist
    // es am Gerät gerade noch antippbar und liegt am tiefsten unter der Tastatur.
    const unten = async () => { await p.click('#toEnd'); await p.waitForTimeout(900);
      await p.evaluate(() => { const r = document.querySelector('#app > .rolle'), k = document.querySelector('#kosten');
        r.scrollTop += k.getBoundingClientRect().bottom - (r.getBoundingClientRect().bottom - 24); }); };
    t.liste(await checkFieldVisible(p, { field: '#kosten', where: t.ort, vorher: unten }));
    await t.schritt(p, 'nach Gesamtausgaben mit Tastatur', async () => {});   // Grundregeln im Endzustand
    await p.close();
  }
}
await t.ende(b);
