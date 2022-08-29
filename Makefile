.PHONY: all

all: draw/index.html draw/favicon.html

%.html: %.org
	pandoc --standalone --template=template.html "$^" --output "$@"
