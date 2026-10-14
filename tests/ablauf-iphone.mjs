// Reiselogbuch-Test: ablauf-iphone – Aufruf im Repo-Ordner: node tests/ablauf-iphone.mjs (Bildschirmfotos landen in tests/out/)
// iPhone-Ansicht (AppDesign html.phone): Startliste, Reiselogbuch öffnen, Suche unten, Tag erfassen und speichern,
// Blättern, Kontextmenü, Löschen zurück zur Startliste, neues Reiselogbuch, Wechsel iPhone ↔ iPad.
import { chromium } from 'playwright';
const APP = new URL('../index.html', import.meta.url).href;
const OUT = new URL('./out/', import.meta.url).pathname;
const trips = [
  { id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-09-05', transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true,
    days: { '2026-08-24': { weather: '☀️', program: 'Ankunft Sydney', comment: '🙂 super', quarter: 'Hotel Rocks', place: 'Sydney' } } },
  { id: 'b', title: 'Toskana', participants: 'Anna', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} },
];
const errors = [];
const check = (ok, text) => { if (!ok) errors.push(text); };
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true });
p.on('pageerror', e => errors.push(e.message));
await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
await p.goto(APP);
await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
await p.reload(); await p.waitForTimeout(300);
const db = () => p.evaluate(() => JSON.parse(localStorage.getItem('reiselogbuch.v1')));

check(await p.evaluate(() => document.documentElement.classList.contains('phone')), 'html.phone fehlt');
check(await p.locator('.pnav-title').textContent() === 'Australien', 'Start nicht im laufenden Reiselogbuch');
check(await p.locator('#side').isHidden(), 'Seitenleiste sichtbar');
check(await p.locator('#pdays .box.gap').count() === 1, 'erster offener Tag nicht markiert');
check(await p.locator('.pnav .grp #searchBtn').count() === 1, 'search fehlt in der Kapsel');

// Suche wie am iPad: Suchzeile unter der Leiste, ‚1 von n‘, ⌃ ⌄, ⓧ; search schließt
await p.click('#searchBtn'); await p.waitForTimeout(150);
check(await p.evaluate(() => document.activeElement?.id === 'search'), 'Suchfeld hat keinen Fokus');
await p.locator('#search').pressSequentially('Rocks'); await p.waitForTimeout(700);
check(await p.locator('#pdays .box').count() === 1, 'Suche filtert nicht');
check(await p.evaluate(() => document.activeElement?.id === 'search'), 'Suchfeld verliert den Fokus');
check((await p.locator('#scount').textContent()) === '1 von 1', 'Trefferanzeige fehlt');
await p.click('#sclear'); check(await p.locator('#search').inputValue() === '', 'ⓧ leert nicht');
await p.click('#searchBtn'); await p.waitForTimeout(150);
check(await p.locator('#search').count() === 0, 'Suche nicht beendet');

// Großer Titel wandert beim Hochschieben in die Leiste
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(100);
check(await p.locator('.pnav').evaluate(e => e.classList.contains('titled')), 'Name des Reiselogbuchs nicht in der Leiste');
check(await p.locator('.ltitle').count() === 0, 'großer Titel noch da');
check(await p.locator('.meta.trip dt').first().textContent() === 'Reiseteilnehmer:', 'Bezeichnungen fehlen');
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(100);
check((await p.locator('#pdays .box .k.word').first().textContent()) === 'Verlauf', 'Begriff Verlauf fehlt');
await p.screenshot({ path: OUT + 'iphone-1-reiselogbuch.png' });

