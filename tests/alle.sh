#!/bin/sh
# Alle Tests des Reiselogbuchs nacheinander (im Repo-Ordner: sh tests/alle.sh). AppDesign muss neben dem Repo liegen.
cd "$(dirname "$0")/.." || exit 1
for t in ablauf-gesamt ablauf-suche-tabelle ablauf-fenster ablauf-seitenleiste-kontextmenue ablauf-seitenleiste-position ablauf-abgleich ablauf-abgleich-faelle ablauf-markierung-menues ablauf-iphone tastatur; do
  echo "== $t"; node "tests/$t.mjs" 2>&1 | grep -iE "^err|errors|err2|error" | head -5
done
echo "== HIG-Prüfung"; node tests/hig.mjs
