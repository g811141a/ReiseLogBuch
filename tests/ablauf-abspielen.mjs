// Reiselogbuch-Test: ablauf-abspielen – AppDesign APD-31 (seit 3.26.0; Testfall-Liste AppDesign arbeit/APD-26 APD-31 APD-34 Testfall-Liste.md
// Abschnitt 2.3, APD-34/M-1 bis APD-34/M-6, und Abschnitt 10, APD-34/F-11): jede Messdatei des Reiselogbuchs in AppDesign/tests/messungen/ wird
// nachgespielt (tests/abspielen.mjs) – Kopf- und Suchzeile und Fokus wie am Gerät gemessen; nach ‚tippen kosten‘ steht das Feld
// Gesamtausgaben über der Tastatur (APD-35, am Gerät bis 3.25.1 darunter). APD-34/M-5: dieselbe Messung um 20 px verschoben muss rot werden.
// Aufruf im Repo-Ordner: node tests/ablauf-abspielen.mjs
import * as pw from 'playwright';
import { readFileSync, readdirSync } from 'node:fs';
import { pruefung } from '../../AppDesign/fassung/4.48.0/tests/pruefe.mjs';
import { safariModell } from '../../AppDesign/fassung/4.48.0/tests/safari.mjs';
import { lies, ansicht, spieleAb, schritte } from '../../AppDesign/fassung/4.48.0/tests/abspielen.mjs';
import { sucheAuf } from '../../AppDesign/fassung/4.48.0/tests/ablauf.mjs';
const t = pruefung('ablauf-abspielen', pw, { out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href, ORDNER = new URL('../../AppDesign/tests/messungen/', import.meta.url);
const days = {}; for (let i = 0; i < 40; i++) days[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Programm ' + i, quarter: 'Hotel ' + i, ...(i % 3 ? {} : { place: 'Sydney' }) };   // Suche ‚Sydne…‘ findet jeden 3. Tag
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-10-02', transport: ['flug'], days }];
// Je Messdatei: bis wohin nachgespielt wird (danach nur noch das Beenden der Messung im Menü); aufbau = seit der Messung geänderter
// Aufbau – seit 3.26.1 (AppDesign 4.28.1, R-2.4) ist die Kopfzeile am iPhone quer niedrig, die Suchzeile steht 29 px höher (33 statt 62)
// Seit 3.36.0 (RLB-103): das Beenden der Messung im Menü spielt spieleAb nicht mehr nach – bis nur noch, wo die Messung vorher endet
const EINSTELLUNG = { '2026-10-19 iPhone quer Suche Fenster Gesamtausgaben.txt': { bis: 133000, aufbau: { such: -29 } },
  // seit 3.30.2: Messung einer Geste (P-69/3) – das Feld bekam den Fokus ohne ‚tippen‘-Zeile, Zeigerbewegungen spielt abspielen.mjs
  // nicht nach; der gemessene Zug am Rand ist in checkSheet B19 nachgebaut (‚erst nach oben, dann nach unten‘)
  '2026-10-24 iPhone hoch Blatt Zug am Rand.txt': { aus: true } };
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
// seit 3.36.0 (RLB-103) je Messung der Reihe nach: ‚button‘ auch ‚Änderungen verwerfen‘, ‚-‘ auch die Fläche hinter einem Menü
const schliesseMenue = p => p.evaluate(() => document.querySelector('.layer')?.click());
// seit 3.41.0 (AppDesign APD-91): die Lupe der Messungen (searchBtn) gibt es nicht mehr – nachgespielt öffnet ‚Suchen‘ im Mehr-Menü die
// Suche, ist sie offen, schließt sie das x ‚Suche beenden‘ (wie früher das zweite Antippen der Lupe)
const lupe = async p => (await p.locator('#search').count()) ? p.click('#sclose') : sucheAuf(p);
const ZIELE = { '2026-10-26 iPhone quer Blatt Ort Quartier.txt': { button: ['#side .side-row[data-id="a"]', '.pop button.danger'], '-': [tagSichtbar, schliesseMenue] } };
const ziele = datei => ({ button: ['#side .side-row[data-id="a"]'], '-': [tagSichtbar], searchBtn: lupe, ...ZIELE[datei] });
const woerter = { search: 'Sydney', fPlace: 'Perth', kosten: '4850123456' };
// APD-34/F-11: nach dem Antippen von Gesamtausgaben (und jeder Eingabe dort) steht das Feld ganz über der Tastatur
const nachSchritt = async (p, s) => {
  if (!/^(tippen kosten|eingabe )/.test(s.ereignis) || !await p.evaluate(() => document.activeElement?.id === 'kosten')) return [];
  const r = await p.evaluate(() => { const o = visualViewport.offsetTop, k = document.getElementById('kosten').getBoundingClientRect(), re = document.querySelector('#app > .rolle').getBoundingClientRect();
    return { oben: Math.round(k.top - o), unten: Math.round(k.bottom - o), rolle: Math.round(re.top - o), kb: Math.round(visualViewport.height) }; });
  // R-4.5: 16 px über der Tastatur; reicht der Platz nicht (Suchzeile offen), ganz sichtbar direkt unter der Suchzeile
  const eng = r.unten - r.oben > r.kb - 16 - r.rolle;
  return (eng ? r.unten > r.kb || Math.abs(r.oben - r.rolle) > 1 : r.unten > r.kb - 16 + 1)
    ? [`APD-34/F-11 Gesamtausgaben nicht ganz über der Tastatur (${r.oben}–${r.unten} px, Inhalt ab ${r.rolle} px, Tastatur ab ${r.kb} px), R-4.5`] : [];
};
// RLB-103 (AppDesign APD-77/F-12 bis APD-77/F-14): spieleAb erkennt das Beenden der Messung im Mehr-Menü – nur am Ende, mit der Marke
// ‚! messung beendet‘ genau dort
{ const kopf = '# Messung · Reiselogbuch 3.36.0 · AppDesign 4.38.0 · iPhone · Home-Bildschirm · 402×874 @3 · hell · 2026-10-26T00:00:00.000Z · Kontrast normal · Bewegung normal · Text l 17\n'
    + 't      sy     inh    sh     ih     vh     vt     vvtop  kopf   such   tag    lkopf  lsuch  lroll  fokus  lage\n';
  const zeile = (t, e) => `${t} 0 - 402 402 402 0 0 0 - - - - - - quer${e ? '   ! ' + e : ''}`;
  const datei = (...e) => lies(kopf + [zeile(1, 'start'), ...e.map((x, i) => zeile(1000 * (i + 1), x))].join('\n') + '\n# Ende nach 9 s\n');
  const nach = (...e) => schritte(datei(...e)).map(s => s.ereignis).join(' · ') || '–';
  t.ist('APD-77/F-12 Ende der Messung (tippen sideMore, tippen button) wird nicht nachgespielt', nach('tippen back', 'tippen sideMore', 'tippen button'), 'tippen back', 'RLB-103');
  t.ist('APD-77/F-13 Menü mitten in der Messung wird nachgespielt', nach('tippen sideMore', 'tippen button', 'tippen back', 'tippen sideMore', 'tippen button'), 'tippen sideMore · tippen button · tippen back', 'RLB-103');
  t.ist('APD-77/F-14 Ende mit ‚! messung beendet‘', nach('tippen back', 'tippen sideMore', 'tippen button', 'messung beendet', 'tippen back'), 'tippen back', 'RLB-103');
  t.ist('APD-77/F-14 Marke ohne Menü davor', nach('tippen back', 'messung beendet', 'tippen dlgX'), 'tippen back', 'RLB-103');
  t.ist('RLB-103 ‚klick unterdrückt … (Feld fPlace)‘ zählt wie ‚tippen fPlace‘', nach('neu fokussiert fPlace', 'klick unterdrückt div (Feld fPlace)'), 'tippen fPlace', 'RLB-103'); }
const b = await t.browser();
const dateien = readdirSync(ORDNER).filter(f => f.endsWith('.txt')).sort();
for (const datei of dateien) {
  const m = lies(readFileSync(new URL(encodeURIComponent(datei), ORDNER), 'utf8'));
  if (!m.app.startsWith('Reiselogbuch')) continue;
  // Seit 3.28.0: Messungen ohne Kopf- und Suchzeile (z. B. ‚Ränder‘ aus P-63/9 – nur Startliste und Menü, für die sicheren Ränder)
  // haben nichts nachzuspielen; ihr Schritt ‚button‘ ist ‚Messung beenden‘ im Menü, nicht eine Kachel
  if (!m.zeilen.some(z => z.kopf != null || z.such != null) || EINSTELLUNG[datei]?.aus) continue;
  for (const gegenprobe of [false, true]) {
    const p = await t.seite(b, ansicht(m));
    t.ort = `${datei.replace(/\.txt$/, '')}${gegenprobe ? ' (Gegenprobe APD-34/M-5)' : ''}`;
    await p.goto(APP);
    await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
    await p.reload(); await p.waitForTimeout(400);
    await safariModell(p, m.lage === 'quer' ? 'iPhone quer' : 'iPhone hoch');
    const { bis = Infinity, aufbau = {} } = EINSTELLUNG[datei] || {};
    if (gegenprobe) {   // APD-34/M-5: Suchzeile (ohne Suche in der Messung: Kopfzeile) 20 px verschoben – das Nachspielen muss das finden
      const k = m.zeilen.some(z => z.such != null) ? 'such' : 'kopf';
      const f = await spieleAb(p, m, { ziele: ziele(datei), woerter, bis: Math.min(bis ?? Infinity, 30000), verschiebe: { ...aufbau, [k]: (aufbau[k] ?? 0) + 20 } });
      t.wahr('APD-31/M-5 Gegenprobe: eine um 20 px verschobene Messung bleibt beim Nachspielen grün', f.some(x => x.includes(k === 'such' ? 'Suchzeile' : 'Kopfzeile')), 'APD-31');
    } else {
      t.liste(await spieleAb(p, m, { ziele: ziele(datei), woerter, bis, verschiebe: aufbau, nachSchritt: s => nachSchritt(p, s), where: t.ort }));
      await t.schritt(p, 'nach dem Nachspielen', async () => {});
    }
    await p.close();
  }
}
t.wahr('APD-31/M-6 keine Messdatei des Reiselogbuchs gefunden', dateien.length > 0, 'APD-31');
await t.ende(b);
