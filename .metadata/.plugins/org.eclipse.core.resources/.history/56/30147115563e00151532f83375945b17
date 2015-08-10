# RDF-Ext Primer

This is a work in progress document which explains how to use RDF-Ext and RDF Interaces.

## Basic Concepts

We assume you are familiar with basic RDF concepts like triples, graph, literals etc. If not please consult the [RDF 1.1 Primer](http://www.w3.org/TR/rdf11-primer/).

### API Documentation

Currently you need to consult the [RDF-Ext](http://bergos.github.io/rdf-ext-spec/) and [RDF Interfaces](http://www.w3.org/TR/rdf-interfaces/)  specification to get an API doc. This will hopefully change in the future.

### Store

The `Store` object is the basic abstraction of RDF-Ext. It provides ways to work with multiple graphs and access them over standardized interfaces.

### Graph

### Clownface

Clownface is an API to traverse `Graph` and `Store` objects.

#### Clownface Graph

`cf.Graph` requires a `Graph` object in the constructor.
That object will be used to do the traversing.
All methods of the `cf.Graph` object are synchronous.
Clownface uses a set of nodes as context that is used for further traversing.

#### Clownface Store

`cf.Store` requires a `Store` object in the constructor.
That object will be used to do the traversing.
All methods of the `cf.Graph` are supported.
The context of `cf.Store` uses a combination of node + graph.
Methods that cross a graph border are asynchronous.
The Promise API is used to handle these operations.
`.jump` loops over all selected nodes, fetches the graphs and uses the graphs as new context.
