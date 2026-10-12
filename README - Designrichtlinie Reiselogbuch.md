# Designrichtlinie Reiselogbuch

**Version 3.9.1** · Stand 12.10.2026

> **Es gilt die Designrichtlinie allgemein aus AppDesign (Version 4.9.1)** – die Komponenten kommen
> fertig aus `AppDesign/v4/design.css` und `ui.js`.
> Hier stehen nur **Abweichungen** (bewusst anders als dort) und **Ausprägungen**
> (konkrete Ausgestaltung einer allgemeinen Regel für das Reiselogbuch).
> Die vollständige Funktionsbeschreibung steht in `PROMPT.md`.
>
> Derzeit gibt es **keine Abweichungen** – alle Punkte sind Ausprägungen.

> **Hinweis für Claude:** Bei jeder Design-Änderung nachfragen, ob sie allgemein oder nur
> für das Reiselogbuch gilt. Diese Datei wird bei jeder Reiselogbuch-spezifischen
> Design-Änderung aktualisiert und ihre Versionsnummer erhöht.

---

## 1. Begriffe — Ausprägung

- App-Name „Reiselogbuch“; der Begriff „Reisetagebuch“ kommt nicht vor.
- Seitenleiste: „Reiselogbücher“; Fenster „Neues Reiselogbuch“ (über plus) und
  „Einstellungen“ (Mehr-Menü); Menüpunkt „Reiselogbuch löschen“.
- Überschrift „Reiselogbuch – <Titel>“ nur in der Ausgabe; in der App steht der Titel des
  Reiselogbuchs in der Leiste (iPad und iPhone).
- Spalte und Erfassungsschritt **‚Verlauf‘** (bis 3.1.0 ‚Programm‘) – passt auch zu Tagen, an denen man
  nur fährt. Erfassungsschritte: „Wetter“, „Verlauf“, „Wie war was?“, „Essen und Trinken“, „Quartier“.
- Options-Kapseln (Tageserfassung): „Quartier wie Vortag“, „keinen Google-Maps Link“; Schalter (Bearbeiten):
  „Quartierliste in der Ausgabe“.
- Blättern in der Tageserfassung: chevron-left / chevron-right (Vortag / Folgetag, nur Icon).
- Filter im Mehr-Menü: ‚Alle Tage‘ (`list-chevrons-up-down`) / ‚Nur erfasste Tage‘ (`fold-vertical`) –
  Häkchen vor der Auswahl, dann Icon und Text.
- Leer: „Noch kein Reiselogbuch angelegt.“ (Seitenleiste) bzw. zusätzlich „Mit „plus“ in der
  Seitenleiste ein neues anlegen.“ (Inhalt).

## 2. Icons und Emojis — Ausprägung

| Aktion | Lucide-Icon |
|---|---|
| Ausgabe (Teilen-Menü) | `share` |
| Einstellungen des Reiselogbuchs | `settings` |

Emojis als Inhalt: Wetter ☀️ 🌤 🌦 🌧 ☁️ ⛈ ❄️ · Reisemittel 🚗 🚆 🚲 ✈️ 🚙 🚢 🚐 🚶 ·
📍 vor Maps-Links (nur Zeichen, verlinkt ist nur der Name; Ort nach Komma) ·
▫️ vor mehreren Punkten im Verlauf · ⊘ am Zeilenanfang = ohne Maps-Link ·
Spaltenköpfe 🙂☹️😉 (Wie war was?), 🍽️🍷☕️ (Essen und Trinken), 😴💤 (Quartier).

## 3. Hauptansicht — Ausprägung

- **Seitenleiste** (Komponente): unter ‚Reiselogbücher‘ klein und grau die Anzahl; Reiselogbücher als Kacheln, zuletzt beginnende Reise zuerst; je
  Kachel Titel · „TT.MM.JJJJ - TT.MM.JJJJ · läuft gerade / beendet / geplant“ und ›. Fest unten immer
  die Backup-Kachel „Letztes Backup erstellt am …“ mit „Backup erstellen“ – gelb mit blauem Knopf,
  solange heute noch kein Backup erstellt wurde, sonst weiß. Mehr-Menü: Backup erstellen · Backup laden · Strich · Versionszeile · Satz zum Speicher.
  Langes Drücken auf ein Reiselogbuch: Einstellungen · Reiselogbuch löschen.
