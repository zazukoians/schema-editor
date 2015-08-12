var SchemaEdit = (function () {
    "use strict";

    // modify for SchemaEdit
    var config = {

        pagesBaseURI: "http://hyperdata.it/wiki/",
        graphURI: "http://schema.org/terms/",

        sparqlServerHost: "http://localhost:3333",
        serverRootPath: "/schema-edit/",
        sparqlQueryEndpoint: "/schema-edit/sparql?query=", // move ? part ??
        sparqlUpdateEndpoint: "/schema-edit/update"
    };


    // This is the public interface of the SchemaEditor module.
    var SchemaEdit = {

        getGraphURI: function () {
            return config.graphURI;
        },

        setGraphURI: function (uri) {
            config.graphURI = uri;
            return config.graphURI;
        },
        // API, based on spec
        // initial implementations based on foowiki Ajax - with templating

        setQueryEndpoint: function (url) {
            config.sparqlQueryEndpoint = url;
            return getQueryEndpoint();
        },

        getQueryEndpoint: function () {
            return config.sparqlQueryEndpoint
        },

        setUpdateEndpoint: function (url) {
            return getUpdateEndpoint();
        },

        getUpdateEndpoint: function () {
            return config.sparqlUpdateEndpoint
        },

        setEndpoint: function (graphURI) {
            return graphURI;
        },

        listResourcesOfType: function (type, callback) {
            var resources = [];
            var getResourceListSparql = sparqlTemplater(getResourcesOfTypeSparqlTemplate, {
                "graphURI": SchemaEdit.getGraphURI(),
                "type": type
            });
            var getResourcesUrl = config.sparqlServerHost + config.sparqlQueryEndpoint + encodeURIComponent(getResourceListSparql) + "&output=xml";

            // getClassListSparqlTemplate
            console.log("getClassesUrl = " + getResourcesUrl);
            var json = getJsonForSparqlURL(getResourcesUrl, callback); // is in sparql-connector.js
            console.log("json =" + json);
            return resources;
        },
        

        listClasses: function (callback) {
            return SchemaEdit.listResourcesOfType("rdfs:Class", callback);
        },

        listProperties: function (callback) {
            return SchemaEdit.listResourcesOfType("rdf:Property", callback);
        },

        listPropertiesForClass: function (graphURI, classURI) {
            var properties = [];
            return properties;
        },

        listClassesForProperty: function (graphURI, propertyURI) {
            var classes = [];
            return classes;
        },



        /*
         * naive ntriples-based CONSTRUCT logging/diff for now sparqlLog.add
         * sparqlLog.takeSnapshot sparqlLog.diff(snapshotBefore, snapshotAfter)
         */

    };

    // privateFunction is completely hidden
    // from the outside.
    function privateFunction() {
        return "privateFunction cannot";
    }

    return SchemaEdit;
}());