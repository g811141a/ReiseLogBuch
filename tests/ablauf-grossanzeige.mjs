// Reiselogbuch-Test: ablauf-grossanzeige (seit 3.46.0) – AppDesign APD-104, R-2.6 (Testfall-Liste AppDesign arbeit/APD-104 Testfall-Liste.md
// L-1 bis L-9): ab der Textgröße AX1 zeigt langes Drücken auf einen Leisten-Knopf Icon und Namen groß in der Mitte; gleiten wechselt,
// Loslassen über einem Knopf löst ihn aus, daneben schließt sie nur. Je Ansicht (iPad quer und hoch, iPhone hoch und quer) bei AX1 (Text 28):
// Kopfzeile (Ausgabe → Mehr, daneben der Titel), Seitenleiste (Neues Reiselogbuch → Mehr), Fenster-Kopfzeile (Abbrechen → Fertig),
// schwebende Knöpfe (Nach oben → Ans Ende); echt ausgelöst: Loslassen über ‚Mehr‘ öffnet das Menü; offenes Menü: keine Anzeige auf den
// verdeckten Knöpfen; Drehen schließt sie ohne Auslösen; AX5 (Text 53): die Anzeige wächst mit und bleibt ganz auf dem Bildschirm; bei
// Text 17 (L) nichts davon (L-1, L-2); Grundregeln nach jedem Schritt. Gegenprobe: gegen 3.45.0 mit PRUEF_APP=../_alt.html rot (L-5).
// Aufruf im Repo-Ordner: node tests/ablauf-grossanzeige.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.48.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.48.0/tests/hig.mjs';
import { checkGrossanzeige, finger } from '../../AppDesign/fassung/4.48.0/tests/ablauf.mjs';
const t = pruefung('ablauf-grossanzeige', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 20; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1} mit etwas mehr Text für eine lange Seite`, place: 'Hafen' };
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(0), end: iso(19), transport: ['flug'], days },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-06-03', end: '2027-06-17', transport: ['pkw'], days: {} }];
const groesse = px => { const s = () => { const e = document.createElement('style'); e.textContent = `html { font-size: ${px}px !important; }`; document.documentElement.prepend(e); };
  if (document.documentElement) s(); else new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); s(); } }).observe(document, { childList: true }); };
const start = async p => {
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
  if (await p.evaluate(() => isPhone()) && await p.locator('#side.page').isVisible()) {
    await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400); await navFertig(p);
  }
};
const sichtbar = (p, s) => p.evaluate(s => { const e = document.querySelector(s); return !!e && !!e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden'; }, s);
const KOPF = '#bar .nb-title, #bar .pnav-title';

const b = await t.browser();
for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch', 'iPhone quer']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  t.ort = `${ansicht} · Text 28 (AX1)`;
  await p.addInitScript(groesse, 28);
  try {
    await start(p);
    t.wahr('Text 28 ist AX1 (html.ts-ax)', await p.evaluate(() => document.documentElement.classList.contains('ts-ax')), 'R-2.6');
    // Kopfzeile: Ausgabe → Mehr; daneben: der Titel
    await t.schritt(p, 'Kopfzeile', async () => t.liste(await checkGrossanzeige(p, { knoepfe: ['#shareBtn', '#mainMore'], daneben: KOPF, where: 'Kopfzeile' })));
    // echt ausgelöst: 0,7 s auf ‚Mehr‘, loslassen – das Menü öffnet sich genau einmal, die Anzeige ist zu
    await t.schritt(p, 'Kopfzeile – Mehr echt auslösen', async () => {
      await finger(p, '#mainMore', [['warte', 700]], { fangen: false }); await p.waitForTimeout(300);
      t.ist('L-8 Loslassen über ‚Mehr‘ öffnet das Menü', await p.locator('.menu').count(), 1, 'R-2.6');
      t.wahr('L-8 nach dem Loslassen ist die Großanzeige zu', !await p.locator('.grossanzeige').count(), 'R-2.6');
      // offenes Menü: die Knöpfe darunter sind verdeckt – langes Drücken dort zeigt keine Anzeige
      const r = await p.evaluate(async () => {
        const k = document.querySelector('#shareBtn').getBoundingClientRect(), x = k.left + k.width / 2, y = k.top + k.height / 2, z = document.elementFromPoint(x, y);
        const ev = typ => z.dispatchEvent(new PointerEvent(typ, { pointerId: 9, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y, button: 0, buttons: typ === 'pointerup' ? 0 : 1, bubbles: true, cancelable: true }));
        ev('pointerdown'); await new Promise(r => setTimeout(r, 700)); const g = !!document.querySelector('.grossanzeige'); ev('pointerup'); return g;
      });
      t.wahr('bei offenem Menü zeigt langes Drücken auf den verdeckten Knopf ‚Ausgabe‘ keine Großanzeige', !r, 'R-2.6');
      await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    });
    // Seitenleiste (iPad quer: fest links)
    if (await sichtbar(p, '#newTrip'))
      await t.schritt(p, 'Seitenleiste', async () => t.liste(await checkGrossanzeige(p, { knoepfe: ['#newTrip', '#sideMore'], where: 'Seitenleiste' })));
    // schwebende Knöpfe: in der Mitte der Seite sind beide sichtbar
    await p.evaluate(() => { const r = document.querySelector('#app > .rolle'); r.scrollTop = (r.scrollHeight - r.clientHeight) / 2; }); await p.waitForTimeout(500);
    if (await sichtbar(p, '#toTop') && await sichtbar(p, '#toEnd'))
      await t.schritt(p, 'schwebende Knöpfe', async () => t.liste(await checkGrossanzeige(p, { knoepfe: ['#toTop', '#toEnd'], where: 'schwebende Knöpfe' })));
    else if (ansicht.startsWith('iPad')) t.fehler('R-2.6', 'schwebende Knöpfe ‚Nach oben‘ und ‚Ans Ende‘ in der Mitte der Seite nicht beide sichtbar');
    // Fenster-Kopfzeile: Abbrechen → Fertig (Fenster ‚Reiselogbuch einstellen‘)
    await p.evaluate(() => openTripDialog(db.trips[0])); await p.waitForTimeout(500); await navFertig(p);
    await t.schritt(p, 'Fenster-Kopfzeile', async () => t.liste(await checkGrossanzeige(p, { knoepfe: ['#dlgX', '#dlgOk'], daneben: '#dlg .dlg-head h3', where: 'Fenster-Kopfzeile' })));
    // Drehen schließt die Anzeige ohne Auslösen; das Fenster bleibt offen
    await t.schritt(p, 'drehen bei offener Großanzeige', async () => {
      const vp = p.viewportSize();
      const r = await p.evaluate(async () => {
        const k = document.querySelector('#dlgX'), q = k.getBoundingClientRect(), x = q.left + q.width / 2, y = q.top + q.height / 2;
        const ev = typ => k.dispatchEvent(new PointerEvent(typ, { pointerId: 10, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y, button: 0, buttons: typ === 'pointerup' ? 0 : 1, bubbles: true, cancelable: true }));
        ev('pointerdown'); await new Promise(r => setTimeout(r, 700)); window.__ev = ev; return !!document.querySelector('.grossanzeige');
      });
      t.wahr('vor dem Drehen ist die Großanzeige offen', r, 'R-2.6');
      await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(400);
      t.wahr('Drehen schließt die Großanzeige', !await p.locator('.grossanzeige').count(), 'R-2.6');
      await p.evaluate(() => window.__ev('pointerup')); await p.waitForTimeout(300);
      t.wahr('nach dem Drehen löst das Loslassen ‚Abbrechen‘ nicht aus – das Fenster bleibt offen', await p.evaluate(() => dlg.open), 'R-2.6');
      await p.setViewportSize(vp); await p.waitForTimeout(400);
    });
    await p.evaluate(() => { dlgDirty = () => false; dlg.close(); }); await p.waitForTimeout(400); await navFertig(p);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// AX5 (Text 53): die Anzeige wächst mit und bleibt ganz auf dem Bildschirm (iPhone quer ist am niedrigsten)
for (const ansicht of ['iPhone hoch', 'iPhone quer']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  t.ort = `${ansicht} · Text 53 (AX5)`;
  await p.addInitScript(groesse, 53);
  try {
    await start(p);
    await t.schritt(p, 'Kopfzeile AX5', async () => t.liste(await checkGrossanzeige(p, { knoepfe: ['#shareBtn', '#mainMore'], where: 'Kopfzeile AX5' })));
    const r = await finger(p, '#mainMore', [['warte', 700], ['merke', 'g'], ['ohneKlick']]);
    t.wahr(`AX5: die Großanzeige wächst mit der Textgröße (Schrift ${r.gemerkt.g.gross?.schrift} px)`, (r.gemerkt.g.gross?.schrift || 0) >= 52, 'R-2.6');
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// L-1, L-2: Text 17 (L) – langes Drücken zeigt nichts und wirkt wie Antippen
for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  t.ort = `${ansicht} · Text 17 (L)`;
  try {
    await start(p);
    await t.schritt(p, 'Kopfzeile L', async () => t.liste(await checkGrossanzeige(p, { knoepfe: ['#shareBtn', '#mainMore'], ax: false, where: 'Kopfzeile L' })));
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
