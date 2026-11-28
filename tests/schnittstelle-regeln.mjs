// Schnittstelle von ui.js (AppDesign/tests/schnittstelle.mjs, R-1.14, seit 3.57.7, AppDesign APD-135/B-4.1): die App und ihre Prüfungen nutzen von
// ui.js nur AD.<Name> mit den Namen aus schnittstelle.json (seit 3.60.0, AppDesign 5.0.0: Namensraum AD, APD-145); keine Deklaration der App heißt AD.
// Im Vorlauf von alle.mjs (einmal, im ersten Browser).
// Aufruf im Repo-Ordner: node tests/schnittstelle-regeln.mjs. Meldet Fehler mit Rückgabewert (pruefe.mjs).
import * as pw from 'playwright';
import { fileURLToPath } from 'node:url';
import { pruefung } from '../../AppDesign/fassung/5.0.0/tests/pruefe.mjs';
import { checkSchnittstelle } from '../../AppDesign/fassung/5.0.0/tests/schnittstelle.mjs';
const t = pruefung('schnittstelle-regeln', pw, { out: new URL('out/', import.meta.url) });
// seit 3.60.0 (AppDesign 5.0.0, APD-145/T-1, T-2): mit Browser – ui.js macht global nur AD, AD hat genau die Namen der Liste
const b = await t.browser();
t.liste(await checkSchnittstelle(fileURLToPath(new URL('..', import.meta.url)), { browser: b }));
await t.ende(b);
