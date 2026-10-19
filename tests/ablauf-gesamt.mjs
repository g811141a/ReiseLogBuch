// Reiselogbuch-Test: ablauf-gesamt – Gesamtablauf: Seitenleiste, Mehr-Menü (Filter, Darstellung), Einstellungen mit
// ‚Änderungen verwerfen‘, Tag erfassen (Textfeld wächst, Blättern speichert), Smiley-Abfrage, Fazit, Teilen/Vorschau, Suche,
// Seitenleiste ein/aus, Löschen, neues Reiselogbuch, leerer Start, hoch; dazu Kosten, Statistik, Backup aus dem Menü.
// Aufruf im Repo-Ordner: node tests/ablauf-gesamt.mjs. Meldet Fehler (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.27.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.27.0/tests/hig.mjs';
import { readFileSync } from 'node:fs';
const t = pruefung('ablauf-gesamt', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.dlg-body.preview a'] }), out: new URL('out/', import.meta.url) });
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const APP_VERSION = html.match(/APP_VERSION = '([\d.]+)'/)[1], AD = html.match(/AD_NEEDED = '([\d.]+)'/)[1];
const days = { '2026-08-24': { weather: '☀️', program: 'Anreise nach Wien\nRundgang durch die Altstadt', comment: '😉 Nett', food: '😋 Schnitzel', quarter: 'Prize by Radisson', place: 'Wien' },
  '2026-08-25': { weather: '🌤', program: 'Weiterfahrt nach Sydney', comment: '😊 Oper', food: '👍 Fisch', quarter: 'Cambridge Hotel', place: 'Sydney, Australien' },
  '2026-08-26': { weather: '🌦', program: 'Freetour Sydney\nBesichtigung Opera House', comment: '👍 Guide', sameQuarter: true } };
const trips = [{ id: 'a', title: 'Australien', participants: 'Gerhild & Arnold', start: '2026-08-24', end: '2026-11-11', transport: ['flug', 'leihwagen'], foodColumn: true, days, fazit: '😊 Eine wunderbare Reise.' },
  { id: 'b', title: 'Toskana', participants: 'Gerhild & Arnold', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} },
  { id: 'c', title: 'Wien Kurztrip', participants: 'Gerhild & Arnold', start: '2026-03-12', end: '2026-03-15', transport: ['zug'], days: {} }];
const b = await t.browser();
async function page(ansicht, o = {}) {
  const p = await t.seite(b, ansicht, { theme: o.theme || 'light', deviceScaleFactor: 1 });
  // Unter file:// darf WebKit die manifest.json nicht laden (Origin null) – nur in der Testumgebung, auf GitHub Pages nicht.
  p.on('console', m => { if (m.type() === 'error' && !/Origin null is not allowed/.test(m.text())) t.fehler('', `Fehler in der Konsole: ${m.text()}`); });
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(([x, s]) => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: s, trips: x })), [o.empty ? [] : trips, o.settings || {}]);
  await t.schritt(p, 'Start', async () => { await p.reload(); await p.waitForTimeout(300); });
  return p;
}
const cls = (p, sel, c) => p.evaluate(([s, c]) => document.querySelector(s).classList.contains(c), [sel, c]);
const S = (p, name, fn) => t.schritt(p, name, fn);

