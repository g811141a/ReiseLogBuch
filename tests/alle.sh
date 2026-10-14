#!/bin/sh
# Alle Tests des Reiselogbuchs (im Repo-Ordner: sh tests/alle.sh). Seit 3.12.0 nur noch ein Aufruf von tests/alle.mjs:
# parallel, schnellste zuerst, Chromium und WebKit, Abbruch beim ersten Fehler, Rückgabewert 1 bei Fehlern (A-05).
# Weitere Schalter werden durchgereicht, z. B. sh tests/alle.sh --alle. AppDesign muss neben dem Repo liegen.
cd "$(dirname "$0")/.." || exit 1
exec node tests/alle.mjs "$@"
