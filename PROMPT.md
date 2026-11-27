# Reiselogbuch – Funktionsbeschreibung (Stand 27.11.2026, Version 3.59.1)

Reiselogbuch 3.59.1 · AppDesign 4.71.0 (Designrichtlinie allgemein 4.71.0) · Designrichtlinie Reiselogbuch 3.59.1 · Zusammenarbeit allgemein 3.19.0

Was das Reiselogbuch tut und wie es aussieht – **nur Reiselogbuch-Eigenes**. Es gelten die Designrichtlinie allgemein und ihr
Regelkatalog (AppDesign, Abschnitt 17); sie werden hier nur genannt, nie wiederholt. Was das Reiselogbuch bewusst anders macht,
steht in `README - Designrichtlinie Reiselogbuch.md`; Einstieg für Claude: `CLAUDE.md`. Bei jeder Änderung mit aktualisieren.

---

## 1. Zweck und Rahmen

- Ein Reisetagebuch in Tabellenform: je Reise ein **Reiselogbuch** mit einer Zeile je Tag, am Ende Fazit, Gesamtausgaben,
  Quartierliste und Statistik; ausgegeben als HTML oder PDF. Beispiel der Ausgabe:

  ```text
  Reiselogbuch – <Titel>
  Reiseteilnehmer:  Gerhild & Arnold
  Reisezeitraum:    24.08.2026 - 11.11.2026
  Reisemittel:      ✈️ Flugzeug, 🚗 PKW

  | Tag             | Verlauf             | 🙂☹️😉              | 😴💤 (Quartier)            |
  | Mo, 24.08. 🌤   | Anreise nach Wien   | ☹️ Kurzer Kommentar | Prize by Radisson, Wien    |

  Fazit
  Gesamtausgaben: 0,00 €
  ```

- Web-App für iPad und iPhone, über Safari zum Home-Bildschirm hinzugefügt; nur eine Person nutzt sie (kein Login), abgeglichen
  wird über das Backup (11). Nur Text, Icons und Smileys – keine Fotos.
- Daten bleiben lokal auf dem Gerät (localStorage `reiselogbuch.v1`, dauerhafter Speicher angefordert); offline nutzbar (R-1.5).
- Bereitstellung über GitHub Pages aus dem Repo ‚ReiseLogBuch‘ (Branch `main`, Hauptordner): https://g811141a.github.io/ReiseLogBuch/
  – das Repo ist öffentlich, die Einträge bleiben trotzdem nur auf den Geräten.
- Aufbau, Bedienung und Aussehen wie in der Designrichtlinie allgemein (Apple-Look, Seitenleiste und Kopfzeile, Fenster,
  Sprechblasen, Schaltflächen, Tabellen, Darstellung hell/dunkel/automatisch).

## 2. Begriffe, Texte und Icons

- App-Name ‚Reiselogbuch‘; der Begriff ‚Reisetagebuch‘ kommt nicht vor.
- Seitenleiste bzw. Startliste ‚Reiselogbücher‘; Fenster ‚Neues Reiselogbuch‘ (über plus) und ‚Reiselogbuch einstellen‘ (Mehr-Menü und Kontextmenü; Abweichung 4);
  Menüpunkt ‚Reiselogbuch löschen‘.
- Überschrift ‚Reiselogbuch – <Titel>‘ nur in der Ausgabe; in der App steht der Titel des Reiselogbuchs in der Leiste (iPad und
  iPhone, R-2.2).
- Spalte und Erfassungsschritt **‚Verlauf‘** – passt auch zu Tagen, an denen man nur fährt. Erfassungsschritte: ‚Wetter‘,
  ‚Verlauf‘, ‚Wie war was?‘, ‚Essen und Trinken‘, ‚Quartier‘.
- Options-Kapseln (Tageserfassung): ‚Quartier wie Vortag‘, ‚keinen Google-Maps Link‘; Schalter (Bearbeiten): ‚Quartierliste in der
  Ausgabe‘.
- Leer (leerer Zustand, AppDesign 15.23 / R-7.7): Inhalt `book-open` ‚Noch kein Reiselogbuch‘, ‚Ein neues mit ‚plus‘ in der
  Seitenleiste anlegen.‘, Schaltfläche ‚Neues Reiselogbuch‘ (wie ‚plus‘); Seitenleiste daneben nur Symbol und Titel; iPhone-Startliste vollständig mit
  Schaltfläche. Suche ohne Treffer (Liste und Reiselogbuch) `search` ‚Keine Treffer für ‚Begriff‘‘, ‚Schreibweise prüfen oder nach etwas anderem
  suchen.‘; ‚Nur erfasste Tage‘ ohne erfassten Tag `calendar` ‚Noch keine Tage erfasst‘, ‚Es werden nur erfasste Tage gezeigt.‘, Schaltfläche ‚Alle Tage
  zeigen‘ (wie Menü ‚Alle Tage‘).