for (const theme of ['light', 'dark']) {
  let p = await page('iPad quer', { theme });
  t.ist('Seitenleiste sichtbar, 3 Kacheln, Australien gewählt', [await p.isVisible('#side'), await p.locator('.side-row').count(), await p.textContent('.side-row.current b')], [true, 3, 'Australien'], 'R-7.1');
  t.ist('Titel und angedockte Seitenleiste', [await p.textContent('.nb-title'), await p.evaluate(() => document.body.classList.contains('docked'))], ['Australien', true], 'R-2.2');
  // Mehr-Menü
  await S(p, 'Mehr-Menü', () => p.click('#mainMore'));
  t.ist('Mehr-Menü', await p.locator('.menu .mi').allTextContents(), ['Alle Tage', 'Nur erfasste Tage', 'Einstellungen', 'DarstellungAutomatisch', 'Reiselogbuch löschen'], 'R-4.1');
  t.ist('Mehr bleibt blau', await cls(p, '#mainMore', 'on'), true, 'R-3.3');
  await S(p, 'Nur erfasste Tage', () => p.click('.menu .mi:has-text("Nur erfasste Tage")'));
  t.ist('Zeilen nur erfasste Tage', await p.locator('table.days tbody tr').count(), 5);
  await S(p, 'Alle Tage', async () => { await p.click('#mainMore'); await p.click('.menu .mi:has-text("Alle Tage")'); });
  t.ist('Zeilen alle Tage', await p.locator('table.days tbody tr').count(), 82);
  await S(p, 'Darstellung Dunkel', async () => { await p.click('#mainMore'); await p.click('.menu .mi:has-text("Darstellung")'); await p.click('.submenu .mi:has-text("Dunkel")'); });
  t.ist('Darstellung dunkel', await p.evaluate(() => document.documentElement.dataset.theme), 'dark', 'R-1.2');
  await S(p, 'Untermenü Darstellung', async () => { await p.click('#mainMore'); await p.click('.menu .mi:has-text("Darstellung")'); });
  t.ist('Untermenü Darstellung', await p.locator('.submenu .mi').allTextContents(), ['Automatisch', 'Hell', 'Dunkel'], 'R-1.2');
  await S(p, 'Darstellung Automatisch', () => p.click('.submenu .mi:has-text("Automatisch")'));
  // Einstellungen
  await S(p, 'Einstellungen', async () => { await p.click('#mainMore'); await p.click('.menu .mi:has-text("Einstellungen")'); });
  t.ist('Fenster Einstellungen, Häkchen grau, Mehr blau', [await p.textContent('#dlg h3'), await cls(p, '#dlgOk', 'primary'), await cls(p, '#mainMore', 'on')], ['Einstellungen', false, true], 'R-4.4');
  t.ist('Datumsfelder so breit wie das Datum (px)', await p.evaluate(() => [fStart.offsetWidth, fEnd.offsetWidth]), x => x.every(v => v >= 120 && v <= 220), 'R-5.1');
  await S(p, 'Teilnehmer ändern', () => p.fill('#fPeople', 'Gerhild, Arnold & Lisa'));
  t.ist('Häkchen blau nach der Änderung', await cls(p, '#dlgOk', 'primary'), true, 'R-4.4');
  await S(p, 'x mit Änderung', () => p.click('#dlgX'));
  t.ist('Abfrage beim x', await p.locator('#dlg .pop button').allTextContents(), ['Änderungen verwerfen', 'Weiter bearbeiten'], 'R-4.4');
  await S(p, 'Weiter bearbeiten', () => p.click('#dlg .pop button:has-text("Weiter bearbeiten")'));
  t.ist('Fenster bleibt offen mit der Eingabe', [await p.evaluate(() => dlg.open), await p.inputValue('#fPeople')], [true, 'Gerhild, Arnold & Lisa'], 'R-4.4');
  await S(p, 'Änderungen verwerfen', async () => { await p.click('#dlgX'); await p.click('#dlg .pop button:has-text("Änderungen verwerfen")'); });
  t.ist('verworfen', [await p.evaluate(() => !dlg.open), await p.evaluate(() => db.trips[0].participants)], [true, 'Gerhild & Arnold'], 'R-4.4');
  await S(p, 'Einstellungen speichern', async () => { await p.click('#mainMore'); await p.click('.menu .mi:has-text("Einstellungen")'); await p.fill('#fPeople', 'G & A'); await p.click('#dlgOk'); await p.waitForTimeout(100); });
  t.ist('gespeichert und zu', [await p.evaluate(() => db.trips[0].participants), await p.evaluate(() => !dlg.open)], ['G & A', true]);
  await S(p, 'Häkchen ohne Änderung', async () => { await p.click('#mainMore'); await p.click('.menu .mi:has-text("Einstellungen")'); await p.click('#dlgOk'); });
  t.ist('Häkchen ohne Änderung schließt', await p.evaluate(() => !dlg.open), true, 'R-4.4');
  // Tag
  await S(p, 'Tag 25.08. öffnen', async () => { await p.click('tr[data-day="2026-08-25"]'); await p.waitForTimeout(200); });
  t.ist('Fenster Tag, Häkchen grau', [await p.textContent('#dlg h3'), await p.evaluate(() => dlg.querySelector('#dlgOk').classList.contains('primary'))], ['Dienstag, 25.08.2026', false], 'R-4.4');
  const h0 = await p.evaluate(() => fProgram.offsetHeight);
  await S(p, 'Programm 12 Zeilen', () => p.evaluate(() => { fProgram.value = Array.from({ length: 12 }, (_, i) => 'Zeile ' + i).join('\n'); fProgram.dispatchEvent(new Event('input', { bubbles: true })); }));
  t.ist('Textfeld wächst mit (ohne Scrollen darin)', await p.evaluate(() => [fProgram.offsetHeight, fProgram.scrollHeight]), ([o, s]) => o > h0 * 2 && s <= o, 'R-5.2');
  t.ist('Häkchen blau', await p.evaluate(() => dlg.querySelector('#dlgOk').classList.contains('primary')), true, 'R-4.4');
  await S(p, 'nächster Tag', async () => { await p.click('[data-nav="1"]'); await p.waitForTimeout(200); });
  t.ist('Blättern speichert', [await p.textContent('#dlg h3'), await p.evaluate(() => db.trips[0].days['2026-08-25'].program.split('\n').length)], ['Mittwoch, 26.08.2026', 12]);
  await S(p, 'Smiley lange drücken', async () => { const box = await p.locator('#moods [data-m]').nth(1).boundingBox(); await p.mouse.move(box.x + 10, box.y + 10); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up(); });
  t.ist('Abfrage Smiley entfernen', [await p.locator('#dlg .pop').count(), await p.locator('#dlg .pop p').textContent()], [1, '😊 aus der Schnellauswahl entfernen?'], 'R-4.3');
  await S(p, 'Abbrechen', () => p.click('#dlg .pop button:has-text("Abbrechen")'));
  await S(p, 'Zurücksetzen', () => p.click('#moods .reset'));
  t.ist('Abfrage Zurücksetzen', await p.locator('#dlg .pop button').allTextContents(), ['Zurücksetzen', 'Abbrechen'], 'R-4.3');
  await S(p, 'daneben tippen, Tag schließen', async () => { await p.click('#dlg .layer'); await p.click('#dlgX'); });
  t.ist('Tag ohne Änderung zu', await p.evaluate(() => !dlg.open), true, 'R-4.4');
  // Fazit, Teilen, Vorschau
  await S(p, 'Fazit', () => p.click('#fazit'));
  t.ist('Fazit ohne Untertitel', await p.textContent('#dlgSub'), '');
  await S(p, 'Fazit schließen', () => p.click('#dlgX'));
  await S(p, 'Teilen-Menü', () => p.click('#shareBtn'));
  t.ist('Teilen-Menü', [await p.locator('.menu .mi').allTextContents(), await p.locator('.menu .note').first().textContent()],
    [['Vorschau', 'HTML', 'PDF'], '3 erfasste Tage · Dateiname: Reiselogbuch Australien 2026.08.24-2026.11.11 V001'], 'R-6.4');
  await S(p, 'Vorschau', () => p.click('.menu .mi:has-text("Vorschau")'));
  t.ist('Vorschau offen, Teilen bleibt blau', [await p.textContent('#dlg h3'), await cls(p, '#shareBtn', 'on')], ['Vorschau', true], 'R-3.3');
  await S(p, 'Vorschau schließen', () => p.click('#dlgX'));
  t.ist('Teilen danach nicht mehr blau', await cls(p, '#shareBtn', 'on'), false, 'R-3.3');
  // Suche
  await S(p, 'Suche Sydney', async () => { await p.click('#searchBtn'); await p.fill('#search', 'Sydney'); await p.waitForTimeout(100); });
  t.ist('Treffer', await p.textContent('#scount'), '1 von 3', 'R-2.3');
  await S(p, 'nächster Treffer', () => p.click('#snext'));
  t.ist('nächster Treffer', await p.textContent('#scount'), '2 von 3', 'R-2.3');
  await S(p, 'Suche schließen', () => p.click('#searchBtn'));
  t.ist('Suchfeld weg', await p.locator('#search').count(), 0, 'R-2.3');
  // Seitenleiste
  await S(p, 'Seitenleiste ausblenden', () => p.click('#sideHide'));
  t.ist('ausgeblendet, Schaltfläche in der Leiste', [await p.isHidden('#side'), await p.locator('#bar [data-side-toggle]').count()], [true, 1]);
  await S(p, 'Seitenleiste einblenden', () => p.click('#bar [data-side-toggle]'));
  t.ist('wieder da', await p.isVisible('#side'), true);
  await S(p, 'Toskana öffnen', () => p.click('.side-row:has-text("Toskana")'));
  t.ist('Toskana offen', await p.textContent('.nb-title'), 'Toskana');
  await S(p, 'Menü der Seitenleiste', () => p.click('#sideMore'));
  t.ist('Menü der Seitenleiste', [await p.locator('.menu .mi').allTextContents(), await p.locator('.menu .note').first().textContent(), await p.locator('.menu .sub').first().textContent()],
    [['Backup erstellen', 'Backup laden', 'Messung starten'], new RegExp(`^Reiselogbuch · Version ${APP_VERSION.replace(/\./g, '\\.')} · .+ · AppDesign ${AD.replace(/\./g, '\\.')}$`), 'Noch kein Backup erstellt.'], 'R-9.1');
  await S(p, 'daneben tippen', () => p.click('.layer'));
  t.ist('Backup-Kachel da', await p.locator('.bhint').count(), 1, 'R-9.1');
  // Löschen
  await S(p, 'Löschen', async () => { await p.click('#mainMore'); await p.click('.menu .mi:has-text("Reiselogbuch löschen")'); });
  t.ist('Abfrage Löschen', await p.locator('.pop button').allTextContents(), ['Reiselogbuch löschen', 'Abbrechen'], 'R-4.3');
  await S(p, 'Löschen bestätigen', () => p.click('.pop button:has-text("Reiselogbuch löschen")'));
  t.ist('gelöscht, Australien offen', [await p.evaluate(() => db.trips.length), await p.textContent('.nb-title')], [2, 'Australien']);
  // Neu
  await S(p, 'Neues Reiselogbuch', () => p.click('#newTrip'));
  t.ist('Fenster Neues Reiselogbuch, plus blau', [await p.textContent('#dlg h3'), await cls(p, '#newTrip', 'on')], ['Neues Reiselogbuch', true], 'R-3.3');
  await S(p, 'Häkchen ohne Eingabe', () => p.click('#dlgOk'));
  t.ist('Häkchen ohne Änderung schließt', await p.evaluate(() => !dlg.open), true, 'R-4.4');
  await p.close();

  // Leerer Start
  p = await page('iPad quer', { theme, empty: true });
  t.ist('leer: Fenster Neues Reiselogbuch öffnet sich', [await p.evaluate(() => dlg.open), await p.textContent('#dlg h3')], [true, 'Neues Reiselogbuch']);
  await S(p, 'x', () => p.click('#dlgX'));
  t.ist('leere Hauptansicht', [await p.textContent('.emptymain'), await p.evaluate(() => !dlg.open)], ['Noch kein Reiselogbuch angelegt.Mit ‚plus‘ in der Seitenleiste ein neues anlegen.', true]);
  await S(p, 'anlegen', async () => { await p.click('#newTrip'); await p.fill('#fTitle', 'Neu'); await p.fill('#fPeople', 'X'); await p.click('#transport button >> nth=0'); await p.click('#dlgOk'); await p.waitForTimeout(100); });
  t.ist('angelegt', await p.textContent('.nb-title'), 'Neu');
  await p.close();

  // Hoch: Seitenleiste darübergelegt
  p = await page('iPad hoch', { theme });
  t.ist('hoch: Seitenleiste darübergelegt mit Schatten', [await p.evaluate(() => side.classList.contains('over')), await p.locator('.side-shade').count()], [true, 1], 'R-8.1');
  await S(p, 'Wien antippen', () => p.click('.side-row:has-text("Wien")'));
  t.ist('Seitenleiste zu, Wien offen', [await p.isHidden('#side'), await p.textContent('.nb-title')], [true, 'Wien Kurztrip']);
  await p.close();

  // Kosten, Statistik, Backup aus dem Menü
  p = await page('iPad quer', { theme, settings: { hideEmpty: true } });
  t.ist('‚Nur erfasste Tage‘ gilt nicht nach dem Start', [await p.evaluate(() => db.settings.hideEmpty), await p.locator('table.days tbody tr').count()], [false, 82]);
  const k = p.locator('#kosten');
  await S(p, 'Kosten 4850', async () => { await k.click(); await k.pressSequentially('4850'); });
  t.ist('beim Tippen mit Tausenderpunkt', await k.inputValue(), '4.850', 'R-5.1');
  await S(p, 'Kosten verlassen', () => p.click('.progress'));
  t.ist('danach mit Komma und gespeichert', [await k.inputValue(), await p.evaluate(() => db.trips[0].kosten)], ['4.850,00', 4850], 'R-5.1');
  await S(p, 'Kosten 1234,5', async () => { await k.fill(''); await k.pressSequentially('1234,5'); });
  t.ist('beim Tippen', await k.inputValue(), '1.234,5', 'R-5.1');
  await S(p, 'Kosten verlassen', () => p.click('.progress'));
  t.ist('danach', await k.inputValue(), '1.234,50', 'R-5.1');
  t.ist('Statistik', await p.evaluate(() => tripStats(db.trips[0]).map(x => x.join(': ')).join(' | ')), 'Reisetage: 80, davon erfasst 3 | Quartiere: 2 | Nächte: 3 | Wetter: 1×☀️ · 1×🌤 · 1×🌦 | Smileys: 2×😊 · 1×😉 · 1×👍');
  t.ist('Betrag in der Ausgabe', await p.evaluate(() => formatEuro(db.trips[0].kosten)), '1.234,50 €', 'R-5.1');
  t.ist('Tabellenkopf 17 px halbfett', await p.evaluate(() => { const s = getComputedStyle(document.querySelector('table.days th')); return s.fontSize + ' ' + s.fontWeight; }), '17px 600');
  t.ist('Seitenleiste schwebt', await p.evaluate(() => { const s = getComputedStyle(side); return [s.borderRadius, s.left, s.top, s.boxShadow.slice(0, 30)]; }), ['22px', '10px', '10px', /^rgba\(0, 0, 0, 0\.\d+\) 0px 3px 28/], 'R-3.2');
  t.ist('Backup-Kachel', (await p.textContent('.bhint')).replace(/\s+/g, ' ').trim(), 'Noch kein Backup erstellt. Backup erstellen', 'R-9.1');
  await S(p, 'Menü der Seitenleiste', () => p.click('#sideMore'));
  t.ist('Menü', [await p.locator('.menu .mi').allTextContents(), await p.locator('.menu .sub').first().textContent()], [['Backup erstellen', 'Backup laden', 'Messung starten'], 'Noch kein Backup erstellt.'], 'R-9.1');   // seit 3.24.0 mit Messung (R-1.6)
  await S(p, 'Backup erstellen', async () => { await p.click('.menu .mi:has-text("Backup erstellen")'); await p.waitForTimeout(300); });
  t.ist('Meldung offen, Mehr bleibt blau', [await p.evaluate(() => msg.open), await cls(p, '#sideMore', 'on')], [true, true], 'R-3.3');
  await S(p, 'Meldung schließen', async () => { await p.click('#msg [data-x]'); await p.waitForTimeout(100); });
  t.ist('Mehr nicht mehr blau, Backup-Kachel bleibt', [await cls(p, '#sideMore', 'on'), await p.locator('.bhint').count()], [false, 1], 'R-9.1');
  await S(p, 'Einstellungen', async () => { await p.click('#mainMore'); await p.click('.menu .mi:has-text("Einstellungen")'); });
  t.ist('Datumsfelder mit Kalender-Icon', await p.locator('#dlg .datebox .ic').count(), 2, 'R-5.1');
  await p.close();
}
await t.ende(b);
