// Alle Prüfungen des Reiselogbuchs (seit 3.12.0, APD-5): parallel, die schnellsten zuerst, in Chromium und WebKit, Abbruch
// beim ersten Fehler – über das Lauf-Werkzeug aus AppDesign (tests/lauf.mjs). AppDesign muss neben dem Repo liegen.
// Aufruf im Repo-Ordner: node tests/alle.mjs [--alle] [--browser chromium] [--nur hig,tastatur] [--abdeckung]
// pixelvergleich.mjs läuft nicht mit (braucht _alt.html, Handwerkzeug). Seit 3.36.0 (RLB-103) läuft ablauf-tastatur-still mit, seit 3.37.0
// (RLB-107, AppDesign APD-83) ablauf-fenster-breite, seit 3.41.0 ablauf-suche-menue (AppDesign APD-91) und ablauf-preis-km (RLB-108 bis RLB-110),
// seit 3.43.0 ablauf-seitenleiste-hoch (AppDesign APD-97), seit 3.44.0 ablauf-einstellen (RLB-113) und ablauf-jahre (RLB-114, AppDesign APD-100),
// seit 3.45.0 ablauf-titel-blase (AppDesign APD-101).
import * as pw from 'playwright';
import { lauf } from '../../AppDesign/fassung/4.47.0/tests/lauf.mjs';
const tests = ['doku-regeln', 'ablauf-suche-menue', 'ablauf-preis-km', 'ablauf-liste-still', 'version-regeln', 'offline-regeln', 'start-regeln', 'abgleich-regeln', 'ablauf-suche-tabelle', 'ablauf-suche-woerter', 'ablauf-suche-iphone', 'ablauf-messung', 'tastatur',
  'ablauf-abgleich', 'ablauf-seitenleiste-kontextmenue', 'ablauf-seitenleiste-hoch', 'ablauf-einstellen', 'ablauf-titel-blase', 'ablauf-jahre', 'ablauf-abgleich-faelle', 'ablauf-gesamt',
  'verlauf-vorschlaege', 'ablauf-markierung-menues', 'backup-regeln', 'ablauf-abgleich-ui', 'regeln-ablauf', 'link-name', 'kapsel-iphone', 'oeffnen-position', 'ablauf-feld-tastatur', 'ablauf-abspielen', 'ablauf-tastatur-still', 'ablauf-blatt', 'ablauf-fenster-breite', 'ablauf-smiley-leiste', 'ablauf-kapsel-pfeile', 'ablauf-reisemittel-zeile', 'ablauf-backup-kachel', 'ablauf-bedienung', 'text-regeln',
  // Seit 3.33.0 (AppDesign APD-43 P1): die Abläufe mit Bewegung zusätzlich mit ‚Kontrast erhöhen‘ und ‚Bewegung reduzieren‘ (Bewegungswächter)
  // Seit 3.35.0 (AppDesign APD-43 Teil 2 P1): dieselben Abläufe zusätzlich mit der größten Textgröße (AX5, 53 px)
  ...['ablauf-navigation', 'ablauf-fenster', 'ablauf-iphone', 'ablauf-suche-liste', 'ablauf-seitenleiste-position'].map(name => ({ name, teile: { '': {}, Bedienungshilfen: { PRUEF_BEDIENUNG: 'beide' }, 'Text 53': { PRUEF_TEXT: '53' } } })),
  // Die zwei langen Prüfungen geteilt (APD-5/B-5): hig nach Darstellung (der Gerätevergleich R-1.1 bleibt je Teil vollständig),
  // das Kontextmenü nach Gerät.
  // Seit 3.33.0 (APD-43 P1): hig zusätzlich ‚hell/dunkel Bedienungshilfen‘ (alle vier Ansichten, 4,5 : 1 ohne Ausnahmen)
  { name: 'hig', teile: { hell: { PRUEF_DARSTELLUNG: 'light' }, dunkel: { PRUEF_DARSTELLUNG: 'dark' },
    'hell Bedienungshilfen': { PRUEF_DARSTELLUNG: 'light', PRUEF_BEDIENUNG: 'beide' }, 'dunkel Bedienungshilfen': { PRUEF_DARSTELLUNG: 'dark', PRUEF_BEDIENUNG: 'beide' },
    // Seit 3.35.0 (APD-43 Teil 2 P1): hig zusätzlich in den Textgrößen xS, XXXL, AX2 und AX5 (alle vier Ansichten, mit Drehen)
    'Text 14': { PRUEF_DARSTELLUNG: 'light', PRUEF_TEXT: '14' }, 'Text 23': { PRUEF_DARSTELLUNG: 'dark', PRUEF_TEXT: '23' },
    'Text 33': { PRUEF_DARSTELLUNG: 'light', PRUEF_TEXT: '33' }, 'Text 53': { PRUEF_DARSTELLUNG: 'dark', PRUEF_TEXT: '53' } } },
  { name: 'kontextmenue-regeln', teile: { iPad: { PRUEF_GERAET: 'iPad' }, iPhone: { PRUEF_GERAET: 'iPhone' } } }];
// Seit 3.35.0: Zeitgrenze je Test 600 s statt 300 – ablauf-blatt braucht allein schon 288 s (auch mit AppDesign 4.36.0 gemessen) und lief
// unter Volllast in WebKit über die Grenze
const argv = process.argv.slice(2), zeit = argv.includes('--zeit') ? [] : ['--zeit', '600'];
process.exit(await lauf({ dir: new URL('..', import.meta.url), pw, tests, argv: [...argv, ...zeit] }));
