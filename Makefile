DIST_GIT = test -d dist/.git

run:
	gulp serve

build:
	gulp

install:
	npm install
	bower install
	gulp inject

deploy: $(DIST_GIT)
	(cd dist; git add -A; gca -m "."; git push --force)

zip: build
	(cd dist; zip -r ../rf-departementales-2015.zip .)
