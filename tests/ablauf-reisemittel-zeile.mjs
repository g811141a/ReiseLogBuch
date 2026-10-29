// Reiselogbuch-Test: ablauf-reisemittel-zeile – AppDesign APD-86 (seit 3.38.0, R-5.4; Testfall-Liste AppDesign arbeit/APD-86 Testfall-Liste.md
// W1–W9): die Zeile ‚Reisemittel‘ im Kopf eines Reiselogbuchs wischt am iPhone seitlich – wo es weitergeht, Verlauf und kleiner Pfeil am
// Rand wie in der Auswahl-Kapsel, am jeweiligen Ende verschwinden beide; passt alles bzw. bricht die Zeile um (iPad, große Schrift), weder
// Verlauf noch Pfeil und nichts abgeschnitten. Ablauf des Nutzers (29.10.2026): iPhone hoch, Reiselogbuch mit vielen Reisemitteln öffnen.
// Grundregeln nach jedem Schritt (mit hig.mjs: jeder seitlich wischbare Bereich zeigt, wo es weitergeht).
// Aufruf im Repo-Ordner: node tests/ablauf-reisemittel-zeile.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.40.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.40.0/tests/hig.mjs';
import { checkKapsel } from '../../AppDesign/fassung/4.40.0/tests/ablauf.mjs';
const t = pruefung('ablauf-reisemittel-zeile', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 6; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1}`, place: 'Hafen' };
const ALLE = ['pkw', 'zug', 'rad', 'flug', 'leihwagen', 'schiff', 'wohnmobil', 'fuss'];
const reise = transport => [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(0), end: iso(5), transport, foodColumn: true, moodColumn: true, days }];
// Die Zeile ‚Reisemittel‘: die Rollfläche darin (dd selbst oder ein Kind, das seitlich überläuft) mit Verlauf und Pfeilen daneben
const zeile = p => p.evaluate(() => {
  const dt = [...document.querySelectorAll('#app .meta.trip dt')].find(d => d.textContent.startsWith('Reisemittel')), dd = dt?.nextElementSibling;
  if (!dd) return null;
  const roll = [dd, ...dd.querySelectorAll('*')].find(e => /auto|scroll/.test(getComputedStyle(e).overflowX) && e.scrollWidth > e.clientWidth + 2);
  const abgeschnitten = [dd, ...dd.querySelectorAll('*')].some(e => e !== roll && !roll?.contains(e) && e.scrollWidth > e.clientWidth + 2);
  if (!roll) return { wischt: false, abgeschnitten, rechts: Math.round(dd.getBoundingClientRect().right), breite: innerWidth };
  const cs = getComputedStyle(roll), mask = (cs.maskImage || cs.webkitMaskImage || 'none') !== 'none';
  const pf = x => roll.parentElement.querySelector(`:scope > .pf.${x}`);
  return { wischt: true, abgeschnitten, mask, l: !!pf('l')?.classList.contains('an'), r: !!pf('r')?.classList.contains('an'), pfeile: !!pf('l') && !!pf('r'),
    sl: Math.round(roll.scrollLeft), max: Math.round(roll.scrollWidth - roll.clientWidth),
    sel: roll.id ? `#${roll.id}` : null };
});
const b = await t.browser();
for (const [ansicht, theme, ruhig, transport, soll] of [
  ['iPhone hoch', 'light', false, ALLE, 'wischt'],              // W1–W4, W6: der Ablauf des Nutzers
  ['iPhone hoch', 'dark', false, ALLE, 'wischt'],               // W7
  ['iPhone hoch', 'light', true, ALLE, 'wischt'],               // W8 ‚Bewegung reduzieren‘
  ['iPhone quer', 'light', false, ALLE, 'egal'],                // W5 quer: wischt nur, wenn es nicht passt
  ['iPhone hoch', 'light', false, ['flug'], 'passt'],           // W5 ein Reisemittel passt
  ['iPad quer', 'light', false, ALLE, 'passt'],                 // W9 iPad: umbrochen, nichts abgeschnitten
  ['iPad hoch', 'dark', false, ALLE, 'passt']]) {
  const p = await t.seite(b, ansicht, { theme, ...(ruhig ? { reducedMotion: 'reduce' } : {}) });
  t.ort = `${t.ort}${ruhig ? ' Bewegung reduzieren' : ''} · ${transport.length} Reisemittel`;
  await p.clock.setFixedTime(new Date('2026-09-02T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), reise(transport));
  await p.reload(); await p.waitForTimeout(400);
  if (await p.locator('#side.page').isVisible()) { await p.locator('#side .side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(600); }
  await t.schritt(p, 'Reiselogbuch offen', async () => {
    const z = await zeile(p);
    if (!t.wahr('Zeile ‚Reisemittel‘ fehlt im Kopf des Reiselogbuchs', z, 'R-5.4')) return;
    t.wahr(`W9: in der Zeile ‚Reisemittel‘ ist Text abgeschnitten, ohne dass sie wischt`, !z.abgeschnitten, 'R-5.4');
    if (soll === 'passt') { t.wahr(`W5/W9: Zeile ‚Reisemittel‘ soll ganz passen, wischt aber (${z.max} px mehr)`, !z.wischt, 'R-5.4'); return; }
    if (soll === 'wischt' && !t.wahr('W1: Zeile ‚Reisemittel‘ mit allen Reisemitteln soll am iPhone hoch seitlich wischen', z.wischt, 'R-5.4')) return;
    if (!z.wischt) return;
    t.wahr('W1: Zeile ‚Reisemittel‘ geht rechts weiter, aber ohne Verlauf am Rand (läuft hart ab)', z.mask, 'R-5.4');
    t.wahr('W2: Zeile ‚Reisemittel‘ geht rechts weiter, aber ohne kleinen Pfeil › am Rand', z.r, 'R-5.4');
    t.wahr('W2: am Anfang der Zeile ‚Reisemittel‘ steht links ein Pfeil ‹', !z.l, 'R-5.4');
    // W3, W4, W6–W8: Mitte, Ende, zurück, Drehen – dieselbe Prüfung wie die Auswahl-Kapsel (K1–K3, K5, K6, K12)
    if (z.pfeile && z.sel) t.liste(await checkKapsel(p, { sel: z.sel, drehen: ansicht === 'iPhone hoch', where: 'Reisemittel-Zeile' }));
    else t.wahr('W3: Zeile ‚Reisemittel‘ ohne Pfeile ‹ › bzw. ohne id der Rollfläche', false, 'R-5.4');
  });
  await p.close();
}
await t.ende(b);
