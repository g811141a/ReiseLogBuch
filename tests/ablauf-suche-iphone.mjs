// Reiselogbuch-Test: ablauf-suche-iphone – A-24 (Nutzer 18.10.2026, T-95): am iPhone stehen Kopf- und Suchzeile beim Tippen
// in der Suche fest (R-2.1, R-2.3). Nachgebaut ist genau der Ablauf des Nutzers (Zusammenarbeit 0 Nr. 1): Reiselogbuch mit vielen
// Tagen öffnen, in die Mitte rollen, Lupe antippen, Tastatur offen, Buchstabe für Buchstabe tippen.
// Safari nachgebildet (0 Nr. 5), je Fall eine Art und alle zusammen:
//   'pan'    Safari hat den sichtbaren Bereich bei offener Tastatur verschoben (visualViewport.offsetTop) und meldet jede
//            Verschiebung erst ein Bild später – feste Leisten richten sich erst dann nach ihr.
//   'fokus'  Verliert das Suchfeld den Fokus (z. B. weil es ersetzt wird), beginnt Safari die Tastatur zu schließen: der sichtbare
//            Bereich rückt sofort nach oben und wird höher; nach dem neuen Fokus geht sie wieder auf – gemeldet erst nach 2 Bildern.
//   'kuerzer' Die Suche filtert die Tage, die Seite wird kürzer, der Scrollstand rückt nach.
// Gemessen wird in jedem Bild während des Tippens die Lage von Kopfzeile und Suchfeld auf dem Bildschirm (Lage im Fenster minus
// Verschiebung des sichtbaren Bereichs); dazu: das Suchfeld bleibt dasselbe Feld und behält den Fokus.
// Aufruf im Repo-Ordner: node tests/ablauf-suche-iphone.mjs. Meldet Fehler (pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.25.1/tests/pruefe.mjs';
const t = pruefung('ablauf-suche-iphone', pw, { out: new URL('out/', import.meta.url) });
const days = {}; for (let i = 0; i < 40; i++) { const d = new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10); days[d] = { weather: '☀️', program: i === 30 ? 'Fahrt nach Sydney' : i % 7 === 0 ? 'Bus nach Sydney' : 'Programm ' + i, comment: '😉 ok', quarter: 'Hotel', place: 'Ort' }; }
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], foodColumn: true, days }];
const b = await t.browser();
for (const ansicht of ['iPhone hoch', 'iPhone quer']) for (const theme of ['light', 'dark']) for (const art of ['pan', 'fokus', 'kuerzer', 'alle']) {
  const p = await t.seite(b, ansicht, { theme });
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(300);
  await p.locator('#side .side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(300);
  await p.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.5));
  if (art === 'kuerzer' || art === 'alle') await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(200);
  await p.click('#searchBtn'); await p.waitForTimeout(200);
  // Tastatur auf und Safari-Verhalten einschalten
  await p.evaluate(art => {
    const vv = visualViewport, full = innerHeight, small = Math.round(innerHeight * 0.55), shift = 'pan alle'.includes(art) ? 120 : 0;
    const st = window.__kb = { top: shift, h: small, shift, frames: [], art };
    Object.defineProperty(vv, 'offsetTop', { configurable: true, get: () => st.top });
    Object.defineProperty(vv, 'height', { configurable: true, get: () => st.h });
    // Safari meldet Verschiebungen des sichtbaren Bereichs erst später (n Bilder)
    const melde = n => { const go = () => n-- > 0 ? requestAnimationFrame(go) : (vv.dispatchEvent(new Event('resize')), vv.dispatchEvent(new Event('scroll'))); go(); };
    melde(0);
    if ('fokus alle'.includes(art)) {
      let feld = document.activeElement;   // zuletzt bekanntes Feld mit Fokus (ein neuer Fokus ändert es erst nach der Prüfung)
      new MutationObserver(() => {
        if (!feld || feld.isConnected) return;
        // Feld entfernt: Tastatur beginnt zu schließen – sichtbar sofort, gemeldet erst, wenn sie wieder offen ist
        feld = document.activeElement?.matches?.('input') ? document.activeElement : null;
        st.top = 0; st.h = full;
        requestAnimationFrame(() => requestAnimationFrame(() => { st.top = st.shift; st.h = small; melde(0); }));
      }).observe(document.body, { childList: true, subtree: true });
    }
    // in jedem Bild: Lage von Kopfzeile und Suchfeld auf dem Bildschirm
    const lage = () => { const bar = document.querySelector('.pnav'), box = document.querySelector('.pnav .searchbox');
      st.frames.push([bar ? bar.getBoundingClientRect().top - st.top : null, box ? box.getBoundingClientRect().top - st.top : null]);
      if (st.run) requestAnimationFrame(lage); };
    st.run = true; requestAnimationFrame(lage);
  }, art);
  await p.waitForTimeout(150);
  const feld = await p.evaluateHandle(() => document.getElementById('search'));
  await p.evaluate(() => { window.__kb.frames.length = 0; });
  const ort = `${ansicht}, ${theme === 'dark' ? 'dunkel' : 'hell'}, Safari ${art}`;
  await t.schritt(p, `Tippen „Sydney“ (${ort})`, async () => {
    for (const ch of 'Sydney') { await p.keyboard.type(ch); await p.waitForTimeout(80); }
    await p.waitForTimeout(700);
  });
  const r = await p.evaluate(f => { const st = window.__kb; st.run = false;
    const ok = st.frames.filter(x => x[0] !== null && x[1] !== null), a = ok[0] || [0, 0];
    const bar = Math.max(0, ...ok.map(x => Math.abs(x[0] - a[0]))), box = Math.max(0, ...ok.map(x => Math.abs(x[1] - a[1])));
    return { n: st.frames.length, bar: Math.round(bar), box: Math.round(box), same: f === document.getElementById('search'), focus: document.activeElement === document.getElementById('search') }; }, feld);
  t.ist(`Kopfzeile steht beim Tippen fest (${ort}, größte Abweichung px in ${r.n} Bildern)`, r.bar, 0, 'R-2.1');
  t.ist(`Suchzeile steht beim Tippen fest (${ort}, größte Abweichung px)`, r.box, 0, 'R-2.1');
  t.ist(`Suchfeld bleibt dasselbe Feld (${ort})`, r.same, true, 'R-2.3');
  t.ist(`Suchfeld behält den Fokus (${ort})`, r.focus, true, 'R-2.3');
  t.ist(`Suche hat gefiltert (${ort})`, await p.locator('#pdays .box').count(), n => n >= 1 && n < 40);
  await p.close();
}
await t.ende(b);
