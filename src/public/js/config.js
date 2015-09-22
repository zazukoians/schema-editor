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
            endpointHost: "http://zazukoians.org:3030",
            queryPath: "/ontospace/sparql?query=",
            updatePath: "/ontospace/update",

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


        ///////////////////////////////////////

        /* *** Value Getters *** */
        getCurrentResource: function () {
            var currentResource = parseUri(window.location.href).queryKey.uri;
            if(currentResource && (currentResource != "")) {
                return currentResource;
            }
            var stored = Config.getFromLocalStorage("currentResource");
            return stored ? stored : Config.current.currentResource;
        },

        getGraphURI: function () {
            var graphURI = parseUri(window.location.href).queryKey.graph;
            if(graphURI && (graphURI != "")) {
                return graphURI;
            }
            var stored = Config.getFromLocalStorage("graphURI");
            return stored ? stored : Config.current.graphURI;
        },

        getEndpointHost: function () {
            var stored = Config.getFromLocalStorage("endpointHost");
            return stored ? stored : Config.current.endpointHost;
        },

        getQueryPath: function () {
            var stored = Config.getFromLocalStorage("queryPath");
            return stored ? stored : Config.current.queryPath;
        },

        getUpdatePath: function () {
            var stored = Config.getFromLocalStorage("updatePath");
            return stored ? stored : Config.current.updatePath;
        },

        /* common wrapper */
        getFromLocalStorage: function (setting) {
            if(('localStorage' in window) && window['localStorage'] !== null) {
                return localStorage.getItem("schema-edit.config." + setting);
            }
            return false;
        },

        /* *** Value Setters *** */
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

        setGraphURI: function (graphURI) {
            Config.current.graphURI = graphURI;
            Config.setToLocalStorage("graphURI", graphURI);
            var split = window.location.href.split("?");
            window.location.href = split[0] + "?graph=" + graphURI;
        },

        setEndpointHost: function (endpointHost) {
          console.log("setEndpointHost = "+endpointHost);
            Config.current.endpointHost = endpointHost;
            return Config.setToLocalStorage("endpointHost", endpointHost);
        },

        setQueryPath: function (queryPath) {
            Config.current.queryPath = queryPath;
            return Config.setToLocalStorage("queryPath", queryPath);
        },

        setUpdatePath: function (updatePath) {
            Config.current.updatePath = updatePath;
            return Config.setToLocalStorage("updatePath", updatePath);
        },

        /* common wrapper */
        setToLocalStorage: function (setting, value) {
            if(('localStorage' in window) && window['localStorage'] !== null) {
                localStorage.setItem("schema-edit.config." + setting, value);
                return true;
            }
            return false;
        }
    };
    return Config;
}());
