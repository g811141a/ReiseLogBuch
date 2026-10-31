// Reiselogbuch-Test: ablauf-bedienung – Bedienungshilfen (seit 3.33.0, AppDesign APD-43 Teil 1, RLB-100; Testfall-Liste AppDesign
// arbeit/APD-43 Teil 1 Testfall-Liste.md): VoiceOver (Namen, Rollen, Fokus, Sperre, Ansagen), Hardware-Tastatur, ‚Kontrast erhöhen‘ und
// ‚Bewegung reduzieren‘. Die Seiten öffnen mit beiden Bedienungshilfen (Bewegungswächter, pruefe.mjs). Dieselbe Prüfung läuft für die
// Gegenprobe der Bedienungshilfen (node tests/alle.mjs --gegenprobe bedienung): je eingeschleustem Fehler wird genau seine Meldung rot.
// Aufruf im Repo-Ordner: node tests/ablauf-bedienung.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.48.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.48.0/tests/hig.mjs';
import { checkFokus, checkKontrast, checkRuhig, checkFieldErrors, ansage, sucheAuf } from '../../AppDesign/fassung/4.48.0/tests/ablauf.mjs';
const t = pruefung('ablauf-bedienung', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.dlg-body.preview a'] }), out: new URL('out/', import.meta.url) });
const days = {};
for (let i = 0; i < 30; i++) { const d = new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10); days[d] = { weather: '☀️', program: i === 20 ? 'Fahrt nach Sydney' : 'Programm ' + i, comment: '😉 ok', place: i % 3 ? 'Hafen' : 'Sydney' }; }
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-24', end: '2026-09-22', transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, days },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} }];
const b = await t.browser();
const errs = m => m.forEach(x => t.fehler('', x));
const G = (p, name, fn = async () => {}) => t.schritt(p, name, fn);
const warte = (p, ms = 250) => p.waitForTimeout(ms);
const settings = p => async () => { await p.click('#mainMore'); await warte(p, 150); await p.locator('.menu .mi', { hasText: 'Reiselogbuch einstellen' }).click(); };

