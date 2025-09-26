#!/usr/bin/env bash

set -euo pipefail

SOURCE=repo/noisy/build/web
INDEX=$SOURCE/src/app/noisy/dist/index.html

function grepver() {
    grep VERSION_$1 $SOURCE/config/constants.ts | head -n1 | sed -r "s/.*'(.*)';$/\1/"
}

VERSION_PERIOD=$(grepver PERIOD)
VERSION_NUMBER=$(grepver NUMBER)
VERSION_NAME=$(grepver NAME)
SHORT_REF=$(git -C $SOURCE rev-parse --short HEAD)
LONG_REF=$(git -C $SOURCE rev-parse HEAD)
RELEASE_DIR="noisy/$VERSION_NAME"
echo "Will release $VERSION_PERIOD $VERSION_NUMBER ($VERSION_NAME) - $SHORT_REF to $RELEASE_DIR"

function footer() {
    cat <<EOF | tr -d '\n'
<div style="position: fixed; bottom: 0; width: 100%; background-color: rgba(0,0,0,0.7); color: white; padding: 6px; text-align: center; font-size: 14px;">
    <span>&copy; 2025 mooss</span> |
    <span><a href="mailto:mooss@protonmail.com" style="color: #4da6ff;">contact</a></span> |
    <span><a href="https://github.com/mooss/noisy" style="color: #4da6ff;">GitHub</a></span> |
    <span>Version: $VERSION_PERIOD $VERSION_NUMBER / $VERSION_NAME / $SHORT_REF</span>
</div>
EOF
}
export FOOT=$(footer)
export FAV='<link rel="icon" type="image/png" href="/favicon-192x192.png">'

function new-html() {
    perl -0777 -pe '
s/<!-- Favicon.*/<!-- Favicon --> $ENV{FAV}/;
s/<!-- Footer.*/<!-- Footer. --> $ENV{FOOT}/;
' "$INDEX"
}

function release() {
    mkdir -vp "$RELEASE_DIR/assets"
    rm -v "$RELEASE_DIR/assets/"* || true
    new-html > "$RELEASE_DIR"/index.html
    cp -vt "$RELEASE_DIR/assets" "$SOURCE/src/app/noisy/dist/assets/"*.js
    tree "$RELEASE_DIR"
}

function version-reminder() {
    echo "Don't forget to update noisy/versions.yaml with:"
    cat <<EOF
${VERSION_NAME}:
  period: ${VERSION_PERIOD}
  number: ${VERSION_NUMBER}
  commit: ${LONG_REF}
EOF
}

release
version-reminder
