// Ablauf-Test: alle Anwendungsfälle des Abgleichs (Tabelle im CHANGELOG 3.10.0 und in der Designrichtlinie Reiselogbuch).
// Je Fall: gemeinsamer Ausgangsstand (09:00), dann Änderungen auf iPad und iPhone zu festen Zeiten; danach wird in beide
// Richtungen abgeglichen (iPhone lädt das Backup vom iPad, iPad lädt das Backup vom iPhone) und das Ergebnis geprüft.
// Aufruf im Repo-Ordner: node tests/ablauf-abgleich-faelle.mjs
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.33.0/tests/pruefe.mjs';
// Meldet Fehler mit Rückgabewert, Grundregeln nach den Schritten (seit 3.12.0, pruefe.mjs).
const t = pruefung('ablauf-abgleich-faelle', pw, { out: new URL('out/', import.meta.url) });
// Reine Datenprüfung über mergeWith (keine Bedienung) – deshalb ohne Grundregeln.

const APP = new URL('../index.html', import.meta.url).href;
const errors = { push: (...m) => m.forEach(x => t.fehler('', x)) };   // Meldungen werden Fehler (pruefe.mjs)
const b = await t.browser();
const base = [
  { id: 'x', title: 'Island', participants: 'Anna', start: '2026-07-01', end: '2026-07-05', transport: ['flug'], days: { '2026-07-01': { weather: '☀️', program: 'Reykjavík' } } },
  { id: 'y', title: 'Toskana', participants: 'Anna', start: '2025-05-01', end: '2025-05-05', transport: ['pkw'], days: {} },
];
async function device(w, h) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 700 });
  const p = await ctx.newPage(); p.on('pageerror', e => errors.push(e.message)); return p;
}
const at = (p, t) => p.clock.setFixedTime(new Date(`2026-10-12T${t}:00`));
const op = (p, fn) => p.evaluate(fn);
// Ergebnis eines Abgleichs ohne Zustand zu ändern: { trips, stats, text }
const mergeWith = (p, backup) => p.evaluate(c => { const d = JSON.parse(c); const savedAt = d.savedAt, savedOn = d.savedOn; delete d.savedAt; delete d.savedOn;
  const { data, stats } = mergeData(structuredClone(db), normalize(d)); return { trips: data.trips, stats, text: sync.resultText(stats, savedAt, savedOn) + sync.reportHtml(stats, savedAt, savedOn) }; }, backup);

async function fall(nr, name, onIpad, onIphone, expect, { legacy = false } = {}) {
  const ipad = await device(1180, 820), iphone = await device(393, 852);
  for (const p of [ipad, iphone]) { await at(p, '09:00'); await p.goto(APP); }
  await ipad.evaluate(t => { if (dlg.open) dlg.close(); db.trips = normalize({ trips: t }).trips; save(); }, base);
  const start = await ipad.evaluate(() => backupFile().content);
  await iphone.evaluate(c => { const d = JSON.parse(c); delete d.savedAt; delete d.savedOn; localStorage.setItem('reiselogbuch.v1', JSON.stringify(d)); }, start);
  await iphone.reload(); await iphone.waitForTimeout(150); await iphone.evaluate(() => { if (dlg.open) dlg.close(); });
  if (legacy) for (const p of [ipad, iphone]) await p.evaluate(() => { db.trips.forEach(t => { delete t.metaAt; delete t.dayAt; delete t.changedAt; delete t.changedOn; }); db.deleted = []; localStorage.setItem('reiselogbuch.v1', JSON.stringify(db)); lastSnap = snapshot(normalize(db)); });
  for (const [p, ops] of [[ipad, onIpad], [iphone, onIphone]]) for (const [time, fn] of ops) { await at(p, time); await p.evaluate(fn); }
  const fromIpad = await ipad.evaluate(() => backupFile().content), fromIphone = await iphone.evaluate(() => backupFile().content);
  const res = { iphone: await mergeWith(iphone, fromIpad), ipad: await mergeWith(ipad, fromIphone) };
  for (const [dev, r] of Object.entries(res)) {
    const msg = expect[dev](r);
    if (msg) errors.push(`Fall ${nr} (${name}) – ${dev}: ${msg}\n      Meldung: ${r.text.replace(/<br>/g, ' | ')}`);
  }
  await ipad.context().close(); await iphone.context().close();
}
const T = (r, id) => r.trips.find(t => t.id === id);
const has = (r, s) => r.text.includes(s);
const edit = (id, iso, k, v) => new Function(`const t = getTrip('${id}'); t.days['${iso}'] ||= {}; ${v === null ? `delete t.days['${iso}'].${k}; if (!Object.keys(t.days['${iso}']).length) delete t.days['${iso}'];` : `t.days['${iso}'].${k} = ${JSON.stringify(v)};`} save();`);
const meta = (id, k, v) => new Function(`getTrip('${id}').${k} = ${JSON.stringify(v)}; save();`);
const add = (id, title) => new Function(`db.trips.push(normalize({ trips: [{ id: '${id}', title: '${title}', participants: 'Anna', start: '2024-01-01', end: '2024-01-03', transport: ['pkw'], days: {} }] }).trips[0]); save();`);
const del = id => new Function(`db.trips = db.trips.filter(t => t.id !== '${id}'); save();`);

