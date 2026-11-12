// Reiselogbuch-Test: ablauf-feld-cursor – AppDesign APD-126 (R-5.11 Cursor am Ende, R-5.2 ‚Textfelder leer einzeilig, wachsen mit‘, R-4.5;
// Testfall-Liste AppDesign arbeit/4.57.0 Testfall-Liste.md APD-126/B-1 bis B-13, seit 3.55.0 / AppDesign 4.57.0) über `checkFeldCursor`:
// Fenster Tag – Quartier, Ort, Verlauf vorn antippen (Cursor am Ende, zweites Antippen an der Stelle), Tab von Quartier nach Ort, ‚Wie war was?‘
// leer einzeilig, Eingabetaste, Umbruch, Löschen, ⓧ, Verlauf ganz zu sehen auch nach ‚Weiterfahrt nach …‘, Drehen mit Cursor in der Mitte;
// Fenster ‚Reiselogbuch einstellen‘ (Titel) und Fazit (langer Text); dunkel mit Textgröße 33 (B-11). Alle vier Lagen, im Safari-Modell
// (Tastatur öffnet beim Fokus – R-4.5: die Zeile mit dem Cursor bleibt 16 px über der Tastatur, B-10). Grundregeln nach jedem Schritt.
// Aufruf im Repo-Ordner: node tests/ablauf-feld-cursor.mjs
//   PRUEF_V=alt …                   Gegenprobe (APD-126/B-13): ui.js der Fassung 4.56.0 – B-1 und B-3 bis B-6 müssen rot werden
//   PRUEF_ANSICHT='iPhone quer' …   nur eine Ansicht (während der Arbeit)
import * as pw from 'playwright';
import { readFileSync } from 'node:fs';
import { pruefung } from '../../AppDesign/fassung/4.57.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.57.0/tests/hig.mjs';
import { checkFeldCursor, STILL_LEISTEN, STILL_LINKS } from '../../AppDesign/fassung/4.57.0/tests/ablauf.mjs';
import { safariModell } from '../../AppDesign/fassung/4.57.0/tests/safari.mjs';
const t = pruefung('ablauf-feld-cursor', pw, { out: new URL('out/', import.meta.url), hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }) });
const alt = process.env.PRUEF_V === 'alt';
const APP = new URL('../index.html', import.meta.url).href;
const TAG = '2026-08-25';
const days = {};
for (let i = 0; i < 6; i++) days[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Frühstück im Hotel\nFähre nach Manly', comment: '',
  quarter: 'Oaks Hotel Sydney', place: 'Sydney, Australien' };
const FAZIT = 'Eine wunderbare Reise mit vielen Eindrücken, langen Fahrten und herzlichen Menschen. Am schönsten waren das Riff vor Cairns und die Wanderungen auf der Südinsel.\nNächstes Mal mehr Zeit für Tasmanien.';
const trips = [{ id: 'muster', title: 'Australien und Neuseeland', participants: 'Anna, Ben', start: '2026-08-24', end: '2026-08-29', transport: ['flug'], days, fazit: FAZIT, foodColumn: true }];
const b = await t.browser();

async function neu(ansicht, theme = 'light', text = 0, modell = true) {
  if (text) process.env.PRUEF_TEXT = String(text);
  const p = await t.seite(b, ansicht, { theme });
  if (text) delete process.env.PRUEF_TEXT;
  // Gegenprobe: ui.js 4.56.0, als 4.57.0 gemeldet (sonst meldet die App ‚AppDesign zu alt‘), dazu aufzaehlung aus 4.57.0 (braucht die App, RLB-122)
  if (alt) await p.route(/fassung\/4\.57\.0\/ui\.js$/, r => r.fulfill({ body: readFileSync(new URL('../../AppDesign/fassung/4.56.0/ui.js', import.meta.url), 'utf8')
    .replace(/AD_VERSION = '4\.56\.0'/, "AD_VERSION = '4.57.0'") + "\nfunction aufzaehlung(liste) { return liste.map(x => `<span class=\"ict az\">${esc(x)}</span>`).join('\\u00a0\\u00b7 '); }\n",
    contentType: 'text/javascript' }));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'muster' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(500);
  if (await p.locator('#side .side-row[data-id="muster"]').isVisible().catch(() => false)) { await p.locator('#side .side-row[data-id="muster"]').click(); await p.waitForTimeout(400); }
  if (modell) await safariModell(p, ansicht, { auto: true, leisten: STILL_LEISTEN, links: STILL_LINKS });
  return p;
}
const zu = async p => { await p.evaluate(() => { document.activeElement?.blur?.(); dlg.open && dlg.close(); }); await p.waitForTimeout(400); };

