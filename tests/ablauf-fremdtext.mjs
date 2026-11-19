// Reiselogbuch-Test: ablauf-fremdtext (seit 3.56.3) – AppDesign APD-54 ‚Fremden Text bereinigen‘ (Befund und Testfall-Liste AppDesign
// arbeit/APD-54 Befund und Testfall-Liste.md, APD-54/T-1 bis APD-54/T-10): Text aus den Daten wird wörtlich gezeigt, nie als HTML.
// APD-54/T-1 bis APD-54/T-3 Smiley-Leiste und Sprechblase ‚… aus der Schnellauswahl entfernen?‘ mit einem fremden Schlüssel (ohne normalize gesetzt),
// APD-54/T-4 bis APD-54/T-7 normalize nimmt aus moodUsage, foodUsage, hiddenMoods, hiddenFood nur Schlüssel, die genau ein Emoji sind (Backup laden,
// Abgleich; zusammengesetzte Smileys bleiben), APD-54/T-8 Sprechblase ‚… löschen?‘ mit fremdem Titel, APD-54/T-10 fremder Text in jedem Textfeld und
// jeder Ansicht (Liste, Reiselogbuch, Tag, Einstellen, Fazit, Suche, Vorschau). iPad quer und iPhone hoch. Gegenprobe APD-54/T-9: gegen 3.56.2
// mit PRUEF_APP=../_alt.html werden APD-54/T-1, APD-54/T-2 und APD-54/T-4 rot. Aufruf im Repo-Ordner: node tests/ablauf-fremdtext.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.65.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.65.0/tests/hig.mjs';
import { langDruecken } from '../../AppDesign/fassung/4.65.0/tests/ablauf.mjs';
const t = pruefung('ablauf-fremdtext', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const iso = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
// Fremder Text: schließt ein Attribut und ein Element und bringt ein eigenes Element mit – entsteht irgendwo ein .fremd, ist er HTML geworden
const FREMD = `"><i class="fremd">x</i>'`, KURZ = '<i class="fremd">x</i>';
const tag = () => ({ weather: '☀️', program: `Programm ${FREMD}`, place: `Ort ${FREMD}`, comment: `🙂 ${FREMD}`, food: `🍷 ${FREMD}`, quarter: `Quartier ${FREMD}`, price: '12', km: '3' });
const TRIPS = [{ id: 'a', title: `Reise ${FREMD}`, participants: `G & ${FREMD}`, start: iso(2026, 8, 24), end: iso(2026, 8, 27), transport: ['flug'], fazit: `Fazit ${FREMD}`,
  days: { [iso(2026, 8, 24)]: tag(), [iso(2026, 8, 25)]: tag() } },
  { id: 'b', title: 'Toskana', participants: 'G', start: iso(2027, 6, 3), end: iso(2027, 6, 5), transport: ['pkw'], days: {} }];
const lade = async p => {
  await p.clock.setFixedTime(new Date('2026-11-02T10:00:00'));
  await p.goto(APP);
  await p.evaluate(x => { localStorage.clear(); localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })); }, TRIPS);
  await p.reload(); await p.waitForTimeout(500); await navFertig(p);
};
// Zahl der Elemente .fremd in der Seite und in allen Rahmen (Vorschau)
const fremd = async p => { let n = 0; for (const f of p.frames()) n += await f.evaluate(() => document.querySelectorAll('.fremd').length).catch(() => 0); return n; };
const zu = async p => { for (let i = 0; i < 3; i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(150); }
  await p.evaluate(() => { if (dlg.open) dlg.close(); document.querySelectorAll('dialog[open]').forEach(d => d.close()); }); await p.waitForTimeout(300); await navFertig(p); };

