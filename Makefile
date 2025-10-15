.PHONY: all submodules yliss/litlib init pull copy-assets update cli noisy serve-noisy noisy-redirects

###################
# HTML generation #

all: draw/index.html draw/favicon.html draw/imgen.html

%.html: %.org
	./scripts/org-to-html.bash "$^" "$@"

##############
# Submodules #


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
	./scripts/copy-assets.bash

update: pull copy-assets all

cli: yliss/litlib
	cd repo/yliss && make clean && make cli

#########
# Noisy #

NOISY_URLS := $(wildcard noisy/*/scenes/*.url)
NOISY_REDIRECTS := $(NOISY_URLS:.url=.html)
noisy-redirects: $(NOISY_REDIRECTS)
noisy/%.html: noisy/%.url
	./scripts/url2HTMLredirect.bash $< > $@

noisy:
	cd repo/noisy && make dist
	./scripts/release-noisy.bash

serve-noisy:
	./scripts/serve-latest-noisy.bash
