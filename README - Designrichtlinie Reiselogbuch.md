# Designrichtlinie Reiselogbuch

**Version 3.25.0** · Stand 19.10.2026

> **Es gilt die Designrichtlinie allgemein aus AppDesign (Version 4.27.0)** – die Komponenten kommen
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
  Häkchen vor der Auswahl (15.6).
- Leer: „Noch kein Reiselogbuch angelegt.“ (Seitenleiste) bzw. zusätzlich „Mit „plus“ in der
  Seitenleiste ein neues anlegen.“ (Inhalt).

## 2. Icons und Emojis — Ausprägung

| Aktion | Lucide-Icon |
|---|---|
| Ausgabe (Teilen-Menü) | `share` |
| Einstellungen des Reiselogbuchs | `settings` |

Emojis als Inhalt: Wetter ☀️ 🌤 🌦 🌧 ☁️ ⛈ ❄️ · Reisemittel 🚗 🚆 🚲 ✈️ 🚙 🚢 🚐 🚶 ·
📍 vor Maps-Links (nur Zeichen, verlinkt ist nur der Name – er endet an ‚ – ‘, Komma, Doppelpunkt oder Klammer, nicht vor einer Ziffer (seit 3.18.0, T-86); Antippfläche unsichtbar mindestens 44 px, R-3.1) ·
▫️ vor mehreren Punkten im Verlauf · ⊘ am Zeilenanfang = ohne Maps-Link ·
Spaltenköpfe 🙂☹️😉 (Wie war was?), 🍽️🍷☕️ (Essen und Trinken), 😴💤 (Quartier).

## 3. Hauptansicht — Ausprägung

- **Seitenleiste** (Komponente): unter ‚Reiselogbücher‘ klein und grau die Anzahl; Reiselogbücher als Kacheln, zuletzt beginnende Reise zuerst; je
  Kachel Titel · „TT.MM.JJJJ - TT.MM.JJJJ · läuft gerade / beendet / geplant“ und ›. Fest unten die
  Backup-Kachel (R-9.1). Mehr-Menü: Backup erstellen · Backup laden · Strich · Versionszeile · Satz zum Speicher.
  Langes Drücken auf ein Reiselogbuch: Einstellungen · Reiselogbuch löschen.
- **Kopfzeile** (Komponente): Titel der Reise; Kapsel [share | search | ellipsis].
  - share → Menü: Vorschau · HTML · PDF (jeweils mit grauem Hinweis), Strich, darunter
    ‚N erfasste Tage · Dateiname: …‘.
  - search → Suchzeile; die Suche durchsucht den Verlauf und die sichtbaren Spalten. **Mehrere Wörter (seit 3.23.0, R-2.3):**
    ‚ein Eintrag‘ ist das ganze Reiselogbuch – jedes Wort muss irgendwo darin stehen; gezeigt werden die Tage mit mindestens
    einem Wort (Entscheidung des Nutzers 18.10.2026).
  - ellipsis → Mehr-Menü: Alle Tage / Nur erfasste Tage · Einstellungen · Darstellung › ·
    Reiselogbuch löschen (rot, Sprechblase mit Tipp zum Backup).
- Darunter (ohne Überschrift – der Titel steht in der Kopfzeile): Reiseteilnehmer,
  Reisezeitraum, Reisemittel und Fortschrittsanzeige („Tag 42 von 80 · 38 erfasst“).
- Tagestabelle: Tag · Verlauf · sichtbare konfigurierte Spalten. Die erste Lücke ist
  gelb markiert (ohne blauen Rand), vergangene leere Tage tragen „fehlt“ (Farbe `--warn`).
- Darunter: Fazit (Kasten passt sich dem Inhalt an), Gesamtausgaben (Betragsfeld 150 px,
  „[ 4.850,00 ] €“), Quartierliste (nur mit Spalte Quartier), Statistik (Reisetage · Quartiere ·
  Nächte · Wetter · Smileys).

## 3a. iPhone — Ausprägung der iPhone-Ansicht (allgemein 15.17)

