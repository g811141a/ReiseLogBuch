# Tests

Alle Prüfungen des Reiselogbuchs; die allgemeinen Bausteine kommen aus der festen AppDesign-Fassung
(`../AppDesign/fassung/X.Y.Z/tests/`, Beschreibung in `AppDesign/tests/README.md`). Einrichten: AppDesign-`CLAUDE.md`.

## Aufruf

`node tests/alle.mjs` (oder `sh tests/alle.sh`) im Repo-Ordner startet alle Prüfungen **parallel**, die schnellsten zuerst, in
**Chromium und WebKit**, und bricht beim ersten roten Test ab (Rückgabewert 1, Fehlerzeilen des Tests werden gezeigt). `--alle` läuft
trotz Fehler weiter, `--browser chromium` prüft nur einen Browser, `--nur hig,tastatur` nur einzelne Tests, `--abdeckung` zeigt
Test × Ansicht, `--gegenprobe` bzw. `--gegenprobe grundregeln` beweist, dass jeder Test rot werden kann. Jeder Test meldet Fehler
mit Sollwert und Rückgabewert (`pruefe.mjs`) und prüft nach jedem Schritt die Grundregeln (dieselben Prüfungen wie `hig.mjs`).
Einzeln: `PRUEF_BROWSER=webkit node tests/ablauf-fenster.mjs`. Bildschirmfotos landen in `tests/out/` (nicht hochgeladen).

Bewusste Abweichungen (`README - Designrichtlinie Reiselogbuch.md` 1 und Designrichtlinie allgemein 16) stehen in den Prüfskripten
als `skipTargets` und werden nicht gezählt.

## Prüfungen

Die Spalte ‚prüft‘ nennt die Regel (R-… = Regelkatalog, Designrichtlinie allgemein 17) bzw. den Abschnitt der Funktionsbeschreibung
`PROMPT.md`.

