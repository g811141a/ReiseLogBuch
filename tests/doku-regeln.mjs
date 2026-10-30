// Doku-Prüfung (AppDesign/tests/doku.mjs, R-10.4, Zusammenarbeit allgemein 7) , Regelkatalog (checkCatalog, seit 3.11.5) und Zusammenarbeit (checkCollab, seit 3.11.7).
// Aufruf im Repo-Ordner: node tests/doku-regeln.mjs. Meldet Fehler mit Rückgabewert (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.41.0/tests/pruefe.mjs';
import { checkDocs, checkCatalog, checkCollab } from '../../AppDesign/fassung/4.41.0/tests/doku.mjs';
const dir = new URL('..', import.meta.url);
const t = pruefung('doku-regeln', pw, { out: new URL('out/', import.meta.url) });
t.liste([...checkDocs(dir, 'Reiselogbuch'), ...checkCatalog(dir, 'Reiselogbuch'), ...checkCollab(dir, 'Reiselogbuch')]);
await t.ende();
