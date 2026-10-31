// Reiselogbuch-Test: ablauf-einstellen (seit 3.44.0, RLB-113) – Testfall-Liste AppDesign arbeit/RLB-113 Testfall-Liste.md: der Menüpunkt heißt
// in beiden Menüs ‚Reiselogbuch einstellen‘ (Mehr-Menü #mainMore, Kontextmenü der Zeile in Seitenleiste bzw. Startliste), Icon settings,
// das Fenster ebenso; ‚Neues Reiselogbuch‘ bleibt (Abweichung 4 der App-Richtlinie). RLB-113/E-1 bis RLB-113/E-6; RLB-113/E-7 (Gegenprobe) = gegen 3.43.0
// mit PRUEF_APP=../_alt.html. Aufruf im Repo-Ordner: node tests/ablauf-einstellen.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.46.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.46.0/tests/hig.mjs';
const t = pruefung('ablauf-einstellen', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const NAME = 'Reiselogbuch einstellen';
const trips = [{ id: 'a', title: 'Australien', participants: 'G', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], days: {} },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} }];
const start = async p => {
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
};
const menue = p => p.evaluate(() => [...document.querySelectorAll('.menu:not(.submenu) .mi')].map(m => m.textContent.trim()));
// RLB-113/E-6: Titel zwischen x und Häkchen, ohne Überlappung; bei normaler Schrift ganz sichtbar. Befund 31.10.2026 (Sitzung 0064): ab der Textgröße
// XXXL (Leistenschrift 23 px) kürzt das iPhone hoch jeden längeren Fenstertitel mit Auslassungspunkten (15.8, wie schon ‚Neues Reiselogbuch‘ bei
// 375 px und der Titel des Tages in 3.43.0) – dann muss der Anfang ‚Reiselogbuch‘ zu lesen sein und ‚…‘ das Kürzen zeigen.
const titelFrei = (p, gross) => p.evaluate(gross => { const h = document.querySelector('#dlg .dlg-head h3'), x = document.querySelector('#dlgX'), ok = document.querySelector('#dlgOk');
  const r = h.getBoundingClientRect(), rx = x.getBoundingClientRect(), ro = ok.getBoundingClientRect(), c = getComputedStyle(h);
  const ganz = h.scrollWidth <= h.clientWidth + 1, zwischen = r.left >= rx.right - 1 && r.right <= ro.left + 1;
  if (!gross) return ganz && zwischen;
  const anfang = document.createElement('span'); anfang.textContent = h.textContent.split(' ')[0]; anfang.style.cssText = `font: ${c.font}; position: absolute; visibility: hidden; white-space: nowrap`;
  document.body.append(anfang); const w = anfang.getBoundingClientRect().width; anfang.remove();
  return zwischen && (ganz || (c.textOverflow === 'ellipsis' && w <= h.clientWidth)); }, gross);
const menueFrei = p => p.evaluate(() => [...document.querySelectorAll('.menu .mi')].every(m => { const r = m.getBoundingClientRect(), mr = m.closest('.menu').getBoundingClientRect();
  return m.scrollWidth <= m.clientWidth + 1 && r.left >= mr.left - 1 && r.right <= mr.right + 1; }));
const lang = async (p, sel) => { await p.locator(sel).scrollIntoViewIfNeeded(); await p.waitForTimeout(150); const bx = await p.locator(sel).boundingBox(); await p.mouse.move(bx.x + 40, bx.y + 20); await p.mouse.down(); await p.waitForTimeout(750); await p.mouse.up(); await p.waitForTimeout(200); };
const zu = async p => { await p.click('#dlgX'); await p.waitForTimeout(300); await navFertig(p); };

