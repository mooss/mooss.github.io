.PHONY: all

all: draw/index.html

%.html: %.org
	pandoc --standalone "$^" --output "$@"
