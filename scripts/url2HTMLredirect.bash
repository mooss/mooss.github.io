#!/usr/bin/env bash

set -euo pipefail
PARAMS=$(cat "$1" | grep -Eo '[^/]+$')

cat <<EOF
<meta http-equiv="refresh" content="0;url=../$PARAMS">
EOF

exit

cat <<EOF
<!doctype html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=../$URL">
<link rel="canonical" href="../$URL">
<title>Redirecting…</title>
<p>If you are not redirected automatically, <a href="/new-page/">click here</a>.</p>
EOF
