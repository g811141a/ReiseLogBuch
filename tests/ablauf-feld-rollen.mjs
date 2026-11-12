// Reiselogbuch-Test: ablauf-feld-rollen – AppDesign APD-115 (R-4.5 ‚wie Apple nur so weit gerollt wie nötig‘, Designrichtlinie 13 ‚Lösung in ui.js‘;
// Testfall-Liste AppDesign arbeit/APD-115 Testfall-Liste.md APD-115/M-1 bis M-11, seit 3.54.0 / AppDesign 4.56.0): Feld am unteren Fensterrand
// antippen (endet 16 px über der Tastatur, liegt es schon darüber: nichts), Verlauf oben (nichts rollt), langer Verlauf (Cursorzeile und eine halbe
// Zeile darunter), Feld wechseln bei offener Tastatur (APD-115/W-4: ui.js setzt den Fokus selbst, Safari verschiebt nicht, APD-115/N-16), Schritte 6
// bis 8 vom Gerät (in jedem Bild Kopfzeile und Fensterkopf still, beim Schließen bleibt der Rollstand, APD-115/N-13), seit 3.55.0
// die Vorschläge wieder über dem Feld (RLB-123/B-1, ersetzt APD-115/M-8) und beim Antippen des langen Verlaufs der Cursor am Ende (R-5.11 – die Zeile mit
// dem Cursor ist dann die letzte, AppDesign APD-126/W-6). Alle vier Lagen, hell, im Safari-Modell (apd115, fokusSelbst).
// Aufruf im Repo-Ordner: node tests/ablauf-feld-rollen.mjs
//   PRUEF_V=alt …     Gegenprobe: ui.js der Fassung 4.55.0 – M-1 bis M-3 (rollt zu weit), M-7 und M-11 müssen rot werden
//   PRUEF_FOKUS=alt … Gegenprobe Modell: ohne APD-115/N-16 (Safari verschiebt auch bei selbst gesetztem Fokus) – M-7/M-11 rot
//   PRUEF_ANSICHT='iPhone quer' …   nur eine Ansicht (während der Arbeit)
import * as pw from 'playwright';
import { readFileSync } from 'node:fs';
import { pruefung, navFertig } from '../../AppDesign/fassung/4.57.0/tests/pruefe.mjs';
import { createCheck } from '../../AppDesign/fassung/4.57.0/tests/hig.mjs';
import { checkTastaturStill, STILL_LEISTEN, STILL_LINKS } from '../../AppDesign/fassung/4.57.0/tests/ablauf.mjs';
import { safariModell } from '../../AppDesign/fassung/4.57.0/tests/safari.mjs';
const t = pruefung('ablauf-feld-rollen', pw, { out: new URL('out/', import.meta.url), hig: createCheck({ skipTargets: ['.box.day .ln:not(.q) a', 'table.days .ln:not(.q) a'] }) });
const heute = process.env.PRUEF_V === 'alt';
const APP = new URL('../index.html', import.meta.url).href;
const TAG = '2026-08-25', LANG = '2026-08-27';   // kurzer Verlauf; langer Verlauf (14 Zeilen)
// Beispielreise wie im Muster APD-115: 12 Tage, Tag 4 mit langem Verlauf
const days = {}, VERLAUF = ['Frühstück im Hotel', 'Spaziergang zum Hafen', 'Fähre nach Manly', 'Mittagessen am Strand', 'Rückfahrt mit der Fähre'];
const LANGER = Array.from({ length: 14 }, (_, i) => `Punkt ${i + 1}: ${['Opera House', 'Botanischer Garten', 'Circular Quay', 'The Rocks', 'Harbour Bridge', 'Darling Harbour', 'Chinatown'][i % 7]}`).join('\n');
for (let i = 0; i < 12; i++) days[new Date(Date.UTC(2026, 7, 24 + i)).toISOString().slice(0, 10)] = { weather: '☀️', program: i === 3 ? LANGER : VERLAUF.slice(0, 2 + i % 4).join('\n'),
  comment: i % 2 ? '😊 schöner Tag' : '', quarter: 'Oaks Hotel ' + (1 + (i >> 2)), place: 'Sydney, Australien' };
const trips = [{ id: 'muster', title: 'Australien', participants: 'Anna, Ben', start: '2026-08-24', end: '2026-09-04', transport: ['flug'], days, foodColumn: true }];
const b = await t.browser();

