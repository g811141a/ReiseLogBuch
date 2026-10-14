// Versionskopplung App ↔ AppDesign (AppDesign/tests/version.mjs, R-10.3). Aufruf im Repo-Ordner: node tests/version-regeln.mjs
import { chromium } from 'playwright';
import { checkVersions } from '../../AppDesign/tests/version.mjs';
const b = await chromium.launch();
const errors = await checkVersions(new URL('..', import.meta.url), b);
console.log('ERR', JSON.stringify(errors, null, 1));
await b.close();