- **Abfragen** (Sprechblasen an der angetippten Schaltfläche, R-4.3): Endgültig löschen (in ‚Zuletzt gelöscht‘, im Kontextmenü bzw. an der
  Kapsel) · Backup laden (Abgleichen/Ersetzen, am ellipsis der Seitenleiste) · Smiley entfernen (am Smiley) · Smileys
  zurücksetzen (am rotate-ccw) · Änderungen verwerfen (am x). Rote Schaltflächen: ‚Endgültig löschen‘, ‚Ersetzen‘,
  ‚Entfernen‘, ‚Zurücksetzen‘, ‚Änderungen verwerfen‘.
- **Icons** (Lucide, Zuordnung der Designrichtlinie allgemein 5): Ausgabe/Teilen `share`, ‚Reiselogbuch einstellen‘
  `settings`, Filter ‚Alle Tage‘ `list-chevrons-up-down` / ‚Nur erfasste Tage‘ `fold-vertical`, Vortag/Folgetag `chevron-left` /
  `chevron-right`, Smileys zurücksetzen `rotate-ccw`.
- **Emojis als Inhalt:** Wetter ☀️ 🌤 🌦 🌧 ☁️ ⛈ ❄️ · Reisemittel 🚗 🚆 🚲 ✈️ 🚙 🚢 🚐 🚶 · 📍 vor Maps-Links (8) · ▫️ vor mehreren
  Punkten im Verlauf · ⊘ am Zeilenanfang = ohne Maps-Link · Spaltenköpfe 🙂☹️😉 (Wie war was?), 🍽️🍷☕️ (Essen und Trinken),
  😴💤 (Quartier).

## 3. Reisen

- Es wird immer an einer Reise gearbeitet; eine neue Reise wird bewusst neu angelegt (plus in der Seitenleiste). Frühere Reisen
  bleiben gespeichert und können jederzeit wieder geöffnet und geändert werden.
- **Startreise:** Beim Start öffnet die App (iPad-Aufbau; im iPhone-Aufbau erst die Startliste ohne blauen Eintrag, R-7.2) das
  zuletzt verwendete Reiselogbuch dieses Geräts – auch während einer laufenden Reise; Backup laden und Abgleichen übernehmen den
  Wert des anderen Geräts nicht. Gibt es keines (alte Daten, gelöscht), die Reise, in deren Zeitraum heute fällt; sonst die
  zuletzt beendete; sonst die nächste geplante.
- Gibt es noch kein Reiselogbuch (erster Start oder letztes gelöscht), öffnet sich ‚Neues Reiselogbuch‘ einmal von selbst; mit x
  bleibt die leere Seite mit dem leeren Zustand (2). Das Häkchen öffnet das neue Reiselogbuch.
- **Fenster ‚Neues Reiselogbuch‘ / ‚Reiselogbuch einstellen‘** – Kästen: Reisetitel · Reiseteilnehmer · Reisezeitraum (grau ‚Von‘ Datum ·
  ‚Bis‘ Datum in einer Zeile; ‚Von‘ und ‚Bis‘ bleiben je mit ihrem Datum zusammen, auf dem iPhone steht ‚Bis‘ unter ‚Von‘) ·
  Reisemittel · Konfiguration Tabellenspalten · Schalter ‚Quartierliste in der Ausgabe‘ (beim Anlegen wählbar, nachträglich
  änderbar).
  - Liegt das Bis-Datum vor dem Von-Datum, wird es auf das Von-Datum gesetzt – und umgekehrt.
  - Reisemittel per Antippen, Mehrfachauswahl, gewählte eingeschaltet (R-5.4), in dieser Reihenfolge:
    🚗 PKW · 🚆 Zug · 🚲 Fahrrad · ✈️ Flugzeug · 🚙 Leihwagen · 🚢 Schiff · 🚐 Wohnmobil · 🚶 Fuß; ausgegeben mit Symbol und Namen.
  - **Konfiguration Tabellenspalten:** Hinweis ‚Die Spalten ‚Tag‘ und ‚Verlauf‘ werden immer angezeigt.‘; Schalter in
    Tabellenreihenfolge ‚Spalte 🙂☹️😉 ‚Wie war was?‘‘, ‚Spalte 🚶🏽‍♂️km ‚Gegangene Kilometer‘‘, ‚Spalte 🍽️🍷☕️ ‚Essen
    und Trinken‘‘, ‚Spalte 😴💤 ‚Quartier‘‘, beim Anlegen alle außer ‚Gegangene Kilometer‘ eingeschaltet (bestehende Reiselogbücher: Wie
    war was? und Quartier ein, Essen wie bisher, Gegangene Kilometer aus); Hinweis ‚Ausgeblendete Spalten
    fehlen in Tabelle, Tageserfassung und Ausgabe. Vorhandene Einträge bleiben erhalten.‘ Ausgeblendete Spalten fehlen auch in der
    Suche, die Schritte der Tageserfassung werden neu nummeriert. Quartier aus: ‚Quartierliste in der Ausgabe‘ ausgegraut, keine
    Quartierliste in App und Ausgabe, Statistik ohne Anzahl der Quartiere, Quartierkosten und Ø je Nacht; ohne Preisfeld. Gegangene
    Kilometer aus: ohne Schritt, Spalte und Statistikzeilen. Wie war was? aus: die Statistik zählt nur die Smileys des
    Fazits.
  - **Pflicht** sind Reisetitel, Reiseteilnehmer, Reisezeitraum und mindestens ein Reisemittel (nicht gekennzeichnet, R-5.3).
    Meldungen: ‚Bitte einen Reisetitel eingeben.‘ und ‚Bitte Reiseteilnehmer eingeben.‘ (wenn das Feld leer verlassen oder
    geleert wird) · ‚Bitte Beginn und Ende der Reise wählen.‘ bzw. ‚Wähle einen Zeitraum, der sich nicht mit ‚…‘ (… - …)
    überschneidet.‘ (sobald ein Datum geändert oder ein Titel eingegeben wurde – das vorgeschlagene Datum kann sich mit einer
    anderen Reise überschneiden; Reisezeiträume dürfen sich nicht überschneiden, gespeichert wird erst nach der Korrektur) ·
    ‚Bitte mindestens ein Reisemittel wählen.‘ (wenn das letzte gewählte abgewählt wird).
