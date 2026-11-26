// Alle Prüfungen des Reiselogbuchs (seit 3.12.0, APD-5) in Chromium und WebKit: nach dem Vorlauf (doku-regeln, version-regeln, rot bricht
// sofort ab) parallel, die längsten zuerst; ab dem dritten roten Lauf werden die übrigen beendet, jeder rote Lauf läuft am Ende einmal
// allein, die Ausgabe eines Wacklers bleibt in tests/out/wackelt-<Name>-<Browser>.txt (Zusammenarbeit 0 Nr. 2; seit 3.57.6, AppDesign APD-135
// Paket 5) – über das
// Lauf-Werkzeug aus AppDesign (tests/lauf.mjs). AppDesign muss neben dem Repo liegen. Seit 3.57.7 (AppDesign APD-135/B-4.1, R-1.14) steht
// schnittstelle-regeln im Vorlauf (ohne Browser, einmal).
// Aufruf im Repo-Ordner: node tests/alle.mjs [--alle] [--browser chromium] [--nur hig,tastatur] [--abdeckung] [--gegenprobe [… | pruefseite]]
// pixelvergleich.mjs läuft nicht mit (braucht _alt.html, Handwerkzeug). Seit 3.36.0 (RLB-103) läuft ablauf-tastatur-still mit, seit 3.37.0
// (RLB-107, AppDesign APD-83) ablauf-fenster-breite, seit 3.41.0 ablauf-suche-menue (AppDesign APD-91) und ablauf-preis-km (RLB-108 bis RLB-110),
// seit 3.43.0 ablauf-seitenleiste-hoch (AppDesign APD-97), seit 3.44.0 ablauf-einstellen (RLB-113) und ablauf-jahre (RLB-114, AppDesign APD-100),
// seit 3.45.0 ablauf-titel-blase (AppDesign APD-101), seit 3.46.0 ablauf-grossanzeige (AppDesign APD-104) und ablauf-beruehren (AppDesign APD-105),
// seit 3.47.0 ablauf-titel-oben (AppDesign APD-62 / APD-38/T-43).
// seit 3.48.0 ablauf-leer (AppDesign APD-30, R-7.7).
// seit 3.56.1 ablauf-drehen-iphone (AppDesign APD-129, R-8.1).
// seit 3.52.0 ablauf-schicht-oben (AppDesign APD-118) und ablauf-glas (AppDesign APD-120).
// seit 3.54.0 ablauf-feld-rollen (AppDesign APD-115, R-4.5).
// seit 3.55.0 ablauf-feld-cursor (AppDesign APD-126, R-5.11, R-5.2).
// seit 3.56.3 ablauf-fremdtext (AppDesign APD-54) und ablauf-drehen-luecke (AppDesign APD-133, R-8.1).
// seit 3.57.0 ablauf-wischen (AppDesign APD-30 und APD-136, R-7.8, R-1.13), nach Gerät geteilt (jeder Teil gut 3 min).
// seit 3.57.7 bausteine-pruefseite (AppDesign APD-135/B-3.1, Designrichtlinie 14 ‚Prüfen‘): die Bausteine auf der Prüfseite von AppDesign (Vorlage
// mit neutralen Daten, Mindestseite), mit Teilen – ‚werte‘ und (AppDesign APD-135/B-3.2) die Abläufe ‚messung‘, ‚titel-blase‘, ‚titel-oben‘,
// ‚schicht-oben‘, ‚grossanzeige‘; Gegenprobe je eingeschleustem Fehler: --gegenprobe pruefseite. Dafür sind ablauf-messung, ablauf-titel-blase,
// ablauf-titel-oben, ablauf-schicht-oben und ablauf-grossanzeige weggefallen; neu ablauf-bausteine – je Baustein eine kurze Zusammenspiel-Prüfung
// an den echten Schaltflächen der App und die Teile mit Reiselogik (Datum im Fenstertitel, Reisetitel, nichts gelöscht, leere App).
// seit 3.57.8 bean-katalog (AppDesign APD-140, R-1.13): der Bean-Katalog von AppDesign lädt fehlerfrei, jede Bean, Grundregeln, Versionszeile.
// seit 3.57.8 in bausteine-pruefseite die Teile ‚menue‘, ‚sprechblase‘ und ‚fenster‘ (AppDesign APD-135/B-3.3); in ablauf-markierung-menues sind checkMehrKnopf und checkWachsen weggefallen.
// seit 3.58.2 in bausteine-pruefseite der Teil ‚felder‘ (AppDesign APD-135/B-3.3 Schritt 2: ⓧ, Cursor am Ende, Feldfehler, Großschreibung, Leerzeichen,
// Textfeld wächst mit, Eingabetaste an den Feldern der Vorlage); in der App fällt nichts weg (Nutzer 22.11.2026).
import * as pw from 'playwright';
import { lauf } from '../../AppDesign/fassung/4.71.0/tests/lauf.mjs';
const tests = ['doku-regeln', 'schnittstelle-regeln', 'ablauf-suche-menue', 'ablauf-preis-km', 'ablauf-liste-still', 'version-regeln', 'offline-regeln', 'start-regeln', 'abgleich-regeln', 'ablauf-suche-tabelle', 'ablauf-suche-woerter', 'ablauf-suche-iphone', 'tastatur',
  'ablauf-abgleich', 'ablauf-seitenleiste-kontextmenue', 'ablauf-seitenleiste-hoch', 'ablauf-einstellen', 'ablauf-leer', 'ablauf-drehen-iphone', 'ablauf-glas', 'ablauf-feld-rollen', 'ablauf-feld-cursor', 'ablauf-fremdtext', 'ablauf-drehen-luecke', 'ablauf-beruehren', 'ablauf-jahre', 'ablauf-abgleich-faelle', 'ablauf-gesamt',
  'verlauf-vorschlaege', 'bean-katalog', 'ablauf-markierung-menues', 'backup-regeln', 'ablauf-abgleich-ui', 'regeln-ablauf', 'ablauf-texte-ablaeufe', 'ablauf-verwerfen-abgleich', 'link-name', 'kapsel-iphone', 'ablauf-feld-tastatur', 'ablauf-abspielen', 'ablauf-tastatur-still', 'ablauf-fenster-breite', 'ablauf-smiley-leiste', 'ablauf-kapsel-pfeile', 'ablauf-reisemittel-zeile', 'ablauf-backup-kachel', 'ablauf-bedienung', 'text-regeln', 'ablauf-bausteine', 'ablauf-sperre',
  // Seit 3.33.0 (AppDesign APD-43 P1): die Abläufe mit Bewegung zusätzlich mit ‚Kontrast erhöhen‘ und ‚Bewegung reduzieren‘ (Bewegungswächter)
  // Seit 3.35.0 (AppDesign APD-43 Teil 2 P1): dieselben Abläufe zusätzlich mit der größten Textgröße (AX5, 53 px)
  ...['ablauf-navigation', 'ablauf-fenster', 'ablauf-iphone', 'ablauf-suche-liste', 'ablauf-seitenleiste-position'].map(name => ({ name, teile: { '': {}, Bedienungshilfen: { PRUEF_BEDIENUNG: 'beide' }, 'Text 53': { PRUEF_TEXT: '53' } } })),
  // Seit 3.48.0 (AppDesign APD-85 Teil 5): ablauf-blatt nach Gerät geteilt – mit APD-108/W-9 lief es unter Last in die Zeitgrenze von 10:00
  // Seit 3.56.0 (RLB-121/W-4, R-8.1): oeffnen-position zusätzlich mit Text 23 (XXXL) – am iPad hoch neben der Seitenleiste schaltet ts-um beim
  // Aus- und Einblenden um; im vollen Lauf von 3.56.0 sprang der oberste Tag (hig Text 23, allein 2 von 3 rot), oeffnen-position Text 23 zeigte es sicher
  // Seit 3.58.1 (Usertest P-120 nicht ok, Zusammenarbeit 0 Nr. 1): ablauf-p120 – die Abläufe des Nutzers zu P-120/F-1 bis F-4, je Teil eine Ansicht der Korrektur
  { name: 'ablauf-p120', teile: Object.fromEntries(['F-1', 'F-2', 'F-3', 'F-4', 'P-121/F-1', 'P-121/F-2'].map(n => [n, { PRUEF_TEIL: n }])) },
  { name: 'oeffnen-position', teile: { '': {}, 'Text 23': { PRUEF_TEXT: '23' } } },
  { name: 'ablauf-blatt', teile: { iPhone: { PRUEF_BLATT: 'iPhone' }, iPad: { PRUEF_BLATT: 'iPad' } } },
  // Die zwei langen Prüfungen geteilt (APD-5/B-5): hig nach Darstellung (der Gerätevergleich R-1.1 bleibt je Teil vollständig),
  // das Kontextmenü nach Gerät.
  // Seit 3.33.0 (APD-43 P1): hig zusätzlich ‚hell/dunkel Bedienungshilfen‘ (alle vier Ansichten, 4,5 : 1 ohne Ausnahmen)
  { name: 'hig', teile: { hell: { PRUEF_DARSTELLUNG: 'light' }, dunkel: { PRUEF_DARSTELLUNG: 'dark' },
    'hell Bedienungshilfen': { PRUEF_DARSTELLUNG: 'light', PRUEF_BEDIENUNG: 'beide' }, 'dunkel Bedienungshilfen': { PRUEF_DARSTELLUNG: 'dark', PRUEF_BEDIENUNG: 'beide' },
    // Seit 3.35.0 (APD-43 Teil 2 P1): hig zusätzlich in den Textgrößen xS, XXXL, AX2 und AX5 (alle vier Ansichten, mit Drehen)
    'Text 14': { PRUEF_DARSTELLUNG: 'light', PRUEF_TEXT: '14' }, 'Text 23': { PRUEF_DARSTELLUNG: 'dark', PRUEF_TEXT: '23' },
    'Text 33': { PRUEF_DARSTELLUNG: 'light', PRUEF_TEXT: '33' }, 'Text 53': { PRUEF_DARSTELLUNG: 'dark', PRUEF_TEXT: '53' } } },
  { name: 'kontextmenue-regeln', teile: { iPad: { PRUEF_GERAET: 'iPad' }, iPhone: { PRUEF_GERAET: 'iPhone' } } },
  { name: 'ablauf-wischen', teile: { iPad: { PRUEF_GERAET: 'iPad' }, iPhone: { PRUEF_GERAET: 'iPhone' } } },
  // Seit 3.57.7 (AppDesign APD-135/B-3.1, B-3.2): Bausteine auf der Prüfseite, je Teil ein Lauf (PRUEF_TEIL) – die Werte (Gruppe A) und die
  // 5 Abläufe, die bis 3.57.6 eigene Prüfdateien hatten (ablauf-messung, -titel-blase, -titel-oben, -schicht-oben, -grossanzeige)
  { name: 'bausteine-pruefseite', teile: { grossanzeige: {}, menue: {}, 'titel-oben': {}, fenster: {}, 'schicht-oben': {}, messung: {}, 'titel-blase': {}, sprechblase: {}, felder: {}, werte: {} } }];
// Seit 3.35.0: Zeitgrenze je Test 600 s statt 300 – ablauf-blatt braucht allein schon 288 s (auch mit AppDesign 4.36.0 gemessen) und lief
// unter Volllast in WebKit über die Grenze
const argv = process.argv.slice(2), zeit = argv.includes('--zeit') ? [] : ['--zeit', '600'];
process.exit(await lauf({ dir: new URL('..', import.meta.url), pw, tests, argv: [...argv, ...zeit] }));