// Feld an den unteren Rand des Fensterinhalts rollen (wie im Befund ‚unten‘), so dass es gerade noch ganz sichtbar ist
const ansEnde = (p, sel) => p.evaluate(sel => { const f = document.querySelector(sel), c = f.closest('.dlg-body');
  c.scrollTop += f.getBoundingClientRect().bottom - (Math.min(c.getBoundingClientRect().bottom, innerHeight) - 4); }, sel);
// Lage nach dem Antippen (Bildschirm = Lage minus offsetTop)
const lage = (p, sel) => p.evaluate(sel => { const o = __safari.top(), f = document.querySelector(sel), r = f.getBoundingClientRect(), c = f.closest('.dlg-body');
  return { oben: Math.round(r.top - o), unten: Math.round(r.bottom - o), kb: __safari.hoehe(), ct: Math.round(c.getBoundingClientRect().top - o), cb: Math.round(c.getBoundingClientRect().bottom - o), y: Math.round(c.scrollTop),
    fokus: document.activeElement === f, offen: __safari.offen }; }, sel);
async function oeffne(p, v, iso) {
  await p.goto(APP);
  await p.evaluate(x => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: { lastBackup: Date.now(), lastTrip: 'muster' }, trips: x })), trips);
  await p.reload(); await p.waitForTimeout(500);
  if (await p.locator('#side .side-row[data-id="muster"]').isVisible().catch(() => false)) { await p.locator('#side .side-row[data-id="muster"]').click(); await p.waitForTimeout(400); await navFertig(p); }
  await p.locator(`#app [data-day="${iso}"]`).first().click(); await p.waitForTimeout(600);
}
async function neu(ansicht, v, iso = TAG) {
  const p = await t.seite(b, ansicht, { theme: 'light' });
  // Gegenprobe: ui.js 4.55.0, als 4.56.0 gemeldet (sonst meldet die App ‚AppDesign zu alt‘)
  if (heute) await p.route(/fassung\/4\.56\.0\/ui\.js$/, r => r.fulfill({ body: readFileSync(new URL('../../AppDesign/fassung/4.55.0/ui.js', import.meta.url), 'utf8')
    .replace(/AD_VERSION = '4\.55\.0'/, "AD_VERSION = '4.56.0'"), contentType: 'text/javascript' }));
  await oeffne(p, v, iso);
  await safariModell(p, ansicht, { auto: true, leisten: STILL_LEISTEN, links: STILL_LINKS, fokusSelbst: process.env.PRUEF_FOKUS !== 'alt' });   // Modell mit Befund APD-115/N-11, APD-115/N-16 (Standard seit 4.56.0)
  return p;
}
const E = (regel, was) => t.liste([`${t.ort}: ${regel} ${was}`]);