const b = await t.browser();
const faelle = [['iPad quer', 0], ['iPad hoch', 0], ['iPhone hoch', 0], ['iPhone quer', 0], ['iPhone hoch', 53], ['iPad hoch', 53]];
for (const [ansicht, px] of faelle) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
  if (px) { t.ort = `${ansicht} · Text ${px}`; await p.addInitScript(px => { const s = () => { const e = document.createElement('style'); e.textContent = `html { font-size: ${px}px !important; }`; document.documentElement.prepend(e); };
    if (document.documentElement) s(); else new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); s(); } }).observe(document, { childList: true }); }, px); }
  await start(p);
  const phone = await p.evaluate(() => isPhone());
  if (phone) { await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400); await navFertig(p); }
  // RLB-113/E-1: Mehr-Menü des Reiselogbuchs
  await t.schritt(p, 'RLB-113/E-1 Mehr-Menü', async () => { await p.click('#mainMore'); await p.waitForTimeout(200); });
  t.ist('RLB-113/E-1 Mehr-Menü', await menue(p), ['Suchen', 'Alle Tage', 'Nur erfasste Tage', NAME, 'Reiselogbuch löschen'], 'R-4.1');
  t.ist('RLB-113/E-1 Icon settings', await p.evaluate(n => { const m = [...document.querySelectorAll('.menu .mi')].find(x => x.textContent.trim() === n); const d = document.createElement('div'); d.innerHTML = ic('settings'); return !!m && m.querySelector('svg')?.innerHTML === d.firstElementChild.innerHTML; }, NAME), true, 'R-4.1');
  t.wahr('RLB-113/E-6 Menüpunkte ganz im Menü', await menueFrei(p), 'R-6.3');
  // RLB-113/E-3: daraus das Fenster – Titel, Reisetitel des geöffneten
  await t.schritt(p, 'RLB-113/E-3 Mehr-Menü → Reiselogbuch einstellen', async () => { await p.locator('.menu .mi', { hasText: NAME }).click(); await p.waitForTimeout(400); await navFertig(p); });
  t.ist('RLB-113/E-3 Fenstertitel und Reisetitel', [await p.textContent('#dlg .dlg-head h3'), await p.inputValue('#fTitle')], [NAME, 'Australien']);
  t.wahr('RLB-113/E-6 Titel ganz sichtbar zwischen x und Häkchen', await titelFrei(p, px > 0), 'R-6.3');
  await zu(p);
  // RLB-113/E-2, RLB-113/E-4: Kontextmenü der Zeile (Seitenleiste bzw. Startliste), das andere gedrückt
  if (phone) { await p.click('#back'); await p.waitForTimeout(400); await navFertig(p); }
  else if (ansicht === 'iPad hoch') { await p.evaluate(() => { if (side.hidden) toggleSide(); }); await p.waitForTimeout(600); await navFertig(p); }
  await t.schritt(p, 'RLB-113/E-2 Toskana lange drücken', () => lang(p, '#side .side-row[data-id="b"]'));
  t.ist('RLB-113/E-2 Kontextmenü', await menue(p), [NAME, 'Reiselogbuch löschen'], 'R-4.2');
  t.wahr('RLB-113/E-6 Menüpunkte des Kontextmenüs ganz im Menü', await menueFrei(p), 'R-6.3');
  await t.schritt(p, 'RLB-113/E-4 Kontextmenü → Reiselogbuch einstellen', async () => { await p.locator('.menu .mi', { hasText: NAME }).click(); await p.waitForTimeout(400); await navFertig(p); });
  t.ist('RLB-113/E-4 Fenstertitel und Reisetitel des gedrückten, Zeile blau (on)', [await p.textContent('#dlg .dlg-head h3'), await p.inputValue('#fTitle'),
    await p.evaluate(() => document.querySelector('#side .side-row[data-id="b"]')?.classList.contains('on') ?? null)], [NAME, 'Toskana', true], 'R-3.3');
  t.wahr('RLB-113/E-6 Titel ganz sichtbar (Kontextmenü)', await titelFrei(p, px > 0), 'R-6.3');
  await zu(p);
  // RLB-113/E-5: plus → ‚Neues Reiselogbuch‘ bleibt
  if (ansicht === 'iPad hoch' && !(await p.locator('#newTrip').isVisible())) { await p.evaluate(() => { if (side.hidden) toggleSide(); }); await p.waitForTimeout(600); }
  await t.schritt(p, 'RLB-113/E-5 plus', async () => { await p.click('#newTrip'); await p.waitForTimeout(400); await navFertig(p); });
  t.ist('RLB-113/E-5 Fenstertitel ‚Neues Reiselogbuch‘', await p.textContent('#dlg .dlg-head h3'), 'Neues Reiselogbuch');
  t.wahr('RLB-113/E-6 Titel ‚Neues Reiselogbuch‘ ganz sichtbar', await titelFrei(p, px > 0), 'R-6.3');
  if (ansicht === 'iPhone hoch' && px) await p.screenshot({ path: new URL(`out/RLB-113-neu-gross-${t.browserName}.png`, import.meta.url).pathname });
  await zu(p);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
