// Ablauf-Test RLB-3: Abgleich zwischen iPad und iPhone über ein Backup.
// iPad ändert einen Tag, löscht ein Reiselogbuch und legt eines an; das iPhone ändert inzwischen einen anderen Tag
// und einen Titel. Nach ‚Abgleichen‘ muss je Tag die neuere Fassung gelten, gelöschte verschwinden, neue dazukommen.
// Aufruf im Repo-Ordner: node tests/ablauf-abgleich.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.40.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.40.0/tests/hig.mjs';
// Meldet Fehler mit Rückgabewert, Grundregeln nach den Schritten (seit 3.12.0, pruefe.mjs).
const t = pruefung('ablauf-abgleich', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.dlg-body.preview a'] }), out: new URL('out/', import.meta.url) });
const G = (p, name) => t.schritt(p, name, async () => {});   // Grundregeln im aktuellen Zustand

const APP = new URL('../index.html', import.meta.url).href;
const errors = { push: (...m) => m.forEach(x => t.fehler('', x)) };   // Meldungen werden Fehler (pruefe.mjs)
const check = (ok, text) => { if (!ok) errors.push(text); };
const b = await t.browser();
const device = async (w, h) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(e.message));
  return p;
};
const at = async (p, t) => p.clock.setFixedTime(new Date(t));
const base = [
  { id: 'x', title: 'Island', participants: 'A', start: '2026-07-01', end: '2026-07-05', transport: ['flug'], days: { '2026-07-01': { program: 'A1' } } },
  { id: 'y', title: 'Toskana', participants: 'A', start: '2025-05-01', end: '2025-05-05', transport: ['pkw'], days: {} },
  { id: 'z', title: 'Malta', participants: 'A', start: '2024-05-01', end: '2024-05-05', transport: ['pkw'], days: {} },
];

// iPad: Ausgangsstand speichern (10:00)
const ipad = await device(1180, 820);
await at(ipad, '2026-10-12T10:00:00');
await ipad.goto(APP);
await ipad.evaluate(t => { if (dlg.open) dlg.close(); db.trips = t; save(); showTrip('x'); }, base);
const start = await ipad.evaluate(() => JSON.parse(backupFile().content));
check(start.savedOn === 'iPad' && start.trips.every(t => t.changedAt && t.changedOn === 'iPad'), 'Zeitpunkt/Gerät fehlen nach dem Speichern');
// iPhone bekommt den Ausgangsstand (wie ‚Ersetzen‘)
const iphone = await device(393, 852);
await at(iphone, '2026-10-12T10:30:00');
await iphone.goto(APP);
await iphone.evaluate(d => { delete d.savedAt; delete d.savedOn; localStorage.setItem('reiselogbuch.v1', JSON.stringify(d)); }, start);
await iphone.reload(); await iphone.waitForTimeout(300);

// iPad 11:00: Tag ändern, Malta löschen, Kreta anlegen
await at(ipad, '2026-10-12T11:00:00');
await ipad.evaluate(() => {
  getTrip('x').days['2026-07-01'] = { program: 'A2' };
  db.trips = db.trips.filter(t => t.id !== 'z');
  db.trips.push({ id: 'k', title: 'Kreta', participants: 'A', start: '2023-05-01', end: '2023-05-05', transport: ['schiff'], days: {} });
  save();
});
const fromIpad = await ipad.evaluate(() => backupFile().content);
// iPhone 12:00: anderen Tag eintragen, Titel ändern
await at(iphone, '2026-10-12T12:00:00');
await iphone.evaluate(() => { normalize(db); getTrip('x').days['2026-07-02'] = { program: 'B2' }; getTrip('y').title = 'Toskana neu'; save(); });

