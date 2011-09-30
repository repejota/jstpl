FILES = src/jstpl.js \
        src/jstpl.arraybuilder.js \
        src/jstpl.stringbuilder.js \
        src/jstpl.filter.js \
        src/jstpl.node.comment.js \
        src/jstpl.node.for.js \
        src/jstpl.node.if.js \
        src/jstpl.node.text.js \
        src/jstpl.node.var.js \
        src/jstpl.parser.js \
        src/jstpl.tag.js \
        src/jstpl.token.js

all: clean prepare doc build dist test

prepare:
	@mkdir -p dist
	@mkdir -p build

doc: clean prepare


build: clean prepare
	@touch dist/hippocampus.jstpl.js; set -e; for i in $(FILES); do cat $$i >> dist/hippocampus.jstpl.js ; done

test: clean prepare build install


install: clean prepare build


dist: clean prepare build


clean:
	@rm -rf dist
	@rm -rf build

.PHONY : all prepare doc build test install dist srcdist clean

