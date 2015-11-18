/**
 * Comment template. TODO fill me in
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 *
 * see also http://www.w3.org/TR/sparql11-update/
 */
var SparqlConnector = (function () {
    "use strict";

    var currentResource = "http://example.org/dummy";
    var knownPrefixes = [];

    // This is the public interface of the Module.
    var SparqlConnector = {

        init: function () {
            SparqlConnector.preloadKnownPrefixes();
        },

        ping: function (callback) {
            var sparql = "SELECT * WHERE {?s ?p ?o} LIMIT 1";
            var url = Config.getQueryEndpoint() + "?query=" + encodeURIComponent(sparql) + "&output=xml";
            $.get(url, function () {})
                .done(function () {})
                .fail(function () {
                    callback();
                });
        },

        getTurtleUrl: function (type, callback) {
            var resources = [];
            var getTurtleSparql = sparqlTemplater(constructGraph, {
                "graphURI": Config.getGraphURI(),
            });

            var getTurtleUrl = Config.getQueryEndpoint() + "?query=" +
                encodeURIComponent(getTurtleSparql) + "&output=text";

            return getTurtleUrl;
        },

        listClasses: function (callback) {
            return SparqlConnector.listResourcesOfType("rdfs:Class", callback);
        },

        listProperties: function (callback) {
            return SparqlConnector.listResourcesOfType("rdf:Property", callback);
        },

        listResources: function (callback) {
          if(!Config.getGraphURI()){
            return;
          }
            var resources = [];
            var getResourceListSparql = sparqlTemplater(
                getResourceListSparqlTemplate, {
                    "graphURI": Config.getGraphURI()
                });
            var getResourcesUrl = Config.getQueryEndpoint() + "?query=" +
                encodeURIComponent(getResourceListSparql) + "&output=xml";

            var extractResources = function (json) {
                var resources = [];
                for(var i = 0; i < json.length; i++) {
                    var subject = json[i]["subject"];
                    resources.push(subject);
                }
                callback(resources);
            }
            SparqlConnector.getJsonForSparqlURL(getResourcesUrl, extractResources);
        },

        listResourcesOfType: function (type, callback) {
            var resources = [];
            var getResourceListSparql = sparqlTemplater(
                getResourcesOfTypeSparqlTemplate, {
                    "graphURI": Config.getGraphURI(),
                    "type": type
                });
            var getResourcesUrl = Config.getQueryEndpoint() + "?query=" +
                encodeURIComponent(getResourceListSparql) + "&output=xml";

            var json = SparqlConnector.getJsonForSparqlURL(getResourcesUrl, callback);
        },

        /* produces a list of graphs available in the store */
        listGraphs: function (callback) {
            var graphs = [];
            var makeList = function (json) {
                var graphURIs = [];
                for(var i = 0; i < json.length; i++) {
                    graphURIs.push(json[i]["graph"]);
                }
                callback(graphURIs);
            }
            var getGraphListUrl = Config.getQueryEndpoint() + "?query=" +
                encodeURIComponent(listGraphsSparqlTemplate) + "&output=xml";

            SparqlConnector.getJsonForSparqlURL(getGraphListUrl, makeList);
        },

        uploadTurtle: function (graphURI, data, callback) {
            var uploadTurtleSparql = sparqlTemplater(
                uploadTurtleSparqlTemplate, {
                    "graphURI": graphURI,
                    "data": data
                });

            /* workaround for lack of upload endpoint */
            var sparql = cleanSPARQL(uploadTurtleSparql);

            SparqlConnector.postData(sparql, callback);

            // turtleToNtriples(turtle, handleNtriples);

            /* returns a 404, default upload URL not set up ??
            var targetUrl= Config.sparqlServerHost + Config.sparqlUploadEndpoint + "?graph="+graphURI;

            $.ajax({
              method: "POST",
              url: targetUrl,
              contentType:"text/turtle",
              data: data
            })
              .done(function( msg ) {
                alert( "Data Saved: " + msg );
              });
*/
        },

        listPropertiesForClass: function (graphURI, classURI) {
            var properties = [];
            return properties;
        },

        listClassesForProperty: function (graphURI, propertyURI) {
            var classes = [];
            return classes;
        },

        getPrefixedUri: function (uri) {
            var uriNamespaceIndex = uri.indexOf("#");
            if(uriNamespaceIndex == -1) {
                uriNamespaceIndex = uri.lastIndexOf("/");
            }

            var uriNamespace = uri.substring(0, uriNamespaceIndex + 1); // TODO check length
            var name = uri.substring(uriNamespaceIndex + 1);
            var prefix = SparqlConnector.getPrefixForUri(uriNamespace);
            if(prefix) {
                return prefix + ":" + name;
            }
            return null;
        },

        getPrefixForUri: function (uri) {
            var array = knownPrefixes;

            for(var i = 0; i < array.length; i++) {
                var prefix = array[i].prefix;
                var knownUri = array[i].uri;
                if(knownUri == uri) {
                    return prefix;
                }
            }
            return null;
        },

// TODO replace with SEUtils.prefixes
        preloadKnownPrefixes: function () {
            var known = [{
                prefix: "schema",
                uri: "http://schema.org/"
            }, {
                prefix: "rdfs",
                uri: "http://www.w3.org/2000/01/rdf-schema#"
            }, {
                prefix: "dc",
                uri: "http://purl.org/dc/terms/"
            }, {
                prefix: "owl",
                uri: "http://www.w3.org/2002/07/owl#"
            }, {
                prefix: "rdf",
                uri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            }, {
                prefix: "skos",
                uri: "http://www.w3.org/2004/02/skos/core#"
            }, {
                prefix: "foaf",
                uri: "http://xmlns.com/foaf/0.1/"
            }, {
                prefix: "dcat",
                uri: "http://www.w3.org/ns/dcat#"
            }, {
                prefix: "void",
                uri: "http://rdfs.org/ns/void#"
            }, {
                prefix: "bibo",
                uri: "http://purl.org/ontology/bibo/"
            }, {
                prefix: "dctype",
                uri: "http://purl.org/dc/dcmitype/"
            }, {
                prefix: "sioc",
                uri: "http://rdfs.org/sioc/ns#"
            }, {
                prefix: "stuff",
                uri: "http://purl.org/stuff/"
            }];
            knownPrefixes = knownPrefixes.concat(known);
            knownPrefixes.sort();
            return knownPrefixes;
        },

        /* *** connector low-level utilities *** */
        postData: function (data, callback) {

            $.ajax({
                type: "POST",
                url: Config.getUpdateEndpoint(),
                data: ({
                    update: data
                })
            }).done(function (msg) {
                if(callback) {
                    console.log("callback called");
                    if(msg){
                      callback(msg);
                    } else {
                      callback();
                    }
                }
            }).fail(function (jqXHR, textStatus,
                errorThrown) {
              //  console.log("postData error = " + textStatus);
              callback("Post Error<br\>"+textStatus+"<br\>"+errorThrown);
            });
        },

        deleteResource: function (resource, callback) {
            var deleteResourceSparql = sparqlTemplater(
                deleteResourceSparqlTemplate, {
                    "graphURI": Config.getGraphURI(),
                    "resourceURI": resource
                });
            SparqlConnector.postData(deleteResourceSparql, callback);
        },

        createNewVocab: function (name, graph, prefix, callback) {

            var createVocabSparql = sparqlTemplater(
                createVocabSparqlTemplate, {
                    "graphURI": graph,
                    "prefix": prefix,
                    "name": name
                });

            SparqlConnector.postData(createVocabSparql, callback);

            var addPrefixSparql = sparqlTemplater(
                addPrefixSparqlTemplate, {
                    "namespace": graph,
                    "prefix": prefix
                });
              //  console.log("addPrefixSparql = \n"+addPrefixSparql);
                var log = function() {
                //  console.log("SEUtils.prefixes = \n"+JSON.stringify(SEUtils.prefixes, false, 4));
                }
                SparqlConnector.postData(addPrefixSparql, log);
        },

        addClass: function (map, callback) {

            var addClassSparql = sparqlTemplater(
                addClassSparqlTemplate, map);
            // console.log("addClassSparql = \n" + addClassSparql);
            SparqlConnector.postData(addClassSparql, callback);
        },

        addProperty: function (map, callback) {
            var addPropertySparql = sparqlTemplater(
                addPropertySparqlTemplate, map);
            //  console.log("addPropertySparql = \n" + addPropertySparql);
            SparqlConnector.postData(addPropertySparql, callback);
        },

        updateLiteralTriple: function (subject, predicate, object, language, callback) {
            if(!language || language == "") { // sensible default
                language = "en";
            }
            var updateTripleSparql = sparqlTemplater(
                updateLiteralTripleSparqlTemplate, {
                    "graphURI": Config.getGraphURI(),
                    "subject": subject,
                    "predicate": predicate,
                    "object": object,
                    "language": language
                });
            // console.log("updateTripleSparql = \n" + updateTripleSparql);
            SparqlConnector.postData(updateTripleSparql, callback);
            return false;
        },

        updateUriTriple: function (subject, predicate, object, language, callback) {
            if(!language || language == "") { // sensible default?
                language = "en";
            }
            var updateTripleSparql = sparqlTemplater(
                updateUriTripleSparqlTemplate, {
                    "graphURI": Config.getGraphURI(),
                    "subject": subject,
                    "predicate": predicate,
                    "object": object,
                    "language": language
                });
            SparqlConnector.postData(updateTripleSparql, callback);
            return false;
        },

        insertProperty: function (subject, predicate, object, language, callback) {
            if(!language || language == "") { // sensible default?
                language = "en";
            }
            var insertPropertySparql = sparqlTemplater(
                insertPropertySparqlTemplate, {
                    "graphURI": Config.getGraphURI(),
                    "subject": subject,
                    "predicate": predicate,
                    "object": object,
                    "language": language
                });
            SparqlConnector.postData(insertPropertySparql, callback);
            return false;
        },

        deleteTurtle: function (turtle, callback) { // see http://www.w3.org/TR/sparql11-update/#deleteData
            var deleteTurtleSparql = sparqlTemplater(
                deleteTurtleSparqlTemplate, {
                    "graphURI": Config.getGraphURI(),
                    "turtle": turtle
                });
            SparqlConnector.postData(deleteTurtleSparql, callback);
            return false;
        },

        getJsonForSparqlURL: function (pageURL, callback) {
            $.ajax({
                url: pageURL,
                accept: {
                    xml: 'application/xml;charset=UTF-8',
                    sparql: 'sparql-results+xml;charset=UTF-8'
                },
                headers: { // belt and braces
                    //   'Content-Type': 'application/sparql-update'
                    //'Accept': 'sparql-results+xml;charset=UTF-8'

                    //   'Accept-Charset': 'UTF-8' unsafe
                }
            }).done(function (xml) {
                var json = SparqlConnector.sparqlXMLtoJSON(xml);
                callback(json);
            }).fail(function (msg) {
                console.log("getJsonForSparqlURL error = " + JSON.stringify(msg,false,4));
            });
        },

        sparqlXMLtoJSON: function (xml) {
            var xmlString = (new XMLSerializer()).serializeToString(xml);

            // workaround for wrong interpretation of charset
            // removed again because it was causing other problems with unicode...
            //xmlString = xmlString.replace(/[^\u0000-\u007F]/g, '');

            var $xml = $(xmlString);
            var variables = $xml.find("variable");
            if(variables.length == 0) {
                return false;
            }
            var jsonVariables = [];

            variables.each(function () {
                jsonVariables.push($(this).attr("name"));
            });

            var results = $xml.find("result");

            if(results.length == 0) {
                return false;
            }
            var jsonResults = [];

            results.each(function () {
                var map = {};
                for(var i = 0; i < jsonVariables.length; i++) {
                    var name = jsonVariables[i];
                    $(this).find("binding[name='" + name + "']").each(
                        function () {
                            map["type"] = $(this).children().prop(
                                    "tagName")
                                .toLowerCase();
                            map[name] = $(this).text().trim();
                        });
                }
                jsonResults.push(map);
            });
            return jsonResults;
        }
    }
    return SparqlConnector;
}());
