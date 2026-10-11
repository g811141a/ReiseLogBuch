// Reiselogbuch-Test: ablauf-gesamt – Aufruf im Repo-Ordner: node tests/ablauf-gesamt.mjs (Bildschirmfotos landen in tests/out/)
import { chromium } from 'playwright';
const days = { '2026-08-24': { weather: '☀️', program: 'Anreise nach Wien\nRundgang durch die Altstadt', comment: '😉 Nett', food: '😋 Schnitzel', quarter: 'Prize by Radisson', place: 'Wien' },
  '2026-08-25': { weather: '🌤', program: 'Weiterfahrt nach Sydney', comment: '😊 Oper', food: '👍 Fisch', quarter: 'Cambridge Hotel', place: 'Sydney, Australien' },
  '2026-08-26': { weather: '🌦', program: 'Freetour Sydney\nBesichtigung Opera House', comment: '👍 Guide', sameQuarter: true } };
const trips = [{ id: 'a', title: 'Australien', participants: 'Gerhild & Arnold', start: '2026-08-24', end: '2026-11-11', transport: ['flug', 'leihwagen'], foodColumn: true, days, fazit: '😊 Eine wunderbare Reise.' },
  { id: 'b', title: 'Toskana', participants: 'Gerhild & Arnold', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} },
  { id: 'c', title: 'Wien Kurztrip', participants: 'Gerhild & Arnold', start: '2026-03-12', end: '2026-03-15', transport: ['zug'], days: {} }];
