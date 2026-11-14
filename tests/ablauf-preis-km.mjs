// Reiselogbuch-Test: ablauf-preis-km (seit 3.41.0) – Testfall-Liste AppDesign arbeit/APD-92 APD-93 RLB-108 RLB-109 RLB-110 Testfall-Liste.md:
// D-1 bis D-6 ‚Darstellung‘ im Mehr-Menü der Seitenleiste (RLB-108, APD-92, R-1.2); Q-1 bis Q-9 Preis beim Quartier (RLB-109, R-5.1);
// L-1 bis L-13 Spalte ‚Gegangene Kilometer‘ mit schmalem Zahlenfeld (RLB-110, APD-93). D-7 (Darstellung je Gerät) prüft abgleich-regeln,
// D-8 hig (R-1.2). Seit 3.42.0 Testfall-Liste AppDesign arbeit/RLB-111 APD-95 Testfall-Liste.md: RLB-111/H-1 bis H-8 Preis nur auf Wunsch, in
// Klammern hinter dem Quartier, Ø in Klammern (RLB-111); RLB-111/M-1 bis M-6 Kilometer mit einer Nachkommastelle; APD-95/B-1 bis B-5 Bezeichnungen normal
// (APD-95, R-5.8 – hig `bezeichnungen` nach jedem Schritt, Gegenprobe hier). Seit 3.42.1 Korrektur aus P-82 (RLB-112, 0 Nr. 1 – der Ablauf des
// Nutzers nachgebaut): RLB-112/U-1 Schalter Preis allein antippen, Häkchen blau, gespeichert; U-2 Bezeichnungen der Kachel normal (R-6.5),
// U-5 Gegenprobe; U-3 im Ø ein Leerzeichen nach ‚Ø‘; U-4 Umbruch vor der Klammer, Ø linksbündig unter dem Gesamtwert (App und Ausgabe). Aufruf im Repo-Ordner:
// node tests/ablauf-preis-km.mjs
// Seit 3.55.0 (AppDesign 4.57.0): RLB-120/B-1 bis B-3, B-10 Bezeichnung halbfett, Emojis wie im Wert (kastenBezeichnung, Gegenprobe), B-2 Wetter im Kopf,
// B-4/B-11 Kopfverlauf auch in markierter und ausgewählter Kachel (kopfVerlauf, Gegenprobe); RLB-122/B-1 bis B-6 Statistik als Aufzählung (checkAufzaehlung).
// Seit 3.56.0 (AppDesign 4.59.0): Testfall-Liste AppDesign arbeit/RLB-121 Testfall-Liste.md – RLB-121/M-1 bis M-14, M-16 teuerste und günstigste
// Quartiere (M-15 in ablauf-abgleich-faelle, M-17 hig nach jedem Schritt).
import * as pw from 'playwright';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.59.1/tests/pruefe.mjs';
import { createCheck, bezeichnungen, kastenBezeichnung, kopfVerlauf } from '../../AppDesign/fassung/4.59.1/tests/hig.mjs';
import { checkAufzaehlung, textGroesseSetzen } from '../../AppDesign/fassung/4.59.1/tests/ablauf.mjs';
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
  quarterColumn: true, kmColumn: true, priceOn: true, quarterList: true, days };
