// Reiselogbuch-Test: ablauf-suche-iphone – A-24/A-27 (Nutzer 18.10.2026 T-95, Messung P-57 19.10.2026): am iPhone stehen Kopf-
// und Suchzeile beim Tippen in der Suche fest (R-2.1, R-2.3). Nachgebaut ist genau der gemessene Ablauf des Nutzers
// (Zusammenarbeit 0 Nr. 1 und 20): Reiselogbuch mit vielen Tagen öffnen, in die Mitte (bzw. ans Ende) rollen, Lupe antippen,
// Tastatur offen, Buchstabe für Buchstabe tippen – je nach Fall schnell (ein Sprung zum Treffer am Ende) oder mit Pausen wie am
// Gerät (nach jedem Buchstaben rollt die App zum Treffer), dann ⓧ und noch einmal tippen.
// Safari nach dem einen Modell AppDesign/tests/safari.mjs (sichtbarer Bereich bei offener Tastatur, Meldung 2 Bilder später,
// Rollen von Safari beim neuen Fokus). Gemessen wird in jedem Bild die Lage von Kopfzeile und Suchfeld auf dem Bildschirm; dazu:
// das Suchfeld bleibt dasselbe Feld und behält den Fokus. Gegen 3.24.0 rot: ±120 px (hoch) bzw. ±21 px (quer) nach ⓧ.
// Aufruf im Repo-Ordner: node tests/ablauf-suche-iphone.mjs. Meldet Fehler (pruefe.mjs).
import * as pw from 'playwright';
import { pruefung, rolle } from '../../AppDesign/fassung/4.30.0/tests/pruefe.mjs';
import { safariModell } from '../../AppDesign/fassung/4.30.0/tests/safari.mjs';
const t = pruefung('ablauf-suche-iphone', pw, { out: new URL('out/', import.meta.url) });
const days = {}; for (let i = 0; i < 40; i++) { const d = new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10); days[d] = { weather: '☀️', program: i === 30 ? 'Fahrt nach Sydney' : i % 7 === 0 ? 'Bus nach Sydney' : 'Programm ' + i, comment: '😉 ok', quarter: 'Hotel', place: 'Ort' }; }
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], foodColumn: true, days }];
// Fälle: Anfang (Mitte oder Ende) × Tippen (schnell; mit Pausen wie am Gerät, dann ⓧ und noch einmal)
const FAELLE = [
  { name: 'Mitte, schnell', ende: false, pause: 80, x: false },
  { name: 'Ende, schnell', ende: true, pause: 80, x: false },
  { name: 'Mitte, mit Pausen, ⓧ', ende: false, pause: 800, x: true },
];
const b = await t.browser();
for (const ansicht of ['iPhone hoch', 'iPhone quer']) for (const theme of ['light', 'dark']) for (const fall of FAELLE) {
  const p = await t.seite(b, ansicht, { theme });
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(300);
  await p.locator('#side .side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(300);
  await rolle(p, fall.ende ? 'ende' : '50%');
  await p.waitForTimeout(200);
  await safariModell(p, ansicht);
  await p.click('#searchBtn'); await p.waitForTimeout(100);
  await p.evaluate(() => __safari.tastatur(true)); await p.waitForTimeout(200);
  const ort = `${ansicht}, ${theme === 'dark' ? 'dunkel' : 'hell'}, ${fall.name}`;
  const tippen = async merke => { await merke(); for (const ch of 'Sydney') { await p.keyboard.type(ch); await p.waitForTimeout(fall.pause); } await p.waitForTimeout(800); };
  // größte Abweichung von Kopf- und Suchzeile von ihrer Lage im ersten Bild
  const auswerten = bilder => { const ok = bilder.filter(x => x.bar !== null && x.box !== null), a = ok[0] || { bar: 0, box: 0 };
    return { n: bilder.length, bar: Math.max(0, ...ok.map(x => Math.abs(x.bar - a.bar))), box: Math.max(0, ...ok.map(x => Math.abs(x.box - a.box))) }; };
  const runden = [['', tippen]];
  if (fall.x) runden.push([' nach ⓧ', async merke => { await p.click('#sclear'); await p.waitForTimeout(300); await tippen(merke); }]);
  for (const [wann, tun] of runden) {
    await p.evaluate(() => __safari.bilder(true));
    let feld = null;
    await t.schritt(p, `Tippen „Sydney“${wann} (${ort})`, async () => { await tun(async () => feld = await p.evaluateHandle(() => document.getElementById('search'))); });
    const r = auswerten(await p.evaluate(() => __safari.bilder(false)));
    t.ist(`Kopfzeile steht beim Tippen${wann} fest (${ort}, größte Abweichung px in ${r.n} Bildern)`, r.bar, 0, 'R-2.1');
    t.ist(`Suchzeile steht beim Tippen${wann} fest (${ort}, größte Abweichung px)`, r.box, 0, 'R-2.1');
    t.ist(`Suchfeld bleibt beim Tippen${wann} dasselbe Feld (${ort})`, await p.evaluate(f => f === document.getElementById('search'), feld), true, 'R-2.3');
  }
  t.ist(`Suchfeld behält den Fokus (${ort})`, await p.evaluate(() => document.activeElement === document.getElementById('search')), true, 'R-2.3');
  t.ist(`Suche hat gefiltert (${ort})`, await p.locator('#pdays .box').count(), n => n >= 1 && n < 40);
  await p.close();
}
await t.ende(b);
