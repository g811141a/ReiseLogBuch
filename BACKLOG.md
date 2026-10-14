# Backlog – offene Themen

**Stand 14.10.2026** · Aktuelle Version: Reiselogbuch 3.11.6 · AppDesign 4.12.1

Hier stehen alle offenen Themen. Erledigte Punkte wandern mit Version und Datum nach unten
in „Erledigt“. Claude erinnert zu Beginn und am Ende jeder Sitzung an die offenen Punkte
(siehe `README - Zusammenarbeit allgemein.md`).

Priorität: **1 hoch** (als Nächstes) · **2 mittel** · **3 niedrig** – gearbeitet wird immer an
den Themen mit der höchsten Priorität zuerst.

Status: **bereit** (fertig geklärt, kommt in die nächste Version) · **offen** (noch zu klären) ·
**prüfen** (auf dem iPad testen) · **später** (Idee, noch nicht dran)

Weg eines Punktes: 2. in Klärung → 0. Nächste Version → 1. Prüfen → Erledigt. Gebaut wird
gesammelt – Claude fragt erst, wenn ein größeres Thema fertig ist oder etwa 5 Punkte bereit
sind (oder auf Wunsch); siehe `README - Zusammenarbeit allgemein.md`, Abschnitt 6.

---

## 0. Nächste Version – gesammelt, noch nicht gebaut

| Nr. | Prio | Thema | Gilt | bereit seit |
|---|---|---|---|---|
| – | – | zurzeit nichts bereit | – | – |

**0 Punkte bereit** · gebaut wird erst nach „Ja“

## 1. Auf iPad und iPhone prüfen

| Nr. | Prio | Thema | Status |
|---|---|---|---|
| P-33 | 1 | Reiselogbuch 3.11.6 mit AppDesign 4.12.1: /0 Version, /1 Reisemittel mit Namen im Abgleichbericht, /2 iPad: Seitenleiste bleibt bei der Suche stehen, /3 Spalten der Vorschau 28 : 28 : 22 : 22, /4 ‚Gesamtausgaben‘ – Schritte im CHANGELOG | prüfen |

## 2. Weitere Themen (in Klärung)

| Nr. | Prio | Thema | Gilt | Status |
|---|---|---|---|---|
| T-05 | 2 | Bestehende (alte) Reiselogbücher aufbereiten und importierbar machen: Dateien (Word/PDF/Excel/HTML/Fotos) auslesen, Unklarheiten nachfragen, Vorschau zeigen, Datei erstellen; Überschneidungen prüfen. Offen: Form der Unterlagen, Anzahl, Weg (a: in aktuelles Backup einfügen · b: neue Funktion „Reiselogbuch importieren“, die hinzufügt statt ersetzt) | Reiselogbuch | offen |
| T-06 | 3 | Ausschreibungstexte (Reiseveranstalter) in Reiselogbücher umwandeln – für erledigte **und** geplante Reisen: Titel, Zeitraum, Reisemittel; je Tag das Programm („1. Tag“ → echtes Datum, Text wie in der Ausschreibung); Quartiere mit Ort, falls genannt; übrige Felder bleiben leer | Reiselogbuch | offen |

## 3. Später

| Nr. | Prio | Thema | Gilt | Status |
|---|---|---|---|---|
| – | – | allgemeine Themen (z. B. Startseite) stehen jetzt im Backlog von AppDesign | – | – |

---

## Erledigt

