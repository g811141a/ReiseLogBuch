# Tests

## HIG-Prüfskript `hig.mjs`

Geht alle Ansichten des Reiselogbuchs durch und misst sie mit der HIG-Prüfung aus AppDesign
(`AppDesign/tests/hig.mjs`, Designrichtlinie allgemein Abschnitt 16):
Antippflächen, Schriftgrößen, Kontraste (hell und dunkel), doppelte Anführungszeichen, Löschen am
Ende von Menüs und ob die auslösende Schaltfläche blau bleibt – in allen Ansichten, quer und hoch, auf dem iPad und dem iPhone.
Bewusste Abweichungen (Abschnitt 16) werden nicht gezählt.

```
# AppDesign neben diesem Repo klonen (../AppDesign)
cd tests && npm install playwright   # einmalig (node_modules wird nicht hochgeladen)
node tests/hig.mjs                   # im Repo-Ordner; Ergebnis: Abweichungsliste
```

Claude lässt das Skript bei jeder Version laufen und nennt das Ergebnis im Apple-Review.

## Ablauf-Tests

**Seit 3.12.0 (A-05):** `node tests/alle.mjs` (oder `sh tests/alle.sh`) startet alle Prüfungen **parallel**, die schnellsten
zuerst, in **Chromium und WebKit**, und bricht beim ersten roten Test ab (Rückgabewert 1, Fehlerzeilen des Tests werden
gezeigt). `--alle` läuft trotz Fehler weiter, `--browser chromium` prüft nur einen Browser, `--nur hig,tastatur` nur
einzelne Tests, `--abdeckung` zeigt Test × Ansicht, `--gegenprobe` bzw. `--gegenprobe grundregeln` beweist, dass jeder Test
rot werden kann. Jeder Test meldet Fehler mit Sollwert und Rückgabewert (`AppDesign/tests/pruefe.mjs`) und prüft nach jedem
Schritt die Grundregeln (dieselben Prüfungen wie `hig.mjs`). Einzeln: `PRUEF_BROWSER=webkit node tests/ablauf-fenster.mjs`.
`pixelvergleich.mjs` läuft nicht mit (braucht `_alt.html`).

| Datei | prüft |
|---|---|
| `ablauf-gesamt.mjs` | Gesamtablauf: Reiselogbuch anlegen, Tage erfassen, Darstellung, Menüs, Ausgabe |
| `ablauf-suche-tabelle.mjs` | Suche, Trefferanzeige und Springen in der Tabelle |
| `ablauf-fenster.mjs` | Fenster (Tag, Einstellungen, Fazit), Häkchen und ‚Änderungen verwerfen‘ |
| `ablauf-seitenleiste-kontextmenue.mjs` | Seitenleiste, langes Drücken, Löschen-Abfrage |
| `ablauf-seitenleiste-position.mjs` | Seitenleiste/Startliste behält ihre Position, gewählter Eintrag sichtbar; iPhone: erstes Wischen bei offener Suche schließt nur die Tastatur, die Seite bleibt stehen (R-2.1) |
| `ablauf-abgleich.mjs` | Abgleich iPad ↔ iPhone über ein Backup: neuere Fassung je Tag, gelöschte und neue Reiselogbücher, Abfrage, Fenster mit ‚Abgleichbericht anzeigen‘ und Bericht (T-03, R-9.4) |
| `ablauf-abgleich-faelle.mjs` | alle Anwendungsfälle des Abgleichs mit den Daten des Reiselogbuchs |
| `abgleich-regeln.mjs` | allgemeine Abgleich-Prüfung (`AppDesign/tests/abgleich.mjs`, R-9.2 bis R-9.4) |
| `start-regeln.mjs` | Start nach dem Neuladen (R-7.2, seit 3.15.0, T-84): iPhone hoch/quer und iPad im schmalen Fenster in der Startliste ohne blauen Eintrag, iPad unverändert; Rückkehr aus dem Hintergrund, Drehen, Öffnen, Zurück, leere/lange Liste, Wechsel des Aufbaus, Backup laden – F-1 bis F-18 (`AppDesign/tests/start.mjs`) |
| `backup-regeln.mjs` | allgemeine Backup-Prüfung (`AppDesign/tests/backup.mjs`, R-9.1, R-9.2) – iPad und iPhone, hell und dunkel |
| `ablauf-abgleich-ui.mjs` | Abgleich über die echte Oberfläche (Fenster ‚Tag‘, Backup erstellen/laden), Fälle 8, 9, 9a–9c |
| `version-regeln.mjs` | Versionskopplung mit AppDesign (`AppDesign/tests/version.mjs`, R-10.3): `?v=` in index.html und sw.js, Hinweis bei älterer Fassung |
| `doku-regeln.mjs` | Doku-Prüfung (`AppDesign/tests/doku.mjs`, R-10.4, Zusammenarbeit 7): README ‚Verwendete Versionen‘, Prüfliste beginnt mit /0; Regelkatalog vollständig (`checkCatalog`) |
| `kontextmenue-regeln.mjs` | allgemeine Kontextmenü-Prüfung (`AppDesign/tests/kontextmenue.mjs`, R-4.2) – 3 bis 12 Reisen, iPad und iPhone; im Lauf geteilt nach Gerät (`PRUEF_GERAET`) |
| `ablauf-markierung-menues.mjs` | blaue Markierung bleibt, Menüs mit Strich und Speicher-Satz |
| `ablauf-iphone.mjs` | iPhone-Ansicht: Startliste, Suche unten, Tag erfassen, Kontextmenü, Löschen, Wechsel iPhone ↔ iPad |
| `regeln-ablauf.mjs` | allgemeine Ablauf-Prüfungen (`AppDesign/tests/ablauf.mjs`, seit 3.11.5): Suche R-2.3, Fenster-Kopfzeile R-4.4, Großbuchstaben R-5.2, Fehlermeldungen R-5.3, Vorschau R-6.4 hell und dunkel; Feldnamen im Abgleichbericht wie im Fenster (R-10.1) – iPad und iPhone |
| `tastatur.mjs` | Fenster passt bei offener Tastatur in den sichtbaren Bereich, Kopfzeile sichtbar – iPad quer und hoch, iPhone hoch, hell und dunkel; Tastatur seit 3.12.0 wie Safari über `visualViewport` nachgebildet |
| `alle.mjs` | Liste aller Prüfungen für das Lauf-Werkzeug (`AppDesign/tests/lauf.mjs`) |
| `pixelvergleich.mjs` | 40 Ansichten pixelgenau gegen eine ältere Fassung (`_alt.html`) |
| `hig.mjs` | HIG- und Regel-Prüfung (mit `AppDesign/tests/hig.mjs`, Regelkatalog R-1.1 bis R-10.4, Gerätevergleich iPad ↔ iPhone, Testdaten mit 100 × ‚a‘); im Lauf geteilt nach Darstellung (`PRUEF_DARSTELLUNG`) |

Bildschirmfotos landen in `tests/out/` (nicht hochgeladen).