- Die geöffnete Reise wird über Mehr-Menü → ‚Reiselogbuch einstellen‘ bearbeitet und über Mehr-Menü → ‚Reiselogbuch löschen‘ ohne Abfrage nach
  ‚Zuletzt gelöscht‘ verschoben (R-7.10, 30 Tage); danach öffnet die Startreise (iPhone: die Startliste). In ‚Zuletzt gelöscht‘ fragt nur ‚Endgültig
  löschen‘: Sprechblase ‚‚…‘ mit allen 42 Einträgen endgültig löschen? Das kann nicht rückgängig gemacht werden.‘ – ‚mit 1 Eintrag‘, ohne Einträge
  ‚‚…‘ ohne Einträge endgültig löschen? …‘; Schaltflächen ‚Endgültig löschen‘ (rot) · ‚Abbrechen‘ (RLB-126).
- **Zuletzt gelöscht (RLB-126, AD-Bean `recentlydeleted`, R-7.10):** letzte Kachel der Liste mit Papierkorb und Anzahl, nur wenn nicht leer; sie öffnet
  die Liste ‚Zuletzt gelöscht‘ (Kopf ‹, Anzahl, Hinweis ‚Gelöschte Reiselogbücher bleiben hier 30 Tage. Danach werden sie endgültig gelöscht.‘, zuletzt
  gelöschte oben, je Kachel Zeitraum und ‚Gelöscht am … · noch N Tage‘). Antippen zeigt die Vorschau nur zum Lesen mit dem Hinweis ‚Dieses
  Reiselogbuch ist gelöscht. Gelöscht am … – wird in N Tagen endgültig gelöscht.‘ und ‚Wiederherstellen‘ (iPad: das zuletzt gelöschte gleich offen).
  Langes Drücken und Wischen: ‚Wiederherstellen‘ · ‚Endgültig löschen‘ (Kapseln ‚Wiederherstellen‘ · ‚Löschen‘). Nach 30 Kalendertagen endgültig
  gelöscht; Abgleich und Backup nehmen ‚Zuletzt gelöscht‘ mit Löschdatum mit.
- **Reiselogbuch sperren (RLB-125):** Mehr-Menü bzw. Kontextmenü und Wischen ‚Reiselogbuch sperren‘ (`lock`) sperrt sofort, ‚Entsperren‘ (`lock-open`)
  entsperrt sofort; beides zählt als Änderung. Gesperrt: auf der Kachel `lock` klein vor dem Titel; geöffnet statt der Tabelle bzw. der Kästen nur die
  Vorschau als Seite (kein Fenster), oben ‚PDF‘ und Teilen (blau gefüllt), kein Mehr, darüber der Hinweis ‚Dieses Reiselogbuch ist gesperrt. Es lässt sich
  lesen und ausgeben, aber nicht ändern oder löschen.‘ mit ‚Entsperren‘; sie bleibt nach jeder Ausgabe. Kontextmenü und Wischen zeigen gesperrt nur
  ‚Entsperren‘. Ein gesperrtes Reiselogbuch wird nicht gelöscht, auch nicht beim Abgleich (AppDesign 15.18 Fälle 21–23); ‚Ersetzen‘ nennt die gesperrten.

