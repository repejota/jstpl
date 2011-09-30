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

