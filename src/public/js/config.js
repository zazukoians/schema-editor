/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */

var Config = (function () {
    "use strict";

    //http://sandbox.fusepool.info:8181/sparql/select
    // http://storedhost:3333
    // ttp://sandbox.fusepool.info:8181/sparql/update
    // This is the public interface of the Module.

    var Config = {
        current: { // effectively defaults
            sparqlServerHost: "http://zazukoians.org:3030",
            sparqlQueryEndpoint: "/ontospace/sparql?query=",
            sparqlUpdateEndpoint: "/ontospace/update"
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
