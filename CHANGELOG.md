# Reiselogbuch – Versionsgeschichte

Versionsnummer **Hauptversion.Nebenversion.Korrektur** (z. B. 1.2.1):

- **Hauptversion** (2.0.0): große, grundlegende Änderung – neuer Aufbau oder neues
  Bedienkonzept, geänderte Datenstruktur, ältere Backups nur eingeschränkt nutzbar.
  Vorher ein Backup sichern.
- **Nebenversion** (1.1.0): neue Funktion oder sichtbare Verbesserung; alles Bisherige
  funktioniert weiter.
- **Korrektur** (1.0.1): Fehlerbehebung ohne neue Funktion.

Steigt eine Stufe, beginnen die Stufen dahinter wieder bei 0.
Die aktuelle Version steht in der App im Mehr-Menü (ellipsis) der Seitenleiste „Reiselogbücher“
(iPhone: im Mehr-Menü der Startliste).

## 3.19.0 – 17.10.2026 (Neben)

Reiselogbuch 3.19.0 · AppDesign 4.20.0 (Designrichtlinie allgemein 4.20.0) · Designrichtlinie Reiselogbuch 3.19.0 · Zusammenarbeit allgemein 2.7.0

AppDesign A-15 (R-3.2 erweitert; Fall-Liste AppDesign `arbeit/A-15 Fall-Liste.md`).

- **iPhone: Kapsel ‚Nach oben / Ans Ende‘:** In einem geöffneten Reiselogbuch steht unten rechts dieselbe senkrechte Kapsel
  wie am iPad – ein Tippen rollt ganz nach oben bzw. ganz ans Ende. In der Startliste ‚Reiselogbücher‘ gibt es sie nicht.
  Bewusste Abweichung von Apple (dort Uhrzeit antippen bzw. Scroll-Leiste ziehen – zu schwerfällig).
- Unten etwas mehr Platz (120 px), damit der letzte Tageskasten nicht unter der Kapsel liegt; der Offline-Hinweis lässt
  seitlich Platz für die Kapsel.
- iPad und iPhone: Die Kapsel verschwindet, wenn es nichts zu scrollen gibt (stand schon in R-3.2, jetzt in `ui.js` gebaut).
- Neue Prüfung `tests/kapsel-iphone.mjs` (iPhone hoch und quer, iPad schmal und quer, hell und dunkel, Chromium und WebKit;
  Gegenprobe rot: 14 Fehler). Feste Fassung AppDesign 4.20.0; Designrichtlinie Reiselogbuch 3.19.0 (HIG-Abweichung eingetragen).

Prüfliste P-47 (Schritt für Schritt, Zusammenarbeit allgemein 2.7.0).

**P-47/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und mit Netz neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen; iPhone: in der Startliste ‚Reiselogbücher‘ oben auf ‚…‘.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.19.0 · erstellt am … · AppDesign 4.20.0‘.

**P-47/1 – iPhone hoch**
1. In der Startliste: unten rechts **keine** Kapsel.
2. Ein Reiselogbuch mit vielen Tagen öffnen. Erwartet: unten rechts die Kapsel mit Pfeil nach oben und Pfeil nach unten.
3. Pfeil nach unten antippen: rollt weich bis ganz ans Ende (Statistik); der letzte Inhalt ist nicht verdeckt.
4. Pfeil nach oben antippen: rollt ganz nach oben.

**P-47/2 – iPhone quer und iPad**
1. iPhone quer drehen: Kapsel unten rechts, nicht unter der Notch bzw. dem Rand.
2. iPad: Kapsel wie bisher.

## 3.18.0 – 17.10.2026 (Neben)

Reiselogbuch 3.18.0 · AppDesign 4.19.0 (Designrichtlinie allgemein 4.19.0) · Designrichtlinie Reiselogbuch 3.18.0 · Zusammenarbeit allgemein 2.7.0

T-86 (Fall-Liste AppDesign `arbeit/T-86 Fall-Liste.md`).

- **Link nur über den Namen:** Bei ‚Essen und Trinken‘ und beim Quartier ist nur noch der Name des Lokals bzw. Hotels der
  Google-Maps-Link. Der Name endet jetzt auch an **Komma**, **Doppelpunkt** und **öffnender Klammer** – bisher nur an
  ‚ – ‘ (beim Quartier auch am Komma), sonst wurde die ganze Zeile zum Link. Beispiele: ‚Krone, sehr gut‘, ‚Krone: Schnitzel‘,
  ‚Krone (Terrasse)‘, ‚Hotel X (Zimmer 12)‘ – verlinkt ist jeweils nur ‚Krone‘ bzw. ‚Hotel X‘.
- **Bleibt zusammen:** Uhrzeit und Betrag (‚Café Central 8:30‘, ‚Bier 4,50 €‘), Bindestrich ohne Leerzeichen
  (‚Müller-Bräu‘) und Punkt (‚St. Peter‘).
- Gilt gleich in der Tabelle (iPad), in den Tageskästen (iPhone) und in der Ausgabe (HTML/PDF); die Suche findet Name und Rest.
- Neue Prüfung `tests/link-name.mjs` (Chromium und WebKit, Gegenprobe mit der alten Trennung rot: 16 Fehler).
- Fassung AppDesign bleibt 4.19.0; Designrichtlinie Reiselogbuch 3.18.0 (Abschnitt 2: Maps-Links).

Prüfliste P-46 (Schritt für Schritt, Zusammenarbeit allgemein 2.7.0).

**P-46/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und mit Netz neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen; iPhone: in der Startliste ‚Reiselogbücher‘ oben auf ‚…‘.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.18.0 · erstellt am … · AppDesign 4.19.0‘.

**P-46/1 – Essen und Trinken**
1. Einen Tag antippen und bei ‚Essen und Trinken‘ zwei Zeilen schreiben: ‚Krone, sehr gut‘ und ‚Adler (Terrasse): Schnitzel‘.
2. Häkchen.
3. Erwartet: in der Tabelle (iPhone: im Kasten) ist nur ‚Krone‘ bzw. ‚Adler‘ blau und unterstrichen, der Rest normaler Text.
4. ‚Krone‘ antippen: Google Maps öffnet mit dem Lokal. Den Rest der Zeile antippen: das Fenster ‚Tag‘ öffnet.

**P-46/2 – Bestehende Einträge**
1. Ein älteres Reiselogbuch durchsehen (auch die aus der Konvertierung).
2. Erwartet: wo bisher die ganze Zeile blau war, ist jetzt nur der Name blau; nichts ist abgeschnitten.
3. Auffällige Zeilen (z. B. ein Name mit Komma, der zusammenbleiben soll) bitte melden.

## 3.17.0 – 17.10.2026 (Neben)

Reiselogbuch 3.17.0 · AppDesign 4.19.0 (Designrichtlinie allgemein 4.19.0) · Designrichtlinie Reiselogbuch 3.17.0 · Zusammenarbeit allgemein 2.7.0

T-87 (neue allgemeine Regel R-5.5, AppDesign A-14) und T-88 (Fall-Liste AppDesign `arbeit/A-14 T-88 Fall-Liste.md`).

- **Eingabetaste ‚Fertig‘ (T-87):** In einzeiligen Feldern (Gesamtausgaben, Reisetitel, Reiseteilnehmer, Quartier, Ort)
  heißt die Eingabetaste ‚Fertig‘; sie bestätigt die Eingabe und schließt die Tastatur. Bei den Gesamtausgaben wird der
  Betrag dabei gleich formatiert (‚4.850,00‘). In Fenstern bleibt das Fenster offen – gespeichert wird erst mit dem Häkchen.
- **Fehler behoben:** Bisher hat die Eingabetaste in den Fenstern ‚Tag‘ und ‚Einstellungen‘ das ganze Fenster geschlossen
  (das Fenster ist technisch ein Formular, die Eingabetaste schickte es ab). Gefunden bei der Gegenprobe zu T-87.
- **Mehrzeilige Felder** (Verlauf, Wie war was?, Essen und Trinken, Fazit): die Eingabetaste macht wie bisher eine neue
  Zeile; die Tastatur schließt mit Häkchen oder x. Das Suchfeld behält ‚Suchen‘ (nächster Treffer).
- **Zuletzt verwendetes Reiselogbuch (T-88):** Die App merkt sich je Gerät das zuletzt geöffnete Reiselogbuch. Auf dem iPad
  öffnet es beim Start und ist in der Seitenleiste blau – auch während einer laufenden Reise. Gibt es keines (alte Daten,
  gelöscht), wählt die App wie bisher nach Datum (laufende Reise, sonst die zuletzt beendete, sonst die nächste geplante).
  Mit dem Backup hatte das nichts zu tun. Backup laden und Abgleichen übernehmen den Wert des anderen Geräts nicht.
- **iPhone:** die Startliste bleibt beim Start ohne blauen Eintrag (R-7.2, Entscheidung 17.10.2026).
- Feste Fassung AppDesign 4.19.0; Designrichtlinie Reiselogbuch 3.17.0 (nur Version).

Prüfliste P-45 (Schritt für Schritt, Zusammenarbeit allgemein 2.7.0).

**P-45/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und mit Netz neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen; iPhone: in der Startliste ‚Reiselogbücher‘ oben auf ‚…‘.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.17.0 · erstellt am … · AppDesign 4.19.0‘.
4. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-45/1 – Gesamtausgaben (iPad)**
1. Ein Reiselogbuch öffnen, ganz nach unten zu ‚Gesamtausgaben‘ wischen und ins Feld tippen.
2. Erwartet: die Eingabetaste der Tastatur heißt ‚Fertig‘ (statt ‚Return‘ bzw. dem Pfeil).
3. Einen Betrag tippen, z. B. 4850, dann ‚Fertig‘.
4. Erwartet: die Tastatur verschwindet, im Feld steht ‚4.850,00‘, die Seite springt nicht.

**P-45/2 – Gesamtausgaben (iPhone)**
1. Wie P-45/1/1. Das iPhone zeigt eine Zifferntastatur ohne Eingabetaste.
2. Erwartet: über der Tastatur gibt es ‚Fertig‘ bzw. ✓ – antippen schließt die Tastatur, der Betrag steht formatiert da.
   Fehlt diese Leiste, bitte melden (dann braucht es eine eigene Lösung).

**P-45/3 – Fenster ‚Tag‘ und ‚Einstellungen‘**
1. Einen Tag antippen, ins Feld ‚Quartier‘ tippen, etwas schreiben, ‚Fertig‘ antippen.
2. Erwartet: Tastatur zu, das Fenster bleibt offen; das Häkchen ist blau.
3. Ins Feld ‚Verlauf‘ tippen, Eingabetaste: neue Zeile, Tastatur bleibt.
4. Mit x und ‚Änderungen verwerfen‘ schließen. Dasselbe im Fenster ‚Einstellungen‘ mit ‚Reisetitel‘.

**P-45/4 – Zuletzt verwendetes Reiselogbuch (iPad)**
1. Ein anderes Reiselogbuch als das, das beim Start offen ist, in der Seitenleiste antippen.
2. App ganz schließen (wie P-45/0/1) und neu öffnen.
3. Erwartet: genau dieses Reiselogbuch ist offen und in der Seitenleiste blau.
4. iPhone: App ganz schließen und neu öffnen – die Startliste ist wie bisher ohne blauen Eintrag.

## 3.16.0 – 16.10.2026 (Neben)

Reiselogbuch 3.16.0 · AppDesign 4.18.0 (Designrichtlinie allgemein 4.18.0) · Designrichtlinie Reiselogbuch 3.16.0 · Zusammenarbeit allgemein 2.7.0

A-13 (neue allgemeine Regel R-7.3). Gilt auf iPad und iPhone gleich.

- **Fehler behoben:** Nach dem Erfassen eines Tages stand die Tabelle weiter unten, der erfasste Tag war nach oben
  verschwunden. Ursache: Beim Schreiben im Fenster ‚Tag‘ schiebt Safari für die Tastatur die ganze Seite und schiebt sie
  nicht zurück. Jetzt steht die Tabelle (iPhone: die Tageskästen) still, solange das Fenster offen ist, und nach dem
  Schließen genau wie vorher.
- **Zeile kurz blau:** Nach dem Schließen wird die Zeile des Tages kurz blau hinterlegt und blendet aus – man sieht, welcher
  Tag es war.
- **Nach ‹ ›:** Wer im Fenster zu einem späteren Tag geblättert hat, findet dessen Zeile nach dem Schließen sichtbar – die
  Tabelle rollt nur so weit wie nötig.
- Feste Fassung AppDesign 4.18.0; Designrichtlinie Reiselogbuch 3.16.0 (nur Version).

Prüfliste P-44 (Schritt für Schritt, Zusammenarbeit allgemein 2.7.0).

**P-44/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und mit Netz neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen; iPhone: in der Startliste ‚Reiselogbücher‘ oben auf ‚…‘.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.16.0 · erstellt am … · AppDesign 4.18.0‘.
4. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-44/1 – Tabelle steht still (iPad quer)**
1. Ein Reiselogbuch mit vielen Tagen öffnen und die Tabelle so weit nach unten wischen, dass ein Tag in der Mitte des
   Bildschirms steht. Merken, welcher Tag ganz oben steht.
2. Den Tag in der Mitte antippen, ins Feld ‚Programm‘ (oder ‚Wie war was?‘) tippen, ein paar Worte schreiben – auch einmal
   mit Diktieren.
3. Häkchen antippen.
4. Erwartet: oben steht derselbe Tag wie vorher; die Zeile des bearbeiteten Tages ist an derselben Stelle und leuchtet kurz
   blau auf.
5. Dasselbe mit x (ohne Änderung): wieder alles wie vorher.

**P-44/2 – Blättern im Fenster (iPad quer)**
1. Einen Tag weit unten auf dem Bildschirm antippen.
2. Im Fenster mit ‹ › (oben rechts, Pfeil nach rechts) vier Tage weiterblättern, dann Häkchen.
3. Erwartet: die Zeile des zuletzt gezeigten Tages ist ganz sichtbar (die Tabelle ist nur so weit gerollt wie nötig) und
   leuchtet kurz blau.

**P-44/3 – iPhone und iPad hoch**
1. P-44/1 auf dem iPhone (Tageskästen) und auf dem iPad hoch wiederholen.
2. Erwartet: wie P-44/1 – die Kästen bzw. die Tabelle stehen nach dem Schließen wie vorher, der Kasten leuchtet kurz blau.

## 3.15.1 – 15.10.2026 (Korrektur)

Reiselogbuch 3.15.1 · AppDesign 4.16.1 (Designrichtlinie allgemein 4.16.1) · Designrichtlinie Reiselogbuch 3.15.1 · Zusammenarbeit allgemein 2.5.0

AppDesign A-10. In der App ändert sich nichts.

- **Feste Fassung 4.16.1:** der volle Prüflauf (`tests/alle.mjs`) startet höchstens so viele Browser gleichzeitig, wie der
  Rechner Kerne hat (4 statt 8), und erst alle in Chromium, dann alle in WebKit (A-11) – beim Veröffentlichen von 3.15.0
  und 3.15.1 war er mehrmals rot durch WebKit unter Last. Ursache: der Netzprozess von WebKit stürzt in der Prüfumgebung
  unter Last ab und verliert den Speicher des Service Workers – `offline-regeln` erkennt das jetzt und prüft die Ansicht
  einmal neu (kein Fehler der App).
- **Zusammenarbeit allgemein 2.5.0:** per du; bei offensichtlichem Regelbruch widerspricht Claude und setzt erst nach
  ausdrücklicher Umsetzungspflicht um.
- Designrichtlinie Reiselogbuch 3.15.1 (nur Version).

Prüfliste P-42 (Schritt für Schritt, Zusammenarbeit allgemein 2.5.0).

**P-42/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und mit Netz neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.15.1 · erstellt am … · AppDesign 4.16.1‘.
4. iPhone: in der Startliste ‚Reiselogbücher‘ oben auf ‚…‘ (Mehr) tippen.
5. Erwartet: dieselbe Zeile mit ‚Version 3.15.1‘ und ‚AppDesign 4.16.1‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-42/1 – Offline-Start nach dem Update (iPad und iPhone)** – neuer Speichername des Service Workers und neuer Fassungs-Ordner (R-1.5)
1. Zuerst P-42/0: App mit Netz geöffnet, ‚Version 3.15.1 · AppDesign 4.16.1‘ ist zu sehen.
2. App ganz schließen (vom unteren Rand nach oben wischen, App wegschieben).
3. Kontrollzentrum öffnen, Flugmodus ein, WLAN aus.
4. App neu öffnen.
5. Erwartet: die App erscheint nach höchstens etwa 3 Sekunden, nie eine weiße Seite – am iPhone die Startliste, am iPad die
   laufende Reise; kurz ‚Du bist offline‘, unter der Backup-Kachel grau ‚Offline – alles bleibt auf diesem Gerät‘.