- **Start (seit 3.15.0, allgemein R-7.2):** jedes Neuladen beginnt in der Startliste ‚Reiselogbücher‘ ohne blauen Eintrag;
  ein Reiselogbuch öffnet beim ersten offenen Tag. Die Startreise (laufende, sonst zuletzt beendete, sonst nächste) bleibt
  gewählt und erscheint, wenn das Fenster in den iPad-Aufbau wechselt. Runder `chevron-left` führt zur Startliste.
- **Startliste ‚Reiselogbücher‘ = Seitenleiste:** fest stehende Leiste mit ‚Reiselogbücher‘ links
  (darunter klein und grau die Anzahl) und der Kapsel [`plus` | `ellipsis`] rechts (ellipsis: Backup
  erstellen · Backup laden · Strich · Versionszeile · Satz zum Speicher); ohne großen Titel; jedes Reiselogbuch als
  eigene Kachel (Titel · Zeitraum · Zustand, ›), das zuletzt geöffnete blau (nach dem Start keines, R-7.2); Backup-Kachel fest am unteren Rand (R-7.1, R-9.1). Langes Drücken: Einstellungen · Reiselogbuch
  löschen. Leer: ‚Noch kein Reiselogbuch angelegt.‘ und ‚Mit ‚plus‘ oben rechts ein neues
  Reiselogbuch anlegen.‘
- **Reiselogbuch:** Kopf mit rundem `chevron-left` und Kapsel [`share` | `search` | `ellipsis`]
  (R-1.1); der Reisetitel steht in der Mitte der Leiste. Darunter wie am
  iPad ‚Reiseteilnehmer:‘, ‚Reisezeitraum:‘, ‚Reisemittel:‘ – nach dem Doppelpunkt eine neue Zeile;
  die Reisemittel in einer Zeile, bei Bedarf seitlich wischen; dann die Fortschrittsanzeige.
- **Tage als Kästen:** Kopf ‚Mo, 24.08.‘ mit ‚heute‘/‚fehlt‘ und Wetter rechts (leer: blasse
  Platzhalter); Felder ‚Verlauf‘ (als Wort, normale Größe, halbfett), dann die Spalten-Emojis
  🙂☹️😉 · 🍽️🍷☕️ · 😴💤 – nur sichtbare Spalten und nur mit Inhalt; zwischen den Feldern
  waagrechte Linien, zwischen Bezeichnung und Inhalt eine senkrechte. Erster offener Tag gelb
  (ohne blauen Rand); der angetippte Kasten bleibt blau, solange die Tageserfassung offen ist.
- Darunter Fazit (volle Breite), Gesamtausgaben, Quartierliste als Liste (Quartier mit Maps-Link,
  darunter ‚24.08. - 25.08.2026 · 1 Nacht‘), Statistik.
- **Suche** wie am iPad (15.17, R-2.3): es bleiben nur Tage mit Treffern.
- **Tageserfassung** bildschirmfüllend, Titel kurz ‚Di, 25.08.2026‘ mit ‚Gespeichert um …‘;
  Wetter-Symbole 40 px breit, damit alle sieben ohne Wischen passen.
- Nach dem Löschen eines Reiselogbuchs geht es zur Startliste. (Vorschau R-6.4, Abfragen R-4.3, Backup laden R-9.2.)

## 4. Tageserfassung — Ausprägung des Erfassungsfensters

- Kopfzeile: x · Wochentag mit vollem Datum („Sonntag, 04.10.2026“), darunter
  „Automatisch gespeichert um hh:mm“ · Kapsel [chevron-left | chevron-right] · Häkchen.
- Schritte je nach sichtbaren Spalten (2 bis 5).
- Eingeschaltet (blau getönt mit Haarlinie): gewählte Wetter-Symbole.
- Diktieren und Großbuchstaben nach R-5.2, Hinweis zum Diktieren unten im Fenster; groß wird auch der erste Buchstabe nach
  einem Smiley.
