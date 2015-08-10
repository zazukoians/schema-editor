/*
 * Basic Clownface examples using Graph objects.
 */

// include RDF-Ext
var rdf = require('rdf-ext')();

// create a LdpStore to fetch graphs from the Web
var store = new rdf.LdpStore();

/*
 * This examples shows how to fetch all given names of people Amys knows an converts the values to strings. To search
 * for the known people and the given names the .out method is used. The string value is generated using the .literal
 * method.
 *
 * JSFiddle: http://jsfiddle.net/rp20782j/
 */

// fetch the Big Bang Theory example data
store.graph('https://rawgit.com/zazukoians/tbbt-ld/master/dist/tbbt.nt', function (graph) {
  // create a Clownface graph object
  var cf = rdf.cf.Graph(graph);

  // start at Amy Farrah Fowlers IRI node
  var result = cf.node('http://localhost:8080/data/person/amy-farrah-fowler')
    // search all people Amys knows using the predicate schema.org/knows in subject -> object direction
    .out('http://schema.org/knows')
    // search all given names of known people using the predicate schema.org/givenName in subject -> object direction
    .out('http://schema.org/givenName')
    // return the array of given names of all known people as an array of string values
    .literal()
    // and join the values separated by commas for output
    .join(',');

  // output the given names
  console.log('People Amy knows: ' + result);
});

/*
 * This example show how to count the number of people who know Bernadette. The .in method is used to search for people
 * who her. .toArray returns the selected nodes as array and .length counts the elements.
 *
 * JSFiddle: http://jsfiddle.net/3e6uzs64/
 */

// fetch the Big Bang Theory example data
store.graph('https://rawgit.com/zazukoians/tbbt-ld/master/dist/tbbt.nt', function (graph) {
  // create a Clownface graph object
  var cf = rdf.cf.Graph(graph);

  // start at Bernadettes IRI node
  var result = cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
    // search all people who know Bernadette using the predicate schema.org/knows in object -> subject direction
    .in('http://schema.org/knows')
    // convert the selected nodes to an array
    .toArray()
    // and count the elements
    .length;

  // output number of people
  console.log('Number of people who know Bernadette: ' + result);
});