| Nr. | Thema | Version | Datum |
|---|---|---|---|
| E-57 | Reiselogbuch 3.11.6: Korrekturen aus P-32 (Reisemittel mit Namen im Abgleichbericht, Seitenleiste bei offener Tastatur, feste Spaltenanteile der Ausgabe) und ‚Gesamtausgaben‘ – je mit geschärfter Prüfung | Reiselogbuch 3.11.6 · AppDesign 4.12.1 | 14.10.2026 |
| E-56 | Geprüft: P-32 – 0 und 3 ok; 1 (Reisemittel klein im Bericht), 2 (Seitenleiste rückt bei der Suche), 4 (letzte Spalte der Vorschau gequetscht) nicht ok → 3.11.6 | Reiselogbuch 3.11.5 | 14.10.2026 |
| E-55 | Reiselogbuch 3.11.5: T-83 Feldname ‚Reisemittel‘ im Abgleichbericht (R-10.1, mit Prüfung); Prüfskripte auf den neuen Regelkatalog (AppDesign 4.12.0, A-02a) | Reiselogbuch 3.11.5 · AppDesign 4.12.0 | 14.10.2026 |
| E-54 | Geprüft: P-31 alles in Ordnung | Reiselogbuch 3.11.4 | 14.10.2026 |
| E-53 | Reiselogbuch 3.11.4: T-82 Zebra je Tabellenzeile – zusammengefasste erste Spalte gilt als eine Zeile (R-52); Fehler in 3.11.3 vom Nutzer vor dem Test gefunden | Reiselogbuch 3.11.4 · AppDesign 4.11.4 | 14.10.2026 |
| E-52 | Reiselogbuch 3.11.3: T-81 Abgleichbericht-Tabelle = Mustertabelle der Ausgabe (gemeinsamer Baustein, R-52) | Reiselogbuch 3.11.3 · AppDesign 4.11.3 | 14.10.2026 |
| E-51 | Geprüft: P-28 ok; P-29 – 0, 1, 2, 4 ok; 3 nicht ok (Tabelle wich von der HTML-Ausgabe ab → T-81) | Reiselogbuch 3.11.2 | 14.10.2026 |
| E-50 | Reiselogbuch 3.11.2: T-78 oberster Tag bleibt beim Drehen (R-51), T-79 Abgleichbericht ohne überragende Zellen (R-37 überall geprüft), T-80 PDF im Abgleichbericht | Reiselogbuch 3.11.2 · AppDesign 4.11.2 | 14.10.2026 |
| E-49 | Geprüft: P-27 – 1 bis 7 und 9 ok; 8 nicht ok (Zellen ragen über, iPhone und iPad hoch → T-79; PDF fehlt → T-80) | Reiselogbuch 3.11.0 | 14.10.2026 |
| E-48 | Reiselogbuch 3.11.1: T-77 Vorbeugen gegen P-26/6, 7, 9 – README ‚Verwendete Versionen‘ (R-49), Prüfliste mit /0 und Meldung je Gerät (R-50), ‚fertig‘ erst nach Pages (Zusammenarbeit 1.15.0) | Reiselogbuch 3.11.1 · AppDesign 4.11.1 | 13.10.2026 |
| E-47 | Reiselogbuch 3.11.0: T-73 Versionskopplung mit AppDesign (R-48), T-74 Seitenleiste mit einem Zustand (R-47), T-75 Kontextmenü des letzten Eintrags (R-40), T-76 Abgleichbericht (R-44, Muster 3) | Reiselogbuch 3.11.0 · AppDesign 4.11.0 | 13.10.2026 |
| E-46 | Geprüft: P-26 – 2, 3, 5 ok; 1, 4, 6, 7, 9 nicht ok (auf dem Gerät lief noch die alte AppDesign-Fassung bzw. irreführende Meldung) → T-73 bis T-75; 8 neuer Wunsch → T-76 | Reiselogbuch 3.10.1 | 13.10.2026 |
| E-45 | Reiselogbuch 3.10.1: T-68 Seitenleiste beim Drehen (R-47), T-69 Kontextmenü über der Backup-Kachel, T-70 Gerätenamen in Hinweisen, T-71 leere Felder beim Abgleich, T-72 Prüfpunkte Schritt für Schritt | Reiselogbuch 3.10.1 · AppDesign 4.10.1 | 13.10.2026 |
| E-44 | Geprüft: P-24 alles in Ordnung; P-25 – 4, 6, 14, 15, 16 → T-68 bis T-71, übrige in Ordnung | Reiselogbuch 3.10.0 | 13.10.2026 |
| E-43 | Reiselogbuch 3.10.0: T-63 Drehen (R-40), T-64 Abgleich je Feld, T-65 Kontextmenü iPhone, T-66 Abgleich allgemein (R-41–R-44), T-67 Backup als Standard (R-45, R-46) | Reiselogbuch 3.10.0 · AppDesign 4.10.0 | 12.10.2026 |
| E-42 | Reiselogbuch 3.9.1: T-62 Abfrage und Fenster passen immer auf den Bildschirm (R-39) | Reiselogbuch 3.9.1 · AppDesign 4.9.1 | 12.10.2026 |
| E-41 | Reiselogbuch 3.9.0: T-03 Abgleich iPad ↔ iPhone über ein Backup, ‚geändert am … · Gerät‘ in jeder Kachel | Reiselogbuch 3.9.0 · AppDesign 4.9.0 | 12.10.2026 |
| E-40 | Geprüft: P-23 Version 3.8.1 – 1–4 ok | Reiselogbuch 3.8.1 | 12.10.2026 |
| E-39 | Reiselogbuch 3.8.1: T-60 Symbolleiste mit oder ohne Suchzeile bewegt sich keinen Millimeter (R-05) | Reiselogbuch 3.8.1 · AppDesign 4.8.1 | 12.10.2026 |
| E-38 | Geprüft: P-22 Version 3.8.0 – 1–4 ok (5 → T-60) | Reiselogbuch 3.8.0 | 12.10.2026 |
| E-37 | Reiselogbuch 3.8.0: T-57 Smiley-Reihen und lange Wörter brechen um, T-58 Seitenleiste behält Position, T-59 Tastatur der Suche schließt beim Wischen | Reiselogbuch 3.8.0 · AppDesign 4.8.0 | 12.10.2026 |
| E-36 | Geprüft: P-21 Version 3.7.0 – 1, 4 ok; 2 → T-58; 3, 5 → T-57; iPhone-Suche → T-59 | Reiselogbuch 3.7.0 | 12.10.2026 |
| E-35 | Reiselogbuch 3.7.0: T-55 Startliste = Seitenleiste (R-36), T-56 lange Wörter brechen im Wort um (R-37) | Reiselogbuch 3.7.0 · AppDesign 4.7.0 | 12.10.2026 |
| E-34 | Geprüft: P-20 Version 3.6.0 – 1, 4, 5 ok; 2 am iPhone ok, am iPad → T-55; 3 → T-56 | Reiselogbuch 3.6.0 | 12.10.2026 |
| E-33 | Reiselogbuch 3.6.0: T-53 Kopfzeile und Backup-Kachel am iPad fest, T-54 Regelkatalog R-01 bis R-35 mit Regel-Prüfung | Reiselogbuch 3.6.0 · AppDesign 4.6.0 | 11.10.2026 |
| E-32 | Geprüft: P-19 Version 3.5.0 – 1, 2 ok; 3 am iPhone ok, am iPad → T-53 | Reiselogbuch 3.5.0 | 11.10.2026 |
| E-31 | Reiselogbuch 3.5.0: T-51 Vorschau am iPad in Seitenbreite, T-52 Leisten bewegen sich nie | Reiselogbuch 3.5.0 · AppDesign 4.5.0 | 11.10.2026 |
| E-30 | Geprüft: P-18 Version 3.4.0 – 1–3, 5 ok; 4 → T-52 | Reiselogbuch 3.4.0 | 11.10.2026 |
| E-29 | Reiselogbuch 3.4.0: T-46 Titel in der Leiste, T-47 Bezeichnungen auf dem iPhone, T-48 Backup-Kachel immer, T-49 Anzahl unter dem Titel, T-50 Großschreibung nach Vorschlägen | Reiselogbuch 3.4.0 · AppDesign 4.4.0 | 11.10.2026 |
| E-28 | Geprüft: P-17 Version 3.3.0 – 1–3, 6, 8, 9 ok; 4, 5, 7 → T-48 bis T-50 | Reiselogbuch 3.3.0 | 11.10.2026 |
| E-27 | Reiselogbuch 3.3.0: T-37 kein Zoom durch Doppeltippen, T-38 Bezeichnung bleibt beim Feld, T-39 gelb ohne blauen Rand, T-40/T-43 Startliste = Seitenleiste mit Kacheln, T-41 Mikrofon-Knöpfe entfernt, T-42 Großbuchstabe am Zeilenanfang, T-44 ‚Verlauf‘ halbfett, T-45 senkrechte Kapsel | Reiselogbuch 3.3.0 · AppDesign 4.3.0 | 11.10.2026 |
| E-26 | Geprüft: P-16 Version 3.2.0 – 1, 3–5, 8, 11, 12 ok; 2, 6, 7, 9, 10 → T-40 bis T-44 | Reiselogbuch 3.2.0 | 11.10.2026 |
| E-25 | Reiselogbuch 3.2.0: T-25 bis T-36 (Verlauf, iPhone wie iPad, Titel in der Leiste, Kacheln, Backup-Hinweis, nur Vordergrund reagiert, Fehlerbehebungen) | Reiselogbuch 3.2.0 · AppDesign 4.2.0 | 11.10.2026 |
| E-24 | Geprüft: P-15 Version 3.1.0 – 1–3, 6, 8, 11 ok; Rest → T-32 bis T-36 | Reiselogbuch 3.1.0 | 11.10.2026 |
| E-23 | Reiselogbuch 3.1.0: T-02 iPhone-Ansicht (AppDesign 4.1.0), T-24 Icons bei ‚Alle Tage‘/‚Nur erfasste Tage‘ | Reiselogbuch 3.1.0 · AppDesign 4.1.0 | 10.10.2026 |
| E-22 | Auf dem iPad geprüft und ok: P-14 Reiselogbuch 3.0.0 mit AppDesign 4.0.0 (auch offline) | Reiselogbuch 3.0.0 | 09.10.2026 |
| E-21 | Reiselogbuch 3.0.0: T-23 gemeinsame Bausteine aus dem Design-Repo AppDesign 4.0.0 (S-01, S-02) | Reiselogbuch 3.0.0 · AppDesign 4.0.0 | 09.10.2026 |
| E-20 | Auf dem iPad geprüft und ok: P-13 Version 2.4.0 (Menüs ohne Linien zwischen Punkten, Suchfeld ohne blauen Rahmen) | Reiselogbuch 2.4.0 | 09.10.2026 |
| E-19 | Reiselogbuch 2.4.0: T-20 Menüs ohne Linien zwischen Punkten, T-21 Suchfeld ohne blauen Rahmen | Reiselogbuch 2.4.0 · allgemein 3.6.1 · Reiselogbuch-Richtlinie 2.4.0 | 09.10.2026 |
| E-18 | Auf dem iPad geprüft: P-12 Version 2.3.0 ok bis auf 3 (Linien → T-20) und 4 (Suchfeld → T-21); Punkt 7 hat sich erledigt (verschaut) · T-19 Essen-Links mit mehr Abstand: **verworfen**, bleibt als bewusste Abweichung | Reiselogbuch 2.3.0 | 09.10.2026 |
| E-17 | Reiselogbuch 2.3.0 (Sammelversion HIG-Prüfung): T-07, T-10, T-11, T-12, T-13, T-14, T-15, T-16, T-17, T-18 | Reiselogbuch 2.3.0 · allgemein 3.6.0 · Reiselogbuch-Richtlinie 2.3.0 | 09.10.2026 |
| E-16 | Auf dem iPad geprüft und ok: P-11 Anführungszeichen ‚…‘, Teilen-Menü mit Strich | Reiselogbuch 2.2.2 | 09.10.2026 |
| E-15 | Reiselogbuch 2.2.2: T-09 Anführungszeichen ‚…‘ in der App, T-08 Teilen-Menü mit Strich | Reiselogbuch 2.2.2 · allgemein 3.4.1 · Reiselogbuch-Richtlinie 2.2.2 | 09.10.2026 |
| E-14 | Auf dem iPad geprüft und ok: P-09 Kontextmenü und Satz zum Speicher · P-10 Gewähltes bleibt blau, Menü mit Strich | Reiselogbuch 2.2.1 | 09.10.2026 |
| E-13 | Reiselogbuch 2.2.1: F-11 Gewähltes bleibt blau, solange es sichtbar ist (Seitenleiste, Tag, Fazit), F-12 Menü der Seitenleiste mit Strich und verständlichem Satz zum Speicher | Reiselogbuch 2.2.1 · allgemein 3.3.1 · Reiselogbuch-Richtlinie 2.2.1 | 09.10.2026 |
| E-12 | Reiselogbuch 2.2.0: T-01 Kontextmenü in der Seitenleiste, T-04 dauerhafter Speicher mit Hinweisen | Reiselogbuch 2.2.0 · allgemein 3.3.0 · Reiselogbuch-Richtlinie 2.2.0 | 09.10.2026 |
| E-11 | Auf dem iPad geprüft und ok: P-08 Tastatur offen – Kopfzeilen bleiben sichtbar | Reiselogbuch 2.1.5 | 08.10.2026 |
| E-10 | Reiselogbuch 2.1.5: F-10 Kopfzeilen bei sichtbarer Tastatur sichtbar | Reiselogbuch 2.1.5 · allgemein 3.2.3 | 08.10.2026 |
| E-09 | Auf dem iPad geprüft und ok: P-01 Datumsfelder · P-02 Seitenleiste hoch · P-03 Sprechblasen/Menüs · P-04 HTML/PDF, Backup · P-05 Version 2.1.0 · P-06 Version 2.1.1 · P-07 Version 2.1.2 | bis Reiselogbuch 2.1.4 | 08.10.2026 |
| E-08 | Reiselogbuch 2.1.4: F-09 Markierung in Auswahl-Kapseln rund (Kreis/Kapsel innen) mit Abstand | Reiselogbuch 2.1.4 · allgemein 3.2.2 | 08.10.2026 |
| E-07 | Reiselogbuch 2.1.3: F-08 Markierung in Auswahl-Kapseln nicht mehr abgeschnitten | Reiselogbuch 2.1.3 | 08.10.2026 |
| E-06 | Reiselogbuch 2.1.2: F-06 Seitenleiste beim Start eingeblendet, F-07 Abstand unten 4 px | Reiselogbuch 2.1.2 · allgemein 3.2.1 | 08.10.2026 |
| E-05 | Reiselogbuch 2.1.1: F-01 PDF ohne Seitenleiste, F-02 Suche, F-03 Wetter in der Ausgabe, F-04 Betragsfeld dynamisch, F-05 Auswahl-Kapseln | Reiselogbuch 2.1.1 · allgemein 3.2.0 · Reiselogbuch-Richtlinie 2.1.1 | 08.10.2026 |
| E-04 | Reiselogbuch 2.1.0: B-01 bis B-12 (schwebende Seitenleiste, immer „Alle Tage“, Kalender-Icon, ellipsis bleibt blau, „Backup erstellen“, Statistik „Nächte“, Beträge „4.850,00 €“ rechtsbündig, Tabellenüberschriften 17 px halbfett) | Reiselogbuch 2.1.0 · allgemein 3.1.0 · Reiselogbuch-Richtlinie 2.1.0 | 08.10.2026 |
| E-01 | Links zu den Apple Human Interface Guidelines je Abschnitt und Komponente | Designrichtlinie allgemein 3.0.1 | 08.10.2026 |
| E-02 | Regel „Apple-like entwickeln, Apple-Lösungen recherchieren und empfehlen“ | Zusammenarbeit allgemein 1.2.0 | 08.10.2026 |
| E-03 | Neues Bedienkonzept: Seitenleiste, Kopfzeile mit Kapsel, Menüs, Sprechblasen, Fenster mit x/Häkchen | Reiselogbuch 2.0.0 | 08.10.2026 |
