// Reiselogbuch-Test: ablauf-beruehren (seit 3.46.0) – AppDesign APD-105, R-3.6 und R-3.5 ‚Anheben‘ (Testfall-Liste AppDesign
// arbeit/APD-105 Testfall-Liste.md B-1 bis B-8): beim Berühren wird eine Schaltfläche blass (35 %), eine Listen- oder Tabellenzeile grau –
// Schaltflächen sofort, in Rollbereichen nach 80 ms; 20 px Wegziehen oder Rollen hebt es auf, ohne auszulösen; Loslassen blendet in
// 0,15 s aus; gesperrte Schaltflächen zeigen nichts. Je Ansicht (iPad quer, iPhone hoch; hell und dunkel): Knopf der Kopfzeile (Mehr),
// Tageszeile der Tabelle bzw. Tageskasten (iPhone), Zeile der Seitenleiste (iPad), Kapsel ‚Wetter‘ im Fenster eines Tages, gesperrter
// Knopf ‚Voriger Treffer‘ (Suche ohne Text); Smiley-Leiste: hebt sich ab 0,15 s an, nach 0,6 s die Frage ‚Entfernen‘, Loslassen fügt nichts
// ein, Wegziehen senkt es wieder (B-5, B-6, B-8); ‚Bewegung reduzieren‘: Anheben nur mit Schatten. Grundregeln nach jedem Schritt.
// Gegenprobe: gegen 3.45.0 mit PRUEF_APP=../_alt.html rot (B-1, B-3, B-5).
// Seit 3.46.2 (AppDesign APD-107, Testfall-Liste arbeit/APD-107 Testfall-Liste.md S-1 bis S-13): Leisten-Knöpfe (Mehr der Kopfzeile, Mehr der
// Seitenleiste, x im Fenster, ‚Nach oben‘) heben sich als helle Fläche mit Schatten 1,3-fach zuoberst über die Kapsel, ‚Bewegung reduzieren‘ ohne
// Wachsen; Wegziehen, 1 s liegen lassen, loslassen löst nichts aus (Knöpfe, Tageszeile), danach Antippen genau einmal, die Leertaste sofort;
// der Kreis des Smileys liegt im modalen Fenster zuoberst, nach dem Schließen bleibt kein Kreis zurück. Rot gegen 3.46.1: S-1, S-2, S-4, S-7, S-10, S-12.
// Seit 3.48.0 (AppDesign APD-108, Testfall-Liste AppDesign arbeit/APD-108 Testfall-Liste.md W-5, W-7): über den 📍-Link eines Tages 30 px waagrecht
// wischen und loslassen – der Klick, der wie in Safari 4 ms danach kommt, öffnet den Link nicht und kein Fenster des Tages; gleich danach kurz
// antippen öffnet ihn genau einmal. Rot gegen 3.47.1 (W-5).
// Aufruf im Repo-Ordner: node tests/ablauf-beruehren.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.56.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.56.0/tests/hig.mjs';
import { checkBeruehren, checkAnheben, wischKlick } from '../../AppDesign/fassung/4.56.0/tests/ablauf.mjs';
const t = pruefung('ablauf-beruehren', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const iso = i => new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10);
const days = {}; for (let i = 0; i < 20; i++) days[iso(i)] = { weather: '☀️', program: `Programm ${i + 1} mit etwas mehr Text für eine lange Seite`, place: 'Hafen', ...(i === 1 ? { quarter: 'Hotel Bellevue' } : {}) };
const trips = [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(0), end: iso(19), transport: ['flug'], moodColumn: true, days },
  { id: 'b', title: 'Toskana', participants: 'G', start: '2027-06-03', end: '2027-06-17', transport: ['pkw'], days: {} }];
const start = async p => {
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
  if (await p.evaluate(() => isPhone()) && await p.locator('#side.page').isVisible()) {
    await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400); await navFertig(p);
  }
};