const b = await chromium.launch();
const errs = [];
async function page(o = {}) {
  const p = await b.newPage({ viewport: o.portrait ? { width: 820, height: 1180 } : { width: 1180, height: 820 }, hasTouch: true, deviceScaleFactor: 1 });
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(([t, th]) => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { theme: th }, trips: t })), [o.empty ? [] : trips, o.theme || 'light']);
  await p.reload(); await p.waitForTimeout(300);
  return p;
}
const log = (...a) => console.log(...a);
let p = await page();
log('side visible', await p.isVisible('#side'), 'rows', await p.locator('.side-row').count(), 'current', await p.textContent('.side-row.current b'));
log('title', await p.textContent('.nb-title'), 'docked', await p.evaluate(() => document.body.classList.contains('docked')));
// main menu
await p.click('#mainMore'); log('menu items', await p.locator('.menu .mi').allTextContents()); log('mainMore on', await p.evaluate(() => document.querySelector('#mainMore').classList.contains('on')));
await p.click('.menu .mi:has-text("Nur erfasste Tage")'); log('rows after filter', await p.locator('table.days tbody tr').count());
await p.click('#mainMore'); await p.click('.menu .mi:has-text("Alle Tage")'); log('rows all', await p.locator('table.days tbody tr').count());
await p.click('#mainMore'); await p.click('.menu .mi:has-text("Darstellung")'); await p.click('.submenu .mi:has-text("Dunkel")'); log('theme', await p.evaluate(() => document.documentElement.dataset.theme));
await p.click('#mainMore'); await p.click('.menu .mi:has-text("Darstellung")'); log('submenu', await p.locator('.submenu .mi').allTextContents()); await p.click('.submenu .mi:has-text("Hell")');
// settings
await p.click('#mainMore'); await p.click('.menu .mi:has-text("Einstellungen")');
log('dlg title', await p.textContent('#dlg h3'), 'ok primary', await p.evaluate(() => document.querySelector('#dlgOk').classList.contains('primary')), 'mainMore on', await p.evaluate(() => document.querySelector('#mainMore').classList.contains('on')));
log('date widths', await p.evaluate(() => [fStart.offsetWidth, fEnd.offsetWidth]));
await p.fill('#fPeople', 'Gerhild, Arnold & Lisa'); log('ok primary after change', await p.evaluate(() => document.querySelector('#dlgOk').classList.contains('primary')));
await p.click('#dlgX'); log('pop', await p.locator('#dlg .pop').count(), await p.locator('#dlg .pop button').allTextContents());
await p.click('#dlg .pop button:has-text("Weiter bearbeiten")'); log('still open', await p.evaluate(() => dlg.open), await p.inputValue('#fPeople'));
await p.click('#dlgX'); await p.click('#dlg .pop button:has-text("Änderungen verwerfen")'); log('closed', await p.evaluate(() => !dlg.open), 'people', await p.evaluate(() => db.trips[0].participants));
await p.click('#mainMore'); await p.click('.menu .mi:has-text("Einstellungen")'); await p.fill('#fPeople', 'G & A'); await p.click('#dlgOk'); await p.waitForTimeout(100);
log('saved people', await p.evaluate(() => db.trips[0].participants), 'closed', await p.evaluate(() => !dlg.open));
await p.click('#mainMore'); await p.click('.menu .mi:has-text("Einstellungen")'); await p.click('#dlgOk'); log('no-change ok closes', await p.evaluate(() => !dlg.open));
// day dialog
await p.click('tr[data-day="2026-08-25"]'); await p.waitForTimeout(200);
log('day title', await p.textContent('#dlg h3'), 'ok primary', await p.evaluate(() => dlg.querySelector('#dlgOk').classList.contains('primary')));
log('program h', await p.evaluate(() => fProgram.offsetHeight));
await p.evaluate(() => { fProgram.value = Array.from({ length: 12 }, (_, i) => 'Zeile ' + i).join('\n'); fProgram.dispatchEvent(new Event('input', { bubbles: true })); });
log('program h grown', await p.evaluate(() => [fProgram.offsetHeight, fProgram.scrollHeight]), 'ok primary', await p.evaluate(() => dlg.querySelector('#dlgOk').classList.contains('primary')));
await p.click('[data-nav="1"]'); await p.waitForTimeout(200); log('nav to', await p.textContent('#dlg h3'), 'saved 25', await p.evaluate(() => db.trips[0].days['2026-08-25'].program.split('\n').length));
// smiley long press popover
const sm = p.locator('#moods [data-m]').nth(1); const box = await sm.boundingBox();
await p.mouse.move(box.x + 10, box.y + 10); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up();
log('smiley pop', await p.locator('#dlg .pop').count(), await p.locator('#dlg .pop p').textContent());
await p.click('#dlg .pop button:has-text("Abbrechen")');
await p.click('#moods .reset'); log('reset pop', await p.locator('#dlg .pop button').allTextContents()); await p.click('#dlg .layer');
await p.click('#dlgX'); log('day closed w/o change', await p.evaluate(() => !dlg.open));
// fazit
await p.click('#fazit'); log('fazit sub', JSON.stringify(await p.textContent('#dlgSub'))); await p.click('#dlgX'); 
// share menu
await p.click('#shareBtn'); log('share items', await p.locator('.menu .mi').allTextContents(), await p.locator('.menu .note').first().textContent());
await p.click('.menu .mi:has-text("Vorschau")'); log('preview', await p.textContent('#dlg h3'), 'shareBtn on', await p.evaluate(() => document.querySelector('#shareBtn').classList.contains('on')));
await p.click('#dlgX'); log('shareBtn off', await p.evaluate(() => !document.querySelector('#shareBtn').classList.contains('on')));
// search
await p.click('#searchBtn'); await p.fill('#search', 'Sydney'); await p.waitForTimeout(100); log('scount', await p.textContent('#scount'));
await p.click('#snext'); log('scount2', await p.textContent('#scount')); await p.click('#searchBtn'); log('search closed', await p.locator('#search').count());
// sidebar toggle
await p.click('#sideHide'); log('side hidden', await p.isHidden('#side'), 'toggle in nav', await p.locator('#bar [data-side-toggle]').count());
await p.click('#bar [data-side-toggle]'); log('side back', await p.isVisible('#side'));
await p.click('.side-row:has-text("Toskana")'); log('now', await p.textContent('.nb-title'));
// side menu
await p.click('#sideMore'); log('side menu', await p.locator('.menu .mi').allTextContents(), await p.locator('.menu .note').first().textContent(), await p.locator('.menu .sub').textContent()); await p.click('.layer');
log('bhint', await p.locator('.bhint').count());
// delete
await p.click('#mainMore'); await p.click('.menu .mi:has-text("Reiselogbuch löschen")'); log('del pop', await p.locator('.pop button').allTextContents());
await p.click('.pop button:has-text("Reiselogbuch löschen")'); log('trips left', await p.evaluate(() => db.trips.length), 'now', await p.textContent('.nb-title'));
// new trip
await p.click('#newTrip'); log('new dlg', await p.textContent('#dlg h3'), 'plus on', await p.evaluate(() => document.querySelector('#newTrip').classList.contains('on')));
await p.click('#dlgOk'); log('ok without change closes', await p.evaluate(() => !dlg.open));
await p.close();
// empty
p = await page({ empty: true }); log('empty auto dialog', await p.evaluate(() => dlg.open), await p.textContent('#dlg h3'));
await p.click('#dlgX'); log('empty main', await p.textContent('.emptymain'), 'dlg closed', await p.evaluate(() => !dlg.open));
await p.click('#newTrip'); await p.fill('#fTitle', 'Neu'); await p.fill('#fPeople', 'X'); await p.click('#transport button >> nth=0'); await p.click('#dlgOk'); await p.waitForTimeout(100);
log('created', await p.textContent('.nb-title'));
await p.close();
// portrait
p = await page({ portrait: true }); log('portrait start overlay', await p.evaluate(() => side.classList.contains('over')), await p.locator('.side-shade').count());
await p.click('.side-row:has-text("Wien")'); log('overlay closed', await p.isHidden('#side'), await p.textContent('.nb-title'));
await p.close();
log('ERRORS', errs);
await b.close();
{
const b2 = await chromium.launch(); const errs2 = [];
const p = await b2.newPage({ viewport: { width: 1180, height: 820 } }); p.on('pageerror', e => errs2.push(e.message));
await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
await p.goto(new URL('../index.html', import.meta.url).href);
await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { theme: 'light', hideEmpty: true }, trips: t })), trips);
await p.reload(); await p.waitForTimeout(300);
console.log('hideEmpty after start', await p.evaluate(() => db.settings.hideEmpty), 'rows', await p.locator('table.days tbody tr').count());
const k = p.locator('#kosten');
await k.click(); await k.pressSequentially('4850'); console.log('typing', await k.inputValue());
await p.click('.progress'); console.log('blur', await k.inputValue(), 'stored', await p.evaluate(() => db.trips[0].kosten));
await k.fill(''); await k.pressSequentially('1234,5'); console.log('typing2', await k.inputValue()); await p.click('.progress'); console.log('blur2', await k.inputValue());
console.log('stats', await p.evaluate(() => tripStats(db.trips[0]).map(x => x.join(': ')).join(' | ')));
console.log('euro out', await p.evaluate(() => formatEuro(db.trips[0].kosten)));
console.log('th font', await p.evaluate(() => { const s = getComputedStyle(document.querySelector('table.days th')); return s.fontSize + ' ' + s.fontWeight; }));
console.log('side', await p.evaluate(() => { const s = getComputedStyle(side); return [s.borderRadius, s.left, s.top, s.boxShadow.slice(0, 30)]; }));
console.log('bhint', await p.textContent('.bhint'));
// side menu hold
await p.click('#sideMore'); console.log('side menu', await p.locator('.menu .mi').allTextContents(), await p.textContent('.menu .sub'));
await p.click('.menu .mi:has-text("Backup erstellen")'); await p.waitForTimeout(300);
console.log('msg open', await p.evaluate(() => msg.open), 'sideMore on', await p.evaluate(() => document.querySelector('#sideMore').classList.contains('on')));
await p.click('#msg [data-x]'); await p.waitForTimeout(100);
console.log('after close on', await p.evaluate(() => document.querySelector('#sideMore').classList.contains('on')), 'bhint now', await p.locator('.bhint').count());
await p.click('#mainMore'); await p.click('.menu .mi:has-text("Einstellungen")');
console.log('datebox', await p.locator('#dlg .datebox .ic').count(), 'widths', await p.evaluate(() => [fStart.offsetWidth, fEnd.offsetWidth]));
console.log('ERR2', errs2); await b2.close();
}
