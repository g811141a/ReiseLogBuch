// Reiselogbuch-Test: ablauf-fenster-breite – Rückmeldung P-76/4 (Nutzer 26.10.2026): am iPad wurde das Fenster ‚Neues Reiselogbuch‘
// mit dem ersten Buchstaben im Reisetitel breiter (der Hinweis zum überschneidenden Zeitraum erschien, das Fenster ist so breit wie
// sein Inhalt). Ein offenes Fenster ändert Breite und Lage nicht, solange die Ansicht gleich bleibt – nach jedem Buchstaben und jeder
// Eingabe (Neues Reiselogbuch wie am Gerät über plus, Reiselogbuch einstellen mit überschneidendem Zeitraum, Erfassen, Fazit).
// Aufruf im Repo-Ordner: node tests/ablauf-fenster-breite.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.48.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.48.0/tests/hig.mjs';
const t = pruefung('ablauf-fenster-breite', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
// wie am Gerät: eine laufende Reise mit langem Titel – der vorgeschlagene Zeitraum (heute + 14 Tage) überschneidet sich mit ihr
const trips = [{ id: 'a', title: 'Rundreise Australien und Neuseeland 2026', participants: 'G & A', start: iso(0), end: iso(29), transport: ['flug'],
  foodColumn: true, moodColumn: true, quarterColumn: true, days: { [iso(2)]: { program: 'Programm' } } },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} }];
const rahmen = p => p.evaluate(() => { const r = document.querySelector('dialog[open]').getBoundingClientRect(); return { breite: Math.round(r.width), links: Math.round(r.left) }; });
// Buchstabe für Buchstabe tippen; nach jedem Buchstaben Breite und Lage wie beim Öffnen
async function tippe(p, fenster, feld, text, soll) {
  await p.click(feld); await p.waitForTimeout(150);
  t.ist(`${fenster}: ${feld} angetippt – Breite und Lage`, await rahmen(p), soll, 'R-4.6');
  for (const z of text) {
    await p.keyboard.type(z); await p.waitForTimeout(150);
    if (!t.ist(`${fenster}: ‚${z}‘ in ${feld} – Breite und Lage`, await rahmen(p), soll, 'R-4.6')) break;
  }
}
const b = await t.browser();
for (const [ansicht, theme] of [['iPad quer', 'light'], ['iPad hoch', 'light'], ['iPad quer', 'dark']]) {
  const p = await t.seite(b, ansicht, { theme });
  await p.clock.setFixedTime(new Date('2026-09-02T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400);
  if (await p.locator('#side.page').isVisible()) { await p.locator('#side .side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(600); }
  const offen = async (name, oeffnen) => { await t.schritt(p, name, async () => { await oeffnen(); await p.waitForTimeout(800); }); return rahmen(p); };
  const zu = async () => { await p.evaluate(() => { dlgDirty = () => false; dlg.close('cancel'); }); await p.waitForTimeout(600); };

  // P-76/4 genau wie am Gerät: plus in der Seitenleiste, Reisetitel antippen, ‚Test‘ tippen
  if (!(await p.locator('#newTrip').isVisible())) await p.evaluate(() => toggleSidebar?.(true)).catch(() => {});
  let soll = await offen('Neues Reiselogbuch', () => p.click('#newTrip'));
  await tippe(p, 'Neues Reiselogbuch', '#fTitle', 'Test', soll);
  await t.schritt(p, 'Neues Reiselogbuch nach ‚Test‘', async () => {});
  await tippe(p, 'Neues Reiselogbuch', '#fPeople', 'G', soll);
  await p.screenshot({ path: new URL(`out/fenster-breite-${t.ort.replace(/ /g, '-')}-${t.browserName}.png`, import.meta.url).pathname });
  await zu();

  // dieselbe Lücke in den anderen Fenstern: Reiselogbuch einstellen (Zeitraum überschneidet sich), Erfassen, Fazit
  soll = await offen('Reiselogbuch einstellen', () => p.evaluate(() => openTripDialog(db.trips[0])));
  await p.evaluate(() => { const f = dlg.querySelector('#fStart'); f.value = '2027-05-01'; f.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.waitForTimeout(200);
  t.ist('Reiselogbuch einstellen: Zeitraum überschneidet sich mit ‚Toskana‘ – Breite und Lage', await rahmen(p), soll, 'R-4.6');
  await tippe(p, 'Reiselogbuch einstellen', '#fTitle', 'x', soll);
  await zu();
  soll = await offen('Erfassen', () => p.evaluate(d => openDayDialog(db.trips[0], d), iso(2)));
  for (const f of ['#fProgram', '#fComment', '#fQuarter', '#fPlace']) await tippe(p, 'Erfassen', f, 'Ab', soll);
  await zu();
  soll = await offen('Fazit', () => p.evaluate(() => openFazitDialog(db.trips[0])));
  await tippe(p, 'Fazit', '#fFazit', 'Ab', soll);
  await zu();
  await p.close();
}
await t.ende(b);
