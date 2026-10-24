// Reiselogbuch-Test: ablauf-smiley-leiste – AppDesign A-76 (seit 3.31.0, R-3.5; Fall-Liste AppDesign arbeit/A-76 Fall-Liste.md L1–L9):
// Ziehen ist kein langes Drücken – wer die Smiley-Leiste mit dem Finger auf einem Smiley seitlich zieht, bekommt keine Abfrage
// ‚… entfernen?‘; still halten fragt wie bisher, kurz antippen fügt ein. Nachgebaut ist der Ablauf vom Gerät (24.10.2026): iPhone, Tag
// öffnen, auf einem Smiley aufsetzen, die Leiste ziehen (L1, gegen 3.30.2 rot); dasselbe in der Essen-Leiste und im Fazit (L6), am iPad
// mit Maus (L8); Grundregeln nach jedem Schritt (L9). L7 (Zurückwischen, Blatt ziehen) prüfen ablauf-navigation und ablauf-blatt.
// Aufruf im Repo-Ordner: node tests/ablauf-smiley-leiste.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.34.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.34.0/tests/hig.mjs';
import { checkLangDruecken } from '../../AppDesign/fassung/4.34.0/tests/ablauf.mjs';
const t = pruefung('ablauf-smiley-leiste', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 10; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1}`, place: 'Hafen' };
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(0), end: iso(9), transport: ['flug'], foodColumn: true, moodColumn: true, days }];
const LEISTEN = [
  ['Erfassen · Smileys', p => p.evaluate(d => openDayDialog(db.trips[0], d), iso(2)), '#moods', '#fComment'],
  ['Erfassen · Essen', p => p.evaluate(d => openDayDialog(db.trips[0], d), iso(2)), '#foodMoods', '#fFoodText'],
  ['Fazit', p => p.evaluate(() => openFazitDialog(db.trips[0])), '#moods', '#fFazit'],
];
const b = await t.browser();
for (const ansicht of ['iPhone hoch', 'iPhone quer', 'iPad quer']) {
  const p = await t.seite(b, ansicht);
  await p.clock.setFixedTime(new Date('2026-09-02T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400);
  if (await p.locator('#side.page').isVisible()) { await p.locator('#side .side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(600); }
  for (const [name, open, leiste, feld] of LEISTEN) {
    const where = name;
    await open(p); await p.waitForTimeout(700);
    const smiley = `#dlg ${leiste} [data-m]`;
    if (!await p.locator(smiley).first().isVisible()) { t.fehler('R-3.5', `${where}: keine Smiley-Leiste ${leiste}`); continue; }
    await t.schritt(p, `${name} – ziehen und halten`, async () => t.liste(await checkLangDruecken(p, { sel: `${smiley}:first-child`, where })));
    // L5: kurz antippen fügt das Smiley ein (der Cursor steht im leeren Feld)
    await t.schritt(p, `${name} – antippen`, async () => {
      const m = await p.locator(smiley).first().getAttribute('data-m');
      const vorher = await p.locator(`#dlg ${feld}`).inputValue();
      await p.locator(smiley).first().click(); await p.waitForTimeout(150);
      const nachher = await p.locator(`#dlg ${feld}`).inputValue();
      t.wahr(`${where}: L5 Antippen fügt ${m} nicht ein (‚${vorher}‘ → ‚${nachher}‘)`, nachher.length > vorher.length && nachher.includes(m), 'R-3.5');
      t.ist(`${where}: L5 Antippen fragt nicht`, await p.locator('.pop').count(), 0, 'R-3.5');
    });
    await p.evaluate(() => { dlgDirty = () => false; document.getElementById('dlg').close(); }); await p.waitForTimeout(500);
  }
  await p.close();
}
await t.ende(b);
