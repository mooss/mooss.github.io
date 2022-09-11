.PHONY: all init

###################
# HTML generation #
###################
all: draw/index.html draw/favicon.html draw/imgen.html

%.html: %.org
	./script/org-to-html.bash "$^" "$@"

###############################
# Dependencies initialisation #
###############################
init:
	git submodule init
	git submodule update
	rmdir repo/yliss/litlib
	ln -s $(CURDIR)/repo/litlib repo/yliss/litlib
	cd repo/yliss && make init
