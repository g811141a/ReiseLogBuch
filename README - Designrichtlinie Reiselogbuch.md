# Designrichtlinie Reiselogbuch

**Version 3.39.0** · Stand 30.10.2026

> **Es gilt die Designrichtlinie allgemein aus AppDesign (Version 4.41.0)** – die Komponenten kommen fertig aus der festen
> AppDesign-Fassung (`fassung/X.Y.Z/design.css` und `ui.js`). Hier stehen nur die **Abweichungen**: was das Reiselogbuch bewusst
> anders macht als dort, mit Grund und Datum der Entscheidung (Designrichtlinie allgemein 12). Alles andere Reiselogbuch-Eigene –
> Begriffe, Texte, Menüs, Leertexte, Ausgestaltung der Komponenten – steht in der Funktionsbeschreibung `PROMPT.md`.

---

## 1. Abweichungen

| Nr. | Was | allgemein gilt | Grund | Prüfung | Entschieden |
|---|---|---|---|---|---|
| 1 | Maps-Links der Lokale in der Spalte ‚Essen und Trinken‘ nur so hoch wie der Text (ca. 19 px) – auf dem iPhone auch in den Tageskästen; Quartier-Links haben die unsichtbare Antippfläche von 44 px | Antippfläche 44 pt, kleine Links unsichtbar größer (R-3.1, HIG 1) | mehr Zeilenabstand in der Tabelle nicht gewünscht; im Kasten würde eine größere Fläche das Antippen des Tages behindern | `hig.mjs` zählt sie nicht (`skipTargets` `.ln:not(.q) a` in den Prüfskripten) | 09.10.2026 · iPhone 10.10.2026 |
| 2 | Wetter-Symbole in der Tageserfassung auf dem iPhone 40 px breit (in der Kapsel, über dem Minimum von 28 pt) – seit 3.35.0 nur bei Standard; bei größerer Schrift wachsen sie (R-1.10) und die Kapsel wischt seitlich | Icon- und Emoji-Schaltflächen 44 × 44 (4, R-3.1) | alle sieben passen ohne Wischen | `hig.mjs` (Kapsel ab 28) | 10.10.2026 |
| 3 | Tagestabelle der Ausgabe mit festen Spaltenanteilen: ‚Tag‘ so schmal wie das Datum, Verlauf und ‚Wie war was?‘ je 28, Essen und Quartier je 22 – unabhängig von der Textmenge, die letzten beiden Spalten gleich breit; fehlt eine Spalte, teilen sich die übrigen den Platz im selben Verhältnis | Spaltenbreiten passen sich dem Inhalt an (9) | Entscheidung des Nutzers mit 3.11.6 (gilt nur für das Reiselogbuch, nicht allgemein) | Sicht | 14.10.2026 |

## 2. Abgleich – Feldnamen

Es gelten R-9.2 bis R-9.4 und die Fall-Tabelle der Designrichtlinie allgemein (15.18); wie das Reiselogbuch Einträge, Tage und
Kopfdaten abbildet, steht in `PROMPT.md` (Sicherheit). Die Feldnamen stehen hier, weil die Prüfung sie mit der App vergleicht
(R-10.1, `doku.mjs`). Feldnamen im Abgleichbericht (`labels`): Reisetitel, Reiseteilnehmer, Beginn, Ende, Reisemittel, Quartierliste, Spalte Essen, Spalte Wie war was?, Spalte Quartier, Fazit, Gesamtausgaben; je Tag Wetter, Verlauf, Wie war was?, Essen und Trinken, Quartier, Ort, Quartier wie Vortag, Google-Maps-Link.

---

## Versionsgeschichte

