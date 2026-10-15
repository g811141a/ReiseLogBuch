// Ablauf-Test: Seitenleiste (iPad) bzw. Startliste (iPhone) behält ihre Position, der gewählte Eintrag bleibt sichtbar
// (P-21/2); auf dem iPhone schließt das erste Wischen bei offener Suche nur die Tastatur, die Seite bleibt stehen (R-2.1).
// Aufruf im Repo-Ordner: node tests/ablauf-seitenleiste-position.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.15.1/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.15.1/tests/hig.mjs';
// Meldet Fehler mit Rückgabewert, Grundregeln nach den Schritten (seit 3.12.0, pruefe.mjs).
const t = pruefung('ablauf-seitenleiste-position', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.dlg-body.preview a'] }), out: new URL('out/', import.meta.url) });
const G = (p, name) => t.schritt(p, name, async () => {});   // Grundregeln im aktuellen Zustand

const APP = new URL('../index.html', import.meta.url).href;
const trips = Array.from({ length: 14 }, (_, i) => ({ id: 't' + i, title: 'Reise ' + (i + 1), participants: 'A', start: `${2026 - i}-06-01`, end: `${2026 - i}-06-10`, transport: ['pkw'], days: { [`${2026 - i}-06-02`]: { program: 'Stadt ' + i } } }));
const errors = { push: (...m) => m.forEach(x => t.fehler('', x)) };   // Meldungen werden Fehler (pruefe.mjs)
const check = (ok, text) => { if (!ok) errors.push(text); };
const b = await t.browser();
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
  t.ort = dev; await G(p, 'Reise 14 gewählt');
  await p.close();
}
// iPhone: Kontextmenü (lange drücken) linksbündig unter der Kachel, ganz sichtbar über der Backup-Kachel (R-8.1) –
// für die oberste und die unterste sichtbare Kachel; die Liste rückt dafür nötigenfalls nach oben.
{
  const p = await b.newPage({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true });
  await p.clock.setFixedTime(new Date('2026-06-05T10:00:00'));
  await p.goto(APP);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300); await p.click('#back'); await p.waitForTimeout(250);
  for (const which of ['oberste', 'unterste']) {
    const id = await p.evaluate(w => { const t = document.querySelector('#side .bhint').getBoundingClientRect().top, lt = document.querySelector('#side .side-list').getBoundingClientRect().top;
      const rows = [...document.querySelectorAll('#side .side-row')].filter(r => { const b = r.getBoundingClientRect(); return b.top >= lt - 1 && b.bottom <= t; });
      return (w === 'oberste' ? rows[0] : rows[rows.length - 1]).dataset.id; }, which);
    const row = p.locator(`#side .side-row[data-id="${id}"]`), rb = await row.boundingBox();
    await p.mouse.move(rb.x + 40, rb.y + 20); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(250);
    const g = await p.evaluate(id => { const r = document.querySelector(`#side .side-row[data-id="${id}"]`).getBoundingClientRect(), m = document.querySelector('.menu').getBoundingClientRect(),
      t = document.querySelector('#side .bhint').getBoundingClientRect(), l = document.querySelector('#side .side-list').getBoundingClientRect();
      return { below: m.top >= r.bottom - 1, left: Math.abs(m.left - r.left) < 2, aboveTile: m.bottom <= t.top + 1, rowVisible: r.top >= l.top - 1, inView: m.top >= 0 && m.bottom <= innerHeight }; }, id);
    check(g.below, `iPhone: Kontextmenü (${which} Kachel) nicht unter der Kachel`);
    check(g.left, `iPhone: Kontextmenü (${which} Kachel) nicht linksbündig`);
    check(g.aboveTile && g.inView, `iPhone: Kontextmenü (${which} Kachel) nicht ganz über der Backup-Kachel sichtbar`);
    check(g.rowVisible, `iPhone: Kachel (${which}) nach dem Verschieben nicht mehr sichtbar`);
    t.ort = 'iPhone hoch'; await G(p, `Kontextmenü ${which} Kachel`);
    if (which === 'unterste') await p.screenshot({ path: new URL('out/iphone-kontextmenue-unten.png', import.meta.url).pathname });
    await p.mouse.click(380, 840); await p.waitForTimeout(200);
  }
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
  const blocked = await p.evaluate(() => { const t = document.querySelector('#pdays') || document.getElementById('app'); // WebKit unter Linux kennt new Touch() nicht – dann ein touchmove-Ereignis ohne Touch-Liste (die App braucht nur das Ereignis).
    let ev; try { const touch = new Touch({ identifier: 1, target: t, clientX: 200, clientY: 500 }); ev = new TouchEvent('touchmove', { bubbles: true, cancelable: true, touches: [touch], changedTouches: [touch] }); }
    catch { ev = new Event('touchmove', { bubbles: true, cancelable: true }); }
    return !t.dispatchEvent(ev); });
  await p.waitForTimeout(100);
  check(blocked, 'iPhone: erstes Wischen bei offener Tastatur bewegt die Seite (R-2.1)');
  check(await p.evaluate(() => document.activeElement?.id !== 'search'), 'iPhone: Wischen bei offener Suche schließt die Tastatur nicht');
  check(await p.locator('.pnav').evaluate(e => e.getBoundingClientRect().top) === top0, 'iPhone: Leiste bewegt sich');
  await p.close();
}
await t.ende(b);
