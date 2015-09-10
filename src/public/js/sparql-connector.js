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
            return queryString["graph"];
            // return Config.graphURI;
        },

        setGraphURI: function (graphURI) {
          console.log("setGraphURI graphURI="+graphURI);
            //var uri = queryString["uri"];
            //var split = window.location.href.split("?");
            Config.graphURI = graphURI;
          //  window.location.href = split[0] + "?uri=" + uri + "&graph=" + // //encodeURI(graphURI);
            return graphURI;
        },

        // API, based on spec
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

        getTurtleUrl: function (type, callback) {
            var resources = [];
            var getTurtleSparql = sparqlTemplater(constructGraph, {
                "graphURI": SparqlConnector.getGraphURI(),
            });

            var getTurtleUrl = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
                encodeURIComponent(getTurtleSparql) + "&output=text";

            return getTurtleUrl;
        },

        listClasses: function (callback) {
            return SparqlConnector.listResourcesOfType("rdfs:Class", callback);
        },

        listProperties: function (callback) {
            return SparqlConnector.listResourcesOfType("rdf:Property", callback);
        },

        /*
                listResourcesOfType: function (type, callback) { // TODO appears broken, duplicated below - is used?
                  alert("listResourcesOfType1: function (type, callback)");
                    var resources = [];
                    var getResourceListSparql = sparqlTemplater(
                        getResourcesOfTypeSparqlTemplate, {
                            "graphURI": SparqlConnector.getGraphURI(),
                            "type": type
                        });

                    var getResourcesUrl = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
                        encodeURIComponent(getResourceListSparql) + "&output=xml";

                    var json = SparqlConnector.getJsonForSparqlURL(getResourcesUrl,
                        callback);

                    return resources;
                },
        */
        listResources: function (callback) {
            var resources = [];
            var getResourceListSparql = sparqlTemplater(
                getResourceListSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI()
                });
            //  console.log("getResourceListSparql = \n" + getResourceListSparql);
            var getResourcesUrl = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
                encodeURIComponent(getResourceListSparql) + "&output=xml";

            var extractResources = function (json) {
                    var resources = [];
                    // console.log("listResources json =" + JSON.stringify(json, false, 4));
                    for(var i = 0; i < json.length; i++) {
                        var subject = json[i]["subject"];
                        resources.push(subject);
                        //    console.log("subject = " + subject);
                    }
                    callback(resources);
                }
                //  console.log("getClassesUrl = " + getResourcesUrl);
            SparqlConnector.getJsonForSparqlURL(getResourcesUrl, extractResources);
        },

        listResourcesOfType: function (type, callback) {
            // alert("listResourcesOfType2: function (type, callback)");
            var resources = [];
            var getResourceListSparql = sparqlTemplater(
                getResourcesOfTypeSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "type": type
                });
            // console.log("getResourceListSparql = \n" + getResourceListSparql);
            var getResourcesUrl = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
                encodeURIComponent(getResourceListSparql) + "&output=xml";

            //  console.log("getClassesUrl = " + getResourcesUrl);
            var json = SparqlConnector.getJsonForSparqlURL(getResourcesUrl, callback);
            //    console.log("json =" + json);
            //  return resources;
        },

        /* produces a list of graphs available in the store */
        listGraphs: function (callback) {
            var graphs = [];
            var makeList = function (json) {
                var graphURIs = [];
                for(var i = 0; i < json.length; i++) {
                    graphURIs.push(json[i]["graph"]);
                }
                //  console.log("graphs = \n"+JSON.stringify(graphURIs,false,4));
                callback(graphURIs);
            }
            var getGraphListUrl = Config.sparqlServerHost + Config.sparqlQueryEndpoint +
                encodeURIComponent(listGraphsSparqlTemplate) + "&output=xml";

            //  console.log("getClassesUrl = " + getResourcesUrl);
            SparqlConnector.getJsonForSparqlURL(getGraphListUrl, makeList);
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
            // console.log("uriNamespaceIndex = " + uriNamespaceIndex);

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

        createNewVocab: function (name, namespace, prefix, graph) {
          console.log("createNewVocab graph="+graph);
            SparqlConnector.setGraphURI(graph);
            // Config.graphURI = graph;
            var createVocabSparql = sparqlTemplater(
                createVocabSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "namespace": namespace,
                    "name": name
                });
            var callback = function (msg) {
                alert(msg);
            }
            SparqlConnector.postData(createVocabSparql, callback);

            var createDummyClassSparql = sparqlTemplater(
                createDummyClassSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "namespace": namespace
                });
            var callback = function (msg) {
                alert(msg);
                var dummy = "http://purl.org/stuff/hyperdata/Dummy";
                var split = window.location.href.split("?");

                // console.log("queryKey.uri = "+queryKey.uri);
                window.location.href = split[0] + "?uri=" + encodeURI(dummy) + "&graph=" + encodeURI(Config.graphURI);
            }
            SparqlConnector.postData(createDummyClassSparql, callback);
        },

        addClass: function (namespace, name, label, subClassOf, comment, callback) {
            var addClassSparql = sparqlTemplater(
                addClassSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "namespace": namespace,
                    "name": name,
                    "label": label,
                    "subClassOf": subClassOf,
                    "comment": comment
                });
             console.log("addClass SPARQL = \n"+addClassSparql);

            SparqlConnector.postData(addClassSparql, callback);
        },

        addProperty: function(namespace, name, label, domain, range, subPropertyOf, comment, callback) {
            var addPropertySparql = sparqlTemplater(
                addPropertySparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "namespace": namespace,
                    "name": name,
                    "label": label,
                    "domain": domain,
                    "range": range,
                    "subPropertyOf": subPropertyOf,
                    "comment": comment
                });
            console.log("addProperty SPARQL = \n" + addPropertySparql);

            SparqlConnector.postData(addPropertySparql, callback);
        },

        /* *** connector low-level utilities *** */
        // TODO is duplicated below, delete one
        postData: function (data, callback) {
            $.ajax({
                type: "POST",
                url: Config.sparqlServerHost + Config.sparqlUpdateEndpoint,
                data: ({
                    update: data
                })
            }).done(function (msg) {
                if(callback) {
                    callback(msg);
                }
            }).fail(function (jqXHR, textStatus,
                errorThrown) {
                alert("Error " + textStatus);
            });
        },

        updateLiteralTriple: function (subject, predicate, object, language, callback) {
            if(!language || language == "") { // sensible default
                language = "en";
            }
            var updateTripleSparql = sparqlTemplater(
                updateLiteralTripleSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "subject": subject,
                    "predicate": predicate,
                    "object": object,
                    "language": language
                });
            // console.log("updateLiteralTripleSparql = \n" + updateTripleSparql);

            //var updateTripleUrl = Config.sparqlServerHost + Config.sparqlUpdateEndpoint +
            //    encodeURIComponent(updateTripleSparql) + "&output=xml";
            // var json = SparqlConnector.getJsonForSparqlURL(updateTripleUrl, callback);
            SparqlConnector.postData(updateTripleSparql, callback);
            return false;
        },

        updateUriTriple: function (subject, predicate, object, language, callback) {
            if(!language || language == "") { // sensible default
                language = "en";
            }
            var updateTripleSparql = sparqlTemplater(
                updateUriTripleSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "subject": subject,
                    "predicate": predicate,
                    "object": object,
                    "language": language
                });
            // console.log("updateLiteralTripleSparql = \n" + updateTripleSparql);

            //var updateTripleUrl = Config.sparqlServerHost + Config.sparqlUpdateEndpoint +
            //    encodeURIComponent(updateTripleSparql) + "&output=xml";
            // var json = SparqlConnector.getJsonForSparqlURL(updateTripleUrl, callback);
            SparqlConnector.postData(updateTripleSparql, callback);
            return false;
        },

        deleteTurtle: function (turtle, callback) { // see http://www.w3.org/TR/sparql11-update/#deleteData
            // console.log("deleteTurtle turtle = " + turtle);
            var deleteTurtleSparql = sparqlTemplater(
                deleteTurtleSparqlTemplate, {
                    "graphURI": SparqlConnector.getGraphURI(),
                    "turtle": turtle
                });
            // console.log("deleteTurtleSparql = " + deleteTurtleSparql);

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
                  /*
                    'Accept': 'sparql-results+xml;charset=UTF-8'
                    */
                        //   'Accept-Charset': 'UTF-8' unsafe
                }
            }).done(function (xml) {
                var json = SparqlConnector.sparqlXMLtoJSON(xml);
                // console.log("JSON = "+JSON.stringify(json));
                callback(json);
                // $(window).trigger('resize');
            }).fail(function (msg) {
                alert("error " + msg);
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
