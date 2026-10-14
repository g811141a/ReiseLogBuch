// Doku-Prüfung (AppDesign/tests/doku.mjs, R-10.4, Zusammenarbeit allgemein 7) , Regelkatalog (checkCatalog, seit 3.11.5) und Zusammenarbeit (checkCollab, seit 3.11.7).
// Aufruf im Repo-Ordner: node tests/doku-regeln.mjs
import { checkDocs, checkCatalog, checkCollab } from '../../AppDesign/tests/doku.mjs';
const dir = new URL('..', import.meta.url);
console.log('ERR', JSON.stringify([...checkDocs(dir, 'Reiselogbuch'), ...checkCatalog(dir, 'Reiselogbuch'), ...checkCollab(dir, 'Reiselogbuch')], null, 1));
