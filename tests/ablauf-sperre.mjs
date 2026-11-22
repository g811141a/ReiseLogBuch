// Reiselogbuch-Test: ablauf-sperre (seit 3.58.0) – RLB-125 Reiselogbuch sperren (Testfall-Liste RLB-125/T-1 bis RLB-125/T-13 in
// AppDesign arbeit/0150 RLB-125 Rest.md und arbeit/0152 RLB-125 Bau-Frage.md). Je Ansicht (iPad quer hell und dunkel, iPad hoch, iPhone hoch und quer):
// RLB-125/T-1 Schloss vor dem Titel der Kachel (Höhe der Großbuchstaben, mittig, Farbe des Titels), nicht gesperrt kein Symbol · RLB-125/T-2 gesperrt nur die Vorschau-Seite
// (keine Tabelle, keine Kästen, kein Fenster) · RLB-125/T-3 nach HTML und PDF bleibt die Vorschau · RLB-125/T-4 oben ‚PDF‘ und Teilen (blau gefüllt), kein Mehr ·
// RLB-125/T-5 Kontextmenü der gesperrten Kachel nur ‚Reiselogbuch entsperren‘ (J-12, R-4.10), Wischen nur ‚Entsperren‘ · RLB-125/T-6 ‚Entsperren‘ → Tabelle bzw. Kästen,
// Mehr → ‚Reiselogbuch sperren‘ → Vorschau · RLB-125/T-7 Drehen bzw. zurück zur Startliste und wieder öffnen: die Vorschau bleibt · RLB-125/T-9 Backup behält die Sperre,
// nur true sperrt (normalize) · RLB-125/T-11 iPhone hoch: Hinweis im Bildschirm, ‚Entsperren‘ darunter, Vorschau 960 px, seitlich wischen nur in der Seite ·
// RLB-125/T-12 Lösch-Abfrage mit Zahl der Einträge, ‚Erst Backup erstellen‘ nur ohne Backup heute und mit Einträgen (L-4, L-5). Grundregeln nach jedem Schritt.
// Gegenprobe RLB-125/T-10: PRUEF_GEGENPROBE=sperre zeigt gesperrt die Tabelle – RLB-125/T-2 muss rot werden. Aufruf im Repo-Ordner: node tests/ablauf-sperre.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.68.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.68.0/tests/hig.mjs';
const t = pruefung('ablauf-sperre', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const GP = process.env.PRUEF_GEGENPROBE === 'sperre';
const iso = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
const tage = n => Object.fromEntries(Array.from({ length: n }, (_, i) => [iso(2026, 8, 24 + i), { weather: '☀️', program: `Ankunft in Sydney ${i + 1}\nHafenrundfahrt`, comment: 'Opernhaus bei Sonnenuntergang' }]));
const JETZT = new Date('2026-11-02T10:00:00');
const TRIPS = [
  { id: 'a', title: 'Australien', participants: 'G und M', start: iso(2026, 8, 24), end: iso(2026, 9, 6), transport: ['flug'], days: tage(3), locked: true, fazit: 'Schön' },
  { id: 'b', title: 'Toskana', participants: 'G und M', start: iso(2027, 5, 3), end: iso(2027, 5, 10), transport: ['pkw'], days: {} },
  { id: 'c', title: 'Wien', participants: 'G', start: iso(2026, 3, 12), end: iso(2026, 3, 15), transport: ['zug'], days: { [iso(2026, 3, 12)]: { weather: '⛅', program: 'Prater' } } }];
const lade = async (p, { lastBackup = JETZT.getTime() } = {}) => {
  await p.clock.setFixedTime(JETZT);
  await p.goto(APP);
  await p.evaluate(([trips, lb]) => { localStorage.clear(); localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: lb, lastTrip: 'a' }, trips })); }, [TRIPS, lastBackup]);
  await p.reload(); await p.waitForTimeout(500); await navFertig(p);
  await p.evaluate(gp => { window.print = () => {}; const n = navigator;
    Object.defineProperty(n, 'canShare', { value: () => true, configurable: true, writable: true });
    Object.defineProperty(n, 'share', { value: () => Promise.resolve(), configurable: true, writable: true });
    // Gegenprobe RLB-125/T-10: gesperrt wird die Tabelle gezeigt
    if (gp) renderLocked = function (trip) { delete trip.locked; render(); trip.locked = true; };
  }, GP);
};
const zustand = p => p.evaluate(() => ({ vorschau: !!document.querySelector('#app .lockpage .rt'), tabelle: !!document.querySelector('#app table.days, #app #pdays'),
  fenster: dlg.open, mehr: !!document.querySelector('#app #mainMore'), hinweis: document.querySelector('#app .lockinfo .li-t')?.textContent || '' }));