await fall(1, 'nur auf dem iPad neu angelegt', [['10:00', add('n', 'Kreta')]], [],
  { iphone: r => T(r, 'n') && has(r, '<tbody data-kind="added" data-title="Kreta"') ? '' : 'Kreta nicht dazugekommen', ipad: r => T(r, 'n') && has(r, 'nur hier') && has(r, 'hat sich nichts geändert') ? '' : 'Kreta verloren oder Meldung falsch' });
await fall(2, 'auf dem iPad gelöscht, iPhone unverändert', [['10:00', del('y')]], [],
  { iphone: r => !T(r, 'y') && has(r, '<tbody data-kind="removed" data-title="Toskana"') ? '' : 'Toskana nicht gelöscht', ipad: r => !T(r, 'y') && has(r, 'Auf diesem iPad gelöscht, im Backup vom iPhone noch vorhanden:</b> Toskana') ? '' : 'Toskana zurück oder Hinweis fehlt' });
await fall(3, 'auf dem iPad gelöscht, auf dem iPhone danach geändert', [['10:00', del('y')]], [['11:00', meta('y', 'fazit', 'Schön')]],
  { iphone: r => T(r, 'y') && has(r, 'Auf dem iPad gelöscht, auf diesem iPhone danach noch geändert:</b> Toskana') ? '' : 'Toskana weg oder Hinweis fehlt', ipad: r => T(r, 'y')?.fazit === 'Schön' && has(r, '<tbody data-kind="added" data-title="Toskana"') ? '' : 'Toskana nicht zurückgekommen' });
await fall(4, 'auf dem iPad gelöscht, auf dem iPhone vorher geändert', [['11:00', del('y')]], [['10:00', meta('y', 'fazit', 'Schön')]],
  { iphone: r => !T(r, 'y') && has(r, '<tbody data-kind="removed" data-title="Toskana"') ? '' : 'Toskana nicht gelöscht', ipad: r => !T(r, 'y') && has(r, 'Auf diesem iPad gelöscht, im Backup vom iPhone noch vorhanden') ? '' : 'Toskana zurück oder Hinweis fehlt' });
await fall(5, 'auf beiden Geräten gelöscht', [['10:00', del('y')]], [['11:00', del('y')]],
  { iphone: r => !T(r, 'y') && !has(r, 'Toskana') ? '' : 'Toskana taucht auf', ipad: r => !T(r, 'y') && !has(r, 'Toskana') ? '' : 'Toskana taucht auf' });
await fall(6, 'nur auf dem iPad einen Tag erfasst', [['10:00', edit('x', '2026-07-02', 'program', 'Golden Circle')]], [],
  { iphone: r => T(r, 'x').days['2026-07-02']?.program === 'Golden Circle' && has(r, '<tbody data-kind="updated" data-title="Island"') ? '' : 'Tag nicht übernommen', ipad: r => T(r, 'x').days['2026-07-02']?.program === 'Golden Circle' && has(r, 'neuer als im Backup') ? '' : 'Tag verloren' });
await fall(7, 'verschiedene Tage auf beiden Geräten', [['10:00', edit('x', '2026-07-02', 'program', 'iPad-Tag')]], [['11:00', edit('x', '2026-07-03', 'program', 'iPhone-Tag')]],
  { iphone: r => T(r, 'x').days['2026-07-02']?.program === 'iPad-Tag' && T(r, 'x').days['2026-07-03']?.program === 'iPhone-Tag' ? '' : 'ein Tag fehlt', ipad: r => T(r, 'x').days['2026-07-02']?.program === 'iPad-Tag' && T(r, 'x').days['2026-07-03']?.program === 'iPhone-Tag' ? '' : 'ein Tag fehlt' });
await fall(8, 'gleicher Tag, verschiedene Felder', [['10:00', edit('x', '2026-07-01', 'weather', '🌧')]], [['11:00', edit('x', '2026-07-01', 'program', 'Blaue Lagune')]],
  { iphone: r => T(r, 'x').days['2026-07-01'].weather === '🌧' && T(r, 'x').days['2026-07-01'].program === 'Blaue Lagune' ? '' : 'ein Feld fehlt', ipad: r => T(r, 'x').days['2026-07-01'].weather === '🌧' && T(r, 'x').days['2026-07-01'].program === 'Blaue Lagune' ? '' : 'ein Feld fehlt' });