- **Kopfzeile** (Komponente): Titel der Reise; Kapsel [share | search | ellipsis].
  - share → Menü: Vorschau · HTML · PDF (jeweils mit grauem Hinweis), Strich, darunter
    ‚N erfasste Tage · Dateiname: …‘. Anführungszeichen in der App immer ‚…‘.
  - search → Suchzeile; die Suche durchsucht den Verlauf und die sichtbaren Spalten.
  - ellipsis → Mehr-Menü: Alle Tage / Nur erfasste Tage · Einstellungen · Darstellung › ·
    Reiselogbuch löschen (rot, Sprechblase mit Tipp zum Backup).
- Darunter (ohne Überschrift – der Titel steht in der Kopfzeile): Reiseteilnehmer,
  Reisezeitraum, Reisemittel und Fortschrittsanzeige („Tag 42 von 80 · 38 erfasst“).
- Tagestabelle: Tag · Verlauf · sichtbare konfigurierte Spalten. Die erste Lücke ist
  gelb markiert (ohne blauen Rand), vergangene leere Tage tragen „fehlt“ (Farbe `--warn`).
- Darunter: Fazit (Kasten passt sich dem Inhalt an), Gesamtkosten (Betragsfeld 150 px,
  „[ 4.850,00 ] €“), Quartierliste (nur mit Spalte Quartier), Statistik (Reisetage · Quartiere ·
  Nächte · Wetter · Smileys).

## 3a. iPhone — Ausprägung der iPhone-Ansicht (allgemein 15.17)

- **Start** im laufenden (sonst zuletzt beendeten, sonst nächsten) Reiselogbuch, gesprungen wird
  zum ersten offenen Tag – wie auf dem iPad. Runder `chevron-left` führt zur Startliste.
- **Startliste ‚Reiselogbücher‘ = Seitenleiste:** fest stehende Leiste mit ‚Reiselogbücher‘ links
  (darunter klein und grau die Anzahl) und der Kapsel [`plus` | `ellipsis`] rechts (ellipsis: Backup
  erstellen · Backup laden · Strich · Versionszeile · Satz zum Speicher); ohne großen Titel; jedes Reiselogbuch als
  eigene Kachel (Titel · Zeitraum · Zustand, ›), das zuletzt geöffnete blau. Backup-Kachel immer fest am unteren Rand (gelb mit blauem Knopf,
  solange heute noch kein Backup erstellt wurde, sonst weiß); die Kacheln laufen dahinter durch. Langes Drücken: Einstellungen · Reiselogbuch
  löschen. Leer: ‚Noch kein Reiselogbuch angelegt.‘ und ‚Mit ‚plus‘ oben rechts ein neues
  Reiselogbuch anlegen.‘
- **Reiselogbuch:** Kopf mit rundem `chevron-left` und Kapsel [`share` | `search` | `ellipsis`]
  (Menüs und Suche wie auf dem iPad); der Reisetitel steht in der Mitte der Leiste. Darunter wie am
  iPad ‚Reiseteilnehmer:‘, ‚Reisezeitraum:‘, ‚Reisemittel:‘ – nach dem Doppelpunkt eine neue Zeile;
  die Reisemittel in einer Zeile, bei Bedarf seitlich wischen; dann die Fortschrittsanzeige.
- **Tage als Kästen:** Kopf ‚Mo, 24.08.‘ mit ‚heute‘/‚fehlt‘ und Wetter rechts (leer: blasse
  Platzhalter); Felder ‚Verlauf‘ (als Wort, normale Größe, halbfett), dann die Spalten-Emojis
  🙂☹️😉 · 🍽️🍷☕️ · 😴💤 – nur sichtbare Spalten und nur mit Inhalt; zwischen den Feldern
  waagrechte Linien, zwischen Bezeichnung und Inhalt eine senkrechte. Erster offener Tag gelb
  (ohne blauen Rand); der angetippte Kasten bleibt blau, solange die Tageserfassung offen ist.
- Darunter Fazit (volle Breite), Gesamtkosten, Quartierliste als Liste (Quartier mit Maps-Link,
  darunter ‚24.08. - 25.08.2026 · 1 Nacht‘), Statistik.
