// Reiselogbuch-Test: link-name – T-86 (seit 3.18.0, Fall-Liste AppDesign arbeit/T-86 Fall-Liste.md): nur der Name ist der
// Maps-Link; er endet am ersten ‚ – ‘, Komma, Doppelpunkt oder an einer öffnenden Klammer (nicht vor einer Ziffer) – Essen und
// Quartier, in Tabelle (iPad), Tageskästen (iPhone) und Vorschau. Aufruf im Repo-Ordner: node tests/link-name.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.30.2/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.30.2/tests/hig.mjs';
const t = pruefung('link-name', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.dlg-body.preview a'] }), out: new URL('out/', import.meta.url) });
// [Zeile, Link (null = kein Link), Fall]
const ESSEN = [['😋 Krone – sehr gut', 'Krone', 'L1'], ['😋 Linde, sehr gut', 'Linde', 'L2'], ['😋 Adler: Schnitzel', 'Adler', 'L3'],
  ['😋 Hirsch (Terrasse) – gut', 'Hirsch', 'L4'], ['😋 Sonne(Terrasse)', 'Sonne', 'L5'], ['😋 Gasthof Müller-Bräu', 'Gasthof Müller-Bräu', 'L6'],
  ['😋 St. Peter Stiftskeller', 'St. Peter Stiftskeller', 'L7'], ['😋 Mondschein', 'Mondschein', 'L8'], ['⊘ Stern, gut', null, 'L9'],
  ['😋 Café Central 8:30 – Frühstück', 'Café Central 8:30', 'L16'], ['🍺 Bier 4,50 €, gut', 'Bier 4,50 €', 'L16']];
const QUARTIER = [['Hotel Rocks (Zimmer 12)', 'Hotel Rocks', 'L15'], ['Hotel Bay: Altstadt', 'Hotel Bay', 'L15']];
const days = { '2026-08-24': { weather: '☀️', program: 'Ankunft', food: ESSEN.map(x => x[0]).join('\n'), quarter: QUARTIER[0][0], place: 'Sydney' },
  '2026-08-25': { weather: '☀️', program: 'Stadt', quarter: QUARTIER[1][0], place: 'Sydney' } };
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-08-26', transport: ['flug'], foodColumn: true, quarterColumn: true, days }];
const soll = [...ESSEN, QUARTIER[0], QUARTIER[1]].filter(x => x[1]);
const links = (p, sel) => p.evaluate(sel => [...document.querySelectorAll(sel)].map(a => a.textContent.trim()), sel);
const b = await t.browser();
for (const [ansicht, sel] of [['iPad quer', 'table.days tbody [data-day] a'], ['iPhone hoch', '#pdays [data-day] a']]) {
  const p = await t.seite(b, ansicht);
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(300);
  if (await p.locator('#side.page').isVisible()) { await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(300); }
  await t.schritt(p, 'Reiselogbuch', async () => {});
  const ist = await links(p, sel);
  soll.forEach(([zeile, link, fall], i) => t.ist(`${fall} ${ansicht}: Link in ‚${zeile}‘`, ist[i], link, 'T-86'));
  t.ist(`L9 ${ansicht}: Anzahl Links`, ist.length, soll.length, 'T-86');
  // Rest bleibt normaler Text: ganze Zeile steht weiter da.
  const text = await p.evaluate(sel => [...document.querySelectorAll(sel.replace(/ a$/, ''))].map(e => e.textContent).join(' '), sel);
  for (const [zeile, , fall] of [...ESSEN, ...QUARTIER]) t.wahr(`${fall} ${ansicht}: Text ‚${zeile}‘ unvollständig`, text.includes(zeile.replace(/^[^\p{L}]+/u, '')), 'T-86');
  // L11: Suche findet Name (Link) und Rest (normaler Text)
  for (const wort of ['Linde', 'Schnitzel']) {
    await p.click('#searchBtn'); await p.waitForTimeout(150); await p.locator('#search').fill(wort); await p.waitForTimeout(900);
    t.wahr(`L11 ${ansicht}: ‚${wort}‘ nicht markiert`, await p.evaluate(w => [...document.querySelectorAll('mark')].some(m => m.textContent === w), wort), 'T-86');
    await p.click('#searchBtn'); await p.waitForTimeout(200);
  }
  // Vorschau (Ausgabe HTML/PDF): dieselben Links
  await p.click('#shareBtn'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); await p.waitForTimeout(400);
  const aus = await links(p, '#dlg .preview table.grid a');
  t.ist(`L12 ${ansicht}: Links der Vorschau`, aus.join(' | '), soll.map(x => x[1]).join(' | '), 'T-86');
  await t.schritt(p, 'Vorschau', async () => {});
  await p.close();
}
await t.ende(b);
