// Bean-Katalog von AppDesign (AppDesign/tests/katalog.mjs, R-1.13, seit 3.57.8, AppDesign APD-140): öffnet AppDesign/katalog/index.html (Arbeitsstand v4/)
// in allen 4 Ansichten, jede Bean, ohne Fehler, mit den Grundregeln nach jedem Schritt und der Versionszeile (APD-140/Z-2 bis Z-4). Die Liste der
// AD-Beans ↔ katalog/ prüft doku-regeln (checkBeans, APD-140/Z-1). Diese Hülle übergibt nur Playwright und den Ausgabeordner der App.
// Aufruf im Repo-Ordner: node tests/bean-katalog.mjs (PRUEF_BROWSER=webkit für WebKit). Meldet Fehler mit Rückgabewert (pruefe.mjs).
import * as pw from 'playwright';
import { katalog } from '../../AppDesign/fassung/4.65.0/tests/katalog.mjs';
await katalog(pw, { out: new URL('out/', import.meta.url) });
