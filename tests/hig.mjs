// HIG-Prüfskript des Reiselogbuchs: geht alle Ansichten durch und misst sie mit der HIG-Prüfung aus AppDesign
// (AppDesign/tests/hig.mjs, Designrichtlinie allgemein Abschnitte 16 und 17 – jede Meldung mit ihrer Regelnummer R-x.y).
// Aufruf im Repo-Ordner: node tests/hig.mjs   (braucht Playwright; AppDesign liegt daneben)
// Seit 3.12.0: Browser über PRUEF_BROWSER (chromium | webkit), Teilung für den parallelen Lauf über PRUEF_DARSTELLUNG
// (light | dark, ohne Angabe beide) – der Gerätevergleich iPad ↔ iPhone (R-1.1) bleibt in jedem Teil vollständig.
// Geprüft wird jede Ansicht in hell und dunkel, quer und hoch – auf dem iPad und dem iPhone: Antippflächen, Schriftgrößen, Kontraste,
// doppelte Anführungszeichen, Löschen am Ende von Menüs und ob die auslösende Schaltfläche blau bleibt.
// Bewusste Abweichungen (Abschnitt 16) werden nicht gezählt. Ergebnis: Abweichungsliste, Exit-Code 1 bei Funden.
import * as pw from 'playwright';
import { pruefung, rolle } from '../../AppDesign/fassung/4.36.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.36.0/tests/hig.mjs';

const APP = new URL('../index.html', import.meta.url).href;
const long = 'a'.repeat(100); // R-6.3: zu lange Wörter müssen im Wort umbrechen
const smileys = '😊😊😉👍😋😌😏😳🤪🥶🤷🏻‍♂️☹️🤮🙂'.repeat(3);
const trips = [
  { id: 'a', title: 'Australien', participants: 'Anna, Ben', start: '2026-08-24', end: '2026-09-05', transport: ['flug', 'leihwagen'], quarterList: true, foodColumn: true, moodColumn: true, quarterColumn: true, fazit: 'Schön',
    days: { '2026-08-24': { weather: '☀️', program: 'Ankunft Sydney\nOper', mood: '🙂 super', food: '🍽️ Fischmarkt – gut\n😋 Harrys Café – Pie', quarter: 'Hotel Rocks', place: 'Sydney' },
      '2026-08-25': { program: 'Anreise ' + long, comment: '😉 ' + long, food: '😋 ' + long, quarter: long, place: 'Wien' },
      // R-6.3: Reihen von Smileys ohne Leerzeichen (wie im echten Reiselogbuch, P-21/3)
      '2026-08-26': { program: 'Rundgang', comment: smileys + ' À' + 'a'.repeat(60), food: '🕛☕😉 Auer Bäckerei Graz-Nord - perfektes Frühstücken ' + '😳'.repeat(30) + '\n' + '😕🤮🤮🤮🤮🤮👎⭐🍕👌🍕👌🥩'.repeat(4) } } },
  { id: 'c', title: 'Rundreise ' + 'b'.repeat(60), participants: long, start: '2024-05-03', end: '2024-05-17', transport: ['pkw'], days: {} },
  { id: 'b', title: 'Toskana', participants: 'Anna', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} },
];

// Bewusste Abweichung (Reiselogbuch, 09.10.2026): Essen-Links in der Tabelle (iPhone: in den Kästen) bleiben so eng
// wie der Text – sonst trifft man beim Antippen eines Tages zu leicht einen Link.
// Links in der Vorschau gehören zum ausgegebenen Dokument (HTML/PDF), nicht zur Bedienung der App.
const hig = createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.dlg-body.preview a'] });
const { measure, note } = hig;

