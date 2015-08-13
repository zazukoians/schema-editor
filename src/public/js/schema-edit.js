// TODO move into module below

/* see http://www.w3.org/TR/sparql11-update/ */

var SchemaEdit = (function () {
    "use strict";

    var config = {

        pagesBaseURI: "http://hyperdata.it/wiki/",
        graphURI: "http://schema.org/terms/",

        sparqlServerHost: "http://localhost:3333",
        serverRootPath: "/schema-edit/",
        sparqlQueryEndpoint: "/schema-edit/sparql?query=", // move ? part ??
        sparqlUpdateEndpoint: "/schema-edit/update"
    };

    var currentResource;

    // This is the public interface of the SchemaEditor module.
    var SchemaEdit = {
        setCurrentResource: function (uri) {
            currentResource = uri;
        },

        getCurrentResource: function () {
            return currentResource;
        },

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
            //  console.log("getClassesUrl = " + getResourcesUrl);
            var json = getJsonForSparqlURL(getResourcesUrl, callback); // is in sparql-connector.js
            //    console.log("json =" + json);
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

        setupButtons: function () {
            // DELETE buttons on schema-edit main page
                        $(".delete").click(function () {
               
            });
            
            // EXPORT TURTLE buttons on schema-edit main page 
            $("#turtle").click(function () {
                var query = "CONSTRUCT {?s ?p ?o } WHERE {?s ?p ?o}";
                var turtleURL = config.sparqlServerHost + config.sparqlQueryEndpoint + encodeURIComponent(query) + "&output=text";
                location.href = turtleURL;
            });

            $("#newPageButton").click(function () {
                var newPageName = $("#newPageName").val();

                window.location.href = window.location.href = config.serverRootPath + "edit.html?uri=" + config.graphURI + "/" + newPageName;
            });

            // OLD
            $("#upload-button").click(function () {
                var data = new FormData($("#upload-file").val());
                // console.log("DATA = " + data);
                $.ajax({
                    url: config.sparqlUpdateEndpoint,
                    type: 'POST',
                    data: ({
                        update: data
                    }),
                    //    contentType: "application/sparql-update",
                    processData: false,
                    contentType: false
                });
                //    e.preventDefault();
            });
        },

        getResource: function (uri, callback) {
            //  console.log("getresource " + uri);
            // var type = queryString["type"];
            // console.log("TYPE=" + type);

            var map = {
                graphURI: SchemaEdit.getGraphURI(),
                uri: uri
            };

            var getResourceUrl = SchemaEdit.generateGetUrl(getResourceSparqlTemplate, map);

            //  console.log("getResourceUrl = " + getResourceUrl);
            getJsonForSparqlURL(getResourceUrl, callback);
            // getDataForURL(handleEntry, getPageUrl);
        },

        generateGetUrl: function (sparqlTemplate, map) {
            var sparql = sparqlTemplater(sparqlTemplate, map);
            return config.sparqlServerHost + config.sparqlQueryEndpoint + encodeURIComponent(sparql);
        },

        deleteResource: function (resourceURI) {
            var map = {
                "graphURI": SchemaEdit.getGraphURI(),
                "resourceURI": resourceURI
            };
            var sparql = sparqlTemplater(deleteResourceSparqlTemplate, map);
            console.log("SPARQL for delete = " + sparql);
            postData(sparql);


        }


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