const b = await t.browser();
for (const [ansicht, theme, ruhig] of [['iPad quer', 'light', false], ['iPad quer', 'dark', false], ['iPhone hoch', 'light', false], ['iPhone hoch', 'dark', true]]) {
  const p = await t.seite(b, ansicht, { theme, ...(ruhig ? { reducedMotion: 'reduce' } : {}) });
  if (ruhig) t.ort = `${t.ort} · ruhig`;
  try {
    await start(p);
    const phone = await p.evaluate(() => isPhone());
    // B-1 bis B-4: Knopf der Kopfzeile sofort, Tageszeile im Rollbereich nach 80 ms, Rollen hebt auf
    await t.schritt(p, 'Kopfzeile und Tage', async () => t.liste(await checkBeruehren(p, { knopf: '#mainMore',
      zeile: phone ? '#pdays [data-day]:nth-child(2)' : '#app tbody tr[data-day]:nth-child(2)', rollen: '#app > .rolle', where: 'Kopfzeile und Tage' })));
    // Seitenleiste (iPad quer): Zeile ‚Toskana‘ (die aktuelle bleibt blau)
    if (!phone) await t.schritt(p, 'Seitenleiste', async () => t.liste(await checkBeruehren(p, { knopf: '#sideMore', zeile: '#side .side-row[data-id="b"]', where: 'Seitenleiste' })));
    // APD-107/S-10: schwebender Knopf ‚Nach oben‘
    // (nur wo die schwebenden Knöpfe zu sehen sind – iPad quer stehen sie still, wenn der Inhalt passt: .fab.still)
    if (await p.evaluate(() => !!document.querySelector('#toTop')?.getClientRects().length))
      await t.schritt(p, 'schwebende Knöpfe', async () => t.liste(await checkBeruehren(p, { knopf: '#toTop', where: 'Nach oben' })));
    // APD-108/W-5, W-7: Wischen über den 📍-Link öffnet ihn nicht, kein Fenster des Tages; danach kurz antippen öffnet ihn genau einmal
    await t.schritt(p, 'APD-108 Wischen über einen Link', async () => {
      const link = phone ? '#pdays .ln.q a' : '#app td.quarter a, #app .ln.q a';
      await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'center' }), link); await navFertig(p);
      const k = await wischKlick(p, link, [[-10, 0], [-20, 0], [-30, 0]], { tipp: true, halten: true });
      t.wahr(`APD-108/W-5 ${k.fehlt ? `Vorbereitung: ${k.fehlt} fehlt` : 'über den 📍-Link gewischt: der Link öffnet nicht'}`, !k.fehlt && k.wisch === 0, 'R-7.5');
      t.wahr('APD-108/W-5 über den 📍-Link gewischt: kein Fenster des Tages', !k.fenster, 'R-7.5');
      t.wahr(`APD-108/W-7 gleich danach kurz angetippt: der Link öffnet genau einmal (${k.tipp}-mal)`, k.tipp === 1, 'R-7.5');
      if (await p.evaluate(() => dlg.open)) { await p.evaluate(() => { dlgDirty = () => false; dlg.close(); }); await navFertig(p); }
    });
    // gesperrter Knopf: Suche ohne Text – ‚Voriger Treffer‘ ist gesperrt
    await p.evaluate(() => openTripSearch()); await p.waitForTimeout(400);
    await t.schritt(p, 'gesperrter Knopf', async () => t.liste(await checkBeruehren(p, { gesperrt: '#sprev', where: 'Suche' })));
    await p.locator('#sclose').click(); await p.waitForTimeout(400); await navFertig(p);
    // Fenster eines Tages: Kapsel ‚Wetter‘ (Rollbereich), Fenster-Kopfzeile (sofort); Smiley-Leiste: Anheben (B-5, B-6, B-8)
    await p.evaluate(d => openDayDialog(db.trips[0], d), iso(2)); await p.waitForTimeout(700); await navFertig(p);
    await t.schritt(p, 'Fenster eines Tages', async () => t.liste(await checkBeruehren(p, { knopf: '#dlgX', kapsel: '#dlg #wx button:nth-child(2)', where: 'Fenster eines Tages' })));
    await t.schritt(p, 'Smiley anheben', async () => t.liste(await checkAnheben(p, { sel: '#dlg #moods [data-m]:first-child', feld: '#dlg #fComment', entfernen: true, where: 'Smiley-Leiste' })));
    t.wahr('nach den Prüfungen ist das Fenster des Tages noch offen', await p.evaluate(() => dlg.open), 'R-3.6');
    await p.evaluate(() => { dlgDirty = () => false; dlg.close(); }); await p.waitForTimeout(400); await navFertig(p);
    t.wahr('APD-107/S-8 nach dem Schließen des Fensters bleibt kein Kreis des Smileys zurück', await p.evaluate(() => !document.querySelector('.schwebt')), 'R-3.5');
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  await p.close();
}
await t.ende(b);
