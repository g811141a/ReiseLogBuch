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