// Tag erfassen: bildschirmfüllend, kurzer Titel, Kasten bleibt blau, Speichern mit Häkchen, Blättern
await p.locator('#pdays [data-day="2026-08-25"]').click(); await p.waitForTimeout(300);
check(await p.evaluate(() => document.activeElement?.id !== 'dlgX'), 'x hat den Fokus');
check(await p.evaluate(() => document.documentElement.classList.contains('locked')), 'Seite hinter dem Fenster nicht gesperrt');
const box = await p.locator('#dlg').boundingBox();
check(Math.round(box.width) === 393 && Math.round(box.height) === 852, `Fenster nicht bildschirmfüllend: ${JSON.stringify(box)}`);
check((await p.locator('#dlg h3').textContent()) === 'Di, 25.08.2026', 'Titel nicht kurz');
check(await p.locator('#pdays [data-day="2026-08-25"]').evaluate(e => e.classList.contains('on')), 'Kasten nicht blau');
await p.locator('#wx button').nth(1).click();
check(await p.locator('#dlg .mic').count() === 0, 'Mikrofon-Knopf noch da');
// Großschreibung durch die App: erster Buchstabe der Zeile, auch nach einem Smiley
await p.locator('#moods [data-m]').first().click(); await p.keyboard.type('nett. sehr gut');
check((await p.locator('#fComment').inputValue()).endsWith('Nett. Sehr gut'), `Großschreibung: ${await p.locator('#fComment').inputValue()}`);
await p.fill('#fComment', '');
// Nach einem Vorschlag beginnt das nächste Wort groß (‚Freetour Sydney‘)
await p.fill('#fProgram', ''); await p.locator('#suggest button', { hasText: 'Freetour' }).click(); await p.keyboard.type('sydney');
check((await p.locator('#fProgram').inputValue()) === 'Freetour Sydney', `Vorschlag: ${await p.locator('#fProgram').inputValue()}`);
await p.fill('#fProgram', 'Hafenrundfahrt');
await p.locator('[data-nav="1"]').click(); await p.waitForTimeout(300);
check((await db()).trips[0].days['2026-08-25']?.program === 'Hafenrundfahrt', 'Blättern speichert nicht');
check(await p.locator('#pdays [data-day="2026-08-26"]').evaluate(e => e.classList.contains('on')), 'Markierung wandert nicht mit');
await p.fill('#fProgram', 'Blue Mountains');
await p.click('#dlgOk'); await p.waitForTimeout(300);
check((await db()).trips[0].days['2026-08-26']?.program === 'Blue Mountains', 'Häkchen speichert nicht');
check(await p.locator('#pdays [data-day="2026-08-26"]').textContent().then(t => t.includes('Blue Mountains')), 'Kasten nicht aktualisiert');

// Mehr-Menü mit Icons und Häkchen (T-24), Nur erfasste Tage
await p.click('#mainMore'); await p.waitForTimeout(150);
check(await p.locator('.menu .mi', { hasText: 'Alle Tage' }).locator('svg').count() === 2, 'Alle Tage ohne Häkchen und Icon');
await p.locator('.menu .mi', { hasText: 'Nur erfasste Tage' }).click(); await p.waitForTimeout(150);
check(await p.locator('#pdays .box').count() === 3, 'Nur erfasste Tage filtert nicht');

// Zurück zur Startliste, Kontextmenü, Einstellungen
await p.click('#back'); await p.waitForTimeout(200);
// Startliste = derselbe Baustein wie die Seitenleiste am iPad (R-1.1)
check((await p.locator('#side.page .side-head h2').textContent()) === 'Reiselogbücher', 'Startliste fehlt (Seitenleiste als ganze Seite)');
check(await p.locator('#side.page .side-list .side-row').count() === 2, 'Kacheln fehlen');
check(!(await p.locator('#sideHide').isVisible()), 'Seitenleisten-Knopf auf dem iPhone sichtbar');
// Kopf steht fest, die Kacheln laufen unter der Backup-Kachel durch (wie am iPad)
await p.evaluate(() => { const l = document.querySelector('#side .side-list'); const f = document.createElement('div'); f.id = 'filler'; f.style.height = '2000px'; l.append(f); l.scrollTop = 600; }); await p.waitForTimeout(150);
check(await p.locator('#side .side-head').evaluate(e => Math.round(e.getBoundingClientRect().top)) === 0, 'Kopf der Startliste bewegt sich beim Wischen');
check(await p.evaluate(() => document.querySelector('#side .side-list').getBoundingClientRect().bottom >= document.querySelector('#side .side-foot').getBoundingClientRect().bottom - 2), 'Kacheln verschwinden nicht hinter der Backup-Kachel');
check(await p.evaluate(() => getComputedStyle(document.documentElement).overscrollBehaviorY) === 'none', 'Seite federt nach');
await p.evaluate(() => { document.getElementById('filler').remove(); document.querySelector('#side .side-list').scrollTop = 0; });
check(await p.locator('.side-row.current').textContent().then(t => t.includes('Australien')), 'zuletzt geöffnetes nicht blau');
check(await p.locator('#side .side-head .grp #newTrip').count() === 1, 'plus nicht in der Kapsel oben');
check(await p.locator('#side .side-foot .bhint').count() === 1, 'Backup-Kachel unten fehlt');
check((await p.locator('#side .side-head small').textContent()) === '2 Reiselogbücher', 'Anzahl unter dem Titel fehlt');
check(!(await p.evaluate(() => document.documentElement.classList.contains('locked'))), 'Seite nach dem Schließen noch gesperrt');
await p.screenshot({ path: OUT + 'iphone-2-startliste.png' });
const row = p.locator('.side-row', { hasText: 'Toskana' });
const rb = await row.boundingBox();
await p.mouse.move(rb.x + 40, rb.y + 20); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(150);
check(await p.locator('.menu .mi', { hasText: 'Einstellungen' }).count() === 1, 'Kontextmenü fehlt');
await p.locator('.menu .mi', { hasText: 'Einstellungen' }).click(); await p.waitForTimeout(300);
check(await row.evaluate(e => e.classList.contains('on')), 'Zeile nicht blau bei Einstellungen');
// Bezeichnung gehört zum Feld: ‚Bis‘ steht mit seinem Datum unter ‚Von‘
const [von, bis] = await p.locator('.dates .pair').evaluateAll(els => els.map(e => e.getBoundingClientRect().top));
check(bis > von + 20, 'Bis nicht unter Von');
check(await p.evaluate(() => getComputedStyle(document.querySelector('#transport button')).touchAction) === 'manipulation', 'Doppeltippen kann zoomen');
await p.click('#dlgX'); await p.waitForTimeout(200);