- **Suche** wie am iPad: `search` öffnet unter der Leiste die Suchzeile mit ‚1 von 4‘, ⓧ und
  ⌃ ⌄; nur passende Tage, Treffer gelb, der aktuelle hellorange.
- **Tageserfassung** bildschirmfüllend, Titel kurz ‚Di, 25.08.2026‘ mit ‚Gespeichert um …‘;
  Wetter-Symbole 40 px breit, damit alle sieben ohne Wischen passen.
- **Vorschau** in voller Seitenbreite, seitlich wischen (die Wörter bleiben ganz) – seit 3.5.0 auch am iPad.
- Abfragen als Sprechblase an der Schaltfläche wie auf dem iPad; ‚Backup laden‘ nennt das Gerät
  (‚… auf diesem iPhone werden ersetzt.‘). Nach dem Löschen geht es zur Startliste.

## 4. Tageserfassung — Ausprägung des Erfassungsfensters

- Kopfzeile: x · Wochentag mit vollem Datum („Sonntag, 04.10.2026“), darunter
  „Automatisch gespeichert um hh:mm“ · Kapsel [chevron-left | chevron-right] · Häkchen.
- Schritte je nach sichtbaren Spalten (2 bis 5).
- Eingeschaltet (blau getönt mit Haarlinie): gewählte Wetter-Symbole.
- Diktieren über die Mikrofon-Taste der Tastatur (Hinweis unten im Fenster); keine eigenen
  Mikrofon-Knöpfe. Der erste Buchstabe jeder Zeile wird groß (auch nach einem Smiley).
- Verlauf: nach einem Vorschlag beginnt das nächste Wort groß (‚Freetour Sydney‘). Vorschläge als Chips zum Antippen („Weiterfahrt nach …“, „Rundgang durch …“,
  „Besichtigung …“, „Freetour …“); „…“ ist nur Platzhalter und wird nicht übernommen.
- Smiley-Leisten bei „Wie war was?“, „Essen und Trinken“ (eigener Satz:
  🕗 🕙 🕛 🕒 🕕 😋 👌 👍 😕 🤮 👎 ⭐️ 🍕 🍔 🥩 🍷 🍺 ☕️) und im Fazit.
- Quartier: Kopfzeile „Quartier wie Vortag“ (nicht am ersten Tag) und
  „keinen Google-Maps Link“; Felder Name und „Ort für Google Maps, z. B. Cairns,
  Australien“ **nebeneinander in einer Zeile (halb und halb)**, bei schmalem Bildschirm
  untereinander; Link „📍 In Google Maps prüfen“.

## 5. Abfragen — Ausprägung der Sprechblasen

- Backup laden: ‚Backup mit 3 Reiselogbüchern laden?‘, neue Zeile, ‚Die aktuellen Daten auf
  diesem iPad (iPhone) werden ersetzt.‘ ‚Letztes Backup erstellt am …‘ gilt je Gerät und wird
  beim Laden nicht aus der Datei übernommen.

- Reiselogbuch löschen (am ellipsis der Kopfzeile) · Backup laden („Ersetzen“, am ellipsis der
  Seitenleiste) · Smiley entfernen (am Smiley) · Smileys zurücksetzen (am rotate-ccw) ·
  Änderungen verwerfen (am x). Rote Schaltflächen: „Reiselogbuch löschen“, „Ersetzen“,
  „Entfernen“, „Zurücksetzen“, „Änderungen verwerfen“.

## 6. Neues Reiselogbuch / Einstellungen — Ausprägung

- Gewählte Reisemittel: eingeschaltet (blau getönt mit Haarlinie).
- Kästen: Reisetitel · Reiseteilnehmer · Reisezeitraum („Von“ Datum · „Bis“ Datum) ·
  Reisemittel (Chips) · Konfiguration Tabellenspalten · Quartierliste in der Ausgabe.
