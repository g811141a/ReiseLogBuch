# ReiseLogBuch

Einfaches Reiselogbuch als Web-App (PWA) für das iPad – offline nutzbar, alle Daten bleiben lokal auf dem Gerät.

**App:** https://g811141a.github.io/ReiseLogBuch/
(in Safari öffnen → Teilen → „Zum Home-Bildschirm“)

## Verwendete Versionen

Mit diesen Fassungen ist die aktuelle Version gebaut (Regel R-10.4; die App nennt beide Versionen auch in der Versionszeile
im Mehr-Menü der Seitenleiste).

| Teil | Version | Datei |
|---|---|---|
| Reiselogbuch | 3.15.1 | [CHANGELOG.md](https://github.com/g811141a/ReiseLogBuch/blob/main/CHANGELOG.md) |
| AppDesign | 4.16.1 | [CHANGELOG.md (AppDesign)](https://github.com/g811141a/AppDesign/blob/main/CHANGELOG.md) · Bausteine [fassung/4.16.1/ui.js](https://github.com/g811141a/AppDesign/blob/main/fassung/4.16.1/ui.js), [fassung/4.16.1/design.css](https://github.com/g811141a/AppDesign/blob/main/fassung/4.16.1/design.css) |
| Designrichtlinie allgemein | 4.16.1 | [README - Designrichtlinie allgemein.md](https://github.com/g811141a/AppDesign/blob/main/fassung/4.16.1/README%20-%20Designrichtlinie%20allgemein.md) |
| Designrichtlinie Reiselogbuch | 3.15.1 | [README - Designrichtlinie Reiselogbuch.md](https://github.com/g811141a/ReiseLogBuch/blob/main/README%20-%20Designrichtlinie%20Reiselogbuch.md) |
| Zusammenarbeit allgemein | 2.5.0 | [README - Zusammenarbeit allgemein.md](https://github.com/g811141a/AppDesign/blob/main/fassung/4.16.1/README%20-%20Zusammenarbeit%20allgemein.md) |

## Dateien

- `index.html` – die App (HTML, CSS, JavaScript); gemeinsame Bausteine `design.css`/`ui.js` kommen aus dem Design-Repo [AppDesign](https://github.com/g811141a/AppDesign)
- `sw.js`, `manifest.json`, `icon-*.png` – Offline-Betrieb und Home-Bildschirm
- `PROMPT.md` – die abgestimmten Anforderungen (aktueller Stand)
- `BACKLOG.md` – offene Themen
