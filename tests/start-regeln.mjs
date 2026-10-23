// Reiselogbuch-Test: start-regeln – Aufruf im Repo-Ordner: node tests/start-regeln.mjs
// Start nach dem Neuladen (R-7.2, seit 3.15.0, T-84 / AppDesign A-09; Fall-Liste AppDesign arbeit/T-84 Fall-Liste.md):
// iPhone-Aufbau (iPhone hoch und quer, iPad im schmalen Fenster) beginnt in der Startliste ohne blauen Eintrag, der iPad-Aufbau
// öffnet wie bisher die laufende Reise. Hell und dunkel, Grundregeln nach den Schritten (pruefe.mjs).
// Seit 3.17.0 (T-88): zuletzt verwendetes Reiselogbuch – iPad-Aufbau öffnet es, Startliste bleibt ohne Blau.
// F-12 (Start ohne Netz) prüft offline-regeln.mjs, F-18 (Löschen → Startliste) ablauf-iphone.mjs.
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.32.1/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.32.1/tests/hig.mjs';
import { checkStart, checkRueckkehr } from '../../AppDesign/fassung/4.32.1/tests/start.mjs';
const t = pruefung('start-regeln', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const reise = (id, title, start, end, days = {}) => ({ id, title, participants: 'Anna', start, end, transport: ['pkw'], days });
const LAUFEND = [reise('a', 'Australien', '2026-08-24', '2026-09-05', { '2026-08-24': { program: 'Ankunft Sydney' } }), reise('b', 'Toskana', '2027-05-03', '2027-05-17'), reise('c', 'Island', '2025-07-01', '2025-07-10')];
const BEENDET = [reise('c', 'Island', '2025-07-01', '2025-07-10'), reise('d', 'Rom', '2024-04-01', '2024-04-05')];
const GEPLANT = [reise('b', 'Toskana', '2027-05-03', '2027-05-17')];
const VIELE = Array.from({ length: 14 }, (_, i) => reise('v' + i, 'Reise ' + (i + 1), `${2026 - i}-06-01`, `${2026 - i}-06-10`));
const SCHMAL = { viewport: { width: 600, height: 900 } };   // iPad im schmalen Fenster (Split View): iPhone-Aufbau, kein iPhone
const START = '.pnav-title, .nb-title';                       // Merkmal eines geöffneten Reiselogbuchs (iPhone bzw. iPad)

const b = await t.browser();
const lade = async (p, trips) => {
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(300);
};
const titel = p => p.locator(START).first().textContent().catch(() => '');
const istListe = p => p.locator('#side.page').isVisible();
const blau = p => p.locator('#side .side-row.current').evaluateAll(l => l.map(e => e.dataset.id));

for (const theme of ['light', 'dark']) {
  // F-1, F-2, F-15: iPhone hoch, iPhone quer, iPad schmal – Start, Rückkehr, Drehen, Öffnen, Zurück, Neuladen
  for (const [name, ansicht] of [['iPhone hoch', 'iPhone hoch'], ['iPhone quer', 'iPhone quer'], ['iPad schmal', SCHMAL]]) {
    const p = await t.seite(b, ansicht, { theme });
    if (typeof ansicht !== 'string') t.ort = `${name} ${theme === 'dark' ? 'dunkel' : 'hell'}`;
    await lade(p, LAUFEND);
    t.liste(await checkStart(p, { inhalt: START }));                                   // F-1, F-2, F-15
    await t.schritt(p, 'Start', async () => {});
    t.liste(await checkRueckkehr(p));                                                  // F-10 in der Startliste
    if (name.startsWith('iPhone')) {                                                   // F-8: Drehen in der Startliste
      const v = p.viewportSize();
      await p.setViewportSize({ width: v.height, height: v.width }); await p.waitForTimeout(300);
      t.wahr('F-8 nach dem Drehen nicht mehr in der Startliste', await istListe(p), 'R-7.2');
      t.ist('F-8 nach dem Drehen blauer Eintrag', await blau(p), [], 'R-7.2');
      await p.setViewportSize(v); await p.waitForTimeout(300);
    }
    await t.schritt(p, 'Reiselogbuch aus der Startliste öffnen', () => p.locator('#side .side-row[data-id="a"]').click().then(() => p.waitForTimeout(350)));
    t.ist('F-6 geöffnetes Reiselogbuch', (await titel(p)).trim(), 'Australien', 'R-7.2');
    t.ist('F-6 Sprung zum ersten offenen Tag', await p.locator('#pdays .box.gap').count(), 1);
    t.liste(await checkRueckkehr(p));                                                  // F-10 im Reiselogbuch
    if (name.startsWith('iPhone')) {                                                   // F-9: Drehen im Reiselogbuch
      const v = p.viewportSize();
      await p.setViewportSize({ width: v.height, height: v.width }); await p.waitForTimeout(300);
      t.ist('F-9 nach dem Drehen nicht mehr im Reiselogbuch', (await titel(p)).trim(), 'Australien', 'R-8.1');
      await p.setViewportSize(v); await p.waitForTimeout(300);
    }
    await t.schritt(p, 'Zurück zur Startliste', () => p.click('#back').then(() => p.waitForTimeout(250)));
    t.ist('F-7 nach ‚Zurück‘ ist das zuletzt geöffnete blau', await blau(p), ['a'], 'R-7.2');
    await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(300);
    await p.reload(); await p.waitForTimeout(300);                                     // F-11: Neuladen im Reiselogbuch
    t.liste(await checkStart(p, { inhalt: START }));
    await t.schritt(p, 'Neuladen im Reiselogbuch', async () => {});
    if (name === 'iPad schmal') {                                                      // F-16: Wechsel des Aufbaus
      await p.setViewportSize({ width: 1180, height: 820 }); await p.waitForTimeout(350);
      t.ist('F-16 breit: Reiselogbuch mit Seitenleiste', (await titel(p)).trim(), 'Australien', 'R-7.2');
      t.ist('F-16 breit: geöffnetes blau', await blau(p), ['a'], 'R-7.2');
      await t.schritt(p, 'breit', async () => {});
      await p.setViewportSize(SCHMAL.viewport); await p.waitForTimeout(350);
      t.wahr('F-16 wieder schmal: nicht in der Startliste', await istListe(p), 'R-7.2');
    }
    await p.close();
  }
  // F-3, F-4, F-5: iPhone hoch mit nur beendeten, nur geplanten, keinen und vielen Reisen
  for (const [fall, trips] of [['F-3 nur beendet', BEENDET], ['F-3 nur geplant', GEPLANT], ['F-4 leer', []], ['F-5 viele', VIELE]]) {
    const p = await t.seite(b, 'iPhone hoch', { theme });
    t.ort = `iPhone hoch ${theme === 'dark' ? 'dunkel' : 'hell'} · ${fall}`;
    await lade(p, trips);
    t.liste(await checkStart(p, { inhalt: START, leer: !trips.length }));
    if (!trips.length) {
      t.ist('F-4 Hinweis in der leeren Startliste', (await p.locator('#side .side-empty').textContent().catch(() => '')).trim(), 'Noch kein Reiselogbuch angelegt.');
      t.wahr('F-4 Fenster ‚Neues Reiselogbuch‘ öffnet nicht', await p.evaluate(() => !!document.querySelector('dialog[open]')));
    } else await t.schritt(p, 'Start', async () => {});
    await p.close();
  }
  // F-13, F-14: iPad quer und hoch unverändert – laufende Reise offen, Seitenleiste eingeblendet
  for (const ansicht of ['iPad quer', 'iPad hoch']) {
    const p = await t.seite(b, ansicht, { theme });
    await lade(p, LAUFEND);
    t.liste(await checkStart(p, { inhalt: START }));
    t.ist('F-13/14 laufende Reise geöffnet', (await titel(p)).trim(), 'Australien');
    t.ist('F-13/14 laufende Reise blau', await blau(p), ['a']);
    await t.schritt(p, 'Start', async () => {});
    await p.close();
  }
  // T-88 (seit 3.17.0, Fall-Liste AppDesign arbeit/A-14 T-88 Fall-Liste.md): zuletzt verwendetes Reiselogbuch beim Start.
  if (theme === 'light') {
    const letztes = p => p.evaluate(() => JSON.parse(localStorage.getItem('reiselogbuch.v1')).settings.lastTrip);
    for (const ansicht of ['iPad quer', 'iPad hoch']) {                                // S1, S2, S9: B statt laufender Reise A
      const p = await t.seite(b, ansicht, { theme });
      t.ort = `${ansicht} · T-88`;
      await lade(p, LAUFEND);
      await p.locator('#side .side-row[data-id="b"]').click(); await p.waitForTimeout(300);
      await p.reload(); await p.waitForTimeout(300);
      t.liste(await checkStart(p, { inhalt: START }));
      t.ist('S1/S2 nach dem Neuladen zuletzt verwendetes offen', (await titel(p)).trim(), 'Toskana', 'T-88');
      t.ist('S1/S2 zuletzt verwendetes blau', await blau(p), ['b'], 'T-88');
      await t.schritt(p, 'Start mit zuletzt verwendetem', async () => {});
      await p.close();
    }
    {                                                                                  // S3, S4: gelöscht bzw. alte Daten → nach Datum
      const p = await t.seite(b, 'iPad quer', { theme });
      t.ort = 'iPad quer · T-88 S3';
      await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
      await p.goto(APP);
      await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastTrip: 'weg' }, trips: t })), LAUFEND);
      await p.reload(); await p.waitForTimeout(300);
      t.ist('S3 gelöschtes zuletzt verwendetes → laufende Reise', (await titel(p)).trim(), 'Australien', 'T-88');
      await p.close();
    }
    {                                                                                  // S6: neu angelegtes gilt als zuletzt verwendet
      const p = await t.seite(b, 'iPad quer', { theme });
      t.ort = 'iPad quer · T-88 S6';
      await lade(p, BEENDET);
      await p.click('#newTrip'); await p.waitForTimeout(350);
      await p.locator('#fTitle').fill('Neuland'); await p.locator('#fPeople').fill('Anna');
      await p.locator('#dlg [data-t]').first().click(); await p.click('#dlgOk'); await p.waitForTimeout(350);
      await p.reload(); await p.waitForTimeout(300);
      t.ist('S6 neues Reiselogbuch nach dem Neuladen offen', (await titel(p)).trim(), 'Neuland', 'T-88');
      await p.close();
    }
    for (const wahl of ['Ersetzen', 'Abgleichen']) {                                  // S7, S8: Wert aus der Datei wird nicht übernommen
      const p = await t.seite(b, 'iPad quer', { theme });
      t.ort = `iPad quer · T-88 ${wahl}`;
      await lade(p, LAUFEND);
      await p.locator('#side .side-row[data-id="b"]').click(); await p.waitForTimeout(300);
      await p.click('#sideMore'); await p.waitForTimeout(150);
      const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
      await chooser.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ settings: { lastTrip: 'c' }, trips: LAUFEND, savedAt: Date.now(), savedOn: 'iPhone' })) });
      await p.waitForTimeout(250);
      await p.locator('.pop button', { hasText: wahl }).click(); await p.waitForTimeout(350);
      await p.click('#msg [data-x]').catch(() => {}); await p.evaluate(() => dlg.open && dlg.close()); await p.waitForTimeout(200);
      t.ist(`S7/S8 ${wahl}: zuletzt verwendetes dieses Geräts`, await letztes(p), 'b', 'T-88');
      t.ist(`S7/S8 ${wahl}: geöffnet`, (await titel(p)).trim(), 'Toskana', 'T-88');
      await p.close();
    }
    for (const ansicht of ['iPhone hoch', SCHMAL]) {                                   // S11: Startliste ohne blauen Eintrag (R-7.2 bleibt)
      const p = await t.seite(b, ansicht, { theme });
      if (typeof ansicht !== 'string') t.ort = 'iPad schmal · T-88 S11';
      await lade(p, LAUFEND);
      await p.locator('#side .side-row[data-id="b"]').click(); await p.waitForTimeout(300);
      await p.reload(); await p.waitForTimeout(300);
      t.liste(await checkStart(p, { inhalt: START }));
      t.ist('S11 zuletzt verwendetes gemerkt', await letztes(p), 'b', 'T-88');
      await p.close();
    }
  }
  // F-17: Backup laden und abgleichen aus der Startliste – sie bleibt stehen
  {
    const p = await t.seite(b, 'iPhone hoch', { theme });
    t.ort = `iPhone hoch ${theme === 'dark' ? 'dunkel' : 'hell'} · F-17`;
    await lade(p, LAUFEND);
    await p.click('#sideMore'); await p.waitForTimeout(150);
    const [chooser] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
    await chooser.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ settings: {}, trips: [...LAUFEND, reise('e', 'Wien', '2023-03-01', '2023-03-04')], savedAt: Date.now(), savedOn: 'iPad' })) });
    await p.waitForTimeout(250);
    await p.locator('.pop button', { hasText: 'Abgleichen' }).click(); await p.waitForTimeout(300);
    await p.click('#msg [data-x]').catch(() => {}); await p.waitForTimeout(200);
    t.wahr('F-17 nach dem Abgleich nicht mehr in der Startliste', await istListe(p), 'R-7.2');
    t.ist('F-17 Eintrag aus dem Backup in der Startliste', await p.locator('#side .side-row[data-id="e"]').count(), 1);
    t.ist('F-17 blauer Eintrag nach dem Abgleich', await blau(p), [], 'R-7.2');
    await t.schritt(p, 'nach dem Abgleich', async () => {});
    await p.close();
  }
}
await t.ende(b);