// Reiselogbuch öffnen und löschen → zurück zur Startliste
await row.click(); await p.waitForTimeout(250);
check((await p.locator('.pnav-title').textContent()) === 'Toskana', 'Öffnen aus der Liste geht nicht');
await p.click('#mainMore'); await p.locator('.menu .mi', { hasText: 'löschen' }).click(); await p.waitForTimeout(200);
await p.locator('.pop button', { hasText: 'Reiselogbuch löschen' }).click(); await p.waitForTimeout(250);
check((await p.locator('#side.page .side-head h2').textContent()) === 'Reiselogbücher', 'Nach dem Löschen nicht in der Startliste');
check((await db()).trips.length === 1, 'nicht gelöscht');

// Neues Reiselogbuch über plus
await p.click('#newTrip'); await p.waitForTimeout(300);
await p.fill('#fTitle', 'Island'); await p.fill('#fPeople', 'Anna');
await p.fill('#fStart', '2027-07-01'); await p.fill('#fEnd', '2027-07-10');
await p.locator('#transport button').first().click();
await p.click('#dlgOk'); await p.waitForTimeout(300);
check((await p.locator('.pnav-title').textContent()) === 'Island', 'Neues Reiselogbuch nicht geöffnet');

// Wechsel iPhone → iPad hoch → iPhone quer
await p.setViewportSize({ width: 820, height: 1180 }); await p.waitForTimeout(300);
check(!(await p.evaluate(() => document.documentElement.classList.contains('phone'))) && await p.locator('table.days').count() === 1, 'iPad-Ansicht fehlt nach Wechsel');
await p.setViewportSize({ width: 852, height: 393 }); await p.waitForTimeout(300);
check(await p.locator('#pdays').count() === 1, 'iPhone quer nicht kompakt');
await p.screenshot({ path: OUT + 'iphone-3-quer.png' });
// Backup laden: Text mit ‚Reiselogbüchern‘ und Zeilenumbruch; ‚Letztes Backup‘ bleibt das dieses Geräts
await p.setViewportSize({ width: 393, height: 852 }); await p.waitForTimeout(200);
await p.evaluate(() => { db.settings.lastBackup = new Date('2026-08-20T10:00:00').getTime(); save(); phoneList = true; render(); });
const other = { settings: { lastBackup: new Date('2026-08-01T09:00:00').getTime() }, trips };
await p.click('#sideMore'); await p.waitForTimeout(150);
const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
await chooser.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(other)) }); await p.waitForTimeout(300);
const popText = await p.locator('.pop > p').innerHTML();
check(popText.includes('mit 2 Reiselogbüchern.') && popText.includes('Es ist <b>'), `Text der Abfrage: ${popText}`);
check((await p.locator('.pop button').allTextContents()).join('|') === 'Abgleichen|Ersetzen|Abbrechen' && await p.locator('.pop .tile').count() === 2, 'Knöpfe bzw. Kacheln der Abfrage');
await p.locator('.pop button', { hasText: 'Ersetzen' }).click(); await p.waitForTimeout(300);
check((await db()).settings.lastBackup === new Date('2026-08-20T10:00:00').getTime(), 'Letztes Backup vom anderen Gerät übernommen');
console.log('ERR', JSON.stringify(errors));
await b.close();
