// Offline-Start (AppDesign/tests/offline.mjs, R-1.5, seit 3.13.2 – Fund P-37/3: iPad startete offline mit weißer Seite).
// Eigener Webserver mit echtem Service Worker; ohne Netz, unter anderer Adresse und bei hängendem Netz – iPad und iPhone.
// Aufruf im Repo-Ordner: node tests/offline-regeln.mjs. Meldet Fehler mit Rückgabewert (pruefe.mjs).
import * as pw from 'playwright';
import { pruefung, ANSICHTEN } from '../../AppDesign/fassung/4.14.2/tests/pruefe.mjs';
import { checkOffline } from '../../AppDesign/fassung/4.14.2/tests/offline.mjs';
const t = pruefung('offline-regeln', pw, { out: new URL('out/', import.meta.url) });
const b = await t.browser();
t.liste(await checkOffline(new URL('..', import.meta.url), b, { ansichten: ANSICHTEN }));
await t.ende(b);