| Version | Datum | Art | Inhalt |
|---|---|---|---|
| 3.39.0 | 30.10.2026 | Neben | AppDesign 4.41.0 (APD-81, R-5.6: das ⓧ auch in den mehrzeiligen Feldern Verlauf, ‚Wie war was?‘, Essen und Trinken, Fazit; Rückgängig nach dem ⓧ in allen Feldern) – keine Abweichung im Reiselogbuch |
| 3.38.0 | 29.10.2026 | Neben | AppDesign 4.40.0 (APD-86, R-5.4: die Zeile ‚Reisemittel‘ im Kopf ist am iPhone eine Wischzeile mit Verlauf und Pfeilen; APD-77, R-1.6: ‚Messung starten‘ erst nach langem Drücken auf die Versionszeile) |
| 3.37.0 | 26.10.2026 | Neben | AppDesign 4.39.0 (APD-83, R-4.6: ein offenes Fenster ändert durch Eingaben weder Breite noch Lage; APD-84 Regelwerk) – keine Abweichung neu |
| 3.36.0 | 26.10.2026 | Neben | AppDesign 4.38.0 (APD-72, R-4.6 am iPad: Fenster nach unten ziehen; RLB-103 Prüfung `ablauf-tastatur-still` im vollen Lauf) – keine Abweichung neu |
| 3.35.0 | 25.10.2026 | Neben | AppDesign 4.37.0 (APD-43 Teil 2, R-1.10 Textgröße; RLB-101): Abweichung 2 (Wetter 40 px) gilt nur noch bei Standard; ab AX1 am iPad die Tage als Kästen wie am iPhone |
| 3.34.0 | 25.10.2026 | Neben | AppDesign 4.36.0 (APD-78 Nummernschema, APD-79): keine eigene Abweichung – Nummern und Begriffe nach Zusammenarbeit 2.4 (RLB-n, Usertest, Testfall-Liste) |
| 3.33.0 | 25.10.2026 | Neben | AppDesign 4.35.0 (APD-43 Teil 1, RLB-100): keine eigene Abweichung – Barrierefreiheit (R-1.8 VoiceOver, R-1.9 ‚Kontrast erhöhen‘ und ‚Bewegung reduzieren‘, R-4.7 Hardware-Tastatur), Fokus-Rahmen nur mit Tastatur, Textfelder nie (R-3.4); Fehlermeldungen über `feldFehler`, Ansagen der Suche und der Seitenleiste |
| 3.32.0 | 24.10.2026 | Neben | AppDesign 4.34.0 (APD-74): keine eigene Abweichung – Backup-Kachel nur, solange heute noch kein Backup erstellt wurde (R-9.1), Offline-Zeile auch ohne Kachel und bei leerer Liste (R-1.5); die Liste wird um 0:00 neu gezeichnet (RLB-105) |
| 3.31.0 | 24.10.2026 | Neben | AppDesign 4.33.0 (APD-75, APD-76): keine eigene Abweichung – Pfeile am Rand der Auswahl-Kapsel (R-5.4; Wetter bleibt bei 40 px je Eintrag), Ziehen der Smiley-Leiste ist kein langes Drücken (R-3.5) |
| 3.30.2 | 24.10.2026 | Korrektur | AppDesign 4.32.2 (APD-73): keine eigene Abweichung – Zug erst nach oben schließt die Tastatur (R-4.6), Abstand über dem Feld mit Fokus für Umrandung und Schatten (R-4.5) |
| 3.30.1 | 24.10.2026 | Korrektur | AppDesign 4.32.1 (APD-71): keine eigene Abweichung – Ziehen auf einem Feld bei offener Tastatur zieht das Blatt (R-4.6) |
| 3.30.0 | 23.10.2026 | Neben | AppDesign 4.32.0 (APD-61 Teil 2, APD-69): keine eigene Abweichung – Fenster auf dem iPhone als Blatt (R-4.6); Startposition mit heute ohne Gelb und Zukunft ganz oben nach R-7.4 (PROMPT.md 4) |
| 3.29.0 | 23.10.2026 | Neben | AppDesign 4.31.0 (APD-68, APD-64, APD-65): keine eigene Abweichung – Seitenleiste am iPad quer per Wischen (R-7.5), keine doppelten Leerzeichen und keine erzwungene Großschreibung nach einer Korrektur von Hand (R-5.2) |
| 3.28.2 | 23.10.2026 | Korrektur | AppDesign 4.30.2 (APD-67): keine eigene Abweichung – Zurückwischen bricht nicht mehr ab (R-7.5, 13) |
| 3.28.1 | 22.10.2026 | Korrektur | AppDesign 4.30.1 (APD-67 Schritt 1, APD-66): keine eigene Abweichung – der Messmodus zeichnet Berührungen und Gesten-Entscheidungen auf (15.21) |
| 3.28.0 | 22.10.2026 | Neben | AppDesign 4.30.0 (APD-37 B+C, APD-61 Teil 1): keine eigene Abweichung – Kapsel mit wirksamen Pfeilen, Schnellroll-Griff (Marken in PROMPT.md 4), Seitenwechsel und Gesten nach R-3.2 und R-7.5 |
| 3.27.0 | 22.10.2026 | Neben | AppDesign 4.29.0 (APD-63): keine eigene Abweichung – sichere Ränder, Suche ohne Akzente, ⓧ in Feldern und Safaris Schalter gelten wie in der Designrichtlinie allgemein |
| 3.26.2 | 21.10.2026 | Korrektur | **AppDesign APD-39 Konsolidierung:** die Richtlinie enthält nur noch die Abweichungen (Nutzer 21.10.2026, APD-39/F-5) – Maps-Links der Lokale 19 px, Wetter am iPhone 40 px, feste Spaltenanteile der Ausgabe (bisher unter Ausgabe als Ausprägung, ‚derzeit keine Abweichungen‘ war überholt) – und die Feldnamen des Abgleichberichts; alle Ausprägungen (bisher 1 Begriffe, 2 Icons und Emojis, 3 Hauptansicht, 3a iPhone, 4 Tageserfassung, 5 Abfragen, 6 Neues Reiselogbuch / Einstellungen, 7 Ausgabe) stehen jetzt in `PROMPT.md`; ‚Nach oben / Ans Ende auch am iPhone‘ ist allgemeine Abweichung (Designrichtlinie allgemein 16). Überholt und berichtigt: Meldung bei überschneidendem Zeitraum (‚Wähle einen Zeitraum, der sich nicht mit … überschneidet.‘), Startreise (zuerst die zuletzt verwendete), Bausteine aus der festen Fassung statt `v4/` |
| 3.26.1 | 21.10.2026 | Korrektur | angepasst an allgemein 4.28.1 (APD-36, R-4.5, R-2.4): Tastatur ohne Springen – Felder rollen beim Antippen in die obere Hälfte, Leisten und Fenster stehen still; iPhone quer niedrige Leisten (32 px); `ablauf-tastatur-still.mjs` erweitert |
| 3.26.0 | 20.10.2026 | Neben | angepasst an allgemein 4.28.0 (APD-35, R-4.5): Gesamtausgaben steht bei offener Tastatur ganz sichtbar über ihr; APD-31 die Messung iPhone quer läuft als Prüfung mit |
| 3.25.1 | 19.10.2026 | Korrektur | angepasst an allgemein 4.27.1 (APD-33, R-3.2): die Kapsel ‚Nach oben / Ans Ende‘ überdeckt nie Kopf- oder Suchzeile, am iPhone quer mit offener Tastatur ausgeblendet |
| 3.25.0 | 19.10.2026 | Neben | angepasst an allgemein 4.27.0 (APD-28 Umbau B, 15.22; APD-29, R-2.3): der Inhalt (Tage, Fazit, Quartierliste, Statistik) liegt im Rollbereich unter Kopf- und Suchzeile, der Tabellenkopf haftet mit `top: 0`; Lupe und ⓧ rollen nach oben; Messmodus-Teil `tag` statt `inh` (die Spalte `inh` kommt jetzt aus AppDesign) |
| 3.24.0 | 19.10.2026 | Neben | angepasst an allgemein 4.26.0 (Messmodus R-1.6, 15.21): ‚Messung starten‘ im Mehr-Menü der Seitenleiste bzw. Startliste – gemessen werden Kopf- und Suchzeile von Reiselogbuch und Liste, der erste Tag und der Rollstand der Liste |
| 3.23.1 | 19.10.2026 | Korrektur | angepasst an allgemein 4.25.1 (Suchfeld bleibt beim Tippen, R-2.3; Markierung bei Icons als Kreis, R-3.1) – im Reiselogbuch keine eigene Regel |
| 3.23.0 | 18.10.2026 | Neben | Suche mit mehreren Wörtern: Einheit = Reiselogbuch (RLB-93); angepasst an allgemein 4.25.0 (R-2.3 mehrere Wörter und „…“, Lupe am Ende der Kapsel) |
| 3.22.0 | 18.10.2026 | Neben | Verlauf: Vorschläge ‚Tour …‘ und ‚Sonstiges …‘ (leere erste Zeile, RLB-94); angepasst an allgemein 4.24.0 (R-7.3 Hervorhebung 2 s + 1 s) |
| 3.21.2 | 18.10.2026 | Korrektur | Angepasst an allgemein 4.23.2 (R-7.3 Liste steht still – auch nach ‹ ›, P-52/2–4); keine eigene Abweichung |
| 3.21.1 | 18.10.2026 | Korrektur | Angepasst an allgemein 4.23.1 (R-7.3 Liste steht still, auch mit Tastatur – P-51/5); keine eigene Abweichung |
| 3.21.0 | 17.10.2026 | Neben | Angepasst an allgemein 4.23.0 (R-2.3 Suche in der zentralen Liste, RLB-92 / APD-19); keine eigene Änderung |
| 3.20.1 | 17.10.2026 | Korrektur | Angepasst an allgemein 4.21.1 (R-8.1 am Ende der Seite); keine eigene Änderung |
| 3.20.0 | 17.10.2026 | Neben | Angepasst an allgemein 4.21.0 (R-7.4 Position beim Öffnen, R-8.1 Seitenleiste ein/aus); keine eigene Änderung |
| 3.19.0 | 17.10.2026 | Neben | Angepasst an allgemein 4.20.0 (R-3.2: Kapsel ‚Nach oben / Ans Ende‘ auch auf dem iPhone); HIG-Abweichung eingetragen |
| 3.18.0 | 17.10.2026 | Neben | Abschnitt 2: Maps-Link endet an ‚ – ‘, Komma, Doppelpunkt oder Klammer, nicht vor einer Ziffer (RLB-86) |
| 3.17.0 | 17.10.2026 | Neben | Angepasst an allgemein 4.19.0 (R-5.5 Eingabetaste: Gesamtausgaben, Fenster ‚Tag‘ und ‚Einstellungen‘); keine eigene Änderung |
| 3.16.0 | 16.10.2026 | Neben | Angepasst an allgemein 4.18.0 (R-7.3 Liste steht still: Tagestabelle und Tageskästen); keine eigene Änderung |
| 3.15.1 | 15.10.2026 | Korrektur | Angepasst an allgemein 4.16.1; keine eigene Änderung |
| 3.15.0 | 15.10.2026 | Neben | Angepasst an allgemein 4.16.0: Start im iPhone-Aufbau in der Startliste ohne blauen Eintrag (R-7.2, RLB-84) |
| 3.14.1 | 15.10.2026 | Korrektur | Angepasst an allgemein 4.15.1 (15.20: Nachfrage alle 10 s); keine eigene Änderung |
| 3.14.0 | 15.10.2026 | Neben | Angepasst an allgemein 4.15.0 (R-1.5 Offline-Hinweis, 15.20); keine eigene Änderung |
| 3.13.2 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.14.2 (R-1.5 Offline-Start, R-5.1 Schrittkopf); keine eigene Änderung |
| 3.13.1 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.14.1 (Richtlinien-Text in der Fassung); keine eigene Änderung |
| 3.13.0 | 14.10.2026 | Neben | Angepasst an allgemein 4.14.0 (feste AppDesign-Fassung, APD-5 Version B); keine eigene Änderung |
| 3.12.0 | 14.10.2026 | Neben | Ausprägung R-3.1: Maps-Link des Quartiers mit unsichtbarer Antippfläche von mindestens 44 px (Fund APD-5: ‚Hotel‘ war 42 px breit); angepasst an allgemein 4.13.0 |
| 3.11.7 | 14.10.2026 | Korrektur | APD-2 Schritt 3: Wiederholungen allgemeiner Regeln durch Verweise ersetzt (Backup-Kachel R-9.1, Suche R-2.3, Vorschau R-6.4, Abfragen R-4.3, Diktieren und Großbuchstaben R-5.2, Anführungszeichen, Häkchen im Menü); alter Text ‚Backup laden … ersetzt‘ gestrichen (R-9.2); Feldnamen des Abgleichberichts wie in der App (‚Reisemittel‘ statt ‚Verkehrsmittel‘); angepasst an allgemein 4.12.2 |
| 3.11.6 | 14.10.2026 | Korrektur | ‚Gesamtausgaben‘ statt ‚Gesamtkosten‘; Ausgabe mit festen Spaltenanteilen 28 : 28 : 22 : 22; angepasst an allgemein 4.12.1 |
| 3.11.5 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.12.0: Verweise auf den neuen Regelkatalog (R-<Thema>.<Nr>) |
| 3.11.4 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.11.4: im Abgleichbericht ist jedes Reiselogbuch eine Tabellenzeile, ganz weiß oder ganz grau (R-52) |
| 3.11.3 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.11.3: Abgleichbericht-Tabelle wie die HTML-Ausgabe (R-52) |
| 3.11.2 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.11.2: Abgleichbericht ohne überragende Zellen und mit PDF (R-37, R-44), oberster Tag bleibt beim Drehen (R-51) |
| 3.11.1 | 13.10.2026 | Korrektur | Angepasst an allgemein 4.11.1: README mit ‚Verwendete Versionen‘ (R-49), Testfälle mit /0 (R-50) |
| 3.11.0 | 13.10.2026 | Neben | Angepasst an allgemein 4.11.0: Abgleichbericht (R-44), Versionskopplung mit AppDesign (R-48), Seitenleiste mit einem Zustand (R-47), Kontextmenü des letzten Eintrags (R-40) |
| 3.10.1 | 13.10.2026 | Korrektur | Angepasst an allgemein 4.10.1: Seitenleiste beim Drehen (R-47), Kontextmenü über der Backup-Kachel, Abgleich ohne leere Felder, Gerätenamen in den Hinweisen |
| 3.10.0 | 12.10.2026 | Neben | Angepasst an allgemein 4.10.0: R-40 (Drehen, Kontextmenü am iPhone), Abgleich je Feld nach R-41 bis R-44, Backup nach R-45/R-46 über die gemeinsamen Bausteine |
| 3.9.1 | 12.10.2026 | Korrektur | Angepasst an allgemein 4.9.1: Abfrage ‚Backup laden‘ passt am iPhone quer auf den Bildschirm, Fenster ‚Tag‘ am iPad hoch nicht mehr zu tief (R-39) |
| 3.9.0 | 12.10.2026 | Neben | Angepasst an allgemein 4.9.0: Backup laden mit Abgleichen · Ersetzen · Abbrechen (RLB-3), Kachelzeile ‚geändert am … · Gerät‘ |
| 3.8.1 | 12.10.2026 | Korrektur | Angepasst an allgemein 4.8.1: Symbolleiste mit oder ohne Suchzeile bewegt sich beim Wischen keinen Millimeter (R-05) |
| 3.8.0 | 12.10.2026 | Neben | Angepasst an allgemein 4.8.0: Smiley-Reihen brechen in Tabelle und Kästen um (mehr als drei Smileys am Zeilenanfang sind Text), Spaltenköpfe in einer Zeile; Seitenleiste behält ihre Position; iPhone: Wischen schließt die Tastatur der Suche |
| 3.7.0 | 12.10.2026 | Neben | Angepasst an allgemein 4.7.0: Startliste am iPhone = Seitenleiste als ganze Seite (R-36), Kacheln laufen auch am iPad hinter der Backup-Kachel durch; zu lange Wörter brechen in der Tagestabelle im Wort um (R-37) |
| 3.6.0 | 11.10.2026 | Neben | Angepasst an allgemein 4.6.0: Kopfzeile am iPad fest, in der Seitenleiste scrollen nur die Kacheln; Regelkatalog R-01 bis R-35 gilt |
| 3.5.0 | 11.10.2026 | Neben | Vorschau auch am iPad in Seitenbreite; Leiste der iPhone-Startliste steht fest |
| 3.4.0 | 11.10.2026 | Neben | Titel des Reiselogbuchs in der Leiste statt Überschrift (iPad und iPhone); iPhone mit Bezeichnungen wie am iPad; Anzahl unter ‚Reiselogbücher‘; Backup-Kachel immer sichtbar; Großschreibung nach Vorschlägen |
| 3.3.0 | 11.10.2026 | Neben | Startliste und Seitenleiste gleich (Kacheln, gelbe Backup-Kachel, Titel links in der Leiste); erster offener Tag ohne blauen Rand; ‚Verlauf‘ halbfett; Mikrofon-Knöpfe entfernt; Großbuchstabe am Zeilenanfang; Zeitraum mit ‚Bis‘ unter ‚Von‘ auf dem iPhone |
| 3.2.0 | 11.10.2026 | Neben | ‚Verlauf‘ statt ‚Programm‘; iPhone: Kapseln und Suche wie am iPad, Titel in der Leiste, Kacheln, Backup-Hinweis fest unten und gelb (auch Seitenleiste), Linien im Tageskasten, Vorschau in Seitenbreite; Backup-Abfrage mit Umbruch |
| 3.1.0 | 10.10.2026 | Neben | iPhone-Ansicht (Abschnitt 3a, allgemein 15.17); Mehr-Menü ‚Alle Tage‘/‚Nur erfasste Tage‘ mit Icons |
| 3.0.0 | 09.10.2026 | Haupt | Gemeinsame Bausteine aus AppDesign 4.0.0 (design.css, ui.js); Aussehen unverändert |
| 2.4.0 | 09.10.2026 | Neben | Angepasst an allgemein 3.6.1 (Menüs ohne Linien zwischen Punkten, Suchfeld ohne blauen Rahmen); bewusste Abweichung Essen-Links |
| 2.3.0 | 09.10.2026 | Neben | Angepasst an allgemein 3.5.0–3.6.0 (HIG-Prüfung): Darstellung ›, Kontextmenü ohne ‚Öffnen‘, Trennlinien eingerückt, Sprechblasen ohne Icons, kontrastreicheres Grau, Maps-Links mit 44 px Antippfläche, Texte (Überschneidung, Quartier-Hinweis, Download) |
| 2.2.2 | 09.10.2026 | Korrektur | Angepasst an allgemein 3.4.0/3.4.1: Anführungszeichen ‚…‘ in allen Texten der App; Teilen-Menü mit Strich |
| 2.2.1 | 09.10.2026 | Korrektur | Angepasst an allgemein 3.3.1: Reiselogbuch, Tag und Fazit bleiben blau, solange ihr Fenster offen ist; Menü der Seitenleiste mit Strich und Satz zum Speicher |
| 2.2.0 | 09.10.2026 | Neben | Angepasst an allgemein 3.3.0: Kontextmenü der Reiselogbücher, Speicher-Hinweise |
| 2.1.2 | 08.10.2026 | Korrektur | Angepasst an allgemein 3.2.1 (Seitenleiste beim Start, Abstand unten) |
| 2.1.1 | 08.10.2026 | Korrektur | Ausgabe: Wetter in der Spalte „Tag“ unter dem Datum; Auswahl-Kapseln für Smileys, Wetter, Reisemittel; Betragsfeld dynamisch |
| 2.1.0 | 08.10.2026 | Neben | Angepasst an allgemein 3.1.0: Backup-Texte („Backup erstellen“, „Letztes Backup erstellt am …“), Gesamtkosten „4.850,00 €“, Statistik mit Nächten |
| 2.0.0 | 08.10.2026 | Haupt | Angepasst an allgemein 3.0.0: Seitenleiste Reiselogbücher mit Backup-Hinweis, Kopfzeile mit Kapsel [share \| search \| ellipsis], Teilen-Menü statt Fenster „Ausgabe“, Mehr-Menü (Filter, Einstellungen, Modus, Löschen), Sprechblasen, Fenster „Einstellungen“, Spaltennamen mit einfachen Anführungszeichen, Von/Bis beim Zeitraum |
| 1.2.0 | 07.10.2026 | Neben | Hotel und Ort in einer Zeile; Farben auf Apple-Blau; Options-Kapseln und Schalter statt Checkboxen |
| 1.1.0 | 07.10.2026 | Neben | Angepasst an allgemein 2.0.0: Suchfeld mit Treffer-Navigation in der oberen Leiste, eingeschaltete Wetter/Reisemittel/Mikrofon, Löschen rot gefüllt |
| 1.0.1 | 06.10.2026 | Korrektur | Bereinigt: Verweis auf „allgemein 1.1.0“, keine Wiederholungen, Punkte als Abweichung/Ausprägung gekennzeichnet; allgemeine Regeln in die allgemeine Richtlinie verschoben |
| 1.0.0 | 06.10.2026 | erste Fassung | Zusammenfassung aller Reiselogbuch-spezifischen Gestaltungsregeln (Stand Reiselogbuch 1.0.0) |
