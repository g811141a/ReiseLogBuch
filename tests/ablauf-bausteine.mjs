// Reiselogbuch-Test: ablauf-bausteine (seit 3.57.7, AppDesign APD-135/B-3.2, Testfall-Liste AppDesign arbeit/APD-135 Paket 6 Schritt 2 Vorschlag.md
// APD-135/E-13). Die fünf Abläufe Messmodus (APD-27, R-1.6), gekürzter Titel (APD-101, R-2.5), Titel antippen (APD-62, R-2.7), Sperrschicht am
// oberen Rand (APD-118, Designrichtlinie 13) und Großanzeige (APD-104, R-2.6) prüft AppDesign vollständig auf der Prüfseite (bausteine-pruefseite,
// Teile messung, titel-blase, titel-oben, schicht-oben, grossanzeige). Hier nur, was erst im Zusammenspiel mit dem Reiselogbuch sichtbar wird:
// je Baustein eine kurze Prüfung an den echten Knöpfen und Titeln der App (ein neuer Knopf oder Titel der App wird von selbst Nutzer eines
// Bausteins und muss ihn richtig nutzen) und die Teile mit Reiselogik:
//   Messmodus     – F10 leere App öffnet ‚Neues Reiselogbuch‘, dort starten und teilen; mit Reisen: Versionszeile lange drücken, Messung, Suche
//                   ‚Rom‘ in allen Reiselogbüchern, teilen – die Datei nennt die App und enthält nur Längen, keinen Text der Reisen (iPad quer)
//   Titel-Blase   – iPhone hoch, Text 53: Reisetitel in der Kopfzeile, Fenster ‚Reiselogbuch einstellen‘ mit L-8 (Tipps auf x, Häkchen und Feld
//                   schließen nur die Blase, Reisetitel unverändert), Fenster eines Tages mit L-3 (Titel ‚Do, 27.08.2026‘)
//   Titel antippen – iPad quer: Kopfzeile rollt die Reise nach oben (H-1), Titel der Seitenleiste ihre Liste (H-2)
//   Sperrschicht  – iPhone quer am oberen Rand: Mehr der Reise, Sprechblase ‚Reiselogbuch löschen‘; danach nichts gelöscht (db.trips)
//   Großanzeige   – iPad quer, Text 28 (AX1): jeder sichtbare Knopf der Kopfzeile, der Seitenleiste und der Fenster-Kopfzeile ‚Reiselogbuch
//                   einstellen‘ zeigt groß Icon und seinen Namen; Loslassen über ‚Mehr‘ öffnet das Menü der Reise
// Grundregeln nach jedem Schritt. Gegenprobe: dieselben eingeschleusten Fehler wie --gegenprobe pruefseite müssen auch hier rot werden (CHANGELOG 3.57.7).
// Aufruf im Repo-Ordner: node tests/ablauf-bausteine.mjs
import * as pw from 'playwright';
import { pruefung, navFertig, warteBis } from '../../AppDesign/fassung/4.67.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.67.0/tests/hig.mjs';
import { langDruecken, sucheAuf, checkTitelBlase, titelLang, checkTitelOben, checkSchichtOben, finger } from '../../AppDesign/fassung/4.67.0/tests/ablauf.mjs';
const t = pruefung('ablauf-bausteine', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 40; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1}\nAusflug ans Meer`, place: 'Hafen' };
const TITEL = 'Australien und Neuseeland';
const trips = [{ id: 'a', title: TITEL, participants: 'G & A', start: iso(0), end: iso(39), transport: ['flug'], days },
  ...Array.from({ length: 30 }, (_, i) => ({ id: `t${i}`, title: `Toskana ${i + 1}`, participants: 'G', start: `${2000 + i}-06-03`, end: `${2000 + i}-06-17`, transport: ['pkw'], days: {} }))];
const KOPF = '#bar .nb-title, #bar .pnav-title', FTITEL = '#dlg .dlg-head h3';
const RUHE = '!document.getAnimations().some(a => a.playState === "running")';
const groesse = px => { const s = () => { const e = document.createElement('style'); e.textContent = `html { font-size: ${px}px !important; }`; document.documentElement.prepend(e); };
  if (document.documentElement) s(); else new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); s(); } }).observe(document, { childList: true }); };
const bis = async (p, bedingung, was) => { const m = await warteBis(p, bedingung, { was, max: 10000 }); if (m) throw new Error(m); };
const start = async (p, liste = trips) => {
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), liste);
  await p.reload(); await bis(p, `document.readyState === 'complete' && ${RUHE}`, 'App aufgebaut'); await navFertig(p);
  if (liste.length && await p.evaluate(() => isPhone()) && await p.locator('#side.page').isVisible()) {
    await p.locator('#side .side-row[data-id="a"]').click(); await bis(p, `currentTripId === 'a' && !phoneList && ${RUHE}`, 'Reiselogbuch offen'); await navFertig(p);
  }
};
const fensterAuf = async p => { await bis(p, `document.getElementById('dlg').open && ${RUHE}`, 'Fenster offen'); await navFertig(p); };
const zuFenster = async p => { await p.evaluate(() => { dlgDirty = () => false; dlg.close(); }); await bis(p, `!dlg.open && ${RUHE}`, 'Fenster zu'); await navFertig(p); };
const menuOffen = p => bis(p, `!!document.querySelector('.menu .mi') && ${RUHE}`, 'Menü offen');
const ablauf = async (ansicht, opts, fn) => {
  const p = await t.seite(t.b, ansicht, opts);
  try { await fn(p); } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
};

t.b = await t.browser();

// Messmodus (R-1.6): F10 leere App – ‚Neues Reiselogbuch‘ öffnet sich von selbst; danach starten und teilen
await ablauf('iPad quer', { theme: 'light', acceptDownloads: true }, async p => {
  t.ort = 'iPad quer · leer';
  await start(p, []);
  await bis(p, `dlg.open && ${RUHE}`, 'Fenster beim Start ohne Reisen').catch(() => {});
  t.ist('F10 leere App öffnet ‚Neues Reiselogbuch‘', await p.evaluate(() => dlg.open ? document.querySelector('#dlg .dlg-head h3')?.textContent : null), 'Neues Reiselogbuch', 'R-7.7');
  await zuFenster(p);
  await p.click('#sideMore'); await menuOffen(p);
  const v = await p.locator('.menu .note.halten').boundingBox();
  { const m = await langDruecken(p, { x: v.x + v.width / 2, y: v.y + v.height / 2 }, { ms: 900, offen: '.menu' }); if (m) throw new Error(m); }
  await p.locator('.menu .mi', { hasText: 'Messung starten' }).click(); await bis(p, '!!mess?.an', 'Messung läuft');
  await p.click('#sideMore'); await menuOffen(p);
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 5000 }).catch(() => null), p.locator('.menu .mi', { hasText: 'Messung beenden und teilen' }).click()]);
  t.wahr('R-1.6 F10 leere App: ‚Messung beenden und teilen‘ liefert eine Datei', !!dl, 'R-1.6');
  await t.schritt(p, 'F10 nach der Messung', async () => {});
});
// Messmodus im Zusammenspiel: Messung mit der Suche in allen Reiselogbüchern – Kopf mit App und Version, Eingaben nur als Länge, kein Text der Reisen
await ablauf('iPad quer', { theme: 'light', acceptDownloads: true }, async p => {
  t.ort = 'iPad quer · Messung';
  await start(p);
  await p.click('#sideMore'); await menuOffen(p);
  const v = await p.locator('.menu .note.halten').boundingBox();
  { const m = await langDruecken(p, { x: v.x + v.width / 2, y: v.y + v.height / 2 }, { ms: 900, offen: '.menu' }); if (m) throw new Error(m); }
  await p.locator('.menu .mi', { hasText: 'Messung starten' }).click(); await bis(p, '!!mess?.an', 'Messung läuft');
  await sucheAuf(p, '#sideMore'); await bis(p, `!!document.querySelector('#lsearch') && ${RUHE}`, 'Suche offen');
  for (const k of 'Rom') { await p.keyboard.type(k); await p.waitForTimeout(40); }
  await p.evaluate(() => { window.__mess = []; const orig = shareFiles; shareFiles = files => { window.__mess.push(...files); return orig(files); }; });
  await p.click('#sideMore'); await menuOffen(p);
  await Promise.all([p.waitForEvent('download', { timeout: 5000 }).catch(() => null), p.locator('.menu .mi', { hasText: 'Messung beenden und teilen' }).click()]);
  const f = (await p.evaluate(() => window.__mess.map(x => ({ name: x.name, content: x.content }))))[0];
  if (!f) t.fehler('R-1.6', 'Messung mit Suche: ‚Messung beenden und teilen‘ liefert keine Datei');
  else {
    t.ist('Messdatei: Kopf nennt das Reiselogbuch mit Version', f.content.split('\n')[0], /^# Messung · Reiselogbuch \d+\.\d+\.\d+ · AppDesign \d+\.\d+\.\d+ · /, 'R-1.6');
    t.wahr('Messdatei: die Eingabe ‚Rom‘ steht nur als Länge da (! eingabe 3)', /! eingabe 3$/m.test(f.content), 'R-1.6');
    for (const s of ['Rom', TITEL, 'Toskana', 'Programm', 'Ausflug', 'Hafen']) if (f.content.includes(s)) t.fehler('R-1.6', `Messdatei enthält den Text ‚${s}‘ (Datenschutz: nur Längen und ids)`);
  }
  await t.schritt(p, 'Messung mit Suche geteilt', async () => {});
});

// Titel-Blase (R-2.5): iPhone hoch bei größter Schrift – Reisetitel in der Kopfzeile, Fenster ‚Reiselogbuch einstellen‘ (L-8), Fenster eines Tages (L-3)
await ablauf('iPhone hoch', { theme: 'light' }, async p => {
  t.ort = 'iPhone hoch · Text 53';
  await p.addInitScript(groesse, 53);
  await start(p);
  const blase = async (name, opts) => {
    let r = { gekuerzt: false, errors: [] };
    await t.schritt(p, name, async () => { r = await checkTitelBlase(p, { ...opts, where: name }); t.liste(r.errors); });
    t.ist(`${name}: Titel gekürzt`, r.gekuerzt, true, 'R-2.5');
  };
  await blase(`L-2 Kopfzeile ‚${TITEL}‘`, { sel: KOPF, daneben: ['#mainMore', '#shareBtn'], esc: true });
  await p.evaluate(() => openTripDialog(db.trips[0])); await fensterAuf(p);
  await blase('L-1 Fenster ‚Reiselogbuch einstellen‘', { sel: FTITEL, daneben: ['#dlgX', '#dlgOk', '#fTitle'], esc: true });
  t.ist('L-8 nach den Tipps: Fenster offen, Reisetitel unverändert', [await p.evaluate(() => dlg.open), await p.evaluate(() => db.trips[0].title)], [true, TITEL], 'R-2.5');
  await zuFenster(p);
  await p.evaluate(d => openDayDialog(db.trips[0], d), iso(3)); await fensterAuf(p);
  t.ist('L-3 Titel des Tages', await p.textContent(FTITEL), 'Do, 27.08.2026', 'R-2.5');
  await t.schritt(p, 'L-3 Fenster eines Tages: langes Drücken', async () => titelLang(p, FTITEL));
  t.ist('L-3 die Sprechblase zeigt das ganze Datum', await p.evaluate(() => document.querySelector('.titel-blase')?.textContent ?? null), 'Do, 27.08.2026', 'R-2.5');
  await p.keyboard.press('Escape');
  await zuFenster(p);
});

// Titel antippen (R-2.7): iPad quer – Kopfzeile rollt die Reise, Titel der Seitenleiste die Liste der Reiselogbücher
await ablauf('iPad quer', { theme: 'light' }, async p => {
  await start(p);
  await t.schritt(p, 'H-1 Kopfzeile', async () => t.liste(await checkTitelOben(p, { titel: KOPF, rolle: '#app > .rolle', still: ['#side .side-list'], where: 'H-1 Kopfzeile' })));
  await t.schritt(p, 'H-2 Seitenleiste', async () => t.liste(await checkTitelOben(p, { titel: '#side .side-head h2', rolle: '#side .side-list', still: ['#app > .rolle'], where: 'H-2 Seitenleiste' })));
});

// Sperrschicht (Designrichtlinie 13): iPhone quer am oberen Rand – Mehr der Reise und Sprechblase ‚Reiselogbuch löschen‘; nichts gelöscht
await ablauf('iPhone quer', { theme: 'light' }, async p => {
  await start(p);
  const loeschenFrage = async p => { await p.evaluate(() => document.querySelector('#mainMore')?.click()); await menuOffen(p);
    await p.locator('.menu .mi', { hasText: 'Reiselogbuch löschen' }).click(); };
  await t.schritt(p, 'Sperrschicht schließt beim Loslassen', async () => t.liste(await checkSchichtOben(p, { mehr: '#mainMore', oeffner: [loeschenFrage], oben: true, where: t.ort })));
  t.ist('nichts gelöscht', await p.evaluate(() => db.trips.length), trips.length, 'R-4.4');
});

// Großanzeige (R-2.6): iPad quer, Text 28 (AX1) – jeder sichtbare Knopf der Leisten der App zeigt Icon und Namen; Loslassen über ‚Mehr‘ löst aus
await ablauf('iPad quer', { theme: 'light' }, async p => {
  t.ort = 'iPad quer · Text 28 (AX1)';
  await p.addInitScript(groesse, 28);
  await start(p);
  t.wahr('Text 28 ist AX1 (html.ts-ax)', await p.evaluate(() => document.documentElement.classList.contains('ts-ax')), 'R-2.6');
  // alle sichtbaren, nicht gesperrten Knöpfe einer Leiste (Selektor wie in ui.js: Kopfzeile, Fenster-Kopfzeile, Seitenleiste, schwebende Knöpfe)
  const knoepfe = wo => p.evaluate(wo => [...document.querySelectorAll(`:is(${wo}) button`)].filter(k => k.getClientRects().length && !k.disabled && getComputedStyle(k).visibility !== 'hidden'
    && !k.closest('[inert]')).map((k, i) => { k.dataset.pruefGross = String(i); return { i, name: (k.getAttribute('aria-label') || k.textContent || '').trim(), icon: !!k.querySelector('svg') }; }), wo);
  const jeder = async (wo, was) => {
    const liste = await knoepfe(wo);
    t.wahr(`${was}: Knöpfe gefunden (sonst prüft die Prüfung nichts)`, liste.length >= 2, 'R-2.6');
    for (const k of liste) {
      // 0,7 s drücken, merken, dann abbrechen (pointercancel) – die Großanzeige schließt ohne Auslösen
      const r = await finger(p, `[data-pruef-gross="${k.i}"]`, [['warte', 700], ['merke', 'g'], ['abbruch']]), g = r.gemerkt?.g?.gross;
      if (!g) t.fehler('R-2.6', `${was}: langes Drücken auf ‚${k.name || '(ohne Namen)'}‘ zeigt keine Großanzeige`);
      else if (!k.name) t.fehler('R-2.6', `${was}: Knopf ohne Namen (aria-label) – die Großanzeige zeigt keinen Namen`);
      else if (g.text !== k.name || g.svg !== k.icon) t.fehler('R-2.6', `${was}: Großanzeige von ‚${k.name}‘ zeigt ‚${g.text}‘${g.svg !== k.icon ? ' ohne bzw. mit fremdem Icon' : ''}`);
      if (r.klicks?.length) t.fehler('R-2.6', `${was}: Abbrechen der Großanzeige von ‚${k.name}‘ löst ${r.klicks.join(', ')} aus`);
    }
    await p.evaluate(() => document.querySelectorAll('[data-pruef-gross]').forEach(k => delete k.dataset.pruefGross));
  };
  await t.schritt(p, 'Kopfzeile und Seitenleiste', () => jeder('.nb, .pnav, .side-head, .side-search', 'Kopfzeile und Seitenleiste'));
  await t.schritt(p, 'Mehr echt auslösen', async () => {
    await finger(p, '#mainMore', [['warte', 700]], { fangen: false }); await p.waitForTimeout(300);
    t.ist('L-8 Loslassen über ‚Mehr‘ öffnet das Menü der Reise', await p.locator('.menu .mi', { hasText: 'Reiselogbuch löschen' }).count(), 1, 'R-2.6');
    for (let n = 0; n < 2 && await p.locator('.menu').count(); n++) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); }
  });
  await p.evaluate(() => openTripDialog(db.trips[0])); await fensterAuf(p);
  await t.schritt(p, 'Fenster-Kopfzeile ‚Reiselogbuch einstellen‘', () => jeder('#dlg .dlg-head', 'Fenster-Kopfzeile'));
  t.wahr('nach den Großanzeigen im Fenster ist es noch offen (Abbrechen löst nichts aus)', await p.evaluate(() => dlg.open), 'R-2.6');
  await zuFenster(p);
});
await t.ende(t.b);
