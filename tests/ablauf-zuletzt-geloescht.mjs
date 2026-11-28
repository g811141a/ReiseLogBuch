// Reiselogbuch-Test: ablauf-zuletzt-geloescht (seit 3.59.0) – RLB-126 ‚Zuletzt gelöscht‘ (R-7.10, R-4.12 Ausnahme; Testfall-Liste RLB-126/T-1 bis T-15 in
// AppDesign arbeit/0165 RLB-126 Muster.md, Abschnitt 4). Die allgemeine Prüfung checkRecentlyDeleted (AppDesign ablauf.mjs, AD-Bean recentlydeleted) in
// iPad quer hell und iPhone hoch dunkel, dazu App-Eigenes: RLB-126/T-1 Löschen aus Mehr, Kontextmenü und Wischen ohne Abfrage, danach Startreise bzw.
// Startliste, ein anderes als das aktive gelöscht → die Liste bleibt · RLB-126/T-2 Kachel bei der Suche ausgeblendet, ohne Reiselogbücher unter dem leeren
// Zustand · RLB-126/T-3 Seitenleiste nicht breiter, Backup-Kachel unten · RLB-126/T-4 iPad: das zuletzt gelöschte gleich offen, nur die Vorschau; iPhone eigene
// Seite, ‹ und Zurückwischen zur Liste · RLB-126/T-5 Wiederherstellen öffnet, an seinem Platz (Jahr), ‚geändert am …‘ · RLB-126/T-6 aus Kontextmenü und Wischen
// bleibt die Liste, beim letzten zurück zu ‚Reiselogbücher‘ · RLB-126/T-7 Abfrage mit der Zahl der Einträge, Kachel bleibt bis zur Entscheidung offen ·
// RLB-126/T-9 Abgleich (mergeData) · RLB-126/T-10 Backup und normalize, Laden (Abgleichen, Ersetzen) · RLB-126/T-11 Drehen, Seitenleiste aus und ein, Textgröße ·
// RLB-126/T-12 Esc und ⌘. schließen Kontextmenü und Sprechblase, Eingabe löst nichts aus, ⌘F wirkt nicht · RLB-126/T-13 gesperrt nie nach ‚Zuletzt gelöscht‘ ·
// RLB-126/T-14 langer Titel, 20 gelöschte: die Liste rollt, der Kopf steht (iPad quer dunkel). Stichproben iPad hoch hell und iPhone quer hell. Grundregeln nach
// jedem Schritt; Laufzeit gut 2 min je Browser.
// RLB-126/T-15 Gegenprobe: PRUEF_GEGENPROBE=zuletzt:frage (Löschen fragt erst) bzw. zuletzt:frist (Frist 31 Tage) – RLB-126/T-1 bzw. RLB-126/T-8 werden rot.
// Aufruf im Repo-Ordner: node tests/ablauf-zuletzt-geloescht.mjs
import * as pw from 'playwright';
import { pruefung, navFertig, ruhe, warteBis } from '../../AppDesign/fassung/5.0.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/5.0.0/tests/hig.mjs';
import { checkRecentlyDeleted, recentlyDeletedGegenprobe, langDruecken, menueZu, ansage, textGroesseSetzen } from '../../AppDesign/fassung/5.0.0/tests/ablauf.mjs';
import { mausWieFinger, mausKlickSpaet } from '../../AppDesign/fassung/5.0.0/tests/safari.mjs';
const t = pruefung('ablauf-zuletzt-geloescht', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const KEY = 'reiselogbuch.v1', NOUNS = ['Reiselogbuch', 'Reiselogbücher'];
const iso = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
const tage = (y, m, d, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [iso(y, m, d + i), { weather: '☀️', program: `Programm ${i + 1}` }]));
const TRIPS = [
  { id: 'a', title: 'Australien', participants: 'G und M', start: iso(2026, 8, 24), end: iso(2026, 9, 6), transport: ['flug'], days: tage(2026, 8, 24, 3), fazit: 'Schön' },
  { id: 'b', title: 'Toskana', participants: 'G und M', start: iso(2027, 5, 3), end: iso(2027, 5, 10), transport: ['pkw'], days: {} },
  { id: 'c', title: 'Wien', participants: 'G', start: iso(2026, 3, 12), end: iso(2026, 3, 15), transport: ['zug'], days: tage(2026, 3, 12, 2) },
  { id: 'd', title: 'Ostsee', participants: 'G', start: iso(2025, 7, 1), end: iso(2025, 7, 7), transport: ['pkw'], days: tage(2025, 7, 2, 1) },
  { id: 'e', title: 'Schottland', participants: 'G', start: iso(2024, 6, 1), end: iso(2024, 6, 10), transport: ['flug'], days: tage(2024, 6, 1, 1), locked: true }];
