.PHONY: all

all: draw/index.html

%.html: %.org
	pandoc --standalone --template=template.html "$^" --output "$@"