- Pflichtfelder: Reisetitel, Reiseteilnehmer, Reisezeitraum, mindestens ein Reisemittel.
  Meldungen:
  - „Bitte einen Reisetitel eingeben.“
  - „Bitte Reiseteilnehmer eingeben.“
  - „Bitte Beginn und Ende der Reise wählen.“ bzw. „Der Zeitraum überschneidet sich mit
    „…“ (…). Bitte korrigieren.“ – erscheint auch, sobald ein Titel eingegeben wurde
    (das vorgeschlagene Datum kann sich mit einer anderen Reise überschneiden)
  - „Bitte mindestens ein Reisemittel wählen.“
- Konfiguration Tabellenspalten: Hinweis „Die Spalten ‚Tag‘ und ‚Verlauf‘ werden immer
  angezeigt.“; Schalter in Tabellenreihenfolge „Spalte 🙂☹️😉 ‚Wie war was?‘“,
  „Spalte 🍽️🍷☕️ ‚Essen und Trinken‘“, „Spalte 😴💤 ‚Quartier‘“ (einfache
  Anführungszeichen), beim Anlegen alle eingeschaltet; Hinweis „Ausgeblendete Spalten fehlen in Tabelle, Tageserfassung und
  Ausgabe. Vorhandene Einträge bleiben erhalten.“ Ohne Spalte Quartier ist
  „Quartierliste in der Ausgabe“ ausgegraut.

## 7. Ausgabe — Ausprägung

- Kein eigenes Fenster „Ausgabe“ mehr: Teilen-Menü in der Kopfzeile (Abschnitt 3).
- Inhalt: Überschrift, Reisedaten, Tagestabelle (nur erfasste Tage, ohne
  Wetter-Platzhalter; Wetter in der Spalte „Tag“ unter dem Datum), danach Fazit · Gesamtkosten · Quartierliste (falls aktiviert) ·
  Statistik · Zeile „Ausgabe V… erstellt am …“.
- Dateinamen: „Reiselogbuch <Titel> JJJJ.MM.TT-JJJJ.MM.TT V001“ und
  „Ω Backup Reiselogbuch JJJJ.MM.TT hh.mm.json“.

---

## Bewusste Abweichungen von der HIG-Checkliste

| Was | Grund | Entschieden |
|---|---|---|
| Maps-Links der Lokale in der Spalte ‚Essen und Trinken‘ nur so hoch wie der Text (ca. 19 px) – auf dem iPhone auch in den Tageskästen | mehr Zeilenabstand in der Tabelle nicht gewünscht; im Kasten würde eine größere Fläche das Antippen des Tages behindern; das HIG-Prüfskript zählt es nicht | 09.10.2026 · iPhone 10.10.2026 |
| Wetter-Symbole in der Tageserfassung auf dem iPhone 40 px breit (in der Kapsel, über dem Minimum von 28 pt) | alle sieben passen ohne Wischen | 10.10.2026 |

## Abgleich zwischen iPad und iPhone (seit 3.9.0, je Feld seit 3.10.0)

Grundsatz: **Je Feld gilt die neuere Änderung**; ein gelöschtes Reiselogbuch bleibt gelöscht, solange es danach nicht mehr geändert wurde. Einstellungen bleiben je Gerät.

