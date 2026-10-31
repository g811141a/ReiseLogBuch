// Reiselogbuch-Test: ablauf-navigation – AppDesign APD-61 Teil 1 (seit 3.28.0, R-7.5; Testfall-Liste AppDesign arbeit/APD-61 Teil 1 Testfall-Liste.md
// APD-61/F-1 bis APD-61/F-21, Variante ‚Überall‘): Seitenwechsel als Schieben, Zurückwischen am iPhone von überall im Inhalt, Seitenleiste am iPad hoch
// per Wischen; seit 3.29.0 (AppDesign APD-68, Variante B, APD-68/Q-1 bis APD-68/Q-12) am iPad quer die ausgeblendete Seitenleiste per Wischen – iPhone hoch und quer, iPad hoch und quer, hell und dunkel, dazu ‚Bewegung reduzieren‘ (APD-68/F-19).
// Waagrecht rollender Bereich am iPhone: die Zeile Reisemittel (#reisemittel, seit 3.38.0 Wischzeile, AppDesign APD-86). Grundregeln nach den Schritten (pruefe.mjs).
// Aufruf im Repo-Ordner: node tests/ablauf-navigation.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.48.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.48.0/tests/hig.mjs';
import { checkNavigation } from '../../AppDesign/fassung/4.48.0/tests/ablauf.mjs';
const t = pruefung('ablauf-navigation', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const tage = {}; for (let i = 0; i < 40; i++) tage[new Date(Date.UTC(2019, 2, 2 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Programm ' + i, quarter: 'Hotel ' + i, place: 'Tokio' };
// Japan steht in der Mitte der Liste: der Rollstand der Startliste lässt sich ändern, ohne dass der Eintrag aus dem Bild rollt (APD-38/T-7, R-7.1)
const trips = [{ id: 'a', title: 'Japan', participants: 'Anna', start: '2019-03-02', end: '2019-04-10', transport: ['pkw', 'zug', 'rad', 'flug', 'leihwagen', 'schiff'], foodColumn: true, quarterColumn: true, days: tage },
  ...Array.from({ length: 14 }, (_, i) => ({ id: 't' + i, title: 'Reise ' + (i + 1), participants: 'A', start: `${2025 - i}-06-01`, end: `${2025 - i}-06-10`, transport: ['pkw'], days: { [`${2025 - i}-06-02`]: { program: 'Stadt ' + i } } }))];
const b = await t.browser();
const faelle = [['iPhone hoch', 'light'], ['iPhone quer', 'dark'], ['iPad hoch', 'light'], ['iPad quer', 'dark'], ['iPhone hoch', 'dark'], ['iPad hoch', 'dark'],
  ['iPhone hoch', 'light', 'reduce'], ['iPad hoch', 'light', 'reduce'], ['iPad quer', 'light'], ['iPad quer', 'light', 'reduce']];
for (const [ansicht, theme, bewegung] of faelle) {
  const p = await t.seite(b, ansicht, { theme, ...(bewegung ? { reducedMotion: bewegung } : {}) });
  if (bewegung) t.ort = `${t.ort} · Bewegung reduzieren`;
  await p.clock.setFixedTime(new Date('2026-03-20T10:00:00'));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400);
  const phone = ansicht.startsWith('iPhone');
  // seit 3.43.0 (AppDesign APD-97): am iPad hoch steht die Seitenleiste wie quer fest neben dem Inhalt – Start mit offenem Reiselogbuch und Leiste
  await t.schritt(p, 'Start', async () => {});
  for (const x of await checkNavigation(p, { eintrag: '#side .side-row[data-id="a"]', titel: 'Japan', zurueck: '#back', waagrecht: ansicht === 'iPhone hoch' && !await p.evaluate(() => document.documentElement.classList.contains('ts-um')) ? '#reisemittel' : null,   // bei großer Schrift umbrochen statt wischbar (RLB-101)
   
    knopf: '#shareBtn', menue: '#mainMore', suche: '#mainMore', kasten: '#app .box.day', where: t.ort })) t.fehler('', x);
  await navFertig(p);
  await t.schritt(p, 'nach den Gesten', async () => {});
  await p.close();
}
await t.ende(b);
