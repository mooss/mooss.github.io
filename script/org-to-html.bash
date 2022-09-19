#!/usr/bin/env bash

if [[ $# -ne 2 ]]; then
    >&2 echo "Usage: $0 source.org destination.html"
    exit 1
fi

source="$1"
output="$2"

function export-names-html() {
    # This exports to HTML named code blocks (defined via `#+name:` line) and
    # reffed code blocks (defined via `:noweb-ref` noweb argument).

    # pre, mid and post are used to introduce the HTML that together with css
    # classes defined in pandoc.css slightly prettify code blocks and their
    # legends.
    local -r pre="#+html: <p class='code-legend'><strong><code class='verbatim'>"
    local -r mid="</code></strong> <em><code class='verbatim'>"
    local -r post="</code></em></p>"
    sed -re "s|^#\+name: (.*)|\n$pre\1$mid=$post\n&|"\
        -e "s|^#\+begin_src .*:noweb-ref +([^ ]+).*|\n$pre\1$mid+=$post\n&|"
}

cat "$source" | export-names-html\
    | pandoc --from org\
             --output "$output"\
             --highlight-style=tango\
             --standalone --template=template.html\
             --lua-filter lua-filters/links.lua
