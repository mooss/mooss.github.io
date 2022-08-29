.PHONY: all

all: draw/index.html draw/favicon.html

%.html: %.org
	pandoc "$^" --output "$@"\
           --standalone --template=template.html\
           --lua-filter lua-filters/links.lua
