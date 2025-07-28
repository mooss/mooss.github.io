#!/usr/bin/env bash

SOURCE=repo/noisy/web
INDEX=$SOURCE/dist/index.html
VERSION_CODE=$(grep VERSION_CODE $SOURCE/constants.ts | head -n1 | sed -r "s/.*'(.*)';$/\1/")
VERSION_NAME=$(grep VERSION_NAME $SOURCE/constants.ts | head -n1 | sed -r "s/.*'(.*)';$/\1/")
SHORT_REF=$(git -C $SOURCE rev-parse --short HEAD)
echo $VERSION_NAME $VERSION_CODE $SHORT_REF

function footer() {
    cat <<EOF | tr -d '\n'
<div style="position: fixed; bottom: 0; width: 100%; background-color: rgba(0,0,0,0.7); color: white; padding: 6px; text-align: center; font-size: 14px;">
    <span>&copy; 2025 mooss</span> |
    <span><a href="mailto:mooss@protonmail.com" style="color: #4da6ff;">mooss@protonmail.com</a></span> |
    <!-- <span>GitHub coming later<a href="https://github.com/" target="_blank" style="color: #4da6ff;"></a></span> | -->
    <span>Version: $VERSION_CODE / $VERSION_NAME / $SHORT_REF</span>
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

DEST="noisy/$VERSION_NAME"
mkdir -vp "$DEST/assets"
rm -v "$DEST/assets/"*
new-html > "$DEST"/index.html
cp -vt "$DEST/assets" "$SOURCE/dist/assets/"*.js
tree "$DEST"
