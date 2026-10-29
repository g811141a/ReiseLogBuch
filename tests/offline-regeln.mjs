// Offline-Start (AppDesign/tests/offline.mjs, R-1.5, seit 3.13.2 – Fund P-37/3: iPad startete offline mit weißer Seite).
// Eigener Webserver mit echtem Service Worker; ohne Netz, unter anderer Adresse und bei hängendem Netz – iPad und iPhone.
// Seit 3.14.0 auch der Offline-Hinweis (APD-6): Meldung und graue Zeile beim Start ohne Netz und beim Wechsel.
// Aufruf im Repo-Ordner: node tests/offline-regeln.mjs. Meldet Fehler mit Rückgabewert (pruefe.mjs).
import * as pw from 'playwright';
import { pruefung, ANSICHTEN } from '../../AppDesign/fassung/4.40.0/tests/pruefe.mjs';
import { checkOffline } from '../../AppDesign/fassung/4.40.0/tests/offline.mjs';
const t = pruefung('offline-regeln', pw, { out: new URL('out/', import.meta.url) });
const b = await t.browser();
// Seit 3.14.0 (APD-6): mit langer Liste, damit Offline-Zeile und Backup-Kachel die Liste wirklich überdecken (APD-6/F-13)
const trips = Array.from({ length: 14 }, (_, i) => ({ id: 't' + i, title: 'Reise ' + (i + 1), participants: 'A', start: `${2026 - i}-06-01`, end: `${2026 - i}-06-10`, transport: ['pkw'], days: {} }));
const vorbereiten = p => p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
t.liste(await checkOffline(new URL('..', import.meta.url), b, { ansichten: ANSICHTEN, vorbereiten }));
await t.ende(b);