const browser = await pruefung('hig', pw).browser();
// Seit 3.33.0 (AppDesign APD-43 P1): PRUEF_BEDIENUNG=beide – alle Ansichten mit ‚Kontrast erhöhen‘ und ‚Bewegung reduzieren‘ (4,5 : 1 ohne Ausnahmen)
const hilfen = process.env.PRUEF_BEDIENUNG === 'beide' ? { contrast: 'more', reducedMotion: 'reduce' } : {}, hilfenTag = hilfen.contrast ? ' Bedienungshilfen' : '';
const darstellungen = process.env.PRUEF_DARSTELLUNG ? [process.env.PRUEF_DARSTELLUNG] : ['light', 'dark'];
for (const scheme of darstellungen) for (const [w, h] of [[1180, 820], [820, 1180]]) {
  const tag = `${scheme === 'light' ? 'hell' : 'dunkel'} ${w > h ? 'quer' : 'hoch'}${hilfenTag}`;
  const p = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: true, colorScheme: scheme, ...hilfen });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  const M = s => measure(p, `${s} (${tag})`);
  const away = async () => { if (await p.locator('.layer').count()) { await p.mouse.click(w - 4, h - 4); await p.waitForTimeout(150); } };
  const stays = (sel, s) => hig.stays(p, sel, `${s} (${tag})`);

  try {
  await M('Start');
  if (w > h) await hig.shape(p, '#side', 'Seitenleiste / Startliste', 'iPad', ['#sideHide']);
  await p.click('#sideMore'); await p.waitForTimeout(150); await stays('#sideMore', 'Menü Seitenleiste'); await M('Menü Seitenleiste'); await away();
  // Abfrage beim Laden eines Backups (RLB-3): Abgleichen · Ersetzen · Abbrechen
  await p.click('#sideMore'); await p.waitForTimeout(150);
  const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
  await chooser.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ settings: {}, trips, savedAt: Date.now(), savedOn: 'iPhone' })) });
  await p.waitForTimeout(300); await stays('#sideMore', 'Abfrage Backup laden'); await M('Abfrage Backup laden');
  await p.locator('.pop button', { hasText: 'Abbrechen' }).click(); await p.waitForTimeout(150);
  // R-9.4 (seit 3.11.0): Abgleichen mit einem neuen Reiselogbuch im Backup – kurzes Fenster mit Schaltfläche, dann der Abgleichbericht
  await p.click('#sideMore'); await p.waitForTimeout(150);
  const [ch2] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
  await ch2.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ settings: {}, savedAt: Date.now(), savedOn: 'iPhone',
    trips: [...trips, { id: 'hig-neu', title: 'Kreta', participants: 'A', start: '2027-05-01', end: '2027-05-03', transport: ['pkw'], days: { '2027-05-01': { program: 'Anreise' } }, changedAt: Date.now(), changedOn: 'iPhone' }] })) });
  await p.waitForTimeout(300); await p.locator('.pop button', { hasText: 'Abgleichen' }).click(); await p.waitForTimeout(400);
  await M('Abgleichen Ergebnis');
  await p.click('#msg [data-act]'); await p.waitForTimeout(400); await M('Abgleichbericht');
  await p.evaluate(() => { const b = document.querySelector('#dlg .dlg-body'); b.scrollLeft = b.scrollWidth; }); await p.waitForTimeout(200); await M('Abgleichbericht rechts');
  await p.click('#dlgX'); await p.waitForTimeout(250);
  await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(250);
  await M('Hauptansicht');
  await hig.barStill(p, `Hauptansicht (${tag})`);
  await p.click('#mainMore'); await p.waitForTimeout(150); await stays('#mainMore', 'Mehr-Menü'); await M('Mehr-Menü');
  await p.locator('.menu .mi', { hasText: 'Darstellung' }).click(); await p.waitForTimeout(150); await M('Untermenü Darstellung');
  await away();
  await p.click('#shareBtn'); await p.waitForTimeout(150); await stays('#shareBtn', 'Teilen-Menü'); await M('Teilen-Menü');
  await away();
  await p.click('#searchBtn'); await p.waitForTimeout(150); await p.fill('#search', 'Oper'); await p.waitForTimeout(700); await M('Suche');
  await hig.barStill(p, `Suche (${tag})`);
  // R-2.1 (seit 3.11.5): auch bei offener Tastatur (nachgebildet: sichtbarer Bereich etwa halb so hoch) stehen die Leisten fest.
  await p.setViewportSize({ width: w, height: Math.round(h * 0.55) }); await p.waitForTimeout(250); await hig.barStill(p, `Suche mit Tastatur (${tag})`);
  await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(250);
  if (await p.locator('#search').evaluate(e => e === document.activeElement && getComputedStyle(e).outlineStyle !== 'none')) note('Regel', 'R-3.4 Suchfeld mit blauem Fokus-Rahmen', `Suche (${tag})`);
  await p.click('#searchBtn').catch(() => {}); await p.waitForTimeout(150);
  const dialog = async (open, s, opener) => {
    await open(); await p.waitForTimeout(350);
    if (opener) await stays(opener, s);
    await M(s);
    await p.click('#dlgX'); await p.waitForTimeout(200);
    if (await p.locator('.pop').count()) { await p.locator('.pop button').first().click(); await p.waitForTimeout(200); }
  };
  await dialog(async () => { await p.click('#mainMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Einstellungen' }).click(); }, 'Fenster Einstellungen', '#mainMore');
  await dialog(() => p.locator('table.days tbody tr').first().click(), 'Fenster Tag', 'table.days tbody tr[data-day="2026-08-24"]');
  await dialog(async () => { await p.locator('#fazit').scrollIntoViewIfNeeded(); await p.click('#fazit'); }, 'Fenster Fazit', '#fazit');
  await dialog(() => p.evaluate(() => openTripDialog(null)), 'Fenster Neues Reiselogbuch');
  await p.click('#mainMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'löschen' }).click(); await p.waitForTimeout(250);
  await M('Sprechblase Löschen'); await p.locator('.pop button', { hasText: 'Abbrechen' }).click(); await p.waitForTimeout(150);
  } catch (e) { note('Ablauf', `bricht ab: ${e.message.split('\n')[0]}`, tag); }
  for (const e of errors) note('Skriptfehler', e, tag);
  await p.close();
}
// iPhone (AppDesign html.phone): hoch und quer, hell und dunkel.
for (const scheme of darstellungen) for (const [w, h] of [[393, 852], [852, 393]]) {
  const tag = `iPhone ${scheme === 'light' ? 'hell' : 'dunkel'} ${w > h ? 'quer' : 'hoch'}${hilfenTag}`;
  const p = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, colorScheme: scheme, ...hilfen });
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  const M = s => measure(p, `${s} (${tag})`);
  const away = async () => { if (await p.locator('.layer').count()) { await p.mouse.click(4, h - 4); await p.waitForTimeout(150); } };
  const stays = (sel, s) => hig.stays(p, sel, `${s} (${tag})`);
  try {
  // Seit 3.15.0 (R-7.2): Start in der Startliste; das laufende Reiselogbuch wird daraus geöffnet.
  await M('Startliste beim Start');
  await p.locator(`#side .side-row[data-id="${await p.evaluate(() => pickStartTrip().id)}"]`).click(); await p.waitForTimeout(300);
  await M('Hauptansicht');
  await hig.barStill(p, `Hauptansicht (${tag})`);
  await p.click('#mainMore'); await p.waitForTimeout(150); await stays('#mainMore', 'Mehr-Menü'); await M('Mehr-Menü');
  await p.locator('.menu .mi', { hasText: 'Darstellung' }).click(); await p.waitForTimeout(150); await M('Untermenü Darstellung');
  await away();
  await p.click('#shareBtn'); await p.waitForTimeout(150); await stays('#shareBtn', 'Teilen-Menü'); await M('Teilen-Menü');
  await away();
  await p.click('#searchBtn'); await p.waitForTimeout(150); await p.fill('#search', 'Oper'); await p.waitForTimeout(700); await M('Suche');
  await hig.barStill(p, `Suche (${tag})`);
  // R-2.1 (seit 3.11.5): auch bei offener Tastatur (nachgebildet: sichtbarer Bereich etwa halb so hoch) stehen die Leisten fest.
  await p.setViewportSize({ width: w, height: Math.round(h * 0.55) }); await p.waitForTimeout(250); await hig.barStill(p, `Suche mit Tastatur (${tag})`);
  await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(250);
  await p.click('#searchBtn'); await p.waitForTimeout(200);
  await rolle(p, 600); await p.waitForTimeout(150); await M('Titel in der Leiste'); await rolle(p, 0);
  const dialog = async (open, s, opener) => {
    await open(); await p.waitForTimeout(350);
    if (opener) await stays(opener, s);
    await M(s);
    // Fenster: kein Fokus-Rahmen am x, Seite dahinter gesperrt (AppDesign 4.2.0)
    if (await p.evaluate(() => document.activeElement?.id === 'dlgX')) note('Regel', 'R-3.4 x hat beim Öffnen den Fokus (blauer Rahmen)', `${s} (${tag})`);
    if (!(await p.evaluate(() => document.documentElement.classList.contains('locked')))) note('Regel', 'R-1.4 Seite hinter dem Fenster nicht gesperrt', `${s} (${tag})`);
    await p.click('#dlgX'); await p.waitForTimeout(200);
    if (await p.locator('.pop').count()) { await p.locator('.pop button').first().click(); await p.waitForTimeout(200); }
  };
  await dialog(async () => { await p.click('#mainMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Einstellungen' }).click(); }, 'Fenster Einstellungen', '#mainMore');
  await dialog(async () => { await p.click('#shareBtn'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); }, 'Fenster Vorschau', '#shareBtn');
  await dialog(() => p.locator('#pdays [data-day="2026-08-24"]').click(), 'Fenster Tag', '#pdays [data-day="2026-08-24"]');
  // Seit 3.13.2 (P-37/2): Folgetag – im Kopf ‚Quartier‘ stehen zwei Schaltflächen (‚Quartier wie Vortag‘, ‚keinen Google-Maps Link‘).
  await dialog(() => p.locator('#pdays [data-day="2026-08-27"]').click(), 'Fenster Folgetag', '#pdays [data-day="2026-08-27"]');
  await dialog(async () => { await p.locator('#fazit').scrollIntoViewIfNeeded(); await p.click('#fazit'); }, 'Fenster Fazit', '#fazit');
  await p.click('#mainMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'löschen' }).click(); await p.waitForTimeout(250);
  await M('Sprechblase Löschen'); await p.locator('.pop button', { hasText: 'Abbrechen' }).click(); await p.waitForTimeout(150);
  await p.click('#back'); await p.waitForTimeout(250); await M('Startliste');
  // Abfrage beim Laden eines Backups (RLB-3), auch iPhone quer: muss ganz auf den Bildschirm passen (R-4.5)
  await p.evaluate(() => db.trips.forEach(t => { t.changedAt = Date.now(); t.changedOn = 'iPhone'; }));   // mit Vergleich ‚neuer/älter‘ wie im Alltag
  await p.click('#sideMore'); await p.waitForTimeout(150);
  const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
  await chooser.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ settings: {}, trips, savedAt: Date.now(), savedOn: 'iPad' })) });
  await p.waitForTimeout(300); await M('Abfrage Backup laden');
  await p.locator('.pop button', { hasText: 'Abbrechen' }).click(); await p.waitForTimeout(150);
  await hig.barStill(p, `Startliste (${tag})`);
  await hig.shape(p, '#side', 'Seitenleiste / Startliste', `iPhone ${w > h ? 'quer' : 'hoch'}`, ['#sideHide']);
  try {
    await p.click('#sideMore', { timeout: 3000 }); await p.waitForTimeout(150); await stays('#sideMore', 'Menü Startliste'); await M('Menü Startliste'); await away();
    await dialog(() => p.click('#newTrip', { timeout: 3000 }), 'Fenster Neues Reiselogbuch', '#newTrip');
  } catch (e) { note('Ablauf', 'Startliste nicht bedienbar (Mehr/plus fehlen)', tag); }
  // R-9.4 (seit 3.11.2 auch am iPhone): Ergebnisfenster und Abgleichbericht, links und ganz nach rechts gewischt
  await p.click('#sideMore'); await p.waitForTimeout(150);
  const [ch2] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
  await ch2.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ settings: {}, savedAt: Date.now(), savedOn: 'iPad',
    trips: [...trips.map(t => ({ ...t, days: { ...t.days, '2026-08-24': { program: 'Geändert am iPad', weather: '🌤' } }, metaAt: {}, dayAt: { '2026-08-24': { program: Date.now() + 9e5, weather: Date.now() + 9e5 } }, changedAt: Date.now() + 9e5, changedOn: 'iPad' })),
      { id: 'hig-neu', title: 'Kreta', participants: 'A', start: '2027-05-01', end: '2027-05-03', transport: ['pkw'], days: { '2027-05-01': { program: 'Anreise' } }, changedAt: Date.now() + 9e5, changedOn: 'iPad' }] })) });
  await p.waitForTimeout(300); await p.locator('.pop button', { hasText: 'Abgleichen' }).click(); await p.waitForTimeout(400);
  await M('Abgleichen Ergebnis');
  await p.click('#msg [data-act]'); await p.waitForTimeout(400); await M('Abgleichbericht');
  await p.evaluate(() => { const b = document.querySelector('#dlg .dlg-body'); b.scrollLeft = b.scrollWidth; }); await p.waitForTimeout(200); await M('Abgleichbericht rechts');
  await p.click('#dlgX'); await p.waitForTimeout(250);
  } catch (e) { note('Ablauf', `bricht ab: ${e.message.split('\n')[0]}`, tag); }
  for (const e of errors) note('Skriptfehler', e, tag);
  await p.close();
}
await browser.close();

// Gegenprobe (AppDesign/tests/pruefe.mjs): mit PRUEF_GEGENPROBE=1 muss die Prüfung rot werden.
if (process.env.PRUEF_GEGENPROBE === '1') note('Gegenprobe', 'absichtlich eingefügte Abweichung', 'Gegenprobe');
console.log(`Browser: ${process.env.PRUEF_BROWSER || 'chromium'} · Darstellung: ${darstellungen.join(', ')}`);
process.exit(hig.report());
