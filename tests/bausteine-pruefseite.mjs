// Bausteine auf der Prüfseite (AppDesign/tests/pruefseite.mjs, Designrichtlinie 14 ‚Prüfen‘, seit 3.57.7, AppDesign APD-135/B-3.1): AppDesign prüft
// die Bausteine, die ohne den Inhalt einer App gleich laufen, auf der Vorlage seiner Fassung mit neutralen Daten (Prüfseite) bzw. ihre Werte auf
// der daraus abgeleiteten Mindestseite. Diese Hülle übergibt nur Playwright und den Ausgabeordner der App (nie in die Fassung schreiben);
// den Teil setzt alle.mjs (PRUEF_TEIL): ‚werte‘ (Version, Icons, leerer Zustand, Hilfen, Suche, Teilen, Backup, Abgleich – dazu die Vorlage
// in allen vier Ansichten, hell und dunkel, leer und mit 60 Unterpunkten mit den Grundregeln) und seit AppDesign APD-135/B-3.2 die Abläufe
// ‚messung‘ (APD-27), ‚titel-blase‘ (APD-101), ‚titel-oben‘ (APD-62, APD-109, APD-108), ‚schicht-oben‘ (APD-118, mit den 3 Messdateien) und
// ‚grossanzeige‘ (APD-104) – bis 3.57.6 eigene Prüfdateien der App; das Zusammenspiel mit der App prüft ablauf-bausteine. Seit 3.57.8 (AppDesign
// APD-135/B-3.3) die Teile ‚menue‘ (Mehr-Schaltfläche, Wachsen, Tastatur – bis 3.57.7 teils in ablauf-markierung-menues), ‚sprechblase‘ (‚Eintrag löschen‘:
// Wachsen, Sperre, Esc, Fokus, ‚Bewegung reduzieren‘) und ‚fenster‘ (Häkchen, Tastatur, Fokus zurück). Seit 3.58.2 (AppDesign APD-135/B-3.3 Schritt 2)
// der Teil ‚felder‘ (ⓧ, Cursor am Ende, Feldfehler, Großschreibung, Leerzeichen, Textfeld wächst mit, Eingabetaste an #fTitle und #fText der Vorlage).
// Gegenprobe: node tests/alle.mjs --gegenprobe pruefseite. Aufruf im Repo-Ordner: [PRUEF_TEIL=titel-oben] node tests/bausteine-pruefseite.mjs
// (ohne PRUEF_TEIL Teil werte). Meldet Fehler mit Rückgabewert (pruefe.mjs).
import * as pw from 'playwright';
import { pruefseite } from '../../AppDesign/fassung/4.71.1/tests/pruefseite.mjs';
await pruefseite(pw, { out: new URL('out/', import.meta.url), teil: process.env.PRUEF_TEIL || 'werte' });
