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

function imglink() {
    local href="$1"; local img="$2"; local alt="$3"
    cat <<EOF
<span>
  <a href="$href" target="_blank" rel="noopener"><img src="$img" alt="$alt" width="18" height="18" style="line-height: 0; vertical-align: middle"></a>
</span>
EOF
}

function footer() {
    cat <<EOF | tr -d '\n'
<span>&copy; 2025 mooss</span> | 
$(imglink https://x.com/noisy_mooss https://upload.wikimedia.org/wikipedia/commons/c/cc/X_icon.svg "Follow me on X") |
$(imglink https://github.com/mooss/noisy https://upload.wikimedia.org/wikipedia/commons/2/24/Github_logo_svg.svg "Source code on GitHub") | 
<span><a href="mailto:mooss@protonmail.com" style="color: #4da6ff;">contact</a></span> | 
<span>Version $VERSION_PERIOD $VERSION_NUMBER / $VERSION_NAME / $SHORT_REF</span>
EOF
}
export FOOT=$(footer)
export FAV='<link rel="icon" type="image/png" href="/noisy/res/icons/logo-cropped-rounded-tiny-192x192.png">'

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
    echo "Don't forget to update noisy/meta.yaml with:"
    cat <<EOF
  ${VERSION_NAME}:
    period: ${VERSION_PERIOD}
    number: ${VERSION_NUMBER}
    commit: ${LONG_REF}
EOF
    echo "And to redirect noisy/index.html to ${VERSION_NAME}."
}

release
version-reminder
