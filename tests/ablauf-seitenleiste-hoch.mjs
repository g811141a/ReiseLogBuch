// Reiselogbuch-Test: ablauf-seitenleiste-hoch (seit 3.43.0) – Testfall-Liste AppDesign arbeit/APD-97 Testfall-Liste.md: am iPad steht die
// Seitenleiste hoch wie quer fest neben dem Inhalt (L-1 bis L-8; Gesten L-4, L-5 prüft ablauf-navigation, Tastatur L-9 ablauf-tastatur-still,
// iPhone L-10 ablauf-iphone/start-regeln) und ein Inhalt unter 700 px zeigt die Tage als Kästen (D-1 bis D-5, D-8, D-10; Fenster D-6
// ablauf-liste-still, Suche D-7 ablauf-suche-menue, große Schrift D-9 text-regeln, Statistik D-11 ablauf-preis-km). R-6.6, R-7.5, R-8.1;
// hig prüft R-6.6 nach jedem Schritt. Aufruf im Repo-Ordner: node tests/ablauf-seitenleiste-hoch.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.45.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.45.0/tests/hig.mjs';
const t = pruefung('ablauf-seitenleiste-hoch', pw, { hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a', '.ilist .ln.q a'] }), out: new URL('out/', import.meta.url) });
const tage = {}; for (let i = 0; i < 30; i++) tage[new Date(Date.UTC(2026, 7, 1 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: 'Programm ' + i, quarter: 'Hotel ' + (i >> 2), place: 'Cairns', km: i % 5 };
const lang = 'Wanderung über den Kamm mit Blick auf das Meer und einem sehr langen Wort Donaudampfschifffahrtsgesellschaftskapitänsmütze '.repeat(3);
const viele = {}; for (let i = 0; i < 60; i++) viele[new Date(Date.UTC(2026, 3, 1 + i)).toISOString().slice(0, 10)] = { program: i === 7 ? lang : 'Tag ' + i };
const trips = [
  { id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-01', end: '2026-08-30', transport: ['flug'], foodColumn: true, moodColumn: true, quarterColumn: true, kmColumn: true, quarterList: true, days: tage },
  { id: 'b', title: 'Leer', participants: 'G', start: '2025-05-01', end: '2025-05-03', transport: ['pkw'], days: {} },
  { id: 'c', title: 'Viele', participants: 'G', start: '2026-04-01', end: '2026-05-30', transport: ['bahn'], days: viele },
];
const APP = new URL('../index.html', import.meta.url).href;
const start = async p => {
  await p.clock.setFixedTime(new Date('2026-08-12T10:00:00'));
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400); await navFertig(p);
};
// Lage: Seitenleiste fest (neben dem Inhalt, ohne Abdunkelung), Breite des Inhalts, Tabelle oder Kästen, oberster Tag im Rollbereich
const lage = p => p.evaluate(() => {
  const s = document.querySelector('#side'), a = document.querySelector('#app'), sr = s && !s.hidden && s.getClientRects().length ? s.getBoundingClientRect() : null;
  const edge = document.querySelector('#bar')?.getBoundingClientRect().bottom ?? 0;
  const oben = [...a.querySelectorAll('[data-day]')].find(x => x.getClientRects().length && x.getBoundingClientRect().bottom > edge + 1)?.dataset.day;
  return { seite: !!sr, fest: !!sr && document.body.classList.contains('docked') && !s.classList.contains('over') && !document.querySelector('.side-shade'),
    neben: !!sr && a.getBoundingClientRect().left >= sr.right - 1, inhalt: a.clientWidth, tabelle: !!a.querySelector('table.days:not(.static)'),
    kaesten: a.querySelectorAll('.box.day').length, statisch: a.querySelectorAll('table.static').length, oben };
});
const rolleZu = (p, iso) => p.evaluate(iso => { const e = document.querySelector(`#app [data-day="${iso}"]`); const r = document.querySelector('#app > .rolle');
  r.scrollTop += e.getBoundingClientRect().top - document.querySelector('#bar').getBoundingClientRect().bottom - 2; }, iso);
const b = await t.browser();
for (const theme of ['light', 'dark']) {
  const p = await t.seite(b, 'iPad hoch', { theme }); t.ort = `iPad hoch ${theme === 'dark' ? 'dunkel' : 'hell'}`;
  await start(p);
  // L-1, D-1: Start hoch – Seitenleiste fest daneben, ohne Abdunkelung, Inhalt bedienbar; Inhalt 441 px → Kästen, auch die Quartierliste
  await t.schritt(p, 'L-1 Start hoch', async () => {});
  let l = await lage(p);
  t.ist('APD-97/L-1 Seitenleiste fest neben dem Inhalt, ohne Abdunkelung', [l.seite, l.fest, l.neben], [true, true, true], 'R-7.5');
  t.ist('APD-97/D-1 Inhalt unter 700 px: Kästen statt Tabelle', [l.inhalt < 700, l.tabelle, l.kaesten > 0, l.statisch], [true, false, true, 0], 'R-6.6');
  await t.schritt(p, 'L-1 Tag antippen', async () => { await p.locator('#app .box.day[data-day="2026-08-12"]').click(); await p.waitForTimeout(400); });
  t.ist('APD-97/L-1 Inhalt bedienbar: Tag öffnet sein Fenster', await p.evaluate(() => dlg.open), true, 'R-7.5');
  await p.evaluate(() => dlg.close()); await p.waitForTimeout(250);
  // L-2: anderen Eintrag wählen – die Seitenleiste bleibt stehen
  await t.schritt(p, 'L-2 Leer wählen', async () => { await p.locator('#side .side-row[data-id="b"]').click(); await p.waitForTimeout(400); await navFertig(p); });
  l = await lage(p);
  t.ist('APD-97/L-2 nach der Auswahl bleibt die Seitenleiste, Leer offen', [l.fest, await p.textContent('.nb-title')], [true, 'Leer'], 'R-7.5');
  // D-10: viele Tage, langes Programm – Kästen ohne Überlauf (hig R-6.3), letzter Tag erreichbar
  await t.schritt(p, 'D-10 Viele wählen', async () => { await p.locator('#side .side-row[data-id="c"]').click(); await p.waitForTimeout(400); await navFertig(p); });
  await t.schritt(p, 'D-10 ans Ende', async () => { await p.evaluate(() => rolle.to(1e6)); await p.waitForTimeout(400); });
  t.ist('APD-97/D-10 letzter Tag erreichbar', await p.evaluate(() => { const e = document.querySelector('#app [data-day="2026-05-30"]'); const r = e?.getBoundingClientRect(); return !!r && r.bottom <= innerHeight + 1 && r.top >= 0; }), true, 'R-6.6');
  await p.locator('#side .side-row[data-id="a"]').click(); await p.waitForTimeout(400); await navFertig(p);
  // D-4, L-3: panel-left – die Seitenleiste geht, der Inhalt wird breit und zeigt die Tabelle; oben bleibt derselbe Tag; und zurück
  await rolleZu(p, '2026-08-20'); await p.waitForTimeout(300);
  const vor = (await lage(p)).oben;
  await t.schritt(p, 'L-3 panel-left aus', async () => { await p.locator('#sideHide').click(); await p.waitForTimeout(700); await navFertig(p); });
  l = await lage(p);
  t.ist('APD-97/L-3, D-4 ohne Seitenleiste: Inhalt breit, Tabelle, oberster Tag bleibt', [l.seite, l.inhalt >= 700, l.tabelle, l.oben], [false, true, true, vor], 'R-8.1');
  await t.schritt(p, 'L-3 panel-left ein', async () => { await p.locator('[data-side-toggle]').first().click(); await p.waitForTimeout(700); await navFertig(p); });
  l = await lage(p);
  t.ist('APD-97/L-3, D-4 mit Seitenleiste: Kästen, oberster Tag bleibt', [l.fest, l.tabelle, l.kaesten > 0, l.oben], [true, false, true, vor], 'R-8.1');
  // L-6, D-5: drehen hoch → quer → hoch mit Zwischengrößen – Leiste bleibt, quer Tabelle, oben bleibt derselbe Tag
  const vp = p.viewportSize();
  await t.schritt(p, 'L-6 drehen nach quer', async () => { await p.setViewportSize({ width: 1000, height: 1000 }); await p.waitForTimeout(80); await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(600); });
  l = await lage(p);
  t.ist('APD-97/L-6, D-5 quer: Leiste fest, Tabelle, oberster Tag bleibt', [l.fest, l.tabelle, l.oben], [true, true, vor], 'R-8.1');
  await t.schritt(p, 'L-6 drehen nach hoch', async () => { await p.setViewportSize(vp); await p.waitForTimeout(600); });
  l = await lage(p);
  t.ist('APD-97/L-6, D-5 hoch: Leiste fest, Kästen, oberster Tag bleibt', [l.fest, l.tabelle, l.oben], [true, false, vor], 'R-8.1');
  // L-6 ausgeblendet: Zustand bleibt beim Drehen
  await p.locator('#sideHide').click(); await p.waitForTimeout(700); await navFertig(p);
  await t.schritt(p, 'L-6 ausgeblendet drehen', async () => { await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(500); await p.setViewportSize(vp); await p.waitForTimeout(500); });
  t.ist('APD-97/L-6 ausgeblendet bleibt ausgeblendet', (await lage(p)).seite, false, 'R-8.1');
  await p.locator('[data-side-toggle]').first().click(); await p.waitForTimeout(700); await navFertig(p);
  // L-7: drehen mit offenem Mehr-Menü und Untermenü der Seitenleiste – ganz sichtbar oder geschlossen, nichts gesperrt (APD-94)
  for (const unter of [false, true]) {
    await p.click('#sideMore'); await p.waitForTimeout(200);
    if (unter) { await p.locator('.menu .mi', { hasText: 'Darstellung' }).click(); await p.waitForTimeout(200); }
    await t.schritt(p, `L-7 drehen mit offenem ${unter ? 'Untermenü' : 'Menü'}`, async () => { await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(500); await p.setViewportSize(vp); await p.waitForTimeout(500); });
    t.ist(`APD-97/L-7 ${unter ? 'Untermenü' : 'Menü'} nach dem Drehen ganz sichtbar, Leiste fest, keine Abdunkelung`, await p.evaluate(() => [...document.querySelectorAll('.menu')].every(m => { const r = m.getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; }) && !document.querySelector('.side-shade') && document.body.classList.contains('docked')), true, 'R-8.1');
    await p.keyboard.press('Escape'); await p.waitForTimeout(150); await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  }
  // L-8: lange drücken auf eine Kachel – Kontextmenü rechts daneben, ganz sichtbar
  { const r = await p.locator('#side .side-row[data-id="b"]').boundingBox();
    await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2); await p.mouse.down(); await p.waitForTimeout(800); await p.mouse.up(); await p.waitForTimeout(300);
    await t.schritt(p, 'L-8 Kontextmenü', async () => {});
    t.ist('APD-97/L-8 Kontextmenü rechts an der Kachel (wie quer), ganz sichtbar', await p.evaluate(x => { const m = document.querySelector('.menu')?.getBoundingClientRect(); return !!m && m.left >= x && m.right <= innerWidth && m.bottom <= innerHeight; }, r.x + r.width / 2), true, 'R-4.2');   // wie quer: rechts, leicht über der Kachel
    await p.keyboard.press('Escape'); await p.waitForTimeout(200); }
  // D-8: Vorschau und Ausgabe bleiben Tabellen (R-6.2)
  t.ist('APD-97/D-8 Ausgabe als Tabelle', await p.evaluate(() => /<table/.test(outputDocument(db.trips.find(x => x.id === 'a'), 1, ''))), true, 'R-6.2');
  await p.close();
}
// D-1 iPad mini und 13″, D-2 quer, D-3 Grenze 699/700 px (Leiste sichtbar: Breite des Fensters = Abstand + Inhalt)
{ const p = await t.seite(b, 'iPad hoch', { theme: 'light' }); await start(p);
  for (const [name, w, h, kaesten] of [['iPad mini hoch', 744, 1133, true], ['iPad 13″ hoch', 1024, 1366, true], ['iPad 11″ quer', 1180, 820, false], ['iPad 13″ quer', 1366, 1024, false]]) {
    t.ort = name;
    await t.schritt(p, `D-1, D-2 ${name}`, async () => { await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(600); });
    const l = await lage(p);
    t.ist(`APD-97/D-1, D-2 ${name}: Leiste fest, ${kaesten ? 'Kästen' : 'Tabelle'} (Inhalt ${l.inhalt} px)`, [l.fest, l.tabelle, l.kaesten > 0], [true, !kaesten, kaesten], 'R-6.6');
  }
  t.ort = 'iPad Grenze';
  await p.setViewportSize({ width: 820, height: 1180 }); await p.waitForTimeout(600);
  const abstand = await p.evaluate(() => innerWidth - document.querySelector('#app').clientWidth);
  for (const [inhalt, tabelle] of [[699, false], [700, true]]) {
    await t.schritt(p, `D-3 Inhalt ${inhalt} px`, async () => { await p.setViewportSize({ width: abstand + inhalt, height: 1180 }); await p.waitForTimeout(600); });
    const l = await lage(p);
    t.ist(`APD-97/D-3 Inhalt ${inhalt} px: ${tabelle ? 'Tabelle' : 'Kästen'}`, [l.inhalt, l.tabelle], [inhalt, tabelle], 'R-6.6');
  }
  await p.close();
}
await t.ende(b);
