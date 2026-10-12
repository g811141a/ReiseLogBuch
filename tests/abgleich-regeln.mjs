// Allgemeine Prüfung des Abgleichs (AppDesign/tests/abgleich.mjs, Regeln R-41 bis R-44) für das Reiselogbuch.
// Aufruf im Repo-Ordner: node tests/abgleich-regeln.mjs
import { chromium } from 'playwright';
import { checkSync } from '../../AppDesign/tests/abgleich.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1180, height: 820 } });
const pageErrors = [];
p.on('pageerror', e => pageErrors.push(e.message));
await p.goto(new URL('../index.html', import.meta.url).href);
const errors = [...await checkSync(p), ...pageErrors];
console.log('ERR', JSON.stringify(errors, null, 1));
await b.close();