- Verlauf: Vorschläge als Chips zum Antippen („Weiterfahrt nach …“, „Rundgang durch …“,
  „Besichtigung …“, „Freetour …“, „Tour …“, „Sonstiges …“); „…“ ist nur Platzhalter und wird nicht übernommen.
  „Sonstiges …“ (seit 3.22.0) schreibt keinen Text, sondern setzt eine leere erste Zeile und den Cursor dorthin.
- Smiley-Leisten bei „Wie war was?“, „Essen und Trinken“ (eigener Satz:
  🕗 🕙 🕛 🕒 🕕 😋 👌 👍 😕 🤮 👎 ⭐️ 🍕 🍔 🥩 🍷 🍺 ☕️) und im Fazit.
- Quartier: Kopfzeile „Quartier wie Vortag“ (nicht am ersten Tag) und
  „keinen Google-Maps Link“; Felder Name und „Ort für Google Maps, z. B. Cairns,
  Australien“ **nebeneinander in einer Zeile (halb und halb)**, bei schmalem Bildschirm
  untereinander; Link „📍 In Google Maps prüfen“.

## 5. Abfragen — Ausprägung der Sprechblasen

- Backup laden: Abfrage mit den Kacheln Abgleichen und Ersetzen nach R-9.2 (allgemein 15.19).
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
  Wetter-Platzhalter; Wetter in der Spalte „Tag“ unter dem Datum), danach Fazit · Gesamtausgaben · Quartierliste (falls aktiviert) ·
  Statistik · Zeile „Ausgabe V… erstellt am …“.
- Tagestabelle mit festen Spaltenanteilen (seit 3.11.6): ‚Tag‘ so schmal wie das Datum, Verlauf und ‚Wie war was?‘ je 28,
  Essen und Quartier je 22 – unabhängig von der Textmenge, die letzten beiden Spalten gleich breit; fehlt eine Spalte,
  teilen sich die übrigen den Platz im selben Verhältnis (gilt nur für das Reiselogbuch, nicht allgemein).
- Dateinamen: „Reiselogbuch <Titel> JJJJ.MM.TT-JJJJ.MM.TT V001“ und
  „Ω Backup Reiselogbuch JJJJ.MM.TT hh.mm.json“.

---

## Bewusste Abweichungen von der HIG-Checkliste

| Was | Grund | Entschieden |
|---|---|---|
| Maps-Links der Lokale in der Spalte ‚Essen und Trinken‘ nur so hoch wie der Text (ca. 19 px) – auf dem iPhone auch in den Tageskästen | mehr Zeilenabstand in der Tabelle nicht gewünscht; im Kasten würde eine größere Fläche das Antippen des Tages behindern; das HIG-Prüfskript zählt es nicht | 09.10.2026 · iPhone 10.10.2026 |
| Kapsel ‚Nach oben / Ans Ende‘ auch auf dem iPhone (Apple: Statusleiste antippen, Scroll-Leiste ziehen) | Apple-Weg zu schwerfällig; allgemein in AppDesign R-3.2 (A-15) | 17.10.2026 |
| Wetter-Symbole in der Tageserfassung auf dem iPhone 40 px breit (in der Kapsel, über dem Minimum von 28 pt) | alle sieben passen ohne Wischen | 10.10.2026 |

## Abgleich zwischen iPad und iPhone

Es gelten die allgemeinen Regeln R-9.2 bis R-9.4 und die Fall-Tabelle der Designrichtlinie allgemein (Abschnitt 15.18). Ausprägung im Reiselogbuch: Einträge = Reiselogbücher, Unterdaten = Tage (Felder Wetter, Verlauf, Wie war was?, Essen, Quartier …), Kopfdaten = Titel, Teilnehmer, Zeitraum, Reisemittel, Spalten, Fazit, Kosten; Zähler ohne Zeitpunkt = Dateinummer für PDF/HTML. Feldnamen im Abgleichbericht (`labels`): Reisetitel, Reiseteilnehmer, Beginn, Ende, Reisemittel, Quartierliste, Spalte Essen, Spalte Wie war was?, Spalte Quartier, Fazit, Gesamtausgaben; je Tag Wetter, Verlauf, Wie war was?, Essen und Trinken, Quartier, Ort, Quartier wie Vortag, Google-Maps-Link.