await fall(9, 'gleicher Tag, gleiches Feld', [['10:00', edit('x', '2026-07-01', 'program', 'vom iPad')]], [['11:00', edit('x', '2026-07-01', 'program', 'vom iPhone')]],
  { iphone: r => T(r, 'x').days['2026-07-01'].program === 'vom iPhone' ? '' : 'neuere Fassung (iPhone) nicht behalten', ipad: r => T(r, 'x').days['2026-07-01'].program === 'vom iPhone' ? '' : 'neuere Fassung (iPhone) nicht übernommen' });
await fall(10, 'Feld auf dem iPad geleert, iPhone unverändert', [['10:00', edit('x', '2026-07-01', 'weather', null)]], [],
  { iphone: r => !T(r, 'x').days['2026-07-01']?.weather && T(r, 'x').days['2026-07-01']?.program === 'Reykjavík' ? '' : 'Wetter nicht geleert', ipad: r => !T(r, 'x').days['2026-07-01']?.weather ? '' : 'Wetter wieder da' });
await fall(11, 'Feld auf dem iPad geleert, auf dem iPhone danach neu eingetragen', [['10:00', edit('x', '2026-07-01', 'weather', null)]], [['11:00', edit('x', '2026-07-01', 'weather', '⛅')]],
  { iphone: r => T(r, 'x').days['2026-07-01'].weather === '⛅' ? '' : 'neuer Eintrag verloren', ipad: r => T(r, 'x').days['2026-07-01'].weather === '⛅' ? '' : 'neuer Eintrag nicht übernommen' });
await fall(12, 'Kopfdaten: Titel auf dem iPad, Fazit auf dem iPhone', [['10:00', meta('x', 'title', 'Island 2026')]], [['11:00', meta('x', 'fazit', 'Großartig')]],
  { iphone: r => T(r, 'x').title === 'Island 2026' && T(r, 'x').fazit === 'Großartig' ? '' : 'Titel oder Fazit verloren', ipad: r => T(r, 'x').title === 'Island 2026' && T(r, 'x').fazit === 'Großartig' ? '' : 'Titel oder Fazit verloren' });
await fall(13, 'Kopfdaten: gleiches Feld auf beiden', [['11:00', meta('x', 'title', 'Island (iPad)')]], [['10:00', meta('x', 'title', 'Island (iPhone)')]],
  { iphone: r => T(r, 'x').title === 'Island (iPad)' ? '' : 'neuerer Titel (iPad) nicht übernommen', ipad: r => T(r, 'x').title === 'Island (iPad)' ? '' : 'neuerer Titel (iPad) nicht behalten' });
await fall(14, 'gleicher Name auf beiden neu angelegt', [['10:00', add('n1', 'Kreta')]], [['11:00', add('n2', 'Kreta')]],
  { iphone: r => T(r, 'n1') && T(r, 'n2') ? '' : 'nicht beide Kreta da', ipad: r => T(r, 'n1') && T(r, 'n2') ? '' : 'nicht beide Kreta da' });
await fall(15, 'nichts geändert', [], [],
  { iphone: r => has(r, 'Alles war schon auf dem gleichen Stand') ? '' : 'Meldung falsch', ipad: r => has(r, 'Alles war schon auf dem gleichen Stand') ? '' : 'Meldung falsch' });
await fall(16, 'ohne Zeitpunkte (vor dem Update): verschiedene Werte', [['10:00', () => { getTrip('x').days['2026-07-01'].program = 'alt iPad'; getTrip('x').days['2026-07-04'] = { program: 'nur iPad' }; localStorage.setItem('reiselogbuch.v1', JSON.stringify(db)); lastSnap = snapshot(db); }]],
  [['10:00', () => { getTrip('x').days['2026-07-01'].program = 'alt iPhone'; localStorage.setItem('reiselogbuch.v1', JSON.stringify(db)); lastSnap = snapshot(db); }]],
  { iphone: r => T(r, 'x').days['2026-07-01'].program === 'alt iPhone' && T(r, 'x').days['2026-07-04']?.program === 'nur iPad' ? '' : 'eigener Wert überschrieben oder Fehlendes nicht dazu', ipad: r => T(r, 'x').days['2026-07-01'].program === 'alt iPad' ? '' : 'eigener Wert überschrieben' }, { legacy: true });
await fall(17, 'Exportzähler', [['10:00', () => { getTrip('x').outputCounter = 5; save(); }]], [['11:00', () => { getTrip('x').outputCounter = 3; save(); }]],
  { iphone: r => T(r, 'x').outputCounter === 5 ? '' : 'höherer Zähler nicht übernommen', ipad: r => T(r, 'x').outputCounter === 5 ? '' : 'höherer Zähler verloren' });
await t.ende(b);