for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { contrast: 'more', reducedMotion: 'reduce' });
  if (!t.ort.includes('Kontrast')) t.ort += ' · Kontrast · ruhig';
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() - 864e5 * 2 }, trips: x })), trips);
  await G(p, 'Start', async () => { await p.reload(); await warte(p, 400); });
  // bricht ein Ablauf ab (z. B. in der Gegenprobe), zählen die Meldungen bis dahin – die übrigen Ansichten laufen weiter
  try {

  if (ansicht === 'iPad quer') {
    // V1, V3, V7: Menü offen – Namen, ‚öffnet Menü‘, alles daneben gesperrt; V4: Untermenü mit Häkchen (seit 3.41.0 ‚Darstellung‘ im
    // Mehr-Menü der Seitenleiste, RLB-108)
    await G(p, 'Mehr-Menü offen', async () => { await p.click('#mainMore'); await warte(p, 200); });
    await p.keyboard.press('Escape'); await warte(p, 200);
    await G(p, 'Mehr-Menü der Seitenleiste offen', async () => { await p.click('#sideMore'); await warte(p, 200); });
    await G(p, 'Untermenü Darstellung', async () => { await p.locator('.menu .mi', { hasText: 'Darstellung' }).click(); await warte(p, 200); });
    await G(p, 'Menü daneben geschlossen', async () => { await p.evaluate(() => document.querySelector('.layer')?.click()); await warte(p, 200); });
    // V2, V8: Fenster mit Titel, modal
    await G(p, 'Fenster Reiselogbuch einstellen', settings(p));
    await p.evaluate(() => dlg.close()); await warte(p);
    // V11: ‚Automatisch gespeichert‘ steht im Fensterkopf, wird nicht angesagt
    await G(p, 'Tag erfassen, automatisch gespeichert', async () => {
      await p.evaluate(() => openDayDialog(db.trips.find(x => x.id === 'a'), '2026-08-25')); await warte(p, 300);
      await p.locator('#dlg textarea').first().focus(); await p.keyboard.type(' mehr'); await p.locator('#dlg textarea').first().blur(); await warte(p, 10500); });   // automatisch gespeichert nach 10 s
    t.wahr('‚Automatisch gespeichert‘ steht im Fensterkopf', /gespeichert um/.test(await p.textContent('#dlgSub')), 'R-1.8');
    await p.evaluate(() => dlg.close()); await warte(p);
    // K1–K6, K9, V5, V6
    errs(await checkFokus(p, { menue: '#sideMore', untermenue: 'Darstellung', felder: [],
      fenster: { open: settings(p), change: () => p.locator('#fTitle').fill('Australien 2'), feld: '#fTitle' } }));
    // K9: Textfelder im Fenster nie mit Fokus-Rahmen (antippen)
    await settings(p)(); await warte(p, 300);
    errs(await checkFokus(p, { felder: ['#fTitle', '#fPeople'], tab: false, where: 'Fenster' }));
    await G(p, 'Feld im Fenster angetippt', () => p.locator('#fPeople').tap());
    await p.evaluate(() => dlg.close()); await warte(p);
    // V10: Fehlermeldung hörbar, Häkchen → Fokus aufs Feld
    errs(await checkFieldErrors(p, { open: settings(p), field: '#fTitle' }));
    // V9: Ansagen der Suche
    await sucheAuf(p); await warte(p, 200);
    await p.locator('#search').pressSequentially('Programm', { delay: 30 });
    const n = await p.evaluate(() => hitMarks().length);
    const a1 = await ansage(p, 1100);
    if (a1 !== `${n} Treffer`) t.fehler('R-1.8', `Suche: Ansage ‚${a1}‘ statt ‚${n} Treffer‘ (nach der Tipp-Pause)`);
    t.wahr(`Suche findet mehrere Treffer (${n})`, n > 1);
    if (n > 1) await p.click('#snext');
    const a2 = await ansage(p, 300);
    if (n > 1 && a2 !== `Treffer 2 von ${n}`) t.fehler('R-1.8', `Suche: Ansage ‚${a2}‘ statt ‚Treffer 2 von ${n}‘`);
    await p.locator('#search').fill('Xyzzy'); await p.locator('#search').dispatchEvent('input');
    const a3 = await ansage(p, 1100);
    if (a3 !== 'Keine Treffer') t.fehler('R-1.8', `Suche: Ansage ‚${a3}‘ statt ‚Keine Treffer‘`);
    await p.click('#sclose'); await warte(p, 200);
    // Seitenleiste filtern: ‚1 von 2 Reiselogbüchern‘
    await sucheAuf(p, '#sideMore'); await warte(p, 200);
    await p.locator('#lsearch').pressSequentially('Sydney', { delay: 30 });
    const a4 = await ansage(p, 1100);
    if (a4 !== '1 von 2 Reiselogbüchern') t.fehler('R-1.8', `Seitenleiste: Ansage ‚${a4}‘ statt ‚1 von 2 Reiselogbüchern‘`);
    await p.click('#lsclose'); await warte(p, 200);
    // V13: offline und wieder online – angesagt, auch bei offenem Fenster (dort im Fenster)
    await p.evaluate(() => setNet('aus'));
    const a5 = await ansage(p, 200);
    if (!/offline/.test(a5 || '')) t.fehler('R-1.8', `Offline: Ansage ‚${a5}‘ statt ‚Du bist offline …‘`);
    await settings(p)(); await warte(p, 300);
    await p.evaluate(() => setNet('an'));
    const a6 = await ansage(p, 200);
    if (a6 !== 'Wieder online') t.fehler('R-1.8', `Wieder online bei offenem Fenster: Ansage ‚${a6}‘ im Fenster statt ‚Wieder online‘`);
    await p.evaluate(() => dlg.close()); await warte(p);
    // H1–H5: zweite Farbtabelle, Ausgabe hell, Umschalten ohne Neuaufbau
    errs(await checkKontrast(p, {
      vorschau: async () => { await p.click('#shareBtn'); await warte(p, 150); await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); },
      fenster: { open: settings(p), feld: '#fPeople' } }));
    await G(p, 'nach dem Umschalten');
    // M2, M4: ‚Nach oben / Ans Ende‘ springen, Mikrofon ruhig
    errs(await checkRuhig(p, { fab: true, mic: true }));
    await G(p, 'nach ‚Nach oben / Ans Ende‘');
  }

  if (ansicht === 'iPad hoch') {
    // K7 (seit 3.43.0, AppDesign APD-97): hoch steht die Seitenleiste fest wie quer – Esc lässt sie stehen, ohne Abdunkelung
    await p.locator('#side .side-row').first().focus();
    await p.keyboard.press('Escape'); await warte(p, 600);
    t.ist('Esc lässt die feste Seitenleiste stehen', await p.evaluate(() => !!side.getClientRects().length && !side.hidden && !document.querySelector('.side-shade')), true, 'R-4.7');
  }

  if (ansicht === 'iPhone hoch') {
    // V12: Eintrag öffnen → Fokus auf den Seitentitel; zurück → auf die blaue Zeile bzw. den Titel der Startliste
    await G(p, 'Eintrag öffnen', async () => { await p.click('#side .side-row[data-id="a"]'); await warte(p, 500); });
    t.ist('Fokus nach dem Öffnen auf dem Seitentitel', await p.evaluate(() => !!document.activeElement?.matches('.pnav')), true, 'R-1.8');
    await G(p, 'zurück', async () => { await p.click('#back'); await warte(p, 500); });
    t.ist('Fokus nach dem Zurück auf der blauen Zeile bzw. dem Titel', await p.evaluate(() => !!document.activeElement?.closest('#side') && document.activeElement.matches('.current, h2, .pnav-head')), true, 'R-1.8');
    // M5: Blatt ohne Verkleinerung der Seite
    await p.click('#side .side-row[data-id="a"]'); await warte(p, 500);
    errs(await checkRuhig(p, { fab: false, fenster: settings(p) }));
    await G(p, 'Blatt geschlossen');
  }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
