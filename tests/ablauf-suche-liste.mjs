// Reiselogbuch-Test: ablauf-suche-liste (seit 3.21.0, RLB-92 / AppDesign APD-19, R-2.3) – Suche über alle Reiselogbücher in der
// Startliste bzw. Seitenleiste: Lupe, Filter, ‚N Treffer‘ je Fundstelle wie ‚1 von N‘, Öffnen mit gefüllter Suche, beide
// Suchfelder 1:1, zurück gefiltert, ‚Keine Treffer‘ (AppDesign checkListSearch); dazu die App-Fälle der Testfall-Liste
// (AppDesign arbeit/RLB-92 Testfall-Liste.md): RLB-92/F-3 ausgeblendete Spalte, RLB-92/F-9 Groß/klein, RLB-92/F-10 ohne Reiselogbuch, RLB-92/F-11 viele,
// RLB-92/F-15 Drehen, RLB-92/F-16 Eingabetaste, RLB-92/F-19 Neuladen. Aufruf im Repo-Ordner: node tests/ablauf-suche-liste.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.36.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.36.0/tests/hig.mjs';
import { checkListSearch } from '../../AppDesign/fassung/4.36.0/tests/ablauf.mjs';
const t = pruefung('ablauf-suche-liste', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const mk = (id, start, n, f, extra = {}) => { const days = {}; for (let i = 0; i < n; i++) days[new Date(Date.parse(start) + i * 864e5).toISOString().slice(0, 10)] = f(i);
  return { id, title: id, participants: 'G & A', start, end: Object.keys(days).at(-1), transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, days, ...extra }; };
const trips = [
  mk('Spanien', '2026-05-02', 10, i => ({ weather: '☀️', program: 'Altstadt ' + i, comment: '😉 gut', food: i % 3 ? '😋 Bar Pinotxo – Tapas' : '😋 La Pepica – Paella am Strand, beste Paella', quarter: 'Hotel Neri', place: 'Barcelona' })),
  mk('Portugal', '2025-09-10', 8, i => ({ weather: '🌤', program: 'Lissabon ' + i, comment: i === 3 ? '😉 Paella war besser in Valencia' : '😉 gut', food: '😋 Time Out Market', quarter: 'Casa Amora', place: 'Lissabon' })),
  // RLB-92/F-3: Essen-Spalte aus – ‚Paella‘ im Essen zählt nicht (im Reiselogbuch nicht zu sehen), nur der Verlauf.
  mk('Italien', '2024-06-01', 4, i => ({ program: i === 1 ? 'Kochkurs Paella' : 'Rom ' + i, food: '😋 Paella Paella' }), { foodColumn: false }),
  mk('Australien', '2023-08-24', 12, i => ({ weather: '☀️', program: 'Sydney ' + i, comment: '😉 ok', food: '😋 Zum Hafen – Fisch', quarter: 'Hotel Bellevue', place: 'Sydney' })),
];
const start = async (p, data = trips) => {
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'Australien' }, trips: x })), data);
  await p.reload(); await p.waitForTimeout(400);
};
const hitsOf = p => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('#side .side-row')].map(r => [r.dataset.id, r.querySelector('small.hits')?.textContent.trim() || ''])));
const b = await t.browser();
for (const [ansicht, theme] of [['iPad quer', 'light'], ['iPad quer', 'dark'], ['iPad hoch', 'light'], ['iPhone hoch', 'light'], ['iPhone hoch', 'dark']]) {
  const p = await t.seite(b, ansicht, { theme });
  const where = `${ansicht} ${theme === 'dark' ? 'dunkel' : 'hell'}`; t.ort = where;
  await start(p);
  const phone = ansicht.startsWith('iPhone'), over = ansicht === 'iPad hoch';
  // iPad hoch: die Seitenleiste liegt beim Start über dem Inhalt; nach dem Antippen ist sie zu – zurück über panel-left.
  const back = phone ? () => p.click('#back') : over ? () => p.locator('[data-side-toggle]').first().click() : null;
  for (const e of await checkListSearch(p, { term: 'Paella', where, back })) t.fehler('R-2.3', e);
  if (over || phone) { if (phone) await p.click('#back').catch(() => {}); else if (!await p.locator('#side:not([hidden])').count()) await p.locator('[data-side-toggle]').first().click(); await p.waitForTimeout(300); }
  await t.schritt(p, 'Liste gefiltert', async () => { await p.click('#listSearchBtn'); await p.locator('#lsearch').pressSequentially('Paella', { delay: 10 }); await p.waitForTimeout(300); });
  if (ansicht === 'iPad quer' && theme === 'light') {
    // RLB-92/F-3: Italien zählt nur den Verlauf (Essen-Spalte aus); RLB-92/F-9: Groß/klein gleich.
    const h = await hitsOf(p);
    t.ist('RLB-92/F-3 Italien: nur sichtbare Spalten gezählt', h.Italien, '1 Treffer', 'R-2.3');
    t.ist('RLB-92/F-3 Spanien je Fundstelle', h.Spanien, '8 Treffer', 'R-2.3');
    await p.locator('#lsearch').fill('PAELLA'); await p.locator('#lsearch').dispatchEvent('input'); await p.waitForTimeout(200);
    t.ist('RLB-92/F-9 Groß/klein: gleiche Treffer', JSON.stringify(await hitsOf(p)), JSON.stringify(h), 'R-2.3');
    // RLB-92/F-16: Eingabetaste schließt nur die Tastatur – nichts öffnet sich.
    const cur = await p.evaluate(() => currentTripId);
    await p.locator('#lsearch').press('Enter'); await p.waitForTimeout(200);
    t.ist('RLB-92/F-16 Eingabetaste öffnet nichts', await p.evaluate(() => currentTripId), cur, 'R-5.5');
    t.ist('RLB-92/F-16 Eingabetaste schließt die Tastatur (kein Fokus)', await p.evaluate(() => document.activeElement?.id), '', 'R-5.5');
    // RLB-92/F-15: Drehen – Begriff und Filter bleiben.
    await p.setViewportSize({ width: 820, height: 1180 }); await p.waitForTimeout(400);
    await p.setViewportSize({ width: 1180, height: 820 }); await p.waitForTimeout(400);
    t.ist('RLB-92/F-15 nach dem Drehen: Begriff bleibt', await p.inputValue('#lsearch').catch(() => null), 'PAELLA', 'R-8.1');
    t.ist('RLB-92/F-15 nach dem Drehen: Filter bleibt', Object.keys(await hitsOf(p)).length, 3, 'R-8.1');
    // RLB-92/F-19: Neuladen beginnt ohne Suche.
    await p.reload(); await p.waitForTimeout(400);
    t.ist('RLB-92/F-19 Neuladen: Suchzeile zu', await p.locator('#lsearch').count(), 0);
    // RLB-92/F-10: ohne Reiselogbuch keine Lupe.
    await start(p, []); await p.evaluate(() => dlg.open && dlg.close()); await p.waitForTimeout(200);
    t.ist('RLB-92/F-10 ohne Reiselogbuch keine Lupe', await p.locator('#listSearchBtn').count(), 0);
    // RLB-92/F-11: 30 lange Reiselogbücher – Zählen und Aufbau je Tastendruck unter 50 ms. Bester Durchgang à 5 Tastendrücken
    // aus bis zu 5 Runden à 3 Durchgängen mit 0,5 s Pause (seit 3.24.0): im vollen Lauf (4 Browser gleichzeitig) maßen in WebKit
    // 3.23.1 und 3.24.0 gleich 42–58 ms, Durchgänge direkt hintereinander fielen in dieselbe Lastspitze – Last der Prüfumgebung,
    // nicht der App; die Grenze 50 ms bleibt.
    const many = Array.from({ length: 30 }, (_, k) => mk('Reise ' + k, `20${10 + (k % 15)}-0${1 + (k % 9)}-01`, 30, i => ({ program: 'Langer Verlauf mit vielen Wörtern '.repeat(8) + (i % 5 ? '' : 'Paella'), comment: '😉 ' + 'schön '.repeat(30), food: '😋 Bar – Essen', quarter: 'Hotel', place: 'Ort' })));
    await start(p, many);
    await p.click('#listSearchBtn'); await p.locator('#lsearch').fill('Paell');
    let ms = Infinity;
    for (let runde = 0; runde < 5 && ms >= 50; runde++) { if (runde) await p.waitForTimeout(500); ms = Math.min(ms, await p.evaluate(() => { const s = document.getElementById('lsearch'); let best = Infinity; for (let r = 0; r < 3; r++) { const t0 = performance.now(); for (let i = 0; i < 5; i++) { s.value = i % 2 ? 'Paella' : 'Paell'; s.dispatchEvent(new Event('input')); } best = Math.min(best, (performance.now() - t0) / 5); } return best; })); }
    t.ist(`RLB-92/F-11 30 Reiselogbücher: Aufbau je Tastendruck (${Math.round(ms)} ms)`, ms < 50, true);
  }
  await p.close();
}
await t.ende(b);
