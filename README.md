# Radio France: département-level elections on March 22nd and 29th, 2015

[Download](https://github.com/jplusplus/rf-departementales-2015/archive/gh-pages.zip) • [Fork](https://github.com/jplusplus/rf-departementales-2015) • [License](https://github.com/jplusplus/rf-departementales-2015/blob/master/LICENSE)  •
(c) Radio France under GNU Lesser General Public License

## Installation

Install `node` and `npm` then run:

```bash
make install
```

You can now start serving static files with gulp!

```bash
make run
```

## Fetch data

The data are downloaded fron the ministry. Please install the packages `python-requests` and `python-bs4` then run:

```bash
cd scripts
python getResults.py 1
# Or for the second tour
python getResults.py 2
```

## Available commands

Command | Description
--- | ---
`make build` | Build the app to the `dist` directory
`make deploy` | Deploys the app on Github Pages
`make install` | Downloads all app's components
`make run` | Runs the development server on port *3000*
`make zip` | Builds and exports the app to a zip file

## Technical stack

This small application uses the following tools and opensource projects:

* [AngularJS](https://angularjs.org/) - Javascript Framework
* [Yeoman: gulp-angular](https://github.com/Swiip/generator-gulp-angular) - Static app generator
* [Leaflet: Angular Directive](http://tombatossals.github.io/angular-leaflet-directive/) - Leaflet Map with Angular
* [UI Router](https://github.com/angular-ui/ui-router/) - Application states manager
* [LoDash](http://lodash.com/) - Utility library
* [Bootstrap](http://getbootstrap.com/) - HTML and CSS framework
* [Less](http://lesscss.org/) - CSS pre-processor
* [CoffeeScript](http://coffeescript.org/) - Javascript pre-processor
