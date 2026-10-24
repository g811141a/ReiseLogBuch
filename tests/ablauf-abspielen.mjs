// Reiselogbuch-Test: ablauf-abspielen – AppDesign A-31 (seit 3.26.0; Fall-Liste AppDesign arbeit/A-26 A-31 A-34 Fall-Liste.md
// Abschnitt 2.3, M-1 bis M-6, und Abschnitt 10, F-11): jede Messdatei des Reiselogbuchs in AppDesign/tests/messungen/ wird
// nachgespielt (tests/abspielen.mjs) – Kopf- und Suchzeile und Fokus wie am Gerät gemessen; nach ‚tippen kosten‘ steht das Feld
// Gesamtausgaben über der Tastatur (A-35, am Gerät bis 3.25.1 darunter). M-5: dieselbe Messung um 20 px verschoben muss rot werden.
// Aufruf im Repo-Ordner: node tests/ablauf-abspielen.mjs
import * as pw from 'playwright';
import { readFileSync, readdirSync } from 'node:fs';
import { pruefung } from '../../AppDesign/fassung/4.32.2/tests/pruefe.mjs';
import { safariModell } from '../../AppDesign/fassung/4.32.2/tests/safari.mjs';
import { lies, ansicht, spieleAb } from '../../AppDesign/fassung/4.32.2/tests/abspielen.mjs';
const t = pruefung('ablauf-abspielen', pw, { out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href, ORDNER = new URL('../../AppDesign/tests/messungen/', import.meta.url);
const days = {}; for (let i = 0; i < 40; i++) days[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Programm ' + i, quarter: 'Hotel ' + i, ...(i % 3 ? {} : { place: 'Sydney' }) };   // Suche ‚Sydne…‘ findet jeden 3. Tag
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-10-02', transport: ['flug'], days }];
// Je Messdatei: bis wohin nachgespielt wird (danach nur noch das Beenden der Messung im Menü); aufbau = seit der Messung geänderter
// Aufbau – seit 3.26.1 (AppDesign 4.28.1, R-2.4) ist die Kopfzeile am iPhone quer niedrig, die Suchzeile steht 29 px höher (33 statt 62)
const EINSTELLUNG = { '2026-10-19 iPhone quer Suche Fenster Gesamtausgaben.txt': { bis: 133000, aufbau: { such: -29 } },
  '2026-10-20 iPhone hoch Fenster Ort.txt': { bis: 35000 }, '2026-10-20 iPad quer Fenster Ort.txt': { bis: 25000 } };
// Ziele ohne id: ‚button‘ = Reiselogbuch in der Liste, ‚-‘ = ein sichtbarer Tag (öffnet das Fenster des Tages). Ist mit den eigenen
// Daten kein Tag zu sehen (am Gerät endete der Inhalt kürzer), wird der letzte Tag in den Inhalt gerollt – inh wird nicht verglichen.
const tagSichtbar = async p => {
  const sel = await p.evaluate(() => { const r = document.querySelector('#app > .rolle').getBoundingClientRect();
    const d = [...document.querySelectorAll('#app [data-day]')].find(e => { const b = e.getBoundingClientRect(); return b.height && b.top >= r.top && b.bottom <= r.bottom; });
    const e = d || [...document.querySelectorAll('#app [data-day]')].filter(x => x.getClientRects().length).at(-1);
    if (!d) e?.scrollIntoView({ block: 'end' });
    return e ? `#app [data-day="${e.dataset.day}"]` : null; });
  if (sel) await p.click(sel);
};
const ziele = () => ({ button: ['#side .side-row[data-id="a"]'], '-': [tagSichtbar] });
const woerter = { search: 'Sydney', fPlace: 'Perth', kosten: '4850123456' };
// F-11: nach dem Antippen von Gesamtausgaben (und jeder Eingabe dort) steht das Feld ganz über der Tastatur
const nachSchritt = async (p, s) => {
  if (!/^(tippen kosten|eingabe )/.test(s.ereignis) || !await p.evaluate(() => document.activeElement?.id === 'kosten')) return [];
  const r = await p.evaluate(() => { const o = visualViewport.offsetTop, k = document.getElementById('kosten').getBoundingClientRect(), re = document.querySelector('#app > .rolle').getBoundingClientRect();
    return { oben: Math.round(k.top - o), unten: Math.round(k.bottom - o), rolle: Math.round(re.top - o), kb: Math.round(visualViewport.height) }; });
  // R-4.5: 16 px über der Tastatur; reicht der Platz nicht (Suchzeile offen), ganz sichtbar direkt unter der Suchzeile
  const eng = r.unten - r.oben > r.kb - 16 - r.rolle;
  return (eng ? r.unten > r.kb || Math.abs(r.oben - r.rolle) > 1 : r.unten > r.kb - 16 + 1)
    ? [`F-11 Gesamtausgaben nicht ganz über der Tastatur (${r.oben}–${r.unten} px, Inhalt ab ${r.rolle} px, Tastatur ab ${r.kb} px), R-4.5`] : [];
};
const b = await t.browser();
const dateien = readdirSync(ORDNER).filter(f => f.endsWith('.txt')).sort();
for (const datei of dateien) {
  const m = lies(readFileSync(new URL(encodeURIComponent(datei), ORDNER), 'utf8'));
  if (!m.app.startsWith('Reiselogbuch')) continue;
  // Seit 3.28.0: Messungen ohne Kopf- und Suchzeile (z. B. ‚Ränder‘ aus P-63/9 – nur Startliste und Menü, für die sicheren Ränder)
  // haben nichts nachzuspielen; ihr Schritt ‚button‘ ist ‚Messung beenden‘ im Menü, nicht eine Kachel
  if (!m.zeilen.some(z => z.kopf != null || z.such != null)) continue;
  for (const gegenprobe of [false, true]) {
    const p = await t.seite(b, ansicht(m));
    t.ort = `${datei.replace(/\.txt$/, '')}${gegenprobe ? ' (Gegenprobe M-5)' : ''}`;
    await p.goto(APP);
    await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
    await p.reload(); await p.waitForTimeout(400);
    await safariModell(p, m.lage === 'quer' ? 'iPhone quer' : 'iPhone hoch');
    const { bis = Infinity, aufbau = {} } = EINSTELLUNG[datei] || {};
    if (gegenprobe) {   // M-5: Suchzeile (ohne Suche in der Messung: Kopfzeile) 20 px verschoben – das Nachspielen muss das finden
      const k = m.zeilen.some(z => z.such != null) ? 'such' : 'kopf';
      const f = await spieleAb(p, m, { ziele: ziele(), woerter, bis: Math.min(bis ?? Infinity, 30000), verschiebe: { ...aufbau, [k]: (aufbau[k] ?? 0) + 20 } });
      t.wahr('M-5 Gegenprobe: eine um 20 px verschobene Messung bleibt beim Nachspielen grün', f.some(x => x.includes(k === 'such' ? 'Suchzeile' : 'Kopfzeile')), 'A-31');
    } else {
      t.liste(await spieleAb(p, m, { ziele: ziele(), woerter, bis, verschiebe: aufbau, nachSchritt: s => nachSchritt(p, s), where: t.ort }));
      await t.schritt(p, 'nach dem Nachspielen', async () => {});
    }
    await p.close();
  }
}
t.wahr('M-6 keine Messdatei des Reiselogbuchs gefunden', dateien.length > 0, 'A-31');
await t.ende(b);
