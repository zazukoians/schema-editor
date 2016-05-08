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
            queryEndpoint: "http://localhost:3030/schema-edit/sparql",
            updateEndpoint: "http://localhost:3030/schema-edit/update",

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

                http://sandbox.fusepool.info:8181/sparql/select
                http://sandbox.fusepool.info:8181/sparql/update
        */

        setGraphURI: function (graphURI, reload) {
        //    console.log("setGraphURI graphURI = " + graphURI);
            graphURI = SEUtils.encodeHash(graphURI);
            // Config.setToLocalStorage("graphURI", graphURI);

            if(reload) {
                var href = getBase(window.location.href) + "?graph=" + graphURI;
          //      console.log("href = " + href);
                window.location.href = href;
            }
        },

        getGraphURI: function () {
            var graphURI = SEUtils.parameterFromLocation("graph");
      //      console.log("getGraphURI = " + graphURI);
            if(!graphURI) return "";
            if(!graphURI.endsWith("/") && !graphURI.endsWith("#")) {
                graphURI = graphURI + "#";
            }
            //  console.log("before " + graphURI);
            // graphURI = SEUtils.decodeHash(graphURI);
            //  console.log("after " + graphURI);
            return graphURI;
            //  var stored = Config.getFromLocalStorage("graphURI");
            //  return stored ? stored : Config.current.graphURI;
            // console.log("graphURI = " + graphURI);

        },

        setCurrentResource: function (uri, graph) {
            // Config.current.currentResource = currentResource;
            // Config.setToLocalStorage("currentResource", currentResource);

            uri = SEUtils.encodeHash(uri);
        //    console.log("setCurrentResource uri = "+uri);
            if(!graph) {
                graph = SEUtils.parameterFromLocation("graph");
            }
            graph = SEUtils.encodeHash(graph);
            window.location.href = getBase(window.location.href) + "?uri=" + uri + "&graph=" + graph;
        },

        getCurrentResource: function () {
            //  var currentResource = parseUri(window.location.href).queryKey.uri;
            var uri = SEUtils.parameterFromLocation("uri");
            if(!uri) {
                return Config.getGraphURI();
            }
            return SEUtils.decodeHash(uri);
        },

        getQueryEndpoint: function () {
            var stored = Config.getFromLocalStorage("queryEndpoint");
            return stored ? stored : Config.current.queryEndpoint;
        },

        getUpdateEndpoint: function () {
            var stored = Config.getFromLocalStorage("updateEndpoint");
            return stored ? stored : Config.current.updateEndpoint;
        },

        /* common wrapper */
        getFromLocalStorage: function (setting) {
            if(('localStorage' in window) && window['localStorage'] !== null) {
                return localStorage.getItem("schema-edit.config." + setting);
            }
            return false;
        },




        setQueryEndpoint: function (queryEndpoint) {
            // console.log("setqueryEndpoint = " + queryEndpoint);
            Config.current.queryEndpoint = queryEndpoint;
            return Config.setToLocalStorage("queryEndpoint", queryEndpoint);
        },

        setUpdateEndpoint: function (updateEndpoint) {
            // console.log("setupdateEndpoint = " + updateEndpoint);
            Config.current.updateEndpoint = updateEndpoint;
            return Config.setToLocalStorage("updateEndpoint", updateEndpoint);
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
