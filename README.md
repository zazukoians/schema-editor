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

### Installing Fuseki

In the short term, it will be necessary to use the Fuseki1-1.3.0 release rather than the latest Fuseki2 version. A breaking change has been introduced there in that CORS is now blocked via the Apache Shiro-based security. For now the workaround is to use an earlier version (migration forwards should be trivial).

So -

Download 
http://mirrors.muzzy.it/apache/jena/binaries/jena-fuseki1-1.3.0-distribution.tar.gz

Extract this into SchemaEditor/jena-fuseki1-1.3.0

### Running Fuseki

There is a script repo/bin/


