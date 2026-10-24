// Reiselogbuch-Test: ablauf-suche-woerter (seit 3.23.0, T-93 / AppDesign A-21 und A-22, R-2.3; Fall-Liste AppDesign
// arbeit/A-21 A-22 Fall-Liste.md S1–S19, L1–L9) – Suche mit mehreren Wörtern und „…“: ein Reiselogbuch passt, wenn jedes Wort
// irgendwo darin vorkommt (Entscheidung des Nutzers: Einheit = Reiselogbuch); gezeigt werden die Tage mit mindestens einem
// Wort, markiert und gezählt werden alle Wörter. Dazu die Bausteine (checkSearchWords), Pfeile ohne Umlauf (checkSearch),
// zentrale Liste 1:1 (checkListSearch) und die Lupe am Ende der Kapsel (checkSearchPlace). iPad quer und hoch, iPhone hoch
// und quer, hell und dunkel. Seit 3.27.0 ohne Akzente (AppDesign A-63 C2). Aufruf im Repo-Ordner: node tests/ablauf-suche-woerter.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.32.2/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.32.2/tests/hig.mjs';
import { checkSearch, checkListSearch, checkSearchWords, checkSearchPlace } from '../../AppDesign/fassung/4.32.2/tests/ablauf.mjs';
const t = pruefung('ablauf-suche-woerter', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const trip = (id, start, list) => ({ id, title: id, participants: 'G & A', start, end: new Date(Date.parse(start) + (list.length - 1) * 864e5).toISOString().slice(0, 10),
  transport: ['flug'], foodColumn: true, moodColumn: false, quarterColumn: false,
  days: Object.fromEntries(list.map(([program, food], i) => [new Date(Date.parse(start) + i * 864e5).toISOString().slice(0, 10), { weather: '☀️', program, food }])) });
const TRIPS = [
  trip('Australien', '2026-08-24', [['Ankunft Sydney\nRundgang durch den Hafen', '😋 Pizza am Hafen'], ['Freetour Sydney\nBesichtigung Opera House', '👍 Fish & Chips'],
    ['Weiterfahrt nach Melbourne', '🍕 Pizza'], ['Oper: Aida in Melbourne', '🍷 Weinbar'], ['Strand', '☕️ Kaffee']]),
  trip('Italien', '2025-05-03', [['Rundgang durch Rom', '🍕 Pizza'], ['Besichtigung Opera di Roma', '🍝 Pasta']]),
  trip('Japan', '2024-04-06', [['Tour durch Kyoto', '🍣 Sushi']]),
  // seit 3.27.0 (AppDesign A-63 C2, A-1/A-3/A-5): Suche ohne Akzente
  trip('Schweiz', '2022-06-01', [['Ankunft in Zürich', '☕️ Café Crème']]),
  // lang genug zum Rollen: der Treffer muss unter die Suchzeile rücken können (S11, checkSearch)
  trip('Lang', '2023-01-01', Array.from({ length: 30 }, (_, i) => [i % 2 ? 'Opera ' + i : 'Sydney ' + i, '☕️ Kaffee'])),
];
const b = await t.browser();
for (const [ansicht, theme] of [['iPad quer', 'light'], ['iPad hoch', 'dark'], ['iPhone hoch', 'light'], ['iPhone quer', 'dark']]) {
  const p = await t.seite(b, ansicht, { theme });
  const where = `${ansicht} ${theme === 'dark' ? 'dunkel' : 'hell'}`; t.ort = where;
  p.on('pageerror', e => t.fehler('', `${where}: Skriptfehler ${e.message}`));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'Australien' }, trips: x })), TRIPS);
  await p.reload(); await p.waitForTimeout(400);
  const phone = await p.evaluate(() => document.documentElement.classList.contains('phone'));
  const toList = async () => {
    if (phone) { if (!await p.locator('#side.page').isVisible()) await p.click('#back'); }
    else if (!await p.locator('#side .side-row').first().isVisible()) await p.locator('[data-side-toggle]').filter({ visible: true }).first().click();
    await p.waitForTimeout(350);
  };
  const open = async id => { await toList(); await p.locator(`#side .side-row[data-id="${id}"]`).click(); await p.waitForTimeout(450); };
  // L1/L3: Lupe am Ende der Kapsel – in der Liste und im Eintrag
  await toList();
  t.liste(await checkSearchPlace(p, { where: `${where} Liste` }));
  t.liste(await checkSearchWords(p, { where }));
  await open('Australien');
  t.liste(await checkSearchPlace(p, { where: `${where} Eintrag` }));
  const item = phone ? '#pdays [data-day]' : 'table.days tbody [data-day]';
  const suche = async term => {
    if (!await p.locator('#search').isVisible()) { await p.click('#searchBtn'); await p.waitForTimeout(200); }
    await p.locator('#search').fill(''); await p.locator('#search').pressSequentially(term, { delay: 10 }); await p.waitForTimeout(900);
    return p.evaluate(item => ({ n: document.querySelector('#scount')?.textContent.trim() || '',
      days: [...document.querySelectorAll(item)].filter(e => e.getClientRects().length).map(e => e.dataset.day.slice(8)),
      marks: [...document.querySelectorAll(`${item} mark`)].map(m => m.textContent.replace(/​/g, '')) }), item);
  };
  // Tage: 24 Sydney/Hafen/Pizza · 25 Sydney/Opera House · 26 Melbourne/Pizza · 27 Oper Aida Melbourne · 28 Strand
  const F = [
    ['S1 ein Wort', 'sydney', { n: '1 von 2', days: ['24', '25'] }],
    ['S2 zwei Wörter', 'sydney opera', { n: '1 von 3', days: ['24', '25'] }],
    ['S3 umgekehrt', 'opera sydney', { n: '1 von 3', days: ['24', '25'] }],
    ['S4 verschiedene Felder', 'melbourne pizza', { n: '1 von 4', days: ['24', '26', '27'] }],
    ['B an verschiedenen Tagen', 'hafen aida', { n: '1 von 3', days: ['24', '27'] }],
    ['S6 ein Wort fehlt im Reiselogbuch', 'kyoto sydney', { n: '0', days: [] }],
    ['S7 Leerzeichen am Rand und doppelt', '  sydney   ', { n: '1 von 2', days: ['24', '25'] }],
    ['S9 doppeltes Wort', 'sydney Sydney', { n: '1 von 2', days: ['24', '25'] }],
    ['S10 Überlappung', 'oper opera', { n: '1 von 2', days: ['25', '27'] }],
    ['S14 genaue Folge', '„opera house“ sydney', { n: '1 von 3', days: ['24', '25'] }],
    ['S14 Folge nicht vorhanden', '„house opera“', { n: '0', days: [] }],
    ['S15 einzelnes Anführungszeichen', '„opera', { n: '1 von 1', days: ['25'] }],
  ];
  for (const [fall, term, soll] of F) {
    const r = await suche(term);
    t.ist(`${fall} (‚${term}‘)`, { n: r.n, days: r.days }, soll, 'R-2.3');
    if (r.marks.length !== (+(r.n.match(/von (\d+)/)?.[1] || 0))) t.fehler('R-2.3', `${fall}: ${r.marks.length} Markierungen, Anzeige ‚${r.n}‘`);
  }
  const fo = await suche('„opera house“');
  t.ist('S14 Markierung der Folge', fo.marks, ['Opera House'], 'R-2.3');
  await t.schritt(p, 'Suche mit zwei Wörtern', async () => { await suche('sydney opera'); });
  await p.click('#searchBtn'); await p.waitForTimeout(200);
  await open('Lang');
  // S11: ‚1 von N‘ und Pfeile ohne Umlauf durch alle Markierungen beider Wörter (allgemeine Prüfung)
  t.liste(await checkSearch(p, { term: 'opera sydney', item, where }));
  // S12/S13: zentrale Liste – nur Reiselogbücher mit allen Wörtern, ‚N Treffer‘ = ‚1 von N‘, beide Felder 1:1
  await toList();
  const back = phone ? () => p.click('#back') : ansicht === 'iPad hoch' ? () => p.locator('[data-side-toggle]').first().click() : null;
  for (const e of await checkListSearch(p, { term: 'pizza rundgang', where, back })) t.fehler('R-2.3', e);
  await toList();
  if (!await p.locator('#lsearch').isVisible()) { await p.click('#listSearchBtn'); await p.waitForTimeout(200); }
  const liste = async term => { await p.locator('#lsearch').fill(''); await p.locator('#lsearch').pressSequentially(term, { delay: 10 }); await p.waitForTimeout(400);
    return p.evaluate(() => Object.fromEntries([...document.querySelectorAll('#side .side-row')].filter(r => r.getClientRects().length).map(r => [r.dataset.id, r.querySelector('small.hits')?.textContent.trim()]))); };
  t.ist('S12 Liste ‚pizza rundgang‘', await liste('pizza rundgang'), { Australien: '3 Treffer', Italien: '2 Treffer' }, 'R-2.3');
  t.ist('B Liste ‚hafen aida‘', await liste('hafen aida'), { Australien: '3 Treffer' }, 'R-2.3');
  t.ist('S6 Liste ‚kyoto sydney‘ (verschiedene Reiselogbücher)', await liste('kyoto sydney'), {}, 'R-2.3');
  t.wahr('S6 Liste zeigt ‚Keine Treffer‘', /Keine Treffer/.test(await p.locator('#side').textContent()), 'R-2.3');
  t.ist('S14 Liste ‚„opera di“‘', await liste('„opera di“'), { Italien: '1 Treffer' }, 'R-2.3');
  // A-63 C2 (seit 3.27.0): ohne Akzente – ‚Zurich‘ findet ‚Zürich‘, ‚cafe creme‘ findet ‚Café Crème‘ (Liste und Reiselogbuch)
  t.ist('A-5 Liste ‚zurich‘', await liste('zurich'), { Schweiz: '1 Treffer' }, 'R-2.3');
  t.ist('A-5 Liste ‚cafe creme‘', await liste('cafe creme'), { Schweiz: '2 Treffer' }, 'R-2.3');
  await t.schritt(p, 'Liste mit zwei Wörtern', async () => { await liste('pizza rundgang'); });
  await liste('zurich'); await open('Schweiz');
  const z = await suche('zurich');
  t.ist('A-1 ‚zurich‘ im Reiselogbuch', { n: z.n, marks: z.marks }, { n: '1 von 1', marks: ['Zürich'] }, 'R-2.3');
  const c = await suche('cafe creme');
  t.ist('A-3 ‚cafe creme‘ im Reiselogbuch', { n: c.n, marks: c.marks }, { n: '1 von 2', marks: ['Café', 'Crème'] }, 'R-2.3');
  await p.close();
}
await t.ende(b);
