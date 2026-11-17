// Reiselogbuch-Test: ablauf-wischen – Wischaktionen der Kacheln (seit 3.57.0, AppDesign APD-30 und APD-136, R-7.8, R-1.13; Testfall-Liste
// AppDesign arbeit/APD-30 Wischaktionen Testfall-Liste.md W-1 bis W-79): die allgemeine Prüfung checkWischen (AD-Bean swipeactions, eingegraute und
// sperrende Sprechblase) in iPad quer und hoch, iPhone hoch und quer, je hell und dunkel, dazu ‚Bewegung reduzieren‘ und größte Textgröße (W-57, W-58);
// mit den Daten der App W-10, W-15, W-21, W-44 bis W-54. Grundregeln nach den Schritten (pruefe.mjs).
// Aufruf im Repo-Ordner: node tests/ablauf-wischen.mjs. Teilbar: PRUEF_GERAET=iPad oder iPhone.
// Gegenprobe W-68: PRUEF_GEGENPROBE=wischen:W-68 (Schwelle ‚Durchwischen‘ in der Prüfkopie von ui.js auf 20 %) – W-1 wird rot.
import * as pw from 'playwright';
import { pruefung, navFertig, warteBis } from '../../AppDesign/fassung/4.60.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.60.0/tests/hig.mjs';
import { checkWischen, wischenGegenprobe, checkErstFragen, textGroesseSetzen } from '../../AppDesign/fassung/4.60.0/tests/ablauf.mjs';
const t = pruefung('ablauf-wischen', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const reise = (id, title, jahr, mehr = {}) => ({ id, title, participants: 'G', start: `${jahr}-05-03`, end: `${jahr}-05-17`, transport: ['pkw'], days: {}, ...mehr });
const DREI = [reise('a', 'Australien', 2026), reise('b', 'Südtirol mit Wandergruppe und Freunden', 2025, { days: { '2025-05-04': { program: 'Wanderung Seiser Alm' } } }),
  reise('c', 'Wien Kurztrip', 2024, { days: { '2024-05-04': { program: 'Wanderung im Wienerwald' } } }), reise('d', 'Hamburg', 2023)];
const ruhig = p => warteBis(p, () => !document.getAnimations().some(a => a.playState === 'running'), { max: 3000 });
const b = await t.browser();
async function start(p, trips, settings = {}) {
  await wischenGegenprobe(p);
  await p.clock.setFixedTime(new Date('2026-05-10T10:00:00'));
  await p.goto(APP);
  await p.evaluate(([x, s]) => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a', ...s }, trips: x })), [trips, settings]);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
  if (await p.locator('#back').isVisible().catch(() => false)) { await p.click('#back'); await navFertig(p); await ruhig(p); }
}
const geraet = process.env.PRUEF_GERAET || '';
const faelle = [['iPad quer', 'light'], ['iPad hoch', 'dark'], ['iPhone hoch', 'light'], ['iPhone quer', 'dark'],
  ['iPad quer', 'dark'], ['iPad hoch', 'light'], ['iPhone hoch', 'dark'], ['iPhone quer', 'light']].filter(([a]) => !geraet || a.startsWith(geraet));
for (const [ansicht, theme] of faelle) {
  const p = await t.seite(b, ansicht, { theme });
  await start(p, DREI);
  const phone = ansicht.startsWith('iPhone');
  await t.schritt(p, 'Start', async () => {});
  const inhalt = phone ? null : await p.evaluate(() => { const r = document.getElementById('app').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.6 }; });
  t.liste(await checkWischen(p, { bean: 'wischen', aktionen: 'tripAktionen', liste: '#side', kacheln: '[data-id]', kachel: '#side .side-row[data-id="b"]', kachel2: '#side .side-row[data-id="c"]',
    kopf: '#sideMore', inhalt, nicht: ['#side .side-sec', '#side .side-head .ttl'], neuaufbau: 'renderSide()', seitenleiste: phone ? null : { aus: '#sideHide', ein: '[data-side-toggle]' },
    einstellen: async () => { const f = await p.evaluate(() => [document.querySelector('#dlg h3')?.textContent, document.querySelector('#fTitle')?.value]);
      return JSON.stringify(f) === JSON.stringify(['Reiselogbuch einstellen', 'Südtirol mit Wandergruppe und Freunden']) ? [] : [`Fenster ${JSON.stringify(f)} statt ‚Reiselogbuch einstellen‘ für Südtirol`]; },
    messe: name => t.schritt(p, name, async () => {}), ende: theme === 'light', where: t.ort }));
  await p.close();
}

// Mit den Daten der App (iPad quer und iPhone hoch hell): W-10, W-15, W-21, W-44 bis W-49, W-52, W-53; dazu W-54 (320 × 568), W-57 und W-58
const W = '#side .side-row';
const zug = (p, sel, dx, o = {}) => p.evaluate(async ([s, dx, o]) => {
  const k = document.querySelector(s); if (!k) return 'fehlt';
  const r = k.getBoundingClientRect(), x0 = r.left + r.width * 0.7, y0 = r.top + r.height / 2, ev = (typ, x) => k.dispatchEvent(new PointerEvent(typ, { pointerId: 4500, pointerType: 'touch',
    isPrimary: true, clientX: x, clientY: y0, button: 0, buttons: typ === 'pointerup' ? 0 : 1, bubbles: true, cancelable: true }));
  ev('pointerdown', x0);
  for (let i = 1; i <= 12; i++) { await new Promise(r => setTimeout(r, 16)); ev('pointermove', x0 + dx * i / 12); }
  ev('pointerup', x0 + dx); await new Promise(r => setTimeout(r, 4)); if (k.isConnected) k.click(); return 'ok';
}, [sel, dx, o]).then(async x => { await ruhig(p); await p.waitForTimeout(60); return x; });
const offen = p => p.evaluate(() => wischen.offen?.dataset.id || null);
const kapselRot = async p => { await p.click('.ad-swipeactions-kapsel.rot', { timeout: 5000 }); await ruhig(p); };
// ein Abschnitt bricht mit Meldung ab, die übrigen laufen weiter
const abschnitt = async (name, fn) => { try { await fn(); } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`, name); } };
for (const ansicht of ['iPad quer', 'iPhone hoch'].filter(a => !geraet || a.startsWith(geraet))) {
  const phone = ansicht.startsWith('iPhone');
  // W-10 (iPad): die gewählte Kachel wischen – bleibt blau, der Inhalt unverändert; W-15: ‚Reiselogbuch löschen‘ – erst jetzt entfernt
  let p = await t.seite(b, ansicht, { theme: 'light' });
  await abschnitt(t.ort, async () => {
  await start(p, DREI);
  if (!phone) {
    const titel = await p.textContent('.nb-title');
    await t.schritt(p, 'W-10 gewählte Kachel wischen', () => zug(p, `${W}[data-id="a"]`, -100));
    t.ist('W-10 gewählte Kachel offen, blau, Inhalt unverändert', [await offen(p), await p.evaluate(() => document.querySelector('#side .side-row[data-id="a"]').classList.contains('current')), await p.textContent('.nb-title')], ['a', true, titel], 'R-7.8');
    await p.keyboard.press('Escape'); await ruhig(p);
  }
  await zug(p, `${W}[data-id="c"]`, -100);
  await t.schritt(p, 'W-15 Löschen antippen', () => kapselRot(p));
  await t.schritt(p, 'W-15 Reiselogbuch löschen', async () => { await p.click('.pop button:has-text("Reiselogbuch löschen")'); await ruhig(p); await navFertig(p); });
  t.ist('W-15 gelöscht: Speicher, Liste, Anzahl im Kopf, keine Kachel offen', await p.evaluate(() => [db.trips.map(x => x.id).join(), [...side.querySelectorAll('.side-row')].map(x => x.dataset.id).join(),
    side.querySelector('.side-head small').textContent, wischen.offen, document.querySelectorAll('.ad-swipeactions-aktionen').length]), ['a,b,d', 'a,b,d', '3 Reiselogbücher', null, 0], 'R-7.8');
  // W-21: checkErstFragen findet die rote Kapsel (Kachel offen)
  t.liste(await checkErstFragen(p, { zustaende: [{ name: 'Kachel offen', open: () => zug(p, `${W}[data-id="b"]`, -100) }], key: 'reiselogbuch.v1', where: `${t.ort} W-21` }));
  await p.keyboard.press('Escape'); await ruhig(p);
  // W-45: Suchbegriff ändern bei offener Kachel – alle zu; W-44: Treffer-Kachel wischen und löschen – ‚N von M Reiselogbüchern‘
  await p.evaluate(() => openListSearch()); await ruhig(p);
  await p.fill('#lsearch', 'wand'); await ruhig(p); await p.waitForTimeout(200);
  await p.evaluate(() => document.activeElement?.blur()); await ruhig(p);
  await zug(p, `${W}[data-id="b"]`, -100);
  t.ist('W-44 Treffer-Kachel offen', await offen(p), 'b', 'R-7.8');
  await p.click('#lsearch'); await p.keyboard.type('e'); await ruhig(p); await p.waitForTimeout(200);
  t.ist('W-45 nach dem Ändern des Suchbegriffs ist keine Kachel offen', [await offen(p), await p.locator('.ad-swipeactions-aktionen').count()], [null, 0], 'R-7.8');
  await p.evaluate(() => document.activeElement?.blur()); await ruhig(p);
  const vorher = await p.textContent('#side .side-head small');
  await zug(p, `${W}[data-id="b"]`, -100);
  await t.schritt(p, 'W-44 Löschen in der Suche', () => kapselRot(p));
  await t.schritt(p, 'W-44 bestätigen', async () => { await p.click('.pop button:has-text("Reiselogbuch löschen")'); await ruhig(p); await navFertig(p); });
  t.ist('W-44 nach dem Löschen stimmt ‚N von M‘', [vorher, await p.textContent('#side .side-head small')], ([v, n]) => /^\d+ von \d+ Reiselogb/.test(n) && n !== v, 'R-7.8');
  });
  await p.close();

  // W-46: Neuaufbau (Abgleich bzw. Backup laden) bei offener Kachel – zu, Position der Liste bleibt; W-52: 30 Reiselogbücher, unterste Kachel
  p = await t.seite(b, ansicht, { theme: 'light' });
  await abschnitt(t.ort, async () => {
  const viele = Array.from({ length: 30 }, (_, i) => reise('t' + i, `Reise ${i + 1}`, 2026 - Math.floor(i / 3)));
  await start(p, viele, { lastTrip: 't12' });
  await p.evaluate(() => { const l = side.querySelector('.side-list'); l.scrollTop = 400; l.dispatchEvent(new Event('scroll')); }); await ruhig(p);
  await p.evaluate(() => render()); await ruhig(p);   // Ausgangslage: die Liste, wie die App sie nach einem Neuaufbau hinstellt (gewählter Eintrag sichtbar)
  const sicht = await p.evaluate(() => [...side.querySelectorAll('.side-row')].find(r => { const q = r.getBoundingClientRect(), l = side.querySelector('.side-list').getBoundingClientRect(); return q.top > l.top + 20 && q.bottom < l.bottom - 140; })?.dataset.id);
  await zug(p, `${W}[data-id="${sicht}"]`, -100);
  const y0 = await p.evaluate(() => side.querySelector('.side-list').scrollTop);
  await p.evaluate(() => render()); await ruhig(p);
  t.ist('W-46 Neuaufbau: keine Kachel offen, Liste an derselben Stelle', [await offen(p), await p.evaluate(() => Math.round(side.querySelector('.side-list').scrollTop))], [null, Math.round(y0)], 'R-7.8');
  await p.evaluate(() => { const l = side.querySelector('.side-list'); l.scrollTop = l.scrollHeight; l.dispatchEvent(new Event('scroll')); }); await ruhig(p);
  const unten = await p.evaluate(() => { const l = side.querySelector('.side-list').getBoundingClientRect(); return [...side.querySelectorAll('.side-row')].filter(r => r.getBoundingClientRect().bottom <= l.bottom - 30).at(-1)?.dataset.id; });
  await zug(p, `${W}[data-id="${unten}"]`, -100);
  await t.schritt(p, 'W-52 unterste Kachel: Löschen', () => kapselRot(p));
  t.ist('W-52 Sprechblase der untersten Kachel ganz im Bild', await p.evaluate(() => { const r = document.querySelector('.pop').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; }), true, 'R-4.5');
  await p.click('.pop button:has-text("Abbrechen")'); await ruhig(p);
  // W-48: Fenster offen – die Kacheln dahinter wischen nicht
  await p.evaluate(() => openTripDialog(db.trips[0])); await ruhig(p);
  await zug(p, `${W}[data-id="${unten}"]`, -100);
  t.ist('W-48 bei offenem Fenster keine Wischaktionen', [await offen(p), await p.locator('.ad-swipeactions-aktionen').count()], [null, 0], 'R-7.8');
  await p.evaluate(() => dlg.close()); await ruhig(p);
  });
  await p.close();

  // W-47: letztes Reiselogbuch über Wischen löschen – leerer Zustand; W-49: Offline-Zeile sichtbar, unterste Kachel ganz bedienbar; W-53: langer Titel
  p = await t.seite(b, ansicht, { theme: 'dark' });
  await abschnitt(t.ort, async () => {
  const lang = 'Rundreise durch Südostasien mit Stationen in Bangkok, Hanoi, Luang Prabang und Siem Reap 2026';
  await start(p, [reise('a', lang.slice(0, 80), 2026, { changedAt: Date.now(), changedOn: 'iPad' })], { lastBackup: 0 });
  await p.evaluate(() => setNet('aus')); await ruhig(p);
  const h0 = await p.evaluate(() => side.querySelector('.side-row').offsetHeight);
  await t.schritt(p, 'W-53 langer Titel wischen', () => zug(p, `${W}[data-id="a"]`, -100));
  const w53 = await p.evaluate(() => { const k = side.querySelector('.side-row'), kr = k.getBoundingClientRect(); return { h: k.offsetHeight, mitte: [...document.querySelectorAll('.ad-swipeactions-kapsel')].map(c => { const r = c.getBoundingClientRect(); return Math.abs((r.top + r.bottom) / 2 - (kr.top + kr.bottom) / 2) < 12; }),
    ganz: [...document.querySelectorAll('.ad-swipeactions-wort')].every(w => w.scrollWidth <= w.clientWidth + 1) }; });
  t.ist('W-53 Kachel behält die Höhe, Kapseln mittig, Wörter ganz', [w53.h, w53.mitte, w53.ganz], [h0, [true, true], true], 'R-7.8');
  t.ist('W-49 mit Offline-Zeile offen', await offen(p), 'a', 'R-7.8');
  await t.schritt(p, 'W-47 Löschen', () => kapselRot(p));
  await t.schritt(p, 'W-47 bestätigen', async () => { await p.click('.pop button:has-text("Reiselogbuch löschen")'); await ruhig(p); await navFertig(p); });
  t.ist('W-47 leerer Zustand, keine Kapsel (W-50)', [await p.evaluate(() => db.trips.length), await p.locator('#side .leer').count() + await p.locator('#app .leer').count() > 0, await p.locator('.ad-swipeactions-kapsel').count()], [0, true, 0], 'R-7.7');
  });
  await p.close();
}

// W-54: schmalstes iPhone 320 × 568 – offen ragt nichts hinaus, von der Kachel bleibt etwas, Sprechblase ganz im Bild
if (!geraet || geraet === 'iPhone') {
  const p = await t.seite(b, { viewport: { width: 320, height: 568 }, isMobile: true, deviceScaleFactor: 2 }, { theme: 'light' });
  await abschnitt(t.ort, async () => {
  t.ort = 'iPhone 320 × 568';
  await start(p, DREI);
  await t.schritt(p, 'W-54 Kachel offen', () => zug(p, `${W}[data-id="b"]`, -100));
  t.ist('W-54 offen, Kapseln im Bild, Kachel teilweise sichtbar', await p.evaluate(() => { const k = side.querySelector('.side-row[data-id="b"]').getBoundingClientRect();
    return [wischen.offen?.dataset.id, [...document.querySelectorAll('.ad-swipeactions-kapsel')].every(c => { const r = c.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }), k.right > 40]; }), ['b', true, true], 'R-7.8');
  await t.schritt(p, 'W-54 Löschen', () => kapselRot(p));
  t.ist('W-54 Sprechblase ganz im Bild', await p.evaluate(() => { const r = document.querySelector('.pop').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; }), true, 'R-4.5');
  await p.click('.pop button:has-text("Abbrechen")'); await ruhig(p);
  });
  await p.close();
}

// W-57: größte Textgröße – Wörter ganz, Kapseln mindestens 66 × 44, nichts ragt hinaus; W-58: ‚Bewegung reduzieren‘ – Einrasten und Schließen ohne
// Gleiten, Kapseln ohne Größenänderung (checkWischen prüft W-7 dann mit 100 %; der Bewegungswächter meldet jede Bewegung über der Grenze)
for (const ansicht of ['iPad hoch', 'iPhone hoch'].filter(a => !geraet || a.startsWith(geraet))) {
  let p = await t.seite(b, ansicht, { theme: 'light' });
  await abschnitt(t.ort, async () => {
  await start(p, DREI);
  await textGroesseSetzen(p, 'ax5');
  t.ort = `${ansicht} hell · Text 53`;
  // bei AX5 ist die offene Breite größer (Wörter) – gewischt wird 55 % der Kachel (über der halben Aktionsbreite, unter dem Durchwischen)
  const bw57 = await p.evaluate(() => side.querySelector('.side-row[data-id="b"]').offsetWidth);
  await t.schritt(p, 'W-57 Kachel offen bei AX5', () => zug(p, `${W}[data-id="b"]`, -Math.round(bw57 * 0.55)));
  t.ist('W-57 offen, Wörter ganz, Kapseln ≥ 66 × 44, alles in der Liste', await p.evaluate(() => { const l = side.querySelector('.side-list').getBoundingClientRect();
    return [wischen.offen?.dataset.id, [...document.querySelectorAll('.ad-swipeactions-wort')].every(w => w.scrollWidth <= w.clientWidth + 1),
      [...document.querySelectorAll('.ad-swipeactions-kapsel')].every(c => c.offsetWidth >= 66 && c.offsetHeight >= 44),
      [...document.querySelectorAll('.ad-swipeactions-kapsel, .ad-swipeactions-wort')].every(c => { const r = c.getBoundingClientRect(); return r.left >= l.left - 0.5 && r.right <= l.right + 0.5; })]; }), ['b', true, true, true], 'R-7.8');
  });
  await p.close();
  p = await t.seite(b, ansicht, { theme: 'light', reducedMotion: 'reduce' });
  await abschnitt(t.ort, async () => {
  t.ort = `${ansicht} hell · Bewegung reduzieren`;
  await start(p, DREI);
  t.liste(await checkWischen(p, { bean: 'wischen', aktionen: 'tripAktionen', liste: '#side', kacheln: '[data-id]', kachel: '#side .side-row[data-id="b"]', kachel2: '#side .side-row[data-id="c"]',
    kopf: '#sideMore', messe: name => t.schritt(p, name, async () => {}), where: t.ort }));
  await zug(p, `${W}[data-id="b"]`, -100);
  t.ist('W-58 nach dem Loslassen keine laufende Bewegung', await p.evaluate(() => document.getAnimations().filter(a => a.id === 'swipeactions').length), 0, 'R-7.8');
  await t.ruhig(p, 'W-58');
  });
  await p.close();
}
await t.ende(b);
