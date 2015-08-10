/*
 * Basic RDF-Ext Sample. Load some external resources and do basic filtering.
 *
 */

'use strict';

// include RDF-Ext
var rdf = require('rdf-ext')();


// in this example we create an LdpStore as this one is able to fetch external URIs
var store = new rdf.LdpStore();

// we use the store.graph() function to resolve an external URI
// the callback returns a RDF Interface graph object
store.graph('http://www.w3.org/People/Berners-Lee/card', function(graph, error){

  if(error)
  {
    console.log(error);
  } else {
    // note that graph.length is a property, not a function
    console.log("Successfully fetched %d triples", graph.length);
  }
});
