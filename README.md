# Schema Editor
*working title*

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

In the short term, it will be necessary to use the Fuseki1-1.3.0 release rather than the latest Fuseki2 version. A breaking change has been introduced there in that CORS is now blocked via the Apache Shiro-based security. For now the workaround is to use an earlier version (migration forwards should be trivial).

So -

Download 
http://mirrors.muzzy.it/apache/jena/binaries/jena-fuseki1-1.3.0-distribution.tar.gz

Extract this into SchemaEditor/jena-fuseki1-1.3.0

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