6. Erwartet: im Mehr-Menü (‚…‘) weiterhin ‚Version 3.15.1 · AppDesign 4.16.1‘.
7. Flugmodus aus, WLAN ein.
8. Erwartet: kurz ‚Wieder online‘; die graue Zeile verschwindet.

## 3.15.0 – 15.10.2026 (Neben)

Reiselogbuch 3.15.0 · AppDesign 4.16.0 (Designrichtlinie allgemein 4.16.0) · Designrichtlinie Reiselogbuch 3.15.0 · Zusammenarbeit allgemein 2.4.0

T-84 – seit 15.10.2026 allgemeine Regel R-7.2 (AppDesign A-09). Fall-Liste F-1 bis F-18: `AppDesign/arbeit/T-84 Fall-Liste.md`.

- **iPhone startet in der Startliste (R-7.2):** Jedes Neuladen der App beginnt im iPhone-Aufbau in der Startliste
  ‚Reiselogbücher‘, ganz oben, **kein Eintrag blau** (es ist noch nichts geöffnet). Ein Reiselogbuch antippen öffnet es wie
  bisher beim ersten offenen Tag; nach ‚Zurück‘ ist es blau. Kurz in eine andere App und zurück ändert nichts – dort, wo man
  war. Hat iOS die App im Hintergrund beendet, beginnt sie wieder in der Startliste (Safari meldet nicht, warum neu geladen
  wird; Designrichtlinie allgemein 13).
- **Der Aufbau entscheidet:** auch ein iPad im schmalen Fenster (iPhone-Aufbau) beginnt in der Startliste; iPad quer und
  hoch bleiben unverändert (laufende Reise offen, Seitenleiste eingeblendet).
- **Prüfungen:** neu `tests/start-regeln.mjs` (F-1 bis F-11, F-13 bis F-17, hell und dunkel; Gegenprobe: altes
  Startverhalten und blauer Eintrag beim Start werden rot), dazu die allgemeine Prüfung `start.mjs` aus AppDesign;
  `ablauf-iphone`, `hig`, `backup-regeln`, `kontextmenue-regeln` und `ablauf-seitenleiste-position` beginnen am iPhone
  jetzt in der Startliste. F-12 (Start ohne Netz) prüft `offline-regeln`, F-18 (Löschen) `ablauf-iphone`.
- **Arbeitsweise (AppDesign A-07, Zusammenarbeit 2.4.0):** zu Beginn gezielt lesen, ein voller Prüflauf je Version;
  `CLAUDE.md` 3.3.0.
- **Feste Fassung 4.16.0**; Designrichtlinie Reiselogbuch 3.15.0.

Apple-Review: Apple stellt nach einem Neustart meist den letzten Ort wieder her (HIG ‚Launching‘) – **weicht ab, weil**
die Startliste auf dem kleinen Bildschirm der feste Ausgangspunkt sein soll (entschieden 14./15.10.2026); kein Eintrag blau
**entspricht HIG** 4 (Auswahl nur, solange der Inhalt offen ist); Aufbau statt Gerät **entspricht** R-1.1.

Prüfliste P-41 (Schritt für Schritt, Zusammenarbeit allgemein 2.4.0).

**P-41/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und mit Netz neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.15.0 · erstellt am … · AppDesign 4.16.0‘.
4. iPhone: in der Startliste ‚Reiselogbücher‘ oben auf ‚…‘ (Mehr) tippen.
5. Erwartet: dieselbe Zeile mit ‚Version 3.15.0‘ und ‚AppDesign 4.16.0‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-41/1 – iPhone hoch: Neustart beginnt in der Startliste**
1. iPhone hoch, hell. Ein Reiselogbuch antippen, sodass es offen ist.
2. App ganz schließen (vom unteren Rand nach oben wischen, App nach oben wegschieben) und neu öffnen.
3. Erwartet: die Startliste ‚Reiselogbücher‘, ganz oben; **keine** Kachel ist blau; keine Meldung.

**P-41/2 – iPhone quer: Neustart beginnt in der Startliste**
1. iPhone quer, dunkel (Kontrollzentrum → Darstellung dunkel). Ein Reiselogbuch öffnen.
2. App ganz schließen und quer neu öffnen.
3. Erwartet: die Startliste ‚Reiselogbücher‘, keine Kachel blau, die Backup-Kachel unten.

**P-41/3 – iPhone: kurz weg und zurück bleibt, wo es war**
1. iPhone hoch, hell. Ein Reiselogbuch öffnen und etwas nach unten wischen.
2. Zum Home-Bildschirm wechseln, eine andere App kurz öffnen, über den App-Umschalter zurück zum Reiselogbuch.
3. Erwartet: dasselbe Reiselogbuch an derselben Stelle, keine Meldung.
4. Hinweis: War die App lange im Hintergrund und hat iOS sie beendet, beginnt sie in der Startliste – das ist so gewollt.

**P-41/4 – iPhone: aus der Startliste öffnen und zurück**
1. Weiter von P-41/1: in der Startliste die laufende Reise antippen.
2. Erwartet: das Reiselogbuch öffnet beim ersten offenen Tag.
3. Oben links ‚‹‘ (chevron-left) tippen.
4. Erwartet: die Startliste; die eben geöffnete Reise ist blau.

**P-41/5 – iPad quer und hoch: unverändert**
1. iPad quer, hell. App ganz schließen und neu öffnen.
2. Erwartet: die laufende Reise ist offen, die Seitenleiste fest links, die laufende Reise darin blau.
3. iPad hoch drehen, App ganz schließen und neu öffnen.
4. Erwartet: die laufende Reise ist offen, die Seitenleiste darübergelegt, die laufende Reise blau.

## 3.14.1 – 15.10.2026 (Korrektur)

Reiselogbuch 3.14.1 · AppDesign 4.15.1 (Designrichtlinie allgemein 4.15.1) · Designrichtlinie Reiselogbuch 3.14.1 · Zusammenarbeit allgemein 2.3.2

Korrektur zu P-39 (ok bis auf /1 und /2; Auswertung `AppDesign/arbeit/P-39 Rückmeldung.md`).

- **iPad erkennt den Wechsel bei offener App (P-39/1 und /2):** Die App fragt jetzt, solange sie sichtbar ist, alle 10 s
  den Service Worker, ob das Netz antwortet; vorher hing der Wechsel an Meldungen von Safari, die das iPad als
  Home-Bildschirm-App nicht zuverlässig sendet. Meldung und Zeile kommen damit spätestens nach etwa 10–15 s.
- **Service Worker (`sw.js`):** prüft mit einem kleinen Abruf ohne Inhalt (`HEAD`) und gibt jeder Antwort die Nummer der
  Frage mit.
- **Prüfung** `tests/offline-regeln.mjs`: neuer Fall F-17 ‚Gerät ohne Safari-Meldung‘ (erst rot, dann grün).
  **Warum übersehen:** die Prüfung schaltete das Netz so ab, dass der Browser immer ‚offline‘ meldet – wie es das iPad
  nicht tut.
- **Feste Fassung 4.15.1**; Designrichtlinie Reiselogbuch 3.14.1 (nur Version).

Prüfliste P-40 (Schritt für Schritt, Zusammenarbeit allgemein 2.3.2).

**P-40/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und mit Netz neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.14.1 · erstellt am … · AppDesign 4.15.1‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.14.1‘ und ‚AppDesign 4.15.1‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-40/1 – iPad: offline gehen, während die App offen ist**
1. iPad quer, hell, App offen mit Seitenleiste.
2. Kontrollzentrum öffnen (oben rechts nach unten wischen), Flugmodus ein, WLAN aus, Kontrollzentrum schließen.
3. Höchstens 15 Sekunden warten, die App nicht verlassen.
4. Erwartet: unten mittig rechts neben der Seitenleiste ‚Du bist offline‘, darunter grau ‚Die App arbeitet weiter; alles
   bleibt auf diesem Gerät.‘ – nach etwa 4 s verschwindet sie.
5. Erwartet: unter der Backup-Kachel bleibt grau ‚Offline – alles bleibt auf diesem Gerät‘ stehen.

**P-40/2 – iPad: wieder online, während die App offen ist**
1. Weiter von P-40/1: Flugmodus aus, WLAN ein; warten, bis oben das WLAN-Zeichen erscheint.
2. Höchstens 15 Sekunden warten, die App nicht verlassen.
3. Erwartet: unten kurz ‚Wieder online‘; die graue Zeile unter der Backup-Kachel ist weg.

## 3.14.0 – 15.10.2026 (Neben)

Reiselogbuch 3.14.0 · AppDesign 4.15.0 (Designrichtlinie allgemein 4.15.0) · Designrichtlinie Reiselogbuch 3.14.0 · Zusammenarbeit allgemein 2.3.2

A-06 Offline-Hinweis (Variante c, allgemeine Regel R-1.5; Muster und Fall-Liste `AppDesign/arbeit/A-06 Muster und Fall-Liste.md`).

- **Graue Zeile unter der Backup-Kachel** (Seitenleiste iPad, Startliste iPhone): solange die App offline arbeitet,
  ‚Offline – alles bleibt auf diesem Gerät‘ mit Icon `wifi-off`; die Liste läuft auch hinter der Zeile durch.
- **Kurze Meldung** unten: ‚Du bist offline‘ (darunter grau ‚Die App arbeitet weiter; alles bleibt auf diesem Gerät.‘) beim
  Wechsel und beim Start ohne Netz, ‚Wieder online‘ beim Zurückkommen; mittig neben der Seitenleiste, auf dem iPhone über
  der Backup-Kachel, verschwindet nach 4 s, Antippen schließt sie, auch über einem offenen Fenster sichtbar.
- **Service Worker (`sw.js`):** meldet der App, ob sie aus dem Speicher kommt (kein Netz oder Netz hängt länger als 3 s)
  und ob das Netz wieder antwortet; die App fragt beim Start und bei der Rückkehr in die App.
- **Prüfung `tests/offline-regeln.mjs`** mit den Fällen F-1 bis F-16 (iPad und iPhone, Chromium und WebKit, mit langer
  Liste). Beim Bauen gefunden und behoben: ‚Wieder online‘ fehlte (der Service Worker meldete nur Änderungen aus seiner
  Sicht); bei schnellem Hin und Her überschrieb eine verspätete Antwort ‚an‘ den Zustand ‚offline‘; bei hängendem Netz kam
  die Meldung in WebKit zu spät (wartete auf Manifest und Icons); auf dem iPhone verdeckte die Meldung die Backup-Kachel
  und wurde beim Wechsel in die Startliste nicht neu ausgerichtet. Gegenprobe: ohne Meldung 32 Fehler.
- **Feste Fassung 4.15.0**; Designrichtlinie Reiselogbuch 3.14.0 (nur Version).

Prüfliste P-39 (Schritt für Schritt, Zusammenarbeit allgemein 2.3.2).

**P-39/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und mit Netz neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.14.0 · erstellt am … · AppDesign 4.15.0‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.14.0‘ und ‚AppDesign 4.15.0‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-39/1 – iPad: offline gehen, während die App offen ist**
1. iPad quer, hell, App offen mit Seitenleiste.
2. Kontrollzentrum öffnen (oben rechts nach unten wischen) und den Flugmodus einschalten; WLAN aus. Kontrollzentrum schließen.
3. Erwartet: unten mittig rechts neben der Seitenleiste die Meldung ‚Du bist offline‘, darunter grau ‚Die App arbeitet
   weiter; alles bleibt auf diesem Gerät.‘ – nach etwa 4 s verschwindet sie.
4. Erwartet: unter der Backup-Kachel grau ‚Offline – alles bleibt auf diesem Gerät‘ (bleibt stehen).

**P-39/2 – iPad: wieder online**
1. Weiter von P-39/1: Flugmodus ausschalten, WLAN ein, warten, bis das WLAN-Zeichen oben erscheint.
2. Erwartet: unten kurz ‚Wieder online‘; die graue Zeile unter der Backup-Kachel ist weg.
3. Kommt die Meldung nicht von selbst: App kurz verlassen (Home-Bildschirm) und wieder öffnen – dann erscheint sie.

**P-39/3 – iPad: Start ohne Netz, hoch und dunkel**
1. iPad hoch, Darstellung dunkel. App ganz schließen, Flugmodus einschalten.
2. App öffnen.
3. Erwartet: nach höchstens 3–5 s erscheint die App (keine weiße Seite), die Seitenleiste liegt über dem Inhalt.
4. Erwartet: unten rechts neben der Seitenleiste kurz ‚Du bist offline‘ (gut lesbar), unter der Backup-Kachel die graue Zeile.
5. Ein Reiselogbuch antippen: die Seitenleiste schließt sich, die Tabelle ist da. Flugmodus wieder ausschalten.

**P-39/4 – iPhone: offline gehen in der Startliste und im Reiselogbuch**
1. iPhone hoch, hell, Startliste ‚Reiselogbücher‘ offen.
2. Flugmodus einschalten.
3. Erwartet: unten mittig über der Backup-Kachel kurz ‚Du bist offline‘ (verdeckt die Backup-Kachel nicht); danach unter
   der Backup-Kachel grau ‚Offline – alles bleibt auf diesem Gerät‘.
4. Ein Reiselogbuch öffnen, Flugmodus aus- und wieder einschalten.
5. Erwartet: unten mittig kurz ‚Wieder online‘, dann ‚Du bist offline‘.
6. Zurück (chevron-left) in die Startliste: die graue Zeile steht unter der Backup-Kachel.

**P-39/5 – iPhone: Start ohne Netz, quer**
1. iPhone quer, App ganz schließen, Flugmodus ein.
2. App öffnen.
3. Erwartet: die App erscheint nach höchstens 3–5 s, unten kurz ‚Du bist offline‘.
4. Flugmodus ausschalten.

## 3.13.2 – 14.10.2026 (Korrektur)

Reiselogbuch 3.13.2 · AppDesign 4.14.2 (Designrichtlinie allgemein 4.14.2) · Designrichtlinie Reiselogbuch 3.13.2 · Zusammenarbeit allgemein 2.3.2

Korrektur zu P-37 (ok bis auf /2 und /3; Auswertung `AppDesign/arbeit/P-37 Rückmeldung.md`).

- **Quartier-Kopf (P-37/2, R-5.1 ergänzt, allgemeine Regel):** ‚Quartier wie Vortag‘ und ‚keinen Google-Maps Link‘ bilden eine
  Gruppe. iPhone quer: beide stehen jetzt in der Zeile der Überschrift ‚Quartier‘ (vorher brach ‚keinen Google-Maps Link‘
  allein um). iPhone hoch: Die Gruppe steht wie bisher unter der Überschrift. Am ersten Tag passt die einzelne Schaltfläche
  neben ‚Quartier‘ und steht jetzt dort. Ebenso bei ‚Essen und Trinken‘. Ursache: allgemeine Regel in `design.css`
  (Überschrift mindestens 60 % breit), schon vor 3.13. Warum übersehen: keine Regel dafür, und die Prüfungen öffneten am
  iPhone nur den ersten Tag (dort gibt es ‚wie Vortag‘ nicht) – jetzt auch einen Folgetag.
- **Offline-Start (P-37/3, neue Regel R-1.5):** Das iPad zeigte ohne Netz eine weiße Seite. Nachgebaut: Antwortet das Netz
  nicht sofort mit einem Fehler, sondern hängt (wie ein schlechtes oder gerade abgeschaltetes WLAN), wartete der Service
  Worker unbegrenzt auf das Netz – weiße Seite, in Chromium und WebKit. Jetzt: höchstens 3 s, dann aus dem Speicher; die
  feste Fassung zuerst aus dem Speicher; ohne Netz unter anderer Adresse geöffnet die gespeicherte App; beim Einrichten alle
  Dateien frisch. Warum übersehen: die Prüfungen luden die App als Datei, ohne Service Worker – offline wurde nur am Gerät
  geprüft. Neu: `tests/offline-regeln.mjs` (eigener Webserver, echter Service Worker, iPad und iPhone; erst rot, dann grün).
- **Feste Fassung 4.14.2** (mit dem Skript `vorbereiten`); Designrichtlinie Reiselogbuch 3.13.2 (nur Version).
- **Neu im Backlog von AppDesign:** A-06 Offline-Hinweis (Prio 1, allgemeine Regel, zuerst Muster).

Prüfliste P-38 (Schritt für Schritt, Zusammenarbeit allgemein 2.3.2).

**P-38/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.13.2 · erstellt am … · AppDesign 4.14.2‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.13.2‘ und ‚AppDesign 4.14.2‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-38/1 – Quartier-Kopf im iPhone-Querformat**
1. iPhone quer, hell: ein Reiselogbuch öffnen und einen Tag öffnen, der **nicht** der erste Tag ist.
2. Zum Schritt ‚Quartier‘ scrollen.
3. Erwartet: ‚Quartier wie Vortag‘ und ‚keinen Google-Maps Link‘ stehen nebeneinander rechts in der Zeile der Überschrift ‚Quartier‘.
4. iPhone hochkant drehen.
5. Erwartet: Beide Schaltflächen stehen unter der Überschrift, untereinander, linksbündig – keine allein neben der Überschrift.

