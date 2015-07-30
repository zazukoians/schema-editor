# FooWiki
A minimal [SPARQL](http://www.w3.org/TR/sparql11-overview/) [Wiki](http://en.wikipedia.org/wiki/Wiki)

As it stands it's suitable for use as a personal wiki. It uses [Markdown](http://en.wikipedia.org/wiki/Markdown) editing syntax. It doesn't contain features like page locking or authentication (feel free to add these!).

It's very much a work-in-progress, definitely a bit of fun, but I'm already using it for note taking.

All FooWiki needs is a (static file) HTTP server and a SPARQL 1.1 server, i.e. **no server-side code**. It's being developed against [Fuseki](http://jena.apache.org/documentation/serving_data/), the Jena SPARQL server (which has a built-in HTTP server) and the instructions below follow this setup. (Please let me know if you get it running against a different SPARQL server, I'll include notes here).

I'm aiming for it being a "living system", see [Foo](#Foo).

## Installation
First clone the FooWiki files somewhere convenient. These will be served as regular HTML.

Next download Fuseki according to the [instructions](http://jena.apache.org/documentation/serving_data/). Then adjust the configuration according to your setup and run it. There are three files to consider for this:

1. the Fuseki config file - the one provided as foowiki/etc/seki-config.ttl includes a suitable store definition (called seki)
2. a script to run Fuseki pointing at its config file - the one provided as foowiki/etc/run-fuseki.bat should help as a starting point
3. the FuWiki config file, foowiki/js/config.js - the one provided is the one I use against the two files above

### Checking Fuseki 
Assuming you have a setup close to this, opening http://localhost:3030 should take you to the Fuseki pages. Click on Control Panel. When offered, select the /seki dataset. You should now see Fuseki's raw SPARQL interface. 

### Bootstrap Data
It's easiest to bootstrap the Wiki with a few pages. Open http://localhost:3030/foowiki/index.html in a browser and go to Upload RDF at the bottom of the page, click Select Files and navigate to foowiki/examples/pages.ttl, select it then click Upload. (Currently you will need to use the back button to get back to http://localhost:3030/foowiki/index.html and refresh the browser to see the page list).

You may wish to customise the graph name, it's specified in foowiki/js/config.js. If so, either do a search/replace in pages.ttl or skip the file upload and go straight to a (non-existent) page by pointing your browser at a URL of the form '''http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/Hello%20World'''.

## Using FooWiki
Opening http://localhost:3030/foowiki/index.html in a browser will display a list of pages in the Wiki. From there it should be self-explanatory, if not, let me know.

## Foo!
This is an experimental feature, the aim being in-app runtime extensibility via executable wiki pages (Javascript or *maybe* SPARQL). Think [emacs lisp](http://en.wikipedia.org/wiki/Emacs_Lisp) or [Smalltalk](http://en.wikipedia.org/wiki/Smalltalk#reflection) reflection. Ultimately I'd like it to have a relatively small core/kernel of static HTML/JS with everything else being maintained as RDF data.
Towards this, in addition to the core pages (see below) there's also a run.html which when called via a pattern like http://localhost:3030/foowiki/run.html?uri=http://hyperdata.it/wiki/Hello%20World%202 will run the source in the content of that page. There are examples in the sample data: HelloWorld1 and HelloWorld2 (more docs to follow once I've played with it a bit).

### Why "FooWiki"?
Initially I called this thing FuWiki as it uses Fuseki as a back end. But then I needed a name for the reflection bit so used the standard [metasyntactic variable](https://en.wikipedia.org/wiki/Metasyntactic_variable) [foo](https://en.wikipedia.org/wiki/Foo).

## How it works
Most of the code appears as jQuery-flavoured Javascript inside the core HTML files (index.html, page.html and edit.html). Could do with refactoring :)

Queries are composed using simple templating on foowiki/js/sparql-templates.js. The XML results are (crudely) parsed out using jQuery. Interaction with the SPARQL server is done using jQuery Ajax. Markdown parsing is done by the marked.js lib. Rendering of HTML content blocks is done by more templating on foowiki/js/html-templates.js.

There's some sample data etc. in the foowiki/examples/ directory.

Some background over here : https://dannyayers.wordpress.com/2014/12/30/browser-sparql-server-wiki/

Apache 2 license.


## See Also
I plan to use the same data model in [Seki](https://github.com/danja/seki) (middleware/a front-end for connecting to an independent SPARQL server using node.js) and [Thiki](https://github.com/danja/thiki) (Personal Wiki for Android Devices).