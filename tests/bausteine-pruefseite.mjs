// Bausteine auf der Prüfseite (AppDesign/tests/pruefseite.mjs, Designrichtlinie 14 ‚Prüfen‘, seit 3.57.7, AppDesign APD-135/B-3.1): AppDesign prüft
// die Bausteine, die ohne den Inhalt einer App gleich laufen, auf der Vorlage seiner Fassung mit neutralen Daten (Prüfseite) bzw. ihre Werte auf
// der daraus abgeleiteten Mindestseite. Diese Hülle übergibt nur Playwright und den Ausgabeordner der App (nie in die Fassung schreiben);
// den Teil setzt alle.mjs (PRUEF_TEIL, heute ‚werte‘: Version, Icons, leerer Zustand, Hilfen, Suche, Teilen, Backup, Abgleich – dazu die Vorlage
// in allen vier Ansichten, hell und dunkel, leer und mit 60 Unterpunkten mit den Grundregeln). Gegenprobe: node tests/alle.mjs --gegenprobe pruefseite.
// Aufruf im Repo-Ordner: node tests/bausteine-pruefseite.mjs (Teil werte). Meldet Fehler mit Rückgabewert (pruefe.mjs).
import * as pw from 'playwright';
import { pruefseite } from '../../AppDesign/fassung/4.64.0/tests/pruefseite.mjs';
await pruefseite(pw, { out: new URL('out/', import.meta.url), teil: process.env.PRUEF_TEIL || 'werte' });
