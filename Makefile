.PHONY: all init copy-assets pull update

###################
# HTML generation #
###################
all: draw/index.html draw/favicon.html draw/imgen.html

%.html: %.org
	./script/org-to-html.bash "$^" "$@"

##############
# Submodules #
##############
init:
	git submodule init
	git submodule update
	[[ -L repo/yliss/litlib ]] || rmdir repo/yliss/litlib
	ln -s $(CURDIR)/repo/litlib repo/yliss/litlib
	cd repo/yliss && make init

pull:
	cd repo/yliss && git checkout master && git pull
	cd repo/litlib && git checkout main && git pull

copy-assets:
	./script/copy-assets.bash

update: pull copy-assets all
