// Ablauf-Prüfungen der allgemeinen Regeln (AppDesign/tests/ablauf.mjs): R-2.3 Suche, R-4.4 Fenster-Kopfzeile, R-5.2 Texteingabe,
// R-5.3 Fehlermeldungen, R-6.4 Vorschau – iPad quer und iPhone hoch, Vorschau hell und dunkel. Aufruf im Repo-Ordner: node tests/regeln-ablauf.mjs
import { chromium } from 'playwright';
import { checkSearch, checkDialogHead, checkFieldErrors, checkCapital, checkPreview } from '../../AppDesign/tests/ablauf.mjs';
const days = {}; for (let i = 0; i < 40; i++) { const d = new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10); days[d] = { weather: '☀️', program: i >= 30 && i < 34 ? 'Fahrt nach Sydney' : 'Programm ' + i, comment: '😉 ok', quarter: 'Hotel', place: 'Ort' }; }
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-24', end: '2026-11-11', transport: ['flug'], foodColumn: true, days }];
const b = await chromium.launch(); const errs = [];
for (const [w, h, scheme, dev] of [[1180, 820, 'light', 'iPad quer'], [393, 852, 'light', 'iPhone hoch'], [1180, 820, 'dark', 'iPad quer dunkel'], [393, 852, 'dark', 'iPhone hoch dunkel']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700, colorScheme: scheme });
  p.on('pageerror', e => errs.push(`${dev}: Skriptfehler ${e.message}`));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() }, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
  if (!await p.locator('#mainMore').count()) { await p.locator('.irow, .side-row', { hasText: 'Australien' }).first().click(); await p.waitForTimeout(300); }
  const where = dev;
  errs.push(...await checkPreview(p, { where, open: async () => { await p.click('#shareBtn'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); } }));
  if (scheme === 'light') {
    errs.push(...await checkSearch(p, { where, term: 'Sydney', item: w < 700 ? '#pdays [data-day]' : 'table.days tbody [data-day]' }));
    const settings = async () => { await p.click('#mainMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Einstellungen' }).click(); };
    errs.push(...await checkDialogHead(p, { where, open: settings, change: () => p.locator('#fTitle').fill('Australien 2') }));
    errs.push(...await checkFieldErrors(p, { where, open: settings, field: '#fTitle' }));
    // R-10.1 (T-83): gleiche Sache, gleiche Bezeichnung – die Feldnamen im Abgleichbericht heißen wie im Fenster ‚Einstellungen‘.
    await settings(); await p.waitForTimeout(300);
    for (const [k, l] of await p.evaluate(() => { const shown = [...dlg.querySelectorAll('.step > label')].map(x => x.textContent.trim());
      return ['title', 'participants', 'transport'].map(k => [k, sync.config.labels[k]]).filter(([, l]) => !shown.includes(l)); }))
      errs.push(`${where}: R-10.1 Abgleichbericht nennt das Feld ${k} ‚${l}‘ – im Fenster heißt es anders`);
    await p.evaluate(() => dlg.close()); await p.waitForTimeout(200);
    errs.push(...await checkCapital(p, { where, open: () => p.evaluate(() => openDayDialog(db.trips[0], '2026-08-25')), field: '#fProgram' }));
  }
  await p.close();
}
console.log('ERR', JSON.stringify(errs, null, 1)); await b.close();
