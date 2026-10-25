# Backlog – offene Themen

**Stand 25.10.2026** · Aktuelle Version: Reiselogbuch 3.33.0 · AppDesign 4.35.0

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
| – | – | zurzeit nichts gesammelt | – | – |


## 1. Auf iPad und iPhone prüfen

| Nr. | Prio | Thema | Status |
|---|---|---|---|
| P-73 | 2 | **Barrierefreiheit Teil 1 mit Fokus-Rahmen (3.33.0, T-100, AppDesign A-43/1):** Prüfliste P-73/0–6 im CHANGELOG – kein blauer Rahmen in Textfeldern, Antippen wie bisher, Hardware-Tastatur, Fehlermeldung beim Häkchen, ‚Kontrast erhöhen‘, ‚Bewegung reduzieren‘ | prüfen |

## 2. Weitere Themen (in Klärung)

| Nr. | Prio | Thema | Gilt | Status |
|---|---|---|---|---|
| T-103 | 2 | **Prüfung `ablauf-tastatur-still.mjs` reparieren und in den vollen Lauf aufnehmen (Nutzer 24.10.2026):** sie steht nicht in `tests/alle.mjs`; beim Nachspielen der Messung ‚2026-10-22 iPhone hoch Ränder‘ bricht sie ab – das Menü von ‚…‘ (sideMore) liegt über der Zeile, auf die der Schritt ‚tippen button‘ abgebildet ist (auch mit 4.32.0); Abbildung der Messschritte bzw. Menü vorher schließen, dann in die Liste des vollen Laufs | App | offen |
| T-101 | 2 | **Barrierefreiheit Teil 2 Textgröße in der App (AppDesign A-43/2, Nutzer 23.10.2026):** mit der neuen AppDesign-Fassung folgt die Schrift der Einstellung ‚Textgröße‘ (R-1.10); in der App: die 6 eigenen Schriftgrößen einem Textstil zugeordnet, keine Schrift mehr in px außer Ausgabe (G4); Tage am iPad ab AX1 als dieselben Kästen wie am iPhone (`.box.day` aus `renderPhone` statt `table.days`), Kopf mit Wetter unter dem Datum, beim Wechsel Tabelle ↔ Kästen bleibt derselbe Tag oben (U4, W1); Reisedaten `.meta` ab AX1 untereinander (U1); Betragsfeld `#kosten` in Zeichenbreite statt fest 130 px (B5); Wetter-Knöpfe wachsen, die 40-px-Ausnahme gilt nur bei Standard, passt es nicht → seitlich wischen (B6); Prüfungen der App mit `PRUEF_TEXT` (Fall-Liste AppDesign `arbeit/A-43 Teil 2 Fall-Liste.md`) | App | bereit – für die Version nach T-100 |
| T-06 | 3 | Ausschreibungstexte (Reiseveranstalter) in Reiselogbücher umwandeln – für erledigte **und** geplante Reisen: Titel, Zeitraum, Reisemittel; je Tag das Programm („1. Tag“ → echtes Datum, Text wie in der Ausschreibung); Quartiere mit Ort, falls genannt; übrige Felder bleiben leer | Reiselogbuch | offen |

## 3. Später

| Nr. | Prio | Thema | Gilt | Status |
|---|---|---|---|---|
| – | – | allgemeine Themen (z. B. Startseite) stehen jetzt im Backlog von AppDesign | – | – |

---

## Erledigt

