// Schnittstelle von ui.js (AppDesign/tests/schnittstelle.mjs, R-1.14, seit 3.57.7, AppDesign APD-135/B-4.1): die App und ihre Prüfungen nutzen von
// ui.js nur die Namen aus schnittstelle.json; keine Deklaration der App trägt den Namen eines Bausteins von ui.js. Ohne Browser, im Vorlauf von alle.mjs.
// Aufruf im Repo-Ordner: node tests/schnittstelle-regeln.mjs. Meldet Fehler mit Rückgabewert (pruefe.mjs).
import * as pw from 'playwright';
import { fileURLToPath } from 'node:url';
import { pruefung } from '../../AppDesign/fassung/5.0.0/tests/pruefe.mjs';
import { checkSchnittstelle } from '../../AppDesign/fassung/5.0.0/tests/schnittstelle.mjs';
const t = pruefung('schnittstelle-regeln', pw, { out: new URL('out/', import.meta.url) });
t.liste(checkSchnittstelle(fileURLToPath(new URL('..', import.meta.url))));
await t.ende();
