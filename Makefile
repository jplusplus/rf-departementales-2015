run:
	gulp serve

build:
	gulp build

install:
	npm install
	bower install
	gulp inject

deploy: dist/.git
	(cd dist; git add -A; git commit -m "."; git push origin +HEAD:gh-pages)

clean:
	gulp clean

zip: clean build
	(cd dist; zip -r ../rf-departementales-2015.zip .)

dist/.git: dist
	(cd dist && git init && git remote add origin git@github.com:jplusplus/rf-departementales-2015.git)

dist: build