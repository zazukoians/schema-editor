/*
 * Basic Clownface examples using Graph objects.
 */

// include RDF-Ext
var rdf = require('rdf-ext')();

// create a LdpStore to fetch graphs from the Web
var store = new rdf.LdpStore();

/*
 * This examples shows how to fetch all IRIs of people Amy Farrah Fowler knows and fetches the individual graphs. .out
 * is used to search for the known people and .jump to fetch the selected graphs. .map is used to combine the given name
 * and the family name into one string. Fetching the graphs in the .node and .jump methods requires asynchronous calls.
 * The Promise API is used to handle asynchronous code.
 *
 * JSFiddle: http://jsfiddle.net/w329249j/
 */

// fetch the Big Bang Theory example data
store.graph('https://rawgit.com/zazukoians/tbbt-ld/master/dist/tbbt.nt', function (graph) {
  // split the graph into individual graph, wrapped into a in memory store
  rdf.utils.splitGraphByNamedNodeSubject(graph)
    .then(function (store) {
      // create a Clownface store object
      var cf = rdf.cf.Store(store);

      // start at Bernadettes node and graph
      cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
        // fetching the graph is an asynchronous operation
        .then(function (cf) {
          return cf
            // search all people Bernadette knows using the predicate schema.org/knows in subject -> object direction
            .out('http://schema.org/knows')
            // fetch all selected graphs
            .jump();
        })
        // .jump was again a asynchronous operation
        .then(function (cf) {
          var result = cf
            // use .map to loop over all selected nodes
            .map(function (node) {
              // combine given name and fimily name
              return node.out('http://schema.org/givenName') + ' ' + node.out('http://schema.org/familyName');
            })
            // join the string separated by commas
            .join(',');

          // output the names
          console.log('People Amy knows: ' + result);
        });
    });
});
