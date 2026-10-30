// Reiselogbuch-Test: ablauf-preis-km (seit 3.41.0) – Testfall-Liste AppDesign arbeit/APD-92 APD-93 RLB-108 RLB-109 RLB-110 Testfall-Liste.md:
// D-1 bis D-6 ‚Darstellung‘ im Mehr-Menü der Seitenleiste (RLB-108, APD-92, R-1.2); Q-1 bis Q-9 Preis beim Quartier (RLB-109, R-5.1);
// L-1 bis L-13 Spalte ‚Gegangene Kilometer‘ mit schmalem Zahlenfeld (RLB-110, APD-93). D-7 (Darstellung je Gerät) prüft abgleich-regeln,
// D-8 hig (R-1.2). Aufruf im Repo-Ordner: node tests/ablauf-preis-km.mjs
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.43.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.43.0/tests/hig.mjs';
const t = pruefung('ablauf-preis-km', pw, { hig: createCheck({ skipTargets: ['table.days .ln:not(.q) a', '.box.day .ln:not(.q) a', '.ilist .ln.q a'] }), out: new URL('out/', import.meta.url) });
// 24.–28.08.: Quartier A 3 Nächte (Preis 300), Quartier B 2 Nächte (Preis 200); 29.08. Quartier C ohne Preis; km an 3 Tagen, ein Tag nur km
const days = {
  '2026-08-24': { weather: '☀️', program: 'Anreise', comment: '😉 gut', quarter: 'Hotel A', place: 'Cairns', price: 300, km: 6 },
  '2026-08-25': { program: 'Riff', sameQuarter: true, km: 14 },
  '2026-08-26': { program: 'Regenwald', sameQuarter: true },
  '2026-08-27': { program: 'Weiterfahrt', quarter: 'Hotel B', place: 'Townsville', price: 200, km: 3 },
  '2026-08-28': { program: 'Strand', sameQuarter: true },
  '2026-08-29': { program: 'Insel', quarter: 'Hütte C', place: 'Airlie' },
  '2026-08-31': { km: 9 },
};
const trip = { id: 'a', title: 'Australien', participants: 'G & A', start: '2026-08-24', end: '2026-09-02', transport: ['flug'], foodColumn: true, moodColumn: true,
  quarterColumn: true, kmColumn: true, quarterList: true, days };
