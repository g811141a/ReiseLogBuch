// Reiselogbuch-Test: verlauf-vorschlaege – Vorschläge im Fenster ‚Tag‘, Schritt Verlauf (seit 3.22.0, RLB-94; Testfall-Liste
// AppDesign arbeit/APD-23 RLB-94 Testfall-Liste.md V1–V13): Reihenfolge, ‚Tour …‘ wie die anderen (eigene Zeile an der Cursorstelle),
// ‚Sonstiges …‘ setzt nur eine leere erste Zeile und den Cursor dorthin (nie eine zweite), danach groß weiter.
// iPad quer und hoch, iPhone hoch und quer, hell und dunkel (Grundregeln nach jedem Schritt).
// Aufruf im Repo-Ordner: node tests/verlauf-vorschlaege.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.44.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.44.0/tests/hig.mjs';
const t = pruefung('verlauf-vorschlaege', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const TRIPS = [{ id: 'a', title: 'Wien', participants: 'G & A', start: '2026-08-24', end: '2026-08-30', transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true,
  days: { '2026-08-24': { weather: '☀️', program: 'Ankunft', comment: '', quarter: 'Hotel', place: 'Wien' } } }];
const SOLL = ['Weiterfahrt nach …', 'Rundgang durch …', 'Besichtigung …', 'Freetour …', 'Tour …', 'Sonstiges …'];
const b = await t.browser();
for (const [ansicht, theme] of [['iPad quer', 'light'], ['iPad hoch', 'dark'], ['iPhone hoch', 'dark'], ['iPhone quer', 'light']]) {
  const p = await t.seite(b, ansicht, { theme });
  t.ort = `${ansicht} ${theme === 'dark' ? 'dunkel' : 'hell'}`;
  p.on('pageerror', e => t.fehler('', `${ansicht}: Skriptfehler ${e.message}`));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), TRIPS);
  await p.reload(); await p.waitForTimeout(400);
  if (await p.evaluate(() => document.documentElement.classList.contains('phone')) && await p.locator('#side .side-row[data-id="a"]').isVisible()) {
    await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400);
  }
  await t.schritt(p, 'Fenster Tag öffnen', async () => { await p.evaluate(() => [...document.querySelectorAll('[data-day="2026-08-24"]')].find(e => e.getClientRects().length).click()); await p.waitForTimeout(400); });
  const ta = p.locator('#fProgram');
  const wert = () => ta.inputValue();
  const cursor = () => ta.evaluate(f => [f.selectionStart, f.selectionEnd, document.activeElement === f]);
  const knopf = name => p.locator('#suggest button', { hasText: new RegExp('^' + name + '$') });
  // jeder Fall frisch: Groß-Merker eines vorigen Vorschlags (capNext, ui.js) gilt sonst bis zum nächsten Buchstaben
  const setze = async (v, pos) => { await ta.evaluate(f => delete f.dataset.capNext); await ta.fill(v); await ta.evaluate((f, pos) => { f.focus(); f.selectionStart = f.selectionEnd = pos ?? f.value.length; }, pos); };
  // V1 Reihenfolge
  t.ist('V1 Reihenfolge der Vorschläge', await p.locator('#suggest button').allTextContents(), SOLL, 'RLB-94');
  // V2 ‚Tour …‘ im leeren Feld, dann tippen → groß
  await setze(''); await knopf('Tour …').click(); await p.keyboard.type('wien');
  t.ist('V2 Tour im leeren Feld', await wert(), 'Tour Wien', 'RLB-94');
  // V3 ‚Tour …‘ mitten im Text → eigene Zeile an der Cursorstelle
  await setze('Ankunft\nAbendessen', 7); await knopf('Tour …').click();
  t.ist('V3 Tour an der Cursorstelle', await wert(), 'Ankunft\nTour \nAbendessen', 'RLB-94');
  // V4 ‚Sonstiges …‘ im leeren Feld
  await setze(''); await knopf('Sonstiges …').click();
  t.ist('V4 Sonstiges im leeren Feld', [await wert(), ...await cursor()], ['', 0, 0, true], 'RLB-94');
  // V5 Text vorhanden → leere erste Zeile, Cursor dort
  await setze('Ankunft\nAbendessen'); await knopf('Sonstiges …').click();
  t.ist('V5 Sonstiges mit Text', [await wert(), ...await cursor()], ['\nAnkunft\nAbendessen', 0, 0, true], 'RLB-94');
  // V8 zweimal → nur eine leere Zeile
  await knopf('Sonstiges …').click();
  t.ist('V8 Sonstiges zweimal', await wert(), '\nAnkunft\nAbendessen', 'RLB-94');
  // V6 erste Zeile schon leer, Cursor am Ende → keine zweite, Cursor an den Anfang
  await setze('\nAnkunft'); await knopf('Sonstiges …').click();
  t.ist('V6 erste Zeile schon leer', [await wert(), ...await cursor()], ['\nAnkunft', 0, 0, true], 'RLB-94');
  // V7 Cursor mitten im Text → trotzdem am Anfang
  await setze('Ankunft\nAbendessen', 4); await knopf('Sonstiges …').click();
  t.ist('V7 Sonstiges, Cursor mitten im Text', [await wert(), ...await cursor()], ['\nAnkunft\nAbendessen', 0, 0, true], 'RLB-94');
  // V9 danach tippen → groß in der ersten Zeile
  await p.keyboard.type('museum');
  t.ist('V9 nach Sonstiges groß weiter', await wert(), 'Museum\nAnkunft\nAbendessen', 'RLB-94');
  // V10 Feld wächst mit, die erste Zeile ist sichtbar
  await setze(Array.from({ length: 12 }, (_, i) => 'Punkt ' + i).join('\n')); await knopf('Sonstiges …').click();
  t.wahr('V10 Feld zeigt alle Zeilen (wächst mit)', await ta.evaluate(f => f.scrollHeight <= f.clientHeight + 2), 'RLB-94');
  t.wahr('V10 erste Zeile im Bild', await ta.evaluate(f => { const r = f.getBoundingClientRect(), dr = document.querySelector('#dlg .dlg-body')?.getBoundingClientRect() ?? { top: 0, bottom: innerHeight };
    return f.scrollTop === 0 && r.top >= dr.top - 1 && r.top + 30 <= dr.bottom; }), 'RLB-94');
  // V11 Häkchen blau nach dem Einfügen
  t.wahr('V11 Häkchen blau nach Sonstiges', await p.locator('#dlgOk').evaluate(e => e.classList.contains('primary')), 'R-4.4');
  // V12 Aufbau der Reihe (Grundregeln: nichts abgeschnitten, Ziele ≥ 44 px) – im Schritt
  await t.schritt(p, 'Vorschläge im Bild', async () => { await p.locator('#suggest').scrollIntoViewIfNeeded(); await p.waitForTimeout(200); });
  await p.close();
}
await t.ende(b);