| Nr. | Anwendungsfall | iPhone lädt das Backup vom iPad → ‚Abgleichen‘ | iPad lädt das Backup vom iPhone → ‚Abgleichen‘ |
|---|---|---|---|
| 1 | Reiselogbuch nur auf dem iPad neu angelegt | kommt dazu – Meldung ‚Neu: …‘ | bleibt – ‚Alles war schon auf dem gleichen Stand‘ |
| 2 | Auf dem iPad gelöscht, auf dem iPhone seitdem nicht geändert | wird gelöscht – ‚Gelöscht: …‘ | bleibt gelöscht – Hinweis ‚Hier gelöscht, im Backup noch vorhanden: … (gelöscht am …) – bleibt gelöscht. Zurückholen nur mit Ersetzen‘ |
| 3 | Auf dem iPad gelöscht, auf dem iPhone **danach** noch geändert | bleibt erhalten – Hinweis ‚Drüben gelöscht, hier danach noch geändert: … – bleibt erhalten‘ | kommt mit den Änderungen vom iPhone zurück – ‚Neu: …‘ |
| 4 | Auf dem iPad gelöscht, auf dem iPhone **vorher** geändert | wird gelöscht – ‚Gelöscht: …‘ | bleibt gelöscht – Hinweis wie Fall 2 |
| 5 | Auf beiden Geräten gelöscht | bleibt weg, keine Meldung dazu | bleibt weg, keine Meldung dazu |
| 6 | Nur auf dem iPad einen Tag erfasst oder geändert | Tag wird übernommen – ‚Aktualisiert: … (1 Tag)‘ | bleibt – ‚Alles war schon auf dem gleichen Stand‘ |
| 7 | Verschiedene Tage auf iPad und iPhone geändert | beide Tage sind da – der Tag vom iPad wird übernommen | beide Tage sind da – der Tag vom iPhone wird übernommen |
| 8 | Gleicher Tag, verschiedene Felder (iPad: Wetter, iPhone: Verlauf) | beides bleibt – Wetter vom iPad kommt dazu | beides bleibt – Verlauf vom iPhone kommt dazu |
| 9 | Gleicher Tag, gleiches Feld auf beiden geändert (iPhone später) | die neuere Fassung (iPhone) bleibt | die neuere Fassung (iPhone) wird übernommen |
| 10 | Feld auf dem iPad geleert (z. B. Wetter gelöscht), iPhone unverändert | Feld wird auch hier geleert, der Rest des Tags bleibt | bleibt leer |
| 11 | Feld auf dem iPad geleert, auf dem iPhone **danach** neu eingetragen | der neue Eintrag bleibt | der neue Eintrag wird übernommen |
| 12 | Kopfdaten: Titel auf dem iPad, Fazit auf dem iPhone geändert | beides bleibt – neuer Titel kommt dazu | beides bleibt – Fazit kommt dazu |
| 13 | Kopfdaten: gleiches Feld (z. B. Titel) auf beiden geändert | das Neuere gilt (je Feld: Titel, Teilnehmer, Zeitraum, Reisemittel, Spalten, Fazit, Kosten …) | wie links |
| 14 | Auf beiden Geräten ein neues Reiselogbuch mit gleichem Namen angelegt | beide bleiben (zwei Einträge gleichen Namens – es sind verschiedene Reiselogbücher) | wie links |
| 15 | Nichts geändert bzw. dasselbe Backup noch einmal geladen | ‚Alles war schon auf dem gleichen Stand‘ | wie links |
| 16 | Daten noch ohne Zeitpunkt (vor dem Update nicht mehr geändert, oder Backup älter als 3.9.0) | Vorhandenes hier bleibt, Fehlendes (Reiselogbücher, Tage, Felder) kommt dazu; unterschiedliche Werte bleiben je Gerät verschieden | wie links – Tipp: nach dem Update einmal auf einem Gerät ‚Ersetzen‘, dann starten beide gleich |
| 17 | Dateinummer für PDF/HTML (Exportzähler) auf beiden verschieden | der höhere Zähler gilt | wie links |
| 18 | Einstellungen (Darstellung, Smiley-Leiste, ‚Letztes Backup‘) | bleiben die des iPhones | bleiben die des iPads |
| 19 | ‚Ersetzen‘ statt ‚Abgleichen‘ | alle Daten des iPhones werden durch das Backup ersetzt – auch hier Gelöschtes kommt zurück, hier Geändertes geht verloren; ‚Letztes Backup‘ bleibt | wie links, für das iPad |
| 20 | ‚Abbrechen‘ oder daneben tippen | nichts ändert sich | wie links |

Fälle 1–17 prüft der Ablauf-Test `tests/ablauf-abgleich-faelle.mjs` bei jeder Version automatisch (beide Richtungen).

---

## Versionsgeschichte

| Version | Datum | Art | Inhalt |
|---|---|---|---|
| 3.9.1 | 12.10.2026 | Korrektur | Angepasst an allgemein 4.9.1: Abfrage ‚Backup laden‘ passt am iPhone quer auf den Bildschirm, Fenster ‚Tag‘ am iPad hoch nicht mehr zu tief (R-39) |
| 3.9.0 | 12.10.2026 | Neben | Angepasst an allgemein 4.9.0: Backup laden mit Abgleichen · Ersetzen · Abbrechen (T-03), Kachelzeile ‚geändert am … · Gerät‘ |
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
