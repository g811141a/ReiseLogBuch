# Reiselogbuch – Hinweise für Claude

**Version 3.5.0** · Stand 20.10.2026

## Zuerst lesen (gezielt, Zusammenarbeit 0 Nr. 15)

Die allgemeinen Regeln liegen im Design-Repo **AppDesign** (g811141a/AppDesign, lokal neben diesem Repo klonen):

1. `AppDesign/UEBERGABE.md` – Stand der letzten Sitzung, nächster Schritt, Chatnummer
2. `AppDesign/README - Zusammenarbeit allgemein.md` – nur Abschnitte 0 (Arbeitsprozess 2.0, hat Vorrang) und 1 (Sprache und Ton: per du)
3. Überschriften (`grep -n '^##'`) von `AppDesign/README - Designrichtlinie allgemein.md` (Komponenten 15, HIG-Checkliste 16,
   Regelkatalog 17) und `README - Designrichtlinie Reiselogbuch.md`; einzelne Abschnitte erst, wenn die Aufgabe sie braucht
4. Nur bei Bedarf: `PROMPT.md` (Funktionsbeschreibung), `CHANGELOG.md` (Prüfliste der neuesten Version oben), `BACKLOG.md`

## Verpflichtend

**Startfrage (Zusammenarbeit 0 Nr. 19):** Beginnt die Sitzung ohne konkreten Auftrag, zuerst das Auswahlfenster
‚Was möchtest du als Nächstes tun?‘ mit je einer Möglichkeit pro angehängtem Repo (Version, Backlog-Spitze).

Alle Regeln der Zusammenarbeit allgemein gelten; sie stehen nur dort (hier keine Wiederholung). Besonders: nie ohne
ausdrückliches ‚Ja‘ bauen, Fall-Liste vor jedem Bau (0 Nr. 1), kleine Versionen und Korrekturen sofort (0 Nr. 8),
erst Prüfpunkte dann Neues, Zeit und Token am Ende jeder Antwort (Abschnitt 2).

## App-spezifisch

- App: Reiselogbuch, Web-App (PWA) für iPad und iPhone: `index.html` plus `sw.js`, `manifest.json`, Icons.
- Gemeinsame Bausteine aus der festen AppDesign-Fassung (seit 3.13.0, R-10.3): `../AppDesign/fassung/X.Y.Z/design.css`
  und `../AppDesign/fassung/X.Y.Z/ui.js` (in `index.html` und in der Dateiliste von `sw.js`); `AD_NEEDED` in `index.html`
  = X.Y.Z; die Prüfskripte binden `../../AppDesign/fassung/X.Y.Z/tests/…` ein. Auf eine neuere Fassung nur nach Rückfrage
  heben (Zusammenarbeit 0 Nr. 10). Schnittstelle: `db.settings.appearance`, `save()`, `render()`,
  `onDialogOpen()`. `index.html` enthält nur, was zum Reiselogbuch gehört – Gemeinsames wird in AppDesign geändert,
  **erst AppDesign veröffentlichen, dann das Reiselogbuch.**
- Repo: `g811141a/ReiseLogBuch`, Branch `main`, GitHub Pages: https://g811141a.github.io/ReiseLogBuch/
- Bei jeder Version erhöht `node ../AppDesign/werkzeug/veroeffentlichen.mjs vorbereiten --app reiselogbuch=X.Y.Z` (mit
  `--ad`, wenn AppDesign mitkommt) `APP_VERSION`, `APP_BUILT`, Cache-Name, Fassungs-Pfad, README ‚Verwendete Versionen‘
  (R-10.4), PROMPT-Versionszeile und Backlog-Kopf; CHANGELOG und Prüfliste schreibt Claude, dann `… los`.
- Daten im localStorage unter `reiselogbuch.v1`; Änderungen am Datenmodell immer mit Übernahme alter Daten (`normalize`).
- Ausgabe (HTML/PDF) mit eigener, immer heller Gestaltung (`.rt`, Mustertabelle `outputCss`, R-6.2).
- Bedienung: Seitenleiste `#side` (`renderSide`), Kopfzeile `.nb` mit Kapsel, Menüs `openMenu` (Untermenüs über
  `submenu`), Sprechblasen `confirmPop`, Fenster-Kopfzeile `dlgHead` (Häkchen blau über `dlgDirty`), gedrückte
  Schaltflächen `.on`; Seitenleiste ein/aus `settings.sidebar`; Darstellung `settings.appearance`; Abgleich `createSync`.
- Prüfen: im Ordner `tests` einmalig `npm install playwright` (WebKit kommt über das Setup-Skript der Umgebung, sonst
  `npx playwright install webkit` und `npx playwright install-deps webkit`), dann im Repo-Ordner `node tests/alle.mjs`
  (oder `sh tests/alle.sh`): alle Prüfungen parallel in Chromium und WebKit, Abbruch beim ersten Fehler, `--alle` zeigt
  alle roten; Gegenprobe `--gegenprobe` (siehe `tests/README.md`, AppDesign `tests/README.md`). Während der Arbeit nur die
  betroffenen Prüfungen (`node tests/<datei>.mjs`); der volle Lauf genau einmal in `… los` (Zusammenarbeit 0 Nr. 2).

---

## Versionsgeschichte

| Version | Datum | Inhalt |
|---|---|---|
| 3.5.0 | 20.10.2026 | Zu Beginn Abschnitte 0 und 1 der Zusammenarbeit (Sprache und Ton: per du) – AppDesign Zusammenarbeit 2.14.0 |
| 3.4.0 | 16.10.2026 | Startfrage zu Beginn einer Sitzung ohne Auftrag (Zusammenarbeit 0 Nr. 19) |
| 3.3.0 | 15.10.2026 | Gezielt lesen (nur Abschnitt 0 und Überschriften), ein voller Prüflauf je Version (AppDesign A-07) |
| 3.2.0 | 14.10.2026 | Feste AppDesign-Fassung `fassung/X.Y.Z/` statt `v4/…?v=`, Versionen mit dem Veröffentlichungs-Skript (A-05 Version B) |
| 3.1.0 | 14.10.2026 | Prüfen mit `node tests/alle.mjs` (A-05 Version A: parallel, Chromium und WebKit) |
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