## 4. iPad: Seitenleiste und Hauptansicht

- **Seitenleiste ‚Reiselogbücher‘** (Komponente Seitenleiste): darunter klein und grau die Anzahl; Kapsel [plus | ellipsis]; Reiselogbücher als Kacheln, zuletzt beginnende Reise zuerst, vor dem ersten jedes Jahres das Jahr des Reisebeginns als Kopf (auch ganz oben, bei der Suche nur Jahre mit Treffern; R-7.6); je Kachel Titel · ‚TT.MM.JJJJ - TT.MM.JJJJ · läuft
  gerade / beendet / geplant‘ und ›, dazu ‚geändert am … · Gerät‘. Fest unten die Backup-Kachel, solange heute noch kein Backup erstellt wurde (11). Beim Start eingeblendet mit
  der Startreise (3).
  - plus öffnet ‚Neues Reiselogbuch‘. ellipsis: ‚Suchen‘ (nur mit Reiselogbüchern; Suche in allen, 6) · Strich · Backup erstellen ·
    Backup laden · Strich · ‚Darstellung ›‘ · Abstand · Messung starten · Strich · Versionszeile ‚Reiselogbuch · Version X.Y.Z · erstellt am TT.MM.JJJJ um hh:mm · AppDesign X.Y.Z‘ · Satz zum Speicher.
  - Langes Drücken auf ein Reiselogbuch: ‚Reiselogbuch einstellen‘ · ‚Reiselogbuch sperren‘ · ‚Reiselogbuch löschen‘ (rot, ohne Abfrage nach ‚Zuletzt gelöscht‘); gesperrt nur
    ‚Reiselogbuch entsperren‘ (R-4.10).
  - Wischen nach links auf ein Reiselogbuch (R-7.8): daneben die Kapseln ‚Einstellen‘ (settings), ‚Sperren‘ (lock) und ‚Löschen‘ (gesperrt nur ‚Entsperren‘)
    (trash, rot, ganz außen) – dieselben Aktionen wie beim langen Drücken; ‚Löschen‘ verschiebt ohne Abfrage
    nach ‚Zuletzt gelöscht‘, über die Kapseln hinaus wird nichts ausgelöst (wie Notizen). Tippen auf die Kachel oder daneben in der Liste schließt sie, ohne etwas auszulösen; plus, ellipsis und panel-left
    wirken sofort und schließen sie dabei.
- **Kopfzeile:** Titel der Reise; Kapsel [share | ellipsis].
  - share → Teilen-Menü: Vorschau · HTML · ‚PDF (mit iOS 27 zurzeit nicht möglich)‘ (RLB-124/W-1) (jeweils mit grauem Hinweis zum Speichern), Strich, darunter ‚N erfasste Tage ·
    Dateiname: …‘.
  - ellipsis → Mehr-Menü: ‚Suchen‘ (Suchzeile, 6) · Strich · ‚Alle Tage‘ / ‚Nur erfasste Tage‘ (Filter, G-16) ·
    ‚Reiselogbuch einstellen‘ · ‚Reiselogbuch sperren‘ · ‚Reiselogbuch löschen‘ (rot, ohne Abfrage nach ‚Zuletzt gelöscht‘).
- **Darunter** (ohne Überschrift – der Titel steht in der Kopfzeile): Reiseteilnehmer, Reisezeitraum, Reisemittel und die dezente
  Fortschrittsanzeige ‚Tag 42 von 80 · 38 erfasst‘.
- **Tagestabelle:** eine Zeile je Tag im Zeitraum (‚Mo, 24.08.‘): Tag · Verlauf · sichtbare konfigurierte Spalten; Tabellenkopf
  haftet unter der Kopfzeile. Vergangene Tage ohne Eintrag tragen ‚fehlt‘ (Farbe `--warn`). **Startposition** (R-7.4, R-6.1): beim
  Öffnen steht der erste nicht erfasste Tag bis heute (die erste Lücke, auch wenn spätere Tage schon erfasst sind) gelb markiert
  direkt unter dem Tabellenkopf; läuft die Reise und ist bis heute alles erfasst, steht der heutige Tag dort, ohne
  Gelb; sonst (Reise in der Zukunft, vergangen und vollständig) beginnt die Tabelle ganz oben ohne Markierung. Ein Tag gilt als
  **erfasst**, wenn Wetter, Verlauf oder eine sichtbare Spalte außer Essen und Gegangene Kilometer (Wie war was?, Quartier) ausgefüllt
  ist. Die Spalte ‚🚶🏽‍♂️km‘ zeigt nur die Zahl. Mehrere
  Verlauf-Zeilen bekommen ▫️ davor; führende Smileys stehen vorne, der Text rückt daneben ein (hängender Einzug, R-6.3).