const alt = { id: 'b', title: 'Altes Backup', participants: 'G', start: '2025-05-01', end: '2025-05-03', transport: ['pkw'], days: { '2025-05-01': { program: 'x', quarter: 'Q', price: 'teuer', km: 120 } } };
const start = async (p, trips = [trip, alt]) => {
  await p.clock.setFixedTime(new Date('2026-09-05T10:00:00'));
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'a' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(400);
};
const oeffne = async (p, id = 'a') => { if (await p.locator(`#side .side-row[data-id="${id}"]`).isVisible()) { await p.locator(`#side .side-row[data-id="${id}"]`).click(); await p.waitForTimeout(400); await navFertig(p); } };
// RLB-112/U-4: Lage der Zeichen einer Statistikzelle – erste Zeile, Anfang des Ø (‚(‘) und alle Zeichen ab dort (eine Zeile, linksbündig unter dem Wert)
const umbruch = el => { const r = document.createRange(), pos = [], txt = [];
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let n; (n = w.nextNode());) for (let i = 0; i < n.length; i++) { pos.push([n, i]); txt.push(n.data[i]); }
  const box = i => { r.setStart(pos[i][0], pos[i][1]); r.setEnd(pos[i][0], pos[i][1] + 1); const b = r.getClientRects()[0]; return b && { l: Math.round(b.left), t: Math.round(b.top) }; };
  const k = txt.indexOf('('), a = box(0), o = box(k), rest = [...Array(txt.length - k).keys()].map(j => box(k + j)).filter(Boolean);
  return { umgebrochen: o.t > a.t + 2, linksbuendig: Math.abs(o.l - a.l) <= 1, ozeile: rest.every(b => Math.abs(b.t - o.t) <= 2) }; };
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
  t.ist('RLB-110/L-12, RLB-111/H-8, K-6 altes Reiselogbuch: kmColumn und priceOn aus, Felder bereinigt', await p.evaluate(() => { const x = db.trips.find(t => t.id === 'b'); return [x.kmColumn, x.priceOn, 'price' in x.days['2025-05-01'], 'km' in x.days['2025-05-01']]; }), [false, false, false, false]);
  await oeffne(p);
  // D-3: Mehr eines Reiselogbuchs ohne ‚Darstellung‘
  await p.click('#mainMore'); await p.waitForTimeout(150);
  t.ist('APD-92/D-3 Mehr des Reiselogbuchs', await p.locator('.menu .mi').allTextContents(), ['Suchen', 'Alle Tage', 'Nur erfasste Tage', 'Reiselogbuch einstellen', 'Reiselogbuch löschen'], 'R-1.2');
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  // L-2 (iPad) bzw. L-9 (iPhone): Spalte bzw. Zeile ‚🚶🏽‍♂️ 14 km‘
  // seit 3.43.0 (AppDesign APD-97, R-6.6): iPad hoch neben der Seitenleiste Kästen wie am iPhone
  if (!phone && await p.locator('table.days:not(.static)').count()) {
    t.ist('RLB-110/L-2 Spaltenköpfe', await p.locator('table.days:not(.static) thead th').allTextContents(), ['Tag', 'Verlauf', '🙂☹️😉', '🚶🏽‍♂️km', '🍽️🍷☕️', '😴💤']);
    t.ist('RLB-110/L-2 Zellen: nur die Zahl, rechtsbündig, ohne Wert leer', await p.evaluate(() => ['2026-08-24', '2026-08-25', '2026-08-26'].map(d => { const c = document.querySelector(`tr[data-day="${d}"] td:nth-child(4)`); return [c.textContent.trim(), getComputedStyle(c).textAlign]; })),
      [['6,0', 'right'], ['14,0', 'right'], ['', 'right']]);
    // Q-3 Quartierliste (iPad): Spalte ‚Preis‘ nach ‚Nächte‘
    t.ist('RLB-109/Q-3 Quartierliste Kopf', await p.locator('table.days.static thead th').allTextContents(), ['Quartier', 'Zeitraum', 'Nächte', 'Preis']);
    t.ist('RLB-109/Q-3 Quartierliste Preise', await p.locator('table.days.static tbody td:nth-child(4)').allTextContents(), ['300,00 €', '200,00 €', '']);
    // H-4, H-5: Preis in Klammern hinter dem Quartier nur am Tag des Eintrags, die Klammer bricht nie um
    t.ist('RLB-111/H-4 Tabelle: Klammer nur am Tag des Eintrags', await p.evaluate(() => ['2026-08-24', '2026-08-25', '2026-08-27'].map(d => document.querySelector(`tr[data-day="${d}"] td.quarter`).textContent.replace(/\s+/g, ' ').trim())),
      ['📍Hotel A, Cairns (300,00 €)', '📍Hotel A, Cairns', '📍Hotel B, Townsville (200,00 €)']);
    t.ist('RLB-111/H-5 Klammer bricht nie um', await p.evaluate(() => getComputedStyle(document.querySelector('tr[data-day="2026-08-24"] td.quarter .t > span:last-child')).whiteSpace), 'nowrap');
  } else {
    t.ist('RLB-111/M-4 Kachel ‚🚶🏽‍♂️km‘ · ‚14,0‘', await p.evaluate(() => [...document.querySelectorAll('#pdays [data-day="2026-08-25"] .kv')].map(k => [k.querySelector('.k').textContent, k.querySelector('.v').textContent]).find(x => x[0].startsWith('🚶'))), ['🚶🏽‍♂️km', '14,0']);
    // U-2 (P-82/3, Nutzer 30.10.2026: Variante B1 – AppDesign APD-98, R-6.5): ‚km‘ wie ‚Verlauf‘ und wie der Wert – normal, Textgröße, Textfarbe;
    // Bezeichnung mittig zur ersten Zeile des Werts. R-6.5 prüft hig nach jedem Schritt, hier einzeln und die Gegenprobe U-5
    // seit 3.55.0 (AppDesign RLB-120/B-3): Bezeichnung halbfett (600) statt normal; Größe und Farbe wie der Wert bleiben
    t.ist('RLB-112/U-2, RLB-120/B-3 Kachel: ‚km‘ wie ‚Verlauf‘ (Größe, Stärke, Farbe), wie der Wert in Größe und Farbe, halbfett (600)', await p.evaluate(() => { const ks = [...document.querySelectorAll('#pdays [data-day="2026-08-25"] .kv .k')], k = ks.find(x => x.textContent.startsWith('🚶'));
      const km = k.querySelector('.w'), s = e => { const c = getComputedStyle(e); return [c.fontSize, c.fontWeight, c.color].join(' '); }, g = e => { const c = getComputedStyle(e); return [c.fontSize, c.color].join(' '); };
      return km ? [s(km) === s(ks.find(x => x.textContent === 'Verlauf')), g(km) === g(k.nextElementSibling), getComputedStyle(km).fontWeight] : 'kein eigenes Element'; }), [true, true, '600'], 'R-6.5');
    t.ist('RLB-112/U-2 R-6.5 Kachel: Bezeichnungen halbfett, Emojis wie im Wert, mittig zur ersten Zeile', await p.evaluate(kastenBezeichnung), [], 'R-6.5');
    // Gegenprobe (RLB-112/U-5, RLB-120/B-10): normale, verschobene Bezeichnung und Emojis in Fußnotengröße (wie bis 3.54.0) werden gemeldet
    await p.evaluate(() => { const s = document.createElement('style'); s.id = 'gp65'; s.textContent = '.box .kv .k { font-size: var(--t-footnote) } .box .kv .k.word, .box .kv .k .w { font-weight: 400 } .box .kv .k > .l { margin-top: 8px }'; document.head.append(s); });
    t.wahr('RLB-112/U-5, RLB-120/B-10 Gegenprobe: normale, verschobene Bezeichnung und kleine Emojis werden gemeldet', (x => x.some(s => s.includes('400 statt')) && x.some(s => s.includes('neben der Mitte')) && x.some(s => s.includes('RLB-120/B-1')))(await p.evaluate(kastenBezeichnung)), 'R-6.5');
    await p.evaluate(() => document.getElementById('gp65').remove());
    // RLB-120/B-2 (seit 3.55.0): Wetter im Kopf der Tageskachel so hoch wie ein Smiley im Wert (±1 px) – Gegenprobe mit den bisherigen 18 px
    const wxHoehe = () => { const r = document.createRange(), h = el => { const n = [...el.childNodes].find(x => x.nodeType === 3 && x.data.trim()); if (!n) return 0;
        const s = [...new Intl.Segmenter().segment(n.data)][0]; r.setStart(n, s.index); r.setEnd(n, s.index + s.segment.length); return r.getBoundingClientRect().height; };
      return [...document.querySelectorAll('#pdays .box.day')].filter(b => b.querySelector('.h .wx:not(.empty)') && b.querySelector('.kv .v')).map(b => { const v = b.querySelector('.kv .v'), s = document.createElement('span');
        s.textContent = '🙂'; v.append(s); const soll = h(s); s.remove(); const ist = h(b.querySelector('.h .wx')); return Math.abs(ist - soll) <= 1 ? '' : `${b.dataset.day}: ${Math.round(ist)} statt ${Math.round(soll)} px`; }).filter(Boolean); };
    t.ist('RLB-120/B-2 Wetter im Kopf so hoch wie die Smileys im Wert', await p.evaluate(wxHoehe), []);
    await p.evaluate(() => { const s = document.createElement('style'); s.id = 'gpwx'; s.textContent = '.box.day .h .wx { font-size: calc(18px * var(--f-body)) }'; document.head.append(s); });
    // bei Standard sind es nur 1 px Unterschied (21 statt 20 px, innerhalb ±1) – deutlich erst bei großer Schrift (ax3)
    await textGroesseSetzen(p, 'ax3');
    t.wahr('RLB-120/B-2 Gegenprobe: Wetter 18 px wird gemeldet (Text ax3)', (await p.evaluate(wxHoehe)).length > 0);
    await p.evaluate(() => document.getElementById('gpwx').remove());
    t.ist('RLB-120/B-2 Wetter im Kopf so hoch wie die Smileys im Wert (Text ax3)', await p.evaluate(wxHoehe), []);
    await textGroesseSetzen(p, null);
    // RLB-120/B-11 (seit 3.55.0): markierte (.gap) und ausgewählte (.on) Kachel – der Kopfverlauf beginnt mit ihrer Farbe (hig kopfVerlauf);
    // Gegenprobe: Verlauf ab Weiß bzw. --card wird gemeldet
    await p.evaluate(() => document.querySelector('#pdays .box.day:not(.gap)').classList.add('on'));
    t.ist('RLB-120/B-11 markierte und ausgewählte Kachel vorhanden', await p.evaluate(() => [document.querySelectorAll('#pdays .box.day.gap').length, document.querySelectorAll('#pdays .box.day.on').length]), [1, 1]);
    t.ist('RLB-120/B-4, B-11 Kopfverlauf (auch markiert und ausgewählt)', await p.evaluate(kopfVerlauf), [], 'R-6.1');
    await p.evaluate(() => { const s = document.createElement('style'); s.id = 'gp11'; s.textContent = '.box.day.gap, .box.day.on { --kachel-bg: var(--card) }'; document.head.append(s); });
    t.wahr('RLB-120/B-11 Gegenprobe: Verlauf ab --card in markierter und ausgewählter Kachel wird gemeldet', (x => x.filter(s => s.includes('RLB-120/B-11')).length >= 2)(await p.evaluate(kopfVerlauf)), 'R-6.1');
    await p.evaluate(() => { document.getElementById('gp11').remove(); document.querySelector('#pdays .box.day.on').classList.remove('on'); });
    t.ist('RLB-111/H-4 Kachel: Klammer nur am Tag des Eintrags', await p.evaluate(() => ['2026-08-24', '2026-08-25'].map(d => [...document.querySelectorAll(`#pdays [data-day="${d}"] .kv .v`)].pop().textContent.replace(/\s+/g, ' ').includes('(300,00 €)'))), [true, false]);
    t.ist('RLB-109/Q-3 Quartierliste (iPhone): Preis hinter den Nächten', await p.locator('.ilist .irow small').allTextContents(), [/3 Nächte · 300,00 €$/, /2 Nächte · 200,00 €$/, /1 Nacht$/]);
  }
  // Q-4, L-8: Statistik
  const st = await stats(p);
  // H-6, M-5, RLB-112/U-3: Ø in Klammern hinter dem Wert – 5 geschützte Leerzeichen davor, 1 nach ‚Ø‘ (P-82/5), eine Nachkommastelle bei km;
  // keine eigenen Ø-Zeilen; vor der Klammer darf umbrechen (U-4)
  const nb = '\u00a0', ab = nb.repeat(5);
  t.ist('RLB-111/H-6, RLB-112/U-3 Statistik Quartierkosten (Ø nur über Nächte mit Preis)', st['Quartierkosten'], `500,00${nb}€${ab}(Ø${nb}100,00${nb}€)`);
  t.ist('RLB-111/M-5, RLB-112/U-3 Statistik Gegangene Kilometer (Ø nur Tage mit km)', st['Gegangene Kilometer'], `32,0${nb}km${ab}(Ø${nb}8,0${nb}km)`);
  // U-4 (P-82/5): passt die Zeile, steht der Ø daneben; sonst bricht sie vor der Klammer um, der Ø steht ganz linksbündig unter dem Wert
  const zelle = (w = '') => p.evaluate(([fn, w]) => { const dd = [...document.querySelectorAll('#app .rolle > dl.meta:not(.trip) dt')].find(d => d.textContent.startsWith('Quartierkosten')).nextElementSibling;
    dd.style.maxWidth = w; const x = eval(fn)(dd); dd.style.maxWidth = ''; return x; }, [umbruch.toString(), w]);
  if (!phone) t.ist('RLB-112/U-4 iPad, genug Platz: Ø in derselben Zeile', (await zelle()).umgebrochen, false);
  else t.ist('RLB-112/U-4 iPhone: steht der Ø darunter, dann linksbündig in einer Zeile', await zelle().then(z => !z.umgebrochen || (z.linksbuendig && z.ozeile)), true);
  t.ist('RLB-112/U-4 zu schmal: Umbruch vor der Klammer, Ø linksbündig unter dem Wert, in einer Zeile', await zelle('110px'), { umgebrochen: true, linksbuendig: true, ozeile: true });
  t.ist('Statistik: Reihenfolge, RLB-121/M-1', Object.keys(st), ['Reisetage', 'Gegangene Kilometer', 'Quartiere', 'Nächte', 'Quartierkosten', 'Teuerste Quartiere', 'Günstigste Quartiere', 'Wetter', 'Smileys']);
  t.ist('RLB-121/M-6 gleicher Preis je Nacht (100,00 €): der frühere Aufenthalt oben', [st['Teuerste Quartiere'], st['Günstigste Quartiere']], [`Hotel A${nb}(100,00${nb}€)`, `Hotel B${nb}(100,00${nb}€)`]);
  // H-2: ‚Preis der Quartiere erfassen‘ aus – keine Spalte, keine Klammer, keine Quartierkosten; Werte bleiben, wieder ein → wieder da
  await p.evaluate(() => { db.trips.find(x => x.id === 'a').priceOn = false; render(); }); await p.waitForTimeout(300);
  t.ist('RLB-111/H-2 aus: nichts vom Preis sichtbar, Werte bleiben', await p.evaluate(() => [document.querySelector('#app').textContent.includes('300,00'), 'Quartierkosten' in Object.fromEntries([...document.querySelectorAll('#app .rolle > dl.meta:not(.trip) dt')].map(d => [d.textContent.replace(/:$/, ''), 1])), db.trips.find(x => x.id === 'a').days['2026-08-24'].price]), [false, false, 300]);
  await p.evaluate(() => { db.trips.find(x => x.id === 'a').priceOn = true; render(); }); await p.waitForTimeout(300);
  t.ist('RLB-111/H-2 wieder ein: wieder da', 'Quartierkosten' in await stats(p), true);
  // L-10: ein Tag nur mit km zählt nicht als erfasst
  t.ist('RLB-110/L-10 Tag nur mit km nicht erfasst', await p.evaluate(() => isRecorded(db.trips.find(x => x.id === 'a'), '2026-08-31')), false);
  // L-3: Schritt ‚Gegangene Kilometer‘ nach ‚Wie war was?‘, Nummern +1, Feld mit ‚km‘ rechts daneben
  await t.schritt(p, 'L-3 Tag mit km', () => tag(p, '2026-08-24'));
  t.ist('RLB-110/L-3 Schritte', await p.evaluate(() => [...dlg.querySelectorAll('.step:not([hidden]) .step-head > label:first-child')].map(l => l.textContent.trim())),
    ['1Wetter', '2Verlauf', '3Wie war was?', '4Gegangene Kilometer', '5Essen und Trinken', '6Quartier']);
  const km = await p.evaluate(() => { const f = document.getElementById('fKmDay'), e = f.nextElementSibling, r = f.getBoundingClientRect(), er = e.getBoundingClientRect();
    return { wert: f.value, mode: f.inputMode, einheit: e.textContent, daneben: er.left >= r.right && er.left - r.right < 20 && Math.abs((er.top + er.bottom) / 2 - (r.top + r.bottom) / 2) < 4, align: getComputedStyle(f).textAlign, breite: Math.round(r.width) }; });
  t.ist('RLB-110/L-3, RLB-111/M-1, K-3 Feld: Wert, Komma-Tastatur, ‚km‘ rechts daneben, rechtsbündig', [km.wert, km.mode, km.einheit, km.daneben, km.align], ['6,0', 'decimal', 'km', true, 'right']);
  // B-1 bis B-3 (APD-95, R-5.8): Bezeichnungen und Einheiten normal – Gegenprobe APD-95/B-5: mit halbfetten Bezeichnungen meldet die Prüfung
  t.ist('APD-95/B-1, B-3 Bezeichnungen und Einheiten normal', await p.evaluate(bezeichnungen), [], 'R-5.8');
  t.ist('APD-95/B-2 Schritt-Überschrift bleibt halbfett', await p.evaluate(() => getComputedStyle(document.querySelector('label[for="fKmDay"]')).fontWeight), '600', 'R-5.8');
  await p.evaluate(() => { const s = document.createElement('style'); s.id = 'gp58'; s.textContent = 'label { font-weight: 600 !important } .kosten > span { font-size: 20px }'; document.head.append(s); });
  t.wahr('APD-95/B-5 Gegenprobe: halbfette Bezeichnung und große Einheit werden gemeldet', (await p.evaluate(bezeichnungen)).some(x => x.startsWith('Bezeichnung ‚Preis‘')) && (await p.evaluate(bezeichnungen)).some(x => x.startsWith('Einheit ‚€‘')), 'R-5.8');
  await p.evaluate(() => document.getElementById('gp58').remove());
  // M-2 (APD-93 geändert): ohne Fokus bündig am rechten Rand (Innenabstand 16 px wie beim Preis), ‚99,9‘ passt auch mit ⓧ, das Feld ist schmal
  t.ist('RLB-111/M-2 ohne Fokus bündig rechts (Innenabstand 16 px)', await p.evaluate(() => getComputedStyle(document.getElementById('fKmDay')).paddingRight), '16px', 'R-5.1');
  await p.locator('#fKmDay').focus(); await p.locator('#fKmDay').fill('99,9'); await p.locator('#fKmDay').dispatchEvent('input'); await p.waitForTimeout(150);
  t.wahr(`RLB-111/M-2 ‚99,9‘ passt mit ⓧ ins Feld (${km.breite} px breit)`, await p.evaluate(() => { const f = document.getElementById('fKmDay'); return !!document.querySelector('#fKmDay + .fclear') && f.scrollWidth <= f.clientWidth; }), 'R-5.1');
  t.wahr(`APD-93/L-6 Feld schmal (${km.breite} px)`, km.breite < 160, 'R-5.1');
  // M-1: höchstens zwei Ziffern, Komma (Punkt wird Komma), eine Stelle danach
  for (const [ein, aus] of [['12,5', '12,5'], ['123', '12'], ['1,25', '1,2'], ['a', ''], ['07', '7'], ['12.5', '12,5']]) {
    await p.locator('#fKmDay').fill(''); await p.locator('#fKmDay').pressSequentially(ein, { delay: 10 });
    t.ist(`RLB-111/M-1 Eingabe ‚${ein}‘`, await p.inputValue('#fKmDay'), aus);
  }
  // L-5, M-2: Fokus mit ‚14‘ – ⓧ erscheint, die Zahl rückt dafür nach links (Innenabstand rechts größer, wie beim Preis); ⓧ leert, Fokus bleibt
  await p.locator('#fKmDay').fill('14'); await p.evaluate(() => document.activeElement?.blur()); await p.waitForTimeout(100);
  const vorher = await p.evaluate(() => getComputedStyle(document.getElementById('fKmDay')).paddingRight);
  await p.locator('#fKmDay').focus(); await p.waitForTimeout(150);
  const x = await p.evaluate(() => ({ pad: getComputedStyle(document.getElementById('fKmDay')).paddingRight, x: !!document.querySelector('#fKmDay + .fclear') }));
  t.ist('RLB-111/M-2 ⓧ erscheint, die Zahl rückt nach links', [x.x, parseFloat(x.pad) > parseFloat(vorher)], [true, true], 'R-5.6');
  await p.evaluate(() => document.activeElement?.blur()); await p.waitForTimeout(100);
  t.ist('RLB-111/M-3 beim Verlassen ‚14‘ → ‚14,0‘', await p.inputValue('#fKmDay'), '14,0');
  await p.locator('#fKmDay').focus(); await p.waitForTimeout(150);
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
  t.wahr('RLB-111/H-7 Ausgabe: Statistik ohne Ø-Zeilen, Ø in Klammern', ['Quartierkosten:', 'Gegangene Kilometer:'].every(k => out.includes(`<b>${k}</b>`)) && !out.includes('Ø je') && out.includes('(Ø\u00a0') && !out.includes('(Ø\u00a0\u00a0'), 'R-6.2');
  t.ist('RLB-112/U-4 Ausgabe zu schmal: Umbruch vor der Klammer, Ø linksbündig unter dem Wert', await p.evaluate(([fn, out]) => { const d = document.createElement('div'); d.style.width = '230px';
    d.innerHTML = out; document.body.append(d); const x = eval(fn)([...d.querySelectorAll('.stats td')].find(td => td.previousElementSibling?.textContent === 'Quartierkosten:')); d.remove(); return x; }, [umbruch.toString(), out]),
    { umgebrochen: true, linksbuendig: true, ozeile: true }, 'R-6.2');
  t.wahr('RLB-111/H-7 Ausgabe: Preis in Klammern hinter dem Quartier', out.includes('(1.240,00\u00a0€)'), 'R-6.2');
  t.ist('RLB-110/L-11 Spaltenanteile der Ausgabe', [...out.matchAll(/<col style="width:([\d.]+)%">/g)].map(m => m[1]), ['25.93', '25.93', '7.41', '20.37', '20.37'], 'R-6.2');
  t.wahr('RLB-110/L-11 Kopf ‚🚶🏽‍♂️km‘ in einer Zeile (th.num)', out.includes('<th class="num">🚶🏽‍♂️km</th>'), 'R-6.2');
  // L-1, L-7, Q-5: Reiselogbuch einstellen – Schalter nach ‚Wie war was?‘; Spalten aus – Schritt, Spalte, Statistikzeilen weg, Werte bleiben
  await t.schritt(p, 'L-1 Reiselogbuch einstellen', async () => { await p.click('#mainMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Reiselogbuch einstellen' }).click(); await p.waitForTimeout(400); await navFertig(p); });
  t.ist('RLB-110/L-1 Schalter', await p.evaluate(() => [...dlg.querySelectorAll('.swlist .check')].map(l => l.textContent.trim()).slice(0, 4)),
    ['Spalte 🙂☹️😉 ‚Wie war was?‘', 'Spalte 🚶🏽‍♂️km ‚Gegangene Kilometer‘', 'Spalte 🍽️🍷☕️ ‚Essen und Trinken‘', 'Spalte 😴💤 ‚Quartier‘']);
  // H-1, H-3: Schalter ‚Preis der Quartiere erfassen‘ nach ‚Quartierliste in der Ausgabe‘, gesperrt ohne Spalte Quartier
  t.ist('RLB-111/H-1 Schalter Preis', await p.evaluate(() => [...dlg.querySelectorAll('.swlist .check')].map(l => l.textContent.trim()).slice(4)), ['Quartierliste in der Ausgabe', 'Preis der Quartiere erfassen']);
  await p.locator('#fKm').evaluate(e => e.click()); await p.locator('#fQuarterCol').evaluate(e => e.click());
  t.ist('RLB-111/H-3 ohne Spalte Quartier gesperrt', await p.locator('#fPriceOn').isDisabled(), true);
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
  t.ist('RLB-110/L-1, RLB-111/H-1 neues Reiselogbuch: Spalte km und Preis aus', [await p.locator('#fKm').isChecked(), await p.locator('#fPriceOn').isChecked()], [false, false]);
  await zu(p);
  await p.close();
}
// RLB-122/B-1 bis B-6 (seit 3.55.0, AppDesign R-10.5, checkAufzaehlung): Statistik Wetter und Smileys mit 10 Wetter-Zeichen und 10 Smileys – umgebrochen
// wird nur nach dem ‚·‘, jede Folgezeile beginnt mit der Anzahl; App in vier Lagen, Textgröße l, xxxl, ax3; Vorschau und Ausgabe (schmal, 230 px);
// Gegenprobe B-6 mit dem bisherigen Text (‚8×☀️ · 8×🌧️ · …‘ ohne Aufzählung) – B-1 bzw. B-2 rot
{
  const WX = ['☀️', '🌧️', '🌤️', '⛅', '🌫️', '⛈️', '🌨️', '🌦️', '🌬️', '☁️'], SM = ['😀', '😉', '🙂', '😐', '☹️', '😡', '🤩', '😴', '🥵', '🥶'];
  const wdays = {};
  for (let i = 0; i < 60; i++) wdays[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { weather: WX[i % 10], program: 'Tag ' + (i + 1), comment: `${SM[i % 10]} schön` };
  const wtrip = { id: 'a', title: 'Statistik', participants: 'G & A', start: '2026-08-24', end: '2026-10-22', transport: ['flug'], moodColumn: true, days: wdays };
  const soll = [WX.map(e => `6×${e}`).join(' · '), SM.map(e => `6×${e}`).join(' · ')];
  const SEL = '#app .rolle > dl.meta:not(.trip) dd:has(.ict)';
  for (const ansicht of ['iPhone hoch', 'iPad hoch', 'iPad quer', 'iPhone quer']) {
    const p = await t.seite(b, ansicht, { theme: 'light' }); t.ort = `${ansicht} hell RLB-122`;
    await start(p, [wtrip]); await oeffne(p);
    await t.schritt(p, 'RLB-122 Statistik', () => p.locator(SEL).first().scrollIntoViewIfNeeded());
    t.liste(await checkAufzaehlung(p, { sel: SEL, texte: soll, umbruch: ansicht.endsWith('hoch'), where: `${t.ort} App` }));
    if (ansicht === 'iPhone hoch') {
      // RLB-122/B-4: Vorschau (volle Seitenbreite, wischbar) und Ausgabe in einem schmalen Blatt (230 px) – Text unverändert, Umbruch nur nach ‚·‘
      await t.schritt(p, 'RLB-122/B-4 Vorschau', async () => { await p.click('#shareBtn'); await p.waitForTimeout(200); await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); await p.waitForTimeout(500); });
      t.liste(await checkAufzaehlung(p, { sel: '.dlg-body.preview .rt .stats td:has(.ict)', groessen: ['l'], texte: soll, fenster: false, where: `${t.ort} Vorschau` }));
      await zu(p);
      await p.evaluate(() => { const d = document.createElement('div'); d.id = 'gpAus'; d.style.cssText = 'position:absolute;left:0;top:0;width:230px;background:#fff';
        d.innerHTML = `<style>${OUTPUT_CSS}</style>${outputBody(db.trips[0], 1, nowStamp())}`; document.body.append(d); });
      t.liste(await checkAufzaehlung(p, { sel: '#gpAus .stats td:has(.ict)', groessen: ['l'], texte: soll, umbruch: true, where: `${t.ort} Ausgabe` }));
      // B-6 Gegenprobe: der bisherige Text (fmt bis 3.54.0) bricht zwischen Anzahl und Zeichen bzw. vor dem ‚·‘ um
      await p.evaluate(() => { document.getElementById('gpAus').remove(); window.__az = aufzaehlung; window.aufzaehlung = l => esc(l.join(' · ')); render(); });
      await p.waitForTimeout(300);
      const gp = await checkAufzaehlung(p, { sel: '#app .rolle > dl.meta:not(.trip) dd:nth-last-of-type(-n+2)', groessen: ['l', 'xxxl'], where: 'Gegenprobe' });
      t.wahr(`RLB-122/B-6 Gegenprobe: bisheriger Text wird gemeldet (${gp.length} Meldungen)`, gp.some(x => /RLB-122\/B-[12]/.test(x)), 'R-10.5');
      await p.evaluate(() => { window.aufzaehlung = window.__az; render(); });
    }
    await p.close();
  }
}
// RLB-121/M-1 bis M-14, M-16 (seit 3.56.0, AppDesign R-10.5): Statistik ‚Teuerste Quartiere‘ und ‚Günstigste Quartiere‘ – Preis je Nacht je Aufenthalt,
// je höchstens 3, kein Aufenthalt in beiden Zeilen (bei ungerader Zahl der mittlere oben), gleicher Preis: der frühere zuerst; Aufzählung mit
// ‚Name (Preis)‘ – passender Eintrag am Stück, Klammer ganz, nichts ragt hinaus (checkAufzaehlung, App in vier Lagen und drei Textgrößen,
// Vorschau, Ausgabe); Gegenprobe M-11: Einträge als Text ohne Schutz werden rot
{
  const nb = ' ', E = (n, v) => `${n}${nb}(${v}${nb}€)`;
  // Aufenthalte [Name, Nächte, Preis] ab 01.06.2026 hintereinander; der Preis steht am ersten Tag (null = ohne Preis)
  const reise = (id, stays, extra = {}) => { const days = {}; let d = Date.UTC(2026, 5, 1);
    for (const [name, n, price] of stays) for (let i = 0; i < n; i++, d += 864e5) days[new Date(d).toISOString().slice(0, 10)] = i ? { program: 'x', sameQuarter: true }
      : { program: 'x', quarter: name, place: 'Ort', ...(price != null ? { price } : {}) };
    return { id, title: 'Quartiere ' + id, participants: 'G', start: '2026-06-01', end: new Date(d - 864e5).toISOString().slice(0, 10), transport: ['pkw'],
      quarterColumn: true, priceOn: true, quarterList: true, days, ...extra }; };
  const ACHT = [['Hotel Adlon', 2, 520], ['Pension Seeblick', 3, 255], ['Gasthof Krone', 2, 178], ['Hotel Sacher', 2, 610], ['B&B <Rosen>', 4, 296],
    ['Jugendherberge Lindau', 2, 84], ['Hotel Post', 3, 345], ['Ferienwohnung Alpenblick', 3, 270]];
  const FUENF = [['Hotel Krone', 3, 360], ['Pension Ruth', 2, 150], ['Hotel Elephant', 2, 330], ['Gasthaus Linde', 3, 195], ['Hotel Bären', 2, 240]];
  const LANG = [['Hotel Krone', 2, 260], ['Romantik-Hotel Schloss Hohenstein an der Weinstraße', 3, 597], ['Hotel Krone', 3, 330], ['Pension Ruth', 2, 130],
    ['Gästehaus zur alten Mühle am Mühlbach', 4, 300], ['Camping am See', 2, 0], ['Bei Freunden', 2, null]];
  const SOLL = {
    a: [[E('Hotel Sacher', '305,00'), E('Hotel Adlon', '260,00'), E('Hotel Post', '115,00')], [E('Jugendherberge Lindau', '42,00'), E('B&B <Rosen>', '74,00'), E('Pension Seeblick', '85,00')]],
    b: [[E('Hotel Elephant', '165,00'), E('Hotel Krone', '120,00'), E('Hotel Bären', '120,00')], [E('Gasthaus Linde', '65,00'), E('Pension Ruth', '75,00')]],
    c: [[E('Romantik-Hotel Schloss Hohenstein an der Weinstraße', '199,00'), E('Hotel Krone', '130,00'), E('Hotel Krone', '110,00')], [E('Camping am See', '0,00'), E('Pension Ruth', '65,00'), E('Gästehaus zur alten Mühle am Mühlbach', '75,00')]],
  };
  const TRIPS = [reise('a', ACHT), reise('b', FUENF), reise('c', LANG), reise('d', [['Hotel Krone', 3, 360], ['Bei Freunden', 3, null]]),
    reise('e', FUENF, { priceOn: false }), reise('f', FUENF, { quarterColumn: false })];
  const zeilen = p => p.evaluate(() => { const dts = [...document.querySelectorAll('#app .rolle > dl.meta:not(.trip) dt')].map(d => d.textContent.replace(/:$/, ''));
    const v = k => { const dt = [...document.querySelectorAll('#app .rolle > dl.meta:not(.trip) dt')].find(d => d.textContent === k + ':'); return dt ? dt.nextElementSibling.textContent.split('\u00a0· ') : null; };
    return { dts, teuer: v('Teuerste Quartiere'), guenstig: v('Günstigste Quartiere'), html: document.querySelector('#app .rolle > dl.meta:not(.trip)')?.innerHTML || '' }; });
  const SEL = '#app .rolle > dl.meta:not(.trip) dd:has(.az-n)';   // ohne Wetter und Smileys – nur die zwei Zeilen
  const zeige = async (p, id) => { await p.evaluate(id => showTrip(id), id); await p.waitForTimeout(400); await navFertig(p); };
  for (const ansicht of ['iPad quer', 'iPad hoch', 'iPhone hoch', 'iPhone quer']) {
    const p = await t.seite(b, ansicht, { theme: ansicht.endsWith('hoch') ? 'dark' : 'light' }); t.ort = `${ansicht} RLB-121`;
    await start(p, TRIPS);
    for (const id of ['a', 'b', 'c']) {
      await zeige(p, id);
      await t.schritt(p, `RLB-121 Statistik ${id}`, () => p.locator('#app .rolle > dl.meta:not(.trip)').scrollIntoViewIfNeeded());
      const z = await zeilen(p), qi = z.dts.indexOf('Quartierkosten');
      t.ist(`RLB-121/M-1 Reiselogbuch ${id}: direkt unter ‚Quartierkosten‘`, z.dts.slice(qi, qi + 3), ['Quartierkosten', 'Teuerste Quartiere', 'Günstigste Quartiere']);
      t.ist(`RLB-121/M-2, M-5 Reiselogbuch ${id}: teuerste`, z.teuer, SOLL[id][0]);
      t.ist(`RLB-121/M-3, M-7 Reiselogbuch ${id}: günstigste (kein Aufenthalt doppelt)`, z.guenstig, SOLL[id][1]);
      if (id === 'a') t.wahr('RLB-121/M-12 Sonderzeichen wörtlich, kein HTML', z.html.includes('B&amp;B &lt;Rosen&gt;') && !z.html.includes('<rosen>'));
      // M-8 bis M-10: Aufzählung (R-10.5) in drei Textgrößen
      t.liste(await checkAufzaehlung(p, { sel: SEL, where: `${t.ort} App ${id}` }));
    }
    // M-13 (iPad): drehen quer → hoch → quer – neu umbrochen, M-8 bis M-10 gelten weiter; Grundregeln nach jedem Schritt (t.schritt)
    if (ansicht === 'iPad quer') {
      const vp = p.viewportSize();
      await t.schritt(p, 'RLB-121/M-13 drehen nach hoch', async () => { await p.setViewportSize({ width: vp.height, height: vp.width }); await p.waitForTimeout(500); });
      t.liste(await checkAufzaehlung(p, { sel: SEL, groessen: ['l'], where: `${t.ort} hoch gedreht` }));
      await t.schritt(p, 'RLB-121/M-13 drehen nach quer', async () => { await p.setViewportSize(vp); await p.waitForTimeout(500); });
      t.liste(await checkAufzaehlung(p, { sel: SEL, groessen: ['l'], where: `${t.ort} zurück gedreht` }));
      // M-11 Gegenprobe: Einträge als Text ohne Schutz (wie vor 3.56.0 ohne Block) – ‚·‘ am Zeilenanfang bzw. Klammer getrennt wird gemeldet
      await p.addStyleTag({ content: '#app .ict.az { display: inline !important; } #app .ict .az-n { white-space: normal !important; }' });
      await p.evaluate(() => { const dd = [...document.querySelectorAll('#app .rolle > dl.meta:not(.trip) dt')].find(d => d.textContent === 'Teuerste Quartiere:').nextElementSibling; dd.style.width = '330px'; dd.id = 'gp121'; });
      const gp = await checkAufzaehlung(p, { sel: '#gp121', groessen: ['l', 'xxxl'], where: 'Gegenprobe' });
      t.wahr(`RLB-121/M-11 Gegenprobe: Einträge ohne Schutz werden gemeldet (${gp.length} Meldungen)`, gp.some(x => /RLB-121\/M-[89]|RLB-122\/B-[23]/.test(x)), 'R-10.5');
      await p.reload(); await p.waitForTimeout(400);
    }
    // M-4: keine Zeilen bei 1 Aufenthalt mit Preis, ‚Preis der Quartiere erfassen‘ aus, Spalte Quartier aus
    for (const id of ['d', 'e', 'f']) {
      await zeige(p, id);
      const z = await zeilen(p);
      t.ist(`RLB-121/M-4 Reiselogbuch ${id}: keine der beiden Zeilen`, [z.teuer, z.guenstig], [null, null]);
    }
    if (ansicht === 'iPhone hoch') {
      // M-14: Preis im Fenster Tag ändern – x → ‚Änderungen verwerfen‘ lässt die Zeilen, sichern zeigt sofort die neuen
      await zeige(p, 'b');
      await p.evaluate(() => openDayDialog(db.trips.find(x => x.id === 'b'), '2026-06-04')); await p.waitForTimeout(400); await navFertig(p);
      await p.locator('#fPrice').scrollIntoViewIfNeeded(); await p.locator('#fPrice').fill(''); await p.locator('#fPrice').pressSequentially('1000', { delay: 10 });
      await p.click('#dlgX'); await p.waitForTimeout(250);
      const v = p.locator('.pop button', { hasText: 'Änderungen verwerfen' });
      if (await v.count()) { await v.click(); await p.waitForTimeout(300); } else t.fehler('', 'RLB-121/M-14 x fragt nicht ‚Änderungen verwerfen‘');
      t.ist('RLB-121/M-14 verworfen: Zeilen wie vorher', [(await zeilen(p)).teuer, (await zeilen(p)).guenstig], SOLL.b);
      await p.evaluate(() => openDayDialog(db.trips.find(x => x.id === 'b'), '2026-06-04')); await p.waitForTimeout(400); await navFertig(p);
      await p.locator('#fPrice').scrollIntoViewIfNeeded(); await p.locator('#fPrice').fill(''); await p.locator('#fPrice').pressSequentially('1000', { delay: 10 });
      await t.schritt(p, 'RLB-121/M-14 Preis sichern', async () => { await p.click('#dlgOk'); await p.waitForTimeout(400); });
      t.ist('RLB-121/M-14 gesichert: Pension Ruth (500,00 €) jetzt oben', (await zeilen(p)).teuer, [E('Pension Ruth', '500,00'), E('Hotel Elephant', '165,00'), E('Hotel Krone', '120,00')]);
      // M-16: Vorschau und Ausgabe (A4-Breite und schmal 230 px) – dieselben Zeilen wie in der App, M-8 bis M-10
      await zeige(p, 'c');
      await t.schritt(p, 'RLB-121/M-16 Vorschau', async () => { await p.click('#shareBtn'); await p.waitForTimeout(200); await p.locator('.menu .mi', { hasText: 'Vorschau' }).click(); await p.waitForTimeout(500); });
      const td = sel => p.evaluate(sel => [...document.querySelectorAll(sel)].filter(x => /^(Teuerste|Günstigste) Quartiere:$/.test(x.textContent)).map(x => x.nextElementSibling.textContent.split('\u00a0· ')), sel);
      t.ist('RLB-121/M-16 Vorschau: dieselben Zeilen wie in der App', await td('.dlg-body.preview .rt .stats td'), SOLL.c, 'R-6.2');
      t.liste(await checkAufzaehlung(p, { sel: '.dlg-body.preview .rt .stats td:has(.az-n)', groessen: ['l'], fenster: false, where: `${t.ort} Vorschau` }));
      await zu(p);
      for (const w of [718, 230]) {
        await p.evaluate(w => { const d = document.createElement('div'); d.id = 'gpAus'; d.style.cssText = `position:absolute;left:0;top:0;width:${w}px;background:#fff`;
          d.innerHTML = `<style>${OUTPUT_CSS}</style>${outputBody(db.trips.find(x => x.id === 'c'), 1, nowStamp())}`; document.body.append(d); }, w);
        t.ist(`RLB-121/M-16 Ausgabe ${w} px: dieselben Zeilen, 11 pt`, [await td('#gpAus .stats td'), await p.evaluate(() => Math.round(parseFloat(getComputedStyle(document.querySelector('#gpAus .rt')).fontSize) * 10) / 10)], [SOLL.c, 14.7], 'R-6.2');   // 11 pt = 14,67 px
        t.liste(await checkAufzaehlung(p, { sel: '#gpAus .stats td:has(.az-n)', groessen: ['l'], umbruch: w < 300, fenster: w < 300, where: `${t.ort} Ausgabe ${w} px` }));   // das Blatt mit 718 px ist breiter als das iPhone
        await p.evaluate(() => document.getElementById('gpAus').remove());
      }
    }
    await p.close();
  }
}
// RLB-112/U-1 (P-82/1, Ablauf des Nutzers): Preis und Quartierliste aus – im Fenster ‚Reiselogbuch einstellen‘ nur ‚Preis der Quartiere erfassen‘ antippen
// (echtes Tippen auf die Zeile) → Schalter an, Häkchen blau; Häkchen tippen → gespeichert, Preisfeld am ersten Tag eines Aufenthalts
for (const ansicht of ['iPad quer', 'iPhone hoch']) {
  const p = await t.seite(b, ansicht, { theme: 'light' }); t.ort = `${ansicht} hell U-1`;
  await start(p, [{ ...trip, priceOn: false, quarterList: false }]); await oeffne(p);
  await t.schritt(p, 'U-1 Reiselogbuch einstellen', async () => { await p.click('#mainMore'); await p.waitForTimeout(150); await p.locator('.menu .mi', { hasText: 'Reiselogbuch einstellen' }).click(); await p.waitForTimeout(400); await navFertig(p); });
  await p.locator('label:has(#fPriceOn)').scrollIntoViewIfNeeded();
  await t.schritt(p, 'U-1 Preis der Quartiere erfassen antippen', () => p.locator('label:has(#fPriceOn)').click());
  t.ist('RLB-112/U-1 Schalter an, Quartierliste bleibt aus', [await p.locator('#fPriceOn').isChecked(), await p.locator('#fQuarterList').isChecked()], [true, false]);
  t.ist('RLB-112/U-1 Häkchen blau', await p.evaluate(() => document.getElementById('dlgOk').classList.contains('primary')), true, 'R-4.4');
  await p.click('#dlgOk'); await p.waitForTimeout(400);
  t.ist('RLB-112/U-1 gespeichert: Preis an, Quartierliste aus', await p.evaluate(() => { const x = db.trips.find(t => t.id === 'a'); return [x.priceOn, x.quarterList]; }), [true, false]);
  await tag(p, '2026-08-27');
  t.ist('RLB-112/U-1 Preisfeld am ersten Tag eines Aufenthalts', await p.locator('#fPrice').isVisible(), true);
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