**P-38/2 – Offline auf dem iPad**
1. iPad: die App nach P-38/0 einmal geöffnet haben (mit Netz), dann ganz schließen.
2. Flugmodus einschalten (Kontrollzentrum → Flugzeug), WLAN aus.
3. App öffnen und höchstens 5 Sekunden warten.
4. Erwartet: Die App erscheint mit den Reiselogbüchern, keine weiße Seite; Versionszeile im Mehr-Menü ‚Version 3.13.2‘ und ‚AppDesign 4.14.2‘.
5. Ein Reiselogbuch öffnen. Erwartet: Tabelle und Tage wie online.
6. Flugmodus ausschalten.

**P-38/3 – Offline auf dem iPhone**
1. iPhone: wie P-38/2, Schritte 1–3.
2. Erwartet: Die App erscheint innerhalb von 5 Sekunden mit der Startliste; Versionszeile ‚Version 3.13.2‘ und ‚AppDesign 4.14.2‘.
3. Flugmodus ausschalten.

## 3.13.1 – 14.10.2026 (Korrektur)

Reiselogbuch 3.13.1 · AppDesign 4.14.1 (Designrichtlinie allgemein 4.14.1) · Designrichtlinie Reiselogbuch 3.13.1 · Zusammenarbeit allgemein 2.3.2

Korrektur zu 3.13.0 (Fund `AppDesign/arbeit/A-05 Fund Markierung.md`, Entscheidung a). Die App sieht unverändert aus.

- **README ‚Verwendete Versionen‘:** Die Links auf Designrichtlinie allgemein, Zusammenarbeit und Bausteine zeigten auf die
  Git-Markierung `v4.14.0`, die es auf GitHub nicht gibt (aus der Cloud gesperrt) – Fehlerseite. Jetzt zeigen sie auf
  `main/fassung/4.14.1/…`; die Fassung enthält seit AppDesign 4.14.1 auch den Text der Richtlinien. Warum übersehen: der
  Selbsttest lud in ein lokales Schein-Repo hoch, das Markierungen annimmt.
- **Feste Fassung 4.14.1:** `index.html`, `sw.js` und alle Prüfskripte auf `fassung/4.14.1/` (mit dem Skript `vorbereiten`).
- Designrichtlinie Reiselogbuch 3.13.1 (nur Version).

Prüfliste P-37 (Schritt für Schritt, Zusammenarbeit allgemein 2.3.2) – **ersetzt P-36** (noch nicht geprüft). Kein sichtbarer
Unterschied erwartet.

**P-37/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.13.1 · erstellt am … · AppDesign 4.14.1‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.13.1‘ und ‚AppDesign 4.14.1‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-37/1 – App sieht unverändert aus (iPad)**
1. iPad quer, hell: App öffnen, ein Reiselogbuch mit mehreren Tagen öffnen.
2. Seitenleiste, Kopfzeile mit Kapsel, Tabelle und Mehr-Menü ansehen; dann iPad hochkant drehen.
3. Mehr-Menü → Darstellung ‚Dunkel‘ wählen und dasselbe ansehen, danach wieder ‚Automatisch‘.
4. Erwartet: alles sieht aus wie in 3.12.0 (Schrift, Farben, Schaltflächen, Abstände), hell und dunkel, quer und hoch.
5. Erwartet: beim Start kein Fenster ‚Neue Version wird geladen‘.

**P-37/2 – App sieht unverändert aus (iPhone)**
1. iPhone hoch, hell: App öffnen, Startliste ‚Reiselogbücher‘ ansehen, ein Reiselogbuch öffnen, einen Tag öffnen.
2. Darstellung ‚Dunkel‘ wählen und dasselbe ansehen, danach wieder ‚Automatisch‘.
3. Erwartet: alles sieht aus wie in 3.12.0, hell und dunkel; kein Fenster ‚Neue Version wird geladen‘.

**P-37/3 – Offline mit der eigenen Fassung (iPad oder iPhone)**
1. Die App nach P-37/0 einmal geöffnet haben, dann ganz schließen.
2. Flugmodus einschalten (Kontrollzentrum → Flugzeug), WLAN aus.
3. App öffnen, ein Reiselogbuch öffnen und das Mehr-Menü der Seitenleiste bzw. Startliste ansehen.
4. Erwartet: die App startet normal und sieht aus wie online; die Versionszeile nennt ‚Version 3.13.1‘ und ‚AppDesign 4.14.1‘;
   kein Fenster ‚Neue Version wird geladen‘.
5. Flugmodus wieder ausschalten.

**P-37/4 – Links in der README (Safari)**
1. In Safari github.com/g811141a/ReiseLogBuch öffnen und zur Tabelle ‚Verwendete Versionen‘ scrollen.
2. In der Zeile ‚Designrichtlinie allgemein‘ auf den Link tippen.
3. Erwartet: die Designrichtlinie öffnet sich, oben ‚**Version 4.14.1**‘, der Pfad oben nennt `fassung/4.14.1` – keine Fehlerseite.
4. Zurück, in der Zeile ‚Zusammenarbeit allgemein‘ auf den Link tippen.
5. Erwartet: die Zusammenarbeit öffnet sich mit ‚**Version 2.3.2**‘, ebenfalls aus `fassung/4.14.1`.

## 3.13.0 – 14.10.2026 (Neben)

Reiselogbuch 3.13.0 · AppDesign 4.14.0 (Designrichtlinie allgemein 4.14.0) · Designrichtlinie Reiselogbuch 3.13.0 · Zusammenarbeit allgemein 2.3.2

A-05 Version B – feste AppDesign-Fassung und Veröffentlichungs-Skript (Fall-Liste `AppDesign/arbeit/A-05 Fall-Liste.md`,
Teile D und E). Die App sieht unverändert aus; sie lädt die Bausteine jetzt aus ihrer festen Fassung.

- **Feste Fassung (D-2, D-8):** `index.html` und `sw.js` laden `../AppDesign/fassung/4.14.0/design.css` und `…/ui.js`
  statt `../AppDesign/v4/…?v=4.13.0`; `AD_NEEDED` = 4.14.0. Eine neue AppDesign-Version ändert das Reiselogbuch nicht mehr,
  bis es nach Rückfrage gehoben wird (Zusammenarbeit 0 Nr. 10). Offline aus dem Zwischenspeicher wie bisher.
- **Prüfungen der eigenen Fassung (D-1):** alle Prüfskripte binden `../../AppDesign/fassung/4.14.0/tests/…` ein.
- **Neue Prüfungen (version-regeln, doku-regeln):** Pfad = `AD_NEEDED` in `index.html` und `sw.js`, nichts aus `v4/`; ein
  absichtlich geänderter Arbeitsstand `v4/` (roter Knopf, Skriptfehler) erreicht die App nicht (D-3); Prüfsummen der
  Fassungen (D-1); README verlinkt die Richtlinien der Markierung `v4.14.0` (D-6); ‚gilt sofort für alle Apps‘ und `?v=`
  nirgends mehr (D-7, W-4).
- **Versionen mit dem Skript (E-1):** `node ../AppDesign/werkzeug/veroeffentlichen.mjs vorbereiten --ad 4.14.0 --app
  reiselogbuch=3.13.0` hat `APP_VERSION`, `APP_BUILT`, Cache-Name, Pfade, README-Tabelle, PROMPT-Zeile, Richtlinien- und
  Backlog-Kopf erhöht; veröffentlicht wird mit `… los` (erst AppDesign, dann das Reiselogbuch).
- **CLAUDE.md 3.2.0**, Designrichtlinie Reiselogbuch 3.13.0 (nur Version und Verweis auf allgemein 4.14.0).

Prüfliste P-36 (Schritt für Schritt, Zusammenarbeit allgemein 2.3.2). Kein sichtbarer Unterschied erwartet.

**P-36/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.13.0 · erstellt am … · AppDesign 4.14.0‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.13.0‘ und ‚AppDesign 4.14.0‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-36/1 – App sieht unverändert aus (iPad)**
1. iPad quer, hell: App öffnen, ein Reiselogbuch mit mehreren Tagen öffnen.
2. Seitenleiste, Kopfzeile mit Kapsel, Tabelle und Mehr-Menü ansehen; dann iPad hochkant drehen.
3. In den Einstellungen (Mehr-Menü → Darstellung) ‚Dunkel‘ wählen und dasselbe ansehen, danach wieder ‚Automatisch‘.
4. Erwartet: alles sieht aus wie in 3.12.0 (Schrift, Farben, Schaltflächen, Abstände), hell und dunkel, quer und hoch.
5. Erwartet: beim Start kein Fenster ‚Neue Version wird geladen‘.

**P-36/2 – App sieht unverändert aus (iPhone)**
1. iPhone hoch, hell: App öffnen, Startliste ‚Reiselogbücher‘ ansehen, ein Reiselogbuch öffnen, einen Tag öffnen.
2. Darstellung ‚Dunkel‘ wählen und dasselbe ansehen, danach wieder ‚Automatisch‘.
3. Erwartet: alles sieht aus wie in 3.12.0, hell und dunkel; kein Fenster ‚Neue Version wird geladen‘.

**P-36/3 – Offline mit der eigenen Fassung (iPad oder iPhone)**
1. Die App nach P-36/0 einmal geöffnet haben, dann ganz schließen.
2. Flugmodus einschalten (Kontrollzentrum → Flugzeug), WLAN aus.
3. App öffnen, ein Reiselogbuch öffnen und das Mehr-Menü der Seitenleiste bzw. Startliste ansehen.
4. Erwartet: die App startet normal und sieht aus wie online; die Versionszeile nennt ‚Version 3.13.0‘ und ‚AppDesign 4.14.0‘;
   kein Fenster ‚Neue Version wird geladen‘.
5. Flugmodus wieder ausschalten.

## 3.12.0 – 14.10.2026 (Neben)

Reiselogbuch 3.12.0 · AppDesign 4.13.0 (Designrichtlinie allgemein 4.13.0) · Designrichtlinie Reiselogbuch 3.12.0 · Zusammenarbeit allgemein 2.3.1

A-05 Version A – Prüfungen 2.0 (Fall-Liste `AppDesign/arbeit/A-05 Fall-Liste.md`). Sichtbar ändert sich nichts; neu ist nur
eine unsichtbare, größere Antippfläche an kurzen Quartiernamen.

- **Quartier-Link (R-3.1, Fund der neuen Grundregeln):** Der Maps-Link eines Quartiers war nur so breit wie sein Name –
  ‚Hotel‘ 42 px statt mindestens 44. Jetzt ist die Antippfläche unsichtbar mindestens 44 px breit (wie iOS); Schrift und
  Abstände bleiben gleich. Warum übersehen: `hig.mjs` prüfte nur mit langen Quartiernamen; erst die Grundregeln nach jedem
  Schritt der Ablauf-Tests laufen auch mit ‚Hotel‘.
- **Alle 19 Prüfskripte melden Fehler** mit Sollwert und Rückgabewert (vorher gaben 6 nur Werte aus und konnten nie rot
  werden, `alle.sh` meldete immer 0); Grundregeln nach jedem Schritt; jeder Test in Chromium und WebKit.
- **`tests/alle.mjs` (neu):** alle Prüfungen parallel, schnellste zuerst, Abbruch beim ersten Fehler; `alle.sh` ruft es auf.
  Dauer: 40 Läufe (Chromium + WebKit) in etwa 4 min, vorher 9 min 15 s nur Chromium.
- **`tastatur.mjs`:** Tastatur wie Safari über den sichtbaren Bereich nachgebildet – vorher schaltete das verkleinerte
  Fenster die App in die iPhone-Ansicht, geprüft wurde also die falsche Ansicht; jetzt iPad quer und hoch, iPhone hoch.
- **Gegenproben:** `node tests/alle.mjs --gegenprobe` (40 Läufe rot) und `--gegenprobe grundregeln` (24 Läufe rot) – jeder
  Test kann rot werden.
- **CLAUDE.md 3.1.0**, Designrichtlinie Reiselogbuch 3.12.0 (Ausprägung R-3.1 Maps-Link).

Prüfliste P-35 (Schritt für Schritt, Zusammenarbeit allgemein 2.3.1). Bis auf P-35/1 kein sichtbarer Unterschied erwartet.

**P-35/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.12.0 · erstellt am … · AppDesign 4.13.0‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.12.0‘ und ‚AppDesign 4.13.0‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-35/1 – Kurzen Quartiernamen antippen (iPad)**
1. iPad quer, hell: ein Reiselogbuch öffnen und einen Tag mit einem kurzen Quartiernamen suchen (sonst im Fenster des Tages
   bei ‚Quartier‘ z. B. ‚Hotel‘ eintragen, Ort z. B. ‚Wien‘, Häkchen).
2. In der Tabelle in der Spalte Quartier knapp **neben** den unterstrichenen bzw. blauen Namen tippen (etwa eine
   Fingerkuppe rechts davon, noch vor dem Komma bzw. dem Ort).
3. Erwartet: Google Maps öffnet sich mit dem Quartier – wie beim Tippen direkt auf den Namen.
4. Erwartet: Der Name sieht aus wie vorher (gleiche Schrift, kein zusätzlicher Abstand vor dem Komma).

## 3.11.7 – 14.10.2026 (Korrektur)

Reiselogbuch 3.11.7 · AppDesign 4.12.2 (Designrichtlinie allgemein 4.12.2) · Designrichtlinie Reiselogbuch 3.11.7 · Zusammenarbeit allgemein 2.2.0

A-02 Schritte 3 und 4 – nur Texte und Prüfungen, die App sieht gleich aus:

- **Designrichtlinie Reiselogbuch 3.11.7:** Wiederholungen allgemeiner Regeln durch Verweise ersetzt (Backup-Kachel R-9.1,
  Suche R-2.3, Vorschau R-6.4, Abfragen R-4.3, Diktieren und Großbuchstaben R-5.2); alter Text ‚Backup laden … werden
  ersetzt‘ gestrichen (seit 4.10.0 Abfrage mit Abgleichen und Ersetzen, R-9.2); Feldnamen des Abgleichberichts wie in der
  App (‚Reisemittel‘ statt ‚Verkehrsmittel‘).
- **PROMPT.md:** Versionszeile nachgeführt (stand noch auf 3.11.4 / 4.11.4); ‚Läuft nur auf dem iPad‘ → iPad und iPhone;
  ‚Backup laden ersetzt … alle Daten‘ → Abgleichen oder Ersetzen.
- **CLAUDE.md 3.0.0:** zuerst UEBERGABE.md, Regeln nur als Verweis auf AppDesign, Einbindung mit `?v=`, Prüfung mit
  `sh tests/alle.sh`; BACKLOG-Kopf: 2–3 Punkte statt ‚etwa 5‘.
- **Prüfungen:** `doku-regeln.mjs` ruft `checkCollab` auf (AppDesign 4.12.2; vorher rot, jetzt grün); `regeln-ablauf.mjs`
  prüft die Vorschau (R-6.4) jetzt auch am iPad hoch und am iPhone quer – mit nicht wischbarer Vorschau rot, dann grün.

Prüfliste P-34 (Schritt für Schritt, Zusammenarbeit allgemein 2.2.0). Kein sichtbarer Unterschied in der App erwartet.

**P-34/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.11.7 · erstellt am … · AppDesign 4.12.2‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.11.7‘ und ‚AppDesign 4.12.2‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

## 3.11.6 – 14.10.2026 (Korrektur)

Reiselogbuch 3.11.6 · AppDesign 4.12.1 (Designrichtlinie allgemein 4.12.1) · Designrichtlinie Reiselogbuch 3.11.6 · Zusammenarbeit allgemein 2.1.1

Korrekturen aus P-32 (1, 2, 4 nicht ok; 0 und 3 ok) und eine neue Bezeichnung:

- **P-32/1 – Reisemittel im Abgleichbericht:** ‚Neu‘ und ‚Vorher‘ zeigen die Reisemittel jetzt mit Symbol und Namen wie in der
  App (‚✈️ Flugzeug, 🚆 Zug‘). Bisher stand dort der gespeicherte Wert, also die internen Kürzel (‚flug, pkw‘). Warum die
  Prüfung es übersah: Sie verglich in 3.11.5 nur die Feldnamen, nicht die Werte. Jetzt prüft sie auch die Werte; sie
  meldete den Fehler, dann behoben.
- **P-32/2 – Seitenleiste bei der Suche (iPad):** Bei offener Tastatur verschiebt Safari den sichtbaren Bereich, wenn die
  Seite zum ersten Treffer weit nach unten springt. Die Kopfzeile ging mit, die Seitenleiste nicht – sie rückte nach oben.
  Jetzt wandert sie mit (AppDesign 4.12.1). Warum die Prüfung es übersah: Die Tastatur war nur durch ein kleineres Fenster
  nachgebildet; Chrome verschiebt den sichtbaren Bereich nie. Die Prüfung bildet jetzt die Verschiebung von Safari nach;
  sie meldete den Fehler (iPad und iPhone-Startliste), dann behoben.
