// Ablauf-Test RLB-118: ‚Änderungen verwerfen‘ nach dem automatischen Sichern stellt auch die Zeitstempel des Abgleichs wieder her.
// Ablauf am Gerät: iPhone ändert den Verlauf eines Tages (10:00); iPad öffnet denselben Tag (11:00), tippt, wartet 10 s
// (automatisch gesichert), x → ‚Änderungen verwerfen‘; danach Abgleich in beide Richtungen. Die echte Änderung vom iPhone muss
// bleiben, und das iPad darf nicht als ‚geändert‘ gelten. Dasselbe für das Fazit.
// RLB-118/V-1 Speicher nach dem Verwerfen genau wie beim Öffnen – mit dayAt/metaAt, changedAt, changedOn (Tag, leerer Tag, Fazit)
// RLB-118/V-2 iPhone ändert vorher denselben Tag → nach dem Abgleich steht der Text vom iPhone auf beiden Geräten
// RLB-118/V-3 iPhone ändert vorher das Fazit → dito
// RLB-118/V-4 nur verworfen (iPhone unverändert) → das iPhone meldet ‚Alles war schon auf dem gleichen Stand.‘ beim Laden des iPad-Backups
// RLB-118/V-5 Verwerfen ohne Zwischenspeichern bleibt wie bisher (Speicher wie beim Öffnen)
// Aufruf im Repo-Ordner: node tests/ablauf-verwerfen-abgleich.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.59.0/tests/pruefe.mjs';
const t = pruefung('ablauf-verwerfen-abgleich', pw, { out: new URL('out/', import.meta.url) });

const APP = new URL('../index.html', import.meta.url).href;
const KEY = 'reiselogbuch.v1';
const b = await t.browser();
const base = [{ id: 'x', title: 'Island', participants: 'Anna', start: '2026-07-01', end: '2026-07-05', transport: ['flug'], fazit: 'Gut',
  days: { '2026-07-01': { weather: '☀️', program: 'Reykjavík' } } }];
const um = (p, hm) => p.clock.setSystemTime(new Date(`2026-10-12T${hm}:00`));
async function device(w, h) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 });
  const p = await ctx.newPage(); p.on('pageerror', e => t.fehler('', `Skriptfehler der Seite: ${e.message}`));
  await p.clock.install({ time: new Date('2026-10-12T09:00:00') });
  return p;
}
// Gemeinsamer Ausgangsstand 09:00 auf beiden Geräten (wie ablauf-abgleich-faelle)
async function paar() {
  const ipad = await device(1180, 820), iphone = await device(393, 852);
  for (const p of [ipad, iphone]) await p.goto(APP);
  await ipad.evaluate(tr => { if (dlg.open) dlg.close(); db.trips = normalize({ trips: tr }).trips; db.settings.lastBackup = Date.now(); save(); }, base);
  const start = await ipad.evaluate(() => backupFile().content);
  for (const p of [ipad, iphone]) {
    await p.evaluate(c => { const d = JSON.parse(c); delete d.savedAt; delete d.savedOn; localStorage.setItem('reiselogbuch.v1', JSON.stringify(d)); }, start);
    await p.reload(); await p.waitForTimeout(200); await p.evaluate(() => { if (dlg.open) dlg.close(); });
  }
  return { ipad, iphone };
}
const speicher = p => p.evaluate(k => localStorage.getItem(k), KEY);
// Am iPad: Fenster öffnen, ein Wort tippen, 10 s warten (automatisch gesichert), x → ‚Änderungen verwerfen‘
async function verwerfen(p, open, field, { zwischen = true } = {}) {
  await p.evaluate(open); await p.waitForTimeout(400);
  await p.locator(field).click(); await p.keyboard.type(' Zwischenwort'); await p.waitForTimeout(150);
  if (zwischen) {
    await p.clock.fastForward(10500); await p.waitForTimeout(100);
    if (!(await speicher(p) || '').includes('Zwischenwort')) t.fehler('', 'Eingabe nach 10 s nicht automatisch gesichert – Ablauf stimmt nicht');
  }
  await p.click('#dlgX'); await p.waitForTimeout(250);
  const v = p.locator('.pop button', { hasText: 'Änderungen verwerfen' });
  if (await v.count()) { await v.click(); await p.waitForTimeout(300); } else t.fehler('', 'x fragt nicht ‚Änderungen verwerfen‘');
}
const mergeWith = (p, backup) => p.evaluate(c => { const d = JSON.parse(c); const savedAt = d.savedAt, savedOn = d.savedOn; delete d.savedAt; delete d.savedOn;
  const { data, stats } = mergeData(structuredClone(db), normalize(d)); return { trips: data.trips, text: sync.resultText(stats, savedAt, savedOn) }; }, backup);
