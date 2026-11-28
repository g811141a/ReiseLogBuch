// Bean-Katalog von AppDesign (AppDesign/tests/katalog.mjs, R-1.13, seit 3.57.8, AppDesign APD-140): öffnet AppDesign/katalog/index.html (Arbeitsstand v5/)
// in allen 4 Ansichten, jede Bean, ohne Fehler, mit den Grundregeln nach jedem Schritt und der Versionszeile (APD-140/Z-2 bis Z-4). Die Liste der
// AD-Beans ↔ katalog/ prüft doku-regeln (checkBeans, APD-140/Z-1). Diese Hülle übergibt nur Playwright, den Ausgabeordner der App und den Teil.
// Seit 3.60.0 (AppDesign 5.0.0, APD-149) mit Teilen: ohne PRUEF_TEIL der Katalog, ‚presentation‘ die AD-Beans presentation und commands an ihrer
// Vorführung im Katalog (AppDesign tests/presentation.mjs, APD-149/S-1 bis S-18, L-1 bis L-4); Gegenprobe: node tests/alle.mjs --gegenprobe presentation.
// Aufruf im Repo-Ordner: [PRUEF_TEIL=presentation] node tests/bean-katalog.mjs (PRUEF_BROWSER=webkit für WebKit). Meldet Fehler mit Rückgabewert (pruefe.mjs).
import * as pw from 'playwright';
import { katalog } from '../../AppDesign/fassung/5.0.0/tests/katalog.mjs';
await katalog(pw, { out: new URL('out/', import.meta.url), teil: process.env.PRUEF_TEIL || '' });