- **P-32/4 – Spalten der Ausgabe:** Die Tagestabelle (Vorschau, HTML, PDF) hat feste Anteile – Verlauf und ‚Wie war was?‘
  je 28, Essen und Quartier je 22, ‚Tag‘ so schmal wie das Datum (Variante c). Die Breite hängt nicht mehr von der
  Textmenge ab; die letzten beiden Spalten sind immer gleich breit. Neue Prüfung der Anteile (erst rot, dann grün).
- **‚Gesamtausgaben‘** statt ‚Gesamtkosten‘ – in der App (iPad und iPhone), in Ausgabe und Vorschau und als Feldname im
  Abgleichbericht.

Prüfliste P-33 (Schritt für Schritt, Zusammenarbeit allgemein 2.1.1). Sie ersetzt P-32.

**P-33/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.11.6 · erstellt am … · AppDesign 4.12.1‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.11.6‘ und ‚AppDesign 4.12.1‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-33/1 – Reisemittel im Abgleichbericht mit Namen**
1. iPad quer, hell: ein Reiselogbuch öffnen → ‚…‘ (Mehr) → ‚Einstellungen‘ → bei ‚Reisemittel‘ ‚Zug‘ antippen → Häkchen.
2. iPad: Seitenleiste ‚…‘ → ‚Backup erstellen‘ → ‚In Dateien sichern‘.
3. Erwartet am iPad: kleines Fenster ‚Backup‘ mit ‚✅‘.
4. iPhone hoch: Startliste ‚…‘ → ‚Backup laden‘ → diese Datei → ‚Abgleichen‘.
5. Erwartet am iPhone: ‚Auf diesem iPhone hat sich etwas geändert – Einzelheiten im Abgleichbericht.‘
6. ‚Abgleichbericht anzeigen‘ tippen.
7. Erwartet am iPhone: Zeile ‚Reisemittel‘ – in ‚Neu‘ die Reisemittel mit Symbol und Großbuchstaben (z. B. ‚✈️ Flugzeug,
   🚆 Zug‘), in ‚Vorher‘ ebenso (z. B. ‚✈️ Flugzeug‘); keine Kürzel wie ‚flug‘.
8. Danach am iPad ‚Zug‘ wieder abwählen, wenn es nicht gewünscht ist.

**P-33/2 – iPad: Seitenleiste bleibt bei der Suche stehen**
1. iPad quer, hell, Seitenleiste sichtbar: ein Reiselogbuch mit vielen Tagen öffnen.
2. Lupe antippen und ein Wort eingeben, das nur weit unten vorkommt; die Tastatur bleibt offen; kurz warten.
3. Erwartet: die Seite springt zum ersten Treffer; die Seitenleiste bleibt an ihrem Platz (oben mit dem gleichen Abstand
   wie vorher), Kopfzeile und Suchzeile ebenso.
4. Mit ⌄ zum nächsten Treffer. Erwartet: ebenso.
5. iPad hoch mit eingeblendeter Seitenleiste wiederholen. Erwartet: ebenso.

**P-33/3 – Spalten der Vorschau**
1. iPad quer, hell: ein Reiselogbuch mit viel Text in allen Spalten öffnen → Teilen (Icon) → ‚Vorschau‘.
2. Erwartet: ‚Tag‘ so schmal wie das Datum; ‚Verlauf‘ und 🙂☹️😉 gleich breit; 🍽️🍷☕️ und 😴💤 gleich breit und etwas
   schmaler – die letzte Spalte ist nicht mehr zusammengequetscht.
3. ‚PDF‘ tippen. Erwartet: im PDF dieselbe Aufteilung.
4. iPhone hoch: Vorschau öffnen und seitlich wischen. Erwartet: dieselbe Aufteilung.

**P-33/4 – ‚Gesamtausgaben‘**
1. iPad quer: ein Reiselogbuch öffnen und nach unten wischen.
2. Erwartet: unter dem Fazit die Überschrift ‚Gesamtausgaben‘ (nicht ‚Gesamtkosten‘), darunter das Betragsfeld.
3. Teilen → ‚Vorschau‘. Erwartet: in der Vorschau ebenfalls ‚Gesamtausgaben‘.
4. iPhone hoch: ein Reiselogbuch öffnen und nach unten wischen. Erwartet: ‚Gesamtausgaben‘.

## 3.11.5 – 14.10.2026 (Korrektur)

Reiselogbuch 3.11.5 · AppDesign 4.12.0 (Designrichtlinie allgemein 4.12.0) · Designrichtlinie Reiselogbuch 3.11.5 · Zusammenarbeit allgemein 2.1.1

- **AppDesign 4.12.0 – Regelkatalog neu (A-02a):** Die allgemeinen Regeln sind nach Themen geordnet (R-1.1 bis R-10.4,
  vorher R-01 bis R-52). Alle Prüfskripte melden die neuen Nummern; jede Regel hat genau eine Prüfung. Neu geprüft werden
  Suche (R-2.3), Fenster-Kopfzeile (R-4.4), Großbuchstaben (R-5.2), Fehlermeldungen (R-5.3), Auswahl-Kapsel (R-5.4),
  Vorschau (R-6.4), Zebra je Tabellenzeile in der Tagestabelle (R-6.1), höchstens eine blaue Hauptaktion (R-3.3), gleiches
  Icon für gleiche Aktion (R-10.1) und die Leisten bei offener Tastatur (R-2.1). Die App selbst ändert sich dadurch nicht.
- **T-83:** Im Abgleichbericht heißt das Feld jetzt ‚Reisemittel‘ wie im Fenster ‚Einstellungen‘ (vorher ‚Verkehrsmittel‘).
  Eine neue Prüfung vergleicht die Feldnamen des Berichts mit denen im Fenster; sie meldete den Fehler, dann behoben.
- AppDesign wird mit `?v=4.12.0` geladen; README ‚Verwendete Versionen‘ nachgeführt (nannte noch Zusammenarbeit 2.0.0).

Prüfliste P-32 (Schritt für Schritt, Zusammenarbeit allgemein 2.1.1).

**P-32/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.11.5 · erstellt am … · AppDesign 4.12.0‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.11.5‘ und ‚AppDesign 4.12.0‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-32/1 – Abgleichbericht nennt ‚Reisemittel‘ (T-83)**
1. iPad quer, hell: ein Reiselogbuch öffnen → ‚…‘ (Mehr) → ‚Einstellungen‘ → bei ‚Reisemittel‘ ein weiteres Mittel
   antippen (z. B. ‚Zug‘) → Häkchen.
2. iPad: Seitenleiste ‚…‘ → ‚Backup erstellen‘ → ‚In Dateien sichern‘.
3. Erwartet am iPad: kleines Fenster ‚Backup‘ mit ‚✅‘.
4. iPhone hoch: Startliste ‚…‘ → ‚Backup laden‘ → diese Datei → ‚Abgleichen‘.
5. Erwartet am iPhone: Fenster ‚Auf diesem iPhone hat sich etwas geändert – Einzelheiten im Abgleichbericht.‘
6. ‚Abgleichbericht anzeigen‘ tippen.
7. Erwartet am iPhone: in der Tabelle in der Spalte ‚Feld‘ ‚Reisemittel‘ (nicht ‚Verkehrsmittel‘), daneben Neu und Vorher.
8. Danach am iPad das Reisemittel wieder abwählen, wenn es nicht gewünscht ist.

**P-32/2 – Suche unverändert (R-2.3, jetzt automatisch geprüft)**
1. iPad quer, hell: ein Reiselogbuch mit vielen Tagen öffnen → Lupe in der Kopfzeile antippen.
2. Ein Wort eingeben, das weit unten vorkommt, und kurz warten.
3. Erwartet: rechts im Suchfeld ‚1 von n‘; der Tag mit dem Treffer steht direkt unter der Suchzeile; nur Tage mit Treffern.
4. Mehrmals ⌄ tippen bis zum letzten Treffer, dann noch einmal.
5. Erwartet: ‚n von n‘ bleibt, ⌄ ist grau – kein Sprung zum ersten Treffer.
6. Am iPhone hoch wiederholen. Erwartet: ebenso.

**P-32/3 – Fenster-Kopfzeile und Fehlermeldung unverändert (R-4.4, R-5.3)**
1. iPad quer, hell: ein Reiselogbuch öffnen → ‚…‘ → ‚Einstellungen‘.
2. Erwartet: x links, Häkchen rechts grau; keine rote Meldung.
3. Den Reisetitel ganz löschen.
4. Erwartet: Häkchen blau; unter dem Feld rot ‚Bitte einen Reisetitel eingeben.‘, das Feld ist rot umrandet.
5. x antippen. Erwartet: Abfrage ‚Änderungen verwerfen‘ / ‚Weiter bearbeiten‘ → ‚Änderungen verwerfen‘ schließt, der
   Titel ist unverändert.

**P-32/4 – Vorschau unverändert (R-6.4)**
1. iPhone hoch, dunkel: ein Reiselogbuch öffnen → Teilen (Icon) → ‚Vorschau‘.
2. Erwartet: die Vorschau ist hell (weiß, schwarze Schrift), oben rechts [PDF · Teilen]; seitlich wischen zeigt die
   ganze Seite.
3. Am iPad hoch wiederholen. Erwartet: ebenso.

## 3.11.4 – 14.10.2026 (Korrektur)

Reiselogbuch 3.11.4 · AppDesign 4.11.4 (Designrichtlinie allgemein 4.11.4) · Designrichtlinie Reiselogbuch 3.11.4 · Zusammenarbeit allgemein 1.16.0

- T-82: Im Abgleichbericht ist jedes Reiselogbuch eine Tabellenzeile – sein Name ist in der ersten Spalte über alle seine
  Zeilen zusammengefasst, alle Zellen dahinter haben dieselbe Farbe, weiß und grau wechseln je Reiselogbuch (R-52).
  3.11.3 färbte innerhalb eines Reiselogbuchs abwechselnd; die Prüfung erkennt das jetzt.

Prüfliste P-31 (Schritt für Schritt, Zusammenarbeit allgemein 1.16.0). Sie ersetzt P-30.

**P-31/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.11.4 · erstellt am … · AppDesign 4.11.4‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.11.4‘ und ‚AppDesign 4.11.4‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-31/1 – Abgleichbericht: Tabelle wie die HTML-Ausgabe, eine Farbe je Reiselogbuch**
1. iPad: in drei Reiselogbüchern je einen Tag ändern (im ersten Verlauf und Wetter, dazu einen zweiten Tag), ✓;
   ‚Backup erstellen‘ → ‚In Dateien sichern‘.
2. iPhone: ‚Backup laden‘ → diese Datei → ‚Abgleichen‘.
3. Erwartet im Fenster: ‚Auf diesem iPhone hat sich etwas geändert – Einzelheiten im Abgleichbericht.‘
4. ‚Abgleichbericht anzeigen‘ tippen.
5. Erwartet: Der Name jedes Reiselogbuchs steht einmal links, über alle seine Zeilen zusammengefasst; alle Zellen dieses
   Reiselogbuchs haben dieselbe Farbe – das erste weiß, das zweite grau, das dritte weiß.
6. Erwartet: Alle Linien sind gleich dünn; der Kopf ist grau mit fetter Schrift.
7. Zum Vergleich ein Reiselogbuch öffnen → Teilen → ‚Vorschau‘. Erwartet: Schrift, Kopf, Linien und Abstände gleich.
8. Am iPad hoch und quer und am iPhone quer wiederholen. Erwartet: ebenso.

## 3.11.3 – 14.10.2026 (Korrektur)

Reiselogbuch 3.11.3 · AppDesign 4.11.3 (Designrichtlinie allgemein 4.11.3) · Designrichtlinie Reiselogbuch 3.11.3 · Zusammenarbeit allgemein 1.16.0

- T-81 (P-29/3): Der Abgleichbericht wich von der Tabelle der HTML-Ausgabe ab (dickere Linie zwischen den
  Reiselogbüchern, keine grauen Zeilen, Kopf nur halbfett). Jetzt verwenden Ausgabe und Bericht dieselbe Mustertabelle aus
  AppDesign (neue Regel R-52); die Prüfung vergleicht jede Tabelle Eigenschaft für Eigenschaft mit ihr. Jede zweite Zeile ist
  über die ganze Breite grau; Reiselogbuch, Tag, Gerät und Zeitpunkt stehen nur in der ersten Zeile ihrer Gruppe.

Prüfliste P-30 (Schritt für Schritt, Zusammenarbeit allgemein 1.16.0).

**P-30/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.11.3 · erstellt am … · AppDesign 4.11.3‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.11.3‘ und ‚AppDesign 4.11.3‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-30/1 – Abgleichbericht: Tabelle wie die HTML-Ausgabe**
1. iPad: in zwei Reiselogbüchern je einen Tag ändern, ✓; ‚Backup erstellen‘ → ‚In Dateien sichern‘.
2. iPhone: ‚Backup laden‘ → diese Datei → ‚Abgleichen‘.
3. Erwartet im Fenster: ‚Auf diesem iPhone hat sich etwas geändert – Einzelheiten im Abgleichbericht.‘
4. ‚Abgleichbericht anzeigen‘ tippen.
5. Erwartet: Die Linie zwischen den beiden Reiselogbüchern ist genauso dünn wie alle anderen Linien; der Kopf ist grau
   mit fetter Schrift; jede zweite Zeile ist über die ganze Breite leicht grau (keine halb graue Zeile); Reiselogbuch und
   Tag stehen nur in der ersten Zeile ihrer Gruppe.
6. Zum Vergleich ein Reiselogbuch öffnen → Teilen → ‚Vorschau‘.
7. Erwartet: Schrift, Kopf, Linien, Abstände und graue Zeilen sehen in beiden Tabellen gleich aus.
8. Am iPad hoch und quer und am iPhone quer wiederholen. Erwartet: ebenso.

## 3.11.2 – 14.10.2026 (Korrektur)

Reiselogbuch 3.11.2 · AppDesign 4.11.2 (Designrichtlinie allgemein 4.11.2) · Designrichtlinie Reiselogbuch 3.11.2 · Zusammenarbeit allgemein 1.16.0

- T-79 (P-27/8): Im Abgleichbericht ragten Datum und Uhrzeit in die Nachbarzellen (iPhone, iPad hoch). Jetzt bricht jede
  Zelle um. Warum die Prüfung es übersah: R-37 prüfte nur Tabellen der App-Seite, nicht in Fenstern und Vorschauen – jetzt
  jede Zelle überall, auch nach seitlichem Wischen.
- T-80 (P-27/8): Der Abgleichbericht hat oben rechts die Kapsel wie die Vorschau der Ausgabe: PDF und Teilen.
- T-78: Beim Drehen (quer ↔ hoch) bleibt oben derselbe Tag stehen – iPad und iPhone (neue Regel R-51, Baustein in
  AppDesign). Die Prüfung bildet jetzt Safari nach, das keinen Scroll-Anker kennt.

Prüfliste P-29 (Schritt für Schritt, Zusammenarbeit allgemein 1.16.0).

**P-29/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.11.2 · erstellt am … · AppDesign 4.11.2‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.11.2‘ und ‚AppDesign 4.11.2‘.
6. Erscheint ‚Neue Version wird geladen‘ oder eine andere Version: App schließen, ein paar Minuten warten, neu öffnen.

**P-29/1 – iPad: oberster Tag bleibt beim Drehen**
1. iPad quer halten, ein Reiselogbuch mit vielen erfassten Tagen öffnen.
2. Nach unten wischen, bis z. B. der 10. Tag ganz oben unter der Leiste steht.
3. Auf hoch drehen.
4. Erwartet: Oben steht weiter derselbe Tag.
5. Zurück auf quer drehen.
6. Erwartet: Oben steht weiter derselbe Tag.

**P-29/2 – iPhone: oberster Tag bleibt beim Drehen**
1. iPhone hoch halten, dasselbe Reiselogbuch öffnen.
2. Nach unten wischen, bis z. B. der 10. Tag ganz oben unter der Leiste steht.
3. Auf quer drehen.
4. Erwartet: Oben steht weiter derselbe Tag.
5. Zurück auf hoch drehen.
6. Erwartet: Oben steht weiter derselbe Tag.

**P-29/3 – Abgleichbericht: keine Zelle ragt über (iPhone hoch und quer, iPad hoch und quer)**
1. iPad: in einem Tag den Verlauf ändern, ✓; ‚Backup erstellen‘ → ‚In Dateien sichern‘.
2. iPhone: ‚Backup laden‘ → diese Datei → ‚Abgleichen‘.
3. Erwartet im Fenster: ‚Auf diesem iPhone hat sich etwas geändert – Einzelheiten im Abgleichbericht.‘
4. ‚Abgleichbericht anzeigen‘ tippen und die Tabelle bis ganz nach rechts wischen.
5. Erwartet: Datum, Uhrzeit und Texte stehen vollständig in ihrer Zelle, lange Inhalte brechen in die nächste Zeile um;
   nichts ragt in eine Nachbarzelle.