const alt = { id: 'b', title: 'Altes Backup', participants: 'G', start: '2025-05-01', end: '2025-05-03', transport: ['pkw'], days: { '2025-05-01': { program: 'x', quarter: 'Q', price: 'teuer', km: 120 } } };
const start = async (p, trips = [trip, alt]) => {
  await p.clock.setFixedTime(new Date('2026-09-05T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400);
};
const oeffne = async (p, id = 'a') => { if (await p.locator(`#side .side-row[data-id="${id}"]`).isVisible()) { await p.locator(`#side .side-row[data-id="${id}"]`).click(); await p.waitForTimeout(400); await navFertig(p); } };
const stats = p => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('#app .rolle > dl.meta:not(.trip) dt')].map(d => [d.textContent.replace(/:$/, ''), d.nextElementSibling.textContent])));
const tag = async (p, iso) => { await p.evaluate(iso => openDayDialog(db.trips.find(x => x.id === 'a'), iso), iso); await p.waitForTimeout(400); await navFertig(p); };
const zu = async p => { await p.evaluate(() => dlg.open && dlg.close()); await p.waitForTimeout(250); };
const b = await t.browser();
for (const [ansicht, theme] of [['iPad quer', 'light'], ['iPad hoch', 'dark'], ['iPhone hoch', 'light'], ['iPhone quer', 'dark']]) {
  const p = await t.seite(b, ansicht, { theme });
  const where = `${ansicht} ${theme === 'dark' ? 'dunkel' : 'hell'}`; t.ort = where;
  const phone = ansicht.startsWith('iPhone');
  await start(p);
  // D-1, D-2: Mehr der Seitenleiste bzw. Startliste – Suchen · Strich · Backup erstellen · Backup laden · Strich · Darstellung › (Wert grau) · Strich · Versionszeile
  await t.schritt(p, 'D-1 Mehr der Seitenleiste', async () => { await p.click('#sideMore'); await p.waitForTimeout(200); });
  t.ist('APD-92/D-1 Aufbau des Menüs', await p.evaluate(() => [...document.querySelector('.menu').children].map(e => e.matches('.mi') ? e.textContent.trim() : e.className)
    .filter(x => !['sub', 'note', 'note halten'].includes(x))), ['Suchen', 'line', 'Backup erstellen', 'Backup laden', 'sep', 'DarstellungAutomatisch', 'line'], 'R-1.2');
  await t.schritt(p, 'D-4 Untermenü Darstellung', async () => { await p.locator('.menu .mi', { hasText: 'Darstellung' }).click(); await p.waitForTimeout(200); });
  // D-6 (iPad): Drehen mit offenem Untermenü – Menü bleibt an seinem Knopf oder schließt, ganz sichtbar. Nur hoch → quer: quer → hoch
  // legt die Seitenleiste mit nicht gesperrter Abdunkelung darüber (APD-94, offen im Backlog)
  if (ansicht === 'iPad hoch') {
    const vp = p.viewportSize();
    await t.schritt(p, 'D-6 Drehen mit offenem Untermenü', async () => { await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(500); });
    t.wahr('APD-92/D-6 Menü nach dem Drehen ganz sichtbar oder geschlossen', await p.evaluate(() => [...document.querySelectorAll('.menu')].every(m => { const r = m.getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; })), 'R-8.1');
    await p.setViewportSize(vp); await p.waitForTimeout(400);
    if (!await p.locator('.submenu').count()) { await p.keyboard.press('Escape'); await p.click('#sideMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Darstellung' }).click(); await p.waitForTimeout(150); }
  }
  const andere = theme === 'dark' ? 'Hell' : 'Dunkel', soll = theme === 'dark' ? 'light' : 'dark';
  await p.locator('.submenu .mi', { hasText: andere }).click(); await p.waitForTimeout(200);
  t.ist(`APD-92/D-4 Darstellung ${andere} wechselt sofort`, await p.evaluate(() => document.documentElement.dataset.theme), soll, 'R-1.2');
  await p.click('#sideMore'); await p.waitForTimeout(150);
  t.ist('APD-92/D-4 Wert grau im Menü', await p.textContent('.menu .mi:has-text("Darstellung") .val'), andere, 'R-1.2');
  await p.locator('.menu .mi', { hasText: 'Darstellung' }).click(); await p.waitForTimeout(150);
  await p.locator('.submenu .mi', { hasText: 'Automatisch' }).click(); await p.waitForTimeout(200);
  t.ist('APD-92/D-4 Automatisch folgt wieder dem Gerät', await p.evaluate(() => document.documentElement.dataset.theme), theme, 'R-1.2');
  // L-12, Q-8: altes Backup – kmColumn aus, unbrauchbarer Preis und km > 99 fallen weg
  t.ist('RLB-110/L-12 altes Reiselogbuch: kmColumn aus, Felder bereinigt', await p.evaluate(() => { const x = db.trips.find(t => t.id === 'b'); return [x.kmColumn, 'price' in x.days['2025-05-01'], 'km' in x.days['2025-05-01']]; }), [false, false, false]);
  await oeffne(p);
  // D-3: Mehr eines Reiselogbuchs ohne ‚Darstellung‘
  await p.click('#mainMore'); await p.waitForTimeout(150);
  t.ist('APD-92/D-3 Mehr des Reiselogbuchs', await p.locator('.menu .mi').allTextContents(), ['Suchen', 'Alle Tage', 'Nur erfasste Tage', 'Einstellungen', 'Reiselogbuch löschen'], 'R-1.2');
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  // L-2 (iPad) bzw. L-9 (iPhone): Spalte bzw. Zeile ‚🚶🏽‍♂️ 14 km‘
  if (!phone) {
    t.ist('RLB-110/L-2 Spaltenköpfe', await p.locator('table.days:not(.static) thead th').allTextContents(), ['Tag', 'Verlauf', '🙂☹️😉', '🚶🏽‍♂️km', '🍽️🍷☕️', '😴💤']);
    t.ist('RLB-110/L-2 Zellen: nur die Zahl, rechtsbündig, ohne Wert leer', await p.evaluate(() => ['2026-08-24', '2026-08-25', '2026-08-26'].map(d => { const c = document.querySelector(`tr[data-day="${d}"] td:nth-child(4)`); return [c.textContent.trim(), getComputedStyle(c).textAlign]; })),
      [['6', 'right'], ['14', 'right'], ['', 'right']]);
    // Q-3 Quartierliste (iPad): Spalte ‚Preis‘ nach ‚Nächte‘
    t.ist('RLB-109/Q-3 Quartierliste Kopf', await p.locator('table.days.static thead th').allTextContents(), ['Quartier', 'Zeitraum', 'Nächte', 'Preis']);
    t.ist('RLB-109/Q-3 Quartierliste Preise', await p.locator('table.days.static tbody td:nth-child(4)').allTextContents(), ['300,00 €', '200,00 €', '']);
  } else {
    t.ist('RLB-110/L-9 Kachel ‚🚶🏽‍♂️ 14 km‘', await p.evaluate(() => [...document.querySelectorAll('#pdays [data-day="2026-08-25"] .kv')].map(k => k.textContent.replace(/\s+/g, ' ').trim()).find(x => x.startsWith('🚶'))), '🚶🏽‍♂️14 km');
    t.ist('RLB-109/Q-3 Quartierliste (iPhone): Preis hinter den Nächten', await p.locator('.ilist .irow small').allTextContents(), [/3 Nächte · 300,00 €$/, /2 Nächte · 200,00 €$/, /1 Nacht$/]);
  }
  // Q-4, L-8: Statistik
  const st = await stats(p);
  t.ist('RLB-109/Q-4 Statistik Quartierkosten und Ø je Nacht (nur Nächte mit Preis)', [st['Quartierkosten'], st['Ø je Nacht']], ['500,00 €', '100,00 €']);
  t.ist('RLB-110/L-8 Statistik Gegangene Kilometer und Ø je Tag (gerundet, nur Tage mit km)', [st['Gegangene Kilometer'], st['Ø je Tag']], ['32 km', '8 km']);
  t.ist('Statistik: Reihenfolge', Object.keys(st), ['Reisetage', 'Gegangene Kilometer', 'Ø je Tag', 'Quartiere', 'Nächte', 'Quartierkosten', 'Ø je Nacht', 'Wetter', 'Smileys']);
  // L-10: ein Tag nur mit km zählt nicht als erfasst
  t.ist('RLB-110/L-10 Tag nur mit km nicht erfasst', await p.evaluate(() => isRecorded(db.trips.find(x => x.id === 'a'), '2026-08-31')), false);
  // L-3: Schritt ‚Gegangene Kilometer‘ nach ‚Wie war was?‘, Nummern +1, Feld mit ‚km‘ rechts daneben
  await t.schritt(p, 'L-3 Tag mit km', () => tag(p, '2026-08-24'));
  t.ist('RLB-110/L-3 Schritte', await p.evaluate(() => [...dlg.querySelectorAll('.step:not([hidden]) .step-head > label:first-child')].map(l => l.textContent.trim())),
    ['1Wetter', '2Verlauf', '3Wie war was?', '4Gegangene Kilometer', '5Essen und Trinken', '6Quartier']);
  const km = await p.evaluate(() => { const f = document.getElementById('fKmDay'), e = f.nextElementSibling, r = f.getBoundingClientRect(), er = e.getBoundingClientRect();
    return { wert: f.value, mode: f.inputMode, einheit: e.textContent, daneben: er.left >= r.right && er.left - r.right < 20 && Math.abs((er.top + er.bottom) / 2 - (r.top + r.bottom) / 2) < 4, align: getComputedStyle(f).textAlign, breite: Math.round(r.width) }; });
  t.ist('RLB-110/L-3, L-4 Feld: Wert, Ziffernblock, ‚km‘ rechts daneben, rechtsbündig', [km.wert, km.mode, km.einheit, km.daneben, km.align], ['6', 'numeric', 'km', true, 'right']);
  // L-6 (APD-93): Breite = ‚99‘ + Innenabstände + ⓧ-Platz – ‚99‘ passt ohne Rollen, das Feld ist schmal
  await p.locator('#fKmDay').fill('99'); await p.locator('#fKmDay').dispatchEvent('input');
  t.wahr(`APD-93/L-6 ‚99‘ passt ins Feld (${km.breite} px breit)`, await p.evaluate(() => { const f = document.getElementById('fKmDay'); return f.scrollWidth <= f.clientWidth; }), 'R-5.1');
  t.wahr(`APD-93/L-6 Feld schmal (${km.breite} px, höchstens 2 Ziffern + Innenabstände + ⓧ)`, km.breite < 140, 'R-5.1');
  // L-4: nur Ziffern, höchstens zwei
  for (const [ein, aus] of [['123', '12'], ['1,5', '15'], ['a', ''], ['07', '7']]) {
    await p.locator('#fKmDay').fill(''); await p.locator('#fKmDay').pressSequentially(ein, { delay: 10 });
    t.ist(`RLB-110/L-4 Eingabe ‚${ein}‘`, await p.inputValue('#fKmDay'), aus);
  }
  // L-5: Fokus mit ‚14‘ – ⓧ erscheint, die Ziffern bleiben an derselben Stelle (Innenabstand rechts gleich); ⓧ leert, Fokus bleibt
  await p.locator('#fKmDay').fill('14'); await p.evaluate(() => document.activeElement?.blur()); await p.waitForTimeout(100);
  const vorher = await p.evaluate(() => getComputedStyle(document.getElementById('fKmDay')).paddingRight);
  await p.locator('#fKmDay').focus(); await p.waitForTimeout(150);
  const x = await p.evaluate(() => ({ pad: getComputedStyle(document.getElementById('fKmDay')).paddingRight, x: !!document.querySelector('#fKmDay + .fclear') }));
  t.ist('APD-93/L-5 ⓧ erscheint, Ziffern springen nicht (Innenabstand rechts gleich)', [x.x, x.pad], [true, vorher], 'R-5.6');
  await p.click('#fKmDay + .fclear'); await p.waitForTimeout(150);
  t.ist('APD-93/L-5 ⓧ leert, Fokus bleibt', [await p.inputValue('#fKmDay'), await p.evaluate(() => document.activeElement?.id)], ['', 'fKmDay'], 'R-5.6');
  await p.locator('#fKmDay').pressSequentially('12', { delay: 10 });
  // Q-1: Preis unter ‚Ort‘, € rechts daneben, rechtsbündig, beim Tippen ‚1.240‘, beim Verlassen ‚1.240,00‘
  await p.locator('#fPrice').scrollIntoViewIfNeeded();
  const pr = await p.evaluate(() => { const f = document.getElementById('fPrice'), o = document.getElementById('fPlace').getBoundingClientRect(), r = f.getBoundingClientRect(), e = f.nextElementSibling.getBoundingClientRect();
    return { unter: r.top >= o.bottom, euro: f.nextElementSibling.textContent, daneben: e.left >= r.right, align: getComputedStyle(f).textAlign, wert: f.value }; });
  t.ist('RLB-109/Q-1 Preis unter Ort, € daneben, rechtsbündig, Wert', [pr.unter, pr.euro, pr.daneben, pr.align, pr.wert], [true, '€', true, 'right', '300,00'], 'R-5.1');
  await p.locator('#fPrice').fill(''); await p.locator('#fPrice').pressSequentially('1240', { delay: 10 });
  t.ist('RLB-109/Q-1 beim Tippen ‚1.240‘', await p.inputValue('#fPrice'), '1.240', 'R-5.1');
  await p.locator('#fPlace').focus(); await p.waitForTimeout(100);
  t.ist('RLB-109/Q-1 beim Verlassen ‚1.240,00‘', await p.inputValue('#fPrice'), '1.240,00', 'R-5.1');
  // Q-7: langer Betrag passt vollständig; ⓧ leert
  await p.locator('#fPrice').fill(''); await p.locator('#fPrice').pressSequentially('100000', { delay: 5 }); await p.locator('#fPlace').focus(); await p.waitForTimeout(100);
  t.ist('RLB-109/Q-7 ‚100.000,00‘ passt vollständig', await p.evaluate(() => { const f = document.getElementById('fPrice'); return [f.value, f.scrollWidth <= f.clientWidth]; }), ['100.000,00', true], 'R-5.1');
  await p.locator('#fPrice').focus(); await p.waitForTimeout(100); await p.click('#fPrice + .fclear'); await p.waitForTimeout(150);
  t.ist('RLB-109/Q-7 ⓧ leert den Preis', await p.inputValue('#fPrice'), '', 'R-5.6');
  await p.locator('#fPrice').pressSequentially('1240', { delay: 10 });
  await t.schritt(p, 'Q-9 Tag mit Preis und km', async () => {});
  await p.click('#dlgOk'); await p.waitForTimeout(300);
  t.ist('RLB-109/Q-1, RLB-110 gespeichert: Preis und km', await p.evaluate(() => { const e = db.trips.find(x => x.id === 'a').days['2026-08-24']; return [e.price, e.km]; }), [1240, 12]);
  // Q-2: Folgetag mit ‚Quartier wie Vortag‘ – kein Preisfeld; Haken weg → Feld leer
  await t.schritt(p, 'Q-2 Folgetag', () => tag(p, '2026-08-25'));
  t.ist('RLB-109/Q-2 kein Preisfeld bei ‚Quartier wie Vortag‘', await p.locator('#fPrice').isVisible(), false);
  await p.locator('label:has(#fSame)').click(); await p.waitForTimeout(150);
  t.ist('RLB-109/Q-2 Haken weg: Preisfeld leer sichtbar', [await p.locator('#fPrice').isVisible(), await p.inputValue('#fPrice')], [true, '']);
  await p.locator('label:has(#fSame)').click(); await p.waitForTimeout(100);
  await zu(p);
  // Q-6, L-11: Ausgabe – Quartierliste mit ‚Preis‘, Statistik mit allen Zeilen, Spaltenanteile 28 · 28 · 8 · 22 · 22 (von 108)
  const out = await p.evaluate(() => outputBody(db.trips.find(x => x.id === 'a'), 1, nowStamp()));
  t.wahr('RLB-109/Q-6 Ausgabe: Quartierliste mit ‚Preis‘', /<th class="num">Nächte<\/th><th class="num">Preis<\/th>/.test(out) && out.includes('1.240,00 €'), 'R-6.2');
  t.wahr('RLB-109/Q-6, RLB-110 Ausgabe: Statistik', ['Quartierkosten:', 'Ø je Nacht:', 'Gegangene Kilometer:', 'Ø je Tag:'].every(k => out.includes(`<b>${k}</b>`)), 'R-6.2');
  t.ist('RLB-110/L-11 Spaltenanteile der Ausgabe', [...out.matchAll(/<col style="width:([\d.]+)%">/g)].map(m => m[1]), ['25.93', '25.93', '7.41', '20.37', '20.37'], 'R-6.2');
  t.wahr('RLB-110/L-11 Kopf ‚🚶🏽‍♂️km‘ in einer Zeile (th.num)', out.includes('<th class="num">🚶🏽‍♂️km</th>'), 'R-6.2');
  // L-1, L-7, Q-5: Einstellungen – Schalter nach ‚Wie war was?‘; Spalten aus – Schritt, Spalte, Statistikzeilen weg, Werte bleiben
  await t.schritt(p, 'L-1 Einstellungen', async () => { await p.click('#mainMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Einstellungen' }).click(); await p.waitForTimeout(400); await navFertig(p); });
  t.ist('RLB-110/L-1 Schalter', await p.evaluate(() => [...dlg.querySelectorAll('.swlist .check')].map(l => l.textContent.trim()).slice(0, 4)),
    ['Spalte 🙂☹️😉 ‚Wie war was?‘', 'Spalte 🚶🏽‍♂️km ‚Gegangene Kilometer‘', 'Spalte 🍽️🍷☕️ ‚Essen und Trinken‘', 'Spalte 😴💤 ‚Quartier‘']);
  await p.locator('#fKm').evaluate(e => e.click()); await p.locator('#fQuarterCol').evaluate(e => e.click());
  await p.click('#dlgOk'); await p.waitForTimeout(400);
  const st2 = await stats(p);
  t.ist('RLB-110/L-7, RLB-109/Q-5 Statistik ohne km- und Preiszeilen', ['Gegangene Kilometer', 'Ø je Tag', 'Quartierkosten', 'Ø je Nacht'].filter(k => k in st2), []);
  if (!phone) t.ist('RLB-110/L-7 Spalte weg', (await p.locator('table.days:not(.static) thead th').allTextContents()).includes('🚶🏽‍♂️km'), false);
  await tag(p, '2026-08-25');
  t.ist('RLB-110/L-7, RLB-109/Q-5 Schritt km und Preisfeld weg', [await p.locator('#fKmDay').count(), await p.locator('#fPrice').isVisible()], [0, false]);
  await p.click('#dlgOk'); await p.waitForTimeout(300);
  t.ist('RLB-110/L-7, RLB-109/Q-5 Werte bleiben', await p.evaluate(() => { const d = db.trips.find(x => x.id === 'a').days; return [d['2026-08-24'].price, d['2026-08-24'].km, d['2026-08-25'].km]; }), [1240, 12, 14]);
  // L-1: neues Reiselogbuch – Voreinstellung aus
  await p.evaluate(() => openTripDialog(null)); await p.waitForTimeout(400);
  t.ist('RLB-110/L-1 neues Reiselogbuch: Spalte km aus', await p.locator('#fKm').isChecked(), false);
  await zu(p);
  await p.close();
}
// D-5: ohne Reiselogbuch – Darstellung erreichbar, Backup erstellen ausgegraut
{
  const p = await t.seite(b, 'iPad quer', { theme: 'light' }); t.ort = 'iPad quer leer';
  await start(p, []); await zu(p);
  await p.click('#sideMore'); await p.waitForTimeout(150);
  t.ist('APD-92/D-5 ohne Reiselogbuch: Menü', await p.evaluate(() => [...document.querySelectorAll('.menu .mi')].map(b => [b.textContent.trim(), b.disabled])),
    [['Backup erstellen', true], ['Backup laden', false], ['DarstellungAutomatisch', false]], 'R-1.2');
  await p.close();
}
await t.ende(b);
