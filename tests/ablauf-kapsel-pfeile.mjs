// Reiselogbuch-Test: ablauf-kapsel-pfeile – RLB-106 (seit 3.31.0, AppDesign APD-75, R-5.4; Testfall-Liste AppDesign arbeit/APD-75 Testfall-Liste.md
// K1–K16): Auswahl-Kapsel mit Verlauf (48 px, die äußeren 28 px frei) und kleinen Pfeilen am Rand, die am jeweiligen Ende verschwinden –
// Reisemittel (Reise bearbeiten), Wetter und Smileys (Erfassen); iPhone hoch und quer, dunkel (K13), ‚Bewegung reduzieren‘ (K12), iPad
// (K5 alles passt, K7 schmaler); Drehen mit offenem Blatt (K6), Smiley entfernen und zurücksetzen (K11), rotate-ccw neben der Kapsel
// (K8); Grundregeln nach jedem Schritt (K16, mit hig.mjs: Pfeil genau dann, wenn es weitergeht, aria-hidden – K15).
// Aufruf im Repo-Ordner: node tests/ablauf-kapsel-pfeile.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.44.1/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.44.1/tests/hig.mjs';
import { checkKapsel } from '../../AppDesign/fassung/4.44.1/tests/ablauf.mjs';
const t = pruefung('ablauf-kapsel-pfeile', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 10; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1}`, place: 'Hafen' };
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(0), end: iso(9), transport: ['flug'], foodColumn: true, moodColumn: true, days }];
const tag = p => p.evaluate(d => openDayDialog(db.trips[0], d), iso(2));
const KAPSELN = [
  ['Reisemittel', p => p.evaluate(() => openTripDialog(db.trips[0])), '#transport'],
  ['Wetter', tag, '#wx'],
  ['Smileys', tag, '#dlg #moods .scroll'],
];
const lage = (p, sel) => p.evaluate(sel => { const s = document.querySelector(sel), pf = x => s.parentElement.querySelector(`:scope > .pf.${x}`).classList.contains('an');
  return { sl: Math.round(s.scrollLeft), max: Math.round(s.scrollWidth - s.clientWidth), l: pf('l'), r: pf('r') }; }, sel);
const stimmt = x => x.l === x.sl > 2 && x.r === x.sl < x.max - 2;
const b = await t.browser();
for (const [ansicht, theme, ruhig, drehen, schmaler] of [['iPhone hoch', 'light', false, true, null], ['iPhone quer', 'light', false, true, null],
  ['iPhone hoch', 'dark', false, false, null], ['iPhone hoch', 'light', true, false, null], ['iPad quer', 'light', false, false, 700]]) {
  const p = await t.seite(b, ansicht, { theme, ...(ruhig ? { reducedMotion: 'reduce' } : {}) });
  const ort = `${t.ort}${ruhig ? ' Bewegung reduzieren' : ''}`; t.ort = ort;
  await p.clock.setFixedTime(new Date('2026-09-02T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400);
  if (await p.locator('#side.page').isVisible()) { await p.locator('#side .side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(600); }
  for (const [name, open, sel] of KAPSELN) {
    await open(p); await p.waitForTimeout(700);
    await p.evaluate(sel => document.querySelector(sel).scrollIntoView({ block: 'center' }), sel); await p.waitForTimeout(300);
    await t.schritt(p, `${name} – Pfeile`, async () => t.liste(await checkKapsel(p, { sel, drehen, schmaler, where: name })));
    if (name === 'Smileys') {
      // K8: Pfeile innerhalb der Kapsel, rotate-ccw rechts daneben
      const k8 = await p.evaluate(sel => { const s = document.querySelector(sel), cap = s.parentElement.getBoundingClientRect(), f = s.parentElement.querySelector(':scope > .pf.r').getBoundingClientRect(),
        r = s.closest('.emoji-row').querySelector('.reset').getBoundingClientRect(); return { innen: f.left >= cap.left && f.right <= cap.right, daneben: r.left >= cap.right }; }, sel);
      t.wahr(`${name}: K8 Pfeil › nicht innerhalb der Kapsel`, k8.innen, 'R-5.4');
      t.wahr(`${name}: K8 rotate-ccw nicht rechts neben der Kapsel`, k8.daneben, 'R-5.4');
      // K11: Smiley entfernen (Zahl ändert sich) – Verlauf und Pfeile neu, Rollstand bleibt; dann zurücksetzen
      const vor = await lage(p, sel);
      if (vor.max > 2) {
        await p.evaluate(sel => { const s = document.querySelector(sel); s.scrollLeft = (s.scrollWidth - s.clientWidth) / 2; }, sel); await p.waitForTimeout(200);
        const sl = (await lage(p, sel)).sl;
        await t.schritt(p, `${name} – Smiley entfernt`, async () => {
          await p.evaluate(sel => { const s = document.querySelector(sel), r = s.getBoundingClientRect();
            const btn = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2).closest('button');
            btn.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 9, pointerType: 'touch', isPrimary: true, bubbles: true })); }, sel);
          await p.waitForTimeout(800);
          await p.locator('.pop button', { hasText: 'Entfernen' }).click(); await p.waitForTimeout(400);
          const n = await lage(p, sel);
          t.wahr(`${name}: K11 nach dem Entfernen Pfeile ${n.l ? '‹' : '–'} ${n.r ? '›' : '–'} bei Rollstand ${n.sl} von ${n.max}`, stimmt(n), 'R-5.4');
          t.wahr(`${name}: K11 Rollstand ${sl} → ${n.sl} px – soll bleiben`, Math.abs(n.sl - Math.min(sl, n.max)) <= 2, 'R-5.4');
        });
        await t.schritt(p, `${name} – zurückgesetzt`, async () => {
          await p.locator('#dlg #moods .reset').click(); await p.waitForTimeout(200);
          await p.locator('.pop button', { hasText: 'Zurücksetzen' }).click(); await p.waitForTimeout(400);
          const n = await lage(p, sel);
          t.wahr(`${name}: K11 nach dem Zurücksetzen Pfeile ${n.l ? '‹' : '–'} ${n.r ? '›' : '–'} bei Rollstand ${n.sl} von ${n.max}`, stimmt(n), 'R-5.4');
        });
      }
    }
    await p.evaluate(() => { dlgDirty = () => false; document.getElementById('dlg').close(); }); await p.waitForTimeout(500);
  }
  await p.close();
}
await t.ende(b);
