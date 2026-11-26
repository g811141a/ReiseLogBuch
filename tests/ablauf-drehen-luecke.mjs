// Reiselogbuch-Test: ablauf-drehen-luecke (seit 3.56.3) – AppDesign APD-133 ‚Nach dem Drehen steht der Inhalt am Ende‘ (Befund und Testfall-Liste
// AppDesign arbeit/APD-133 Befund Drehen.md, APD-133/B-1 bis B-4; B-5 Gegenprobe: gegen AppDesign 4.59.2 wird B-1 rot; B-6 prüfen die
// bestehenden Abläufe zu R-8.1). Die Lücke: das Fenster hat schon die neue Größe, das Ereignis resize dafür ist noch nicht angekommen, und das
// von der Zwischengröße geplante Wiederherstellen (restoreTop, ui.js) läuft genau dazwischen – im WebKit der Prüfumgebung unter Last gemessen
// (Sitzung 0119). Fest nachgebildet: resize zurückhalten, Größe ändern, restoreTop wie der Zeitgeber aufrufen, resize nachliefern.
// Aufruf im Repo-Ordner: node tests/ablauf-drehen-luecke.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.70.1/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.70.1/tests/hig.mjs';
const t = pruefung('ablauf-drehen-luecke', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a', '.ilist .ln.q a'] }), out: new URL('out/', import.meta.url) });
const tage = {}; for (let i = 0; i < 30; i++) tage[new Date(Date.UTC(2026, 7, 1 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Programm ' + i, quarter: 'Hotel ' + (i >> 2), place: 'Cairns', km: i % 5 };
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-01', end: '2026-08-30', transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, kmColumn: true, quarterList: true, days: tage }];
const APP = new URL('../index.html', import.meta.url).href;
const start = async p => {
  // resize zurückhalten: der Hörer wird vor allen Skripten der Seite angemeldet (addInitScript) – er läuft vor den Hörern der App und von ui.js
  // (Chromium ruft die Hörer am Fenster in der Reihenfolge der Anmeldung, auch die der Einfangphase)
  await p.addInitScript(() => { window.__halt = false; window.__gehalten = 0; addEventListener('resize', e => { if (window.__halt) { window.__gehalten++; e.stopImmediatePropagation(); } }, true); });
  await p.clock.setFixedTime(new Date('2026-08-12T10:00:00'));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
};
const lage = p => p.evaluate(() => {
  const a = document.querySelector('#app'), edge = document.querySelector('#bar')?.getBoundingClientRect().bottom ?? 0;
  const kante = x => { const th = x.closest('table')?.tHead?.querySelector('th'); return th && getComputedStyle(th).position === 'sticky' ? Math.max(edge, th.getBoundingClientRect().bottom) : edge; };
  const oben = [...a.querySelectorAll('[data-day]')].find(x => x.getClientRects().length && x.getBoundingClientRect().bottom > kante(x) + 2)?.dataset.day ?? null;
  return { tabelle: !!a.querySelector('table.days:not(.static)'), oben, y: Math.round(rolle.y), rest: Math.round(rolle.rest), fenster: [innerWidth, innerHeight] };
});
const rolleZu = (p, iso) => p.evaluate(iso => { const e = document.querySelector(`#app [data-day="${iso}"]`); const r = document.querySelector('#app > .rolle');
  r.scrollTop += e.getBoundingClientRect().top - document.querySelector('#bar').getBoundingClientRect().bottom - 2; }, iso);
// Drehen mit Lücke: Zwischengröße wie gewohnt (resize kommt an, ihre Zeitgeber laufen ab); dann die Zielgröße ohne resize, das geplante
// Wiederherstellen läuft in der Lücke, erst danach kommt resize an. Gibt zurück, ob die Lücke bestand (Größe neu, App noch nicht umgebaut).
const dreheMitLuecke = async (p, ziel) => {
  await p.setViewportSize({ width: 1000, height: 1000 }); await p.waitForTimeout(600);
  const vorher = (await lage(p)).tabelle;
  await p.evaluate(() => { window.__halt = true; window.__gehalten = 0; });
  await p.setViewportSize(ziel);
  await p.waitForFunction(w => innerWidth === w, ziel.width);
  await p.waitForTimeout(150);
  const l = await lage(p), gehalten = await p.evaluate(() => window.__gehalten);
  await p.evaluate(() => restoreTop());   // wie der Zeitgeber von ui.js (zwei Bilder bzw. 350 ms nach dem resize der Zwischengröße)
  await p.waitForTimeout(100);
  await p.evaluate(() => { window.__halt = false; dispatchEvent(new Event('resize')); });
  await p.waitForTimeout(800);
  return gehalten > 0 && l.fenster[0] === ziel.width && l.tabelle === vorher;
};
const QUER = { width: 1180, height: 820 }, HOCH = { width: 820, height: 1180 };
const b = await t.browser();
{ // B-1, B-2: 20.08. oben, Seitenleiste aus und ein (APD-97/L-3), dann drehen mit Lücke nach quer und zurück
  const p = await t.seite(b, 'iPad hoch', { theme: 'light' }); t.ort = 'iPad hoch hell';
  await start(p);
  await rolleZu(p, '2026-08-20'); await p.waitForTimeout(300);
  await p.locator('#sideHide').click(); await p.waitForTimeout(700); await navFertig(p);
  await p.locator('[data-side-toggle]').first().click(); await p.waitForTimeout(700); await navFertig(p);
  const vor = (await lage(p)).oben;
  t.ist('APD-133/B-1 Vorbereitung: oben steht der 20.08.', vor, '2026-08-20', 'R-8.1');
  let luecke; await t.schritt(p, 'B-1 drehen mit Lücke nach quer', async () => { luecke = await dreheMitLuecke(p, QUER); });
  let l = await lage(p);
  t.ist('APD-133/B-1 Vorbereitung: Lücke bestand (neue Größe ohne resize, App noch nicht umgebaut)', luecke, true, 'R-8.1');
  t.ist('APD-133/B-1 quer nach der Lücke: Tabelle, oberster Tag bleibt', [l.tabelle, l.oben], [true, vor], 'R-8.1');
  await t.schritt(p, 'B-2 drehen mit Lücke nach hoch', async () => { luecke = await dreheMitLuecke(p, HOCH); });
  l = await lage(p);
  t.ist('APD-133/B-2 Vorbereitung: Lücke bestand', luecke, true, 'R-8.1');
  t.ist('APD-133/B-2 hoch nach der Lücke: Kästen, oberster Tag bleibt', [l.tabelle, l.oben], [false, vor], 'R-8.1');
  // danach ohne Lücke weiterdrehen: das Gedächtnis ist nicht hängen geblieben
  await t.schritt(p, 'B-2 danach drehen ohne Lücke', async () => { await p.setViewportSize(QUER); await p.waitForTimeout(700); });
  l = await lage(p);
  t.ist('APD-133/B-2 danach ohne Lücke nach quer: oberster Tag bleibt', [l.tabelle, l.oben], [true, vor], 'R-8.1');
  await p.close();
}
{ // B-3: am Ende des Inhalts – Ende bleibt Ende
  const p = await t.seite(b, 'iPad hoch', { theme: 'light' }); t.ort = 'iPad hoch hell, am Ende';
  await start(p);
  await p.evaluate(() => rolle.to(1e6)); await p.waitForTimeout(400);
  let luecke; await t.schritt(p, 'B-3 am Ende drehen mit Lücke nach quer', async () => { luecke = await dreheMitLuecke(p, QUER); });
  let l = await lage(p);
  t.ist('APD-133/B-3 quer: Lücke bestand, Ende bleibt Ende', [luecke, l.rest <= 2, l.y > 0], [true, true, true], 'R-8.1');
  await t.schritt(p, 'B-3 am Ende drehen mit Lücke nach hoch', async () => { luecke = await dreheMitLuecke(p, HOCH); });
  l = await lage(p);
  t.ist('APD-133/B-3 hoch: Lücke bestand, Ende bleibt Ende', [luecke, l.rest <= 2, l.y > 0], [true, true, true], 'R-8.1');
  await p.close();
}
{ // B-4: ganz oben – bleibt ganz oben
  const p = await t.seite(b, 'iPad hoch', { theme: 'light' }); t.ort = 'iPad hoch hell, ganz oben';
  await start(p);
  await p.evaluate(() => rolle.to(0)); await p.waitForTimeout(400);
  let luecke; await t.schritt(p, 'B-4 ganz oben drehen mit Lücke nach quer', async () => { luecke = await dreheMitLuecke(p, QUER); });
  let l = await lage(p);
  t.ist('APD-133/B-4 quer: Lücke bestand, bleibt ganz oben', [luecke, l.y], [true, 0], 'R-8.1');
  await t.schritt(p, 'B-4 ganz oben drehen mit Lücke nach hoch', async () => { luecke = await dreheMitLuecke(p, HOCH); });
  l = await lage(p);
  t.ist('APD-133/B-4 hoch: Lücke bestand, bleibt ganz oben', [luecke, l.y], [true, 0], 'R-8.1');
  await p.close();
}
await t.ende(b);
