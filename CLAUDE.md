# Reiselogbuch – Hinweise für Claude

**Version 3.8.0** · Stand 26.10.2026

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
- Prüfen: `node tests/alle.mjs` (oder `sh tests/alle.sh`) im Repo-Ordner – alle Prüfungen parallel in Chromium und WebKit, Abbruch
  beim ersten Fehler, `--alle` zeigt alle roten, Gegenprobe `--gegenprobe`; Einrichten: AppDesign-`CLAUDE.md`; die Prüfungen:
  `tests/README.md`.

---

## Versionsgeschichte

| Version | Datum | Inhalt |
|---|---|---|
| 3.8.0 | 26.10.2026 | AppDesign APD-84: zu Beginn die ganze Zusammenarbeit (Kasten ‚Jede Antwort‘) |
| 3.7.0 | 25.10.2026 | AppDesign APD-78 Nummernschema: Themen RLB-n, Usertest, Testfälle P-n, Testfall-Liste |
| 3.6.0 | 21.10.2026 | AppDesign APD-39 Konsolidierung: Verpflichtendes und Einrichten der Tests nur noch in der Zusammenarbeit bzw. der AppDesign-`CLAUDE.md`; App-Richtlinie enthält nur Abweichungen |
| 3.5.0 | 20.10.2026 | Zu Beginn Abschnitte 0 und 1 der Zusammenarbeit (Sprache und Ton: per du) – AppDesign Zusammenarbeit 2.14.0 |
| 3.4.0 | 16.10.2026 | Startfrage zu Beginn einer Sitzung ohne Auftrag (Zusammenarbeit 0 Nr. 19) |
| 3.3.0 | 15.10.2026 | Gezielt lesen (nur Abschnitt 0 und Überschriften), ein voller Prüflauf je Version (AppDesign APD-7) |
| 3.2.0 | 14.10.2026 | Feste AppDesign-Fassung `fassung/X.Y.Z/` statt `v4/…?v=`, Versionen mit dem Veröffentlichungs-Skript (APD-5 Version B) |
| 3.1.0 | 14.10.2026 | Prüfen mit `node tests/alle.mjs` (APD-5 Version A: parallel, Chromium und WebKit) |
| 3.0.0 | 14.10.2026 | Neu gefasst (APD-2 Schritt 4): zuerst UEBERGABE.md, Regeln nur als Verweis auf AppDesign (ohne ‚etwa 5 Punkte‘, Antwortzeile und ‚Gesamt‘ in der Zeitzeile), Einbindung mit `?v=`, Prüfung mit `sh tests/alle.sh` |
| 2.1.0 | 10.10.2026 | Pflicht: Zeitmessung je Aktion |
| 2.0.0 | 09.10.2026 | Allgemeine Regeln und Bausteine im Design-Repo AppDesign |
| 1.7.0 | 09.10.2026 | Verpflichtend: erst Usertests, dann Neues; Auswahlfenster immer wieder |
| 1.6.0 | 09.10.2026 | Pflicht: Antwortvorschläge im Auswahlfenster und als Antwortzeile |
| 1.5.1 | 09.10.2026 | Darstellung `settings.appearance`, HIG-Prüfskript |
| 1.5.0 | 09.10.2026 | Pflicht: Apple-Abgleich vor Mustern, Apple-Review nach Versionen |
| 1.4.0 | 09.10.2026 | Verpflichtend: Sammelversionen |
| 1.3.0 | 08.10.2026 | Verpflichtend: nie ohne Freigabe bauen |
| 1.2.0 | 08.10.2026 | BACKLOG.md in die Liste „Zuerst lesen“ |
| 1.1.0 | 08.10.2026 | Hinweise zur Bedienung ab Reiselogbuch 2.0.0 |
| 1.0.0 | 07.10.2026 | erste Fassung |
