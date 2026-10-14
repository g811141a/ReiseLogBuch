// Alle Prüfungen des Reiselogbuchs (seit 3.12.0, A-05): parallel, die schnellsten zuerst, in Chromium und WebKit, Abbruch
// beim ersten Fehler – über das Lauf-Werkzeug aus AppDesign (tests/lauf.mjs). AppDesign muss neben dem Repo liegen.
// Aufruf im Repo-Ordner: node tests/alle.mjs [--alle] [--browser chromium] [--nur hig,tastatur] [--abdeckung]
// pixelvergleich.mjs läuft nicht mit (braucht _alt.html, Handwerkzeug).
import * as pw from 'playwright';
import { lauf } from '../../AppDesign/fassung/4.14.0/tests/lauf.mjs';
const tests = ['doku-regeln', 'version-regeln', 'abgleich-regeln', 'ablauf-fenster', 'ablauf-suche-tabelle', 'tastatur',
  'ablauf-abgleich', 'ablauf-seitenleiste-kontextmenue', 'ablauf-abgleich-faelle', 'ablauf-seitenleiste-position', 'ablauf-gesamt',
  'ablauf-iphone', 'ablauf-markierung-menues', 'backup-regeln', 'ablauf-abgleich-ui', 'regeln-ablauf',
  // Die zwei langen Prüfungen geteilt (B-5): hig nach Darstellung (der Gerätevergleich R-1.1 bleibt je Teil vollständig),
  // das Kontextmenü nach Gerät.
  { name: 'hig', teile: { hell: { PRUEF_DARSTELLUNG: 'light' }, dunkel: { PRUEF_DARSTELLUNG: 'dark' } } },
  { name: 'kontextmenue-regeln', teile: { iPad: { PRUEF_GERAET: 'iPad' }, iPhone: { PRUEF_GERAET: 'iPhone' } } }];
process.exit(await lauf({ dir: new URL('..', import.meta.url), pw, tests }));
