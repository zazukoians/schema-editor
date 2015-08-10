/*
 * Basic RDF-Ext Sample. Load some external resources and do basic filtering.
 *
 *
 *
 */

// include RDF-Ext
var rdf = require('rdf-ext')();
//var Promise = require('es6-promise').Promise;


// in this example we create an LdpStore as this one is able to fetch external URIs
var store = new rdf.LdpStore();


store.graph('http://ktk.netlabs.org/foaf', function(graph, error){

  if(error)
  {
    console.log(error);
  } else {
    // note that graph.length is a value, not a function
    console.log("Successfully fetched %d triples", graph.length);
    var knows = graph.match(null, 'http://xmlns.com/foaf/0.1/knows', null);

    knows.forEach( function(triple) {
    // iterate over the results, creating a filtered graph for each subject found
    // and pass that graph to a display function

    // complete triple in N-Triples notation
    console.log("Triple:    " + triple.toString());

    // and subject - predicate - object as strings
    console.log("Subject:   " + triple.subject);
    console.log("Predicate: " + triple.predicate);
    console.log("Object:    " + triple.object);
    console.log("---------------------------------------------------------------------");
  });

  }
});
