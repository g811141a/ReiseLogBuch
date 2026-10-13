// Allgemeine Prüfung der Kontextmenüs (AppDesign/tests/kontextmenue.mjs, R-40) – verschiedene Listenlängen, iPad und iPhone.
// Aufruf im Repo-Ordner: node tests/kontextmenue-regeln.mjs
import { chromium } from 'playwright';
import { checkContextMenus } from '../../AppDesign/tests/kontextmenue.mjs';
const b = await chromium.launch();
const errors = [];
for (const [w, h, dev] of [[393, 852, 'iPhone hoch'], [852, 393, 'iPhone quer'], [1180, 820, 'iPad quer'], [820, 1180, 'iPad hoch']]) for (const n of [3, 6, 8, 9, 12]) {
  const trips = Array.from({ length: n }, (_, i) => ({ id: 't' + i, title: 'Reise ' + (i + 1), participants: 'A', start: `${2026 - i}-06-01`, end: `${2026 - i}-06-10`, transport: ['pkw'], days: {} }));
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 || h < 500 });
  p.on('pageerror', e => errors.push(`${dev}: ${e.message}`));
  await p.clock.setFixedTime(new Date('2026-06-05T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  if (w < 700 || h < 500) { await p.click('#back'); await p.waitForTimeout(250); }
  else if (await p.locator('#side').isHidden()) { await p.click('[data-side-toggle]'); await p.waitForTimeout(250); }
  errors.push(...await checkContextMenus(p, `${dev}, ${n} Einträge`));
  await p.close();
}
console.log('ERR', JSON.stringify(errors, null, 1));
await b.close();
