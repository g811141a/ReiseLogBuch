# Backlog – offene Themen

**Stand 11.10.2026** · Aktuelle Version: Reiselogbuch 3.1.0 · AppDesign 4.1.0

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

## 0. Nächste Version 3.2.0 – gesammelt, noch nicht gebaut

| Nr. | Prio | Thema | Gilt | bereit seit |
|---|---|---|---|---|
| T-25 | 2 | iPhone: Beim Hochschieben wandert der große Titel in die fest stehende Leiste (17 pt halbfett, Mitte) und bleibt dort, bis man wieder ganz nach unten zieht (wie Notizen) – Muster M320-2/4 | allgemein | 11.10.2026 |
| T-26 | 2 | Backup-Abfrage: ‚Backup mit 3 Reiselogbüchern laden?‘ (statt ‚Reiselogbuchern‘), danach Zeilenumbruch – iPad und iPhone | Reiselogbuch | 11.10.2026 |
| T-27 | 2 | iPhone-Startliste: plus wie am iPad in der Kapsel [`plus` \| `ellipsis`] oben – Muster M320-1 | allgemein | 11.10.2026 |
| T-28 | 1 | Fehler: Wischen in Fenstern, Menüs und Sprechblasen bewegt die Seite dahinter – künftig wirkt jedes Wischen und Tippen nur im Vordergrund | allgemein | 11.10.2026 |
| T-29 | 2 | Tastatur: Textfelder beginnen mit Großbuchstaben, Autokorrektur und Rechtschreibprüfung wie am iPad | Reiselogbuch | 11.10.2026 |
| T-30 | 1 | Fehler: ‚Letztes Backup erstellt am …‘ zeigte nach ‚Backup laden‘ den Zeitpunkt des anderen Geräts – gilt jetzt je Gerät | Reiselogbuch | 11.10.2026 |
| T-31 | 2 | Spracheingabe (iPad und iPhone) geht nicht: Fehlersuche – jede Störung wird mit Ursache und Abhilfe gemeldet; Mikrofon-Knöpfe bleiben | Reiselogbuch | 11.10.2026 |
| T-32 | 2 | Tageskacheln (iPhone): Felder durch Linien getrennt, waagrecht und senkrecht zwischen Bezeichnung und Inhalt (allgemein) · Begriff ‚Verlauf‘ statt ‚Programm‘ überall (Tabelle, Tageserfassung, Ausgabe, Einstellungen), auf dem iPhone in normaler Schrift – Muster M320-3b, M320-6, M320-8 | allgemein / Reiselogbuch | 11.10.2026 |
| T-33 | 1 | Fehler: x beim Öffnen eines Fensters blau umrandet (P-15/5 und /10) – kein Fokus-Rahmen mehr | allgemein | 11.10.2026 |
| T-34 | 2 | Suche auf dem iPhone wie am iPad: `search` in der Kapsel, Suchzeile darunter mit ‚1 von 4‘, ⓧ und ⌃ ⌄ – Muster M320-5 | allgemein | 11.10.2026 |
| T-35 | 2 | Startliste (iPhone): jedes Reiselogbuch als eigene Kachel, das zuletzt geöffnete blau · Backup-Hinweis fest am unteren Rand, gelb mit blau gefülltem Knopf, die Kacheln laufen dahinter durch · am iPad in der Seitenleiste ebenso fest unten und gelb – Muster M320-1a, M320-7 | allgemein | 11.10.2026 |
| T-36 | 1 | Fehler: Kapsel [PDF \| share] in der Vorschau auf dem iPhone zusammengedrückt (P-15/10) | allgemein | 11.10.2026 |

**12 Punkte bereit** · gebaut wird erst nach „Ja“

## 1. Auf iPad und iPhone prüfen

| Nr. | Prio | Thema | Status |
|---|---|---|---|
| P-15 | 1 | Version 3.1.0 geprüft (11.10.2026): 1–3, 6, 8, 11 ok · 4 → T-32 · 5 und 10 → T-33, T-36 · 7 → T-34 · 9 → T-35 · 12 erklärt; die Punkte kommen mit 3.2.0 erneut in die Prüfliste | geprüft |

## 2. Weitere Themen (in Klärung)

| Nr. | Prio | Thema | Gilt | Status |
|---|---|---|---|---|
| T-03 | 2 | Daten zwischen iPad und iPhone abgleichen über eine Datei in iCloud Drive (kostenlos; Mac vorhanden, kein Entwicklerkonto). Geklärt 10.10.2026: abwechselnd arbeiten · gleicher Tag auf beiden Geräten geändert → neuere Änderung gilt · gelöschte Reiselogbücher werden beim Abgleich auch gelöscht · Start über ‚Backup laden‘, danach Auswahl ‚Abgleichen‘ oder ‚Ersetzen‘. Dazu (11.10.2026): je Reiselogbuch ‚zuletzt geändert am … auf iPad/iPhone‘ anzeigen; beim Laden zeigen, ob das Backup älter oder neuer ist als die Daten auf dem Gerät. iPhone-Ansicht seit 3.1.0 vorhanden; als Nächstes Muster | allgemein | geklärt, Muster folgt |
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
