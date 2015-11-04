# Schema Editor
*working title*

## Revising docs for npm-based install

*https://zazuko.plan.io/projects/ontology-editor/repository*

prerequisites : node + npm

mine:
node --version
v0.10.28

npm --version
1.4.9

mkdir ~/home/SE
cd SE
git clone git@zazuko.plan.io:zazuko-ontology-editor.git

cd zazuko-ontology-editor
chmod 755 bin/*

npm install

npm start

*note* if server is already running, will get an error.
Can use :
netstat -nlp | grep 8888
(or grep node, but take care...)
and kill the result.

Finally:
point browser at localhost:8888

there is an npm stop as well, but it's a little brutal, use at your own risk :)

----
## Implementation Notes

### Overall Layout/Design
As [schema.org](http://schema.org/) was mentioned around specification time, it was considered desirable to support ontologies of this size. In practice this meant providing a coarse-grained view of terms in the ontology (the class & property lists in the left column) and fine-grained focus per-term (by clicking on a specific class/property). While it might be relatively straightforward to provide fine-grained views of every term simultaneously this is considered very low priority as such a view will be less clear for larger vocabularies with no added functionality.

### Value Types
For the object of properties a distinction is made between URI and Literal types. This is a convenience for the UI as the syntax varies between the two. URI & Literal come from the SPARQL result binding types.

* URI will refer to a subclass of **rdfs:Resource** that *isn't* an **rdfs:Literal**, i.e. one named with a URI
* Literal will refer to a *language-tagged string* (see the Note under [RDF 1.1 Datatypes](http://www.w3.org/TR/2014/REC-rdf11-concepts-20140225/#section-Datatypes)), the most suitable type for annotating ontologies.

----
## Earlier Install Notes to Refactor

A non-critical aim is to provide danbri with something he can use for editing the schema.org vocabulary, the project title chosen with this in mind.

foowiki dir is old code that contains recyclable Ajax bits. Likely to be deleted very soon.

docs/project is project schedule, likely to change frequently.

## Installation

The aim is to have installation all done by an npm install command, but last minute changes have put this on hold (until the CORS issue below is resolved).

First, create a directory for this project called SchemaEditor.

Open a terminal and cd into this directory, then do:

git clone *this repo name*

I will assume here that the resulting dir has been renamed to *repo*.

Next, you should install Fuseki :

### Installing Fuseki

~~In the short term, it will be necessary to use the Fuseki1-1.3.0 release rather than the latest Fuseki2 version. A breaking change has been introduced there in that CORS is now blocked via the Apache Shiro-based security. For now the workaround is to use an earlier version (migration forwards should be trivial).

So -

Download
http://mirrors.muzzy.it/apache/jena/binaries/jena-fuseki1-1.3.0-distribution.tar.gz

Extract this into SchemaEditor/jena-fuseki1-1.3.0~~

Now ok to follow instructions for Fuseki2, for CORS issue there's a fix at : https://gist.github.com/danja/e8ecbf7e51f7a2616122

### Running Fuseki

There is a script repo/bin/run-fuseki.sh that should set Fuseki going with the required parameters (if run from that dir). It contains:

java -Xms2048M -Xmx2048M -Xss4m  -jar ../../jena-fuseki1-1.3.0/fuseki-server.jar --verbose --update --config ../data/schemaedit-config.ttl --port=3333

*If you have an existing install of a <2 version of Fuseki, it should be easy to tweak its config to include the storage described in repo/data/schemaedit-config.ttl*

This should set Fuseki running with two stores available:

* a persistent TBD store for general use by Schema Editor
* an in-memory store for use by tests

Note that this will run on port 3333, not 3030, the default used by Fuseki.

## Running Schema Editor

There is a minimal HTTP server build using node.js in repo/utils/server.js. This may be run by cd-ing to that dir and running:

node server.js

Pointing a browser at:

http://localhost:8888/

should reveal the Schema Editor app.

~~ You may wish to start by uploading repo/data/schema.org.ttl ~~

Ok, loading mailed ontology, schema.ttl, renamed to reto-schema1.ttl

point browser at http://localhost:3333/

click on [add data]

Destination graph name = http://data.admin.ch/def/hgv/

Add file(s) - navigate to repo/data, select reto-schema1.ttl

in repo/public/js/config.js

edit to :

graphURI: "http://data.admin.ch/def/hgv/",

point browser at http://localhost:8888/ (refresh if necessary)

### Conventions

* The namespace of the vocab in question is used as the graph name within the SPARQL store
