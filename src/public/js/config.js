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
          /*
            endpointHost: "http://localhost:3333",
            queryPath: "/schema-edit/sparql",
            updatePath: "/schema-edit/update",
*/
            queryEndpoint: "http://localhost:3333/schema-edit/sparql",
            updateEndpoint: "http://localhost:3333/schema-edit/update",

            currentResource: "",
            graphURI: ""
        },
        /*
        http://zazukoians.org:3030/ontospace/sparql
        http://zazukoians.org:3030/ontospace/update
        endpointHost: "http://zazukoians.org:3030",
        queryPath: "/ontospace/sparql",
        updatePath: "/ontospace/update",
        */

        /*
                sparqlServerHost: "http://sandbox.fusepool.info:8181",
                sparqlQueryEndpoint: "/sparql/select",
                sparqlUpdateEndpoint: "/sparql/update",
                sparqlUploadEndpoint: "/sparql/upload"
        */


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

        getQueryEndpoint: function () {
            var stored = Config.getFromLocalStorage("queryEndpoint");
            return stored ? stored : Config.current.queryEndpoint;
        },

        getUpdateEndpoint: function () {
            var stored = Config.getFromLocalStorage("updateEndpoint");
            return stored ? stored : Config.current.updateEndpoint;
        },

        /*
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
*/
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
            var newUrl = split[0] + "?uri=" + currentResource;
            if(graph && (graph != "")) {
                newUrl = newUrl + "&graph=" + graph;
            }
            window.location.href = newUrl;
        },

        setGraphURI: function (graphURI) {
            Config.current.graphURI = graphURI;
            Config.setToLocalStorage("graphURI", graphURI);
            // TODO move this =>
        //    var split = window.location.href.split("?");
        //    window.location.href = split[0] + "?graph=" + graphURI;
        },

        setQueryEndpoint: function (queryEndpoint) {
            console.log("setqueryEndpoint = " + queryEndpoint);
            Config.current.queryEndpoint = queryEndpoint;
            return Config.setToLocalStorage("queryEndpoint", queryEndpoint);
        },

        setUpdateEndpoint: function (updateEndpoint) {
            console.log("setupdateEndpoint = " + updateEndpoint);
            Config.current.updateEndpoint = updateEndpoint;
            return Config.setToLocalStorage("updateEndpoint", updateEndpoint);
        },

        /*
        setEndpointHost: function (endpointHost) {
            console.log("setEndpointHost = " + endpointHost);
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

        */

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