- Darunter Fazit (Kasten passt sich in der Breite dem Inhalt an), Gesamtausgaben, Quartierliste (immer, sofern die Spalte Quartier
  sichtbar ist) und Statistik (9). Unten rechts ‚Nach oben / Ans Ende‘, bei langem Reiselogbuch der Schnellroll-Griff (R-3.2); seine
  Blase zeigt den Tag oben im Bild als ‚Tag 19 · Fr 20.03.‘ (Nummer im Reisezeitraum), danach ‚Fazit‘ (mit Gesamtausgaben),
  ‚Quartierliste‘, ‚Statistik‘ (`data-marke`).
- **iPad hoch und quer:** die ausgeblendete Seitenleiste kommt auch durch Wischen nach rechts im Reiselogbuch (R-7.5); nach links
  wischen blendet sie nie aus, auf einer Kachel zeigt es die Wischaktionen (R-7.8).

## 5. iPhone

Im iPhone-Aufbau (iPhone hoch und quer, auch sehr schmale Fenster) eine Seite nach der anderen statt Seitenleiste, Bedienung sonst
wie am iPad (R-1.1):

- **Start** in der Startliste (R-7.2); ein Reiselogbuch öffnet an seiner Startposition (4). Die Startreise (3) bleibt gewählt und
  erscheint, wenn das Fenster in den iPad-Aufbau wechselt.
- **Startliste = Seitenleiste** (AppDesign 15.17; R-2.2, R-7.1, R-9.1): ‚Reiselogbücher‘ mit der Kapsel [plus | ellipsis] und denselben
  Menüs wie am iPad (4), die Kacheln wie am iPad, gruppiert nach dem Jahr des Reisebeginns. Langes Drücken: ‚Reiselogbuch einstellen‘ ·
  ‚Reiselogbuch löschen‘; nach dem Löschen geht es zur Startliste. Wischen nach links: dieselben Aktionen als Kapseln ‚Einstellen‘ ·
  ‚Löschen‘ wie am iPad (4). Leertexte: 2.
- **Reiselogbuch:** Kopf mit rundem `chevron-left` zur Startliste und Kapsel [share | ellipsis] mit denselben Menüs; der
  Reisetitel steht in der Mitte der Leiste. Darunter ‚Reiseteilnehmer:‘, ‚Reisezeitraum:‘, ‚Reisemittel:‘ – der Wert jeweils in der
  nächsten Zeile, die Reisemittel in einer Zeile, bei Bedarf seitlich wischen (Verlauf und kleiner Pfeil am Rand, R-5.4); dann die Fortschrittsanzeige.
- **Tage als Kästen:** Kopf ‚Mo, 24.08.‘ mit ‚heute‘/‚fehlt‘ und Wetter rechts (leer: blasse Platzhalter); Felder ‚Verlauf‘ (als
  Wort), dann die Spalten-Emojis 🙂☹️😉 · 🚶🏽‍♂️ km · 🍽️🍷☕️ · 😴💤 – nur sichtbare Spalten und nur mit Inhalt; Kasten mit Feldern
  (R-6.1, R-6.5). Startposition wie am iPad (4), direkt unter der Leiste.
- Darunter Fazit (volle Breite), Gesamtausgaben, Quartierliste als Liste (Quartier mit Maps-Link, darunter ‚24.08. - 25.08.2026 ·
  1 Nacht · 120,00 €‘, der Preis nur, wenn eingetragen), Statistik. ‚Nach oben / Ans Ende‘ und Schnellroll-Griff wie am iPad (nicht in der Startliste).
- **Seitenwechsel:** ein Reiselogbuch schiebt sich über die Startliste; zurück mit `chevron-left` oder Wischen nach rechts von überall
  im Reiselogbuch (R-7.5) – die Zeile ‚Reisemittel‘ behält ihr seitliches Wischen.
- **Fenster als Blatt** (R-4.6): Tageserfassung, Reiselogbuch einstellen, Neues Reiselogbuch, Fazit und Vorschau.
- **Tageserfassung** als Blatt, Titel kurz ‚Di, 25.08.2026‘ mit ‚Automatisch gespeichert um …‘ (7); Wetter-Symbole nach Abweichung 2.

## 6. Suche