const nurVorschau = (z, was) => {
  t.ist(`RLB-125/T-2 ${was}: nur die Vorschau-Seite (keine Tabelle, keine Kästen, kein Fenster)`, [z.vorschau, z.tabelle, z.fenster], [true, false, false], 'R-1.1');
  t.ist(`RLB-125/T-2 ${was}: Hinweis`, z.hinweis, 'Dieses Reiselogbuch ist gesperrt.Es lässt sich lesen und ausgeben, aber nicht ändern oder löschen.', 'R-10.1');
};
const lang = async (p, id) => { const bx = await p.locator(`#side .side-row[data-id="${id}"]`).boundingBox();
  await p.mouse.move(bx.x + 40, bx.y + 20); await p.mouse.down(); await p.waitForTimeout(750); await p.mouse.up();
  await p.waitForSelector('.menu.kontext .mi', { timeout: 4000 }); await p.waitForTimeout(450); };
const menueTexte = p => p.evaluate(() => [...document.querySelectorAll('.menu:not(.submenu) .mi')].map(m => ({ text: m.textContent.trim(), aus: m.disabled })));
const esc = async p => { for (let n = 0; n < 4 && await p.evaluate(() => !!document.querySelector('.menu, .pop') || msg.open || dlg.open); n++) { await p.keyboard.press('Escape'); await p.waitForTimeout(500); } };
const oeffne = async (p, id, phone) => { if (phone && !(await p.evaluate(() => phoneList))) { await p.click('#back'); await p.waitForTimeout(600); await navFertig(p); }
  await p.click(`#side .side-row[data-id="${id}"]`); await p.waitForTimeout(600); await navFertig(p); };