6. iPhone quer drehen. Erwartet: ebenso.
7. Am iPad (hoch und quer) einen Abgleich mit der Datei vom iPhone machen und den Bericht öffnen. Erwartet: ebenso.

**P-29/4 – Abgleichbericht: PDF**
1. Den Abgleichbericht öffnen (wie in P-29/3, Schritte 1 bis 4).
2. Erwartet: Oben rechts eine Kapsel mit ‚PDF‘ und dem Teilen-Symbol – wie bei der Vorschau der Ausgabe.
3. ‚PDF‘ tippen.
4. Erwartet: Das Drucken-Menü öffnet sich mit dem Bericht; darüber das Fenster ‚Abgleichbericht‘ mit ✅ ‚Drucken-Menü
   geöffnet für Abgleichbericht Reiselogbuch JJJJ.MM.TT hh.mm.pdf‘.
5. Im Drucken-Menü ‚Teilen‘ → ‚In Dateien sichern‘. Erwartet: Die PDF-Datei zeigt den Bericht ohne Fenster und Leisten.

## 3.11.1 – 13.10.2026 (Korrektur)

Reiselogbuch 3.11.1 · AppDesign 4.11.1 (Designrichtlinie allgemein 4.11.1) · Designrichtlinie Reiselogbuch 3.11.1 · Zusammenarbeit allgemein 1.15.0

- T-77 (Vorbeugen gegen P-26/6, 7, 9):
  - Die README zeigt ganz oben ‚Verwendete Versionen‘ mit Links zu allen allgemeinen Regelwerken (R-49).
  - Jede Prüfliste beginnt mit /0 ‚Version prüfen‘, und jeder Schritt nennt die Meldung je Gerät (R-50).
  - ‚Fertig‘ gibt es erst nach den erfolgreichen Pages-Läufen beider Repos (Zusammenarbeit allgemein 1.15.0).
- Neue Prüfung `tests/doku-regeln.mjs` (R-49, R-50). Die App selbst ist unverändert, nur auf AppDesign 4.11.1 umgestellt.

Prüfliste P-28 (Schritt für Schritt, Zusammenarbeit allgemein 1.15.0). Danach die offenen Prüfpunkte P-27/1 bis P-27/9
aus 3.11.0 mit dieser Version prüfen.

**P-28/0 – Version prüfen**
1. Auf iPad und iPhone die App ganz schließen (vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.
2. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
3. Erwartet: unten grau ‚Reiselogbuch · Version 3.11.1 · erstellt am … · AppDesign 4.11.1‘.
4. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr).
5. Erwartet: dieselbe Zeile mit ‚Version 3.11.1‘ und ‚AppDesign 4.11.1‘.
6. Erscheint beim Start das Fenster ‚Neue Version wird geladen‘ oder steht eine andere Version da: App ganz schließen,
   ein paar Minuten warten, neu öffnen; erst weiter prüfen, wenn beide Versionen stimmen.

**P-28/1 – Versionen auf GitHub nachsehen**
1. Im Browser https://github.com/g811141a/ReiseLogBuch öffnen.
2. Erwartet: Unter der Dateiliste steht die README mit dem Abschnitt ‚Verwendete Versionen‘: Reiselogbuch 3.11.1,
   AppDesign 4.11.1, Designrichtlinie allgemein 4.11.1, Designrichtlinie Reiselogbuch 3.11.1, Zusammenarbeit allgemein
   1.15.0.
3. Auf den Link ‚README - Designrichtlinie allgemein.md‘ tippen.
4. Erwartet: Die Richtlinie öffnet sich und nennt oben ‚Version 4.11.1‘.

## 3.11.0 – 13.10.2026 (Nebenversion)

Reiselogbuch 3.11.0 · AppDesign 4.11.0 (Designrichtlinie allgemein 4.11.0) · Designrichtlinie Reiselogbuch 3.11.0 · Zusammenarbeit allgemein 1.14.0

- T-73 (P-26/6, P-26/7): Auf dem Gerät lief beim Test noch die alte AppDesign-Fassung (Hinweise mit ‚drüben‘). Neu (R-48):
  Die App lädt `ui.js` und `design.css` mit der Versionsnummer (`?v=4.11.0`) und meldet beim Start ‚Neue Version wird
  geladen‘, wenn eine andere Fassung geladen ist. Die Versionszeile im Mehr-Menü nennt jetzt auch ‚AppDesign 4.11.0‘.
- T-74 (P-26/1): Die Seitenleiste hat einen einzigen Zustand für quer und hoch. Nur Tippen ändert ihn, Drehen nie – auch
  nicht die Zwischengrößen, die iOS beim Drehen meldet (R-47).
- T-75 (P-26/4): Das Kontextmenü des letzten Eintrags wird nach dem Loslassen noch einmal ausgerichtet. Rückt die Liste
  trotzdem nicht, steht es über der Kachel, nie hinter ‚Backup erstellen‘ (R-40). Der Platz unter der Liste verschwindet
  beim Schließen wieder.
- T-76 (P-26/8, P-26/9): Ergebnis des Abgleichs neu (R-44):
  - Ein kleines Fenster ‚Abgleichen‘ ohne Einzelheiten zeigt die Schaltfläche ‚Abgleichbericht anzeigen‘.
  - Der Abgleichbericht ist eine Vorschau wie die Ausgabe und lässt sich als HTML teilen. Er enthält die Tabelle der
    Änderungen (Reiselogbuch · Tag · Feld · Neu · Vorher · Vom Gerät · Geändert am). Darunter stehen die Anzahl der
    unveränderten Reiselogbücher, die Tabelle ‚Auf diesem … neuer als im Backup – bleibt so‘ und die Hinweise.
  - Ohne Änderung erscheint nur ‚Alles war schon auf dem gleichen Stand.‘ ohne Schaltfläche.
  - Ist dieses Gerät neuer, heißt es ‚hat sich nichts geändert‘, nicht mehr ‚gleicher Stand‘.
- Neue Prüfung `tests/version-regeln.mjs` (R-48). Das Prüfskript misst jetzt auch das Ergebnisfenster und den
  Abgleichbericht.

Prüfliste P-27 (Schritt für Schritt, Zusammenarbeit allgemein 1.14.0). **Vorher auf beiden Geräten die App ganz schließen
(vom unteren Rand nach oben wischen und wegschieben) und neu öffnen.**

**P-27/0 – richtige Version auf beiden Geräten**
1. iPad: in der Seitenleiste oben auf ‚…‘ (Mehr) tippen.
2. Erwartet: unten grau ‚Reiselogbuch · Version 3.11.0 · erstellt am … · AppDesign 4.11.0‘.
3. iPhone: Startliste ‚Reiselogbücher‘ → oben ‚…‘ (Mehr) → gleiche Zeile mit 3.11.0 und AppDesign 4.11.0.
4. Erscheint beim Start stattdessen das Fenster ‚Neue Version wird geladen‘: App ganz schließen, ein paar Minuten warten,
   neu öffnen und erst dann weiter prüfen.

**P-27/1 – iPad: sichtbare Seitenleiste bleibt beim Drehen**
1. iPad quer halten, die Seitenleiste ist links sichtbar.
2. iPad auf hoch drehen.
3. Erwartet: Die Seitenleiste bleibt sichtbar (über den Inhalt gelegt, dahinter abgedunkelt).
4. Zurück auf quer drehen.
5. Erwartet: Die Seitenleiste ist weiter sichtbar (fest links).
6. Noch zweimal schnell hin und her drehen – sie bleibt jedes Mal sichtbar.

**P-27/2 – iPhone quer: Kontextmenü des letzten Eintrags**
1. iPhone quer halten, Startliste ‚Reiselogbücher‘ öffnen.
2. Die Liste ganz nach unten wischen, bis der letzte Eintrag direkt über ‚Backup erstellen‘ steht.
3. Lange auf diesen letzten Eintrag drücken und loslassen.
4. Erwartet: ‚Einstellungen‘ und ‚Reiselogbuch löschen‘ sind beide ganz zu sehen, linksbündig unter der Reise (oder,
   wenn die Liste nicht weiter rücken kann, über ihr) – nie hinter der Kachel ‚Backup erstellen‘.
5. Daneben tippen – das Menü schließt sich, unter der Liste bleibt kein leerer Platz.

**P-27/3 – iPhone hoch: Kontextmenü des letzten Eintrags**
1. iPhone hoch halten, Startliste ‚Reiselogbücher‘, ganz nach unten wischen.
2. Lange auf den letzten Eintrag drücken und loslassen.
3. Erwartet: wie P-27/2 – beide Punkte ganz zu sehen, über der Kachel ‚Backup erstellen‘.

**P-27/4 – Abgleich: auf dem iPad gelöscht, auf dem iPhone danach geändert**
1. Gleichen Stand herstellen: iPad ‚Backup erstellen‘ → In Dateien sichern (iCloud Drive); iPhone ‚Backup laden‘ →
   diese Datei → ‚Ersetzen‘.
2. iPad: ein Reiselogbuch (z. B. ‚Test A‘) lange drücken → ‚Reiselogbuch löschen‘.
3. iPad: ‚Backup erstellen‘ → In Dateien sichern.
4. iPhone: danach in ‚Test A‘ etwas ändern (z. B. einen Tag erfassen).
5. iPhone: ‚Backup laden‘ → die Datei vom iPad → ‚Abgleichen‘.
6. Erwartet im Fenster ‚Abgleichen‘: ‚✅ Abgeglichen mit dem Backup vom iPad (…)‘, darunter ‚Auf diesem iPhone hat sich
   nichts geändert – Hinweise im Abgleichbericht.‘ und die Schaltfläche ‚Abgleichbericht anzeigen‘ – kein ‚drüben‘.
7. ‚Abgleichbericht anzeigen‘ tippen.
8. Erwartet unter ‚Hinweise‘: ‚ℹ️ Auf dem iPad gelöscht, auf diesem iPhone danach noch geändert: Test A – bleibt
   erhalten.‘ ‚Test A‘ ist in der Liste noch da.

**P-27/5 – Abgleich: auf diesem iPhone gelöscht, im Backup noch vorhanden**
1. Gleichen Stand herstellen wie in P-27/4, Schritt 1.
2. iPhone: ein Reiselogbuch (z. B. ‚Test B‘) lange drücken → ‚Reiselogbuch löschen‘.
3. iPad: ‚Backup erstellen‘ → In Dateien sichern (‚Test B‘ ist darin noch vorhanden).
4. iPhone: ‚Backup laden‘ → die Datei vom iPad → ‚Abgleichen‘.
5. Erwartet im Fenster: ‚Auf diesem iPhone hat sich nichts geändert – Hinweise im Abgleichbericht.‘ mit der Schaltfläche.
6. ‚Abgleichbericht anzeigen‘ tippen.
7. Erwartet unter ‚Hinweise‘: ‚ℹ️ Auf diesem iPhone gelöscht, im Backup vom iPad noch vorhanden: Test B (gelöscht am …) –
   bleibt gelöscht. …‘ ‚Test B‘ bleibt auf dem iPhone gelöscht.

**P-27/6 – Abgleich: gleicher Tag, verschiedene Felder**
1. Gleichen Stand herstellen wie in P-27/4, Schritt 1.
2. Einen Tag ohne Einträge wählen (z. B. einen künftigen Tag).
3. iPad: diesen Tag antippen, nur das Wetter ☀️ wählen, ✓; dann ‚Backup erstellen‘ → In Dateien sichern.
4. iPhone: denselben Tag antippen, nur einen Verlauf schreiben (z. B. ‚Stadtrundgang‘), ✓; dann ‚Backup erstellen‘ →
   In Dateien sichern.
5. iPhone: ‚Backup laden‘ → die Datei vom iPad → ‚Abgleichen‘ → ‚Abgleichbericht anzeigen‘.
6. Erwartet im Bericht unter ‚Änderungen auf diesem iPhone‘: eine Zeile mit dem Reiselogbuch, dem Tag, Feld ‚Wetter‘,
   Neu ‚☀️‘, Vorher ‚–‘, Vom Gerät ‚iPad‘ und dem Zeitpunkt; unter ‚Auf diesem iPhone neuer als im Backup‘ der ‚Verlauf‘.
7. iPad: ‚Backup laden‘ → die Datei vom iPhone → ‚Abgleichen‘.
8. Erwartet auf beiden Geräten: Der Tag hat das Wetter ☀️ **und** den Verlauf ‚Stadtrundgang‘.

**P-27/7 – Abgleich: gleicher Tag, gleiches Feld**
1. Gleichen Stand herstellen wie in P-27/4, Schritt 1.
2. iPad: einen Tag antippen, den Verlauf auf ‚Version iPad‘ ändern, ✓; ‚Backup erstellen‘ → In Dateien sichern.
3. iPhone (danach): denselben Tag antippen, den Verlauf auf ‚Version iPhone‘ ändern, ✓; ‚Backup erstellen‘ → In Dateien
   sichern.
4. iPhone: ‚Backup laden‘ → die Datei vom iPad → ‚Abgleichen‘.
5. Erwartet im Fenster: ‚Auf diesem iPhone hat sich nichts geändert – Hinweise im Abgleichbericht.‘ (nicht ‚Alles war
   schon auf dem gleichen Stand‘); im Bericht unter ‚Auf diesem iPhone neuer als im Backup – bleibt so‘: Feld ‚Verlauf‘,
   ‚Version iPhone‘, im Backup ‚Version iPad‘.
6. iPad: ‚Backup laden‘ → die Datei vom iPhone → ‚Abgleichen‘ → ‚Abgleichbericht anzeigen‘.
7. Erwartet: unter ‚Änderungen auf diesem iPad‘ Feld ‚Verlauf‘, Neu ‚Version iPhone‘, Vorher ‚Version iPad‘, Vom Gerät
   ‚iPhone‘; auf beiden Geräten lautet der Verlauf jetzt ‚Version iPhone‘.

**P-27/8 – Abgleichbericht: Aussehen und Teilen (iPad quer, iPad hoch, iPhone hoch, iPhone quer)**
1. Einen Abgleich mit Änderungen machen (z. B. P-27/6) und ‚Abgleichbericht anzeigen‘ tippen.
2. Erwartet: großes Fenster ‚Abgleichbericht‘, weiß wie die Vorschau der Ausgabe (auch im Dunkelmodus); Kopf
   ‚Abgeglichen am · Backup · Ergebnis‘; Tabellen mit grauem Kopf und halbfetten Spaltenköpfen; unveränderte
   Reiselogbücher nicht in der Tabelle, nur ‚n Reiselogbücher sind unverändert.‘ darunter.
3. iPhone hoch: die Tabelle seitlich wischen – alle Spalten erreichbar, nichts abgeschnitten.
4. Oben rechts Teilen tippen → ‚In Dateien sichern‘.
5. Erwartet: Fenster mit ✅ und Dateiname ‚Abgleichbericht Reiselogbuch JJJJ.MM.TT hh.mm.html‘.
6. Die Prüfung in hell und dunkel und in beiden Lagen wiederholen.

**P-27/9 – Abgleich ohne Änderung**
1. Gleichen Stand herstellen wie in P-27/4, Schritt 1, danach nichts ändern.
2. iPhone: ‚Backup laden‘ → dieselbe Datei → ‚Abgleichen‘.
3. Erwartet: Fenster ‚Abgleichen‘ mit ‚Alles war schon auf dem gleichen Stand.‘ und **ohne** Schaltfläche.

## 3.10.1 – 13.10.2026 (Korrektur)

Reiselogbuch 3.10.1 · AppDesign 4.10.1 (Designrichtlinie allgemein 4.10.1) · Designrichtlinie Reiselogbuch 3.10.1 · Zusammenarbeit allgemein 1.14.0

- T-68 (P-25/4): Am iPad behält die Seitenleiste beim Drehen ihren Zustand (neue Regel R-47).
- T-69 (P-25/6): Das Kontextmenü einer Reise ist am iPhone nie mehr abgeschnitten oder hinter der Backup-Kachel;
  am iPad endet es über der Backup-Kachel.
- T-70 (P-25/14): Die Hinweise beim Abgleich nennen iPad bzw. iPhone beim Namen.
- T-71 (P-25/15, 16): Leere Felder aus dem Fenster ‚Tag‘ überschreiben beim Abgleich nichts mehr (z. B. das Wetter
  vom anderen Gerät).
- T-72: Zusammenarbeit allgemein 1.14.0 – Prüfpunkte am Ende jeder Umsetzung Schritt für Schritt.

Prüfliste P-26 (Schritt für Schritt, Zusammenarbeit allgemein 1.14.0):

**P-26/1 – iPad: sichtbare Seitenleiste bleibt beim Drehen**
1. iPad quer halten, die Seitenleiste ist links sichtbar.
2. iPad auf hoch drehen.
3. Erwartet: Die Seitenleiste bleibt sichtbar (über den Inhalt gelegt).
4. Zurück auf quer drehen.
5. Erwartet: Die Seitenleiste ist weiter sichtbar (fest links).

