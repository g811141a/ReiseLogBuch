// Reiselogbuch-Test: ablauf-schicht-oben (seit 3.52.0) – AppDesign APD-118 (Usertest P-97/6, Testfall-Liste im AppDesign-BACKLOG APD-118/X-1 bis X-9;
// Designrichtlinie 13 ‚Am oberen Rand kein Klick‘): iPhone quer vom Home-Bildschirm schickt bei y ≈ 20 px keinen click – die Sperrschicht hinter Menü,
// Untermenü, Kontextmenü und Sprechblase schließt deshalb beim Loslassen (bis 20 px Weg) und verschluckt den Klick danach.
// iPhone quer hell und dunkel: X-1 Tipp ohne Klick über Mehr → zu, waagrechte Punkte, Fokus Mehr · X-2 mit 14 px Weg · X-3 Klick danach → bleibt zu ·
// X-4 daneben mit Klick → einmal zu, kein Fenster · X-6 Wischen über 20 px → bleibt offen · X-5 Sprechblase ‚Reiselogbuch löschen‘;
// iPhone hoch, iPad quer und hoch: X-4 bis X-6 mit Untermenü ‚Darstellung‘, Kontextmenü und Sprechblase (iPad);
// X-8 die Messung tests/messungen/2026-11-06 iPhone quer Mehr-Menü oberer Rand.txt (AppDesign) nachgespielt – nach dem ersten Tipp zu.
// Seit 3.53.0 (AppDesign APD-121/Y-5): die Messungen 2026-11-07 iPhone quer Mehr-Knopf oben 1 und 2 – jeder Tipp auf den Mehr-Knopf der Liste
// (#sideMore) mit gemessenem Ort und Weg nachgespielt (Safari-Modell obenOhneKlick): das Menü öffnet genau dann, wenn am Gerät ‚tippen sideMore‘ folgte
// (y 21 bis 36; der Tipp 796/24 → 810/22 mit 14 px Weg ohne Klick bleibt zu); waagrecht auf die Knopfmitte verschoben (am Gerät
// steht der Knopf wegen des sicheren Rands weiter links), y und Weg wie gemessen. Tipps neben dem Knopf (APD-121/B-5) sind nicht Teil davon.
// Grundregeln nach jedem Schritt. Gegenprobe (X-9): gegen 3.51.0 mit PRUEF_APP=../_alt.html rot (X-1, X-2, X-8).
// Aufruf im Repo-Ordner: node tests/ablauf-schicht-oben.mjs
import * as pw from 'playwright';
import { readFileSync } from 'node:fs';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.56.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.56.0/tests/hig.mjs';
import { checkSchichtOben } from '../../AppDesign/fassung/4.56.0/tests/ablauf.mjs';
import { lies, ansicht } from '../../AppDesign/fassung/4.56.0/tests/abspielen.mjs';
import { obenOhneKlick } from '../../AppDesign/fassung/4.56.0/tests/safari.mjs';
const t = pruefung('ablauf-schicht-oben', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const MESSUNG = lies(readFileSync(new URL(encodeURIComponent('2026-11-06 iPhone quer Mehr-Menü oberer Rand.txt'), new URL('../../AppDesign/tests/messungen/', import.meta.url)), 'utf8'));
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 12; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1}`, place: 'Hafen' };
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(0), end: iso(11), transport: ['flug'], days },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-06-03', end: '2027-06-17', transport: ['pkw'], days: {} }];
const start = async p => {
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
  if (await p.evaluate(() => isPhone()) && await p.locator('#side.page').isVisible()) {
    await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400); await navFertig(p);
  }
};
const loeschenFrage = async p => { await p.evaluate(() => document.querySelector('#mainMore')?.click()); await p.waitForTimeout(450);
  await p.locator('.menu .mi', { hasText: 'Reiselogbuch löschen' }).click(); };
const lang = async (p, n) => { const bx = await p.locator('.side-row', { hasText: n }).boundingBox(); await p.mouse.move(bx.x + 40, bx.y + 20); await p.mouse.down(); await p.waitForTimeout(750); await p.mouse.up(); };
const b = await t.browser();
for (const [ansicht_, theme] of [['iPhone quer', 'light'], ['iPhone quer', 'dark'], ['iPhone hoch', 'light'], ['iPad quer', 'light'], ['iPad hoch', 'light']]) {
  const p = await t.seite(b, ansicht_, { theme });
  await start(p);
  const amRand = ansicht_ === 'iPhone quer', ipad = ansicht_.startsWith('iPad');
  const oeffner = [loeschenFrage, ...(ipad ? [
    async p => { await p.click('#sideMore'); await p.waitForTimeout(450); await p.locator('.menu .mi', { hasText: 'Darstellung' }).click(); },
    p => lang(p, 'Toskana'),
    async p => { await lang(p, 'Toskana'); await p.waitForTimeout(300); await p.locator('.menu.kontext .mi', { hasText: 'Reiselogbuch löschen' }).click(); }] : [])];
  await t.schritt(p, 'Sperrschicht schließt beim Loslassen', async () => t.liste(await checkSchichtOben(p, { mehr: '#mainMore', oeffner, oben: amRand, where: t.ort })));
  t.ist('nichts gelöscht', await p.evaluate(() => db.trips.length), 2);
  await p.close();
}
// X-8: die Messung nachgespielt (Größe und Gerät aus dem Kopf, gedreht wie gemessen)
{
  const a = ansicht(MESSUNG), { width: kurz, height: lang_ } = a.viewport;
  const p = await t.seite(b, { ...a, viewport: { width: Math.max(kurz, lang_), height: Math.min(kurz, lang_) } }, { theme: 'light' });
  t.ort = 'Messung iPhone quer';
  await start(p);
  await t.schritt(p, 'Messung nachgespielt', async () => t.liste(await checkSchichtOben(p, { mehr: '#mainMore', messung: MESSUNG, where: 'X-8 Messung' })));
  await p.close();
}
// APD-121/Y-5: Tipps auf den Mehr-Knopf der Liste aus den Messungen vom 07.11.2026 nachgespielt
for (const datei of ['2026-11-07 iPhone quer Mehr-Knopf oben 1.txt', '2026-11-07 iPhone quer Mehr-Knopf oben 2.txt']) {
  const m = lies(readFileSync(new URL(encodeURIComponent(datei), new URL('../../AppDesign/tests/messungen/', import.meta.url)), 'utf8'));
  const ev = m.zeilen.map(z => z.ereignis || '').filter(e => /^(zeiger (down|move|up) \d+ \d+ touch|tippen )/.test(e));
  const tipps = [];
  ev.forEach((e, i) => { const d = e.match(/^zeiger down (\d+) (\d+) touch (?:svg\.ic in )?sideMore$/); if (!d) return;
    const j = ev.findIndex((x, k) => k > i && x.startsWith('zeiger up')), u = ev[j].match(/^zeiger up (\d+) (\d+)/);
    tipps.push({ x0: +d[1], y0: +d[2], x1: +u[1], y1: +u[2], soll: ev[j + 1] === 'tippen sideMore' }); });
  const a = ansicht(m), { width: kurz, height: lang_ } = a.viewport;
  const p = await t.seite(b, { ...a, viewport: { width: Math.max(kurz, lang_), height: Math.min(kurz, lang_) } }, { theme: 'light' });
  t.ort = `APD-121/Y-5 ${datei.replace(/\.txt$/, '')}`;
  await start(p);
  if (await p.locator('#back').isVisible()) { await p.click('#back'); await p.waitForTimeout(450); await navFertig(p); }
  const offen = () => p.evaluate(() => !!document.querySelector('.menu:not(.zu-geist), .layer'));
  t.wahr('APD-121/Y-5 Messung mit Tipps auf den Mehr-Knopf (sonst prüft die Prüfung nichts)', tipps.length >= 6 && (datei.includes('oben 1') || tipps.some(x => x.y0 === 21) && tipps.some(x => !x.soll)), 'APD-121');
  // waagrecht auf die Mitte des Knopfs verschoben (am Gerät anderer sicherer Rand: Knopf weiter links), y und Weg wie gemessen
  const mx = await p.evaluate(() => { const r = document.querySelector('#sideMore').getBoundingClientRect(); return r.x + r.width / 2; });
  const dx = Math.round(mx - tipps.map(k => k.x0).sort((a, b) => a - b)[tipps.length >> 1]);
  await obenOhneKlick(p);
  try {
    for (const k of tipps) {
      await p.mouse.move(k.x0 + dx, k.y0); await p.mouse.down(); if (k.x1 !== k.x0 || k.y1 !== k.y0) await p.mouse.move(k.x1 + dx, k.y1, { steps: 3 }); await p.mouse.up();
      await p.waitForTimeout(450);
      const ist = await offen();
      if (ist !== k.soll) t.fehler('13', `APD-121/Y-5 Tipp ${k.x0}/${k.y0}${k.x1 !== k.x0 || k.y1 !== k.y0 ? ` → ${k.x1}/${k.y1}` : ''} auf #sideMore: Menü ${ist ? 'offen' : 'zu'}, gemessen ${k.soll ? 'offen' : 'zu'}`);
      for (let n = 0; n < 3 && await offen(); n++) { await p.keyboard.press('Escape'); await p.waitForTimeout(350); }
    }
  } finally { await obenOhneKlick(p, false); }
  await t.schritt(p, 'Mehr-Knopf oben nachgespielt', async () => {});
  await p.close();
}
await t.ende(b);
