/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */

var Config = (function () {
    "use strict";

    // This is the public interface of the Module.
    var Config = {
        current: { // effectively defaults
            sparqlServerHost: "http://zazukoians.org:3030",
            sparqlQueryEndpoint: "/ontospace/sparql?query=",
            sparqlUpdateEndpoint: "/ontospace/update",

            currentResource: "",
            graphURI: ""
        },
        // publicFunction can be called externally

        //  graphURI: "http://data.admin.ch/def/hgv/",

        /*
                sparqlServerHost: "http://sandbox.fusepool.info:8181",
                sparqlQueryEndpoint: "/sparql/select?query=",
                sparqlUpdateEndpoint: "/sparql/update",
                sparqlUploadEndpoint: "/sparql/upload"
        */

        /*
                sparqlServerHost: "http://storedhost:3333",
                sparqlQueryEndpoint: "/schema-edit/sparql?query=",
                sparqlUpdateEndpoint: "/schema-edit/update"
        */

        //  sparqlServerHost: "http://zazukoians.org:3030",
        //  sparqlQueryEndpoint: "/ontospace/sparql?query=",
        //  sparqlUpdateEndpoint: "/ontospace/update",

        setCurrentResource: function (currentResource) {
            Config.current.currentResource = currentResource;
            Config.setToLocalStorage("currentResource", currentResource);
            var graph = parseUri(window.location.href).queryKey.graph;
            var split = window.location.href.split("?");
            var newUrl = split[0] + "?uri=" + resource;
            if(graph && (graph != "")) {
                newUrl = newUrl + "&graph=" + graph;
            }
            window.location.href = newUrl;
        },

        getCurrentResource: function () {
          var currentResource = parseUri(window.location.href).queryKey.uri;
          if(currentResource && (currentResource != "")){
            return currentResource;
          }
          var stored = Config.getFromLocalStorage("currentResource");
          return stored ? stored : Config.current.currentResource;
        },

        getGraphURI: function () {
          var graphURI = parseUri(window.location.href).queryKey.graph;
          if(graphURI && (graphURI != "")){
            return graphURI;
          }
          var stored = Config.getFromLocalStorage("graphURI");
          return stored ? stored : Config.current.graphURI;
        },

        setGraphURI: function (graphURI) {
          Config.current.graphURI = graphURI;
        Config.setToLocalStorage("graphURI", graphURI);
            var split = window.location.href.split("?");
            window.location.href = split[0] + "?graph=" + graphURI;
        },
        ///////////////////////////////////////

        getSparqlServerHost: function () {
            var stored = Config.getFromLocalStorage("sparqlServerHost");
            return stored ? stored : Config.current.sparqlServerHost;
        },

        getSparqlQueryEndpoint: function () {
            var stored = Config.getFromLocalStorage("sparqlQueryEndpoint");
            return stored ? stored : Config.current.sparqlQueryEndpoint;
        },

        getSparqlUpdateEndpoint: function () {
            var stored = Config.getFromLocalStorage("sparqlUpdateEndpoint");
            return stored ? stored : Config.current.sparqlUpdateEndpoint;
        },

        /* common wrapper */
        getFromLocalStorage: function (setting) {
            if(('storedStorage' in window) && window['storedStorage'] !== null) {
                return storedStorage.getItem("schema-edit.config." + setting);
            }
            return false;
        },

        setSparqlServerHost: function (sparqlServerHost) {
            Config.current.sparqlServerHost = sparqlServerHost;
            return Config.setToLocalStorage("sparqlServerHost", sparqlServerHost);
        },

        setSparqlQueryEndpoint: function (sparqlQueryEndpoint) {
            Config.current.sparqlQueryEndpoint = sparqlQueryEndpoint;
            return Config.setToLocalStorage("sparqlQueryEndpoint", sparqlQueryEndpoint);
        },

        setSparqlUpdateEndpoint: function (sparqlQueryEndpoint) {
            Config.current.sparqlQueryEndpoint = sparqlQueryEndpoint;
            return Config.setToLocalStorage("sparqlQueryEndpoint", sparqlQueryEndpoint);
        },

        /* common wrapper */
        setToLocalStorage: function (setting, value) {
            if(('storedStorage' in window) && window['storedStorage'] !== null) {
                storedStorage.setItem("schema-edit.config." + setting, value);
                return true;
            }
            return false;
        }
    };
    return Config;
}());
