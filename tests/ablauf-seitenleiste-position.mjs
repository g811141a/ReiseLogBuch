// Ablauf-Test: Seitenleiste (iPad) bzw. Startliste (iPhone) behält ihre Position, der gewählte Eintrag bleibt sichtbar
// (P-21/2); auf dem iPhone schließt Wischen bei offener Suche die Tastatur (P-21/1, R-05).
// Aufruf im Repo-Ordner: node tests/ablauf-seitenleiste-position.mjs
import { chromium } from 'playwright';

const APP = new URL('../index.html', import.meta.url).href;
const trips = Array.from({ length: 14 }, (_, i) => ({ id: 't' + i, title: 'Reise ' + (i + 1), participants: 'A', start: `${2026 - i}-06-01`, end: `${2026 - i}-06-10`, transport: ['pkw'], days: { [`${2026 - i}-06-02`]: { program: 'Stadt ' + i } } }));
const errors = [];
const check = (ok, text) => { if (!ok) errors.push(text); };
const b = await chromium.launch();
// Sichtbar = ganz innerhalb der Liste und über der Backup-Kachel
const visible = p => p.evaluate(() => {
  const list = document.querySelector('#side .side-list'), cur = list?.querySelector('.side-row.current');
  if (!cur) return false;
  const lr = list.getBoundingClientRect(), r = cur.getBoundingClientRect(), t = document.querySelector('#side .bhint').getBoundingClientRect();
  return r.top >= lr.top - 1 && r.bottom <= Math.min(lr.bottom, t.top) + 1;
});
for (const [w, h, dev] of [[1180, 820, 'iPad quer'], [820, 1180, 'iPad hoch'], [393, 852, 'iPhone']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 });
  p.on('pageerror', e => errors.push(`${dev}: ${e.message}`));
  await p.clock.setFixedTime(new Date('2026-06-05T10:00:00'));
  await p.goto(APP);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  if (w < 700) { await p.click('#back'); await p.waitForTimeout(250); }
  if (dev === 'iPad hoch' && await p.locator('#side').isHidden()) { await p.click('#sideShow, [aria-label="Seitenleiste einblenden"]'); await p.waitForTimeout(250); }
  // Ganz nach unten wischen und den untersten Eintrag wählen
  await p.locator('#side .side-list').evaluate(l => { l.scrollTop = l.scrollHeight; });
  await p.waitForTimeout(150);
  await p.locator('#side .side-row', { hasText: 'Reise 14' }).click(); await p.waitForTimeout(350);
  if (w < 700) { await p.click('#back'); await p.waitForTimeout(250); }
  if (dev === 'iPad hoch') { await p.click('#sideShow, [aria-label="Seitenleiste einblenden"]'); await p.waitForTimeout(250); }
  check(await p.locator('#side .side-row.current').textContent().then(t => t.includes('Reise 14')), `${dev}: gewählter Eintrag nicht blau`);
  check(await visible(p), `${dev}: gewählter Eintrag nach dem Öffnen nicht mehr sichtbar (Liste nach oben gesprungen)`);
  await p.close();
}
// iPhone: Suche offen, Inhalt wischen → Tastatur schließt (Suchfeld verliert den Fokus), Leiste bleibt stehen
{
  const p = await b.newPage({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true });
  await p.clock.setFixedTime(new Date('2026-06-05T10:00:00'));
  await p.goto(APP);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  await p.click('#searchBtn'); await p.waitForTimeout(150); await p.fill('#search', 'Stadt'); await p.waitForTimeout(300);
  check(await p.evaluate(() => document.activeElement?.id === 'search'), 'iPhone: Suchfeld hat keinen Fokus');
  const top0 = await p.locator('.pnav').evaluate(e => e.getBoundingClientRect().top);
  await p.evaluate(() => { const t = document.querySelector('#pdays') || document.getElementById('app'); const touch = new Touch({ identifier: 1, target: t, clientX: 200, clientY: 500 });
    t.dispatchEvent(new TouchEvent('touchmove', { bubbles: true, touches: [touch], changedTouches: [touch] })); });
  await p.waitForTimeout(100);
  check(await p.evaluate(() => document.activeElement?.id !== 'search'), 'iPhone: Wischen bei offener Suche schließt die Tastatur nicht');
  check(await p.locator('.pnav').evaluate(e => e.getBoundingClientRect().top) === top0, 'iPhone: Leiste bewegt sich');
  await p.close();
}
console.log('ERR', JSON.stringify(errors));
await b.close();
