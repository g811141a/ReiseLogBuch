// Doku-Prüfung (AppDesign/tests/doku.mjs, R-49, R-50). Aufruf im Repo-Ordner: node tests/doku-regeln.mjs
import { checkDocs } from '../../AppDesign/tests/doku.mjs';
console.log('ERR', JSON.stringify(checkDocs(new URL('..', import.meta.url), 'Reiselogbuch'), null, 1));