const ruhig = async p => { await navFertig(p); await ruhe(p); };
const lade = async (p, trips = TRIPS, settings = {}) => {
  await recentlyDeletedGegenprobe(p);   // RLB-126/T-15 (nur mit PRUEF_GEGENPROBE=zuletzt:…)
  await p.goto(APP);
  await p.evaluate(([k, trips, s]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a', ...s }, trips })); }, [KEY, trips, settings]);
  await p.reload(); await p.waitForTimeout(400); await ruhig(p);
};
const daten = p => p.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
const papierkorb = async p => ((await daten(p)).recentlyDeleted || []).map(x => x.id);
const popDa = p => p.evaluate(() => !!document.querySelector('.pop:not(.zu-geist)'));
const zu = async p => { for (let n = 0; n < 4 && await p.evaluate(() => !!document.querySelector('.menu, .pop') || msg.open || dlg.open); n++) { await p.keyboard.press('Escape'); await p.waitForTimeout(350); } await menueZu(p); await ruhig(p); };
const lang = async (p, sel) => { const m = await langDruecken(p, sel); if (m) throw new Error(m); };
const menuePunkt = async (p, text) => { await p.locator('.menu:not(.zu-geist) .mi', { hasText: text }).first().click(); await p.waitForTimeout(400); await ruhig(p); };
const menueTexte = p => p.evaluate(() => [...document.querySelectorAll('.menu:not(.zu-geist):not(.submenu) .mi')].map(m => m.textContent.trim()));
const zeile = id => `#side .side-row[data-id="${id}"]`;
const kopf = p => p.evaluate(() => [side.querySelector('.side-head h2')?.textContent.trim() || '', side.querySelector('.side-head .ttl small')?.textContent.trim() || '']);
const reihen = p => p.evaluate(() => [...side.querySelectorAll('.side-list [data-id]')].map(r => r.dataset.id).join());
const titel = p => p.evaluate(() => document.querySelector('#app .nb-title, #app .pnav-title')?.textContent.trim() || '');
const kachelZl = p => p.evaluate(() => { const e = side.querySelector('.ad-recentlydeleted-entry'); if (!e) return null;
  return { letzte: e.parentElement.lastElementChild === e, zahl: e.querySelector('.ad-recentlydeleted-count')?.textContent.trim() }; });
const oeffneZl = async p => { await p.click('#side .ad-recentlydeleted-entry'); await p.waitForTimeout(400); await ruhig(p); };
// Wischen wie mit dem Finger (Zeiger-Ereignisse, wie ablauf-wischen) und die Kapseln der offenen Kachel
const zug = (p, sel, dx) => p.evaluate(async ([s, dx]) => {
  const k = document.querySelector(s); if (!k) return 'fehlt';
  const r = k.getBoundingClientRect(), x0 = r.left + r.width * 0.7, y0 = r.top + r.height / 2, ev = (typ, x) => k.dispatchEvent(new PointerEvent(typ, { pointerId: 4600, pointerType: 'touch',
    isPrimary: true, clientX: x, clientY: y0, button: 0, buttons: typ === 'pointerup' ? 0 : 1, bubbles: true, cancelable: true }));
  ev('pointerdown', x0);
  for (let i = 1; i <= 12; i++) { await new Promise(r => setTimeout(r, 16)); ev('pointermove', x0 + dx * i / 12); }
  ev('pointerup', x0 + dx); await new Promise(r => setTimeout(r, 4)); if (k.isConnected) k.click(); return 'ok';
}, [sel, dx]).then(async x => { await warteBis(p, () => !document.getAnimations().some(a => a.playState === 'running'), { max: 3000 }); await p.waitForTimeout(80); return x; });
const kapseln = p => p.evaluate(() => [...document.querySelectorAll('.ad-swipeactions-button')].map(c => [c.getAttribute('aria-label'), c.parentElement.querySelector('.ad-swipeactions-title')?.textContent.trim(), c.classList.contains('destructive')]));
const loeschenMehr = async p => { await p.click('#mainMore'); await p.waitForSelector('.menu .mi', { timeout: 4000 }); await p.waitForTimeout(350); await menuePunkt(p, 'Reiselogbuch löschen'); };
const loeschenKontext = async (p, id) => { await lang(p, zeile(id)); await menuePunkt(p, 'Reiselogbuch löschen'); };
const loeschenWischen = async (p, id) => { await zug(p, zeile(id), -150); await p.click('.ad-swipeactions-button.destructive', { timeout: 5000 }); await p.waitForTimeout(400); await ruhig(p); };
// RLB-126/T-1: keine Sprechblase, Eintrag in ‚Zuletzt gelöscht‘
const geloescht = async (p, id, wie) => {
  t.ist(`RLB-126/T-1 ${wie}: keine Sprechblase`, await popDa(p), false, 'R-4.12');
  if (await popDa(p)) await zu(p);
  const d = await daten(p), x = (d.recentlyDeleted || []).find(y => y.id === id);
  t.ist(`RLB-126/T-1 ${wie}: in ‚Zuletzt gelöscht‘ mit Inhalt, Zeitpunkt und Gerät, nicht mehr in der Liste`,
    [!!x, x?.item?.title === TRIPS.find(y => y.id === id).title && Object.keys(x?.item?.days || {}).length === Object.keys(TRIPS.find(y => y.id === id).days).length,
      Number.isFinite(x?.at), typeof x?.on === 'string' && !!x?.on, d.trips.some(y => y.id === id)], [true, true, true, true, false], 'R-7.10');
};

const b = await t.browser();

// ---------- Hauptfälle iPad quer hell ----------
{
  const p = await t.seite(b, 'iPad quer', { theme: 'light' });
  try {
    await lade(p);
    await t.schritt(p, 'RLB-126/T-2 Start: keine Kachel ‚Zuletzt gelöscht‘', async () => {});
    t.ist('RLB-126/T-2 nichts gelöscht: keine Kachel ‚Zuletzt gelöscht‘', await kachelZl(p), null, 'R-7.10');
    // allgemeine Prüfung (AppDesign): RLB-126/T-1 bis T-8 über das Kontextmenü; danach steht der Speicher wieder wie vorher
    t.liste(await checkRecentlyDeleted(p, { key: KEY, list: 'trips', ids: ['b', 'd'], nouns: NOUNS, messe: name => t.schritt(p, name, async () => {}), where: t.ort }));
    // RLB-126/T-1 aus Mehr (offenes Reiselogbuch): danach die Startreise; Ansage
    t.ist('RLB-126/T-1 Australien ist offen', await titel(p), 'Australien', 'R-7.10');
    await t.schritt(p, 'RLB-126/T-1 Mehr → ‚Reiselogbuch löschen‘', () => loeschenMehr(p));
    await geloescht(p, 'a', 'aus Mehr');
    t.ist('RLB-126/T-1 danach die Startreise (pickStartTrip)', await p.evaluate(() => [currentTripId === pickStartTrip()?.id, document.querySelector('.nb-title')?.textContent.trim() === getTrip(currentTripId)?.title]), [true, true], 'R-7.10');
    t.wahr(`RLB-126/T-1 Ansage für VoiceOver nach dem Löschen (${await ansage(p, 200)})`, /‚Australien‘ nach ‚Zuletzt gelöscht‘ verschoben/.test(await ansage(p) || ''), 'R-1.8');
    const aktiv = await p.evaluate(() => currentTripId), aktivTitel = await titel(p);
    // RLB-126/T-1 aus dem Kontextmenü und mit Wischen: ein anderes als das aktive – die Liste bleibt stehen, das aktive bleibt
    await t.schritt(p, 'RLB-126/T-1 Toskana lange drücken → ‚Reiselogbuch löschen‘', () => loeschenKontext(p, 'b'));
    await geloescht(p, 'b', 'aus dem Kontextmenü');
    t.ist('RLB-126/T-1 aus dem Kontextmenü: das aktive bleibt offen', [await p.evaluate(() => currentTripId), await titel(p)], [aktiv, aktivTitel], 'R-7.10');
    await t.schritt(p, 'RLB-126/T-1 Ostsee wischen → rote Kapsel ‚Löschen‘', () => loeschenWischen(p, 'd'));
    await geloescht(p, 'd', 'mit Wischen');
    t.ist('RLB-126/T-1 mit Wischen: das aktive bleibt, keine Kachel offen', [await p.evaluate(() => currentTripId), await titel(p), await p.evaluate(() => swipe.openRow)], [aktiv, aktivTitel, null], 'R-7.8');
    // RLB-126/T-2 Kachel: letzte der Liste, Anzahl; bei der Suche in allen ausgeblendet
    t.ist('RLB-126/T-2 Kachel ‚Zuletzt gelöscht‘ als letzte der Liste mit ‚3‘', await kachelZl(p), { letzte: true, zahl: '3' }, 'R-7.10');
    await t.schritt(p, 'RLB-126/T-2 Suche in allen', async () => { await p.evaluate(() => openListSearch()); await p.fill('#lsearch', 'Wien'); await p.waitForTimeout(400); await p.evaluate(() => document.activeElement?.blur()); await ruhig(p); });
    t.ist('RLB-126/T-2 bei der Suche in allen ist die Kachel ausgeblendet', await kachelZl(p), null, 'R-7.10');
    await t.schritt(p, 'RLB-126/T-2 Suche beenden', async () => { await p.click('#lsclose'); await ruhig(p); });
    // RLB-126/T-3 Liste
    const breite = await p.evaluate(() => side.offsetWidth);
    await t.schritt(p, 'RLB-126/T-3 ‚Zuletzt gelöscht‘ antippen', () => oeffneZl(p));
    t.ist('RLB-126/T-3 Kopf ‚Zuletzt gelöscht‘ · ‚3 Reiselogbücher‘, zuletzt gelöschte oben', [await kopf(p), await reihen(p)], [['Zuletzt gelöscht', '3 Reiselogbücher'], 'd,b,a'], 'R-7.10');
    t.ist('RLB-126/T-3 Seitenleiste nicht breiter; Backup-Kachel bzw. Offline-Zeile unten (R-1.5)', await p.evaluate(w => { const f = side.querySelector('.side-foot'), l = side.querySelector('.side-list');
      return [side.offsetWidth <= w + 1, !!f && l.compareDocumentPosition(f) === Node.DOCUMENT_POSITION_FOLLOWING && f.getBoundingClientRect().bottom >= l.getBoundingClientRect().bottom - 1]; }, breite), [true, true], 'R-1.5');
    // RLB-126/T-4 iPad: das zuletzt gelöschte gleich offen – nur die Vorschau mit Hinweis
    const vorschau = () => p.evaluate(() => ({ offen: deletedOpen, blau: side.querySelector('.side-row.current')?.dataset.id || null, titel: document.querySelector('#app .nb-title, #app .pnav-title')?.textContent.trim(),
      hinweis: !!document.querySelector('#app .ad-recentlydeleted-notice .ad-recentlydeleted-restore'), seite: !!document.querySelector('#app .lockpage .rt'),
      ohne: !document.querySelector('#app #mainMore, #app #shareBtn, #app #pdfBtn, #app table.days, #app #pdays, #app textarea, #app input') }));
    t.ist('RLB-126/T-4 iPad: das zuletzt gelöschte (Ostsee) gleich offen, blau; nur die Vorschau mit Hinweis, keine Felder, kein Mehr, keine Ausgabe',
      await vorschau(), { offen: 'd', blau: 'd', titel: 'Ostsee', hinweis: true, seite: true, ohne: true }, 'R-7.10');
    await t.schritt(p, 'RLB-126/T-4 Toskana antippen', async () => { await p.click(zeile('b')); await p.waitForTimeout(400); await ruhig(p); });
    t.ist('RLB-126/T-4 Toskana in der Vorschau', await vorschau(), { offen: 'b', blau: 'b', titel: 'Toskana', hinweis: true, seite: true, ohne: true }, 'R-7.10');
    // RLB-126/T-7 Abfrage mit der Zahl der Einträge; RLB-126/T-12 Esc, ⌘. und Abbrechen schließen, Eingabe löst nichts aus
    const frage = async (id, weg) => { await lang(p, zeile(id)); await menuePunkt(p, 'Endgültig löschen');
      const r = await p.evaluate(() => { const q = document.querySelector('.pop:not(.zu-geist)'); return q ? [q.querySelector('p')?.textContent.trim(), [...q.querySelectorAll('button')].map(x => x.textContent.trim())] : null; });
      if (weg === 'Enter') { await p.keyboard.press('Enter'); await p.waitForTimeout(400); t.ist('RLB-126/T-12 Eingabe löst ‚Endgültig löschen‘ nicht aus (R-4.7)', (await papierkorb(p)).includes(id), true, 'R-4.7'); weg = 'Escape'; }
      if (weg === 'Abbrechen') await p.locator('.pop:not(.zu-geist) button', { hasText: /^Abbrechen$/ }).click(); else await p.keyboard.press(weg);
      await p.waitForTimeout(400); await ruhig(p);
      t.ist(`RLB-126/T-12 ${weg} schließt die Sprechblase, nichts gelöscht`, [await popDa(p), (await papierkorb(p)).includes(id)], [false, true], 'R-4.12');
      return r; };
    const ENDE = 'endgültig löschen? Das kann nicht rückgängig gemacht werden.', KNOEPFE = ['Endgültig löschen', 'Abbrechen'];
    t.ist('RLB-126/T-7 viele Einträge (ohne ‚Erst Backup erstellen‘)', await frage('a', 'Escape'), [`‚Australien‘ mit allen 3 Einträgen ${ENDE}`, KNOEPFE], 'R-4.12');
    t.ist('RLB-126/T-7 1 Eintrag', await frage('d', 'Abbrechen'), [`‚Ostsee‘ mit 1 Eintrag ${ENDE}`, KNOEPFE], 'R-4.12');
    t.ist('RLB-126/T-7 ohne Einträge', await frage('b', 'Meta+Period'), [`‚Toskana‘ ohne Einträge ${ENDE}`, KNOEPFE], 'R-4.12');
    await frage('d', 'Enter');
    await t.schritt(p, 'RLB-126/T-12 Kontextmenü mit Esc schließen', async () => { await lang(p, zeile('a')); await p.keyboard.press('Escape'); await p.waitForTimeout(400); await ruhig(p); });
    t.ist('RLB-126/T-12 Esc schließt das Kontextmenü', await p.evaluate(() => !!document.querySelector('.menu:not(.zu-geist)')), false, 'R-4.7');
    // RLB-126/T-7 mit Wischen: die Kachel bleibt bis zur Entscheidung offen (R-7.8)
    await t.schritt(p, 'RLB-126/T-7 Australien wischen → ‚Löschen‘', async () => { await zug(p, zeile('a'), -150); await p.click('.ad-swipeactions-button.destructive'); await p.waitForTimeout(400); await ruhig(p); });
    t.ist('RLB-126/T-7 Wischen: Sprechblase, die Kachel bleibt offen', [await popDa(p), await p.evaluate(() => swipe.openRow?.dataset.id || null)], [true, 'a'], 'R-7.8');
    await t.schritt(p, 'RLB-126/T-7 Abbrechen', async () => { await p.locator('.pop:not(.zu-geist) button', { hasText: /^Abbrechen$/ }).click(); await p.waitForTimeout(400); await ruhig(p); });
    t.ist('RLB-126/T-7 nach ‚Abbrechen‘ nichts gelöscht, Kachel zu', [(await papierkorb(p)).length, await p.evaluate(() => swipe.openRow)], [3, null], 'R-4.12');
    // RLB-126/T-12 ⌘F wirkt in ‚Zuletzt gelöscht‘ nicht
    await t.schritt(p, 'RLB-126/T-12 ⌘F', async () => { await p.keyboard.press('Meta+f'); await p.waitForTimeout(400); await ruhig(p); });
    t.ist('RLB-126/T-12 ⌘F öffnet keine Suche, ‚Zuletzt gelöscht‘ bleibt', [await p.evaluate(() => !!document.querySelector('#search, #lsearch')), (await kopf(p))[0]], [false, 'Zuletzt gelöscht'], 'R-4.7');
    // RLB-126/T-11 Drehen, Seitenleiste aus und ein, Textgröße
    const bleibt = async was => t.ist(`RLB-126/T-11 ${was}: Liste und Vorschau bleiben, Toskana gewählt`, await p.evaluate(() => [deletedView, deletedOpen, !!document.querySelector('#app .ad-recentlydeleted-notice')]), [true, 'b', true], 'R-8.1');
    const vp = p.viewportSize();
    await t.schritt(p, 'RLB-126/T-11 drehen (hoch)', async () => { await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(700); await ruhig(p); });
    await bleibt('hoch');
    await t.schritt(p, 'RLB-126/T-11 zurückdrehen', async () => { await p.setViewportSize(vp); await p.waitForTimeout(700); await ruhig(p); });
    await bleibt('quer');
    t.ist('RLB-126/T-11 nach dem Drehen: Seitenleiste ‚Zuletzt gelöscht‘, Toskana blau', [(await kopf(p))[0], await p.evaluate(() => side.querySelector('.side-row.current')?.dataset.id)], ['Zuletzt gelöscht', 'b'], 'R-8.1');
    await t.schritt(p, 'RLB-126/T-11 Seitenleiste ausblenden', async () => { await p.click('#sideHide'); await p.waitForTimeout(500); await ruhig(p); });
    await t.schritt(p, 'RLB-126/T-11 Seitenleiste einblenden', async () => { await p.click('[data-side-toggle]'); await p.waitForTimeout(500); await ruhig(p); });
    await bleibt('Seitenleiste aus und ein');
    t.ist('RLB-126/T-11 nach aus und ein: Seitenleiste ‚Zuletzt gelöscht‘', (await kopf(p))[0], 'Zuletzt gelöscht', 'R-8.1');
    await t.schritt(p, 'RLB-126/T-11 Textgröße AX3', () => textGroesseSetzen(p, 'ax3'));
    await bleibt('Textgröße AX3');
    await t.schritt(p, 'RLB-126/T-11 Textgröße zurück', () => textGroesseSetzen(p, null));
    // RLB-126/T-5 Wiederherstellen aus der Vorschau: öffnet, an seinem Platz, ‚geändert am …‘ neu
    const t0 = await p.evaluate(() => Date.now());
    await t.schritt(p, 'RLB-126/T-5 ‚Wiederherstellen‘ (Toskana)', async () => { await p.click('#app .ad-recentlydeleted-restore'); await p.waitForTimeout(400); await ruhig(p); });
    t.ist('RLB-126/T-5 Toskana offen, Seitenleiste ‚Reiselogbücher‘, unter 2027, ‚geändert am …‘, aus deleted entfernt', await p.evaluate(t0 => {
      const r = side.querySelector('.side-row[data-id="b"]'); let h = r?.previousElementSibling; while (h && !h.matches('.side-sec')) h = h.previousElementSibling;
      return [currentTripId, document.querySelector('.nb-title')?.textContent.trim(), side.querySelector('.side-head h2')?.textContent.trim(), h?.textContent.trim(),
        /^geändert am /.test(r?.querySelector('.chg')?.textContent || ''), getTrip('b')?.changedAt >= t0, db.deleted.some(x => x.id === 'b'), !!document.querySelector('#app .ad-recentlydeleted-notice')]; }, t0),
      ['b', 'Toskana', 'Reiselogbücher', '2027', true, true, false, false], 'R-7.10');
    t.ist('RLB-126/T-2 nach dem Wiederherstellen: ‚2‘', await kachelZl(p), { letzte: true, zahl: '2' }, 'R-7.10');
    // RLB-126/T-6 Wiederherstellen aus Kontextmenü und Wischen: die Liste bleibt, beim letzten zurück zu ‚Reiselogbücher‘
    await t.schritt(p, 'RLB-126/T-6 ‚Zuletzt gelöscht‘ antippen', () => oeffneZl(p));
    await t.schritt(p, 'RLB-126/T-6 Australien lange drücken → ‚Wiederherstellen‘', async () => { await lang(p, zeile('a'));
      t.ist('RLB-126/T-6 Kontextmenü eines gelöschten', await menueTexte(p), ['Wiederherstellen', 'Endgültig löschen'], 'R-4.2');
      await menuePunkt(p, 'Wiederherstellen'); });
    t.ist('RLB-126/T-6 aus dem Kontextmenü: die Liste bleibt, Australien wieder in der Liste', [await kopf(p), await reihen(p), await p.evaluate(() => !!getTrip('a'))], [['Zuletzt gelöscht', '1 Reiselogbuch'], 'd', true], 'R-7.10');
    await t.schritt(p, 'RLB-126/T-6 Ostsee wischen', () => zug(p, zeile('d'), -150));
    t.ist('RLB-126/T-6 Kapseln ‚Wiederherstellen‘ · ‚Löschen‘ (rot)', await kapseln(p), [['Wiederherstellen', 'Wiederherstellen', false], ['Endgültig löschen', 'Löschen', true]], 'R-7.8');
    await t.schritt(p, 'RLB-126/T-6 Kapsel ‚Wiederherstellen‘', async () => { await p.locator('.ad-swipeactions-button').first().click(); await p.waitForTimeout(400); await ruhig(p); });
    t.ist('RLB-126/T-6 das letzte wiederhergestellt: zurück zu ‚Reiselogbücher‘, keine Kachel ‚Zuletzt gelöscht‘', [(await kopf(p))[0], await kachelZl(p), await p.evaluate(() => !!getTrip('d'))], ['Reiselogbücher', null, true], 'R-7.10');
    // RLB-126/T-13 gesperrt: Löschen ausgeblendet, deleteTrip tut nichts
    await t.schritt(p, 'RLB-126/T-13 Schottland (gesperrt) lange drücken', () => lang(p, zeile('e')));
    t.ist('RLB-126/T-13 gesperrt: kein ‚Reiselogbuch löschen‘ im Kontextmenü', await menueTexte(p), ['Reiselogbuch entsperren'], 'R-4.10');
    await zu(p);
    await p.evaluate(() => deleteTrip(getTrip('e')));
    t.ist('RLB-126/T-13 gesperrt: deleteTrip verschiebt nicht nach ‚Zuletzt gelöscht‘', [await papierkorb(p), await p.evaluate(() => !!getTrip('e'))], [[], true], 'R-7.10');
    // RLB-126/T-9 Abgleich (mergeData): gelöscht, wiederhergestellt, endgültig gelöscht, danach geändert, gesperrt
    t.ist('RLB-126/T-9 Abgleich', await p.evaluate(() => {
      const T = (m = {}) => ({ id: 'x', title: 'Island', participants: 'G', start: '2026-06-01', end: '2026-06-03', transport: [], days: { '2026-06-01': { program: 'Geysir' } }, changedAt: 1000, changedOn: 'iPad', ...m });
      const A = { settings: {}, trips: [], deleted: [{ id: 'x', at: 2000, on: 'iPad' }], recentlyDeleted: [{ id: 'x', item: T(), at: 2000, on: 'iPad' }] };
      const B = { settings: {}, trips: [T()], deleted: [], recentlyDeleted: [] };
      const r1 = mergeData(structuredClone(B), structuredClone(A)).data;
      const r2 = mergeData(structuredClone(r1), { settings: {}, trips: [T({ changedAt: 3000 })], deleted: [], recentlyDeleted: [] }).data;
      const r3 = mergeData(structuredClone(r1), { settings: {}, trips: [], deleted: [{ id: 'x', at: 2000, on: 'iPad', purged: true }], recentlyDeleted: [] }).data;
      const m4 = mergeData({ settings: {}, trips: [T({ changedAt: 2500 })], deleted: [], recentlyDeleted: [] }, structuredClone(A));
      const m5 = mergeData({ settings: {}, trips: [T({ locked: true, changedAt: 1500 })], deleted: [], recentlyDeleted: [] }, structuredClone(A));
      const m6 = mergeData(structuredClone(A), { settings: {}, trips: [T({ locked: true, changedAt: 1500 })], deleted: [], recentlyDeleted: [] });
      const ids = d => [d.trips.map(x => x.id).join(), d.recentlyDeleted.map(x => x.id).join()];
      return { geloescht: [...ids(r1), r1.recentlyDeleted[0]?.item.days['2026-06-01']?.program], wieder: ids(r2), endgueltig: ids(r3), geaendert: [...ids(m4.data), m4.stats.keptChanged.length],
        gesperrtHier: [...ids(m5.data), m5.stats.keptProtected.length], gesperrtDrueben: [...ids(m6.data), m6.stats.restored.length] }; }),
      { geloescht: ['', 'x', 'Geysir'], wieder: ['x', ''], endgueltig: ['', ''], geaendert: ['x', '', 1], gesperrtHier: ['x', '', 1], gesperrtDrueben: ['x', '', 1] }, 'R-9.3');
    // RLB-126/T-10 Backup: mit Löschdatum, altes Backup ohne das Feld → leer; Laden übernimmt es, Abgelaufenes fällt weg
    await t.schritt(p, 'RLB-126/T-10 Wien löschen', () => loeschenKontext(p, 'c'));
    t.ist('RLB-126/T-10 Backup enthält ‚Zuletzt gelöscht‘ mit Löschdatum; normalize: ohne Feld leer, Ungültiges fällt weg', await p.evaluate(() => {
      const f = JSON.parse(backupFile().content).recentlyDeleted;
      return [f?.map(x => x.id), Number.isFinite(f?.[0]?.at), f?.[0]?.item?.title, normalize({ trips: [] }).recentlyDeleted, normalize({ trips: [], recentlyDeleted: [{ id: 'y' }, { id: 'z', item: { title: 'Z' }, at: 5 }, 'x'] }).recentlyDeleted.map(x => x.id)]; }),
      [['c'], true, 'Wien', [], ['z']], 'R-9.2');
    const datei = async (wahl, extra) => {
      const d = await daten(p), alt = Date.now() - 31 * 86400000;
      const inhalt = JSON.stringify({ settings: {}, trips: d.trips, deleted: [...(d.deleted || []), { id: 'q', at: alt, on: 'iPhone' }, { id: 'r', at: Date.now(), on: 'iPhone' }],
        recentlyDeleted: [{ id: 'q', item: { ...TRIPS[0], id: 'q', title: 'Abgelaufen' }, at: alt, on: 'iPhone' }, { id: 'r', item: { ...TRIPS[0], id: 'r', title: extra }, at: Date.now(), on: 'iPhone' }],
        savedAt: Date.now(), savedOn: 'iPhone' });
      await p.click('#sideMore'); await p.waitForSelector('.menu .mi', { timeout: 4000 }); await p.waitForTimeout(300);
      const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
      await chooser.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(inhalt) });
      await p.waitForSelector('.pop', { timeout: 4000 }); await p.waitForTimeout(400);
      await p.locator('.pop button', { hasText: wahl }).click(); await p.waitForTimeout(500);
      if (await p.evaluate(() => msg.open || dlg.open)) await zu(p);
      await ruhig(p);
    };
    await t.schritt(p, 'RLB-126/T-10 Backup laden → Abgleichen', () => datei('Abgleichen', 'Neuseeland'));
    t.ist('RLB-126/T-10 Abgleichen: ‚Zuletzt gelöscht‘ übernommen, Abgelaufenes fällt weg', await p.evaluate(() => recentlyDeleted.items.map(x => x.id).sort().join()), 'c,r', 'R-9.2');
    await t.schritt(p, 'RLB-126/T-10 Backup laden → Ersetzen', () => datei('Ersetzen', 'Tasmanien'));
    t.ist('RLB-126/T-10 Ersetzen: ‚Zuletzt gelöscht‘ aus dem Backup, Abgelaufenes fällt weg', await p.evaluate(() => [recentlyDeleted.items.map(x => x.id).join(), recentlyDeleted.items[0]?.item.title]), ['r', 'Tasmanien'], 'R-9.2');
    t.ist('RLB-126/T-10 Kachel ‚Zuletzt gelöscht‘ nach dem Laden mit ‚1‘', await kachelZl(p), { letzte: true, zahl: '1' }, 'R-7.10');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}

// ---------- RLB-126/T-2 leerer Zustand und RLB-126/T-14 langer Titel, 20 gelöschte (iPad quer dunkel) ----------
{
  const p = await t.seite(b, 'iPad quer', { theme: 'dark' });
  try {
    await lade(p, [TRIPS[1]], { lastTrip: 'b' });
    await t.schritt(p, 'RLB-126/T-2 das einzige Reiselogbuch löschen (Mehr)', () => loeschenMehr(p));
    t.ist('RLB-126/T-2 ohne Reiselogbücher: Kachel ‚Zuletzt gelöscht‘ unter dem leeren Zustand', await p.evaluate(() => { const e = side.querySelector('.ad-recentlydeleted-entry'), l = side.querySelector('.side-list .leer');
      return [!!e, !!l && !!e && e.getBoundingClientRect().top >= l.getBoundingClientRect().bottom - 1, e?.parentElement.lastElementChild === e]; }), [true, true, true], 'R-7.10');
    const LANG = 'Australien Neuseeland Tasmanien Fidschi und Neukaledonien mit der ganzen Familie und allen Freunden';
    const viele = Array.from({ length: 20 }, (_, i) => ({ id: 'v' + i, title: i ? `Reise ${i + 1}` : LANG, participants: 'G', start: iso(2026 - (i % 5), 5, 1 + i), end: iso(2026 - (i % 5), 5, 3 + i), transport: ['pkw'], days: {} }));
    await lade(p, [...viele, TRIPS[2]], { lastTrip: 'c' });
    await p.evaluate(ids => { for (const id of ids) deleteTrip(getTrip(id)); }, viele.map(x => x.id).reverse());
    await ruhig(p);
    await t.schritt(p, 'RLB-126/T-14 ‚Zuletzt gelöscht‘ mit 20 Einträgen und langem Titel', () => oeffneZl(p));
    t.ist('RLB-126/T-14 20 Einträge, der lange Titel oben', [await kopf(p), (await reihen(p)).split(',')[0]], [['Zuletzt gelöscht', '20 Reiselogbücher'], 'v0'], 'R-7.10');
    const vorher = await p.evaluate(() => Math.round(side.querySelector('.side-head').getBoundingClientRect().top));
    await t.schritt(p, 'RLB-126/T-14 Liste ans Ende rollen', async () => { await p.evaluate(() => { const l = side.querySelector('.side-list'); l.scrollTop = l.scrollHeight; l.dispatchEvent(new Event('scroll')); }); await ruhig(p); });
    t.ist('RLB-126/T-14 die Liste rollt, der Kopf steht, die letzte Kachel ist zu sehen', await p.evaluate(v => { const l = side.querySelector('.side-list'), r = [...l.querySelectorAll('[data-id]')].pop().getBoundingClientRect();
      return [l.scrollTop > 0, Math.round(side.querySelector('.side-head').getBoundingClientRect().top) === v, r.bottom <= l.getBoundingClientRect().bottom + 1]; }, vorher), [true, true, true], 'R-7.10');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}

// ---------- iPhone hoch dunkel: Mehr → Startliste, eigene Seite, ‹ und Zurückwischen; allgemeine Prüfung ----------
{
  const p = await t.seite(b, 'iPhone hoch', { theme: 'dark' });
  const startliste = async () => { for (let n = 0; n < 3 && await p.locator('#back').isVisible().catch(() => false); n++) { await p.click('#back'); await p.waitForTimeout(500); await ruhig(p); }
    if (await p.locator('.ad-recentlydeleted-back').isVisible().catch(() => false)) { await p.click('.ad-recentlydeleted-back'); await p.waitForTimeout(500); await ruhig(p); } };
  try {
    await lade(p);
    t.liste(await checkRecentlyDeleted(p, { key: KEY, list: 'trips', ids: ['b', 'd'], nouns: NOUNS, start: startliste, messe: name => t.schritt(p, name, async () => {}), where: t.ort }));
    await startliste();
    await t.schritt(p, 'RLB-126/T-1 Australien öffnen', async () => { await p.click(zeile('a')); await p.waitForTimeout(500); await ruhig(p); });
    await t.schritt(p, 'RLB-126/T-1 Mehr → ‚Reiselogbuch löschen‘', () => loeschenMehr(p));
    await geloescht(p, 'a', 'iPhone aus Mehr');
    t.ist('RLB-126/T-1 iPhone: danach die Startliste', await p.evaluate(() => [phoneList, side.classList.contains('page'), side.querySelector('.side-head h2')?.textContent.trim()]), [true, true, 'Reiselogbücher'], 'R-7.10');
    t.ist('RLB-126/T-2 iPhone: Kachel ‚Zuletzt gelöscht‘ als letzte mit ‚1‘', await kachelZl(p), { letzte: true, zahl: '1' }, 'R-7.10');
    await t.schritt(p, 'RLB-126/T-3 iPhone: ‚Zuletzt gelöscht‘ antippen', () => oeffneZl(p));
    t.ist('RLB-126/T-3 iPhone: eigene Seite ‚Zuletzt gelöscht‘, nichts gewählt', [await kopf(p), await p.evaluate(() => [deletedOpen, !!side.querySelector('.side-row.current')])], [['Zuletzt gelöscht', '1 Reiselogbuch'], [null, false]], 'R-7.10');
    const seite = () => p.evaluate(() => [document.querySelector('#app #back')?.getAttribute('aria-label') || null, document.querySelector('#app .pnav-title')?.textContent.trim() || null,
      !!document.querySelector('#app .ad-recentlydeleted-notice .ad-recentlydeleted-restore'), !document.querySelector('#app #mainMore, #app #shareBtn, #app #pdfBtn')]);
    await t.schritt(p, 'RLB-126/T-4 iPhone: Australien antippen', async () => { await p.click(zeile('a')); await p.waitForTimeout(500); await ruhig(p); });
    t.ist('RLB-126/T-4 iPhone: eigene Seite mit ‹ ‚Zuletzt gelöscht‘, Hinweis, ohne Mehr und Ausgabe', await seite(), ['Zuletzt gelöscht', 'Australien', true, true], 'R-7.10');
    await t.schritt(p, 'RLB-126/T-4 iPhone: ‹', async () => { await p.click('#back'); await p.waitForTimeout(500); await ruhig(p); });
    t.ist('RLB-126/T-4 iPhone: ‹ führt zur Liste ‚Zuletzt gelöscht‘', (await kopf(p))[0], 'Zuletzt gelöscht', 'R-7.5');
    await t.schritt(p, 'RLB-126/T-4 iPhone: wieder Australien', async () => { await p.click(zeile('a')); await p.waitForTimeout(500); await ruhig(p); });
    // auf dem Hinweis (die Vorschau selbst rollt seitlich – dort gehört das Wischen ihr, wie bei einem gesperrten, RLB-125/T-11)
    await t.schritt(p, 'RLB-126/T-4 iPhone: zurückwischen (auf dem Hinweis)', async () => { const { width: w } = p.viewportSize();
      const y = await p.evaluate(() => { const r = document.querySelector('#app .ad-recentlydeleted-text').getBoundingClientRect(); return r.top + r.height / 2; });
      await mausWieFinger(p); await mausKlickSpaet(p);
      await p.mouse.move(w * 0.3, y); await p.mouse.down();
      for (let i = 1; i <= 16; i++) { await p.mouse.move(w * 0.3 + w * 0.65 * i / 16, y); await p.waitForTimeout(16); }
      await p.waitForTimeout(150); await p.mouse.up(); await p.waitForTimeout(600); await ruhig(p); await mausKlickSpaet(p, false); });
    t.ist('RLB-126/T-4 iPhone: Zurückwischen führt zur Liste ‚Zuletzt gelöscht‘', [(await kopf(p))[0], await p.evaluate(() => side.classList.contains('page'))], ['Zuletzt gelöscht', true], 'R-7.5');
    await t.schritt(p, 'RLB-126/T-3 iPhone: ‹ der Liste', async () => { await p.click('.ad-recentlydeleted-back'); await p.waitForTimeout(500); await ruhig(p); });
    t.ist('RLB-126/T-3 iPhone: ‹ der Liste führt zu ‚Reiselogbücher‘', (await kopf(p))[0], 'Reiselogbücher', 'R-7.5');
    // RLB-126/T-5 iPhone: Wiederherstellen aus der Vorschau öffnet das Reiselogbuch
    await oeffneZl(p);
    await p.click(zeile('a')); await p.waitForTimeout(500); await ruhig(p);
    await t.schritt(p, 'RLB-126/T-5 iPhone: ‚Wiederherstellen‘', async () => { await p.click('#app .ad-recentlydeleted-restore'); await p.waitForTimeout(500); await ruhig(p); });
    t.ist('RLB-126/T-5 iPhone: Australien offen (Kästen), nicht mehr gelöscht', await p.evaluate(() => [phoneList, currentTripId, document.querySelector('#app .pnav-title')?.textContent.trim(), !!document.querySelector('#app #pdays'), recentlyDeleted.items.length]),
      [false, 'a', 'Australien', true, 0], 'R-7.10');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}

// ---------- Stichproben iPad hoch hell und iPhone quer hell ----------
for (const ansicht of ['iPad hoch', 'iPhone quer']) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  try {
    await lade(p);
    const phone = await p.evaluate(() => isPhone());
    if (!phone && await p.evaluate(() => side.hidden || !side.getClientRects().length)) { await p.click('[data-side-toggle]'); await p.waitForTimeout(500); await ruhig(p); }
    await t.schritt(p, 'RLB-126/T-1 Wien lange drücken → ‚Reiselogbuch löschen‘', () => loeschenKontext(p, 'c'));
    await geloescht(p, 'c', 'aus dem Kontextmenü');
    await t.schritt(p, 'RLB-126/T-1 Toskana wischen → ‚Löschen‘', () => loeschenWischen(p, 'b'));
    await geloescht(p, 'b', 'mit Wischen');
    await t.schritt(p, 'RLB-126/T-3 ‚Zuletzt gelöscht‘ antippen', () => oeffneZl(p));
    t.ist('RLB-126/T-3 Kopf und Reihenfolge', [await kopf(p), await reihen(p)], [['Zuletzt gelöscht', '2 Reiselogbücher'], 'b,c'], 'R-7.10');
    await t.schritt(p, 'RLB-126/T-4 Wien antippen', async () => { await p.click(zeile('c')); await p.waitForTimeout(500); await ruhig(p); });
    t.wahr('RLB-126/T-4 Vorschau mit Hinweis und ‚Wiederherstellen‘', await p.evaluate(() => !!document.querySelector('#app .ad-recentlydeleted-notice .ad-recentlydeleted-restore')), 'R-7.10');
    if (!phone) {
      const vp = p.viewportSize();
      await t.schritt(p, 'RLB-126/T-11 drehen (quer)', async () => { await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(700); await ruhig(p); });
      t.ist('RLB-126/T-11 nach dem Drehen: Vorschau bleibt, Wien gewählt', await p.evaluate(() => [deletedView, deletedOpen, !!document.querySelector('#app .ad-recentlydeleted-notice')]), [true, 'c', true], 'R-8.1');
      await t.schritt(p, 'RLB-126/T-11 zurückdrehen', async () => { await p.setViewportSize(vp); await p.waitForTimeout(700); await ruhig(p); });
    }
    await t.schritt(p, 'RLB-126/T-5 ‚Wiederherstellen‘', async () => { await p.click('#app .ad-recentlydeleted-restore'); await p.waitForTimeout(500); await ruhig(p); });
    t.ist('RLB-126/T-5 Wien offen, noch 1 gelöscht', await p.evaluate(() => [currentTripId, recentlyDeleted.items.map(x => x.id).join()]), ['c', 'b'], 'R-7.10');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
