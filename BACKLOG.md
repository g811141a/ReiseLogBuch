# Backlog – offene Themen

**Stand 31.10.2026** · Aktuelle Version: Reiselogbuch 3.44.0 · AppDesign 4.46.0

Hier stehen alle offenen Themen. Erledigte Punkte wandern mit Version und Datum nach unten
in „Erledigt“. Claude erinnert zu Beginn und am Ende jeder Sitzung an die offenen Punkte
(siehe `README - Zusammenarbeit allgemein.md`).

Priorität: **1 hoch** (als Nächstes) · **2 mittel** · **3 niedrig** – gearbeitet wird immer an
den Themen mit der höchsten Priorität zuerst.

Status: **bereit** (fertig geklärt, kommt in die nächste Version) · **offen** (noch zu klären) ·
**prüfen** (auf dem iPad testen) · **später** (Idee, noch nicht dran)

Weg eines Punktes: 2. in Klärung → 0. Nächste Version → 1. Prüfen → Erledigt. Gebaut wird
gesammelt – Claude fragt erst, wenn ein Thema fertig ist oder 2–3 zusammengehörige Punkte (höchstens 2 Themen) bereit
sind (oder auf Wunsch); siehe `README - Zusammenarbeit allgemein.md`, 0 Nr. 8.

---

## 0. Nächste Version – gesammelt, noch nicht gebaut

| Nr. | Prio | Thema | Gilt | bereit seit |
|---|---|---|---|---|

0 Punkte bereit.

## 1. Auf iPad und iPhone prüfen

| Nr. | Prio | Thema | Status |
|---|---|---|---|

## 2. Weitere Themen (in Klärung)

| Nr. | Prio | Thema | Gilt | Status |
|---|---|---|---|---|
| RLB-6 | 3 | Ausschreibungstexte (Reiseveranstalter) in Reiselogbücher umwandeln – für erledigte **und** geplante Reisen: Titel, Zeitraum, Reisemittel; je Tag das Programm („1. Tag“ → echtes Datum, Text wie in der Ausschreibung); Quartiere mit Ort, falls genannt; übrige Felder bleiben leer | Reiselogbuch | offen |

## 3. Später

| Nr. | Prio | Thema | Gilt | Status |
|---|---|---|---|---|
| – | – | allgemeine Themen (z. B. Startseite) stehen jetzt im Backlog von AppDesign | – | – |

---

## Erledigt

