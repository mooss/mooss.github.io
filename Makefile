###################
# HTML generation #
###################
.PHONY: all

all: draw/index.html draw/favicon.html draw/imgen.html

%.html: %.org
	./script/org-to-html.bash "$^" "$@"

##############
# Submodules #
##############
.PHONY: submodules yliss/litlib init pull copy-assets update cli

submodules:
	git submodule init
	git submodule update

yliss/litlib:
	[[ -L repo/yliss/litlib ]] || rmdir repo/yliss/litlib
	ln -sf $(CURDIR)/repo/litlib repo/yliss/litlib

init: submodules yliss/litlib
	cd repo/yliss && make init

pull:
	cd repo/yliss && git checkout master && git pull
	cd repo/litlib && git checkout main && git pull

copy-assets:
	./script/copy-assets.bash

update: pull copy-assets all

cli: yliss/litlib
	cd repo/yliss && make clean && make cli