const b = await t.browser();
for (const [ansicht, theme] of [['iPad quer', 'light'], ['iPad quer', 'dark'], ['iPad hoch', 'light'], ['iPhone hoch', 'light'], ['iPhone quer', 'light']]) {
  const p = await t.seite(b, ansicht, { theme });
  try {
    await lade(p);
    const phone = await p.evaluate(() => isPhone());
    // RLB-125/T-1 Kachel (iPad Seitenleiste, iPhone Startliste)
    const k = await p.evaluate(() => [...document.querySelectorAll('#side .side-row')].map(r => { const l = r.querySelector('.lk svg'), bb = r.querySelector('b');
      if (!l) return { id: r.dataset.id, lk: false };
      const ls = l.getBoundingClientRect(), fs = parseFloat(getComputedStyle(bb).fontSize), tr = document.createRange(); tr.selectNodeContents(bb.lastChild); const tx = tr.getBoundingClientRect();
      return { id: r.dataset.id, lk: true, vorTitel: ls.right <= tx.left + 1, hoehe: +(ls.height / fs).toFixed(2), mitte: Math.abs((ls.top + ls.bottom) / 2 - (tx.top + tx.bottom) / 2 - 0.06 * fs) <= 0.12 * fs,
        farbe: getComputedStyle(l).color === getComputedStyle(bb).color, name: r.querySelector('.lk').getAttribute('aria-label') }; }));
    const ka = k.find(x => x.id === 'a');
    t.wahr(`RLB-125/T-1 Kachel ‚Australien‘ gesperrt: Schloss vor dem Titel, Höhe der Großbuchstaben (${ka?.hoehe} em), mittig, Farbe des Titels, Name ‚Gesperrt‘`,
      !!ka?.lk && ka.vorTitel && ka.hoehe >= 0.65 && ka.hoehe <= 0.8 && ka.mitte && ka.farbe && ka.name === 'Gesperrt', 'R-10.1');
    t.ist('RLB-125/T-1 nicht gesperrt ohne Symbol', k.filter(x => x.id !== 'a').map(x => x.lk), [false, false], 'R-10.1');
    // RLB-125/T-2 gesperrt öffnen (iPad: beim Start, iPhone: aus der Startliste)
    if (phone) await t.schritt(p, 'RLB-125/T-2 Australien antippen', () => oeffne(p, 'a', phone));
    nurVorschau(await zustand(p), phone ? 'aus der Startliste geöffnet' : 'beim Start');
    // RLB-125/T-4 Schaltflächen oben
    t.ist('RLB-125/T-4 oben ‚PDF‘ und Teilen (blau gefüllt), kein Mehr', await p.evaluate(() => [document.querySelector('#bar #pdfBtn')?.textContent.trim(),
      document.querySelector('#bar #shareBtn')?.classList.contains('fill'), !!document.querySelector('#bar #mainMore')]), ['PDF', true, false], 'R-3.1');
    // RLB-125/T-3 nach HTML und PDF bleibt die Vorschau
    await t.schritt(p, 'RLB-125/T-3 Teilen (HTML)', async () => { await p.click('#shareBtn'); await p.waitForSelector('#dlg[open]', { timeout: 4000 }).catch(() => {}); await p.waitForTimeout(500); });
    t.wahr('RLB-125/T-3 Fenster ‚Ausgabe V001‘ nach HTML', await p.evaluate(() => dlg.open && /Ausgabe V001/.test(dlg.textContent)), 'R-10.1');
    await t.schritt(p, 'Meldung schließen', () => esc(p));
    nurVorschau(await zustand(p), 'nach HTML');
    await t.schritt(p, 'RLB-125/T-3 PDF', async () => { await p.click('#pdfBtn'); await p.waitForSelector('#dlg[open]', { timeout: 4000 }).catch(() => {}); await p.waitForTimeout(500); });
    await t.schritt(p, 'Meldung schließen', () => esc(p));
    nurVorschau(await zustand(p), 'nach PDF');
    // RLB-125/T-11 iPhone hoch (und quer): Hinweis ganz im Bildschirm, ‚Entsperren‘ unter dem Text; Vorschau 960 px, seitlich wischen nur in der Seite
    if (phone) {
      const m = await p.evaluate(() => { const i = document.querySelector('.lockinfo').getBoundingClientRect(), tx = document.querySelector('.lockinfo .li-t').getBoundingClientRect(),
        bt = document.querySelector('#lockUnlock').getBoundingClientRect(), pg = document.querySelector('.lockpage'), rt = pg.querySelector('.rt');
        return { drin: i.left >= 0 && i.right <= innerWidth + 0.5, unter: bt.top >= tx.bottom - 1 && bt.right <= i.right + 0.5, breite: Math.round(rt.getBoundingClientRect().width),
          seite: pg.scrollWidth > pg.clientWidth, app: document.scrollingElement.scrollWidth <= innerWidth + 1 }; });
      t.ist('RLB-125/T-11 Hinweis im Bildschirm, ‚Entsperren‘ darunter; Vorschau mindestens 960 px; seitlich wischen nur in der Seite',
        [m.drin, m.unter, m.breite >= 960, m.seite, m.app], [true, true, true, true, true], 'R-6.3');
    }
    // RLB-125/T-5 Kontextmenü und Wischen
    if (phone) await t.schritt(p, 'zurück zur Startliste', async () => { await p.click('#back'); await p.waitForTimeout(600); await navFertig(p); });
    await t.schritt(p, 'RLB-125/T-5 Kontextmenü der gesperrten Kachel', () => lang(p, 'a'));
    t.ist('RLB-125/T-5 Kontextmenü gesperrt: nur ‚Reiselogbuch entsperren‘, nichts blass (R-4.10)', await menueTexte(p), [{ text: 'Reiselogbuch entsperren', aus: false }], 'R-4.10');
    await t.schritt(p, 'Kontextmenü zu', () => esc(p));
    t.ist('RLB-125/T-5 Wischen gesperrt: nur ‚Entsperren‘', await p.evaluate(() => tripActions(document.querySelector('#side .side-row[data-id="a"]')).filter(x => x?.act).map(x => x.shortTitle)), ['Entsperren'], 'R-7.8');
    await t.schritt(p, 'Kontextmenü der nicht gesperrten Kachel', () => lang(p, 'b'));
    t.wahr('RLB-125/T-5 nicht gesperrt: ‚Reiselogbuch sperren‘ im Kontextmenü', (await menueTexte(p)).some(x => x.text === 'Reiselogbuch sperren'), 'R-4.1');
    await t.schritt(p, 'Kontextmenü zu', () => esc(p));
    // RLB-125/T-7 Wechsel bzw. Drehen: die Vorschau bleibt
    await t.schritt(p, 'RLB-125/T-7 Toskana öffnen', () => oeffne(p, 'b', phone));
    t.ist('RLB-125/T-7 Toskana (nicht gesperrt) zeigt die normale Seite', (await zustand(p)).vorschau, false, 'R-1.1');
    await t.schritt(p, 'RLB-125/T-7 wieder Australien', () => oeffne(p, 'a', phone));
    nurVorschau(await zustand(p), 'nach dem Wechsel');
    if (!phone) {
      const vp = p.viewportSize();
      await t.schritt(p, 'RLB-125/T-7 drehen', async () => { await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(700); await navFertig(p); });
      nurVorschau(await zustand(p), 'nach dem Drehen');
      await t.schritt(p, 'zurückdrehen', async () => { await p.setViewportSize(vp); await p.waitForTimeout(700); await navFertig(p); });
    }
    // RLB-125/T-6 Entsperren und wieder sperren
    await t.schritt(p, 'RLB-125/T-6 ‚Entsperren‘', async () => { await p.click('#lockUnlock'); await p.waitForTimeout(500); await navFertig(p); });
    let z = await zustand(p);
    t.ist('RLB-125/T-6 nach ‚Entsperren‘ Tabelle bzw. Kästen, Mehr da', [z.vorschau, z.tabelle, z.mehr], [false, true, true], 'R-1.1');
    t.ist('RLB-125/T-6/J-11 Entsperren zählt als Änderung, gespeichert', await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('reiselogbuch.v1')).trips.find(x => x.id === 'a');
      return [s.locked ?? null, s.changedAt === Date.now()]; }), [null, true], 'R-9.3');
    await t.schritt(p, 'RLB-125/T-6 Mehr → ‚Reiselogbuch sperren‘', async () => { await p.click('#mainMore'); await p.waitForSelector('.menu .mi', { timeout: 4000 }); await p.waitForTimeout(450);
      await p.locator('.menu .mi', { hasText: 'Reiselogbuch sperren' }).click(); await p.waitForTimeout(500); await navFertig(p); });
    nurVorschau(await zustand(p), 'nach ‚Reiselogbuch sperren‘');
    // RLB-125/T-9 Backup und alte Daten
    t.ist('RLB-125/T-9 Backup enthält die Sperre; nur true sperrt (normalize)', await p.evaluate(() => [JSON.parse(backupFile().content).trips.find(x => x.id === 'a').locked,
      normalize({ trips: [{ id: 'x', locked: 'ja' }, { id: 'y' }] }).trips.map(x => 'locked' in x)]), [true, [false, false]], 'R-9.2');
    // RLB-125/T-2 nach dem Neustart
    await t.schritt(p, 'RLB-125/T-2 Neustart', async () => { await p.reload(); await p.waitForTimeout(500); await navFertig(p); if (phone) await oeffne(p, 'a', phone); });
    nurVorschau(await zustand(p), 'nach dem Neustart');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
