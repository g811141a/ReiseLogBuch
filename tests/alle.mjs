// Alle Prüfungen des Reiselogbuchs (seit 3.12.0, APD-5): parallel, die schnellsten zuerst, in Chromium und WebKit, Abbruch
// beim ersten Fehler – über das Lauf-Werkzeug aus AppDesign (tests/lauf.mjs). AppDesign muss neben dem Repo liegen.
// Aufruf im Repo-Ordner: node tests/alle.mjs [--alle] [--browser chromium] [--nur hig,tastatur] [--abdeckung]
// pixelvergleich.mjs läuft nicht mit (braucht _alt.html, Handwerkzeug).
import * as pw from 'playwright';
import { lauf } from '../../AppDesign/fassung/4.37.0/tests/lauf.mjs';
const tests = ['doku-regeln', 'ablauf-liste-still', 'version-regeln', 'offline-regeln', 'start-regeln', 'abgleich-regeln', 'ablauf-suche-tabelle', 'ablauf-suche-woerter', 'ablauf-suche-iphone', 'ablauf-messung', 'tastatur',
  'ablauf-abgleich', 'ablauf-seitenleiste-kontextmenue', 'ablauf-abgleich-faelle', 'ablauf-gesamt',
  'verlauf-vorschlaege', 'ablauf-markierung-menues', 'backup-regeln', 'ablauf-abgleich-ui', 'regeln-ablauf', 'link-name', 'kapsel-iphone', 'oeffnen-position', 'ablauf-feld-tastatur', 'ablauf-abspielen', 'ablauf-blatt', 'ablauf-smiley-leiste', 'ablauf-kapsel-pfeile', 'ablauf-backup-kachel', 'ablauf-bedienung',
  // Seit 3.33.0 (AppDesign APD-43 P1): die Abläufe mit Bewegung zusätzlich mit ‚Kontrast erhöhen‘ und ‚Bewegung reduzieren‘ (Bewegungswächter)
  ...['ablauf-navigation', 'ablauf-fenster', 'ablauf-iphone', 'ablauf-suche-liste', 'ablauf-seitenleiste-position'].map(name => ({ name, teile: { '': {}, Bedienungshilfen: { PRUEF_BEDIENUNG: 'beide' } } })),
  // Die zwei langen Prüfungen geteilt (APD-5/B-5): hig nach Darstellung (der Gerätevergleich R-1.1 bleibt je Teil vollständig),
  // das Kontextmenü nach Gerät.
  // Seit 3.33.0 (APD-43 P1): hig zusätzlich ‚hell/dunkel Bedienungshilfen‘ (alle vier Ansichten, 4,5 : 1 ohne Ausnahmen)
  { name: 'hig', teile: { hell: { PRUEF_DARSTELLUNG: 'light' }, dunkel: { PRUEF_DARSTELLUNG: 'dark' },
    'hell Bedienungshilfen': { PRUEF_DARSTELLUNG: 'light', PRUEF_BEDIENUNG: 'beide' }, 'dunkel Bedienungshilfen': { PRUEF_DARSTELLUNG: 'dark', PRUEF_BEDIENUNG: 'beide' } } },
  { name: 'kontextmenue-regeln', teile: { iPad: { PRUEF_GERAET: 'iPad' }, iPhone: { PRUEF_GERAET: 'iPhone' } } }];
process.exit(await lauf({ dir: new URL('..', import.meta.url), pw, tests }));
