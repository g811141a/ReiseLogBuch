// Allgemeine Prüfung des Abgleichs (AppDesign/tests/abgleich.mjs, Regeln R-9.2 bis R-9.4) für das Reiselogbuch.
// Aufruf im Repo-Ordner: node tests/abgleich-regeln.mjs. Meldet Fehler mit Rückgabewert (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.28.1/tests/pruefe.mjs';
import { checkSync } from '../../AppDesign/fassung/4.28.1/tests/abgleich.mjs';
const t = pruefung('abgleich-regeln', pw, { out: new URL('out/', import.meta.url) });
const b = await t.browser();
const p = await t.seite(b, 'iPad quer');
await p.goto(new URL('../index.html', import.meta.url).href);
t.liste(await checkSync(p));
await t.ende(b);
