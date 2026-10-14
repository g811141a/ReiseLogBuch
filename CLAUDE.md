# Reiselogbuch – Hinweise für Claude

**Version 3.0.0** · Stand 14.10.2026

## Zuerst lesen

Die allgemeinen Regeln liegen im Design-Repo **AppDesign** (g811141a/AppDesign, lokal neben diesem Repo klonen):

1. `AppDesign/UEBERGABE.md` – Stand der letzten Sitzung, nächster Schritt, Chatnummer
2. `AppDesign/README - Zusammenarbeit allgemein.md` – Abschnitt 0 (Arbeitsprozess 2.0) hat Vorrang
3. `AppDesign/README - Designrichtlinie allgemein.md` – Komponenten (15), HIG-Checkliste (16), Regelkatalog (17)
4. `README - Designrichtlinie Reiselogbuch.md` – nur Abweichungen und Ausprägungen
5. `PROMPT.md` – vollständige Funktionsbeschreibung der App
6. `CHANGELOG.md` (Prüfliste der neuesten Version oben) und `BACKLOG.md`

## Verpflichtend

Alle Regeln der Zusammenarbeit allgemein gelten; sie stehen nur dort (hier keine Wiederholung). Besonders: nie ohne
ausdrückliches ‚Ja‘ bauen, Fall-Liste vor jedem Bau (0 Nr. 1), kleine Versionen und Korrekturen sofort (0 Nr. 8),
erst Prüfpunkte dann Neues, Zeit und Token am Ende jeder Antwort (Abschnitt 2).

## App-spezifisch

- App: Reiselogbuch, Web-App (PWA) für iPad und iPhone: `index.html` plus `sw.js`, `manifest.json`, Icons.
- Gemeinsame Bausteine aus AppDesign: `../AppDesign/v4/design.css?v=<AppDesign-Version>` und
  `../AppDesign/v4/ui.js?v=<AppDesign-Version>` (in `index.html` und in der Dateiliste von `sw.js`, R-10.3);
  `AD_NEEDED` in `index.html` nennt dieselbe Version. Schnittstelle: `db.settings.appearance`, `save()`, `render()`,
  `onDialogOpen()`. `index.html` enthält nur, was zum Reiselogbuch gehört – Gemeinsames wird in AppDesign geändert,
  **erst AppDesign veröffentlichen, dann das Reiselogbuch.**
- Repo: `g811141a/ReiseLogBuch`, Branch `main`, GitHub Pages: https://g811141a.github.io/ReiseLogBuch/
- Bei jeder Version: `APP_VERSION` und `APP_BUILT` (Europe/Berlin, „TT.MM.JJJJ um hh:mm“) in `index.html`, Cache-Name
  `reiselogbuch-X.Y.Z` in `sw.js`, README ‚Verwendete Versionen‘ (R-10.4), Versionszeile in PROMPT.md und CHANGELOG.
- Daten im localStorage unter `reiselogbuch.v1`; Änderungen am Datenmodell immer mit Übernahme alter Daten (`normalize`).
- Ausgabe (HTML/PDF) mit eigener, immer heller Gestaltung (`.rt`, Mustertabelle `outputCss`, R-6.2).
- Bedienung: Seitenleiste `#side` (`renderSide`), Kopfzeile `.nb` mit Kapsel, Menüs `openMenu` (Untermenüs über
  `submenu`), Sprechblasen `confirmPop`, Fenster-Kopfzeile `dlgHead` (Häkchen blau über `dlgDirty`), gedrückte
  Schaltflächen `.on`; Seitenleiste ein/aus `settings.sidebar`; Darstellung `settings.appearance`; Abgleich `createSync`.
- Prüfen: im Ordner `tests` einmalig `npm install playwright`, dann im Repo-Ordner `sh tests/alle.sh` (alle Ablauf-Tests,
  Regel- und HIG-Prüfung; siehe `tests/README.md`).

---

## Versionsgeschichte

| Version | Datum | Inhalt |
|---|---|---|
| 3.0.0 | 14.10.2026 | Neu gefasst (A-02 Schritt 4): zuerst UEBERGABE.md, Regeln nur als Verweis auf AppDesign (ohne ‚etwa 5 Punkte‘, Antwortzeile und ‚Gesamt‘ in der Zeitzeile), Einbindung mit `?v=`, Prüfung mit `sh tests/alle.sh` |
| 2.1.0 | 10.10.2026 | Pflicht: Zeitmessung je Aktion |
| 2.0.0 | 09.10.2026 | Allgemeine Regeln und Bausteine im Design-Repo AppDesign |
| 1.7.0 | 09.10.2026 | Verpflichtend: erst Prüfpunkte, dann Neues; Auswahlfenster immer wieder |
| 1.6.0 | 09.10.2026 | Pflicht: Antwortvorschläge im Auswahlfenster und als Antwortzeile |
| 1.5.1 | 09.10.2026 | Darstellung `settings.appearance`, HIG-Prüfskript |
| 1.5.0 | 09.10.2026 | Pflicht: Apple-Abgleich vor Mustern, Apple-Review nach Versionen |
| 1.4.0 | 09.10.2026 | Verpflichtend: Sammelversionen |
| 1.3.0 | 08.10.2026 | Verpflichtend: nie ohne Freigabe bauen |
| 1.2.0 | 08.10.2026 | BACKLOG.md in die Liste „Zuerst lesen“ |
| 1.1.0 | 08.10.2026 | Hinweise zur Bedienung ab Reiselogbuch 2.0.0 |
| 1.0.0 | 07.10.2026 | erste Fassung |
