.PHONY: all

all: draw/index.html draw/favicon.html

%.html: %.org
	pandoc "$^" --output "$@"\
           --highlight-style=tango\
           --standalone --template=template.html\
           --lua-filter lua-filters/links.lua