for (const ansicht of ['iPhone hoch', 'iPad quer', 'iPad hoch', 'iPhone quer'].filter(a => !process.env.PRUEF_ANSICHT || a === process.env.PRUEF_ANSICHT)) {
  for (const v of ['a']) {   // Variante A (APD-115/E-6) – seit 3.54.0 die App
    t.ort = `${ansicht} hell${heute ? ' (Gegenprobe 4.55.0)' : ''}`;
    const quer = ansicht === 'iPhone quer';
    // APD-115/M-1, M-2, M-3: Feld am unteren Rand antippen – es rollt nur so weit, dass es 16 px über der Tastatur endet (± 3); kein Sprung
    for (const [m, sel] of [['M-1', '#fProgram'], ['M-2', '#fComment'], ['M-3', '#fQuarter'], ['M-3', '#fPrice']]) {
      const p = await neu(ansicht, v);
      if (sel === '#fPrice' && !await p.locator(sel).isVisible()) { await p.close(); continue; }
      await ansEnde(p, sel); await p.waitForTimeout(300);
      const y0 = await p.evaluate(sel => document.querySelector(sel).closest('.dlg-body').scrollTop, sel);
      await p.tap(sel); await p.waitForTimeout(800);
      const l = await lage(p, sel), lim = Math.min(l.kb, l.cb) - 16, passt = l.unten - l.oben <= lim - l.ct - 25, still = Math.abs(l.y - y0) <= 1;
      if (!l.fokus || !l.offen) E(`APD-115/${m}`, `${sel}: kein Fokus bzw. keine Tastatur`);
      else if (passt && (still ? l.unten > lim + 3 : Math.abs(l.unten - lim) > 3)) E(`APD-115/${m}`, `${sel} endet bei ${l.unten} px statt ${lim} (16 px über Tastatur ab ${l.kb} bzw. Fensterende ${l.cb}, gerollt ${y0} → ${l.y}) – ${l.unten < lim ? 'rollt zu weit (nicht wie Apple)' : 'zu wenig'}`);
      else if (!passt) console.log(`ℹ ${t.ort} APD-115/${m} ${sel} höher als der sichtbare Teil: ${l.oben}–${l.unten} px, Tastatur ab ${l.kb}`);
      await p.close();
      // kein Sprung (R-4.5, APD-36/B-4); ‚nicht ganz über der Tastatur‘ gilt für hohe Textfelder nach V-3 nicht mehr (dort M-5)
      const q = await neu(ansicht, v);
      t.liste((await checkTastaturStill(q, { field: sel, vorher: () => ansEnde(q, sel), where: `${t.ort} ${m} ${sel}` })).filter(x => passt || !/nicht ganz über der Tastatur/.test(x)));
      await q.close();
    }
    // APD-115/M-4: Feld liegt schon über der Tastatur – nichts rollt (Verlauf oben im Fenster, iPad hoch und iPhone hoch)
    if (!quer && ansicht !== 'iPad quer') {
      const p = await neu(ansicht, v);
      const v0 = await p.evaluate(() => ({ y: document.querySelector('.dlg-body').scrollTop, ueber: document.querySelector('#fProgram').getBoundingClientRect().bottom <= innerHeight - __safari.kb - 16 }));
      const y0 = v0.y;
      await p.tap('#fProgram'); await p.waitForTimeout(700);
      const l = await lage(p, '#fProgram');
      if (v0.ueber && Math.abs(l.y - y0) > 1) E('APD-115/M-4', `Verlauf lag über der Tastatur, trotzdem rollt der Inhalt (${y0} → ${l.y} px)`);
      await p.close();
    }
    // APD-115/M-5: langer Verlauf (14 Zeilen) – eine Zeile unten antippen: Cursorzeile (seit 3.55.0 die letzte, R-5.11) und eine halbe Zeile darunter über der Tastatur (nur berichtet, wenn
    // Safari im Modell verschiebt: hohe Felder sind nicht gemessen)
    {
      const p = await neu(ansicht, v, LANG);
      await ansEnde(p, '#fProgram').catch(() => {});
      await p.evaluate(() => { const f = document.querySelector('#fProgram'), c = f.closest('.dlg-body'), r = f.getBoundingClientRect();
        if (r.top < c.getBoundingClientRect().top) c.scrollTop -= c.getBoundingClientRect().top - r.top - 10; });
      const z = await p.evaluate(() => { const f = document.querySelector('#fProgram'), r = f.getBoundingClientRect(), lh = parseFloat(getComputedStyle(f).lineHeight);
        const sicht = Math.min(f.closest('.dlg-body').getBoundingClientRect().bottom, innerHeight); return { x: r.left + 40, y: Math.min(r.bottom, sicht) - lh, lh }; });
      await p.touchscreen.tap(z.x, z.y); await p.waitForTimeout(800);
      const l = await p.evaluate(() => { const o = __safari.top(), f = document.querySelector('#fProgram'), s = getComputedStyle(f), lh = parseFloat(s.lineHeight);
        // Cursorzeile aus dem Spiegel (wie ui.js)
        const r = f.getBoundingClientRect(), m = document.createElement('div');
        for (const k of ['boxSizing', 'width', 'fontFamily', 'fontSize', 'lineHeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderLeftWidth', 'borderRightWidth', 'borderStyle']) m.style[k] = s[k];
        Object.assign(m.style, { position: 'absolute', visibility: 'hidden', left: '-9999px', top: '0', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' });
        m.textContent = f.value.slice(0, f.selectionEnd); const k = document.createElement('span'); k.textContent = '​'; m.append(k); document.body.append(m);
        const top = r.top + parseFloat(s.borderTopWidth) + k.offsetTop - o; m.remove();
        return { top: Math.round(top), unten: Math.round(top + lh * 1.5), kb: __safari.hoehe(), pan: __safari.top(), fokus: document.activeElement === f, ct: Math.round(f.closest('.dlg-body').getBoundingClientRect().top - o) }; });
      if (!l.fokus) E('APD-115/M-5', 'langer Verlauf: kein Fokus');
      else if (l.unten > l.kb + 1 || l.top < l.ct - 1) E('APD-115/M-5', `langer Verlauf: Cursorzeile ${l.top}–${l.unten} px (mit ½ Zeile) nicht zwischen Fensterkopf (${l.ct}) und Tastatur (${l.kb})${l.pan ? ` · Safari verschiebt im Modell ${l.pan} px` : ''}`);
      else if (l.pan) console.log(`ℹ ${t.ort} APD-115/M-5: Safari verschiebt im Modell ${l.pan} px (hohes Feld, am Gerät nicht gemessen)`);
      // APD-115/M-6: am Ende zwei neue Zeilen tippen – die Cursorzeile bleibt über der Tastatur
      await p.evaluate(() => { const f = document.querySelector('#fProgram'); f.setSelectionRange(f.value.length, f.value.length); });
      for (let i = 0; i < 2; i++) { await p.keyboard.press('Enter'); await p.keyboard.type('Neue Zeile ' + (i + 1)); await p.waitForTimeout(250); }
      const n = await p.evaluate(() => { const o = __safari.top(), f = document.querySelector('#fProgram'), r = f.getBoundingClientRect(), lh = parseFloat(getComputedStyle(f).lineHeight);
        return { unten: Math.round(r.bottom - parseFloat(getComputedStyle(f).paddingBottom) - o + lh / 2), kb: __safari.hoehe(), fokus: document.activeElement === f }; });
      if (n.fokus && n.unten > n.kb + 1) E('APD-115/M-6', `nach dem Tippen am Ende: letzte Zeile (mit ½ Zeile) endet bei ${n.unten} px, Tastatur ab ${n.kb}`);
      await p.close();
    }
    // APD-115/M-7: Feld wechseln bei offener Tastatur (Quartier → Ort) – kein Sprung (checkTastaturStill)
    {
      const p = await neu(ansicht, v);
      // iPhone quer: Ort höher als der sichtbare Teil – Hinweis wie APD-115/A-3 (APD-115/N-14 b)
      const f7 = await checkTastaturStill(p, { field: '#fQuarter', vorher: () => ansEnde(p, '#fQuarter'), wechsel: '#fPlace', where: `${t.ort} APD-115/M-7` });
      if (quer) f7.forEach(x => console.log(`ℹ ${x} – Ort höher als der sichtbare Teil (APD-115/A-3), am Gerät messen`)); else t.liste(f7);
      await p.close();
    }
    // APD-115/M-7 geschärft (Befund APD-115/N-1 bis APD-115/N-16): wie am Gerät – Fenster oben bzw. unten, Quartier antippen, tippen, Ort antippen. Ganz sichtbar:
    // nichts rollt, sonst einmal bis 16 px (± 3) über der Tastatur. ui.js setzt den Fokus selbst (APD-115/W-4) – Safari verschiebt dann nicht (APD-115/N-16):
    // Verschiebung = Fehler. ‚geschoben‘ (Schritte am Gerät): liegt Ort nach dem Tippen unter der Tastatur, schiebt der Nutzer das Fenster mit dem Finger
    // hoch, bis Ort ganz zu sehen ist (40 px über der Tastatur), dann tippt er Ort an.
    for (const w of ['4'])   // APD-115/E-11: W-4 (W-1 bis W-3 verworfen)
    for (const vorher of ['oben', 'unten', 'geschoben']) {
      const p = await neu(ansicht, v);
      if (vorher === 'unten') await ansEnde(p, '#fQuarter');
      await p.tap('#fQuarter'); await p.waitForTimeout(900);
      await p.keyboard.type('Hotel'); await p.waitForTimeout(300);
      if (vorher === 'geschoben') {
        const v0 = await lage(p, '#fPlace');
        if (v0.unten <= Math.min(v0.kb, v0.cb) - 16) { await p.close(); continue; }   // Ort schon sichtbar: wie ‚oben‘
        await p.evaluate(() => { const f = document.querySelector('#fPlace'), c = f.closest('.dlg-body'), o = __safari.top();
          c.scrollTop += f.getBoundingClientRect().bottom - o - (Math.min(__safari.hoehe(), c.getBoundingClientRect().bottom - o) - 40); });
        await p.waitForTimeout(400);
      }
      const a = await lage(p, '#fPlace'), pan0 = await p.evaluate(() => __safari.top());
      await p.evaluate(() => { const c = document.querySelector('.dlg-body'); window.__schuebe = []; let y = c.scrollTop;
        c.addEventListener('scroll', () => { if (Math.abs(c.scrollTop - y) > 1) { __schuebe.push(Math.round(c.scrollTop - y)); y = c.scrollTop; } }); });
      // Ort ganz sichtbar: antippen. Sonst (unter der Tastatur, am Gerät nicht antippbar) Fokus direkt wie mit dem Pfeil über der Tastatur – p.tap
      // rollte vorher selbst bis an die Tastatur (scrollIntoViewIfNeeded, Sitzung 0092: der Schub ‚43 px‘ aus APD-115/N-9 kam vor dem Fokus)
      const sichtbar = a.unten <= Math.min(a.kb, a.cb) && a.oben >= a.ct;
      if (sichtbar) await p.tap('#fPlace'); else await p.evaluate(() => document.querySelector('#fPlace').focus());
      await p.waitForTimeout(900);
      const l = await lage(p, '#fPlace'), schuebe = await p.evaluate(() => __schuebe), pan = await p.evaluate(() => __safari.top());
      const lim = Math.min(l.kb, l.cb) - 16, war = a.unten <= Math.min(a.kb, a.cb) - 16 && a.oben >= a.ct, passt = l.unten - l.oben <= lim - l.ct - 25;
      const wo = `W-${w}, Fenster ${vorher}, Ort vorher ${a.oben}–${a.unten} px, Tastatur ab ${a.kb}${sichtbar ? '' : ' (Pfeil)'}`;
      if (!l.fokus || !l.offen) E('APD-115/M-7', `${wo}: Ort ohne Fokus bzw. Tastatur`);
      else if (!passt) console.log(`ℹ ${t.ort} APD-115/M-7 ${wo}: Ort höher als der sichtbare Teil (${l.oben}–${l.unten} px)`);
      else if (w !== '3' && war && Math.abs(l.y - a.y) > 1) E('APD-115/M-7', `${wo}: Ort war ganz sichtbar, trotzdem rollt der Inhalt ${a.y} → ${l.y} px (Sprung, nicht wie Apple)`);
      else if ((w !== '3' || !sichtbar) && !war && Math.abs(l.unten - lim) > 3) E('APD-115/M-7', `${wo}: Ort endet bei ${l.unten} px statt ${lim} (16 px über der Tastatur) – ${l.unten < lim ? 'rollt zu weit' : 'zu wenig'}`);
      else if (w === '2' && (l.unten > lim + 3 || l.oben < l.ct)) E('APD-115/M-7', `${wo}: Ort danach ${l.oben}–${l.unten} px, nicht ganz über der Tastatur (${lim})`);
      if (schuebe.length > 1) E('APD-115/M-7', `${wo}: rollt in ${schuebe.length} Schüben (${schuebe.join(', ')} px) statt in einem`);
      // W-2 und Ort höher als der sichtbare Teil (iPhone quer): Ort kann nicht bis zur Mitte, Safari verschiebt – Hinweis wie APD-115/A-3
      if (pan !== pan0) ((w === '2' || (w === '3' || w === '4') && sichtbar) && passt ? E('APD-115/M-7', `${wo}: Safari verschiebt im Modell ${pan0} → ${pan} px (Sprung)`)
        : console.log(`ℹ ${t.ort} APD-115/M-7 ${wo}: Safari verschiebt im Modell ${pan0} → ${pan} px (APD-36/S-6 b) – am Gerät messen`));
      await p.close();
    }
    // APD-115/M-11 (Befund APD-115/N-11, Messung 07.11.2026 – Schritte 6 bis 8 am Gerät): nach Quartier und ‚Hotel‘ Ort antippen (liegt Ort unter
    // der Tastatur, vorher hochgeschoben), ‚Rom‘ tippen, mit x schließen. In jedem Bild: Kopfzeile still, Fensterkopf nur zwischen vorher und nachher.
    // W-4 (Fokus selbst): Safari verschiebt nicht (APD-115/N-16) – eine Verschiebung ist ein Fehler
    for (const w of ['4'])   // APD-115/E-11: W-4 (W-1 bis W-3 verworfen)
    {
      const p = await neu(ansicht, v);
      await p.tap('#fQuarter'); await p.waitForTimeout(900);
      await p.keyboard.type('Hotel'); await p.waitForTimeout(300);
      const a0 = await lage(p, '#fPlace');
      if (!(a0.unten <= Math.min(a0.kb, a0.cb) - 16 && a0.oben >= a0.ct)) {
        await p.evaluate(() => { const f = document.querySelector('#fPlace'), c = f.closest('.dlg-body'), o = __safari.top();
          c.scrollTop += f.getBoundingClientRect().bottom - o - (Math.min(__safari.hoehe(), c.getBoundingClientRect().bottom - o) - 40); });
        await p.waitForTimeout(400);
      }
      // W-3 und Ort höher als der sichtbare Teil (iPhone quer): Ort kann nicht in die Mitte, Safari verschiebt – Hinweis wie APD-115/A-3 (APD-115/N-14 b)
      const z = await lage(p, '#fPlace'), passtOrt = z.unten - z.oben <= Math.min(z.kb, z.cb) - 16 - z.ct - 25;
      const film = async (name, fn, warte = 900, hinweis = false) => {
        const a = await p.evaluate(() => __safari.lage());
        await p.evaluate(() => __safari.bilder(true)); await fn(); await p.waitForTimeout(warte);
        const bilder = await p.evaluate(() => __safari.bilder(false)), e = await p.evaluate(() => __safari.lage());
        for (const [k, nm] of [['bar', 'Kopfzeile'], ['kopf', 'Fensterkopf']]) {
          if (a[k] == null || e[k] == null) continue;
          const lo = Math.min(a[k], k === 'bar' ? a[k] : e[k]) - 2, hi = Math.max(a[k], k === 'bar' ? a[k] : e[k]) + 2;
          const aus = bilder.filter(b => b[k] != null && (b[k] < lo || b[k] > hi));
          if (aus.length) { const m = aus.reduce((x, b) => Math.abs(b[k] - a[k]) > Math.abs(x - a[k]) ? b[k] : x, aus[0][k]);
            const txt = `W-${w} ${name}: ${nm} springt in ${aus.length} von ${bilder.length} Bildern bis ${m} px (vorher ${a[k]}, danach ${e[k]} px)`;
            if (hinweis) console.log(`ℹ ${t.ort} APD-115/M-11 ${txt} – Safaris Verschiebung (APD-115/N-13), am Gerät messen`); else E('APD-115/M-11', txt); }
        }
      };
      await film('Ort antippen', () => p.tap('#fPlace'), 900, w === '1' || !passtOrt);
      await film('‚Rom‘ tippen', () => p.keyboard.type('Rom', { delay: 150 }));
      // APD-115/N-13 (zweite Messung, Sitzung 0093): beim Schließen springt der Fensterinhalt (iPad quer 793 → 451, iPhone hoch 1382 → 1075) – der
      // Rollstand des Fensters bleibt in jedem Bild (± 2 px); Kopfzeile und Fensterkopf prüft film
      await p.evaluate(() => { window.__froll = []; const s = () => { if (!window.__froll) return; const c = document.querySelector('dialog[open] .dlg-body');
        if (c) __froll.push(Math.round(c.scrollTop)); requestAnimationFrame(s); }; requestAnimationFrame(s); });
      await film('x (Tastatur zu)', () => p.tap('#dlgX'), 1200);
      const fr = await p.evaluate(() => { const x = window.__froll; window.__froll = null; return x; });
      const frAus = fr.filter(y => Math.abs(y - fr[0]) > 2);
      if (frAus.length) E('APD-115/M-11', `W-${w} x (Tastatur zu): Fensterinhalt springt in ${frAus.length} von ${fr.length} Bildern (Rollstand ${fr[0]} → ${frAus[frAus.length - 1]})`);
      await p.close();
    }
    // RLB-123/B-1 (seit 3.55.0, ersetzt APD-115/M-8 ‚Feld direkt unter der Überschrift‘, APD-115/E-6): die Vorschläge stehen wieder zwischen der
    // Überschrift ‚2 Verlauf‘ und dem Feld
    {
      const p = await neu(ansicht, v);
      const g = await p.evaluate(() => { const h = document.querySelector('#fProgram').closest('.step').querySelector('.step-head').getBoundingClientRect(),
        f = document.querySelector('#fProgram').getBoundingClientRect(), s = document.querySelector('#suggest').getBoundingClientRect();
        return { ueber: s.top >= h.bottom - 1 && s.bottom <= f.top + 1, s: Math.round(s.bottom), f: Math.round(f.top) }; });
      if (!g.ueber) E('RLB-123/B-1', `Vorschläge nicht über dem Feld (Vorschläge enden bei ${g.s} px, Feld beginnt bei ${g.f} px)`);
      await t.schritt(p, 'Tageserfassung offen', async () => {});   // APD-115/M-10 Grundregeln
      await p.close();
    }
  }
}
await t.ende(b);