**P-26/2 – iPad: ausgeblendete Seitenleiste bleibt ausgeblendet**
1. iPad quer halten, die Seitenleiste mit dem Knopf ▯ (Seitenleiste) ausblenden.
2. iPad auf hoch drehen.
3. Erwartet: Die Seitenleiste bleibt ausgeblendet.
4. Zurück auf quer drehen.
5. Erwartet: Die Seitenleiste ist weiter ausgeblendet.

**P-26/3 – iPhone hoch: Kontextmenü der untersten Reise**
1. iPhone hoch halten, Startliste ‚Reiselogbücher‘ öffnen.
2. Lange auf die unterste vollständig sichtbare Reise (direkt über ‚Backup erstellen‘) drücken.
3. Erwartet: Die Liste rückt etwas nach oben; das Menü steht linksbündig unter der Reise.
4. Erwartet: ‚Einstellungen‘ und ‚Reiselogbuch löschen‘ sind beide ganz zu sehen, das Menü endet über der Kachel ‚Backup erstellen‘.
5. Daneben tippen – das Menü schließt sich.

**P-26/4 – iPhone quer: Kontextmenü der untersten Reise**
1. iPhone quer halten, Startliste ‚Reiselogbücher‘ öffnen.
2. Lange auf die unterste vollständig sichtbare Reise drücken.
3. Erwartet: Das Menü steht linksbündig unter der Reise, beide Punkte ganz zu sehen, über der Kachel ‚Backup erstellen‘.

**P-26/5 – iPad: Kontextmenü der untersten Reise**
1. iPad quer, Seitenleiste sichtbar.
2. Lange auf die unterste vollständig sichtbare Reise drücken.
3. Erwartet: Das Menü steht neben der Reise, ist ganz zu sehen und endet über der Kachel ‚Backup erstellen‘.
4. Dasselbe am iPad hoch (Seitenleiste eingeblendet) wiederholen – gleiches Ergebnis.

**P-26/6 – Abgleich: auf dem iPad gelöscht, auf dem iPhone danach geändert**
1. Gleichen Stand herstellen: iPad ‚Backup erstellen‘ → In Dateien sichern (iCloud Drive); iPhone ‚Backup laden‘ → diese Datei → ‚Ersetzen‘.
2. iPad: ein Reiselogbuch (z. B. ‚Test A‘) lange drücken → ‚Reiselogbuch löschen‘.
3. iPad: ‚Backup erstellen‘ → In Dateien sichern.
4. iPhone: danach in ‚Test A‘ etwas ändern (z. B. einen Tag erfassen).
5. iPhone: ‚Backup laden‘ → die Datei vom iPad → ‚Abgleichen‘.
6. Erwartet: ‚Test A‘ bleibt auf dem iPhone; das Fenster zeigt ‚ℹ️ Auf dem iPad gelöscht, auf diesem iPhone danach noch geändert: Test A – bleibt erhalten.‘

**P-26/7 – Abgleich: auf diesem Gerät gelöscht, im Backup noch vorhanden**
1. Gleichen Stand herstellen: iPad ‚Backup erstellen‘ → In Dateien sichern; iPhone ‚Backup laden‘ → diese Datei → ‚Ersetzen‘.
2. iPhone: ein Reiselogbuch (z. B. ‚Test B‘) lange drücken → ‚Reiselogbuch löschen‘.
3. iPad: ‚Backup erstellen‘ → In Dateien sichern (‚Test B‘ ist darin noch vorhanden).
4. iPhone: ‚Backup laden‘ → die Datei vom iPad → ‚Abgleichen‘.
5. Erwartet: ‚Test B‘ bleibt auf dem iPhone gelöscht; das Fenster zeigt ‚ℹ️ Auf diesem iPhone gelöscht, im Backup vom iPad noch vorhanden: Test B (gelöscht am …) – bleibt gelöscht.‘

**P-26/8 – Abgleich: gleicher Tag, verschiedene Felder (Tag neu)**
1. Gleichen Stand herstellen: iPad ‚Backup erstellen‘ → In Dateien sichern; iPhone ‚Backup laden‘ → diese Datei → ‚Ersetzen‘.
2. Einen Tag ohne Einträge wählen (z. B. einen künftigen Tag).
3. iPad: diesen Tag antippen, nur das Wetter ☀️ wählen, ✓; dann ‚Backup erstellen‘ → In Dateien sichern.
4. iPhone: denselben Tag antippen, nur einen Verlauf schreiben (z. B. ‚Stadtrundgang‘), ✓; dann ‚Backup erstellen‘ → In Dateien sichern.
5. iPhone: ‚Backup laden‘ → die Datei vom iPad → ‚Abgleichen‘.
6. iPad: ‚Backup laden‘ → die Datei vom iPhone → ‚Abgleichen‘.
7. Erwartet auf beiden Geräten: Der Tag hat das Wetter ☀️ **und** den Verlauf ‚Stadtrundgang‘.

**P-26/9 – Abgleich: gleicher Tag, gleiches Feld**
1. Gleichen Stand herstellen: iPad ‚Backup erstellen‘ → In Dateien sichern; iPhone ‚Backup laden‘ → diese Datei → ‚Ersetzen‘.
2. iPad: einen Tag antippen, den Verlauf auf ‚Version iPad‘ ändern, ✓; ‚Backup erstellen‘ → In Dateien sichern.
3. iPhone (danach): denselben Tag antippen, den Verlauf auf ‚Version iPhone‘ ändern, ✓; ‚Backup erstellen‘ → In Dateien sichern.
4. iPhone: ‚Backup laden‘ → die Datei vom iPad → ‚Abgleichen‘.
5. iPad: ‚Backup laden‘ → die Datei vom iPhone → ‚Abgleichen‘.
6. Erwartet auf beiden Geräten: Der Verlauf lautet ‚Version iPhone‘ (die neuere Änderung).

## 3.10.0 – 12.10.2026 (Nebenversion)

Reiselogbuch 3.10.0 · AppDesign 4.10.0 (Designrichtlinie allgemein 4.10.0) · Designrichtlinie Reiselogbuch 3.10.0 · Zusammenarbeit allgemein 1.13.0

Sammelversion:

- T-63: Menüs und Untermenüs werden beim Drehen neu ausgerichtet – unter ihrer Schaltfläche, ganz sichtbar;
  die Seitenleiste bleibt dabei sichtbar (neue allgemeine Regel R-40, automatische Drehprüfung).
- T-65: iPhone – das Kontextmenü einer Reise steht linksbündig unter der Kachel, über ‚Backup erstellen‘;
  die Liste rückt dafür nötigenfalls nach oben.
- T-64: Abgleich je Feld (auch am selben Tag und in den Kopfdaten); hier Gelöschtes bleibt gelöscht, mit Hinweis
  ‚im Backup noch vorhanden‘; Hinweis, wenn drüben Gelöschtes hier weiter geändert wurde.
- T-66: Abgleich als allgemeine Regeln R-41 bis R-44 mit gemeinsamem Baustein und allgemeiner Prüfung; die Tabelle
  der Anwendungsfälle steht in der Designrichtlinie allgemein, Abschnitt 15.18.
- T-67: ‚Backup laden‘ besser lesbar – je eine Kachel für Abgleichen und Ersetzen mit Erklärung; Backup erstellen
  und laden als allgemeiner Standard R-45, R-46 (Abschnitt 15.19) mit allgemeiner Prüfung.

Prüfliste P-25 (iPad und iPhone, jeweils hell und dunkel, quer und hoch) – mit den betroffenen Geräte-Regeln:

1. Mehr-Menü (…) öffnen, ‚Darstellung‘ antippen (Untermenü), dann drehen – Menü steht unter ‚…‘, Untermenü
   daneben, beides ganz sichtbar; zurückdrehen ebenso (R-40). Ebenso Teilen-Menü und Menü der Seitenleiste.
2. iPad quer: Menü der Seitenleiste offen, auf hoch drehen – die Seitenleiste bleibt, das Menü bleibt an ‚…‘.
3. iPhone: lange auf eine untere Reise drücken – Menü linksbündig unter der Kachel, ganz über ‚Backup erstellen‘.
4. ‚Backup erstellen‘ – kleines Fenster ‚Backup‘ mit ✅, die Backup-Kachel wird weiß (R-45).
5. ‚Backup laden‘ – oben ‚Backup vom …‘, darunter je eine Kachel Abgleichen und Ersetzen mit Erklärung in
   derselben Schrift, darunter Abbrechen; iPhone quer: Kacheln nebeneinander (R-46).
6. Abgleich nach der Tabelle (Designrichtlinie allgemein 15.18), z. B. Fälle 2, 3, 8, 12 – Ergebnis und Hinweise
   wie beschrieben (R-42, R-43, R-44).
7. Eine falsche Datei laden (z. B. ein Foto) – kleines Fenster ‚Backup laden‘ mit ⚠️ und Grund.

## 3.9.1 – 12.10.2026 (Korrektur)

Reiselogbuch 3.9.1 · AppDesign 4.9.1 (Designrichtlinie allgemein 4.9.1) · Designrichtlinie Reiselogbuch 3.9.1 · Zusammenarbeit allgemein 1.13.0

- T-62: Am iPhone quer war die Abfrage ‚Backup laden‘ höher als der Bildschirm (‚Abbrechen‘ nicht
  erreichbar) – jetzt breiter mit Knöpfen nebeneinander, sie passt ganz auf den Bildschirm. Am iPad
  hoch ragte das Fenster ‚Tag‘ 10 px über den unteren Rand – behoben. Neue Regel R-39 mit Prüfung.

Prüfliste: weiter P-24 (bei Version 3.9.0) – dazu Punkt 7:

7. iPhone quer: ‚Backup laden‘ – die Abfrage ist ganz zu sehen, alle drei Knöpfe erreichbar (R-39);
   iPad hoch: Fenster ‚Tag‘ öffnen – es endet über dem unteren Rand.

## 3.9.0 – 12.10.2026 (Nebenversion)

Reiselogbuch 3.9.0 · AppDesign 4.9.0 (Designrichtlinie allgemein 4.9.0) · Designrichtlinie Reiselogbuch 3.9.0 · Zusammenarbeit allgemein 1.13.0

- T-03: Abgleich zwischen iPad und iPhone über ein Backup (z. B. in iCloud Drive). Jede Änderung
  bekommt Zeitpunkt und Gerät – je Reiselogbuch und je Tag; gelöschte Reiselogbücher werden gemerkt.
  ‚Backup laden‘ zeigt Zeitpunkt und Gerät des Backups und ob es neuer oder älter ist als die Daten
  hier, und fragt: **Abgleichen** · **Ersetzen** · **Abbrechen**. Abgleichen nimmt je Reiselogbuch
  und Tag die neuere Fassung, Gelöschtes wird auch hier gelöscht, Neues kommt dazu; das Ergebnis
  steht im kleinen Fenster. Jede Kachel zeigt ‚geändert am … · iPad/iPhone‘.
- Hinweis: Reiselogbücher, die seit dem Update noch nicht geändert wurden, haben noch keinen
  Zeitpunkt – beim ersten Abgleich bleibt dort das Vorhandene, Fehlendes kommt dazu.

So geht der Abgleich: auf dem einen Gerät ‚Backup erstellen‘ → ‚In Dateien sichern‘ → iCloud Drive;
auf dem anderen ‚Backup laden‘ → die Datei in iCloud Drive wählen → ‚Abgleichen‘.

Prüfliste P-24 (iPad und iPhone, jeweils hell und dunkel, quer und hoch) – mit den betroffenen Geräte-Regeln:

1. Auf dem iPad einen Tag ändern – die Kachel zeigt ‚geändert am … · iPad‘ (gleich am iPhone: ‚· iPhone‘).
2. iPad: ‚Backup erstellen‘ → ‚In Dateien sichern‘ → iCloud Drive.
3. iPhone: einen anderen Tag ändern, dann ‚Backup laden‘ → die Datei vom iPad wählen – die Abfrage
   nennt Zeitpunkt und Gerät des Backups und ‚älter‘; Knöpfe Abgleichen (blau) · Ersetzen (rot) ·
   Abbrechen (R-38).
4. ‚Abgleichen‘ – das Fenster nennt Aktualisiert · Neu · Gelöscht · Unverändert; beide Änderungen
   sind jetzt auf dem iPhone.
5. Umgekehrt (iPhone → iPad) – danach sind beide Geräte gleich; ein gelöschtes Reiselogbuch ist auf
   beiden weg.
6. ‚Ersetzen‘ ersetzt wie bisher alles; ‚Abbrechen‘ ändert nichts.

## 3.8.1 – 12.10.2026 (Korrektur)

Reiselogbuch 3.8.1 · AppDesign 4.8.1 (Designrichtlinie allgemein 4.8.1) · Designrichtlinie Reiselogbuch 3.8.1 · Zusammenarbeit allgemein 1.13.0

- T-60: Regel R-05 verschärft – eine Symbolleiste, mit oder ohne Suchzeile, bewegt sich beim
  Wischen keinen Millimeter. Ist die Tastatur der Suche offen, schließt das erste Wischen nur die
  Tastatur, die Seite bleibt dabei stehen; das nächste Wischen scrollt. Das Prüfskript misst die
  Lage jeder Leiste beim Scrollen (iPad und iPhone, mit und ohne Suchzeile).

Prüfliste P-23 (iPad und iPhone, jeweils hell und dunkel, quer und hoch) – ersetzt P-22/5:

1. Ohne Suche: Reiselogbuch langsam, schnell und über den Rand hinaus wischen – die Leiste bewegt
   sich keinen Millimeter (R-05).
2. Mit offener Suche (Tastatur offen): wischen – das erste Wischen schließt nur die Tastatur, Leiste
   und Suchzeile bewegen sich keinen Millimeter, auch nicht beim Schließen der Tastatur (R-05).
3. Mit offener Suche (Tastatur zu): wischen, auch über den Rand – Leiste und Suchzeile stehen still.
4. Seitenleiste (iPad) bzw. Startliste (iPhone) wischen – Kopf und Backup-Kachel stehen still.

## 3.8.0 – 12.10.2026 (Nebenversion)

Reiselogbuch 3.8.0 · AppDesign 4.8.0 (Designrichtlinie allgemein 4.8.0) · Designrichtlinie Reiselogbuch 3.8.0 · Zusammenarbeit allgemein 1.13.0

Sammelversion:

- T-57 (P-21/3, 5): Reihen von Smileys ohne Leerzeichen ragen nicht mehr über die Zelle hinaus –
  mehr als drei Smileys am Zeilenanfang sind Text und brechen am Rand um; lange Wörter werden nicht
  mehr zu einer schmalen Spalte gequetscht, die Suche markiert dort richtig. Spaltenköpfe bleiben
  in einer Zeile. Das Prüfskript prüft jetzt auch mit Smiley-Reihen wie in deinem Reiselogbuch.
- T-58 (P-21/2): Die Seitenleiste behält ihre Position – ein weiter unten gewähltes Reiselogbuch
  bleibt nach dem Öffnen sichtbar (iPad und iPhone).
- T-59: iPhone – Wischen bei offener Suche schließt die Tastatur (wie Apple); die Leiste mit der
  Suchzeile zittert nicht mehr.

Prüfliste P-22 (iPad und iPhone, jeweils hell und dunkel, quer und hoch) – mit den betroffenen Geräte-Regeln:

1. Tag mit langen Smiley-Reihen ohne Leerzeichen (wie im Bildschirmfoto) in Wie war was? und
   Essen – alles bricht am Rand der Spalte um, nichts ragt in die Nachbarspalte (R-37).
2. 100 × ‚a‘ in einer Spalte – bricht am Rand um, keine schmale Buchstabensäule (R-37).
3. Suche nach ‚aaa‘ – die Treffer sind gelb markiert, die Darstellung bleibt wie ohne Suche.
4. iPad: In der Seitenleiste nach oben wischen, ein unteres Reiselogbuch wählen – es bleibt
   sichtbar und blau (iPhone: nach ‚zurück‘ ebenso).
5. iPhone: Suche öffnen, etwas eingeben, dann das Reiselogbuch wischen – die Tastatur schließt,
   Leiste und Suchzeile stehen still (R-05).

## 3.7.0 – 12.10.2026 (Nebenversion)

Reiselogbuch 3.7.0 · AppDesign 4.7.0 (Designrichtlinie allgemein 4.7.0) · Designrichtlinie Reiselogbuch 3.7.0 · Zusammenarbeit allgemein 1.13.0

Sammelversion:

- T-55 (P-20/2): Die Startliste am iPhone ist jetzt dieselbe Seitenleiste wie am iPad (ein
  Baustein). Die Reisekacheln verschwinden auf beiden Geräten nach unten hinter der
  Backup-Kachel – keine starre Begrenzung mehr am iPad. Neue Regel R-36 mit Gerätevergleich.
- T-56 (P-20/3): Zu lange Wörter (z. B. 100 × ‚a‘) brechen in der Tabelle, in den Kästen und
  Kacheln im Wort um und laufen in der nächsten Zeile weiter. Neue Regel R-37; das Prüfskript
  prüft mit 100 × ‚a‘ in allen Spalten.