// RLB-125/T-12 Lösch-Abfrage (iPad quer): Zahl der Einträge; ‚Erst Backup erstellen‘ nur mit Einträgen und ohne Backup heute
{
  const p = await t.seite(b, 'iPad quer', { theme: 'light' });
  try {
    await lade(p, { lastBackup: JETZT.getTime() - 86400000 });
    const frage = async id => { await lang(p, id); await p.locator('.menu.kontext .mi', { hasText: 'Reiselogbuch löschen' }).click();
      await p.waitForSelector('.pop', { timeout: 4000 }); await p.waitForTimeout(450);
      const r = await p.evaluate(() => [document.querySelector('.pop p').textContent, [...document.querySelectorAll('.pop button')].map(x => x.textContent.trim())]);
      await esc(p); return r; };
    await t.schritt(p, 'Australien entsperren', async () => { await lang(p, 'a'); await p.locator('.menu.kontext .mi', { hasText: 'Reiselogbuch entsperren' }).click(); await p.waitForTimeout(500); await navFertig(p); });
    t.ist('RLB-125/T-12 3 Einträge, ohne Backup heute', await frage('a'), ['‚Australien‘ mit allen 3 Einträgen löschen? Das kann nicht rückgängig gemacht werden.', ['Erst Backup erstellen', 'Reiselogbuch löschen', 'Abbrechen']], 'R-4.12');
    t.ist('RLB-125/T-12 1 Eintrag', (await frage('c'))[0], '‚Wien‘ mit 1 Eintrag löschen? Das kann nicht rückgängig gemacht werden.', 'R-4.12');
    t.ist('RLB-125/T-12 ohne Einträge: ohne ‚Erst Backup erstellen‘', await frage('b'), ['‚Toskana‘ ohne Einträge löschen? Das kann nicht rückgängig gemacht werden.', ['Reiselogbuch löschen', 'Abbrechen']], 'R-4.12');
    await t.schritt(p, 'RLB-125/T-12 ‚Erst Backup erstellen‘', async () => { await lang(p, 'a'); await p.locator('.menu.kontext .mi', { hasText: 'Reiselogbuch löschen' }).click();
      await p.waitForSelector('.pop', { timeout: 4000 }); await p.waitForTimeout(450); await p.locator('.pop button', { hasText: 'Erst Backup erstellen' }).click();
      await p.waitForSelector('#msg[open]', { timeout: 4000 }); await p.click('#msg [data-x]'); await p.waitForSelector('.pop', { timeout: 4000 }); await p.waitForTimeout(450); });
    t.ist('RLB-125/T-12 nach dem Backup dieselbe Abfrage ohne ‚Erst Backup erstellen‘', await p.evaluate(() => [...document.querySelectorAll('.pop button')].map(x => x.textContent.trim())), ['Reiselogbuch löschen', 'Abbrechen'], 'R-4.12');
    await esc(p);
    t.ist('RLB-125/T-12 Abbrechen löscht nichts', await p.evaluate(() => db.trips.length), 3, 'R-4.12');
    // gesperrt lässt sich nicht löschen – auch nicht über deleteTrip direkt
    await p.evaluate(() => { const a = getTrip('a'); a.locked = true; save(); return deleteTrip(a); });
    t.ist('RLB-125 gesperrt: deleteTrip löscht nicht', await p.evaluate(() => [db.trips.length, !!document.querySelector('.pop')]), [3, false], 'R-4.12');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
