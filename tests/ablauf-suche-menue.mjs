// Reiselogbuch-Test: ablauf-suche-menue (seit 3.41.0, AppDesign APD-91, R-2.3, R-4.7) – Suche im Mehr-Menü: ‚Suchen‘ zuerst mit Strich
// darunter (Seitenleiste bzw. Startliste und Reiselogbuch), keine Lupe in der Kapsel, ‚Suchen‘ öffnet die Suchzeile mit dem Cursor im Feld,
// x ‚Suche beenden‘ rechts schließt sie, Mehr-Knopf bei offener Suche normal, ⌘F (im Reiselogbuch, ohne offenes in allen, bei offener Suche
// nur der Cursor, bei offenem Menü nichts), Drehen mit offener Suche. Testfall-Liste AppDesign arbeit/APD-91 Testfall-Liste.md (S-1 bis S-18).
// Aufruf im Repo-Ordner: node tests/ablauf-suche-menue.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.47.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.47.0/tests/hig.mjs';
import { checkSearchPlace, checkSucheBeenden, checkCmdF, sucheAuf } from '../../AppDesign/fassung/4.47.0/tests/ablauf.mjs';
const t = pruefung('ablauf-suche-menue', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const mk = (id, start, n, f) => { const days = {}; for (let i = 0; i < n; i++) days[new Date(Date.parse(start) + i * 864e5).toISOString().slice(0, 10)] = f(i);
  return { id, title: id, participants: 'G & A', start, end: Object.keys(days).at(-1), transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, days }; };
const trips = [
  mk('Australien', '2026-08-24', 30, i => ({ weather: '☀️', program: i === 25 ? 'Fahrt nach Sydney' : 'Programm ' + i, comment: '😉 ok', quarter: 'Hotel', place: 'Cairns' })),
  mk('Spanien', '2025-05-02', 6, i => ({ program: 'Altstadt ' + i, quarter: 'Hotel Neri', place: 'Barcelona' })),
  mk('Portugal', '2024-09-10', 6, i => ({ program: i === 2 ? 'Sydney-Abend im Fado-Lokal' : 'Lissabon ' + i })),
];
const start = async p => {
  await p.clock.setFixedTime(new Date('2026-09-10T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'Australien' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400);
};
const b = await t.browser();
for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch', 'iPhone quer']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  const where = ansicht; t.ort = where;
  await start(p);
  // seit 3.43.0 (AppDesign APD-97): iPad hoch wie quer – Seitenleiste fest daneben, ein Reiselogbuch ist offen; Tage als Kästen oder Tabelle (R-6.6)
  const phone = ansicht.startsWith('iPhone'), over = false;
  const item = phone ? '#pdays [data-day]' : '#app [data-day]';
  // Seitenleiste bzw. Startliste: beim Start sichtbar (iPad fest links, iPhone als Startliste)
  t.liste(await checkSearchPlace(p, { mehr: '#sideMore', kapsel: '#side .grp', where: `${where} Liste` }));                  // S-1, S-3
  await t.schritt(p, 'Mehr der Liste offen', async () => { await p.click('#sideMore'); await p.waitForTimeout(200); });   // S-14 Grundregeln
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  t.liste(await checkSucheBeenden(p, { mehr: '#sideMore', input: '#lsearch', close: '#lsclose', row: '#side .side-search', item: '#side .side-row',
    scroll: '#side .side-list', term: 'Sydney', where: `${where} Liste` }));                                                // S-4, S-6, S-15, S-18
  // S-9: ⌘F ohne offenes Reiselogbuch (iPhone-Startliste) – Suche in allen
  if (phone || over) t.liste(await checkCmdF(p, { input: '#lsearch', close: '#lsclose', mehr: '#sideMore', where: `${where} Liste` }));
  // Reiselogbuch öffnen
  await p.locator('#side .side-row[data-id="Australien"]').click(); await p.waitForTimeout(400); await navFertig(p);
  t.liste(await checkSearchPlace(p, { mehr: '#mainMore', kapsel: '#bar .grp', where: `${where} Reiselogbuch` }));           // S-2, S-3
  t.liste(await checkSucheBeenden(p, { term: 'Sydney', item, where: `${where} Reiselogbuch` }));                           // S-5, S-6, S-15, S-18
  t.liste(await checkCmdF(p, { where: `${where} Reiselogbuch` }));                                                          // S-8, S-10, S-11
  // S-7 und S-13: Suchzeile oben (unter der Kopfzeile), beim Drehen bleiben Begriff, Filter und Treffer
  await sucheAuf(p); await p.locator('#search').pressSequentially('Sydney', { delay: 10 }); await p.waitForTimeout(900);
  await t.schritt(p, 'Suche offen', async () => {});
  const lage = () => p.evaluate(item => ({ wert: document.querySelector('#search')?.value ?? null, n: document.querySelector('#scount')?.textContent.trim() || '',
    tage: [...document.querySelectorAll(item)].filter(e => e.getClientRects().length).length,
    oben: (() => { const r = document.querySelector('#bar .nb2')?.getBoundingClientRect(), b = document.querySelector('#bar').getBoundingClientRect(); return r ? r.bottom <= b.bottom + 1 && r.top < innerHeight / 2 : false; })() }), item);
  const vor = await lage();
  t.ist('APD-91/S-7 Suchzeile oben in der Kopfzeile', vor.oben, true, 'R-2.3');
  t.ist('Vorbereitung: ‚Sydney‘ findet einen Tag', [vor.n, vor.tage], ['1 von 1', 1]);
  const vp = p.viewportSize();
  await t.schritt(p, 'Drehen mit offener Suche', async () => { await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(500); });
  const nach = await lage();
  t.ist('APD-91/S-13 nach dem Drehen: Begriff, Treffer, Filter', [nach.wert, nach.n, nach.tage], [vor.wert, vor.n, vor.tage], 'R-8.1');
  await p.setViewportSize(vp); await p.waitForTimeout(400);
  await p.click('#sclose'); await p.waitForTimeout(200);
  // S-9 am iPad quer: ohne offenes Reiselogbuch gibt es hier nicht (es ist immer eines offen) – die Suche in allen kommt über die Seitenleiste
  await p.close();
}
await t.ende(b);
