// Reiselogbuch-Test: kapsel-iphone – AppDesign APD-15 (seit 3.19.0, R-3.2; Testfall-Liste AppDesign arbeit/APD-15 Testfall-Liste.md):
// Kapsel ‚Nach oben / Ans Ende‘ auch im iPhone-Aufbau – im Reiselogbuch unten rechts, nicht in der Startliste, ausgeblendet ohne
// Scrollen; iPad unverändert. Seit 3.25.1 (AppDesign APD-33, Testfall-Liste arbeit/APD-33 Testfall-Liste.md APD-33/H-1 bis APD-33/H-5): bei offener Tastatur
// überdeckt die Kapsel nie Kopf- oder Suchzeile – nachgebaut ist der Ablauf aus P-58/2 (iPhone quer, Suche offen, Tastatur offen,
// sichtbar 126 px nach der Messung APD-27; Safari-Modell safari.mjs), dazu checkFab mit den gemessenen Höhen. Gegen 3.25.0 rot.
// Seit 3.28.0 (AppDesign APD-37 B+C, Testfall-Liste arbeit/APD-37 Testfall-Liste.md): nur wirksame Pfeile, Schnellroll-Griff (checkFab, checkGriff),
// Marken der Tage und Abschnitte (data-marke), sehr langes Reiselogbuch mit 365 Tagen (APD-37/F-11).
// Aufruf im Repo-Ordner: node tests/kapsel-iphone.mjs
import * as pw from 'playwright';
import { pruefung, navFertig, rollRuht } from '../../AppDesign/fassung/4.41.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.41.0/tests/hig.mjs';
import { checkFab, checkGriff } from '../../AppDesign/fassung/4.41.0/tests/ablauf.mjs';
import { safariModell } from '../../AppDesign/fassung/4.41.0/tests/safari.mjs';
const t = pruefung('kapsel-iphone', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const viele = {}; for (let i = 0; i < 30; i++) viele[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Programm ' + i, quarter: 'Hotel ' + i, place: 'Sydney' };
const trips = [{ id: 'a', title: 'Australien', participants: 'Anna', start: '2026-08-24', end: '2026-09-22', transport: ['flug'], foodColumn: true, quarterColumn: true, days: viele },
  { id: 'k', title: 'Kurz', participants: 'Anna', start: '2025-05-01', end: '2025-05-01', transport: ['pkw'], days: {} },
  { id: 'j', title: 'Jahr', participants: 'Anna', start: '2024-01-01', end: '2024-12-30', transport: ['pkw'], days: Object.fromEntries(Array.from({ length: 365 }, (_, i) => [new Date(Date.UTC(2024, 0, 1 + i)).toISOString().slice(0, 10), { program: 'Programm ' + i }])) }];
const kapsel = p => p.evaluate(() => { const f = document.getElementById('fab'), r = f.getBoundingClientRect();
  return { sichtbar: !!(f.offsetParent || getComputedStyle(f).position === 'fixed') && getComputedStyle(f).display !== 'none' && r.width > 0,
    rechts: Math.round(innerWidth - r.right), unten: Math.round(innerHeight - r.bottom), ...(e => e ? { y: Math.round(e.scrollTop), max: Math.round(e.scrollHeight - e.clientHeight) } : { y: Math.round(scrollY), max: Math.round(document.documentElement.scrollHeight - innerHeight) })(document.querySelector('#app > .rolle')) }; });
const b = await t.browser();
for (const theme of ['light', 'dark']) {
  for (const [name, ansicht] of [['iPhone hoch', 'iPhone hoch'], ['iPhone quer', 'iPhone quer'], ['iPad schmal', { viewport: { width: 600, height: 900 } }], ['iPad quer', 'iPad quer']]) {
    const p = await t.seite(b, ansicht, { theme });
    t.ort = `${name} ${theme === 'dark' ? 'dunkel' : 'hell'}`;
    await p.goto(APP);
    await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
    await p.reload(); await p.waitForTimeout(400);
    const phone = await p.evaluate(() => document.documentElement.classList.contains('phone'));
    if (phone) {   // K5: Startliste ohne Kapsel
      t.ist('K5 Kapsel in der Startliste', (await kapsel(p)).sichtbar, false, 'R-3.2');
      await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400);
    }
    // Seit 3.24.0: warten, bis das Reiselogbuch aufgebaut ist (höchstens 3 s) – unter Last reichten die festen 400 ms in WebKit nicht.
    await p.waitForFunction(() => document.querySelector('#app [data-day]') && getComputedStyle(document.getElementById('fab')).display !== 'none', null, { timeout: 3000 }).catch(() => {});
    let k = await kapsel(p);   // K1, K4, K13, K12
    t.ist('K1 Kapsel im Reiselogbuch sichtbar', k.sichtbar, true, 'R-3.2');
    t.wahr(`K1 Kapsel nicht unten rechts (rechts ${k.rechts} px, unten ${k.unten} px)`, k.rechts >= 14 && k.rechts <= 70 && k.unten >= 14 && k.unten <= 60, 'R-3.2');
    await t.schritt(p, 'Reiselogbuch mit Kapsel', async () => {});
    if (k.sichtbar) {
    await p.click('#toEnd'); await p.waitForTimeout(300); await rollRuht(p);   // K2 (seit 3.30.0: bis das Rollen ruht – Chrome 153 rollt langsamer)
    k = await kapsel(p);
    t.wahr(`K2 ‚Ans Ende‘ rollt nicht ganz nach unten (${k.y} von ${k.max})`, k.max - k.y <= 2, 'R-3.2');
    await t.schritt(p, 'ganz unten', async () => {});
    await p.click('#toTop'); await p.waitForTimeout(300); await rollRuht(p);   // K3
    t.ist('K3 ‚Nach oben‘ rollt ganz nach oben', (await kapsel(p)).y, 0, 'R-3.2');
    // 3 APD-33/H-1 bis APD-33/H-5: Tastatur offen (sichtbarer Bereich wie gemessen, APD-27), mit und ohne Suche – Kapsel schneidet keine Leiste
    for (const x of await checkFab(p, { top: '#toTop', end: '#toEnd', suche: '#searchBtn', sichtbar: { 'iPhone hoch': 409, 'iPhone quer': 126 }[name] ?? null,
      fenster: () => p.locator('#app [data-day]').first().click(), where: t.ort })) t.fehler('', x);
    // Seit 3.28.0 (AppDesign 7 APD-37/F-19): Marken für die Blase des Schnellroll-Griffs – Tage mit Nummer und Datum, danach die Abschnitte
    const marken = await p.evaluate(() => [...document.querySelectorAll('#app [data-marke]')].map(e => e.dataset.marke));
    t.ist('APD-37 erste Marke', marken[0], 'Tag 1 · Mo 24.08.', 'R-3.2');
    t.ist('APD-37 Marke des 19. Tags', marken[18], 'Tag 19 · Fr 11.09.', 'R-3.2');
    t.ist('APD-37 Marken der Abschnitte', marken.slice(30), ['Fazit', 'Quartierliste', 'Statistik'], 'R-3.2');
    }
    if (phone && name.startsWith('iPhone')) {   // 3 APD-33/H-1/K-2: Ablauf aus P-58/2 mit dem Safari-Modell – Suche öffnen, Tastatur auf; Grundregeln (Kapsel schneidet keine Leiste)
      await safariModell(p, name);
      await p.click('#searchBtn'); await p.waitForTimeout(100);
      await p.evaluate(() => __safari.tastatur(true)); await p.waitForTimeout(300);
      await t.schritt(p, 'Suche mit Tastatur', async () => {});
      const kb = await p.evaluate(() => { const f = document.getElementById('fab'), r = f.getBoundingClientRect(), s = document.querySelector('#bar').getBoundingClientRect();
        return { sichtbar: getComputedStyle(f).display !== 'none' && r.height > 0, top: Math.round(r.top), leiste: Math.round(s.bottom), h: visualViewport.height }; });
      if (name === 'iPhone quer') t.ist(`APD-33/H-1 Kapsel bei offener Tastatur ausgeblendet (sichtbar ${kb.h} px)`, kb.sichtbar, false, 'R-3.2');
      else t.wahr(`APD-33/H-2 Kapsel fehlt bei offener Tastatur oder steht nicht unter der Suchzeile (oben ${kb.top} px, Suchzeile bis ${kb.leiste} px)`, kb.sichtbar && kb.top >= kb.leiste + 16, 'R-3.2');
      await p.evaluate(() => __safari.tastatur(false)); await p.waitForTimeout(300);
      t.ist('APD-33/H-5 Kapsel nach dem Schließen der Tastatur wieder da', (await kapsel(p)).sichtbar, true, 'R-3.2');
      await p.click('#searchBtn'); await p.waitForTimeout(250);
    }
    if (phone && name === 'iPhone hoch') {   // K8: Suche offen – Kapsel verdeckt die Suchzeile nicht
      await p.click('#searchBtn'); await p.waitForTimeout(250);
      await t.schritt(p, 'Suche offen', async () => {});
      await p.click('#searchBtn'); await p.waitForTimeout(250);
    }
    if (theme === 'light' && (name === 'iPhone hoch' || name === 'iPad quer')) {   // 7 APD-37/F-11: sehr langes Reiselogbuch (365 Tage)
      if (phone) { await p.click('#back'); await navFertig(p); await p.locator('#side .side-row[data-id="j"]').click(); }
      else await p.locator('#side .side-row[data-id="j"]').click();
      await navFertig(p); await p.waitForTimeout(400);
      await t.schritt(p, '365 Tage', async () => {});
      for (const x of await checkGriff(p, { zeit: 1500, where: `${t.ort} · 365 Tage` })) t.fehler('', x);
      if (phone) { await p.click('#back'); await navFertig(p); }
      await p.locator('#side .side-row[data-id="a"]').click();
      await navFertig(p); await p.waitForTimeout(300);
    }
    if (!phone) {   // K6: Reiselogbuch ohne Scrollweg (kurz, sehr hohes Fenster) – Kapsel aus
      await p.locator('#side .side-row[data-id="k"]').click(); await p.setViewportSize({ width: 1180, height: 3000 }); await p.waitForTimeout(500);
      const kk = await kapsel(p);
      t.ist(`K6 Scrollweg beim kurzen Reiselogbuch`, kk.max <= 0, true);
      t.ist('K6 Kapsel ohne Scrollen ausgeblendet', kk.sichtbar, false, 'R-3.2');
    }
    await p.close();
  }
}
await t.ende(b);
