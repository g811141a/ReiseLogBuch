// Doku-Prüfung (AppDesign/tests/doku.mjs, R-10.4, Zusammenarbeit allgemein 7) und Regelkatalog (checkCatalog, seit 3.11.5).
// Aufruf im Repo-Ordner: node tests/doku-regeln.mjs
import { checkDocs, checkCatalog } from '../../AppDesign/tests/doku.mjs';
const dir = new URL('..', import.meta.url);
console.log('ERR', JSON.stringify([...checkDocs(dir, 'Reiselogbuch'), ...checkCatalog(dir, 'Reiselogbuch')], null, 1));
