// Reiselogbuch-Test: ablauf-backup-kachel – T-105 (seit 3.32.0, AppDesign A-74, R-9.1; Fall-Liste AppDesign arbeit/A-74 Fall-Liste.md
// B1–B28): die Backup-Kachel steht nur, solange heute auf diesem Gerät noch kein Backup erstellt wurde und es Einträge gibt; nach dem
// Backup verschwindet sie (Fokus auf ‚Mehr‘), um 0:00 und bei der Rückkehr am nächsten Tag kommt sie wieder; Backup laden/Abgleich
// zählt nicht; leere Liste ohne Kachel, die Offline-Zeile steht auch ohne Kachel unten, der letzte Eintrag endet darüber; Suche,
// Kontextmenü (R-4.2), Meldung ‚Du bist offline‘ über der Zeile, Drehen. iPad quer (hell, dunkel), iPad hoch, iPhone hoch und quer;
// Grundregeln nach jedem Schritt. Uhr gestellt (Playwright clock), Tageswechsel ohne Neuladen.
// Aufruf im Repo-Ordner: node tests/ablauf-backup-kachel.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.35.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.35.0/tests/hig.mjs';
import { checkContextMenus } from '../../AppDesign/fassung/4.35.0/tests/kontextmenue.mjs';
const t = pruefung('ablauf-backup-kachel', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL('../index.html', import.meta.url).href;
const trips = Array.from({ length: 14 }, (_, i) => ({ id: 't' + i, title: 'Reise ' + (i + 1), participants: 'A', start: `${2026 - i}-06-01`, end: `${2026 - i}-06-10`, transport: ['pkw'], days: {} }));
const GESTERN = new Date('2026-10-23T21:05:00').getTime();
// Zustand unten in der Seitenleiste bzw. Startliste
const fuss = p => p.evaluate(() => {
  const s = document.getElementById('side'), r = e => e && !e.hidden && e.getBoundingClientRect().height ? e.getBoundingClientRect() : null;
  const b = s.querySelector('.side-foot .bhint'), l = s.querySelector('.side-foot .offl'), liste = s.querySelector('.side-list');
  return { sichtbar: !s.hidden, kachel: b ? b.textContent.replace(/\s+/g, ' ').trim() : null, fuss: !!s.querySelector('.side-foot'), zeile: !!r(l),
    fokus: document.activeElement?.id || document.activeElement?.tagName, zeilen: s.querySelectorAll('.side-row').length,
    ende: (() => { const rows = s.querySelectorAll('.side-row'); if (!rows.length) return null; const alt = liste.scrollTop; liste.scrollTop = liste.scrollHeight;
      const lr = rows[rows.length - 1].getBoundingClientRect(), grenze = Math.min(liste.getBoundingClientRect().bottom, innerHeight, (r(b) || r(l) || { top: innerHeight }).top);
      const ok = lr.bottom <= grenze + 1; liste.scrollTop = alt; return ok; })() };
});
const startliste = async p => { if (await p.locator('#back').count() && !(await p.locator('#side.page').count())) { await p.click('#back'); await p.waitForTimeout(300); } };
const sicht = async p => { await startliste(p); if (await p.evaluate(() => side.hidden)) { await p.evaluate(() => toggleSide()); await p.waitForTimeout(400); } };
const kachelBackup = async p => {
  const [d] = await Promise.all([p.waitForEvent('download', { timeout: 5000 }).catch(() => null), p.click('#hintBackup')]);
  await p.waitForTimeout(300); await p.click('#msg [data-x]'); await p.waitForTimeout(250); return d;
};
const b = await t.browser();
for (const [ansicht, theme, voll] of [['iPad quer', 'light', true], ['iPad quer', 'dark', false], ['iPad hoch', 'light', false], ['iPhone hoch', 'light', true], ['iPhone quer', 'light', false]]) {
  const p = await t.seite(b, ansicht, { theme, acceptDownloads: true });
  await p.clock.install({ time: new Date('2026-10-24T23:56:00') });
  await p.goto(APP);
  await p.evaluate(([x, last]) => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: last }, trips: x })), [trips, GESTERN]);
  await p.reload(); await p.waitForTimeout(500);
  await sicht(p);
  // B1, B8: heute noch kein Backup (letztes gestern) – gelbe Kachel
  await t.schritt(p, 'B1 heute fällig', async () => {
    const f = await fuss(p);
    t.ist('B1 Backup-Kachel', f.kachel, 'Letztes Backup erstellt am 23.10.2026 um 21:05 Backup erstellen', 'R-9.1');
    t.wahr('B1 letzter Eintrag endet über der Kachel', f.ende, 'R-1.1');
  });
  // B2: Backup über die Kachel – Kachel weg, Fokus auf ‚Mehr‘, Liste läuft bis unten
  await t.schritt(p, 'B2 Backup über die Kachel', async () => {
    const d = await kachelBackup(p);
    t.wahr('B2 Backup liefert keine Datei', !!d, 'R-9.1');
    const f = await fuss(p);
    t.ist('B2 Kachel nach dem Backup', f.kachel, null, 'R-9.1');
    t.wahr('B2 Fuß (für die Offline-Zeile) fehlt', f.fuss, 'R-1.5');
    t.ist('B2 Fokus nach dem Schließen der Meldung', f.fokus, 'sideMore', 'R-9.1');
    t.wahr('B17 ohne Kachel ist der letzte Eintrag nicht ganz sichtbar', f.ende, 'R-1.1');
  });
  // B25: Drehen ohne Kachel
  if (voll) await t.schritt(p, 'B25 gedreht ohne Kachel', async () => {
    const vp = p.viewportSize(); await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(500); await sicht(p);
    const f = await fuss(p); t.ist('B25 gedreht: Kachel', f.kachel, null, 'R-9.1'); t.wahr('B25 gedreht: letzter Eintrag nicht ganz sichtbar', f.ende, 'R-1.1');
    await p.setViewportSize(vp); await p.waitForTimeout(500); await sicht(p);
  });
  // B15, B22: offline ohne Kachel – Zeile allein unten, letzter Eintrag darüber, Meldung verdeckt die Zeile nicht
  await t.schritt(p, 'B15 offline ohne Kachel', async () => {
    await p.evaluate(() => setNet('aus')); await p.waitForTimeout(300);
    const f = await fuss(p);
    t.wahr('B15 Offline-Zeile fehlt ohne Kachel', f.zeile, 'R-1.5');
    t.wahr('B15 letzter Eintrag endet nicht über der Offline-Zeile', f.ende, 'R-1.5');
    const ueber = await p.evaluate(() => { const a = document.querySelector('.nettoast')?.getBoundingClientRect(), z = document.querySelector('#side .offl')?.getBoundingClientRect();
      return !!a && !!z && a.left < z.right && z.left < a.right && a.top < z.bottom && z.top < a.bottom; });
    t.wahr('B22 Meldung ‚Du bist offline‘ verdeckt die Offline-Zeile', !ueber, 'R-1.5');
    await p.clock.runFor(5000); await p.evaluate(() => setNet('an')); await p.clock.runFor(5000); await p.waitForTimeout(200);
  });
  // B20: Kontextmenü ohne Kachel ganz sichtbar (über dem Rand bzw. der Zeile)
  if (voll) await t.schritt(p, 'B20 Kontextmenü ohne Kachel', async () => t.liste(await checkContextMenus(p, `${t.ort} ohne Kachel`)));
  // B6: Mitternacht, App bleibt offen – die Kachel kommt ohne Neuladen wieder
  await t.schritt(p, 'B6 Mitternacht', async () => {
    await p.clock.runFor(5 * 60 * 1000); await p.waitForTimeout(300); await sicht(p);
    t.ist('B6 nach Mitternacht: Kachel', (await fuss(p)).kachel, /^Letztes Backup erstellt am 24\.10\.2026 um 23:5\d Backup erstellen$/, 'R-9.1');
  });
  // B21: Suche offen, Kachel fällig – bleibt
  if (voll) await t.schritt(p, 'B21 Suche offen', async () => {
    await p.click('#listSearchBtn'); await p.waitForTimeout(200); await p.fill('#lsearch', 'Reise 1'); await p.clock.runFor(1000); await p.waitForTimeout(200);
    t.wahr('B21 Kachel fehlt bei offener Suche', (await fuss(p)).kachel !== null, 'R-9.1');
    await p.click('#listSearchBtn'); await p.waitForTimeout(200);
  });
  // B19: Kontextmenü mit Kachel (R-4.2)
  if (voll) await t.schritt(p, 'B19 Kontextmenü mit Kachel', async () => t.liste(await checkContextMenus(p, `${t.ort} mit Kachel`)));
  if (voll) {
    // B9, B10: Backup des anderen Geräts laden und abgleichen – ‚Letztes Backup‘ bleibt, die Kachel auch
    await t.schritt(p, 'B9 Abgleich mit Backup vom anderen Gerät', async () => {
      const fremd = await p.evaluate(() => JSON.stringify({ ...db, settings: { lastBackup: Date.now() }, savedAt: Date.now(), savedOn: 'iPhone' }));
      await p.click('#sideMore'); await p.waitForTimeout(150);
      const [ch] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
      await ch.setFiles({ name: 'b.json', mimeType: 'application/json', buffer: Buffer.from(fremd) }); await p.waitForTimeout(300);
      await p.locator('.pop button', { hasText: 'Abgleichen' }).click(); await p.waitForTimeout(300); await p.click('#msg [data-x]').catch(() => {}); await p.waitForTimeout(200);
      await sicht(p);
      t.wahr('B9 Kachel nach dem Abgleich verschwunden (Backup des anderen Geräts zählt nicht)', (await fuss(p)).kachel !== null, 'R-9.1');
    });
    // B4: Backup über das Mehr-Menü – Kachel weg, im Menü ‚Letztes Backup … heute‘
    await t.schritt(p, 'B4 Backup über das Mehr-Menü', async () => {
      await p.click('#sideMore'); await p.waitForTimeout(150);
      await Promise.all([p.waitForEvent('download', { timeout: 5000 }).catch(() => null), p.locator('.menu .mi', { hasText: 'Backup erstellen' }).click()]);
      await p.waitForTimeout(300); await p.click('#msg [data-x]'); await p.waitForTimeout(250);
      t.ist('B4 Kachel nach dem Backup über das Menü', (await fuss(p)).kachel, null, 'R-9.1');
    });
    // B7: im Hintergrund über Mitternacht, dann zurück – Kachel sofort da
    await t.schritt(p, 'B7 Rückkehr am nächsten Tag', async () => {
      await p.clock.setSystemTime(new Date('2026-10-26T08:00:00'));
      await p.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await p.waitForTimeout(300); await sicht(p);
      t.ist('B7 nach der Rückkehr: Kachel', (await fuss(p)).kachel, /^Letztes Backup erstellt am 25\.10\.2026 um \d\d:\d\d Backup erstellen$/, 'R-9.1');
    });
    // B11, B12: leere Liste – keine Kachel, Offline-Zeile trotzdem unten
    await t.schritt(p, 'B11 leere Liste', async () => {
      await p.evaluate(() => { db.trips = []; currentTripId = null; save(); render(); if (dlg.open) dlg.close(); }); await p.waitForTimeout(300); await sicht(p);   // leere App öffnet ‚Neues Reiselogbuch‘
      const f = await fuss(p);
      t.ist('B11 leere Liste: Kachel', [f.zeilen, f.kachel, f.fuss], [0, null, true], 'R-9.1');
      await p.click('#sideMore'); await p.waitForTimeout(150);
      t.wahr('B11 ‚Backup erstellen‘ im Mehr-Menü nicht grau', await p.locator('.menu .mi', { hasText: 'Backup erstellen' }).isDisabled(), 'R-9.1');
      await p.keyboard.press('Escape'); await p.waitForTimeout(150); if (await p.locator('.menu').count()) { await p.mouse.click(5, 5); await p.waitForTimeout(150); }
      await p.evaluate(() => setNet('aus')); await p.waitForTimeout(300);
      t.wahr('B12 leere Liste offline: Offline-Zeile fehlt', (await fuss(p)).zeile, 'R-1.5');
      await p.clock.runFor(5000); await p.evaluate(() => setNet('an')); await p.clock.runFor(5000);
    });
    // B13: erster Eintrag (heute kein Backup) – Kachel erscheint
    await t.schritt(p, 'B13 erster Eintrag', async () => {
      await p.evaluate(x => { db.trips = normalize({ trips: x }).trips; save(); render(); }, trips.slice(0, 1)); await p.waitForTimeout(300); await sicht(p);
      t.wahr('B13 Kachel fehlt nach dem ersten Eintrag', (await fuss(p)).kachel !== null, 'R-9.1');
    });
  }
  await p.close();
}
await t.ende(b);