- **Im Reiselogbuch** (R-2.3): durchsucht Verlauf und sichtbare Spalten (Essen: Name und Kommentar; Quartier: Name und Ort, ohne
  Ort nur der Name), nur innerhalb der aktuellen Reise; es bleiben nur Tage mit Treffern. **Ein Eintrag** im Sinne der Suche mit
  mehreren Wörtern ist das ganze Reiselogbuch: jedes Wort muss irgendwo darin stehen; gezeigt werden die Tage mit mindestens einem
  Wort (Entscheidung des Nutzers 18.10.2026). Die Suche markiert auch Teile langer Wörter. **Ohne Akzente** wie Apple:
  ‚Zurich‘ findet ‚Zürich‘, ‚cafe‘ findet ‚Café‘ – in beiden Suchen.
- **Öffnen und beenden**: ‚Suchen‘ als erster Punkt im Mehr-Menü (Reiselogbuch bzw. Seitenleiste und
  Startliste) oder ⌘F mit Hardware-Tastatur – im offenen Reiselogbuch, ohne offenes (iPhone-Startliste) in allen; beendet mit dem
  runden x ‚Suche beenden‘ rechts in der Suchzeile.
- **Über alle Reiselogbücher** (‚Suchen‘ im Mehr-Menü der Seitenleiste bzw. Startliste, Platzhalter ‚In allen suchen‘): Kacheln zeigen ‚12
  Treffer‘ (gleich gezählt wie ‚1 von 12‘ im Reiselogbuch, nur sichtbare Spalten), unter der Überschrift ‚2 von 5
  Reiselogbüchern‘, sonst der leere Zustand ‚Keine Treffer für ‚Begriff‘‘; Antippen öffnet das Reiselogbuch mit gefüllter Suche.

## 7. Tageserfassung

- Tag antippen → Erfassungsfenster (Designrichtlinie allgemein 7, R-5.10; iPhone 5): Titel Wochentag mit vollem Datum (‚Sonntag,
  04.10.2026‘), die Kapsel blättert zum Vortag bzw. Folgetag.
- Schritte je nach sichtbaren Spalten (2 bis 5, fortlaufend nummeriert); die Eingabefelder bleiben schlicht (ohne
  Aufzählungszeichen), formatiert wird in Tabelle und Ausgabe:
  1. **Wetter:** Symbole antippen, auch mehrere; gewählte eingeschaltet (R-5.4).
  2. **Verlauf:** eine Zeile pro Punkt; mehrere Zeilen bekommen in Tabelle und Ausgabe ▫️ davor. Die Vorschläge stehen als Chips wieder
     **über** dem Feld, unter der Überschrift ‚2 Verlauf‘: ‚Weiterfahrt nach …‘, ‚Rundgang durch …‘, ‚Besichtigung …‘,
     ‚Freetour …‘, ‚Tour …‘, ‚Sonstiges …‘ – ‚…‘ ist nur Platzhalter. Ein angetippter Vorschlag kommt als neue Zeile **nach der letzten Zeile**,
     auch wenn der Cursor woanders steht. Danach steht der Cursor am Ende, die Tastatur ist offen und auf Kleinbuchstaben. ‚Sonstiges …‘ fügt
     am Ende eine leere Zeile an und setzt den Cursor hinein. Ist die letzte Zeile schon leer, kommt keine zweite dazu. Das Feld ist leer
     einzeilig und wächst mit jeder Zeile (AppDesign APD-126/W-1); es rollt nur so weit wie nötig über die Tastatur (R-4.5).
  3. **Wie war was?:** Smiley + kurzer Text, mehrere Smiley-Zeilen möglich, alle Smileys der Emoji-Tastatur; Smiley-Leiste.
  - **Gegangene Kilometer** (nur mit sichtbarer Spalte, als eigener Schritt nach ‚Wie war was?‘, die folgenden
     Schritte eine Nummer weiter): schmales Zahlenfeld (AppDesign APD-93) mit ‚km‘ rechts daneben, mit einer
     Nachkommastelle 0,1–99,9 (Komma-Tastatur, Punkt wird Komma, beim Verlassen ‚6‘ → ‚6,0‘), bündig rechts, mit Fokus rückt die Zahl
     für das ⓧ nach links. Zählt nicht als ‚erfasst‘.
  4. **Essen und Trinken** (nur mit sichtbarer Spalte): eine Zeile pro Lokal im Format ‚Smiley(s) Name – Kommentar‘, z. B.
     ‚🕛😋 Hard Rock Café – Steak war super‘; eigene Smiley-Leiste mit eigener Häufigkeit, Standard 🕗 🕙 🕛 🕒 🕕 😋 👌 👍 😕 🤮 👎
     ⭐️ 🍕 🍔 🥩 🍷 🍺 ☕️; Options-Kapsel ‚keinen Google-Maps Link‘ rechts im Schrittkopf (8). Essen wird gesucht, zählt nicht als
     ‚erfasst‘ und nicht in der Statistik; keine Restaurantliste.
  5. **Quartier:** Name; Options-Kapseln ‚Quartier wie Vortag‘ (nicht am ersten Tag; nur wenn gesetzt, wird das Quartier vom
     Vortag übernommen, sonst bleibt das Feld leer) und ‚keinen Google-Maps Link‘ (wird bei ‚Quartier wie Vortag‘ mit übernommen);
     Felder Name und ‚Ort für Google Maps, z. B. Cairns, Australien‘ **nebeneinander in einer Zeile (halb und halb)**, bei schmalem
     Bildschirm untereinander; darunter der Link ‚📍 In Google Maps prüfen‘ (nicht unterstrichen). Darunter
     ‚Preis‘ – Gesamtpreis des Aufenthalts in Euro, Betragsfeld wie Gesamtausgaben (R-5.1, € rechts daneben); nicht bei ‚Quartier
     wie Vortag‘ (der Preis gilt für den Aufenthalt ab dem Tag, an dem das Quartier eingetragen ist); nur mit
     dem Schalter ‚Preis der Quartiere erfassen‘ im Fenster ‚Reiselogbuch einstellen‘ (nach ‚Quartierliste in der Ausgabe‘, Voreinstellung aus, ohne
     Spalte Quartier gesperrt). Mit Preis steht er am Tag des Eintrags in Klammern hinter dem Quartier – ‚Hotel Adlon, Cairns
     (1.240,00 €)‘ – in Tabelle, Kachel und Ausgabe; die Klammer bricht nie um.