Prüfliste P-21 (iPad und iPhone, jeweils hell und dunkel, quer und hoch) – mit den betroffenen Geräte-Regeln:

1. iPad quer: In der Seitenleiste die Kacheln wischen – sie verschwinden nach unten hinter der
   Backup-Kachel, Kopf und Backup-Kachel bleiben stehen, nichts federt (R-36, R-05).
2. iPhone hoch und quer: Startliste – sieht aus und verhält sich wie die Seitenleiste am iPad
   (Kopf, Kacheln, Backup-Kachel, plus und ellipsis) (R-36).
3. In einem Tag in jede Spalte 100 × ‚a‘ schreiben – auf iPad (quer und hoch) und iPhone bricht
   das Wort im Wort um, nichts ragt in die Nachbarspalte oder über den Rand (R-37).
4. Langer Name eines Reiselogbuchs (z. B. 60 × ‚b‘) – die Kachel bricht im Wort um (R-37).
5. Suche nach ‚aaa‘ – die Treffer im langen Wort werden markiert.

## 3.6.0 – 11.10.2026 (Nebenversion)

Reiselogbuch 3.6.0 · AppDesign 4.6.0 (Designrichtlinie allgemein 4.6.0) · Designrichtlinie Reiselogbuch 3.6.0 · Zusammenarbeit allgemein 1.13.0

Sammelversion:

- T-53 (P-19/3): Am iPad stehen Kopfzeile und Backup-Kachel fest – die Kopfzeile ist fest
  positioniert, in der Seitenleiste scrollen nur die Kacheln.
- T-54: Regelkatalog R-01 bis R-35 (AppDesign); das Prüfskript prüft jetzt auch alle
  automatisch prüfbaren Regeln (29) in jeder Ansicht – es hätte den Fehler aus P-19/3 gefunden.

Prüfliste P-20 (iPad und iPhone, jeweils hell und dunkel) – mit den betroffenen Geräte-Regeln:

1. iPad quer: Tabelle nach oben und unten wischen, auch über den Rand hinaus – die Kopfzeile
   bleibt stehen, nichts federt (R-05).
2. iPad quer und hoch: In der Seitenleiste die Kacheln wischen – Kopf ‚Reiselogbücher‘ und
   Backup-Kachel bleiben stehen (R-05).
3. iPad hoch: Seitenleiste ein- und ausblenden, Reiselogbuch wählen – alles wie bisher.
4. iPad: Tageserfassung mit offener Tastatur – Kopfzeile und Fenster-Kopf bleiben sichtbar (R-28).
5. iPhone: Startliste und Reiselogbuch wischen – die Leiste bleibt stehen (R-05).

## 3.5.0 – 11.10.2026 (Nebenversion)

Reiselogbuch 3.5.0 · AppDesign 4.5.0 (Designrichtlinie allgemein 4.5.0) · Designrichtlinie Reiselogbuch 3.5.0 · Zusammenarbeit allgemein 1.12.5

Aus der Prüfung von 3.4.0 (P-18):

- T-51: Vorschau am iPad wie am iPhone in voller Seitenbreite – im Hochformat ragt nichts mehr
  über die Tabelle hinaus, man wischt seitlich.
- T-52: Leisten bewegen sich nie – die Seite federt beim Wischen nicht nach; die Leiste der
  iPhone-Startliste steht fest (P-18/4).

Prüfliste P-19 (iPad und iPhone, jeweils hell und dunkel):

1. iPad hoch und quer: Vorschau – die Seite in voller Breite, alles innerhalb der Tabelle; im
   Hochformat lässt sie sich seitlich wischen.
2. iPhone: Startliste nach oben und unten wischen – die Leiste mit ‚Reiselogbücher‘ bleibt stehen,
   auch wenn nur wenige Reiselogbücher da sind.
3. iPad und iPhone: Reiselogbuch nach oben und unten wischen – die Leiste bleibt stehen, die Seite
   federt am Rand nicht nach.

## 3.4.0 – 11.10.2026 (Nebenversion)

Reiselogbuch 3.4.0 · AppDesign 4.4.0 (Designrichtlinie allgemein 4.4.0) · Designrichtlinie Reiselogbuch 3.4.0 · Zusammenarbeit allgemein 1.12.5

Sammelversion aus der Prüfung von 3.3.0 (P-17):

- T-46: Der Titel des Reiselogbuchs steht auf iPad und iPhone in der Leiste; die Überschrift
  über den Reiseteilnehmern entfällt (in der Ausgabe bleibt sie).
- T-47: iPhone – ‚Reiseteilnehmer:‘, ‚Reisezeitraum:‘, ‚Reisemittel:‘ wie am iPad, Wert in der
  nächsten Zeile; Reisemittel in einer Zeile, seitlich wischen.
- T-48: Backup-Kachel immer sichtbar – gelb mit blauem Knopf, solange heute noch kein Backup
  erstellt wurde, sonst weiß (P-17/4: sie fehlte, weil heute schon gesichert war).
- T-49: Unter ‚Reiselogbücher‘ klein und grau die Anzahl (Seitenleiste und iPhone-Startliste).
- T-50: Großschreibung schon vor der Eingabe; nach einem Vorschlag (z. B. ‚Freetour …‘) beginnt
  das nächste Wort groß.

Prüfliste P-18 (iPad und iPhone, jeweils hell und dunkel):

1. iPad und iPhone: Der Name des Reiselogbuchs steht in der Leiste, darunter direkt die
   Reiseteilnehmer (ohne Überschrift); in Vorschau/Ausgabe steht die Überschrift weiterhin.
2. iPhone: ‚Reiseteilnehmer:‘, ‚Reisezeitraum:‘, ‚Reisemittel:‘ mit dem Wert in der nächsten
   Zeile; viele Reisemittel lassen sich seitlich wischen.
3. iPad und iPhone: Backup-Kachel immer unten – gelb, solange heute noch kein Backup erstellt
   wurde; nach ‚Backup erstellen‘ weiß.
4. iPad und iPhone: Unter ‚Reiselogbücher‘ klein und grau die Anzahl.
5. iPad und iPhone: Verlauf – erster Buchstabe groß; nach ‚Freetour …‘ beginnt der Ort groß.

## 3.3.0 – 11.10.2026 (Nebenversion)

Reiselogbuch 3.3.0 · AppDesign 4.3.0 (Designrichtlinie allgemein 4.3.0) · Designrichtlinie Reiselogbuch 3.3.0 · Zusammenarbeit allgemein 1.12.5

Sammelversion aus der Prüfung von 3.2.0 (P-16):

- T-37: Doppeltippen (z. B. auf ein Reisemittel) vergrößert die Ansicht nicht mehr.
- T-38: Reisezeitraum – ‚Bis‘ mit Datum steht auf dem iPhone unter ‚Von‘ (Bezeichnung bleibt beim Feld).
- T-39: Erster offener Tag gelb ohne blauen Rand (Tabelle und Kacheln).
- T-40/T-43: Startliste (iPhone) und Seitenleiste (iPad) gleich – Titel links in der fest
  stehenden Leiste, Reiselogbücher als Kacheln, gelbe Backup-Kachel fest unten.
- T-41: Eigene Mikrofon-Knöpfe entfernt; Diktieren über die Mikrofon-Taste der Tastatur.
- T-42: Der erste Buchstabe jeder Zeile wird groß – auch nach einem Smiley, auf iPad und iPhone.
- T-44: ‚Verlauf‘ in den Tageskacheln halbfett.
- T-45: Nach oben / Ans Ende in einer senkrechten Kapsel.

Prüfliste P-17 (iPad und iPhone, jeweils hell und dunkel):

1. iPad und iPhone: Doppeltippen auf ein Reisemittel (Einstellungen) oder einen Smiley vergrößert nichts.
2. iPhone: Einstellungen – ‚Bis‘ mit Datum steht unter ‚Von‘.
3. iPad und iPhone: Erster offener Tag gelb, ohne blauen Rand.
4. iPad: Seitenleiste mit Kacheln, Kopf bleibt stehen, die Kacheln lassen sich nach oben wischen;
   gelbe Backup-Kachel fest unten.
5. iPhone: Startliste gleich wie die Seitenleiste – ‚Reiselogbücher‘ links in der Leiste, Leiste
   bewegt sich beim Wischen nicht.
6. iPad und iPhone: Keine Mikrofon-Knöpfe mehr; Diktieren mit der Mikrofon-Taste der Tastatur.
7. iPad und iPhone: Tageserfassung – erster Buchstabe groß, auch nach einem Smiley und nach ‚.‘.
8. iPhone: ‚Verlauf‘ in den Kacheln halbfett.
9. iPad: Nach oben / Ans Ende in einer senkrechten Kapsel.

## 3.2.0 – 11.10.2026 (Nebenversion)

Reiselogbuch 3.2.0 · AppDesign 4.2.0 (Designrichtlinie allgemein 4.2.0) · Designrichtlinie Reiselogbuch 3.2.0 · Zusammenarbeit allgemein 1.12.5

Sammelversion aus der Prüfung von 3.1.0 (P-15):

- T-32: **‚Verlauf‘** statt ‚Programm‘ überall (Tabelle, Tageserfassung, Ausgabe, Einstellungen).
  iPhone: in den Tageskacheln als Wort in normaler Schrift; Felder durch Linien getrennt
  (waagrecht und senkrecht).
- T-34: Suche auf dem iPhone wie am iPad (`search` in der Kapsel, Suchzeile mit ‚1 von 4‘, ⌃ ⌄).
- T-25: iPhone – großer Titel wandert beim Hochschieben in die Leiste (wie Notizen).
- T-27/T-35: iPhone-Startliste mit Kapsel [plus | ellipsis] oben, jedes Reiselogbuch als Kachel
  (zuletzt geöffnetes blau), Backup-Hinweis fest unten als gelbe Kachel mit blauem Knopf – am
  iPad in der Seitenleiste ebenso fest unten und gelb.
- T-28: Wischen in Fenstern, Menüs und Sprechblasen bewegt die Seite dahinter nicht mehr.
- T-33: x beim Öffnen eines Fensters ohne blauen Rahmen.
- T-36: Vorschau auf dem iPhone – Kapsel [PDF | share] vollständig, Seite in voller Breite
  (seitlich wischen) statt zerrissener Wörter.
- T-26: Backup-Abfrage ‚Backup mit 3 Reiselogbüchern laden?‘ mit Zeilenumbruch.
- T-30: ‚Letztes Backup erstellt am …‘ gilt je Gerät (wird beim Laden nicht übernommen).
- T-29: Textfelder mit Großbuchstaben am Satzanfang, Autokorrektur und Rechtschreibprüfung.
- T-31: Spracheingabe – jede Störung wird mit Ursache und Abhilfe gemeldet (Fehlersuche).

Prüfliste P-16 (iPad und iPhone, jeweils hell und dunkel):

1. iPad: Spalte, Tageserfassung, Ausgabe und Einstellungen heißen ‚Verlauf‘ statt ‚Programm‘.
2. iPad: Backup-Hinweis in der Seitenleiste gelb mit blauem Knopf, fest unten (bei vielen
   Reiselogbüchern laufen sie dahinter durch).
3. iPad und iPhone: Backup laden – ‚Backup mit n Reiselogbüchern laden?‘, danach neue Zeile;
   nach dem Laden zeigt ‚Letztes Backup erstellt am …‘ weiter das Backup dieses Geräts.
4. iPad und iPhone: In Einstellungen, Tageserfassung und Fazit nach oben/unten wischen – nur das
   Fenster bewegt sich, die Seite dahinter nicht; ebenso bei offenem Menü und Sprechblase.
5. iPad und iPhone: Beim Öffnen eines Fensters ist das x nicht blau umrandet.
6. iPad und iPhone: Mikrofon antippen – entweder wird diktiert oder eine Meldung nennt die
   Ursache (bitte den Text der Meldung mitteilen).
7. iPhone: Tageserfassung – die Tastatur beginnt mit einem Großbuchstaben.
8. iPhone: Startliste – Kapsel [plus | ellipsis] oben, Kacheln, das zuletzt geöffnete blau,
   Backup-Hinweis gelb fest unten.
9. iPhone: Startliste und Reiselogbuch hochschieben – der Titel steht klein in der Leiste, die
   Leiste bleibt oben.
10. iPhone: Tageskacheln mit ‚Verlauf‘ in normaler Schrift und Linien waagrecht und senkrecht.
11. iPhone: Suche wie am iPad – ‚1 von n‘, ⌃ ⌄ springen zu den Treffern, ⓧ leert, search schließt.
12. iPhone: Teilen → Vorschau – Kapsel [PDF | share] vollständig, die Seite lässt sich seitlich
    wischen; hoch und quer.

## 3.1.0 – 10.10.2026 (Nebenversion)

Reiselogbuch 3.1.0 · AppDesign 4.1.0 (Designrichtlinie allgemein 4.1.0) · Designrichtlinie Reiselogbuch 3.1.0 · Zusammenarbeit allgemein 1.12.5

Sammelversion:

- T-02: **iPhone-Ansicht** (hoch und quer) wie Notizen auf dem iPhone – Startliste
  ‚Reiselogbücher‘ als eigene Seite mit großem Titel, rundem `plus` unten rechts und Menü oben
  rechts; ein Reiselogbuch zeigt die Tage als Kästen, die Suche steht unten; Tageserfassung und
  alle Fenster bildschirmfüllend; runder Zurück-Knopf ohne Text. Bausteine dafür neu in AppDesign
  4.1.0. iPad unverändert (Fenster ‚Hochformat‘ legt die Seitenleiste wie bisher darüber).
- T-24: Mehr-Menü ‚Alle Tage‘ / ‚Nur erfasste Tage‘ wieder mit Icons – Häkchen vorne, dann Icon
  und Text.
- Beim Start springt die App auch nach einem Neuladen zuverlässig zum ersten offenen Tag.
- Tests: neuer Ablauf-Test `ablauf-iphone.mjs`; HIG-Prüfung zusätzlich für iPhone hoch/quer.

Prüfliste P-15 (auf dem iPad und dem iPhone, jeweils hell und dunkel):

1. iPad: Mehr-Menü – ‚Alle Tage‘ / ‚Nur erfasste Tage‘ mit Häkchen vorne, dann Icon und Text.
2. iPad quer und hoch: sonst alles wie bisher.
3. iPhone: Reiselogbuch in Safari öffnen und über Teilen → ‚Zum Home-Bildschirm‘ hinzufügen.
4. iPhone: Start im laufenden Reiselogbuch, der erste offene Tag ist gelb und sichtbar.
5. iPhone: Tage als Kästen; Antippen öffnet die Tageserfassung bildschirmfüllend, der Kasten
   bleibt blau; ‹ › blättert, das Häkchen speichert.
6. iPhone: Wetter – alle sieben Symbole ohne Wischen; Options-Kapseln unter dem Kasten-Titel.
7. iPhone: Suche unten – beim Tippen steht das Suchfeld über der Tastatur; ‚n gefunden‘;
   ⓧ leert, rundes x beendet.
8. iPhone: runder ‹ führt zur Startliste ‚Reiselogbücher‘ (Anzahl, Liste, Backup-Hinweis).
9. iPhone: Startliste – ellipsis-Menü (Backup, Version), plus legt ein Reiselogbuch an,
   langes Drücken zeigt Einstellungen · Reiselogbuch löschen.
10. iPhone: Teilen-Menü (Vorschau, HTML, PDF) und Mehr-Menü inkl. Darstellung ›; Löschen führt
    zur Startliste.
11. iPhone quer: gleiche Ansicht, nichts abgeschnitten.
12. iPhone: Backup erstellen und Backup laden (z. B. das Backup vom iPad über iCloud Drive) –
    die Abfrage nennt ‚auf diesem iPhone‘.

## 3.0.0 – 09.10.2026 (Hauptversion)

Reiselogbuch 3.0.0 · AppDesign 4.0.0 (Designrichtlinie allgemein 4.0.0) · Designrichtlinie Reiselogbuch 3.0.0 · Zusammenarbeit allgemein 1.10.0

- T-23: Gemeinsame Bausteine kommen aus dem neuen Design-Repo **AppDesign**:
  `../AppDesign/v4/design.css` (Farben und Komponenten) und `../AppDesign/v4/ui.js` (Icons, Menüs,
  Sprechblasen, Fenster, Darstellung …). `index.html` enthält nur noch, was zum Reiselogbuch gehört.
- Aussehen und Bedienung **unverändert** – 40 Ansichten (hell/dunkel, quer/hoch) pixelgenau mit 2.4.0
  verglichen. Daten unverändert.
- Offline: Der Service Worker speichert auch die AppDesign-Dateien.
- Designrichtlinie allgemein, Zusammenarbeit allgemein und Apple-Vergleichsbilder sind nach
  AppDesign umgezogen; das HIG-Prüfskript nutzt `AppDesign/tests/hig.mjs`.

## 2.4.0 – 09.10.2026 (Nebenversion)

