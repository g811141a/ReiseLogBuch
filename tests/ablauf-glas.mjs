// Reiselogbuch-Test: ablauf-glas (seit 3.52.0) – AppDesign APD-120 ‚Glas abschalten‘ (Testfall-Liste AppDesign arbeit/APD-120 Testfall-Liste.md
// APD-120/J-1 bis J-13, Variante A): Schalter ‚Glas‘ als eigene Gruppe im Untermenü ‚Darstellung‘ (Mehr der Seitenleiste bzw. der Startliste).
// iPad quer hell und dunkel, iPad hoch, iPhone hoch und quer: Standard ein (J-12), aus → Menü, Kapsel und untere Leiste deckend (J-1, J-4, J-5),
// Menü bleibt offen, Leertaste schaltet (J-6), ganz sichtbar (J-7), neu laden → Wahl bleibt (J-3), wieder ein → Glas (J-2) – checkGlas.
// Backup (J-9): Glas aus, Backup, leerer Speicher (Neuinstallation), Backup laden → aus; altes Backup ohne Wert → ein. Anderes Gerät (J-13): hier
// ein gewählt, Backup mit aus laden (Ersetzen) → bleibt ein; Abgleichen (J-8) ebenso. Grundregeln nach jedem Schritt (J-10).
// Gegenprobe (J-11): lauf.mjs --gegenprobe masse (Glas bleibt bei Schalter aus) bzw. gegen 3.51.0 mit PRUEF_APP=../_alt.html rot.
// Aufruf im Repo-Ordner: node tests/ablauf-glas.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.59.1/tests/pruefe.mjs';
import { createCheck, checkGlas } from '../../AppDesign/fassung/4.59.1/tests/hig.mjs';
const t = pruefung('ablauf-glas', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const trips = [{ id: 'a', title: 'Australien', participants: 'G', start: '2026-08-24', end: '2026-09-05', transport: ['flug'], days: { '2026-08-24': { program: 'Sydney' } } }];
const KEY = 'reiselogbuch.v1';
const start = async (p, settings = {}) => {
  await p.clock.setFixedTime(new Date('2026-08-27T14:32:00'));
  await p.goto(APP);
  await p.evaluate(([k, x, s]) => localStorage.setItem(k, JSON.stringify({ settings: { lastBackup: Date.now(), ...s }, trips: x })), [KEY, trips, settings]);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
};
const ohneGlas = p => p.evaluate(() => document.documentElement.classList.contains('ohne-glas'));
// Backup-Datei wie die App sie schreibt (backupFile), mit glas nach Wunsch (undefined = altes Backup ohne Wert)
const datei = (p, glas) => p.evaluate(async g => { const alt = db.settings.glas; if (g === undefined) delete db.settings.glas; else db.settings.glas = g;
  const f = backupFile(); if (alt === undefined) delete db.settings.glas; else db.settings.glas = alt; return { name: f.name, text: f.content }; }, glas);
const fensterZu = async p => { for (let k = 0; k < 3 && await p.evaluate(() => document.getElementById('msg')?.open || document.getElementById('dlg')?.open); k++) {
  await p.evaluate(() => { for (const d of ['msg', 'dlg']) if (document.getElementById(d)?.open) document.getElementById(d).close(); }); await p.waitForTimeout(250); } };
const laden = async (p, f, weg) => {
  await fensterZu(p);
  await p.click('#sideMore'); await p.waitForTimeout(300);
  const [ch] = await Promise.all([p.waitForEvent('filechooser'), p.locator('.menu .mi', { hasText: 'Backup laden' }).click()]);
  await ch.setFiles({ name: f.name, mimeType: 'application/json', buffer: Buffer.from(f.text) }); await p.waitForTimeout(400);
  await p.locator('.pop .tile button', { hasText: weg }).click(); await p.waitForTimeout(500);
  await fensterZu(p);
};
const b = await t.browser();
for (const [ansicht, theme] of [['iPad quer', 'light'], ['iPad quer', 'dark'], ['iPad hoch', 'light'], ['iPhone hoch', 'light'], ['iPhone quer', 'dark']]) {
  const p = await t.seite(b, ansicht, { theme });
  await start(p);
  t.ist('J-12 neu: Glas ein', await ohneGlas(p), false, 'R-3.9');
  await t.schritt(p, 'Schalter Glas', async () => t.liste(await checkGlas(p, { menue: '#sideMore', schalter: 'Darstellung', where: t.ort })));
  await p.close();
}
{
  const p = await t.seite(b, 'iPad quer', { theme: 'light' });
  t.ort = 'iPad quer · Backup';
  // J-9: Glas aus, Backup, Neuinstallation (leerer Speicher), Backup laden → aus
  await start(p, { glas: false });
  const aus = await datei(p, false), alt = await datei(p, undefined), ein = await datei(p, true);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  t.ist('J-12 leerer Speicher: Glas ein', await ohneGlas(p), false, 'R-3.9');
  await t.schritt(p, 'J-9 Backup mit Glas aus nach Neuinstallation laden', () => laden(p, aus, 'Ersetzen'));
  t.ist('J-9 nach Neuinstallation stellt das Backup ‚Glas aus‘ wieder her', await ohneGlas(p), true, 'R-3.9');
  // J-9 altes Backup ohne Wert → ein
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  await t.schritt(p, 'J-9 altes Backup ohne Glas laden', () => laden(p, alt, 'Ersetzen'));
  t.ist('J-9 altes Backup ohne Wert: Glas ein', await ohneGlas(p), false, 'R-3.9');
  // J-13: hier ein gewählt, Backup eines anderen Geräts mit aus → bleibt ein (Ersetzen und Abgleichen, J-8)
  for (const weg of ['Ersetzen', 'Abgleichen']) {
    await start(p, { glas: true });
    await t.schritt(p, `J-13 Backup mit Glas aus laden (${weg})`, () => laden(p, aus, weg));
    t.ist(`J-13 ${weg}: Glas bleibt ein (gilt je Gerät)`, [await ohneGlas(p), await p.evaluate(() => db.settings.glas)], [false, true], 'R-3.9');
  }
  // umgekehrt: hier aus gewählt, Backup mit ein → bleibt aus
  await start(p, { glas: false });
  await t.schritt(p, 'J-13 Backup mit Glas ein laden', () => laden(p, ein, 'Ersetzen'));
  t.ist('J-13 hier aus: bleibt aus', await ohneGlas(p), true, 'R-3.9');
  await p.close();
}
await t.ende(b);