| Nr. | Thema | Version | Datum |
|---|---|---|---|
| E-134 | **T-100 (AppDesign A-43 Teil 1):** kein blauer Rahmen mehr in Textfeldern, Hardware-Tastatur in Menüs, Sprechblasen und Fenstern, VoiceOver-Namen und Ansagen (Suche, Seitenleiste, Fehlermeldungen, offline), Fehlermeldungen über `feldFehler` mit Fokus beim Häkchen, ‚Kontrast erhöhen‘ und ‚Bewegung reduzieren‘ (Sprung zum Fehler springt); neue Prüfung `ablauf-bedienung.mjs` mit Gegenprobe `bedienung`; Prüfpunkt P-73 | 3.33.0 | 25.10.2026 |
| E-133 | Geprüft **P-72 (3.32.0)**: alles ok – Kachel nach dem Backup weg, Mehr-Menü mit heutigem Datum, offline nur die graue Zeile, Abgleich zählt nicht, Kontextmenü ohne Kachel ganz sichtbar (**T-105 abgeschlossen**) | 3.32.0 | 24.10.2026 |
| E-132 | **T-105 (AppDesign A-74):** die gelbe Backup-Kachel steht nur noch, solange heute auf diesem Gerät kein Backup erstellt wurde; danach verschwindet sie (Fokus auf ‚Mehr‘), um 0:00 bzw. bei der Rückkehr am neuen Tag kommt sie wieder; Abgleich zählt nicht; Offline-Zeile auch ohne Kachel und bei leerer Liste; neue Prüfung `ablauf-backup-kachel.mjs` (gegen 3.31.0 rot); Prüfpunkt P-72 | 3.32.0 | 24.10.2026 |
| E-131 | Geprüft **P-71 (3.31.0)**: alles ok – Pfeile an der Reisemittel-Kapsel am Anfang, in der Mitte und am Ende, quer und gedreht; Smiley-Leiste ziehen ohne Abfrage, langes Drücken und Antippen wie bisher (**T-106 abgeschlossen**) | Reiselogbuch 3.31.0 | 24.10.2026 |
| E-130 | **T-106 (AppDesign A-75) und AppDesign A-76:** in der Auswahl-Kapsel (Reisemittel, Wetter, Smileys) steht, wo es weitergeht, im Verlauf (48 px) ein kleiner Pfeil ‹ bzw. ›, der am jeweiligen Ende ausblendet; Ziehen der Smiley-Leiste löst keine Lösch-Abfrage mehr aus (langes Drücken nur auf derselben Stelle); neue Prüfungen `ablauf-kapsel-pfeile.mjs` und `ablauf-smiley-leiste.mjs` (L1 rot gegen 3.30.2). Wartet auf P-71 | Reiselogbuch 3.31.0 | 24.10.2026 |
| E-129 | Geprüft **P-70 (3.30.2)**: alles ok – ein Zug neben dem Feld erst nach oben, dann nach unten schließt die Tastatur; quer sind Umrandung und Schatten im Verlauf, Fazit und Titel ganz zu sehen; sonst unverändert (**T-104 abgeschlossen**) | Reiselogbuch 3.30.2 | 24.10.2026 |
| E-128 | **T-104 (AppDesign A-73, Korrektur):** auf dem iPhone schließt ein Zug neben dem Feld die Tastatur auch, wenn der Finger zuerst nach oben geht; quer steht ein großes Feld mit Fokus so weit unter der Kopfzeile, dass Umrandung und Schatten ganz zu sehen sind; `ablauf-blatt.mjs` B19 ‚erst nach oben‘ und B10 Abstand über dem Feld (rot gegen 3.30.1). Wartet auf P-70 | Reiselogbuch 3.30.2 | 24.10.2026 |
| E-127 | Geprüft **P-69 (3.30.1)**: /0–/2 ok – ein Zug auf einem Feld bei offener Tastatur zieht das Blatt (**T-102 abgeschlossen**); /3 nicht ok: Fokusring quer oben abgeschnitten, Tastatur geht beim Zug am linken Rand nicht zu (→ AppDesign A-73) | Reiselogbuch 3.30.1 | 24.10.2026 |
| E-126 | **T-102 (AppDesign A-71, Korrektur):** auf dem iPhone zieht ein Zug auf einem Feld bei offener Tastatur das Blatt im selben Zug – Tastatur zu, mit Änderungen federt es zurück und fragt ‚Änderungen verwerfen‘; `ablauf-blatt.mjs` prüft B10 und B19 mit Tastatur (Safari-Modell, rot gegen 3.30.0). Wartet auf P-69 | Reiselogbuch 3.30.1 | 24.10.2026 |
| E-125 | Geprüft **P-68 (3.30.0)**: alles ok bis auf /2.3 – Blatt öffnen und wegziehen, Rückfrage, Tastatur, Vorschau, Drehen, iPad unverändert, Startposition (**T-98 abgeschlossen**); /2.3 Ziehen auf einem Feld schließt nur die Tastatur, erst der zweite Zug fragt (→ T-102) | Reiselogbuch 3.30.0 | 23.10.2026 |
| E-124 | **T-98 und T-99 (AppDesign A-69, A-61 Teil 2):** Startposition beim Öffnen – läuft die Reise und ist bis heute alles erfasst, steht heute oben ohne Gelb, eine Reise in der Zukunft öffnet ganz oben, Gelb nur bis heute (`oeffnen-position.mjs` mit festem Datum, rot gegen 3.29.0 bei F5–F11); auf dem iPhone sind Erfassen, Einstellungen, Neues Reiselogbuch, Fazit und Vorschau ein Blatt – nach unten ziehen schließt, mit Änderungen fragt es wie x (neu `ablauf-blatt.mjs`). Wartet auf P-68 | Reiselogbuch 3.30.0 · AppDesign 4.32.0 | 23.10.2026 |
| E-123 | Geprüft **P-67 (3.29.0)**: alles ok – Seitenleiste am iPad quer hereinwischen, Vorrang und panel-left, keine doppelten Leerzeichen, Großschreibung zurücknehmen (AppDesign A-68, A-64, A-65 abgeschlossen) | Reiselogbuch 3.29.0 | 23.10.2026 |
| E-122 | **AppDesign A-68, A-64, A-65:** Seitenleiste am iPad quer per Wischen (Variante B), keine doppelten Leerzeichen, keine erzwungene Großschreibung nach einer Korrektur von Hand; `ablauf-navigation.mjs` mit iPad quer, `regeln-ablauf.mjs` mit `checkSpaces`. Wartet auf P-67 | Reiselogbuch 3.29.0 | 23.10.2026 |
| E-121 | Geprüft **P-66 (3.28.2)**: alles ok – Zurückwischen über und neben den Tageskästen, Rollen, Seitenleiste am iPad hoch (AppDesign A-67 abgeschlossen) | Reiselogbuch 3.28.2 | 23.10.2026 |
| E-120 | **AppDesign A-67 Korrektur:** Zurückwischen über und neben den Tageskästen bricht nicht mehr ab (Safari rollte ab 10 px senkrecht dazwischen); `ablauf-navigation.mjs` mit Berührung nach Safari (`kasten: #app .box.day`). Wartet auf P-66 | Reiselogbuch 3.28.2 · AppDesign 4.30.2 | 23.10.2026 |
| E-119 | Geprüft **P-65 (3.28.1)**: /2 nicht ok – Messung ausgewertet (Safari bricht ab 10 px senkrecht ab) → Korrektur 3.28.2 | Reiselogbuch 3.28.1 | 23.10.2026 |
| E-118 | Geprüft **P-64 (3.28.0)**: alles ok bis auf /5 – weiter in P-65 | Reiselogbuch 3.28.0 | 23.10.2026 |
| E-117 | **AppDesign A-67 Schritt 1 und A-66:** Fassung 4.30.1 – der Messmodus zeichnet Berührungen und die Entscheidungen der Wischgeste auf; `ablauf-navigation.mjs` prüft die Messzeilen (F-22) und wartet das Ende der Bewegung ab. Wartet auf P-65 | Reiselogbuch 3.28.1 · AppDesign 4.30.1 | 22.10.2026 |
| E-116 | **AppDesign A-37 B+C und A-61 Teil 1:** Marken `data-marke` an Tagen (‚Tag 19 · Fr 20.03.‘) und an Fazit, Quartierliste, Statistik; Seitenwechsel und Gesten über `navAnmelden()` (Zurück-Knopf, Öffnen aus der Startliste, panel-left und Abdunkelung am iPad hoch); Fassung 4.30.0; Prüfungen `ablauf-navigation.mjs` (neu), `kapsel-iphone.mjs` (Griff, Marken, 365 Tage). Wartet auf P-64 | Reiselogbuch 3.28.0 · AppDesign 4.30.0 | 22.10.2026 |
| E-115 | Geprüft **P-63: alles ok** (Nutzer 22.10.2026) – Version 3.27.0 mit AppDesign 4.29.0; **AppDesign A-63 abgeschlossen** | Reiselogbuch 3.27.0 · AppDesign 4.29.0 | 22.10.2026 |
| E-114 | **AppDesign A-63 Paket C:** Suche ohne Akzente, ⓧ in Titel, Teilnehmer, Ort, Quartier und Gesamtausgaben, Schalter mit `switch` (Safaris Schalter), sichere Ränder (Fenster am iPad, Menü und Sprechblase am iPhone quer); Fassung 4.29.0; Prüfungen `regeln-ablauf.mjs` (ⓧ), `ablauf-suche-woerter.mjs` (Akzente), `hig.mjs` (Ränder, Schalter). Wartet auf P-63 | Reiselogbuch 3.27.0 · AppDesign 4.29.0 | 22.10.2026 |
| E-113 | Geprüft **P-62: alles ok** (Nutzer 21.10.2026) – Version 3.26.2 mit AppDesign 4.28.2, App unverändert; **AppDesign A-39 abgeschlossen** | Reiselogbuch 3.26.2 · AppDesign 4.28.2 | 21.10.2026 |
| E-112 | **AppDesign A-39 Konsolidierung:** Designrichtlinie Reiselogbuch nur noch Abweichungen, PROMPT.md als gegliederte Funktionsbeschreibung mit allen Ausprägungen, CLAUDE.md 3.6.0, tests/README mit Regel je Prüfung | Reiselogbuch 3.26.2 · AppDesign 4.28.2 | 21.10.2026 |
| E-111 | Geprüft **P-61: alles ok** (Nutzer 21.10.2026, mit Messungen) – **T-97 abgeschlossen**: Tastatur ohne Springen, Gesamtausgaben über der Tastatur, iPhone quer niedrige Leisten | Reiselogbuch 3.26.1 | 21.10.2026 |
| E-110 | **T-97 korrigiert (AppDesign A-36):** Tastatur ohne Springen – Fassung 4.28.1; `ablauf-tastatur-still.mjs` mit allen vier Lagen, Tastatur-Taste, ‚Nach oben‘ bei offener Tastatur, kurzem Inhalt und Wischen (gegen 3.26.0 rot, jetzt grün). Wartet auf P-61 | Reiselogbuch 3.26.1 | 21.10.2026 |
| E-109 | **T-95 abgeschlossen:** (3) Datumsfeld ‚Tag antippen übernimmt und schließt‘ **entfällt** (AppDesign A-26, Nutzer 20.10.2026: Safari meldet nur den Wert – in drei Fällen bliebe die Auswahl offen; ‚wenn nicht alles funktioniert, bauen wir es so nicht ein‘). Datumsfelder bleiben wie bisher | – | 20.10.2026 |
| E-108 | **T-97 gebaut (AppDesign A-35, A-31):** Gesamtausgaben steht bei offener Tastatur ganz sichtbar über ihr (`fieldIntoView`, R-4.5); `ablauf-feld-tastatur.mjs` (Ablauf der Messung, gegen 3.25.1 rot) und `ablauf-abspielen.mjs` (Messung nachgespielt, Gegenprobe); Fassung 4.28.0. Wartet auf P-60 | Reiselogbuch 3.26.0 | 20.10.2026 |
| E-107 | Geprüft P-59: alles ok – **T-96 abgeschlossen** (Kapsel am iPhone quer mit Tastatur ausgeblendet, kommt nach dem Schließen wieder) | Reiselogbuch 3.25.1 | 19.10.2026 |
| E-106 | **T-96 gebaut (AppDesign A-33, Weg A):** die Kapsel ‚Nach oben / Ans Ende‘ überdeckt nie Kopf- oder Suchzeile, am iPhone quer mit offener Tastatur ausgeblendet; Inhalt endet quer über der Tastatur; `kapsel-iphone.mjs` mit dem Ablauf aus P-58/2 (gegen 3.25.0 rot, jetzt grün); Fassung 4.27.1. Wartet auf P-59 | Reiselogbuch 3.25.1 | 19.10.2026 |
| E-105 | Geprüft P-58: /0, /1, /3–/6 ok – **Zittern beim Suchen am iPhone weg, T-95 (1) abgeschlossen** (Messung: Seite rollt nie, Kopf- und Suchzeile stehen in jeder Zeile still); /2 nicht ok (Kapsel verdeckt quer mit Tastatur ⌄) → T-96 | Reiselogbuch 3.25.0 | 19.10.2026 |
| E-104 | **Umbau B gebaut (T-95 (1), AppDesign A-28 B1 und A-29):** nur der Inhalt rollt (Rollbereich unter Kopf- und Suchzeile, endet über der Tastatur), Lupe und ⓧ rollen nach oben, Nach oben / Ans Ende im Inhalt; `ablauf-suche-iphone.mjs` grün (vorher rot), neue Prüfungen in `regeln-ablauf.mjs` (Suche nach oben, Kapsel, Drucken); Fassung 4.27.0. T-95 (1) wartet auf P-58 | Reiselogbuch 3.25.0 | 19.10.2026 |
| E-103 | Geprüft P-57: alles ok (Messungen iPhone hoch und quer, iPad); Ursache des Zitterns gemessen (Hin und Her beim Rollen zum Treffer, AppDesign `arbeit/A-27 Auswertung P-57.md`); weiter mit Umbau B (A-28) | Reiselogbuch 3.24.0 | 19.10.2026 |
| E-102 | **Messmodus gebaut (T-95 (1), AppDesign A-27):** ‚Messung starten‘ / ‚Messung beenden und teilen‘ im Mehr-Menü der Seitenleiste; neue feste Prüfung `tests/ablauf-messung.mjs`; Fassung 4.26.0 | Reiselogbuch 3.24.0 | 19.10.2026 |
| E-101 | Geprüft P-56: /0, /3, /4 ok (Markierung als Kreis, iPad unverändert, ein Backup); /1, /2 nicht ok → T-95 (1) offen | Reiselogbuch 3.23.1 | 19.10.2026 |
| E-100 | **T-95 (1) und (2) gebaut:** Suchfeld bleibt beim Tippen (Kopf- und Suchzeile zittern am iPhone nicht mehr), Markierung in Kapseln als Kreis 36 × 36; neue feste Prüfung `tests/ablauf-suche-iphone.mjs` (rot gegen 3.23.0); Fassung 4.25.1 | Reiselogbuch 3.23.1 | 19.10.2026 |
| E-99 | Geprüft: P-55 alles in Ordnung; **T-93 damit abgeschlossen** | Reiselogbuch 3.23.0 | 18.10.2026 |
| E-98 | **T-93 gebaut:** Suche mit mehreren Wörtern (alle irgendwo im Reiselogbuch, gezeigt die Tage mit einem Wort), „…“ als genaue Folge, Lupe am Ende der Kapsel [+ \| Lupe \| …]; neue Prüfung `tests/ablauf-suche-woerter.mjs`; Fassung 4.25.0 | Reiselogbuch 3.23.0 | 18.10.2026 |
| E-97 | Geprüft: P-54 alles in Ordnung (Hervorhebung, ‚Tour …‘, ‚Sonstiges …‘, Aufbau der Vorschläge); **T-94 damit abgeschlossen** | Reiselogbuch 3.22.0 | 18.10.2026 |
| E-96 | **T-94 gebaut:** Verlauf mit ‚Tour …‘ und ‚Sonstiges …‘ (leere erste Zeile, Cursor dorthin); Hervorhebung nach dem Fenster 2 s + 1 s (AppDesign A-23); neue Prüfung `tests/verlauf-vorschlaege.mjs`; Fassung 4.24.0 | Reiselogbuch 3.22.0 | 18.10.2026 |
| E-95 | Geprüft: P-53 alles in Ordnung (Liste steht still: tiefer erfassen, vorblättern, iPhone, Wischen frei); **T-92 damit abgeschlossen** | Reiselogbuch 3.21.2 | 18.10.2026 |
| E-94 | **Korrektur R-7.3 gebaut (P-52/2–4):** oben bleibt derselbe Tag – auch nach ‹ ›; neue feste Prüfung `tests/ablauf-liste-still.mjs` (deine Abläufe, Safari-Tastatur einzeln und zusammen); Fassung 4.23.2 | Reiselogbuch 3.21.2 | 18.10.2026 |
| E-93 | Geprüft: P-52/0–1 in Ordnung; **P-52/2–4 nicht ok** (Liste rückt nach dem Erfassen eines tieferen Tages bzw. nach ‹ › weg, iPad und iPhone) → Korrektur 3.21.2 | Reiselogbuch 3.21.1 | 18.10.2026 |
| E-92 | **Korrektur R-7.3 gebaut (P-51/5):** oberste Zeile beim Öffnen des Fensters ‚Tag‘ merken und danach genau dort ausrichten; gerollt wird nur nach ‹ ›; Fassung 4.23.1 | Reiselogbuch 3.21.1 | 18.10.2026 |
| E-91 | Geprüft: P-51/0–4 in Ordnung; **P-51/5 nicht ok** (Liste rückt nach dem Fenster ‚Tag‘ 1–3 Zeilen hoch, auch mit x, sobald die Tastatur offen war) → Korrektur 3.21.1 | Reiselogbuch 3.21.0 | 18.10.2026 |
| E-90 | **T-92 gebaut:** Suche über alle Reiselogbücher in Startliste/Seitenleiste (Lupe, Filter, ‚N Treffer‘, Öffnen mit gefüllter Suche, beide Suchfelder 1:1); Fassung 4.23.0 | Reiselogbuch 3.21.0 | 17.10.2026 |
| E-89 | **T-91 verworfen (Nutzer, 17.10.2026):** Tastatur im Fenster ‚Tag‘ – Mitfahren beim ersten Hochfahren kommt von Safari; Messungen in AppDesign-Sitzung 0010, Messseiten entfernt (AppDesign E-42) | – | 17.10.2026 |
| E-88 | Geprüft: P-49 alles in Ordnung (Drehen am Ende der Seite); **T-89 und T-90 damit abgeschlossen** | Reiselogbuch 3.20.1 | 17.10.2026 |
| E-87 | Korrektur 3.20.1: Drehen am Ende der Seite – ganz unten bleibt ganz unten (aus P-48/3; Ursache: am Ende kein Tag als Anker) | Reiselogbuch 3.20.1 | 17.10.2026 |
| E-86 | Geprüft: P-48/0–2 in Ordnung (Öffnen iPad und iPhone, Seitenleiste ein/aus); **P-48/3 nicht ok** (Drehen am Ende) → Korrektur 3.20.1 | Reiselogbuch 3.20.0 | 17.10.2026 |
| E-85 | T-89 und T-90 gebaut: beim Öffnen ganz oben bzw. erster offener Tag direkt unter dem Kopf; Seitenleiste ein/aus hält den obersten Tag | Reiselogbuch 3.20.0 | 17.10.2026 |
| E-84 | Geprüft: P-47 alles in Ordnung (Kapsel ‚Nach oben / Ans Ende‘ auf dem iPhone) | Reiselogbuch 3.19.0 | 17.10.2026 |
| E-83 | AppDesign A-15 übernommen: Kapsel ‚Nach oben / Ans Ende‘ auch auf dem iPhone (im Reiselogbuch, nicht in der Startliste) | Reiselogbuch 3.19.0 | 17.10.2026 |
| E-82 | Geprüft: P-46 alles in Ordnung (Link nur über den Namen); **T-86 damit abgeschlossen** | Reiselogbuch 3.18.0 | 17.10.2026 |
| E-81 | T-86 gebaut: Maps-Link nur über den Namen – endet an ‚ – ‘, Komma, Doppelpunkt, Klammer (nicht vor einer Ziffer), Essen und Quartier | Reiselogbuch 3.18.0 | 17.10.2026 |
| E-80 | Geprüft: P-45 alles in Ordnung (Eingabetaste ‚Fertig‘, iPhone ✓ über der Zifferntastatur – Farbe des ✓ bestimmt iOS, nicht änderbar; zuletzt verwendetes Reiselogbuch); **T-87 und T-88 damit abgeschlossen** | Reiselogbuch 3.17.0 | 17.10.2026 |
| E-79 | T-87 und T-88 gebaut: Eingabetaste ‚Fertig‘ schließt die Tastatur in einzeiligen Feldern (Fenster bleiben offen – vorher schloss die Eingabetaste das Fenster), zuletzt verwendetes Reiselogbuch öffnet beim Start (iPad-Aufbau) | Reiselogbuch 3.17.0 | 17.10.2026 |
| E-78 | T-85 geschlossen ohne Bau: Emoji-Taste statt Weltkugel kann eine Web-App nicht steuern – iOS zeigt die Emoji-Taste, wenn nur eine Tastatur-Sprache plus Emoji eingerichtet ist (Einstellungen → Allgemein → Tastatur → Tastaturen) | – | 17.10.2026 |
| E-77 | Geprüft: P-44 alles in Ordnung (Tabelle steht still beim Erfassen, iPad und iPhone) | Reiselogbuch 3.16.0 | 17.10.2026 |
| E-76 | A-13: Tabelle bzw. Tageskästen stehen still, solange das Fenster ‚Tag‘ offen ist; danach wie vorher, Zeile kurz blau, nach ‹ › sichtbar (AppDesign R-7.3) | Reiselogbuch 3.16.0 | 16.10.2026 |
| E-75 | T-05 Alte Reiselogbücher importieren: Werkzeug im privaten Repo `ReiseLogBuch-Import`, erste Konvertierung geladen (‚Backup laden‘ → ‚Abgleichen‘) und geprüft – alles in Ordnung; weitere Konvertierungen bei Bedarf über die Startfrage | ReiseLogBuch-Import 1.2.1 | 16.10.2026 |
| E-74 | Geprüft: P-42 alles in Ordnung (Version, Offline-Start nach dem Update auf iPad und iPhone) | Reiselogbuch 3.15.1 | 16.10.2026 |
| E-73 | Reiselogbuch 3.15.1: auf AppDesign-Fassung 4.16.1 gehoben (A-10, Prüflauf mit höchstens 4 Browsern) | Reiselogbuch 3.15.1 | 15.10.2026 |
| E-72 | Geprüft: P-41 alles in Ordnung (Version, iPhone hoch/quer startet in der Startliste ohne blauen Eintrag, kurz weg und zurück, Öffnen und Zurück, iPad unverändert); **T-84 damit abgeschlossen** | Reiselogbuch 3.15.0 | 15.10.2026 |
| E-71 | Reiselogbuch 3.15.0: T-84 – Start im iPhone-Aufbau in der Startliste ohne blauen Eintrag (allgemein R-7.2), Prüfung `start-regeln.mjs` F-1 bis F-18 | Reiselogbuch 3.15.0 | 15.10.2026 |
| E-70 | Geprüft: P-40 alles in Ordnung (Version, iPad offline/online bei offener App) | Reiselogbuch 3.14.1 | 15.10.2026 |
| E-69 | Reiselogbuch 3.14.1: Korrektur zu P-39/1 und /2 – iPad erkennt den Wechsel bei offener App (Nachfrage alle 10 s), Prüfung F-17 | Reiselogbuch 3.14.1 | 15.10.2026 |
| E-68 | Geprüft: P-39 ok bis auf /1 und /2 (iPad: keine Meldung beim Wechsel bei offener App) | Reiselogbuch 3.14.0 | 15.10.2026 |
| E-67 | Reiselogbuch 3.14.0: Offline-Hinweis (A-06 Variante c, R-1.5) – graue Zeile unter der Backup-Kachel, kurze Meldung beim Wechsel und beim Start ohne Netz, Service Worker meldet ‚aus dem Speicher‘, Prüfung F-1 bis F-16 | Reiselogbuch 3.14.0 | 15.10.2026 |
| E-66 | Geprüft: P-38 alles in Ordnung (Version, Quartier-Kopf iPhone quer/hoch, offline iPad und iPhone) | Reiselogbuch 3.13.2 | 15.10.2026 |
| E-65 | Reiselogbuch 3.13.2: Quartier-Kopf als Gruppe (iPhone quer in einer Zeile), Offline-Start mit Frist 3 s (iPad weiße Seite), Prüfung `offline-regeln.mjs` | Reiselogbuch 3.13.2 | 14.10.2026 |
| E-64 | Reiselogbuch 3.13.1: README-Links auf den Richtlinien-Text in `fassung/4.14.1/` statt auf eine Git-Markierung (Korrektur) | Reiselogbuch 3.13.1 | 14.10.2026 |
| E-63 | Reiselogbuch 3.13.0: A-05 Version B – lädt die feste AppDesign-Fassung `fassung/4.14.0/`, Prüfskripte mit den Prüfungen dieser Fassung, Versionen mit dem Veröffentlichungs-Skript | Reiselogbuch 3.13.0 | 14.10.2026 |
| E-62 | Geprüft: P-35 alles in Ordnung (Version, kurzer Quartiername neben dem Namen antippen) | Reiselogbuch 3.12.0 | 14.10.2026 |
| E-61 | Reiselogbuch 3.12.0: A-05 Version A – alle Prüfskripte melden Fehler, Grundregeln nach jedem Schritt, parallel in Chromium und WebKit (`tests/alle.mjs`); Quartier-Link mit unsichtbarer Antippfläche 44 px (R-3.1) | Reiselogbuch 3.12.0 | 14.10.2026 |
| E-60 | Geprüft: P-34 alles in Ordnung | Reiselogbuch 3.11.7 | 14.10.2026 |
| E-59 | Reiselogbuch 3.11.7: A-02 Schritte 3 und 4 – Richtlinie mit Verweisen, PROMPT und CLAUDE.md nachgeführt, Vorschau-Prüfung auch iPad hoch und iPhone quer | Reiselogbuch 3.11.7 | 14.10.2026 |
| E-58 | Geprüft: P-33 alles in Ordnung | Reiselogbuch 3.11.6 | 14.10.2026 |
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