Reiselogbuch 2.4.0 · Designrichtlinie allgemein 3.6.1 · Designrichtlinie Reiselogbuch 2.4.0 · Zusammenarbeit allgemein 1.8.0

Sammelversion aus der Prüfung von 2.3.0:

- T-20: Menüs ohne Linien zwischen den einzelnen Punkten – nur die eingerückte Linie zwischen
  Gruppen (wie iOS 26).
- T-21: Suchfeld ohne blauen Fokus-Rahmen; beim Blättern mit ⌃ ⌄ geht die Tastatur zu wie bisher.
- HIG-Prüfskript prüft zusätzlich Linien in Menüs und den Fokus-Rahmen des Suchfelds;
  Essen-Links als bewusste Abweichung.

## 2.3.0 – 09.10.2026 (Nebenversion)

Reiselogbuch 2.3.0 · Designrichtlinie allgemein 3.6.0 · Designrichtlinie Reiselogbuch 2.3.0 · Zusammenarbeit allgemein 1.7.1

Sammelversion aus der HIG-Prüfung der ganzen App:

- T-18: Darstellung folgt automatisch dem iPad; im Mehr-Menü Untermenü ‚Darstellung ›‘ mit
  Automatisch · Hell · Dunkel (ersetzt ‚Modus dunkel/hell‘).
- T-12: Gruppen in allen Menüs durch eine dünne, eingerückte Linie getrennt (wie iOS 26).
- T-07: Alle Kapseln gleich gebaut – die Markierung liegt immer innerhalb des Randes.
- T-15: Kontextmenü in der Seitenleiste ohne ‚Öffnen‘ (Tippen öffnet).
- T-17: Schaltflächen in Sprechblasen ohne Icons; ‚Abbrechen‘ in normaler Schrift.
- T-16: Graue Hinweistexte kontrastreicher; Löschen-Schaltfläche im Dunkelmodus gut lesbar.
- T-13: Größere Antippflächen für Maps-Links (Quartier, ‚In Google Maps prüfen‘) und ⓧ in der Suche.
- T-11/T-14: Verständlichere Texte – Überschneidung (‚Wähle einen Zeitraum, …‘),
  Quartier-Hinweis ohne ‚Cursor‘, Download-Meldung.
- T-10: HIG-Prüfskript `tests/hig.mjs` prüft jede Version (hell/dunkel, quer/hoch).

## 2.2.2 – 09.10.2026 (Korrektur)

Reiselogbuch 2.2.2 · Designrichtlinie allgemein 3.4.1 · Designrichtlinie Reiselogbuch 2.2.2 · Zusammenarbeit allgemein 1.5.0

- T-09: Alle Texte der App verwenden einfache Anführungszeichen ‚…‘ statt doppelter (z. B.
  ‚In Dateien sichern‘, ‚Tag‘ und ‚Programm‘, ‚keinen Google-Maps Link‘, Reisetitel in Abfragen).
- T-08: Teilen-Menü wie das Menü der Seitenleiste: durchgehender Strich vor der grauen Zeile
  ‚N erfasste Tage · Dateiname …‘, ohne Leerzeilen.

## 2.2.1 – 09.10.2026 (Korrektur)

Reiselogbuch 2.2.1 · Designrichtlinie allgemein 3.3.1 · Designrichtlinie Reiselogbuch 2.2.1 · Zusammenarbeit allgemein 1.5.0

- F-11: Ein Reiselogbuch bleibt in der Seitenleiste blau, solange seine Einstellungen (über
  langes Drücken geöffnet) offen sind; ebenso die Tageszeile (wandert beim Blättern mit) und
  das Fazit, solange ihr Fenster offen ist.
- F-12: Menü der Seitenleiste: technische Informationen nach einem durchgehenden Strich, ohne
  Leerzeilen; statt „Speicher: dauerhaft“ der Satz „Die Daten bleiben in Safari gespeichert,
  solange das Reiselogbuch auf dem Home-Bildschirm nicht entfernt wird.“ (sonst „Safari kann
  die Daten bei Speichermangel löschen – bitte regelmäßig ein Backup erstellen.“).

## 2.2.0 – 09.10.2026 (Nebenversion)

Reiselogbuch 2.2.0 · Designrichtlinie allgemein 3.3.0 · Designrichtlinie Reiselogbuch 2.2.0 · Zusammenarbeit allgemein 1.5.0

- T-01: Langes Drücken auf ein Reiselogbuch in der Seitenleiste öffnet ein Kontextmenü:
  Öffnen · Einstellungen (für genau dieses Reiselogbuch) · Reiselogbuch löschen.
- T-04: Die App fordert dauerhaften Speicher an, damit Safari die Daten nicht von selbst löscht;
  im Menü der Seitenleiste steht, ob der Speicher dauerhaft ist, und ein Hinweis, dass beim
  Entfernen vom Home-Bildschirm alle Daten verloren gehen.

## 2.1.5 – 08.10.2026 (Korrektur)

Reiselogbuch 2.1.5 · Designrichtlinie allgemein 3.2.3 · Designrichtlinie Reiselogbuch 2.1.2 · Zusammenarbeit allgemein 1.5.0

- F-10: Bei sichtbarer Tastatur bleiben die Kopfzeilen aller Fenster (Einstellungen,
  Tageserfassung, Fazit, Neues Reiselogbuch, Meldungen) und der Hauptansicht sichtbar; das
  Fenster passt sich dem Bereich über der Tastatur an, nur der Inhalt scrollt.

## 2.1.4 – 08.10.2026 (Korrektur)

Reiselogbuch 2.1.4 · Designrichtlinie allgemein 3.2.2 · Designrichtlinie Reiselogbuch 2.1.2 · Zusammenarbeit allgemein 1.4.0

- F-09: Markierung in den Auswahl-Kapseln wie bei Apple (Tapback): bei Wetter und Smileys ein
  runder Kreis statt eines „Eis“, bei Reisemitteln eine Kapsel mit Abstand nach innen; markierte
  Nachbarn haben jetzt Abstand zueinander.

## 2.1.3 – 08.10.2026 (Korrektur)

Reiselogbuch 2.1.3 · Designrichtlinie allgemein 3.2.1 · Designrichtlinie Reiselogbuch 2.1.2 · Zusammenarbeit allgemein 1.4.0

- F-08: In den Auswahl-Kapseln (Reisemittel, Wetter, Smileys) wurde die blaue Markierung unten
  abgeschnitten – die Schaltflächen füllen jetzt genau den Innenraum der Kapsel.

## 2.1.2 – 08.10.2026 (Korrektur)

Reiselogbuch 2.1.2 · Designrichtlinie allgemein 3.2.1 · Designrichtlinie Reiselogbuch 2.1.2 · Zusammenarbeit allgemein 1.4.0

- F-06: Beim Start ist die Seitenleiste immer eingeblendet (hoch über den Inhalt gelegt); die
  laufende Reise ist geöffnet.
- F-07: Seitenleiste reicht wie in Safari bis 4 px über den unteren Rand.

## 2.1.1 – 08.10.2026 (Korrektur)

Reiselogbuch 2.1.1 · Designrichtlinie allgemein 3.2.0 · Designrichtlinie Reiselogbuch 2.1.1 · Zusammenarbeit allgemein 1.4.0

- F-01: PDF/Drucken bei eingeblendeter Seitenleiste – jetzt nur das Reiselogbuch, ohne
  freien Platz links.
- F-02: Suche – Markierung sofort, Sprung nach kurzer Tipp-Pause; Treffer direkt unter der
  Suchzeile; Kopf- und Suchzeile bleiben bei offener Tastatur fest.
- F-03: Ausgabe – Wetter in der Spalte „Tag“ unter dem Datum, die Spalte wird schmäler.
- F-04: Gesamtkosten – Feld so breit wie „100.000,00“, wächst bei längeren Beträgen mit.
- F-05: Smileys, Wetter-Symbole und Reisemittel in je einer wischbaren Kapsel.

## 2.1.0 – 08.10.2026 (Nebenversion)

Reiselogbuch 2.1.0 · Designrichtlinie allgemein 3.1.0 · Designrichtlinie Reiselogbuch 2.1.0 · Zusammenarbeit allgemein 1.4.0

- Seitenleiste schwebt wie in Safari: runde Ecken, Lichtkante, Schatten wie die Schaltflächen.
- Beim Öffnen eines Reiselogbuchs und beim Start immer „Alle Tage“.
- Datumsfelder mit eigenem Kalender-Icon; Breite passt zum Datum.
- Fehler behoben: ellipsis der Seitenleiste bleibt blau, solange Teilen-Menü, Dateiauswahl
  oder Meldung von dort offen sind.
- „Backup erstellen“ statt „Backup sichern“; nur noch „Letztes Backup erstellt am …“.
- Statistik: neue Zeile „Nächte“ unter „Quartiere“.
- Gesamtkosten mit Cent: „4.850,00 €“ (€ hinter dem Betrag), rechtsbündig, „,00“ wird ergänzt.
- Tabellenüberschriften 17 px halbfett, gleich groß wie die Zellen.

## 2.0.0 – 08.10.2026 (Hauptversion)

Reiselogbuch 2.0.0 · Designrichtlinie allgemein 3.0.0 · Designrichtlinie Reiselogbuch 2.0.0 · Zusammenarbeit allgemein 1.1.0

Neues Bedienkonzept wie in Apple-Apps. Die Daten bleiben unverändert erhalten.

- Seitenleiste „Reiselogbücher“ statt Fenster: Kapsel [plus | ellipsis] und panel-left;
  gewähltes Reiselogbuch blau gefüllt; quer fest links (aus-/einblendbar), hoch darübergelegt.
- Backup-Hinweis unten in der Seitenleiste, solange heute noch nicht gesichert wurde;
  Mehr-Menü der Seitenleiste mit Backup sichern/laden und Versionszeile.
- Kopfzeile mit Titel und Kapsel [share | search | ellipsis]; Suche als zweite Zeile über
  die volle Breite; Tabellenkopf bleibt direkt darunter stehen.
- Teilen-Menü (Vorschau · HTML · PDF) statt Fenster „Ausgabe“; Mehr-Menü mit Alle Tage /
  Nur erfasste Tage, Einstellungen, Modus dunkel/hell, Reiselogbuch löschen.
- Fenster ohne Fußleiste: rundes x links, rundes Häkchen rechts (grau, nach einer Änderung
  blau); x mit Änderungen fragt „Änderungen verwerfen“ / „Weiter bearbeiten“.
- Alle Abfragen als Sprechblase an der angetippten Schaltfläche; Meldungen als kleines
  Fenster mit x.
- „Reiselogbuch bearbeiten“ heißt jetzt „Einstellungen“; Löschen nur noch im Mehr-Menü;
  Reisezeitraum mit „Von“/„Bis“ und Datumsfeldern so breit wie das Datum; Spaltennamen
  „Spalte 🙂☹️😉 ‚Wie war was?‘“ usw.
- Tageserfassung: Vortag/Folgetag als Kapsel neben dem Häkchen, „Automatisch gespeichert
  um …“ unter dem Datum; Textfelder wachsen mit dem Inhalt (auch Fazit).
- Gedrückte Schaltflächen (offenes Menü, Fenster, Sprechblase) bleiben blau getönt.
- Tabelle bricht nur zwischen ganzen Wörtern um; Text in Schaltflächen mittig zum Icon.
- Backup-Erinnerung nach der Ausgabe: „Heute noch kein Backup gesichert. Zuletzt gesichert
  am …“ (einmal am Tag statt alle 24 Stunden).
- Smiley entfernen und Smileys zurücksetzen bestätigen jetzt rot.

## 1.2.0 – 07.10.2026 (Nebenversion)

Reiselogbuch 1.2.0 · Designrichtlinie allgemein 2.1.0 · Designrichtlinie Reiselogbuch 1.2.0 · Zusammenarbeit allgemein 1.0.0

- Akzentfarbe Apple-Blau für Hauptaktion, Auswahl, Schritt-Nummern, Links, Rahmen und
  Markierungen; leuchtenderer Schein.
- Gewählte Wetter-Symbole/Reisemittel mit Haarlinie: die Breite ändert sich nicht mehr.
- Schatten um Tagestabelle und Quartierliste sowie bei allen Eingabefeldern (auch Gesamtkosten).
- Einstellungen in „Reiselogbuch bearbeiten“ als Apple-Schalter; Optionen in der
  Tageserfassung als Options-Kapseln mit Häkchen.
- Tageserfassung: Hotel und Ort in einer Zeile.

## 1.1.0 – 07.10.2026 (Nebenversion)

Reiselogbuch 1.1.0 · Designrichtlinie allgemein 2.0.0 · Designrichtlinie Reiselogbuch 1.1.0 · Zusammenarbeit allgemein 1.0.0

- Apple-Look: Hintergrund Hellgrau (dunkel: Schwarz), Kästen und Tabelle weiß ohne Rand,
  Haarlinien, schwebende Schaltflächen (Lichtkante, weicher Schatten, Kapselform), Abstände
  12 px.
- Farbbedeutungen: Grün gefüllt = Hauptaktion, grün getönt mit Rand = eingeschaltet
  (Wetter, Reisemittel, Mikrofon), rot gefüllt = Löschen.
- Suchfeld schwebend mit Trefferanzeige „3 von 57“, x zum Löschen und Navigation zum
  vorigen/nächsten Treffer; Treffer im Fokus hellorange.
- Neue Dateien: `README - Zusammenarbeit allgemein.md`, `CLAUDE.md`.

## 1.0.0 – 06.10.2026 (erste fertige Fassung)

Reiselogbuch 1.0.0 · Designrichtlinie allgemein 1.1.0 · Designrichtlinie Reiselogbuch 1.0.1

- Dreistufige Versionsnummer und diese Versionsgeschichte.
- Reiselogbuch löschen: Die Maske „Reiselogbücher“ bleibt mit der aktualisierten Liste
  offen; war das gelöschte Reiselogbuch geöffnet, wechselt der Hintergrund auf die
  Startreise.
- Reiselogbuch bearbeiten: „Abbrechen“ und „Fertig“ führen zurück zur Liste.
- Neues Reiselogbuch: „Fertig“ öffnet es direkt, „Abbrechen“ führt zurück zur Liste.

## Entwicklungsstand (Version 1–25)

| Version | Datum | Art | Inhalt |
|---|---|---|---|
| 25 | 06.10.2026 | Korrektur | Neue Versionen sofort laden (kein 10-Minuten-Zwischenspeicher) |
| 24 | 06.10.2026 | Neben | Pflichtfelder Reiseteilnehmer und Reisemittel; ausgegrautes „Fertig“ zeigt alle fehlenden Angaben; „optional“ aus Platzhalter entfernt |
| 23 | 06.10.2026 | Neben | Konfiguration Tabellenspalten; Fehlermeldungen am Feld; „Ausgabe“ mit „Schließen“ |
| 22 | 05.10.2026 | Neben | Zeitraum/Status rechts in „Reiselogbücher“; Vorschau der Ausgabe mit „Teilen“ |
| 21 | 05.10.2026 | Neben | Ohne Reiselogbuch startet die Maske „Reiselogbücher“ mit leerer Liste |
| 20 | 05.10.2026 | Neben | „Reiselogbücher“: Titel, Zeitraum und Status in Spalten |
| 19 | 05.10.2026 | Neben | Quadratische 44 × 44-Schaltflächen; Versionsinfo hinter Info-Icon |
| 18 | 05.10.2026 | Neben | Einheitliche Schaltflächenhöhe 44 px; Fensterbreite passt sich dem Inhalt an |
| 17 | 05.10.2026 | Neben | Einzeilige Smiley-Leisten zum Wischen |
| 16 | 05.10.2026 | Neben | Begriffe „Wie war was?“ und „Essen und Trinken“, breitere Tagesmaske |
| 15 | 05.10.2026 | Neben | Lucide-Icons auf den Schaltflächen |
| 14 | 05.10.2026 | Korrektur | Hängender Einzug in der Essen-Spalte |
| 13 | 05.10.2026 | Neben | Checkboxen „keinen Google-Maps Link“; 2-stufige Darstellung Hell/Dunkel |
| 12 | 05.10.2026 | Neben | 📍 nur als Zeichen, Link nur auf dem Namen; Ort nach Komma |
| 11 | 05.10.2026 | Neben | Umbenennung in „Reiselogbuch“, eigenes Repo ReiseLogBuch |
| 10 | 05.10.2026 | Neben | Maps-Links nur auf dem Namen |
| 9 | 05.10.2026 | Neben | Spalte Essen und Trinken; Statistik nach der Quartierliste |
| 6–8 | 05.10.2026 | Neben | Bedienung, Tabellendesign (Grautöne), Begriffe |
| 5 | 04.10.2026 | Neben | Speichern über das Teilen-Menü, Backup-Erinnerung |
| 4 | 04.10.2026 | Neben | Speichern über Kurzbefehl (später wieder entfernt) |
| 1–3 | 04.10.2026 | Haupt | Erste Versionen als iPad-Web-App („Reisetagebuch“) |
