// Versionskopplung App ↔ AppDesign (AppDesign/tests/version.mjs, R-10.3). Aufruf im Repo-Ordner: node tests/version-regeln.mjs.
// Meldet Fehler mit Rückgabewert (seit 3.12.0, pruefe.mjs).
import * as pw from 'playwright';
import { pruefung } from '../../AppDesign/fassung/4.32.2/tests/pruefe.mjs';
import { checkVersions } from '../../AppDesign/fassung/4.32.2/tests/version.mjs';
const t = pruefung('version-regeln', pw, { out: new URL('out/', import.meta.url) });
const b = await t.browser();
t.liste(await checkVersions(new URL('..', import.meta.url), b));
await t.ende(b);
