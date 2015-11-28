# Schema Editor

*Note: where "SPARQL store" is used here, it refers to an online (or local) RDF store with SPARQL 1.1 Update facilities. Such a store is Apache Jena Fuseki, referred to here as "Fuseki"*

Schema Editor is a single-page browser-based web application designed to allow rapid creation and editing of RDF Schemas (also know as *ontologies* and *vocabularies* etc.). It is *not* a general-purpose RDF editor. It should work in any modern browser with Javascript enabled.

The emphasis is on creating schemas with good documentary support through the use of multi-lingual labels and comments. Standard RDFS terms are used and so subsequent inference across created schemas is possible, though this aspect isn't treated as a priority.

The editor operates against a SPARQL store, where data is persisted (subject to the configuration of the store).

*Warning:* if pre-existing schemas are edited, any statements involving terms outside of core RDFS may be lost.

To run Schema Editor, the following are required:

* HTTP Server
* SPARQL 1.1 Update-capable online RDF store

This repository includes an npm (node) install script that will install a minimal HTTP server and a suitable SPARQL store.

## Installation

If a HTTP server and SPARQL store are already available, all that is necessary for installation is firstly to clone this repository and copy the *src/public* directory (with subdirectories) onto the target machine and serve as web pages.

You should then follow the instructions for **Uploading Prefixes Map** under **Running Schema Editor** below.

If facilities aren't already available, the following procedure can be followed to build a minimal HTTP server and install a SPARQL store.

### Requirements

These instructions should work on most Linux distros although they have only been tested on Ubuntu. There's nothing too complicated and installation should be straightforward on any OS.

* Java 8+ runtime (for Fuseki) *
* node.js (for npm-based installation and minimal HTTP server)

_ * (The version of Fuseki referred to in the install script can be built from source with Java 7, but the pre-built snapshot binaries require v. 8)_

On a bare Ubuntu machine these may be installed using:

    sudo apt-get update
    sudo apt-get install openjdk-8-jre
    sudo apt-get install node

### Procedure

You should be logged into the target machine as a non-root user, and in a terminal enter:

    git clone https://github.com/zazuko/schema-editor.git

    cd schema-editor/

    npm install

This should install Fuseki under *data/store* together with the depencies for the mini HTTP server.

## Running Schema Editor

If you have installed as above, then the command:

    npm start

will set Fuseki and the mini HTTP server running.

    npm stop

will stop Fuseki & the HTTP server.

*Warning: npm stop is a little brutal,

When you first open the Schema Editor page, you will be presented with a dialog, **Endpoint Settings**. You should enter the appropriate values for the SPARQL store you wish to address.

If you've installed Fuseki as above, the required values will be:

    http://localhost:3333/schema-edit/sparql
    http://localhost:3333/schema-edit/update

On a remote server, replace *localhost* with the domain name or IP address of that server.

### Uploading Prefixes Map

To enable the use of well-known namespace prefixes within Schema Editor (e.g. *rdf: => http://www.w3.org/1999/02/22-rdf-syntax-ns#*), the file *data/prefixes* should be uploaded to the store with the graph name *http://purl.org/stuff/prefix/*

This may be achieved using whatever tools are available for an existing SPARQL store, or using Schema Editor as follows:

* scroll down to **Upload RDF**
* enter Graph Name : *http://purl.org/stuff/prefix/*
* click **Choose File** and navigate to *data/prefixes.ttl*

## Using Schema Editor

### Built-in Help

All the parts of Schema Editor have associated help information. When the mouse cursor is over a heading it will change into a (?). Clicking will reveal the help text.

### New Schema
To create a new schema, click **New Schema** and fill in the fields.

The namespace of the schema will be used as the graph name within the SPARQL store. It must end with a "#" or "/" character.

### Current Graph
This field will show the graph name/namespace of the schema currently being edited. The drop-down list to the right of the text field will show a list of other graphs available in the store. If you wish to edit one of these, select it.

### Current Resource
This field will show the resource currently being edited, typically a term (class or property) in the current schema. You can select a different resource using the drop-down list or by clicking on a link to the required class/property in the left-hand column.

### Classes/Properties Lists (left column)
These are the instances of **rdfs:Class** and **rdf:Property** in the current graph. Clicking on any of these will bring them into focus in the editor.

### Edit Term
When a class or property has been selected its details will be loaded into the fields here.

Fields with a purple border are for resources. Their values may be set in any of three ways:

* name - e.g. *Cat* - this will be interpreted as being in the current graph/namespace
* namespace:name (CURIE) - e.g. *foaf:name* - if the prefix is one of the well-know values loaded in the store (or that of the current schema), it will be interpreted as being in the corresponding well-know namespace
* full URI - e.g. *http://xmlns.com/foaf/0.1/*

To the right of the editable fields are two kinds of buttons:

* __+__ - clicking on one of these will add an extra field for the same property
* __lang__ or e.g. __en__ - these display the language associate with the literal field (__lang__ indicates no value has been set). Clicking on one of these will launch the **Choose Language** dialog

#### Choose Language dialog

On the left you will see a list of currently available language tags. Selecting one of these and clicking **Set Language** will associate the tag with the literal field.
If you don't see a language with which you wish to tag the literal field, you may enter its tag in the **Add Language** field and clicking the **Add Language** button will add it to the list. Select it and click **Set Language** to associate the tag with the literal field.

Clicking the **Update** button will push your changes to the SPARQL store.

*__Warning:__ if you are editing a pre-existing schema that has been uploaded to the store, any properties not seen in the editor will be wiped (Update initially wipes all properties before adding those in the fields)*

### New Class/New Property
To add a new class or property to the current schema, enter its name in the appropriate edit field and click **Create**. The term will be initialised in the store and you will be presented with the editing facilities for the term as described above.

### Upload RDF
To edit an existing schema, **first** enter its namespace/graph name in the corresponding field, then click **Choose File** and navigate to the required file.
Currently only Turtle format files are supported.

### Export Turtle
Clicking on this button will reveal a Turtle representation of the current schema. You can save this by right-clicking and selecting **Save As...** (or whatever corresponds to that in your browser).
The schema will remain in the store for future editing.

### Endpoint Settings
To address a different SPARQL store, enter its details here.

### Run Tests
Unit tests may be run by clicking on this link.

**TODO**
* check rendering of this at github
* add notes about separate scripts