for (const ansicht of ['iPad quer', 'iPhone hoch', 'iPad hoch', 'iPhone quer'].filter(a => !process.env.PRUEF_ANSICHT || a === process.env.PRUEF_ANSICHT)) {
  const zusatz = alt ? ' (Gegenprobe 4.56.0)' : '';
  {
    const p = await neu(ansicht);
    t.ort = `${ansicht} hell${zusatz}`;
    // Fenster Tag: APD-126/B-1 bis B-10, B-12
    await t.schritt(p, 'Fenster Tag', () => p.evaluate(iso => openDayDialog(db.trips[0], iso), TAG));
    t.liste(await checkFeldCursor(p, { felder: ['#fQuarter', '#fPlace', '#fProgram'], tab: ['#fQuarter', '#fPlace'], leer: '#fComment', einzeilig: '#fQuarter',
      mehrzeilig: ['#fProgram'], vorschlag: { feld: '#fProgram', knopf: '#suggest button:first-child' }, drehen: false, where: `${t.ort} Fenster Tag` }));
    await t.schritt(p, 'nach den Eingabefeldern im Fenster Tag', async () => {});
    await zu(p);
    // Fenster ‚Reiselogbuch einstellen‘ (Titel) und Fazit (langer, mehrzeiliger Text): APD-126/B-1, B-2, B-8
    await t.schritt(p, 'Fenster Reiselogbuch einstellen', () => p.evaluate(() => openTripDialog(db.trips[0])));
    t.liste(await checkFeldCursor(p, { felder: ['#fTitle'], drehen: false, where: `${t.ort} Reiselogbuch einstellen` }));
    await zu(p);
    await t.schritt(p, 'Fenster Fazit', () => p.evaluate(() => openFazitDialog(db.trips[0])));
    t.liste(await checkFeldCursor(p, { felder: ['#fFazit'], mehrzeilig: ['#fFazit'], drehen: false, where: `${t.ort} Fazit` }));
    await t.schritt(p, 'nach den Eingabefeldern im Fazit', async () => {});
    await p.close();
  }
  {
    // APD-126/B-9: Drehen mit offenem Feld und Cursor in der Mitte – ohne Safari-Modell (es kennt kein Drehen: die Tastatur gälte als geschlossen,
    // ui.js nähme dem Feld den Fokus); Fokus, Cursor und Rollstand bleiben (Grundregeln danach)
    const p = await neu(ansicht, 'light', 0, false);
    t.ort = `${ansicht} hell, Drehen${zusatz}`;
    await t.schritt(p, 'Fenster Tag', () => p.evaluate(iso => openDayDialog(db.trips[0], iso), TAG));
    t.liste(await checkFeldCursor(p, { mehrzeilig: ['#fProgram'], where: `${t.ort} Fenster Tag` }));
    await t.schritt(p, 'nach dem Drehen im Fenster Tag', async () => {});
    await p.close();
  }
  {
    // APD-126/B-11: dunkel und Textgröße groß – leeres Feld einzeilig (Höhe folgt der Textgröße), nichts abgeschnitten
    const p = await neu(ansicht, 'dark', 33);
    t.ort = `${ansicht} dunkel · Text 33${zusatz}`;
    await t.schritt(p, 'Fenster Tag', () => p.evaluate(iso => openDayDialog(db.trips[0], iso), TAG));
    t.liste(await checkFeldCursor(p, { leer: '#fComment', mehrzeilig: ['#fProgram'], drehen: false, where: `${t.ort} Fenster Tag (APD-126/B-11)` }));
    await t.schritt(p, 'nach dem leeren Feld (Textgröße 33)', async () => {});
    await p.close();
  }
}
await t.ende(b);