| Nr. | Thema | Version | Datum |
|---|---|---|---|
| P-85 | **Usertest P-85 (3.44.0 · AppDesign 4.46.0): alles ok** – RLB-113, RLB-114 und APD-100 am Gerät bestätigt (Nutzer 31.10.2026, Sitzung 0065) | 3.44.0 | 31.10.2026 |
| RLB-113, RLB-114 | **RLB-113 ‚Reiselogbuch einstellen‘ statt ‚Einstellungen‘** (Mehr-Menü, Kontextmenü, Fenstertitel; Abweichung 4) und **RLB-114 Jahr des Reisebeginns als Kopf in der Seitenleiste bzw. Startliste** (AppDesign APD-100, R-7.6); neue Prüfungen `ablauf-einstellen` und `ablauf-jahre`, 13 Prüfungen umgestellt; Usertest P-85 | 3.44.0 | 31.10.2026 |
| P-84 | **Usertest P-84 (3.43.0 · AppDesign 4.45.0): alles ok** – APD-97 am Gerät bestätigt (Nutzer 31.10.2026, Sitzung 0063) | 3.43.0 | 31.10.2026 |
| APD-97 | **AppDesign APD-97 gebaut:** iPad hoch Seitenleiste fest neben dem Inhalt (ohne Abdunkelung, Gesten wie quer), Inhalt unter 700 px mit Tagen als Kästen (R-6.6); neue Prüfung `ablauf-seitenleiste-hoch`, 11 Prüfungen angepasst; Usertest P-84 | 3.43.0 | 31.10.2026 |
| P-83 | Geprüft **P-83 (3.42.1): alles ok** (Nutzer 30.10.2026, Sitzung 0059) | 3.42.1 | 30.10.2026 |
| RLB-112, P-82 | **RLB-112 (Korrektur aus P-82/1, /3, /5):** ‚Preis der Quartiere erfassen‘ allein einschalten und speichern; Kachel ‚🚶🏽‍♂️ km‘ und ‚Verlauf‘ normal, mittig zur ersten Zeile (AppDesign APD-98, R-6.5); Statistik ein Leerzeichen nach ‚Ø‘, Umbruch vor der Klammer, Ø linksbündig unter dem Wert – Usertest P-83 | 3.42.1 | 30.10.2026 |
| RLB-111 | **RLB-111 (Rückmeldung P-81/6, P-81/7):** Schalter ‚Preis der Quartiere erfassen‘ (Voreinstellung aus); Preis in Klammern hinter dem Quartier am Tag des Eintrags; Statistik mit Ø in Klammern (5 geschützte Leerzeichen, 2 nach ‚Ø‘), ohne Ø-Zeilen; Kilometer mit einer Nachkommastelle, Feld bündig rechts; Kachel ‚🚶🏽‍♂️km‘ – mit AppDesign 4.44.0 (APD-95 Bezeichnungen normal) – Usertest P-82 | 3.42.0 | 30.10.2026 |
| P-81 | Geprüft **P-81 (3.41.0): ok bis auf P-81/6 und P-81/7** (Nutzer 30.10.2026, Sitzung 0058) – umgesetzt als RLB-111 und AppDesign APD-95 | 3.41.0 | 30.10.2026 |
| RLB-108, RLB-109, RLB-110 | **RLB-108:** ‚Darstellung‘ im Mehr-Menü der Seitenleiste bzw. Startliste nach Backup (AppDesign APD-92) · **RLB-109:** Preis beim Quartier (erster Tag des Aufenthalts, Quartierliste ‚Preis‘, Statistik ‚Quartierkosten‘ und ‚Ø je Nacht‘) · **RLB-110:** Spalte ‚Gegangene Kilometer‘ (Einstellung, Schritt mit schmalem Feld bis 99 – AppDesign APD-93, Spalte 🚶🏽‍♂️km, iPhone-Zeile, Statistik, Ausgabe) · AppDesign 4.43.0: ‚Suchen‘ im Mehr-Menü, x ‚Suche beenden‘, ⌘F (APD-91) · Usertest P-81 | 3.41.0 | 30.10.2026 |
| P-80 | Geprüft **P-80 (3.40.0): alles ok** (Nutzer 30.10.2026, Sitzung 0056) – Mehr-Knopf offen senkrecht und blau, Reisemittel brechen nur nach dem Komma (auch PDF) | 3.40.0 | 30.10.2026 |
| 3.40.0 | AppDesign 4.42.0: Mehr-Knopf offen senkrecht und blau (APD-87), Reisemittel – Icon und Name bleiben zusammen, auch in der Ausgabe (APD-90), Prüflauf wiederholt rote Läufe einmal allein (APD-85 Teil 1) · Usertest P-80 | 3.40.0 | 30.10.2026 |
| P-79 | Geprüft **P-79 (3.39.0): alles ok** (Nutzer 30.10.2026, Sitzung 0054) – ⓧ in Verlauf, ‚Wie war was?‘, Essen und Trinken und Fazit, Rückgängig mit Undo-Taste, drei Fingern und Schütteln, auch im Reisetitel (AppDesign APD-81 bestätigt) | 3.39.0 | 30.10.2026 |
| APD-81, APD-89 | AppDesign 4.41.0 im Reiselogbuch: das ⓧ auch in Verlauf, ‚Wie war was?‘, Essen und Trinken und Fazit (mehr als eine Zeile mit Sprechblase ‚Text löschen?‘), Rückgängig nach dem ⓧ in allen Feldern; Zusammenarbeit 3.1.0 (Regeln nur mit Genehmigung); Prüfung `regeln-ablauf` | 3.39.0 | 30.10.2026 |
| P-78, P-77 | Geprüft **P-78 (3.38.0): alles ok** – Reisemittel am iPhone als Wischzeile mit Verlauf und Pfeilen, ‚Messung starten‘ erst nach langem Drücken, nach dem Neustart wieder versteckt (AppDesign APD-86 und APD-77 bestätigt) · **P-77 (3.37.0): alles ok** – /0–/2 in Sitzung 0052, /3 Regelwächter in der Sitzung 0053 (Antwort ohne Fenster mit APD-84/W-4 zurückgewiesen) | 3.38.0 | 29.10.2026 |
| APD-86, APD-77 | AppDesign 4.40.0 im Reiselogbuch: die Zeile ‚Reisemittel‘ am iPhone als Wischzeile mit Verlauf und Pfeilen (deine Rückmeldung 29.10.2026, Prüfung `ablauf-reisemittel-zeile`); ‚Messung starten‘ erst nach langem Drücken auf die Versionszeile | 3.38.0 | 29.10.2026 |
| RLB-107 | Prüfung `ablauf-fenster-breite` (Rückmeldung P-76/4) im vollen Lauf, mit der Korrektur AppDesign APD-83 | 3.37.0 | 26.10.2026 |
| P-76 | Geprüft **P-76 (3.36.0)**: nicht ok bei /4 Schritt 3 – mit dem ersten Buchstaben im Reisetitel wird ‚Neues Reiselogbuch‘ am iPad breiter (→ AppDesign APD-83, RLB-107); alle übrigen ok (AppDesign APD-72 bestätigt) | 3.36.0 | 26.10.2026 |
| RLB-103 | **RLB-103 `ablauf-tastatur-still` repariert und im vollen Lauf:** das Beenden der Messung im Menü wird nicht mehr nachgespielt (AppDesign `abspielen.mjs`), Messung 26.10.2026 (iPhone quer, Tag, ‚Ort‘, ‚Quartier‘, Tastatur zu) aufgenommen, Safari-Modell danach ausgerichtet (die 17 Fehler waren eine Abweichung des Modells), feste Zeitgrenze nur noch für 19.10.; dazu AppDesign APD-72 (iPad: Fenster nach unten ziehen), `ablauf-blatt` am iPad | 3.36.0 | 26.10.2026 |
| P-75 | Geprüft **P-75 (3.35.0)**: alles ok – Version, Standard wie bisher, iPhone bis AX5, iPad Tage als Kästen ab AX1, Wechsel bei offenem Fenster, xS und Notiz bei AX5, Einstellung pro App (/6: die Einstellung für Safari wirkt auch auf die Web-App), Mac (RLB-101 und AppDesign APD-43 Teil 2 bestätigt) | 3.35.0 | 25.10.2026 |
| RLB-101 | **RLB-101 (AppDesign APD-43 Teil 2): Textgröße folgt dem Gerät** – die 6 eigenen Schriftgrößen als Textstile, iPad ab AX1 Tage als Kästen (`dayBoxesHtml`, wie am iPhone) und Quartierliste als Liste, Reisedaten untereinander, Betragsfeld in Zeichenbreite, Wetter 40 px nur bei Standard; Prüfung `text-regeln.mjs`, hig und Abläufe in mehreren Textgrößen | Reiselogbuch 3.35.0 · AppDesign 4.37.0 | 25.10.2026 |
| P-74 | Geprüft **P-74 (3.34.0)**: alles ok – Version, Nummernschema im Backlog AppDesign, Tabelle ‚Nummern und Präfixe‘, Uhrzeitzeile (AppDesign APD-78 und APD-79 abgeschlossen) | 3.34.0 | 25.10.2026 |
| APD-78 | **AppDesign APD-78 Nummernschema:** Themen RLB-n (bisher T-), Erledigt ohne eigene Nummer, Begriffe Usertest / Testfälle P-n / Testfall-Liste in Backlog, CHANGELOG, PROMPT.md, Richtlinie und Prüfungen; Fassung 4.36.0 (Doku-Prüfung mit `checkSchema`) | Reiselogbuch 3.34.0 · AppDesign 4.36.0 | 25.10.2026 |
| P-73 | Geprüft **P-73 (3.33.0)**: alles ok – kein blauer Rahmen in Textfeldern, Sprechblase schließt die Tastatur, Hardware-Tastatur, Fehlermeldung beim Häkchen, ‚Kontrast erhöhen‘, ‚Bewegung reduzieren‘ (**RLB-100 abgeschlossen**); neue Wünsche in AppDesign APD-80 (Kontrast dunkel) und APD-81 (ⓧ in mehrzeiligen Feldern) | 3.33.0 | 25.10.2026 |
| RLB-100 | **RLB-100 (AppDesign APD-43 Teil 1):** kein blauer Rahmen mehr in Textfeldern, Hardware-Tastatur in Menüs, Sprechblasen und Fenstern, VoiceOver-Namen und Ansagen (Suche, Seitenleiste, Fehlermeldungen, offline), Fehlermeldungen über `feldFehler` mit Fokus beim Häkchen, ‚Kontrast erhöhen‘ und ‚Bewegung reduzieren‘ (Sprung zum Fehler springt); neue Prüfung `ablauf-bedienung.mjs` mit Gegenprobe `bedienung`; Usertest P-73 | 3.33.0 | 25.10.2026 |
| P-72 | Geprüft **P-72 (3.32.0)**: alles ok – Kachel nach dem Backup weg, Mehr-Menü mit heutigem Datum, offline nur die graue Zeile, Abgleich zählt nicht, Kontextmenü ohne Kachel ganz sichtbar (**RLB-105 abgeschlossen**) | 3.32.0 | 24.10.2026 |
| RLB-105 | **RLB-105 (AppDesign APD-74):** die gelbe Backup-Kachel steht nur noch, solange heute auf diesem Gerät kein Backup erstellt wurde; danach verschwindet sie (Fokus auf ‚Mehr‘), um 0:00 bzw. bei der Rückkehr am neuen Tag kommt sie wieder; Abgleich zählt nicht; Offline-Zeile auch ohne Kachel und bei leerer Liste; neue Prüfung `ablauf-backup-kachel.mjs` (gegen 3.31.0 rot); Usertest P-72 | 3.32.0 | 24.10.2026 |
| P-71 | Geprüft **P-71 (3.31.0)**: alles ok – Pfeile an der Reisemittel-Kapsel am Anfang, in der Mitte und am Ende, quer und gedreht; Smiley-Leiste ziehen ohne Abfrage, langes Drücken und Antippen wie bisher (**RLB-106 abgeschlossen**) | Reiselogbuch 3.31.0 | 24.10.2026 |
| RLB-106 | **RLB-106 (AppDesign APD-75) und AppDesign APD-76:** in der Auswahl-Kapsel (Reisemittel, Wetter, Smileys) steht, wo es weitergeht, im Verlauf (48 px) ein kleiner Pfeil ‹ bzw. ›, der am jeweiligen Ende ausblendet; Ziehen der Smiley-Leiste löst keine Lösch-Abfrage mehr aus (langes Drücken nur auf derselben Stelle); neue Prüfungen `ablauf-kapsel-pfeile.mjs` und `ablauf-smiley-leiste.mjs` (L1 rot gegen 3.30.2). Wartet auf P-71 | Reiselogbuch 3.31.0 | 24.10.2026 |
| P-70 | Geprüft **P-70 (3.30.2)**: alles ok – ein Zug neben dem Feld erst nach oben, dann nach unten schließt die Tastatur; quer sind Umrandung und Schatten im Verlauf, Fazit und Titel ganz zu sehen; sonst unverändert (**RLB-104 abgeschlossen**) | Reiselogbuch 3.30.2 | 24.10.2026 |
| RLB-104 | **RLB-104 (AppDesign APD-73, Korrektur):** auf dem iPhone schließt ein Zug neben dem Feld die Tastatur auch, wenn der Finger zuerst nach oben geht; quer steht ein großes Feld mit Fokus so weit unter der Kopfzeile, dass Umrandung und Schatten ganz zu sehen sind; `ablauf-blatt.mjs` B19 ‚erst nach oben‘ und B10 Abstand über dem Feld (rot gegen 3.30.1). Wartet auf P-70 | Reiselogbuch 3.30.2 | 24.10.2026 |
| P-69 | Geprüft **P-69 (3.30.1)**: /0–/2 ok – ein Zug auf einem Feld bei offener Tastatur zieht das Blatt (**RLB-102 abgeschlossen**); /3 nicht ok: Fokusring quer oben abgeschnitten, Tastatur geht beim Zug am linken Rand nicht zu (→ AppDesign APD-73) | Reiselogbuch 3.30.1 | 24.10.2026 |
| RLB-102 | **RLB-102 (AppDesign APD-71, Korrektur):** auf dem iPhone zieht ein Zug auf einem Feld bei offener Tastatur das Blatt im selben Zug – Tastatur zu, mit Änderungen federt es zurück und fragt ‚Änderungen verwerfen‘; `ablauf-blatt.mjs` prüft B10 und B19 mit Tastatur (Safari-Modell, rot gegen 3.30.0). Wartet auf P-69 | Reiselogbuch 3.30.1 | 24.10.2026 |
| P-68 | Geprüft **P-68 (3.30.0)**: alles ok bis auf /2.3 – Blatt öffnen und wegziehen, Rückfrage, Tastatur, Vorschau, Drehen, iPad unverändert, Startposition (**RLB-98 abgeschlossen**); /2.3 Ziehen auf einem Feld schließt nur die Tastatur, erst der zweite Zug fragt (→ RLB-102) | Reiselogbuch 3.30.0 | 23.10.2026 |
| RLB-98, RLB-99 | **RLB-98 und RLB-99 (AppDesign APD-69, APD-61 Teil 2):** Startposition beim Öffnen – läuft die Reise und ist bis heute alles erfasst, steht heute oben ohne Gelb, eine Reise in der Zukunft öffnet ganz oben, Gelb nur bis heute (`oeffnen-position.mjs` mit festem Datum, rot gegen 3.29.0 bei F5–F11); auf dem iPhone sind Erfassen, Einstellungen, Neues Reiselogbuch, Fazit und Vorschau ein Blatt – nach unten ziehen schließt, mit Änderungen fragt es wie x (neu `ablauf-blatt.mjs`). Wartet auf P-68 | Reiselogbuch 3.30.0 · AppDesign 4.32.0 | 23.10.2026 |
| P-67 | Geprüft **P-67 (3.29.0)**: alles ok – Seitenleiste am iPad quer hereinwischen, Vorrang und panel-left, keine doppelten Leerzeichen, Großschreibung zurücknehmen (AppDesign APD-68, APD-64, APD-65 abgeschlossen) | Reiselogbuch 3.29.0 | 23.10.2026 |
| APD-68, APD-64, APD-65 | **AppDesign APD-68, APD-64, APD-65:** Seitenleiste am iPad quer per Wischen (Variante B), keine doppelten Leerzeichen, keine erzwungene Großschreibung nach einer Korrektur von Hand; `ablauf-navigation.mjs` mit iPad quer, `regeln-ablauf.mjs` mit `checkSpaces`. Wartet auf P-67 | Reiselogbuch 3.29.0 | 23.10.2026 |
| P-66 | Geprüft **P-66 (3.28.2)**: alles ok – Zurückwischen über und neben den Tageskästen, Rollen, Seitenleiste am iPad hoch (AppDesign APD-67 abgeschlossen) | Reiselogbuch 3.28.2 | 23.10.2026 |
| APD-67 | **AppDesign APD-67 Korrektur:** Zurückwischen über und neben den Tageskästen bricht nicht mehr ab (Safari rollte ab 10 px senkrecht dazwischen); `ablauf-navigation.mjs` mit Berührung nach Safari (`kasten: #app .box.day`). Wartet auf P-66 | Reiselogbuch 3.28.2 · AppDesign 4.30.2 | 23.10.2026 |
| P-65 | Geprüft **P-65 (3.28.1)**: /2 nicht ok – Messung ausgewertet (Safari bricht ab 10 px senkrecht ab) → Korrektur 3.28.2 | Reiselogbuch 3.28.1 | 23.10.2026 |
| P-64 | Geprüft **P-64 (3.28.0)**: alles ok bis auf /5 – weiter in P-65 | Reiselogbuch 3.28.0 | 23.10.2026 |
| APD-67, APD-66 | **AppDesign APD-67 Schritt 1 und APD-66:** Fassung 4.30.1 – der Messmodus zeichnet Berührungen und die Entscheidungen der Wischgeste auf; `ablauf-navigation.mjs` prüft die Messzeilen (APD-67/F-22) und wartet das Ende der Bewegung ab. Wartet auf P-65 | Reiselogbuch 3.28.1 · AppDesign 4.30.1 | 22.10.2026 |
| APD-37, APD-61 | **AppDesign APD-37 B+C und APD-61 Teil 1:** Marken `data-marke` an Tagen (‚Tag 19 · Fr 20.03.‘) und an Fazit, Quartierliste, Statistik; Seitenwechsel und Gesten über `navAnmelden()` (Zurück-Knopf, Öffnen aus der Startliste, panel-left und Abdunkelung am iPad hoch); Fassung 4.30.0; Prüfungen `ablauf-navigation.mjs` (neu), `kapsel-iphone.mjs` (Griff, Marken, 365 Tage). Wartet auf P-64 | Reiselogbuch 3.28.0 · AppDesign 4.30.0 | 22.10.2026 |
| P-63 | Geprüft **P-63: alles ok** (Nutzer 22.10.2026) – Version 3.27.0 mit AppDesign 4.29.0; **AppDesign APD-63 abgeschlossen** | Reiselogbuch 3.27.0 · AppDesign 4.29.0 | 22.10.2026 |
| APD-63 | **AppDesign APD-63 Paket C:** Suche ohne Akzente, ⓧ in Titel, Teilnehmer, Ort, Quartier und Gesamtausgaben, Schalter mit `switch` (Safaris Schalter), sichere Ränder (Fenster am iPad, Menü und Sprechblase am iPhone quer); Fassung 4.29.0; Prüfungen `regeln-ablauf.mjs` (ⓧ), `ablauf-suche-woerter.mjs` (Akzente), `hig.mjs` (Ränder, Schalter). Wartet auf P-63 | Reiselogbuch 3.27.0 · AppDesign 4.29.0 | 22.10.2026 |
| P-62 | Geprüft **P-62: alles ok** (Nutzer 21.10.2026) – Version 3.26.2 mit AppDesign 4.28.2, App unverändert; **AppDesign APD-39 abgeschlossen** | Reiselogbuch 3.26.2 · AppDesign 4.28.2 | 21.10.2026 |
| APD-39 | **AppDesign APD-39 Konsolidierung:** Designrichtlinie Reiselogbuch nur noch Abweichungen, PROMPT.md als gegliederte Funktionsbeschreibung mit allen Ausprägungen, CLAUDE.md 3.6.0, tests/README mit Regel je Prüfung | Reiselogbuch 3.26.2 · AppDesign 4.28.2 | 21.10.2026 |
| P-61 | Geprüft **P-61: alles ok** (Nutzer 21.10.2026, mit Messungen) – **RLB-97 abgeschlossen**: Tastatur ohne Springen, Gesamtausgaben über der Tastatur, iPhone quer niedrige Leisten | Reiselogbuch 3.26.1 | 21.10.2026 |
| RLB-97 | **RLB-97 korrigiert (AppDesign APD-36):** Tastatur ohne Springen – Fassung 4.28.1; `ablauf-tastatur-still.mjs` mit allen vier Lagen, Tastatur-Taste, ‚Nach oben‘ bei offener Tastatur, kurzem Inhalt und Wischen (gegen 3.26.0 rot, jetzt grün). Wartet auf P-61 | Reiselogbuch 3.26.1 | 21.10.2026 |
| RLB-95 | **RLB-95 abgeschlossen:** (3) Datumsfeld ‚Tag antippen übernimmt und schließt‘ **entfällt** (AppDesign APD-26, Nutzer 20.10.2026: Safari meldet nur den Wert – in drei Fällen bliebe die Auswahl offen; ‚wenn nicht alles funktioniert, bauen wir es so nicht ein‘). Datumsfelder bleiben wie bisher | – | 20.10.2026 |
| RLB-97 | **RLB-97 gebaut (AppDesign APD-35, APD-31):** Gesamtausgaben steht bei offener Tastatur ganz sichtbar über ihr (`fieldIntoView`, R-4.5); `ablauf-feld-tastatur.mjs` (Ablauf der Messung, gegen 3.25.1 rot) und `ablauf-abspielen.mjs` (Messung nachgespielt, Gegenprobe); Fassung 4.28.0. Wartet auf P-60 | Reiselogbuch 3.26.0 | 20.10.2026 |
| P-59 | Geprüft P-59: alles ok – **RLB-96 abgeschlossen** (Kapsel am iPhone quer mit Tastatur ausgeblendet, kommt nach dem Schließen wieder) | Reiselogbuch 3.25.1 | 19.10.2026 |
| RLB-96 | **RLB-96 gebaut (AppDesign APD-33, Weg A):** die Kapsel ‚Nach oben / Ans Ende‘ überdeckt nie Kopf- oder Suchzeile, am iPhone quer mit offener Tastatur ausgeblendet; Inhalt endet quer über der Tastatur; `kapsel-iphone.mjs` mit dem Ablauf aus P-58/2 (gegen 3.25.0 rot, jetzt grün); Fassung 4.27.1. Wartet auf P-59 | Reiselogbuch 3.25.1 | 19.10.2026 |
| P-58 | Geprüft P-58: /0, /1, /3–/6 ok – **Zittern beim Suchen am iPhone weg, RLB-95 (1) abgeschlossen** (Messung: Seite rollt nie, Kopf- und Suchzeile stehen in jeder Zeile still); /2 nicht ok (Kapsel verdeckt quer mit Tastatur ⌄) → RLB-96 | Reiselogbuch 3.25.0 | 19.10.2026 |
| RLB-95 | **Umbau B gebaut (RLB-95 (1), AppDesign APD-28 B1 und APD-29):** nur der Inhalt rollt (Rollbereich unter Kopf- und Suchzeile, endet über der Tastatur), Lupe und ⓧ rollen nach oben, Nach oben / Ans Ende im Inhalt; `ablauf-suche-iphone.mjs` grün (vorher rot), neue Prüfungen in `regeln-ablauf.mjs` (Suche nach oben, Kapsel, Drucken); Fassung 4.27.0. RLB-95 (1) wartet auf P-58 | Reiselogbuch 3.25.0 | 19.10.2026 |
| P-57 | Geprüft P-57: alles ok (Messungen iPhone hoch und quer, iPad); Ursache des Zitterns gemessen (Hin und Her beim Rollen zum Treffer, AppDesign `arbeit/APD-27 Auswertung P-57.md`); weiter mit Umbau B (APD-28) | Reiselogbuch 3.24.0 | 19.10.2026 |
| RLB-95 | **Messmodus gebaut (RLB-95 (1), AppDesign APD-27):** ‚Messung starten‘ / ‚Messung beenden und teilen‘ im Mehr-Menü der Seitenleiste; neue feste Prüfung `tests/ablauf-messung.mjs`; Fassung 4.26.0 | Reiselogbuch 3.24.0 | 19.10.2026 |
| P-56 | Geprüft P-56: /0, /3, /4 ok (Markierung als Kreis, iPad unverändert, ein Backup); /1, /2 nicht ok → RLB-95 (1) offen | Reiselogbuch 3.23.1 | 19.10.2026 |
| RLB-95 | **RLB-95 (1) und (2) gebaut:** Suchfeld bleibt beim Tippen (Kopf- und Suchzeile zittern am iPhone nicht mehr), Markierung in Kapseln als Kreis 36 × 36; neue feste Prüfung `tests/ablauf-suche-iphone.mjs` (rot gegen 3.23.0); Fassung 4.25.1 | Reiselogbuch 3.23.1 | 19.10.2026 |
| P-55 | Geprüft: P-55 alles in Ordnung; **RLB-93 damit abgeschlossen** | Reiselogbuch 3.23.0 | 18.10.2026 |
| RLB-93 | **RLB-93 gebaut:** Suche mit mehreren Wörtern (alle irgendwo im Reiselogbuch, gezeigt die Tage mit einem Wort), „…“ als genaue Folge, Lupe am Ende der Kapsel [+ \| Lupe \| …]; neue Prüfung `tests/ablauf-suche-woerter.mjs`; Fassung 4.25.0 | Reiselogbuch 3.23.0 | 18.10.2026 |
| P-54 | Geprüft: P-54 alles in Ordnung (Hervorhebung, ‚Tour …‘, ‚Sonstiges …‘, Aufbau der Vorschläge); **RLB-94 damit abgeschlossen** | Reiselogbuch 3.22.0 | 18.10.2026 |
| RLB-94 | **RLB-94 gebaut:** Verlauf mit ‚Tour …‘ und ‚Sonstiges …‘ (leere erste Zeile, Cursor dorthin); Hervorhebung nach dem Fenster 2 s + 1 s (AppDesign APD-23); neue Prüfung `tests/verlauf-vorschlaege.mjs`; Fassung 4.24.0 | Reiselogbuch 3.22.0 | 18.10.2026 |
| P-53 | Geprüft: P-53 alles in Ordnung (Liste steht still: tiefer erfassen, vorblättern, iPhone, Wischen frei); **RLB-92 damit abgeschlossen** | Reiselogbuch 3.21.2 | 18.10.2026 |
| RLB 3.21.2 | **Korrektur R-7.3 gebaut (P-52/2–4):** oben bleibt derselbe Tag – auch nach ‹ ›; neue feste Prüfung `tests/ablauf-liste-still.mjs` (deine Abläufe, Safari-Tastatur einzeln und zusammen); Fassung 4.23.2 | Reiselogbuch 3.21.2 | 18.10.2026 |
| P-52 | Geprüft: P-52/0–1 in Ordnung; **P-52/2–4 nicht ok** (Liste rückt nach dem Erfassen eines tieferen Tages bzw. nach ‹ › weg, iPad und iPhone) → Korrektur 3.21.2 | Reiselogbuch 3.21.1 | 18.10.2026 |
| RLB 3.21.1 | **Korrektur R-7.3 gebaut (P-51/5):** oberste Zeile beim Öffnen des Fensters ‚Tag‘ merken und danach genau dort ausrichten; gerollt wird nur nach ‹ ›; Fassung 4.23.1 | Reiselogbuch 3.21.1 | 18.10.2026 |
| P-51 | Geprüft: P-51/0–4 in Ordnung; **P-51/5 nicht ok** (Liste rückt nach dem Fenster ‚Tag‘ 1–3 Zeilen hoch, auch mit x, sobald die Tastatur offen war) → Korrektur 3.21.1 | Reiselogbuch 3.21.0 | 18.10.2026 |
| RLB-92 | **RLB-92 gebaut:** Suche über alle Reiselogbücher in Startliste/Seitenleiste (Lupe, Filter, ‚N Treffer‘, Öffnen mit gefüllter Suche, beide Suchfelder 1:1); Fassung 4.23.0 | Reiselogbuch 3.21.0 | 17.10.2026 |
| RLB-91 | **RLB-91 verworfen (Nutzer, 17.10.2026):** Tastatur im Fenster ‚Tag‘ – Mitfahren beim ersten Hochfahren kommt von Safari; Messungen in AppDesign-Sitzung 0010, Messseiten entfernt (AppDesign APD-18) | – | 17.10.2026 |
| P-49 | Geprüft: P-49 alles in Ordnung (Drehen am Ende der Seite); **RLB-89 und RLB-90 damit abgeschlossen** | Reiselogbuch 3.20.1 | 17.10.2026 |
| RLB 3.20.1 | Korrektur 3.20.1: Drehen am Ende der Seite – ganz unten bleibt ganz unten (aus P-48/3; Ursache: am Ende kein Tag als Anker) | Reiselogbuch 3.20.1 | 17.10.2026 |
| P-48 | Geprüft: P-48/0–2 in Ordnung (Öffnen iPad und iPhone, Seitenleiste ein/aus); **P-48/3 nicht ok** (Drehen am Ende) → Korrektur 3.20.1 | Reiselogbuch 3.20.0 | 17.10.2026 |
| RLB-89, RLB-90 | RLB-89 und RLB-90 gebaut: beim Öffnen ganz oben bzw. erster offener Tag direkt unter dem Kopf; Seitenleiste ein/aus hält den obersten Tag | Reiselogbuch 3.20.0 | 17.10.2026 |
| P-47 | Geprüft: P-47 alles in Ordnung (Kapsel ‚Nach oben / Ans Ende‘ auf dem iPhone) | Reiselogbuch 3.19.0 | 17.10.2026 |
| APD-15 | AppDesign APD-15 übernommen: Kapsel ‚Nach oben / Ans Ende‘ auch auf dem iPhone (im Reiselogbuch, nicht in der Startliste) | Reiselogbuch 3.19.0 | 17.10.2026 |
| P-46 | Geprüft: P-46 alles in Ordnung (Link nur über den Namen); **RLB-86 damit abgeschlossen** | Reiselogbuch 3.18.0 | 17.10.2026 |
| RLB-86 | RLB-86 gebaut: Maps-Link nur über den Namen – endet an ‚ – ‘, Komma, Doppelpunkt, Klammer (nicht vor einer Ziffer), Essen und Quartier | Reiselogbuch 3.18.0 | 17.10.2026 |
| P-45 | Geprüft: P-45 alles in Ordnung (Eingabetaste ‚Fertig‘, iPhone ✓ über der Zifferntastatur – Farbe des ✓ bestimmt iOS, nicht änderbar; zuletzt verwendetes Reiselogbuch); **RLB-87 und RLB-88 damit abgeschlossen** | Reiselogbuch 3.17.0 | 17.10.2026 |
| RLB-87, RLB-88 | RLB-87 und RLB-88 gebaut: Eingabetaste ‚Fertig‘ schließt die Tastatur in einzeiligen Feldern (Fenster bleiben offen – vorher schloss die Eingabetaste das Fenster), zuletzt verwendetes Reiselogbuch öffnet beim Start (iPad-Aufbau) | Reiselogbuch 3.17.0 | 17.10.2026 |
| RLB-85 | RLB-85 geschlossen ohne Bau: Emoji-Taste statt Weltkugel kann eine Web-App nicht steuern – iOS zeigt die Emoji-Taste, wenn nur eine Tastatur-Sprache plus Emoji eingerichtet ist (Einstellungen → Allgemein → Tastatur → Tastaturen) | – | 17.10.2026 |
| P-44 | Geprüft: P-44 alles in Ordnung (Tabelle steht still beim Erfassen, iPad und iPhone) | Reiselogbuch 3.16.0 | 17.10.2026 |
| APD-13 | APD-13: Tabelle bzw. Tageskästen stehen still, solange das Fenster ‚Tag‘ offen ist; danach wie vorher, Zeile kurz blau, nach ‹ › sichtbar (AppDesign R-7.3) | Reiselogbuch 3.16.0 | 16.10.2026 |
| RLB-5 | RLB-5 Alte Reiselogbücher importieren: Werkzeug im privaten Repo `ReiseLogBuch-Import`, erste Konvertierung geladen (‚Backup laden‘ → ‚Abgleichen‘) und geprüft – alles in Ordnung; weitere Konvertierungen bei Bedarf über die Startfrage | ReiseLogBuch-Import 1.2.1 | 16.10.2026 |
| P-42 | Geprüft: P-42 alles in Ordnung (Version, Offline-Start nach dem Update auf iPad und iPhone) | Reiselogbuch 3.15.1 | 16.10.2026 |
| APD-10 | Reiselogbuch 3.15.1: auf AppDesign-Fassung 4.16.1 gehoben (APD-10, Prüflauf mit höchstens 4 Browsern) | Reiselogbuch 3.15.1 | 15.10.2026 |
| P-41 | Geprüft: P-41 alles in Ordnung (Version, iPhone hoch/quer startet in der Startliste ohne blauen Eintrag, kurz weg und zurück, Öffnen und Zurück, iPad unverändert); **RLB-84 damit abgeschlossen** | Reiselogbuch 3.15.0 | 15.10.2026 |
| RLB-84 | Reiselogbuch 3.15.0: RLB-84 – Start im iPhone-Aufbau in der Startliste ohne blauen Eintrag (allgemein R-7.2), Prüfung `start-regeln.mjs` RLB-84/F-1 bis F-18 | Reiselogbuch 3.15.0 | 15.10.2026 |
| P-40 | Geprüft: P-40 alles in Ordnung (Version, iPad offline/online bei offener App) | Reiselogbuch 3.14.1 | 15.10.2026 |
| RLB 3.14.1 | Reiselogbuch 3.14.1: Korrektur zu P-39/1 und /2 – iPad erkennt den Wechsel bei offener App (Nachfrage alle 10 s), Prüfung APD-6/F-17 | Reiselogbuch 3.14.1 | 15.10.2026 |
| P-39 | Geprüft: P-39 ok bis auf /1 und /2 (iPad: keine Meldung beim Wechsel bei offener App) | Reiselogbuch 3.14.0 | 15.10.2026 |
| APD-6 | Reiselogbuch 3.14.0: Offline-Hinweis (APD-6 Variante c, R-1.5) – graue Zeile unter der Backup-Kachel, kurze Meldung beim Wechsel und beim Start ohne Netz, Service Worker meldet ‚aus dem Speicher‘, Prüfung APD-6/F-1 bis F-16 | Reiselogbuch 3.14.0 | 15.10.2026 |
| P-38 | Geprüft: P-38 alles in Ordnung (Version, Quartier-Kopf iPhone quer/hoch, offline iPad und iPhone) | Reiselogbuch 3.13.2 | 15.10.2026 |
| RLB 3.13.2 | Reiselogbuch 3.13.2: Quartier-Kopf als Gruppe (iPhone quer in einer Zeile), Offline-Start mit Frist 3 s (iPad weiße Seite), Prüfung `offline-regeln.mjs` | Reiselogbuch 3.13.2 | 14.10.2026 |
| RLB 3.13.1 | Reiselogbuch 3.13.1: README-Links auf den Richtlinien-Text in `fassung/4.14.1/` statt auf eine Git-Markierung (Korrektur) | Reiselogbuch 3.13.1 | 14.10.2026 |
| APD-5 | Reiselogbuch 3.13.0: APD-5 Version B – lädt die feste AppDesign-Fassung `fassung/4.14.0/`, Prüfskripte mit den Prüfungen dieser Fassung, Versionen mit dem Veröffentlichungs-Skript | Reiselogbuch 3.13.0 | 14.10.2026 |
| P-35 | Geprüft: P-35 alles in Ordnung (Version, kurzer Quartiername neben dem Namen antippen) | Reiselogbuch 3.12.0 | 14.10.2026 |
| APD-5 | Reiselogbuch 3.12.0: APD-5 Version A – alle Prüfskripte melden Fehler, Grundregeln nach jedem Schritt, parallel in Chromium und WebKit (`tests/alle.mjs`); Quartier-Link mit unsichtbarer Antippfläche 44 px (R-3.1) | Reiselogbuch 3.12.0 | 14.10.2026 |
| P-34 | Geprüft: P-34 alles in Ordnung | Reiselogbuch 3.11.7 | 14.10.2026 |
| APD-2 | Reiselogbuch 3.11.7: APD-2 Schritte 3 und 4 – Richtlinie mit Verweisen, PROMPT und CLAUDE.md nachgeführt, Vorschau-Prüfung auch iPad hoch und iPhone quer | Reiselogbuch 3.11.7 | 14.10.2026 |
| P-33 | Geprüft: P-33 alles in Ordnung | Reiselogbuch 3.11.6 | 14.10.2026 |
| RLB 3.11.6 | Reiselogbuch 3.11.6: Korrekturen aus P-32 (Reisemittel mit Namen im Abgleichbericht, Seitenleiste bei offener Tastatur, feste Spaltenanteile der Ausgabe) und ‚Gesamtausgaben‘ – je mit geschärfter Prüfung | Reiselogbuch 3.11.6 · AppDesign 4.12.1 | 14.10.2026 |
| P-32 | Geprüft: P-32 – 0 und 3 ok; 1 (Reisemittel klein im Bericht), 2 (Seitenleiste rückt bei der Suche), 4 (letzte Spalte der Vorschau gequetscht) nicht ok → 3.11.6 | Reiselogbuch 3.11.5 | 14.10.2026 |
| RLB-83 | Reiselogbuch 3.11.5: RLB-83 Feldname ‚Reisemittel‘ im Abgleichbericht (R-10.1, mit Prüfung); Prüfskripte auf den neuen Regelkatalog (AppDesign 4.12.0, APD-2a) | Reiselogbuch 3.11.5 · AppDesign 4.12.0 | 14.10.2026 |
| P-31 | Geprüft: P-31 alles in Ordnung | Reiselogbuch 3.11.4 | 14.10.2026 |
| RLB-82 | Reiselogbuch 3.11.4: RLB-82 Zebra je Tabellenzeile – zusammengefasste erste Spalte gilt als eine Zeile (R-52); Fehler in 3.11.3 vom Nutzer vor dem Test gefunden | Reiselogbuch 3.11.4 · AppDesign 4.11.4 | 14.10.2026 |
| RLB-81 | Reiselogbuch 3.11.3: RLB-81 Abgleichbericht-Tabelle = Mustertabelle der Ausgabe (gemeinsamer Baustein, R-52) | Reiselogbuch 3.11.3 · AppDesign 4.11.3 | 14.10.2026 |
| P-28, P-29 | Geprüft: P-28 ok; P-29 – 0, 1, 2, 4 ok; 3 nicht ok (Tabelle wich von der HTML-Ausgabe ab → RLB-81) | Reiselogbuch 3.11.2 | 14.10.2026 |
| RLB-78, RLB-79, RLB-80 | Reiselogbuch 3.11.2: RLB-78 oberster Tag bleibt beim Drehen (R-51), RLB-79 Abgleichbericht ohne überragende Zellen (R-37 überall geprüft), RLB-80 PDF im Abgleichbericht | Reiselogbuch 3.11.2 · AppDesign 4.11.2 | 14.10.2026 |
| P-27 | Geprüft: P-27 – 1 bis 7 und 9 ok; 8 nicht ok (Zellen ragen über, iPhone und iPad hoch → RLB-79; PDF fehlt → RLB-80) | Reiselogbuch 3.11.0 | 14.10.2026 |
| RLB-77 | Reiselogbuch 3.11.1: RLB-77 Vorbeugen gegen P-26/6, 7, 9 – README ‚Verwendete Versionen‘ (R-49), Testfälle mit /0 und Meldung je Gerät (R-50), ‚fertig‘ erst nach Pages (Zusammenarbeit 1.15.0) | Reiselogbuch 3.11.1 · AppDesign 4.11.1 | 13.10.2026 |
| RLB-73, RLB-74, RLB-75, RLB-76 | Reiselogbuch 3.11.0: RLB-73 Versionskopplung mit AppDesign (R-48), RLB-74 Seitenleiste mit einem Zustand (R-47), RLB-75 Kontextmenü des letzten Eintrags (R-40), RLB-76 Abgleichbericht (R-44, Muster 3) | Reiselogbuch 3.11.0 · AppDesign 4.11.0 | 13.10.2026 |
| P-26 | Geprüft: P-26 – 2, 3, 5 ok; 1, 4, 6, 7, 9 nicht ok (auf dem Gerät lief noch die alte AppDesign-Fassung bzw. irreführende Meldung) → RLB-73 bis RLB-75; 8 neuer Wunsch → RLB-76 | Reiselogbuch 3.10.1 | 13.10.2026 |
| RLB-68, RLB-69, RLB-70, RLB-71, RLB-72 | Reiselogbuch 3.10.1: RLB-68 Seitenleiste beim Drehen (R-47), RLB-69 Kontextmenü über der Backup-Kachel, RLB-70 Gerätenamen in Hinweisen, RLB-71 leere Felder beim Abgleich, RLB-72 Usertests Schritt für Schritt | Reiselogbuch 3.10.1 · AppDesign 4.10.1 | 13.10.2026 |
| P-24, P-25 | Geprüft: P-24 alles in Ordnung; P-25 – 4, 6, 14, 15, 16 → RLB-68 bis RLB-71, übrige in Ordnung | Reiselogbuch 3.10.0 | 13.10.2026 |
| RLB-63, RLB-64, RLB-65, RLB-66, RLB-67 | Reiselogbuch 3.10.0: RLB-63 Drehen (R-40), RLB-64 Abgleich je Feld, RLB-65 Kontextmenü iPhone, RLB-66 Abgleich allgemein (R-41–R-44), RLB-67 Backup als Standard (R-45, R-46) | Reiselogbuch 3.10.0 · AppDesign 4.10.0 | 12.10.2026 |
| RLB-62 | Reiselogbuch 3.9.1: RLB-62 Abfrage und Fenster passen immer auf den Bildschirm (R-39) | Reiselogbuch 3.9.1 · AppDesign 4.9.1 | 12.10.2026 |
| RLB-3 | Reiselogbuch 3.9.0: RLB-3 Abgleich iPad ↔ iPhone über ein Backup, ‚geändert am … · Gerät‘ in jeder Kachel | Reiselogbuch 3.9.0 · AppDesign 4.9.0 | 12.10.2026 |
| P-23 | Geprüft: P-23 Version 3.8.1 – 1–4 ok | Reiselogbuch 3.8.1 | 12.10.2026 |
| RLB-60 | Reiselogbuch 3.8.1: RLB-60 Symbolleiste mit oder ohne Suchzeile bewegt sich keinen Millimeter (R-05) | Reiselogbuch 3.8.1 · AppDesign 4.8.1 | 12.10.2026 |
| P-22 | Geprüft: P-22 Version 3.8.0 – 1–4 ok (5 → RLB-60) | Reiselogbuch 3.8.0 | 12.10.2026 |
| RLB-57, RLB-58, RLB-59 | Reiselogbuch 3.8.0: RLB-57 Smiley-Reihen und lange Wörter brechen um, RLB-58 Seitenleiste behält Position, RLB-59 Tastatur der Suche schließt beim Wischen | Reiselogbuch 3.8.0 · AppDesign 4.8.0 | 12.10.2026 |
| P-21 | Geprüft: P-21 Version 3.7.0 – 1, 4 ok; 2 → RLB-58; 3, 5 → RLB-57; iPhone-Suche → RLB-59 | Reiselogbuch 3.7.0 | 12.10.2026 |
| RLB-55, RLB-56 | Reiselogbuch 3.7.0: RLB-55 Startliste = Seitenleiste (R-36), RLB-56 lange Wörter brechen im Wort um (R-37) | Reiselogbuch 3.7.0 · AppDesign 4.7.0 | 12.10.2026 |
| P-20 | Geprüft: P-20 Version 3.6.0 – 1, 4, 5 ok; 2 am iPhone ok, am iPad → RLB-55; 3 → RLB-56 | Reiselogbuch 3.6.0 | 12.10.2026 |
| RLB-53, RLB-54 | Reiselogbuch 3.6.0: RLB-53 Kopfzeile und Backup-Kachel am iPad fest, RLB-54 Regelkatalog R-01 bis R-35 mit Regel-Prüfung | Reiselogbuch 3.6.0 · AppDesign 4.6.0 | 11.10.2026 |
| P-19 | Geprüft: P-19 Version 3.5.0 – 1, 2 ok; 3 am iPhone ok, am iPad → RLB-53 | Reiselogbuch 3.5.0 | 11.10.2026 |
| RLB-51, RLB-52 | Reiselogbuch 3.5.0: RLB-51 Vorschau am iPad in Seitenbreite, RLB-52 Leisten bewegen sich nie | Reiselogbuch 3.5.0 · AppDesign 4.5.0 | 11.10.2026 |
| P-18 | Geprüft: P-18 Version 3.4.0 – 1–3, 5 ok; 4 → RLB-52 | Reiselogbuch 3.4.0 | 11.10.2026 |
| RLB-46, RLB-47, RLB-48, RLB-49, RLB-50 | Reiselogbuch 3.4.0: RLB-46 Titel in der Leiste, RLB-47 Bezeichnungen auf dem iPhone, RLB-48 Backup-Kachel immer, RLB-49 Anzahl unter dem Titel, RLB-50 Großschreibung nach Vorschlägen | Reiselogbuch 3.4.0 · AppDesign 4.4.0 | 11.10.2026 |
| P-17 | Geprüft: P-17 Version 3.3.0 – 1–3, 6, 8, 9 ok; 4, 5, 7 → RLB-48 bis RLB-50 | Reiselogbuch 3.3.0 | 11.10.2026 |
| RLB-37, RLB-38, RLB-39, RLB-40, RLB-41, RLB-42, RLB-44, RLB-45 | Reiselogbuch 3.3.0: RLB-37 kein Zoom durch Doppeltippen, RLB-38 Bezeichnung bleibt beim Feld, RLB-39 gelb ohne blauen Rand, RLB-40/RLB-43 Startliste = Seitenleiste mit Kacheln, RLB-41 Mikrofon-Knöpfe entfernt, RLB-42 Großbuchstabe am Zeilenanfang, RLB-44 ‚Verlauf‘ halbfett, RLB-45 senkrechte Kapsel | Reiselogbuch 3.3.0 · AppDesign 4.3.0 | 11.10.2026 |
| P-16 | Geprüft: P-16 Version 3.2.0 – 1, 3–5, 8, 11, 12 ok; 2, 6, 7, 9, 10 → RLB-40 bis RLB-44 | Reiselogbuch 3.2.0 | 11.10.2026 |
| RLB-25 bis RLB-36 | Reiselogbuch 3.2.0: RLB-25 bis RLB-36 (Verlauf, iPhone wie iPad, Titel in der Leiste, Kacheln, Backup-Hinweis, nur Vordergrund reagiert, Fehlerbehebungen) | Reiselogbuch 3.2.0 · AppDesign 4.2.0 | 11.10.2026 |
| P-15 | Geprüft: P-15 Version 3.1.0 – 1–3, 6, 8, 11 ok; Rest → RLB-32 bis RLB-36 | Reiselogbuch 3.1.0 | 11.10.2026 |
| RLB-2, RLB-24 | Reiselogbuch 3.1.0: RLB-2 iPhone-Ansicht (AppDesign 4.1.0), RLB-24 Icons bei ‚Alle Tage‘/‚Nur erfasste Tage‘ | Reiselogbuch 3.1.0 · AppDesign 4.1.0 | 10.10.2026 |
| P-14 | Auf dem iPad geprüft und ok: P-14 Reiselogbuch 3.0.0 mit AppDesign 4.0.0 (auch offline) | Reiselogbuch 3.0.0 | 09.10.2026 |
| RLB-23 | Reiselogbuch 3.0.0: RLB-23 gemeinsame Bausteine aus dem Design-Repo AppDesign 4.0.0 (APD 4.0.0/S-1, S-2) | Reiselogbuch 3.0.0 · AppDesign 4.0.0 | 09.10.2026 |
| P-13 | Auf dem iPad geprüft und ok: P-13 Version 2.4.0 (Menüs ohne Linien zwischen Punkten, Suchfeld ohne blauen Rahmen) | Reiselogbuch 2.4.0 | 09.10.2026 |
| RLB-20, RLB-21 | Reiselogbuch 2.4.0: RLB-20 Menüs ohne Linien zwischen Punkten, RLB-21 Suchfeld ohne blauen Rahmen | Reiselogbuch 2.4.0 · allgemein 3.6.1 · Reiselogbuch-Richtlinie 2.4.0 | 09.10.2026 |
| P-12 | Auf dem iPad geprüft: P-12 Version 2.3.0 ok bis auf 3 (Linien → RLB-20) und 4 (Suchfeld → RLB-21); Punkt 7 hat sich erledigt (verschaut) · RLB-19 Essen-Links mit mehr Abstand: **verworfen**, bleibt als bewusste Abweichung | Reiselogbuch 2.3.0 | 09.10.2026 |
| RLB-7, RLB-10, RLB-11, RLB-12, RLB-13, RLB-14, RLB-15, RLB-16, RLB-17, RLB-18 | Reiselogbuch 2.3.0 (Sammelversion HIG-Prüfung): RLB-7, RLB-10, RLB-11, RLB-12, RLB-13, RLB-14, RLB-15, RLB-16, RLB-17, RLB-18 | Reiselogbuch 2.3.0 · allgemein 3.6.0 · Reiselogbuch-Richtlinie 2.3.0 | 09.10.2026 |
| P-11 | Auf dem iPad geprüft und ok: P-11 Anführungszeichen ‚…‘, Teilen-Menü mit Strich | Reiselogbuch 2.2.2 | 09.10.2026 |
| RLB-9, RLB-8 | Reiselogbuch 2.2.2: RLB-9 Anführungszeichen ‚…‘ in der App, RLB-8 Teilen-Menü mit Strich | Reiselogbuch 2.2.2 · allgemein 3.4.1 · Reiselogbuch-Richtlinie 2.2.2 | 09.10.2026 |
| P-9, P-10 | Auf dem iPad geprüft und ok: P-9 Kontextmenü und Satz zum Speicher · P-10 Gewähltes bleibt blau, Menü mit Strich | Reiselogbuch 2.2.1 | 09.10.2026 |
| RLB 2.2.1 | Reiselogbuch 2.2.1: RLB 2.2.1/F-11 Gewähltes bleibt blau, solange es sichtbar ist (Seitenleiste, Tag, Fazit), F-12 Menü der Seitenleiste mit Strich und verständlichem Satz zum Speicher | Reiselogbuch 2.2.1 · allgemein 3.3.1 · Reiselogbuch-Richtlinie 2.2.1 | 09.10.2026 |
| RLB-1, RLB-4 | Reiselogbuch 2.2.0: RLB-1 Kontextmenü in der Seitenleiste, RLB-4 dauerhafter Speicher mit Hinweisen | Reiselogbuch 2.2.0 · allgemein 3.3.0 · Reiselogbuch-Richtlinie 2.2.0 | 09.10.2026 |
| P-8 | Auf dem iPad geprüft und ok: P-8 Tastatur offen – Kopfzeilen bleiben sichtbar | Reiselogbuch 2.1.5 | 08.10.2026 |
| RLB 2.1.5 | Reiselogbuch 2.1.5: RLB 2.1.5/F-10 Kopfzeilen bei sichtbarer Tastatur sichtbar | Reiselogbuch 2.1.5 · allgemein 3.2.3 | 08.10.2026 |
| P-1, P-2, P-3, P-4, P-5, P-6, P-7 | Auf dem iPad geprüft und ok: P-1 Datumsfelder · P-2 Seitenleiste hoch · P-3 Sprechblasen/Menüs · P-4 HTML/PDF, Backup · P-5 Version 2.1.0 · P-6 Version 2.1.1 · P-7 Version 2.1.2 | bis Reiselogbuch 2.1.4 | 08.10.2026 |
| RLB 2.1.4 | Reiselogbuch 2.1.4: RLB 2.1.4/F-9 Markierung in Auswahl-Kapseln rund (Kreis/Kapsel innen) mit Abstand | Reiselogbuch 2.1.4 · allgemein 3.2.2 | 08.10.2026 |
| RLB 2.1.3 | Reiselogbuch 2.1.3: RLB 2.1.3/F-8 Markierung in Auswahl-Kapseln nicht mehr abgeschnitten | Reiselogbuch 2.1.3 | 08.10.2026 |
| RLB 2.1.2 | Reiselogbuch 2.1.2: RLB 2.1.2/F-6 Seitenleiste beim Start eingeblendet, F-7 Abstand unten 4 px | Reiselogbuch 2.1.2 · allgemein 3.2.1 | 08.10.2026 |
| RLB 2.1.1 | Reiselogbuch 2.1.1: RLB 2.1.1/F-1 PDF ohne Seitenleiste, F-2 Suche, F-3 Wetter in der Ausgabe, F-4 Betragsfeld dynamisch, F-5 Auswahl-Kapseln | Reiselogbuch 2.1.1 · allgemein 3.2.0 · Reiselogbuch-Richtlinie 2.1.1 | 08.10.2026 |
| RLB 2.1.0 | Reiselogbuch 2.1.0: RLB 2.1.0/B-1 bis RLB 2.1.0/B-12 (schwebende Seitenleiste, immer „Alle Tage“, Kalender-Icon, ellipsis bleibt blau, „Backup erstellen“, Statistik „Nächte“, Beträge „4.850,00 €“ rechtsbündig, Tabellenüberschriften 17 px halbfett) | Reiselogbuch 2.1.0 · allgemein 3.1.0 · Reiselogbuch-Richtlinie 2.1.0 | 08.10.2026 |
| Designrichtlinie allgemein 3.0.1 | Links zu den Apple Human Interface Guidelines je Abschnitt und Komponente | Designrichtlinie allgemein 3.0.1 | 08.10.2026 |
| Zusammenarbeit allgemein 1.2.0 | Regel „Apple-like entwickeln, Apple-Lösungen recherchieren und empfehlen“ | Zusammenarbeit allgemein 1.2.0 | 08.10.2026 |
| RLB 2.0.0 | Neues Bedienkonzept: Seitenleiste, Kopfzeile mit Kapsel, Menüs, Sprechblasen, Fenster mit x/Häkchen | Reiselogbuch 2.0.0 | 08.10.2026 |
