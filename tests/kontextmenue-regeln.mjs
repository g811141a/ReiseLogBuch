// Allgemeine Prüfung der Kontextmenüs (AppDesign/tests/kontextmenue.mjs, R-4.2) – verschiedene Listenlängen, iPad und iPhone.
// Aufruf im Repo-Ordner: node tests/kontextmenue-regeln.mjs. Meldet Fehler mit Rückgabewert (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.28.2/tests/pruefe.mjs';
import { checkContextMenus } from '../../AppDesign/fassung/4.28.2/tests/kontextmenue.mjs';
const t = pruefung('kontextmenue-regeln', pw, { out: new URL('out/', import.meta.url) });
const b = await t.browser();
// Teilbar nach Gerät (Lauf-Werkzeug, Fall-Liste A-05 B-5): PRUEF_GERAET=iPad oder iPhone, ohne Angabe beide.
const geraet = process.env.PRUEF_GERAET || '';
for (const [w, h, dev] of [[393, 852, 'iPhone hoch'], [852, 393, 'iPhone quer'], [1180, 820, 'iPad quer'], [820, 1180, 'iPad hoch']]) for (const n of [3, 6, 8, 9, 12]) {
  if (geraet && !dev.startsWith(geraet)) continue;
  t.ort = `${dev}, ${n} Einträge`;
  const trips = Array.from({ length: n }, (_, i) => ({ id: 't' + i, title: 'Reise ' + (i + 1), participants: 'A', start: `${2026 - i}-06-01`, end: `${2026 - i}-06-10`, transport: ['pkw'], days: {} }));
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 || h < 500 });
  p.on('pageerror', e => t.fehler('', `Skriptfehler der Seite: ${e.message}`));
  await p.clock.setFixedTime(new Date('2026-06-05T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  // iPhone: Start in der Startliste (R-7.2, seit 3.15.0)
  if (!(w < 700 || h < 500) && (await p.locator('#side').isHidden())) { await p.click('[data-side-toggle]'); await p.waitForTimeout(250); }
  t.liste(await checkContextMenus(p, t.ort));
  await p.close();
}
await t.ende(b);
