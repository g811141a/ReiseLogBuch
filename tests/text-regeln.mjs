// Reiselogbuch-Test: text-regeln – Textgröße folgt dem Gerät (seit 3.35.0, RLB-101, AppDesign APD-43 Teil 2, R-1.10; Testfall-Liste
// AppDesign arbeit/APD-43 Teil 2 Testfall-Liste.md). In allen vier Ansichten wechselt die Textgröße bei offener Seite von Standard auf
// AX5 (53 px) und zurück (hig.mjs checkText): Startseite bzw. Startliste, Tag-Fenster, Mehr-Menü, Vorschau der Ausgabe (W3); dazu W1 –
// oberster Tag bleibt, offenes Fenster bleibt offen, am iPad Tabelle ↔ Kästen (U4). Dieselbe Prüfung läuft für die Gegenprobe der
// Textgröße (node tests/alle.mjs --gegenprobe text): je eingeschleustem Fehler wird genau seine Meldung rot.
// Aufruf im Repo-Ordner: node tests/text-regeln.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.44.1/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.44.1/tests/hig.mjs';
const hig = createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.dlg-body.preview a'] });
const t = pruefung('text-regeln', pw, { hig, out: new URL('out/', import.meta.url) });
const days = {};
for (let i = 0; i < 30; i++) { const d = new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10); days[d] = { weather: '☀️', program: 'Programm ' + i + ' mit einem etwas längeren Text', comment: '😉 ok', place: 'Hotel ' + i, food: 'Essen' }; }
const trips = [{ id: 'a', title: 'Australien und Neuseeland mit langem Titel', participants: 'G & A', start: '2026-08-24', end: '2026-09-22', transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, days },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-05-03', end: '2027-05-17', transport: ['pkw'], days: {} }];
const b = await t.browser();
const G = (p, name, fn = async () => {}) => t.schritt(p, name, fn);
const warte = (p, ms = 250) => p.waitForTimeout(ms);
const groesse = async (p, px) => { await p.evaluate(px => { let s = document.getElementById('pruef-groesse');
  if (!px) return s?.remove(); if (!s) { s = document.createElement('style'); s.id = 'pruef-groesse'; document.head.append(s); } s.textContent = `html { font-size: ${px}px !important; }`; }, px); await warte(p, 600); };

for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch', 'iPhone quer']) {
  const p = await t.seite(b, ansicht);
  const phone = ansicht.startsWith('iPhone');
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now() - 864e5 * 2 }, trips: x })), trips);
  await G(p, 'Start', async () => { await p.reload(); await warte(p, 400); });
  try {
    t.ist('Stufe bei Standard', await p.evaluate(() => document.documentElement.dataset.ts), 'l', 'R-1.10');
    if (phone) await hig.checkText(p, `${t.ort} · Startliste`);
    if (phone) await G(p, 'Reise öffnen', async () => { await p.locator('#side .side-row', { hasText: 'Australien' }).click(); await warte(p, 600); });
    await hig.checkText(p, `${t.ort} · Reise`);
    // iPad hoch: die Seitenleiste liegt beim Start darüber – geprüft (oben), dann schließen
    if (await p.locator('.side-shade').isVisible().catch(() => false)) await G(p, 'Seitenleiste schließen', async () => { await p.locator('.side-shade').click({ position: { x: 700, y: 600 } }); await warte(p, 500); });
    // W1: gerollt – derselbe Tag bleibt oben (iPad: Tabelle → Kästen), offenes Fenster bleibt offen
    if (!ansicht.endsWith('quer') || !phone) {
      await p.evaluate(() => { const e = document.querySelector('[data-day="2026-09-05"]'); rolle.by(e.getBoundingClientRect().top - document.querySelector('#bar').getBoundingClientRect().bottom); });
      await warte(p, 300);
      const oben = () => p.evaluate(() => { const edge = document.querySelector('#bar').getBoundingClientRect().bottom;
        return [...document.querySelectorAll('#app [data-day]')].find(x => x.getClientRects().length && x.getBoundingClientRect().bottom > edge + 1)?.dataset.day; });
      const vorher = await oben();
      await G(p, 'Textgröße AX5 (gerollt)', () => groesse(p, 53));
      t.ist('W1 oberster Tag nach dem Wechsel auf AX5', await oben(), vorher, 'R-8.1');
      if (!phone) t.ist('U4 Tage am iPad bei AX5 als Kästen', await p.evaluate(() => [!!document.querySelector('table.days:not(.static)'), document.querySelectorAll('#pdays .box.day').length > 0]), [false, true], 'R-1.10');
      await G(p, 'Textgröße zurück', () => groesse(p, 0));
      t.ist('W1 oberster Tag nach dem Zurückstellen', await oben(), vorher, 'R-8.1');
      if (!phone) t.ist('U4 Tage am iPad bei Standard als Tabelle', await p.evaluate(() => !!document.querySelector('table.days:not(.static)')), true, 'R-1.10');
      await p.evaluate(() => rolle.to(0)); await warte(p);
    }
    await G(p, 'Tag-Fenster', async () => { await p.evaluate(() => openDayDialog(db.trips.find(x => x.id === 'a'), '2026-08-25')); await warte(p, 400); });
    await hig.checkText(p, `${t.ort} · Tag-Fenster`);
    await G(p, 'Fenster bei AX5 offen', () => groesse(p, 53));
    t.ist('W1 Fenster bleibt beim Wechsel offen', await p.evaluate(() => dlg.open), true, 'R-8.1');
    await groesse(p, 0);
    await p.evaluate(() => dlg.close()); await warte(p);
    await G(p, 'Mehr-Menü', async () => { await p.click('#mainMore'); await warte(p, 250); });
    await hig.checkText(p, `${t.ort} · Mehr-Menü`);
    await p.evaluate(() => document.querySelector('.layer')?.click()); await warte(p);
    await G(p, 'Vorschau der Ausgabe', async () => { await p.evaluate(() => openPreview(db.trips.find(x => x.id === 'a'))); await warte(p, 500); });
    await hig.checkText(p, `${t.ort} · Vorschau`);
    await p.evaluate(() => dlg.close()); await warte(p);
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