const b = await t.browser();
for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  const phone = ansicht.startsWith('iPhone');
  try {
    await lade(p);
    // APD-54/T-10: jede Ansicht mit fremdem Text in jedem Textfeld
    t.ist(`APD-54/T-10 ${phone ? 'Startliste' : 'Seitenleiste'}: kein Element aus den Daten`, await fremd(p), 0);
    t.wahr('APD-54/T-10 Liste zeigt den Titel wörtlich', await p.evaluate(k => document.querySelector('#side, #app').textContent.includes(k) || document.body.textContent.includes(k), KURZ));
    await t.schritt(p, 'APD-54/T-10 Reiselogbuch öffnen', async () => { await p.evaluate(() => showTrip('a')); await p.waitForTimeout(600); await navFertig(p); });
    t.ist('APD-54/T-10 Reiselogbuch (Kopf, Tage, Fazit, Quartierliste): kein Element aus den Daten', await fremd(p), 0);
    t.wahr('APD-54/T-10 Reiselogbuch zeigt den Text wörtlich', await p.evaluate(k => document.querySelector('#app').textContent.split(k).length > 4, KURZ));
    await t.schritt(p, 'APD-54/T-10 Suche im Reiselogbuch', async () => { await p.evaluate(() => showTrip('a', 'fremd')); await p.waitForTimeout(600); await navFertig(p); });
    t.ist('APD-54/T-10 Suche mit Treffern im fremden Text: kein Element aus den Daten', await fremd(p), 0);
    await p.evaluate(() => showTrip('a')); await p.waitForTimeout(500); await navFertig(p);
    for (const [name, auf] of [['Tageserfassung', () => openDayDialog(db.trips.find(x => x.id === 'a'), Object.keys(db.trips.find(x => x.id === 'a').days)[0])],
      ['Reiselogbuch einstellen', () => openTripDialog(db.trips.find(x => x.id === 'a'))], ['Fazit', () => openFazitDialog(db.trips.find(x => x.id === 'a'))],
      ['Vorschau', () => openPreview(db.trips.find(x => x.id === 'a'))]]) {
      await t.schritt(p, `APD-54/T-10 ${name}`, async () => { await p.evaluate(`(${auf})()`); await p.waitForTimeout(700); });
      t.ist(`APD-54/T-10 ${name}: kein Element aus den Daten`, await fremd(p), 0);
      await zu(p);
    }
    // APD-54/T-8: Sprechblase ‚… mit allen Einträgen löschen?‘ mit fremdem Titel
    await t.schritt(p, 'APD-54/T-8 Reiselogbuch löschen fragt', async () => { await p.evaluate(() => { deleteTrip(db.trips.find(x => x.id === 'a')); }); await p.waitForTimeout(400); });
    t.ist('APD-54/T-8 Sprechblase: kein Element aus den Daten', await fremd(p), 0);
    t.wahr('APD-54/T-8 Sprechblase zeigt den Titel wörtlich', await p.evaluate(k => !!document.querySelector('.pop')?.textContent.includes(k), KURZ));
    await zu(p);

    // APD-54/T-1 bis APD-54/T-3: fremder Schlüssel in der Schnellauswahl, ohne normalize gesetzt
    await p.evaluate(([k, q]) => { db.moodUsage[k] = 3; db.moodUsage[q] = 2; db.moodUsage['🙂'] = 2; }, [KURZ, FREMD]);
    await t.schritt(p, 'APD-54/T-1 Tageserfassung mit fremdem Schlüssel', async () => { await p.evaluate(() => openDayDialog(db.trips.find(x => x.id === 'a'), Object.keys(db.trips.find(x => x.id === 'a').days)[0])); await p.waitForTimeout(700); });
    t.ist('APD-54/T-1 Smiley-Leiste: kein Element aus den Daten', await fremd(p), 0);
    const knopf = await p.evaluate(([k, q]) => { const bs = [...document.querySelectorAll('#moods [data-m]')];
      const a = bs.find(x => x.dataset.m === k), c = bs.find(x => x.dataset.m === q);
      return { wort: a ? a.textContent : null, quote: c ? c.textContent : null, attr: c ? c.attributes.length : -1 }; }, [KURZ, FREMD]);
    t.ist('APD-54/T-1 der fremde Schlüssel steht wörtlich in der Leiste', knopf.wort, KURZ);
    t.ist('APD-54/T-3 Schlüssel mit Anführungszeichen ganz in data-m und im Text', knopf.quote, FREMD);
    t.ist('APD-54/T-3 kein zusätzliches Attribut an der Schaltfläche (type, data-m)', knopf.attr <= 3 && knopf.attr >= 2, true);
    // APD-54/T-2 mit nur einem fremden Eintrag: der lange Text des zweiten ragt in der 48 px breiten Schaltfläche über den Nachbarn
    await zu(p); await p.evaluate(q => { delete db.moodUsage[q]; }, FREMD);
    await t.schritt(p, 'APD-54/T-2 Tageserfassung neu öffnen', async () => { await p.evaluate(() => openDayDialog(db.trips.find(x => x.id === 'a'), Object.keys(db.trips.find(x => x.id === 'a').days)[0])); await p.waitForTimeout(700); });
    await t.schritt(p, 'APD-54/T-2 fremden Eintrag lange drücken', async () => {
      const i = await p.evaluate(k => [...document.querySelectorAll('#moods [data-m]')].findIndex(x => x.dataset.m === k), KURZ);
      const ziel = p.locator('#moods [data-m]').nth(i); await ziel.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
      const m = await langDruecken(p, ziel, { ms: 1200, offen: '.pop', mitte: true }); if (m) throw new Error(m); });
    t.ist('APD-54/T-2 Sprechblase: kein Element aus den Daten', await fremd(p), 0);
    t.ist('APD-54/T-2 Sprechblase zeigt den Schlüssel wörtlich', await p.evaluate(() => document.querySelector('.pop p')?.textContent ?? null), `${KURZ} aus der Schnellauswahl entfernen?`);
    await zu(p);

    // APD-54/T-4 bis APD-54/T-7: normalize (läuft bei Backup laden und nach dem Abgleich) nimmt nur Schlüssel, die genau ein Emoji sind
    const n = await p.evaluate(([k, q]) => {
      const roh = { trips: [], moodUsage: { [k]: 5, [q]: 1, '<img src=x onerror=alert(1)>': 5, 'abc': 2, '🙂': 2, '🚶🏽‍♂️': 4, '☹️': 3, '☹': 1, '🙂🙂': 9, '🤷🏻‍♂️': 1 },
        foodUsage: { [k]: 1, '🍷': 7, 'Wein': 2 }, hiddenMoods: [k, '😉', 'x'], hiddenFood: [q, '☕️'] };
      const d = normalize(JSON.parse(JSON.stringify(roh)));
      // Abgleich: die Datei des anderen Geräts bringt einen fremden Schlüssel mit – nach mergeData läuft normalize über das Ergebnis
      const hier = normalize({ trips: [], moodUsage: { '🙂': 1 } }), dort = { trips: [], moodUsage: { [k]: 4, '😉': 2 }, foodUsage: {}, hiddenMoods: [k], hiddenFood: [], deleted: [], settings: {} };
      let ab = null; try { ab = normalize(mergeData(hier, dort).data); } catch (e) { ab = { fehler: e.message }; }
      return { mood: d.moodUsage, food: d.foodUsage, hm: d.hiddenMoods, hf: d.hiddenFood, ab: ab.fehler ? ab : { mood: Object.keys(ab.moodUsage), hm: ab.hiddenMoods } }; }, [KURZ, FREMD]);
    t.ist('APD-54/T-4 moodUsage: fremde Schlüssel weg, Emojis mit Zählern bleiben', JSON.stringify(n.mood), JSON.stringify({ '🙂': 2, '🚶🏽‍♂️': 4, '☹️': 3, '☹': 1, '🤷🏻‍♂️': 1 }));
    t.ist('APD-54/T-5 foodUsage', JSON.stringify(n.food), JSON.stringify({ '🍷': 7 }));
    t.ist('APD-54/T-5 hiddenMoods und hiddenFood', JSON.stringify([n.hm, n.hf]), JSON.stringify([['😉'], ['☕️']]));
    t.wahr(`APD-54/T-6 nach dem Abgleich kein fremder Schlüssel (${JSON.stringify(n.ab)})`, !n.ab.fehler && !n.ab.mood.includes(KURZ) && !n.ab.hm.includes(KURZ) && n.ab.mood.includes('🙂'));
    t.wahr('APD-54/T-7 zusammengesetzte Smileys bleiben (🚶🏽‍♂️, ☹️ mit und ohne Variantenzeichen, 🤷🏻‍♂️)', n.mood['🚶🏽‍♂️'] === 4 && n.mood['☹️'] === 3 && n.mood['☹'] === 1 && n.mood['🤷🏻‍♂️'] === 1);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
