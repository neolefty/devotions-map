#!/bin/sh

# Edit this file and copy it to download.sh

# The form export spreadsheet's ID
SHEET_ID=<some_id>
# The worksheet's ID — see:
# https://developers.google.com/sheets/api/guides/concepts#sheet_id
GIT=<gid>

wget --output-file="log.csv" "https://docs.google.com/spreadsheets/d/${ID}/export?format=csv&gid=${GID}" -O "import.csv"