// iPhone lädt das Backup vom iPad und gleicht ab
await iphone.evaluate(() => { phoneList = true; render(); });
await iphone.waitForTimeout(200);
check((await iphone.locator('#side .side-row', { hasText: 'Toskana neu' }).locator('.chg').textContent()) === 'geändert am 12.10.2026 um 12:00 · iPhone', 'Zeile ‚geändert am … · Gerät‘ fehlt oder falsch');
await iphone.click('#sideMore'); await iphone.waitForTimeout(150);
const [chooser] = await Promise.all([iphone.waitForEvent('filechooser'), iphone.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
await chooser.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(fromIpad) }); await iphone.waitForTimeout(300);
const ask = await iphone.locator('.pop > p').innerHTML();
check(ask.includes('Backup vom <b>12.10.2026 um 11:00</b> (iPad) mit 3 Reiselogbüchern.'), `Abfrage: ${ask}`);
check(ask.includes('Es ist <b>älter</b> als die Daten auf diesem iPhone (zuletzt geändert am 12.10.2026 um 12:00)'), `Vergleich: ${ask}`);
await iphone.locator('.pop button', { hasText: 'Abgleichen' }).click(); await iphone.waitForTimeout(400);
// R-9.4: kurzes Fenster mit Schaltfläche; die Einzelheiten stehen im Abgleichbericht (Vorschau).
check(await iphone.locator('#msg[open] [data-act]', { hasText: 'Abgleichbericht anzeigen' }).count() === 1, 'Schaltfläche ‚Abgleichbericht anzeigen‘ fehlt');
await iphone.click('#msg [data-act]'); await iphone.waitForTimeout(400);
// seit 3.36.0: warten, bis das Blatt ruht – WebKit hielt das Hereingleiten des Blatts gelegentlich an seinem Anfang fest, Playwright berechnete
// den Klick auf ‚PDF‘ dort (y 832 statt 21–63) und er traf das Formular (2 von 8 Läufen schon mit AppDesign 4.37.0)
await navFertig(iphone);
const result = await iphone.locator('#dlg .sync-report').innerHTML();
check(['updated" data-title="Island', 'added" data-title="Kreta', 'removed" data-title="Malta'].every(x => result.includes(`<tbody data-kind="${x}"`)) && result.includes('1 Reiselogbuch ist unverändert.'), `Bericht: ${result.slice(0, 400)}`);
// RLB-80: Kapsel oben rechts wie die Vorschau der Ausgabe – PDF und Teilen; PDF füllt #printout und öffnet das Drucken-Menü.
check(await iphone.locator('#dlg .grp #repPdf', { hasText: 'PDF' }).count() === 1 && await iphone.locator('#dlg .grp #repShare').count() === 1, 'Kapsel mit PDF und Teilen fehlt');
await iphone.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
await iphone.click('#repPdf'); await iphone.waitForTimeout(300);
check(await iphone.evaluate(() => window.__printed === 1 && !!document.querySelector('#printout .sync-report')), 'PDF: Drucken-Menü nicht geöffnet oder Bericht nicht im Druckbereich');
check((await iphone.locator('#msg[open] .msg-text').textContent()).includes('Drucken-Menü geöffnet für Abgleichbericht Reiselogbuch'), 'PDF: Meldung fehlt');
await iphone.click('#msg [data-x]'); await iphone.waitForTimeout(200);
await iphone.click('#dlgX'); await iphone.waitForTimeout(200);
const merged = await iphone.evaluate(() => db);
const x = merged.trips.find(t => t.id === 'x');
check(x.days['2026-07-01']?.program === 'A2', 'neuerer Tag vom iPad nicht übernommen');
check(x.days['2026-07-02']?.program === 'B2', 'neuerer Tag vom iPhone verloren');
check(merged.trips.find(t => t.id === 'y')?.title === 'Toskana neu', 'neuerer Titel vom iPhone verloren');
check(!merged.trips.some(t => t.id === 'z'), 'gelöschtes Reiselogbuch nicht gelöscht');
check(merged.trips.some(t => t.id === 'k'), 'neues Reiselogbuch fehlt');
check(merged.trips.find(t => t.id === 'k')?.changedOn === 'iPad', 'Gerät des neuen Reiselogbuchs nicht übernommen');
// Gleiches Backup noch einmal: alles schon gleich
await iphone.click('#sideMore'); await iphone.waitForTimeout(150);
const [ch2] = await Promise.all([iphone.waitForEvent('filechooser'), iphone.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
await ch2.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(fromIpad) }); await iphone.waitForTimeout(300);
await iphone.locator('.pop button', { hasText: 'Abgleichen' }).click(); await iphone.waitForTimeout(400);
{ const h = await iphone.locator('#msg .msg-text').innerHTML(); check(!h.includes('Änderungen auf diesem') && /Alles war schon auf dem gleichen Stand|hat sich nichts geändert/.test(h), 'zweiter Abgleich ändert etwas'); }
check((await iphone.evaluate(() => db.trips.length)) === 3, 'zweiter Abgleich: Anzahl falsch');
t.ort = 'iPhone hoch'; await G(iphone, 'Ergebnis zweiter Abgleich');
// iPad gleicht mit dem iPhone ab → beide gleich
await iphone.locator('#msg [data-x]').click(); await iphone.waitForTimeout(200);
const fromIphone = await iphone.evaluate(() => backupFile().content);
await at(ipad, '2026-10-12T12:30:00');
await ipad.click('#sideMore'); await ipad.waitForTimeout(150);
const [ch3] = await Promise.all([ipad.waitForEvent('filechooser'), ipad.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
await ch3.setFiles({ name: 'c.json', mimeType: 'application/json', buffer: Buffer.from(fromIphone) }); await ipad.waitForTimeout(300);
await ipad.locator('.pop button', { hasText: 'Abgleichen' }).click(); await ipad.waitForTimeout(400);
const norm = d => JSON.stringify(d.trips.map(t => [t.id, t.title, t.days]).sort());
check(norm(await ipad.evaluate(() => db)) === norm(await iphone.evaluate(() => db)), 'iPad und iPhone nach beiden Abgleichen nicht gleich');
t.ort = 'iPad quer'; await G(ipad, 'Ergebnis Abgleich');
await t.ende(b);
