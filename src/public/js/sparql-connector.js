// TODO use console.log()s for tests, then remove
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

        setCurrentResource: function (uri) {
            currentResource = uri;
        },

        getCurrentResource: function () {
            return currentResource;
        },

        getGraphURI: function () {
            return Config.graphURI;
        },

        setGraphURI: function (uri) {
            Config.graphURI = uri;
            return Config.graphURI;
        },
        // API, based on spec
        // initial implementations based on foowiki Ajax - with templating

        setQueryEndpoint: function (url) {
            Config.sparqlQueryEndpoint = url;
            return getQueryEndpoint();
        },

        getQueryEndpoint: function () {
            return Config.sparqlQueryEndpoint
        },

        setUpdateEndpoint: function (url) {
            return getUpdateEndpoint();
        },

        getUpdateEndpoint: function () {
            return Config.sparqlUpdateEndpoint
        },

        setEndpoint: function (graphURI) {
            return graphURI;
        },

        listResourcesOfType: function (type, callback) {
            var resources = [];
            var getResourceListSparql = sparqlTemplater(
                getResourcesOfTypeSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "type": type
                });
            var getResourcesUrl = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
                encodeURIComponent(getResourceListSparql) + "&output=xml";

            //  console.log("getClassesUrl = " + getResourcesUrl);
            var json = SparqlConnector.getJsonForSparqlURL(getResourcesUrl,
                callback); // is in sparql-connector.js
            //    console.log("json =" + json);
            return resources;
        },

        listClasses: function (callback) {
            return SparqlConnector.listResourcesOfType("rdfs:Class", callback);
        },

        listProperties: function (callback) {
            return SparqlConnector.listResourcesOfType("rdf:Property",
                callback);
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
            if (uriNamespaceIndex == -1) {
                uriNamespaceIndex = uri.lastIndexOf("/");
            }
            // console.log("uriNamespaceIndex = " + uriNamespaceIndex);

            var uriNamespace = uri.substring(0, uriNamespaceIndex + 1); // TODO check length
            var name = uri.substring(uriNamespaceIndex + 1);
            // console.log("SparqlConnector.getPrefixForUri(uriNamespace) = " + SparqlConnector.getPrefixForUri(uriNamespace));
            var prefixedUri = SparqlConnector.getPrefixForUri(uriNamespace) + ":" + name;
            return prefixedUri;
        },

        getPrefixForUri: function (uri) {
            var array = knownPrefixes;

            for (var i = 0; i < array.length; i++) {
                var prefix = array[i].prefix;
                var knownUri = array[i].uri;
                if (knownUri == uri) {
                    return prefix;
                }
            }
            return null;
        },

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
            // console.log("knownPrefixes = " + JSON.stringify(knownPrefixes));
            return knownPrefixes;
        },

        /* *** connector low-level utilities *** */

        postData: function (data) {
            $.ajax({
                type: "POST",
                url: Config.sparqlUpdateEndpoint,
                data: ({
                    update: data
                })
            }).done(function () {}).fail(function (jqXHR, textStatus,
                errorThrown) {
                alert("Error " + textStatus);
            });
        },

        listResourcesOfType: function (type, callback) {
            var resources = [];
            var getResourceListSparql = sparqlTemplater(
                getResourcesOfTypeSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "type": type
                });
            var getResourcesUrl = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
                encodeURIComponent(getResourceListSparql) + "&output=xml";

            //  console.log("getClassesUrl = " + getResourcesUrl);
            var json = SparqlConnector.getJsonForSparqlURL(getResourcesUrl, callback); // is in sparql-connector.js
            //    console.log("json =" + json);
            return resources;
        },

        deleteTurtle: function (turtle, callback) { // see http://www.w3.org/TR/sparql11-update/#deleteData
            console.log("deleteTurtle turtle = " + turtle);
            var deleteTurtleSparql = sparqlTemplater(
                deleteTurtleSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "turtle": turtle
                });
            console.log("deleteTurtleSparql = " + deleteTurtleSparql);

            $.ajax({
                type: "POST",
                url: Config.sparqlServerHost + Config.sparqlUpdateEndpoint,
                data: ({
                    update: deleteTurtleSparql
                })
            }).done(function (msg) {
                alert("Delete Applied: " + msg);
                callback();
            }).fail(function (jqXHR, textStatus) {
                alert("Error " + textStatus); // function( jqXHR, textStatus )
            });

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
                    'Accept': 'sparql-results+xml;charset=UTF-8'
                        //   'Accept-Charset': 'UTF-8' unsafe
                }
            }).done(function (xml) {
                var json = SparqlConnector.sparqlXMLtoJSON(xml);
                // console.log("JSON = "+JSON.stringify(json));
                callback(json);
                // $(window).trigger('resize');
            }).fail(function () {
                alert("error");
            });
        },

        sparqlXMLtoJSON: function (xml) {

            var xmlString = (new XMLSerializer()).serializeToString(xml);

            // workaround for wrong interpretation of charset
            xmlString = xmlString.replace(/[^\u0000-\u007F]/g, '');
            // maybe force to ISO-8859-1, also known as Latin-1 instead?

            var $xml = $(xmlString);
            // console.log(xmlString);
            var variables = $xml.find("variable");

            if (variables.length == 0) {
                return false;
            }
            var jsonVariables = [];

            variables.each(function () {
                jsonVariables.push($(this).attr("name"));
            });

            var results = $xml.find("result");

            if (results.length == 0) {
                return false;
            }
            var jsonResults = [];

            results.each(function () {
                var map = {};
                for (var i = 0; i < jsonVariables.length; i++) {
                    var name = jsonVariables[i];
                    // console.log("NAME=" + name);
                    $(this).find("binding[name='" + name + "']").each(
                        function () {
                            //  entry[name] = $(this).text().trim();
                            // console.log("entry[name]=" + entry[name]);$( "div span:first-child" )
                            map["type"] = $(this).children().prop(
                                    "tagName")
                                .toLowerCase();
                            map[name] = $(this).text().trim();
                        });
                }
                jsonResults.push(map);
            });

            //  console.log("RESULTS = "+JSON.stringify(jsonResults));
            return jsonResults;
        }
    }
    return SparqlConnector;
}());