- **Smiley-Leisten** bei ‚Wie war was?‘, ‚Essen und Trinken‘ und im Fazit (Designrichtlinie allgemein 8, G-9, R-3.5); ‚Wie war was?‘
  und Fazit teilen die Häufigkeit. Mehrere Smileys pro Zeile stehen in Tabelle und Ausgabe zusammen vorne.
- Diktieren und Großbuchstaben nach R-5.2 (Hinweis zum Diktieren unten im Fenster; groß auch nach einem Smiley).

## 8. Quartier und Maps-Links

- Quartiersname und Lokale werden automatisch zu Google-Maps-Links. **📍 ist nur Zeichen, verlinkt ist nur der Name:** er endet an
  ‚ – ‘, Komma, Doppelpunkt oder öffnender Klammer (‚Krone, sehr gut‘, ‚Krone: Schnitzel‘, ‚Krone (Terrasse)‘, ‚Hotel X (Zimmer
  12)‘ → Link ‚Hotel X‘), nicht vor einer Ziffer (‚8:30‘, ‚4,50 €‘) und nicht an einem Bindestrich ohne Leerzeichen oder einem Punkt;
  ab dort normaler Text. Gesucht wird mit dem ganzen Eintrag plus Ort.
- Der optionale Ort steht nach einem Komma hinter dem Namen (‚📍Prize by Radisson, Wien‘) – überall (Tagestabelle, Quartierliste,
  App und Ausgabe); Teile des Ortes, die schon im Namen stehen, entfallen.
- Smileys und 📍 bilden gemeinsam die linke Spalte; bei einem Umbruch beginnt die Folgezeile genau unter dem Namen.
- ‚keinen Google-Maps Link‘ zeigt den Zustand der Zeile mit dem Cursor und setzt bzw. entfernt dort ‚⊘‘ am Zeilenanfang; diese Zeile
  erscheint ohne 📍 und ohne Link.
- Links der Lokale: Abweichung 1. Maps-Links öffnen extern, die Vorschau bleibt offen; sie funktionieren in HTML und PDF.

## 9. Abschluss: Fazit, Gesamtausgaben, Quartierliste, Statistik

- **Fazit:** Antippen öffnet ein eigenes Fenster wie ‚Wie war was?‘ (Smiley-Leiste mit gemeinsamer Häufigkeit, automatisches
  Speichern nach R-5.10); Darstellung in App und Ausgabe mit hängendem Einzug.
- **Gesamtausgaben:** ein Betragsfeld in Euro (R-5.1, R-5.5, Designrichtlinie allgemein 8), Anzeige z. B. ‚4.850,00 €‘.
- **Quartierliste:** Quartier (mit Maps-Link), Zeitraum, Anzahl Nächte, Preis (‚1.240,00 €‘, ohne Preis leer; nur mit ‚Preis der Quartiere erfassen‘); kompakt;
  in der App immer, in der Ausgabe nur mit ‚Quartierliste in der Ausgabe‘.
