// Reiselogbuch-Test: ablauf-titel-oben (seit 3.47.0) – AppDesign APD-62 / APD-38/T-43, R-2.7 (Testfall-Liste AppDesign arbeit/APD-62 Titel antippen
// Testfall-Liste und Wortlaut.md H-1 bis H-10): kurzes Antippen des Titels rollt den zugehörigen Bereich sanft ganz nach oben – Kopfzeile den Inhalt
// (H-1), Seitenleiste ihre Liste (H-2), Fenster-Kopfzeile den Inhalt des Fensters (H-3); schon oben nichts (H-4), langes Drücken kein Rollen (H-5),
// ein Tipp während des Rollens hält es an (H-6), ‚Bewegung reduzieren‘ sofort oben (H-7), während eines Seitenwechsels kein Rollen (H-8) –
// checkTitelOben; in allen Ansichten, Chromium und WebKit (H-9); Grundregeln nach jedem Schritt. Gewartet wird auf Zustände (warteBis), nie fest.
// H-10 (Gegenprobe): gegen 3.46.2 mit PRUEF_APP=../_alt.html werden H-1 bis H-3 rot. Aufruf im Repo-Ordner: node tests/ablauf-titel-oben.mjs
// Seit 3.47.1 (AppDesign APD-109, Usertest P-90; Testfall-Liste AppDesign arbeit/APD-109 Testfall-Liste.md C-1 bis C-9): alles im Safari-Modell
// ‚Klick nur mit Hörer‘ (pruefe.mjs) – Selbsttest C-1/C-2 zuerst (checkSafariKlick); gegen 3.47.0 (R-2.7 am window) werden iPad Kopfzeile und
// Seitenleiste sowie die iPhone-Startliste rot (C-3 bis C-5, C-9), iPhone-Kopfzeile und Fenster bleiben grün (C-6) – wie am Gerät.
// Seit 3.48.0 (AppDesign APD-108, Testfall-Liste AppDesign arbeit/APD-108 Testfall-Liste.md W-1 bis W-4, W-6, W-7): Selbsttest des Safari-Modells
// ‚Klick nach dem Wischen‘ (checkSafariWischKlick, W-1); über jeden Titel waagrecht wischen bzw. weg und zurück rollt nicht, gleich danach antippen
// schon (checkTitelOben, wischen) – rot gegen 3.47.1 (der Klick kam 4 ms nach dem Loslassen, nach dem setTimeout 0 der Sperre).
import * as pw from 'playwright';
import { pruefung, warteBis, navFertig, ruhe } from '../../AppDesign/fassung/4.57.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.57.0/tests/hig.mjs';
import { checkTitelOben, checkSafariKlick, checkSafariWischKlick } from '../../AppDesign/fassung/4.57.0/tests/ablauf.mjs';
const t = pruefung('ablauf-titel-oben', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const iso = i => new Date(Date.UTC(2026, 7, 1 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 40; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1}\nzweite Zeile`, place: 'Hafen' };
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(0), end: iso(39), transport: ['flug'], days },
  ...Array.from({ length: 40 }, (_, i) => ({ id: `t${i}`, title: `Reise ${i + 1}`, participants: 'G', start: `${2000 + i}-05-03`, end: `${2000 + i}-05-17`, transport: ['pkw'], days: {} }))];
const ruht = sel => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); return !!e && e.getBoundingClientRect().height > 0
  && !document.getAnimations().some(a => a.playState === 'running') && !/(^|\\s)(nav-|blatt-faehrt|blatt-zieht)/.test(document.documentElement.className); })()`;
// Höchstzeit 10 s: es geht weiter, sobald der Zustand erreicht ist – die Grenze greift nur, wenn er nie kommt (unter Volllast dauert ein Aufbau Sekunden)
const warte = async (p, bedingung, was) => { const m = await warteBis(p, bedingung, { was, max: 10000 }); if (m) throw new Error(m); };
const start = async p => {
  await p.clock.setFixedTime(new Date('2026-08-03T14:32:00'));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await warte(p, `${ruht('#side .side-row')} || ${ruht('#shareBtn')}`, 'App aufgebaut'); await ruhe(p);
  if (await p.locator('#side.page').isVisible()) { await p.locator('#side .side-row[data-id="a"]').click(); await navFertig(p); }
  await warte(p, ruht('#shareBtn'), 'Reiselogbuch offen');
};
const KOPF = '#bar .nb-title, #bar .pnav-title';
const pruefe = async (p, name, opts) => { await t.schritt(p, name, async () => t.liste(await checkTitelOben(p, { ...opts, where: name }))); };
// Fenster ‚Erfassen‘ mit langem Inhalt (H-3): ist der Inhalt zu kurz zum Rollen, verlängert ihn ein Platzhalter (nur in der Prüfung)
const fenster = async p => {
  await p.evaluate(d => openDayDialog(db.trips[0], d), iso(2)); await warte(p, ruht('#dlg[open] .dlg-body'), 'Fenster offen'); await ruhe(p);
  await p.evaluate(() => { const b = document.querySelector('#dlg .dlg-body'); if (b.scrollHeight - b.clientHeight < 400) { const d = document.createElement('div'); d.style.height = '1200px'; b.append(d); } });
};
const zu = async p => { await p.evaluate(() => { dlgDirty = () => false; document.getElementById('dlg').close(); }); await warte(p, '!document.querySelector("dialog[open]")', 'Fenster zu'); await navFertig(p); };

const b = await t.browser();
for (const [ansicht, ruhig] of [['iPad quer', false], ['iPad hoch', false], ['iPhone hoch', false], ['iPhone quer', false], ['iPad quer', true], ['iPhone hoch', true]]) {
  const p = await t.seite(b, ansicht, { theme: 'light', ...(ruhig ? { reducedMotion: 'reduce' } : {}) });
  if (ruhig) t.ort = `${t.ort} · Bewegung reduzieren`;
  try {
    await start(p);
    if (!ruhig) await t.schritt(p, 'C-1/C-2 Safari-Modell', async () => t.liste(await checkSafariKlick(p)));
    if (!ruhig) await t.schritt(p, 'APD-108/W-1 Safari-Modell', async () => t.liste(await checkSafariWischKlick(p)));
    const seite = await p.locator('#side .side-list').isVisible();
    // H-1: Titel der Kopfzeile rollt den Inhalt; die Seitenleiste daneben bleibt
    await pruefe(p, 'H-1 Kopfzeile', { titel: KOPF, rolle: '#app > .rolle', still: seite ? ['#side .side-list'] : [], ruhig });
    if (!ruhig) {
      // H-3: Titel des Fensters rollt den Inhalt des Fensters; die Seite dahinter steht still (R-7.3)
      await fenster(p);
      await pruefe(p, 'H-3 Fenster ‚Erfassen‘', { titel: '#dlg .dlg-head h3', rolle: '#dlg .dlg-body', still: ['#app > .rolle'] });
      await zu(p);
      // H-2: Titel der Seitenleiste rollt nur ihre Liste (iPad quer: neben dem Inhalt; iPhone hoch: Startliste)
      if (ansicht === 'iPad quer') await pruefe(p, 'H-2 Seitenleiste', { titel: '#side .side-head h2', rolle: '#side .side-list', still: ['#app > .rolle'] });
      if (ansicht === 'iPhone hoch') {
        await p.locator('#back').click(); await navFertig(p); await warte(p, ruht('#side.page .side-row'), 'Startliste offen');
        await pruefe(p, 'H-2 Startliste', { titel: '#side .side-head h2', rolle: '#side .side-list' });
      }
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
