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

`sh tests/alle.sh` führt alle Tests nacheinander aus (Ergebnis: `ERR []` = keine Skriptfehler).

| Datei | prüft |
|---|---|
| `ablauf-gesamt.mjs` | Gesamtablauf: Reiselogbuch anlegen, Tage erfassen, Darstellung, Menüs, Ausgabe |
| `ablauf-suche-tabelle.mjs` | Suche, Trefferanzeige und Springen in der Tabelle |
| `ablauf-fenster.mjs` | Fenster (Tag, Einstellungen, Fazit), Häkchen und ‚Änderungen verwerfen‘ |
| `ablauf-seitenleiste-kontextmenue.mjs` | Seitenleiste, langes Drücken, Löschen-Abfrage |
| `ablauf-seitenleiste-position.mjs` | Seitenleiste/Startliste behält ihre Position, gewählter Eintrag sichtbar; iPhone: erstes Wischen bei offener Suche schließt nur die Tastatur, die Seite bleibt stehen (R-05) |
| `ablauf-abgleich.mjs` | Abgleich iPad ↔ iPhone über ein Backup: neuere Fassung je Tag, gelöschte und neue Reiselogbücher, Abfrage und Ergebnis (T-03) |
| `ablauf-abgleich-faelle.mjs` | alle Anwendungsfälle des Abgleichs mit den Daten des Reiselogbuchs |
| `abgleich-regeln.mjs` | allgemeine Abgleich-Prüfung (`AppDesign/tests/abgleich.mjs`, R-41 bis R-44) |
| `backup-regeln.mjs` | allgemeine Backup-Prüfung (`AppDesign/tests/backup.mjs`, R-45, R-46) – iPad und iPhone, hell und dunkel |
| `ablauf-markierung-menues.mjs` | blaue Markierung bleibt, Menüs mit Strich und Speicher-Satz |
| `ablauf-iphone.mjs` | iPhone-Ansicht: Startliste, Suche unten, Tag erfassen, Kontextmenü, Löschen, Wechsel iPhone ↔ iPad |
| `tastatur.mjs` | Fenster und Kopfzeilen bei sichtbarer Tastatur |
| `pixelvergleich.mjs` | 40 Ansichten pixelgenau gegen eine ältere Fassung (`_alt.html`) |
| `hig.mjs` | HIG- und Regel-Prüfung (mit `AppDesign/tests/hig.mjs`, Regelkatalog R-01 bis R-37, Gerätevergleich iPad ↔ iPhone, Testdaten mit 100 × ‚a‘) |

Bildschirmfotos landen in `tests/out/` (nicht hochgeladen).
