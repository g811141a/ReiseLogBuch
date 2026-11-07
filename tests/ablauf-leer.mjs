// Reiselogbuch-Test: ablauf-leer (seit 3.48.0) – AppDesign APD-30 ‚leere Zustände‘, R-7.7, Designrichtlinie 15.23 (Testfall-Liste AppDesign
// arbeit/APD-30 Testfall-Liste.md L-1 bis L-20, Muster Variante A): S-1 kein Reiselogbuch (Inhalt bzw. iPhone-Startliste mit Knopf ‚Neues
// Reiselogbuch‘), S-2 Seitenleiste neben dem Inhalt nur Symbol und Titel, S-3 Suche in der Liste ohne Treffer, S-4 ‚Nur erfasste Tage‘ ohne
// erfassten Tag mit ‚Alle Tage zeigen‘, S-5 Suche im Reiselogbuch ohne Treffer (Tabelle und Kästen). Je Ansicht (iPad quer hell und dunkel,
// iPad hoch, iPhone hoch und quer, Kontrast erhöhen); nach jedem Schritt die Grundregeln mit R-7.7 (hig.mjs). Gegenprobe L-20: gegen 3.47.1
// mit PRUEF_APP=../_alt.html rot (kein Baustein .leer); mit PRUEF_GEGENPROBE=1 wird der Satz hellgrau (#c7c7cc) und der Knopf 30 px hoch –
// Kontrast (L-13) und Antippfläche (L-12) werden rot. Seit 3.48.1 (AppDesign APD-111): Symbol und Titel überall 36 pt bzw. 17 pt halbfett
// (P-92/4 Schritt 2, 4, 5; P-92/5) – gegen 3.48.0 rot. Aufruf im Repo-Ordner: node tests/ablauf-leer.mjs
import * as pw from 'playwright';
import { pruefung, navFertig, ruhe } from '../../AppDesign/fassung/4.54.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.54.0/tests/hig.mjs';
import { safariModell } from '../../AppDesign/fassung/4.54.0/tests/safari.mjs';
const t = pruefung('ablauf-leer', pw, { hig: createCheck(), out: new URL('out/', import.meta.url) });
const APP = new URL(process.env.PRUEF_APP || '../index.html', import.meta.url).href;
const iso = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
const tage = n => Object.fromEntries(Array.from({ length: n }, (_, i) => [iso(2026, 8, 24 + i), { weather: '☀️', program: `Programm ${i + 1}`, place: 'Hafen' }]));
const DREI = [{ id: 'a', title: 'Australien', participants: 'G & A', start: iso(2026, 8, 24), end: iso(2026, 9, 7), transport: ['flug'], days: tage(15) },
  { id: 'b', title: 'Toskana', participants: 'G', start: iso(2027, 6, 3), end: iso(2027, 6, 17), transport: ['pkw'], days: {} },
  { id: 'c', title: 'Wien Kurztrip', participants: 'G', start: iso(2026, 3, 12), end: iso(2026, 3, 15), transport: ['zug'], days: {} }];
const lade = async (p, trips, lastTrip = null) => {
  await p.clock.setFixedTime(new Date('2026-11-02T10:00:00'));
  await p.goto(APP);
  await p.evaluate(([x, l]) => { localStorage.clear(); if (x) localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), ...(l ? { lastTrip: l } : {}) }, trips: x })); }, [trips, lastTrip]);
  await p.reload(); await p.waitForTimeout(500); await navFertig(p);
  if (process.env.PRUEF_GEGENPROBE) await p.addStyleTag({ content: '.leer > p { color: #c7c7cc !important } .leer > .leer-knopf { min-height: 30px !important; height: 30px !important; padding-block: 0 !important }' });
};
const leer = (p, wo) => p.evaluate(wo => [...document.querySelectorAll(`${wo} .leer`)].filter(e => e.getClientRects().length).map(e => ({
  klein: e.classList.contains('klein'), titel: e.querySelector('h3')?.textContent ?? null, satz: e.querySelector('p')?.textContent ?? null,
  knopf: e.querySelector('button')?.textContent ?? null, id: e.querySelector('button')?.id ?? null, html: !!e.querySelector('h3 *'),
  masse: [Math.round(e.querySelector(':scope > svg')?.getBoundingClientRect().width ?? 0), parseFloat(getComputedStyle(e.querySelector('h3')).fontSize), +getComputedStyle(e.querySelector('h3')).fontWeight],
  folge: [...e.children].map(c => c.tagName.toLowerCase() + (c.getAttribute('aria-hidden') === 'true' ? '-verborgen' : '')).join(' '),
  ueber: (() => { const r = e.getBoundingClientRect(); return [...e.querySelectorAll('*')].some(c => { const b = c.getBoundingClientRect(); return b.left < r.left - 1 || b.right > r.right + 1; }); })() })), wo);
