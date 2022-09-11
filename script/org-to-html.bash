#!/usr/bin/env bash

if [[ $# -ne 2 ]]; then
    >&2 echo "Usage: $0 source.org destination.html"
    exit 1
fi

source="$1"
output="$2"

pandoc "$source" --output "$output"\
       --highlight-style=tango\
       --standalone --template=template.html\
       --lua-filter lua-filters/links.lua