| Datei | prüft | Inhalt |
|---|---|---|
| `hig.mjs` | Regelkatalog (alle mit ‚hig.mjs‘), HIG-Checkliste | alle Ansichten, quer und hoch, iPad und iPhone, hell und dunkel; Gerätevergleich iPad ↔ iPhone (R-1.1); Testdaten mit 100 × ‚a‘ (R-6.3); im Lauf geteilt nach Darstellung (`PRUEF_DARSTELLUNG`) |
| `regeln-ablauf.mjs` | R-2.3, R-4.4, R-5.2, R-5.3, R-5.6, R-6.4, R-10.1 | allgemeine Ablauf-Prüfungen (`ablauf.mjs`): Suche, Fenster-Kopfzeile, Großbuchstaben, Fehlermeldungen, ⓧ in Feldern (Titel, Teilnehmer, Ort, Quartier, Gesamtausgaben), Vorschau hell und dunkel; Feldnamen im Abgleichbericht wie im Fenster – iPad und iPhone |
| `ablauf-gesamt.mjs` | PROMPT 3, 4, 7, 9, 10 | Gesamtablauf: Reiselogbuch anlegen (leer, Pflichtfelder), Tage erfassen, Filter ‚Alle Tage‘, Darstellung, Menüs, Gesamtausgaben, Ausgabe |
| `ablauf-fenster.mjs` | R-4.4, PROMPT 3, 7, 9 | Fenster Tag, Einstellungen, Fazit; Häkchen und ‚Änderungen verwerfen‘ |
| `verlauf-vorschlaege.mjs` | PROMPT 7 | Vorschläge im Schritt Verlauf: Reihenfolge, eigene Zeile an der Cursorstelle, ‚Sonstiges …‘ setzt nur eine leere erste Zeile, danach groß weiter (Fall-Liste V1–V13) |
| `ablauf-suche-tabelle.mjs` | R-2.3, PROMPT 6 | Suche, Trefferanzeige und Springen in der Tabelle |
| `ablauf-suche-woerter.mjs` | R-2.3, PROMPT 6 | mehrere Wörter und „…“, Einheit = Reiselogbuch, gezeigt die Tage mit mindestens einem Wort (S1–S19, L1–L9); ohne Akzente (‚Zurich‘ → ‚Zürich‘, ‚cafe creme‘ → ‚Café Crème‘, A-1, A-3, A-5) |
| `ablauf-suche-liste.mjs` | R-2.3, PROMPT 6 | Suche über alle Reiselogbücher (`checkListSearch`) und die App-Fälle |
| `ablauf-suche-iphone.mjs` | R-2.1, R-2.3 | am iPhone stehen Kopf- und Suchzeile beim Tippen in der Suche fest – genau der gemessene Ablauf (P-57) |
| `ablauf-seitenleiste-kontextmenue.mjs` | R-4.2, PROMPT 4 | Seitenleiste, langes Drücken, Löschen-Abfrage |
| `ablauf-seitenleiste-position.mjs` | R-7.1, R-2.1 | Seitenleiste/Startliste behält ihre Position, gewählter Eintrag sichtbar; iPhone: erstes Wischen bei offener Suche schließt nur die Tastatur, die Seite bleibt stehen |
| `ablauf-markierung-menues.mjs` | R-3.3, R-4.1 | blaue Markierung bleibt, Menüs mit Strich und Speicher-Satz |
| `ablauf-iphone.mjs` | R-1.1, PROMPT 5 | iPhone-Ansicht: Startliste, Suche, Tag erfassen, Kontextmenü, Löschen, Wechsel iPhone ↔ iPad |
| `start-regeln.mjs` | R-7.2, PROMPT 3 | Start nach dem Neuladen (`start.mjs`): iPhone hoch/quer und iPad im schmalen Fenster in der Startliste ohne blauen Eintrag, iPad unverändert; Rückkehr aus dem Hintergrund, Drehen, Öffnen, Zurück, leere/lange Liste, Wechsel des Aufbaus, Backup laden – F-1 bis F-18 |
| `oeffnen-position.mjs` | R-7.4, R-8.1 | Position beim Öffnen auf iPad und iPhone, Seitenleiste ein/aus |
| `ablauf-liste-still.mjs` | R-7.3 | Liste steht nach dem Fenster ‚Tag‘ still – Start mit Lücke (erster fehlender Tag oben), Zeile oben, 3 tiefer, untere Hälfte, 2 px unter dem Kopf, nach 5× ‹ ›; Häkchen und x; Tastatur wie Safari (vv, resize, late, alle); iPad quer/hoch, iPhone hoch/quer |
| `tastatur.mjs` | R-4.5 | Fenster passt bei offener Tastatur in den sichtbaren Bereich, Kopfzeile sichtbar – iPad quer und hoch, iPhone hoch, hell und dunkel; Tastatur wie Safari über `visualViewport` |
| `ablauf-feld-tastatur.mjs` | R-4.5 | Gesamtausgaben an den unteren Rand rollen, antippen, Tastatur auf (Safari-Modell: iPhone quer Zifferntastatur 170 px sichtbar, Safari verschiebt den sichtbaren Bereich um 232 px; hoch 449 px) – `checkFieldVisible`: Feld ganz über der Tastatur, schon sichtbar rollt nichts, nach dem Schließen sichtbar, Seite rollt nie |
| `ablauf-tastatur-still.mjs` | R-4.5 | jedes Bild in allen vier Lagen (`checkTastaturStill`): Fenster ‚Ort‘ und Wechsel, Gesamtausgaben, Tastatur-Taste am iPad, ‚Nach oben‘ bei offener Tastatur, Wischen über das Feld, ein Reiselogbuch mit einem Tag |
| `ablauf-abspielen.mjs` | R-2.1, R-4.5 | jede Messdatei des Reiselogbuchs in `AppDesign/tests/messungen/` nachgespielt (`spieleAb`) – Kopf- und Suchzeile ± 1 px und Fokus wie gemessen, nach ‚tippen kosten‘ Gesamtausgaben über der Tastatur (F-11); Gegenprobe M-5 (um 20 px verschoben muss rot werden) |
| `ablauf-messung.mjs` | R-1.6 | Messmodus (`checkMessung`, F1–F12) – iPad quer, iPhone hoch und quer, hell und dunkel, viele Tage, leere App |
| `kapsel-iphone.mjs` | R-3.2 | Kapsel ‚Nach oben / Ans Ende‘ im iPhone-Aufbau (nicht in der Startliste), ohne Rollen ausgeblendet, iPad unverändert; bei offener Tastatur (hoch 409, quer 126 px) mit und ohne Suche: Kapsel schneidet keine Leiste, quer ausgeblendet, danach wieder da |
| `link-name.mjs` | PROMPT 8 | nur der Name ist der Maps-Link (Essen und Quartier; Ende an ‚ – ‘, Komma, Doppelpunkt, Klammer, nicht vor Ziffer) – Tabelle, Tageskästen, Vorschau, Suche |
| `ablauf-abgleich.mjs` | R-9.2 bis R-9.4 | Abgleich iPad ↔ iPhone über ein Backup: neuere Fassung je Tag, gelöschte und neue Reiselogbücher, Abfrage, Fenster mit ‚Abgleichbericht anzeigen‘ und Bericht |
| `ablauf-abgleich-faelle.mjs` | R-9.3 | alle Anwendungsfälle des Abgleichs mit den Daten des Reiselogbuchs |
| `ablauf-abgleich-ui.mjs` | R-9.2, R-9.3 | Abgleich über die echte Oberfläche (Fenster ‚Tag‘, Backup erstellen/laden), Fälle 8, 9, 9a–9c |
| `abgleich-regeln.mjs` | R-9.2 bis R-9.4 | allgemeine Abgleich-Prüfung (`abgleich.mjs`) |
| `backup-regeln.mjs` | R-9.1, R-9.2 | allgemeine Backup-Prüfung (`backup.mjs`) – iPad und iPhone, hell und dunkel |
| `kontextmenue-regeln.mjs` | R-4.2 | allgemeine Kontextmenü-Prüfung (`kontextmenue.mjs`) – 3 bis 12 Reisen, iPad und iPhone; im Lauf geteilt nach Gerät (`PRUEF_GERAET`) |
| `offline-regeln.mjs` | R-1.5 | Offline-Start und Offline-Hinweis (`offline.mjs`) mit echtem Service Worker – iPad und iPhone |
| `version-regeln.mjs` | R-10.3 | Versionskopplung (`version.mjs`): `index.html` und `sw.js` laden genau die feste Fassung, Hinweis bei älterer Fassung |
| `doku-regeln.mjs` | R-10.4, Katalog, Zusammenarbeit 2.3 | Doku-Prüfung (`doku.mjs`): README ‚Verwendete Versionen‘, Prüfliste beginnt mit /0; Regelkatalog vollständig (`checkCatalog`), Zusammenarbeit und App-Dateien (`checkCollab`) |
| `alle.mjs`, `alle.sh` | – | Liste aller Prüfungen für das Lauf-Werkzeug (`lauf.mjs`) bzw. Aufruf |
| `pixelvergleich.mjs` | – (Werkzeug) | 40 Ansichten pixelgenau gegen eine ältere Fassung (`_alt.html`); läuft nicht im vollen Lauf |