const tag = () => openDayDialog(getTrip('x'), '2026-07-01'), leer = () => openDayDialog(getTrip('x'), '2026-07-03'), fazit = () => openFazitDialog(getTrip('x'));

// RLB-118/V-1 und RLB-118/V-5: Speicher nach dem Verwerfen genau wie beim Öffnen
for (const [name, open, field, zwischen] of [['Tag', tag, '#fProgram', true], ['leerer Tag', leer, '#fProgram', true], ['Fazit', fazit, '#fFazit', true],
  ['Tag ohne Zwischenspeichern', tag, '#fProgram', false]]) {
  t.ort = `iPad quer, ${name}`;
  const { ipad, iphone } = await paar();
  await um(ipad, '11:00');
  const s0 = await speicher(ipad);
  await verwerfen(ipad, open, field, { zwischen });
  const s1 = await speicher(ipad);
  if (s1 !== s0) {
    const a = JSON.parse(s0).trips[0], c = JSON.parse(s1).trips[0];
    const diff = Object.keys({ ...a, ...c }).filter(k => JSON.stringify(a[k]) !== JSON.stringify(c[k]));
    t.fehler('', `nach ‚Änderungen verwerfen‘ ist der Speicher nicht wie beim Öffnen – geändert: ${diff.join(', ')} (V-${zwischen ? 1 : 5})`);
  }
  await ipad.context().close(); await iphone.context().close();
}

// RLB-118/V-2 und RLB-118/V-3: echte Änderung am iPhone bleibt nach dem Abgleich erhalten
for (const [name, onIphone, open, field, wert] of [
  ['Tag', () => { getTrip('x').days['2026-07-01'].program = 'vom iPhone'; save(); }, tag, '#fProgram', r => r.trips[0].days['2026-07-01']?.program],
  ['Fazit', () => { getTrip('x').fazit = 'vom iPhone'; save(); }, fazit, '#fFazit', r => r.trips[0].fazit]]) {
  t.ort = `iPhone 10:00 geändert, iPad 11:00 verworfen, ${name}`;
  const { ipad, iphone } = await paar();
  await um(iphone, '10:00'); await iphone.evaluate(onIphone);
  await um(ipad, '11:00'); await verwerfen(ipad, open, field);
  const vomIpad = await ipad.evaluate(() => backupFile().content), vomIphone = await iphone.evaluate(() => backupFile().content);
  const amIphone = await mergeWith(iphone, vomIpad), amIpad = await mergeWith(ipad, vomIphone);
  if (wert(amIphone) !== 'vom iPhone') t.fehler('', `iPhone lädt das Backup vom iPad: ‚${wert(amIphone)}‘ statt ‚vom iPhone‘ – die Änderung vom iPhone geht verloren (V-${name === 'Tag' ? 2 : 3})\n      Meldung: ${amIphone.text}`);
  if (wert(amIpad) !== 'vom iPhone') t.fehler('', `iPad lädt das Backup vom iPhone: ‚${wert(amIpad)}‘ statt ‚vom iPhone‘ (V-${name === 'Tag' ? 2 : 3})\n      Meldung: ${amIpad.text}`);
  if (!amIpad.text.includes('Auf diesem iPad hat sich etwas geändert – Einzelheiten im Abgleichbericht.')) t.fehler('', `iPad lädt das Backup vom iPhone: Meldung ‚${amIpad.text}‘ statt ‚… Auf diesem iPad hat sich etwas geändert – Einzelheiten im Abgleichbericht.‘ (P-96/1 Schritt 5)`);
  await ipad.context().close(); await iphone.context().close();
}

// RLB-118/V-4: nur verworfen → das iPhone sieht im Backup vom iPad keine Änderung
{
  t.ort = 'iPad verworfen, iPhone unverändert';
  const { ipad, iphone } = await paar();
  await um(ipad, '11:00'); await verwerfen(ipad, tag, '#fProgram');
  const r = await mergeWith(iphone, await ipad.evaluate(() => backupFile().content));
  if (!/gleichen Stand/.test(r.text)) t.fehler('', `iPhone lädt das Backup vom iPad: Meldung ‚${r.text}‘ statt ‚Alles war schon auf dem gleichen Stand.‘ (RLB-118/V-4)`);
  await ipad.context().close(); await iphone.context().close();
}
await t.ende(b);
