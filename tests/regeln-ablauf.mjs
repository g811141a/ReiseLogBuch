// Ablauf-Prüfungen der allgemeinen Regeln (AppDesign/tests/ablauf.mjs): R-2.3 Suche, R-4.4 Fenster-Kopfzeile, R-5.2 Texteingabe,
// R-5.3 Fehlermeldungen, R-5.5 Eingabetaste (seit 3.17.0), R-6.4 Vorschau, seit 3.25.0 (AppDesign A-28/A-29) Suche nach oben (F-3/F-4),
// Nach oben / Ans Ende im Rollbereich (F-12) und Drucken der ganzen Liste (F-16) – iPad und iPhone quer und hoch, Vorschau hell und dunkel. Aufruf im Repo-Ordner: node tests/regeln-ablauf.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.28.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.28.0/tests/hig.mjs';
// Meldet Fehler mit Rückgabewert, Grundregeln nach den Schritten (seit 3.12.0, pruefe.mjs).
const t = pruefung('regeln-ablauf', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.dlg-body.preview a'] }), out: new URL('out/', import.meta.url) });
const G = (p, name) => t.schritt(p, name, async () => {});   // Grundregeln im aktuellen Zustand
import { checkSearch, checkDialogHead, checkFieldErrors, checkCapital, checkPreview, checkEnterDone, checkSearchTop, checkFab, checkPrint } from '../../AppDesign/fassung/4.28.0/tests/ablauf.mjs';
const days = {}; for (let i = 0; i < 40; i++) { const d = new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10); days[d] = { weather: '☀️', program: i >= 30 && i < 34 ? 'Fahrt nach Sydney' : 'Programm ' + i, comment: '😉 ok ' + 'sehr schöner Tag mit viel Sonne '.repeat(i % 3 + 1), food: '😋 Restaurant Zum Hafen – Fisch', quarter: 'Hotel Bellevue am Meer', place: 'Hafenviertel' }; }
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, days }];
const b = await t.browser(); const errs = { push: (...m) => m.forEach(x => t.fehler('', x)) };
for (const [w, h, scheme, dev] of [[1180, 820, 'light', 'iPad quer'], [393, 852, 'light', 'iPhone hoch'], [1180, 820, 'dark', 'iPad quer dunkel'], [393, 852, 'dark', 'iPhone hoch dunkel'],
  [820, 1180, 'light', 'iPad hoch'], [852, 393, 'light', 'iPhone quer']]) {   // seit 3.11.7 auch iPad hoch und iPhone quer (R-6.4 Vorschau seitlich wischen, F-4)
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700, colorScheme: scheme });
  p.on('pageerror', e => errs.push(`${dev}: Skriptfehler ${e.message}`));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  if (!await p.locator('#mainMore').count() || await p.evaluate(() => side.classList.contains('over'))) { await p.locator('.irow, .side-row', { hasText: 'Australien' }).first().click(); await p.waitForTimeout(300); }
  const where = dev; t.ort = dev;   // iPad hoch: die Seitenleiste lag beim Start über dem Inhalt – deshalb oben das Reiselogbuch antippen
  errs.push(...await checkPreview(p, { where, open: async () => { await p.click('#shareBtn'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); } }));
  // P-32/4 (seit 3.11.6): Spalten der Ausgabe mit festen Anteilen 28 : 28 : 22 : 22 – unabhängig von der Textmenge; Tag so schmal wie das Datum.
  await p.click('#shareBtn'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); await p.waitForTimeout(400);
  const cw = await p.evaluate(() => [...document.querySelectorAll('#dlg .preview table.grid')][0].querySelectorAll('thead th').length && [...[...document.querySelectorAll('#dlg .preview table.grid')][0].querySelectorAll('thead th')].map(th => th.getBoundingClientRect().width));
  const txt = cw.slice(1), sum = txt.reduce((a, x) => a + x, 0), want = [28, 28, 22, 22];
  if (txt.length === 4 && txt.some((x, i) => Math.abs(x / sum * 100 - want[i]) > 1.5)) errs.push(`${where}: P-32/4 Spalten der Vorschau nicht 28 : 28 : 22 : 22 (${txt.map(x => Math.round(x / sum * 100)).join(' : ')})`);
  if (await p.evaluate(() => /Gesamtkosten/.test(document.getElementById('dlg').textContent))) errs.push(`${where}: Vorschau nennt noch ‚Gesamtkosten‘ statt ‚Gesamtausgaben‘`);
  await G(p, 'Vorschau offen');
  await p.evaluate(() => dlg.close()); await p.waitForTimeout(200);
  if (await p.evaluate(() => /Gesamtkosten/.test(document.getElementById('app').textContent) || !/Gesamtausgaben/.test(document.getElementById('app').textContent))) errs.push(`${where}: App nennt nicht ‚Gesamtausgaben‘`);
  if (scheme === 'light' && !/iPad hoch|iPhone quer/.test(dev)) {   // iPad hoch und iPhone quer: nur Vorschau und Spalten
    errs.push(...await checkSearch(p, { where, term: 'Sydney', item: w < 700 ? '#pdays [data-day]' : 'table.days tbody [data-day]' }));
    await G(p, 'nach der Suche');
    // A-29 (seit 3.25.0): Lupe und ⓧ rollen den Inhalt ganz nach oben; A-28: Kapsel und Drucken mit dem Rollbereich
    errs.push(...await checkSearchTop(p, { where, term: 'Sydney' }));
    await G(p, 'nach Suche nach oben');
    errs.push(...await checkFab(p, { where }));
    errs.push(...await checkPrint(p, { where, print: async () => { await p.click('#shareBtn'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'PDF' }).first().click(); } }));
    await p.evaluate(() => dlg.open && dlg.close()); await p.waitForTimeout(200);
    const settings = async () => { await p.click('#mainMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Einstellungen' }).click(); };
    errs.push(...await checkDialogHead(p, { where, open: settings, change: () => p.locator('#fTitle').fill('Australien 2') }));
    errs.push(...await checkFieldErrors(p, { where, open: settings, field: '#fTitle' }));
    // R-5.5 (seit 3.17.0, T-87 / AppDesign A-14): Eingabetaste schließt die Tastatur in einzeiligen Feldern, das Fenster bleibt offen.
    errs.push(...await checkEnterDone(p, { where, open: settings, fields: [{ sel: '#fTitle', text: ' X' }, { sel: '#fPeople', text: ' Y' }] }));
    // R-10.1 (T-83): gleiche Sache, gleiche Bezeichnung – die Feldnamen im Abgleichbericht heißen wie im Fenster ‚Einstellungen‘.
    await settings(); await p.waitForTimeout(300);
    for (const [k, l] of await p.evaluate(() => { const shown = [...dlg.querySelectorAll('.step > label')].map(x => x.textContent.trim());
      return ['title', 'participants', 'transport'].map(k => [k, sync.config.labels[k]]).filter(([, l]) => !shown.includes(l)); }))
      errs.push(`${where}: R-10.1 Abgleichbericht nennt das Feld ${k} ‚${l}‘ – im Fenster heißt es anders`);
    await p.evaluate(() => dlg.close()); await p.waitForTimeout(200);
    // P-32/1 (seit 3.11.6): Werte im Abgleichbericht wie in der App – Reisemittel mit Namen, nicht als Kürzel (R-10.1).
    await p.locator(w < 700 ? '#back' : '#sideMore').first().click(); await p.waitForTimeout(250);
    if (w < 700) { await p.click('#sideMore'); await p.waitForTimeout(150); }
    const later = Date.now() + 9e5, remote = trips.map(x => ({ ...x, transport: ['flug', 'pkw'], metaAt: { transport: later }, changedAt: later, changedOn: 'iPad' }));
    const [ch] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
    await ch.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ settings: {}, trips: remote, savedAt: later, savedOn: 'iPad' })) });
    await p.waitForTimeout(300); await p.locator('.pop button', { hasText: 'Abgleichen' }).click(); await p.waitForTimeout(400);
    await p.click('#msg [data-act]'); await p.waitForTimeout(400);
    const row = await p.evaluate(() => [...document.querySelectorAll('#dlg .sync-report tr')].map(r => [...r.cells].map(c => c.textContent.trim())).find(c => c.includes('Reisemittel')));
    await G(p, 'Abgleichbericht');
    if (!row) errs.push(`${where}: P-32/1 Abgleichbericht ohne Zeile ‚Reisemittel‘`);
    else if (!row.some(c => c.includes('✈️ Flugzeug')) || row.some(c => /\bflug\b|\bpkw\b/.test(c))) errs.push(`${where}: R-10.1 Abgleichbericht zeigt Reisemittel nicht wie in der App: ${row.join(' · ')}`);
    await p.evaluate(() => dlg.close()); await p.waitForTimeout(200);
    if (w < 700 && await p.locator('.irow', { hasText: 'Australien' }).count()) { await p.locator('.irow', { hasText: 'Australien' }).click(); await p.waitForTimeout(300); }
    if (w >= 700) { await p.locator('.side-row', { hasText: 'Australien' }).click(); await p.waitForTimeout(300); }
    errs.push(...await checkCapital(p, { where, open: () => p.evaluate(() => openDayDialog(db.trips[0], '2026-08-25')), field: '#fProgram' }));
    errs.push(...await checkEnterDone(p, { where, open: () => p.evaluate(() => openDayDialog(db.trips[0], '2026-08-25')),
      fields: [{ sel: '#fQuarter', text: ' X' }, { sel: '#fPlace', text: ' Y' }], multi: '#fProgram' }));
    // E1: Gesamtausgaben – Eingabetaste schließt die Tastatur, Betrag wird formatiert und gespeichert.
    if (await p.evaluate(() => dlg.open)) { await p.evaluate(() => dlg.close()); await p.waitForTimeout(200); }
    if (w < 700 && await p.evaluate(() => phoneList)) { await p.locator('.irow, .side-row', { hasText: 'Australien' }).first().click(); await p.waitForTimeout(300); }
    await p.locator('#kosten').scrollIntoViewIfNeeded(); await p.locator('#kosten').fill('');
    errs.push(...await checkEnterDone(p, { where, fields: [{ sel: '#kosten', text: '4850' }] }));
    const betrag = await p.evaluate(() => ({ v: document.getElementById('kosten').value, k: db.trips[0].kosten }));
    if (betrag.v !== '4.850,00' || betrag.k !== 4850) errs.push(`${where}: R-5.5 Gesamtausgaben nach der Eingabetaste ‚${betrag.v}‘ (${betrag.k}) statt ‚4.850,00‘`);
    // R-7.3 Liste steht still: seit 3.21.2 in tests/ablauf-liste-still.mjs (mit Lücke, Tastatur wie Safari, ‹ ›).
    await G(p, 'nach dem Fenster Tag');
  }
  await p.close();
}
await t.ende(b);
