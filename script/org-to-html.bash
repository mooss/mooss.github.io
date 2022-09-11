#!/usr/bin/env bash

if [[ $# -ne 2 ]]; then
    >&2 echo "Usage: $0 source.org destination.html"
    exit 1
fi

source="$1"
output="$2"

function export-names() {
    sed -r 's/^#\+name: (.*)/\n*=\1=*\n&/'
}

cat "$source" | export-names\
    | pandoc --from org\
             --output "$output"\
             --highlight-style=tango\
             --standalone --template=template.html\
             --lua-filter lua-filters/links.lua
