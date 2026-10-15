# Reiselogbuch – Prompt (Stand 15.10.2026, Version 3.15.0)

Reiselogbuch 3.15.0 · AppDesign 4.16.0 (Designrichtlinie allgemein 4.16.0) · Designrichtlinie Reiselogbuch 3.15.0 · Zusammenarbeit allgemein 2.4.0
(Gestaltungsregeln: Designrichtlinie allgemein im Design-Repo AppDesign und
`README - Designrichtlinie Reiselogbuch.md`; Zusammenarbeit: in AppDesign; Einstieg für Claude:
`CLAUDE.md`. Gemeinsame Bausteine `design.css`/`ui.js` kommen aus AppDesign v4. Bei jeder
Design-Änderung mit aktualisieren.)

```text
Baue mir ein einfaches Reiselogbuch als Web-App für das iPad.

ZIEL
Ein Tagebuch in Tabellenform, genau wie in meinem Beispiel:

  Reiselogbuch – <Titel>
  Reiseteilnehmer:  Gerhild & Arnold
  Reisezeitraum:    24.08.2026 - 11.11.2026
  Reisemittel:      ✈️ Flugzeug, 🚗 PKW

  | Tag             | Verlauf             | 🙂☹️😉              | 😴💤 (Quartier)            |
  | Mo, 24.08. 🌤   | Anreise nach Wien   | ☹️ Kurzer Kommentar | Prize by Radisson, Wien    |

  Fazit
  Gesamtausgaben: 0,00 €

RAHMEN
- Läuft auf iPad und iPhone (abgeglichen über das Backup), nur ich nutze es (kein Login).
- Nur Text, Icons und Smileys – keine Fotos.
- Daten bleiben lokal auf dem Gerät; die App fordert beim Start dauerhaften
  Speicher an, damit Safari die Daten nicht von selbst löscht.
- Auch offline nutzbar. Beim Start fragt die App immer bei GitHub nach
  einer neuen Version (kein 10-Minuten-Zwischenspeicher); ohne Netz läuft
  die gespeicherte Version. Arbeitet die App offline (kein Netz oder Netz hängt länger als 3 s), steht unter der
  Backup-Kachel grau ‚Offline – alles bleibt auf diesem Gerät‘; beim Wechsel und beim Start ohne Netz erscheint kurz
  ‚Du bist offline‘ bzw. ‚Wieder online‘ (seit 3.14.0, AppDesign R-1.5).
- Oberfläche auf Deutsch, schlicht und klar.
- Web-App, die man über Safari zum Home-Bildschirm hinzufügt.
- Bereitstellung über GitHub Pages aus dem Repo "ReiseLogBuch" (Branch
  main, Hauptordner): https://g811141a.github.io/ReiseLogBuch/
  (Repo öffentlich, die Einträge bleiben trotzdem nur auf dem iPad).
- Darstellung wie Apple: folgt automatisch der Hell/Dunkel-Einstellung des
  iPads (Voreinstellung "Automatisch"). Im Mehr-Menü Untermenü "Darstellung ›"
  (sun-moon) mit Automatisch · Hell · Dunkel zum Übersteuern; wird gemerkt.
- Aufbau wie Apple-Apps:
  - Links die Seitenleiste "Reiselogbücher": Überschrift linksbündig,
    daneben die Kapsel [plus | ellipsis] und rechts die runde Schaltfläche
    panel-left zum Ausblenden; der Kopf bleibt stehen. Darunter alle Reiselogbücher als
    Kacheln (zuletzt beginnende zuerst): Titel fett, darunter grau "TT.MM.JJJJ - TT.MM.JJJJ ·
    läuft gerade/beendet/geplant", rechts ›; das geöffnete ist blau gefüllt. Antippen
    öffnet es. Die Seitenleiste schwebt wie in Safari (runde Ecken, Schatten wie die
    Schaltflächen, Abstand zum Rand, unten nur 4 px). Beim Start ist sie immer
    eingeblendet, die laufende Reise ist geöffnet. Quer steht sie fest links
    (aus-/einblendbar bis zum nächsten Start); im Hochformat wird sie über den Inhalt gelegt und schließt sich
    nach der Auswahl. Ist sie ausgeblendet, steht panel-left links in der
    Kopfzeile.
  - plus öffnet "Neues Reiselogbuch". ellipsis der Seitenleiste: Backup
    erstellen (darunter grau "Letztes Backup erstellt am …") · Backup laden ·
    durchgehender Strich · darunter ohne Leerzeilen grau "Reiselogbuch · Version
    X.Y.Z · erstellt am TT.MM.JJJJ um hh:mm" und "Die Daten bleiben in Safari
    gespeichert, solange das Reiselogbuch auf dem Home-Bildschirm nicht entfernt
    wird." (bzw. "Safari kann die Daten bei Speichermangel löschen – bitte
    regelmäßig ein Backup erstellen.")
  - Langes Drücken auf ein Reiselogbuch in der Seitenleiste öffnet ein Menü:
    Einstellungen · Reiselogbuch löschen (rot, mit Abfrage) – ohne "Öffnen",
    weil kurzes Tippen öffnet.
  - Wurde heute noch kein Backup erstellt, steht unten in der Seitenleiste fest
    eine gelbe Kachel "Letztes Backup erstellt am …" (bzw. "Noch kein Backup erstellt.")
    mit blauem Knopf "Backup erstellen".
  - Kopfzeile des Inhalts (bleibt beim Scrollen stehen, keine Glas-Leiste):
    Titel der Reise in der Mitte, rechts die Kapsel [share | search |
    ellipsis]. share öffnet das Teilen-Menü (Vorschau · HTML · PDF), search
    blendet darunter eine zweite Zeile mit dem Suchfeld über die volle
    Breite ein, ellipsis öffnet das Mehr-Menü: "Alle Tage" (list-chevrons-up-down) /
    "Nur erfasste Tage" (fold-vertical) – Häkchen vorne, dann Icon und Text ·
    "Einstellungen" · "Darstellung ›" · "Reiselogbuch löschen" (rot).
  - iPhone (hoch und quer, auch sehr schmale Fenster; AppDesign html.phone) – eine Seite
    nach der anderen statt Seitenleiste, Bedienung sonst wie am iPad:
    - Start (seit 3.15.0, R-7.2): jedes Neuladen beginnt in der Startliste "Reiselogbücher",
      ganz oben, kein Eintrag blau; ein Reiselogbuch öffnet beim ersten offenen Tag. Gilt im
      iPhone-Aufbau, also auch für ein iPad im schmalen Fenster.
      Im Reiselogbuch oben links runder chevron-left zur Startliste, rechts die Kapsel
      [share | search | ellipsis] mit denselben Menüs und derselben Suche wie auf dem iPad
      (Suchzeile darunter mit "1 von 4", ⓧ und ⌃ ⌄).
    - Großer Titel (Reisetitel), darunter grau "Teilnehmer · Zeitraum", die
      Reisemittel und die Fortschrittsanzeige; beim Hochschieben steht der Titel klein
      in der Leiste (wie Notizen). Die Tage stehen als Kästen untereinander: Kopf
      "Mo, 24.08." mit "heute"/"fehlt" und dem Wetter rechts, darunter die Felder
      "Verlauf" (als Wort, normale Schrift) und 🙂☹️😉 · 🍽️🍷☕️ · 😴💤 (nur sichtbare
      Spalten mit Inhalt), getrennt durch Linien (waagrecht zwischen den Feldern,
      senkrecht zwischen Bezeichnung und Inhalt; "Verlauf" halbfett). Erster offener Tag gelb
      (ohne blauen Rand – auch in der iPad-Tabelle).
      Antippen öffnet die Tageserfassung (bildschirmfüllend, Titel kurz
      "Di, 25.08.2026", Wetter-Symbole 40 px). Darunter Fazit, Gesamtausgaben,
      Quartierliste als Liste und Statistik. Die Vorschau zeigt die Seite in voller
      Breite (seitlich wischen).
    - Startliste "Reiselogbücher": oben die Kapsel [plus | ellipsis] wie am iPad, großer
      Titel, darunter "3 Reiselogbücher"; jedes Reiselogbuch als eigene Kachel, das
      zuletzt geöffnete blau (seit 3.3.0 wie die Seitenleiste am iPad: fest stehende Leiste
      mit "Reiselogbücher" links und [plus | ellipsis], ohne großen Titel und Anzahl); der Backup-Hinweis steht fest unten als gelbe Kachel mit
      blauem Knopf (die Kacheln laufen dahinter durch); langes Drücken: Einstellungen ·
      Reiselogbuch löschen. Nach dem Löschen eines Reiselogbuchs geht es zur Startliste.
  - Seit 3.4.0: Der Titel des Reiselogbuchs steht auf iPad und iPhone in der Leiste; die
    Überschrift "Reiselogbuch – <Titel>" gibt es nur noch in der Ausgabe. Auf dem iPhone stehen
    darunter "Reiseteilnehmer:", "Reisezeitraum:", "Reisemittel:" (Wert jeweils in der nächsten
    Zeile, Reisemittel in einer Zeile zum Wischen). Unter "Reiselogbücher" (Seitenleiste und
    Startliste) klein und grau die Anzahl. Die Backup-Kachel steht immer unten – gelb mit blauem
    Knopf, solange heute noch kein Backup erstellt wurde, sonst weiß. Nach einem Vorschlag im
    Verlauf beginnt das nächste Wort groß.
  - Seit 3.5.0: Leisten bewegen sich nie – die Seite federt beim Wischen nicht nach, die Leiste
    der iPhone-Startliste steht fest. Die Vorschau zeigt auf iPad und iPhone die Seite in voller
    Breite; ist das Fenster schmaler (iPad hoch, iPhone), wischt man seitlich.
  - Seit 3.6.0: Auch am iPad steht die Kopfzeile fest; in der Seitenleiste scrollen nur die
    Kacheln, Kopf und Backup-Kachel bewegen sich nie. Es gilt der Regelkatalog der
    Designrichtlinie allgemein (seit 3.11.5 nach Themen: R-1.1 bis R-10.4); die Prüfskripte prüfen ihn bei jeder Version.
  - Seit 3.7.0: Die Startliste am iPhone ist dieselbe Seitenleiste wie am iPad, als ganze Seite
    (ein Baustein, R-1.1); die Kacheln laufen auf beiden Geräten hinter der Backup-Kachel durch.
    Zu lange Wörter brechen in Zellen, Kästen und Kacheln im Wort um (R-6.3); die Suche markiert
    auch Teile solcher Wörter.
  - Seit 3.8.0: Reihen von Smileys ohne Leerzeichen brechen um – höchstens drei Smileys am
    Zeilenanfang werden zum Zeichen, eine längere Reihe ist Text. Die Seitenleiste behält ihre
    Position, der gewählte Eintrag bleibt sichtbar. iPhone: Wischen bei offener Suche schließt die Tastatur.
  - Seit 3.8.1: Eine Symbolleiste – mit oder ohne Suchzeile – bewegt sich beim Wischen keinen
    Millimeter (R-2.1). Bei offener Tastatur der Suche schließt das erste Wischen nur die Tastatur.
  - Seit 3.9.0: Abgleich zwischen iPad und iPhone (T-03). Jede Änderung bekommt Zeitpunkt und Gerät
    (je Reiselogbuch und je Tag), gelöschte Reiselogbücher werden gemerkt. ‚Backup laden‘ zeigt
    Zeitpunkt und Gerät des Backups und ob es neuer oder älter ist und fragt: Abgleichen (je
    Reiselogbuch und Tag gilt die neuere Fassung, Gelöschtes wird auch hier gelöscht) · Ersetzen ·
    Abbrechen. Das Ergebnis steht im kleinen Fenster. Jede Kachel zeigt ‚geändert am … · Gerät‘.
    Weg: auf dem einen Gerät ‚Backup erstellen‘ → ‚In Dateien sichern‘ → iCloud Drive; auf dem
    anderen ‚Backup laden‘ → die Datei in iCloud Drive wählen → Abgleichen.
  - Seit 3.9.1: Menüs, Sprechblasen und Fenster passen immer ganz auf den Bildschirm (R-4.5).
  - Seit 3.10.0: Menüs und Untermenüs bleiben beim Drehen an ihrer Schaltfläche (R-8.1); iPhone: Kontextmenü einer
    Reise linksbündig unter der Kachel. Abgleich je Feld nach den allgemeinen Regeln R-9.2 bis R-9.4 (Fall-Tabelle:
    Designrichtlinie allgemein 15.18); Backup erstellen und laden nach R-9.1, R-9.2 – die Abfrage zeigt je eine Kachel
    für Abgleichen und Ersetzen. Abgleich und Backup kommen als gemeinsame Bausteine aus AppDesign.
  - Seit 3.10.1: Die Seitenleiste behält beim Drehen ihren Zustand (R-8.1); das Kontextmenü einer Reise ist nie
    abgeschnitten und steht nie über der Backup-Kachel; leere Felder überschreiben beim Abgleich nichts; die Hinweise
    nennen iPad bzw. iPhone beim Namen.
  - Seit 3.11.0: Nach dem Abgleichen ein kleines Fenster ohne Einzelheiten; gibt es etwas zu berichten, öffnet
    ‚Abgleichbericht anzeigen‘ den Bericht als Vorschau wie die Ausgabe (teilbar als HTML): Tabelle der Änderungen
    (Reiselogbuch · Tag · Feld · Neu · Vorher · Vom Gerät · Geändert am), Anzahl unveränderter Reiselogbücher, Tabelle
    ‚Auf diesem … neuer als im Backup – bleibt so‘, Hinweise (R-9.4). Ohne Änderung nur ‚Alles war schon auf dem gleichen
    Stand.‘. Die App lädt AppDesign mit Versionsnummer und meldet beim Start eine falsche Fassung; die Versionszeile nennt
    ‚AppDesign 4.11.0‘ (R-10.3). Die Seitenleiste hat einen Zustand für quer und hoch (R-8.1).
  - Seit 3.11.2: Beim Drehen bleibt oben derselbe Tag stehen (R-8.1). Der Abgleichbericht hat oben rechts PDF und Teilen
    wie die Vorschau der Ausgabe; kein Zelleninhalt ragt in die Nachbarzelle (R-6.3).
  - Seit 3.11.3: Die Tabellen des Abgleichberichts sehen aus wie die der HTML-Ausgabe – überall gleich starke Linien (R-6.2).
  - Seit 3.11.4: Im Abgleichbericht ist jedes Reiselogbuch eine Tabellenzeile (Name in der ersten Spalte zusammengefasst),
    ganz weiß oder ganz grau, im Wechsel (R-6.2).
  - Seit 3.11.5: Im Abgleichbericht heißt das Feld ‚Reisemittel‘ wie im Fenster (R-10.1).
  - Seit 3.11.6: Der Abgleichbericht zeigt die Reisemittel mit Symbol und Namen (‚✈️ Flugzeug, 🚗 PKW‘) wie in der App. Die
    Tagestabelle der Ausgabe hat feste Spaltenanteile (Verlauf und ‚Wie war was?‘ je 28, Essen und Quartier je 22, ‚Tag‘ so
    schmal wie das Datum). ‚Gesamtausgaben‘ statt ‚Gesamtkosten‘. Am iPad bleibt die Seitenleiste beim Sprung zum ersten
    Treffer der Suche bei offener Tastatur an ihrem Platz (R-2.1).
  - Offene Fenster, Menüs und Sprechblasen: Wischen und Tippen wirken nur dort, die
    Seite dahinter bewegt sich nicht; Fenster öffnen ohne blauen Rahmen am x.
  - Menüs: Icons vor dem Text, Schatten wie die Schaltflächen; daneben tippen
    schließt. Die Schaltfläche, von der ein Menü, eine Abfrage oder ein
    Fenster kommt, ist so lange blau getönt.
- Abfragen (Löschen, Backup laden, Smiley entfernen, Smileys zurücksetzen,
  Änderungen verwerfen) als Sprechblase an der angetippten Schaltfläche:
  grauer Text, rote Schaltfläche mit dem Verb der Aktion, darunter
  "Abbrechen" (bzw. "Weiter bearbeiten") in normaler Schrift – Schaltflächen
  ohne Icons wie in Apple-Abfragen; daneben tippen bricht ab. Reine
  Meldungen (z. B. Fehler) in einem kleinen Fenster mit rundem x. Keine
  iPad-Systemfenster mit "Close"/"OK".
- Alle Aktionen sind echte Schaltflächen (kein reiner Text als Link).
- Fenster ohne Fußleiste: links oben rundes x, rechts oben rundes Häkchen.
  Das Häkchen ist grau, bis etwas geändert wurde, dann blau. x schließt;
  wurde etwas geändert, fragt eine Sprechblase "Änderungen verwerfen" /
  "Weiter bearbeiten" (die Eingaben bleiben dann erhalten). Häkchen ohne
  Änderung schließt einfach. Escape wirkt wie x.
- Fehlermeldungen stehen in Rot direkt unter dem betroffenen Feld, das Feld
  bekommt einen roten Rahmen. Beim Öffnen eines Fensters erscheint keine
  Meldung. Reisetitel und Reiseteilnehmer: Meldung erst, wenn das Feld leer
  verlassen oder geleert wird. Reisezeitraum: sobald ein Datum geändert oder
  ein Titel eingegeben wurde. Reisemittel: wenn das letzte gewählte abgewählt
  wird. Ein Tippen auf das Häkchen zeigt alle fehlenden Angaben und scrollt
  zur ersten.
- Pflichtfelder werden nicht gekennzeichnet (kein Sternchen, kein
  "erforderlich"/"optional"); fehlt eine Eingabe, erscheint die Meldung am Feld.
  Pflicht sind nur Reisetitel, Reiseteilnehmer, Reisezeitraum und Reisemittel
  (mindestens eines).
  - Bestätigung immer mit dem Verb der Aktion: "Löschen", "Entfernen",
    "Zurücksetzen", "Ersetzen", "Änderungen verwerfen"
- Alle Schaltflächen einheitlich 44 px hoch (auch lange Texte, Vorschläge,
  Reisemittel, Wetter, Smileys); reine Icon-, Wetter- und Smiley-
  Schaltflächen quadratisch 44 × 44 px (Emoji 24 px, Icon 20 px); Text in
  der Höhe genau mittig zum Icon. Mehrere Schaltflächen nebeneinander in
  einer Kapsel.
- Textfelder wachsen mit dem Inhalt (nie innerhalb eines Feldes scrollen).
  Datumsfelder sind so breit wie das Datum und haben rechts ein Kalender-Icon.
  Tabellenüberschriften 17 px halbfett wie die Zellen.
- Smileys, Wetter-Symbole und Reisemittel stehen je in einer Kapsel; bei
  knappem Platz lässt sich der Inhalt wischen. Zurücksetzen steht daneben.
- Suche: Markierung sofort, Sprung zum Treffer nach kurzer Tipp-Pause; der
  Treffer steht direkt unter der Suchzeile. Kopf- und Suchzeile bleiben fest,
  auch bei offener Tastatur.
- Drucken/PDF: nur das Reiselogbuch, ohne Seitenleiste.
- Bei sichtbarer Tastatur bleiben die Kopfzeilen aller Fenster und der
  Hauptansicht sichtbar; nur der Inhalt scrollt.
- Fenster passen sich in der Breite dem Inhalt an (höchstens 90 % der
  Bildschirmbreite, Mindestbreite für Eingabefelder): Neues Reiselogbuch,
  Einstellungen, Fazit, Meldungen. Tagesmaske und Vorschau sind fast
  bildschirmbreit.
- Versionsnummer dreistufig Hauptversion.Nebenversion.Korrektur (ab 1.0.0):
  Hauptversion = grundlegende Änderung (Aufbau, Bedienkonzept, Datenstruktur);
  Nebenversion = neue Funktion oder sichtbare Verbesserung; Korrektur =
  Fehlerbehebung. Jede Version steht mit Datum, Art und Inhalt in CHANGELOG.md.
- Vorschau: fast bildschirmbreites Fenster, Inhalt immer hell und genau wie
  die HTML-Datei; Kopfzeile x · "Vorschau" mit dem Dateinamen klein darunter ·
  Kapsel [PDF | share (blau gefüllt)]. Zeigt die Nummer der nächsten Datei,
  ohne den Zähler zu erhöhen. Google-Maps-Links öffnen extern, die Vorschau
  bleibt offen. Nach Teilen bzw. PDF folgen Meldung und ggf.
  Backup-Erinnerung.
- Schaltflächen-Icons aus dem Set Lucide (Liniengrafiken, direkt in die App
  eingebettet, offline). Inhalte (Smileys, Wetter, Reisemittel, Essen-Leiste,
  📍, Spaltenköpfe) bleiben Emojis. Zuordnung:
  Seitenleiste panel-left · Neues Reiselogbuch plus · Mehr-Menü ellipsis ·
  Einstellungen settings · Ausgabe/Teilen share (immer ohne Text) · Suchen
  search · Darstellung sun-moon · Fertig check (rund) · Abbrechen/
  Schließen x (rund) · Löschen/
  Entfernen/Verwerfen trash · Weiter bearbeiten pencil · Backup sichern save
  · Backup laden folder-open · Vorschau eye · HTML file-code · PDF file-text
  · Nach oben/Ans Ende arrow-up-to-line/arrow-down-to-line (in einer senkrechten Kapsel) ·
  Vortag/Folgetag chevron-left/chevron-right (nur Icon, als Kapsel) ·
  Treffer chevron-up/chevron-down · Smileys zurücksetzen rotate-ccw
- Begriffe: Seitenleiste "Reiselogbücher", Fenster "Neues Reiselogbuch" und
  "Einstellungen", Menüpunkt "Reiselogbuch löschen", Überschrift
  "Reiselogbuch – <Titel>" (App und Ausgabe). Die App heißt "Reiselogbuch";
  der Begriff "Reisetagebuch" kommt nicht mehr vor.
- Die "Reset"-Schaltfläche der iPad-Datumsauswahl bleibt (Systembeschriftung).

REISEN
- Es wird immer an einer Reise gearbeitet.
- Beim Start öffnet die App (iPad-Aufbau; am iPhone erst die Startliste) automatisch die
  Reise, in deren Zeitraum das heutige Datum fällt.
- Fällt heute in keine Reise, öffnet die App die zuletzt beendete Reise.
  Gibt es noch keine beendete Reise, öffnet die nächste geplante Reise.
- Gibt es noch kein Reiselogbuch (erster Start oder letztes gelöscht),
  öffnet sich "Neues Reiselogbuch" einmal von selbst; mit x bleibt die leere
  Seite mit dem grauen Hinweis "Noch kein Reiselogbuch angelegt." (auch in
  der Seitenleiste). Das Häkchen öffnet das neue Reiselogbuch.
- Eine neue Reise wird bewusst neu angelegt (plus in der Seitenleiste).
- Die geöffnete Reise wird über Mehr-Menü → "Einstellungen" bearbeitet und
  über Mehr-Menü → "Reiselogbuch löschen" gelöscht (Sprechblase mit Tipp,
  vorher ein Backup zu sichern); danach öffnet die Startreise.
- Reisezeitraum: grau "Von" Datum · "Bis" Datum in einer Zeile. Liegt das
  Bis-Datum vor dem Von-Datum, wird es auf das Von-Datum gesetzt – und
  umgekehrt.
- Allgemeine Reisedaten: Titel, Reiseteilnehmer, Reisezeitraum,
  darunter Reisemittel per Antippen, Mehrfachauswahl möglich,
  in dieser Reihenfolge:
  🚗 PKW · 🚆 Zug · 🚲 Fahrrad · ✈️ Flugzeug · 🚙 Leihwagen · 🚢 Schiff · 🚐 Wohnmobil · 🚶 Fuß
  Die gewählten Reisemittel werden mit Icons ausgegeben.
- Option "Quartierliste in der Ausgabe": beim Anlegen der Reise
  wählbar und nachträglich änderbar.
- Block "Konfiguration Tabellenspalten" (unter Reisemittel) mit Hinweis
  "Die Spalten ‚Tag‘ und ‚Verlauf‘ werden immer angezeigt." und den
  Schaltern in Tabellenreihenfolge: "Spalte 🙂☹️😉 ‚Wie war was?‘",
  "Spalte 🍽️🍷☕️ ‚Essen und Trinken‘", "Spalte 😴💤 ‚Quartier‘". Beim Anlegen
  alle drei eingeschaltet (bestehende Reiselogbücher: Wie war was? und
  Quartier ein, Essen wie bisher). Ausgeblendete Spalten fehlen in Tabelle,
  Tageserfassung (Schritte werden neu nummeriert), Suche und Ausgabe;
  vorhandene Einträge bleiben erhalten.
  - Quartier aus: "Quartierliste in der Ausgabe" ausgegraut, keine
    Quartierliste in App und Ausgabe, Statistik ohne Anzahl der Quartiere.
  - Wie war was? aus: Statistik zählt nur die Smileys des Fazits.
  - Erfasst ist ein Tag, wenn Wetter, Verlauf oder eine sichtbare Spalte
    (außer Essen) ausgefüllt ist.
- Reisezeiträume dürfen sich nicht überschneiden (Hinweis "Wähle einen
  Zeitraum, der sich nicht mit ‚…‘ (…) überschneidet.", Speichern erst nach
  Korrektur möglich).
- Frühere Reisen bleiben gespeichert und können jederzeit wieder
  geöffnet und geändert werden.
- Reisen können gelöscht werden, nur nach einer Sicherheitsabfrage.

HAUPTANSICHT (TABELLE)
- Für jeden Tag im Zeitraum gibt es eine Zeile ("Mo, 24.08.").
- Beim Öffnen scrollt die App zum ersten nicht erfassten Tag der Reise
  (die erste Lücke, auch wenn spätere Tage schon erfasst sind) und
  markiert diese Zeile.
- Die Kopfzeile bleibt beim Scrollen stehen, der Tabellenkopf direkt
  darunter. In der Tabelle wird zwischen ganzen Wörtern umgebrochen; ein zu langes Wort bricht im Wort um (R-6.3).
- Unten rechts übereinander die Schaltflächen ⬆️ (nach oben) und ⬇️ (ans
  Ende), im gleichen Aussehen wie die Dunkel-Schaltfläche, ohne Schatten.
- Filter im Mehr-Menü: "Alle Tage" bzw. "Nur erfasste Tage"; beim Öffnen
  eines Reiselogbuchs und beim Start gilt immer "Alle Tage".
- Dezente Fortschrittsanzeige, z. B. "Tag 42 von 80 · 38 erfasst".
- Vergangene Tage ohne Eintrag werden dezent markiert.
- Suche über die Einträge (Verlauf und sichtbare Spalten), nur innerhalb
  der aktuellen Reise. Treffer werden im Text gelb hinterlegt. Suchfeld als
  schwebende Kapsel in der zweiten Zeile über die volle Breite, rechtsbündig
  „3 von 57“ (bzw. „0“)
  und x zum Löschen; rechts daneben chevron-up / chevron-down zum vorigen bzw.
  nächsten Treffer (am Anfang/Ende ausgegraut, kein Umlauf). Der Treffer im
  Fokus ist hellorange und wird in die Bildmitte gescrollt; die Eingabetaste
  springt weiter.
- Aussehen im Apple-Look (siehe Designrichtlinie allgemein): Hintergrund
  Hellgrau, Kästen weiß ohne Rand, schwebende Schaltflächen mit 12 px Abstand;
  Akzentfarbe Apple-Blau: blau gefüllt = Hauptaktion, blau getönt mit Haarlinie
  = eingeschaltet (ohne Breitenänderung), rot gefüllt = Löschen; blau gefüllt nur in Fenstern,
  nie in Menüs oder der Kopfzeilen-Kapsel. Tabellen und
  Eingabefelder mit Schatten. Einstellungen im Fenster "Einstellungen" als
  Apple-Schalter (Apple-Grün), Optionen in der Tageserfassung als Options-Kapseln
  mit Häkchen. Quartier: Hotel und Ort nebeneinander in einer Zeile.
- Tabellendesign (gilt für alle Tabellen in App, HTML und PDF):
  - Kopfzeile leicht grau hinterlegt (#d9d9d9), Zellenränder darin zwei
    Stufen dunkler (#a5a5a5); im Dunkelmodus Kopfzeile #3b3a37 mit
    helleren Rändern (#625f5a), damit sie sichtbar sind
  - jede 2. Tageszeile heller grau (#f5f5f5, dunkel #2e2d2a); gezählt
    werden nur die sichtbaren Zeilen; die markierte Lücke bleibt gelb
  - Trennlinien zwischen allen Spalten
  - äußere Tabellenumrandung in der Farbe der Kopfzeilen-Ränder
  - die Statistik bleibt eine schlichte Liste
  - Quartierliste kompakt (Breite passt sich dem Inhalt an), "Nächte"
    rechtsbündig (Überschrift und Werte)
  - keine Hover-Farbe auf dem iPad (bleibt sonst nach dem Antippen hängen)
- Mehrzeilige Einträge mit hängendem Einzug: Bricht eine Zeile um,
  beginnt die Fortsetzung genau unter dem Text, nicht unter dem ▫️
  bzw. dem Smiley.

ERFASSUNG – wenig eingeben, in ganz einfachen Schritten
- Tag antippen → Erfassungsmaske (fast bildschirmbreit, damit weniger
  gescrollt werden muss). Checkbox-Texte in normaler Schrift.
- Titelzeile mit Wochentag und vollem Datum, z. B. "Sonntag, 04.10.2026".
- Die Eingabefelder bleiben schlicht (ohne Aufzählungszeichen); die
  saubere Formatierung erfolgt in Tabelle, HTML und PDF.
- Schritte (je nach sichtbaren Spalten 2 bis 5, fortlaufend nummeriert):
  1. Wetter: Symbole antippen, auch mehrere: ☀️ 🌤 🌦 🌧 ☁️ ⛈ ❄️
  2. Verlauf (bis 3.1.0 "Programm"): eine Zeile pro Punkt; mehrere Zeilen bekommen in Tabelle
     und Ausgabe ▫️ davor.
     Vorschläge zum Antippen: "Weiterfahrt nach …", "Rundgang durch …",
     "Besichtigung …", "Freetour …". Angetippt wird der Text als neue
     Zeile eingefügt; die "…" sind nur Platzhalter und werden nicht
     übernommen.
  3. Wie war was?: Smiley + kurzer Text; mehrere Smiley-Zeilen möglich.
     Alle Smileys möglich (iPad-Emoji-Tastatur).
     Schnellauswahl über dem Textfeld (alle Smiley-Leisten: Wie war was?,
     Essen und Trinken, Fazit): nur einzeilig, mit dem Finger nach links/
     rechts wischen, Verlauf am Rand als Hinweis, ↺ fest rechts daneben.
     - Sortiert nach Häufigkeit (meistbenutzt vorne), noch nie benutzte
       in Standardreihenfolge dahinter.
     - Langes Drücken entfernt einen Smiley (mit Sicherheitsabfrage).
       Wird er später wieder verwendet, kommt er automatisch zurück.
     - Reset-Icon (nur Symbol) stellt die Standard-Smileys wieder her
       und setzt alle Zähler auf null (mit Sicherheitsabfrage).
  4. Essen und Trinken (nur wenn die Spalte aktiviert ist): wie "Wie war was?", eine
     Zeile pro Lokal im Format "Smiley(s) Name – Kommentar", z. B.
     "🕛😋 Hard Rock Café – Steak war super". Eigene Smiley-Leiste mit
     eigener Häufigkeit, Entfernen (lange drücken) und ↺, Standard:
     🕗 🕙 🕛 🕒 🕕 😋 👌 👍 😕 🤮 👎 ⭐️ 🍕 🍔 🥩 🍷 🍺 ☕️
     Darstellung "🕛😋 📍Hard Rock Café – Steak war super": 📍 ist nur
     Zeichen, nur der Name des Lokals (bis einschließlich letztem
     Buchstaben) ist der Link, ab dem Bindestrich normaler Text.
     Smileys und 📍 bilden gemeinsam die linke Spalte: bei einem Umbruch
     beginnt die Folgezeile genau unter dem Namen (wie beim Quartier).
     Checkbox "keinen Google-Maps Link" rechts in der Kopfzeile des
     Schritts: zeigt den Zustand der Zeile mit dem Cursor und setzt bzw.
     entfernt dort ein "⊘" am Zeilenanfang; diese Zeile erscheint ohne 📍
     und ohne Link. Suche: Name + Ort des
     Quartiers, ohne Ort nur der Name.
     Essen wird bei der Suche gefunden, zählt nicht als "erfasst" und
     erscheint nicht in der Statistik. Keine Restaurantliste.
  5. Quartier: Name eintragen.
     Kopfzeile des Blocks: "☐ Quartier wie Vortag  ☐ keinen Google-Maps
     Link" (am ersten Reisetag nur die zweite Checkbox).
     Häkchen "Quartier wie Vortag": nur wenn gesetzt, wird das Quartier
     vom Vortag übernommen. Sonst bleibt das Feld leer.
     Checkbox "keinen Google-Maps Link" rechts in der Kopfzeile des
     Schritts (wie bei Essen): Name ohne 📍 und ohne Link (wird bei
     "Quartier wie Vortag" mit übernommen). "In Google Maps prüfen" ist
     nicht unterstrichen.
     Optionales Feld "Ort für Google Maps" (z. B. "Cairns, Australien"),
     macht den Maps-Link treffsicherer und wird nach einem Komma hinter
     dem Hotelnamen angezeigt ("📍Prize by Radisson, Wien") – überall
     (Tagestabelle, Quartierliste, App und Ausgabe); Teile des Ortes, die
     schon im Namen stehen, entfallen.
- Mehrere Smileys pro Zeile (Wie war was?, Essen, Fazit): Ein angetippter
  Smiley wird angehängt, wenn der Cursor in einer leeren Zeile oder direkt
  hinter Smileys steht; steht er hinter Text, beginnt eine neue Zeile.
  Alle führenden Smileys stehen in Tabelle und Ausgabe zusammen vorne,
  der Text rückt daneben ein.
- Diktieren über die Mikrofon-Taste der Tastatur (Hinweis im Fenster); keine eigenen
  Mikrofon-Knöpfe, weil iOS Web-Apps vom Home-Bildschirm keine Spracherkennung liefert.
- Textfelder: der erste Buchstabe jeder Zeile (und nach . ! ?) wird automatisch groß, auch
  nach einem Smiley. Doppeltippen vergrößert die Ansicht nicht.
- Reisezeitraum: "Von" mit Datum und "Bis" mit Datum bleiben jeweils zusammen; reicht der
  Platz nicht (iPhone), steht "Bis" mit seinem Datum unter "Von".
- Automatisches Speichern alle 10 Sekunden während der Erfassung.
- Mit der Kapsel [chevron-left | chevron-right] rechts oben (neben dem
  Häkchen) direkt zum Vortag bzw. Folgetag blättern; unter dem Datum steht
  grau "Automatisch gespeichert um hh:mm".
- Ein Tag gilt als erfasst, sobald mindestens ein Feld ausgefüllt ist.

QUARTIER-SPALTE
- Der Quartiersname wird automatisch zu einem funktionierenden
  Google-Maps-Link. 📍 ist nur Zeichen, Link ist nur der Hotelname bis vor den ersten
  Bindestrich oder das erste Komma ("📍Santai Resort - Kingscliff",
  "📍Cascade Gardens, Cairns"); gesucht wird mit dem ganzen Eintrag plus
  optionalem Ort.
- Gleiche Darstellung in Tagestabelle und Quartierliste, in App und
  Ausgabe (überall mit 📍).

ABSCHLUSS
- Fazit: Antippen öffnet eine eigene Erfassungsmaske wie "Wie war was?"
  (Smiley-Schnellauswahl mit gemeinsamer Häufigkeits-Sortierung, lange
  drücken/Reset, automatisches Speichern alle 10 Sekunden).
  Darstellung in App und Ausgabe mit hängendem Einzug.
- Unter Fazit und Gesamtausgaben zeigt auch die App die Quartierliste und
  danach die Statistik (Quartierliste in der App immer, in der Ausgabe nur
  mit Häkchen).
- Der Fazit-Kasten in der App passt sich in der Breite dem Inhalt an.
- Ein Feld "Gesamtausgaben" in Euro, rechtsbündig, € rechts neben dem Feld,
  immer mit zwei Nachkommastellen (Komma für Cent), mindestens so breit, dass
  "100.000,00" passt, bei längeren Beträgen wächst es mit. Der Tausenderpunkt
  erscheint schon beim Tippen ("4.850"); fehlen beim Verlassen des Feldes die
  Nachkommastellen, ergänzt die App ",00". Anzeige und Ausgabe z. B. als
  "4.850,00 €".

AUSGABE
- share in der Kopfzeile öffnet das Teilen-Menü: Vorschau · HTML · PDF (mit
  grauen Hinweisen zum Speichern), durchgehender Strich, darunter "N erfasste
  Tage · Dateiname: …".
- Anführungszeichen in allen Texten der App: einfache ‚…‘, keine doppelten.
- HTML: Speichern über das Teilen-Menü ("In Dateien sichern", Ordner
  frei wählbar).
- PDF: direkt über das Drucken-Menü von Safari (dort Teilen → "In Dateien
  sichern"); der Dateiname wird als Seitentitel vorgeschlagen.
- Die App meldet ehrlich, dass sie das Teilen- bzw. Drucken-Menü geöffnet
  hat (bzw. dass es abgebrochen wurde) – ob wirklich gespeichert wurde,
  kann sie nicht prüfen.
- Keine Hilfeseite.
- Jederzeit möglich, auch mitten in der Reise (Zwischenstand).
- Überschrift "Reiselogbuch – <Titel>".
- Nur erfasste Tage, keine leeren Tage, keine Wetter-Platzhalter;
  das Wetter steht in der Spalte "Tag" unter dem Datum.
- Die Google-Maps-Links funktionieren in beiden Formaten.
- Spaltenbreiten passen sich dem Inhalt an.
- Hängender Einzug bei Aufzählungen und Smiley-Zeilen.
- Reihenfolge am Ende:
  1. Fazit
  2. Gesamtausgaben
  3. Quartierliste (Quartier, Zeitraum, Anzahl Nächte, Maps-Link),
     falls bei der Reise aktiviert
  4. Statistik: Reisetage gesamt und davon erfasst, Anzahl der
     Quartiere, darunter Anzahl der Nächte (Summe), Wetter-Verteilung (z. B. "40×🌤 · 12×☀️ · 5×🌧"),
     Smileys: alle verwendeten aus Tagen und Fazit, absteigend nach
     Anzahl (z. B. "5×😊 · 3×😉 · 2×☹️"); Varianten wie ☹️/☹ zählen
     gemeinsam – Anzahl vor dem Symbol, ohne Leerzeichen
  5. Dezent als letzte Zeile:
     "Ausgabe V003 erstellt am TT.MM.JJJJ um hh:mm"
- Dateiname mit fortlaufender Versionsnummer (ein gemeinsamer Zähler
  pro Reise für HTML und PDF, im Backup enthalten):
  "Reiselogbuch <Reisetitel> JJJJ.MM.TT-JJJJ.MM.TT V001"
  z. B. "Reiselogbuch Australien 2026.08.24-2026.11.11 V003.pdf"
  (nie zwei Leerzeichen hintereinander)
- PDF bleibt im Hochformat (Safari ignoriert die Querformat-Vorgabe);
  beim Drucken ist der Seitenhintergrund weiß (kein grauer Balken).

SICHERHEIT
- Backup als Datei exportieren/importieren, enthält alle Reisen.
- Backup über "Backup erstellen" (Mehr-Menü der Seitenleiste oder Hinweis
  unten in der Seitenleiste), über das Teilen-Menü ("In Dateien sichern").
  Backup laden fragt mit zwei Kacheln: Abgleichen oder Ersetzen (R-9.2).
- Einmal am Tag sichern: Solange heute noch kein Backup gesichert wurde,
  steht der Hinweis unten in der Seitenleiste. Kein automatisches Backup bei
  der Ausgabe; danach erscheint eine Erinnerung "Denk daran, auch ein Backup
  zu erstellen." mit "Letztes Backup erstellt am …" und dem blauen Knopf
  "Backup erstellen".
- Als Backup-Zeitpunkt zählt nur ein abgeschlossenes Teilen-Menü, ein
  Abbruch zählt nicht.
- Backup-Dateiname (ohne Versionszähler):
  "Ω Backup Reiselogbuch JJJJ.MM.TT hh.mm"
  z. B. "Ω Backup Reiselogbuch 2026.10.04 14.35.json"
```