- **Statistik** (schlichte Liste): Reisetage gesamt und davon erfasst, ‚Gegangene Kilometer‘ (Summe mit einer
  Nachkommastelle, dahinter der Ø je Tag in Klammern – ‚35,5 km     (Ø 8,9 km)‘, 5 geschützte Leerzeichen davor,
  1 nach ‚Ø‘; passt der Ø nicht in die Zeile, steht er ganz linksbündig unter dem Gesamtwert, selbst in einer Zeile; nur Tage mit Kilometern, nur mit sichtbarer Spalte und Werten), Anzahl der Quartiere, darunter Anzahl der Nächte (Summe),
  ‚Quartierkosten‘ (Summe der Preise, dahinter der Ø je Nacht in Klammern wie bei den Kilometern – nur Nächte von Aufenthalten mit Preis;
  nur mit ‚Preis der Quartiere erfassen‘ und Preisen), darunter ‚Teuerste Quartiere‘ und ‚Günstigste Quartiere‘ – je
  höchstens 3 Aufenthalte als ‚Name (Preis je Nacht)‘ mit ‚·‘, Preis je Nacht = Preis ÷ Nächte des Aufenthalts, jeder Aufenthalt für sich; ab
  2 Aufenthalten mit Preis; kein Aufenthalt in beiden Zeilen (die teurere Hälfte oben, bei ungerader Zahl der mittlere oben); gleicher Preis: der
  frühere zuerst; oben der teuerste, unten der günstigste zuerst; ein Eintrag bleibt am Stück, wenn er in die Zeile passt, der Preis in Klammern
  bleibt immer ganz (AppDesign R-10.5),
  Wetter-Verteilung (z. B. ‚40×🌤 · 12×☀️ · 5×🌧‘), Smileys aus Tagen und Fazit absteigend nach Anzahl (z. B. ‚5×😊 · 3×😉 · 2×☹️‘;
  Varianten wie ☹️/☹ zählen gemeinsam, Anzahl vor dem Symbol ohne Leerzeichen;
  **Wetter und Smileys als Aufzählung nach R-10.5 – umgebrochen wird nur nach dem ‚·‘, App und Ausgabe**).

## 10. Ausgabe

- Teilen-Menü in der Kopfzeile (4); jederzeit möglich, auch mitten in der Reise (Zwischenstand). Vorschau, HTML und PDF nach R-6.4
  und Designrichtlinie allgemein 10 (Mustertabelle, Dateinamen, ehrliche Meldung, Backup-Erinnerung danach); die Vorschau zeigt die
  Nummer der nächsten Datei.
- **Inhalt:** Überschrift ‚Reiselogbuch – <Titel>‘, Reisedaten, Tagestabelle (nur erfasste Tage, ohne Wetter-Platzhalter; Wetter in
  der Spalte ‚Tag‘ unter dem Datum; feste Spaltenanteile – Abweichung 3; ‚🚶🏽‍♂️km‘ schmal mit nur der Zahl), danach Fazit · Gesamtausgaben · Quartierliste (falls
  aktiviert) · Statistik. Hängender Einzug bei Aufzählungen und
  Smiley-Zeilen.
- **Dateinamen:** ‚Reiselogbuch <Titel> JJJJ.MM.TT-JJJJ.MM.TT V001‘ (ein gemeinsamer Zähler pro Reise für HTML und PDF, im Backup
  enthalten), z. B. ‚Reiselogbuch Australien 2026.08.24-2026.11.11 V003.pdf‘.
- PDF über das Drucken-Menü von Safari (dort Teilen → ‚In Dateien sichern‘); nur das Reiselogbuch, ohne Seitenleiste; Hochformat
  (Safari ignoriert die Querformat-Vorgabe).

## 11. Backup, Abgleich, Offline, Messung

- **Backup** (R-9.1, R-9.2, AppDesign 15.19): Datei mit allen Reisen, Name ‚Ω Backup Reiselogbuch JJJJ.MM.TT hh.mm.json‘. Kein
  automatisches Backup bei der Ausgabe; danach erscheint die Erinnerung ‚Denk daran, auch ein Backup zu erstellen.‘ mit ‚Letztes Backup
  erstellt am …‘ und der blauen Schaltfläche ‚Backup erstellen‘.
- **Abgleich zwischen iPad und iPhone** (R-9.2 bis R-9.4, Fall-Tabelle Designrichtlinie allgemein 15.18): ‚Backup laden‘ fragt mit den
  Kacheln Abgleichen und Ersetzen. Einträge = Reiselogbücher, Unterdaten = Tage (Wetter, Verlauf, Wie war was?, Essen, Quartier …),
  Kopfdaten = Titel, Teilnehmer, Zeitraum, Reisemittel, Spalten, Fazit, Gesamtausgaben; Zähler ohne Zeitpunkt = Dateinummer für
  PDF/HTML. Der Abgleichbericht zeigt die Reisemittel mit Symbol und Namen wie in der App; Feldnamen: Designrichtlinie Reiselogbuch 2.
- **Offline** (R-1.5, AppDesign 15.20).
- **Messung** (R-1.6): ‚Messung starten‘ im Mehr-Menü der Seitenleiste bzw. Startliste.
