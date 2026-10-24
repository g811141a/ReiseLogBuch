// Reiselogbuch-Test: ablauf-tastatur-still – AppDesign A-36 (R-4.5 Tastatur ohne Springen; Fall-Liste AppDesign arbeit/A-36
// Fall-Liste.md T-1 bis T-7 und B-1 bis B-18): die Abläufe aus P-60 und den Versuchen mit dem Muster – Fenster eines Tages, Ort antippen,
// Feld wechseln, Tastatur zu (alle vier Lagen; iPad mit Tastatur-Taste und erneutem Antippen); Gesamtausgaben unten im Inhalt (alle vier
// Lagen; iPhone hoch und iPad mit ↑ bei offener Tastatur und danach ↓; iPhone quer mit Wischen über das Feld; iPhone hoch auch mit nur
// einem Tag, B-15); Suche oben (iPhone hoch, darf nichts bewegen). In jedem Bild stehen Kopfzeile, Suchzeile, Seitenleiste und Fenster
// still, das Feld springt nie. T-8: dazu werden die Messungen aus AppDesign/tests/messungen/ mit dem Safari-Modell nachgespielt
// (spieleAb modell: Safari entscheidet selbst, ob es verschiebt) – jedes Bild jedes Schritts mit Tastatur.
// Gegen 3.26.0 (AppDesign 4.28.0) rot. iPhone quer: Wechsel zu ‚Quartier‘ (gleiche Zeile wie Ort) – ‚Programm‘ ist dort höher als der
// sichtbare Fensterinhalt (96 von 84 px), wie Safari dann verschiebt, ist nicht gemessen (Prüfliste).
// Aufruf im Repo-Ordner: node tests/ablauf-tastatur-still.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.34.0/tests/pruefe.mjs';
import { checkTastaturStill, STILL_LEISTEN, STILL_LINKS } from '../../AppDesign/fassung/4.34.0/tests/ablauf.mjs';
import { safariModell } from '../../AppDesign/fassung/4.34.0/tests/safari.mjs';
import { lies, ansicht, spieleAb } from '../../AppDesign/fassung/4.34.0/tests/abspielen.mjs';
import { readFileSync, readdirSync } from 'node:fs';
const t = pruefung('ablauf-tastatur-still', pw, { out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const days = {}; for (let i = 0; i < 30; i++) days[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Programm ' + i, quarter: 'Hotel ' + i, place: 'Sydney' };
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-09-22', transport: ['flug'], days }];
// ein sichtbarer Tag öffnet sein Fenster
const tagOeffnen = async p => {
  const sel = await p.evaluate(() => { const r = document.querySelector('#app > .rolle').getBoundingClientRect();
    const d = [...document.querySelectorAll('#app [data-day]')].find(e => { const b = e.getBoundingClientRect(); return b.height && b.top >= r.top && b.top <= r.bottom - 30; });
    return d ? `#app [data-day="${d.dataset.day}"]` : null; });
  if (sel) await p.click(sel, { position: { x: 30, y: 12 } });
  await p.waitForFunction(() => document.querySelector('#dlg[open] #fPlace'), null, { timeout: 3000 }).catch(() => {});
  // wie am Gerät: Ort liegt unten im Fenster (iPhone quer erst nach dem Rollen des Fensters sichtbar)
  await p.evaluate(() => document.querySelector('#fPlace')?.scrollIntoView({ block: 'nearest' })); await p.waitForTimeout(300);
};
// Gesamtausgaben an den unteren Rand des Inhalts (wie ablauf-feld-tastatur: dort liegt es am tiefsten unter der Tastatur)
const kostenUnten = async p => { await p.click('#toEnd'); await p.waitForTimeout(900);
  await p.evaluate(() => { const r = document.querySelector('#app > .rolle'), k = document.querySelector('#kosten');
    r.scrollTop += k.getBoundingClientRect().bottom - (r.getBoundingClientRect().bottom - 24); }); };
const KAPSEL = { hoch: '#toTop', ende: '#toEnd' };
const FAELLE = [
  { ansicht: 'iPhone hoch', name: 'Fenster Ort', field: '#fPlace', wechsel: '#fProgram', vorher: tagOeffnen },
  { ansicht: 'iPhone quer', name: 'Fenster Ort', field: '#fPlace', wechsel: '#fQuarter', vorher: tagOeffnen },
  { ansicht: 'iPad quer', name: 'Fenster Ort', field: '#fPlace', wechsel: '#fProgram', taste: true, vorher: tagOeffnen },
  { ansicht: 'iPad hoch', name: 'Fenster Ort', field: '#fPlace', wechsel: '#fProgram', taste: true, vorher: tagOeffnen },
  { ansicht: 'iPhone quer', name: 'Gesamtausgaben', field: '#kosten', wischen: true, vorher: kostenUnten },
  { ansicht: 'iPhone hoch', name: 'Gesamtausgaben', field: '#kosten', kapsel: KAPSEL, vorher: kostenUnten },
  { ansicht: 'iPad quer', name: 'Gesamtausgaben', field: '#kosten', taste: true, kapsel: KAPSEL, vorher: kostenUnten },
  { ansicht: 'iPad hoch', name: 'Gesamtausgaben', field: '#kosten', kapsel: KAPSEL, vorher: kostenUnten },
  // B-15: Inhalt kürzer als der Bildschirm – das Feld rollt trotzdem in die obere Hälfte (Platz darunter)
  { ansicht: 'iPhone hoch', name: 'Gesamtausgaben, 1 Tag', field: '#kosten', ein: true, vorher: async () => {} },
  { ansicht: 'iPhone hoch', name: 'Suche', field: '#search', vorher: async p => { await p.click('#searchBtn'); await p.evaluate(() => document.activeElement?.blur()); } },
];
const einTag = [{ ...trips[0], end: '2026-08-24', days: { '2026-08-24': trips[0].days['2026-08-24'] } }];
const b = await t.browser();
for (const theme of ['light', 'dark']) {
  for (const f of FAELLE) {
    const p = await t.seite(b, f.ansicht, { theme });
    t.ort = `${f.ansicht} ${theme === 'dark' ? 'dunkel' : 'hell'} · ${f.name}`;
    await p.goto(APP);
    await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), f.ein ? einTag : trips);
    await p.reload(); await p.waitForTimeout(400);
    if (await p.locator('#side .side-row[data-id="a"]').isVisible() && (f.ansicht.startsWith('iPhone') || await p.locator('#side.over').isVisible())) { await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400); }
    await safariModell(p, f.ansicht, { auto: true, leisten: STILL_LEISTEN, links: STILL_LINKS });
    if (f.ein && await p.evaluate(() => { const r = document.querySelector('#app > .rolle'); return r.scrollHeight - r.clientHeight > 300; })) t.liste([`${t.ort}: Vorbereitung: der Inhalt mit einem Tag ist nicht kurz`]);
    t.liste(await checkTastaturStill(p, { field: f.field, wechsel: f.wechsel, taste: f.taste, kapsel: f.kapsel, wischen: f.wischen, vorher: () => f.vorher(p), where: t.ort }));
    await t.schritt(p, `nach ${f.name} mit Tastatur zu`, async () => {});   // Grundregeln im Endzustand
    await p.close();
  }
}
// T-8: die Messungen der Rückmeldung, Bild für Bild (bis vor das Beenden der Messung im Menü)
const ORDNER = new URL('../../AppDesign/tests/messungen/', import.meta.url);
const BIS = { '2026-10-19 iPhone quer Suche Fenster Gesamtausgaben.txt': 133000, '2026-10-20 iPhone hoch Fenster Ort.txt': 35000, '2026-10-20 iPad quer Fenster Ort.txt': 25000 };
const tage = {}; for (let i = 0; i < 40; i++) tage[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Programm ' + i, quarter: 'Hotel ' + i, ...(i % 3 ? {} : { place: 'Sydney' }) };
const tagSichtbar = async p => {   // wie ablauf-abspielen: ein sichtbarer Tag, sonst der letzte in den Inhalt gerollt
  const sel = await p.evaluate(() => { const r = document.querySelector('#app > .rolle').getBoundingClientRect();
    const d = [...document.querySelectorAll('#app [data-day]')].find(e => { const b = e.getBoundingClientRect(); return b.height && b.top >= r.top && b.bottom <= r.bottom; });
    const e = d || [...document.querySelectorAll('#app [data-day]')].filter(x => x.getClientRects().length).at(-1);
    if (!d) e?.scrollIntoView({ block: 'end' });
    return e ? `#app [data-day="${e.dataset.day}"]` : null; });
  if (sel) await p.click(sel);
};
for (const datei of readdirSync(ORDNER).filter(f => f.endsWith('.txt')).sort()) {
  const m = lies(readFileSync(new URL(encodeURIComponent(datei), ORDNER), 'utf8'));
  if (!m.app.startsWith('Reiselogbuch')) continue;
  const p = await t.seite(b, ansicht(m));
  t.ort = `T-8 ${datei.replace(/\.txt$/, '')}`;
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), [{ ...trips[0], end: '2026-10-02', days: tage }]);
  await p.reload(); await p.waitForTimeout(400);
  await safariModell(p, `${m.geraet} ${m.lage}`, { auto: true });
  t.liste(await spieleAb(p, m, { ziele: { button: ['#side .side-row[data-id="a"]'], '-': [tagSichtbar] }, woerter: { search: 'Sydney', fPlace: 'Perth', kosten: '4850123456' },
    bis: BIS[datei] ?? Infinity, modell: true, where: t.ort }).then(f => f.filter(x => /: T-8 |nicht nachspielbar|Vorbereitung/.test(x))));
  await p.close();
}
await t.ende(b);
