// Reiselogbuch-Test: verlauf-vorschlaege – Vorschläge im Fenster ‚Tag‘, Schritt Verlauf (seit 3.22.0, RLB-94; Testfall-Liste
// AppDesign arbeit/APD-23 RLB-94 Testfall-Liste.md V1–V13). Seit 3.55.0 (RLB-123, Testfall-Liste AppDesign arbeit/4.57.0 Testfall-Liste.md
// RLB-123/B-1 bis B-8): Vorschläge über dem Feld (B-1); ein Vorschlag kommt nach der letzten Zeile, Cursor am Ende, danach klein weiter (B-2, B-3);
// ‚Sonstiges …‘ hängt eine leere Zeile an, nie eine zweite (B-4), danach getippt in der neuen letzten Zeile (B-5); 12 Zeilen: alles und die neue
// letzte Zeile zu sehen (B-6); Reihenfolge, Häkchen blau, Aufbau der Reihe (B-7 = V1, V11, V12); Verlauf leer einzeilig, wächst mit dem Vorschlag (B-8).
// iPad quer und hoch, iPhone hoch und quer, hell und dunkel (Grundregeln nach jedem Schritt).
// Aufruf im Repo-Ordner: node tests/verlauf-vorschlaege.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.57.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.57.0/tests/hig.mjs';
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
    await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400); await navFertig(p);
  }
  await t.schritt(p, 'Fenster Tag öffnen', async () => { await p.evaluate(() => [...document.querySelectorAll('[data-day="2026-08-24"]')].find(e => e.getClientRects().length).click()); await p.waitForTimeout(400); });
  const ta = p.locator('#fProgram');
  const wert = () => ta.inputValue();
  const cursor = () => ta.evaluate(f => [f.selectionStart, f.selectionEnd, document.activeElement === f]);
  const knopf = name => p.locator('#suggest button', { hasText: new RegExp('^' + name + '$') });
  // jeder Fall frisch: Wert setzen, Fokus durch die Prüfung (Cursor erst am Ende, R-5.11), dann an die gewünschte Stelle
  const setze = async (v, pos) => { await ta.fill(v); await ta.evaluate((f, pos) => { f.focus(); f.selectionStart = f.selectionEnd = pos ?? f.value.length; }, pos); await p.waitForTimeout(50); };
  const hoch = () => ta.evaluate(f => ({ h: Math.round(f.getBoundingClientRect().height), lh: parseFloat(getComputedStyle(f).lineHeight) || 24 }));
  const AM_ENDE = async () => { const v = await wert(); return [v.length, v.length, true]; };
  // V1 (RLB-123/B-7) Reihenfolge
  t.ist('V1 Reihenfolge der Vorschläge', await p.locator('#suggest button').allTextContents(), SOLL, 'RLB-94');
  // RLB-123/B-1 (= AppDesign APD-126/M-11): die Vorschläge stehen über dem Feld, unter der Überschrift
  t.wahr('RLB-123/B-1 Vorschläge über dem Feld', await p.evaluate(() => { const s = document.querySelector('#suggest').getBoundingClientRect(), f = document.querySelector('#fProgram').getBoundingClientRect(),
    h = document.querySelector('#fProgram').closest('.step').querySelector('.step-head').getBoundingClientRect(); return s.top >= h.bottom - 1 && s.bottom <= f.top + 1; }), 'RLB-123');
  // RLB-123/B-8: Verlauf leer einzeilig, mit einer Zeile ebenso; ein Vorschlag macht ihn eine Zeile höher
  await setze(''); await ta.evaluate(f => f.blur()); const h0 = await hoch();
  await setze('Ankunft'); const h1 = await hoch();
  await knopf('Rundgang durch …').click(); const h2 = await hoch();
  t.wahr(`RLB-123/B-8 leer einzeilig (${h0.h} px, eine Zeile ${h1.h} px)`, Math.abs(h0.h - h1.h) <= 2, 'RLB-123');
  t.wahr(`RLB-123/B-8 Vorschlag eine Zeile höher (${h1.h} → ${h2.h} px)`, Math.abs(h2.h - h1.h - h1.lh) <= 3, 'RLB-123');
  // RLB-123/B-3 (ersetzt V2): ‚Tour …‘ im leeren Feld, dann tippen → klein weiter (R-5.2, AppDesign APD-126/W-4)
  await setze(''); await knopf('Tour …').click(); await p.keyboard.type('wien');
  t.ist('RLB-123/B-3 Tour im leeren Feld, klein weiter', await wert(), 'Tour wien', 'RLB-123');
  // RLB-123/B-2 (= APD-126/M-9, ersetzt V3): Cursor in der ersten Zeile – der Vorschlag kommt nach der letzten Zeile, Cursor am Ende, klein weiter
  await setze('Ankunft\nAbendessen', 3); await knopf('Weiterfahrt nach …').click();
  t.ist('RLB-123/B-2 Vorschlag nach der letzten Zeile, Cursor am Ende', [await wert(), ...await cursor()], ['Ankunft\nAbendessen\nWeiterfahrt nach ', ...await AM_ENDE()], 'RLB-123');
  await p.keyboard.type('rom');
  t.ist('RLB-123/B-2 danach klein', await wert(), 'Ankunft\nAbendessen\nWeiterfahrt nach rom', 'RLB-123');
  // RLB-123/B-4 (= APD-126/M-10, ersetzt V4–V8): ‚Sonstiges …‘ – im leeren Feld nichts, mit Text eine leere Zeile am Ende (Cursor dort, auch wenn
  // er mitten im Text stand), zweites Antippen keine weitere, letzte Zeile schon leer → keine zweite
  await setze(''); await knopf('Sonstiges …').click();
  t.ist('RLB-123/B-4 Sonstiges im leeren Feld', [await wert(), ...await cursor()], ['', 0, 0, true], 'RLB-123');
  await setze('Ankunft\nAbendessen', 4); await knopf('Sonstiges …').click();
  t.ist('RLB-123/B-4 Sonstiges mit Text, Cursor mitten im Text', [await wert(), ...await cursor()], ['Ankunft\nAbendessen\n', ...await AM_ENDE()], 'RLB-123');
  await knopf('Sonstiges …').click();
  t.ist('RLB-123/B-4 Sonstiges zweimal', [await wert(), ...await cursor()], ['Ankunft\nAbendessen\n', ...await AM_ENDE()], 'RLB-123');
  // RLB-123/B-5 (ersetzt V9): danach getippt steht das Wort in der neuen letzten Zeile
  await p.keyboard.type('museum');
  t.ist('RLB-123/B-5 nach Sonstiges in der neuen letzten Zeile', (await wert()).replace(/\nmuseum$/i, '\n‹museum›'), 'Ankunft\nAbendessen\n‹museum›', 'RLB-123');
  console.log(`ℹ ${t.ort} RLB-123/B-5: nach ‚Sonstiges …‘ getippt ‚${(await wert()).split('\n').pop()}‘ (Großbuchstabe am Zeilenanfang, R-5.2)`);
  await setze('Ankunft\n'); await knopf('Sonstiges …').click();
  t.ist('RLB-123/B-4 letzte Zeile schon leer', [await wert(), ...await cursor()], ['Ankunft\n', ...await AM_ENDE()], 'RLB-123');
  // RLB-123/B-6 (V10 angepasst): 12 Zeilen, ‚Sonstiges …‘ – das Feld zeigt alle Zeilen, die neue letzte Zeile ist im Bild (R-4.5)
  await setze(Array.from({ length: 12 }, (_, i) => 'Punkt ' + i).join('\n'), 0); await knopf('Sonstiges …').click(); await p.waitForTimeout(150);
  t.wahr('RLB-123/B-6 Feld zeigt alle Zeilen (wächst mit)', await ta.evaluate(f => f.scrollHeight <= f.clientHeight + 2), 'RLB-123');
  t.wahr('RLB-123/B-6 neue letzte Zeile im Bild', await ta.evaluate(f => { const r = f.getBoundingClientRect(), dr = document.querySelector('#dlg .dlg-body')?.getBoundingClientRect() ?? { top: 0, bottom: innerHeight };
    const lh = parseFloat(getComputedStyle(f).lineHeight) || 24, unten = r.bottom - parseFloat(getComputedStyle(f).paddingBottom);
    return f.scrollTop === 0 && unten <= Math.min(dr.bottom, innerHeight) + 1 && unten - lh >= dr.top - 1; }), 'RLB-123');
  // V11 Häkchen blau nach dem Einfügen
  t.wahr('V11 Häkchen blau nach Sonstiges', await p.locator('#dlgOk').evaluate(e => e.classList.contains('primary')), 'R-4.4');
  // V12 Aufbau der Reihe (Grundregeln: nichts abgeschnitten, Ziele ≥ 44 px) – im Schritt
  await t.schritt(p, 'Vorschläge im Bild', async () => { await p.locator('#suggest').scrollIntoViewIfNeeded(); await p.waitForTimeout(200); });
  await p.close();
}
await t.ende(b);