---

## Versionsgeschichte

| Version | Datum | Art | Inhalt |
|---|---|---|---|
| 3.25.0 | 19.10.2026 | Neben | angepasst an allgemein 4.27.0 (A-28 Umbau B, 15.22; A-29, R-2.3): der Inhalt (Tage, Fazit, Quartierliste, Statistik) liegt im Rollbereich unter Kopf- und Suchzeile, der Tabellenkopf haftet mit `top: 0`; Lupe und ⓧ rollen nach oben; Messmodus-Teil `tag` statt `inh` (die Spalte `inh` kommt jetzt aus AppDesign) |
| 3.24.0 | 19.10.2026 | Neben | angepasst an allgemein 4.26.0 (Messmodus R-1.6, 15.21): ‚Messung starten‘ im Mehr-Menü der Seitenleiste bzw. Startliste – gemessen werden Kopf- und Suchzeile von Reiselogbuch und Liste, der erste Tag und der Rollstand der Liste |
| 3.23.1 | 19.10.2026 | Korrektur | angepasst an allgemein 4.25.1 (Suchfeld bleibt beim Tippen, R-2.3; Markierung bei Icons als Kreis, R-3.1) – im Reiselogbuch keine eigene Regel |
| 3.23.0 | 18.10.2026 | Neben | Suche mit mehreren Wörtern: Einheit = Reiselogbuch (T-93); angepasst an allgemein 4.25.0 (R-2.3 mehrere Wörter und „…“, Lupe am Ende der Kapsel) |
| 3.22.0 | 18.10.2026 | Neben | Verlauf: Vorschläge ‚Tour …‘ und ‚Sonstiges …‘ (leere erste Zeile, T-94); angepasst an allgemein 4.24.0 (R-7.3 Hervorhebung 2 s + 1 s) |
| 3.21.2 | 18.10.2026 | Korrektur | Angepasst an allgemein 4.23.2 (R-7.3 Liste steht still – auch nach ‹ ›, P-52/2–4); keine eigene Abweichung |
| 3.21.1 | 18.10.2026 | Korrektur | Angepasst an allgemein 4.23.1 (R-7.3 Liste steht still, auch mit Tastatur – P-51/5); keine eigene Abweichung |
| 3.21.0 | 17.10.2026 | Neben | Angepasst an allgemein 4.23.0 (R-2.3 Suche in der zentralen Liste, T-92 / A-19); keine eigene Änderung |
| 3.20.1 | 17.10.2026 | Korrektur | Angepasst an allgemein 4.21.1 (R-8.1 am Ende der Seite); keine eigene Änderung |
| 3.20.0 | 17.10.2026 | Neben | Angepasst an allgemein 4.21.0 (R-7.4 Position beim Öffnen, R-8.1 Seitenleiste ein/aus); keine eigene Änderung |
| 3.19.0 | 17.10.2026 | Neben | Angepasst an allgemein 4.20.0 (R-3.2: Kapsel ‚Nach oben / Ans Ende‘ auch auf dem iPhone); HIG-Abweichung eingetragen |
| 3.18.0 | 17.10.2026 | Neben | Abschnitt 2: Maps-Link endet an ‚ – ‘, Komma, Doppelpunkt oder Klammer, nicht vor einer Ziffer (T-86) |
| 3.17.0 | 17.10.2026 | Neben | Angepasst an allgemein 4.19.0 (R-5.5 Eingabetaste: Gesamtausgaben, Fenster ‚Tag‘ und ‚Einstellungen‘); keine eigene Änderung |
| 3.16.0 | 16.10.2026 | Neben | Angepasst an allgemein 4.18.0 (R-7.3 Liste steht still: Tagestabelle und Tageskästen); keine eigene Änderung |
| 3.15.1 | 15.10.2026 | Korrektur | Angepasst an allgemein 4.16.1; keine eigene Änderung |
| 3.15.0 | 15.10.2026 | Neben | Angepasst an allgemein 4.16.0: Start im iPhone-Aufbau in der Startliste ohne blauen Eintrag (R-7.2, T-84) |
| 3.14.1 | 15.10.2026 | Korrektur | Angepasst an allgemein 4.15.1 (15.20: Nachfrage alle 10 s); keine eigene Änderung |
| 3.14.0 | 15.10.2026 | Neben | Angepasst an allgemein 4.15.0 (R-1.5 Offline-Hinweis, 15.20); keine eigene Änderung |
| 3.13.2 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.14.2 (R-1.5 Offline-Start, R-5.1 Schrittkopf); keine eigene Änderung |
| 3.13.1 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.14.1 (Richtlinien-Text in der Fassung); keine eigene Änderung |
| 3.13.0 | 14.10.2026 | Neben | Angepasst an allgemein 4.14.0 (feste AppDesign-Fassung, A-05 Version B); keine eigene Änderung |
| 3.12.0 | 14.10.2026 | Neben | Ausprägung R-3.1: Maps-Link des Quartiers mit unsichtbarer Antippfläche von mindestens 44 px (Fund A-05: ‚Hotel‘ war 42 px breit); angepasst an allgemein 4.13.0 |
| 3.11.7 | 14.10.2026 | Korrektur | A-02 Schritt 3: Wiederholungen allgemeiner Regeln durch Verweise ersetzt (Backup-Kachel R-9.1, Suche R-2.3, Vorschau R-6.4, Abfragen R-4.3, Diktieren und Großbuchstaben R-5.2, Anführungszeichen, Häkchen im Menü); alter Text ‚Backup laden … ersetzt‘ gestrichen (R-9.2); Feldnamen des Abgleichberichts wie in der App (‚Reisemittel‘ statt ‚Verkehrsmittel‘); angepasst an allgemein 4.12.2 |
| 3.11.6 | 14.10.2026 | Korrektur | ‚Gesamtausgaben‘ statt ‚Gesamtkosten‘; Ausgabe mit festen Spaltenanteilen 28 : 28 : 22 : 22; angepasst an allgemein 4.12.1 |
| 3.11.5 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.12.0: Verweise auf den neuen Regelkatalog (R-<Thema>.<Nr>) |
| 3.11.4 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.11.4: im Abgleichbericht ist jedes Reiselogbuch eine Tabellenzeile, ganz weiß oder ganz grau (R-52) |
| 3.11.3 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.11.3: Abgleichbericht-Tabelle wie die HTML-Ausgabe (R-52) |
| 3.11.2 | 14.10.2026 | Korrektur | Angepasst an allgemein 4.11.2: Abgleichbericht ohne überragende Zellen und mit PDF (R-37, R-44), oberster Tag bleibt beim Drehen (R-51) |
| 3.11.1 | 13.10.2026 | Korrektur | Angepasst an allgemein 4.11.1: README mit ‚Verwendete Versionen‘ (R-49), Prüfliste mit /0 (R-50) |
| 3.11.0 | 13.10.2026 | Neben | Angepasst an allgemein 4.11.0: Abgleichbericht (R-44), Versionskopplung mit AppDesign (R-48), Seitenleiste mit einem Zustand (R-47), Kontextmenü des letzten Eintrags (R-40) |
| 3.10.1 | 13.10.2026 | Korrektur | Angepasst an allgemein 4.10.1: Seitenleiste beim Drehen (R-47), Kontextmenü über der Backup-Kachel, Abgleich ohne leere Felder, Gerätenamen in den Hinweisen |
| 3.10.0 | 12.10.2026 | Neben | Angepasst an allgemein 4.10.0: R-40 (Drehen, Kontextmenü am iPhone), Abgleich je Feld nach R-41 bis R-44, Backup nach R-45/R-46 über die gemeinsamen Bausteine |
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
