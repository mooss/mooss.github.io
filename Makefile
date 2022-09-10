.PHONY: all init

###################
# HTML generation #
###################
all: draw/index.html draw/favicon.html

%.html: %.org
	pandoc "$^" --output "$@"\
           --highlight-style=tango\
           --standalone --template=template.html\
           --lua-filter lua-filters/links.lua

###############################
# Dependencies initialisation #
###############################
init:
	git submodule init
	git submodule update
	rmdir repo/yliss/litlib
	ln -s $(CURDIR)/repo/litlib repo/yliss/litlib
	cd repo/yliss && make init
