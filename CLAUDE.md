# Reiselogbuch – Hinweise für Claude

**Version 3.10.0** · Stand 18.11.2026

## Zuerst lesen (gezielt, Zusammenarbeit 0 Nr. 15)

Die allgemeinen Regeln liegen im Design-Repo **AppDesign** (g811141a/AppDesign, lokal neben diesem Repo):

1. `AppDesign/UEBERGABE.md` – Stand der letzten Sitzung, nächster Schritt, Chatnummer
2. `AppDesign/README - Zusammenarbeit allgemein.md` – die ganze Datei; der Kasten ‚Immer‘ und ‚Jede Antwort‘ oben in
   Abschnitt 0 gilt ab der ersten Antwort
3. Überschriften (`grep -n '^##'`) von `AppDesign/README - Designrichtlinie allgemein.md` und
   `README - Designrichtlinie Reiselogbuch.md` (nur Abweichungen); einzelne Abschnitte erst, wenn die Aufgabe sie braucht
4. Nur bei Bedarf: `PROMPT.md` (Funktionsbeschreibung), `CHANGELOG.md` (Testfälle der neuesten Version oben), `BACKLOG.md`

## Verpflichtend

Es gelten die Zusammenarbeit allgemein und die AppDesign-`CLAUDE.md` (Arbeitsumgebung, Veröffentlichen) – hier keine
Wiederholung.

## App-spezifisch

- App: Reiselogbuch, Web-App (PWA) für iPad und iPhone: `index.html` plus `sw.js`, `manifest.json`, Icons. Was sie tut:
  `PROMPT.md`.
- Gemeinsame Bausteine aus der festen AppDesign-Fassung (R-10.3): `../AppDesign/fassung/X.Y.Z/design.css` und `ui.js` (in
  `index.html` und in der Dateiliste von `sw.js`), `AD_NEEDED` = X.Y.Z; die Prüfskripte binden
  `../../AppDesign/fassung/X.Y.Z/tests/…` ein. `index.html` enthält nur, was zum Reiselogbuch gehört – Gemeinsames wird in
  AppDesign geändert.
- Repo `g811141a/ReiseLogBuch`, Branch `main`, GitHub Pages: https://g811141a.github.io/ReiseLogBuch/
- Versionen: `node ../AppDesign/werkzeug/veroeffentlichen.mjs vorbereiten --app reiselogbuch=X.Y.Z` (mit `--ad`, wenn AppDesign
  mitkommt) erhöht `APP_VERSION`, `APP_BUILT`, Cache-Name, Fassungs-Pfad, README ‚Verwendete Versionen‘ (R-10.4),
  PROMPT-Versionszeile und Backlog-Kopf; CHANGELOG und Testfälle schreibt Claude, dann `… los`.
- Daten im localStorage unter `reiselogbuch.v1`; Änderungen am Datenmodell immer mit Übernahme alter Daten (`normalize`).
- Ausgabe (HTML/PDF) mit eigener, immer heller Gestaltung (`.rt`, Mustertabelle `outputCss`, R-6.2).
- Bedienung im Code: Seitenleiste `#side` (`renderSide`), Kopfzeile `.nb` mit Kapsel, Menüs `openMenu` (Untermenüs über
  `submenu`), Sprechblasen `confirmPop`, Fenster-Kopfzeile `dlgHead` (Häkchen blau über `dlgDirty`), gedrückte Schaltflächen
  `.on`; Seitenleiste ein/aus `settings.sidebar`; Darstellung `settings.appearance`; Abgleich `createSync`; Schnittstelle zu ui.js
  `db.settings.appearance`, `save()`, `render()`, `onDialogOpen()`.
- Prüfen: `node tests/alle.mjs` (oder `sh tests/alle.sh`) im Repo-Ordner – Ablauf und Stufen nach Zusammenarbeit 0 Nr. 2;
  Einrichten: AppDesign-`CLAUDE.md`; die Prüfungen: `tests/README.md`.

---

## Versionsgeschichte

Steht in `CLAUDE Versionsgeschichte.md` (neueste oben); jede neue Version bekommt dort eine Zeile.