// seit 3.48.1 (AppDesign APD-111, Usertest P-92/4 und P-92/5 nicht ok): Symbol 36 pt und Titel 17 pt halbfett überall – wie die Suche in der Seitenleiste
const MASSE = [36, 17, 600];
const S1 = 'Noch kein Reiselogbuch', S1SATZ = 'Ein neues mit ‚plus‘ in der Seitenleiste anlegen.', SUCHSATZ = 'Schreibweise prüfen oder nach etwas anderem suchen.';
const dialogZu = async p => { if (await p.evaluate(() => dlg.open)) { await p.click('#dlgX'); await p.waitForTimeout(400); await navFertig(p); } };

const b = await t.browser();
for (const [ansicht, theme, opts] of [['iPad quer', 'light', {}], ['iPad quer', 'dark', {}], ['iPad hoch', 'light', {}], ['iPhone hoch', 'light', {}], ['iPhone quer', 'light', {}], ['iPad quer', 'light', { contrast: 'more' }], ['iPhone hoch', 'dark', { contrast: 'more' }]]) {
  const p = await t.seite(b, ansicht, { theme, ...opts });
  if (opts.contrast) t.ort = `${t.ort} · Kontrast erhöhen`;
  try {
    // L-1, L-2: ohne Daten starten, ‚Neues Reiselogbuch‘ öffnet sich einmal von selbst; mit x schließen
    await lade(p, null);
    await t.schritt(p, 'L-1 Start ohne Reiselogbuch, Fenster mit x schließen', () => dialogZu(p));
    const phone = await p.evaluate(() => isPhone());
    const knopfId = phone ? 'leerNeuListe' : 'leerNeu';
    if (phone) {
      const s = await leer(p, '#side');
      t.ist('APD-111 iPhone-Startliste: S-1 Symbol und Titel wie in der Seitenleiste', s.map(x => x.masse), [MASSE], 'R-7.7');
      t.ist('L-2 iPhone-Startliste: S-1 vollständig mit Knopf', s.map(x => [x.titel, x.satz, x.knopf, x.klein]), [[S1, S1SATZ, 'Neues Reiselogbuch', false]], 'R-7.7');
    } else {
      t.ist('APD-111 Inhalt: S-1 Symbol und Titel wie in der Seitenleiste', (await leer(p, '#app')).map(x => x.masse), [MASSE], 'R-7.7');
      t.ist('L-1 Inhalt: S-1 mit Satz und Knopf', (await leer(p, '#app')).map(x => [x.titel, x.satz, x.knopf]), [[S1, S1SATZ, 'Neues Reiselogbuch']], 'R-7.7');
      t.ist('L-1 Seitenleiste: S-2 klein, nur Symbol und Titel', (await leer(p, '#side')).map(x => [x.titel, x.satz, x.knopf, x.klein]), [[S1, null, null, true]], 'R-7.7');
    }
    t.wahr('L-1 kein grauer Hinweis ‚Noch kein Reiselogbuch angelegt.‘ mehr', !/angelegt\./.test(await p.evaluate(() => document.body.innerText)), 'R-7.7');
    // L-14 VoiceOver-Reihenfolge: Symbol verborgen, Titel als Überschrift, Satz, Knopf
    t.ist('L-14 Reihenfolge im leeren Zustand', (await leer(p, phone ? '#side' : '#app'))[0]?.folge, 'svg-verborgen h3 p button', 'R-1.8');
    // L-3: der Knopf öffnet dasselbe Fenster wie ‚plus‘; nach x liegt der Fokus wieder auf ihm
    // mit der Tastatur bzw. VoiceOver (Safari gibt einem angetippten Knopf keinen Fokus – pruefe.mjs bildet das nach)
    await t.schritt(p, 'L-3 Knopf ‚Neues Reiselogbuch‘', async () => { await p.focus('#' + knopfId); await p.keyboard.press('Enter'); await p.waitForTimeout(500); });
    t.ist('L-3 der Knopf öffnet ‚Neues Reiselogbuch‘', [await p.evaluate(() => dlg.open), await p.textContent('#dlg h3').catch(() => '')], [true, 'Neues Reiselogbuch'], 'R-7.7');
    await dialogZu(p);
    t.ist('L-3 nach x liegt der Fokus auf dem Knopf', await p.evaluate(() => document.activeElement?.id), knopfId, 'R-1.8');
    // L-12: Textgröße xS und AX3 (die größte der App) – Titel und Satz brechen um, nichts ragt hinaus; Knopf mindestens 44 hoch (Grundregeln)
    for (const ts of ['xs', 'ax3']) {
      await t.schritt(p, `L-12 Textgröße ${ts}`, async () => { await p.evaluate(ts => { document.documentElement.dataset.ts = ts; }, ts); await p.waitForTimeout(200); });
      t.wahr(`L-12 Textgröße ${ts}: nichts ragt über den leeren Zustand hinaus`, !(await leer(p, 'body')).some(x => x.ueber), 'R-1.10');
    }
    await p.evaluate(() => { delete document.documentElement.dataset.ts; });
    // L-18: Offline-Zeile bei leerer Liste – bleibt unten, überdeckt den leeren Zustand nicht
    await t.schritt(p, 'L-18 offline', async () => { await p.evaluate(() => { netState = 'aus'; renderSide(); }); await p.waitForTimeout(200); });
    t.wahr('L-18 Offline-Zeile unter dem leeren Zustand, ohne Überdeckung', await p.evaluate(() => { const o = document.querySelector('#side .offl:not([hidden])'), l = [...document.querySelectorAll('#side .leer')].find(e => e.getClientRects().length);
      return !!o && !!l && o.getBoundingClientRect().top >= l.querySelector('h3').getBoundingClientRect().bottom; }), 'R-7.7');
    await p.evaluate(() => { netState = 'an'; renderSide(); });
    // L-15: Drehen (iPad) – Zustand bleibt; Grundregeln danach
    if (!phone) {
      const vp = p.viewportSize();
      await t.schritt(p, 'L-15 drehen', async () => { await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(500); });
      t.ist('L-15 nach dem Drehen bleibt S-1', (await leer(p, '#app')).map(x => x.titel), [S1], 'R-8.1');
      await p.setViewportSize(vp); await p.waitForTimeout(400);
      // L-19: Seitenleiste aus – der Inhalt bleibt mittig im freien Bereich (Grundregeln R-7.7)
      if (await p.locator('#sideHide').isVisible()) await t.schritt(p, 'L-19 Seitenleiste aus', async () => { await p.click('#sideHide'); await p.waitForTimeout(500); await navFertig(p); });
      if (await p.locator('[data-side-toggle]').first().isVisible().catch(() => false)) await t.schritt(p, 'L-19 Seitenleiste ein', async () => { await p.locator('[data-side-toggle]').first().click(); await p.waitForTimeout(500); await navFertig(p); });
    }
    // L-4, L-17: ein Reiselogbuch kommt dazu (anlegen bzw. Abgleich) – der leere Zustand verschwindet ohne Neuladen
    await t.schritt(p, 'L-4 erstes Reiselogbuch anlegen', async () => {
      await p.click('#newTrip'); await p.waitForTimeout(400); await p.fill('#fTitle', 'Neu'); await p.fill('#fPeople', 'X');
      await p.click('#transport button >> nth=0'); await p.click('#dlgOk'); await p.waitForTimeout(500); await navFertig(p); });
    t.ist('L-4 nach dem Anlegen kein leerer Zustand mehr', (await leer(p, 'body')).length, 0, 'R-7.7');
    // L-5: letztes Reiselogbuch löschen – S-1 und S-2 erscheinen wieder
    await t.schritt(p, 'L-5 letztes Reiselogbuch löschen', async () => {
      await p.evaluate(() => { deleteTrip(db.trips[0]); }); await p.waitForTimeout(300);
      await p.locator('.pop button', { hasText: 'Löschen' }).first().click(); await p.waitForTimeout(500); await dialogZu(p); await navFertig(p); });
    t.ist('L-5 nach dem Löschen wieder der leere Zustand', (await leer(p, 'body')).map(x => x.titel), phone ? [S1] : [S1, S1], 'R-7.7');
    // L-17: Abgleich bringt Reiselogbücher (wie nach dem Laden von iCloud: Daten ändern sich, die App baut neu auf)
    await t.schritt(p, 'L-17 Abgleich bringt Reiselogbücher', async () => {
      await p.evaluate(x => { db.trips = x; save(); showTrip(x[0].id); }, DREI); await p.waitForTimeout(500); await navFertig(p); });
    t.ist('L-17 nach dem Abgleich kein leerer Zustand mehr', (await leer(p, phone ? '#side' : 'body')).length, 0, 'R-7.7');

    // L-6 bis L-8: Suche in der Liste ohne Treffer (3 Reiselogbücher)
    await lade(p, DREI, 'a');
    if (phone && !(await p.locator('#side.page').isVisible())) { await p.locator('#back').click(); await navFertig(p); }
    const liste = async begriff => { await p.evaluate(b => { listOpen = true; listTerm = b; renderSide(); }, begriff); await p.waitForTimeout(300); };
    await t.schritt(p, 'L-6 Suche in der Liste ohne Treffer', () => liste('xyzzy'));
    let l = await leer(p, '#side');
    t.ist(`P-92/${phone ? '5 Schritt 3: Suche in der Startliste' : '4 Schritt 5: Suche in der Seitenleiste'} – Symbol 36, Titel 17 halbfett`, l.map(x => x.masse), [MASSE], 'R-7.7');
    t.ist('L-6 S-3 mit dem Begriff', l.map(x => [x.titel, x.satz, x.knopf]), [['Keine Treffer für ‚xyzzy‘', SUCHSATZ, null]], 'R-7.7');
    t.ist('L-6 Untertitel bleibt ‚0 von 3 Reiselogbüchern‘', (await p.textContent('#side .side-head small')).trim(), '0 von 3 Reiselogbüchern', 'R-2.3');
    const lang = '<b>Fett</b> & "Zitat" ' + 'x'.repeat(80);
    await t.schritt(p, 'L-7 Begriff mit HTML, & und 80 Zeichen', () => liste(lang));
    l = await leer(p, '#side');
    t.ist('L-7 der Begriff erscheint als Text (kein HTML) und bricht um', l.map(x => [x.titel, x.html, x.ueber]), [[`Keine Treffer für ‚${lang}‘`, false, false]], 'R-7.7');
    t.wahr('L-7 nichts ragt über den Rand der Liste', await p.evaluate(() => { const s = document.querySelector('#side .side-list'); return s.scrollWidth <= s.clientWidth + 1; }), 'R-7.7');
    // L-16: Tastatur offen (iPhone, Safari-Modell) – Titel und Satz stehen über der Tastatur
    if (phone && ansicht === 'iPhone hoch') {
      await safariModell(p, 'iPhone hoch'); await p.evaluate(() => __safari.tastatur(true)); await p.waitForTimeout(300);
      t.wahr('L-16 Tastatur offen: Titel und Satz des leeren Zustands über der Tastatur', await p.evaluate(() => { const l = document.querySelector('#side .leer p'), v = visualViewport;
        return !!l && l.getBoundingClientRect().bottom <= v.offsetTop + v.height; }), 'R-7.7');
      await p.evaluate(() => __safari.tastatur(false)); await p.waitForTimeout(200);
    }
    await t.schritt(p, 'L-8 Begriff mit Treffern', () => liste('Programm 3'));
    t.ist('L-8 mit Treffern: kein leerer Zustand, Kachel da', [(await leer(p, '#side')).length, await p.locator('#side .side-row').count()], [0, 1], 'R-7.7');
    await t.schritt(p, 'L-8 und zurück ohne Treffer', () => liste('xyzzy'));
    t.ist('L-8 zurück: S-3 wieder da', (await leer(p, '#side')).length, 1, 'R-7.7');
    await p.evaluate(() => { listOpen = false; listTerm = ''; renderSide(); });

    // L-9, L-10: ‚Nur erfasste Tage‘ ohne erfassten Tag (Toskana, 0 von 15)
    await p.evaluate(() => showTrip('b')); await p.waitForTimeout(500); await navFertig(p);
    await t.schritt(p, 'L-9 Nur erfasste Tage, keiner erfasst', async () => { await p.evaluate(() => { db.settings.hideEmpty = true; render(); }); await p.waitForTimeout(300); });
    t.ist('L-9 S-4 unter Kopf, Teilnehmern und Fortschritt', (await leer(p, '#app')).map(x => [x.titel, x.satz, x.knopf]), [['Noch keine Tage erfasst', 'Es werden nur erfasste Tage gezeigt.', 'Alle Tage zeigen']], 'R-7.7');
    t.ist(`P-92/${phone ? 5 : 4} Schritt 2: ‚Noch keine Tage erfasst‘ – Symbol, Titel, Gewicht wie die Suche in der Seitenleiste`, (await leer(p, '#app')).map(x => x.masse), [MASSE], 'R-7.7');
    t.wahr('L-9 S-4 steht unter dem Fortschritt', await p.evaluate(() => document.querySelector('#app .progress').getBoundingClientRect().bottom <= document.querySelector('#app .leer').getBoundingClientRect().top), 'R-7.7');
    await t.schritt(p, 'L-10 ‚Alle Tage zeigen‘', async () => { await p.click('#leerAlle'); await p.waitForTimeout(400); });
    t.ist('L-10 wie Menü ‚Alle Tage‘: alle 15 Tage, kein leerer Zustand', [await p.evaluate(() => db.settings.hideEmpty), (await leer(p, '#app')).length,
      await p.locator('#app tbody tr[data-day], #app [data-day].box').count()], [false, 0, 15], 'R-7.7');
    // L-11: Suche im Reiselogbuch ohne Treffer – Tabelle (iPad) bzw. Kästen (iPhone, AX)
    for (const ax of phone ? [false] : [false, true]) {
      await t.schritt(p, `L-11 Suche ohne Treffer${ax ? ' (Kästen, AX1)' : ''}`, async () => {
        await p.evaluate(ax => { if (ax) document.documentElement.dataset.ts = 'ax1'; searchTerm = 'Paella'; searchOpen = true; render(); }, ax); await p.waitForTimeout(400); });
      t.ist(`L-11 S-5 mit dem Begriff${ax ? ' (Kästen)' : ''}`, (await leer(p, '#app')).map(x => [x.titel, x.satz, x.knopf]), [['Keine Treffer für ‚Paella‘', SUCHSATZ, null]], 'R-7.7');
      if (!ax) t.ist(`P-92/${phone ? 5 : 4} Schritt 4: Suche ohne Treffer – Symbol, Titel, Gewicht wie die Suche in der Seitenleiste`, (await leer(p, '#app')).map(x => x.masse), [MASSE], 'R-7.7');
      await p.evaluate(() => { delete document.documentElement.dataset.ts; searchTerm = ''; searchOpen = false; render(); }); await p.waitForTimeout(200);
    }
  } catch (e) { t.fehler('', `Ablauf bricht ab: ${e.message.split('\n')[0]}`); }
  if (ansicht === 'iPad quer' && theme === 'light' && !opts.contrast) await p.screenshot({ path: new URL(`out/APD-30-leer-${t.browserName}.png`, import.meta.url).pathname });
  await p.close();
}
await t.ende(b);
